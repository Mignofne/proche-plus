# Statuts de publication catalogue + provenance IA

Companion de `SPEC-checkin-visite-et-validation-exercices` (CAP-4, CAP-5).

## Enum cible `ExercisePublicationStatus`

| Statut | Rôle | Visible aidant | Visible pro (activation) | Éditable admin |
|--------|------|----------------|--------------------------|----------------|
| `brouillon` | Brouillon manuel / travail en cours | Non | Non | Oui |
| `a_valider` | Contenu en attente de validation humaine (typ. IA) | Non | Non | Oui |
| `publie` | Catalogue consommable | Oui (si activé patient) | Oui | Oui |
| `archive` | Retiré | Non | Non | Oui (lecture / restore éventuel hors scope) |

Transitions admin utiles :

```text
brouillon ──► a_valider   (optionnel ; ou direct → publie)
brouillon ──► publie      (création manuelle validée)
a_valider ──► publie      (« Valider & publier » — seul chemin IA attendu)
*         ──► archive
archive   ──► brouillon | a_valider   (hors scope sauf besoin brownfield)
```

## Provenance IA (label admin)

- Champ dédié sur `Exercise` (ex. `origin: catalog | ia` ou `isAiGenerated: boolean`).
- Badge / label **« IA »** visible en liste et fiche admin produit uniquement.
- Indépendant du statut : un exercice peut rester marqué IA après publication (traçabilité), mais le statut devient `publie`.

## Import CSV (`Referentiel_Exercices.csv`)

| Valeur colonne `Statut` (CSV) | Statut DB à la **création** | Provenance | `validatedBy` / `validatedAt` |
|------------------------------|-----------------------------|------------|-------------------------------|
| `Brouillon IA — à valider…` (et variantes) | `a_valider` | IA | **non renseignés** |
| `En revue` | `a_valider` (sauf décision contraire ultérieure) | selon contexte CSV | non |
| `Validé` | `publie` | selon CSV | import référentiel seulement si explicitement validé expert — hors lignes IA |
| `Non pertinent` | skip (comportement actuel) | — | — |

**Règle dure :** plus aucune création automatique en `publie` pour les lignes « Brouillon IA — à valider… ».

Comportement brownfield sur lignes déjà en base : ne pas écraser les éditions admin (conserve la règle « no overwrite » actuelle) ; documenter une éventuelle migration one-shot des exercices déjà importés à tort en `publie` comme **hors de cette spec** sauf décision produit.

## Admin produit — file « À valider »

- Filtre statut `a_valider` (+ filtre/badge provenance IA).
- Action primaire : **Valider & publier** → `status = publie`, `validatedBy` = identité admin (pas la string d’import), `validatedAt = now`.
- Compteur / badge sur la liste exercices si items `a_valider` > 0 (souhaitable, non bloquant si le filtre suffit au MVP de la file).

## Qui valide

- **Uniquement** `admin_produit` (fondateur).
- Pas de workflow pro clinique / APA dans l’app pour ce statut.
