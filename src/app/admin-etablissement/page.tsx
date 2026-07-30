import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Card, SectionTitle } from "@/components/ui/Card";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminEtablissementPage() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "admin_etablissement" &&
      session.role !== "professional")
  ) {
    redirect("/connexion?role=pro");
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
    include: { establishment: true, user: true },
  });
  if (!professional) redirect("/connexion?role=pro");

  if (
    session.role !== "admin_etablissement" &&
    professional.role !== "admin_etablissement"
  ) {
    redirect("/pro");
  }

  const estId = professional.establishmentId;

  const [pendingQuestions, untreatedDifficulties, inactiveFamilies, patients] =
    await Promise.all([
      prisma.question.findMany({
        where: {
          status: "en_attente",
          caregiver: {
            patients: {
              some: { patient: { establishmentId: estId } },
            },
          },
        },
        include: {
          caregiver: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.caregiverFeedback.findMany({
        where: {
          treated: false,
          outcome: { in: ["difficile", "non_essaye"] },
          transmission: {
            visit: { patient: { establishmentId: estId } },
          },
        },
        include: {
          caregiver: { include: { user: true } },
          transmission: {
            include: { visit: { include: { patient: true } } },
          },
        },
      }),
      prisma.caregiver.findMany({
        where: {
          status: { in: ["invite", "parcours_propose_non_active"] },
          patients: { some: { patient: { establishmentId: estId } } },
        },
        include: {
          user: true,
          patients: { include: { patient: true } },
        },
      }),
      prisma.patient.findMany({
        where: { establishmentId: estId },
        include: {
          visits: {
            orderBy: { date: "desc" },
            take: 1,
            include: { transmission: true },
          },
          caregivers: true,
        },
      }),
    ]);

  const withoutRecentTx = patients.filter((p) => {
    const tx = p.visits[0]?.transmission;
    if (!tx) return true;
    const days =
      (Date.now() - new Date(tx.sentAt).getTime()) / (1000 * 60 * 60 * 24);
    return days > 7;
  });

  const activeFamilies = await prisma.caregiver.count({
    where: {
      status: "actif",
      patients: { some: { patient: { establishmentId: estId } } },
    },
  });

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title="Pilotage établissement"
        subtitle={professional.establishment.name}
        nav={[
          { href: "/pro", label: "Espace pro" },
          { href: "/admin-etablissement", label: "File d'actions" },
        ]}
      />

      <main className="mx-auto max-w-4xl animate-fade-up space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Mascot pose="vigilance" size="sm" animated />
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span>{patients.length} patients</span>
            <span>{activeFamilies} familles activées</span>
            <span>{inactiveFamilies.length} non activées</span>
          </div>
        </div>

        <section>
          <SectionTitle>1. À traiter aujourd&apos;hui</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {pendingQuestions.map((q) => (
              <Card key={q.id}>
                <p className="text-xs font-semibold uppercase text-terracotta">
                  Question en attente
                </p>
                <p className="mt-1 font-medium">
                  {q.caregiver.user.firstName} {q.caregiver.user.lastName}
                </p>
                <p className="mt-1">{q.text}</p>
                <Link href="/pro/questions" className="mt-2 inline-block text-teal">
                  Voir côté pro →
                </Link>
              </Card>
            ))}
            {untreatedDifficulties.map((f) => (
              <Card key={f.id}>
                <p className="text-xs font-semibold uppercase text-terracotta">
                  Difficulté signalée
                </p>
                <p className="mt-1">
                  {f.transmission.visit.patient.firstName}{" "}
                  {f.transmission.visit.patient.lastName} — retour{" "}
                  {f.outcome}
                </p>
              </Card>
            ))}
            {!pendingQuestions.length && !untreatedDifficulties.length && (
              <Card>
                <p className="text-text-muted">Rien à traiter pour le moment.</p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>2. Familles non activées</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {inactiveFamilies.map((c) => (
              <Card key={c.id}>
                <p className="font-medium">
                  {c.user.firstName} {c.user.lastName}
                </p>
                <p className="text-sm text-text-muted">
                  Statut : {c.status} ·{" "}
                  {c.patients[0]?.patient.firstName}{" "}
                  {c.patients[0]?.patient.lastName}
                </p>
              </Card>
            ))}
            {!inactiveFamilies.length && (
              <Card>
                <p className="text-text-muted">Toutes les familles sont actives.</p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>3. Patients sans transmission récente</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {withoutRecentTx.map((p) => (
              <Card key={p.id}>
                <p className="font-medium">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-sm text-text-muted">
                  Aucune transmission ou dernière &gt; 7 jours
                </p>
                <Link
                  href={`/pro/transmission/${p.id}`}
                  className="mt-2 inline-block text-teal"
                >
                  Demander une transmission →
                </Link>
              </Card>
            ))}
            {!withoutRecentTx.length && (
              <Card>
                <p className="text-text-muted">Boucle à jour pour tous.</p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>4. Invitation aidant</SectionTitle>
          <Card className="mt-3">
            <p className="text-sm text-text-muted">
              Invitez un aidant dès l&apos;admission — lien SMS / email (MVP :
              tracé côté pro).
            </p>
            <Link
              href="/pro"
              className="mt-4 inline-flex touch-target items-center justify-center rounded-2xl bg-teal px-6 py-3 font-semibold text-white"
            >
              Ouvrir l&apos;espace pro pour inviter
            </Link>
          </Card>
        </section>
      </main>
    </div>
  );
}
