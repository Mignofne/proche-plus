"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { MESSAGE_SECTION_LABELS, SKILL_LABELS } from "@/lib/constants";
import { getMicrocopy } from "@/lib/microcopy";
import { submitComprehensionCheck } from "@/app/aidant/actions";

type TransmissionData = {
  id: string;
  messages: Array<{
    id?: string;
    section: string;
    theme?: string | null;
    content: string;
  }>;
  visit: { patient: { firstName: string } };
};

export function TransmissionClient({
  transmission,
}: {
  transmission: TransmissionData;
}) {
  const router = useRouter();
  const [step, setStep] = useState<"read" | "comprehension" | "done">("read");
  const [comprehension, setComprehension] = useState<"clair" | "doute" | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  function handleComprehension() {
    if (!comprehension) return;
    startTransition(async () => {
      await submitComprehensionCheck(
        transmission.id,
        comprehension,
        comprehension === "doute" ? comment : null
      );
      setStep("done");
    });
  }

  if (step === "done") {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Merci" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="celebrate" />
          <p>{getMicrocopy("transmissionReceived")}</p>
          <Button onClick={() => router.push("/aidant")} fullWidth>
            Retour à l&apos;accueil
          </Button>
        </main>
      </div>
    );
  }

  if (step === "comprehension") {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Votre compréhension" backHref="/aidant" />
        <main className="flex flex-col gap-6 p-4">
          <p className="text-lg font-medium">
            Est-ce que vous savez ce que vous devez essayer ?
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant={comprehension === "clair" ? "primary" : "ghost"}
              onClick={() => setComprehension("clair")}
              fullWidth
            >
              Oui, c&apos;est clair
            </Button>
            <Button
              variant={comprehension === "doute" ? "primary" : "ghost"}
              onClick={() => setComprehension("doute")}
              fullWidth
            >
              J&apos;ai encore un doute
            </Button>
          </div>
          {comprehension === "doute" && (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Précisez ce qui n'est pas clair…"
              className="min-h-24 rounded-xl border border-cream-dark bg-white p-4"
            />
          )}
          <Button
            onClick={handleComprehension}
            disabled={!comprehension || pending}
            fullWidth
          >
            {pending ? "Envoi…" : "Valider"}
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader
        title="Votre accompagnement après la visite"
        backHref="/aidant"
      />
      <main className="flex flex-col gap-4 p-4">
        <p className="text-sm text-text-muted">
          Pour {transmission.visit.patient.firstName}
        </p>

        {(["a_retenir", "a_essayer", "a_eviter", "a_revoir_ensemble"] as const).map(
          (section) => {
            const items = transmission.messages.filter(
              (m) => m.section === section
            );
            if (!items.length) return null;
            return (
              <Card key={section}>
                <SectionTitle>
                  {MESSAGE_SECTION_LABELS[section] ?? section}
                </SectionTitle>
                <ul className="mt-3 space-y-4">
                  {items.map((msg, i) => (
                    <li key={msg.id ?? `${section}-${i}`}>
                      {msg.theme && (
                        <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal-dark">
                          {SKILL_LABELS[msg.theme] ?? msg.theme}
                        </span>
                      )}
                      <p className="mt-1">{msg.content.replace(/^\[[^\]]+\]\s*/, "")}</p>
                      <button
                        type="button"
                        className="mt-2 text-sm text-teal"
                        onClick={() => {
                          if ("speechSynthesis" in window) {
                            const utterance = new SpeechSynthesisUtterance(
                              msg.content.replace(/^\[[^\]]+\]\s*/, "")
                            );
                            utterance.lang = "fr-FR";
                            speechSynthesis.speak(utterance);
                          }
                        }}
                      >
                        Écouter
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          }
        )}

        <Button onClick={() => setStep("comprehension")} fullWidth size="lg">
          J&apos;ai lu — continuer
        </Button>
      </main>
    </div>
  );
}
