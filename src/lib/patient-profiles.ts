/** Profils patient (specs §1.1) → consignes types adaptées au risque */

export type AutonomyProfile = {
  id: string;
  label: string;
  description: string;
  girSuggest: number;
  allowedHints: string[];
  forbiddenHints: string[];
  objectiveExample: string;
  instructionExample: string;
};

export const PATIENT_PROFILES: AutonomyProfile[] = [
  {
    id: "autonome",
    label: "Autonome",
    description: "Se déplace avec sécurité",
    girSuggest: 6,
    allowedHints: [
      "Encouragez-le à initier le geste seul",
      "Restez à proximité sans intervenir d’emblée",
    ],
    forbiddenHints: [
      "Ne faites pas le geste à sa place « pour aller plus vite »",
    ],
    objectiveExample: "Le laisser commencer seul le transfert fauteuil ↔ lit",
    instructionExample:
      "1) Demandez-lui de se lever.\n2) Attendez qu’il commence.\n3) N’intervenez que s’il demande de l’aide.",
  },
  {
    id: "semi_autonome_faible",
    label: "Semi-autonome (risque faible)",
    description: "Aide technique, risque de chute faible à élevé",
    girSuggest: 5,
    allowedHints: [
      "Vérifiez freins et aides techniques avant",
      "Donnez une consigne courte, puis attendez",
    ],
    forbiddenHints: [
      "Ne retirez pas l’aide technique prescrite",
    ],
    objectiveExample: "Utiliser l’aide technique avec guidance verbale",
    instructionExample:
      "1) Vérifiez les freins.\n2) Dites « Posez vos mains sur les accoudoirs ».\n3) Attendez 5 secondes avant d’aider légèrement.",
  },
  {
    id: "semi_autonome_eleve",
    label: "Semi-autonome (risque élevé)",
    description: "Aide humaine à proximité, risque de chute élevé",
    girSuggest: 4,
    allowedHints: [
      "Restez à portée de main",
      "Guidance verbale d’abord, mains ensuite",
      "Repositionnement : guider le bassin, pas tirer les bras",
    ],
    forbiddenHints: [
      "Ne tirez pas par les bras ou les aisselles",
      "Ne réalisez pas un transfert sans frein / supervision",
    ],
    objectiveExample:
      "Aider à se repositionner dans le fauteuil — sans le soulever à sa place",
    instructionExample:
      "1) Dites « Glissez un peu vers l’avant ».\n2) Attendez qu’il bouge.\n3) Si besoin, guidez le bassin d’une main sans tirer les bras.\n4) Félicitez le moindre effort.",
  },
  {
    id: "dependant",
    label: "Dépendant",
    description: "Nécessite une aide humaine pour les transferts",
    girSuggest: 3,
    allowedHints: [
      "Participez seulement aux gestes validés par l’équipe",
      "Encouragez la participation verbale (compter ensemble)",
    ],
    forbiddenHints: [
      "Ne tentez aucun transfert seul sans consignes validées",
      "N’improvisez pas de technique non montrée",
    ],
    objectiveExample: "Participer au transfert uniquement sous consignes validées",
    instructionExample:
      "1) Demandez à l’équipe ce qui est autorisé aujourd’hui.\n2) Comptez à voix haute avec votre proche.\n3) N’ajoutez aucune force non prévue.",
  },
  {
    id: "grabataire",
    label: "Grabataire",
    description: "Alité",
    girSuggest: 1,
    allowedHints: [
      "Mobilisation au lit uniquement si prescrite",
      "Parole, présence, encouragements",
    ],
    forbiddenHints: [
      "Ne tentez aucun lever / transfert",
      "Ne changez pas de position sans consignes soignantes",
    ],
    objectiveExample: "Accompagner en chambre : parole et présence sécurisée",
    instructionExample:
      "1) Asseyez-vous à hauteur du regard.\n2) Parlez calmement.\n3) Toute mobilisation : uniquement si l’équipe l’a validée.",
  },
];

export function getProfile(id: string) {
  return PATIENT_PROFILES.find((p) => p.id === id);
}
