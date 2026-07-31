import type { AutonomyLevel, PrismaClient } from "@prisma/client";

type SeedExercise = {
  key: string;
  themeSlug: string;
  levelCode: string;
  tier: number;
  name: string;
  objective: string;
  steps: string[];
  caregiverCan: string[];
  caregiverMustNot: string[];
  estimatedDuration: string;
  risks: string;
  crossesAutonomyLevel: boolean;
  alertOnFailure: boolean;
  status: "publie" | "brouillon";
  onSuccessKey?: string | null;
  onPartialKey?: string | null;
  onFailureKey?: string | null;
};

const THEMES = [
  { slug: "habillage", label: "S'habiller", icon: "🧥", displayOrder: 1 },
  { slug: "repas", label: "Manger", icon: "🍽️", displayOrder: 2 },
  { slug: "deplacement", label: "Se déplacer", icon: "🚶", displayOrder: 3 },
  { slug: "fauteuil", label: "Fauteuil", icon: "♿", displayOrder: 4 },
  { slug: "toilette", label: "Toilette / hygiène", icon: "🚿", displayOrder: 5 },
  { slug: "mobilite_lit", label: "Mobilité au lit", icon: "🛏️", displayOrder: 6 },
  { slug: "communication", label: "Communication", icon: "🗣️", displayOrder: 7 },
  { slug: "cognitif", label: "Mémoire / attention", icon: "🧠", displayOrder: 8 },
];

const SCALES: {
  code: string;
  label: string;
  patientEnum: AutonomyLevel;
  displayOrder: number;
}[] = [
  {
    code: "A",
    label: "Autonome",
    patientEnum: "autonome",
    displayOrder: 1,
  },
  {
    code: "B",
    label: "Semi-autonome, aide technique, risque faible à modéré",
    patientEnum: "semi_autonome_faible",
    displayOrder: 2,
  },
  {
    code: "C",
    label: "Semi-autonome, aide humaine à proximité, risque élevé",
    patientEnum: "semi_autonome_eleve",
    displayOrder: 3,
  },
  {
    code: "D",
    label: "Dépendant pour les transferts",
    patientEnum: "dependant",
    displayOrder: 4,
  },
  {
    code: "E",
    label: "Grabataire / alité",
    patientEnum: "grabataire",
    displayOrder: 5,
  },
];

