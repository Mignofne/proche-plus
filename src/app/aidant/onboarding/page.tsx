"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ONBOARDING_STEPS } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [largeText, setLargeText] = useState(false);

  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  async function finish() {
    await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingDone: true, largeText }),
    });
    router.push("/aidant");
  }

  function next() {
    if (isLast) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <main
      className={`mx-auto flex min-h-dvh max-w-lg flex-col gap-6 p-6 ${largeText ? "large-text" : ""}`}
    >
      {step === 0 && (
        <Card className="flex flex-col gap-3">
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

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Mascot pose={step < 2 ? "welcome" : step === 2 ? "encourage" : "vigilance"} />
        <p className="text-sm font-medium text-teal">
          Étape {step + 1} / {ONBOARDING_STEPS.length}
        </p>
        <h1 className="text-2xl font-bold text-teal-dark">{current.title}</h1>
        <p className="text-text-muted">{current.content}</p>
      </div>

      <div className="flex gap-2">
        {ONBOARDING_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-teal" : "bg-cream-dark"}`}
          />
        ))}
      </div>

      <Button onClick={next} fullWidth size="lg">
        {isLast ? "Commencer" : "Continuer"}
      </Button>
    </main>
  );
}
