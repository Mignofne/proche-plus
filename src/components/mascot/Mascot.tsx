import { cn } from "@/lib/utils";
import {
  BearFace,
  MASCOT_POSE_LABELS,
  type MascotPose,
} from "./BearFace";

export type { MascotPose };
export { BearFace, MASCOT_POSE_LABELS, toMascotPose } from "./BearFace";

export function Mascot({
  pose = "welcome",
  size = "md",
  className,
  animated = false,
}: {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}) {
  const sizes = {
    sm: "h-14 w-14",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    /** Community posts — ours dominant dans le carré */
    xl: "h-52 w-52",
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
      aria-label={MASCOT_POSE_LABELS[pose]}
    >
      <BearFace pose={pose} className="h-full w-full" />
    </div>
  );
}
