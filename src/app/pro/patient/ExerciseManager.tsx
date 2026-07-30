"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  activatePatientExercise,
  treatExerciseAlert,
} from "@/app/pro/actions";

type ExerciseOption = {
  id: string;
  name: string;
  themeLabel: string;
  levelCode: string;
  tier: number;
};

type CurrentExercise = {
  id: string;
  exerciseId: string;
  name: string;
  themeLabel: string;
  levelCode: string;
  tier: number;
  status: string;
};

type AlertItem = {
  id: string;
  message: string;
  type: string;
  nextExerciseId: string | null;
  createdAt: string;
};

export function ExerciseManager({
  patientId,
  catalog,
  current,
  alerts,
}: {
  patientId: string;
  catalog: ExerciseOption[];
  current: CurrentExercise[];
  alerts: AlertItem[];
}) {
  const [exerciseId, setExerciseId] = useState(catalog[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function activate() {
    if (!exerciseId) return;
    setError("");
    startTransition(async () => {
      try {
        await activatePatientExercise(patientId, exerciseId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function treat(alertId: string, activateNext: boolean) {
    startTransition(async () => {
      try {
        await treatExerciseAlert(alertId, patientId, activateNext);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="mb-6 space-y-4">
      <Card>
        <SectionTitle>Exercices activés (aidant)</SectionTitle>
        {current.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Aucun exercice activé — l&apos;aidant ne verra que la transmission
            classique.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {current.map((c) => (
              <li key={c.id} className="rounded-xl bg-teal/5 p-3 text-sm">
                <strong>
                  {c.themeLabel} · {c.levelCode}/{c.tier}
                </strong>
                <br />
                {c.name}
                <span className="ml-2 text-text-muted">({c.status})</span>
              </li>
            ))}
          </ul>
        )}

        <label className="mt-4 block text-sm font-medium">
          Activer un exercice publié
          <select
            className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
          >
            {catalog.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.themeLabel} · {ex.levelCode}/p{ex.tier} — {ex.name}
              </option>
            ))}
          </select>
        </label>
        <Button
          className="mt-3"
          onClick={activate}
          disabled={pending || !exerciseId}
          fullWidth
        >
          Activer pour l&apos;aidant
        </Button>
        {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}
      </Card>

      {alerts.length > 0 && (
        <Card className="border-terracotta/30">
          <SectionTitle>Alertes parcours</SectionTitle>
          <ul className="mt-3 space-y-3">
            {alerts.map((a) => (
              <li key={a.id} className="rounded-xl bg-white p-3 text-sm">
                <p className="font-medium">{a.message}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {a.type} · {new Date(a.createdAt).toLocaleString("fr-FR")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.nextExerciseId && (
                    <Button
                      size="sm"
                      disabled={pending}
                      onClick={() => treat(a.id, true)}
                    >
                      Valider & activer la suite
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => treat(a.id, false)}
                  >
                    Marquer traitée
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
