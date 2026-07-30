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
import { submitCaregiverVisitAction } from "@/app/aidant/actions";

type VisitData = {
  transmissionId: string;
  patientName: string;
  autonomyLevel: string;
  nextStep: string | null;
  instructions: string;
  instructionSteps: string[];
  aEssayer: string[];
  aEviter: string[];
};

export function ModeVisiteClient({ data }: { data: VisitData }) {
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
          <p className="text-sm text-text-muted">
            Un retour facultatif pourra vous être proposé plus tard. Aucune
            obligation.
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
            <p className="mt-4 text-sm font-semibold text-teal-dark">
              En pratique, concrètement :
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
            <p className="mt-4 rounded-xl bg-teal/10 p-3 text-sm font-medium text-teal-dark">
              {getMicrocopy("notDoingForThem")}
            </p>
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
              [
                "realise_succes",
                "essaye",
                "doute",
                "aide",
              ] as const
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
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="touch-target text-center text-sm text-teal"
          >
            Revoir depuis le début
          </button>
        )}
      </main>
    </div>
  );
}
