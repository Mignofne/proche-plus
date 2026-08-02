# Session mode visite — proposer un autre exercice

Companion de `SPEC-multi-exercices-visite` (CAP-1, CAP-3, CAP-4 ; CAP-2 hors scope).

## Placement dans le parcours

```text
Entrée /aidant/mode-visite
  → Check-in fatigue + douleur (inchangé)
       ├─ blocked → stop bienveillant → sortie
       └─ OK → **Choix de thème** (entrée)
              → Exercice courant du thème
              → Outcomes
              → **Post-outcome**
                   ├─ Continuer : {nom} → même thème, exercice courant (refresh)
                   ├─ Autre thème → liste inline → exercice du thème choisi
                   └─ Terminer la visite → clôture → accueil
```

## Post-outcome (fin d’exercice)

| Élément | Rôle |
|---------|------|
| Message court | « C’est noté — un autre exercice ? » — **pas** « Visite terminée » |
| CTA primaire | « Continuer : {nom} » si un exercice courant existe encore pour le **même** thème après `router.refresh()` |
| Secondaire | « Autre thème » → déploie les **autres** thèmes (même pattern boutons) sur cette page |
| Ghost | « Terminer la visite » |

Règles :

- Pas de redirection auto vers `/aidant`.
- Pas de retour forcé à l’écran thèmes complet quand un exercice même thème est proposé.
- Si plus d’exercice sur le thème courant mais d’autres thèmes prêts : afficher directement la liste des autres thèmes (primaire = premier choix via sélection thème).
- Si plus aucun thème/exercice : uniquement « Terminer la visite ».
- Ne jamais auto-ouvrir un exercice sans tap sur un CTA nommé ou une ligne thème.

## Clôture

- « Terminer la visite » → écran calme → CTA accueil.
- Header back = escape volontaire.

## Microcopy

- Vouvoiement rassurant.
- Primaire : verbe + nom d’exercice (« Continuer : Demi-tour… »).
- Éviter « Faire un autre exercice » générique qui renvoie à toute la liste de thèmes.