/** Matrice Fauteuil complète + exemples référentiel (S'habiller/B, Manger/D) */
const EXERCISES: SeedExercise[] = [
  {
    key: "fauteuil-E1",
    themeSlug: "fauteuil",
    levelCode: "E",
    tier: 1,
    name: "Mobilisation passive des membres en fauteuil roulant, aidé",
    objective:
      "Que votre proche reçoive une mobilisation douce des bras et des jambes en fauteuil, sans aucun transfert.",
    steps: [
      "Installe-toi confortablement, je reste près de toi.",
      "On bouge doucement une jambe, puis l'autre.",
      "Dis-moi si un geste te gêne.",
    ],
    caregiverCan: [
      "Suivre uniquement les gestes montrés par l'équipe",
      "Parler calmement et observer les signes d'inconfort",
    ],
    caregiverMustNot: [
      "Tenter un transfert ou un lever",
      "Forcer une articulation",
    ],
    estimatedDuration: "5 minutes",
    risks: "Aucun transfert ; arrêter dès douleur ou inconfort.",
    crossesAutonomyLevel: true,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-D1",
    onPartialKey: "fauteuil-E1",
    onFailureKey: null,
  },
  {
    key: "fauteuil-D1",
    themeSlug: "fauteuil",
    levelCode: "D",
    tier: 1,
    name: "Participer au transfert avec assistance complète",
    objective:
      "Que votre proche participe (voix, regard, effort minimal) au transfert selon la technique enseignée.",
    steps: [
      "On vérifie les freins ensemble.",
      "On compte jusqu'à trois avant de bouger.",
      "Aide-moi avec ce que tu peux, même un peu.",
    ],
    caregiverCan: [
      "Appliquer uniquement la technique validée par l'équipe",
      "Encourager la participation verbale",
    ],
    caregiverMustNot: [
      "Improviser une autre technique",
      "Tirer votre proche par les bras",
    ],
    estimatedDuration: "5 à 10 minutes",
    risks: "Respecter la technique enseignée ; freins obligatoires.",
    crossesAutonomyLevel: false,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-D2",
    onPartialKey: "fauteuil-D1",
    onFailureKey: "fauteuil-E1",
  },
  {
    key: "fauteuil-D2",
    themeSlug: "fauteuil",
    levelCode: "D",
    tier: 2,
    name: "Initier le mouvement de transfert avant l'aide",
    objective:
      "Que votre proche initie le début du transfert avant que vous n'assistiez.",
    steps: [
      "Prépare-toi à bouger quand tu es prêt.",
      "Commence le geste, je t'aide juste après.",
      "On y va à ton rythme.",
    ],
    caregiverCan: [
      "Attendre l'initiation avant d'assister",
      "Guider verbalement puis manuellement si besoin",
    ],
    caregiverMustNot: [
      "Faire tout le geste à sa place dès le départ",
    ],
    estimatedDuration: "5 à 10 minutes",
    risks: "Ne pas forcer si votre proche ne peut pas initier.",
    crossesAutonomyLevel: true,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-C1",
    onPartialKey: "fauteuil-D2",
    onFailureKey: "fauteuil-D1",
  },
  {
    key: "fauteuil-C1",
    themeSlug: "fauteuil",
    levelCode: "C",
    tier: 1,
    name: "Faire un demi-tour en fauteuil",
    objective:
      "Que votre proche réalise seul un changement de direction en sécurité.",
    steps: [
      "Regarde où tu veux aller.",
      "Bloque la roue droite avec ta main droite.",
      "Pousse uniquement sur la roue gauche.",
      "Vérifie que le passage est libre avant de continuer.",
    ],
    caregiverCan: [
      "Rester à côté, rappeler la consigne si votre proche hésite",
    ],
    caregiverMustNot: ["Pousser le fauteuil à la place de votre proche"],
    estimatedDuration: "5 minutes",
    risks:
      "Risque de chute si obstacle non repéré ; vérifier le verrouillage des roues avant le geste.",
    crossesAutonomyLevel: false,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-C2",
    onPartialKey: "fauteuil-C1",
    onFailureKey: "fauteuil-D2",
  },
  {
    key: "fauteuil-C2",
    themeSlug: "fauteuil",
    levelCode: "C",
    tier: 2,
    name: "Franchir un léger seuil de porte avec supervision",
    objective:
      "Que votre proche franchisse un petit seuil en fauteuil avec votre supervision proche.",
    steps: [
      "Approche-toi du seuil bien droit.",
      "Pousse un peu plus fort sur les deux roues.",
      "Continue jusqu'à ce que les roues arrière aient passé.",
    ],
    caregiverCan: [
      "Rester à portée de main",
      "Stabiliser le fauteuil seulement si bascule",
    ],
    caregiverMustNot: [
      "Pousser le fauteuil sans laisser votre proche essayer",
    ],
    estimatedDuration: "5 minutes",
    risks: "Seuil trop haut ou sol glissant — choisir un passage sûr.",
    crossesAutonomyLevel: true,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-B1",
    onPartialKey: "fauteuil-C2",
    onFailureKey: "fauteuil-C1",
  },
  {
    key: "fauteuil-B1",
    themeSlug: "fauteuil",
    levelCode: "B",
    tier: 1,
    name: "Propulsion autonome sur trajet court, aidant à distance",
    objective:
      "Que votre proche se propulse seul sur un trajet court, vous restant à distance visuelle.",
    steps: [
      "Choisis ton trajet jusqu'à la porte.",
      "Pousse régulièrement sur les deux roues.",
      "Arrête-toi quand tu es arrivé.",
    ],
    caregiverCan: [
      "Rester dans la pièce, intervenir seulement si demandé ou danger",
    ],
    caregiverMustNot: [
      "Suivre de trop près en poussant le fauteuil",
    ],
    estimatedDuration: "5 minutes",
    risks: "Obstacles au sol ; fatigue.",
    crossesAutonomyLevel: false,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-B2",
    onPartialKey: "fauteuil-B1",
    onFailureKey: "fauteuil-C2",
  },
  {
    key: "fauteuil-B2",
    themeSlug: "fauteuil",
    levelCode: "B",
    tier: 2,
    name: "Trajet plus long avec changement de direction autonome",
    objective:
      "Que votre proche enchaîne un trajet plus long avec un changement de direction sans aide.",
    steps: [
      "Pars jusqu'au couloir.",
      "Fais ton demi-tour quand tu es prêt.",
      "Reviens jusqu'ici à ton rythme.",
    ],
    caregiverCan: ["Observer à distance, encourager verbalement"],
    caregiverMustNot: ["Corriger le trajet en poussant le fauteuil"],
    estimatedDuration: "8 minutes",
    risks: "Fatigue ; circulation dans le couloir.",
    crossesAutonomyLevel: true,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "fauteuil-A1",
    onPartialKey: "fauteuil-B2",
    onFailureKey: "fauteuil-B1",
  },
  {
    key: "fauteuil-A1",
    themeSlug: "fauteuil",
    levelCode: "A",
    tier: 1,
    name: "Déplacement autonome en fauteuil, aidant en simple observation",
    objective:
      "Que votre proche se déplace en autonomie, vous restant en simple observation.",
    steps: [
      "Choisis où tu veux aller.",
      "Gère ton trajet tout seul.",
      "Dis-moi si tu as besoin de moi.",
    ],
    caregiverCan: ["Observer, répondre seulement si demandé"],
    caregiverMustNot: [
      "Intervenir sans demande sauf danger immédiat",
    ],
    estimatedDuration: "10 minutes",
    risks: "Un échec à ce niveau peut signaler une régression — alerter l'équipe.",
    crossesAutonomyLevel: false,
    alertOnFailure: true,
    status: "publie",
    onSuccessKey: "fauteuil-A1",
    onPartialKey: "fauteuil-A1",
    onFailureKey: "fauteuil-B2",
  },
  {
    key: "habillage-B1",
    themeSlug: "habillage",
    levelCode: "B",
    tier: 1,
    name: "Enfiler son gilet en position assise",
    objective:
      "Que votre proche enfile seul son gilet en gérant son équilibre assis.",
    steps: [
      "Pose le gilet sur tes genoux, l'intérieur vers toi.",
      "Passe d'abord le bras du côté le plus difficile.",
      "Prends ton temps pour ramener l'autre pan derrière toi.",
    ],
    caregiverCan: [
      "Présenter le vêtement dans le bon sens, encourager verbalement",
    ],
    caregiverMustNot: [
      "Habiller votre proche à sa place par souci de rapidité",
    ],
    estimatedDuration: "3 minutes",
    risks: "Vérifier la stabilité assise avant de commencer si risque de bascule.",
    crossesAutonomyLevel: false,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "habillage-B1",
    onPartialKey: "habillage-B1",
    onFailureKey: null,
  },
  {
    key: "repas-D1",
    themeSlug: "repas",
    levelCode: "D",
    tier: 1,
    name: "Porter la cuillère seul avec appui du poignet",
    objective:
      "Que votre proche conserve le geste du repas malgré une dépendance pour les déplacements.",
    steps: [
      "Installe-toi bien en face de l'assiette.",
      "Prends la cuillère, je reste juste à côté.",
      "Prends ton temps, il n'y a pas d'urgence.",
    ],
    caregiverCan: [
      "Stabiliser le plat si besoin, encourager, ne pas presser le rythme",
    ],
    caregiverMustNot: [
      "Faire manger votre proche systématiquement à sa place",
    ],
    estimatedDuration: "Durée du repas",
    risks:
      "Surveiller les troubles de la déglutition éventuels (à valider avec l'équipe).",
    crossesAutonomyLevel: false,
    alertOnFailure: false,
    status: "publie",
    onSuccessKey: "repas-D1",
    onPartialKey: "repas-D1",
    onFailureKey: null,
  },
];

