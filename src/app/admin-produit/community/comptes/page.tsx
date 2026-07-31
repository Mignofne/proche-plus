import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { createSocialAccountAction } from "../actions";

export default async function CommunityComptesPage() {
  const accounts = await prisma.communitySocialAccount.findMany({
    orderBy: { channel: "asc" },
  });

  return (
    <CommunityPageShell
      title="Comptes sociaux"
      subtitle="Liens IG / Threads / TikTok — aucune API de publication Meta/TikTok"
    >
      <SurfaceRaised>
        <SectionTitle>Enregistrer un compte</SectionTitle>
        <form action={createSocialAccountAction} className="mt-3 grid gap-2 sm:grid-cols-2">
          <select name="channel" className="rounded-2xl border border-cream-dark px-4 py-3" required>
            <option value="instagram">Instagram</option>
            <option value="threads">Threads</option>
            <option value="tiktok">TikTok</option>
          </select>
          <input name="label" required placeholder="Libellé" className="rounded-2xl border border-cream-dark px-4 py-3" />
          <input name="url" required placeholder="https://…" className="rounded-2xl border border-cream-dark px-4 py-3 sm:col-span-2" />
          <button type="submit" className="touch-target rounded-2xl bg-teal px-4 py-3 font-semibold text-white sm:col-span-2">
            Enregistrer
          </button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {accounts.length === 0 ? (
            <li className="text-text-muted">Aucun compte — ajoutez IG, Threads ou TikTok.</li>
          ) : (
            accounts.map((a) => (
              <li key={a.id} className="rounded-xl bg-cream px-3 py-2">
                <strong>{a.label}</strong> · {a.channel} ·{" "}
                <a className="text-teal underline" href={a.url} target="_blank" rel="noreferrer">
                  {a.url}
                </a>
              </li>
            ))
          )}
        </ul>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
