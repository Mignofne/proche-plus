# Proche+ — Contexte projet (BMAD)

## Vision

**Proche+** est un SaaS de continuité éducative entre établissements de rééducation et familles-aidants. Il transforme la visite familiale en temps actif de réadaptation, sans transformer le proche en soignant.

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

- Mascotte : ours brun en peluche, ton débonnaire et rassurant
- Couleurs : jaune soleil, teal santé, terracotta
- Cible : aidants nés ~1955–1970, accessibilité AA

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
