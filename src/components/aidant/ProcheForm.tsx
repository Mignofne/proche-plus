"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AutonomyLevelPicker } from "@/components/aidant/AutonomyLevelPicker";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  createCaregiverPatient,
  deleteCaregiverPatient,
  updateCaregiverPatient,
} from "@/app/aidant/actions";
import type { AutonomyLevel } from "@prisma/client";

type ProcheFormProps = {
  mode: "create" | "edit";
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    autonomyLevel: AutonomyLevel;
    relationship?: string;
  };
  cancelHref?: string;
};

const inputClass =
  "touch-target rounded-xl border border-cream-dark bg-white px-4 py-3 text-base";

export function ProcheForm({
  mode,
  patient,
  cancelHref = "/aidant/proches",
}: ProcheFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(patient?.firstName ?? "");
  const [lastName, setLastName] = useState(patient?.lastName ?? "");
  const [relationship, setRelationship] = useState(
    patient?.relationship ?? "proche"
  );
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel | null>(
    patient?.autonomyLevel ?? null
  );
  /** Création : identité puis picker. Édition : tout sur un écran. */
  const [createStep, setCreateStep] = useState<"identity" | "autonomy">(
    "identity"
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const showIdentity = mode === "edit" || createStep === "identity";
  const showAutonomy = mode === "edit" || createStep === "autonomy";

  function goToAutonomy() {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Indiquez le prénom et le nom de votre proche.");
      return;
    }
    setError("");
    setCreateStep("autonomy");
  }

  function save() {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Indiquez le prénom et le nom de votre proche.");
      return;
    }
    if (!autonomyLevel) {
      setError("Choisissez la situation qui correspond le mieux.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createCaregiverPatient({
            firstName,
            lastName,
            autonomyLevel,
            relationship,
          });
        } else if (patient) {
          await updateCaregiverPatient({
            patientId: patient.id,
            firstName,
            lastName,
            autonomyLevel,
            relationship,
          });
        }
        router.push("/aidant/proches");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function remove() {
    if (!patient?.id) return;
    const label = `${patient.firstName} ${patient.lastName}`.trim();
    if (
      !confirm(
        `Supprimer ${label || "ce proche"} de votre espace ?\n\nCette action est définitive pour votre compte.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteCaregiverPatient(patient.id);
        router.push("/aidant/proches");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Mascot
          pose={mode === "create" ? "welcome" : "encourage"}
          size="sm"
        />
        <div>
          <h1 className="text-xl font-bold text-teal-dark">
            {mode === "create" ? "Ajouter mon proche" : "Modifier mon proche"}
          </h1>
          <p className="text-sm text-text-muted">
            {showAutonomy && !showIdentity
              ? "Une seule situation — l’équipe confirmera ensuite."
              : "Quelques informations essentielles."}
          </p>
        </div>
      </div>

      {showIdentity && (
        <Card className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-medium">Prénom</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              autoComplete="given-name"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium">Nom</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              autoComplete="family-name"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium">Lien (optionnel)</span>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className={inputClass}
              placeholder="Ex. conjoint, fille, fils…"
            />
          </label>
        </Card>
      )}

      {showAutonomy && (
        <div className="flex flex-col gap-4">
          <AutonomyLevelPicker
            value={autonomyLevel}
            onChange={setAutonomyLevel}
            patientFirstName={firstName.trim() || undefined}
          />
          <p className="text-center text-xs text-text-muted">
            Votre réponse sera enregistrée comme <strong>provisoire</strong>{" "}
            jusqu&apos;à confirmation par un professionnel
            {mode === "edit"
              ? " si vous changez de situation."
              : "."}
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {mode === "create" && createStep === "identity" ? (
          <>
            <Button
              onClick={goToAutonomy}
              fullWidth
              size="lg"
              disabled={pending}
            >
              Continuer
            </Button>
            <Button
              variant="ghost"
              fullWidth
              disabled={pending}
              onClick={() => router.push(cancelHref)}
            >
              Annuler
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={save}
              fullWidth
              size="lg"
              disabled={pending || !autonomyLevel}
            >
              {pending
                ? "Enregistrement…"
                : mode === "create"
                  ? "Enregistrer mon proche"
                  : "Enregistrer"}
            </Button>
            {mode === "create" ? (
              <Button
                variant="ghost"
                fullWidth
                disabled={pending}
                onClick={() => setCreateStep("identity")}
              >
                Retour
              </Button>
            ) : (
              <Button
                variant="ghost"
                fullWidth
                disabled={pending}
                onClick={() => router.push(cancelHref)}
              >
                Annuler
              </Button>
            )}
          </>
        )}

        {mode === "edit" && (
          <Button
            variant="danger"
            fullWidth
            disabled={pending}
            onClick={remove}
          >
            Supprimer ce proche
          </Button>
        )}
      </div>
    </div>
  );
}
