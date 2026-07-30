import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-8 p-6">
      <Mascot pose="welcome" size="lg" />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-dark">Proche+</h1>
        <p className="mt-2 text-text-muted">
          Continuité éducative entre les professionnels et les familles
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <h2 className="font-semibold">Je suis aidant</h2>
          <p className="text-sm text-text-muted">
            Consultez les consignes, préparez votre visite, donnez votre retour.
          </p>
          <ButtonLink href="/connexion?role=aidant" fullWidth>
            Espace aidant
          </ButtonLink>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="font-semibold">Je suis professionnel</h2>
          <p className="text-sm text-text-muted">
            Transmettez en moins de 2 minutes, suivez les retours des familles.
          </p>
          <ButtonLink href="/connexion?role=pro" variant="secondary" fullWidth>
            Espace professionnel
          </ButtonLink>
        </Card>
      </div>

      <p className="text-center text-xs text-text-muted">
        MVP — Centre de rééducation Val-de-Marne
      </p>
    </main>
  );
}
