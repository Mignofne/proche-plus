---
name: Proche+ Experience
description: Parcours aidant actionnable, pro avec progression éducative, admin établissement et admin produit multi-tenant.
status: final
sources:
  - docs/Proche+_Specs_Fonctionnelles_Architecture.md
  - docs/Proche+_Specs_Section10_et_suivantes.md
  - docs/project-context.md
  - _bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/.memlog.md
  - _bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/DESIGN.md
  - _bmad-output/specs/spec-multi-exercices-visite/SPEC.md
updated: 2026-08-02
---

# Proche+ — Experience Spine

> Spines win on conflict with mocks or code actuel. Identité visuelle : `DESIGN.md`.

## Foundation

**Multi-surface**
- **Aidant** — mobile PWA (primaire)
- **Professionnel** — web responsive / tablette
- **Admin établissement** — web back-office
- **Admin produit (fondateurs)** — web, métriques SaaS

Pas de UI kit externe nommé : design system interne Proche+ (`DESIGN.md`). Produit régulé (données de santé / continuum éducatif) — cloisonnement multi-établissements **obligatoire**.

Boucle cœur :  
`VISITE → TRANSMISSION → MODE VISITE → (THÈME → LISTE EXERCICES → EXERCICE → OUTCOME)×N → FIN VISITE → FEEDBACK → ADAPTATION PRO → VISITE SUIVANTE`

Invariant session : **un outcome d’exercice ne clôt pas la visite**. Seule une action explicite « Terminer la visite » (ou le stop check-in fatigue/douleur) sort du mode visite.

## Information Architecture

### Rôles et espaces

| Espace | Acteur | Périmètre données |
|---|---|---|
| Aidant | Famille | Patients liés uniquement |
| Pro | Soignant | Patients de **son** établissement |
| Admin établissement | Référent établissement | Ops + familles de **son** établissement |
| Admin produit | Fondateurs | KPIs **agrégés** uniquement (pas le détail clinique d’un établissement tiers) |

Aucun établissement ne lit les données d’un autre.

### Surfaces — Aidant

| Surface | Entrée | But |
|---|---|---|
| Accueil | Login / cold open | Objectif en cours + prochaines actions claires |
| **Mes proches** | Accueil (carte dédiée) / onboarding | **Ajouter, modifier, supprimer** un proche — identité d’abord |
| Transmission | Accueil / notif | Lire à retenir / essayer / éviter / revoir + compréhension |
| Choix de thème | Mode visite (après check-in OK) | Choisir ce qu’on veut travailler aujourd’hui (S’habiller, Manger, Fauteuil…) |
| Liste d’exercices du thème | Après thème | Vue simple des exercices **activés** pour ce thème / ce proche ; choisir lequel faire |
| Mode visite — exercice | Après choix dans la liste | Consignes + actions (Réussi · Essai · Échec) |
| Entre-deux exercices | Après outcome | Rester en session : autre exercice · autre thème · terminer |
| Fin de visite | CTA explicite « Terminer la visite » | Clore ; expliquer que l’équipe s’en sert pour la suite |
| Feedback | Post-visite / rappel | Retour simple facultatif |
| Question | Accueil | Question ponctuelle au pro |
| Ressources | Accueil | Bibliothèque sans solliciter le pro |
| Onboarding | Première connexion | Pédagogie → **enregistrer le proche** → **choix autonomie (1 écran, 5 situations)** → puis mode visite |

**Règle d’ordre (onboarding)** : le prénom n’apparaît dans « Quelle situation décrit le mieux {prénom}… » **qu’après** saisie/confirmation par l’aidant. Jamais de nom pré-posé sans cette étape.

### Surfaces — Pro

| Surface | But |
|---|---|
| Dashboard pro | Patients, alertes (non lu, difficulté), accès transmission |
| Fiche patient | GIR **contexte** + timeline éducative + historique |
| Créer transmission | Wizard < 2 min |
| Préparer la visite | Feedbacks / questions rattachés à l’objectif |
| Questions en attente | Répondre / reporter / ressource |

### Surfaces — Admin établissement

| Surface | But |
|---|---|
| File d’actions (home) | Priorité opérationnelle immédiate |
| Familles / invitations | Activation aidants |
| Patients sans transmission | Trous de boucle |
| Paramètres accès | Pros et rôles **de l’établissement** |

### Surfaces — Admin produit

| Surface | But |
|---|---|
| Dashboard KPIs | 5 métriques de succès MVP vs cibles |

**Ordre file d’actions admin établissement**
1. À traiter aujourd’hui (questions + difficultés)
2. Familles non activées
3. Patients sans transmission récente
4. CTA Invitation aidant  
Compteurs (activées, etc.) en bandeau secondaire.

## Voice and Tone

Microcopy. Posture de marque dans `DESIGN.md`.

