import { MESSAGE_SECTION_LABELS, SKILL_LABELS } from "@/lib/constants";

export type ConsigneSection =
  | "a_retenir"
  | "a_essayer"
  | "a_eviter"
  | "a_revoir_ensemble";

export type ThemeConsigne = {
  id: string;
  section: ConsigneSection;
  text: string;
};

/** Bibliothèque de consignes prêtes à l’emploi, par thématique */
export const CONSIGNES_PAR_THEME: Record<string, ThemeConsigne[]> = {
  transfert: [
    {
      id: "tr-1",
      section: "a_retenir",
      text: "Laissez votre proche commencer le mouvement avant d’aider.",
    },
    {
      id: "tr-2",
      section: "a_essayer",
      text: "Dites « Posez vos mains sur les accoudoirs », puis attendez 5 secondes.",
    },
    {
      id: "tr-3",
      section: "a_essayer",
      text: "Comptez à voix haute ensemble avant de se lever : « Un, deux, trois ».",
    },
    {
      id: "tr-4",
      section: "a_eviter",
      text: "Ne tirez pas par les bras ou les aisselles.",
    },
    {
      id: "tr-5",
      section: "a_revoir_ensemble",
      text: "Le moment exact où vous devez intervenir si ça bloque.",
    },
  ],
  fauteuil: [
    {
      id: "fa-1",
      section: "a_retenir",
      text: "Vérifiez toujours les freins avant toute aide.",
    },
    {
      id: "fa-2",
      section: "a_essayer",
      text: "Demandez de glisser les fesses vers l’avant : « Glissez un peu vers moi ».",
    },
    {
      id: "fa-3",
      section: "a_essayer",
      text: "Guidez le bassin d’une main si besoin — sans soulever.",
    },
    {
      id: "fa-4",
      section: "a_eviter",
      text: "Ne le remettez pas « droit » d’un coup en le tirant.",
    },
    {
      id: "fa-5",
      section: "a_revoir_ensemble",
      text: "Comment positionner le fauteuil par rapport au lit.",
    },
  ],
  toilette: [
    {
      id: "to-1",
      section: "a_retenir",
      text: "Préparez le nécessaire avant, pour ne pas le faire attendre.",
    },
    {
      id: "to-2",
      section: "a_essayer",
      text: "Laissez-le faire la partie du corps qu’il maîtrise encore.",
    },
    {
      id: "to-3",
      section: "a_eviter",
      text: "Ne faites pas tout à sa place « pour aller plus vite ».",
    },
    {
      id: "to-4",
      section: "a_revoir_ensemble",
      text: "Les gestes où une aide humaine reste indispensable.",
    },
  ],
  communication: [
    {
      id: "co-1",
      section: "a_retenir",
      text: "Une seule consigne à la fois, un verbe d’action par phrase.",
    },
    {
      id: "co-2",
      section: "a_essayer",
      text: "Placez-vous face à lui, à hauteur du regard, avant de parler.",
    },
    {
      id: "co-3",
      section: "a_eviter",
      text: "Évitez de parler depuis une autre pièce ou trop vite.",
    },
    {
      id: "co-4",
      section: "a_revoir_ensemble",
      text: "Les mots qui marchent le mieux pour lui aujourd’hui.",
    },
  ],
  repas: [
    {
      id: "re-1",
      section: "a_retenir",
      text: "Installez-le confortablement avant de commencer le repas.",
    },
    {
      id: "re-2",
      section: "a_essayer",
      text: "Laissez-le porter la fourchette / le verre le plus possible.",
    },
    {
      id: "re-3",
      section: "a_eviter",
      text: "Ne le nourrissez pas entièrement s’il peut encore participer.",
    },
    {
      id: "re-4",
      section: "a_revoir_ensemble",
      text: "La texture et le rythme qui lui conviennent.",
    },
  ],
  mobilite: [
    {
      id: "mo-1",
      section: "a_retenir",
      text: "Même assis, bouger un peu compte — encouragez les petits gestes.",
    },
    {
      id: "mo-2",
      section: "a_essayer",
      text: "Proposez un changement de position toutes les fois validées par l’équipe.",
    },
    {
      id: "mo-3",
      section: "a_eviter",
      text: "N’imposez pas une fréquence générique du type « toutes les 30 min » si ce n’est pas prescrit.",
    },
    {
      id: "mo-4",
      section: "a_revoir_ensemble",
      text: "Les limites de distance / durée validées pour aujourd’hui.",
    },
  ],
  autonomie: [
    {
      id: "au-1",
      section: "a_retenir",
      text: "Faire faire plutôt que faire à la place.",
    },
    {
      id: "au-2",
      section: "a_essayer",
      text: "Demandez-lui de choisir (vêtement, ordre des gestes) quand c’est possible.",
    },
    {
      id: "au-3",
      section: "a_eviter",
      text: "Évitez de reprendre immédiatement un geste « mal fait ».",
    },
    {
      id: "au-4",
      section: "a_revoir_ensemble",
      text: "Ce qu’il peut encore faire seul vs ce qui nécessite une aide.",
    },
  ],
  comportement: [
    {
      id: "cp-1",
      section: "a_retenir",
      text: "Restez calme et prévisible — ton posé, consignes courtes.",
    },
    {
      id: "cp-2",
      section: "a_essayer",
      text: "Proposez une pause ou un changement d’activité si la tension monte.",
    },
    {
      id: "cp-3",
      section: "a_eviter",
      text: "N’entrez pas dans un rapport de force ni de discussion argumentée.",
    },
    {
      id: "cp-4",
      section: "a_revoir_ensemble",
      text: "Les situations qui déclenchent le plus souvent la difficulté.",
    },
  ],
  autre: [
    {
      id: "ot-1",
      section: "a_retenir",
      text: "Une seule chose à retenir pour cette visite.",
    },
    {
      id: "ot-2",
      section: "a_essayer",
      text: "Testez la consigne une seule fois, sans forcer.",
    },
    {
      id: "ot-3",
      section: "a_eviter",
      text: "N’ajoutez pas d’autres gestes non validés par l’équipe.",
    },
  ],
};

export const THEME_OPTIONS = Object.keys(SKILL_LABELS).map((id) => ({
  id,
  label: SKILL_LABELS[id],
}));

export const SECTION_OPTIONS = (
  Object.keys(MESSAGE_SECTION_LABELS) as ConsigneSection[]
).map((id) => ({
  id,
  label: MESSAGE_SECTION_LABELS[id],
}));

export type SelectedConsigne = {
  key: string;
  theme: string;
  section: ConsigneSection;
  content: string;
  source: "library" | "custom";
};
