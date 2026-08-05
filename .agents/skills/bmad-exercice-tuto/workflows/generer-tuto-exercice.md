# Workflow — TE Générer vidéo tuto exercice

## Goal

MP4 tuto **lisible** (consignes XL) pour **un** exercice du référentiel.

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
- Si vide → STOP (exercice non pertinent / incomplet)

### 3. Générer les visuels (par étape) — ours ou humains

Pour chaque `ex.steps[i]` :

1. Détection intent :
   - si l’utilisateur demande **humains** (mots-clés : “humain”, “DEMIC”, “sans ours”, “70 ans illustré”) → mode **HUMAIN**
   - sinon → mode **OURS** (bear canon C-v3)
2. Prompt :
   - mode OURS : `references/layout-tuto.md` section **Prompt image ours**
   - mode HUMAIN : `references/layout-tuto.md` section **Prompt image humain — option DEMIC**
   - ajouter la consigne **verbatim** depuis le CSV à la fin du prompt
3. `GenerateImage` 9:16, `reference_image_paths` = frame précédente si disponible (continuité)
   - en mode **HUMAIN** : garder **la même tenue / même motif / mêmes boutons** entre step 1 → step N (si une tenue change, invalider et régénérer)
   - si l’exercice parle d’un **gilet** : forcer le **gilet floral Proche+ C-v3** en version **manches longues** (cardigan) — références : `canon-c-v3.png` + `gilet-procheplus-floral-longsleeve-ref.png` + portrait visage verrouillé
4. Sauver :
   - frames MP4 (si v1) : `public/community-assets/exercise-tutos/{slug}/frames/step-{NN}.png`
   - ou optionnellement dans un sous-dossier humain si vous souhaitez distinguer les variantes (ex. `demic-human70-zoom/`), puis fournir `sceneSrc` via props.

**Option animé par étape :** 2 poses (début/fin) → mini flipbook ; pour v1 une image forte par étape suffit.

Safeguards C-v3 : `bmad-studio-ours/references/canon-rapide.md`

### 4. Construire les props

Utiliser `buildTutoPropsFromExercise(ex, sceneSrcs[])` depuis `src/lib/exercises/tuto-video.ts`.

Écrire `tmp/exercise-tutos/{slug}-props.json`.

Si mode **HUMAIN** :
- ajouter `demoObjectPosition: "center top"` dans le props JSON pour que le visage soit visible dans le panneau démo bas.

`defaultStepFrames`: **75** (senior). Monter à 90 si beaucoup d'étapes.

### 5. Rendre MP4

```bash
mkdir -p tmp/exercise-tutos tmp/community-renders
npm run community:render-video -- \
  --composition=ProchePlusExerciseTuto \
  --props=tmp/exercise-tutos/{slug}-props.json \
  --slug=exercise-tuto-{slug}
```

### 6. Publier pour téléphone

```bash
cp tmp/community-renders/exercise-tuto-{slug}-*.mp4 \
  public/community-assets/exercise-tutos/{slug}/{slug}.mp4
```

Lien raw (après push) :
`https://raw.githubusercontent.com/…/public/community-assets/exercise-tutos/{slug}/{slug}.mp4`

### 7. Livrer

- MP4 + lien téléchargement
- Aperçu des frames
- Rappeler : consignes = CSV (non modifiées)
- Proposer : autre exercice, ralentir (`defaultStepFrames: 90`), paysage FB (`ProchePlusExerciseTutoFacebook`)

## Exercice hors CSV (ex. Top chrono 15 prod only)

Si absent du CSV :

1. Demander validation d’ajout au référentiel **ou**
2. Brief manuel : nom, thème, niveau, palier, objectif, `steps[]` — puis même pipeline

Ne pas inventer les étapes cliniques.
