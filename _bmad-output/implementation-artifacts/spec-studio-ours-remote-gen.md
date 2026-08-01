---
title: 'Studio Ours — vraie génération d’illustration (provider remote)'
type: 'feature'
created: '2026-08-01'
status: 'done'
review_loop_iteration: 0
context: []
route: 'one-shot'
---

# Studio Ours — vraie génération d’illustration (provider remote)

## Intent

**Problem:** Le fondateur veut qu’une brief (situation · émotion · lieu) produise une **nouvelle** illustration de l’ours, pas la planche placeholder C-v3.

**Approach:** Activer le provider `remote` par défaut : OpenAI Images (+ ref identité) si clé, sinon Pollinations free ; persister via Blob ou `/tmp` + route API.

## Suggested Review Order

1. [`src/lib/community/mascot-gen/providers/remote.ts`](../../../src/lib/community/mascot-gen/providers/remote.ts) — backends OpenAI / webhook / Pollinations
2. [`src/lib/community/mascot-gen/providers/index.ts`](../../../src/lib/community/mascot-gen/providers/index.ts) — défaut `remote`
3. [`src/lib/community/mascot-gen/image-store.ts`](../../../src/lib/community/mascot-gen/image-store.ts) + route API image
4. [`src/app/admin-produit/community/studio-ours/`](../../../src/app/admin-produit/community/studio-ours/) — UI + `maxDuration`
5. [`tests/unit/mascot-gen-remote.spec.ts`](../../../tests/unit/mascot-gen-remote.spec.ts)
