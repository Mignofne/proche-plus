# Check-in fatigue / douleur — mode visite

Companion de `SPEC-checkin-visite-et-validation-exercices` (CAP-1, CAP-2, CAP-3).

## Placement dans le parcours

```text
Entrée /aidant/mode-visite
  → (0 proche) empty state existant
  → (N>1, pas de patientId) ProchePicker → sélection
  → (1 proche OU patientId résolu) proche fixé
  → **NOUVEAU : Check-in fatigue + douleur**   ← obligatoire
       ├─ scores OK (tous ≤ 5) → choix de thème → exercice → issue (flux actuel)
       └─ fatigue ≥ 6 OU douleur ≥ 6 → écran stop bienveillant → sortie
```

Règle : si un seul proche, présélection automatique **puis** check-in (pas de skip du check-in).

Fréquence : **chaque** entrée mode visite, même jour, même proche.

## Échelle (paliers)

Échelle conceptuelle 0–10, saisie par **paliers discrets** (boutons pleine largeur, pattern existant outcomes/autonomie).

| Valeur | Intention (libellés provisoires — à confirmer) |
|--------|--------------------------------------------------|
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
| Aidant | Historique des dernières visites | Date, proche, fatigue, douleur, poursuivi / reporté « à bientôt » |
| Pro | Timeline patient | Événement check-in (+ blocked) |
| Pro / système | Log / audit | Entrée de log consultable |

## Microcopy — contraintes

- Tutoiement / vouvoiement : suivre le ton aidant existant (vouvoiement rassurant).
- Pas de termes type « contre-indication », « EVA », « score clinique ».
- Stop = protection, pas échec de l’aidant.
