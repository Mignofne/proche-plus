import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  RemotionStoryboardBeat,
  RemotionStoryboardProps,
} from "@/lib/community/video/remotion";
import { DEFAULT_STORYBOARD_BEAT_FRAMES } from "@/lib/community/video/remotion";
import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
} from "@/lib/community/scenes";

const COLORS = {
  cream: "#FAF7F2",
  peach: "#F8E8DF",
  teal: "#2A9D8F",
  sun: "#F5C842",
  terracotta: "#C67B5C",
};

function toStaticRel(src: string): string {
  return src.startsWith("/") ? src.slice(1) : src;
}

function BeatScene({
  beat,
  accent,
  titleColor,
  subtitleColor,
  beatFrames,
}: {
  beat: RemotionStoryboardBeat;
  accent: RemotionStoryboardProps["accent"];
  titleColor?: string;
  subtitleColor?: string;
  beatFrames: number;
}) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isLandscape = width > height;

  const accentColor =
    accent === "sun"
      ? COLORS.sun
      : accent === "terracotta"
        ? COLORS.terracotta
        : COLORS.teal;

  const titleHex = titleColor || DEFAULT_TITLE_COLOR;
  const bodyHex = subtitleColor || DEFAULT_SUBTITLE_COLOR;
  const sceneStatic = toStaticRel(beat.sceneSrc);

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const bodyIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  // Léger Ken Burns sur la durée du beat
  const zoom = interpolate(frame, [0, beatFrames], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(frame, [0, beatFrames], [12, -8], {
    extrapolateRight: "clamp",
  });

  const padX = isLandscape ? 96 : 56;
  const padTop = isLandscape ? 40 : 64;
  const titleSize = isLandscape ? 48 : 52;
  const bodySize = isLandscape ? 26 : 28;
  const sceneMaxH = isLandscape ? height * 0.58 : height * 0.52;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Nunito, system-ui, sans-serif",
        background: COLORS.peach,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 40% at 90% 0%, ${accentColor}22, transparent 55%),
            radial-gradient(ellipse 50% 35% at 0% 100%, ${COLORS.sun}18, transparent 50%)
          `,
        }}
      />

      <AbsoluteFill
        style={{
          padding: `${padTop}px ${padX}px ${isLandscape ? 36 : 44}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <div
            style={{
              opacity: titleIn,
              color: accentColor,
              fontSize: isLandscape ? 26 : 30,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Proche+
          </div>
          {beat.title ? (
            <h1
              style={{
                opacity: titleIn,
                color: titleHex,
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: "0 auto",
                maxWidth: "94%",
              }}
            >
              {beat.title}
            </h1>
          ) : null}
          {beat.body ? (
            <p
              style={{
                opacity: interpolate(bodyIn, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                color: bodyHex,
                fontSize: bodySize,
                lineHeight: 1.4,
                marginTop: 16,
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "88%",
                fontWeight: 600,
              }}
            >
              {beat.body}
            </p>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
            maxHeight: sceneMaxH,
            transform: `translateY(${driftY}px) scale(${zoom})`,
          }}
        >
          <Img
            src={staticFile(sceneStatic)}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: isLandscape ? "70%" : "92%",
              maxHeight: sceneMaxH,
              objectFit: "contain",
              objectPosition: "bottom",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Multi-plans : stills Studio Ours → courte vidéo Remotion */
export const ProchePlusStoryboard: React.FC<RemotionStoryboardProps> = ({
  beats,
  accent = "teal",
  titleColor,
  subtitleColor,
}) => {
  const safeBeats =
    beats.length > 0
      ? beats
      : [
          {
            sceneSrc:
              "/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png",
            title: "Une idée pour la visite",
            body: "À votre rythme.",
            durationInFrames: DEFAULT_STORYBOARD_BEAT_FRAMES,
          },
        ];

  return (
    <AbsoluteFill>
      <Series>
        {safeBeats.map((beat, i) => {
          const beatFrames =
            beat.durationInFrames ?? DEFAULT_STORYBOARD_BEAT_FRAMES;
          return (
            <Series.Sequence
              key={`${beat.sceneSrc}-${i}`}
              durationInFrames={beatFrames}
            >
              <BeatScene
                beat={beat}
                accent={accent}
                titleColor={titleColor}
                subtitleColor={subtitleColor}
                beatFrames={beatFrames}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
