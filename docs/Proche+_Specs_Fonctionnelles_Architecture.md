# Proche+ 🧸 — Spécifications fonctionnelles & Architecture produit

**SaaS — Établissements de rééducation / familles-aidants / patients**
**Mobile first — Mascotte : ours brun en peluche**

---

## 0. Cadrage produit (synthèse des découvertes)

> **Proche+ n'est pas un logiciel de soin et ne remplace pas le dossier existant de l'établissement. C'est une couche de continuité éducative entre le professionnel de rééducation et l'aidant familial, activée pendant les visites.**

Le problème identifié n'est pas la transmission professionnel → aidant en tant que telle, mais l'**absence de boucle structurée** entre la réadaptation en établissement et les visites familiales. Le produit doit transformer la visite en **temps actif et sécurisé de réadaptation**, sans transformer le proche en soignant.

**Guidance verbale** — technique d’accompagnement de la mobilité au cœur du Mode visite : guider la personne aidée **par la parole** pour préserver son autonomie et éviter tout portage délétère.

| Principes / objectifs | Modalités |
|---|---|
| **Maintien de l’autonomie** — stimuler les capacités restantes plutôt que faire à la place | **Consignes claires** — annoncer chaque étape (« Avancez vos pieds », « Penchez-vous en avant ») |
| **Sécurité partagée** — réduire l’effort de l’aidant, prévenir accidents et TMS | **Rythme respecté** — laisser le temps d’analyser et d’agir |
| **Communication adaptée** — mots simples, précis, adaptés à l’état de conscience | **Association des aides** — voix + guidance non verbale (regard, toucher sécurisant) ou aide technique |

**Boucle cœur de produit :**

```
VISITE → TRANSMISSION (prof → aidant) → PRATIQUE (aidant, "mode visite") →
FEEDBACK (aidant → prof) → ADAPTATION (prof) → VISITE SUIVANTE
```

**Qui paie, qui utilise, qui en bénéficie :**

| Rôle | Acteur |
|---|---|
| Payeur / distributeur | Établissement de rééducation |
| Utilisateur principal | Famille / aidant |
| Bénéficiaire final | Patient |
| Prescripteur de contenu | Professionnel de rééducation (ergothérapeute, kinésithérapeute, infirmier, éducateur) |

---

## 1. Acteurs & personas

| Acteur | Description | Device principal |
|---|---|---|
| **Professionnel** | Ergothérapeute, kinésithérapeute, infirmier, éducateur en établissement de rééducation | Web app responsive / PWA, tablette |
| **Aidant (proche)** | Membre de la famille venant en visite | Mobile (app native ou PWA) |
| **Patient** | Bénéficiaire, catégorisé selon 5 niveaux d'autonomie | Non-utilisateur direct (sauf cas patient autonome) |
| **Administrateur établissement** | Référent qui paramètre l'établissement, les accès, les patients | Web back-office |

### 1.1 Typologie patient (à intégrer au modèle de données)

1. **Autonome** — se déplace avec sécurité
2. **Semi-autonome** — aide technique, risque de chute faible à élevé
3. **Semi-autonome avec aide humaine à proximité** — risque de chute élevé à très élevé
4. **Dépendant** — nécessite une aide humaine pour les transferts
5. **Grabataire** — alité

Référentiel de mesure recommandé : la grille d'évaluation de l'autonomie déjà utilisée par les équipes soignantes et reconnue par l'assurance maladie, pour calibrer les consignes proposées à l'aidant — sans en faire un outil de mesure clinique dans Proche+.

---

## 2. Blocs fonctionnels du MVP

```
🟢 BLOC 1 — Onboarding famille
🟢 BLOC 2 — Transmission professionnel → aidant (post-visite, < 2 min)
🟢 BLOC 3 — Mode visite (préparation / pendant la visite, côté aidant)
🟢 BLOC 4 — Feedback aidant (post-visite, facultatif et automatisé)
🟢 BLOC 5 — Questions aidant → professionnel
🟢 BLOC 6 — Back-office établissement / professionnel
```

### Hors périmètre MVP (explicitement exclu)

