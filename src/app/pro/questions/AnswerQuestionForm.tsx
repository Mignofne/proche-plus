"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function AnswerQuestionForm({
  question,
}: {
  question: { id: string; text: string; caregiverName: string };
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!answer.trim()) return;
    startTransition(async () => {
      await fetch("/api/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer_question",
          questionId: question.id,
          answer,
          status: "traitee",
        }),
      });
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return (
      <Card>
        <p>Réponse envoyée. La question est marquée comme traitée.</p>
        <Link href="/pro" className="mt-4 inline-block text-teal">
          Retour au tableau de bord
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <p className="text-sm text-text-muted">{question.caregiverName}</p>
        <p className="mt-2 text-lg">{question.text}</p>
      </Card>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Votre réponse…"
        className="mt-4 min-h-32 w-full rounded-xl border border-cream-dark bg-white p-4"
      />
      <div className="mt-4">
        <Button onClick={submit} disabled={!answer.trim() || pending} fullWidth>
          {pending ? "Envoi…" : "Répondre"}
        </Button>
      </div>
    </>
  );
}
