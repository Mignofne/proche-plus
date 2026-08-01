---
title: 'Éditeur de posts Community Semi'
status: draft
created: '2026-08-01'
updated: '2026-08-01'
---

# PRD — Éditeur de posts Community Semi

## 0. Document Purpose

Ce PRD cadre l’amélioration de l’éditeur d’envoi de posts Community dans Proche+ (`/admin-produit/community/publications`). Il sert le fondateur / PM, puis UX, architecture et epics. Vocabulaire ancré dans le Glossaire ; capacités groupées avec FRs numérotés stables ; inférences marquées `[ASSUMPTION]` et indexées en §9. Il s’appuie sur l’éditeur et la preview existants (brouillon, canaux, overlays JSON, programmation statut) sans les redécrire comme produit fini.

## 1. Vision

Proche+ doit pouvoir composer, prévisualiser et publier des posts Community multi-photos avec le même niveau de contrôle que les comptes de référence du secteur (carousel Instagram type `avec_alan`) : texte sur l’image (positions et tailles), légende sous le post, tags, choix de réseaux, et créneau jour/heure — le tout avant envoi réel.

Aujourd’hui l’outil Semi enregistre surtout des brouillons : upload téléphone faible, preview peu fidèle au feed, overlay carrousel via JSON brut, et « publier » qui marque un statut interne sans pousser vers les plateformes. La frustration #1 est l’absence d’une preview live pour ajuster avant envoi.

La v1 transforme ce parcours en un éditeur WYSIWYG mobile-friendly pour Proche+ : médias depuis le téléphone, overlay éditable, caption feed, preview Instagram-like, programmation Europe/Paris, et publication réelle vers les comptes connectés.

## 2. Target User

### 2.1 Jobs To Be Done

- **Fonctionnel** — Composer un post carousel (1–10 photos), poser le texte sur chaque slide, écrire la légende, tagger, choisir les réseaux, programmer, envoyer.
- **Émotionnel** — Confiance avant envoi (« je vois exactement ce que le public verra »).
- **Contexte** — Souvent depuis le téléphone (photos déjà sur l’appareil), parfois desktop pour peaufiner.
- **Social / marque** — Sortir des posts à la hauteur de la ligne éditoriale Proche+ (ours, ton rassurant, overlays lisibles).

### 2.2 Non-Users (v1)

- Aidants / patients / pros établissement (pas de surface Community publique pour eux).
- Community managers externes multi-clients (pas un outil agence générique).
- Création SEO blog Proche+ (parcours séparé).

### 2.3 Key User Journeys

- **UJ-1. Mégane compose un carousel depuis son téléphone et l’ajuste en preview.**
  - **Persona + context :** fondatrice Proche+, photos déjà dans l’appareil, besoin d’un post du jour.
  - **Entry state :** authentifiée fondateur, ouvre Nouveau post Community.
  - **Path :** upload 1–N photos → pour chaque slide, place titre / sous-titre / footer (position + taille) → écrit la Légende → tags → coche Instagram (et éventuellement autres) → voit la Preview feed (média, actions, caption, `n/N`).
  - **Climax :** la Preview correspond à l’intention ; elle ajuste une taille de titre sans quitter l’écran.
  - **Resolution :** brouillon sauvé, prêt à programmer ou publier.
  - **Edge case :** une photo trop lourde / format refusé → message clair, les autres slides restent.

- **UJ-2. Mégane programme un envoi réel multi-réseaux.**
  - **Persona + context :** même fondatrice, post validé en Preview.
  - **Entry state :** post en brouillon ou prêt, comptes sociaux connectés.
  - **Path :** choisit jour + heure (Europe/Paris) → confirme réseaux / comptes → programme ou publie maintenant.
  - **Climax :** statut programmé / publié côté Proche+ **et** confirmation d’envoi (ou échec explicite) par canal.
  - **Resolution :** calendrier / liste publications reflète l’état ; en cas d’échec partiel, elle peut retry le canal en échec.
  - **Edge case :** token Meta expiré → échec nommé « reconnecter le compte », post non marqué publié sur ce canal.

