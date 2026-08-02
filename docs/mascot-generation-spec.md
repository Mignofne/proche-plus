# Ours Proche+ — Spécification d’identité (Phase 0)

> **Statut :** décisions fondateur verrouillées + **Phase 1 Studio Ours** (mock) livrée — route `/admin-produit/community/studio-ours`.  
> **Phase produit :** **Phase 2 / Studio Ours** — évolution délibérée après le MVP Community kit-only (AD-11).  
> **Sources :** synthèse sans réinvention. Ce qui n’est pas documenté est marqué **AMBIGU** / **UNKNOWN**.

### Appeler pour une nouvelle photo / vidéo

Skill Cursor : **`bmad-studio-ours`** (`.agents/skills/bmad-studio-ours/`).

Dans une conversation, dire par exemple :

- `Studio Ours`
- `nouvelle photo ours — [situation]`
- `nouvelle vidéo ours — [situation]`

Le skill charge **cette spec** (§0bis + safeguards) + le master `public/community-assets/ours-canon/canon-c-v3.png`, puis génère.

UI produit (atelier in-app) : `/admin-produit/community/studio-ours`.

---

## 0. Contexte décisionnel (AD-11 → Studio Ours)

| Décision antérieure | État | Implication |
|---|---|---|
| **AD-11** — Illustrations ours first-class, **kit curaté uniquement au MVP** | `[ADOPTED]` | Pose pack SVG + compositing ; **pas** d’API gen (fal / Replicate / autre) dans le MVP Community |
| Générateur API illustrations | **Deferred** (hors MVP) | Explicitement « phase ultérieure » dans `ARCHITECTURE-SPINE.md` / `brand-ours.md` |
| **Studio Ours** (ce brief) | **Phase 2** proposée | Évolution AD-11 : atelier génératif ; **local-first plus tard** ; démarrage assisté / remote free tier / mock (fondateur sans ComfyUI) |
| **Canon gen stylisé full-body** | `[ADOPTED]` fondateur | Supersède le SVG plat `BearFace` comme référence de génération — voir §0bis |

**Conflit AD-11 (publication Community) — encore ouvert :**

1. **Parallèle :** Community MVP reste kit-only (AD-11 intact) ; Studio Ours = atelier fondateur hors chemin publication automatique.
2. **Révision AD-11 :** le générateur devient un chemin média Community (hybride ou remplacement).

→ Voir questions ouvertes §7.

---

## 0bis. Canon stylisé — **C-v3** (`[ADOPTED]` — GO final fondateur)

> **Verrouillé.** GO fondateur (« il est parfait ! ») — **C-v3** est le **canon officiel de génération**.  
> La référence de **génération** n’est **pas** le SVG plat `BearFace` (trop sous-stylé).  
> Base : **concept C** → **C-v2** (traits) → **C-v3** (sheet final).  
> `BearFace` / pose pack UI = crop du master **C-v3** (pictogramme in-app) — pas une source de génération distincte.

**Assets C-v3 (canon) :**

| Rôle | Chemin |
|---|---|
| Primary | `public/community-assets/ours-canon/canon-c-v3.png` |
| Master sheet (copie) | `public/community-assets/ours-canon/reference-sheet.png` *(= C-v3)* |
| Archive | `canon-c-v2.png` *(itération précédente)* |
| Preuve cohérence | `public/community-assets/ours-canon/declinaison-fauteuil.png` — déclinaison fauteuil **validée** (échantillon de preuve, hors protocole 10 scènes) |

### Traits mandatory — identité face / corps (**LOCKED**, ne pas varier)

| Trait | Règle |
|---|---|
| Base visuelle | **Concept C** → **C-v3** (`[ADOPTED]`) |
| Espèce / pelage | **Ours brun** — famille `#8B5E3C` / `#6B4423` |
| Silhouette | **Dodu**, **corps entier** (pas tête seule pour le sheet gen) |
| Personnalité | **Espiegler / joyeux**, regard **malicieux** (pas infantile emoji) |
| Marque d’âge | **Mèche blanche** (~**60 ans**) + **petites pattes d’oie** (rides aux coins des yeux) |
| Sourcil | **Mono-sourcil** brun, type Frida Kahlo |
| Rendu | **Texture peluchée**, **illustré** (pas photoréalisme animalier brut) |
| Accents marque | **Oui** — teal / soleil / terracotta / cream là où pertinent |
| Vues sheet | Face, ¾, profil + **3–4 émotions** — **OK** |

