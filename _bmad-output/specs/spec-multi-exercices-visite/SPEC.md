---
id: SPEC-multi-exercices-visite
companions:
  - visit-session-flow.md
  - ../../planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/EXPERIENCE.md
  - ../../../docs/project-context.md
sources:
  - docs/Proche+_Specs_Section10_et_suivantes.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Multi-exercices dans une même visite

## Why

**Pain to solve.** En mode visite, enregistrer un outcome (Réussi / Essai / Échec) affiche « Visite terminée » et renvoie l’aidant à l’accueil. Une visite réelle peut comporter plusieurs gestes ; à la **fin d’un exercice**, l’aidant doit pouvoir se voir **proposer un autre** sans quitter le mode visite.

## Capabilities

- **CAP-1**
  - **intent:** L’aidant peut enregistrer plusieurs outcomes d’exercices au cours d’**une même session** mode visite, sans redirection forcée vers l’accueil après le premier.
  - **success:** Après un outcome, l’aidant reste en mode visite sur un écran post-outcome ; l’accueil n’est atteint que via « Terminer la visite », retour header volontaire, ou stop check-in.

- **CAP-2** *(retired / hors scope)*
  - **intent:** ~~Après le thème, liste simple des exercices activés pour choisir.~~
  - **success:** ~~N/A — reporté.~~ Entrée reste thème → exercice courant (`isCurrent`), comme aujourd’hui.

- **CAP-3**
  - **intent:** À la fin d’un exercice (après outcome), le système **propose de continuer** avec l’exercice courant du même thème (nommé), ou de changer de thème **sur la même page**, ou de terminer.
  - **success:** Post-outcome : primaire « Continuer : {nom} » (même thème, après refresh) ; secondaire « Autre thème » (liste inline des autres thèmes) ; ghost « Terminer la visite » — pas de détour forcé vers l’écran thèmes complet, pas de « Visite terminée » auto.

- **CAP-4**
  - **intent:** L’aidant et le pro peuvent retrouver **tous** les outcomes réalisés pendant la session (pas seulement le dernier).
  - **success:** Aidant : voir `SPEC-historique-exercices-visite` (exercices effectués, pas transmissions). Pro : timeline/log listent chaque outcome de session (lien check-in / sessionRef encore ouvert).

## Constraints

- Périmètre MVP = **uniquement** la proposition post-outcome — pas de liste multi-exercices à l’entrée du thème.
- Entrée : thème → exercice courant publié activé (comportement existant).
- Check-in fatigue/douleur **inchangé** : toujours avant thèmes ; stop hard (≥ 6) = sortie de session sans exercices.
- Un seul CTA primaire par écran post-outcome (« Continuer : {nom} » quand un exercice même thème est disponible).
- Microcopy post-outcome : ne pas afficher « Visite terminée » tant que la session peut continuer.
- Thème-first à **l’entrée** de visite ; en post-outcome, le changement de thème se fait inline (pas d’auto-lancement d’un autre thème).
- Ne pas auto-lancer un exercice sans CTA nommé explicite.
- Alignement UX : `EXPERIENCE.md` (ux-proche-plus-2026-07-30) — spines win on conflict with mocks/code.

## Non-goals

- Liste / picker de tous les exercices du thème à l’entrée (CAP-2 reporté).
- Plafond dur du nombre d’exercices par visite.
- Recommandation IA / ranking personnalisé du « prochain » exercice au-delà du courant par thème.
- Refonte du mode legacy (transmission sans catalogue).
- Remplacer le check-in ou l’historique « Mes dernières visites ».
- Activation d’exercices par l’aidant (reste côté pro).

## Success signal

Jean choisit Fauteuil, fait l’exercice courant, reçoit « C’est noté — un autre exercice ? », choisit d’en faire un autre (retour thèmes → ex. Communication), puis termine volontairement — sans éjection à l’accueil après le premier outcome.

## Assumptions

- « Faire un autre exercice » = retour au **choix de thème** (puis exercice courant du thème choisi) — pas d’auto-lancement d’un 2ᵉ exercice sans choix de thème.
- Pas de plafond N max au MVP ; le check-in d’entrée reste le garde-fou fatigue/douleur.
- Un identifiant de session (check-in existant ou `VisitSession`) peut être nécessaire pour lier N outcomes — détail schéma ouvert.
