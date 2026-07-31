"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AutonomyLevelPicker } from "@/components/aidant/AutonomyLevelPicker";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ONBOARDING_STEPS } from "@/lib/constants";
import {
  createCaregiverPatient,
  declarePatientAutonomy,
  updateCaregiverPatient,
} from "@/app/aidant/actions";
import type { AutonomyLevel } from "@prisma/client";

type Props = {
  /** Un proche déjà lié (ex. invitation pro) — l'aidant doit quand même confirmer l'identité. */
  existingPatientId: string | null;
  existingFirstName: string | null;
  existingLastName: string | null;
};

const inputClass =
  "touch-target rounded-xl border border-cream-dark bg-white px-4 py-3 text-base";

export function OnboardingClient({
  existingPatientId,
  existingFirstName,
  existingLastName,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [largeText, setLargeText] = useState(false);
  // Identité : uniquement ce que l'aidant saisit / confirme — jamais un nom inventé
  const [firstName, setFirstName] = useState(existingFirstName ?? "");
  const [lastName, setLastName] = useState(existingLastName ?? "");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel | null>(
    null
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // Grands caractères → pédagogie → identité (toujours) → autonomie (prénom saisi seulement)
  const identityStepIndex = ONBOARDING_STEPS.length;
  const autonomyStepIndex = ONBOARDING_STEPS.length + 1;
  const totalSteps = autonomyStepIndex + 1;

  const isPedagogy = step >= 0 && step < ONBOARDING_STEPS.length;
  const isIdentityStep = step === identityStepIndex;
  const isAutonomyStep = step === autonomyStepIndex;
  const current = isPedagogy ? ONBOARDING_STEPS[step] : null;

  const displayName = firstName.trim();

  function finish() {
    if (!autonomyLevel) {
      setError("Choisissez la situation qui correspond le mieux.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Enregistrez d’abord votre proche (prénom et nom).");
      return;
    }
    if (!identityConfirmed) {
      setError("Confirmez d’abord l’identité de votre proche.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        if (existingPatientId) {
          await updateCaregiverPatient({
            patientId: existingPatientId,
            firstName,
            lastName,
          });
          await declarePatientAutonomy({
            patientId: existingPatientId,
            autonomyLevel,
            historySource: "question_aidant",
            completeOnboarding: true,
            largeText,
          });
        } else {
          await createCaregiverPatient({
            firstName,
            lastName,
            autonomyLevel,
            completeOnboarding: true,
            largeText,
          });
        }
        router.push("/aidant");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function next() {
    if (isIdentityStep) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Indiquez le prénom et le nom de votre proche.");
        return;
      }
      setError("");
      setIdentityConfirmed(true);
      setStep((s) => s + 1);
      return;
    }
    if (isAutonomyStep) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  }

  const canContinueAutonomy =
    identityConfirmed &&
    !!autonomyLevel &&
    !!firstName.trim() &&
    !!lastName.trim();

  return (
    <main
      className={`mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 p-6 ${largeText ? "large-text" : ""}`}
    >
      {step === 0 && (
        <Card className="mx-auto w-full max-w-lg flex flex-col gap-3">
          <p className="font-medium">Souhaitez-vous des caractères plus grands ?</p>
          <div className="flex gap-3">
            <Button
              variant={largeText ? "primary" : "ghost"}
              onClick={() => setLargeText(true)}
              fullWidth
            >
              Oui
            </Button>
            <Button
              variant={!largeText ? "primary" : "ghost"}
              onClick={() => setLargeText(false)}
              fullWidth
            >
              Non
            </Button>
          </div>
        </Card>
      )}

      {isPedagogy && current && (
        <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-6 text-center">
          <Mascot pose={step < 2 ? "welcome" : step === 2 ? "encourage" : "vigilance"} />
          <p className="text-sm font-medium text-teal">
            Étape {step + 1} / {totalSteps}
          </p>
          <h1 className="text-2xl font-bold text-teal-dark">{current.title}</h1>
          <p className="text-text-muted">{current.content}</p>
        </div>
      )}

      {isIdentityStep && (
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            <Mascot pose="welcome" size="sm" />
            <p className="text-sm font-medium text-teal">
              Étape {step + 1} / {totalSteps}
            </p>
          </div>
          <h1 className="text-center text-2xl font-bold text-teal-dark">
            {existingPatientId ? "Confirmer mon proche" : "Ajouter mon proche"}
          </h1>
          <p className="text-center text-sm text-text-muted">
            {existingPatientId
              ? "Vérifiez ou corrigez le prénom et le nom avant de décrire sa situation."
              : "Qui accompagnez-vous pendant la réadaptation\u00a0? C’est la première étape."}
          </p>
          <Card className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-medium">Prénom</span>
              <input
                value={firstName}
                onChange={(e) => {
                  setIdentityConfirmed(false);
                  setFirstName(e.target.value);
                }}
                className={inputClass}
                autoComplete="given-name"
                placeholder="Ex. Marie"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium">Nom</span>
              <input
                value={lastName}
                onChange={(e) => {
                  setIdentityConfirmed(false);
                  setLastName(e.target.value);
                }}
                className={inputClass}
                autoComplete="family-name"
                placeholder="Ex. Dupont"
              />
            </label>
          </Card>
        </div>
      )}

      {isAutonomyStep && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            <Mascot pose="patience" size="sm" />
            <p className="text-sm font-medium text-teal">
              Étape {step + 1} / {totalSteps}
            </p>
          </div>
          {!identityConfirmed || !displayName ? (
            <Card className="mx-auto max-w-lg text-center">
              <p>
                Enregistrez d&apos;abord votre proche à l&apos;étape précédente.
              </p>
            </Card>
          ) : (
            <AutonomyLevelPicker
              value={autonomyLevel}
              onChange={setAutonomyLevel}
              patientFirstName={displayName}
            />
          )}
          <p className="text-center text-xs text-text-muted">
            Votre réponse sera enregistrée comme <strong>provisoire</strong>{" "}
            jusqu&apos;à confirmation par un professionnel.
          </p>
        </div>
      )}

      {error && (
        <p className="mx-auto max-w-lg rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <div className="mx-auto flex w-full max-w-lg gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-teal" : "bg-cream-dark"}`}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-lg gap-3">
        {step > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              if (isAutonomyStep) setIdentityConfirmed(false);
              setStep((s) => s - 1);
            }}
            fullWidth
            disabled={pending}
          >
            Retour
          </Button>
        )}
        <Button
          onClick={next}
          fullWidth
          size="lg"
          disabled={
            pending ||
            (isAutonomyStep && !canContinueAutonomy) ||
            (isIdentityStep && (!firstName.trim() || !lastName.trim()))
          }
        >
          {pending
            ? "Enregistrement…"
            : isAutonomyStep
              ? "Commencer"
              : isIdentityStep
                ? "Enregistrer mon proche"
                : "Continuer"}
        </Button>
      </div>
    </main>
  );
}