## 3. Glossary

- **Post** — Unité éditoriale Community (classique, carrousel ou vidéo) destinée aux Réseaux.
- **Slide** — Une image du Carrousel, avec ses Overlays optionnels.
- **Carrousel** — Post multi-Slide (1 à 10). Affiche un indicateur `n/N` en Preview.
- **Overlay** — Texte rendu **sur** une Slide (titre, sous-titre, footer ou blocs équivalents), avec position et taille éditables.
- **Légende** — Texte de description **sous** le média dans le feed (caption plateforme), distinct des Overlays.
- **Preview** — Aperçu live type feed (header compte, média/carousel, barre d’actions, likes, Légende) avant envoi.
- **Réseau** — Canal de diffusion : Instagram, Facebook, Threads, TikTok.
- **Compte connecté** — Compte social lié à Proche+ autorisé à recevoir une Publication réelle.
- **Publication réelle** — Envoi effectif vers le/les Réseaux via API des plateformes (pas seulement statut interne Proche+).
- **Programmation** — Planification d’envoi à une date/heure Europe/Paris.
- **Tag** — Hashtag / mot-clé éditorial attaché au Post (règles anti-PHI existantes conservées).
- **Bibliothèque médias** — Assets licence-ok déjà en base Community (complément à l’upload téléphone).

## 4. Features

### 4.1 Upload médias téléphone + Carrousel

**Description:** L’opérateur ajoute une ou plusieurs photos depuis le téléphone (ou le fichier local), réordonne les Slides, et peut aussi piocher dans la Bibliothèque médias. `[ASSUMPTION: plafond Carrousel = 10 Slides, aligné Instagram.]` Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Upload multi-photos depuis l’appareil

L’opérateur authentifié fondateur peut sélectionner une ou plusieurs images depuis l’appareil dans Nouveau post / édition. Realizes UJ-1.

**Consequences (testable):**
- Au moins une image uploadée apparaît immédiatement comme Slide dans l’éditeur et la Preview.
- Formats image supportés refusés → message d’erreur par fichier, sans perdre les Slides déjà valides.
- `[ASSUMPTION: formats v1 = JPEG, PNG, WebP ; vidéo hors scope éditeur photo sauf kind vidéo déjà existant.]`

#### FR-2: Gestion Carrousel (ordre, compte, indicateur)

L’opérateur peut réordonner, supprimer et voir le compteur `n/N` (max 10). Realizes UJ-1.

**Consequences (testable):**
- Tentative d’ajouter une 11ᵉ Slide → refus explicite.
- La Preview affiche `n/N` cohérent avec l’ordre des Slides.
- Un Post à 1 Slide reste valide (classique ou carrousel mono-slide).

### 4.2 Overlays sur image (positions et tailles)

**Description:** Sur chaque Slide, l’opérateur édite des Overlays (au minimum titre, sous-titre, footer) avec contrôle de position et de taille, dans l’esprit des posts Alan. Plus de saisie JSON brute comme seul chemin. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Édition Overlay par Slide

L’opérateur peut créer/modifier le texte Overlay d’une Slide et régler position + taille (et couleur si déjà supportée). Realizes UJ-1.

**Consequences (testable):**
- Un changement de position/taille se reflète dans la Preview sans rechargement complet de page (live ou quasi-live).
- Les Overlays sont persistés avec le Post / les Slides.
- `[ASSUMPTION: v1 = blocs structurés titre / sous-titre / footer avec position (%) et taille (échelle ou px relatif), pas un canvas libre illimité multi-polices.]`

#### FR-4: Overlay indépendant de la Légende

Le système traite Overlay et Légende comme deux champs distincts ; l’un peut être vide si l’autre est rempli (sous réserve des règles de publication par Réseau). Realizes UJ-1.

**Consequences (testable):**
- Modifier la Légende ne modifie aucun Overlay.
- Un Post peut avoir Overlays sans Légende ou Légende sans Overlay.

