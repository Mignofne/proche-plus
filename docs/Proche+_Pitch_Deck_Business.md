# Proche+ — Pitch deck (texte)

> Document exportable pour challenger le business plan / modèle économique (ex. avec Claude).  
> Produit : SaaS de continuité éducative entre établissements de rééducation et familles-aidants.  
> Demo : https://proche-plus.vercel.app

---

## 1. One-liner

**Proche+** est un SaaS B2B de **continuité éducative** : il transforme la visite familiale en temps actif de réadaptation, sans transformer le proche en soignant.

Boucle produit :

```
Visite → Transmission pro → Mode visite aidant → Feedback → Adaptation pro → Visite suivante
```

---

## 2. Problème

En rééducation / SSR / structures de soins :

- L’équipe soignante **éduque** le patient et la famille, mais la **continuité entre deux séances** repose souvent sur la mémoire orale et des consignes floues.
- Les aidants veulent **aider** ; sans cadre clair, ils font trop, trop peu, ou le mauvais geste → **frustration, risque, perte de progrès**.
- Les professionnels manquent de **retour structuré** sur ce qui s’est passé en visite familiale.
- Les établissements peinent à **prouver / industrialiser** l’accompagnement famille hors du temps clinique.

**Enjeu de fond :** le temps familial est un levier sous-exploité de réadaptation, aujourd’hui non outillé de façon sécurisée et mesurable.

---

## 3. Solution

Une plateforme multi-acteurs qui :

1. Fait **transmettre** des consignes éducatives en moins de 2 minutes (professionnel → aidant).
2. Guide l’aidant en **mode visite** avec un exercice adapté au **niveau d’autonomie** du patient (thèmes du quotidien : s’habiller, manger, fauteuil, marche, etc.).
3. Collecte un **feedback simple** (réussi / essai / échec) pour que le professionnel **adapte** la suite.
4. Garde la **main clinique / éducative au professionnel** (activation des exercices, alertes ; jamais d’auto-progression dangereuse côté aidant).

**Positionnement :** outil éducatif de continuité — pas un dossier patient, pas une téléconsultation, pas un chat libre médical.

---

## 4. Cibles

| Acteur | Rôle | Qui paie / décide ? |
|--------|------|---------------------|
| **Établissement** (SSR, rééducation, structures médico-sociales) | Client / payeur | Direction, qualité, cadre de santé, innovation |
| **Professionnel** (ergo, kiné, infirmier, éducateur, APA…) | Prescripteur / utilisateur quotidien | Influence l’adoption |
| **Aidant familial** (~55–70 ans, mobile-first) | Utilisateur principal UX | N’achète pas ; doit adopter sans friction |
| **Patient** | Bénéficiaire | Non-utilisateur direct de l’app |

**ICP (hypothèse à challenger) :** établissements de rééducation / SSR avec flux de familles, volonté qualité / parcours patient, besoin de traçabilité éducative hors séance.

- **Buyer** : établissement (B2B)
- **User** : aidant + professionnel
- **Champion interne** : cadre de rééducation / APA / référent familles

---

## 5. Fonctionnalités principales (MVP actuel)

### Aidant (PWA mobile)

- Onboarding pédagogique + accessibilité (grands caractères)
- Lecture de la **transmission** (à retenir / essayer / éviter / revoir)
- **Mode visite** : choix du thème → exercice adapté au niveau → consignes + ce que l’aidant peut / ne doit pas faire
- Outcomes : Réussi · Essai · Échec
- Feedback post-visite, questions au professionnel, bibliothèque de ressources

### Professionnel (web)

- Dashboard patients / alertes
- Fiche patient + objectif éducatif
- Activation d’exercices (matrice thèmes × niveaux A–E)
- Création de transmission en wizard (< 2 min)
- Réponses aux questions + alertes (échecs / changements de niveau)

### Admin établissement (cible produit)

- File d’actions ops : familles non activées, questions, patients sans transmission
- Invitation / activation aidants, paramétrage des accès

### Admin produit / fondateurs

