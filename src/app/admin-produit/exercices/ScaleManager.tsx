"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteAutonomyScale, saveAutonomyScale } from "../actions";
import type { AutonomyLevel } from "@prisma/client";

type ScaleRow = {
  id: string;
  code: string;
  label: string;
  patientEnum: AutonomyLevel;
  displayOrder: number;
  active: boolean;
};

const PATIENT_ENUMS: { value: AutonomyLevel; label: string }[] = [
  { value: "autonome", label: "autonome (A)" },
  { value: "semi_autonome_faible", label: "semi_autonome_faible (B)" },
  { value: "semi_autonome_eleve", label: "semi_autonome_eleve (C)" },
  { value: "dependant", label: "dependant (D)" },
  { value: "grabataire", label: "grabataire (E)" },
];

export function ScaleManager({ scales }: { scales: ScaleRow[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ScaleRow | "new" | null>(null);

  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        await saveAutonomyScale({
          id: editing && editing !== "new" ? editing.id : undefined,
          code: String(formData.get("code") || ""),
          label: String(formData.get("label") || ""),
          patientEnum: String(formData.get("patientEnum")) as AutonomyLevel,
          displayOrder: Number(formData.get("displayOrder") || 0),
          active: formData.get("active") === "on",
        });
        setEditing(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer ou désactiver ce niveau ?")) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteAutonomyScale(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-text-muted">{scales.length} niveau(x)</p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => setEditing("new")}
        >
          + Ajouter un niveau
        </Button>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      {editing && (
        <form
          action={submit}
          className="space-y-3 rounded-2xl border border-teal/30 bg-teal/5 p-4"
        >
          <p className="font-medium">
            {editing === "new"
              ? "Nouveau niveau"
              : `Modifier · ${editing.code}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Code
              <input
                name="code"
                required
                maxLength={4}
                defaultValue={editing === "new" ? "" : editing.code}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm">
              Ordre
              <input
                name="displayOrder"
                type="number"
                defaultValue={
                  editing === "new" ? scales.length + 1 : editing.displayOrder
                }
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Libellé
              <input
                name="label"
                required
                defaultValue={editing === "new" ? "" : editing.label}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Mapping patient (enum)
              <select
                name="patientEnum"
                defaultValue={
                  editing === "new" ? "autonome" : editing.patientEnum
                }
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              >
                {PATIENT_ENUMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={editing === "new" ? true : editing.active}
            />
            Actif
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditing(null)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {scales.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cream-dark bg-white px-3 py-2"
          >
            <p className="text-sm">
              <strong>{s.code}</strong> — {s.label}
              {!s.active && (
                <span className="ml-2 text-xs text-terracotta">inactif</span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm text-teal"
                disabled={pending}
                onClick={() => setEditing(s)}
              >
                Modifier
              </button>
              <button
                type="button"
                className="text-sm text-terracotta"
                disabled={pending}
                onClick={() => remove(s.id)}
              >
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
