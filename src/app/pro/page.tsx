"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";

type ProData = {
  establishment: { name: string };
  stats: {
    patients: number;
    activeCaregivers: number;
    pendingQuestions: number;
    difficulties: number;
  };
  patients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    caregivers: Array<{
      caregiver: { user: { firstName: string; lastName: string } };
    }>;
    visits: Array<{
      transmission: {
        readAt: string | null;
        feedbacks: Array<{ outcome: string; treated: boolean }>;
      } | null;
    }>;
  }>;
  questions: Array<{
    id: string;
    text: string;
    caregiver: { user: { firstName: string } };
  }>;
};

export default function ProDashboardPage() {
  const [data, setData] = useState<ProData | null>(null);

  useEffect(() => {
    fetch("/api/pro")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <main className="p-8">Chargement du tableau de bord…</main>;
  }

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot pose="welcome" size="sm" />
            <div>
              <h1 className="text-xl font-bold text-teal-dark">Proche+ Pro</h1>
              <p className="text-sm text-text-muted">{data.establishment.name}</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-teal">
            Déconnexion
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Patients accompagnés", value: data.stats.patients },
            { label: "Familles activées", value: data.stats.activeCaregivers },
            {
              label: "Questions en attente",
              value: data.stats.pendingQuestions,
            },
            {
              label: "Difficultés signalées",
              value: data.stats.difficulties,
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-2xl font-bold text-teal">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>

        <section className="mt-8">
          <SectionTitle>Mes patients</SectionTitle>
          <div className="mt-4 flex flex-col gap-3">
            {data.patients.map((patient) => {
              const transmission = patient.visits[0]?.transmission;
              const unread = transmission && !transmission.readAt;
              const hasDifficulty = transmission?.feedbacks.some(
                (f) =>
                  !f.treated &&
                  (f.outcome === "difficile" || f.outcome === "non_essaye")
              );

              return (
                <Card
                  key={patient.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-text-muted">
                      Aidant :{" "}
                      {patient.caregivers[0]?.caregiver.user.firstName}{" "}
                      {patient.caregivers[0]?.caregiver.user.lastName}
                    </p>
                    <div className="mt-1 flex gap-2">
                      {unread && (
                        <span className="rounded-full bg-sun/30 px-2 py-0.5 text-xs">
                          Transmission non consultée
                        </span>
                      )}
                      {hasDifficulty && (
                        <span className="rounded-full bg-terracotta/20 px-2 py-0.5 text-xs">
                          Difficulté signalée
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ButtonLink
                      href={`/pro/patient/${patient.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      Fiche
                    </ButtonLink>
                    <ButtonLink
                      href={`/pro/transmission/${patient.id}`}
                      size="sm"
                    >
                      Transmettre
                    </ButtonLink>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {data.questions.length > 0 && (
          <section className="mt-8">
            <SectionTitle>Questions en attente</SectionTitle>
            <div className="mt-4 flex flex-col gap-3">
              {data.questions.map((q) => (
                <Card key={q.id}>
                  <p className="text-sm text-text-muted">
                    {q.caregiver.user.firstName}
                  </p>
                  <p className="mt-1">{q.text}</p>
                  <ButtonLink
                    href={`/pro/questions?id=${q.id}`}
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                  >
                    Répondre
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