- KPIs SaaS MVP
- CRUD du **référentiel** (thèmes, niveaux, exercices APA)

### Socle contenu

- Référentiel d’exercices validables (APA) : ~8 thèmes × 5 niveaux d’autonomie
- Règle : l’aidant ne voit que ce qui est **activé** pour *ce* patient
- Cloisonnement données pro / éducatives / feedback ; observations cliniques non exposées à l’aidant

---

## 6. Enjeux business & marché (à challenger)

1. **Qui paie vraiment ?** Établissement seul vs GHT vs mutuelle vs forfait parcours vs financement public (ARS, innovation, qualité) ?
2. **Valeur mesurable pour le payeur** : taux de transmissions lues, feedbacks, réduction d’incidents famille, satisfaction familles, différenciation établissement, charge pro ?
3. **Go-to-market** : vente directe établissements, partenariats fédérations / éditeurs SIH, pilotes SSR, appels à projets ?
4. **Adoption aidant** : friction login, digital seniors, charge émotionnelle, dépendance au pro pour « pousser » l’usage.
5. **Adoption pro** : contrainte temps (< 2 min transmission), intégration workflow, peur de charge supplémentaire.
6. **Réglementaire** : données de santé / continuum éducatif → HDS, RGPD, responsabilité en cas de mauvais geste malgré consignes.
7. **Contenu** : moat = référentiel APA + gouvernance éditoriale ; coût de création / mise à jour / validation.
8. **Concurrence** : portails familles, apps aidants génériques, modules « éducation thérapeutique », WhatsApp/papier, logiciels métier santé. Différenciation = **boucle éducative visite + matrice autonomie + feedback structuré**.
9. **Unit economics** : prix / lit ou / patient actif ou / établissement ; coût support + onboarding + contenu.
10. **Roadmap monétisable** : multi-établissements, HDS, invitations SMS, admin établissement, analytics qualité, export preuves parcours.

---

## 7. Hypothèses de modèle économique (ouvertes — à stress-tester)

- **SaaS B2B** abonnement établissement (mensuel / annuel)
- Pricing possible : par établissement, par lit/place, par patient suivi, par professionnel actif
- Pilote gratuit / payant court → conversion annuelle
- Upsell : modules (catalogue étendu, multi-sites, reporting qualité, API SI)
- Coûts clés : R&D, conformité HDS, support onboarding, production contenu APA, acquisition B2B longue

### Métriques produit déjà définies (MVP)

- Transmission < 2 min
- > 70 % visites avec transmission
- > 70 % transmissions consultées
- > 50 % feedbacks complétés
- Boucle : objectifs qui évoluent grâce au feedback

---

## 8. Avantage / asymétrie (à stress-tester)

- Focus **visite familiale** (moment précis à forte valeur) plutôt que « app santé générale »
- **Sécurité du geste** explicite (peut / ne doit pas) + activation professionnelle
- Matrice **thème × autonomie** opérationnelle
- UX pensée aidants seniors, pas soignants
- Cloisonnement multi-établissements dès le design

---

## 9. Stade actuel

- Produit MVP déployé (aidants + professionnels + admin fondateurs + référentiel)
- Demo live : https://proche-plus.vercel.app
- Prochaines marches : HDS, invitations SMS/email, admin établissement complet, 2FA, durcissement sécurité

---

## 10. Vision

Faire de chaque visite de proche un **épisode éducatif tracé, sécurisé et utile à l’équipe** — et donner aux établissements un outil de **continuité rééducative mesurable** entre deux prises en charge.

---

## Prompt suggéré pour Claude

```
À partir de ce pitch Proche+, challenge mon business model :
(1) qui est le vrai payeur et pourquoi il paie,
(2) 3 modèles de pricing réalistes pour la France santé/SSR,
(3) unit economics et seuils de rentabilité,
(4) go-to-market 12–18 mois,
(5) risques réglementaires et d’adoption,
(6) ce qui manque pour un business plan investisseur.

Sois critique, pas complaisant.
```
