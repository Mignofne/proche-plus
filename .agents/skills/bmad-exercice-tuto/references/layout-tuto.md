# Layout tuto exercice — rappel opérationnel

> Spec complète : `docs/exercise-tuto-video-spec.md`

## Zones (9:16)

| Zone | Hauteur | Contenu |
|---|---|---|
| Instruction | ~38 % | Badge étape + consigne **58px** |
| Démo | ~62 % | **1 photo = 1 étape CSV** (geste dominant) |

## Règle d’or — une photo par étape

- Chaque ligne d’étape du CSV → **exactement une image** `step-{NN}.png`
- Une image = **un seul geste dominant**, lisible en un coup d’œil
- Ne pas mélanger deux actions dans la même photo
- Ne pas “résumer” plusieurs étapes en une seule pose

---

## Prompt image ours (par étape)

```
IDENTITY (LOCKED — Proche+ canon C-v3): [voir bmad-studio-ours/references/canon-rapide.md]
SCENE: Proche+ bear demonstrating exercise step for "{exerciseName}":
"{instruction verbatim from CSV}"
Theme: {themeLabel}. Seated/safe posture per exercise. Never on floor. No humans.
COMPOSITION: vertical 9:16 friendly, bear clear hero, warm cream home, NO text in image.
```

`reference_image_paths`: `canon-c-v3.png` + previous step frame if available (continuity).

---

## Prompt image humain — option DEMIC (par étape)

> Utiliser uniquement si l’utilisateur demande explicitement une démo avec **humains**.

```
IDENTITY (LOCKED — personnalité Proche+ identique à l’ours) :
  - expression rassurante, sourire doux, posture aidante
  - mouvements lents, gestes guidants, ambiance sécurisante

SCENE: Humain illustré (≈70 ans) — UNE SEULE étape :
"{instruction verbatim from CSV}"
Theme: {themeLabel}. Seated/safe posture. Never on floor.

FRAMING :
  - tête + corps entier + pieds visibles
  - visage clairement visible, non coupé
  - caméra légèrement rapprochée (~90–95% de l’image)
  - focus sur le geste de CETTE étape seulement

STYLE : illustration 3D chaleureuse, fond neutre minimal.
NO text in image, no watermark, no logo.
```

### Exercice « gilet » — 2 couches (LOCKED)

| Couche | Quoi | Où |
|---|---|---|
| **Base (déjà portée)** | Gilet **SANS MANCHES** beige uni, **SANS fleurs** | Sur papi / mamie dès le début |
| **Accessoire (à enfiler)** | Gilet / cardigan **MANCHES LONGUES** (crème floral Proche+ ou crème uni lisible) | Objet manipulé dans les étapes |

**Interdit :** confondre les deux (ne jamais montrer le sans-manches comme l’objet à enfiler).

Highlight accessoire manipulé : teal charte **`#2A9D8F`** uniquement.

#### Découpe photo = 1 étape (gilet)

| Étape CSV | Photo (geste dominant) |
|---|---|
| 1. Pose le gilet sur tes genoux… | Assis·e, **porte déjà le beige sans manches**. Le **gilet manches longues** est **ouvert à plat sur les genoux**, intérieur vers soi, **deux mains** qui le tiennent. Highlight teal sur le gilet manches longues. |
| 2. Passe d’abord le bras… | **Un bras clairement engagé dans UNE manche** du gilet manches longues ; l’autre pan encore sur les genoux / tenu. Beige sans manches toujours visible en dessous. Highlight teal sur le bras + manche. |
| 3. Ramène l’autre pan… | **Une main tire clairement le 2ᵉ pan** du gilet manches longues derrière le dos / l’épaule. Beige sans manches encore visible. Highlight teal sur la main + pan. |

`reference_image_paths` (gilet humain) :
1. portrait visage verrouillé (H ou F)
2. `gilet-procheplus-beige-sleeveless-ref.png` (base portée)
3. `gilet-procheplus-floral-longsleeve-ref.png` (accessoire à enfiler)
4. frame de l’étape précédente (continuité visage + tenues)

---

## Props JSON minimal

```json
{
  "exerciseName": "Enfiler son gilet en position assise",
  "themeLabel": "S'habiller",
  "levelCode": "B",
  "tier": 1,
  "accent": "teal",
  "demoObjectPosition": "center top",
  "defaultStepFrames": 75,
  "steps": [
    {
      "instruction": "Pose le gilet sur tes genoux, l'intérieur vers toi.",
      "sceneSrc": "/community-assets/…/step-01.png"
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
