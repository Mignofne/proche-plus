/**
 * Ours en situation — kit canon déjà validé (ours-canon / Studio Ours).
 * Source unique pour publications Community + page ours-canon.
 *
 * Assets : public/community-assets/ours-canon/scenes-referentiel/
 * Thèmes : REFERENTIEL_THEMES (mascot-gen) — mêmes 8 scènes.
 */

import {
  CANON_IMAGE_PATH,
  REFERENTIEL_THEMES,
  type ReferentielThemeSlug,
} from "@/lib/community/mascot-gen/constants";

export { CANON_IMAGE_PATH };

const SCENE_BASE = "/community-assets/ours-canon/scenes-referentiel";

/** Mapping thème référentiel → fichier scène (kit validé fondateur) */
const THEME_SCENE_FILE: Record<ReferentielThemeSlug, string> = {
  habillage: "scene-habillage.png",
  repas: "scene-repas.png",
  deplacement: "scene-deplacement.png",
  fauteuil: "scene-fauteuil-freins.png",
  toilette: "scene-toilette.png",
  mobilite_lit: "scene-mobilite-lit.png",
  communication: "scene-communication.png",
  cognitif: "scene-cognitif.png",
};

export const SCENE_KEYS = [
  "scene-habillage",
  "scene-repas",
  "scene-deplacement",
  "scene-fauteuil-freins",
  "scene-toilette",
  "scene-mobilite-lit",
  "scene-communication",
  "scene-cognitif",
  /** Preuve cohérence validée (hors protocole 8, mais kit canon) */
  "declinaison-fauteuil",
] as const;

export type SceneKey = (typeof SCENE_KEYS)[number];

export type SceneOption = {
  value: SceneKey;
  label: string;
  src: string;
  /** Slug thème référentiel exercices, si applicable */
  themeSlug?: ReferentielThemeSlug;
};

/** Liste unique — utilisée par éditeur pubs + page ours-canon */
export const SCENE_OPTIONS: readonly SceneOption[] = [
  ...REFERENTIEL_THEMES.map((t) => {
    const file = THEME_SCENE_FILE[t.slug];
    const value = file.replace(/\.png$/, "") as SceneKey;
    return {
      value,
      label: t.label,
      src: `${SCENE_BASE}/${file}`,
      themeSlug: t.slug,
    };
  }),
  {
    value: "declinaison-fauteuil",
    label: "Fauteuil (déclinaison validée)",
    src: "/community-assets/ours-canon/declinaison-fauteuil.png",
  },
] as const;

const SCENE_BY_KEY = Object.fromEntries(
  SCENE_OPTIONS.map((s) => [s.value, s])
) as Record<SceneKey, SceneOption>;

/** Chemin public d’une scène kit */
export function sceneImagePath(sceneKey: string): string {
  if (isSceneKey(sceneKey)) return SCENE_BY_KEY[sceneKey].src;
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
  ...Object.fromEntries(
    REFERENTIEL_THEMES.map((t) => {
      const file = THEME_SCENE_FILE[t.slug];
      return [t.slug, file.replace(/\.png$/, "")];
    })
  ),
  "mode-visite": "scene-communication",
  "benefices-aidants": "scene-cognitif",
  "exercices-continuite": "scene-habillage",
  "autonomie-quotidien": "scene-deplacement",
  "lien-aidant-pro": "scene-communication",
  "vision-mission": "scene-cognitif",
  "temoignages-anonymises": "scene-communication",
  "beta-invitation": "scene-habillage",
} as Record<string, SceneKey>;

export function isSceneKey(
  value: string | null | undefined
): value is SceneKey {
  return !!value && (SCENE_KEYS as readonly string[]).includes(value);
}

/**
 * Résout la scène kit (priorité : explicite → imageSrc kit → thème → pose → défaut).
 */
export function resolveSceneKey(params: {
  sceneKey?: string | null;
  imageSrc?: string | null;
  themeSlug?: string | null;
  poseKey?: string | null;
}): SceneKey {
  if (isSceneKey(params.sceneKey)) return params.sceneKey;

  if (params.imageSrc) {
    const bySrc = SCENE_OPTIONS.find((s) => s.src === params.imageSrc);
    if (bySrc) return bySrc.value;
    const match = params.imageSrc.match(
      /(?:scenes-referentiel\/)?(scene-[\w-]+|declinaison-fauteuil)\.png/
    );
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
  // imageSrc hors kit (ex. média licence-ok / future gen Studio) uniquement si URL explicite
  if (
    params.imageSrc &&
    (params.imageSrc.startsWith("/") || params.imageSrc.startsWith("http")) &&
    !params.sceneKey
  ) {
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
