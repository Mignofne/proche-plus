import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProcheForm } from "@/components/aidant/ProcheForm";
import { getSession } from "@/lib/auth";
import { caregiverNeedsOnboarding } from "@/lib/services/aidant";

export default async function NouveauProchePage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Nouveau proche" backHref="/aidant/proches" />
      <main className="p-4">
        <ProcheForm mode="create" />
      </main>
    </div>
  );
}
