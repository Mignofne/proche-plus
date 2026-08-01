---
title: 'Éditeur de posts Community Semi'
status: final
created: '2026-08-01'
updated: '2026-08-01'
---

# PRD — Éditeur de posts Community Semi

## 0. Document Purpose

Ce PRD cadre l’amélioration de l’éditeur d’envoi de posts Community dans Proche+ (`/admin-produit/community/publications`). Public : fondateur / PM, puis UX, architecture et epics. Vocabulaire = Glossaire ; FRs à IDs stables ; `[ASSUMPTION]` indexées en §9. S’appuie sur l’éditeur et la preview existants (brouillon, canaux, overlays JSON, statut programmé) sans les redécrire comme produit fini. Détail mécanisme publish / compositing → `addendum.md`.

## 1. Vision

Proche+ doit composer, prévisualiser et publier des posts Community multi-photos avec le contrôle des comptes de référence (Carrousel Instagram type `avec_alan`) : Overlays (positions et tailles), Légende sous le post, Tags, Réseaux, créneau jour/heure — avant envoi réel.

Aujourd’hui Semi enregistre surtout des brouillons : upload téléphone faible, Preview peu fidèle au feed, Overlay carrousel via JSON brut, et « publier » qui ne fait que basculer un statut interne. Frustration #1 : pas de Preview live pour ajuster avant envoi.

La v1 livre un éditeur WYSIWYG mobile-friendly : médias depuis le téléphone, Overlay éditable, Légende feed, Preview Instagram-like, Programmation Europe/Paris, et Publication réelle vers les Comptes connectés — sous réserve du **gate publish** (§6.1).

## 2. Target User

### 2.1 Jobs To Be Done

- **Fonctionnel** — Composer un Post Carrousel (1–10 photos), poser le texte sur chaque Slide, écrire la Légende, tagger, choisir les Réseaux, programmer, envoyer.
- **Émotionnel** — Confiance avant envoi (« je vois ce que le public verra »).
- **Contexte** — Souvent téléphone (photos sur l’appareil), parfois desktop.
- **Marque** — Posts à la hauteur de la ligne Proche+ (ours, ton rassurant, Overlays lisibles).

### 2.2 Non-Users (v1)

- Aidants / patients / pros établissement.
- Community managers externes multi-clients.
- Auteurs du blog SEO Community (parcours séparé).

### 2.3 Key User Journeys

- **UJ-1. Mégane compose un Carrousel depuis son téléphone et l’ajuste en Preview.**
  - **Persona + context :** fondatrice Proche+, photos sur l’appareil, post du jour.
  - **Entry state :** authentifiée fondateur (`requireFondateur`), Nouveau post Community.
  - **Path :** upload 1–N photos → par Slide, place titre / sous-titre / footer (position + taille + couleur) → Légende → Tags → coche Instagram (et éventuellement autres) → Preview feed (média, actions, Preuve sociale, Légende, `n/N`).
  - **Climax :** Preview = intention ; elle change une taille de titre sans quitter l’écran.
  - **Resolution :** brouillon sauvé, prêt à programmer ou publier (ou rester brouillon Proche+).
  - **Edge case :** fichier trop lourd / format refusé / HEIC non converti → message clair ; autres Slides intactes.

- **UJ-2. Mégane programme un envoi réel multi-réseaux.**
  - **Persona + context :** post validé en Preview ; ≥1 Compte connecté live (gate §6.1).
  - **Entry state :** brouillon ou prêt ; comptes sociaux connectés.
  - **Path :** jour + heure Europe/Paris → confirme Réseaux / comptes → programme ou publie maintenant.
  - **Climax :** statut programmé / publié Proche+ **et** preuve d’envoi (ou échec nommé) par canal.
  - **Resolution :** liste publications à jour ; retry manuel des canaux en échec.
  - **Edge case :** token Meta expiré → « reconnecter le compte » ; canal non marqué publié.

## 3. Glossary