- IA médicale, aide au diagnostic
- Intégration avec les logiciels médicaux existants de l'établissement (prévue en architecture, pas en V1)
- Dossier patient complet
- Téléconsultation
- Messagerie instantanée type chat libre
- Vidéo personnalisée par professionnel (RGPD / modération / stockage)
- Marketplace, gamification
- Facturation complexe multi-payeurs
- Transmission systématique obligatoire après **chaque** visite (le professionnel choisit)
- Mesure de progression clinique certifiée

---

## 3. Modèle de données (conceptuel)

```
User
 ├── Professional (rôle: ergotherapeute | kinesitherapeute | infirmier | educateur | admin_etablissement)
 └── Caregiver (aidant)

Establishment
 └── Professional[]
 └── Patient[]

Patient
 ├── autonomy_level (enum: autonome | semi_autonome_faible | semi_autonome_eleve | dependant | grabataire)
 ├── Caregiver[] (relation : lien de parenté, rôle principal/secondaire)
 └── EducationalObjective (courant)

EducationalObjective
 ├── skill (transfert | fauteuil | toilette | communication | repas | mobilite | autonomie | comportement | autre)
 ├── status (acquis | en_cours | a_reprendre | non_travaille)
 ├── instructions[] (consignes prédéfinies + libres)
 ├── resources[] (liens vers la bibliothèque de conseils)
 └── next_step

Visit
 ├── Patient
 ├── Professional[]
 ├── date
 └── Transmission (0..1)

Transmission
 ├── EducationalObjective
 ├── message_to_caregiver (à retenir / à essayer / à éviter / à revoir ensemble)
 ├── sent_at
 └── read_at

ComprehensionCheck
 ├── Transmission
 ├── result (clair | doute)
 └── comment (si doute)

CaregiverFeedback
 ├── Transmission
 ├── outcome (facile | difficile | non_essaye)
 ├── difficulties[] (liste fermée + "autre")
 ├── wants_to_discuss (bool)
 └── created_at

Question
 ├── Caregiver
 ├── Professional (destinataire, optionnel)
 ├── text
 ├── status (en_attente | traitee | associee_ressource)
 └── answer

Resource (bibliothèque de conseils)
 ├── category
 ├── title
 └── content
```

**Principe de cloisonnement des données (à respecter dès le schéma) :**

| Type | Visibilité | Exemple |
|---|---|---|
| 🔒 Données professionnelles | Professionnel uniquement | Observation clinique interne |
| 🟢 Données éducatives partagées | Aidant + Professionnel | Objectif, consigne, ressource |
| 🟡 Données de feedback | Professionnel (remontée) | Difficulté, question, ressenti |

---

## 4. Spécifications fonctionnelles — Gherkin

### Feature 1 — Onboarding de l'aidant

```gherkin
Fonctionnalité: Onboarding de la famille à l'admission du patient
  En tant qu'administrateur établissement ou professionnel
  Je veux inviter la famille dès l'admission du patient dans l'établissement
  Afin qu'elle puisse participer activement à sa réadaptation dès les premières visites

  Contexte:
    Étant donné que je suis connecté en tant que professionnel de l'établissement "Centre de rééducation Val-de-Marne"
    Et que le patient "Mme Martin" est admis dans le service

  Scénario: Invitation d'un aidant lors de l'admission
    Étant donné que je consulte la fiche du patient "Mme Martin"
    Quand je saisis le numéro de téléphone ou l'email de l'aidant "Jean Martin"
    Et que je précise son lien avec le patient "conjoint"
    Et que je valide l'invitation
    Alors un lien d'activation est envoyé à "Jean Martin" par SMS ou email
    Et le statut de l'aidant apparaît comme "invité" dans le back-office

  Scénario: Création du compte aidant
    Étant donné que "Jean Martin" a reçu un lien d'activation
    Quand il ouvre le lien sur son mobile
    Et qu'il renseigne son nom, un mot de passe et accepte les conditions d'utilisation
    Alors son compte est créé et associé au patient "Mme Martin"
    Et le statut de l'aidant passe à "actif" dans le back-office établissement

  Scénario: Parcours pédagogique d'accueil (5 minutes)
    Étant donné que "Jean Martin" se connecte pour la première fois
    Quand l'application lui présente le parcours d'accueil
    Alors il voit successivement les écrans suivants:
      | Étape         | Contenu                                                        |
      | Comprendre    | Rôle de l'aidant pendant la réadaptation                       |
      | Apprendre     | Principe "faire faire" plutôt que "faire à la place"           |
      | Pratiquer     | Notions de guidance verbale (exemples de consignes courtes)    |
      | Sécuriser     | Consignes de sécurité générales (freins, transferts, chutes)   |
    Et il doit valider chaque étape pour accéder à l'application

  Scénario: Aidant non connecté / non numérique
    Étant donné qu'un aidant ne dispose pas d'un accès numérique
    Quand le professionnel tente de l'inviter
    Alors le système propose une alternative papier/orale
    Et cette situation est tracée comme "parcours proposé, non activé" sans bloquer la prise en charge du patient
```

