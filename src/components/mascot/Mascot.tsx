import { cn } from "@/lib/utils";

export type MascotPose =
  | "welcome"
  | "encourage"
  | "patience"
  | "celebrate"
  | "vigilance"
  | "question";

const poseLabel: Record<MascotPose, string> = {
  welcome: "Ours d'accueil",
  encourage: "Ours qui encourage",
  patience: "Ours qui patiente",
  celebrate: "Ours qui célèbre",
  vigilance: "Ours vigilant",
  question: "Ours curieux",
};

function BearFace({ pose }: { pose: MascotPose }) {
  const brow =
    pose === "vigilance"
      ? { left: "M28 36 Q36 34 42 38", right: "M58 38 Q64 34 72 36" }
      : pose === "question"
        ? { left: "M28 38 Q36 32 42 38", right: "M58 36 Q64 34 72 38" }
        : pose === "encourage"
          ? { left: "M28 38 Q36 36 42 38", right: "M58 38 Q64 36 72 38" }
          : { left: "M28 38 Q36 36 42 38", right: "M58 38 Q64 36 72 38" };

  const mouth =
    pose === "celebrate"
      ? "M40 62 Q50 70 60 62"
      : pose === "encourage"
        ? "M42 62 Q50 68 58 62"
        : pose === "patience"
          ? "M44 64 Q50 66 56 64"
          : pose === "vigilance"
            ? "M44 64 Q50 63 56 64"
            : pose === "question"
              ? "M46 64 Q50 62 54 64"
              : "M42 63 Q50 67 58 63";

  const headTilt =
    pose === "question"
      ? "rotate(-8 50 48)"
      : pose === "encourage"
        ? "rotate(4 50 48)"
        : pose === "celebrate"
          ? "rotate(-3 50 48)"
          : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden="true"
    >
      <g transform={headTilt}>
        {/* Ears */}
        <ellipse cx="22" cy="28" rx="12" ry="11" fill="#6B4423" />
        <ellipse cx="78" cy="28" rx="12" ry="11" fill="#6B4423" />
        <ellipse cx="22" cy="28" rx="6" ry="5.5" fill="#A67B5B" />
        <ellipse cx="78" cy="28" rx="6" ry="5.5" fill="#A67B5B" />

        {/* Head */}
        <ellipse cx="50" cy="52" rx="34" ry="32" fill="#8B5E3C" />

        {/* Snout */}
        <ellipse cx="50" cy="60" rx="16" ry="13" fill="#C4A484" />

        {/* Nose */}
        <ellipse cx="50" cy="56" rx="6" ry="4.5" fill="#3D2B1F" />
        <ellipse cx="48.5" cy="54.5" rx="1.5" ry="1" fill="#6B5344" opacity="0.5" />

        {/* Eyes — calm, adult gaze */}
        <circle cx="38" cy="46" r="3.2" fill="#2D1F14" />
        <circle cx="62" cy="46" r="3.2" fill="#2D1F14" />
        <circle cx="37" cy="45" r="1" fill="#F5EDE4" opacity="0.7" />
        <circle cx="61" cy="45" r="1" fill="#F5EDE4" opacity="0.7" />

        {/* Brows */}
        <path
          d={brow.left}
          fill="none"
          stroke="#5C3A21"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={brow.right}
          fill="none"
          stroke="#5C3A21"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Mouth */}
        <path
          d={mouth}
          fill="none"
          stroke="#3D2B1F"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Pose accents */}
        {pose === "encourage" && (
          <g transform="translate(72 18)">
            <circle cx="10" cy="10" r="11" fill="#2A9D8F" />
            <path
              d="M5 10 L9 14 L16 6"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {pose === "celebrate" && (
          <g>
            <path d="M18 18 L22 10 L26 18" fill="#F5C842" />
            <path d="M74 16 L78 8 L82 16" fill="#F5C842" />
            <path d="M50 8 L53 14 L47 14" fill="#E0A820" />
          </g>
        )}

        {pose === "vigilance" && (
          <path
            d="M50 18 L54 26 L50 24 L46 26 Z"
            fill="#C67B5C"
            opacity="0.85"
          />
        )}

        {pose === "question" && (
          <text
            x="80"
            y="22"
            fontSize="16"
            fill="#2A9D8F"
            fontFamily="Nunito, sans-serif"
            fontWeight="700"
          >
            ?
          </text>
        )}

        {pose === "patience" && (
          <ellipse cx="50" cy="78" rx="8" ry="3" fill="#6B4423" opacity="0.25" />
        )}
      </g>
    </svg>
  );
}

export function Mascot({
  pose = "welcome",
  size = "md",
  className,
  animated = false,
}: {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}) {
  const sizes = {
    sm: "h-14 w-14",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-sun/20 via-cream-dark to-terracotta/20 p-1.5 ring-1 ring-bear/20 shadow-sm",
        sizes[size],
        animated && "animate-mascot-float",
        pose === "celebrate" && "animate-soft-pop",
        className
      )}
      role="img"
      aria-label={poseLabel[pose]}
    >
      <BearFace pose={pose} />
    </div>
  );
}
