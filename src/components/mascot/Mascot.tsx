import { cn } from "@/lib/utils";

type MascotPose =
  | "welcome"
  | "encourage"
  | "patience"
  | "celebrate"
  | "vigilance"
  | "question";

const poseEmoji: Record<MascotPose, string> = {
  welcome: "🧸",
  encourage: "👍",
  patience: "🤗",
  celebrate: "🎉",
  vigilance: "🛡️",
  question: "🤔",
};

const poseLabel: Record<MascotPose, string> = {
  welcome: "Ours d'accueil",
  encourage: "Ours qui encourage",
  patience: "Ours qui patiente",
  celebrate: "Ours qui célèbre",
  vigilance: "Ours vigilant",
  question: "Ours curieux",
};

export function Mascot({
  pose = "welcome",
  size = "md",
  className,
}: {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-16 w-16 text-3xl",
    md: "h-24 w-24 text-5xl",
    lg: "h-32 w-32 text-6xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-terracotta/20",
        sizes[size],
        className
      )}
      role="img"
      aria-label={poseLabel[pose]}
    >
      <span aria-hidden="true">{poseEmoji[pose]}</span>
    </div>
  );
}
