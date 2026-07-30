import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PatientForm } from "../PatientForm";

export default async function NewPatientPage() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "professional" && session.role !== "admin_etablissement")
  ) {
    redirect("/connexion?role=pro");
  }

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title="Nouveau patient"
        nav={[{ href: "/pro", label: "Retour patients" }]}
      />
      <PatientForm mode="create" />
    </div>
  );
}
