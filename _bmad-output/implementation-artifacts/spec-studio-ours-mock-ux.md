---
title: 'Studio Ours — clarifier le résultat mock (placeholder ≠ scène)'
type: 'bugfix'
created: '2026-08-01'
status: 'done'
review_loop_iteration: 0
context: []
route: 'one-shot'
---

# Studio Ours — clarifier le résultat mock (placeholder ≠ scène)

## Intent

**Problem:** Après « Générer », la planche canon C-v3 s’affichait comme « Résultat », ce qui faisait croire à une erreur ou à une mauvaise génération alors que Phase 1 ne produit que le prompt.

**Approach:** Remonter le prompt comme livrable principal, relabeler l’image en placeholder explicite, et ajuster les textes UI / CTA.

## Suggested Review Order

1. [`src/app/admin-produit/community/studio-ours/StudioOursForm.tsx`](../../../src/app/admin-produit/community/studio-ours/StudioOursForm.tsx) — ordre résultat + libellés
2. [`src/app/admin-produit/community/studio-ours/actions.ts`](../../../src/app/admin-produit/community/studio-ours/actions.ts) — `providerNote` mock
3. [`src/app/admin-produit/community/studio-ours/page.tsx`](../../../src/app/admin-produit/community/studio-ours/page.tsx) — sous-titre Phase 1
