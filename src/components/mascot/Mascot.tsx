import { cn } from "@/lib/utils";
import {
  BearFace,
  CANON_BEAR_ALT,
  MASCOT_POSE_LABELS,
  type BearVariant,
  type MascotPose,
} from "./BearFace";

export type { MascotPose, BearVariant };
export {
  BearFace,
  CANON_BEAR_ALT,
  CANON_BEAR_SRC,
  CANON_BEAR_STATIC_FILE,
  CANON_PICTO_FACE_SRC,
  FACE_STATIC_FILE,
  MASCOT_POSE_LABELS,
  POSE_PANEL,
  toMascotPose,
} from "./BearFace";

const SIZE_TO_VARIANT: Record<"sm" | "md" | "lg" | "xl", BearVariant> = {
  sm: "face",
  md: "face",
  lg: "body",
  xl: "body",
};

export function Mascot({
  pose = "welcome",
  size = "md",
  className,
  animated = false,
  variant,
}: {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  /** Override auto variant (sm/md=face, lg/xl=body). */
  variant?: BearVariant;
}) {
  const sizes = {
    sm: "h-14 w-14",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    /** Community posts — ours dominant dans le carré */
    xl: "h-52 w-52",
  };

  const crop = variant ?? SIZE_TO_VARIANT[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-sun/20 via-cream-dark to-terracotta/20 p-1 ring-1 ring-bear/20 shadow-sm",
        sizes[size],
        animated && "animate-mascot-float",
        pose === "celebrate" && "animate-soft-pop",
        className
      )}
      role="img"
      aria-label={MASCOT_POSE_LABELS[pose] ?? CANON_BEAR_ALT}
    >
      <BearFace
        pose={pose}
        variant={crop}
        className="h-full w-full rounded-full"
      />
    </div>
  );
}
