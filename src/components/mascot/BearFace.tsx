/**
 * Ours Proche+ — visage / corps produit (source de vérité visuelle = canon C-v3).
 * Module partagé sans dépendances Next — importable par Remotion et l’UI.
 */

import type { CSSProperties, ElementType, ImgHTMLAttributes } from "react";

export type MascotPose =
  | "welcome"
  | "encourage"
  | "patience"
  | "celebrate"
  | "vigilance"
  | "question";

/** Crop mode: face for small pictos, body for larger / community. */
export type BearVariant = "face" | "body";

export const MASCOT_POSE_LABELS: Record<MascotPose, string> = {
  welcome: "Ours d'accueil",
  encourage: "Ours qui encourage",
  patience: "Ours qui patiente",
  celebrate: "Ours qui célèbre",
  vigilance: "Ours vigilant",
  question: "Ours curieux",
};

/** Public URL (Next) — sheet 4 panneaux 1536×1024. */
export const CANON_BEAR_SRC =
  "/community-assets/ours-canon/canon-c-v3.png" as const;

/** Relatif à `public/` pour Remotion `staticFile()`. */
export const CANON_BEAR_STATIC_FILE =
  "community-assets/ours-canon/canon-c-v3.png" as const;

export const CANON_BEAR_ALT = "Ours Proche+" as const;

/** Index du panneau C-v3 (0=face, 1=pensif, 2=profil, 3=joie). */
const POSE_PANEL: Record<MascotPose, 0 | 1 | 2 | 3> = {
  welcome: 0,
  encourage: 0,
  patience: 2,
  celebrate: 3,
  vigilance: 1,
  question: 1,
};

/** Clés Community (pose pack) → poses Mascot produit */
const COMMUNITY_TO_MASCOT: Record<string, MascotPose> = {
  accueil: "welcome",
  welcome: "welcome",
  encourage: "encourage",
  patience: "patience",
  celebration: "celebrate",
  celebrate: "celebrate",
  vigilance: "vigilance",
  curiosite: "question",
  question: "question",
};

export function toMascotPose(poseKey?: string | null): MascotPose {
  if (!poseKey) return "encourage";
  return COMMUNITY_TO_MASCOT[poseKey] ?? "encourage";
}

/**
 * Styles de crop sur le sheet C-v3 (4 colonnes).
 * `backgroundPosition` X = 0 / 33.33 / 66.66 / 100 % selon le panneau.
 */
export function getCanonCropStyle(
  pose: MascotPose,
  variant: BearVariant = "face"
): CSSProperties {
  const panel = POSE_PANEL[pose];
  const x = (panel / 3) * 100;

  if (variant === "body") {
    return {
      backgroundImage: `url(${CANON_BEAR_SRC})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "400% 100%",
      backgroundPosition: `${x}% 50%`,
    };
  }

  /* Face : zoom sur le haut du panneau (tête + mèche). */
  return {
    backgroundImage: `url(${CANON_BEAR_SRC})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "400% 175%",
    backgroundPosition: `${x}% 6%`,
  };
}

type BearImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

/**
 * Ours canon C-v3 — crop panneau selon la pose.
 * Remotion : passer `src={staticFile(CANON_BEAR_STATIC_FILE)}` et `Image={Img}`.
 */
export function BearFace({
  pose,
  className,
  style,
  variant = "face",
  src = CANON_BEAR_SRC,
  Image: ImageComponent = "img",
  decorative = true,
}: {
  pose: MascotPose;
  className?: string;
  style?: CSSProperties;
  variant?: BearVariant;
  /** Override src (ex. Remotion staticFile). */
  src?: string;
  /** `"img"` (défaut) ou Remotion `Img`. */
  Image?: ElementType<BearImageProps>;
  /** Si true : aria-hidden (décoratif). Sinon alt « Ours Proche+ ». */
  decorative?: boolean;
}) {
  const panel = POSE_PANEL[pose];
  const x = (panel / 3) * 100;
  const Img = ImageComponent;

  const imgStyle: CSSProperties =
    variant === "body"
      ? {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${x}% 50%`,
          /* Sheet = 4 panneaux → on étire la largeur pour qu’un panneau = 100 % */
          transform: "scaleX(4)",
          transformOrigin: `${x}% 50%`,
        }
      : {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${x}% 8%`,
          transform: "scale(4.2)",
          transformOrigin: `${x}% 12%`,
        };

  /*
   * Approche fiable : conteneur overflow + image sheet en 400 % de largeur,
   * décalée horizontalement par panneau.
   */
  const sheetStyle: CSSProperties =
    variant === "body"
      ? {
          position: "absolute",
          left: `${-panel * 100}%`,
          top: 0,
          width: "400%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
        }
      : {
          position: "absolute",
          left: `${-panel * 100}%`,
          top: "-8%",
          width: "400%",
          height: "160%",
          objectFit: "cover",
          objectPosition: "center 8%",
        };

  void imgStyle; /* legacy calc kept for reference in comments above */

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        ...style,
      }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : CANON_BEAR_ALT}
      aria-hidden={decorative ? true : undefined}
    >
      <Img
        src={src}
        alt={decorative ? "" : CANON_BEAR_ALT}
        draggable={false}
        style={sheetStyle}
      />
    </span>
  );
}

/** Helper CSS-only (pas d’`<img>`) — utile si besoin d’un fond. */
export function BearFaceBackgroundStyle(
  pose: MascotPose,
  variant: BearVariant = "face"
): CSSProperties {
  return getCanonCropStyle(pose, variant);
}
