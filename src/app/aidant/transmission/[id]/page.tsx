"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { MESSAGE_SECTION_LABELS } from "@/lib/constants";
import { getMicrocopy } from "@/lib/microcopy";

type Transmission = {
  id: string;
  readAt: string | null;
  messages: Array<{ section: string; content: string }>;
  visit: { patient: { firstName: string } };
};

export default function TransmissionPage() {
  const params = useParams();
  const id = params.id as string;
  const [transmission, setTransmission] = useState<Transmission | null>(null);
  const [step, setStep] = useState<"read" | "comprehension" | "done">("read");
  const [comprehension, setComprehension] = useState<"clair" | "doute" | null>(
    null
  );
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/aidant")
      .then((r) => r.json())
      .then((data) => {
        const t = data.transmissions.find(
          (x: Transmission) => x.id === id
        );
        setTransmission(t ?? null);
        if (t && !t.readAt) {
          fetch("/api/aidant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "mark_read", transmissionId: id }),
          });
        }
      });
  }, [id]);

  async function submitComprehension() {
    if (!comprehension) return;
    await fetch("/api/aidant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "comprehension",
        transmissionId: id,
        result: comprehension,
        comment: comprehension === "doute" ? comment : null,
      }),
    });
    setStep("done");
  }

  if (!transmission) {
    return (
      <div className="p-6 text-center">
        {getMicrocopy("loading")}
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Merci" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="celebrate" />
          <p>{getMicrocopy("transmissionReceived")}</p>
          <Button onClick={() => (window.location.href = "/aidant")} fullWidth>
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
            onClick={submitComprehension}
            disabled={!comprehension}
            fullWidth
          >
            Valider
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

        {transmission.messages.map((msg) => (
          <Card key={msg.section}>
            <SectionTitle>
              {MESSAGE_SECTION_LABELS[msg.section] ?? msg.section}
            </SectionTitle>
            <p className="mt-2">{msg.content}</p>
            <button
              type="button"
              className="mt-3 text-sm text-teal"
              onClick={() => {
                if ("speechSynthesis" in window) {
                  const utterance = new SpeechSynthesisUtterance(msg.content);
                  utterance.lang = "fr-FR";
                  speechSynthesis.speak(utterance);
                }
              }}
            >
              Écouter cette consigne
            </button>
          </Card>
        ))}

        <Button onClick={() => setStep("comprehension")} fullWidth size="lg">
          J&apos;ai lu — continuer
        </Button>
      </main>
    </div>
  );
}
