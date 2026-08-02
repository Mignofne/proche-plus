# Session mode visite — proposer un autre exercice

Companion de `SPEC-multi-exercices-visite` (CAP-1, CAP-3, CAP-4 ; CAP-2 hors scope).

## Placement dans le parcours

```text
Entrée /aidant/mode-visite
  → (0 proche) empty state existant
  → (N>1, pas de patientId) ProchePicker → sélection
  → (1 proche OU patientId résolu) proche fixé
  → Check-in fatigue + douleur (SPEC-checkin… inchangé)
       ├─ blocked → stop bienveillant → sortie
       └─ OK → **Choix de thème**
              → Exercice courant du thème (existant)
              → Outcomes
              → **Post-outcome** (nouveau — seul ajout)
                   ├─ Faire un autre exercice → choix de thème
                   └─ Terminer la visite → clôture → accueil
```

Ce companion **remplace uniquement** la sortie auto « Visite terminée → accueil » après outcome. Pas de liste multi-exercices à l’entrée du thème.

## Post-outcome (fin d’exercice)

| Élément | Rôle |
|---------|------|
| Message court | Confirmation de l’outcome — **pas** « Visite terminée » |
| CTA primaire | « Faire un autre exercice » → retour **choix de thème** |
| Ghost | « Terminer la visite » |

Pas de redirection auto (`router.push("/aidant")`) sur succès d’outcome.

Si plus aucun thème avec exercice activé : masquer le CTA primaire ; ne garder que « Terminer la visite » (+ message calme).

## Clôture

- « Terminer la visite » → écran calme de confirmation → CTA accueil (feedback optionnel inchangé).
- Header back vers accueil = escape volontaire — ne pas l’utiliser comme sortie implicite après outcome.

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
- Post-outcome : « C’est noté — un autre exercice ? » — **pas** « Visite terminée » tant que la session est ouverte.
- Messages d’advance/fallback orientés « prochaine visite » : OK en sous-texte si besoin, mais le CTA principal reste « Faire un autre exercice » quand d’autres thèmes/exercices sont disponibles.
