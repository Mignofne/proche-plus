---
title: 'Fix crash Studio Ours sur Vercel (FS read-only)'
type: 'bugfix'
created: '2026-08-01'
status: 'done'
review_loop_iteration: 0
context: []
route: 'one-shot'
---

# Fix crash Studio Ours sur Vercel (FS read-only)

## Intent

**Problem:** Sur `/admin-produit/community/studio-ours`, un clic « Générer » en production affichait `global-error` (« Une erreur est survenue » / Server Components digest) parce que l’historique Phase 1 tentait d’écrire sous `process.cwd()/.data` (FS en lecture seule sur Vercel), et le `catch` de l’action rappelait `saveGeneration` qui rethrowait.

**Approach:** Rendre l’historique fichier non-bloquant (soft-fail + dossier writable `/tmp` sur Vercel) pour que la génération mock et l’UI restent utilisables.

## Suggested Review Order

1. [`src/lib/community/mascot-gen/history.ts`](../../../src/lib/community/mascot-gen/history.ts) — résolution du dossier (`/tmp` / override) + soft-fail `saveGeneration` + lecture sans mkdir
2. [`src/app/admin-produit/community/studio-ours/actions.ts`](../../../src/app/admin-produit/community/studio-ours/actions.ts) — catch imbriqué sur le log d’échec
3. [`src/app/admin-produit/community/studio-ours/StudioOursForm.tsx`](../../../src/app/admin-produit/community/studio-ours/StudioOursForm.tsx) — rendu défensif de l’historique
4. [`tests/unit/mascot-gen-history.spec.ts`](../../../tests/unit/mascot-gen-history.spec.ts) — RO soft-fail, JSON incomplets, branche VERCEL
