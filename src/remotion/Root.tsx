import { Composition } from "remotion";
import { ProchePlusShort } from "./ProchePlusShort";
import {
  REMOTION_COMPOSITION_ID,
  buildRemotionProps,
  type RemotionInputProps,
} from "@/lib/community/video/remotion";
import { FORMATS } from "@/lib/community/formats";

export const RemotionRoot: React.FC = () => {
  const defaultProps: RemotionInputProps = buildRemotionProps({
    title: "Une idée pour la visite",
    body: "Une activité courte, à votre rythme — sans promesse clinique.",
    poseKey: "curiosite",
  });

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
    </>
  );
};
