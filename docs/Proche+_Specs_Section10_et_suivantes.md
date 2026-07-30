# Proche+ — Spécifications complémentaires (à partir de la section 10)

_Suite du document de spécifications fonctionnelles et d'architecture. Les sections 1 à 9 (acteurs, blocs fonctionnels du MVP, modèle de données socle, spécifications Gherkin des features 1 à 8, architecture technique, delta produit, métriques, prochaine étape, identité de marque) sont déjà développées et ne sont pas reprises ici._

## 10. Matrice de correspondance : profil patient (GIR) × thème × exercice

### 10.1 Principe

L'aidant choisit un **thème** (ce qu'il a envie/besoin de travailler pendant sa visite). L'application lui propose alors **l'exercice adapté au niveau d'autonomie du patient**, tel que validé par le professionnel — jamais un exercice générique déconnecté du profil réel du patient.

```
Aidant sélectionne un THÈME
          │
          ▼
Application croise le THÈME avec le NIVEAU D'AUTONOMIE (GIR) du patient
          │
          ▼
Un seul EXERCICE (ou une liste courte) s'affiche, avec :
   🎯 Objectif de l'exercice
   📋 Détail de l'exercice (étapes + guidance verbale)
   🟢 Ce que l'aidant peut faire
   🔴 Ce qu'il ne doit pas faire
```

**Règle de gouvernance :** un exercice n'est visible par l'aidant que s'il a été validé (ou activé) par le professionnel pour ce patient précis. Le thème/niveau détermine la bibliothèque de contenu proposée, mais le professionnel garde la main sur ce qui est réellement activé — cohérent avec le principe déjà posé en section 4 ("Personnalisation par patient").

**Expert de référence pour construire ce contenu :** la nature même des exercices (mouvement, effort adapté, sécurité du geste) relève avant tout de l'expertise d'un **enseignant en activité physique adaptée (APA)**, dont le métier est justement de concevoir des exercices physiques individualisés selon le niveau d'autonomie et les contre-indications de chacun. C'est donc lui (ou elle) qui doit rédiger et valider le contenu de la matrice ci-dessous, en lien avec l'équipe de rééducation pour les aspects médicaux (contre-indications, précautions).

### 10.2 Thèmes disponibles (choix de l'aidant)

| Thème | Exemples de gestes couverts |
|---|---|
| 🧥 S'habiller | Enfiler un vêtement, boutonner, mettre des chaussures |
| 🍽️ Manger | S'installer pour le repas, porter les couverts, boire |
| 🚶 Se déplacer | Marche accompagnée, passage d'un seuil, demi-tour |
| ♿ Fauteuil | Transfert, propulsion, freins, changement de direction |
| 🚿 Toilette / hygiène | Se laver les mains/le visage, s'asseoir/se relever de la douche |
| 🛏️ Mobilité au lit | Se retourner, se redresser, changer de position assise |
| 🗣️ Communication | Échanger, comprendre une consigne, s'exprimer |
| 🧠 Mémoire / attention | Petits exercices cognitifs légers en lien avec le quotidien |

### 10.3 Niveaux d'autonomie (profil patient)

Ces niveaux reprennent la logique de la grille d'évaluation de l'autonomie déjà utilisée par les équipes soignantes (cf. section 1.1), simplifiée pour l'usage aidant :

| Niveau | Libellé produit | Posture de l'aidant attendue |
|---|---|---|
| A | Autonome | Encourager, observer, ne pas intervenir sauf demande |
| B | Semi-autonome, aide technique, risque faible à modéré | Accompagner le geste, rester à proximité |
| C | Semi-autonome, aide humaine à proximité, risque élevé | Superviser de près, guider verbalement, intervenir si besoin |
| D | Dépendant pour les transferts | Assister activement selon la technique enseignée, jamais improviser |
| E | Grabataire / alité | Gestes de confort et de stimulation uniquement, aucun transfert |

### 10.4 Gabarit ("template") d'un exercice

Chaque exercice de la bibliothèque suit strictement ce gabarit, quel que soit le thème :

```
Thème:                 [ex: Fauteuil]
Niveau d'autonomie:    [ex: C — semi-autonome, aide humaine à proximité]
Nom de l'exercice:     [ex: "Faire un demi-tour en fauteuil"]

🎯 Objectif de l'exercice:
   [Ce que le patient doit progresser à faire — une phrase, un seul objectif]

📋 Détail de l'exercice (étapes / guidance verbale):
   1. [Consigne courte, un seul verbe d'action]
   2. [Consigne courte]
   3. [Consigne courte]

🟢 Ce que l'aidant peut faire:
   - [action encouragée]

🔴 Ce que l'aidant ne doit pas faire:
   - [action à proscrire]

⏱️ Durée indicative:       [ex: 5 minutes]
✅ Validé par:              [nom de l'enseignant APA / professionnel, date]
```

