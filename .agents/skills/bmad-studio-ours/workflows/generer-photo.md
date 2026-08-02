# Workflow — PH Générer une photo

## Goal

Produire **une** illustration still de l’ours Proche+ fidèle au canon C-v3.

## Steps

1. **Brief** — situation · émotion · lieu · (thème optionnel) · ratio (défaut 1:1). Si manquant → une seule question groupée.

2. **Gate** — appliquer `references/canon-rapide.md` + safeguards S1–S9. Refus FR si violation.

3. **Référence visuelle** — `Read` sur `{project-root}/public/community-assets/ours-canon/canon-c-v3.png` pour ancrer l’identité.

4. **Prompt** — assembler :
   - bloc IDENTITY + négatifs de `references/canon-rapide.md`
   - SCENE : situation / émotion / lieu / thème
   - ART : cream `#FAF7F2`, accents teal / soleil / terracotta si pertinent
   - COMPOSITION : ours héros lisible, posture digne (siège / table)
   - FORMAT : ratio demandé

5. **Générer** — utiliser l’outil **GenerateImage** avec :
   - `description` = prompt complet
   - `reference_image_paths` = `["{project-root}/public/community-assets/ours-canon/canon-c-v3.png"]` (et `declinaison-fauteuil.png` si scène fauteuil)
   - `aspect_ratio` adapté (`1:1` · `9:16` · `16:9`)
   - `filename` descriptif (`ours-{theme-or-slug}-{emotion}.png`)

6. **Contrôle rapide** (à voix haute, 3 points max) :
   - même face (mèche, mono-sourcil, pattes d’oie) ?
   - gilet OK / pas de nœud ?
   - pas au sol / pas d’humain ?

7. **Livrer** — montrer l’image. Proposer variante ou sauvegarde repo si demandé.

## Persist (seulement si demandé)

- Copier / écrire sous `public/community-assets/ours-canon/generations/` **ou** chemin indiqué par l’utilisateur.
- Journal optionnel : `_bmad-output/implementation-artifacts/studio-ours/photo-{date}-{slug}.md` (brief + chemin asset).
