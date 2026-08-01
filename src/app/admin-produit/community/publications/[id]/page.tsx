import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  attachRightsAttestationAction,
  anonymizeTestimonialAction,
  publishManuallyAction,
} from "../../actions";
import { getRenderInstructions } from "@/lib/community/video/remotion";

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pub = await prisma.communityPublication.findUnique({
    where: { id },
    include: { rightsAttestation: true, targets: true },
  });
  if (!pub) notFound();

  return (
    <CommunityPageShell
      title={pub.title || "Post"}
      subtitle={`${pub.kind} · ${pub.status}`}
    >
      <SurfaceRaised>
        <p className="whitespace-pre-wrap text-sm">{pub.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink
            href={`/admin-produit/community/publications/preview/${pub.id}`}
            size="sm"
          >
            Générer aperçu
          </ButtonLink>
          {pub.status === "ready" ? (
            <form action={publishManuallyAction}>
              <input type="hidden" name="publicationId" value={pub.id} />
              <button type="submit" className="touch-target rounded-2xl bg-teal px-4 py-2 font-semibold text-white">
                Mettre en ligne (manuel)
              </button>
            </form>
          ) : null}
        </div>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>CAP-11 — Droit à l’image / citation</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Témoignage : {pub.isTestimonial ? "oui" : "non"} · Attribuable :{" "}
          {pub.isAttributable ? "oui" : "non"}
          {pub.rightsAttestation
            ? ` · Attestation : ${pub.rightsAttestation.label}`
            : " · Pas d’attestation"}
        </p>
        <form action={attachRightsAttestationAction} className="mt-3 grid gap-2">
          <input type="hidden" name="publicationId" value={pub.id} />
          <input name="label" required placeholder="Libellé attestation" className="rounded-2xl border px-4 py-3" />
          <input name="fileUrl" placeholder="URL fichier archivé" className="rounded-2xl border px-4 py-3" />
          <input name="notes" placeholder="Notes" className="rounded-2xl border px-4 py-3" />
          <button type="submit" className="touch-target rounded-2xl bg-teal px-4 py-3 text-white font-semibold">
            Archiver attestation
          </button>
        </form>
        <form action={anonymizeTestimonialAction} className="mt-2">
          <input type="hidden" name="publicationId" value={pub.id} />
          <button type="submit" className="rounded-2xl border px-4 py-2 text-sm">
            Anonymiser (non attribuable) pour débloquer
          </button>
        </form>
      </SurfaceRaised>

      {pub.kind === "video" ? (
        <SurfaceRaised>
          <SectionTitle>Rendu Remotion</SectionTitle>
          <p className="mt-2 text-sm text-text-muted">
            {getRenderInstructions(pub.id)}
          </p>
          {pub.videoBlobUrl ? (
            <a className="text-teal underline" href={pub.videoBlobUrl}>
              Télécharger le rendu
            </a>
          ) : (
            <p className="text-sm text-text-muted">
              Pas encore de binaire Blob — preview Player disponible via Aperçu.
            </p>
          )}
        </SurfaceRaised>
      ) : null}
    </CommunityPageShell>
  );
}