- **Semi** — Back-office fondateur Community (`/admin-produit/community/...`).
- **Post** — Unité éditoriale Community (classique, Carrousel ; kind vidéo existant hors critères d’acceptation de ce PRD).
- **Slide** — Une image du Carrousel, avec Overlays optionnels.
- **Carrousel** — Post multi-Slide (1 à 10) avec indicateur `n/N` en Preview.
- **Overlay** — Texte rendu **sur** une Slide (titre, sous-titre, footer), position + taille + couleur éditables.
- **Légende** — Caption plateforme **sous** le média dans le feed ; distincte des Overlays.
- **Preview** — Aperçu live type feed Instagram (header, média/Carrousel, barre d’actions, Preuve sociale, Légende).
- **Preuve sociale (Preview)** — Affordance statique simplifiée (ex. ligne « Liked by… ») ; pas de compteurs d’engagement réels.
- **Réseau** — Canal : Instagram, Facebook, Threads, TikTok.
- **Compte connecté** — Compte social lié à Proche+ autorisé pour Publication réelle.
- **Publication réelle** — Envoi API plateforme (≠ seul flag statut interne `published`).
- **Brouillon Proche+** — Sauvegarde / essai sans push plateforme.
- **Programmation** — Planification d’envoi (saisie Europe/Paris ; stockage instant UTC).
- **Statut canal** — État durable par Réseau ciblé : `pending` | `scheduled` | `published` | `failed`.
- **Asset publié** — Image(s) envoyée(s) à la plateforme avec Overlays déjà composés (texte « baked » dans le bitmap).
- **Tag** — Hashtag / mot-clé ; règles anti-PHI existantes (`validateEditableTags` et équivalents).
- **Bibliothèque médias** — Assets licence-ok en base Community (complément à l’upload).

## 4. Features

### 4.1 Upload médias téléphone + Carrousel

**Description:** L’opérateur ajoute des photos depuis l’appareil, réordonne les Slides, et peut réutiliser la Bibliothèque médias existante. `[ASSUMPTION: plafond Carrousel = 10 Slides.]` Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Upload multi-photos depuis l’appareil

L’opérateur fondateur peut sélectionner une ou plusieurs images depuis l’appareil. Realizes UJ-1.

**Consequences (testable):**
- Chaque image acceptée apparaît immédiatement comme Slide dans l’éditeur et la Preview.
- Format refusé → erreur par fichier ; Slides déjà valides inchangées.
- Fichier > **15 Mo** ou dimension max côté > **4096 px** → refus nommé ; autres Slides inchangées.
- **HEIC/HEIF** accepté en entrée et converti côté serveur en JPEG/WebP avant persistance (ou refus nommé si conversion indisponible).
- `[ASSUMPTION: formats canoniques persistés = JPEG, PNG, WebP.]`

#### FR-2: Gestion Carrousel (ordre, compte, indicateur)

L’opérateur peut réordonner, supprimer et voir `n/N` (max 10). Realizes UJ-1.

**Consequences (testable):**
- 11ᵉ Slide → refus explicite.
- Preview `n/N` = ordre persisté des Slides.
- 1 Slide reste valide.

#### FR-3: Réutilisation Bibliothèque médias

L’opérateur peut ajouter des Slides depuis la Bibliothèque médias existante (licence-ok). Realizes UJ-1.

**Consequences (testable):**
- Un asset bibliothèque sélectionné devient une Slide au même titre qu’un upload.
- `[ASSUMPTION: réutilise l’UI / modèle CommunityMediaAsset existant ; pas de nouveau moteur de recherche médias en v1.]`

### 4.2 Overlays sur image (positions et tailles)

**Description:** Par Slide, Overlays titre / sous-titre / footer avec position, taille et couleur — plus de JSON brut comme seul chemin. Realizes UJ-1.

**Functional Requirements:**

#### FR-4: Édition Overlay par Slide

L’opérateur édite texte, position (%), taille (échelle relative) et couleur (hex, modèle Semi actuel) par bloc. Realizes UJ-1.

**Consequences (testable):**
- Changement Overlay / Légende / ordre → Preview mise à jour **sans rechargement complet de page**.
- Overlays persistés avec le Post / les Slides.
- `[ASSUMPTION: v1 = trois blocs structurés, pas canvas libre multi-polices.]`

#### FR-5: Overlay indépendant de la Légende

Overlay et Légende sont des champs distincts. Realizes UJ-1.

**Consequences (testable):**
- Modifier la Légende ne modifie aucun Overlay.
- Post valide avec Overlays sans Légende ou Légende sans Overlay (sous réserve des règles d’envoi du Réseau).

#### FR-6: Composition Overlay → Asset publié

Avant Publication réelle, le système produit des Assets publiés où le texte Overlay est composé dans l’image (bake). Realizes UJ-1, UJ-2.

**Consequences (testable):**
- L’image envoyée à la plateforme contient le texte Overlay visible sans dépendre d’un calque texte natif Instagram.
- La Preview affiche le même rendu composé (ou un équivalent pixel-fidèle au bake).
- `[ASSUMPTION: bake serveur (ou équivalent déterministe) ; détail dans addendum.md.]`

### 4.3 Légende, tags, réseaux

