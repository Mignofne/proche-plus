# Studio Ours — Architecture proposée (Phase 2)

> **Phase 0 :** spec + archi docs.  
> **Phase 0.5 :** ✅ **COMPLETE** — canon **C-v3** `[ADOPTED]` (GO fondateur).  
> **Phase 1 :** ✅ **MOCK LIVRÉ** — route `/admin-produit/community/studio-ours`, provider `mock`, safeguards S1–S8, historique fichier.  
> **Identité :** [`docs/mascot-generation-spec.md`](./mascot-generation-spec.md) (§0bis).  
> **Next :** protocole **10 scènes** (§8 spec) → providers remote/local.  
> **Positionnement :** évolution post AD-11 kit-only MVP ; atelier fondateur ; **local-first plus tard** ; démarrage **mock / remote free tier / génération assistée** (fondateur sans ComfyUI).  
> **Mood refs :** [`docs/mascot-mood-refs/`](./mascot-mood-refs/) — ambiance only ; **pas** IP Lotso/Winnie.

---

## 0.5 Phase 0.5 — Reference sheet (gate fondateur) — ✅ COMPLETE

| Étape | Livrable | Gate |
|---|---|---|
| 0.5a | Brief traits §0bis + mood refs (plump/plush/light only) | ✅ |
| 0.5b | Sheet **C-v3** : full-body, illustré peluché (`canon-c-v3.png` / `reference-sheet.png`) | ✅ |
| 0.5c | Checklist : mèche blanche, mono-sourcil brun, pattes d’oie, gilet crème fleurs mexicaines, **pas** de nœud, **pas** de clone IP | ✅ |
| 0.5d | **GO fondateur** (« il est parfait ! ») | ✅ `[ADOPTED]` |

**Preuve cohérence :** `declinaison-fauteuil.png` validée (échantillon hors protocole 10 scènes).

**Prochaine étape :** protocole **10 scènes** (spec §8) → brancher remote/local (`identityVersion` = `bear-stylized-sheet@c-v3`).

`BearFace` SVG = UI only ; gen pointe vers le sheet C-v3, **pas** `BearFace+provenance`.

---

## 0.6 Safeguards runtime — **LOCKED**

| Couche | Rôle |
|---|---|
| Docs | Spec §0bis S1–S8 + checklist §5 |
| `safeguards.ts` | Scan tokens / heuristiques FR+EN ; refuse avant PromptBuilder |
| UI Studio Ours | Message FR immédiat si violation |
| Server action | Re-valide avant provider (jamais confiance client seule) |
| Prompt négatifs | Renforce S1–S8 + identité dans `promptNegative` |

Liste exacte : S1 jamais vulgaire/sexuel/érotique/suggestif/double sens ; S2 ton respectueux/chaleureux/espérant ; S3 pas violence/gore/humiliation ; S4 pas traumatisme médical sensationnalisé ; S5 family-safe ; S6 C-v3 identité + gilet VARIABLE sans nœud ; S7 jamais humains ; S8 jamais par terre.

---

## 1. Placement produit

| Élément | Proposition |
|---|---|
| Route admin | `/admin-produit/community/studio-ours` |
| Voisinage | Distinct de `/admin-produit/community/studio` (Remotion vidéo) |
| Audience | Fondateur uniquement (`requireFondateur`) |
| Sortie | Assets tracés → revue → optionnellement `CommunityMediaAsset` / bibliothèque pose |
| Relation AD-11 | **Parallèle recommandé v1** : publication Community MVP reste kit-only ; Studio Ours alimente un bac à sable / future bibliothèque après gate |

```
admin-produit/community/
  studio/           # Remotion (existant)
  studio-ours/      # Phase 1 — génération illustrée (mock)
  ours-canon/       # validation sheet + scènes référentiel
  publications/     # consomme kit (+ plus tard assets Studio validés)
```

**Code runtime :** `src/lib/community/mascot-gen/` (prompt-builder, safeguards, providers, history).

---

## 2. Séparation des couches (pipeline)

Chaque génération compose **cinq couches indépendantes**. Le prompt final = assemblage ordonné ; une couche ne doit pas « réécrire » l’identité.

