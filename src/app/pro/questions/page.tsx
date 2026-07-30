import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Card } from "@/components/ui/Card";
import { AnswerQuestionForm } from "./AnswerQuestionForm";

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
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

  const questions = await prisma.question.findMany({
    where: {
      status: "en_attente",
      OR: [
        { professionalId: professional.id },
        {
          caregiver: {
            patients: {
              some: {
                patient: { establishmentId: professional.establishmentId },
              },
            },
          },
        },
      ],
    },
    include: { caregiver: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  const question =
    questions.find((q) => q.id === id) ?? questions[0] ?? null;

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title="Questions en attente"
        nav={[{ href: "/pro", label: "Patients" }]}
      />
      <main className="mx-auto max-w-2xl p-6">
        {!question ? (
          <Card>
            <p>Aucune question en attente.</p>
            <Link href="/pro" className="mt-4 inline-block text-teal">
              Retour
            </Link>
          </Card>
        ) : (
          <AnswerQuestionForm
            question={{
              id: question.id,
              text: question.text,
              caregiverName: question.caregiver.user.firstName,
            }}
          />
        )}
      </main>
    </div>
  );
}
