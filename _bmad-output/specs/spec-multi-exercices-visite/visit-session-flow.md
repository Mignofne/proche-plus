# Session mode visite — multi-exercices

Companion de `SPEC-multi-exercices-visite` (CAP-1 … CAP-4).

## Placement dans le parcours

```text
Entrée /aidant/mode-visite
  → (0 proche) empty state existant
  → (N>1, pas de patientId) ProchePicker → sélection
  → (1 proche OU patientId résolu) proche fixé
  → Check-in fatigue + douleur (SPEC-checkin… inchangé)
       ├─ blocked → stop bienveillant → sortie
       └─ OK → **Choix de thème**
              → **Liste exercices du thème** (nouveau)
              → Détail exercice + outcomes
              → **Entre-deux** (nouveau)
                   ├─ Faire un autre exercice → liste (même thème, rafraîchie)
                   ├─ Changer de thème → sélecteur de thème
                   └─ Terminer la visite → écran clôture → accueil
```

Ce companion **remplace** le segment `thème → exercice → issue (flux actuel)` décrit dans `spec-checkin-visite-et-validation-exercices/checkin-visite.md` — le check-in lui-même ne change pas.

## Liste d’exercices (post-thème)

| Règle | Détail |
|-------|--------|
| Source | `PatientExercise` du proche, exercice `publie`, filtré par `themeId` |
| Ordre | Exercice courant (`isCurrent`) en premier, puis palier / nom |
| Ligne | Nom · durée indicative si dispo · badge « Proposé » si courant |
| Empty | Message « pas encore d’exercice pour ce thème » + retour choix thème (comportement existant) |
| Un seul item | Afficher la ligne + CTA démarrer (tap requis) |

## Écran entre-deux (post-outcome)

| Élément | Rôle |
|---------|------|
| Message court | Confirmation de l’outcome (microcopy adaptée ; éviter « visite terminée ») |
| CTA primaire | Faire un autre exercice → liste du thème courant |
| CTA secondaire | Changer de thème |
| Ghost | Terminer la visite |

Pas de redirection auto (`router.push("/aidant")`) sur succès d’outcome.

## Clôture

- « Terminer la visite » → écran calme type confirmation actuelle → CTA accueil (feedback optionnel inchangé).
- Header back vers accueil reste un escape volontaire (comportement existant) — ne pas l’utiliser comme sortie implicite après outcome.

## Traçabilité (CAP-4)

Minimum par outcome :

| Champ | Rôle |
|-------|------|
| patientExerciseId / exercise | Quel exercice |
| outcome | reussi / essai / echec |
| note | facultative |
| sessionRef | Lien au check-in de la session **ou** VisitSession — `[ASSUMPTION]` / open question schéma |
| createdAt | Horodatage |

Surfaces de relecture : détail « Mes dernières visites » (liste des exercices de la session) · timeline pro.

## Microcopy — contraintes

- Vouvoiement rassurant.
- Entre-deux : « C’est noté » / « Votre réponse aide l’équipe » — **pas** « Visite terminée » tant que la session est ouverte.
- Messages d’advance/fallback qui parlaient uniquement de « la prochaine visite » : reformuler si d’autres exercices restent disponibles dans la session.
