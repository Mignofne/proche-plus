---
name: Proche+ Experience
description: Parcours aidant actionnable, pro avec progression éducative, admin établissement et admin produit multi-tenant.
status: final
sources:
  - docs/Proche+_Specs_Fonctionnelles_Architecture.md
  - docs/project-context.md
  - _bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/.memlog.md
  - _bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/DESIGN.md
updated: 2026-07-31
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
`VISITE → TRANSMISSION → MODE VISITE → ACTIONS AIDANT → FEEDBACK → ADAPTATION PRO → VISITE SUIVANTE`

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
| Transmission | Accueil / notif | Lire à retenir / essayer / éviter / revoir + compréhension |
| Choix de thème | Mode visite (entrée) | Choisir ce qu’on veut travailler aujourd’hui (S’habiller, Manger, Fauteuil…) |
| Mode visite | Après thème | Exercice adapté au niveau + consignes + actions |
| Action sur consigne | Mode visite | Réussi · Essai avec difficulté · Échec (ou actions legacy) |
| Fin de visite | Dernière étape mode visite | Clore ; expliquer que l’équipe s’en sert pour la suite |
| Feedback | Post-visite / rappel | Retour simple facultatif |
| Question | Accueil | Question ponctuelle au pro |
| Ressources | Accueil | Bibliothèque sans solliciter le pro |
| Onboarding | Première connexion | Comprendre / Apprendre / Pratiquer / Sécuriser + grands caractères |

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
| « Prenez votre temps » | « Dépêchez-vous, objectif du jour » |
| « Une étape à la fois — 2 sur 4 » | Écran fourre-tout sans prochaine action |
| Ton sobre sur doute / chute | Humour sur risque |
| « Message bien reçu » (mode sobre) | Clin d’œil radio sur sujet sensible |

Libellés d’outcome visite (matrice) **requis** : Réussi · Essai, avec difficulté · Échec.  
Libellés d’action legacy (transmission seule) : Réalisé avec succès · J’ai essayé · J’ai un doute · Demander de l’aide · Laisser une note.

## Component Patterns

Behavioral. Visuel dans `DESIGN.md.Components`.

| Composant | Règles |
|---|---|
| Sélecteur de thème | Entrée obligatoire du mode visite ; liste complète des thèmes actifs ; jamais auto-sélection silencieuse |
| Progress visite | Après le thème ; indique étape N/M ; ne remplace pas le CTA |
| CTA principal | Un seul au-dessus de la fold ; ≥ 48 px |
| Chip / bouton d’outcome | Par consigne ou en fin d’étape ; un outcome primaire à la fois |
| Timeline éducative | Lecture seule pour aidant (résumé simple) ; éditable / complète pour pro |
| GIR badge | Affiché côté pro comme **contexte** ; pas de sparkline d’évolution MVP |
| Action queue row | Tap → détail actionnable ; compteur si > 0 |
| KPI card | Valeur · cible · statut (sous / atteint) ; drill-down agrégé seulement |

## State Patterns

| État | Traitement |
|---|---|
| Transmission non lue | Badge pro + carte « Nouveau » aidant |
| Mode visite en cours | Progress + reprise à l’étape en cours |
| Consigne avec doute | Remonte au pro avant prochaine visite ; ton sobre |
| Feedback non répondu | Un seul rappel ; jamais bloquant |
| Famille invitée non activée | File admin établissement |
| Empty pro / admin | CTA concret (« Inviter un aidant », « Faire une transmission ») |
| Erreur réseau | Message clair + réessayer ; pas de perte silencieuse de note |

## Interaction Primitives

- **Hybride mode visite** : barre de progression + une action principale + « Suivant ».
- Tap only pour l’essentiel ; pas de swipe obligatoire.
- Synthèse vocale optionnelle sur consignes.
- Confirmation explicite (« J’ai compris ») pour messages de sécurité — pas de disparition auto.
- Retour toujours au même endroit / même libellé.

**Interdit MVP aidant** : chat libre type messagerie, multi-CTA concurrents, gamification.

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

### Flow A — Jean Martin (aidant), visite du dimanche

**Protagoniste** : Jean, 68 ans, conjoint de Marie, peu à l’aise avec le téléphone mais motivé.

1. Ouvre Proche+ → voit **une** carte claire : « Aujourd’hui : mode visite » (+ transmission non lue si besoin).
2. Lit la transmission (sections) → confirme compréhension (clair / doute).
3. Lance **Mode visite** → **choisit un thème** (ex. Fauteuil) parmi la liste — même s’il n’y a qu’un thème disponible, le choix reste explicite.
4. Voit l’exercice adapté (objectif, étapes au tutoiement, peut / ne doit pas) — ou un message « pas encore activé, parlez-en à l’équipe » si le pro n’a rien activé pour ce thème.
5. **Climax** : répond à « Comment ça s’est passé avec votre proche ? » → **Réussi / Essai / Échec** — *il comprend que ça sert à adapter la visite suivante*.
6. Fin de visite → message calme de confirmation.
7. J+1 : feedback optionnel en 2 taps.

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

## Inspiration & Anti-patterns

| S’inspirer de | Éviter |
|---|---|
| Parcours admin « inbox zéro » (actions d’abord) | Dashboard vanity metrics pour le soignant |
| Checklists visite terrain (étapes visibles) | App enfant / gamification sticker |
| Dossier éducatif partagé (consignes) | Second DPI / mesure GIR certifiante |

## Responsive & Platform

- Aidant : mobile-first ; tablette ok en colonne unique.
- Pro / admins : desktop + tablette ; pas d’app native MVP.
- PWA installable aidant ; notifications + SMS secours (specs) hors détail UI ici.