### 4.3 Légende, tags, réseaux

**Description:** Sous le média, l’opérateur rédige la Légende (caption feed), ajoute des Tags, et choisit les Réseaux / Comptes connectés. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-5: Légende sous le post

L’opérateur peut saisir et prévisualiser la Légende sous le média, avec le nom de compte en tête comme dans le feed. Realizes UJ-1.

**Consequences (testable):**
- La Preview montre username + Légende sous la barre d’actions.
- Texte long : troncature visuelle type « more » acceptable en Preview ; texte intégral conservé à l’envoi.

#### FR-6: Tags éditables

L’opérateur peut ajouter des Tags ; les règles anti-médical / PHI / établissement existantes restent appliquées.

**Consequences (testable):**
- Tag refusé → erreur nommée listant les Tags rejetés (comportement actuel conservé).

#### FR-7: Choix des Réseaux et comptes

L’opérateur sélectionne un ou plusieurs Réseaux parmi Instagram, Facebook, Threads, TikTok et les Comptes connectés associés. Realizes UJ-2.

**Consequences (testable):**
- Aucun Réseau / compte → impossible de programmer ou de déclencher une Publication réelle.
- `[ASSUMPTION: contraintes kind↔canal existantes (ex. TikTok vidéo) restent ; l’éditeur photo/carousel cible prioritairement IG / FB / Threads.]`

### 4.4 Preview live type feed

**Description:** Frustration #1. Avant envoi, une Preview fidèle au feed (réf. Instagram `avec_alan`) : média / carousel, indicateur `n/N`, barre d’actions, ligne de likes, Légende — et Overlays visibles sur le média. Realizes UJ-1.

**Functional Requirements:**

#### FR-8: Preview live avant envoi

L’opérateur voit une Preview qui se met à jour quand médias, Overlays, Légende ou ordre des Slides changent. Realizes UJ-1.

**Consequences (testable):**
- La Preview est visible sur le parcours de composition (même viewport ou panneau adjacent / dessous sur mobile), pas seulement après « Enregistrer brouillon » sur une autre URL.
- Navigation entre Slides dans la Preview (dots ou swipe) pour un Carrousel.

#### FR-9: Hiérarchie visuelle feed

La Preview respecte l’ordre : média (avec Overlays) → actions → preuve sociale simplifiée → Légende.

**Consequences (testable):**
- Aucun Overlay n’apparaît dans la zone Légende ; la Légende n’est pas dessinée sur le média.

### 4.5 Programmation jour/heure

**Description:** L’opérateur choisit un créneau d’envoi (date + heure) en Europe/Paris. Realizes UJ-2.

**Functional Requirements:**

#### FR-10: Programmation Europe/Paris

L’opérateur peut définir jour + heure de Programmation en fuseau Europe/Paris. Realizes UJ-2.

**Consequences (testable):**
- Créneau passé → refus ou confirmation explicite « publier maintenant ».
- Le créneau affiché à l’opérateur correspond à Europe/Paris (pas seulement UTC brut sans libellé).
- `[ASSUMPTION: un seul créneau par Post pour tous les Réseaux sélectionnés en v1.]`

### 4.6 Publication réelle

**Description:** « Envoyer » signifie Publication réelle vers les Comptes connectés, avec statut par canal et erreurs actionnables. Remplace le seul marquage `published` interne. Realizes UJ-2.

**Functional Requirements:**

#### FR-11: Publication réelle vers Comptes connectés

L’opérateur peut publier maintenant ou à l’heure programmée vers les Comptes connectés des Réseaux choisis. Realizes UJ-2.

**Consequences (testable):**
- Succès canal → identifiant / URL externe ou preuve d’envoi stockée ; statut canal = publié.
- Échec canal → Post non marqué publié sur ce canal ; message actionnable (ex. reconnecter).
- `[ASSUMPTION: v1 = intégration API plateformes (Meta Graph pour IG/FB/Threads ; API TikTok si kind vidéo) ; pas d’export manuel comme seul chemin de succès.]`

