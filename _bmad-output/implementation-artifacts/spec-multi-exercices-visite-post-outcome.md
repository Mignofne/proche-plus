---
title: 'Mode visite — proposer un autre exercice après outcome'
type: 'feature'
created: '2026-08-02'
status: 'in-progress'
baseline_commit: '0e85c04'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/specs/spec-multi-exercices-visite/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-multi-exercices-visite/visit-session-flow.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Après un outcome d’exercice, le mode visite affiche « Visite terminée » et force le retour à l’accueil — impossible d’enchaîner un second exercice dans la même visite.

**Approach:** Remplacer cette sortie auto par un écran post-outcome : CTA primaire « Faire un autre exercice » (retour au choix de thème) + ghost « Terminer la visite » (clôture calme puis accueil). Entrée thème → exercice courant inchangée.

## Boundaries & Constraints

**Always:**
- Un outcome ne redirige pas vers `/aidant`.
- « Faire un autre exercice » remet le choix de thème (pas d’auto-lancement d’un autre exercice).
- « Terminer la visite » est le seul CTA de clôture explicite sur cet écran.
- Un seul CTA primaire ; ghost pour terminer.
- Check-in / chargement thèmes / `submitExerciseOutcome` inchangés pour ce slice.

**Ask First:**
- Toucher le schéma Prisma / lier outcomes au check-in (CAP-4).

**Never:**
- Liste multi-exercices post-thème (CAP-2 hors scope).
- Plafond N exercices / visite.
- Refonte du mode legacy transmission.
- Sortie auto « Visite terminée » dès le premier outcome.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path enchaînement | Outcome OK + ≥1 thème | Post-outcome : primaire « Faire un autre exercice » → choix de thème ; ghost terminer | Erreur submit : rester sur exercice (comportement actuel) |
| Terminer | Tap « Terminer la visite » | Écran clôture calme → CTA accueil | N/A |
| Plus de thème | `themes.length === 0` après outcome | Masquer primaire ; garder « Terminer la visite » | N/A |
| Legacy mode | `mode === "legacy"` | Inchangé (hors scope) | N/A |

</frozen-after-approval>

## Code Map

- `src/app/aidant/mode-visite/ModeVisiteClient.tsx` — UI post-outcome `ExerciseModeVisite` (`done` → « Visite terminée »)
- `src/app/aidant/actions.ts` — `submitExerciseOutcome` (pas de redirect ; messages OK tels quels)
- `tests/e2e/aidant-happy-path.spec.ts` — happy path jusqu’au thème ; étendre post-outcome
- `_bmad-output/specs/spec-multi-exercices-visite/*` — contrat CAP-1/3

## Tasks & Acceptance

**Execution:**
- [x] `src/app/aidant/mode-visite/ModeVisiteClient.tsx` -- Remplacer l’écran « Visite terminée » auto par post-outcome (autre exercice / terminer) + écran clôture après « Terminer » -- cœur CAP-1/3
- [x] `tests/e2e/aidant-happy-path.spec.ts` -- Couvrir outcome → autre exercice → thèmes ; et terminer → accueil -- AC
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- Reporter CAP-4 (lien session/check-in ↔ outcomes) -- hors slice

**Acceptance Criteria:**
- Given un exercice en mode visite, when l’aidant enregistre un outcome, then il voit la confirmation sans redirection accueil, avec « Faire un autre exercice » et « Terminer la visite ».
- Given l’écran post-outcome, when il tape « Faire un autre exercice », then il revient au choix de thème (même session, pas de nouveau check-in forcé côté client).
- Given l’écran post-outcome, when il tape « Terminer la visite », then un écran de clôture calme propose le retour à l’accueil.
- Given aucun thème disponible, when outcome enregistré, then seul « Terminer la visite » est proposé.

## Spec Change Log

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: exit 0
- `npx playwright test tests/e2e/aidant-happy-path.spec.ts` -- expected: pass (si env e2e dispo)

**Manual checks (if no CLI):**
- Mode visite démo : outcome → pas d’accueil forcé → autre exercice → thème → 2ᵉ exercice → Terminer → accueil