### Vêtement — gilet (canon C-v3)

| Élément | Règle | Statut |
|---|---|---|
| Pièce | **Gilet** (waistcoat) — élégance « à l’anglaise » | **LOCKED** (présence du gilet) |
| Motifs défaut C-v3 | **Gilet crème** + **fleurs mexicaines** | Défaut sheet C-v3 |
| Nœud papillon | **Aucun** — **pas** de nœud / bow tie | **LOCKED** (interdit) |
| Motif du gilet | **VARIABLE** — swappable / fun par scène ou campagne | Voir §2.2 |

> **Séparation identité / vêtement :** face + corps + silhouette + traits (mèche, mono-sourcil, pattes d’oie, regard) = **IDENTITY locked**.  
> Le **motif / pattern du gilet** peut changer (scène, saison, campagne) sans changer le personnage.

### Strict IP (mood refs ≠ personnage)

Mood boards fournis (WhatsApp / Cursor assets, copies dans `docs/mascot-mood-refs/`) servent **uniquement** à l’ambiance : plumpness, peluche, lumière studio.

- **Interdit** de copier ou dériver **Lotso** (*Toy Story*) ou **Winnie the Pooh**.
- Personnage **100 % original Proche+** uniquement.
- Voir `docs/mascot-mood-refs/README.md`.

### Scènes multi-personnages & posture — **LOCKED** (fondateur)

| Règle | Détail | Statut |
|---|---|---|
| **Aucun humain** | Jamais de personne ni silhouette humaine dans les scènes générées | **LOCKED** |
| Compagnons | Aidant / interlocuteur / partenaire d’exercice = **un autre ours Proche+** uniquement (même identité face/corps C-v3) | **LOCKED** |
| **Deux ours+ — gilets** | **Primaire** (patient / héros) = gilet crème **fleurs mexicaines** C-v3. **Compagnon** (aidant / second) = **même face/corps**, gilet **neutre** uni crème/beige (soft solid) — **aucun** motif floral mexicain | **LOCKED** |
| **Jamais par terre** | Dignité & sécurité rééducation — pas d’ours assis / à genoux / allongé au sol | **LOCKED** |
| Siège | Ours **assis sur un siège** : chaise, fauteuil, canapé, bord de lit, fauteuil roulant, etc. | **LOCKED** |
| Supports d’exercice | Jeux, cartes, objets d’activité **sur une table** — **jamais** au sol / sur le tapis | **LOCKED** |

### Safeguards contenu & ton — **LOCKED** (fondateur)

> Appliqués à **toute** génération Studio Ours / scènes referentiel. Validation client + serveur (`src/lib/community/mascot-gen/safeguards.ts`).

| # | Règle | Statut |
|---|---|---|
| S1 | **Jamais** vulgaire, sexuel, érotique, suggestif ou à double sens | **LOCKED** |
| S2 | Ton rééducation / éducation : **respectueux, chaleureux, espérant** | **LOCKED** |
| S3 | **Aucune** violence, gore, humiliation | **LOCKED** |
| S4 | **Aucun** sensationnalisme de traumatisme médical | **LOCKED** |
| S5 | Rating **family-safe** — aucun contexte sexualisé (y compris « mineurs » ; N/A ours mais garde-fou explicite) | **LOCKED** |
| S6 | Canon **C-v3** uniquement ; identité face/corps fixe ; motif gilet VARIABLE (solo) ; **pas** de nœud | **LOCKED** |
| S7 | Compagnons = **autres ours Proche+** uniquement — **jamais** d’humains | **LOCKED** |
| S8 | **Jamais par terre** — siège / fauteuil / canapé / lit / table uniquement | **LOCKED** |
| S9 | Scène **≥2 ours** : primaire = gilet **fleurs mexicaines** ; compagnon(s) = gilet **neutre** uni (pas de floral mexicain) | **LOCKED** |

**Rejet :** toute intention (situation / émotion / lieu / free text) qui viole S1–S9 est **bloquée** avec message FR côté client et côté server action — pas de prompt envoyé au provider.

### Tooling fondateur (verrouillé)

| Point | Décision |
|---|---|
| Setup local fondateur | **Rien** (pas de ComfyUI) — besoin d’accompagnement |
| Cible long terme | Local-first possible **plus tard** |
| Démarrage | Génération **assistée** / **remote free tier** / **mock** avant pipeline local |