export const CATALOG_THEMES = THEMES;
export const CATALOG_SCALES = SCALES;

export async function seedExerciseCatalog(prisma: PrismaClient) {
  await prisma.exerciseAttempt.deleteMany();
  await prisma.professionalAlert.deleteMany();
  await prisma.patientExercise.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.autonomyScale.deleteMany();

  return fillExerciseCatalog(prisma);
}

/**
 * Remplit le catalogue s'il est vide — sans toucher aux patients / utilisateurs.
 * À appeler au build Vercel et en secours côté app (prod sans seed manuel).
 */
export async function ensureExerciseCatalog(prisma: PrismaClient) {
  const themeCount = await prisma.theme.count();
  if (themeCount > 0) {
    await ensureDemoPatientExercise(prisma);
    return { seeded: false as const };
  }

  const result = await fillExerciseCatalog(prisma);
  await ensureDemoPatientExercise(prisma, result.idByKey);
  return { seeded: true as const, ...result };
}

async function fillExerciseCatalog(prisma: PrismaClient) {
  for (const t of THEMES) {
    await prisma.theme.create({ data: t });
  }

  for (const s of SCALES) {
    await prisma.autonomyScale.create({ data: s });
  }

  const themes = await prisma.theme.findMany();
  const scales = await prisma.autonomyScale.findMany();
  const themeBySlug = Object.fromEntries(themes.map((t) => [t.slug, t]));
  const scaleByCode = Object.fromEntries(scales.map((s) => [s.code, s]));

  const idByKey = new Map<string, string>();

  for (const ex of EXERCISES) {
    const created = await prisma.exercise.create({
      data: {
        themeId: themeBySlug[ex.themeSlug].id,
        autonomyScaleId: scaleByCode[ex.levelCode].id,
        tier: ex.tier,
        name: ex.name,
        objective: ex.objective,
        steps: JSON.stringify(ex.steps),
        caregiverCan: JSON.stringify(ex.caregiverCan),
        caregiverMustNot: JSON.stringify(ex.caregiverMustNot),
        estimatedDuration: ex.estimatedDuration,
        risks: ex.risks,
        crossesAutonomyLevel: ex.crossesAutonomyLevel,
        alertOnFailure: ex.alertOnFailure,
        status: ex.status,
        validatedBy: ex.status === "publie" ? "Référentiel APA (démo)" : null,
        validatedAt: ex.status === "publie" ? new Date() : null,
      },
    });
    idByKey.set(ex.key, created.id);
  }

  for (const ex of EXERCISES) {
    const id = idByKey.get(ex.key)!;
    await prisma.exercise.update({
      where: { id },
      data: {
        onSuccessExerciseId: ex.onSuccessKey
          ? idByKey.get(ex.onSuccessKey) ?? null
          : null,
        onPartialExerciseId: ex.onPartialKey
          ? idByKey.get(ex.onPartialKey) ?? null
          : id,
        onFailureExerciseId: ex.onFailureKey
          ? idByKey.get(ex.onFailureKey) ?? null
          : null,
      },
    });
  }

  return { idByKey, themeBySlug, scaleByCode };
}

