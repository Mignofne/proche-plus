# Layout tuto exercice — rappel opérationnel

> Spec complète : `docs/exercise-tuto-video-spec.md`

## Zones (9:16)

| Zone | Hauteur | Contenu |
|---|---|---|
| Instruction | ~38 % | Badge étape + consigne **58px** |
| Démo ours | ~62 % | Image / flipbook |

## Prompt image ours (par étape)

```
IDENTITY (LOCKED — Proche+ canon C-v3): [voir bmad-studio-ours/references/canon-rapide.md]
SCENE: Proche+ bear demonstrating exercise step for "{exerciseName}":
"{instruction verbatim from CSV}"
Theme: {themeLabel}. Seated/safe posture per exercise. Never on floor. No humans.
COMPOSITION: vertical 9:16 friendly, bear clear hero, warm cream home, NO text in image.
```

`reference_image_paths`: `canon-c-v3.png` + previous step frame if available (continuity).

## Flipbook par étape (2–4 poses)

Pour chaque étape CSV, générer 2 poses min (début/fin du geste) puis assembler en mini-séquence dans `sceneSrc` **ou** une image représentative si budget temps.

Chemin : `public/community-assets/exercise-tutos/{slug}/frames/step-{NN}-f{01..}.png`

## Props JSON minimal

```json
{
  "exerciseName": "Top chrono 15",
  "themeLabel": "Les Exercices Assis",
  "levelCode": "A",
  "tier": 1,
  "objective": "...",
  "accent": "teal",
  "defaultStepFrames": 75,
  "steps": [
    {
      "instruction": "Tape le sol avec tes pieds pendant 15 secondes.",
      "sceneSrc": "/community-assets/exercise-tutos/top-chrono-15/frames/step-01.png"
    }
  ]
}
```

## Rendu

```bash
npm run community:render-video -- \
  --composition=ProchePlusExerciseTuto \
  --props=tmp/exercise-tutos/{slug}-props.json \
  --slug=exercise-tuto-{slug}
```

Copier MP4 final → `public/community-assets/exercise-tutos/{slug}/{slug}.mp4` pour téléchargement mobile (lien raw GitHub ou prod).
