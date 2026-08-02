# Studio Ours — Top chrono 15

**Exercice :** Top chrono 15 (Les Exercices Assis · A · Palier 1)  
**Source UI :** prévisualisation aidant (proche-plus.vercel.app)  
**Canon :** C-v3

## Storyboard

| # | Frames | Action | Titre | Sous-titre |
|---|---|---|---|---|
| 1 | 75 | Pieds / jambes assis | Top chrono 15 | Toutes les 15 minutes, on bouge un peu. |
| 2 | 75 | Bras | Bras & jambes | Tends et plie — à ton rythme. |
| 3 | 90 | Mains accoudoirs / assis↔debout | Assis ↔ debout | Mains sur les accoudoirs. On recommence dans 15 min. |

## Assets

- `public/community-assets/ours-canon/generations/ours-video-topchrono15-beat{1,2,3}.png`
- Props : `tmp/studio-ours/topchrono15-props.json`
- MP4 : `tmp/community-renders/topchrono15-*.mp4` (~8 s, 9:16)

## Rendu

```bash
npm run community:render-video -- \
  --composition=ProchePlusStoryboard \
  --props=tmp/studio-ours/topchrono15-props.json \
  --slug=topchrono15
```
