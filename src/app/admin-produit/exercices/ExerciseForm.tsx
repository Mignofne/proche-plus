"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { saveExercise, duplicateExercise } from "../actions";

type Option = { id: string; label: string };

export function ExerciseForm({
  themes,
  scales,
  exerciseOptions,
  initial,
}: {
  themes: Option[];
  scales: Option[];
  exerciseOptions: Option[];
  initial?: {
    id: string;
    themeId: string;
    autonomyScaleId: string;
    tier: number;
    name: string;
    objective: string;
    steps: string[];
    caregiverCan: string[];
    caregiverMustNot: string[];
    estimatedDuration: string;
    risks: string;
    onSuccessExerciseId: string;
    onPartialExerciseId: string;
    onFailureExerciseId: string;
    crossesAutonomyLevel: boolean;
    alertOnFailure: boolean;
    status: "brouillon" | "publie" | "archive";
  };
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [steps, setSteps] = useState(initial?.steps.join("\n") ?? "");
  const [can, setCan] = useState(initial?.caregiverCan.join("\n") ?? "");
  const [mustNot, setMustNot] = useState(
    initial?.caregiverMustNot.join("\n") ?? ""
  );

  function onSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        await saveExercise({
          id: initial?.id,
          themeId: String(formData.get("themeId")),
          autonomyScaleId: String(formData.get("autonomyScaleId")),
          tier: Number(formData.get("tier") || 1),
          name: String(formData.get("name")),
          objective: String(formData.get("objective")),
          steps: steps.split("\n"),
          caregiverCan: can.split("\n"),
          caregiverMustNot: mustNot.split("\n"),
          estimatedDuration: String(formData.get("estimatedDuration") || ""),
          risks: String(formData.get("risks") || ""),
          onSuccessExerciseId:
            String(formData.get("onSuccessExerciseId") || "") || null,
          onPartialExerciseId:
            String(formData.get("onPartialExerciseId") || "") || null,
          onFailureExerciseId:
            String(formData.get("onFailureExerciseId") || "") || null,
          crossesAutonomyLevel: formData.get("crossesAutonomyLevel") === "on",
          alertOnFailure: formData.get("alertOnFailure") === "on",
          status: String(formData.get("status")) as
            | "brouillon"
            | "publie"
            | "archive",
        });
      } catch (e) {
        // Next.js redirect() throws a special error — ne pas l'avaler
        if (
          e &&
          typeof e === "object" &&
          "digest" in e &&
          String((e as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
        ) {
          throw e;
        }
        setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Thème
        <select
          name="themeId"
          defaultValue={initial?.themeId ?? themes[0]?.id}
          className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Niveau
        <select
          name="autonomyScaleId"
          defaultValue={initial?.autonomyScaleId ?? scales[0]?.id}
          className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        >
          {scales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Palier
        <input
          name="tier"
          type="number"
          min={1}
          defaultValue={initial?.tier ?? 1}
          className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Nom
        <input
          name="name"
          defaultValue={initial?.name}
          className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Objectif (votre proche…)
        <textarea
          name="objective"
          defaultValue={initial?.objective}
          className="mt-1 min-h-20 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Étapes / guidance (une par ligne, tutoiement)
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="mt-1 min-h-28 w-full rounded-xl border border-cream-dark bg-white p-3"
          required
        />
      </label>

      <label className="block text-sm font-medium">
        L&apos;aidant peut (une par ligne)
        <textarea
          value={can}
          onChange={(e) => setCan(e.target.value)}
          className="mt-1 min-h-20 w-full rounded-xl border border-cream-dark bg-white p-3"
        />
      </label>

      <label className="block text-sm font-medium">
        L&apos;aidant ne doit pas (une par ligne)
        <textarea
          value={mustNot}
          onChange={(e) => setMustNot(e.target.value)}
          className="mt-1 min-h-20 w-full rounded-xl border border-cream-dark bg-white p-3"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Durée indicative
          <input
            name="estimatedDuration"
            defaultValue={initial?.estimatedDuration}
            className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Statut
          <select
            name="status"
            defaultValue={initial?.status ?? "brouillon"}
            className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
          >
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium">
        Risques / contre-indications
        <textarea
          name="risks"
          defaultValue={initial?.risks}
          className="mt-1 min-h-16 w-full rounded-xl border border-cream-dark bg-white p-3"
        />
      </label>

      <SectionTransitions
        label="Si réussi →"
        name="onSuccessExerciseId"
        options={exerciseOptions}
        defaultValue={initial?.onSuccessExerciseId}
        excludeId={initial?.id}
      />
      <SectionTransitions
        label="Si essai / difficulté →"
        name="onPartialExerciseId"
        options={exerciseOptions}
        defaultValue={initial?.onPartialExerciseId}
        excludeId={initial?.id}
      />
      <SectionTransitions
        label="Si échec →"
        name="onFailureExerciseId"
        options={exerciseOptions}
        defaultValue={initial?.onFailureExerciseId}
        excludeId={initial?.id}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="crossesAutonomyLevel"
          defaultChecked={initial?.crossesAutonomyLevel}
        />
        Franchit un niveau d&apos;autonomie si réussi (alerte pro)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="alertOnFailure"
          defaultChecked={initial?.alertOnFailure}
        />
        Alerter le professionnel en cas d&apos;échec (ex. niveau A)
      </label>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {initial ? "Enregistrer" : "Créer"}
        </Button>
        {initial && (
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await duplicateExercise(initial.id);
              })
            }
          >
            Dupliquer
          </Button>
        )}
      </div>
    </form>
  );
}

function SectionTransitions({
  label,
  name,
  options,
  defaultValue,
  excludeId,
}: {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  excludeId?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-3"
      >
        <option value="">— Aucun —</option>
        {options
          .filter((o) => o.id !== excludeId)
          .map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
      </select>
    </label>
  );
}
