# Workflow — AB Article de blog SEO

## Goal

Produire un article SEO (pilier urgence / démarches / témoignage) conforme aux templates, personas et garde-fous Proche+.

## Load

- `references/personas.md`
- `references/piliers-seo.md`
- `references/templates.md`
- `references/vision-proche-plus.md`
- `references/garde-fou-legal.md`
- `references/humour-et-ton.md`
- `references/inspirations.md` (posture éditoriale)

## Steps

1. **Collecter** (ne pas re-demander si déjà dit) :
   - persona (Danièle / Michel / Corinne / Patrick / Françoise)
   - moment de visite (SSR / domicile)
   - pilier (urgence / démarches / témoignage)
   - sujet / question orale cible
   - phase : lancement (pas de produit) ou post-lancement (CTA marque discret OK)

2. **Contrôles préalables** :
   - Sujet urgence / sensible → zéro humour
   - Ton aligné persona (Corinne ≠ Michel)
   - Si stats santé prévues → sources officielles ou abandon

3. **Rédiger** selon le template article (`templates.md`) :
   - Titre = question complète à l'oral
   - Chapô = réponse directe (featured snippet, ~100 premiers mots utiles)
   - Sommaire cliquable
   - Corps 1500–2000 mots (piliers 1–2)
   - FAQ 3–5 questions
   - Maillage interne : au moins 2 liens piliers (placeholders OK si articles absents)
   - CTA final doux — jamais « achetez », jamais lien app

4. **Filtre légal/santé** (`garde-fou-legal.md`) — signaler explicitement tout point douteux.

5. **Présenter** l'article complet + métadonnées (persona, pilier, moment, ton, flags légaux).

6. **Écrire** sous `{implementation_artifacts}/acquisition/article-{persona}-{sujet}.md` après accord (ou si l'utilisateur a dit « écris / go / enregistre »).