### Feature 2 — Transmission professionnel → aidant

```gherkin
Fonctionnalité: Transmission post-visite en moins de 2 minutes
  En tant que professionnel de rééducation
  Je veux transmettre rapidement un objectif et des consignes à l'aidant après une séance
  Afin que la famille sache quoi faire, comment, et ce qu'elle ne doit pas faire

  Contexte:
    Étant donné que je suis connecté en tant que professionnel
    Et que je viens de terminer une séance avec "Mme Martin"

  Scénario: Création d'une transmission complète
    Quand je sélectionne "Faire la transmission" depuis la fiche patient
    Et que je choisis une ou plusieurs compétences travaillées parmi:
      | Transfert | Fauteuil | Toilette | Communication | Repas | Mobilité | Autonomie | Comportement | Autre |
    Et que pour chaque compétence je sélectionne un statut parmi "Acquis", "En cours", "À reprendre"
    Et que je sélectionne au moins une consigne prédéfinie ou que j'en rédige une personnalisée
    Et que je précise ce que l'aidant doit essayer avant la prochaine visite
    Et que je définis l'objectif de la prochaine visite
    Et que je prévisualise le message final tel qu'il sera reçu par l'aidant
    Et que je clique sur "Envoyer à Jean"
    Alors la transmission est envoyée à l'aidant "Jean Martin"
    Et elle apparaît horodatée dans l'historique du patient
    Et l'objectif pédagogique en cours est mis à jour dans la fiche patient

  Scénario: Contrainte de temps
    Étant donné que je débute la création d'une transmission
    Quand je complète l'ensemble des 6 étapes avec les choix rapides proposés
    Alors le temps nécessaire ne doit pas dépasser 2 minutes en usage normal

  Scénario: Le professionnel ne doit pas ressaisir le dossier clinique
    Étant donné que je crée une transmission
    Alors l'application ne me demande jamais l'identité complète du patient, la pathologie, ni un compte rendu médical
    Et aucun champ de la transmission ne duplique le dossier médical existant du patient

  Scénario: Transmission facultative
    Étant donné qu'une séance vient de se terminer
    Quand je choisis de ne pas faire de transmission
    Alors aucune notification n'est envoyée à l'aidant
    Et le patient reste visible dans "Mes visites" sans transmission associée
```

### Feature 3 — Consultation de la transmission par l'aidant

```gherkin
Fonctionnalité: Consultation de la transmission par l'aidant
  En tant qu'aidant
  Je veux consulter simplement ce que je dois retenir, essayer et éviter
  Afin de me sentir en sécurité pendant ma prochaine visite

  Scénario: Réception et affichage de la transmission
    Étant donné qu'une transmission a été envoyée par le professionnel
    Quand je me connecte à l'application
    Alors je vois un écran "Votre accompagnement après la visite" présentant:
      | Section          | Exemple de contenu                                             |
      | À retenir        | Laissez votre proche commencer le mouvement avant de l'aider   |
      | À essayer        | Lors du prochain transfert, donnez votre consigne puis attendez|
      | À éviter         | Ne tirez pas votre proche par le bras                          |
      | À revoir ensemble| Le moment où vous devez intervenir                             |

  Scénario: Confirmation de compréhension
    Étant donné que j'ai consulté la transmission
    Quand l'application me demande "Est-ce que vous savez ce que vous devez essayer ?"
    Et que je réponds "J'ai encore un doute"
    Alors un champ texte s'affiche pour préciser ce qui n'est pas clair
    Et cette information remonte au professionnel avant la prochaine visite

  Scénario: Transmission non lue avant la visite suivante
    Étant donné qu'une transmission n'a pas été ouverte par l'aidant
    Quand une nouvelle visite est programmée
    Alors le professionnel voit un indicateur "non consultée" sur la fiche du patient
```