### Gate Phase 0.5 → C-v3 — **COMPLETE**

- Sheet **C-v3** (`canon-c-v3.png` / `reference-sheet.png`) **`[ADOPTED]`** — GO fondateur.
- Déclinaison `declinaison-fauteuil.png` = **preuve de cohérence** validée.
- **Prochaine étape :** protocole **10 scènes** (§8), puis Studio Phase 1 (mock).

> **Note protocole de cohérence (scènes) :** le jeu de validation opérationnel utilise les **8 thèmes d'exercices référentiel** (`prisma/seed-exercises.ts`) — S'habiller, Manger, Se déplacer, Fauteuil, Toilette / hygiène, Mobilité au lit, Communication, Mémoire / attention — livrés sous `public/community-assets/ours-canon/scenes-referentiel/`. Ce ne sont **pas** des scènes lifestyle génériques (café, vacances, etc.). Le plan « 10 scènes » CAP-9/brand au §8 reste un cadre de score historique ; la preuve cohérence Phase 0.5 s'appuie sur ces 8 scènes référentiel.

---

## 1. Sources de vérité (chemins)

| Priorité | Asset / doc | Rôle |
|---|---|---|
| **Canon gen C-v3** | `public/community-assets/ours-canon/canon-c-v3.png` (+ `reference-sheet.png`) | **Référence officielle génération** — `[ADOPTED]` |
| Preuve cohérence | `public/community-assets/ours-canon/declinaison-fauteuil.png` | Déclinaison fauteuil validée |
| Index canon | `public/community-assets/ours-canon/README.md` | C-v3 locked, traits locked / variables |
| Mood only | `docs/mascot-mood-refs/*` | Plump / plush / studio light — **pas** IP à cloner |
| **UI in-app seulement** | `src/components/mascot/BearFace.tsx` | Pictogramme SVG plat produit — **pas** master gen |
| Wrapper UI | `src/components/mascot/Mascot.tsx` | Disque cream/sun/terracotta + `aria-label` pose |
| Brand Community | `_bmad-output/specs/spec-fondateur-community/brand-ours.md` | Identité, style lock, scénarios CAP-9 |
| Contexte produit | `docs/project-context.md` | « Ours brun adulte, débonnaire et rassurant (jamais infantile) » — à réconcilier avec ton espiègle/joyeux du nouveau canon |
| UX Design | `_bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/DESIGN.md` | Palette + règles mascotte |
| UX Experience | `…/EXPERIENCE.md` | **Pas** de détail mascotte (parcours métier) |
| Pose pack | `public/community-assets/bear-pose-pack/*` + `provenance.json` | Miroirs SVG Face (v1.2.0) — kit UI / Community MVP |
| Scénarios / garde-fous | `src/lib/community/illustrations.ts` | `POSE_PACK`, `BEAR_SCENARIO_SEED`, `EDITORIAL_GUARDS_FR` |
| Architecture | `_bmad-output/planning-artifacts/architecture/architecture-fondateur-community-2026-07-31/ARCHITECTURE-SPINE.md` § AD-11 | Kit-only MVP + gen Deferred |
| Surfaces | `_bmad-output/specs/spec-fondateur-community/surfaces.md` | « Illustrations ours (pose pack) » — pas de générateur au MVP |

---

## 2. Identité — mandatory vs variable

### 2.1 Mandatory (ne pas varier sans décision fondateur)

