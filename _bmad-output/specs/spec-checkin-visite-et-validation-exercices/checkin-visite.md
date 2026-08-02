# Check-in fatigue / douleur — mode visite

Companion de `SPEC-checkin-visite-et-validation-exercices` (CAP-1, CAP-2, CAP-3).

## Placement dans le parcours

```text
Entrée /aidant/mode-visite
  → (0 proche) empty state existant
  → (N>1, pas de patientId) ProchePicker → sélection
  → (1 proche OU patientId résolu) proche fixé
  → **NOUVEAU : Check-in fatigue + douleur**   ← obligatoire
       ├─ scores OK (tous ≤ 5) → choix de thème → exercice courant → outcome
       │     → proposer un autre exercice ou terminer (`spec-multi-exercices-visite/`)
       └─ fatigue ≥ 6 OU douleur ≥ 6 → écran stop bienveillant → sortie
```

Règle : si un seul proche, présélection automatique **puis** check-in (pas de skip du check-in).

Fréquence : **chaque** entrée mode visite, même jour, même proche.

## Échelle (paliers) — confirmée

Échelle 0–10, saisie par **paliers discrets** (boutons pleine largeur, pattern existant outcomes/autonomie).

| Valeur | Libellé |
|--------|---------|
| 0 | Aucune |
| 2 | Légère |
| 4 | Modérée |
| 6 | Importante |
| 8 | Très importante |
| 10 | Maximale |

- Deux questions séparées : **Fatigue** du proche, **Douleur** du proche.
- Les deux réponses sont obligatoires pour continuer.
- Seuil stop : `fatigue ≥ 6` **OU** `douleur ≥ 6` (équivalent « > 5 » sur 0–10).

## Écran stop (blocage hard)

- Aucun accès thèmes / exercices pour cette session.
- Pas de bouton « Continuer quand même ».
- CTA principal : retour accueil aidant (ou équivalent sortie visite).
- Message cible (intention) : bienveillant, « à bientôt pour la prochaine visite » — le proche a besoin de repos ; les exercices attendront.
- Le check-in est quand même **persisté** (visite stoppée pour raison fatigue/douleur).

## Données à tracer (minimum)

Par entrée check-in :

| Champ | Rôle |
|-------|------|
| `patientId` / proche | Qui |
| `caregiverId` | Qui déclare |
| `fatigueScore` | 0–10 palier |
| `painScore` | 0–10 palier |
| `blocked` | true si seuil atteint |
| `createdAt` | Horodatage |

Optionnel post-check-in si non bloqué : lier plus tard à l’outcome d’exercice de la même visite si le modèle le permet ; non requis pour le stop.

## Surfaces de relecture

| Acteur | Surface | Contenu |
|--------|---------|---------|
| Aidant | **Mes dernières visites** (écran dédié) | Exercices effectués (outcomes) + check-in reporté si bloqué — **pas** de lien transmission ni « Exercices possibles » (voir `spec-historique-exercices-visite/`) |
| Pro | Timeline patient | Événement check-in (+ blocked) |
| Pro / système | Log / audit | Entrée de log consultable |

## Accueil aidant — emplacement UX (CAP-6)

Objectif : historique **dès connexion**, sans concurrencer Mode visite, et **sans** laisser « Dernière transmission » collée à l’accueil une fois lue.

### Hiérarchie cible de l’accueil

1. Salut + proche (existant)
2. Alertes / revue autonomie (si dues) — inchangé
3. **Carte transmission non lue uniquement** (« Nouveau message ») — si `readAt` null
4. Carte « Mes proches » — inchangé
5. **CTA principal** : Mode visite
6. **CTA secondaire persistant** : Mes dernières visites ← **nouveau**
7. Ghost : J’ai une question · Donner mon retour · Bibliothèque
8. **Retirer** le bouton permanent « Dernière transmission »

### Pourquoi ici

- Aligné EXPERIENCE : une intention du jour (Mode visite) + signal non lu si besoin — pas deux CTA « contenus » au même poids.
- « Dernière transmission » toujours visible après lecture = bruit ; la lecture se fait via la carte non lue (relecture hors « Mes dernières visites »).
- « Mes dernières visites » juste sous Mode visite = même zone d’actions, tap large, découvrable sans scroll profond ni onglet caché.

### Écran « Mes dernières visites »

- Route dédiée (ex. `/aidant/visites`), accessible dès post-onboarding.
- Liste chronologique récente (pas un dashboard) : une ligne = une entrée mode visite.
- Empty state : « Pas encore de visite enregistrée » + CTA Mode visite.
- Contenu des lignes : exercices effectués (outcomes) ; visite reportée si check-in bloqué — voir `spec-historique-exercices-visite/` (pas de lien transmission).

## Microcopy — contraintes

- Vouvoiement rassurant (ton aidant existant).
- Pas de termes type « contre-indication », « EVA », « score clinique ».
- Stop = protection, pas échec de l’aidant.