| Do | Don't |
|---|---|
| « Réalisé avec succès » | « Valider le geste médical » |
| « Comment ça s’est passé avec votre proche ? » | « Une action — le professionnel en sera informé » |
| « Votre réponse aide l’équipe pour la prochaine visite » | Jargon opaque (« action », « informé ») sans bénéfice pour l’aidant |
| « Que souhaitez-vous travailler aujourd’hui ? » | Sauter le choix de thème à la place de l’aidant |
| « Quel exercice voulez-vous faire ? » | Auto-lancer l’exercice courant sans choix quand plusieurs sont prêts |
| « C’est noté — un autre exercice ? » | « Visite terminée » dès le premier outcome |
| « Prenez votre temps » | « Dépêchez-vous, objectif du jour » |
| « Une étape à la fois — 2 sur 4 » | Écran fourre-tout sans prochaine action |
| Ton sobre sur doute / chute | Humour sur risque |
| « Message bien reçu » (mode sobre) | Clin d’œil radio sur sujet sensible |

Libellés d’outcome visite (matrice) **requis** : Réussi · Essai, avec difficulté · Échec.  
Libellés d’action legacy (transmission seule) : Réalisé avec succès · J’ai essayé · J’ai un doute · Demander de l’aide · Laisser une note.

Microcopy **entre-deux** (après outcome, session encore ouverte) :
- Primaire : « Faire un autre exercice »
- Secondaire : « Changer de thème »
- Ghost : « Terminer la visite »

Éviter en cours de session les formulations qui renvoient uniquement à « la prochaine visite » si l’aidant peut encore enchaîner.

## Component Patterns

Behavioral. Visuel dans `DESIGN.md.Components`.

| Composant | Règles |
|---|---|
| Sélecteur de thème | Entrée obligatoire du mode visite (post check-in) ; thèmes avec au moins un exercice activé ; jamais auto-sélection silencieuse |
| Liste d’exercices du thème | Après le thème ; lignes simples (nom + durée indicative + badge « Proposé » sur le courant) ; une ligne = un exercice activé ; jamais le catalogue entier non activé |
| Progress visite | Optionnel en session multi-exercices : compteur « N exercice(s) fait(s) aujourd’hui » plutôt qu’une fausse barre d’étapes fixes ; ne remplace pas le CTA |
| CTA principal | Un seul au-dessus de la fold ; ≥ 48 px |
| Chip / bouton d’outcome | En fin d’exercice ; un outcome primaire à la fois |
| Écran entre-deux | Après outcome : confirmation courte + 3 sorties (autre exercice / autre thème / terminer) — pas de redirection auto vers l’accueil |
| Timeline éducative | Lecture seule pour aidant (résumé simple) ; éditable / complète pour pro |
| GIR badge | Affiché côté pro comme **contexte** ; pas de sparkline d’évolution MVP |
| Action queue row | Tap → détail actionnable ; compteur si > 0 |
| KPI card | Valeur · cible · statut (sous / atteint) ; drill-down agrégé seulement |

## State Patterns

| État | Traitement |
|---|---|
| Transmission non lue | Badge pro + carte « Nouveau » aidant |
| Mode visite en cours | Session ouverte jusqu’à « Terminer » ; reprise au hub thème ou à la liste du thème en cours |
| Entre-deux exercices | Outcome enregistré ; session toujours active ; pas d’écran « Visite terminée » |
| Consigne avec doute | Remonte au pro ; ton sobre ; n’oblige pas à quitter la session |
| Feedback non répondu | Un seul rappel ; jamais bloquant |
| Famille invitée non activée | File admin établissement |
| Empty pro / admin | CTA concret (« Inviter un aidant », « Faire une transmission ») |
| Erreur réseau | Message clair + réessayer ; pas de perte silencieuse de note |

## Interaction Primitives

- **Hybride mode visite** : une action principale par écran ; en legacy, barre d’étapes + « Suivant ».
- **Session multi-exercices** : thème → liste → exercice → outcome → entre-deux (boucle) jusqu’à fin explicite.
- Tap only pour l’essentiel ; pas de swipe obligatoire.
- Synthèse vocale optionnelle sur consignes.
- Confirmation explicite (« J’ai compris ») pour messages de sécurité — pas de disparition auto.
- Retour toujours au même endroit / même libellé (« ← Changer de thème », « ← Autre exercice »).

**Interdit MVP aidant** : chat libre type messagerie, multi-CTA concurrents sur l’écran exercice, gamification, sortie auto vers l’accueil après un outcome.

## Accessibility Floor

- Contraste AA minimum (`DESIGN.md` colors).
- Zones tactiles ≥ 48×48.
- Mode grands caractères dès l’onboarding.
- Reduce motion : pas d’animation bloquante ; célébration < 2 s et désactivable.
- Labels texte + pictogramme (jamais icône seule).
- Focus / ordre de lecture = ordre du geste en guidance verbale.

## Cloisonnement & multi-tenant

