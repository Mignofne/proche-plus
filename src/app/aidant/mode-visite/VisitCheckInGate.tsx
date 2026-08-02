"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { AppHeader } from "@/components/layout/AppHeader";
import { submitVisitCheckIn } from "@/app/aidant/actions";
import {
  VISIT_CHECKIN_LEVELS,
  type VisitCheckInScore,
} from "@/lib/visit-checkin";
import { ChangeProcheLink } from "./ChangeProcheLink";
import { VisitSessionProvider } from "./VisitSessionContext";

function LevelPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: VisitCheckInScore | null;
  onChange: (v: VisitCheckInScore) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-base font-semibold text-text">{label}</legend>
      <div className="flex flex-col gap-2">
        {VISIT_CHECKIN_LEVELS.map((level) => {
          const selected = value === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-base font-medium transition-colors ${
                selected
                  ? "border-teal bg-teal/10 text-teal-dark"
                  : "border-cream-dark bg-white hover:border-teal/40"
              }`}
            >
              {level.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function VisitCheckInGate({
  patientId,
  patientName,
  transmissionId,
  canChangeProche,
  children,
}: {
  patientId: string;
  patientName: string;
  transmissionId?: string | null;
  canChangeProche?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [fatigue, setFatigue] = useState<VisitCheckInScore | null>(null);
  const [pain, setPain] = useState<VisitCheckInScore | null>(null);
  const [phase, setPhase] = useState<"form" | "blocked" | "ok">("form");
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function confirm() {
    if (fatigue === null || pain === null) {
      setError("Indiquez la fatigue et la douleur de votre proche.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const result = await submitVisitCheckIn({
          patientId,
          fatigueScore: fatigue,
          painScore: pain,
          transmissionId,
        });
        setCheckInId(result.checkInId);
        setPhase(result.blocked ? "blocked" : "ok");
      } catch {
        setError(
          "Impossible d'enregistrer le check-in. Vérifiez la connexion et réessayez."
        );
      }
    });
  }

  if (phase === "ok") {
    return (
      <VisitSessionProvider checkInId={checkInId}>{children}</VisitSessionProvider>
    );
  }

  if (phase === "blocked") {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Mode visite" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="patience" />
          <div>
            <h2 className="text-xl font-bold leading-snug">
              À bientôt pour la prochaine visite
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-muted">
              Votre proche a besoin de repos aujourd&apos;hui. Les exercices
              attendront — vous avez bien fait de le signaler.
            </p>
          </div>
          <Button onClick={() => router.push("/aidant")} fullWidth>
            Retour à l&apos;accueil
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/aidant/visites")}
            fullWidth
          >
            Mes dernières visites
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-5 p-4">
        {canChangeProche && <ChangeProcheLink />}
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <div>
            <h2 className="text-lg font-bold leading-snug">
              Comment se sent {patientName.split(" ")[0]} aujourd&apos;hui&nbsp;?
            </h2>
            <p className="text-sm text-text-muted">
              Avant les exercices, indiquez fatigue et douleur.
            </p>
          </div>
        </div>

        <LevelPicker
          label="Fatigue"
          value={fatigue}
          onChange={setFatigue}
        />
        <LevelPicker label="Douleur" value={pain} onChange={setPain} />

        {error && (
          <p className="text-sm font-medium text-terracotta" role="alert">
            {error}
          </p>
        )}

        <Button
          onClick={confirm}
          disabled={pending || fatigue === null || pain === null}
          fullWidth
          size="lg"
        >
          {pending ? "Enregistrement…" : "Continuer"}
        </Button>
      </main>
    </div>
  );
}
