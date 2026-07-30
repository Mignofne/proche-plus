import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { QuestionForm } from "./QuestionForm";

export default async function QuestionPage() {
  const session = await getSession();
  if (!session || session.role !== "caregiver") {
    redirect("/connexion?role=aidant");
  }

  return <QuestionForm />;
}