| Élément | Règle documentée | Preuve |
|---|---|---|
| Marque d’âge | Ours **brun** ; maturité ~**60 ans** — **mèche blanche** + **pattes d’oie** discrètes | §0bis C-v3 |
| Silhouette gen | **Dodu**, **corps entier** sur le character sheet | §0bis fondateur |
| Ton gen | **Espiegler / joyeux**, regard **malicieux** — **jamais** infantile / emoji jouet ; rester compagnon rassurant (réconcilier avec brand « débonnaire ») | §0bis + brand-ours |
| Traits face gen | **Mono-sourcil** brun (Frida-like) ; **pattes d’oie** discrètes ; texture **peluchée** illustrée | §0bis C-v3 |
| Style gen | Illustré ; **gilet** (élégant à l’anglaise) ; **sans** nœud papillon | §0bis C-v3 |
| Identité face/corps | Silhouette, face, mèche, mono-sourcil, pattes d’oie, regard — **ne pas varier** | §0bis C-v3 |
| Rôle | Compagnon / repère émotionnel — **ne** remplace **ni** aidant **ni** professionnel ; pas d’autorité clinique | brand-ours |
| Palette pelage principale | `#8B5E3C` (fur) + `#6B4423` (deep / oreilles externes) — **contrainte marque oui** | DESIGN, brand-ours, §0bis |
| Accents marque | Teal `#2A9D8F` · Soleil `#F5C842` · Terracotta `#C67B5C` · Cream `#FAF7F2` — **oui** où pertinent | brand-ours, DESIGN, §0bis |
| Poses autorisées (kit UI MVP) | Accueil, encouragement, patience, célébration, vigilance, curiosité/question — **uniquement** ces six | brand-ours, BearFace `MascotPose`, pose pack |
| Sheet gen vues | Face, ¾, profil + 3–4 émotions | §0bis fondateur — **OK** |
| Interdits éditoriaux | PHI ; geste médical / soin ; humour sur maladie / chute / échec / vulnérabilité ; personne identifiable **sans** CAP-11 ; ton donneur de leçon | brand-ours, AD-11, EDITORIAL_GUARDS_FR |
| Safeguards contenu | Vulgaire / sexuel / suggestif / double sens ; violence / gore / humiliation ; traumatisme médical sensationnalisé ; hors family-safe | §0bis S1–S5 |
| Strict IP | Pas de clone Lotso / Winnie ; mood refs = ambiance seule | §0bis, `docs/mascot-mood-refs/` |
| Compagnons scènes | **Aucun humain** — autre(s) ours Proche+ C-v3 uniquement | §0bis LOCKED fondateur |
| Gilets multi-ours | Primaire = floral mexicain ; compagnon = gilet neutre uni | §0bis S9 LOCKED fondateur |
| Posture scènes | **Jamais par terre** — siège + jeux/cartes **sur table** | §0bis LOCKED fondateur |
| Continuité produit UI | L’app garde `BearFace` / `Mascot` comme **icône** ; la gen Community/Studio suit le **sheet C-v3** | §0bis + brand fil de continuité |

### 2.2 Variable (dans le cadre d’une scène / pose / campagne)

| Élément | Ce qui peut changer | Bornes |
|---|---|---|
| **Motif du gilet** | Patterns / fleurs / couleurs du **waistcoat** — swappable, fun (ours **seul**) | Gilet **toujours** présent ; **jamais** de nœud papillon ; face/corps inchangés. Si **≥2 ours** : primaire = floral mexicain ; compagnon = **neutre uni** (S9) |
| Pose / expression | Les 6 poses : sourcils, bouche, tilt tête, props discrets | Voir §4 |
| Rôle narratif | Compagnon / Guide / Cameo / Héros (scénarios CAP-9) | Cartes `BEAR_SCENARIO_SEED` |
| Présence | Ours **optionnel** sur un contenu (CAP-9) | Spec CAP-9 |
| Mise en scène | Fond cream, silhouettes symboliques, overlays texte courts | brand-ours « mises en scène » |
| Format sortie | Carré post, still TikTok, overlay Remotion, couverture blog | surfaces / AD-11 |
| Intensité props | Check teal, confetti soleil, « ? », hint terracotta — **liés à la pose** | BearFace |

### 2.3 Couleurs complètes (code) vs tables brand

Documentées dans **BearFace** / `provenance.styleLock.palette` mais **absentes** de la table brand-ours « Couleurs » :

| Hex | Usage dans BearFace | Statut spec |
|---|---|---|
| `#A67B5B` | Intérieur oreilles | Mandatory *de fait* (code) — **AMBIGU** si on peut les éclaircir/assombrir en gen |
| `#C4A484` | Museau / snout | Idem |
| `#3D2B1F` | Nez + trait bouche | Idem |
| `#2D1F14` | Yeux | Idem |
| `#5C3A21` | Sourcils | Idem |
| `#6B5344` | Highlight nez (opacity 0.5) | Idem |
| `#F5EDE4` | Catchlights yeux | Idem — proche cream, pas `#FAF7F2` |
| `#E0A820` | Confetti celebrate (1/3) | Accent sun-dark (DESIGN) |

---