### Feature 4 — Mode visite (préparation et guidage pendant la visite)

```gherkin
Fonctionnalité: Mode visite
  En tant qu'aidant
  Je veux savoir, juste avant ou pendant ma visite, ce que je peux faire avec mon proche
  Afin d'être utile sans risquer de faire à sa place ou de le mettre en danger

  Scénario: Préparer sa visite
    Étant donné que je m'apprête à rendre visite à mon proche
    Quand j'ouvre "Mode visite" dans l'application
    Alors je vois:
      | Élément                        | Exemple                                             |
      | Objectif du jour               | Participer davantage au repositionnement            |
      | Ce que je peux faire            | Encourager le changement de position, guidance verbale |
      | Ce que je ne dois pas faire     | Réaliser un transfert sans supervision              |
      | Rappels de mobilisation         | Si prescrits/configurés par le professionnel        |

  Scénario: Consignes personnalisées selon le patient
    Étant donné que le patient a un niveau d'autonomie "semi-autonome, risque de chute élevé"
    Quand j'ouvre le mode visite
    Alors les consignes affichées sont adaptées à ce niveau de risque
    Et aucune consigne de transfert autonome n'est proposée si elle n'a pas été validée par le professionnel

  Scénario: Rappel de fréquence non universel
    Étant donné qu'un principe pédagogique général recommande une mobilisation régulière
    Quand ce principe n'a pas été individualisé par le professionnel pour ce patient
    Alors l'application n'affiche jamais de règle générique du type "toutes les 30 minutes"
    Et elle affiche uniquement une consigne validée et paramétrée par l'équipe soignante

  Scénario: Guidance verbale affichée pendant la visite
    Étant donné que je suis en visite et que le mode visite est actif
    Quand je consulte les phrases de guidance recommandées
    Alors je vois des consignes courtes, un seul verbe d'action par phrase, dans l'ordre chronologique du geste
    Et l'application rappelle explicitement "vous n'êtes pas là pour faire à sa place"
```

### Feature 5 — Feedback de l'aidant après la visite

```gherkin
Fonctionnalité: Feedback aidant post-visite
  En tant qu'aidant
  Je veux pouvoir indiquer facilement comment s'est passée ma tentative
  Afin que le professionnel puisse adapter la prochaine étape sans que je fasse un effort de rédaction complexe

  Scénario: Feedback simple après un délai configurable
    Étant donné qu'un délai de 24 à 72 heures s'est écoulé depuis la transmission
    Quand l'application me sollicite avec "Depuis votre dernière visite, avez-vous pu essayer ?"
    Alors je peux répondre uniquement parmi "Oui, facilement", "Oui, mais avec difficulté", "Non, je n'ai pas pu"

  Scénario: Détail en cas de difficulté
    Étant donné que j'ai répondu "Oui, mais avec difficulté" ou "Non, je n'ai pas pu"
    Quand l'application me demande "Qu'est-ce qui a été difficile ?"
    Alors je peux sélectionner une ou plusieurs réponses parmi une liste fermée
    Et je peux indiquer si je souhaite en reparler lors de la prochaine visite

  Scénario: Feedback facultatif
    Étant donné qu'un aidant ne répond pas à la sollicitation de feedback
    Quand le délai de rappel est dépassé
    Alors aucune relance insistante n'est envoyée au-delà d'un seul rappel
    Et l'absence de réponse n'empêche pas la prochaine visite d'avoir lieu normalement

  Scénario: Le feedback devient une alerte de préparation, pas une notification isolée
    Étant donné qu'un aidant a signalé une difficulté
    Quand le professionnel ouvre sa fiche "Préparer la visite" pour ce patient
    Alors il voit le feedback et la question éventuelle directement rattachés à l'objectif concerné
    Et il peut choisir "Modifier l'objectif", "Conserver" ou "Marquer comme traité"
```