/** Active Fauteuil C1 pour Marie Martin si aucun exercice courant. */
async function ensureDemoPatientExercise(
  prisma: PrismaClient,
  idByKey?: Map<string, string>
) {
  const marie = await prisma.patient.findFirst({
    where: { firstName: "Marie", lastName: "Martin" },
  });
  if (!marie) return;

  const current = await prisma.patientExercise.count({
    where: { patientId: marie.id, isCurrent: true },
  });
  if (current > 0) return;

  let exerciseId = idByKey?.get("fauteuil-C1");
  if (!exerciseId) {
    const ex = await prisma.exercise.findFirst({
      where: {
        status: "publie",
        name: "Faire un demi-tour en fauteuil",
        theme: { slug: "fauteuil" },
      },
    });
    exerciseId = ex?.id;
  }
  if (!exerciseId) return;

  const pro = await prisma.professional.findFirst({
    where: { establishmentId: marie.establishmentId },
  });

  await prisma.patientExercise.upsert({
    where: {
      patientId_exerciseId: {
        patientId: marie.id,
        exerciseId,
      },
    },
    create: {
      patientId: marie.id,
      exerciseId,
      currentStatus: "actif",
      activatedById: pro?.id ?? null,
      activatedAt: new Date(),
      isCurrent: true,
    },
    update: {
      currentStatus: "actif",
      isCurrent: true,
      activatedAt: new Date(),
    },
  });
}
