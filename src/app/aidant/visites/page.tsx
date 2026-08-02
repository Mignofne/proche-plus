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

const OUTCOME_LABELS = {
  reussi: "Réussi",
  essai: "Essai, avec difficulté",
  echec: "Échec",
} as const;

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

  const visits = await listVisitCheckInsForCaregiver(caregiver.id);

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mes dernières visites" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <p className="text-sm text-text-muted">
            Les exercices que vous avez faits avec votre proche, visite par
            visite.
          </p>
        </div>

        {visits.length === 0 ? (
          <Card>
            <SectionTitle>Pas encore de visite enregistrée</SectionTitle>
            <p className="mt-2 text-sm text-text-muted">
              Quand vous lancez le mode visite et faites un exercice, il
              apparaît ici.
            </p>
            <ButtonLink href="/aidant/mode-visite" className="mt-4" fullWidth>
              Mode visite
            </ButtonLink>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {visits.map((visit) => {
              const attempts = visit.exerciseAttempts;
              const showReported =
                visit.blocked && attempts.length === 0;

              return (
                <li
                  key={visit.id}
                  className="rounded-2xl border border-cream-dark bg-white p-4"
                >
                  <p className="text-sm font-semibold text-teal-dark">
                    {new Date(visit.createdAt).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mt-1 font-medium">
                    {visit.patient.firstName} {visit.patient.lastName}
                  </p>
                  <p className="mt-2 text-sm text-text-muted">
                    Fatigue : {labelForCheckInScore(visit.fatigueScore)} ·
                    Douleur : {labelForCheckInScore(visit.painScore)}
                  </p>

                  {showReported ? (
                    <p className="mt-3 text-sm font-medium text-terracotta">
                      Visite reportée — à bientôt
                    </p>
                  ) : attempts.length === 0 ? (
                    <p className="mt-3 text-sm text-text-muted">
                      Aucun exercice enregistré pour cette visite.
                    </p>
                  ) : (
                    <ul className="mt-3 flex flex-col gap-2 border-t border-cream-dark pt-3">
                      {attempts.map((attempt) => {
                        const exercise = attempt.patientExercise.exercise;
                        return (
                          <li key={attempt.id} className="text-sm">
                            <p className="font-medium text-text">
                              <span className="text-teal-dark">
                                {exercise.theme.label}
                              </span>
                              {" · "}
                              {exercise.name}
                            </p>
                            <p className="text-text-muted">
                              {OUTCOME_LABELS[attempt.outcome]}
                              {" · "}
                              {new Date(attempt.createdAt).toLocaleTimeString(
                                "fr-FR",
                                { timeStyle: "short" }
                              )}
                            </p>
                            {attempt.note ? (
                              <p className="mt-0.5 text-text-muted italic">
                                {attempt.note}
                              </p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
