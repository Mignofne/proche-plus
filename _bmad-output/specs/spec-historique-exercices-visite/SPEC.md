---
id: SPEC-historique-exercices-visite
companions:
  - historique-aidant-contenu.md
  - ../../../docs/project-context.md
  - ../spec-multi-exercices-visite/SPEC.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Historique aidant — exercices effectués

## Why

**Pain to solve.** « Mes dernières visites » montre aujourd’hui des check-ins avec le libellé « Exercices possibles » et un lien « Voir la transmission ». L’aidant veut l’**historique des exercices qu’il a réellement faits** (outcomes), pas les transmissions ni un signal d’exercices disponibles.

## Capabilities

- **CAP-1**
  - **intent:** L’aidant peut retrouver, dans « Mes dernières visites », les exercices qu’il a effectués (identification de l’exercice, outcome, moment, proche).
  - **success:** Chaque `ExerciseAttempt` du proche lié apparaît avec nom (et thème), outcome (Réussi / Essai / Échec), date/heure, proche — aucun item sans outcome.

- **CAP-2**
  - **intent:** La surface d’historique n’expose plus les transmissions ni le libellé « Exercices possibles ».
  - **success:** Zéro lien « Voir la transmission » et zéro occurrence de « Exercices possibles » sur `/aidant/visites`.

- **CAP-3**
  - **intent:** Une visite stoppée au check-in (fatigue/douleur) reste compréhensible sans simuler des exercices.
  - **success:** Entrée « Visite reportée — à bientôt » (ou équivalent) sans liste d’exercices inventés ni « Exercices possibles ».

## Constraints

- Une ligne d’exercice = un **outcome réel** (`ExerciseAttempt`) — jamais un `PatientExercise` courant non tenté.
- Pas de lien transmission sur cette surface (les transmissions non lues restent sur l’accueil).
- Périmètre : aidant, proches liés uniquement.
- Détail des champs / empty states : `historique-aidant-contenu.md`.

## Non-goals

- Refonte de l’accueil ou du parcours lecture de transmission.
- Historique pro / timeline (hors affinage déjà couvert ailleurs).
- Liste du catalogue ou des exercices activés « à faire ».
- Feedback post-visite dans cet écran.

## Success signal

Après une visite où Jean a fait deux exercices, « Mes dernières visites » liste ces deux résultats (noms + Réussi/Essai/Échec) ; plus de « Exercices possibles » ni de lien transmission sur cet écran.

## Assumptions

- Source principale = `ExerciseAttempt` (+ exercice/thème via `PatientExercise`) pour les proches de l’aidant, ordre chronologique décroissant.
- Le check-in fatigue/douleur peut rester en **contexte** (groupe visite ou ligne reportée) ; le contenu principal reste les exercices effectués.

## Open Questions

- Grouper les attempts par visite/check-in (nécessite `sessionRef` / CAP-4 multi-exercices) ou liste plate chronologique d’attempts ?