#### FR-12: État partiel multi-réseaux

Si plusieurs Réseaux sont ciblés, un échec sur l’un n’efface pas le succès des autres.

**Consequences (testable):**
- Liste publications / détail Post montre l’état par Réseau.
- Retry possible sur les canaux en échec sans republier les succès.

## 5. Non-Goals (Explicit)

- Génération d’images Studio Ours / `MASCOT_GEN` dans ce PRD (parcours séparé, déjà gated).
- Outil agence multi-marques / multi-clients.
- Éditeur vidéo timeline complet (le kind vidéo existant peut rester ; ce PRD priorise photo + carousel + texte).
- A/B testing de créatifs, inbox commentaires, analytics avancés.
- Publication automatique depuis les aidants ou les établissements.
- Remplacement du blog SEO Community.

## 6. MVP Scope

### 6.1 In Scope

- Upload téléphone multi-photos + Carrousel jusqu’à 10 Slides
- Overlays éditables (position/taille) + Légende sous le post
- Tags, choix Réseaux / Comptes connectés
- Preview live type feed Instagram
- Programmation jour/heure Europe/Paris
- Publication réelle avec statut par canal
- Conservations des garde-fous tags / droits témoignages existants

### 6.2 Out of Scope for MVP

- Canvas design libre type Canva (polices illimitées, stickers) — raison : complexité UX/tech disproportionnée
- Threads/IG stories & reels comme formats dédiés — `[NOTE FOR PM: revisiter si la ligne éditoriale bascule vidéo-first]`
- Collaboration multi-rédacteurs / validation workflow
- Auto-repost cross-network avec crops automatiques avancés au-delà des formats déjà gérés

## 7. Success Metrics

**Primary**
- **SM-1** : Un Post carousel complet (médias + Overlays + Légende + au moins un Réseau) est composable et prévisualisable sans JSON manuel. Valide FR-3, FR-5, FR-8.
- **SM-2** : Au moins un Post atteint le statut publié **avec** preuve d’envoi plateforme (pas seulement flag interne) en conditions réelles. Valide FR-11.

**Secondary**
- **SM-3** : Temps perçu « j’ajuste puis j’envoie » — l’opérateur n’a plus besoin d’un outil externe pour juger le rendu overlay/légende. Valide FR-8.

**Counter-metrics (do not optimize)**
- **SM-C1** : Ne pas maximiser le nombre de Réseaux cochés par Post au détriment du taux de succès d’envoi (contrebalance SM-2).
- **SM-C2** : Ne pas ajouter de champs éditoriaux qui allongent le formulaire sans passer par la Preview (contrebalance SM-1).

## 8. Open Questions

1. Quels Comptes connectés Proche+ sont déjà disponibles en prod pour un premier envoi API réel (IG Business / FB Page / etc.) ?
2. Faut-il un mode « brouillon Proche+ seulement » explicite à côté de Publication réelle, pour les essais sans push plateforme ?
3. Politique d’échec Programmation : retry auto vs alerte fondateur seule ?
4. La Preview doit-elle basculer de format selon le Réseau primaire (IG 4:5 vs FB) dès la v1, ou IG-first uniquement ?

## 9. Assumptions Index

- Carrousel max **10** Slides (§4.1).
- Formats image v1 : **JPEG, PNG, WebP** (§4.1).
- Overlays v1 = blocs **titre / sous-titre / footer** avec position + taille (pas canvas libre) (§4.2).
- Contraintes kind↔canal existantes conservées ; photo/carousel prioritaire IG/FB/Threads (§4.3).
- Un seul créneau de Programmation pour tous les Réseaux du Post (§4.5).
- Fuseau **Europe/Paris** (§4.5).
- Publication réelle via **API plateformes** + Comptes connectés (§4.6).
- Réseaux v1 ciblés : **Instagram, Facebook, Threads, TikTok** (avec limites kind) — confirmé « OK partout ».
- Enjeu produit : **Proche+** (surface Community Semi au service de la marque produit), pas un outil Semi-only jetable.