### 10.5 Exemples concrets remplis

**Thème : Fauteuil — Niveau C (aide humaine à proximité, risque élevé)**

```
Nom: Faire un demi-tour en fauteuil

🎯 Objectif: Que le patient réalise seul un changement de direction en sécurité.

📋 Détail:
   1. "Regardez où vous voulez aller."
   2. "Bloquez la roue droite avec votre main droite."
   3. "Poussez uniquement sur la roue gauche."
   4. "Vérifiez que le passage est libre avant de continuer."

🟢 L'aidant peut: rester à côté, rappeler la consigne si le patient hésite.
🔴 L'aidant ne doit pas: pousser le fauteuil à la place du patient.

⏱️ Durée indicative: 5 minutes
```

**Thème : S'habiller — Niveau B (aide technique, risque faible à modéré)**

```
Nom: Enfiler son gilet en position assise

🎯 Objectif: Que le patient enfile seul son gilet en gérant son équilibre assis.

📋 Détail:
   1. "Posez le gilet sur vos genoux, l'intérieur vers vous."
   2. "Passez d'abord le bras du côté le plus difficile."
   3. "Prenez votre temps pour ramener l'autre pan derrière vous."

🟢 L'aidant peut: présenter le vêtement dans le bon sens, encourager verbalement.
🔴 L'aidant ne doit pas: habiller le patient à sa place par souci de rapidité.

⏱️ Durée indicative: 3 minutes
```

**Thème : Manger — Niveau D (dépendant pour les transferts, mais geste du repas conservé)**

```
Nom: Porter la cuillère seul avec appui du poignet

🎯 Objectif: Que le patient conserve le geste du repas malgré une dépendance pour les déplacements.

📋 Détail:
   1. "Installez-vous bien en face de l'assiette."
   2. "Prenez la cuillère, je reste juste à côté."
   3. "Prenez votre temps, il n'y a pas d'urgence."

🟢 L'aidant peut: stabiliser le plat si besoin, encourager, ne pas presser le rythme.
🔴 L'aidant ne doit pas: faire manger le patient systématiquement à sa place.

⏱️ Durée indicative: durée du repas
```

### 10.6 Ajout au modèle de données (section 3)

```
Exercise
 ├── theme (habillage | repas | deplacement | fauteuil | toilette | mobilite_lit | communication | cognitif)
 ├── autonomy_level (A | B | C | D | E)
 ├── name
 ├── objective
 ├── steps[] (consignes courtes, ordonnées)
 ├── caregiver_can[] 
 ├── caregiver_must_not[]
 ├── estimated_duration
 └── validated_by (Professional, date)

PatientExercise
 ├── Patient
 ├── Exercise
 ├── status (proposé | actif | en_cours | acquis)
 └── activated_by (Professional)
```

