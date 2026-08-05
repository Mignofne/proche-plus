"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { bulkAssociateExercisesToScale } from "@/app/admin-produit/actions";

type ScaleOption = {
  id: string;
  code: string;
  label: string;
  active: boolean;
};

type ExerciseRow = {
  id: string;
  name: string;
  themeLabel: string;
  scaleId: string;
  scaleCode: string;
  tier: number;
  status: string;
};

const STATUS_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  a_valider: "À valider",
  publie: "Publié",
  archive: "Archivé",
};

export function ScaleExerciseLinker({
  scales,
  exercises,
}: {
  scales: ScaleOption[];
  exercises: ExerciseRow[];
}) {
  const router = useRouter();
  const activeScales = scales.filter((s) => s.active);
  const [scaleId, setScaleId] = useState(activeScales[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const currentScale = activeScales.find((s) => s.id === scaleId);

  const onScale = useMemo(
    () => exercises.filter((ex) => ex.scaleId === scaleId),
    [exercises, scaleId]
  );

  const associable = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((ex) => {
      if (ex.scaleId === scaleId) return false;
      const signature = `${ex.themeLabel}|${ex.tier}|${ex.name}`.toLowerCase();
      const alreadyOnScale = onScale.some(
        (o) =>
          o.themeLabel === ex.themeLabel &&
          o.tier === ex.tier &&
          o.name === ex.name
      );
      if (alreadyOnScale) return false;
      if (!q) return true;
      const hay = `${ex.name} ${ex.themeLabel} ${ex.scaleCode}`.toLowerCase();
      return hay.includes(q);
    });
  }, [exercises, scaleId, onScale, query]);

  const allAssociableIds = useMemo(
    () => associable.map((ex) => ex.id),
    [associable]
  );
  const allSelected =
    allAssociableIds.length > 0 &&
    allAssociableIds.every((id) => selected.has(id));

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
      if (
        allAssociableIds.length > 0 &&
        allAssociableIds.every((id) => prev.has(id))
      ) {
        return new Set();
      }
      return new Set(allAssociableIds);
    });
  }

  function onScaleChange(nextId: string) {
    setScaleId(nextId);
    setSelected(new Set());
    setError("");
    setMessage("");
  }

  function associate() {
    if (!scaleId) {
      setError("Choisissez un niveau GIR.");
      return;
    }
    if (selected.size === 0) {
      setError("Sélectionnez au moins un exercice à associer.");
      return;
    }
    setError("");
    setMessage("");
    const ids = [...selected];
    startTransition(async () => {
      try {
        const result = await bulkAssociateExercisesToScale({
          exerciseIds: ids,
          autonomyScaleId: scaleId,
        });
        setSelected(new Set());
        const parts = [
          `${result.created} associé${result.created > 1 ? "s" : ""} au niveau ${result.scaleLabel}`,
        ];
        if (result.skipped > 0) {
          parts.push(
            `${result.skipped} ignoré${result.skipped > 1 ? "s" : ""} (déjà présent)`
          );
        }
        setMessage(parts.join(" · "));
        router.refresh();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Impossible d'associer les exercices."
        );
      }
    });
  }

  if (activeScales.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 space-y-4">
      <div>
        <h3 className="font-semibold text-teal-dark">
          Exercices par niveau GIR
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Associez plusieurs exercices à un niveau — une copie est créée pour
          chaque GIR (un exercice peut exister sur plusieurs niveaux).
        </p>
      </div>

      <label className="block text-sm font-medium">
        Niveau cible
        <select
          value={scaleId}
          onChange={(e) => onScaleChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm sm:max-w-md"
          aria-label="Niveau GIR cible"
        >
          {activeScales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} — {s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-cream-dark bg-cream/40 p-3">
        <p className="text-sm font-medium">
          {onScale.length} exercice{onScale.length > 1 ? "s" : ""} sur le
          niveau {currentScale?.code}
        </p>
        {onScale.length > 0 ? (
          <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-sm text-text-muted">
            {onScale.slice(0, 12).map((ex) => (
              <li key={ex.id}>
                <Link
                  href={`/admin-produit/exercices/${ex.id}`}
                  className="text-teal hover:underline"
                >
                  {ex.themeLabel} · p{ex.tier} — {ex.name}
                </Link>
                <span className="ml-2 text-xs">
                  ({STATUS_LABEL[ex.status] ?? ex.status})
                </span>
              </li>
            ))}
            {onScale.length > 12 && (
              <li className="text-xs">… et {onScale.length - 12} autres</li>
            )}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-text-muted">
            Aucun exercice sur ce niveau pour l&apos;instant.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ajouter des exercices existants</p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un exercice (autre niveau)…"
          className="w-full rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              disabled={associable.length === 0 || pending}
              className="size-4 accent-teal"
            />
            Tout ({associable.length})
          </label>
          <span className="text-sm text-text-muted">
            {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
          </span>
          <Button
            size="sm"
            onClick={associate}
            disabled={!someSelected(selected) || pending || !scaleId}
          >
            {pending
              ? "Association…"
              : `Associer au niveau ${currentScale?.code ?? ""}`}
          </Button>
        </div>

        <ul className="max-h-56 space-y-1 overflow-y-auto rounded-2xl border border-cream-dark bg-white p-2">
          {associable.length === 0 ? (
            <li className="p-2 text-sm text-text-muted">
              Aucun exercice à associer (déjà présents ou filtre vide).
            </li>
          ) : (
            associable.map((ex) => (
              <li key={ex.id}>
                <label className="flex cursor-pointer items-start gap-2 rounded-xl p-2 hover:bg-cream/60">
                  <input
                    type="checkbox"
                    checked={selected.has(ex.id)}
                    onChange={() => toggle(ex.id)}
                    className="mt-0.5 size-4 accent-teal"
                  />
                  <span className="text-sm">
                    <span className="font-medium">{ex.name}</span>
                    <span className="block text-xs text-text-muted">
                      {ex.themeLabel} · niveau {ex.scaleCode}/p{ex.tier}
                    </span>
                  </span>
                </label>
              </li>
            ))
          )}
        </ul>
      </div>

      {error && (
        <p className="text-sm font-medium text-terracotta" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm font-medium text-teal-dark" role="status">
          {message}
        </p>
      )}
    </Card>
  );
}

function someSelected(selected: Set<string>) {
  return selected.size > 0;
}
