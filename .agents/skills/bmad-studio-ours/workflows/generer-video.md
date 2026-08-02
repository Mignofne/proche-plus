# Workflow — VD Générer / préparer une vidéo

## Goal

Préparer une **vidéo ours** cohérente C-v3 : storyboard + stills clés, puis chemin produit Remotion si publication Community.

## Contexte produit

- Formats : `src/lib/community/formats.ts` (`video-9-16` TikTok défaut ; `video-16-9` Facebook)
- Remotion : `src/lib/community/video/remotion.ts`
- Rendu CLI : `npm run community:render-video -- --publicationId=…` (quand une publication existe)

Ce skill **ne remplace pas** le pipeline Remotion production ; il livre le **matériel visuel + brief** pour une vidéo fidèle au canon.

## Steps

1. **Brief vidéo** — situation · émotion · lieu · durée cible (ex. 8–15 s) · canal (TikTok 9:16 / FB 16:9 / IG) · message texte overlay (optionnel, court).

2. **Gate** — mêmes règles photo (S1–S9, jamais au sol, jamais humains).

3. **Storyboard** (3–5 beats max) — tableau :

   | # | Temps | Action ours | Plan | Texte overlay (si) |
   |---|---|---|---|---|
   | 1 | … | … | … | … |

   Une intention narrative claire. Pas de geste médical.

4. **Stills** — pour chaque beat clé (souvent 2–3) :
   - suivre `workflows/generer-photo.md` (même identité)
   - `aspect_ratio` = `9:16` ou `16:9` selon canal
   - `reference_image_paths` = canon C-v3
   - nommer `ours-video-{slug}-beat{N}.png`

5. **Continuité** — vérifier que les stills montrent le **même acteur** (face, gilet, proportions). Si drift → regénérer le beat fautif.

6. **Livrer** :
   - storyboard
   - stills
   - prompt / notes Remotion (props utiles : titres, format, our presence)
   - si l’utilisateur veut intégrer Community : indiquer Studio posts / publication vidéo + commande render

7. **Persist** (si demandé) — `_bmad-output/implementation-artifacts/studio-ours/video-{date}-{slug}.md` + assets sous `public/community-assets/ours-canon/generations/`.

## Hors scope par défaut

- Upload / publish réseaux sociaux
- Amendement AD-11 (kit-only MVP Community vs gen en publication)
