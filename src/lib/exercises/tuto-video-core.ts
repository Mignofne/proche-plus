/**
 * Vidéos tuto exercices — types, typo, durées (sans dépendance Node/fs).
 * Spec : docs/exercise-tuto-video-spec.md
 */

export const REMOTION_EXERCISE_TUTO_ID = "ProchePlusExerciseTuto";
export const REMOTION_EXERCISE_TUTO_FACEBOOK_ID =
  "ProchePlusExerciseTutoFacebook";

/** ~2,5 s/étape @ 30 fps — rythme senior */
export const DEFAULT_TUTO_STEP_FRAMES = 75;
export const DEFAULT_TUTO_INTRO_FRAMES = 90;
export const DEFAULT_TUTO_OUTRO_FRAMES = 45;

/** Typo lisible aidant / senior (px @ 1080×1920) — spec verrouillée */
export const TUTO_TYPO = {
  instruction: 58,
  instructionMin: 48,
  stepBadge: 34,
  exerciseTitle: 40,
  meta: 28,
  objective: 32,
} as const;

export type ExerciseTutoStep = {
  /** Consigne verbale (tutoiement) — affichée EN GROS */
  instruction: string;
  /** Image ours démo sous `public/` */
  sceneSrc: string;
  durationInFrames?: number;
};

export type RemotionExerciseTutoProps = {
  exerciseName: string;
  themeLabel: string;
  levelCode: string;
  tier: number;
  objective?: string;
  estimatedDuration?: string | null;
  steps: ExerciseTutoStep[];
  introFrames?: number;
  outroFrames?: number;
  defaultStepFrames?: number;
  accent?: "teal" | "sun" | "terracotta";
  /**
   * Contrôle comment l'image de démo est recadrée dans le panneau bas.
   * Par défaut on montre le bas (ours), et pour les humains on peut orienter vers le haut (visage).
   */
  demoObjectPosition?: string;
};

export function exerciseTutoDurationInFrames(
  props: RemotionExerciseTutoProps
): number {
  const intro = props.introFrames ?? DEFAULT_TUTO_INTRO_FRAMES;
  const outro = props.outroFrames ?? DEFAULT_TUTO_OUTRO_FRAMES;
  const stepDefault = props.defaultStepFrames ?? DEFAULT_TUTO_STEP_FRAMES;
  const stepsSum = (props.steps ?? []).reduce(
    (sum, s) => sum + (s.durationInFrames ?? stepDefault),
    0
  );
  return intro + stepsSum + outro;
}

/** Coupe une consigne longue en 2 lignes pour la typo XL */
export function splitInstructionForDisplay(
  text: string,
  maxCharsPerLine = 32
): string[] {
  const t = text.trim();
  if (t.length <= maxCharsPerLine) return [t];
  const mid = Math.floor(t.length / 2);
  const spaceBefore = t.lastIndexOf(" ", mid);
  const spaceAfter = t.indexOf(" ", mid);
  const splitAt =
    spaceBefore > 10
      ? spaceBefore
      : spaceAfter > 0
        ? spaceAfter
        : mid;
  return [t.slice(0, splitAt).trim(), t.slice(splitAt).trim()].filter(Boolean);
}

export function getExerciseTutoRenderCommand(propsPath: string): string {
  return `npm run community:render-video -- --composition=${REMOTION_EXERCISE_TUTO_ID} --props=${propsPath}`;
}
