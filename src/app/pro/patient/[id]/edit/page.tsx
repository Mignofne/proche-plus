import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PatientForm } from "../../PatientForm";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (
    !session ||
    (session.role !== "professional" && session.role !== "admin_etablissement")
  ) {
    redirect("/connexion?role=pro");
  }

  const professional = await prisma.professional.findUnique({
    where: { userId: session.userId },
  });
  if (!professional) redirect("/connexion?role=pro");

  const patient = await prisma.patient.findFirst({
    where: { id, establishmentId: professional.establishmentId },
  });
  if (!patient) notFound();

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title="Modifier patient"
        nav={[
          { href: "/pro", label: "Patients" },
          { href: `/pro/patient/${id}`, label: "Fiche" },
        ]}
      />
      <PatientForm mode="edit" patient={patient} />
    </div>
  );
}
