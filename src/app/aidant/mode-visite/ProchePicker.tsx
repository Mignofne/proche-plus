import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { Mascot } from "@/components/mascot/Mascot";
import { ButtonLink } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AUTONOMY_LABELS } from "@/lib/constants";
import type { VisitProcheOption } from "@/lib/services/aidant";

export function ModeVisiteEmptyProches() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <p className="text-sm text-text-muted">
            Pour démarrer une visite, ajoutez d&apos;abord la personne que vous
            accompagnez.
          </p>
        </div>
        <Card className="text-center">
          <SectionTitle>Aucun proche pour l&apos;instant</SectionTitle>
          <p className="mt-2 text-sm text-text-muted">
            Gérez vos proches pour pouvoir lancer le mode visite.
          </p>
          <ButtonLink href="/aidant/proches" className="mt-4" fullWidth size="lg">
            Gérer mes proches
          </ButtonLink>
        </Card>
      </main>
    </div>
  );
}

export function ModeVisiteProchePicker({
  proches,
}: {
  proches: VisitProcheOption[];
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="welcome" size="sm" />
          <div>
            <h2 className="text-lg font-bold">
              Pour qui est cette visite ?
            </h2>
            <p className="text-sm text-text-muted">
              Choisissez la personne que vous accompagnez aujourd&apos;hui.
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {proches.map((proche) => {
            const levelLabel =
              AUTONOMY_LABELS[proche.autonomyLevel] ?? proche.autonomyLevel;
            const meta = [levelLabel, proche.establishmentName]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={proche.patientId}>
                <Link
                  href={`/aidant/mode-visite?patientId=${encodeURIComponent(proche.patientId)}`}
                  className="block rounded-2xl border border-cream-dark bg-white p-4 shadow-sm transition-colors hover:border-teal/40"
                >
                  <p className="text-lg font-bold text-teal-dark">
                    {proche.firstName} {proche.lastName}
                  </p>
                  {meta && (
                    <p className="mt-1 text-sm text-text-muted">{meta}</p>
                  )}
                  <p className="mt-2 text-sm font-medium text-teal">
                    Commencer la visite →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
