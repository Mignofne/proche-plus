import { Composition } from "remotion";
import { ProchePlusShort } from "./ProchePlusShort";
import {
  ProchePlusStoryboard,
} from "./ProchePlusStoryboard";
import {
  DEFAULT_STORYBOARD_BEAT_FRAMES,
  REMOTION_COMPOSITION_ID,
  REMOTION_STORYBOARD_FACEBOOK_ID,
  REMOTION_STORYBOARD_ID,
  buildRemotionProps,
  storyboardDurationInFrames,
  type RemotionInputProps,
  type RemotionStoryboardProps,
} from "@/lib/community/video/remotion";
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
    </>
  );
};
