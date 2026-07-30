import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-cream via-cream to-teal/5">
      <SiteHeader variant="public" />
      <main className="mx-auto flex max-w-lg flex-col items-center gap-8 px-6 py-10">
        <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
          <Mascot pose="welcome" size="lg" className="animate-mascot-float" />
          <h1 className="text-3xl font-bold text-teal-dark">Proche+</h1>
          <p className="text-text-muted">
            Continuité éducative entre les professionnels et les familles
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Card className="animate-fade-up flex flex-col gap-4 [animation-delay:80ms]">
            <div className="flex items-start gap-3">
              <Mascot pose="patience" size="sm" />
              <div>
                <h2 className="font-semibold">Je suis aidant</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Mode visite, consignes claires, actions pendant la visite.
                </p>
              </div>
            </div>
            <ButtonLink href="/connexion?role=aidant" fullWidth>
              Espace aidant
            </ButtonLink>
          </Card>

          <Card className="animate-fade-up flex flex-col gap-4 [animation-delay:160ms]">
            <div className="flex items-start gap-3">
              <Mascot pose="encourage" size="sm" />
              <div>
                <h2 className="font-semibold">Je suis professionnel</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Patients, transmissions, familles — et pilotage établissement
                  si vous y êtes habilité.
                </p>
              </div>
            </div>
            <ButtonLink href="/connexion?role=pro" variant="secondary" fullWidth>
              Espace professionnel
            </ButtonLink>
          </Card>
        </div>

        <p className="animate-fade-up text-center text-xs text-text-muted [animation-delay:240ms]">
          Admin produit : menu ☰ en haut à droite
        </p>
      </main>
    </div>
  );
}
