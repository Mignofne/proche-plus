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

**Pain to solve.** En mode visite, enregistrer un outcome (Réussi / Essai / Échec) affiche « Visite terminée » et renvoie l’aidant à l’accueil. Une visite réelle comporte souvent plusieurs gestes ; l’aidant doit pouvoir enchaîner sans « sortir » du mode visite. De plus, après le thème, l’app auto-sélectionne un seul exercice courant — l’aidant n’a pas de vue simple pour choisir parmi les exercices activés du thème (aligné §10.1 « un exercice ou une liste courte »).

## Capabilities

- **CAP-1**
  - **intent:** L’aidant peut enregistrer plusieurs outcomes d’exercices au cours d’**une même session** mode visite, sans redirection forcée vers l’accueil après le premier.
  - **success:** Après un outcome, l’aidant reste en mode visite sur un écran entre-deux ; l’accueil n’est atteint que via « Terminer la visite », retour header volontaire, ou stop check-in.

- **CAP-2**
  - **intent:** Après avoir choisi un thème, l’aidant peut voir une **liste simple** des exercices activés pour ce thème / ce proche et en sélectionner un.
  - **success:** Post-thème, une liste de lignes (nom, durée indicative optionnelle, badge « Proposé » sur l’exercice courant) remplace l’ouverture auto silencieuse ; un tap ouvre le détail + outcomes.

- **CAP-3**
  - **intent:** Après un outcome, l’aidant peut enchaîner (même thème), changer de thème, ou clôturer la visite explicitement.
  - **success:** L’écran entre-deux expose exactement trois sorties : « Faire un autre exercice » · « Changer de thème » · « Terminer la visite » (hiérarchie primaire / secondaire / ghost).

- **CAP-4**
  - **intent:** L’aidant et le pro peuvent retrouver **tous** les outcomes réalisés pendant la session (pas seulement le dernier).
  - **success:** « Mes dernières visites » / détail visite et timeline pro listent chaque exercice + outcome de la session liée au check-in (ou équivalent session).

## Constraints

- Liste post-thème = uniquement `PatientExercise` avec exercice `publie` pour ce `patientId` + `themeId` — **jamais** le catalogue global non activé.
- Check-in fatigue/douleur **inchangé** : toujours avant thèmes ; stop hard (≥ 6) = sortie de session sans exercices.
- Un seul CTA primaire par écran ; lignes liste ≥ 48×48 ; pas de multi-CTA sur l’écran détail exercice.
- Microcopy entre-deux : ne pas forcer « à la prochaine visite » tant que la session peut continuer.
- Thème-first reste obligatoire (jamais auto-sauter le choix de thème).
- Si un seul exercice activé pour le thème : liste à **une** ligne + CTA démarrer — pas d’auto-lancement sans tap.
- Alignement UX : `EXPERIENCE.md` (ux-proche-plus-2026-07-30) — spines win on conflict with mocks/code.

## Non-goals

- Plafond dur du nombre d’exercices par visite.
- Recommandation IA / ranking personnalisé au-delà du badge « Proposé » sur `isCurrent`.
- Refonte du mode legacy (transmission sans catalogue exercices) au-delà de ne pas casser son flux actuel.
- Remplacer le check-in ou l’historique « Mes dernières visites ».
- Activation d’exercices par l’aidant (reste côté pro).

## Success signal

Jean choisit Fauteuil, voit deux exercices, en fait un, reçoit « C’est noté », enchaîne sur un second (même thème ou autre), puis termine la visite volontairement — sans être éjecté à l’accueil après le premier outcome ; l’historique montre les deux résultats.

## Assumptions

- Pas de plafond N max au MVP ; le check-in d’entrée reste le garde-fou fatigue/douleur.
- Après advance/fallback de palier, `isCurrent` peut changer ; la liste se rafraîchit au retour hub thème / liste.
- Un identifiant de session (check-in existant ou `VisitSession`) peut être nécessaire pour lier N outcomes — détail schéma ouvert (voir companion + open question).
