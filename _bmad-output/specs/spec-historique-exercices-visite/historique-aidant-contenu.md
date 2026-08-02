# Contenu — Mes dernières visites (aidant)

Companion de `SPEC-historique-exercices-visite`.

## Remplacer (brownfield)

Écran actuel `/aidant/visites` (`src/app/aidant/visites/page.tsx`) :

| Actuel | Cible |
|--------|--------|
| Liste de `VisitCheckIn` | Liste d’**exercices effectués** (+ lignes reportées check-in bloqué) |
| Libellé « Exercices possibles » si non bloqué | **Supprimé** |
| Lien « Voir la transmission → » | **Supprimé** |
| Intro « check-ins fatigue et douleur… » | Intro orientée exercices faits (ex. « Les exercices que vous avez faits avec votre proche ») |

## Ligne — exercice effectué

| Champ | Affichage |
|-------|-----------|
| Date/heure | `createdAt` de l’attempt |
| Proche | Prénom (+ nom si utile) |
| Thème | Label thème |
| Exercice | Nom |
| Outcome | Réussi · Essai, avec difficulté · Échec |
| Note | Si présente, sous-ligne discrète |

## Ligne — visite reportée (CAP-3)

Quand check-in `blocked` et **aucun** attempt lié à cette entrée :

- Date, proche
- Fatigue / douleur (libellés paliers existants)
- « Visite reportée — à bientôt »
- Pas de liste d’exercices, pas de transmission

## Empty state

- Aucun attempt **et** aucun check-in bloqué : « Pas encore d’exercice enregistré » + CTA Mode visite.
- Ne pas parler de transmission dans l’empty state.

## Hors surface (rappels)

- Transmission non lue : carte accueil (existant).
- Catalogue / exercices activés : Mode visite uniquement.
