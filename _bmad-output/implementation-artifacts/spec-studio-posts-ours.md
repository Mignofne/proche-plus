---
title: 'Studio local — création de posts style Alan + déclinaison ours'
type: 'feature'
created: '2026-07-31'
status: 'in-review'
baseline_commit: '83c4c44569bd3ba4205696678711a27c98c4eb25'
review_loop_iteration: 0
context:
  - '{project-root}/docs/project-context.md'
  - '{project-root}/src/components/mascot/Mascot.tsx'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Il n’existe pas d’outil local pour composer des posts réseaux sociaux à l’esthétique Alan (fond pêche, typo ronde centrée, illustration mascotte) ni pour décliner l’ours Proche+ en décrivant la scène voulue (« je veux qu’il soit comme ça »).

**Approach:** Ajouter un studio local `/studio` avec aperçu carré/vertical éditable (titre, sous-titre, fond) et un champ langage naturel qui mappe la description vers une scène SVG composée autour de l’ours brun Proche+.

## Boundaries & Constraints

**Always:**
- Identité ours brun adulte Proche+ (pas de rebrand bleu Alan)
- Composition Alan : fond uni pastel, titre + sous-titre centrés, illustration centrée en bas, logo discret
- Déclinaison 100 % locale (pas d’API image / LLM externe)
- Mobile + desktop ; export PNG via canvas côté client

**Ask First:**
- Persistance BDD / multi-utilisateur
- Intégration dans le parcours aidant produit

**Never:**
- Remplacer la mascotte in-app existante partout
- Génération IA d’images
- Cards / dashboard clutter dans l’aperçu post

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | « assis au bureau avec une lampe » | Scène desk + ours + props | N/A |
| Synonymes | « scroll au lit », « téléphone » | Scène bed | N/A |
| Inconnu | texte sans mot-clé | Scène welcome + message « Scène par défaut » | Soft fallback |
| Vide | description vide | Scène welcome | N/A |
| Export | clic Exporter | Télécharge PNG de l’aperçu | Si canvas fail → toast erreur |

</frozen-after-approval>

## Code Map

- `src/components/mascot/Mascot.tsx` — ours SVG existant (référence visuelle / poses)
- `src/app/globals.css` — tokens couleur / typo Nunito
- `src/components/layout/SiteHeader.tsx` — nav publique à enrichir
- `src/app/page.tsx` — lien d’entrée possible vers le studio
- Nouveau : `src/lib/studio/parse-scene.ts` — parseur FR description → scène
- Nouveau : `src/components/studio/BearScene.tsx` — scènes SVG composables
- Nouveau : `src/components/studio/PostCanvas.tsx` — aperçu post
- Nouveau : `src/app/studio/page.tsx` + `StudioClient.tsx` — UI studio

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/studio/parse-scene.ts` — parseur mots-clés FR → `{ scene, mood, count }` + presets
- [ ] `src/components/studio/BearScene.tsx` — SVG scènes desk/bed/sofa/meal/wave/duo/balcony/welcome
- [ ] `src/components/studio/PostCanvas.tsx` — layout Alan (fond, titres, scène, logo)
- [ ] `src/app/studio/StudioClient.tsx` + `page.tsx` — formulaire + aperçu live + export PNG
- [ ] `src/components/layout/SiteHeader.tsx` + `src/app/page.tsx` — entrée « Studio posts »
- [ ] `tests/unit/parse-scene.spec.ts` — couvrir la matrice I/O parseur

**Acceptance Criteria:**
- Given le studio ouvert, when je saisis titre/sous-titre, then l’aperçu se met à jour immédiatement
- Given une description « je veux qu’il soit au bureau », when je valide / tape, then la scène desk s’affiche avec l’ours brun
- Given une description inconnue, when parse, then fallback welcome sans erreur
- Given un aperçu, when j’exporte, then un PNG se télécharge

## Spec Change Log

## Design Notes

Style Alan adapté Proche+ :
- Fond défaut `#F6D5B8`, texte `#5B6BE0`, ours `#8B5E3C`
- Champ principal : « Décris ton ours… » avec exemples chips cliquables
- Parseur déterministe (règles), pas de ML

## Verification

**Commands:**
- `npx playwright test tests/unit/parse-scene.spec.ts` -- expected: pass
- `npx tsc --noEmit` -- expected: no errors

**Manual checks:**
- Ouvrir `/studio`, tester 3 descriptions, exporter un PNG
