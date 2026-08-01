# Workflow — CX Créer une fiche exercice

## Goal

Produire une fiche `brouillon` conforme au gabarit, calibrée thème × niveau A–E × palier.

## Steps

1. **Collecter** (ne pas tout re-demander si déjà dit) :
   - thème
   - niveau A–E (et GIR indicatif optionnel pour calibrer seulement)
   - palier (défaut 1)
   - intention / geste cible (1 phrase)
   - contraintes connues (douleur, fauteuil, lit…)

2. **Contrôle sécurité** — lire `references/regles-securite.md`. Si non pertinent ou dangereux pour le niveau → le dire et proposer une alternative ou `Non pertinent`.

3. **Rédiger** selon `references/gabarit-exercice.md` + `vocabulaire-aidant.md` :
   - 1 objectif
   - 3–6 étapes tutoiement
   - 2–4 « peut » / « ne doit pas »
   - durée + risques courts
   - transitions si l'utilisateur a le contexte matrice ; sinon placeholders clairs

4. **Auto-check** avant affichage :
   - [ ] Pas de « patient »
   - [ ] Tutoiement dans les étapes
   - [ ] Niveau E sans transfert
   - [ ] `crosses_autonomy_level` cohérent avec la transition « si réussi »
   - [ ] status = `brouillon`

5. **Présenter** la fiche complète. Demander : corriger / enchaîner MT (matrice) / EX (export admin) / VA (seulement si un pro confirme).

6. **Écrire** le fichier sous `{implementation_artifacts}/exercices/ex-{theme_slug}-{niveau}-p{palier}-{slug}.md` après accord (ou si l'utilisateur a dit « écris / go / enregistre »).
