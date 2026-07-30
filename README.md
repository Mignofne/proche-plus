# Proche+

SaaS de continuité éducative entre établissements de rééducation et familles-aidants.

## Boucle produit

```
VISITE → TRANSMISSION (prof → aidant) → PRATIQUE (mode visite) →
FEEDBACK (aidant → prof) → ADAPTATION (prof) → VISITE SUIVANTE
```

## Stack

- **Next.js 15** (App Router) — aidant PWA + back-office pro
- **Prisma** + PostgreSQL (Neon — local et prod)
- **Tailwind CSS 4** — design system senior-friendly
- **JWT** — sessions httpOnly
- **Vercel** — déploiement MVP

## Démarrage rapide (local)

1. Créer une base gratuite sur [Neon](https://neon.tech) et copier la connection string
2. Configurer l'environnement :

```bash
npm install
cp .env.example .env
# Éditer .env : DATABASE_URL (Neon) + JWT_SECRET
npm run db:setup
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Comptes démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Professionnel | `pro@procheplus.demo` | `demo1234` |
| Aidant | `jean.martin@demo.fr` | `demo1234` |

## Parcours implémentés (MVP)

### Aidant (mobile-first)
- Onboarding pédagogique (4 étapes + mode grands caractères)
- Consultation transmission (à retenir / essayer / éviter / revoir)
- Confirmation de compréhension
- Mode visite (objectif, consignes, guidance verbale)
- Feedback post-visite
- Questions au professionnel
- Bibliothèque de conseils

### Professionnel (web responsive)
- Tableau de bord (stats, patients, questions)
- Fiche patient (objectif, historique)
- Création transmission en 5 étapes (< 2 min)
- Réponse aux questions

## Architecture

```
src/
├── app/
│   ├── aidant/          # Espace aidant (PWA)
│   ├── pro/             # Back-office professionnel
│   └── api/             # REST API
├── components/          # UI, mascotte, layout
└── lib/                 # Auth, Prisma, microcopy, constantes
```

## Conformité

- Cloisonnement données pro / éducatives / feedback (schéma Prisma)
- Observations cliniques (`ClinicalNote`) jamais exposées à l'aidant
- Journal d'audit (`AuditLog`) prêt pour traçabilité HDS

## Déploiement (GitHub + Vercel)

Guide complet : **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Résumé :
1. Pousser le code sur GitHub
2. Importer le repo sur [Vercel](https://vercel.com/new)
3. Configurer `DATABASE_URL` (Neon) et `JWT_SECRET`
4. Lancer `npm run db:seed` une fois après le premier déploiement

## BMAD Method (développement agentique)

BMAD est installé pour orchestrer planning et implémentation via Cursor.

- **Skills** : `.agents/skills/` (46 skills BMAD)
- **Config** : `_bmad/`
- **Guide** : [docs/BMAD.md](./docs/BMAD.md)
- **Connaissances** : [docs/](./docs/)

Dans Cursor, ouvrir une nouvelle conversation et demander **`bmad-help`** pour savoir quoi faire ensuite.

```bash
npm run bmad:install   # réinstaller / mettre à jour BMAD
```

## Prochaines étapes

- [ ] Hébergement certifié HDS (France)
- [ ] Envoi SMS/email d'invitation
- [ ] Row Level Security PostgreSQL
- [ ] 2FA professionnels
- [ ] Tests E2E (scénarios Gherkin)
