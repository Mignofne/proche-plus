"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { PATIENT_PROFILES } from "@/lib/patient-profiles";
import { confirmAutonomyAlert, adjustAutonomyAlert } from "@/app/pro/actions";
import type { AutonomyLevel } from "@prisma/client";

export type ProAutonomyAlertItem = {
  id: string;
  type: string;
  message: string;
  proposedLevel: AutonomyLevel | null;
  patientId: string;
  patientName: string;
  currentLevel: AutonomyLevel;
};

export function ProAutonomyAlerts({ alerts }: { alerts: ProAutonomyAlertItem[] }) {
  const router = useRouter();
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustLevel, setAdjustLevel] = useState<AutonomyLevel | "">("");
  const [pending, startTransition] = useTransition();

  if (!alerts.length) return null;

  return (
    <section className="mb-8">
      <SectionTitle>Profils d&apos;autonomie à confirmer</SectionTitle>
      <div className="mt-3 flex flex-col gap-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-sun/40 bg-sun/10">
            <p className="text-xs font-semibold uppercase text-terracotta">
              {alert.type === "profil_a_confirmer"
                ? "Déclaration famille"
                : alert.type === "proposition_upgrade"
                  ? "Signal succès"
                  : "Signal difficulté"}
            </p>
            <p className="mt-1 font-medium">{alert.message}</p>
            <p className="mt-1 text-sm text-text-muted">
              Niveau actuel :{" "}
              {PATIENT_PROFILES.find((p) => p.id === alert.currentLevel)?.label}
              {alert.proposedLevel
                ? ` · Proposition : ${
                    PATIENT_PROFILES.find((p) => p.id === alert.proposedLevel)
                      ?.label
                  }`
                : ""}
            </p>

            {adjustingId === alert.id ? (
              <div className="mt-3 flex flex-col gap-2">
                <select
                  value={adjustLevel}
                  onChange={(e) =>
                    setAdjustLevel(e.target.value as AutonomyLevel)
                  }
                  className="rounded-xl border border-cream-dark bg-white px-4 py-3"
                >
                  <option value="">Choisir un niveau</option>
                  {PATIENT_PROFILES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={pending || !adjustLevel}
                    onClick={() =>
                      startTransition(async () => {
                        await adjustAutonomyAlert(
                          alert.id,
                          adjustLevel as AutonomyLevel
                        );
                        setAdjustingId(null);
                        router.refresh();
                      })
                    }
                  >
                    Valider l&apos;ajustement
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAdjustingId(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await confirmAutonomyAlert(alert.id);
                      router.refresh();
                    })
                  }
                >
                  Confirmer
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => {
                    setAdjustingId(alert.id);
                    setAdjustLevel(
                      alert.proposedLevel ?? alert.currentLevel
                    );
                  }}
                >
                  Ajuster
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
