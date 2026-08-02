# Studio Ours — Top chrono 15 (ours animé)

**Exercice :** Top chrono 15 (Les Exercices Assis · A · Palier 1)  
**Source UI :** prévisualisation aidant (proche-plus.vercel.app)  
**Canon :** C-v3  
**Mode :** **flipbook animé** (`ProchePlusFlipbook`) — l’ours change de pose

## Keyframes

| Frame | Action |
|---|---|
| f01 / f02 | Alternance pieds (tap assis) |
| f03 / f04 | Bras tendus ↔ pliés |
| f05 / f06 | Assis ↔ debout (accoudoirs) |

## Assets

- `public/community-assets/ours-canon/generations/ours-anim-topchrono-f{01..06}.png`
- Props : `tmp/studio-ours/topchrono15-flipbook-props.json`
- MP4 : `tmp/community-renders/topchrono15-anime-*.mp4` (9:16)

## Rendu

```bash
npm run community:render-video -- \
  --composition=ProchePlusFlipbook \
  --props=tmp/studio-ours/topchrono15-flipbook-props.json \
  --slug=topchrono15-anime
```

## Note

Image→vidéo IA fluide (Seedance / équivalent) nécessite une clé API — non dispo dans l’env cloud actuelle. Flipbook = chemin produit sans clé.
