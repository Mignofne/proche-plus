---
name: Proche+
description: Continuité éducative famille / établissement — rassurant, adulte, jamais infantilisant.
status: final
sources:
  - docs/Proche+_Specs_Fonctionnelles_Architecture.md
  - docs/project-context.md
  - _bmad-output/planning-artifacts/ux-designs/ux-proche-plus-2026-07-30/.memlog.md
updated: 2026-07-30
colors:
  surface-base: '#FAF7F2'
  surface-raised: '#FFFFFF'
  surface-muted: '#F0EBE3'
  ink-primary: '#2D2A26'
  ink-secondary: '#5C5650'
  accent-teal: '#2A9D8F'
  accent-teal-dark: '#1F7A6F'
  accent-sun: '#F5C842'
  accent-sun-dark: '#E0A820'
  accent-terracotta: '#C67B5C'
  bear-fur: '#8B5E3C'
  bear-deep: '#6B4423'
  border-subtle: '#E8E2D8'
  state-success: '#2A9D8F'
  state-caution: '#C67B5C'
  state-neutral: '#5C5650'
typography:
  display:
    fontFamily: 'Nunito'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 1.25
  title:
    fontFamily: 'Nunito'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 1.3
  body:
    fontFamily: 'Nunito'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 1.5
  body-large:
    fontFamily: 'Nunito'
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 1.55
  label:
    fontFamily: 'Nunito'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 1.4
  button:
    fontFamily: 'Nunito'
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 1.2
rounded:
  sm: 8px
  md: 16px
  lg: 20px
  xl: 24px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  gutter-mobile: 16px
  margin-mobile: 16px
components:
  button-primary:
    background: '{colors.accent-teal}'
    color: '#FFFFFF'
    rounded: '{rounded.xl}'
    min-height: 48px
  button-secondary:
    background: '{colors.accent-sun}'
    color: '{colors.ink-primary}'
    rounded: '{rounded.xl}'
    min-height: 48px
  button-ghost:
    background: transparent
    color: '{colors.accent-teal}'
    min-height: 48px
  card:
    background: '{colors.surface-raised}'
    border: '{colors.border-subtle}'
    rounded: '{rounded.xl}'
  progress-bar:
    track: '{colors.surface-muted}'
    fill: '{colors.accent-teal}'
  mascot:
    fur: '{colors.bear-fur}'
    deep: '{colors.bear-deep}'
---

## Brand & Style

Proche+ accompagne l’aidant familial pendant la réadaptation — **rassurant comme un soignant, chaleureux comme un compagnon débonnaire, jamais comme un jouet**. L’ours est un adulte : un peu bourru, attentionné, patient. Pas de peluche enfantine, pas de clinique froide.

Positionnement : « Rassurant comme un professionnel de santé, chaleureux comme un compagnon, léger comme un dimanche ensoleillé. » L’humour détend l’aidant ; il ne minimise jamais la vulnérabilité du patient. Un clin d’œil max par écran ; ton **sobre** automatique sur chute, risque, difficulté médicale.

Cible principale : aidants ~1955–1970. Lisibilité, calme, une chose à la fois.

## Colors

- **Cream (`{colors.surface-base}`)** — toile de fond. Blanc cassé, jamais blanc clinique.
- **Teal (`{colors.accent-teal}`)** — action primaire, santé rassurante. Pas de bleu hôpital.
- **Sun (`{colors.accent-sun}`)** — action secondaire, encouragement doux.
- **Terracotta (`{colors.accent-terracotta}`)** — accent ours / alerte douce (difficulté, à éviter). Jamais rouge alarmiste sur l’aidant.
- **Bear (`{colors.bear-fur}`)** — identité mascotte uniquement.
- **Ink (`{colors.ink-primary}` / `{colors.ink-secondary}`)** — texte.

Éviter : violet IA générique, gradients décoratifs lourds, rouge erreur agressif sur parcours aidant.

## Typography

Nunito (sans arrondie, lisible). Corps généreux. Mode **grands caractères** (`body-large` et boutons plus hauts) activable dès l’onboarding — s’applique immédiatement, sans redémarrage.

Hiérarchie : `display` rare (marque / héros) · `title` titres d’écran · `body` contenu · `label` métadonnées. Pas d’icône seule sans mot.

## Layout & Spacing

Échelle 4–48 px. Mobile-first aidant : colonne unique, `{spacing.margin-mobile}`, une action principale visible sans scroll. Pro / admin : max ~960–1100 px contenu, grille simple.

Mode visite hybride : **barre de progression** discrète en haut + contenu central aéré.

## Elevation & Depth

Cartes sur `{colors.surface-raised}` avec bordure `{colors.border-subtle}` et ombre très légère. Hiérarchie par typo et espace, pas par multi-ombres. Pas de glassmorphism.

## Shapes

Coins `{rounded.md}`–`{rounded.xl}` (chaleureux, pas « pill » systématique). Boutons principaux `{rounded.xl}`. Mascotte dans un disque doux, illustration SVG adulte (pas emoji 🧸).

## Components

- **Bouton primaire** — teal, ≥ 48×48, libellé verbe d’action (« Réalisé avec succès », « Suivant », « Consulter »).
- **Bouton secondaire** — sun.
- **Carte section** — titre teal-dark + corps ; utilisée pour « À retenir / À essayer / À éviter ».
- **Barre de progression visite** — track muted, fill teal ; étapes numérotées accessibles (pas seulement couleur).
- **Timeline éducative (pro)** — étapes textuelles : transmis → consulté → essayé / réalisé / doute → feedback → acquis.
- **File d’actions (admin établissement)** — lignes prioritaires cliquables, badge compteur.
- **KPI card (admin produit)** — métrique + cible + écart ; pas de détail patient.
- **Mascotte** — SVG ours brun adulte, poses limitées (accueil, encourage, patience, célèbre, vigilance, question).

## Do's and Don'ts

| Do | Don't |
|---|---|
| Ours adulte, regard calme | Emoji peluche / ton enfantin |
| Une action principale par écran aidant | Grille de 6 liens sans hiérarchie |
| Teal = agir ; terracotta = prudence | Rouge clinique partout |
| GIR comme contexte (pro) | Graphique d’évolution GIR « dossier médical » |
| Timeline éducative pour la progression | Stats SaaS sur l’écran du soignant |
| Zones tactiles ≥ 48 px | Gestes complexes (swipe obligatoire, pinch) |
| Mode sobre sur sujets sensibles | Humour sur chute / difficulté médicale |
