/**
 * Tokens & conventions UI Community (UX-DR1–3, UX-DR12, AD-1).
 * Source de vérité visuelle partagée avec `globals.css` `@theme` — ne pas inventer une palette hors marque.
 */

export const COMMUNITY_BRAND = {
  cream: "#FAF7F2",
  creamDark: "#F0EBE3",
  teal: "#2A9D8F",
  tealDark: "#1F7A6F",
  sun: "#F5C842",
  sunDark: "#E0A820",
  terracotta: "#C67B5C",
  bear: "#8B5E3C",
  /** Brun pelage profond — brand-ours companion */
  bearDeep: "#6B4423",
  text: "#2D2A26",
  textMuted: "#5C5650",
} as const;

/** Classes Tailwind alignées UX Community */
export const COMMUNITY_UI = {
  pageBg: "bg-cream",
  surfaceRaised:
    "rounded-2xl border border-cream-dark bg-white p-5 shadow-sm surface-raised",
  title: "text-teal-dark font-bold",
  muted: "text-text-muted",
  touchTarget: "touch-target",
  font: "font-sans",
} as const;

export const COMMUNITY_COPY_TONE =
  "Libellés FR métier fondateur — ton adulte, non infantilisant (UX-DR14).";
