---
title: 'Community — Facebook, formats par réseau, ours en situation, couleurs texte'
type: 'feature'
created: '2026-08-01'
status: 'done'
baseline_commit: '557566d'
review_loop_iteration: 0
context:
  - '{project-root}/docs/project-context.md'
  - '{project-root}/docs/mascot-generation-architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Community ne propose que Instagram / Threads / TikTok ; les aperçus forcent un ours en médaillon circulaire et des couleurs de texte fixes, alors que le fondateur veut un style « ours en situation » (scène complète, type avec_alan) avec couleurs de texte choisies, et Facebook avec format adapté au réseau cible.

**Approach:** Ajouter le canal Facebook, résoudre le format d’aperçu/rendu selon le canal principal, remplacer le médaillon par une scène référentiel full-bleed + texte haut colorisable, et exposer des sélecteurs de couleurs dans l’éditeur.

## Boundaries & Constraints

**Always:**
- Canal Facebook dans l’enum Prisma, comptes, allowlist par kind, seed et UI.
- Classique/carrousel : Instagram, Threads, Facebook — pas TikTok.
- Vidéo : Instagram, Threads, TikTok, Facebook.
- Format d’aperçu dérivé du canal principal (premier canal / cible) via une table unique `formats.ts`.
- Ours affiché en situation (image scène pleine, pas `rounded-full` / Mascot médaillon) quand `bearEnabled`.
- Couleurs titre + sous-titre/overlay persistées et appliquées dans classique, carrousel et vidéo Remotion.
- Communication / docs / UI en français ; aucune PHI ; kit scènes curaté uniquement (pas d’appel générateur distant).

**Ask First:**
- Remplacer entièrement le kit scènes référentiel par de nouvelles illustrations générées.
- Brancher l’API Meta (publish automatique).

**Never:**
- API Meta/TikTok réelle (Semi manuel inchangé).
- Remettre l’ours en crop circulaire comme rendu par défaut des posts.
- Importer données cliniques dans Community.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy FB classique | kind=classique, channels=[facebook] | Aperçu ratio FB feed (~1.91:1), label Facebook, scène ours + couleurs | N/A |
| Happy IG carrousel | kind=carrousel, channels=[instagram] | Aperçu 1:1, slides avec textColor, scène | N/A |
| Happy vidéo FB | kind=video, channels=[facebook] | Player ratio FB vidéo (16:9), couleurs Remotion | N/A |
| TikTok classique | kind=classique, channels=[tiktok] | Refusé | Erreur allowlist existante |
| Couleurs invalides | titleColor="#zz" | Fallback couleurs défaut Alan-like | Ignore / clamp hex |
| Sans scène explicite | pas de sceneKey | Resolve scène via poseKey / thème | Scène défaut communication |
| Sans ours | bearEnabled=false | Texte seul, pas d’image ours | N/A |

</frozen-after-approval>

## Code Map

- `prisma/schema.prisma` — enum `facebook` + champs `titleColor` / `subtitleColor` / `sceneKey`
- `src/lib/community/formats.ts` — **nouveau** map canal×kind → dimensions / aspect / label
- `src/lib/community/scenes.ts` — **nouveau** résolution scène référentiel
- `src/lib/community/publications.ts` — allowlist Facebook
- `src/lib/community/themes.ts` / `prisma/seed-community.ts` — réseaux Facebook + compte seed
- `src/app/admin-produit/community/actions.ts` — allowlist + persist couleurs/scène ; canal cible depuis compte
- `src/app/admin-produit/community/{comptes,publications/nouveau}/page.tsx` — UI Facebook + color pickers + scène
- `src/components/community/{Classic,Carousel,Video}PostPreview.tsx` — format + scène + couleurs
- `src/remotion/ProchePlusShort.tsx` + `src/lib/community/video/remotion.ts` — scène + couleurs + taille
- `src/app/admin-produit/community/publications/preview/[id]/page.tsx` — passer canal / couleurs / scène
- `tests/unit/community-publications.spec.ts` + `tests/unit/community-formats.spec.ts` — allowlist + formats

## Tasks & Acceptance

**Execution:**
- [x] `prisma/schema.prisma` — ajouter `facebook` + `titleColor`/`subtitleColor`/`sceneKey` optionnels — canal + style persistés
- [x] `src/lib/community/formats.ts` — table formats + helpers label/aspect — adaptation réseau
- [x] `src/lib/community/scenes.ts` — map pose/thème → PNG scènes-referentiel — ours en situation
- [x] `src/lib/community/publications.ts` + tests — Facebook dans allowlists
- [x] Previews + Remotion + preview page — brancher format, scène full-bleed, couleurs
- [x] Formulaire nouveau + actions + comptes + themes/seed — contrôles fondateur
- [x] `npx prisma generate` (+ db push si DB dispo) et tests unitaires

**Acceptance Criteria:**
- Given un brouillon classique ciblant Facebook, when l’aperçu s’affiche, then le ratio et le label correspondent à Facebook (distinct d’IG 1:1).
- Given un carrousel IG, when les slides ont `textColor`, then le texte overlay utilise ces couleurs (pas blanc forcé).
- Given `bearEnabled`, when aperçu classique/carrousel/vidéo, then l’ours apparaît en scène pleine (pas médaillon circulaire).
- Given le formulaire nouveau, when le fondateur choisit couleurs titre/sous-titre, then elles sont sauvegardées et visibles en preview.
- Given kind classique + canal tiktok, when validation, then erreur allowlist.

## Spec Change Log

## Design Notes

Style cible (réf. avec_alan) : fond pastel uni/doux, **texte en haut** (titre bold + sous-titre) avec couleurs choisies, illustration ours **en situation** centrée en bas — pas de crop circulaire.

Formats (canal principal) :
- IG / Threads classique+carrousel → 1:1 (1080²)
- Facebook classique → 1.91:1 (1200×630)
- Facebook carrousel → 1:1
- IG / Threads / TikTok vidéo → 9:16 (1080×1920)
- Facebook vidéo → 16:9 (1920×1080)

Couleurs défaut : titre `#5B6BC0`, sous-titre `#8B7BB5` (proche réf. Alan), presets marque + hex libre.

## Verification

**Commands:**
- `npx prisma generate` — client à jour avec `facebook`
- `npx playwright test tests/unit/community-publications.spec.ts tests/unit/community-formats.spec.ts` — verts
- `npx tsc --noEmit` (si raisonnable) — pas d’erreurs sur fichiers touchés
