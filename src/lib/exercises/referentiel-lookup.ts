/**
 * Recherche d'exercices dans le CSV référentiel (source produit).
 */
import { loadReferentielFromCsv, type CatalogExercise } from "../../../prisma/seed-exercises";

const THEME_LABEL_BY_SLUG: Record<string, string> = {
  habillage: "S'habiller",
  repas: "Manger",
  deplacement: "Se déplacer",
  fauteuil: "Fauteuil",
  toilette: "Toilette / hygiène",
  mobilite_lit: "Mobilité au lit",
  communication: "Communication",
  cognitif: "Mémoire / attention",
  zone_epaules_bras: "Épaules et bras",
  zone_mains: "Mains et doigts",
  zone_tronc: "Tronc et dos",
  zone_hanches_jambes: "Hanches et jambes",
  zone_chevilles_pieds: "Chevilles et pieds",
  zone_cou: "Cou et tête",
  zone_souffle: "Souffle et corps entier",
};

export type ReferentielExercise = CatalogExercise & {
  themeLabel: string;
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function enrich(ex: CatalogExercise): ReferentielExercise {
  return {
    ...ex,
    themeLabel: THEME_LABEL_BY_SLUG[ex.themeSlug] ?? ex.themeSlug,
  };
}

export function listReferentielExercises(): ReferentielExercise[] {
  return loadReferentielFromCsv().map(enrich);
}

export type FindExerciseQuery = {
  /** Nom exact ou partiel (ex. « Top chrono 15 ») */
  name?: string;
  theme?: string;
  level?: string;
  tier?: number;
};

/** Trouve un exercice publié ou à valider ; lève si introuvable ou ambigu. */
export function findReferentielExercise(
  query: FindExerciseQuery
): ReferentielExercise {
  const all = listReferentielExercises().filter((e) => e.status !== "brouillon");

  let pool = all;
  if (query.theme) {
    const t = normalize(query.theme);
    pool = pool.filter(
      (e) =>
        normalize(e.themeLabel).includes(t) ||
        normalize(e.themeSlug).includes(t)
    );
  }
  if (query.level) {
    const l = query.level.trim().toUpperCase();
    pool = pool.filter((e) => e.levelCode === l);
  }
  if (query.tier != null) {
    pool = pool.filter((e) => e.tier === query.tier);
  }
  if (query.name) {
    const n = normalize(query.name);
    pool = pool.filter(
      (e) =>
        normalize(e.name).includes(n) ||
        n.includes(normalize(e.name))
    );
    // priorité match exact
    pool.sort((a, b) => {
      const ae = normalize(a.name) === n ? 0 : 1;
      const be = normalize(b.name) === n ? 0 : 1;
      return ae - be;
    });
  }

  if (pool.length === 0) {
    throw new Error(
      `Exercice introuvable dans le référentiel : ${JSON.stringify(query)}`
    );
  }
  if (pool.length > 1 && !query.name) {
    throw new Error(
      `Plusieurs exercices correspondent (${pool.length}). Précisez le nom : ${pool
        .slice(0, 5)
        .map((e) => e.name)
        .join(" · ")}`
    );
  }
  return pool[0]!;
}

export function exerciseTutoSlug(ex: ReferentielExercise): string {
  return normalize(ex.name).replace(/\s+/g, "-").slice(0, 80);
}
