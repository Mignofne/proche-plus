/**
 * Safeguards Studio Ours — S1–S9 (spec §0bis).
 * Validation client + serveur avant PromptBuilder / provider.
 */

import type { SceneBrief } from "./types";

export const SAFEGUARD_LIST_FR = [
  "S1 — Jamais vulgaire, sexuel, érotique, suggestif ou à double sens.",
  "S2 — Ton rééducation / éducation : respectueux, chaleureux, espérant.",
  "S3 — Aucune violence, gore, humiliation.",
  "S4 — Aucun sensationnalisme de traumatisme médical.",
  "S5 — Rating family-safe (aucun contexte sexualisé).",
  "S6 — Canon C-v3 : identité face/corps fixe ; motif gilet variable (solo) ; pas de nœud.",
  "S7 — Compagnons = autres ours Proche+ uniquement — jamais d’humains.",
  "S8 — Jamais par terre — siège / canapé / lit / fauteuil / table uniquement.",
  "S9 — ≥2 ours : primaire = gilet fleurs mexicaines ; compagnon = gilet neutre uni (pas de floral).",
] as const;

/** Message utilisateur quand un prompt est bloqué */
export const SAFEGUARD_BLOCK_MESSAGE_FR =
  "Cette intention ne respecte pas les garde-fous Studio Ours (ton digne, family-safe, jamais vulgaire / violent / médical sensationnaliste, jamais d’humains, jamais par terre). Reformulez situation, émotion ou lieu.";

type RuleHit = { code: string; label: string };

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[’']/g, "'");
}

/** Tokens / motifs bloqués (FR + EN) — heuristique Phase 1 */
const BLOCK_PATTERNS: { code: string; label: string; re: RegExp }[] = [
  // S1 — sexual / vulgar / suggestive / double entendre
  {
    code: "S1",
    label: "Contenu vulgaire ou sexuel",
    re: /\b(sexe|sexuel|sexuelle|erotique|erotisme|porn|porno|nude|nu[e]?|nudite|orgasme|penis|vagin|seins?|fesses?|cul\b|bite\b|chatte\b|baise|baiser|sucer|coquin[e]?|coquine|coquin|sexy|hot\b|kinky|fetish|fetiche|lingerie|strip|seduc|deshabil|deshabill|sous-vetement|sous vetement|double sens|innuendo|suggestif|suggestive)\b/i,
  },
  // S3 — violence / gore / humiliation
  {
    code: "S3",
    label: "Violence, gore ou humiliation",
    re: /\b(tuer|meurtre|assassin|sang\b|sanglant|gore|torture|supplice|humilie|humiliation|tabasser|frapper|coups? de poing|agresser|viol\b|massacre|decapite|mutil)\b/i,
  },
  // S4 — medical trauma sensationalism
  {
    code: "S4",
    label: "Traumatisme médical sensationnalisé",
    re: /\b(agonie|agonisant|cadavre|morgue|autopsie|supplice medical|souffrance atroce|cri de douleur|plainte de douleur|horreur medicale|trauma(tisme)? choc|plaie ouverte|hemorragie)\b/i,
  },
  // S5 — minors sexualized (family-safe)
  {
    code: "S5",
    label: "Contexte inapproprié (family-safe)",
    re: /\b(enfant nu|bebe nu|mineur(e)? sex|pedo|paedo|lolita)\b/i,
  },
  // S7 — humans
  {
    code: "S7",
    label: "Humains interdits (ours Proche+ uniquement)",
    re: /\b(humain|humaine|personne|personnage humain|homme\b|femme\b|garcon|fille\b|enfant humain|aidant humain|infirmier|infirmiere|medecin|docteur|patient humain|silhouette humaine|photorealiste humain)\b/i,
  },
  // S8 — on the floor
  {
    code: "S8",
    label: "Jamais par terre",
    re: /\b(par terre|au sol\b|sur le sol|sur le tapis|allonge au sol|assis au sol|a genoux|agenouille|couche par terre|couch[eé] au sol)\b/i,
  },
  // Existing editorial — medical gesture / PHI-ish
  {
    code: "MED",
    label: "Geste médical / PHI",
    re: /\b(stethoscope|seringue|perfusion|operation chirurgicale|chirurgie ouverte|code gir|numero securite sociale|nom du patient|dossier medical identifiable)\b/i,
  },
  // IP
  {
    code: "IP",
    label: "IP tierce interdite",
    re: /\b(lotso|winnie|winnie.?the.?pooh|disney teddy|pixar teddy)\b/i,
  },
  // Bow tie
  {
    code: "S6",
    label: "Nœud papillon interdit",
    re: /\b(noeud papillon|nœud papillon|bow ?tie|noeud-papillon)\b/i,
  },
];

