import { getSession, type SessionPayload } from "@/lib/auth";

/** Vérifie qu'une session est fondateur (`admin_produit`). Pure — testable sans cookies. */
export function assertFondateurSession(
  session: SessionPayload | null
): SessionPayload {
  if (!session || session.role !== "admin_produit") {
    throw new Error("Accès refusé");
  }
  return session;
}

/** Gate mutations / server actions Community — miroir de admin-produit/actions.ts. */
export async function requireFondateur() {
  return assertFondateurSession(await getSession());
}
