import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { ButtonLink } from "@/components/ui/Button";
import {
  listGenerations,
  resolveMascotGenProvider,
} from "@/lib/community/mascot-gen";
import { StudioOursForm } from "./StudioOursForm";

/** Génération remote peut dépasser 10s (OpenAI / Pollinations). */
export const maxDuration = 60;

export default async function StudioOursPage() {
  const history = await listGenerations(12);
  const providerId = resolveMascotGenProvider().id;

  return (
    <CommunityPageShell
      title="Studio Ours"
      subtitle={
        providerId === "mock"
          ? "Mode mock — prompt verrouillé + placeholder C-v3"
          : "Génération illustrée — situation · émotion · lieu → nouvelle scène"
      }
      actions={
        <>
          <ButtonLink
            href="/admin-produit/community/ours-canon"
            size="sm"
            variant="secondary"
          >
            Canon C-v3
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/studio"
            size="sm"
            variant="ghost"
          >
            Studio vidéo
          </ButtonLink>
        </>
      }
    >
      <StudioOursForm initialHistory={history} providerId={providerId} />
    </CommunityPageShell>
  );
}