## 3. Proportions & construction

### 3.1 UI icon (`BearFace` — tête seule, pas master gen)

Source : `BearFace` viewBox `0 0 100 100` — **pictogramme produit uniquement**.

| Partie | Géométrie (approx.) | Notes |
|---|---|---|
| Oreilles | Ellipse cx 22/78, cy 28, rx 12 ry 11 ; intérieur rx 6 ry 5.5 | Brun profond + intérieur clair |
| Tête | Ellipse cx 50 cy 52, rx 34 ry 32 | Légèrement plus large que haute |
| Museau | Ellipse cx 50 cy 60, rx 16 ry 13 | Crème `#C4A484` |
| Nez | Ellipse cx 50 cy 56, rx 6 ry 4.5 | Brun très foncé |
| Yeux | Cercles r≈3.2 à (38,46) et (62,46) + catchlight | Calmes, pas grands « cartoon bébé » |
| Style rendu actuel | **SVG plat** (aplats + traits) | Pas de fur réaliste / photoréalisme |

**Corps entier (gen) — verrouillé :** le character sheet gen est **full-body dès le départ** (§0bis C-v3). Proportions exactes (hauteur tête/corps, membres) = **à extraire du sheet C-v3** pour les prompts IDENTITY.

**UI vs gen :** le SVG `BearFace` reste **tête seule** pour l’icône in-app. Il **n’est plus** la référence de fidélité gen.

**Style gen — verrouillé sur C-v3 :** cible **illustrée peluchée** (pas SVG plat) ; gilet crème fleurs mexicaines défaut.

---

## 4. Expressions & poses autorisées

### 4.1 Mapping canonique

| Clé Community (pose pack) | `MascotPose` | Label FR | Signaux face (BearFace) |
|---|---|---|---|
| `accueil` | `welcome` | Ours d’accueil | Sourcils neutres ; bouche sourire léger ; pas de prop |
| `encourage` | `encourage` | Ours qui encourage | Tilt +4° ; sourire un peu plus ouvert ; **badge check teal** |
| `patience` | `patience` | Ours qui patiente | Bouche presque plate ; **ombre douce** bas (cy 78) |
| `celebration` | `celebrate` | Ours qui célèbre | Tilt −3° ; bouche plus ouverte ; **confetti soleil** |
| `vigilance` | `vigilance` | Ours vigilant | Sourcils « alertes » ; bouche plate ; **losange terracotta** haut |
| `curiosite` | `question` | Ours curieux | Tilt −8° ; sourcil asymétrique ; bouche petite ; **« ? » teal** |

Défaut si clé inconnue : `encourage` (`toMascotPose`).

### 4.2 Poses / expressions **interdites** (documentées)

- Emoji / peluche enfantine, proportions infantiles
- Agitation, grimaces, performances exagérées
- Gestes simulant un **soin** ou un **geste médical**
- Humour sur maladie, chute, échec, vulnérabilité
- Trophées / promesses de résultat clinique
- Personnes identifiables sans attestation CAP-11
- Photoréalisme **humain identifiable** (négatif post-MVP brand-ours)

### 4.3 Ambiguïtés poses

| Sujet | Statut |
|---|---|
| « Ours écoute » (beat `ours-temoignage`) | **AMBIGU** — pas de pose dédiée ; seed mappe `patience` + `accueil` |
| Nouvelles poses hors pack (ex. « marche », « assis de profil ») | **Interdit** au kit MVP ; pour Studio Ours = **UNKNOWN** (étendre le pack ou non) |
| Props (check / confetti / ? / hint) | **AMBIGU** en gen : obligatoires pour reconnaître la pose, ou expression seule suffit ? |
| Corps + bras / pattes | **UNKNOWN** |

---

## 5. Variations interdites (checklist Studio)

Toute génération **hors** style lock doit être rejetée (qualité / revue) :

