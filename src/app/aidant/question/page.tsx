import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { caregiverNeedsOnboarding } from "@/lib/services/aidant";
import { QuestionForm } from "./QuestionForm";

export default async function QuestionPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }
  if (await caregiverNeedsOnboarding(session.userId)) {
    redirect("/aidant/onboarding");
  }

  return <QuestionForm />;
}