`Exercise` constitue la bibliothèque générique (catalogue de contenu, gérable par un administrateur de contenu ou l'équipe Proche+). `PatientExercise` est la table qui rend un exercice réellement visible pour un patient donné, une fois activé par le professionnel — ce qui garantit qu'aucun exercice non validé ne peut apparaître pour un patient au mauvais niveau.

### 10.7 Scénario Gherkin associé

```gherkin
Fonctionnalité: Sélection d'un thème par l'aidant et exercice adapté au profil du patient
  En tant qu'aidant
  Je veux choisir un thème que j'ai envie de travailler pendant ma visite
  Afin de recevoir un exercice adapté au niveau réel de mon proche, jamais générique

  Scénario: Affichage d'un exercice adapté au niveau d'autonomie
    Étant donné que le patient a un niveau d'autonomie "C — aide humaine à proximité"
    Et que le professionnel a activé l'exercice "Faire un demi-tour en fauteuil" pour ce patient
    Quand l'aidant sélectionne le thème "Fauteuil" dans le mode visite
    Alors l'application affiche cet exercice avec son objectif, son détail en étapes, et les consignes "peut faire" / "ne doit pas faire"

  Scénario: Aucun exercice activé pour un thème
    Étant donné qu'aucun exercice du thème "Toilette / hygiène" n'a été activé par le professionnel pour ce patient
    Quand l'aidant sélectionne ce thème
    Alors l'application affiche un message invitant à en parler avec l'équipe lors de la prochaine visite, plutôt qu'un exercice non validé

  Scénario: Un exercice non adapté au niveau du patient n'est jamais montré
    Étant donné que le patient a un niveau d'autonomie "E — alité"
    Quand l'aidant consulte le thème "Fauteuil"
    Alors aucun exercice de transfert ou de propulsion n'est proposé
    Et seuls des exercices de confort et de stimulation compatibles avec ce niveau sont affichés
```

---

## 11. Matrice évolutive : adaptation selon le statut (réussi / essai / échec)

### 11.1 Principe

Chaque exercice n'est plus une fiche isolée : il fait partie d'un **parcours**. Après une tentative, l'aidant indique simplement comment ça s'est passé, et l'exercice suivant proposé s'adapte automatiquement :

```
Aidant tente l'exercice
         │
         ▼
   Statut renseigné
   ┌─────┼─────┐
   ▼     ▼     ▼
RÉUSSI  ESSAI  ÉCHEC
   │     │     │
   ▼     ▼     ▼
Exercice  On répète   Exercice plus
suivant   le même     facile (repli)
(palier   exercice    automatique
supérieur)
```

**Règle de sécurité (rappel du principe déjà posé en section 10.1) :** descendre en difficulté est toujours automatique et sans risque. **Monter en difficulté au point de changer de niveau d'autonomie ne l'est jamais** : ça déclenche une alerte au professionnel pour validation, avant que le nouvel exercice n'apparaisse à l'aidant. Progresser à l'intérieur d'un même niveau (d'un palier à l'autre) peut en revanche être automatique, si le professionnel a validé à l'avance l'ensemble du parcours pour ce thème et ce niveau.

### 11.2 Ajout au modèle de données (complète la section 10.6)

```
Exercise
 ├── theme_id
 ├── autonomy_level_id
 ├── tier                        (palier, ex: 1, 2, 3 au sein d'un même thème/niveau)
 ├── name / objective / steps[] / caregiver_can[] / caregiver_must_not[] / duration / risks
 ├── on_success_exercise_id      (exercice suivant si réussi)
 ├── on_partial_exercise_id      (exercice proposé si essai/difficulté — souvent lui-même)
 ├── on_failure_exercise_id      (exercice de repli si échec)
 ├── crosses_autonomy_level      (bool — vrai si on_success_exercise_id change de niveau)
 └── status (brouillon | publié | archivé)

PatientExercise
 ├── patient_id / exercise_id
 ├── current_status (proposé | en_cours | reussi | essai | echec)
 ├── history[]                   (chronologie des statuts successifs)
 └── activated_by (professionnel, date)
```

Si `crosses_autonomy_level = vrai` et que le statut passe à "réussi", l'exercice suivant n'est **pas** automatiquement ajouté à `PatientExercise` : une alerte "objectif atteint, changement de niveau proposé" est créée pour le professionnel, qui active (ou non) la suite.

### 11.3 Exemple de matrice évolutive pré-remplie — Thème "Fauteuil" (du niveau E à A)

| Niveau | Palier | Exercice | 🟢 Si réussi → | 🟠 Si essai/difficulté → | 🔴 Si échec → | Franchit un niveau ? |
|---|---|---|---|---|---|---|
| E — Alité | 1 | Mobilisation passive des membres en fauteuil roulant, aidé | → D / palier 1 | Répéter E / palier 1 | Alerter le professionnel (pas de palier plus bas) | Oui (E→D) |
| D — Dépendant transferts | 1 | Participer au transfert avec assistance complète | → D / palier 2 | Répéter D / palier 1 | → E / palier 1 (repli confort) | Non |
| D — Dépendant transferts | 2 | Initier le mouvement de transfert avant l'aide | → C / palier 1 | Répéter D / palier 2 | → D / palier 1 | Oui (D→C) |
| C — Aide humaine à proximité | 1 | Faire un demi-tour en fauteuil *(exemple déjà rédigé, section 10.5)* | → C / palier 2 | Répéter C / palier 1 | → D / palier 2 | Non |
| C — Aide humaine à proximité | 2 | Franchir un léger seuil de porte avec supervision | → B / palier 1 | Répéter C / palier 2 | → C / palier 1 | Oui (C→B) |
| B — Aide technique, risque modéré | 1 | Propulsion autonome sur trajet court, aidant à distance | → B / palier 2 | Répéter B / palier 1 | → C / palier 2 | Non |
| B — Aide technique, risque modéré | 2 | Trajet plus long avec changement de direction autonome | → A / palier 1 | Répéter B / palier 2 | → B / palier 1 | Oui (B→A) |
| A — Autonome | 1 | Déplacement autonome en fauteuil, aidant en simple observation | Objectif maintenu, pas de palier supérieur | Répéter A / palier 1 | → B / palier 2 **+ alerte au professionnel** (possible régression à surveiller) | Non (mais alerte si échec) |

**Point d'architecture important :** un échec au niveau A (le plus autonome) ne descend pas silencieusement — il déclenche une alerte, car une perte de capacité chez un patient déjà autonome est un signal médical potentiellement important, pas un simple ajustement pédagogique.

### 11.4 Gabarit pour compléter les autres thèmes

La même structure de colonnes (Niveau / Palier / Exercice / Si réussi / Si essai / Si échec / Franchit un niveau) doit être complétée pour les 7 autres thèmes (S'habiller, Manger, Se déplacer, Toilette / hygiène, Mobilité au lit, Communication, Mémoire / attention), avec l'enseignant en activité physique adaptée. Le fichier Excel joint reprend cette structure prête à compléter, avec l'exemple "Fauteuil" entièrement pré-rempli comme modèle.

### 11.5 Scénarios Gherkin

```gherkin
Fonctionnalité: Adaptation automatique de l'exercice proposé selon le statut
  En tant qu'aidant
  Je veux que l'exercice suivant proposé s'adapte à la façon dont s'est passée ma dernière tentative
  Afin de progresser à un rythme adapté sans avoir besoin de redemander à chaque fois

  Scénario: Statut "réussi" sans changement de niveau
    Étant donné que l'exercice "Faire un demi-tour en fauteuil" (niveau C, palier 1) ne change pas de niveau en cas de réussite
    Et que le professionnel a validé à l'avance l'ensemble du parcours du thème "Fauteuil" au niveau C pour ce patient
    Quand l'aidant indique le statut "Réussi"
    Alors l'exercice "Franchir un léger seuil de porte avec supervision" (niveau C, palier 2) est automatiquement proposé à la prochaine visite

  Scénario: Statut "réussi" qui franchit un niveau
    Étant donné que l'exercice en cours change de niveau d'autonomie en cas de réussite
    Quand l'aidant indique le statut "Réussi"
    Alors l'exercice suivant n'apparaît pas automatiquement côté aidant
    Et une alerte "Objectif atteint — changement de niveau à valider" est créée pour le professionnel
    Et l'exercice suivant n'apparaît à l'aidant qu'après validation explicite du professionnel

  Scénario: Statut "essai" (difficulté rencontrée)
    Quand l'aidant indique le statut "Essai, avec difficulté"
    Alors le même exercice reste proposé à la visite suivante
    Et l'aidant est invité à indiquer ce qui a été difficile (cf. section Feedback)

  Scénario: Statut "échec" avec repli existant
    Étant donné qu'un exercice de repli est défini pour l'exercice en échec
    Quand l'aidant indique le statut "Échec"
    Alors l'exercice de repli est automatiquement proposé, sans validation professionnelle supplémentaire

  Scénario: Statut "échec" au palier le plus bas déjà atteint
    Étant donné qu'aucun exercice de repli n'existe en dessous du palier actuel
    Quand l'aidant indique le statut "Échec"
    Alors aucune régression automatique n'est proposée
    Et une alerte est créée pour le professionnel afin de réévaluer la situation

  Scénario: Échec au niveau le plus autonome (signal de régression)
    Étant donné que le patient est au niveau "A — Autonome"
    Quand l'aidant indique le statut "Échec" sur l'exercice de ce niveau
    Alors l'exercice de repli du niveau inférieur est proposé
    Et une alerte spécifique "Possible régression à surveiller" est envoyée au professionnel
```

---

## 12. Back-office fondateurs : gestion des thèmes, niveaux et exercices

### 12.1 Objectif

Les thèmes, niveaux d'autonomie et exercices ne doivent pas être codés en dur dans l'application : ils doivent être administrables par les fondateurs (ou une personne qu'ils désignent), sans nouveau développement, pour pouvoir faire évoluer le contenu au fil des retours terrain et des experts consultés (enseignant APA, équipes de rééducation).

### 12.2 Ajout au modèle de données

```
Theme
 ├── id
 ├── label                  (ex: "Fauteuil")
 ├── icon
 ├── display_order
 └── active (bool)          (masqué côté aidant si inactif, sans supprimer l'historique)

AutonomyLevel
 ├── id
 ├── code                   (ex: "C")
 ├── label                  (ex: "Semi-autonome, aide humaine à proximité")
 ├── display_order
 └── active (bool)

Exercise (cf. section 11.2)
 ├── theme_id (FK Theme)
 ├── autonomy_level_id (FK AutonomyLevel)
 ├── ...
 ├── status (brouillon | publié | archivé)
 ├── version
 ├── created_by / updated_by / updated_at
```

### 12.3 Fonctionnalités du back-office fondateurs

| Fonction | Description |
|---|---|
| Gérer les thèmes | Ajouter, renommer, réordonner, activer/désactiver un thème |
| Gérer les niveaux d'autonomie | Ajouter, renommer, réordonner, activer/désactiver un niveau |
| Créer un exercice | Formulaire reprenant le gabarit complet (section 10.4) + les règles de transition (section 11.2) |
| Modifier un exercice | Édition avec conservation de l'historique des versions (un patient déjà engagé sur une ancienne version continue avec la version qu'il a commencée, sauf décision contraire du professionnel) |
| Dupliquer un exercice | Créer un nouveau palier à partir d'un exercice existant, pour accélérer la construction de parcours |
| Publier / dépublier un exercice | Un exercice en "brouillon" n'est jamais visible par les professionnels ni les aidants, même indirectement via une règle de transition |
| Supprimer un exercice | Suppression douce (archivage) : impossible si l'exercice est encore une cible de transition active dans le parcours d'un autre exercice publié, sans d'abord corriger cette transition |
| Prévisualiser | Voir le rendu exact tel qu'affiché côté aidant, avant publication |
| Historique / audit | Voir qui a créé, modifié, publié ou archivé chaque élément, et quand |

### 12.4 Scénarios Gherkin

```gherkin
Fonctionnalité: Gestion des thèmes, niveaux et exercices par les fondateurs
  En tant que fondateur (ou administrateur de contenu désigné)
  Je veux ajouter, modifier ou supprimer des thèmes, niveaux et exercices
  Afin de faire évoluer le contenu de Proche+ sans dépendre d'un nouveau développement

  Scénario: Ajouter un nouveau thème
    Étant donné que je suis connecté au back-office fondateurs
    Quand je crée un thème "Sorties extérieures" avec une icône et un ordre d'affichage
    Alors ce thème apparaît immédiatement dans la liste des thèmes disponibles pour créer des exercices
    Et il n'apparaît côté aidant que lorsqu'au moins un exercice publié lui est rattaché

  Scénario: Désactiver un thème sans perdre l'historique
    Étant donné qu'un thème est utilisé par des patients en cours de suivi
    Quand je désactive ce thème
    Alors il n'apparaît plus dans les nouveaux choix proposés à l'aidant
    Mais l'historique des exercices déjà réalisés dans ce thème reste consultable dans le back-office professionnel

  Scénario: Créer un exercice avec ses règles de transition
    Étant donné que je crée un nouvel exercice pour le thème "Fauteuil" et le niveau "C"
    Quand je renseigne le gabarit complet (objectif, étapes, ce qu'il faut/ne faut pas faire, durée, risques)
    Et que je sélectionne l'exercice proposé en cas de réussite, d'essai et d'échec
    Et que la case "franchit un niveau d'autonomie" est cochée automatiquement si l'exercice de réussite appartient à un autre niveau
    Alors l'exercice est enregistré en statut "Brouillon" tant que je ne l'ai pas publié

  Scénario: Empêcher la suppression d'un exercice encore référencé
    Étant donné qu'un exercice publié est désigné comme "exercice de réussite" par un autre exercice publié
    Quand je tente de le supprimer
    Alors le système m'empêche la suppression et m'indique quel(s) exercice(s) le référencent
    Et me propose de corriger d'abord ces références ou d'archiver l'ensemble du parcours concerné

  Scénario: Modifier un exercice déjà en cours d'utilisation
    Étant donné qu'un exercice publié est actuellement suivi par plusieurs patients
    Quand je modifie son contenu et que je publie une nouvelle version
    Alors les patients ayant déjà commencé l'ancienne version continuent avec celle-ci
    Et seuls les nouveaux patients activés après la publication reçoivent la nouvelle version

  Scénario: Prévisualiser avant publication
    Étant donné que je viens de créer ou modifier un exercice
    Quand je clique sur "Prévisualiser"
    Alors je vois exactement le rendu tel qu'il apparaîtra côté aidant, avant de le publier

  Scénario: Consulter l'historique des modifications
    Étant donné que je consulte la fiche d'un thème, d'un niveau ou d'un exercice
    Quand j'ouvre l'onglet "Historique"
    Alors je vois qui a créé, modifié, publié ou archivé cet élément, et à quelle date
```
