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
} from "@/app/aidant/actions";
import type { AutonomyLevel } from "@prisma/client";

type Props = {
  needsCreate: boolean;
  patientId: string | null;
  patientFirstName: string | null;
};

const inputClass =
  "touch-target rounded-xl border border-cream-dark bg-white px-4 py-3 text-base";

export function OnboardingClient({
  needsCreate,
  patientId,
  patientFirstName,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [largeText, setLargeText] = useState(false);
  const [firstName, setFirstName] = useState(patientFirstName ?? "");
  const [lastName, setLastName] = useState("");
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel | null>(
    null
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // Grands caractères → pédagogie → (identité si création) → picker autonomie
  const identityStepIndex = needsCreate ? ONBOARDING_STEPS.length : -1;
  const autonomyStepIndex = needsCreate
    ? ONBOARDING_STEPS.length + 1
    : ONBOARDING_STEPS.length;
  const totalSteps = autonomyStepIndex + 1;

  const isPedagogy = step >= 0 && step < ONBOARDING_STEPS.length;
  const isIdentityStep = needsCreate && step === identityStepIndex;
  const isAutonomyStep = step === autonomyStepIndex;
  const current = isPedagogy ? ONBOARDING_STEPS[step] : null;

  function finish() {
    if (!autonomyLevel) {
      setError("Choisissez la situation qui correspond le mieux.");
      return;
    }
    if (needsCreate && (!firstName.trim() || !lastName.trim())) {
      setError("Indiquez le prénom et le nom de votre proche.");
      return;
    }
    if (!needsCreate && !patientId) {
      setError("Aucun proche n'est encore lié à votre compte.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        if (needsCreate) {
          await createCaregiverPatient({
            firstName,
            lastName,
            autonomyLevel,
            completeOnboarding: true,
            largeText,
          });
        } else {
          await declarePatientAutonomy({
            patientId: patientId!,
            autonomyLevel,
            historySource: "question_aidant",
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
    !!autonomyLevel && (needsCreate ? !!firstName.trim() && !!lastName.trim() : !!patientId);

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
            Ajouter mon proche
          </h1>
          <p className="text-center text-sm text-text-muted">
            Qui accompagnez-vous pendant la réadaptation&nbsp;?
          </p>
          <Card className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-medium">Prénom</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                autoComplete="given-name"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium">Nom</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                autoComplete="family-name"
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
          {!needsCreate && !patientId ? (
            <Card className="mx-auto max-w-lg text-center">
              <p>
                Aucun proche n&apos;est encore lié à votre compte. Rechargez
                la page ou contactez l&apos;équipe.
              </p>
            </Card>
          ) : (
            <AutonomyLevelPicker
              value={autonomyLevel}
              onChange={setAutonomyLevel}
              patientFirstName={
                (needsCreate ? firstName.trim() : patientFirstName) ||
                undefined
              }
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
            onClick={() => setStep((s) => s - 1)}
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
              : "Continuer"}
        </Button>
      </div>
    </main>
  );
}
