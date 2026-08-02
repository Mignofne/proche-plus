# Contenu — Mes dernières visites (aidant)

Companion de `SPEC-historique-exercices-visite`.

## Structure : groupée par visite (décidé)

```text
[Bloc visite — plus récente]
  En-tête : date · proche · (fatigue/douleur si check-in)
  Corps   : liste des exercices effectués de cette session
            OU « Visite reportée — à bientôt » si blocked sans attempt

[Bloc visite — précédente]
  …
```

Pas de liste plate d’attempts hors bloc.

## Remplacer (brownfield)

Écran actuel `/aidant/visites` (`src/app/aidant/visites/page.tsx`) :

| Actuel | Cible |
|--------|--------|
| Liste de `VisitCheckIn` plate + « Exercices possibles » | **Blocs visite** avec attempts rattachés |
| Lien « Voir la transmission → » | **Supprimé** |
| Intro « check-ins fatigue et douleur… » | Intro orientée visites + exercices faits |

## En-tête de bloc visite

| Champ | Affichage |
|-------|-----------|
| Date/heure | Début de visite (`VisitCheckIn.createdAt` ou équivalent session) |
| Proche | Prénom (+ nom si utile) |
| Check-in | Fatigue · Douleur (libellés paliers) — si check-in présent |
| Statut | « Visite reportée — à bientôt » si `blocked` ; sinon rien ou compteur discret « N exercice(s) » |

## Lignes dans le bloc — exercices effectués

| Champ | Affichage |
|-------|-----------|
| Thème | Label thème |
| Exercice | Nom |
| Outcome | Réussi · Essai, avec difficulté · Échec |
| Note | Si présente, sous-ligne discrète |
| Heure | Optionnelle (si plusieurs dans la même visite) |

Ordre dans le bloc : chronologique (premier fait → dernier, ou l’inverse — rester cohérent ; défaut : ordre de réalisation croissant).

## Visite reportée (CAP-3)

Check-in `blocked` et **aucun** attempt rattaché :

- Afficher le bloc avec en-tête + « Visite reportée — à bientôt »
- Pas de lignes exercice, pas de transmission

## Rattachement données (requis pour CAP-4)

Chaque `ExerciseAttempt` doit porter un `sessionRef` (id du `VisitCheckIn` de la session, ou id `VisitSession` si introduit). Sans ce lien, le groupement est impossible de façon fiable.

À l’enregistrement d’outcome en mode visite : propager l’id de session depuis le check-in déjà fait (aujourd’hui le gate crée le check-in mais n’attache pas les attempts).

## Empty state

- Aucune visite (ni check-in, ni attempt) : « Pas encore de visite enregistrée » + CTA Mode visite.
- Ne pas parler de transmission dans l’empty state.