```
┌─────────────────────────────────────────────────────────────┐
│  IDENTITY          (verrouillé — mascotte produit)           │
│  SCENE             (intention narrative / CAP-9 beat)        │
│  ART DIRECTION     (lumière, mood, accents teal/sun/terra)   │
│  COMPOSITION       (cadrage, hiérarchie ours vs message)     │
│  FORMAT            (1:1, 4:5, 9:16, blog cover, overlay)     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
   PromptBuilder (couches → prompt + negatives)
         │
         ▼
   SceneInterpreter (JSON scène → slots typés)
         │
         ▼
   ImageGenerationProvider (Mock → Remote/assisté → Local plus tard)
         │
         ▼
   QualityCheck (heuristiques + checklist style lock)
         │
         ▼
   Revue fondateur → persist Generation history
```

### 2.1 IDENTITY

- Source : style lock `brand-ours` + **character sheet stylisé full-body validé** (§0bis) + palette marque.  
- Contenu typique : « adult plump brown Proche+ bear, plush illustrated fur #8B5E3C…, white forehead tuft, single brown Frida-like brow, mischievous joyful expression, full body… » + **négatifs** infantile / médical / PHI / humain identifiable / **Lotso / Winnie / Disney teddy**.  
- **Immutable** entre runs de validation 10 scènes (sauf décision fondateur / nouveau sheet versionné).  
- **Ne pas** ancrer IDENTITY sur le SVG plat `BearFace` (UI icon only).  
- Mood refs (`docs/mascot-mood-refs/`) : guidance ART DIRECTION plump/light **uniquement** — jamais comme personnage source.

### 2.2 SCENE

- Entrée fondateur Phase 1 : **situation** + **émotion** + **lieu** (+ thème référentiel optionnel).  
- Beat sheet CAP-9 / pose cible restent disponibles pour protocoles futurs.  
- Produit par `SceneInterpreter` / `buildScenePrompt` — prose filtrée via `validateMascotGenInput`.  
- Refuse tokens médicaux / PHI / S1–S8 — aligné AD-11 + safeguards fondateur.

### 2.3 ART DIRECTION

- Fond cream `#FAF7F2`, accents selon pose (teal / sun / terracotta).  
- Ton : calme, senior-friendly, un clin d’œil max.  
- **Ne** change **pas** les proportions du personnage.

### 2.4 COMPOSITION

- Ours : héros / cameo / guide (rôle scénario).  
- Lisibilité : overlays texte **hors** image ou zones réservées ; pas de texte indispensable uniquement dans le bitmap (brand).  
- Règle « ours secondaire au message » quand texte éditorial porte le fond.

### 2.5 FORMAT

| Clé | Ratio | Usage |
|---|---|---|
| `ig-square` | 1:1 | Post classique |
| `ig-portrait` | 4:5 | Feed |
| `tiktok-still` | 9:16 | Still / cover |
| `blog-cover` | ~16:9 ou 3:2 **AMBIGU** ratio exact | Couverture SEO |
| `remotion-overlay` | transparent / zone safe **UNKNOWN** | Overlay vidéo |

---

## 3. `ImageGenerationProvider` (abstraction)

Implémenté sous `src/lib/community/mascot-gen/providers/` :

```ts
type GenRequest = {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  seed?: number;
  identityVersion: string; // bear-stylized-sheet@c-v3
  sceneId: string;
  poseKey?: string;
};

type GenResult = {
  imageBytes?: Buffer;
  imageUrl?: string; // mock = canon placeholder
  mimeType: string;
  provider: "mock" | "local" | "remote";
  meta: Record<string, unknown>;
};

interface ImageGenerationProvider {
  readonly id: "mock" | "local" | "remote";
  isAvailable(): Promise<boolean>;
  generate(req: GenRequest): Promise<GenResult>;
}
```

### 3.1 Chaîne Mock → (Remote free / assisté) → Local plus tard

