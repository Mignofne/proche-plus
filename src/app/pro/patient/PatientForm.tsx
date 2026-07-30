"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { PATIENT_PROFILES } from "@/lib/patient-profiles";
import { deletePatient, upsertPatient } from "@/app/pro/actions";
import type { AutonomyLevel } from "@prisma/client";

type PatientFormProps = {
  mode: "create" | "edit";
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    autonomyLevel: AutonomyLevel;
    girLevel: number | null;
  };
};

export function PatientForm({ mode, patient }: PatientFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(patient?.firstName ?? "");
  const [lastName, setLastName] = useState(patient?.lastName ?? "");
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>(
    patient?.autonomyLevel ?? "semi_autonome_eleve"
  );
  const [girLevel, setGirLevel] = useState<number | "">(
    patient?.girLevel ?? ""
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const profile = useMemo(
    () => PATIENT_PROFILES.find((p) => p.id === autonomyLevel),
    [autonomyLevel]
  );

  function save() {
    setError("");
    startTransition(async () => {
      try {
        await upsertPatient({
          id: patient?.id,
          firstName,
          lastName,
          autonomyLevel,
          girLevel: girLevel === "" ? profile?.girSuggest ?? null : Number(girLevel),
        });
        router.push("/pro");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function remove() {
    if (!patient?.id) return;
    if (!confirm("Supprimer ce patient et ses données éducatives ?")) return;
    startTransition(async () => {
      await deletePatient(patient.id);
      router.push("/pro");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Mascot pose={mode === "create" ? "welcome" : "encourage"} size="sm" animated />
        <div>
          <h1 className="text-xl font-bold text-teal-dark">
            {mode === "create" ? "Nouveau patient" : "Modifier le patient"}
          </h1>
          <p className="text-sm text-text-muted">
            Le profil adapte automatiquement les consignes types
          </p>
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Prénom</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-xl border border-cream-dark bg-white px-4 py-3"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Nom</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-xl border border-cream-dark bg-white px-4 py-3"
            required
          />
        </label>

        <fieldset>
          <legend className="mb-2 font-medium">Profil d&apos;autonomie</legend>
          <div className="flex flex-col gap-2">
            {PATIENT_PROFILES.map((p) => (
              <label
                key={p.id}
                className={`cursor-pointer rounded-xl border p-4 ${
                  autonomyLevel === p.id
                    ? "border-teal bg-teal/10"
                    : "border-cream-dark bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="autonomy"
                  className="sr-only"
                  checked={autonomyLevel === p.id}
                  onChange={() => {
                    setAutonomyLevel(p.id as AutonomyLevel);
                    setGirLevel(p.girSuggest);
                  }}
                />
                <p className="font-semibold">{p.label}</p>
                <p className="text-sm text-text-muted">{p.description}</p>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-2">
          <span className="font-medium">GIR (contexte)</span>
          <select
            value={girLevel}
            onChange={(e) =>
              setGirLevel(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="rounded-xl border border-cream-dark bg-white px-4 py-3"
          >
            <option value="">Suggestion du profil</option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                GIR {g}
              </option>
            ))}
          </select>
        </label>

        {profile && (
          <Card className="border-teal/20 bg-teal/5">
            <SectionTitle>Consignes adaptées à ce profil</SectionTitle>
            <p className="mt-2 text-sm font-medium">{profile.objectiveExample}</p>
            <p className="mt-2 text-sm text-teal-dark">À faire</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {profile.allowedHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-terracotta">À éviter</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {profile.forbiddenHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Card>
        )}

        {error && (
          <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        <Button
          onClick={save}
          disabled={pending || !firstName.trim() || !lastName.trim()}
          fullWidth
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {mode === "edit" && (
          <Button variant="danger" onClick={remove} disabled={pending} fullWidth>
            Supprimer le patient
          </Button>
        )}
        <Button variant="ghost" onClick={() => router.push("/pro")} fullWidth>
          Annuler
        </Button>
      </Card>
    </div>
  );
}
