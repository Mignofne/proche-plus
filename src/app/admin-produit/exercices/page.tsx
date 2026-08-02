import Link from "next/link";
import { redirect } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Card";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureCatalogReady } from "@/lib/exercises/ensure-catalog";
import { ThemeManager } from "./ThemeManager";
import { ScaleManager } from "./ScaleManager";
import { ExerciseBulkList } from "./ExerciseBulkList";

const STATUS_SORT: Record<string, number> = {
  a_valider: 0,
  brouillon: 1,
  publie: 2,
  archive: 3,
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

  // Réaligne les brouillons IA encore marqués « publie » (ancien import CSV)
  await ensureCatalogReady();

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

  const pendingCount = exercises.filter((ex) => ex.status === "a_valider").length;

  const filtered = exercises
    .filter((ex) => {
      if (themeFilter && ex.themeId !== themeFilter) return false;
      if (statusFilter && ex.status !== statusFilter) return false;
      if (q) {
        const hay = `${ex.name} ${ex.objective} ${ex.theme.label}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const byStatus =
        (STATUS_SORT[a.status] ?? 9) - (STATUS_SORT[b.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      return a.name.localeCompare(b.name, "fr");
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

          {pendingCount > 0 && statusFilter !== "a_valider" && (
            <Link
              href="/admin-produit/exercices?status=a_valider"
              className="mt-3 flex items-center justify-between rounded-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta transition-colors hover:border-terracotta"
            >
              <span>File à valider — brouillons IA en attente</span>
              <span className="rounded-full bg-terracotta px-2.5 py-0.5 text-xs text-white">
                {pendingCount}
              </span>
            </Link>
          )}

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
              <option value="a_valider">
                À valider{pendingCount ? ` (${pendingCount})` : ""}
              </option>
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

          <div className="mt-3">
            <ExerciseBulkList
              exercises={filtered.map((ex) => ({
                id: ex.id,
                name: ex.name,
                objective: ex.objective,
                status: ex.status,
                tier: ex.tier,
                validatedBy: ex.validatedBy,
                themeLabel: ex.theme.label,
                scaleCode: ex.autonomyScale.code,
              }))}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