### Feature 6 — Questions de l'aidant au professionnel

```gherkin
Fonctionnalité: Question de l'aidant
  En tant qu'aidant
  Je veux pouvoir poser une question ponctuelle au professionnel
  Afin de lever un doute sans attendre nécessairement la prochaine visite

  Scénario: Poser une question
    Étant donné que je consulte l'application
    Quand je rédige une question dans le champ "J'ai une question"
    Et que je valide l'envoi
    Alors la question apparaît dans la liste "Questions en attente" du professionnel concerné

  Scénario: Traitement de la question par le professionnel
    Étant donné qu'une question est en attente
    Quand le professionnel consulte "Questions en attente"
    Alors il peut choisir "Répondre", "Ajouter à la prochaine visite" ou "Associer à une ressource existante"
    Et le statut de la question passe respectivement à "traitée" ou reste "en attente" avec une action planifiée

  Scénario: Consultation de la bibliothèque de conseils en autonomie
    Étant donné que je recherche une information générale (ex: "Comment aider mon proche à se lever ?")
    Quand je consulte la bibliothèque de ressources par catégorie
    Alors j'obtiens une réponse validée sans solliciter directement le professionnel
```

### Feature 7 — Back-office établissement / professionnel

```gherkin
Fonctionnalité: Tableau de bord établissement
  En tant que professionnel ou administrateur établissement
  Je veux avoir une vision synthétique de l'activité des familles
  Afin de prioriser mes actions sans traiter systématiquement chaque interaction

  Scénario: Dashboard global
    Étant donné que je me connecte au back-office
    Alors je vois un tableau de bord affichant au minimum:
      | Indicateur                              |
      | Nombre de patients accompagnés          |
      | Nombre de familles activées             |
      | Familles ayant utilisé l'app cette semaine |
      | Nombre de difficultés signalées          |
      | Nombre de questions en attente            |

  Scénario: Fiche patient/aidant détaillée
    Étant donné que je sélectionne un patient dans le dashboard
    Alors je vois l'objectif actuel, les consignes autorisées et non autorisées, les signalements récents et l'historique chronologique des transmissions et feedbacks

  Scénario: Multi-professionnels sur un même patient
    Étant donné qu'un patient est suivi par un ergothérapeute et un kinésithérapeute
    Quand chacun accède à la fiche du patient
    Alors chacun voit les transmissions et objectifs partagés utiles au parcours éducatif
    Mais aucun ne voit les observations cliniques privées de l'autre professionnel

  Scénario: Historique d'un objectif pédagogique
    Étant donné qu'un objectif a évolué au fil des visites
    Quand je consulte son historique
    Alors je vois la chronologie complète: transmis, essayé avec difficulté, question posée, repris avec le professionnel, acquis
```

### Feature 8 — Cloisonnement des données (transversal, non-fonctionnel critique)

```gherkin
Fonctionnalité: Cloisonnement des données professionnelles, éducatives et de feedback
  En tant que responsable de la conformité et architecte produit
  Je veux garantir que chaque catégorie de donnée est visible uniquement par les acteurs autorisés
  Afin de respecter le RGPD et la confidentialité des données de santé

  Scénario: Donnée professionnelle non partagée
    Étant donné qu'un professionnel saisit une observation clinique interne
    Quand l'aidant consulte l'application
    Alors cette observation n'apparaît à aucun moment dans l'interface aidant

  Scénario: Donnée éducative partagée
    Étant donné qu'un objectif pédagogique et ses consignes sont validés par le professionnel
    Quand l'aidant consulte l'application
    Alors il voit cet objectif et ces consignes

  Scénario: Donnée de feedback remontée
    Étant donné qu'un aidant transmet un ressenti ou une question
    Quand le professionnel consulte la fiche patient
    Alors il voit cette donnée rattachée à l'objectif concerné
    Et cette donnée n'est jamais visible par d'autres aidants ou d'autres patients
```

