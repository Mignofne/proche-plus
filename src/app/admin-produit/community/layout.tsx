import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    redirect("/connexion?role=fondateur");
  }

  return children;
}
