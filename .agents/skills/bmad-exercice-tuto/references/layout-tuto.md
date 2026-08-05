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

## Prompt image humain — option DEMIC (par étape)

> Utiliser uniquement si l’utilisateur demande explicitement une démo avec **humains** (ex. “humain”, “DEMIC”, “sans ours”, “70 ans illustré”, etc.).

```
IDENTITY (LOCKED — personnalité Proche+ identique à l’ours) :
  - expression rassurante, sourire doux, posture aidante
  - mouvements lents, gestes guidants, ambiance sécurisante
SCENE: Humain illustré (≈70 ans) demonstrating exercise step for "{exerciseName}":
"{instruction verbatim from CSV}"
Theme: {themeLabel}. Seated/safe posture per exercise. Never on floor.

FRAMING (verrouillé lisibilité mobile) :
  - tête + corps entier + pieds visibles
  - visage clairement visible, **non coupé** (yeux/forehead/menton), centré dans la partie haute
  - caméra légèrement rapprochée : la personne occupe ~90–95% de l’image
  - zoom léger sur l’action (gilet sur genoux + mains)

TENUE (verrouillé — identique sur toutes les étapes) :
  - garder le **même vêtement / même motif / mêmes boutons** entre step 1 → step N
  - ne pas changer de couleur, de style ou de coupe du gilet
  - si l’exercice implique un **gilet** : utiliser le **gilet floral Proche+ C-v3**
    (crème + fleurs mexicaines orange/rose/bleu + feuilles vertes),
    en version **manches longues** (cardigan) pour que le geste « enfiler » soit lisible
  - référence motif : `public/community-assets/ours-canon/canon-c-v3.png`
    + éventuelle ref dédiée `…/gilet-procheplus-floral-longsleeve-ref.png`

STYLE : illustration 3D chaleureuse (type DEMIC/fitness tutorial), couleurs crème/chaudes, fond neutre minimal, repère visuel vert discret autour de la zone à manipuler.
NO text in image, no watermark, no logo.
```

`reference_image_paths` (mode HUMAIN) :
- portrait visage verrouillé (homme ou femme)
- ref gilet floral manches longues Proche+ (si exercice gilet)
- `canon-c-v3.png` pour le motif
- frame précédente (continuité)

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
