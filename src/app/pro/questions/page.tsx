"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Question = {
  id: string;
  text: string;
  caregiver: { user: { firstName: string } };
};

function QuestionsContent() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("id");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);

  const question = questions.find((q) => q.id === questionId) ?? questions[0];

  useEffect(() => {
    fetch("/api/pro")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions));
  }, []);

  async function submit() {
    if (!question || !answer.trim()) return;
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
  }

  if (!question) {
    return <main className="p-8">Aucune question en attente.</main>;
  }

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <Link href="/pro" className="text-teal">
          ← Tableau de bord
        </Link>
        <h1 className="mt-2 text-xl font-bold">Répondre à une question</h1>
      </header>
      <main className="mx-auto max-w-2xl p-6">
        {done ? (
          <Card>
            <p>Réponse envoyée. La question est marquée comme traitée.</p>
            <Link href="/pro" className="mt-4 inline-block text-teal">
              Retour au tableau de bord
            </Link>
          </Card>
        ) : (
          <>
            <Card>
              <p className="text-sm text-text-muted">
                {question.caregiver.user.firstName}
              </p>
              <p className="mt-2 text-lg">{question.text}</p>
            </Card>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Votre réponse…"
              className="mt-4 min-h-32 w-full rounded-xl border border-cream-dark bg-white p-4"
            />
            <div className="mt-4 flex gap-3">
              <Button onClick={submit} disabled={!answer.trim()} fullWidth>
                Répondre
              </Button>
            </div>
            <p className="mt-4 text-center text-sm text-text-muted">
              Ou : ajouter à la prochaine visite · associer à une ressource
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<main className="p-8">Chargement…</main>}>
      <QuestionsContent />
    </Suspense>
  );
}