export type SafeguardValidation =
  | { ok: true }
  | { ok: false; message: string; hits: RuleHit[] };

export function validateMascotGenText(raw: string): SafeguardValidation {
  const text = normalize(raw.trim());
  if (!text) {
    return {
      ok: false,
      message: "Indiquez au moins une situation.",
      hits: [{ code: "REQ", label: "Champ requis" }],
    };
  }

  const hits: RuleHit[] = [];
  for (const rule of BLOCK_PATTERNS) {
    if (rule.re.test(text)) {
      hits.push({ code: rule.code, label: rule.label });
    }
  }

  if (hits.length > 0) {
    const unique = [...new Map(hits.map((h) => [h.code, h])).values()];
    return {
      ok: false,
      message: `${SAFEGUARD_BLOCK_MESSAGE_FR} (${unique.map((h) => h.label).join(" · ")})`,
      hits: unique,
    };
  }

  return { ok: true };
}

export function validateSceneBrief(brief: SceneBrief): SafeguardValidation {
  const situation = brief.situation?.trim() ?? "";
  if (situation.length < 3) {
    return {
      ok: false,
      message: "Décrivez la situation (au moins quelques mots).",
      hits: [{ code: "REQ", label: "Situation trop courte" }],
    };
  }
  if (situation.length > 500) {
    return {
      ok: false,
      message: "Situation trop longue (500 caractères max).",
      hits: [{ code: "REQ", label: "Situation trop longue" }],
    };
  }

  const emotion =
    brief.emotion === "custom"
      ? (brief.emotionCustom ?? "").trim()
      : (brief.emotion ?? "").trim();
  const lieu =
    brief.lieu === "custom"
      ? (brief.lieuCustom ?? "").trim()
      : (brief.lieu ?? "").trim();

  if (!emotion) {
    return {
      ok: false,
      message: "Choisissez une émotion (ou saisissez un texte libre).",
      hits: [{ code: "REQ", label: "Émotion requise" }],
    };
  }
  if (!lieu) {
    return {
      ok: false,
      message: "Choisissez un lieu (ou saisissez un texte libre).",
      hits: [{ code: "REQ", label: "Lieu requis" }],
    };
  }

  const combined = [situation, emotion, lieu, brief.themeSlug ?? ""].join("\n");
  return validateMascotGenText(combined);
}

/** Négatifs canoniques injectés dans chaque prompt */
export function canonicalNegativePrompt(): string {
  return [
    "vulgar, sexual, erotic, suggestive, double entendre, NSFW",
    "violence, gore, blood, humiliation, bullying",
    "medical trauma sensationalism, surgery gore, open wounds",
    "sexualized minors, inappropriate child content",
    "human, person, man, woman, photorealistic human face, human silhouette",
    "bear sitting on the floor, on the ground, on the carpet, kneeling on floor",
    "infantile emoji teddy, chibi, kawaii baby bear",
    "Lotso, Winnie the Pooh, Disney/Pixar teddy clone",
    "bow tie, necktie bow, medical uniform, stethoscope, syringe",
    "PHI, patient name, hospital ID",
    "two bears both wearing identical Mexican floral vests, companion with floral pattern vest",
  ].join(", ");
}
