---
name: bmad-exercice-tuto
description: >
  Vidéos tuto exercices Proche+ — une MP4 par exercice du référentiel, consignes
  EN GROS + ours C-v3 animé. Use when the user asks for vidéo tuto exercice,
  tuto exercice, exercise tutorial video, bmad-exercice-tuto, or generate a
  tutorial for a specific exercise from Referentiel_Exercices.
---

# Vidéo tuto exercice — référentiel + ours C-v3

## Overview

Generate **one MP4 tutorial video per exercise** from `docs/referentiel/Referentiel_Exercices.csv`.

Each CSV step = **large readable instruction** (senior/aidant) + **animated bear demo** (flipbook keyframes).

**Spec (mandatory):** `{project-root}/docs/exercise-tuto-video-spec.md`  
**Bear canon:** `{project-root}/docs/mascot-generation-spec.md` §0bis  
**Remotion:** `ProchePlusExerciseTuto`

## Conventions

- `{skill-root}` = this skill directory
- `{skill-name}` = `bmad-exercice-tuto`

## On Activation

1. Read `docs/exercise-tuto-video-spec.md` (layout + typo XL locked)
2. Read `references/layout-tuto.md`
3. Load bear canon: `public/community-assets/ours-canon/canon-c-v3.png`

## Collect (skip if known)

| Field | Example |
|---|---|
| Exercise name | `Top chrono 15`, `Enfiler son gilet en position assise` |
| Or | theme + level + tier |

Resolve via `src/lib/exercises/referentiel-lookup.ts` → `findReferentielExercise({ name })`.

If not in CSV: tell user to add to referential first OR accept manual `{ name, steps[], objective }`.

## Dispatch

| Intent | Workflow |
|---|---|
| Generate tuto MP4 | `workflows/generer-tuto-exercice.md` |

## Hard rules

1. **Instructions EN GROS** — never render step text smaller than spec (48px min @ 1080w)
2. **CSV steps verbatim** — do not rewrite clinical wording (Camille owns content)
3. **Canon C-v3** for all bear frames
4. **Senior pace** — `DEFAULT_TUTO_STEP_FRAMES` = 75 minimum per step
5. **Tutoiement** preserved from CSV

## Output

- `public/community-assets/exercise-tutos/{slug}/`
- `tmp/exercise-tutos/{slug}-props.json`
- MP4 via `npm run community:render-video -- --composition=ProchePlusExerciseTuto --props=…`

## How to call

- `vidéo tuto exercice Top chrono 15`
- `tuto exercice Enfiler son gilet`
- `bmad-exercice-tuto`
