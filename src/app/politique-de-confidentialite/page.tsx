import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Politique de confidentialité | Proche+" };

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Document à compléter avec les informations réelles du responsable de traitement, des prestataires et des durées de conservation."
    >
      <HealthDisclaimer />
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Responsable de traitement</h2>
        <p className="mt-2">
          MEGANE GOMES, Entrepreneur individuel, 313 rue Gambetta, 60230 Chambly,
          SIRET 90092159400025. Contact vie privée :{" "}
          <strong>[Email contact / DPO — à renseigner]</strong>.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Données et finalités</h2>
        <p className="mt-2">
          Les données nécessaires au fonctionnement de Proche+ sont traitées pour
          fournir le service. Depuis la landing, l’email peut aussi être traité pour
          une candidature bêta et, uniquement avec un opt-in séparé (case à cocher
          non pré-cochée), pour la newsletter mensuelle Proche+ (actualités produit
          et contenus éducatifs).
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Consentement newsletter</h2>
        <p className="mt-2">
          L’inscription à la newsletter mensuelle est facultative, jamais pré-cochée.
          Une case à cocher explicite suffit (single opt-in). Elle peut être retirée
          à tout moment via le lien de désinscription présent dans les emails ou en
          écrivant à <strong>[Email contact]</strong>.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Conservation (newsletter)</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            Désinscription : arrêt immédiat des envois ; conservation en liste
            d’opposition (preuve) pendant au moins 3 ans (recommandations CNIL).
          </li>
          <li>
            Contacts inactifs jamais engagés : conservation maximale de 3 ans à
            compter de la collecte ou du dernier contact, puis suppression ou
            anonymisation sauf nouveau consentement explicite.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Mesure d’audience</h2>
        <p className="mt-2">
          Pour l’instant, Proche+ utilise <strong>Vercel Analytics</strong> afin de
          mesurer l’audience de façon minimale. Aucune suite analytics tierce
          supplémentaire n’est déployée à ce stade.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Mineurs</h2>
        <p className="mt-2">
          <strong>
            [Politique relative aux mineurs — non définie ; open question SPEC.
            Aucune règle d’âge minimum n’est inventée ici.]
          </strong>
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Vos droits</h2>
        <p className="mt-2">
          Vous pouvez demander l’accès, la rectification, l’effacement, la
          limitation, l’opposition ou la portabilité de vos données, selon les
          conditions applicables, en contactant{" "}
          <strong>[Email contact]</strong>.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-teal-dark">Conservation et prestataires</h2>
        <p className="mt-2">
          Hébergement : <strong>[Hébergeur à confirmer — Vercel le cas échéant]</strong>.
          Pour la newsletter, Proche+ a recours à <strong>Brevo</strong> (ex-Sendinblue)
          comme sous-traitant d’emailing. Le fondateur compose les envois dans
          l’interface Brevo. Autres durées de conservation métier :{" "}
          <strong>[à compléter]</strong>.
        </p>
      </section>
    </LegalPage>
  );
}
