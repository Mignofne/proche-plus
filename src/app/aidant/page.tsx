import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { getSession } from "@/lib/auth";
import { getMicrocopy } from "@/lib/microcopy";
import { prisma } from "@/lib/prisma";
import {
  caregiverNeedsOnboarding,
  getCaregiverByUserId,
  getCaregiverTransmissions,
} from "@/lib/services/aidant";
import { AutonomyReviewCard } from "./AutonomyReviewCard";
import { CaregiverAutonomyAlerts } from "./CaregiverAutonomyAlerts";

export default async function AidantHomePage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  const caregiver = await getCaregiverByUserId(session.userId);
  if (!caregiver) redirect("/connexion?role=aidant");

  const transmissions = await getCaregiverTransmissions(caregiver.id);
  const patient = caregiver.patients[0]?.patient;
  const latestTransmission = transmissions[0];
  const unread = latestTransmission && !latestTransmission.readAt;

  const reviewDue =
    patient?.autonomyLevelReviewDueAt &&
    new Date(patient.autonomyLevelReviewDueAt) <= new Date();

  const autonomyAlerts = patient
    ? await prisma.autonomyAlert.findMany({
        where: {
          patientId: patient.id,
          audience: "aidant",
          status: "en_attente",
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

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

        {patient && reviewDue && (
          <AutonomyReviewCard
            patientId={patient.id}
            patientFirstName={patient.firstName}
          />
        )}

        <CaregiverAutonomyAlerts
          alerts={autonomyAlerts.map((a) => ({
            id: a.id,
            type: a.type,
            message: a.message,
            proposedLevel: a.proposedLevel,
          }))}
        />

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

        <Card className="border-teal/20 bg-white">
          <SectionTitle>Mes proches</SectionTitle>
          <p className="mt-2 text-sm text-text-muted">
            Ajouter, modifier ou supprimer la personne que vous accompagnez.
          </p>
          <ButtonLink href="/aidant/proches" className="mt-4" fullWidth>
            Gérer mes proches
          </ButtonLink>
        </Card>

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
            <p className="mt-2 font-semibold">
              {patient.objectives[0].nextStep}
            </p>
            {patient.objectives[0].instructions && (
              <>
                <p className="mt-3 text-sm font-semibold text-teal-dark">
                  En pratique :
                </p>
                <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
                  {patient.objectives[0].instructions
                    .split(/\s*\d+\)\s*/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ol>
              </>
            )}
          </Card>
        )}

        <Link href="/" className="text-center text-sm text-text-muted">
          Déconnexion
        </Link>
      </main>
    </div>
  );
}
