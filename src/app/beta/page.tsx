import { SiteHeader } from "@/components/layout/SiteHeader";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { BetaLandingForm } from "./BetaLandingForm";

export const metadata = {
  title: "Bêta Proche+ | Candidature",
  description:
    "Candidatez au programme bêta Proche+ — continuité éducative pour aidants et professionnels.",
};

export default function BetaPage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-cream via-cream to-teal/10">
      <SiteHeader variant="public" />
      <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
        <SurfaceRaised className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">
            Proche+
          </p>
          <h1 className="text-3xl font-bold text-teal-dark">
            Programme bêta
          </h1>
          <p className="text-text-muted">
            Aidez-nous à construire un outil de continuité éducative utile aux
            proches et aux équipes — hors urgence, hors diagnostic.
          </p>
          <BetaLandingForm />
        </SurfaceRaised>
      </main>
    </div>
  );
}
