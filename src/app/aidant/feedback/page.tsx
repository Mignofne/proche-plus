"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { AppHeader } from "@/components/layout/AppHeader";
import { DIFFICULTY_OPTIONS, FEEDBACK_OUTCOME_LABELS } from "@/lib/constants";
import { getMicrocopy } from "@/lib/microcopy";

export default function FeedbackPage() {
  const router = useRouter();
  const [outcome, setOutcome] = useState<string | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [wantsToDiscuss, setWantsToDiscuss] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    const aidantRes = await fetch("/api/aidant");
    const aidantData = await aidantRes.json();
    const transmissionId = aidantData.transmissions[0]?.id;
    if (!transmissionId || !outcome) return;

    await fetch("/api/aidant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "feedback",
        transmissionId,
        outcome,
        difficulties,
        wantsToDiscuss,
      }),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto min-h-dvh max-w-lg bg-cream">
        <AppHeader title="Merci" backHref="/aidant" />
        <main className="flex flex-col items-center gap-6 p-6 text-center">
          <Mascot pose="celebrate" />
          <p>
            {outcome === "facile"
              ? getMicrocopy("objectiveReached")
              : getMicrocopy("feedbackDifficult")}
          </p>
          <Button onClick={() => router.push("/aidant")} fullWidth>
            Retour
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Votre retour" backHref="/aidant" />
      <main className="flex flex-col gap-6 p-4">
        <p className="text-lg font-medium">
          Depuis votre dernière visite, avez-vous pu essayer ?
        </p>

        <div className="flex flex-col gap-3">
          {Object.entries(FEEDBACK_OUTCOME_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={outcome === key ? "primary" : "ghost"}
              onClick={() => setOutcome(key)}
              fullWidth
            >
              {label}
            </Button>
          ))}
        </div>

        {outcome && outcome !== "facile" && (
          <>
            <p className="font-medium">Qu&apos;est-ce qui a été difficile ?</p>
            <div className="flex flex-col gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 rounded-xl border border-cream-dark bg-white p-4"
                >
                  <input
                    type="checkbox"
                    checked={difficulties.includes(opt)}
                    onChange={(e) => {
                      setDifficulties((prev) =>
                        e.target.checked
                          ? [...prev, opt]
                          : prev.filter((d) => d !== opt)
                      );
                    }}
                    className="h-5 w-5"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={wantsToDiscuss}
                onChange={(e) => setWantsToDiscuss(e.target.checked)}
                className="h-5 w-5"
              />
              <span>Je souhaite en reparler lors de la prochaine visite</span>
            </label>
          </>
        )}

        <Button onClick={submit} disabled={!outcome} fullWidth size="lg">
          Envoyer mon retour
        </Button>
      </main>
    </div>
  );
}
