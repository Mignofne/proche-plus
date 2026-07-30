"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  AUTONOMY_LABELS,
  CAREGIVER_ACTION_LABELS,
  VISIT_MODE_STEPS,
} from "@/lib/constants";
import { getMicrocopy } from "@/lib/microcopy";
import {
  submitCaregiverVisitAction,
  submitExerciseOutcome,
} from "@/app/aidant/actions";

type ThemeOption = {
  id: string;
  label: string;
  icon: string | null;
};

type ExerciseView = {
  patientExerciseId: string;
  name: string;
  objective: string;
  steps: string[];
  caregiverCan: string[];
  caregiverMustNot: string[];
  estimatedDuration: string | null;
  themeLabel: string;
  levelLabel: string;
  tier: number;
};

type LegacyVisitData = {
  mode: "legacy";
  transmissionId: string;
  patientName: string;
  autonomyLevel: string;
  nextStep: string | null;
  instructions: string;
  instructionSteps: string[];
  aEssayer: string[];
  aEviter: string[];
};

type ExerciseVisitData = {
  mode: "exercise";
  transmissionId: string | null;
  patientName: string;
  autonomyLevel: string;
  themes: ThemeOption[];
  exercisesByTheme: Record<string, ExerciseView | null>;
};

export type VisitClientData = LegacyVisitData | ExerciseVisitData;

export function ModeVisiteClient({ data }: { data: VisitClientData }) {
  if (data.mode === "exercise") {
    return <ExerciseModeVisite data={data} />;
  }
  return <LegacyModeVisite data={data} />;
}

