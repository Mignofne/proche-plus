"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  AUTONOMY_LABELS,
  MESSAGE_SECTION_LABELS,
  SKILL_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";

type PatientDetail = {
  id: string;
  firstName: string;
  lastName: string;
  autonomyLevel: string;
  objectives: Array<{
    skill: string;
    status: string;
    instructions: string;
    nextStep: string | null;
  }>;
  visits: Array<{
    date: string;
    transmission: {
      readAt: string | null;
      sentAt: string;
      messages: Array<{ section: string; content: string }>;
      feedbacks: Array<{
        id: string;
        outcome: string;
        difficulties: string;
        wantsToDiscuss: boolean;
        treated: boolean;
      }>;
      comprehensionChecks: Array<{
        result: string;
        comment: string | null;
      }>;
    } | null;
  }>;
};

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<PatientDetail | null>(null);

  useEffect(() => {
    fetch("/api/pro")
      .then((r) => r.json())
      .then((data) => {
        const p = data.patients.find((x: PatientDetail) => x.id === patientId);
        setPatient(p ?? null);
      });
  }, [patientId]);

  if (!patient) {
    return <main className="p-8">Chargement…</main>;
  }

  const objective = patient.objectives[0];

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <Link href="/pro" className="text-teal">
            ← Tableau de bord
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-text-muted">
            {AUTONOMY_LABELS[patient.autonomyLevel]}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-6">
        {objective && (
          <Card className="mb-6">
            <SectionTitle>Objectif pédagogique en cours</SectionTitle>
            <p className="mt-2">
              <strong>{SKILL_LABELS[objective.skill]}</strong> —{" "}
              {STATUS_LABELS[objective.status]}
            </p>
            <p className="mt-2">{objective.instructions}</p>
            {objective.nextStep && (
              <p className="mt-2 text-sm text-text-muted">
                Prochaine étape : {objective.nextStep}
              </p>
            )}
          </Card>
        )}

        <SectionTitle>Historique des transmissions</SectionTitle>
        <div className="mt-4 flex flex-col gap-4">
          {patient.visits
            .filter((v) => v.transmission)
            .map((visit) => {
              const t = visit.transmission!;
              return (
                <Card key={visit.date}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                      {new Date(t.sentAt).toLocaleDateString("fr-FR")}
                    </p>
                    {!t.readAt && (
                      <span className="text-xs text-terracotta">
                        Non consultée
                      </span>
                    )}
                  </div>
                  {t.messages.map((m) => (
                    <p key={m.section} className="mt-2 text-sm">
                      <strong>
                        {MESSAGE_SECTION_LABELS[m.section]} :
                      </strong>{" "}
                      {m.content}
                    </p>
                  ))}
                  {t.comprehensionChecks.map((c, i) => (
                    <p key={i} className="mt-2 text-sm text-teal">
                      Compréhension : {c.result}
                      {c.comment && ` — ${c.comment}`}
                    </p>
                  ))}
                  {t.feedbacks.map((f) => (
                    <div
                      key={f.id}
                      className="mt-2 rounded-xl bg-cream p-3 text-sm"
                    >
                      Feedback : {f.outcome}
                      {f.wantsToDiscuss && " — souhaite en reparler"}
                      {!f.treated && (
                        <span className="ml-2 text-terracotta">
                          (non traité)
                        </span>
                      )}
                    </div>
                  ))}
                </Card>
              );
            })}
        </div>

        <Link
          href={`/pro/transmission/${patient.id}`}
          className="mt-6 inline-block rounded-2xl bg-teal px-6 py-3 font-semibold text-white"
        >
          Nouvelle transmission
        </Link>
      </main>
    </div>
  );
}
