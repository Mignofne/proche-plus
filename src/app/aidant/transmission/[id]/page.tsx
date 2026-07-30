import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markTransmissionReadIfNeeded } from "@/app/aidant/actions";
import { getTransmissionForCaregiver } from "@/lib/services/aidant";
import { TransmissionClient } from "./TransmissionClient";

export default async function TransmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) redirect("/connexion?role=aidant");

  const transmission = await getTransmissionForCaregiver(caregiver.id, id);
  if (!transmission) notFound();

  await markTransmissionReadIfNeeded(id);

  return <TransmissionClient transmission={transmission} />;
}