1. Ours **enfant**, chibi, kawaii, teddy, emoji 🧸  
2. Pelage hors famille brune documentée (ex. noir « grizzly photoréaliste », blanc polaire, rose) — sauf décision fondateur  
3. Yeux surdimensionnés / larmes dramatiques / dents visibles agressives  
4. Uniforme médical, stéthoscope, seringue, lit d’hôpital, geste de soin  
5. Texte PHI, codes GIR, noms patients, établissements réels non autorisés  
6. Humains photoréalistes ou visages reconnaissables **sans** CAP-11  
7. Ton moralisateur / « professeur » en surplomb  
8. Décor clinique froid dominant (sauf prudence douce terracotta **discrète**)  
9. Remplacer la mascotte produit par un autre animal / logo générique  
10. **Clone / pastiche** Lotso, Winnie the Pooh, ou autre IP tierce (même « inspiré de »)  
11. Omettre mèche blanche, mono-sourcil, pattes d’oie, ou corps entier sur le sheet canon  
12. Traiter le SVG plat `BearFace` comme master gen (interdit — UI only)  
13. Ajouter un **nœud papillon** / bow tie (interdit C-v3 / lignée C)  
14. Retirer le **gilet** ou changer face/corps en même temps qu’un swap de motif gilet (identité ≠ vêtement)  
15. Inclure un **humain** ou une **silhouette humaine** (compagnon = autre ours Proche+ uniquement)  
15b. Scène **≥2 ours** avec **deux gilets floraux mexicains** (compagnon doit porter un gilet **neutre** uni)  
16. Placer l’ours **par terre** (sol / tapis) — siège obligatoire ; jeux/cartes **au sol** (table obligatoire)  
17. Scène **vulgaire, sexuelle, érotique, suggestive** ou à **double sens**  
18. **Violence**, **gore**, **humiliation**  
19. **Sensationnalisme** de traumatisme médical  
20. Contenu hors rating **family-safe** (contexte sexualisé, y compris mineurs)  

---

## 6. Assets de référence (chemins)

```
public/community-assets/ours-canon/         # CANON GEN C-v3 [ADOPTED]
  README.md
  canon-c-v3.png                            # Primary — master C-v3
  reference-sheet.png                       # Copie / alias master C-v3
  declinaison-fauteuil.png                  # Preuve cohérence (validée)
  canon-c-v2.png                            # Archive itération précédente
  canon-face.png / canon-front.png          # Concepts A/B — archivés / non-canon
  index.html

docs/mascot-mood-refs/                      # Mood plump/plush/studio ONLY — NOT character IP
  README.md
  mood-whatsapp-01.png … 03.png

src/components/mascot/BearFace.tsx          # UI icon face + poses — NOT gen master
src/components/mascot/Mascot.tsx            # Cadre UI produit
public/community-assets/bear-pose-pack/
  provenance.json                           # v1.2.0, styleLock, mascotMap
  accueil.svg … curiosite.svg               # Kit Community MVP / miroirs UI
src/lib/community/illustrations.ts          # POSE_PACK + scénarios + guards
_bmad-output/specs/spec-fondateur-community/brand-ours.md
docs/project-context.md
_bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/DESIGN.md
```

