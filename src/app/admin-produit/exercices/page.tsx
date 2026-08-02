import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ThemeManager } from "./ThemeManager";
import { ScaleManager } from "./ScaleManager";

const STATUS_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  a_valider: "À valider",
  publie: "Publié",
  archive: "Archivé",
};

export default async function AdminExercicesPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; status?: string; q?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  const sp = await searchParams;
  const themeFilter = sp.theme || "";
  const statusFilter = sp.status || "";
  const q = (sp.q || "").trim().toLowerCase();

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

  const filtered = exercises.filter((ex) => {
    if (themeFilter && ex.themeId !== themeFilter) return false;
    if (statusFilter && ex.status !== statusFilter) return false;
    if (q) {
      const hay = `${ex.name} ${ex.objective} ${ex.theme.label}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Mascot pose="encourage" size="sm" />
            <div>
              <h1 className="text-xl font-bold text-teal-dark">
                Référentiel exercices
              </h1>
              <p className="text-sm text-text-muted">
                Ajouter · modifier · supprimer thèmes, niveaux et exercices
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
          <SectionTitle>Thèmes</SectionTitle>
          <div className="mt-3">
            <ThemeManager
              themes={themes.map((t) => ({
                id: t.id,
                label: t.label,
                slug: t.slug,
                icon: t.icon,
                displayOrder: t.displayOrder,
                active: t.active,
              }))}
            />
          </div>
        </section>

        <section>
          <SectionTitle>Niveaux d&apos;autonomie</SectionTitle>
          <div className="mt-3">
            <ScaleManager
              scales={scales.map((s) => ({
                id: s.id,
                code: s.code,
                label: s.label,
                patientEnum: s.patientEnum,
                displayOrder: s.displayOrder,
                active: s.active,
              }))}
            />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionTitle>
              Exercices ({filtered.length}
              {filtered.length !== exercises.length
                ? ` / ${exercises.length}`
                : ""}
              )
            </SectionTitle>
            <ButtonLink href="/admin-produit/exercices/nouveau" size="sm">
              + Créer
            </ButtonLink>
          </div>

          <form className="mt-3 flex flex-wrap gap-2" method="get">
            <input
              name="q"
              defaultValue={sp.q || ""}
              placeholder="Rechercher…"
              className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm"
            />
            <select
              name="theme"
              defaultValue={themeFilter}
              className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm"
            >
              <option value="">Tous les thèmes</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="a_valider">À valider</option>
              <option value="publie">Publié</option>
              <option value="brouillon">Brouillon</option>
              <option value="archive">Archivé</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white"
            >
              Filtrer
            </button>
          </form>

          <div className="mt-3 flex flex-col gap-2">
            {filtered.map((ex) => (
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
            {filtered.length === 0 && (
              <Card>
                <p className="text-sm text-text-muted">
                  Aucun exercice pour ces filtres.
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
