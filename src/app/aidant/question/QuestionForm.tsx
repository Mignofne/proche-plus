"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AppHeader } from "@/components/layout/AppHeader";
import { submitCaregiverQuestion } from "@/app/aidant/actions";

export function QuestionForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!text.trim()) return;
    startTransition(async () => {
      await submitCaregiverQuestion(text);
      setSent(true);
    });
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="J'ai une question" backHref="/aidant" />
      <main className="flex flex-col gap-6 p-4">
        {sent ? (
          <>
            <p className="text-lg">
              Votre question a été envoyée au professionnel. Vous recevrez une
              réponse prochainement.
            </p>
            <Button onClick={() => router.push("/aidant")} fullWidth>
              Retour
            </Button>
          </>
        ) : (
          <>
            <p className="text-text-muted">
              Posez une question ponctuelle sans attendre la prochaine visite.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex : Comment aider mon proche à se lever en sécurité ?"
              className="min-h-32 rounded-xl border border-cream-dark bg-white p-4"
            />
            <Button
              onClick={submit}
              disabled={!text.trim() || pending}
              fullWidth
              size="lg"
            >
              {pending ? "Envoi…" : "Envoyer"}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
