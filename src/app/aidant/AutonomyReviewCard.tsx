"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AutonomyLevelPicker } from "@/components/aidant/AutonomyLevelPicker";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  answerAutonomyReviewPrompt,
  declarePatientAutonomy,
} from "@/app/aidant/actions";
import type { AutonomyLevel } from "@prisma/client";

type Props = {
  patientId: string;
  patientFirstName: string;
};

export function AutonomyReviewCard({ patientId, patientFirstName }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"ask" | "picker">("ask");
  const [level, setLevel] = useState<AutonomyLevel | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onNoChange() {
    startTransition(async () => {
      await answerAutonomyReviewPrompt({ patientId, changed: false });
      router.refresh();
    });
  }

  function onYesChange() {
    startTransition(async () => {
      const res = await answerAutonomyReviewPrompt({
        patientId,
        changed: true,
      });
      if (res.needsPicker) setPhase("picker");
    });
  }

  function submitLevel() {
    if (!level) {
      setError("Choisissez une situation.");
      return;
    }
    setError("");
    startTransition(async () => {
      await declarePatientAutonomy({
        patientId,
        autonomyLevel: level,
        historySource: "rappel_periodique",
      });
      router.refresh();
    });
  }

  if (phase === "picker") {
    return (
      <Card className="border-teal/30 bg-teal/5">
        <div className="mb-3 flex items-center gap-3">
          <Mascot pose="patience" size="sm" />
          <SectionTitle>Mettre à jour le profil</SectionTitle>
        </div>
        <AutonomyLevelPicker
          value={level}
          onChange={setLevel}
          patientFirstName={patientFirstName}
        />
        {error && (
          <p className="mt-3 text-sm text-terracotta">{error}</p>
        )}
        <Button
          className="mt-4"
          onClick={submitLevel}
          disabled={pending || !level}
          fullWidth
        >
          {pending ? "Enregistrement…" : "Enregistrer (provisoire)"}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-sun/40 bg-sun/10">
      <div className="flex items-start gap-3">
        <Mascot pose="vigilance" size="sm" />
        <div className="flex-1">
          <SectionTitle>
            Est-ce que la situation de {patientFirstName} a changé récemment ?
          </SectionTitle>
          <p className="mt-2 text-sm text-text-muted">
            Contrôle périodique pour adapter les consignes en sécurité.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={onYesChange} disabled={pending} fullWidth>
              Oui, ça a changé
            </Button>
            <Button
              variant="ghost"
              onClick={onNoChange}
              disabled={pending}
              fullWidth
            >
              Non, inchangé
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
