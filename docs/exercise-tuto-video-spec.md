# Vidéos tuto exercices — Spécification Proche+

> **Statut :** `[ADOPTED]` fondateur — v1  
> **Skill Cursor :** `bmad-exercice-tuto`  
> **Composition Remotion :** `ProchePlusExerciseTuto` (9:16) · `ProchePlusExerciseTutoFacebook` (16:9)  
> **Source exercices :** `docs/referentiel/Referentiel_Exercices.csv`  
> **Ours :** canon C-v3 — `docs/mascot-generation-spec.md` §0bis

---

## 1. Intent

Produire une **vidéo tuto MP4 par exercice** du référentiel, invocable à la demande (« vidéo tuto Top chrono 15 », « tuto exercice Enfiler son gilet »).

Chaque étape du référentiel = **une consigne verbale EN GROS** (lisible aidant / senior ~60 ans) + **démo ours** animée (flipbook keyframes).

Inspiré des tutos fitness type DEMIC : **texte dominant + démonstration visuelle**, pas de petit sous-titre illisible sur mobile.

---

## 2. Appeler la spec

Dans Cursor :

```
vidéo tuto exercice Top chrono 15
tuto exercice Enfiler son gilet
bmad-exercice-tuto
```

Le skill :

1. Charge l’exercice dans `Referentiel_Exercices.csv`
2. Génère une image ours **par étape** (canon C-v3)
3. Assemble `ProchePlusExerciseTuto` → MP4
4. Dépose les assets sous `public/community-assets/exercise-tutos/{slug}/`

---

## 3. Layout vidéo (verrouillé)

Format **9:16** (mobile aidant) par défaut.

```
┌─────────────────────────────┐
│ Proche+      Thème · A · p1 │  méta 28px
│                             │
│   [ Étape 2 / 5 ]           │  badge 34px
│                             │
│  « Pose le gilet sur tes    │  consigne 48–58px
│     genoux, l'intérieur     │  gras, contraste élevé
│     vers toi. »             │
├─────────────────────────────┤  ~38 % hauteur
│                             │
│      DÉMO OURS              │  image plein cadre
│      (flipbook / pose)      │  ~62 % hauteur
│                             │
└─────────────────────────────┘
```

### Typographie (1080×1920)

| Élément | Taille px | Poids |
|---|---|---|
| Consigne verbale (étape) | **58** (min 48 si long) | 800 |
| Nom exercice (intro) | 40 | 800 |
| Badge étape | 34 | 800 |
| Méta thème/niveau | 28 | 700 |
| Objectif (intro) | 32 | 600 |

Couleurs : texte `#2D2A26` sur fond `#F3EDE4` ; accent marque teal `#2A9D8F`.

**Règle lisibilité :** jamais sous 48px pour la consigne principale ; couper en 2 lignes max via `splitInstructionForDisplay`.

---

## 4. Structure temporelle

| Segment | Frames défaut (30 fps) | Contenu |
|---|---|---|
| Intro | 90 (~3 s) | Nom + objectif + 1re image ours |
| Étape *n* | **75** (~2,5 s) | Consigne XL + démo ours (pose *n*) |
| Outro | 45 (~1,5 s) | « Bravo — à ton rythme. » |

Rythme **senior** : ne pas descendre sous 75 frames/étape sans demande explicite.

Ours animé = **flipbook** (`holdFrames` 14 dans la séquence d’images par étape) ou image→vidéo IA si clé API (hors scope v1).

---

## 5. Données entrée (référentiel)

Colonnes CSV utilisées :

| Colonne | Usage tuto |
|---|---|
| Nom de l'exercice | Titre intro |
| Thème + Niveau + Palier | Méta bandeau |
| Objectif de l'exercice | Intro |
| Détail / étapes (guidance verbale) | **Texte XL** par plan (1 ligne numérotée = 1 étape) |
| Durée indicative | Optionnel sous l’objectif |

**Exercice hors CSV** (ex. prod seulement) : ajouter d’abord au référentiel, ou passer un brief manuel au skill (nom + étapes[]).

---

## 6. Assets sortie

```
public/community-assets/exercise-tutos/{slug}/
  frames/step-01.png … step-N.png
  {slug}.mp4                    # version téléchargeable
tmp/exercise-tutos/{slug}-props.json
```

Slug = nom normalisé (`top-chrono-15`, `enfiler-son-gilet-en-position-assise`).

---

## 7. Rendu CLI

```bash
npm run community:render-video -- \
  --composition=ProchePlusExerciseTuto \
  --props=tmp/exercise-tutos/{slug}-props.json \
  --slug=exercise-tuto-{slug}
```

---

## 8. Safeguards (hérités ours C-v3)

Identiques `docs/mascot-generation-spec.md` S1–S9 : pas d’humain, pas au sol, family-safe, gilet floral primaire, etc.

**Éditorial exercice :** reprendre les consignes CSV telles quelles (tutoiement aidant→proche) — **ne pas** réécrire le geste clinique sans Camille (APA).

---

## 9. Hors scope v1

- Upload automatique en base `Exercise.videoUrl`
- Anatomie 3D (panneau muscles DEMIC) — option v2
- i2v fluide sans clé API
- Batch 108 exercices sans validation fondateur

---

## 10. Fichiers code

| Fichier | Rôle |
|---|---|
| `src/lib/exercises/referentiel-lookup.ts` | Trouver exercice dans CSV |
| `src/lib/exercises/tuto-video-core.ts` | Types, typo, durées (bundle Remotion-safe) |
| `src/lib/exercises/tuto-video.ts` | Props builder depuis CSV |
| `src/remotion/ProchePlusExerciseTuto.tsx` | Composition Remotion |
| `.agents/skills/bmad-exercice-tuto/` | Skill invocable |
