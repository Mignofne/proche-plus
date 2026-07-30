import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  archive: "Archivé",
};

export default async function AdminExercicesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  const [themes, exercises, scales] = await Promise.all([
    prisma.theme.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.exercise.findMany({
      include: { theme: true, autonomyScale: true },
      orderBy: [
        { theme: { displayOrder: "asc" } },
        { autonomyScale: { displayOrder: "asc" } },
        { tier: "asc" },
      ],
    }),
    prisma.autonomyScale.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Mascot pose="encourage" size="sm" />
            <div>
              <h1 className="text-xl font-bold text-teal-dark">
                Catalogue exercices
              </h1>
              <p className="text-sm text-text-muted">
                Thèmes · niveaux · matrice évolutive
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/admin-produit" className="text-teal">
              KPIs
            </Link>
            <ButtonLink href="/admin-produit/exercices/nouveau" size="sm">
              Nouvel exercice
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 p-6">
        <section>
          <SectionTitle>Thèmes ({themes.length})</SectionTitle>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {themes.map((t) => (
              <Card key={t.id}>
                <p className="font-medium">
                  {t.icon ? `${t.icon} ` : ""}
                  {t.label}
                  {!t.active && (
                    <span className="ml-2 text-xs text-terracotta">inactif</span>
                  )}
                </p>
                <p className="text-xs text-text-muted">{t.slug}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Niveaux d&apos;autonomie</SectionTitle>
          <div className="mt-3 flex flex-wrap gap-2">
            {scales.map((s) => (
              <span
                key={s.id}
                className="rounded-xl bg-white px-3 py-2 text-sm border border-cream-dark"
              >
                <strong>{s.code}</strong> — {s.label}
              </span>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Exercices ({exercises.length})</SectionTitle>
          <div className="mt-3 flex flex-col gap-2">
            {exercises.map((ex) => (
              <Link
                key={ex.id}
                href={`/admin-produit/exercices/${ex.id}`}
                className="rounded-2xl border border-cream-dark bg-white p-4 transition-colors hover:border-teal"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {ex.theme.label} · {ex.autonomyScale.code}/p{ex.tier} —{" "}
                    {ex.name}
                  </p>
                  <span className="text-xs font-semibold text-teal-dark">
                    {STATUS_LABEL[ex.status] ?? ex.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted line-clamp-1">
                  {ex.objective}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
