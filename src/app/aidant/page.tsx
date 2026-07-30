"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { getMicrocopy } from "@/lib/microcopy";

type AidantData = {
  transmissions: Array<{
    id: string;
    readAt: string | null;
    sentAt: string;
    visit: { patient: { firstName: string; lastName: string } };
  }>;
  caregiver: {
    patients: Array<{
      patient: {
        firstName: string;
        lastName: string;
        objectives: Array<{ nextStep: string | null }>;
      };
    }>;
  };
};

export default function AidantHomePage() {
  const [data, setData] = useState<AidantData | null>(null);

  useEffect(() => {
    fetch("/api/aidant")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const patient = data?.caregiver.patients[0]?.patient;
  const latestTransmission = data?.transmissions[0];
  const unread = latestTransmission && !latestTransmission.readAt;

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Proche+" />
      <main className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-4">
          <Mascot pose="welcome" size="sm" />
          <div>
            <p className="text-sm text-text-muted">
              {getMicrocopy("morningGreeting")}
            </p>
            {patient && (
              <h2 className="text-xl font-bold">
                {patient.firstName} {patient.lastName}
              </h2>
            )}
          </div>
        </div>

        {unread && (
          <Card className="border-teal/30 bg-teal/5">
            <SectionTitle>Nouveau message</SectionTitle>
            <p className="mt-2 text-sm">
              Votre accompagnement après la visite est disponible.
            </p>
            <ButtonLink
              href={`/aidant/transmission/${latestTransmission.id}`}
              className="mt-4"
              fullWidth
            >
              Consulter
            </ButtonLink>
          </Card>
        )}

        <div className="grid gap-4">
          <ButtonLink href="/aidant/mode-visite" size="lg" fullWidth>
            Mode visite
          </ButtonLink>
          <ButtonLink
            href={
              latestTransmission
                ? `/aidant/transmission/${latestTransmission.id}`
                : "/aidant"
            }
            variant="secondary"
            fullWidth
          >
            Dernière transmission
          </ButtonLink>
          <ButtonLink href="/aidant/question" variant="ghost" fullWidth>
            J&apos;ai une question
          </ButtonLink>
          <ButtonLink href="/aidant/feedback" variant="ghost" fullWidth>
            Donner mon retour
          </ButtonLink>
          <ButtonLink href="/aidant/ressources" variant="ghost" fullWidth>
            Bibliothèque de conseils
          </ButtonLink>
        </div>

        {patient?.objectives[0]?.nextStep && (
          <Card>
            <SectionTitle>Objectif en cours</SectionTitle>
            <p className="mt-2">{patient.objectives[0].nextStep}</p>
          </Card>
        )}

        <Link href="/" className="text-center text-sm text-text-muted">
          Déconnexion
        </Link>
      </main>
    </div>
  );
}
