/**
 * Vidéos tuto exercices — helpers build (CSV référentiel).
 * Spec : docs/exercise-tuto-video-spec.md
 */
import type { ReferentielExercise } from "./referentiel-lookup";
import { exerciseTutoSlug } from "./referentiel-lookup";
import type { RemotionExerciseTutoProps } from "./tuto-video-core";

export * from "./tuto-video-core";

export function buildTutoPropsFromExercise(
  ex: ReferentielExercise,
  scenes: string[]
): RemotionExerciseTutoProps {
  if (scenes.length < ex.steps.length) {
    throw new Error(
      `Il manque des images ours : ${scenes.length} fournies, ${ex.steps.length} étapes`
    );
  }
  return {
    exerciseName: ex.name,
    themeLabel: ex.themeLabel,
    levelCode: ex.levelCode,
    tier: ex.tier,
    objective: ex.objective,
    estimatedDuration: ex.estimatedDuration,
    accent: "teal",
    steps: ex.steps.map((instruction, i) => ({
      instruction,
      sceneSrc: scenes[i]!,
    })),
  };
}

export function tutoOutputPaths(slug: string) {
  const base = `public/community-assets/exercise-tutos/${slug}`;
  return {
    slug,
    framesDir: `${base}/frames`,
    propsPath: `tmp/exercise-tutos/${slug}-props.json`,
    mp4Path: `tmp/community-renders/exercise-tuto-${slug}.mp4`,
    publicMp4: `${base}/${slug}.mp4`,
  };
}

export function tutoSlugForExercise(ex: ReferentielExercise): string {
  return exerciseTutoSlug(ex);
}
