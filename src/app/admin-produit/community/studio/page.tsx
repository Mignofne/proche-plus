import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { VideoPostPreview } from "@/components/community/VideoPostPreview";
import { ButtonLink } from "@/components/ui/Button";
import { EDITORIAL_GUARDS_FR } from "@/lib/community/illustrations";

export default function CommunityStudioPage() {
  return (
    <CommunityPageShell
      title="Studio vidéo Remotion"
      subtitle="Preview in-house — rendu hors route serverless courte"
    >
      <SurfaceRaised>
        <SectionTitle>Garde-fous</SectionTitle>
        <ul className="mt-2 list-disc pl-5 text-sm text-text-muted">
          {EDITORIAL_GUARDS_FR.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </SurfaceRaised>
      <SurfaceRaised>
        <SectionTitle>Player de composition</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Composition <code>ProchePlusShort</code> — aucun générateur vidéo
          externe facturé.
        </p>
        <div className="mt-4">
          <VideoPostPreview
            title="Studio — aperçu"
            body="Prévisualisez avant de programmer un post vidéo Semi."
            poseKey="encourage"
          />
        </div>
        <p className="mt-4 text-sm text-text-muted">
          Rendu CLI local : <code>npm run community:render-video</code>. Sur
          Vercel, le worker/CI dédié est documenté comme différé ; le Player et
          les compositions sont livrés in-repo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-video"
            size="sm"
          >
            Ouvrir l’aperçu démo vidéo
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/studio-ours"
            size="sm"
            variant="secondary"
          >
            Studio Ours (illustrations)
          </ButtonLink>
        </div>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
