import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResourcesList } from "./ResourcesList";

export default async function ResourcesPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  const resources = await prisma.resource.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Bibliothèque de conseils" backHref="/aidant" />
      <main className="p-4">
        <ResourcesList resources={resources} />
      </main>
    </div>
  );
}
