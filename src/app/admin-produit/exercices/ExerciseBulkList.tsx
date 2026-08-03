"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { bulkUpdateExerciseStatus } from "@/app/admin-produit/actions";
import { CSV_IMPORT_VALIDATED_BY } from "@/lib/exercises/constants";

const STATUS_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  a_valider: "À valider",
  publie: "Publié",
  archive: "Archivé",
};

type ExerciseRow = {
  id: string;
  name: string;
  objective: string;
  status: string;
  tier: number;
  validatedBy: string | null;
  themeLabel: string;
  scaleCode: string;
};

export function ExerciseBulkList({ exercises }: { exercises: ExerciseRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetStatus, setTargetStatus] = useState<
    "brouillon" | "a_valider" | "publie" | "archive"
  >("publie");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const allIds = useMemo(() => exercises.map((ex) => ex.id), [exercises]);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (allIds.length > 0 && allIds.every((id) => prev.has(id))) {
        return new Set();
      }
      return new Set(allIds);
    });
  }

  function apply() {
    if (selected.size === 0) {
      setError("Sélectionnez au moins un exercice.");
      return;
    }
    setError("");
    setMessage("");
    const ids = [...selected];
    startTransition(async () => {
      try {
        const result = await bulkUpdateExerciseStatus({
          exerciseIds: ids,
          status: targetStatus,
        });
        setSelected(new Set());
        setMessage(
          `${result.updated} exercice${result.updated > 1 ? "s" : ""} → ${
            STATUS_LABEL[targetStatus]
          }.`
        );
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Impossible de changer le statut."
        );
      }
    });
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <p className="text-sm text-text-muted">
          Aucun exercice pour ces filtres.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-cream-dark bg-white/95 p-3 backdrop-blur">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="size-4 accent-teal"
            aria-label="Tout sélectionner"
          />
          Tout ({exercises.length})
        </label>
        <span className="text-sm text-text-muted">
          {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
        </span>
        <select
          value={targetStatus}
          onChange={(e) =>
            setTargetStatus(
              e.target.value as typeof targetStatus
            )
          }
          disabled={!someSelected || pending}
          className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm"
          aria-label="Nouveau statut"
        >
          <option value="a_valider">À valider</option>
          <option value="publie">Publié</option>
          <option value="brouillon">Brouillon</option>
          <option value="archive">Archivé</option>
        </select>
        <Button
          size="sm"
          onClick={apply}
          disabled={!someSelected || pending}
        >
          {pending ? "Application…" : "Appliquer le statut"}
        </Button>
        {error && (
          <p className="w-full text-sm font-medium text-terracotta" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="w-full text-sm font-medium text-teal-dark" role="status">
            {message}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {exercises.map((ex) => {
          const isAiPending =
            ex.status === "a_valider" ||
            ex.validatedBy === CSV_IMPORT_VALIDATED_BY;
          const checked = selected.has(ex.id);
          return (
            <li
              key={ex.id}
              className={`flex gap-3 rounded-2xl border bg-white p-4 transition-colors ${
                ex.status === "a_valider"
                  ? "border-terracotta/40"
                  : "border-cream-dark"
              } ${checked ? "ring-2 ring-teal/40" : ""}`}
            >
              <label className="flex shrink-0 items-start pt-1">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(ex.id)}
                  className="size-4 accent-teal"
                  aria-label={`Sélectionner ${ex.name}`}
                />
              </label>
              <Link
                href={`/admin-produit/exercices/${ex.id}`}
                className="min-w-0 flex-1 hover:opacity-90"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {ex.themeLabel} · {ex.scaleCode}/p{ex.tier} — {ex.name}
                  </p>
                  <span className="flex flex-wrap items-center gap-2">
                    {isAiPending && (
                      <span className="rounded-full bg-cream-dark px-2 py-0.5 text-xs font-semibold text-text-muted">
                        IA
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        ex.status === "a_valider"
                          ? "text-terracotta"
                          : "text-teal-dark"
                      }`}
                    >
                      {STATUS_LABEL[ex.status] ?? ex.status}
                    </span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted line-clamp-1">
                  {ex.objective}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