**Description:** Légende feed, Tags, choix Réseaux / Comptes connectés. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-7: Légende sous le post

Saisie + Preview username + Légende sous la barre d’actions. Realizes UJ-1.

**Consequences (testable):**
- Preview : username + Légende sous les actions.
- Troncature visuelle « more » OK en Preview ; texte intégral à l’envoi.

#### FR-8: Tags et scan anti-PHI

Tags éditables ; mêmes règles anti-médical / PHI / établissement que l’existant. Le texte Overlay et la Légende passent le même filtre avant Publication réelle.

**Consequences (testable):**
- Tag / Overlay / Légende refusé → erreur nommée listant les termes rejetés.

#### FR-9: Choix des Réseaux et comptes

Sélection parmi Instagram, Facebook, Threads, TikTok + Comptes connectés. Realizes UJ-2.

**Consequences (testable):**
- Sans Réseau / compte → impossible de programmer ou déclencher une Publication réelle.
- Réseau incompatible avec le kind du Post (ex. TikTok sans vidéo) → désactivé ou refus nommé à l’envoi, jamais silence.
- `[ASSUMPTION: photo/Carrousel v1 prioritaire IG / FB / Threads ; TikTok uniquement si kind vidéo existant.]`

### 4.4 Preview live type feed

**Description:** Frustration #1 — Preview fidèle au feed Instagram (`avec_alan`). **Décision :** Preview v1 = **IG-first** (ratio portrait 4:5) ; autres Réseaux réutilisent le même cadre. Realizes UJ-1.

**Functional Requirements:**

#### FR-10: Preview live avant envoi

Preview visible sur le parcours de composition ; se met à jour sans reload complet. Realizes UJ-1.

**Consequences (testable):**
- Visible pendant la composition (panneau adjacent ou dessous sur mobile), pas seulement après save sur une autre URL.
- Navigation Slides (dots ou swipe) pour Carrousel.
- Cadre média Preview = **4:5** (IG-first).

#### FR-11: Hiérarchie visuelle feed

Ordre : média (+ Overlays) → barre d’actions → Preuve sociale (Preview) → Légende.

**Consequences (testable):**
- Aucun Overlay dans la zone Légende ; Légende jamais dessinée sur le média.

### 4.5 Programmation jour/heure

**Description:** Créneau d’envoi Europe/Paris. Realizes UJ-2.

**Functional Requirements:**

#### FR-12: Programmation Europe/Paris

L’opérateur saisit jour + heure en Europe/Paris. Realizes UJ-2.

**Consequences (testable):**
- Affichage opérateur libellé Europe/Paris ; persistance = instant UTC.
- Transition heure d’été/hiver : le créneau affiché reste l’heure murale choisie ; l’instant UTC stocké est recalculé selon les règles TZ.
- Créneau passé → refus ou confirmation « publier maintenant ».
- À l’heure dite, un worker / job déclenche la Publication réelle ; si le process est down, le Post reste `scheduled` et est repris au prochain passage (pas de disparition silencieuse).
- `[ASSUMPTION: un seul créneau par Post pour tous les Réseaux en v1.]`

### 4.6 Brouillon Proche+ et Publication réelle

**Description:** Deux intentions explicites : sauver en Brouillon Proche+ (sans push) vs Publication réelle. Remplace le seul flip `published` interne comme preuve de succès. Realizes UJ-2.

**Functional Requirements:**

#### FR-13: Brouillon Proche+ explicite

L’opérateur peut enregistrer / itérer sans déclencher d’envoi plateforme.

**Consequences (testable):**
- Action « Enregistrer brouillon » ne crée aucun appel API Réseau.
- UI distingue clairement brouillon vs publier / programmer.

#### FR-14: Publication réelle vers Comptes connectés

Publier maintenant ou à l’heure programmée vers les Comptes connectés. Realizes UJ-2.

**Consequences (testable):**
- Succès canal → preuve d’envoi (id / URL externe) + Statut canal = `published`.
- Échec canal → Statut canal = `failed` ; message actionnable ; pas de marquage publié sur ce canal.
- Gate §6.1 : sans ≥1 Compte connecté live pour un Réseau photo supporté, les actions publier/programmer restent désactivées avec explication.
- `[ASSUMPTION: API Meta Graph (IG/FB/Threads) ; TikTok API seulement si kind vidéo.]`

#### FR-15: État partiel multi-réseaux + retry manuel

Échec sur un Réseau n’annule pas les succès des autres. Retry = **manuel** (pas d’auto-retry MVP).