Cursor assets (source mood, hors repo produit) :  
`C:\Users\mgomes\.cursor\projects\c-PERSO-Git-proche\assets\` (WhatsApp + autres images chat).

Note runtime Community : les previews rendent `<Mascot>` / `<BearFace>` React ; les SVG pack sont miroirs / legacy (`provenance.notes`).

---

## 7. Questions ouvertes — must-ask fondateur

**Clos / supersédés par §0bis C-v3 `[ADOPTED]` :** GO sheet final ; corps entier ; style gen ≠ SVG plat ; tooling immédiat ; **vêtement** = gilet crème + fleurs mexicaines défaut, **sans** nœud ; **pattes d’oie** ; motif gilet **VARIABLE** ; identité face/corps **LOCKED** ; base = concept **C** ; déclinaison fauteuil = preuve cohérence.

**Encore ouverts (prioritaires) :**

1. ~~**Humains multi-personnages**~~ — **CLOS** : **aucun humain** ; compagnons = **autres ours Proche+** uniquement (§0bis LOCKED).  
2. **AD-11 publication :** Studio = atelier **parallèle** (kit-only MVP) ou **amendement** (hybride kit + gen) ?  
3. **Props de pose** (check teal / confetti / « ? ») : marqueurs **obligatoires** en gen ou expression seule ?  
4. **Gate bibliothèque :** revue fondateur **toujours** obligatoire avant `CommunityMediaAsset` ?

---

## 8. Plan de validation cohérence — 10 scènes (sans générer encore)

**Prérequis :** ✅ sheet **C-v3** `[ADOPTED]` + preuve `declinaison-fauteuil.png`. Phase 0.5 **complète**.

**Prochaine action :** exécuter le protocole **10 scènes** ci-dessous pour mesurer si **le même ours** traverse 10 mises en scène, puis Studio Phase 1 (mock).

### 8.1 Jeu de 10 scènes proposées (dérivées CAP-9 / brand)

| # | Scène | Pose cible | Contrainte scène |
|---|---|---|---|
| 1 | Accueil fond cream seul | `accueil` | Ours centré, aucun humain |
| 2 | Encouragement + petit pas | `encourage` | Prop check ou équivalent lisible |
| 3 | Patience / « pas tout faire » | `patience` | Calme, pas d’agitation |
| 4 | Célébration essai | `celebration` | Soleil / confetti discrets — pas trophée |
| 5 | Vigilance / demander à l’équipe | `vigilance` | Accent terracotta discret |
| 6 | Curiosité tip visite | `curiosite` | Tête penchée / « ? » |
| 7 | Lien / conversation — 2 ours | `accueil` ou `patience` | **Deux ours Proche+** sur sièges ; primaire = floral ; compagnon = gilet neutre ; supports sur table ; **aucun** humain |
| 8 | Cameo témoignage (écoute) | `patience` | Deuxième ours interlocuteur ; sièges ; **aucun** humain |
| 9 | Héros vision / mission | `accueil` | Ours dominant, message secondaire |
| 10 | Format still TikTok (9:16 crop) | `encourage` | Lisibilité senior : ours secondaire au texte overlay **simulé** |

**AMBIGU :** le fondateur peut remplacer 7–10 par d’autres beats CAP-9 ; le nombre **10** et la **grille de score** restent.

### 8.2 Grille de score (par scène, 0–2)

| Critère | 0 | 1 | 2 |
|---|---|---|---|
| Âge / ton | Infantile / emoji / clone IP | Ambigu | Mature (mèche + pattes d’oie), espiègle/joyeux, malicieux |
| **Palette pelage** | Hors famille brune | Proche mais dérive | `#8B5E3C` / `#6B4423` (+ snout/oreilles cohérents) |
| **Reconnaissance face** | Autre ours / IP tierce | Ressemble | Même sheet (mono-sourcil, mèche, pattes d’oie, museau, regard) |
| **Pose lisible** | Mauvaise pose | Pose vague | Pose cible claire (+ props si exigés) |
| **Interdits** | Violation (médical / PHI / humain ID) | Zone grise | Clean |
| **Continuité cross-scène** | Personnage différent | Léger drift | Même « acteur » que scènes 1–N |

Score scène = somme (max 12). **Seuil proposé (à valider fondateur) :** ≥ 10/12 par scène et **aucune** note 0 sur Interdits / Âge.

### 8.3 Score de cohérence globale (après les 10)

- Moyenne des scores scènes  
- **Drift palette :** écart perçu pelage entre scène 1 (référence) et scènes 2–10 (pass/fail qualitatif fondateur)  
- **Drift facial :** checklist oreilles / museau / yeux (pass si ≥ 8/10 scènes « même face »)  
- **Verdict :** `GO bibliothèque` / `NO-GO — retune IDENTITY prompts` / `NO-GO — revenir Phase 0.5 (sheet)`

### 8.4 Qui score

Revue **fondateur** (humain) obligatoire avant passage bibliothèque — aligné brand-ours post-MVP. Pas d’auto-approve Phase 2 v1.

### 8.5 Artefacts de test (plus tard)

- Dossier versionné des 10 sorties + prompts / seeds / provider  
- Fiche score remplie  
- Lien éventuel `CommunityMascotGeneration` (voir archi)

---

## 9. Hors scope / livré

| Élément | État |
|---|---|
| Spec + archi + safeguards docs | ✅ |
| Phase 1 : `ImageGenerationProvider` mock + UI `/studio-ours` + prompts runtime | ✅ |
| Validation safeguards client + serveur | ✅ |
| Providers remote / local réels | Hors scope Phase 1 (stubs plug-in ready) |
| Choix définitif checkpoint / LoRA | Hors scope |
| Amendement formel AD-11 dans ARCHITECTURE-SPINE | Après réponse fondateur |
| Commit git | Sur demande explicite seulement |

---

## 10. Document compagnon

Architecture pipeline proposée : [`docs/mascot-generation-architecture.md`](./mascot-generation-architecture.md).
