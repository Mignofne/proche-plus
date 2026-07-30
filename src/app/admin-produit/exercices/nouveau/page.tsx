import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ExerciseForm } from "../ExerciseForm";

export default async function NouveauExercicePage() {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  const [themes, scales, exercises] = await Promise.all([
    prisma.theme.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.autonomyScale.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.exercise.findMany({
      include: { theme: true, autonomyScale: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-dvh bg-cream">
      <main className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/admin-produit/exercices" className="text-sm text-teal">
          ← Catalogue
        </Link>
        <Card>
          <SectionTitle>Nouvel exercice</SectionTitle>
          <div className="mt-4">
            <ExerciseForm
              themes={themes.map((t) => ({ id: t.id, label: t.label }))}
              scales={scales.map((s) => ({
                id: s.id,
                label: `${s.code} — ${s.label}`,
              }))}
              exerciseOptions={exercises.map((ex) => ({
                id: ex.id,
                label: `${ex.theme.label} · ${ex.autonomyScale.code}/p${ex.tier} — ${ex.name}`,
              }))}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
