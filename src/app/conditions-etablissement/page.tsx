import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = {
  title: "Conditions établissement | Proche+",
};

export default function ConditionsEtablissementPage() {
  return (
    <LegalPage
      title="Conditions applicables aux établissements"
      intro="Document B2B distinct des CGU utilisateurs (aidants / professionnels individuels). À compléter et à faire valider avant contractualisation établissement."
    >
      <HealthDisclaimer />
      <section>
        <h2 className="text-xl font-bold text-teal-dark">1. Objet</h2>
        <p className="mt-2">
          Les présentes conditions régissent l’accès et l’usage de Proche+ par un
          établissement (structure médico-sociale ou assimilée) et ses
          administrateurs. Elles sont séparées des{" "}
          <a className="font-semibold text-teal underline" href="/cgu">
            CGU générales
          </a>{" "}
          applicables aux utilisateurs individuels.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">2. Périmètre (à compléter)</h2>
        <p className="mt-2">
          <strong>
            [Périmètre de licence, nombre de seats, environnements, durée,
            résiliation — à renseigner.]
          </strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">
          3. Responsabilité santé
        </h2>
        <p className="mt-2">
          Voir l’avertissement santé en tête de page. L’établissement demeure
          responsable de l’organisation des soins et de l’accompagnement qu’il
          délivre.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">4. Données</h2>
        <p className="mt-2">
          Les traitements sont décrits dans la{" "}
          <a
            className="font-semibold text-teal underline"
            href="/politique-de-confidentialite"
          >
            politique de confidentialité
          </a>
          . <strong>[DPA / rôles responsable–sous-traitant à préciser.]</strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">5. Éditeur</h2>
        <p className="mt-2">
          Éditeur : <strong>MEGANE GOMES</strong>, Entrepreneur individuel,{" "}
          <strong>313 rue Gambetta, 60230 Chambly</strong>, SIRET :{" "}
          <strong>90092159400025</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
