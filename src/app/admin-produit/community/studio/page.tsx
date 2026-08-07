import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { VideoPostPreview } from "@/components/community/VideoPostPreview";
import { ButtonLink } from "@/components/ui/Button";
import { EDITORIAL_GUARDS_FR } from "@/lib/community/illustrations";
import { isStudioOursEnabled } from "@/lib/community/mascot-gen";

export default function CommunityStudioPage() {
  const studioOurs = isStudioOursEnabled();
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
          Compositions <code>ProchePlusShort</code> (1 plan) et{" "}
          <code>ProchePlusStoryboard</code> (multi-stills Studio Ours) — aucun
          générateur vidéo externe facturé.
        </p>
        <div className="mt-4">
          <VideoPostPreview
            title="Studio — aperçu"
            body="Prévisualisez avant de programmer un post vidéo Semi."
            poseKey="encourage"
          />
        </div>
        <p className="mt-4 text-sm text-text-muted">
          Rendu CLI : <code>npm run community:render-video</code> — pour un
          storyboard généré :{" "}
          <code>
            --composition=ProchePlusStoryboard --props=./tmp/…-props.json
          </code>
          . Sur Vercel, le worker/CI dédié reste différé ; le Player et les
          compositions sont livrés in-repo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-video"
            size="sm"
          >
            Ouvrir l’aperçu démo vidéo
          </ButtonLink>
          {studioOurs ? (
            <ButtonLink
              href="/admin-produit/community/studio-ours"
              size="sm"
              variant="secondary"
            >
              Studio Ours (illustrations)
            </ButtonLink>
          ) : null}
        </div>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
