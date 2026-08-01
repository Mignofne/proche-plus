# Addendum — Éditeur de posts Community Semi

Compléments hors narration PRD (mécanismes, options écartées, brownfield).

## Mécanisme proposé — bake Overlay → Asset publié

- **Choix retenu (hypothèse archi) :** composition serveur déterministe (canvas/Sharp ou équivalent) à partir de l’image source + blocs Overlay (texte, %, scale, couleur hex).
- **Pourquoi pas texte natif plateforme :** IG/FB n’offrent pas un modèle Overlay libre équivalent Alan ; le WYSIWYG exige que l’asset envoyé = ce que montre la Preview.
- **Alignement Preview :** le composant Preview doit consommer le même modèle de layout (mêmes % / scale) que le bake, idéalement en partageant une fonction de layout pure.

## Options écartées

| Option | Pourquoi écartée |
|--------|------------------|
| Export manuel (download + collage Meta) comme seul succès | Contredit « Publication réelle » fondateur |
| Canvas libre type Canva | Coût UX/tech disproportionné vs 3 blocs Alan |
| Preview multi-ratio par Réseau dès v1 | Complexité ; IG-first suffit pour lever frustration #1 |
| Auto-retry publish | Risque double post ; retry manuel + alerte |

## Brownfield à réutiliser

- `createPublicationAction` / `schedulePublicationAction` / `publishManuallyAction` — aujourd’hui statut interne ; à étendre Statut canal + API.
- `CommunitySocialAccount`, `channelsJson`, `slidesJson`, `titleColor` / `subtitleColor`.
- `validateEditableTags` — étendre Overlay + Légende avant envoi.
- Preview existante `/publications/preview/[id]` — à remonter dans le flux de composition (live).

## Intégrations (pointeurs pour architecture)

- Meta Graph : IG Content Publishing / FB Page photos / Threads publishing (scopes & app review hors PRD).
- TikTok : hors chemin photo/Carrousel v1.
- Worker Programmation : cron Vercel / queue ; reprise des `scheduled` dont `scheduledAt <= now`.
