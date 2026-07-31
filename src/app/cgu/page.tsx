import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "CGU | Proche+" };

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions Générales d’Utilisation"
      intro="Document à compléter et à faire valider avant mise en ligne par l’éditeur de Proche+. Les présentes CGU s’adressent aux utilisateurs du service (aidants, professionnels, comptes individuels) — distinctes des conditions établissement B2B."
    >
      <HealthDisclaimer />
      <section>
        <h2 className="text-xl font-bold text-teal-dark">1. Objet</h2>
        <p className="mt-2">
          Proche+ propose des outils de continuité éducative entre les professionnels
          et les aidants. Les présentes conditions définissent les règles d’accès et
          d’utilisation du service pour ces utilisateurs.
        </p>
        <p className="mt-2">
          Les conditions applicables aux établissements (B2B) font l’objet d’un
          document séparé :{" "}
          <a
            className="font-semibold text-teal underline"
            href="/conditions-etablissement"
          >
            Conditions établissement
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">2. Accès au service</h2>
        <p className="mt-2">
          L’accès dépend du rôle attribué à chaque utilisateur. L’utilisateur
          s’engage à protéger ses identifiants et à signaler toute utilisation
          suspecte à <strong>[Email contact]</strong>.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">
          3. Nature du service — responsabilité santé
        </h2>
        <p className="mt-2">
          Voir l’avertissement santé en tête de page. Les contenus pédagogiques ou
          marketing publiés par Proche+ ont une portée générale et ne constituent
          pas un conseil médical individualisé.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">4. Bon usage</h2>
        <p className="mt-2">
          Les utilisateurs ne doivent pas utiliser le service pour une urgence ni
          partager d’informations auxquelles ils ne sont pas autorisés à accéder.
          Proche+ ne remplace pas les consignes personnalisées d’un professionnel.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">5. Données personnelles</h2>
        <p className="mt-2">
          Les modalités de traitement des données sont précisées dans la{" "}
          <a className="font-semibold text-teal underline" href="/politique-de-confidentialite">
            politique de confidentialité
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">6. Mineurs</h2>
        <p className="mt-2">
          [Politique mineurs / âge minimum — non définie à ce stade ; ne pas
          inventer. Open question SPEC — à renseigner par le fondateur.]
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">7. Éditeur</h2>
        <p className="mt-2">
          Éditeur : <strong>MEGANE GOMES</strong>, Entrepreneur individuel,{" "}
          <strong>313 rue Gambetta, 60230 Chambly</strong>, SIRET :{" "}
          <strong>90092159400025</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
