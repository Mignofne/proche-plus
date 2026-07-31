export type StudioSceneId =
  | "welcome"
  | "desk"
  | "bed"
  | "sofa"
  | "meal"
  | "wave"
  | "duo"
  | "balcony";

export type StudioMood = "calm" | "happy" | "sad" | "thinking" | "tired";

export type ParsedScene = {
  scene: StudioSceneId;
  mood: StudioMood;
  bearCount: 1 | 2;
  matched: boolean;
  label: string;
};

export const SCENE_PRESETS: {
  id: StudioSceneId;
  label: string;
  example: string;
}[] = [
  { id: "welcome", label: "Accueil", example: "debout, regard doux et calme" },
  {
    id: "desk",
    label: "Bureau",
    example: "assis au bureau avec une lampe allumée",
  },
  {
    id: "bed",
    label: "Lit",
    example: "au lit avec son téléphone, timer 10 minutes",
  },
  {
    id: "sofa",
    label: "Canapé",
    example: "sur le canapé, un peu triste, besoin de réconfort",
  },
  {
    id: "meal",
    label: "Repas",
    example: "à table, j’ai fait à manger",
  },
  {
    id: "wave",
    label: "Joie",
    example: "bras levés, tout content",
  },
  {
    id: "duo",
    label: "Duo",
    example: "deux ours, l’un rassure l’autre",
  },
  {
    id: "balcony",
    label: "Balcon",
    example: "escapade balcon, prendre l’air",
  },
];

/** Patterns sur texte déjà normalisé (sans accents, minuscule). */
const SCENE_RULES: { scene: StudioSceneId; patterns: RegExp[] }[] = [
  {
    scene: "desk",
    patterns: [
      /\bbureau\b/,
      /\blampe\b/,
      /\blaptop\b/,
      /\bordinateur\b/,
      /\btravail\b/,
      /\bmode\s+pro\b/,
      /\bdesk\b/,
    ],
  },
  {
    scene: "bed",
    patterns: [
      /\blit\b/,
      /\bscroll/,
      /\btelephone\b/,
      /\bphone\b/,
      /\breveil\b/,
      /\btimer\b/,
      /\bcoucher\b/,
      /\bdodo\b/,
    ],
  },
  {
    scene: "sofa",
    patterns: [
      /\bcanape\b/,
      /\bfauteuil\b/,
      /\breconfort\b/,
      /\bcalin\b/,
      /\bespace\s+de\s+securit/,
      /\bsofa\b/,
    ],
  },
  {
    scene: "meal",
    patterns: [
      /\bmanger\b/,
      /\brepas\b/,
      /\btable\b/,
      /\bpates?\b/,
      /\bbolo\b/,
      /\bassiette\b/,
      /\bcusine\b/,
    ],
  },
  {
    scene: "balcony",
    patterns: [
      /\bbalcon\b/,
      /\bair\b/,
      /\bescapade\b/,
      /\bdehors\b/,
      /\bfenetre\b/,
    ],
  },
  {
    scene: "duo",
    patterns: [
      /\bdeux\b/,
      /\bensemble\b/,
      /\bduo\b/,
      /\bepaule\b/,
      /\brassure\b/,
      /\bavec\s+(toi|lui|elle|moi)\b/,
      /\bpair\b/,
    ],
  },
  {
    scene: "wave",
    patterns: [
      /\bbras\b/,
      /\bjoie\b/,
      /\bcelebr/,
      /\bcontent\b/,
      /\bheureux\b/,
      /\bheureus/,
      /\bpartage\b/,
      /\bvague\b/,
      /\bleves?\b/,
    ],
  },
  {
    scene: "welcome",
    patterns: [/\baccueil\b/, /\bdebout\b/, /\bcalme\b/, /\bdoux\b/],
  },
];

const MOOD_RULES: { mood: StudioMood; patterns: RegExp[] }[] = [
  {
    mood: "sad",
    patterns: [/\btriste\b/, /\blarme\b/, /\bpleur/, /\bvulnerabl/],
  },
  {
    mood: "tired",
    patterns: [/\bfatiguee?\b/, /\bepuisee?\b/, /\bzzz\b/, /\bsommeil\b/],
  },
  {
    mood: "thinking",
    patterns: [
      /\bpens/,
      /\bquestion\b/,
      /\bcurieux\b/,
      /\binquiet\b/,
      /\bstress/,
    ],
  },
  {
    mood: "happy",
    patterns: [
      /\bheureux\b/,
      /\bheureus/,
      /\bcontent\b/,
      /\bjoie\b/,
      /\bsourire\b/,
      /\bcelebr/,
    ],
  },
];

const SCENE_LABELS: Record<StudioSceneId, string> = {
  welcome: "Ours debout (accueil)",
  desk: "Ours au bureau",
  bed: "Ours au lit",
  sofa: "Ours sur le canapé",
  meal: "Ours à table",
  wave: "Ours bras levés",
  duo: "Duo d’ours",
  balcony: "Ours au balcon",
};

function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Parse une description libre FR vers une scène + humeur. */
export function parseBearDescription(raw: string): ParsedScene {
  const text = normalize(raw);

  if (!text) {
    return {
      scene: "welcome",
      mood: "calm",
      bearCount: 1,
      matched: false,
      label: SCENE_LABELS.welcome,
    };
  }

  let scene: StudioSceneId = "welcome";
  let matched = false;

  for (const rule of SCENE_RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      scene = rule.scene;
      matched = true;
      break;
    }
  }

  let mood: StudioMood = "calm";
  for (const rule of MOOD_RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      mood = rule.mood;
      break;
    }
  }

  if (scene === "wave" && mood === "calm") mood = "happy";
  if (scene === "sofa" && mood === "calm") mood = "sad";

  const bearCount: 1 | 2 =
    scene === "duo" || scene === "meal" || /\bdeux\b|\bduo\b/.test(text)
      ? 2
      : 1;

  return {
    scene,
    mood,
    bearCount,
    matched,
    label: SCENE_LABELS[scene],
  };
}