---

## 5. Architecture technique recommandée

### 5.1 Vue d'ensemble

```
┌───────────────────────────┐        ┌────────────────────────────┐
│   Application Aidant      │        │  Application Professionnel   │
│   (mobile)                │        │  (web responsive)            │
└─────────────┬─────────────┘        └──────────────┬───────────────┘
              │         Connexion sécurisée internet │
              └───────────────────┬──────────────────┘
                                   ▼
                      ┌─────────────────────────┐
                      │   Porte d'entrée sécurisée │
                      │   (identification + limite │
                      │    de nombre de requêtes)  │
                      └────────────┬─────────────┘
                                   ▼
        ┌───────────────────────────────────────────────────┐
        │                Cœur applicatif                     │
        │  Services: Patients · Visites · Transmissions ·     │
        │  Objectifs · Feedback · Questions · Notifications   │
        └───────────────────────┬─────────────────────────────┘
                                   ▼
        ┌───────────────────────────────────────────────────┐
        │   Base de données — cloisonnement strict entre      │
        │   données pro / éducatives / feedback                │
        └───────────────────────┬─────────────────────────────┘
                                   ▼
                 ┌───────────────────────────────────┐
                 │  Hébergement certifié santé (France)│
                 └───────────────────────────────────┘
```

### 5.2 Choix d'architecture et justification

