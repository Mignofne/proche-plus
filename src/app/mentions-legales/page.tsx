import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Mentions légales | Proche+" };

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Les champs entre crochets restent à renseigner par le fondateur avant publication. Placeholders explicites — ne pas inventer de données."
    >
      <HealthDisclaimer />
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Éditeur du site</h2>
        <p className="mt-2">
          <strong>MEGANE GOMES</strong>
          <br />
          Entrepreneur individuel
          <br />
          313 rue Gambetta, 60230 Chambly
          <br />
          SIRET : 90092159400025
          <br />
          Code NAF (siège) : 62.02A
          <br />
          Contact : <strong>[Email contact]</strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Directeur de la publication</h2>
        <p className="mt-2">
          <strong>[Nom et fonction du directeur de la publication — à renseigner]</strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Délégué à la protection des données</h2>
        <p className="mt-2">
          <strong>[Email / identité DPO — à renseigner ; open question SPEC]</strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Hébergement</h2>
        <p className="mt-2">
          <strong>[Hébergeur à confirmer — Vercel le cas échéant]</strong>
          <br />
          <strong>[Adresse et contact de l’hébergeur — à renseigner]</strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Propriété intellectuelle</h2>
        <p className="mt-2">
          Les contenus, marques, illustrations et éléments graphiques de Proche+
          sont protégés. Toute réutilisation requiert l’autorisation préalable de
          leur titulaire, sauf exception légale.
        </p>
      </section>
    </LegalPage>
  );
}
