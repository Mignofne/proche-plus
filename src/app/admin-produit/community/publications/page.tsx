import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  cancelPublicationAction,
  publishManuallyAction,
  schedulePublicationAction,
} from "../actions";

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Programmé",
  ready: "Prêt",
  published: "Publié",
  cancelled: "Annulé",
  failed: "Échec",
};

export default async function CommunityPublicationsPage() {
  const pubs = await prisma.communityPublication.findMany({
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    include: { theme: true, targets: { include: { account: true } } },
  });

  const sampleClassic = pubs.find((p) => p.kind === "classique");
  const sampleVideo = pubs.find((p) => p.kind === "video");

  return (
    <CommunityPageShell
      title="Posts Semi"
      subtitle="File / calendrier — rappel automatique, mise en ligne manuelle uniquement"
    >
      <SurfaceRaised className="border-teal/30 bg-teal/5">
        <SectionTitle>Aperçus fondateur (avant deploy)</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Corrigez le rendu avant post Semi / mise en prod.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <ButtonLink
            href={
              sampleClassic
                ? `/admin-produit/community/publications/preview/${sampleClassic.id}`
                : "/admin-produit/community/publications/preview/demo-classique"
            }
            size="sm"
          >
            Aperçu post classique
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-carrousel"
            size="sm"
            variant="secondary"
          >
            Aperçu carrousel
          </ButtonLink>
          <ButtonLink
            href={
              sampleVideo
                ? `/admin-produit/community/publications/preview/${sampleVideo.id}`
                : "/admin-produit/community/publications/preview/demo-video"
            }
            size="sm"
            variant="secondary"
          >
            Aperçu post vidéo
          </ButtonLink>
          <ButtonLink href="/admin-produit/community/publications/nouveau" size="sm" variant="ghost">
            Nouveau post
          </ButtonLink>
        </div>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>File & calendrier</SectionTitle>
        {pubs.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Aucun post. Créez un brouillon ou lancez{" "}
            <code>npm run db:seed-community</code>.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pubs.map((p) => (
              <li key={p.id} className="rounded-xl border border-cream-dark p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold">{p.title || "Sans titre"}</span>
                    <span className="text-text-muted">
                      {" "}
                      · {p.kind} · {STATUS_LABEL[p.status] || p.status}
                      {p.scheduledAt
                        ? ` · ${p.scheduledAt.toLocaleString("fr-FR")}`
                        : ""}
                    </span>
                  </div>
                  <Link
                    className="text-teal underline"
                    href={`/admin-produit/community/publications/preview/${p.id}`}
                  >
                    Aperçu
                  </Link>
                </div>
                <p className="mt-1 line-clamp-2 text-text-muted">{p.body}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.status === "draft" || p.status === "scheduled" ? (
                    <form action={schedulePublicationAction} className="flex gap-2">
                      <input type="hidden" name="publicationId" value={p.id} />
                      <input
                        type="datetime-local"
                        name="scheduledAt"
                        required
                        className="rounded-xl border px-2 py-1"
                      />
                      <button type="submit" className="rounded-xl bg-sun px-3 py-1 font-semibold">
                        Programmer
                      </button>
                    </form>
                  ) : null}
                  {p.status === "ready" ? (
                    <form action={publishManuallyAction}>
                      <input type="hidden" name="publicationId" value={p.id} />
                      <button type="submit" className="rounded-xl bg-teal px-3 py-1 font-semibold text-white">
                        Mettre en ligne
                      </button>
                    </form>
                  ) : null}
                  {["draft", "scheduled", "ready"].includes(p.status) ? (
                    <form action={cancelPublicationAction}>
                      <input type="hidden" name="publicationId" value={p.id} />
                      <button type="submit" className="rounded-xl bg-terracotta/20 px-3 py-1">
                        Annuler
                      </button>
                    </form>
                  ) : null}
                  <Link
                    href={`/admin-produit/community/publications/${p.id}`}
                    className="rounded-xl border px-3 py-1"
                  >
                    Détail / CAP-11
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
