/**
 * Ours Proche+ — visage / corps produit (source de vérité visuelle = canon C-v3).
 * Module partagé sans dépendances Next — importable par Remotion et l’UI.
 *
 * C-v3 master = sheet 1536×1024, 4 panneaux :
 *   0 face/accueil · 1 pensif · 2 profil · 3 joie
 *
 * - variant `face` : crops dérivés `panel-N-face.png` (pas de nouvel IP)
 * - variant `body` : crop CSS sur le sheet master
 */

import type { CSSProperties, ElementType } from "react";

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

/** Face crop panneau 0 — favicon / picto générique. */
export const CANON_PICTO_FACE_SRC =
  "/community-assets/ours-canon/picto-face.png" as const;

export const CANON_BEAR_ALT = "Ours Proche+" as const;

/** Index du panneau C-v3 (0=face, 1=pensif, 2=profil, 3=joie). */
export const POSE_PANEL: Record<MascotPose, 0 | 1 | 2 | 3> = {
  welcome: 0,
  encourage: 0,
  patience: 2,
  celebrate: 3,
  vigilance: 1,
  question: 1,
};

const FACE_SRC: Record<0 | 1 | 2 | 3, string> = {
  0: "/community-assets/ours-canon/panel-0-face.png",
  1: "/community-assets/ours-canon/panel-1-face.png",
  2: "/community-assets/ours-canon/panel-2-face.png",
  3: "/community-assets/ours-canon/panel-3-face.png",
};

/** Relatifs `public/` pour Remotion face crops. */
export const FACE_STATIC_FILE: Record<0 | 1 | 2 | 3, string> = {
  0: "community-assets/ours-canon/panel-0-face.png",
  1: "community-assets/ours-canon/panel-1-face.png",
  2: "community-assets/ours-canon/panel-2-face.png",
  3: "community-assets/ours-canon/panel-3-face.png",
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

export function getBearFaceSrc(
  pose: MascotPose,
  variant: BearVariant = "face"
): string {
  if (variant === "body") return CANON_BEAR_SRC;
  return FACE_SRC[POSE_PANEL[pose]];
}

function bodySheetStyle(panel: 0 | 1 | 2 | 3): CSSProperties {
  /**
   * Sheet en 400 % de largeur (= 4 panneaux).
   * `left: -panel * 100%` aligne le panneau ; translateY cadre le corps.
   */
  return {
    position: "absolute",
    left: `${-panel * 100}%`,
    top: "50%",
    width: "400%",
    height: "auto",
    maxWidth: "none",
    transform: "translateY(-42%)",
    pointerEvents: "none",
    userSelect: "none",
  };
}

/**
 * Face crops are square but subjects sit slightly off-center in-frame
 * (panel 2 profile especially). Slight oversize + per-panel object-position
 * pans the face into the circular sm/md Mascot frames.
 */
const FACE_OBJECT_POSITION: Record<0 | 1 | 2 | 3, string> = {
  /** Front — subject slightly right in asset → pan right so face hits center */
  0: "58% 30%",
  1: "55% 28%",
  /** Profile left-facing — keep snout/eye in frame */
  2: "32% 30%",
  3: "52% 30%",
};

function faceImgStyle(panel: 0 | 1 | 2 | 3): CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "122%",
    height: "122%",
    maxWidth: "none",
    transform: "translate(-50%, -50%)",
    objectFit: "cover",
    objectPosition: FACE_OBJECT_POSITION[panel],
    pointerEvents: "none",
    userSelect: "none",
  };
}

/**
 * Ours canon C-v3 — crop panneau selon la pose.
 * Remotion body : `src={staticFile(CANON_BEAR_STATIC_FILE)}` + `Image={Img}`.
 * Remotion face : `src={staticFile(FACE_STATIC_FILE[panel])}`.
 */
export function BearFace({
  pose,
  className,
  style,
  variant = "face",
  src,
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
  Image?: ElementType;
  /** Si true : aria-hidden (décoratif). Sinon alt « Ours Proche+ ». */
  decorative?: boolean;
}) {
  const panel = POSE_PANEL[pose];
  const Img = ImageComponent;
  const resolvedSrc = src ?? getBearFaceSrc(pose, variant);

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
        src={resolvedSrc}
        alt={decorative ? "" : CANON_BEAR_ALT}
        draggable={false}
        style={variant === "body" ? bodySheetStyle(panel) : faceImgStyle(panel)}
      />
    </span>
  );
}
