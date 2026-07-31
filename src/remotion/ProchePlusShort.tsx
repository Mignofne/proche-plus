import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BearFace, toMascotPose } from "@/components/mascot/BearFace";
import type { RemotionInputProps } from "@/lib/community/video/remotion";

const COLORS = {
  cream: "#FAF7F2",
  creamDark: "#F0EBE3",
  teal: "#2A9D8F",
  sun: "#F5C842",
  terracotta: "#C67B5C",
  text: "#2D2A26",
  textMuted: "#5C5650",
};

export const ProchePlusShort: React.FC<RemotionInputProps> = ({
  title,
  body,
  poseKey,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mascotPose = toMascotPose(poseKey);

  const accentColor =
    accent === "sun"
      ? COLORS.sun
      : accent === "terracotta"
        ? COLORS.terracotta
        : COLORS.teal;

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
  const bearScale = interpolate(bearIn, [0, 1], [0.88, 1]);
  const orbPulse = interpolate(frame, [0, 90], [0.92, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Nunito, system-ui, sans-serif",
        background: `
          radial-gradient(ellipse 90% 55% at 85% 8%, ${accentColor}33, transparent 55%),
          radial-gradient(ellipse 70% 45% at 8% 92%, ${COLORS.sun}28, transparent 50%),
          linear-gradient(168deg, ${COLORS.cream} 0%, ${COLORS.creamDark} 48%, #EDE6DB 100%)
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          transform: `scale(${orbPulse})`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: -40,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.sun}30 0%, transparent 68%)`,
        }}
      />

      <AbsoluteFill
        style={{
          padding: "72px 64px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              opacity: brandIn,
              transform: `translateY(${brandY}px)`,
              color: accentColor,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 28,
            }}
          >
            Proche+
          </div>
          <h1
            style={{
              opacity: titleIn,
              transform: `translateY(${titleY}px)`,
              color: COLORS.text,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              margin: 0,
              maxWidth: "92%",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              opacity: bodyOpacity,
              color: COLORS.textMuted,
              fontSize: 32,
              lineHeight: 1.45,
              marginTop: 28,
              maxWidth: "88%",
              fontWeight: 600,
            }}
          >
            {body}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            opacity: bearIn,
            transform: `translateY(${bearY}px) scale(${bearScale})`,
          }}
        >
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "linear-gradient(180deg, rgba(245,200,66,0.22), rgba(240,235,227,1) 45%, rgba(198,123,92,0.2))",
              boxShadow: "0 18px 28px rgba(107,68,35,0.18)",
              padding: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BearFace pose={mascotPose} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
