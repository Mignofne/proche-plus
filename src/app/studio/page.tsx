import { SiteHeader } from "@/components/layout/SiteHeader";
import { StudioClient } from "@/components/studio/StudioClient";

export const metadata = {
  title: "Studio posts — Proche+",
  description:
    "Compose des posts réseaux sociaux et décline l’ours Proche+ en le décrivant.",
};

export default function StudioPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-cream via-cream to-[#F6D5B8]/35">
      <SiteHeader
        variant="public"
        title="Proche+"
        subtitle="Studio posts"
      />
      <main>
        <StudioClient />
      </main>
    </div>
  );
}
