import { Composition } from "remotion";
import { ProchePlusShort } from "./ProchePlusShort";
import {
  REMOTION_COMPOSITION_ID,
  type RemotionInputProps,
} from "@/lib/community/video/remotion";

export const RemotionRoot: React.FC = () => {
  const defaultProps: RemotionInputProps = {
    title: "Un petit pas compte",
    body: "Pas besoin de tout faire d’un coup. On avance tranquillement, ensemble.",
    poseKey: "encourage",
    accent: "teal",
  };

  return (
    <Composition
      id={REMOTION_COMPOSITION_ID}
      component={ProchePlusShort}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  );
};
