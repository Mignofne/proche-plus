# Workflow — MT Matrice évolutive d'un thème

## Goal

Couvrir un thème du niveau E → A avec paliers et transitions Réussi / Essai / Échec (specs §11).

## Steps

1. Demander le **thème** (et s'il faut partir de Fauteuil comme modèle).
2. Pour chaque niveau E→A, proposer **1–2 paliers** réalistes. Marquer `Non pertinent` plutôt que forcer.
3. Tableau obligatoire :

| Niveau | Palier | Exercice (nom) | Si réussi → | Si essai → | Si échec → | Franchit un niveau ? |
|--------|--------|----------------|-------------|------------|------------|----------------------|

4. Règles :
   - Descente = OK auto
   - `Franchit un niveau ? = Oui` ⇒ alerte pro, jamais auto côté aidant
   - Échec en A ⇒ alerte pro (`alert_on_failure`)

5. Lister les fiches manquantes à rédiger via CX (priorité : paliers sans fiche).
6. Écrire `matrice-{theme_slug}.md` sous `{implementation_artifacts}/exercices/` après accord.
7. Proposer CX sur le premier trou de la matrice.
