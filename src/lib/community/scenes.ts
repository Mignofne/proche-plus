/**
 * Ours en situation — scènes référentiel curatées (pas de médaillon).
 * Assets : public/community-assets/ours-canon/scenes-referentiel/
 */

export const SCENE_KEYS = [
  "scene-habillage",
  "scene-repas",
  "scene-deplacement",
  "scene-fauteuil-freins",
  "scene-toilette",
  "scene-mobilite-lit",
  "scene-communication",
  "scene-cognitif",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export const SCENE_OPTIONS: ReadonlyArray<{
  value: SceneKey;
  label: string;
}> = [
  { value: "scene-communication", label: "Communication / écoute" },
  { value: "scene-cognitif", label: "Mémoire / attention" },
  { value: "scene-habillage", label: "Habillage" },
  { value: "scene-repas", label: "Repas" },
  { value: "scene-deplacement", label: "Déplacement" },
  { value: "scene-fauteuil-freins", label: "Fauteuil" },
  { value: "scene-toilette", label: "Toilette / hygiène" },
  { value: "scene-mobilite-lit", label: "Mobilité au lit" },
];

const SCENE_BASE = "/community-assets/ours-canon/scenes-referentiel";

/** Chemin public d’une scène (avec ou sans préfixe scene-) */
export function sceneImagePath(sceneKey: string): string {
  const key = sceneKey.startsWith("scene-") ? sceneKey : `scene-${sceneKey}`;
  return `${SCENE_BASE}/${key}.png`;
}

const POSE_TO_SCENE: Record<string, SceneKey> = {
  accueil: "scene-communication",
  welcome: "scene-communication",
  encourage: "scene-cognitif",
  patience: "scene-mobilite-lit",
  celebration: "scene-habillage",
  celebrate: "scene-habillage",
  vigilance: "scene-fauteuil-freins",
  curiosite: "scene-deplacement",
  question: "scene-deplacement",
};

const THEME_TO_SCENE: Record<string, SceneKey> = {
  habillage: "scene-habillage",
  repas: "scene-repas",
  deplacement: "scene-deplacement",
  fauteuil: "scene-fauteuil-freins",
  toilette: "scene-toilette",
  mobilite_lit: "scene-mobilite-lit",
  communication: "scene-communication",
  cognitif: "scene-cognitif",
  "mode-visite": "scene-communication",
  "benefices-aidants": "scene-cognitif",
  "exercices-continuite": "scene-habillage",
  "autonomie-quotidien": "scene-deplacement",
  "lien-aidant-pro": "scene-communication",
  "vision-mission": "scene-cognitif",
  "temoignages-anonymises": "scene-communication",
  "beta-invitation": "scene-habillage",
};

export function isSceneKey(value: string | null | undefined): value is SceneKey {
  return !!value && (SCENE_KEYS as readonly string[]).includes(value);
}

/**
 * Résout la scène à afficher (priorité : explicite → imageSrc → thème → pose → défaut).
 */
export function resolveSceneKey(params: {
  sceneKey?: string | null;
  imageSrc?: string | null;
  themeSlug?: string | null;
  poseKey?: string | null;
}): SceneKey {
  if (isSceneKey(params.sceneKey)) return params.sceneKey;

  if (params.imageSrc) {
    const match = params.imageSrc.match(/scenes-referentiel\/(scene-[\w-]+)\.png/);
    if (match && isSceneKey(match[1])) return match[1];
  }

  if (params.themeSlug && THEME_TO_SCENE[params.themeSlug]) {
    return THEME_TO_SCENE[params.themeSlug];
  }

  if (params.poseKey && POSE_TO_SCENE[params.poseKey]) {
    return POSE_TO_SCENE[params.poseKey];
  }

  return "scene-communication";
}

export function resolveSceneSrc(params: {
  sceneKey?: string | null;
  imageSrc?: string | null;
  themeSlug?: string | null;
  poseKey?: string | null;
}): string {
  if (params.imageSrc?.startsWith("/") || params.imageSrc?.startsWith("http")) {
    return params.imageSrc;
  }
  return sceneImagePath(resolveSceneKey(params));
}

/** Couleurs texte par défaut — style réf. Alan (bleu / lavande) */
export const DEFAULT_TITLE_COLOR = "#5B6BC0";
export const DEFAULT_SUBTITLE_COLOR = "#8B7BB5";

export const TEXT_COLOR_PRESETS = [
  { value: "#5B6BC0", label: "Bleu Alan" },
  { value: "#8B7BB5", label: "Lavande" },
  { value: "#2A9D8F", label: "Teal Proche+" },
  { value: "#C67B5C", label: "Terracotta" },
  { value: "#2D2A26", label: "Brun texte" },
  { value: "#FFFFFF", label: "Blanc" },
] as const;

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!HEX_RE.test(trimmed)) return fallback;
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return trimmed.toUpperCase();
}
