import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Mascot } from "@/components/mascot/Mascot";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AUTONOMY_LABELS,
  CAREGIVER_ACTION_LABELS,
  GIR_LABELS,
  MESSAGE_SECTION_LABELS,
  SKILL_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import { CaregiverManager } from "../CaregiverManager";

export default async function PatientDetailPage({
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
    include: {
      caregivers: {
        include: { caregiver: { include: { user: true } } },
      },
      objectives: { where: { isCurrent: true } },
      visits: {
        orderBy: { date: "desc" },
        take: 5,
        include: {
          transmission: {
            include: {
              messages: true,
              feedbacks: true,
              comprehensionChecks: true,
              actions: {
                orderBy: { createdAt: "desc" },
                include: { caregiver: { include: { user: true } } },
              },
            },
          },
        },
      },
    },
  });
  if (!patient) notFound();

  const objective = patient.objectives[0];
  const latest = patient.visits.find((v) => v.transmission)?.transmission;
  const timeline = [
    {
      label: "Transmis",
      done: Boolean(latest),
      detail: latest
        ? new Date(latest.sentAt).toLocaleDateString("fr-FR")
        : undefined,
    },
    { label: "Consulté", done: Boolean(latest?.readAt) },
    {
      label: "Essayé / réalisé / doute",
      done: Boolean(latest?.actions[0]),
      detail: latest?.actions[0]
        ? CAREGIVER_ACTION_LABELS[latest.actions[0].type]
        : undefined,
    },
    {
      label: "Feedback",
      done: Boolean(latest?.feedbacks[0]),
      detail: latest?.feedbacks[0]?.outcome,
    },
    {
      label:
        objective?.status === "acquis"
          ? "Acquis"
          : objective?.status === "a_reprendre"
            ? "À reprendre"
            : "Objectif en cours",
      done:
        objective?.status === "acquis" || objective?.status === "a_reprendre",
      detail: objective ? STATUS_LABELS[objective.status] : undefined,
    },
  ];

  return (
    <div className="min-h-dvh bg-cream">
      <SiteHeader
        variant="app"
        title={`${patient.firstName} ${patient.lastName}`}
        nav={[
          { href: "/pro", label: "Patients" },
          { href: `/pro/patient/${id}/edit`, label: "Modifier" },
          { href: `/pro/transmission/${id}`, label: "Transmettre" },
        ]}
      />

      <main className="mx-auto max-w-3xl animate-fade-up p-6">
        <div className="mb-4 flex items-start gap-3">
          <Mascot pose="patience" size="sm" animated />
          <div>
            <h1 className="text-2xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-sm text-text-muted">
              {AUTONOMY_LABELS[patient.autonomyLevel]}
              {patient.girLevel
                ? ` · ${GIR_LABELS[patient.girLevel] ?? `GIR ${patient.girLevel}`}`
                : ""}
            </p>
          </div>
        </div>

        <Card className="mb-6 border-teal/20 bg-teal/5">
          <SectionTitle>GIR — contexte éducatif</SectionTitle>
          <p className="mt-2">
            {patient.girLevel
              ? GIR_LABELS[patient.girLevel]
              : "Non renseigné"}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Calibre les consignes — pas un suivi clinique dans Proche+.
          </p>
        </Card>

        <Card className="mb-6">
          <SectionTitle>Progression éducative</SectionTitle>
          <ol className="mt-4 space-y-3">
            {timeline.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    s.done ? "bg-teal text-white" : "bg-cream-dark text-text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.label}</p>
                  {s.detail && (
                    <p className="text-sm text-text-muted">{s.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {objective && (
          <Card className="mb-6">
            <SectionTitle>Objectif pédagogique en cours</SectionTitle>
            <p className="mt-2">
              <strong>{SKILL_LABELS[objective.skill]}</strong> —{" "}
              {STATUS_LABELS[objective.status]}
            </p>
            <p className="mt-2 whitespace-pre-line">{objective.instructions}</p>
            {objective.nextStep && (
              <p className="mt-2 text-sm font-medium text-teal-dark">
                {objective.nextStep}
              </p>
            )}
          </Card>
        )}

        <CaregiverManager patientId={patient.id} links={patient.caregivers} />

        <SectionTitle className="mt-8">Historique</SectionTitle>
        <div className="mt-4 flex flex-col gap-4">
          {patient.visits
            .filter((v) => v.transmission)
            .map((visit) => {
              const t = visit.transmission!;
              return (
                <Card key={t.id}>
                  <p className="text-sm text-text-muted">
                    {new Date(t.sentAt).toLocaleDateString("fr-FR")}
                    {!t.readAt && (
                      <span className="ml-2 text-terracotta">Non consultée</span>
                    )}
                  </p>
                  {t.messages.map((m) => (
                    <p key={m.id} className="mt-2 text-sm">
                      <strong>{MESSAGE_SECTION_LABELS[m.section]} :</strong>{" "}
                      {m.content}
                    </p>
                  ))}
                  {t.actions.map((a) => (
                    <p key={a.id} className="mt-2 text-sm text-teal-dark">
                      Action ({a.caregiver.user.firstName}) :{" "}
                      {CAREGIVER_ACTION_LABELS[a.type] ?? a.type}
                      {a.note ? ` — ${a.note}` : ""}
                    </p>
                  ))}
                </Card>
              );
            })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/pro/transmission/${patient.id}`}>
            Nouvelle transmission
          </ButtonLink>
          <ButtonLink href={`/pro/patient/${patient.id}/edit`} variant="ghost">
            Modifier le patient
          </ButtonLink>
          <Link href="/pro" className="self-center text-sm text-teal">
            ← Patients
          </Link>
        </div>
      </main>
    </div>
  );
}
