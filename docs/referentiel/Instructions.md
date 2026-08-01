Proche+ — Référentiel exercices × niveau d'autonomie × thème



Objectif de ce document

Ce classeur sert de base de travail à compléter et valider avec un enseignant en activité physique adaptée (APA), en lien avec l'équipe de rééducation (dont ergo) pour les aspects médicaux. Le fichier `Referentiel_Exercices.csv` contient **50 exercices nommés** (thème × niveau A–E × palier), plus des lignes « Non pertinent » le cas échéant. Côté produit, l’admin `/admin-produit/exercices` permet de **lire, modifier, valider (publier) ou supprimer (archiver)** chaque fiche.



Comment l'utiliser

1. Ouvrir l'onglet 'Référentiel'.

2. Les colonnes 'Thème', 'Niveau autonomie' et 'Palier' identifient chaque fiche. Le palier 1 couvre la grille de base ; le palier 2 ajoute des progressions dans le même niveau.

3. Toute nouvelle ligne doit avoir un **nom unique** (anti-doublon à l'import).

4. La colonne 'Statut' pilote l'import : `En revue` / `Validé` → publié catalogue ; `À valider` / `Brouillon IA…` → brouillon côté DB (affiché « À valider » dans l'admin) ; `Non pertinent` → ignoré.

6. Si une combinaison Thème × Niveau n'a pas de sens cliniquement (ex: transfert autonome pour un patient alité), l'expert peut indiquer 'Non pertinent' en Statut plutôt que de forcer un contenu.

7. Toute ligne ajoutée doit respecter les mêmes colonnes pour rester exploitable par l'application.



Rappel des 5 niveaux d'autonomie (dérivés de la grille GIR, simplifiés pour l'usage aidant)

A — Autonome : Se déplace avec sécurité. L'aidant encourage et observe, n'intervient pas sauf demande.

B — Semi-autonome, aide technique, risque faible à modéré : L'aidant accompagne le geste, reste à proximité.

C — Semi-autonome, aide humaine à proximité, risque élevé : L'aidant supervise de près, guide verbalement, intervient si besoin.

D — Dépendant pour les transferts : L'aidant assiste activement selon la technique enseignée, jamais improviser.

E — Grabataire / alité : Gestes de confort et de stimulation uniquement, aucun transfert.



Rappel des 8 thèmes disponibles côté aidant

S'habiller — enfiler un vêtement, boutonner, mettre des chaussures

Manger — s'installer pour le repas, porter les couverts, boire

Se déplacer — marche accompagnée, passage d'un seuil, demi-tour

Fauteuil — transfert, propulsion, freins, changement de direction

Toilette / hygiène — se laver, s'asseoir/se relever de la douche

Mobilité au lit — se retourner, se redresser, changer de position assise

Communication — échanger, comprendre une consigne, s'exprimer

Mémoire / attention — petits exercices cognitifs légers liés au quotidien





Légende des couleurs dans l'onglet Référentiel

Cellule verte : Exemple déjà rédigé, à valider ou ajuster par l'expert

Cellule jaune : Cellule à compléter par l'expert



Règle de vocabulaire à respecter dans toutes les fiches

- On dit "votre proche", jamais "le patient" dans les objectifs et descriptions destinés à l'aidant.

- Les phrases de guidance verbale (ce que l'aidant dit à voix haute) sont au tutoiement ("tu"), jamais au "vous" — on s'adresse en famille, pas comme un soignant à un patient.



Nouvel onglet : Matrice évolutive

L'onglet 'Matrice évolutive' ajoute, pour chaque exercice, l'exercice suivant proposé selon le statut de la tentative de l'aidant : Réussi / Essai (difficulté) / Échec.

Le thème 'Fauteuil' est entièrement rédigé à titre d'exemple (du niveau E au niveau A), à valider par l'enseignant APA. Les autres thèmes sont préparés avec une ligne par niveau, prêts à compléter.

Colonne 'Franchit un niveau si réussi ?' : si Oui, l'exercice suivant ne doit jamais apparaître automatiquement à l'aidant tant que le professionnel n'a pas validé le changement de niveau.