function ExerciseModeVisite({ data }: { data: ExerciseVisitData }) {
  const router = useRouter();
  const [themeId, setThemeId] = useState<string | null>(
    data.themes.length === 1 ? data.themes[0].id : null
  );
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const exercise = themeId ? data.exercisesByTheme[themeId] : null;

  function record(outcome: "reussi" | "essai" | "echec") {
    if (!exercise) return;
    startTransition(async () => {
      const result = await submitExerciseOutcome({
        patientExerciseId: exercise.patientExerciseId,
        outcome,
        note: note.trim() || undefined,
        transmissionId: data.transmissionId,
      });
      setDone(result.message);
    });
  }

  if (done) {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Visite terminée" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="celebrate" />
          <p className="text-lg font-medium">{done}</p>
          <Button onClick={() => router.push("/aidant")} fullWidth>
            Retour à l&apos;accueil
          </Button>
        </main>
      </div>
    );
  }

  if (!themeId) {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
        <AppHeader title="Mode visite" backHref="/aidant" />
        <main className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3">
            <Mascot pose="welcome" size="sm" />
            <div>
              <h2 className="text-lg font-bold">Que souhaitez-vous travailler ?</h2>
              <p className="text-sm text-text-muted">
                Pour {data.patientName} · {AUTONOMY_LABELS[data.autonomyLevel]}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {data.themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id)}
                className="flex items-center gap-3 rounded-2xl border border-cream-dark bg-white p-4 text-left transition-colors hover:border-teal hover:bg-teal/5"
              >
                <span className="text-2xl" aria-hidden>
                  {t.icon ?? "•"}
                </span>
                <span className="text-lg font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
        <AppHeader title="Mode visite" backHref="/aidant" />
        <main className="flex flex-col gap-4 p-4">
          <Card>
            <SectionTitle>Pas d&apos;exercice activé</SectionTitle>
            <p className="mt-3 leading-relaxed">
              Aucun exercice n&apos;a été activé pour ce thème par
              l&apos;équipe. Parlez-en lors de la prochaine visite — plutôt
              qu&apos;improviser un geste non validé.
            </p>
          </Card>
          <Button variant="ghost" onClick={() => setThemeId(null)} fullWidth>
            ← Choisir un autre thème
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <button
          type="button"
          onClick={() => setThemeId(null)}
          className="text-left text-sm text-teal"
        >
          ← Changer de thème
        </button>

        <div className="flex items-center gap-3">
          <Mascot pose="encourage" size="sm" />
          <div>
            <p className="text-sm text-teal font-medium">
              {exercise.themeLabel} · Niveau {exercise.levelLabel} · Palier{" "}
              {exercise.tier}
            </p>
            <h2 className="text-xl font-bold leading-snug">{exercise.name}</h2>
          </div>
        </div>

        <Card>
          <SectionTitle>Objectif</SectionTitle>
          <p className="mt-2 text-lg leading-snug">{exercise.objective}</p>
          {exercise.estimatedDuration && (
            <p className="mt-3 text-sm text-text-muted">
              Durée indicative : {exercise.estimatedDuration}
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle>Étapes / guidance verbale</SectionTitle>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed">
            {exercise.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </Card>

        <Card>
          <SectionTitle>Ce que vous pouvez faire</SectionTitle>
          <ul className="mt-3 list-inside list-disc space-y-2">
            {exercise.caregiverCan.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        <Card className="border-terracotta/30">
          <SectionTitle>Ce que vous ne devez pas faire</SectionTitle>
          <ul className="mt-3 list-inside list-disc space-y-2">
            {exercise.caregiverMustNot.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        <SectionTitle>Comment ça s&apos;est passé ?</SectionTitle>
        <div className="flex flex-col gap-3">
          <Button onClick={() => record("reussi")} disabled={pending} fullWidth>
            Réussi
          </Button>
          <Button
            variant="secondary"
            onClick={() => record("essai")}
            disabled={pending}
            fullWidth
          >
            Essai, avec difficulté
          </Button>
          <Button
            variant="danger"
            onClick={() => record("echec")}
            disabled={pending}
            fullWidth
          >
            Échec
          </Button>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Précision facultative…"
            className="min-h-24 rounded-xl border border-cream-dark bg-white p-4"
          />
        </div>
      </main>
    </div>
  );
}

function LegacyModeVisite({ data }: { data: LegacyVisitData }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const current = VISIT_MODE_STEPS[step];
  const isLast = step === VISIT_MODE_STEPS.length - 1;

  function record(
    type: "realise_succes" | "essaye" | "doute" | "aide" | "note"
  ) {
    startTransition(async () => {
      await submitCaregiverVisitAction({
        transmissionId: data.transmissionId,
        type,
        stepLabel: current.title,
        note: type === "note" || type === "doute" ? note : undefined,
      });
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Visite terminée" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="celebrate" />
          <p className="text-lg font-medium">
            C&apos;est noté — le professionnel en sera informé.
          </p>
          <Button onClick={() => router.push("/aidant")} fullWidth>
            Retour à l&apos;accueil
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/aidant/feedback")}
            fullWidth
          >
            Donner mon retour maintenant
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <div
          className="flex gap-2"
          aria-label={`Étape ${step + 1} sur ${VISIT_MODE_STEPS.length}`}
        >
          {VISIT_MODE_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              disabled={i > step}
              onClick={() => i <= step && setStep(i)}
              className={`h-3 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-teal" : "bg-cream-dark"
              } ${i < step ? "cursor-pointer hover:bg-teal-dark" : ""}`}
              aria-label={
                i <= step
                  ? `Revenir à l'étape ${i + 1} : ${s.title}`
                  : `Étape ${i + 1} non encore atteinte`
              }
            />
          ))}
        </div>
        <p className="text-sm text-teal font-medium">
          Étape {step + 1} sur {VISIT_MODE_STEPS.length} — {current.title}
        </p>

        <div className="flex items-center gap-3">
          <Mascot pose={step < 3 ? "patience" : "encourage"} size="sm" />
          <p className="text-sm italic text-text-muted">
            {getMicrocopy("takeYourTime")}
          </p>
        </div>

        {current.id === "objectif" && (
          <Card>
            <SectionTitle>Objectif du jour</SectionTitle>
            <p className="mt-2 text-lg font-semibold leading-snug">
              {data.nextStep ?? "Participer à la réadaptation"}
            </p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed">
              {data.instructionSteps.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-text-muted">
              Pour {data.patientName} · {AUTONOMY_LABELS[data.autonomyLevel]}
            </p>
          </Card>
        )}

        {current.id === "faire" && (
          <Card>
            <SectionTitle>Ce que je peux faire</SectionTitle>
            <ul className="mt-3 list-inside list-disc space-y-2">
              {(data.aEssayer.length
                ? data.aEssayer
                : [data.instructions]
              ).map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </Card>
        )}

        {current.id === "eviter" && (
          <Card className="border-terracotta/30">
            <SectionTitle>Ce que je ne dois pas faire</SectionTitle>
            <ul className="mt-3 list-inside list-disc space-y-2">
              {(data.aEviter.length
                ? data.aEviter
                : ["Réaliser un transfert sans supervision"]
              ).map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </Card>
        )}

        {current.id === "agir" && (
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium">{current.hint}</p>
            {(
              ["realise_succes", "essaye", "doute", "aide"] as const
            ).map((type) => (
              <Button
                key={type}
                variant={type === "realise_succes" ? "primary" : "ghost"}
                onClick={() => record(type)}
                disabled={pending}
                fullWidth
              >
                {CAREGIVER_ACTION_LABELS[type]}
              </Button>
            ))}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note libre (optionnel)…"
              className="min-h-24 rounded-xl border border-cream-dark bg-white p-4"
            />
            <Button
              variant="secondary"
              onClick={() => record("note")}
              disabled={pending || !note.trim()}
              fullWidth
            >
              {CAREGIVER_ACTION_LABELS.note}
            </Button>
          </div>
        )}

        {!isLast && (
          <Button onClick={() => setStep((s) => s + 1)} fullWidth size="lg">
            Suivant
          </Button>
        )}
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} fullWidth>
            ← Revoir l&apos;étape précédente
          </Button>
        )}
      </main>
    </div>
  );
}
