/**
 * PromptBuilder — 5 couches + safeguards (archi §2).
 */

import {
  CANON_IMAGE_PATH,
  DEFAULT_FORMAT,
  EMOTION_OPTIONS,
  IDENTITY_VERSION,
  LIEU_OPTIONS,
  MULTI_BEAR_VEST_RULE_FR,
  REFERENTIEL_THEMES,
} from "./constants";
import { canonicalNegativePrompt } from "./safeguards";
import type { BuiltPrompt, SceneBrief } from "./types";

function resolveEmotion(brief: SceneBrief): string {
  if (brief.emotion === "custom") {
    return (brief.emotionCustom ?? "").trim() || "calme et rassurant";
  }
  const found = EMOTION_OPTIONS.find((e) => e.value === brief.emotion);
  return found?.label ?? brief.emotion;
}

function resolveLieu(brief: SceneBrief): string {
  if (brief.lieu === "custom") {
    return (brief.lieuCustom ?? "").trim() || "intérieur domestique chaleureux";
  }
  const found = LIEU_OPTIONS.find((l) => l.value === brief.lieu);
  return found?.label ?? brief.lieu;
}

function resolveThemeLabel(slug?: string | null): string | null {
  if (!slug) return null;
  return REFERENTIEL_THEMES.find((t) => t.slug === slug)?.label ?? slug;
}

const IDENTITY_LAYER = [
  "IDENTITY (LOCKED — Proche+ canon C-v3):",
  "adult plump brown bear mascot, plush illustrated fur #8B5E3C / #6B4423,",
  "full body, mischievous joyful expression, white forehead tuft (~60 years),",
  "single brown Frida-like mono-brow, subtle crow's feet,",
  "cream waistcoat (Mexican floral default for primary/solo bear; pattern may vary when alone),",
  "NO bow tie, original character (not Lotso, not Winnie the Pooh).",
  `Reference sheet: ${CANON_IMAGE_PATH}.`,
  "MULTI-BEAR VESTS (LOCKED): when two or more Proche+ bears appear,",
  "PRIMARY bear (patient/hero) keeps Mexican floral cream waistcoat;",
  "COMPANION bear (aidant/second) same face/body identity but NEUTRAL plain cream/beige or soft solid waistcoat — NO Mexican floral pattern.",
  `(FR: ${MULTI_BEAR_VEST_RULE_FR})`,
].join(" ");

const SAFEGUARDS_LAYER = [
  "SAFEGUARDS (LOCKED):",
  "family-safe only; never vulgar/sexual/erotic/suggestive/double-entendre;",
  "respectful warm hopeful rehab/education tone;",
  "no violence, gore, humiliation, no medical trauma sensationalism;",
  "companions = other Proche+ bears ONLY — never humans;",
  "if ≥2 bears: primary = Mexican floral vest; companion(s) = plain neutral cream/beige vest (no floral);",
  "NEVER on the floor — seated on chair/sofa/bed edge/wheelchair/at table only;",
  "activity props on a table, never on the ground.",
].join(" ");

export function buildPromptFromBrief(brief: SceneBrief): BuiltPrompt {
  const emotion = resolveEmotion(brief);
  const lieu = resolveLieu(brief);
  const themeLabel = resolveThemeLabel(brief.themeSlug);
  const situation = brief.situation.trim();

  const scene = [
    "SCENE:",
    `Situation: ${situation}.`,
    `Emotion: ${emotion}.`,
    `Place: ${lieu}.`,
    themeLabel ? `Referential theme (ADL): ${themeLabel}.` : null,
    "Show the Proche+ bear engaged respectfully in this everyday autonomy/rehab education moment.",
  ]
    .filter(Boolean)
    .join(" ");

  const artDirection = [
    "ART DIRECTION:",
    "warm cream #FAF7F2 atmosphere, soft home light,",
    "brand accents teal #2A9D8F / sun #F5C842 / terracotta #C67B5C where relevant,",
    "calm senior-friendly illustration, one gentle wink of playfulness max.",
  ].join(" ");

  const composition = [
    "COMPOSITION:",
    "bear as clear hero of the frame, readable body language,",
    "no required in-image text; dignified posture on a seat or at a table.",
  ].join(" ");

  const format = [
    "FORMAT:",
    `${DEFAULT_FORMAT.key} ${DEFAULT_FORMAT.width}x${DEFAULT_FORMAT.height} square illustration.`,
  ].join(" ");

  const positive = [
    IDENTITY_LAYER,
    scene,
    artDirection,
    composition,
    format,
    SAFEGUARDS_LAYER,
  ].join("\n\n");

  return {
    positive,
    negative: canonicalNegativePrompt(),
    identityVersion: IDENTITY_VERSION,
    layers: {
      identity: IDENTITY_LAYER,
      scene,
      artDirection,
      composition,
      format,
      safeguards: SAFEGUARDS_LAYER,
    },
  };
}
