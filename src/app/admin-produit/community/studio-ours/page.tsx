import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { ButtonLink } from "@/components/ui/Button";
import { listGenerations } from "@/lib/community/mascot-gen";
import { StudioOursForm } from "./StudioOursForm";

export default async function StudioOursPage() {
  const history = await listGenerations(12);

  return (
    <CommunityPageShell
      title="Studio Ours"
      subtitle="Génération illustrée guidée — situation · émotion · lieu (Phase 1 mock)"
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
      <StudioOursForm initialHistory={history} />
    </CommunityPageShell>
  );
}
