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
  "Laissez votre proche commencer le mouvement avant de l'aider",
  "Donnez une consigne courte puis attendez",
  "Encouragez le changement de position",
  "Utilisez la guidance verbale, pas la traction",
  "Ne réalisez pas un transfert sans supervision",
] as const;
