export const SKILL_LABELS: Record<string, string> = {
  transfert: "Transfert",
  fauteuil: "Fauteuil",
  toilette: "Toilette",
  communication: "Communication",
  repas: "Repas",
  mobilite: "Mobilité",
  autonomie: "Autonomie",
  comportement: "Comportement",
  autre: "Autre",
};

export const STATUS_LABELS: Record<string, string> = {
  acquis: "Acquis",
  en_cours: "En cours",
  a_reprendre: "À reprendre",
  non_travaille: "Non travaillé",
};

export const AUTONOMY_LABELS: Record<string, string> = {
  autonome: "Autonome",
  semi_autonome_faible: "Semi-autonome (risque faible)",
  semi_autonome_eleve: "Semi-autonome (risque élevé)",
  dependant: "Dépendant",
  grabataire: "Grabataire",
};

export const AUTONOMY_STATUS_LABELS: Record<string, string> = {
  provisoire: "Provisoire",
  confirme: "Confirmé",
  confirme_ajuste: "Confirmé (ajusté)",
};

export const AUTONOMY_SOURCE_LABELS: Record<string, string> = {
  declare_aidant: "Déclaré par l'aidant",
  professionnel: "Professionnel",
};

export const GIR_LABELS: Record<number, string> = {
  1: "GIR 1 — dépendance totale",
  2: "GIR 2 — dépendance sévère",
  3: "GIR 3 — aide plusieurs fois / jour",
  4: "GIR 4 — aide pour transferts / toilette",
  5: "GIR 5 — aide ponctuelle",
  6: "GIR 6 — autonomie pour les actes essentiels",
};

export const CAREGIVER_ACTION_LABELS: Record<string, string> = {
  realise_succes: "Réalisé avec succès",
  essaye: "J'ai essayé",
  doute: "J'ai un doute",
  aide: "Demander de l'aide",
  note: "Laisser une note",
};

export const VISIT_MODE_STEPS = [
  {
    id: "objectif",
    title: "Objectif du jour",
    hint: "Ce que vous venez faire ensemble",
  },
  {
    id: "faire",
    title: "Ce que je peux faire",
    hint: "Consignes à essayer",
  },
  {
    id: "eviter",
    title: "Ce que je ne dois pas faire",
    hint: "Sécurité",
  },
  {
    id: "agir",
    title: "Comment ça s'est passé ?",
    hint: "Dites-nous ce qui s'est passé — ça aide l'équipe pour la prochaine visite",
  },
] as const;

export const MESSAGE_SECTION_LABELS: Record<string, string> = {
  a_retenir: "À retenir",
  a_essayer: "À essayer",
  a_eviter: "À éviter",
  a_revoir_ensemble: "À revoir ensemble",
};

export const FEEDBACK_OUTCOME_LABELS: Record<string, string> = {
  facile: "Oui, facilement",
  difficile: "Oui, mais avec difficulté",
  non_essaye: "Non, je n'ai pas pu",
};

export const DIFFICULTY_OPTIONS = [
  "Mon proche n'a pas voulu / pas pu",
  "J'ai eu peur de le mettre en danger",
  "Je ne savais pas comment m'y prendre",
  "Manque de temps pendant la visite",
  "Autre",
] as const;

export const ONBOARDING_STEPS = [
  {
    id: "comprendre",
    title: "Comprendre",
    content:
      "Votre rôle pendant la réadaptation est d'encourager et d'accompagner — pas de soigner à la place des professionnels.",
  },
  {
    id: "apprendre",
    title: "Apprendre",
    content:
      "Le principe clé : faire faire plutôt que faire à la place. Laissez votre proche essayer avant d'intervenir.",
  },
  {
    id: "pratiquer",
    title: "Pratiquer",
    content:
      "Utilisez des consignes courtes, un seul verbe d'action par phrase. Exemple : « Posez vos mains sur les accoudoirs ».",
  },
  {
    id: "securiser",
    title: "Sécuriser",
    content:
      "Vérifiez les freins du fauteuil, ne forcez jamais un transfert, et demandez de l'aide si vous avez un doute.",
  },
] as const;

export const PREDEFINED_INSTRUCTIONS = [
  "Dites une phrase courte, puis attendez 5 secondes avant d’aider",
  "Exemple : « Glissez un peu vers l’avant » — sans tirer les bras",
  "Guidez le bassin d’une main si besoin, jamais par les aisselles",
  "Encouragez le moindre mouvement : « Bien, continuez »",
  "Si frein du fauteuil : vérifiez-le avant toute aide",
] as const;
