/**
 * Scénarios ours CAP-9 + pose pack (AD-11 kit-only).
 * Source visuelle = mascotte produit (`BearFace` / `Mascot`), pas des cercles génériques.
 */

import type { MascotPose } from "@/components/mascot/BearFace";
import { toMascotPose } from "@/components/mascot/BearFace";

export type PosePackEntry = {
  key: string;
  label: string;
  /** Pose Mascot produit */
  mascotPose: MascotPose;
  /** SVG miroir du BearFace (legacy / staticFile) */
  assetPath: string;
};

export const POSE_PACK: readonly PosePackEntry[] = [
  {
    key: "accueil",
    label: "Accueil",
    mascotPose: "welcome",
    assetPath: "/community-assets/bear-pose-pack/accueil.svg",
  },
  {
    key: "encourage",
    label: "Encouragement",
    mascotPose: "encourage",
    assetPath: "/community-assets/bear-pose-pack/encourage.svg",
  },
  {
    key: "patience",
    label: "Patience",
    mascotPose: "patience",
    assetPath: "/community-assets/bear-pose-pack/patience.svg",
  },
  {
    key: "celebration",
    label: "Célébration",
    mascotPose: "celebrate",
    assetPath: "/community-assets/bear-pose-pack/celebration.svg",
  },
  {
    key: "vigilance",
    label: "Vigilance",
    mascotPose: "vigilance",
    assetPath: "/community-assets/bear-pose-pack/vigilance.svg",
  },
  {
    key: "curiosite",
    label: "Curiosité",
    mascotPose: "question",
    assetPath: "/community-assets/bear-pose-pack/curiosite.svg",
  },
] as const;

export { toMascotPose };

export function resolvePosePackKey(poseKey?: string | null): string {
  if (!poseKey) return "encourage";
  const found = POSE_PACK.find(
    (p) => p.key === poseKey || p.mascotPose === poseKey
  );
  return found?.key ?? "encourage";
}

export const BEAR_SCENARIO_SEED = [
  {
    slug: "ours-petit-pas",
    title: "Un petit pas compte",
    bearRole: "Compagnon",
    themeSlug: "benefices-aidants",
    poseKeys: ["patience", "encourage"],
    beatSheet: [
      "Ours patience",
      "Pas besoin de tout faire",
      "Une action simple",
      "Encouragement",
      "CTA consulter le guide",
    ],
    suggestedTags: ["#Aidants", "#UnPetitPas", "#SoutienAuxAidants", "#Caregivers"],
  },
  {
    slug: "ours-idee-visite",
    title: "Une idée pour la visite",
    bearRole: "Guide",
    themeSlug: "mode-visite",
    poseKeys: ["curiosite", "encourage"],
    beatSheet: [
      "Ours curieux",
      "Situation de visite symbolique",
      "Activité courte",
      "À votre rythme",
      "CTA mode visite",
    ],
    suggestedTags: ["#ModeVisite", "#TempsPartagé", "#LienSocial", "#FamilyCare"],
  },
  {
    slug: "ours-routine-exercice",
    title: "On essaie tranquillement",
    bearRole: "Compagnon",
    themeSlug: "exercices-continuite",
    poseKeys: ["accueil", "encourage"],
    beatSheet: [
      "Ours accueil",
      "Bénéfice de la régularité",
      "Exemple non clinique",
      "Suivre l’équipe",
      "CTA repères",
    ],
    suggestedTags: [
      "#ExercicesDuQuotidien",
      "#ContinuitéÉducative",
      "#AutonomieAuQuotidien",
    ],
  },
  {
    slug: "ours-lien-equipe",
    title: "Un même repère, ensemble",
    bearRole: "Cameo",
    themeSlug: "lien-aidant-pro",
    poseKeys: ["accueil", "patience"],
    beatSheet: [
      "Silhouettes symboliques",
      "Ours à côté",
      "Repère partagé",
      "Continuité",
      "CTA guide",
    ],
    suggestedTags: ["#AidantsEtPros", "#Coordination", "#Accompagnement", "#CareTeam"],
  },
  {
    slug: "ours-quotidien",
    title: "L’autonomie se joue aussi ici",
    bearRole: "Guide",
    themeSlug: "autonomie-quotidien",
    poseKeys: ["curiosite", "vigilance"],
    beatSheet: [
      "Ours question",
      "Situation ordinaire",
      "Adaptation accessible",
      "Prudence douce",
      "CTA lecture",
    ],
    suggestedTags: ["#Autonomie", "#VieQuotidienne", "#AstucesDuQuotidien"],
  },
  {
    slug: "ours-temoignage",
    title: "Une parole, sans étiquette",
    bearRole: "Cameo",
    themeSlug: "temoignages-anonymises",
    poseKeys: ["patience", "accueil"],
    beatSheet: [
      "Ours écoute",
      "Citation anonymisée",
      "Leçon humaine",
      "Remerciement",
      "CTA récits",
    ],
    suggestedTags: ["#Témoignage", "#ParoleDAidant", "#CareStories"],
  },
  {
    slug: "ours-vision",
    title: "Pourquoi Proche+ existe",
    bearRole: "Héros",
    themeSlug: "vision-mission",
    poseKeys: ["accueil", "encourage"],
    beatSheet: [
      "Ours accueil",
      "Problème de continuité",
      "Vision de lien",
      "Valeur humaine",
      "CTA en savoir plus",
    ],
    suggestedTags: ["#ProchePlus", "#Aidants", "#ImpactSocial"],
  },
  {
    slug: "ours-beta",
    title: "Construisons Proche+ ensemble",
    bearRole: "Héros",
    themeSlug: "beta-invitation",
    poseKeys: ["accueil", "celebration"],
    beatSheet: [
      "Ours accueil",
      "Invitation claire",
      "Pour qui",
      "Ce qui est attendu",
      "CTA candidater",
    ],
    suggestedTags: ["#BetaTest", "#TesterProchePlus", "#UserFeedback"],
  },
] as const;

export const EDITORIAL_GUARDS_FR = [
  "Ours adulte uniquement — jamais infantile.",
  "Aucun geste médical ou de soin mis en scène.",
  "Aucune PHI, code GIR ou personne identifiable sans attestation CAP-11.",
  "Pas d’appel à un générateur d’images (fal / Replicate) — kit curaté uniquement.",
  "Source visuelle = mascotte produit (BearFace / Mascot).",
] as const;
