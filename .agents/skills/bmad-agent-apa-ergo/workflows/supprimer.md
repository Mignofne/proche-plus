# Workflow — SU Supprimer / Archiver

## Goal

Retirer une fiche du catalogue actif sans casser les activations patients ni les transitions.

## Steps

1. Identifier la fiche et son `status`.
2. Vérifier (demander si inconnu) :
   - déjà activée pour des patients ?
   - référencée en onSuccess / onPartial / onFailure ?
3. **Défaut :** `archive` (soft delete) plutôt que suppression dure.
4. Hard delete seulement si `brouillon` jamais publié **et** confirmation explicite « supprimer définitivement ».
5. Si des transitions pointent vers elle : lister les fiches à rebrancher (MD / MT).
6. Mettre à jour le fichier / indiquer l'action admin (`status=archive` ou delete).
7. Confirmer le résultat à l'utilisateur.
