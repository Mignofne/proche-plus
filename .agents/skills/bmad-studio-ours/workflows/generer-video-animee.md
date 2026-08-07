# Workflow — VA Ours animé (flipbook keyframes → MP4)

## Goal

Livrer une **vidéo où l’ours bouge** (poses successives), pas un diaporama Community.

## Modes

| Mode | Composition | Sensation |
|---|---|---|
| **Animé (défaut VA)** | `ProchePlusFlipbook` | Keyframes plein cadre qui défilent vite |
| Diaporama texte | `ProchePlusStoryboard` | Plans longs + titres (voir `generer-video.md`) |
| Image→vidéo IA | *(nécessite clé Pollinations/Seedance ou équivalent)* | Motion fluide — brancher quand `POLLINATIONS_API_KEY` / provider dispo |

Sans clé i2v : **flipbook** = chemin produit actuel.

## Steps

1. **Brief** — exercice / situation · 3–6 poses clés (ex. pied G → pied D → bras tendus → bras pliés → assis↔debout).
2. **Gate** — canon C-v3 + S1–S9.
3. **Keyframes** — GenerateImage pour chaque pose :
   - **même cadrage / décor** autant que possible
   - `reference_image_paths` = C-v3 + première frame
   - ratio canal (9:16 défaut)
   - copier vers `public/community-assets/ours-canon/generations/ours-anim-{slug}-f{NN}.png`
4. **Séquence** — ordonner les frames (cycles de mouvement OK : f01,f02,f01,f02…).
5. **Props** — `tmp/studio-ours/{slug}-flipbook-props.json` :

```json
{
  "accent": "teal",
  "title": "Top chrono 15",
  "body": "Toutes les 15 minutes — à votre rythme.",
  "holdFrames": 14,
  "loops": 1,
  "endHoldFrames": 45,
  "frames": [
    "/community-assets/ours-canon/generations/ours-anim-demo-f01.png",
    "/community-assets/ours-canon/generations/ours-anim-demo-f02.png"
  ]
}
```

6. **Rendu** :

```bash
npm run community:render-video -- \
  --composition=ProchePlusFlipbook \
  --props=tmp/studio-ours/{slug}-flipbook-props.json \
  --slug={slug}-anime
```

7. **Livrer** le MP4 + frames.

## Rythme (public senior / ours ~60 ans)

- **Défaut :** `holdFrames` **14** (~0,5 s/pose à 30 fps) — calme, lisible.
- Trop rapide → monter à 18–20. Jamais sous 10 pour un contenu aidant/senior.
- `endHoldFrames` ≥ 40 pour laisser souffler sur la dernière pose.
