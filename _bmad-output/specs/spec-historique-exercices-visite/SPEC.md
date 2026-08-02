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

**Pain to solve.** « Mes dernières visites » montre aujourd’hui des check-ins avec le libellé « Exercices possibles » et un lien « Voir la transmission ». L’aidant veut l’**historique des exercices qu’il a réellement faits** (outcomes), regroupés **par visite**, pas les transmissions ni un signal d’exercices disponibles.

## Capabilities

- **CAP-1**
  - **intent:** L’aidant peut retrouver, dans « Mes dernières visites », les exercices qu’il a effectués (identification de l’exercice, outcome, moment, proche).
  - **success:** Chaque `ExerciseAttempt` du proche lié apparaît avec nom (et thème), outcome (Réussi / Essai / Échec), et est rattaché à une visite — aucun item sans outcome.

- **CAP-2**
  - **intent:** La surface d’historique n’expose plus les transmissions ni le libellé « Exercices possibles ».
  - **success:** Zéro lien « Voir la transmission » et zéro occurrence de « Exercices possibles » sur `/aidant/visites`.

- **CAP-3**
  - **intent:** Une visite stoppée au check-in (fatigue/douleur) reste compréhensible sans simuler des exercices.
  - **success:** Bloc visite « Visite reportée — à bientôt » sans liste d’exercices inventés ni « Exercices possibles ».

- **CAP-4**
  - **intent:** L’aidant peut voir les exercices effectués **groupés par visite** (une séance = un bloc).
  - **success:** Chaque bloc visite affiche date/proche (+ check-in si utile) et, dessous, la liste ordonnée des outcomes de cette session ; deux exercices de la même visite apparaissent dans le même bloc.

## Constraints

- Une ligne d’exercice = un **outcome réel** (`ExerciseAttempt`) — jamais un `PatientExercise` courant non tenté.
- Organisation UI = **blocs visite**, pas liste plate d’attempts.
- Chaque attempt doit être rattaché à la visite (`sessionRef` = check-in id ou `VisitSession`) pour permettre le groupement.
- Pas de lien transmission sur cette surface (les transmissions non lues restent sur l’accueil).
- Périmètre : aidant, proches liés uniquement.
- Détail des champs / empty states : `historique-aidant-contenu.md`.

## Non-goals

- Refonte de l’accueil ou du parcours lecture de transmission.
- Historique pro / timeline (hors affinage déjà couvert ailleurs).
- Liste du catalogue ou des exercices activés « à faire ».
- Feedback post-visite dans cet écran.
- Liste plate chronologique d’attempts (choix écarté).

## Success signal

Après une visite où Jean a fait deux exercices, « Mes dernières visites » montre **un bloc visite** contenant ces deux résultats ; une autre visite = un autre bloc ; plus de « Exercices possibles » ni de lien transmission.

## Assumptions

- Source exercices = `ExerciseAttempt` (+ exercice/thème via `PatientExercise`) pour les proches de l’aidant.
- Check-in fatigue/douleur reste en **en-tête de bloc** visite ; le corps du bloc = exercices effectués (vide si reportée).
- Implémentation du `sessionRef` peut s’appuyer sur le check-in existant ou un `VisitSession` — détail schéma à trancher en dev/architecture, mais le rattachement est **requis**.