| Provider | Rôle | Coût | Secrets | État Phase 1 |
|---|---|---|---|---|
| **Mock** | Compose prompt + sauvegarde métadonnées ; image placeholder = sheet C-v3 | 0 € | Aucun | ✅ |
| **Remote free / assisté** | Free tier cloud — stub `not implemented` | Gratuit / crédits | Server-side | Stub |
| **Local** | Daemon localhost — stub | 0 € GPU | URL server-side | Stub |
| **Remote payant** | fal / Replicate — optionnel | Crédits | Jamais `NEXT_PUBLIC_*` | Hors scope |

**Règle :** le browser n’appelle que des **Server Actions** Proche+.  

**Feature flag :** `MASCOT_GEN_PROVIDER=mock|remote|local` (server env) — défaut **`mock`**.

---

## 4. Prompt builder & SceneInterpreter

### 4.1 PromptBuilder (couches)

```
buildPrompt({ identity, scene, art, composition, format }) →
  { positive, negative, params }
```

- Concaténation **structurée** (sections étiquetées), pas un blob unique opaque.  
- Negatives canoniques : infantile, emoji jouet, geste médical, PHI, photoréalisme humain identifiable, violet IA générique, **Lotso, Winnie the Pooh, Disney/Pixar teddy clone**, etc.  
- Versionnés dans repo : `src/lib/community/mascot-gen/` (prompt-builder, constants, safeguards).

### 4.2 SceneInterpreter / entrée Studio

- Entrée Phase 1 : `{ situation, emotion, lieu, themeSlug? }` (+ free-text émotion/lieu optionnels).  
- Sortie : slots typés + prompts positive/negative.  
- Refuse prose contenant tokens S1–S8 / médicaux / PHI.

### 4.3 QualityCheck (automatique, non suffisant)

Heuristiques v1 (sans vision model obligatoire) :

- Dimensions / ratio = FORMAT demandé  
- Métadonnées présentes (provider, seed, identityVersion, poseKey)  
- Checklist négatifs : scan OCR **UNKNOWN** (optionnel plus tard)  
- Score manuel fondateur (grille 10 scènes) reste **gate** bibliothèque  

**AMBIGU :** embedding similarity vs raster du **sheet validé** — pas décidé (plus vs `BearFace`).

---

## 5. Moteurs locaux — options (plus tard)

| Option | Points forts | Points faibles | Recommandation |
|---|---|---|---|
| **ComfyUI** | Graphes reproductibles, IPAdapter/ref sheet, communauté | Setup lourd ; fondateur **n’a pas** l’outil aujourd’hui | **Cible** local-first quand le fondateur est prêt |
| **Automatic1111** | Simple txt2img | Moins propre pipelines | Spike Local ultérieur |
| **InvokeAI** | UI atelier | Moins « default » | Si UI locale soignée désirée |
| Autre (Draw Things, Fooocus…) | Simplicité | Moins contrôlable | Spike seulement |

**Reco immédiat (post-0.5) :** **pas** de dépendance Comfy chez le fondateur. Enchaîner **10 scènes** (assisté / free tier) + Mock pour brancher Studio Phase 1.  
**Reco Local ultérieur :** ComfyUI + workflow figé (IDENTITY ref = **sheet stylisé validé**, pas `BearFace` SVG).

---

## 6. Données — historique Phase 1 + esquisse Prisma

**Phase 1 (livré) :** historique fichier JSON sous `.data/mascot-gen/` (gitignored) via `saveGeneration` / `listGenerations` — pas de modèle Prisma encore.

**Contexte Community :** Prisma + **PostgreSQL** (`CommunityMediaAsset`, etc.).  
Le brief demandait aussi un historique gen **SQLite local** — deux lectures :

| Option | Description | Statut |
|---|---|---|
| **A — SQLite atelier** | Second schema / fichier `mascot-studio.sqlite` uniquement sur machine fondateur | Aligné « local-first 0 € » ; hors Neon |
| **B — Postgres Community** | Modèles `CommunityMascotGeneration*` dans `schema.prisma` existant | Unifie admin ; pas « SQLite » strict |
| **C — Hybride** | Runs locaux SQLite ; promote vers `CommunityMediaAsset` après revue | **Recommandé** conceptuellement |

