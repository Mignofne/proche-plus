import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { getSession } from "@/lib/auth";
import {
  caregiverNeedsOnboarding,
  getCaregiverByUserId,
  listVisitCheckInsForCaregiver,
} from "@/lib/services/aidant";
import { labelForCheckInScore } from "@/lib/visit-checkin";

export default async function AidantVisitesPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  const caregiver = await getCaregiverByUserId(session.userId);
  if (!caregiver) redirect("/connexion?role=aidant");

  const checkIns = await listVisitCheckInsForCaregiver(caregiver.id);

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mes dernières visites" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <p className="text-sm text-text-muted">
            Retrouvez vos check-ins fatigue et douleur, et ce qui s&apos;est
            passé.
          </p>
        </div>

        {checkIns.length === 0 ? (
          <Card>
            <SectionTitle>Pas encore de visite enregistrée</SectionTitle>
            <p className="mt-2 text-sm text-text-muted">
              Quand vous lancez le mode visite, le ressenti de votre proche
              apparaît ici.
            </p>
            <ButtonLink href="/aidant/mode-visite" className="mt-4" fullWidth>
              Mode visite
            </ButtonLink>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {checkIns.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-cream-dark bg-white p-4"
              >
                <p className="text-sm font-semibold text-teal-dark">
                  {new Date(c.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="mt-1 font-medium">
                  {c.patient.firstName} {c.patient.lastName}
                </p>
                <p className="mt-2 text-sm text-text-muted">
                  Fatigue : {labelForCheckInScore(c.fatigueScore)} · Douleur :{" "}
                  {labelForCheckInScore(c.painScore)}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    c.blocked ? "text-terracotta" : "text-teal-dark"
                  }`}
                >
                  {c.blocked
                    ? "Visite reportée — à bientôt"
                    : "Exercices possibles"}
                </p>
                {c.transmissionId && (
                  <Link
                    href={`/aidant/transmission/${c.transmissionId}`}
                    className="mt-3 inline-block text-sm font-medium text-teal"
                  >
                    Voir la transmission →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
