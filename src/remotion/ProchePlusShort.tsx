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

/** Remotion short — texte haut colorisable + ours en situation (scène pleine) */
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

  const resolvedScene =
    sceneSrc ||
    resolveSceneSrc({ poseKey });

  // staticFile attend un chemin relatif à public/
  const sceneStatic = resolvedScene.startsWith("/")
    ? resolvedScene.slice(1)
    : resolvedScene;

  const brandIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const titleIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const bodyIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const bearIn = spring({
    frame: frame - 32,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const brandY = interpolate(brandIn, [0, 1], [24, 0]);
  const titleY = interpolate(titleIn, [0, 1], [36, 0]);
  const bodyOpacity = interpolate(bodyIn, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bearY = interpolate(bearIn, [0, 1], [80, 0]);
  const bearScale = interpolate(bearIn, [0, 1], [0.92, 1]);

  const padX = isLandscape ? 96 : 64;
  const padTop = isLandscape ? 48 : 72;
  const titleSize = isLandscape ? 52 : 56;
  const bodySize = isLandscape ? 28 : 30;
  const sceneMaxH = isLandscape ? height * 0.55 : height * 0.48;

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
          padding: `${padTop}px ${padX}px ${isLandscape ? 40 : 48}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", textAlign: "center" }}>
          <div
            style={{
              opacity: brandIn,
              transform: `translateY(${brandY}px)`,
              color: accentColor,
              fontSize: isLandscape ? 28 : 32,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 20,
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
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: "0 auto",
              maxWidth: "94%",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              opacity: bodyOpacity,
              color: bodyHex,
              fontSize: bodySize,
              lineHeight: 1.4,
              marginTop: 20,
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "88%",
              fontWeight: 600,
            }}
          >
            {body}
          </p>
        </div>

        {bearEnabled ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              opacity: bearIn,
              transform: `translateY(${bearY}px) scale(${bearScale})`,
              width: "100%",
              maxHeight: sceneMaxH,
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
        ) : (
          <div style={{ height: 24 }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