**Consequences (testable):**
- Détail Post montre Statut canal par Réseau.
- Retry ne republie pas les canaux déjà `published` (idempotence).
- Échec Programmation → alerte / statut visible fondateur ; pas de boucle auto.

#### FR-16: Accès fondateur

Seuls les opérateurs passant `requireFondateur` accèdent à composer / programmer / publier.

**Consequences (testable):**
- Accès non fondateur → refus (redirect / 403), aucun envoi.

## 5. Non-Goals (Explicit)

- Génération Studio Ours / `MASCOT_GEN` (parcours séparé, gated).
- Outil agence multi-marques.
- **Aucune nouvelle capacité vidéo en v1** — kind vidéo existant inchangé et hors critères d’acceptation de ce PRD.
- Auto-retry des échecs d’envoi ; A/B créatifs ; inbox ; analytics avancés.
- Publication depuis aidants / établissements.
- Remplacement du blog SEO.
- Preview multi-formats par Réseau (FB 16:9, etc.) — IG-first seulement.
- Canvas type Canva (polices illimitées, stickers).

## 6. MVP Scope

### 6.1 In Scope

- Upload téléphone (+ HEIC→JPEG/WebP) + Carrousel ≤ 10 + Bibliothèque existante
- Overlays (position / taille / couleur) + bake Asset publié + Légende
- Tags + scan PHI Overlay/Légende ; Réseaux / Comptes connectés
- Preview live IG-first 4:5
- Brouillon Proche+ explicite
- Programmation Europe/Paris (UTC stocké) + worker de reprise
- Publication réelle + Statut canal + retry manuel — **sous gate :**
  - **Gate publish :** FR-14 / SM-2 ne sont acceptés en prod que si **≥1 Compte connecté** Instagram ou Facebook est live. Sinon la v1 livre éditeur + Preview + brouillon / Programmation UI, avec publier réel désactivé jusqu’au branchement compte.

### 6.2 Out of Scope for MVP

- Canvas libre / stories & reels dédiés — `[NOTE FOR PM: revisiter si ligne éditoriale vidéo-first]`
- Collaboration multi-rédacteurs
- Crops automatiques avancés multi-réseaux au-delà du cadre IG 4:5 + fit existant
- Auto-retry / files d’attente sophistiquées

## 7. Success Metrics

**Primary**
- **SM-1** : Un Post Carrousel (médias + Overlays + Légende + ≥1 Réseau) composable et prévisualisable sans JSON manuel. Valide FR-4, FR-7, FR-10.
- **SM-2** : ≥1 Post avec Statut canal `published` **et** preuve d’envoi plateforme (gate §6.1 requis). Valide FR-14.

**Secondary**
- **SM-3** : L’opérateur n’utilise plus d’outil externe pour juger le rendu Overlay/Légende avant envoi (observation fondateur sur 5 Posts). Valide FR-10.

**Counter-metrics**
- **SM-C1** : Ne pas maximiser le nombre de Réseaux cochés si le taux de succès d’envoi baisse (contrebalance SM-2).
- **SM-C2** : Ne pas allonger le formulaire hors Preview (contrebalance SM-1).

## 8. Open Questions

1. **[owner: fondateur | non-bloquant UX]** Quel Compte connecté brancher en premier en prod (IG Business vs FB Page) pour lever le gate §6.1 ?
2. **[owner: architecture | non-bloquant PRD]** Limites exactes caption/hashtags par Réseau à encoder dans le validateur d’envoi (sources API courantes).
3. **[owner: architecture | deferred]** Stratégie d’idempotence détaillée (clés externes Meta) — principe posé en FR-15 ; mécanisme dans architecture.

## 9. Assumptions Index

- Carrousel max **10** Slides (§4.1).
- Persisté : **JPEG, PNG, WebP** ; HEIC converti (§4.1).
- Max fichier **15 Mo** ; max côté **4096 px** (§4.1).
- Bibliothèque = UI existante (§4.1).
- Overlays = **3 blocs** + couleur Semi + bake Asset publié (§4.2).
- Preview v1 = **IG-first 4:5** (§4.4).
- Photo/Carrousel prioritaire **IG / FB / Threads** ; TikTok si vidéo seulement (§4.3).
- Un créneau Programmation pour tous les Réseaux ; saisie **Europe/Paris**, stock **UTC** (§4.5).
- Retry = **manuel** ; Brouillon Proche+ explicite (§4.6).
- Publication réelle via **API** ; gate ≥1 Compte connecté IG/FB (§4.6, §6.1).
- Accès = **fondateur** uniquement (§4.6).
- Enjeu produit : **Proche+** via surface Semi.
