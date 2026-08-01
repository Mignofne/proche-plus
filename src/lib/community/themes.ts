/** Seed data — 9 thèmes content-themes.md (FR15) */

export const COMMUNITY_THEME_SEED = [
  {
    slug: "vision-mission",
    label: "Vision & mission Proche+",
    description:
      "Expliquer la raison d’être, les valeurs et le changement recherché pour les proches et les équipes.",
    networks: ["instagram", "threads", "facebook", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#ProchePlus",
      "#Aidants",
      "#Autonomie",
      "#ImpactSocial",
      "#CaregiverSupport",
    ],
  },
  {
    slug: "benefices-aidants",
    label: "Bénéfices pour les aidants",
    description:
      "Montrer des gains concrets : repères, continuité, sérénité et temps retrouvé.",
    networks: ["instagram", "threads", "facebook", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#Aidants",
      "#ProchesAidants",
      "#SoutienAuxAidants",
      "#BienEtre",
      "#Caregivers",
    ],
  },
  {
    slug: "exercices-continuite",
    label: "Exercices & continuité éducative",
    description:
      "Valoriser les exercices simples, la répétition et la continuité entre accompagnements.",
    networks: ["instagram", "facebook", "tiktok", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#ExercicesDuQuotidien",
      "#ContinuitéÉducative",
      "#ApprendreAutrement",
      "#AutonomieAuQuotidien",
      "#DailyLiving",
    ],
  },
  {
    slug: "mode-visite",
    label: "Mode visite & moments partagés",
    description:
      "Présenter des idées de visites actives, simples et adaptées, sans promesse clinique.",
    networks: ["instagram", "facebook", "tiktok", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#ModeVisite",
      "#TempsPartagé",
      "#LienSocial",
      "#Proches",
      "#FamilyCare",
    ],
  },
  {
    slug: "temoignages-anonymises",
    label: "Témoignages anonymisés",
    description:
      "Partager une expérience anonymisée, relue, sans donnée identifiable. CAP-11 si attribuable.",
    networks: ["instagram", "threads", "facebook", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#Témoignage",
      "#ParoleDAidant",
      "#ParoleDePro",
      "#VécuPartagé",
      "#CareStories",
    ],
  },
  {
    slug: "lien-aidant-pro",
    label: "Lien aidant–pro–établissement",
    description:
      "Mettre en avant la coopération, des repères communs et une communication respectueuse.",
    networks: ["instagram", "threads", "facebook", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#AidantsEtPros",
      "#Coordination",
      "#Accompagnement",
      "#LienHumain",
      "#CareTeam",
    ],
  },
  {
    slug: "autonomie-quotidien",
    label: "Autonomie au quotidien",
    description:
      "Vulgariser une situation ordinaire et des pistes d’adaptation ; aucun code GIR ni conseil clinique.",
    networks: ["instagram", "facebook", "tiktok", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#Autonomie",
      "#VieQuotidienne",
      "#AstucesDuQuotidien",
      "#Inclusion",
      "#IndependentLiving",
    ],
  },
  {
    slug: "beta-invitation",
    label: "Bêta & invitation à tester",
    description:
      "Inviter des aidants, pros ou proches à essayer Proche+ et à donner un retour.",
    networks: ["instagram", "threads", "facebook", "tiktok", "blog"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#BetaTest",
      "#TesterProchePlus",
      "#ConstruisonsEnsemble",
      "#InnovationSociale",
      "#UserFeedback",
    ],
  },
  {
    slug: "guides-education",
    label: "Guides & repères pour comprendre",
    description:
      "Répondre à une question éducative fréquente dans un contenu sourcé, accessible et actionnable.",
    networks: ["blog", "instagram", "threads", "facebook"],
    formats: ["classique", "video", "article"],
    suggestedTags: [
      "#GuidePratique",
      "#ConseilsAidants",
      "#ComprendrePourAgir",
      "#Éducation",
      "#CaregiverTips",
    ],
  },
] as const;

const FORBIDDEN_TAG =
  /\b(gir\s*\d|phi|patient|diagnostic|ordonnance|établissement\s+[A-Z])/i;

export function validateEditableTags(tags: string[]): {
  ok: boolean;
  rejected: string[];
} {
  const rejected = tags.filter((t) => FORBIDDEN_TAG.test(t));
  return { ok: rejected.length === 0, rejected };
}
