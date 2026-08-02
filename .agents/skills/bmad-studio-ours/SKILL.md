---
name: bmad-studio-ours
description: >
  Studio Ours Proche+ — génère une nouvelle photo ou vidéo de la mascotte
  (canon C-v3) en respectant l'identité verrouillée. Use when the user asks for
  Studio Ours, nouvelle photo ours, nouvelle vidéo ours, génère l'ours,
  illustration mascotte, scène ours, or talk to Studio Ours.
---

# Studio Ours — photo & vidéo (canon C-v3)

## Overview

You generate **new Proche+ bear media** (still or video brief) from the **locked C-v3 identity**. You do **not** invent a new character. The source of truth is `{project-root}/docs/mascot-generation-spec.md` (§0bis + safeguards S1–S9).

Product UI (optional parallel path): `/admin-produit/community/studio-ours`.

## Conventions

- Bare paths resolve from `{skill-root}`.
- `{project-root}` = working directory.
- `{skill-name}` = `bmad-studio-ours`.
- Workflows live in `workflows/*.md`.

## On Activation

### Step 1: Resolve customization (if present)

Run if available: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key agent`

Else merge manually: `{skill-root}/customize.toml` → `_bmad/custom/{skill-name}.toml` → `.user.toml`.

### Step 2: Load canon (mandatory)

**Always read before generating:**

1. `{project-root}/docs/mascot-generation-spec.md` — §0bis (identity) + §5 (variations interdites) + safeguards S1–S9
2. `{project-root}/public/community-assets/ours-canon/README.md`
3. `{skill-root}/references/canon-rapide.md` (checklist opérationnelle)
4. Look at the reference image `{project-root}/public/community-assets/ours-canon/canon-c-v3.png` (Read tool) when generating a still

Optional: `src/lib/community/mascot-gen/prompt-builder.ts` for the same IDENTITY / SAFEGUARDS layers used in product.

### Step 3: Collect brief (skip what is already known)

| Champ | Exemples |
|---|---|
| **Format** | `photo` ou `video` |
| **Situation** | 1 phrase (ex. « enfile un gilet assis sur une chaise ») |
| **Émotion** | joyeux / concentré / rassurant / espiègle / calme / … |
| **Lieu** | chambre / salon / cuisine / … |
| **Thème référentiel** (optionnel) | S'habiller, Manger, Fauteuil, … |
| **Compagnon** | solo **ou** 2e ours (aidant) — **jamais** d’humain |
| **Ratio** | carré 1:1 (défaut) · stories 9:16 · paysage 16:9 |

If the user only said « nouvelle photo ours » without a scene, ask **one** short question for situation + émotion + lieu (combined OK).

### Step 4: Safeguard gate

Reject (explain in FR, do not generate) if the brief violates S1–S9 / §5 — vulgarity, humans, bear on the floor, medical sensationalism, bow tie, non-C-v3 identity, etc.

### Step 5: Dispatch

| Intent | Workflow |
|---|---|
| Photo / illustration / still | `workflows/generer-photo.md` |
| Vidéo / storyboard / Remotion | `workflows/generer-video.md` |
| Unclear | Show menu from `customize.toml`, wait |

### Step 6: Deliver

- Show the image (or storyboard + stills).
- State which canon rules were applied (1–2 lines).
- Offer: variante (même identité, autre scène) · autre format · intégration Community / Studio Ours produit.

## Hard Rules (never violate)

1. **Canon C-v3 only** — plump brown bear, full body, white tuft, mono-brow, crow's feet, cream waistcoat; **no** bow tie.
2. **No humans** — companions = other Proche+ bears only; multi-bear: primary = Mexican floral vest, companion = plain cream vest.
3. **Never on the floor** — seated / at table; props on table.
4. **Family-safe** — no vulgar / sexual / violent / medical trauma sensationalism.
5. **No IP clones** — not Lotso, not Winnie; mood refs are atmosphere only.
6. **UI SVG `BearFace` is not the gen master** — use `canon-c-v3.png`.

## How the user calls this skill

Say any of:

- `Studio Ours`
- `nouvelle photo ours`
- `nouvelle vidéo ours`
- `génère l’ours [situation]`
- `illustration mascotte Proche+`

## Output location (optional persist)

When the user asks to save into the repo:

- Stills: `public/community-assets/ours-canon/generations/` (create if needed) or path they name
- Briefs / storyboards: `_bmad-output/implementation-artifacts/studio-ours/`
