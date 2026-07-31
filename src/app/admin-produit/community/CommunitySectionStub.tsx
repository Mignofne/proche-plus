import Link from "next/link";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Card";
import { COMMUNITY_UI } from "@/lib/community/ui-tokens";
import { cn } from "@/lib/utils";

export function CommunitySectionStub({
  title,
  subtitle,
  emptyMessage,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <CommunityPageShell
      title={title}
      subtitle={subtitle}
      actions={
        <Link href="/admin-produit" className="text-teal">
          KPIs
        </Link>
      }
    >
      <SurfaceRaised>
        <SectionTitle>Rien pour l&apos;instant</SectionTitle>
        <p className={cn("mt-2", COMMUNITY_UI.muted)}>{emptyMessage}</p>
        <div className="mt-4">
          <ButtonLink href={ctaHref} size="sm">
            {ctaLabel}
          </ButtonLink>
        </div>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
