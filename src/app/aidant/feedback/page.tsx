import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  caregiverNeedsOnboarding,
  getCaregiverTransmissions,
} from "@/lib/services/aidant";
import { prisma } from "@/lib/prisma";
import { FeedbackForm } from "./FeedbackForm";

export default async function FeedbackPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }
  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  const caregiver = await prisma.caregiver.findUnique({
    where: { userId: session.userId },
  });
  if (!caregiver) redirect("/connexion?role=aidant");

  const transmissions = await getCaregiverTransmissions(caregiver.id);
  const transmissionId = transmissions[0]?.id;

  if (!transmissionId) {
    redirect("/aidant");
  }

  return <FeedbackForm transmissionId={transmissionId} />;
}
