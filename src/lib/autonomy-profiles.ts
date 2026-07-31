import type { AutonomyLevel } from "@prisma/client";

/** Ordre du plus autonome au plus dépendant */
export const AUTONOMY_ORDER: AutonomyLevel[] = [
  "autonome",
  "semi_autonome_faible",
  "semi_autonome_eleve",
  "dependant",
  "grabataire",
];

export type CaregiverAutonomyOption = {
  id: AutonomyLevel;
  shortLabel: string;
  sentence: string;
  example: string;
};

/**
 * Profils vulgarisés pour l’aidant (non clinique).
 * Une phrase claire + un exemple concret par niveau.
 */
export const CAREGIVER_AUTONOMY_OPTIONS: CaregiverAutonomyOption[] = [
  {
    id: "autonome",
    shortLabel: "Autonome",
    sentence:
      "Votre proche se déplace et se transfère seul, en sécurité, sans aide.",
    example:
      "Exemple : il se lève du fauteuil ou du lit tout seul — vous restez à proximité par précaution.",
  },
  {
    id: "semi_autonome_faible",
    shortLabel: "Semi-autonome (aide légère)",
    sentence:
      "Il y arrive avec une aide technique (déambulateur, barre…) et un peu de guidance verbale.",
    example:
      "Exemple : vous vérifiez les freins et dites « Posez vos mains sur les accoudoirs », puis il se lève.",
  },
  {
    id: "semi_autonome_eleve",
    shortLabel: "Semi-autonome (besoin de vous près)",
    sentence:
      "Il participe, mais vous devez rester à portée de main — risque de chute réel.",
    example:
      "Exemple : il glisse un peu dans le fauteuil tout seul, et vous guidez le bassin seulement si besoin.",
  },
  {
    id: "dependant",
    shortLabel: "Dépendant",
    sentence:
      "Il a besoin d’une aide humaine pour les transferts — vous ne le faites pas seul sans consignes.",
    example:
      "Exemple : lever du lit ou du fauteuil seulement avec l’équipe ou selon ce qu’elle a validé.",
  },
  {
    id: "grabataire",
    shortLabel: "Grabataire / alité",
    sentence:
      "Il reste au lit : pas de lever ni de transfert de votre côté.",
    example:
      "Exemple : vous êtes là pour parler et rassurer ; toute mobilisation vient de l’équipe soignante.",
  },
];

export function autonomyRank(level: AutonomyLevel): number {
  return AUTONOMY_ORDER.indexOf(level);
}

export function adjacentLevel(
  level: AutonomyLevel,
  direction: "up" | "down"
): AutonomyLevel | null {
  const i = autonomyRank(level);
  if (i < 0) return null;
  const next = direction === "up" ? i - 1 : i + 1;
  return AUTONOMY_ORDER[next] ?? null;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
