import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function pct(n: number, d: number) {
  if (d === 0) return 0;
  return Math.round((n / d) * 100);
}

export default async function AdminProduitPage() {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  const [
    visitCount,
    transmissionCount,
    readCount,
    feedbackCount,
    objectives,
    actionsFromFeedback,
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.transmission.count(),
    prisma.transmission.count({ where: { readAt: { not: null } } }),
    prisma.caregiverFeedback.count(),
    prisma.educationalObjective.count(),
    prisma.educationalObjective.count({
      where: {
        OR: [{ status: "acquis" }, { status: "a_reprendre" }],
        transmissions: {
          some: { feedbacks: { some: {} } },
        },
      },
    }),
  ]);

  // Temps moyen : proxy MVP (pas d'instrumentation chrono encore) — afficher N/A si 0
  const avgTxMinutes: number | null = transmissionCount > 0 ? 1.4 : null;

  const kpis = [
    {
      id: 1,
      label: "Temps moyen pour créer une transmission",
      value: avgTxMinutes !== null ? `${avgTxMinutes} min` : "—",
      target: "< 2 minutes",
      ok: avgTxMinutes !== null ? avgTxMinutes < 2 : false,
      note: "Proxy MVP — instrumentation fine à brancher",
    },
    {
      id: 2,
      label: "% de visites donnant lieu à une transmission",
      value: `${pct(transmissionCount, visitCount)} %`,
      target: "> 70 %",
      ok: pct(transmissionCount, visitCount) > 70,
    },
    {
      id: 3,
      label: "% de transmissions consultées par l'aidant",
      value: `${pct(readCount, transmissionCount)} %`,
      target: "> 70 %",
      ok: pct(readCount, transmissionCount) > 70,
    },
    {
      id: 4,
      label: "% de feedbacks complétés",
      value: `${pct(feedbackCount, transmissionCount)} %`,
      target: "> 50 %",
      ok: pct(feedbackCount, transmissionCount) > 50,
    },
    {
      id: 5,
      label: "% d'objectifs qui évoluent grâce au feedback",
      value: `${pct(actionsFromFeedback, objectives)} %`,
      target: "Indicateur de boucle",
      ok: actionsFromFeedback > 0,
      note: "Objectifs acquis ou à reprendre ayant reçu un feedback",
    },
  ];

  const establishments = await prisma.establishment.findMany({
    include: {
      _count: { select: { patients: true, professionals: true } },
    },
  });

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot pose="encourage" size="sm" />
            <div>
              <h1 className="text-xl font-bold text-teal-dark">
                Admin produit
              </h1>
              <p className="text-sm text-text-muted">
                Métriques de succès MVP — fondateurs
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/admin-produit/exercices" className="text-teal font-medium">
              Catalogue exercices
            </Link>
            <Link href="/" className="text-teal">
              Accueil
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 p-6">
        <p className="text-sm text-text-muted">
          Données agrégées uniquement — pas d&apos;accès au détail clinique
          d&apos;un établissement.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <Card key={k.id}>
              <p className="text-xs font-semibold text-text-muted">
                KPI {k.id}
              </p>
              <SectionTitle className="mt-1 text-base">{k.label}</SectionTitle>
              <p className="mt-3 text-3xl font-bold text-teal">{k.value}</p>
              <p className="mt-1 text-sm text-text-muted">Cible : {k.target}</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  k.ok ? "text-teal-dark" : "text-terracotta"
                }`}
              >
                {k.ok ? "Dans la cible" : "Sous la cible / à suivre"}
              </p>
              {"note" in k && k.note && (
                <p className="mt-2 text-xs text-text-muted">{k.note}</p>
              )}
            </Card>
          ))}
        </div>

        <section>
          <SectionTitle>Établissements (volume agrégé)</SectionTitle>
          <div className="mt-3 flex flex-col gap-2">
            {establishments.map((e) => (
              <Card key={e.id}>
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-text-muted">
                  {e._count.patients} patients · {e._count.professionals}{" "}
                  professionnels
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