| Sujet | Recommandation | Justification |
|---|---|---|
| Hébergement | Hébergeur spécialement certifié pour les données de santé, situé en France | Obligation légale pour toute donnée de santé, y compris indirectement identifiante via le patient |
| Authentification | Connexion sécurisée avec double vérification pour les professionnels | Séparation stricte des rôles, traçabilité des accès |
| Base de données | Base de données classique (PostgreSQL) avec des règles de cloisonnement appliquées directement au niveau des données, pas uniquement dans l'application | Garantit que même une erreur de code ne peut pas exposer une donnée à la mauvaise personne |
| Application aidant | Application web installable d'abord (accès par lien à l'admission), application de magasin d'applications en V2 si l'adoption est confirmée | Réduit la friction d'inscription, évite un passage par les magasins d'applications au démarrage |
| Application professionnel | Application web responsive, pas d'application native | Usage en poste fixe/tablette, pas de besoin critique de fonctionnement hors connexion au MVP |
| Notifications | Notification mobile + SMS de secours (pour les aidants moins à l'aise avec le numérique) | Couvre la diversité des usages numériques observée dans les entretiens |
| Interopérabilité | Pas de connexion aux logiciels de l'établissement en V1, mais l'application interne est conçue selon un format d'échange standard déjà reconnu dans le secteur de la santé | Permet de brancher plus tard le produit sur d'autres outils sans tout reconstruire |
| Multi-établissement | Chaque établissement dispose de son propre espace cloisonné, avec ses patients et ses professionnels | Modèle où l'établissement reste le client contractuel |
| Traçabilité | Journal qui enregistre toute lecture ou écriture d'une donnée de santé | Exigence légale, utile en cas de contrôle par une autorité de protection des données |

### 5.3 Sécurité et conformité — points de vigilance à trancher avant développement

- Base légale pour le traitement des données personnelles (intérêt légitime de l'établissement de soins / consentement de l'aidant à recueillir explicitement lors de l'inscription)
- Qui, juridiquement, peut valider une consigne transmise à l'aidant (responsabilité du professionnel signataire)
- Gestion du consentement du patient lorsque celui-ci est en capacité de s'exprimer
- Règles de conservation des données après la sortie du patient de l'établissement
- Accessibilité numérique pour les aidants âgés ou peu à l'aise avec le digital, en suivant les règles françaises d'accessibilité des sites et applications

---

## 6. Ce qui est ajouté par rapport aux premières hypothèses (delta produit)

1. **Mode visite** devient central (et non périphérique)
2. **"Faire faire" vs "faire à la place"** devient un pilier pédagogique transversal
3. **Guidance verbale** structurée, pas seulement des gestes à observer
4. **Mobilité même en position assise** intégrée aux consignes types
5. **Parcours d'accueil établissement** comme mécanisme principal de distribution/adoption
6. **Personnalisation par patient** (niveau d'autonomie, consignes validées) dès le MVP

---

## 7. Métriques de succès du MVP

| # | Métrique | Cible |
|---|---|---|
| 1 | Temps moyen pour créer une transmission | < 2 minutes |
| 2 | % de visites donnant lieu à une transmission | > 70 % |
| 3 | % de transmissions consultées par l'aidant | > 70 % |
| 4 | % de feedbacks complétés | > 50 % |
| 5 | % d'objectifs qui évoluent grâce au feedback | Indicateur clé de la boucle (pas juste une boîte aux lettres) |

---

## 8. Prochaine étape recommandée (avant développement)

Tester le parcours d'une seule visite avec un prototype papier/Figma auprès de 5 à 10 familles :

**Accueil → activation → préparation de visite → mode visite → guidance → fin de visite → retour facultatif**

Mesurer une seule question : *la famille fait-elle effectivement plus bouger le patient et intervient-elle moins à sa place après avoir utilisé le parcours ?*

Si oui : le cœur de produit est validé et le développement du MVP décrit ci-dessus peut démarrer.

---

## 9. Identité de marque, ton & expérience senior-friendly

### 9.1 Positionnement

> **Rassurant comme un professionnel de santé, chaleureux comme un ours en peluche, léger comme un dimanche ensoleillé.**

La mascotte a un tempérament bien à elle : un grand ours débonnaire, un peu bourru en apparence mais profondément attentionné, qui prend les choses du bon côté et dédramatise sans jamais minimiser. Il ne fait jamais la leçon — il accompagne, avec une pointe de malice et beaucoup de patience. C'est ce mélange de nonchalance affectueuse et de vigilance douce qui doit transparaître dans chaque interaction : jamais pressé, jamais froid, toujours présent.

L'app ne doit jamais paraître clinique ou infantilisante. L'humour est doux, jamais moqueur envers la maladie ou la vulnérabilité du patient — il sert à **détendre l'aidant**, pas à minimiser la situation. La cible principale (aidants nés grosso modo entre 1955 et 1970) a des repères culturels précis : variété française, radio du dimanche matin, grandes voix. On s'en sert comme clin d'œil ponctuel, jamais comme gimmick permanent qui lasserait.

### 9.2 Palette et univers visuel

| Élément | Direction |
|---|---|
| Couleurs primaires | Jaune soleil chaleureux + un vert/teal "santé rassurant" (évite le bleu clinique froid) |
| Couleurs secondaires | Terracotta doux (rappel du pelage de la mascotte), blanc cassé plutôt que blanc pur |
| Contraste | Toujours conforme AA minimum, testé spécifiquement en conditions de basse vision |
| Mascotte | Ours brun en peluche, tempérament nonchalant et bienveillant — jamais pressé, jamais sévère. Décliné en petites poses contextuelles : ours qui encourage (pouce levé, sourire en coin), ours qui patiente (bras croisés, l'air de dire "prenez votre temps"), ours qui célèbre (confettis en forme de rayons de soleil), ours attendri (tête penchée, regard doux) — jamais de pose qui simule un geste médical |
| Iconographie | Pictogrammes simples et déjà connus (téléphone, cœur, fauteuil), toujours accompagnés d'un mot, jamais d'icône seule |
| Typographie | Sans-serif arrondie, taille de base généreuse, mode "grands caractères" activable en un tap depuis le premier écran |

### 9.3 Ton éditorial — exemples de microcopy

*(références aux titres de chansons uniquement, jamais aux paroles — pour rester dans un usage léger et sans reproduire d'œuvre protégée)*

Le ton général est celui d'un compagnon débonnaire : jamais pressant, jamais sentencieux, toujours un peu taquin mais profondément rassurant. On tutoie l'humour, jamais la situation elle-même.

| Contexte | Message |
|---|---|
| Écran de chargement | "On accorde les violons, une seconde…" 🎻 |
| Transmission bien reçue | "Message reçu 5 sur 5, comme à la bonne époque du poste à galène 📻" |
| Objectif atteint | "Bravo ! Aujourd'hui, c'était un peu votre 'Champs-Élysées' à vous 🌞" |
| Feedback difficile signalé | "Pas de souci, même les plus grands ont eu leurs couplets ratés. On regarde ça ensemble." |
| Rappel doux de visite | "Petit rappel, en douceur — pas de tube à la radio sans un peu de répétition !" |
| Écran d'accueil du matin | "Aujourd'hui il fait beau ☀️ — direction la chambre de votre proche !" |
| Aidant hésite avant une action | "Prenez votre temps, on n'est pas à la seconde près." |
| Retour après une pause d'utilisation | "Content de vous revoir ! On reprend tranquillement là où on en était." |

**Règle éditoriale :** un clin d'œil musical ou une pointe d'humour maximum par écran, jamais dans les messages liés à une difficulté médicale ou à une chute — dans ces cas, le ton redevient sobre et rassurant sans humour, mais reste chaleureux.

### 9.4 Interaction, animation et accessibilité (aidants 60+)

```gherkin
Fonctionnalité: Expérience adaptée aux aidants seniors
  En tant qu'aidant, potentiellement peu à l'aise avec le numérique
  Je veux une application simple, chaleureuse et lisible
  Afin de l'utiliser sereinement sans effort d'apprentissage ni frustration

  Scénario: Mode grands caractères par défaut proposé
    Étant donné que je crée mon compte pour la première fois
    Quand l'onboarding me demande "Souhaitez-vous des caractères plus grands ?"
    Alors je peux activer ce mode en un seul tap
    Et ce réglage s'applique immédiatement à tout le parcours, sans redémarrage

  Scénario: Une seule action par écran
    Étant donné que je consulte une transmission ou un mode visite
    Quand l'écran s'affiche
    Alors il ne propose jamais plus d'une action principale visible sans défilement
    Et un bouton "retour" est toujours présent et identique à travers l'application

  Scénario: Zones tactiles adaptées
    Étant donné que je navigue avec les doigts, parfois avec un léger tremblement
    Quand j'interagis avec un bouton ou une carte
    Alors la zone tactile mesure au minimum 48x48 pixels
    Et aucune action essentielle ne repose sur un geste complexe (glisser, double-tap, pincer)

  Scénario: Animation de célébration non intrusive
    Étant donné que je viens de valider un feedback positif
    Quand l'application affiche l'animation de l'ours qui célèbre
    Alors l'animation dure moins de 2 secondes
    Et elle ne bloque jamais l'accès à l'écran suivant
    Et elle peut être désactivée dans les réglages d'accessibilité

  Scénario: Lecture audio des consignes
    Étant donné que je préfère écouter plutôt que lire
    Quand j'active l'icône "écouter" sur une transmission ou une consigne du mode visite
    Alors le texte est lu à voix haute par synthèse vocale
    Et je peux mettre en pause et reprendre à tout moment

  Scénario: Ton sobre en cas de sujet sensible
    Étant donné qu'une difficulté ou un risque de chute est signalé
    Quand l'application m'affiche cette information
    Alors aucun humour ni référence légère n'apparaît sur cet écran
    Et le message reste factuel, rassurant et orienté vers l'action à entreprendre

  Scénario: Pas de disparition automatique non confirmée
    Étant donné qu'un message important s'affiche (consigne de sécurité, alerte)
    Quand le délai d'affichage habituel des animations est écoulé
    Alors ce message reste visible tant que je n'ai pas cliqué sur "J'ai compris"
```

### 9.5 Ce que cette identité change dans le design system

- **Composant "Ours mascotte"** devient un composant réutilisable avec un jeu limité de 5 à 6 poses (accueil, encouragement, patience, célébration, vigilance/sobre, question), pour rester cohérent et éviter la surcharge animée
- **Bibliothèque de microcopy à références musicales** doit être gérée comme un contenu éditorial à part (fichier de traduction/contenu), modifiable sans redéploiement, pour pouvoir doser l'humour selon les retours terrain
- **Mode "sobre"** activable manuellement (ou déclenché automatiquement sur les écrans sensibles) qui retire toute référence humoristique et toute animation non essentielle — utile aussi en cas de deuil ou de moment difficile pour la famille
