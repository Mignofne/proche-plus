/** Constantes Studio Ours — listes curatées FR + identité. */

export const IDENTITY_VERSION = "bear-stylized-sheet@c-v3" as const;

export const CANON_IMAGE_PATH =
  "/community-assets/ours-canon/canon-c-v3.png" as const;

/**
 * S9 — scènes ≥2 ours : primaire = floral mexicain ; compagnon = gilet neutre.
 * Injecté via PromptBuilder IDENTITY + SAFEGUARDS.
 */
export const MULTI_BEAR_VEST_RULE_FR =
  "Si deux ours ou plus : ours primaire (patient/héros) = gilet crème fleurs mexicaines C-v3 ; ours compagnon (aidant/second) = même face/corps, gilet neutre uni crème/beige — sans motif floral mexicain." as const;

export const DEFAULT_FORMAT = {
  key: "ig-square",
  width: 1024,
  height: 1024,
} as const;

/** Émotions curatées (chips) */
export const EMOTION_OPTIONS = [
  { value: "joyeux", label: "Joyeux" },
  { value: "concentre", label: "Concentré" },
  { value: "rassurant", label: "Rassurant" },
  { value: "espiegle", label: "Espiègle" },
  { value: "calme", label: "Calme" },
  { value: "fier", label: "Fier" },
  { value: "encourage", label: "Encouragé" },
  { value: "patient", label: "Patient" },
  { value: "curieux", label: "Curieux" },
  { value: "vigilant", label: "Vigilant" },
] as const;

/** Lieux curatés (chips) */
export const LIEU_OPTIONS = [
  { value: "chambre", label: "Chambre" },
  { value: "salon", label: "Salon" },
  { value: "couloir", label: "Couloir" },
  { value: "cuisine", label: "Cuisine" },
  { value: "salle_de_bain", label: "Salle de bain" },
  { value: "exterieur_jardin", label: "Extérieur / jardin" },
  { value: "salle_activite", label: "Salle d’activité" },
  { value: "bureau", label: "Bureau" },
] as const;

/** 8 thèmes référentiel exercices (seed-exercises) */
export const REFERENTIEL_THEMES = [
  { slug: "habillage", label: "S'habiller" },
  { slug: "repas", label: "Manger" },
  { slug: "deplacement", label: "Se déplacer" },
  { slug: "fauteuil", label: "Fauteuil" },
  { slug: "toilette", label: "Toilette / hygiène" },
  { slug: "mobilite_lit", label: "Mobilité au lit" },
  { slug: "communication", label: "Communication" },
  { slug: "cognitif", label: "Mémoire / attention" },
] as const;

export type EmotionValue = (typeof EMOTION_OPTIONS)[number]["value"];
export type LieuValue = (typeof LIEU_OPTIONS)[number]["value"];
export type ReferentielThemeSlug = (typeof REFERENTIEL_THEMES)[number]["slug"];
