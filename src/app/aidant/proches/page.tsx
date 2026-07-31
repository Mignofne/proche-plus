import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { AppHeader } from "@/components/layout/AppHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { caregiverNeedsOnboarding } from "@/lib/services/aidant";
import { AUTONOMY_LABELS } from "@/lib/constants";

export default async function ProchesListPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
    include: {
      patients: {
        include: { patient: true },
        orderBy: { isPrimary: "desc" },
      },
    },
  });
  if (!caregiver) redirect("/connexion?role=aidant");

  const links = caregiver.patients;

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mes proches" backHref="/aidant" />
      <main className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <p className="text-sm text-text-muted">
            Ajoutez, modifiez ou retirez les personnes que vous accompagnez.
          </p>
        </div>

        {links.length === 0 ? (
          <Card className="text-center">
            <SectionTitle>Aucun proche pour l&apos;instant</SectionTitle>
            <p className="mt-2 text-sm text-text-muted">
              Commencez par ajouter la personne que vous accompagnez.
            </p>
            <ButtonLink
              href="/aidant/proches/nouveau"
              className="mt-4"
              fullWidth
              size="lg"
            >
              Ajouter mon proche
            </ButtonLink>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/aidant/proches/${link.patient.id}/edit`}
                  className="block rounded-2xl border border-cream-dark bg-white p-4 shadow-sm transition-colors hover:border-teal/40"
                >
                  <p className="text-lg font-bold text-teal-dark">
                    {link.patient.firstName} {link.patient.lastName}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {AUTONOMY_LABELS[link.patient.autonomyLevel] ??
                      link.patient.autonomyLevel}
                    {link.relationship ? ` · ${link.relationship}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-medium text-teal">
                    Modifier →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <ButtonLink href="/aidant/proches/nouveau" fullWidth size="lg">
            Ajouter un autre proche
          </ButtonLink>
        )}
      </main>
    </div>
  );
}
