import { Composition } from "remotion";
import { ProchePlusShort } from "./ProchePlusShort";
import { ProchePlusStoryboard } from "./ProchePlusStoryboard";
import { ProchePlusFlipbook } from "./ProchePlusFlipbook";
import { ProchePlusExerciseTuto } from "./ProchePlusExerciseTuto";
import {
  DEFAULT_FLIPBOOK_HOLD,
  DEFAULT_STORYBOARD_BEAT_FRAMES,
  REMOTION_COMPOSITION_ID,
  REMOTION_FLIPBOOK_FACEBOOK_ID,
  REMOTION_FLIPBOOK_ID,
  REMOTION_STORYBOARD_FACEBOOK_ID,
  REMOTION_STORYBOARD_ID,
  buildRemotionProps,
  flipbookDurationInFrames,
  storyboardDurationInFrames,
  type RemotionFlipbookProps,
  type RemotionInputProps,
  type RemotionStoryboardProps,
} from "@/lib/community/video/remotion";
import {
  DEFAULT_TUTO_INTRO_FRAMES,
  DEFAULT_TUTO_STEP_FRAMES,
  REMOTION_EXERCISE_TUTO_FACEBOOK_ID,
  REMOTION_EXERCISE_TUTO_ID,
  exerciseTutoDurationInFrames,
  type RemotionExerciseTutoProps,
} from "@/lib/exercises/tuto-video-core";
import { FORMATS } from "@/lib/community/formats";

export const RemotionRoot: React.FC = () => {
  const defaultProps: RemotionInputProps = buildRemotionProps({
    title: "Une idée pour la visite",
    body: "Une activité courte, à votre rythme — sans promesse clinique.",
    poseKey: "curiosite",
  });

  const defaultStoryboard: RemotionStoryboardProps = {
    accent: "teal",
    beats: [
      {
        sceneSrc:
          "/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png",
        title: "Une idée pour la visite",
        body: "À votre rythme.",
        durationInFrames: DEFAULT_STORYBOARD_BEAT_FRAMES,
      },
      {
        sceneSrc:
          "/community-assets/ours-canon/scenes-referentiel/scene-habillage.png",
        title: "Un petit pas",
        body: "Ensemble, sans se presser.",
        durationInFrames: DEFAULT_STORYBOARD_BEAT_FRAMES,
      },
    ],
  };

  const defaultFlipbook: RemotionFlipbookProps = {
    accent: "teal",
    title: "Top chrono 15",
    body: "On bouge un peu, toutes les 15 minutes.",
    holdFrames: DEFAULT_FLIPBOOK_HOLD,
    loops: 1,
    endHoldFrames: 36,
    frames: [
      "/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png",
    ],
  };

  const defaultExerciseTuto: RemotionExerciseTutoProps = {
    exerciseName: "Top chrono 15",
    themeLabel: "Les Exercices Assis",
    levelCode: "A",
    tier: 1,
    objective:
      "Toutes les 15 minutes, bouger un peu pour stimuler le corps.",
    accent: "teal",
    steps: [
      {
        instruction: "Tape le sol avec tes pieds pendant 15 secondes.",
        sceneSrc:
          "/community-assets/ours-canon/scenes-referentiel/scene-fauteuil-freins.png",
        durationInFrames: DEFAULT_TUTO_STEP_FRAMES,
      },
      {
        instruction: "Tends et plies tes bras 15 fois.",
        sceneSrc:
          "/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png",
        durationInFrames: DEFAULT_TUTO_STEP_FRAMES,
      },
    ],
  };

  const vertical = FORMATS["video-9-16"];
  const landscape = FORMATS["video-16-9"];

  return (
    <>
      <Composition
        id={REMOTION_COMPOSITION_ID}
        component={ProchePlusShort}
        durationInFrames={90}
        fps={30}
        width={vertical.width}
        height={vertical.height}
        defaultProps={defaultProps}
      />
      <Composition
        id="ProchePlusShortFacebook"
        component={ProchePlusShort}
        durationInFrames={90}
        fps={30}
        width={landscape.width}
        height={landscape.height}
        defaultProps={defaultProps}
      />
      <Composition
        id={REMOTION_STORYBOARD_ID}
        component={ProchePlusStoryboard}
        durationInFrames={storyboardDurationInFrames(defaultStoryboard.beats)}
        fps={30}
        width={vertical.width}
        height={vertical.height}
        defaultProps={defaultStoryboard}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(
            30,
            storyboardDurationInFrames(props.beats ?? [])
          ),
        })}
      />
      <Composition
        id={REMOTION_STORYBOARD_FACEBOOK_ID}
        component={ProchePlusStoryboard}
        durationInFrames={storyboardDurationInFrames(defaultStoryboard.beats)}
        fps={30}
        width={landscape.width}
        height={landscape.height}
        defaultProps={defaultStoryboard}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(
            30,
            storyboardDurationInFrames(props.beats ?? [])
          ),
        })}
      />
      <Composition
        id={REMOTION_FLIPBOOK_ID}
        component={ProchePlusFlipbook}
        durationInFrames={flipbookDurationInFrames(defaultFlipbook)}
        fps={30}
        width={vertical.width}
        height={vertical.height}
        defaultProps={defaultFlipbook}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, flipbookDurationInFrames(props)),
        })}
      />
      <Composition
        id={REMOTION_FLIPBOOK_FACEBOOK_ID}
        component={ProchePlusFlipbook}
        durationInFrames={flipbookDurationInFrames(defaultFlipbook)}
        fps={30}
        width={landscape.width}
        height={landscape.height}
        defaultProps={defaultFlipbook}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(30, flipbookDurationInFrames(props)),
        })}
      />
      <Composition
        id={REMOTION_EXERCISE_TUTO_ID}
        component={ProchePlusExerciseTuto}
        durationInFrames={exerciseTutoDurationInFrames(defaultExerciseTuto)}
        fps={30}
        width={vertical.width}
        height={vertical.height}
        defaultProps={defaultExerciseTuto}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(
            60,
            exerciseTutoDurationInFrames(props)
          ),
        })}
      />
      <Composition
        id={REMOTION_EXERCISE_TUTO_FACEBOOK_ID}
        component={ProchePlusExerciseTuto}
        durationInFrames={exerciseTutoDurationInFrames(defaultExerciseTuto)}
        fps={30}
        width={landscape.width}
        height={landscape.height}
        defaultProps={defaultExerciseTuto}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(
            60,
            exerciseTutoDurationInFrames(props)
          ),
        })}
      />
    </>
  );
};