**AMBIGU :** choix A/B/C = question fondateur (§ spec).

### 6.1 Esquisse modèles (si B ou promote C)

```prisma
enum MascotGenProvider {
  mock
  local
  remote
}

enum MascotGenStatus {
  pending
  succeeded
  failed
  rejected   // qualité / fondateur
  approved   // prêt bibliothèque
}

model CommunityMascotGeneration {
  id               String   @id @default(cuid())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  provider         MascotGenProvider
  status           MascotGenStatus @default(pending)

  identityVersion  String
  poseKey          String
  sceneId          String?
  scenarioSlug     String?  // CAP-9 optionnel
  formatKey        String   // ig-square | …

  promptPositive   String
  promptNegative   String
  seed             Int?
  width            Int
  height           Int

  outputPath       String?  // filesystem local ou URL blob
  mimeType         String?
  providerMetaJson String?  // steps, model, comfy workflow id…

  qualityScoreJson String?  // grille 0–2 par critère
  founderNotes     String?
  reviewedAt       DateTime?

  mediaAssetId     String?  // si promu
  mediaAsset       CommunityMediaAsset? @relation(fields: [mediaAssetId], references: [id])
}

model CommunityMascotGenBatch {
  id          String   @id @default(cuid())
  label       String   // ex. "consistency-10-v1"
  createdAt   DateTime @default(now())
  notes       String?
  // generations liées via batchId optionnel sur CommunityMascotGeneration
}
```

Pour **SQLite local pur (A)** : mêmes modèles dans un `prisma/mascot-studio/schema.prisma` séparé + client dédié, **sans** jointure clinique (invariant AD domain Community).

---

## 7. Sécurité & frontières

- Pas d’import modules cliniques (`Patient`, `Visit`, …) — invariant AD Community.  
- Pas de PHI dans prompts (QualityCheck + refuse SceneInterpreter).  
- CAP-11 : tout humain identifiable → blocage ou attestation (hors silhouettes).  
- Secrets Remote : server env only.  
- Assets générés : licence/provenance obligatoires avant usage publication (AD-7 / AD-11).

---

## 8. Phases d’implémentation suggérées (post Phase 0)

| Étape | Livrable | Gen réelle |
|---|---|---|
| 0 | Spec + archi | Non |
| **0.5** | **Character sheet C-v3 + GO fondateur** | ✅ COMPLETE |
| **1 / 2a** | Route studio-ours + Mock + historique fichier + safeguards | ✅ Mock |
| **Next** | Protocole **10 scènes** (cohérence) | Assistée / free tier |
| 2b | Provider remote/local + suite scènes | Remote/local |
| 2c | QualityCheck + grille score UI | Idem |
| 2d | Promote → `CommunityMediaAsset` | Après GO fondateur |
| 2e | Local Comfy (si fondateur équipé) / Remote payant optionnel | Selon setup |

---

## 9. One-pager (bullets)

- Studio Ours = **Phase 2**, route `/admin-produit/community/studio-ours`, parallèle Remotion.  
- **Phase 0.5** = ✅ **COMPLETE** — canon **C-v3** `[ADOPTED]`.  
- **Phase 1** = ✅ mock + form situation/émotion/lieu + safeguards S1–S8.  
- **Next** = protocole **10 scènes** puis remote/local.  
- Canon gen ≠ SVG `BearFace` (UI icon) ; traits : brun dodu, mèche blanche, mono-sourcil, pattes d’oie, malicieux, peluché illustré, gilet crème fleurs mexicaines, sans nœud.  
- Strict IP : mood refs plump/plush only — **pas** Lotso / Winnie.  
- AD-11 kit-only **reste** le chemin MVP publication jusqu’à décision fondateur.  
- Pipeline 5 couches : IDENTITY / SCENE / ART DIRECTION / COMPOSITION / FORMAT.  
- `ImageGenerationProvider` : Mock → remote/assisté → Local plus tard ; UI sans clés.  
- Fondateur sans Comfy aujourd’hui — local-first différé.  
- Validation identité scènes = protocole **10 scènes** (voir spec §8).
