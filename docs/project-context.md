# Proche+ — Contexte projet (BMAD)

## Vision

**Proche+** est un SaaS de continuité éducative entre établissements de rééducation et familles-aidants. Il transforme la visite familiale en temps actif de réadaptation, sans transformer le proche en soignant.

### Guidance verbale (technique d’accompagnement)

La **guidance verbale** est une technique d’accompagnement de la mobilité. Elle consiste à guider la personne aidée **par la parole** pour préserver son autonomie et éviter tout portage délétère.

#### Principes et objectifs

- **Maintien de l’autonomie** — Stimuler les capacités restantes de la personne aidée au lieu de faire l’action à sa place.
- **Sécurité partagée** — Réduire l’effort physique de l’aidant et prévenir les accidents ou les troubles musculosquelettiques.
- **Communication adaptée** — Utiliser des mots simples, précis et adaptés à l’état de conscience et de compréhension de la personne.

#### Modalités de mise en œuvre

- **Consignes claires** — Annoncer chaque étape du mouvement (ex. : « Avancez vos pieds », « Penchez-vous en avant »).
- **Rythme respecté** — Laisser le temps à la personne d’analyser la demande et d’agir à son propre rythme.
- **Association des aides** — Combiner la voix avec une guidance non verbale (regard, toucher sécurisant) ou une aide technique si nécessaire.

## Acteurs

| Rôle | Utilisateur | Device |
|------|-----------|--------|
| Payeur | Établissement de rééducation | — |
| Utilisateur principal | Aidant familial | Mobile PWA |
| Prescripteur | Professionnel (ergo, kiné, infirmier, éducateur) | Web responsive |
| Bénéficiaire | Patient (5 niveaux d'autonomie) | Non-utilisateur direct |

## MVP — périmètre livré

6 blocs fonctionnels implémentés :

1. Onboarding famille
2. Transmission pro → aidant (< 2 min)
3. Mode visite (préparation + guidage)
4. Feedback aidant post-visite
5. Questions aidant → pro
6. Back-office établissement / pro

## Stack actuelle

- **Frontend** : Next.js 15 App Router, Tailwind CSS 4
- **Backend** : API Routes Next.js, JWT sessions
- **BDD** : Prisma + PostgreSQL (Neon en prod)
- **Déploiement** : GitHub + Vercel (région cdg1)

## Structure code

```
src/app/aidant/     → PWA aidant
src/app/pro/        → Back-office professionnel
src/app/api/        → REST API
prisma/schema.prisma → Modèle données (cloisonnement RGPD)
```

## Identité

- Mascotte : ours brun adulte, débonnaire et rassurant (jamais infantile)
- Couleurs : jaune soleil, teal santé, terracotta
- Cible : aidants nés ~1955–1970, accessibilité AA

## Extension catalogue exercices (specs §10–12)

- Thèmes × niveaux A–E × paliers, avec transitions Réussi / Essai / Échec
- Activation par le professionnel (`PatientExercise`) avant affichage aidant
- Changement de niveau : alerte pro obligatoire (jamais auto côté aidant)
- Back-office fondateurs : `/admin-produit/exercices`
- Référentiel source : `docs/referentiel/` + `docs/Proche+_Specs_Section10_et_suivantes.md`

## Hors périmètre MVP

- IA médicale, intégration logiciels établissement, dossier patient complet
- Téléconsultation, chat libre, vidéo personnalisée pro
- Hébergement HDS certifié (prévu post-MVP)

## Comptes démo

| Rôle | Email | MDP |
|------|-------|-----|
| Pro | pro@procheplus.demo | demo1234 |
| Aidant | jean.martin@demo.fr | demo1234 |

## Métriques succès MVP

- Transmission < 2 min
- > 70 % visites avec transmission
- > 70 % transmissions consultées
- > 50 % feedbacks complétés
