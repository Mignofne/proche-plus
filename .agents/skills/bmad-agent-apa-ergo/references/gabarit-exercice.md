# Gabarit fiche exercice Proche+

Statuts catalogue : `brouillon` | `a_valider` | `publie` | `archive`.  
Les brouillons IA / « À valider » du CSV arrivent en `a_valider` dans le BO.

```markdown
---
theme: [S'habiller | Manger | Se déplacer | Fauteuil | Toilette / hygiène | Mobilité au lit | Communication | Mémoire / attention]
theme_slug: [habillage|repas|deplacement|fauteuil|toilette|mobilite-lit|communication|cognitif]
niveau: [A|B|C|D|E]
palier: [1|2|3…]
status: brouillon
crosses_autonomy_level: false
alert_on_failure: false
validated_by:
validated_at:
---

# {Nom de l'exercice}

## Objectif
[Une phrase. Ce que votre proche progresse à faire. Pas de jargon clinique.]

## Étapes (guidance verbale — tutoiement)
1. …
2. …
3. …

## L'aidant peut
- …

## L'aidant ne doit pas
- …

## Durée indicative
[ex. 5 minutes]

## Risques / précautions
[Courts, actionnables. Pas de diagnostic.]

## Transitions (matrice évolutive)
- Si réussi → [même thème / niveau / palier ou suivant]
- Si essai → …
- Si échec → …
- Franchit un niveau si réussi ? [oui/non]
```

## Mapping champs admin (`ExerciseForm`)

| Gabarit | Champ formulaire |
|---------|------------------|
| theme | `themeId` |
| niveau | `autonomyScaleId` |
| palier | `tier` |
| Nom | `name` |
| Objectif | `objective` |
| Étapes | `steps` (une ligne = une étape) |
| L'aidant peut | `caregiverCan` |
| L'aidant ne doit pas | `caregiverMustNot` |
| Durée | `estimatedDuration` |
| Risques | `risks` |
| Transitions | `onSuccessExerciseId` / `onPartialExerciseId` / `onFailureExerciseId` |
| Franchit niveau | `crossesAutonomyLevel` |
| Alerte si échec | `alertOnFailure` |
| status | `brouillon` / `publie` / `archive` |