| Type donnée | Visibilité |
|---|---|
| Observation clinique interne | Pro auteur uniquement (jamais aidant) |
| Objectif / consignes / ressources | Aidant + pros de l’établissement |
| Feedback / doute / note / question | Pro(s) concernés + admin établissement (ops) ; pas d’autres aidants |
| KPIs SaaS | Admin produit agrégé |

Invariant : filtre `establishmentId` partout ; RLS Postgres recommandé en prod (`bmad-architecture`).

## Progression (pro)

**Visible** — timeline éducative :  
`transmis → consulté → essayé | réalisé avec succès | doute → feedback → objectif repris | acquis`

**Contexte** — GIR (AGGIR) pour calibrer consignes et risque ; **pas** d’outil de mesure clinique ni courbe GIR dans le MVP.

**KPIs fondateurs** (admin produit) :

| # | Métrique | Cible |
|---|---|---|
| 1 | Temps moyen création transmission | < 2 min |
| 2 | % visites avec transmission | > 70 % |
| 3 | % transmissions consultées | > 70 % |
| 4 | % feedbacks complétés | > 50 % |
| 5 | % objectifs évoluant grâce au feedback | Indicateur de boucle |

## Key Flows

### Flow A0 — Première connexion aidant (enregistrer le proche)

**Protagoniste** : un aidant qui se connecte pour la première fois (compte invite ou onboarding non terminé).

1. Pédagogie courte (grands caractères + 4 messages).
2. **Climax 1** : écran **Ajouter / confirmer mon proche** — prénom + nom **saisis ou vérifiés par l’aidant**.
3. **Climax 2** : un seul écran, 5 situations côte à côte — titre avec **le prénom qu’il vient d’enregistrer** (pas un nom inventé).
4. Statut autonomie **provisoire** → accès accueil ; le pro confirmera plus tard.
5. Ensuite seulement : Mode visite / transmissions.

À tout moment après : **Mes proches** → ajouter / modifier / supprimer.

### Flow A — Jean Martin (aidant), visite du dimanche (plusieurs exercices)

**Protagoniste** : Jean, 68 ans, conjoint de Marie, peu à l’aise avec le téléphone mais motivé.

1. Ouvre Proche+ → voit **une** carte claire : Mode visite (+ transmission non lue si besoin) **et** « Mes dernières visites » / « Gérer mes proches ».
2. Lit la transmission si besoin → lance **Mode visite** → check-in fatigue/douleur OK.
3. **Choisit un thème** (ex. Fauteuil) — même s’il n’y en a qu’un, le choix reste explicite.
4. Voit une **liste simple** des exercices activés pour Fauteuil (ex. « Demi-tour » marqué Proposé, « Freins ») — il tap sur celui qu’il veut.
5. Fait l’exercice (objectif, étapes, peut / ne doit pas) → **Réussi / Essai / Échec**.
6. **Climax** : écran entre-deux « C’est noté » — il choisit **Faire un autre exercice** (même thème), change de thème (ex. Communication), ou termine. *Il comprend qu’il peut enchaîner sans perdre la visite.*
7. Après un 2ᵉ outcome, il tape **Terminer la visite** → message calme de confirmation → accueil.
8. J+1 : feedback optionnel en 2 taps.

### Flow B — Sophie (ergo), préparer la semaine

1. Dashboard → badge « difficulté » sur Mme Martin.
2. Fiche patient → GIR contexte + timeline (essai difficile hier).
3. Ajuste objectif / consignes.
4. Après séance : transmission < 2 min → envoi à Jean.

### Flow C — Admin établissement, lundi matin

1. File d’actions : 3 questions, 2 familles non activées, 1 patient sans transmission.
2. Traite / délègue / invite.
3. Ne voit **pas** les KPIs SaaS globaux ni les autres établissements.

### Flow D — Fondateur (admin produit)

1. Dashboard 5 KPIs vs cibles.
2. Filtre éventuel par établissement **agrégé** (volume), sans ouvrir de dossier patient hors mandat.

## Open Questions

- Faut-il un `VisitSession` explicite en schéma pour lier check-in + N outcomes, ou réutiliser le check-in existant comme `sessionRef` ? (bloquant architecture / implémentation CAP-4 — pas bloquant UX spines)

## Inspiration & Anti-patterns

| S’inspirer de | Éviter |
|---|---|
| Parcours admin « inbox zéro » (actions d’abord) | Dashboard vanity metrics pour le soignant |
| Checklists visite terrain (étapes visibles) | App enfant / gamification sticker |
| Dossier éducatif partagé (consignes) | Second DPI / mesure GIR certifiante |
| Liste courte post-thème (agency aidant) | Auto-lancer l’exercice courant puis « Visite terminée » |

## Responsive & Platform

- Aidant : mobile-first ; tablette ok en colonne unique.
- Pro / admins : desktop + tablette ; pas d’app native MVP.
- PWA installable aidant ; notifications + SMS secours (specs) hors détail UI ici.
