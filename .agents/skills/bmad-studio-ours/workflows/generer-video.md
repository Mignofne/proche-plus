# Workflow — VD Générer une vidéo (MP4)

## Goal

Livrer une **vraie vidéo MP4** de l’ours Proche+ (canon C-v3) via Remotion : stills → storyboard → rendu.

## Pipeline

```
brief → stills C-v3 (GenerateImage) → props JSON → remotion render → MP4
```

| Élément | Chemin |
|---|---|
| Composition verticale | `ProchePlusStoryboard` (9:16) |
| Composition paysage | `ProchePlusStoryboardFacebook` (16:9) |
| Short 1 plan (~3 s) | `ProchePlusShort` (+ `sceneSrc` custom) |
| Stills | `public/community-assets/ours-canon/generations/` |
| Props | `tmp/studio-ours/<slug>-props.json` |
| MP4 | `tmp/community-renders/<slug>-….mp4` |
| CLI | `npm run community:render-video -- --composition=… --props=… --slug=…` |

## Steps

1. **Brief** — situation · émotion · lieu · canal (TikTok 9:16 défaut / Facebook 16:9) · titre + sous-titre courts (optionnel) · durée cible (~4–8 s = 2–4 beats).

2. **Gate** — `references/canon-rapide.md` + S1–S9. Refus FR si violation.

3. **Storyboard** (2–4 beats) :

   | # | Frames (30fps) | Action ours | Titre | Sous-titre |
   |---|---|---|---|---|
   | 1 | 60 | … | … | … |

4. **Stills** — pour chaque beat :
   - suivre `workflows/generer-photo.md` (même identité, ratio canal)
   - `reference_image_paths` = `canon-c-v3.png`
   - **Copier** le PNG généré vers  
     `public/community-assets/ours-canon/generations/ours-video-{slug}-beat{N}.png`
   - chemin public : `/community-assets/ours-canon/generations/ours-video-{slug}-beat{N}.png`

5. **Continuité** — même face / gilet / proportions. Regénérer si drift.

6. **Props JSON** — écrire `tmp/studio-ours/{slug}-props.json` :

```json
{
  "accent": "teal",
  "beats": [
    {
      "sceneSrc": "/community-assets/ours-canon/generations/ours-video-demo-beat1.png",
      "title": "Titre court",
      "body": "Sous-titre chaleureux",
      "durationInFrames": 60
    }
  ]
}
```

Variante **1 plan rapide** (composition `ProchePlusShort`) :

```json
{
  "title": "Titre",
  "body": "Sous-titre",
  "poseKey": "encourage",
  "accent": "teal",
  "sceneSrc": "/community-assets/ours-canon/generations/ours-video-demo-beat1.png",
  "bearEnabled": true
}
```

7. **Rendre le MP4** :

```bash
mkdir -p tmp/studio-ours tmp/community-renders
npm run community:render-video -- \
  --composition=ProchePlusStoryboard \
  --props=tmp/studio-ours/{slug}-props.json \
  --slug={slug}
```

Facebook / paysage → `--composition=ProchePlusStoryboardFacebook`.

8. **Livrer** :
   - chemin du MP4 (`tmp/community-renders/…`)
   - stills utilisés
   - storyboard (tableau)
   - proposer : variante · autre canal · intégration Community (Blob + `videoBlobUrl`)

9. **Journal** (si demandé) — `_bmad-output/implementation-artifacts/studio-ours/video-{date}-{slug}.md`.

## Variante sans nouvelles stills

Si l’utilisateur veut une vidéo **immédiatement** avec le kit validé :

- Utiliser des scènes `public/community-assets/ours-canon/scenes-referentiel/scene-*.png`
- Même pipeline props → render (pas besoin de GenerateImage)

## Hors scope par défaut

- Upload / publish réseaux sociaux
- Worker Vercel / CI render
- Amendement AD-11
