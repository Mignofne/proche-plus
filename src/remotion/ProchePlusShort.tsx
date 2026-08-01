import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { RemotionInputProps } from "@/lib/community/video/remotion";
import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
  resolveSceneSrc,
} from "@/lib/community/scenes";

const COLORS = {
  cream: "#FAF7F2",
  peach: "#F8E8DF",
  teal: "#2A9D8F",
  sun: "#F5C842",
  terracotta: "#C67B5C",
};

/** Remotion short — texte compact en haut + scène qui remplit le cadre */
export const ProchePlusShort: React.FC<RemotionInputProps> = ({
  title,
  body,
  poseKey,
  accent,
  titleColor,
  subtitleColor,
  sceneSrc,
  bearEnabled = true,
}) => {
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

  const resolvedScene = sceneSrc || resolveSceneSrc({ poseKey });
  const sceneStatic = resolvedScene.startsWith("/")
    ? resolvedScene.slice(1)
    : resolvedScene;

  const brandIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const titleIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const bodyIn = spring({
    frame: frame - 16,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const bearIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const brandY = interpolate(brandIn, [0, 1], [16, 0]);
  const titleY = interpolate(titleIn, [0, 1], [24, 0]);
  const bodyOpacity = interpolate(bodyIn, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bearOpacity = interpolate(bearIn, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bearScale = interpolate(bearIn, [0, 1], [0.96, 1]);

  const padX = isLandscape ? 64 : 48;
  const padTop = isLandscape ? 36 : 56;
  const padBottom = isLandscape ? 28 : 32;
  const titleSize = isLandscape ? 44 : 48;
  const bodySize = isLandscape ? 24 : 26;

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
          padding: `${padTop}px ${padX}px ${padBottom}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isLandscape ? 16 : 20,
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              opacity: brandIn,
              transform: `translateY(${brandY}px)`,
              color: accentColor,
              fontSize: isLandscape ? 24 : 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Proche+
          </div>
          <h1
            style={{
              opacity: titleIn,
              transform: `translateY(${titleY}px)`,
              color: titleHex,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              margin: "0 auto",
              maxWidth: "96%",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              opacity: bodyOpacity,
              color: bodyHex,
              fontSize: bodySize,
              lineHeight: 1.35,
              marginTop: 12,
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "92%",
              fontWeight: 600,
            }}
          >
            {body}
          </p>
        </div>

        {bearEnabled ? (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              opacity: bearOpacity,
              transform: `scale(${bearScale})`,
            }}
          >
            <Img
              src={staticFile(sceneStatic)}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "bottom center",
              }}
            />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
