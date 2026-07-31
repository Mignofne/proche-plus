import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AUTONOMY_LABELS, AUTONOMY_STATUS_LABELS } from "@/lib/constants";
import { ProAutonomyAlerts } from "./ProAutonomyAlerts";

export default async function ProDashboardPage() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "professional" && session.role !== "admin_etablissement")
  ) {
    redirect("/connexion?role=pro");
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
    include: { establishment: true, user: true },
  });
  if (!professional) redirect("/connexion?role=pro");

  const estId = professional.establishmentId;
  const isAdminEtablissement =
    session.role === "admin_etablissement" ||
    professional.role === "admin_etablissement";

  const [patients, questions, activeCaregivers, autonomyAlerts] =
    await Promise.all([
      prisma.patient.findMany({
        where: { establishmentId: estId },
        include: {
          caregivers: {
            include: { caregiver: { include: { user: true } } },
          },
          objectives: { where: { isCurrent: true } },
          visits: {
            orderBy: { date: "desc" },
            take: 1,
            include: {
              transmission: {
                include: { feedbacks: true, actions: true },
              },
            },
          },
        },
        orderBy: { lastName: "asc" },
      }),
      prisma.question.count({
        where: {
          status: "en_attente",
          OR: [
            { professionalId: professional.id },
            {
              caregiver: {
                patients: { some: { patient: { establishmentId: estId } } },
              },
            },
          ],
        },
      }),
      prisma.caregiver.count({
        where: {
          status: "actif",
          patients: { some: { patient: { establishmentId: estId } } },
        },
      }),
      prisma.autonomyAlert.findMany({
        where: {
          status: "en_attente",
          audience: "professionnel",
          patient: { establishmentId: estId },
        },
        include: { patient: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const nav = [
    { href: "/pro", label: "Patients" },
    { href: "/pro/patient/nouveau", label: "Nouveau patient" },
    { href: "/pro/questions", label: "Questions" },
    ...(isAdminEtablissement
      ? [{ href: "/admin-etablissement", label: "Pilotage établissement" }]
      : []),
  ];

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title="Proche+ Pro"
        subtitle={professional.establishment.name}
        nav={nav}
      />

      <main className="mx-auto max-w-5xl animate-fade-up p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Mascot pose="encourage" size="sm" animated />
            <div>
              <h1 className="text-xl font-bold text-teal-dark">
                Bonjour {professional.user.firstName}
              </h1>
              <p className="text-sm text-text-muted">
                {isAdminEtablissement
                  ? "Professionnel · accès pilotage établissement"
                  : "Espace professionnel"}
              </p>
            </div>
          </div>
          <ButtonLink href="/pro/patient/nouveau">Nouveau patient</ButtonLink>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Patients", value: patients.length },
            { label: "Familles activées", value: activeCaregivers },
            { label: "Questions en attente", value: questions },
            {
              label: "Profils à confirmer",
              value: autonomyAlerts.filter((a) => a.type === "profil_a_confirmer")
                .length,
            },
          ].map((stat) => (
            <Card key={stat.label} className="animate-soft-pop">
              <p className="text-2xl font-bold text-teal">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>

        <ProAutonomyAlerts
          alerts={autonomyAlerts.map((a) => ({
            id: a.id,
            type: a.type,
            message: a.message,
            proposedLevel: a.proposedLevel,
            patientId: a.patientId,
            patientName: `${a.patient.firstName} ${a.patient.lastName}`,
            currentLevel: a.patient.autonomyLevel,
          }))}
        />

        {isAdminEtablissement && (
          <Card className="mb-6 border-teal/30 bg-teal/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Mascot pose="vigilance" size="sm" />
                <div>
                  <SectionTitle>Pilotage établissement</SectionTitle>
                  <p className="mt-1 text-sm text-text-muted">
                    File d&apos;actions familles, questions, trous de boucle
                  </p>
                </div>
              </div>
              <ButtonLink href="/admin-etablissement" variant="secondary">
                Ouvrir
              </ButtonLink>
            </div>
          </Card>
        )}

        <SectionTitle>Mes patients</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          {patients.map((patient) => {
            const transmission = patient.visits[0]?.transmission;
            const unread = transmission && !transmission.readAt;
            const hasDifficulty = transmission?.feedbacks.some(
              (f) =>
                !f.treated &&
                (f.outcome === "difficile" || f.outcome === "non_essaye")
            );
            const hasAction = (transmission?.actions?.length ?? 0) > 0;
            const isProvisional = patient.autonomyLevelStatus === "provisoire";

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
                    {AUTONOMY_LABELS[patient.autonomyLevel]}
                    {patient.girLevel ? ` · GIR ${patient.girLevel}` : ""}
                    {patient.autonomyLevelStatus
                      ? ` · ${AUTONOMY_STATUS_LABELS[patient.autonomyLevelStatus]}`
                      : ""}
                  </p>
                  <p className="text-sm text-text-muted">
                    Aidant :{" "}
                    {patient.caregivers[0]
                      ? `${patient.caregivers[0].caregiver.user.firstName} ${patient.caregivers[0].caregiver.user.lastName}`
                      : "aucun"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {isProvisional && (
                      <span className="rounded-full bg-sun/40 px-2 py-0.5 text-xs font-semibold">
                        Provisoire
                      </span>
                    )}
                    {unread && (
                      <span className="rounded-full bg-sun/30 px-2 py-0.5 text-xs">
                        Non consultée
                      </span>
                    )}
                    {hasDifficulty && (
                      <span className="rounded-full bg-terracotta/20 px-2 py-0.5 text-xs">
                        Difficulté
                      </span>
                    )}
                    {hasAction && (
                      <span className="rounded-full bg-teal/15 px-2 py-0.5 text-xs">
                        Action aidant
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink
                    href={`/pro/patient/${patient.id}`}
                    variant="ghost"
                    size="sm"
                  >
                    Fiche
                  </ButtonLink>
                  <ButtonLink
                    href={`/pro/patient/${patient.id}/edit`}
                    variant="ghost"
                    size="sm"
                  >
                    Modifier
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
          {!patients.length && (
            <Card>
              <p className="text-text-muted">
                Aucun patient — créez le premier.
              </p>
              <Link href="/pro/patient/nouveau" className="mt-2 inline-block text-teal">
                Nouveau patient →
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
