# Workflow — VA Valider (publication catalogue)

## Goal

Passer une fiche de `brouillon` → `publie` **uniquement** avec confirmation explicite d'un professionnel (APA, ergo, ou pro rééducation).

## Steps

1. Identifier la fiche.
2. Exécuter une mini-relecture (bloquants sécurité / vocabulaire). S'il reste un bloquant → **stop**, proposer RL/MD.
3. Rappeler : publier au catalogue ≠ activer pour un patient (`PatientExercise`).
4. Demander confirmation explicite : « Je valide la publication de [nom] — [rôle] — [date] ».
5. Sur oui :
   - `status: publie`
   - `validated_by` / `validated_at`
   - mettre à jour le fichier draft
   - rappeler la saisie admin (`status=publie`, champs validated*) via EX si besoin
6. Sur non : rester `brouillon`, noter les réserves.
