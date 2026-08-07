# Workflow — TE Générer vidéo tuto exercice

## Goal

MP4 tuto **lisible** (consignes XL) pour **un** exercice du référentiel.  
**1 étape CSV = 1 photo = 1 geste dominant.**

## Steps

### 1. Résoudre l'exercice

```typescript
import { findReferentielExercise, exerciseTutoSlug } from "src/lib/exercises/referentiel-lookup";
```

- `findReferentielExercise({ name: "…" })` ou `{ theme, level, tier }`
- Si introuvable → lister proches via `listReferentielExercises()` filtré
- `slug = exerciseTutoSlug(ex)`

### 2. Vérifier les étapes

- `ex.steps` doit avoir ≥1 entrée
- Si vide → STOP
- Lister les étapes **numérotées** avant de générer (une ligne = une photo)

### 3. Générer les visuels — **une photo par étape**

Pour **chaque** `ex.steps[i]` séparément (ne pas batcher plusieurs gestes dans une image) :

1. Intent :
   - **HUMAIN** si : « humain », « DEMIC », « sans ours », « 70 ans », « papi », « mamie »
   - sinon **OURS** (canon C-v3)
2. Prompt depuis `references/layout-tuto.md` + consigne **verbatim** de **cette** étape seulement
3. Cas **gilet** (mode HUMAIN) — **2 couches** :
   - **Déjà porté** : gilet **sans manches beige uni sans fleurs**
   - **À enfiler** : gilet **manches longues** (accessoire) — highlight teal `#2A9D8F`
   - Voir tableau « Découpe photo = 1 étape (gilet) » dans `layout-tuto.md`
4. `GenerateImage` 9:16 avec `reference_image_paths` :
   - visage lock + refs tenues + **frame étape précédente** (continuité)
5. Sauver : `…/frames/step-{NN}.png` (NN = index 01, 02, 03…)
6. **Contrôle qualité** avant de passer à l’étape suivante :
   - le geste de l’étape est-il **seul** et **lisible** ?
   - pour gilet : beige sans manches **déjà sur** le corps ? manches longues = **objet manipulé** ?
   - si non → régénérer **cette** étape seulement

### 4. Construire les props

`buildTutoPropsFromExercise(ex, sceneSrcs[])` → `tmp/exercise-tutos/{slug}-props.json`

Mode HUMAIN : `demoObjectPosition: "center top"`, `accent: "teal"`  
`defaultStepFrames`: **75** (senior)

### 5. Rendre MP4

```bash
mkdir -p tmp/exercise-tutos tmp/community-renders
npm run community:render-video -- \
  --composition=ProchePlusExerciseTuto \
  --props=tmp/exercise-tutos/{slug}-props.json \
  --slug=exercise-tuto-{slug}
```

### 6. Publier

```bash
cp tmp/community-renders/exercise-tuto-{slug}-*.mp4 \
  public/community-assets/exercise-tutos/{slug}/{slug}.mp4
```

### 7. Livrer

- MP4 + lien
- Aperçu **une frame par étape** (pour valider la découpe)
- Consignes = CSV non modifiées

## Exercice hors CSV

Brief manuel `{ name, steps[], objective }` — même pipeline. Ne pas inventer le clinique.
