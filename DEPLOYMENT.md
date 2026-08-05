# Déploiement Proche+ — GitHub + Vercel

## Prérequis

- Compte [GitHub](https://github.com)
- Compte [Vercel](https://vercel.com) (gratuit)
- Base PostgreSQL — [Neon](https://neon.tech) (gratuit, intégration Vercel native)

> SQLite ne convient pas à Vercel (filesystem éphémère). PostgreSQL via Neon est recommandé pour le MVP.

---

## 1. Créer la base de données (Neon)

1. Créer un projet sur [console.neon.tech](https://console.neon.tech)
2. Copier la **connection string** (format `postgresql://...?sslmode=require`)
3. Conserver cette URL pour les étapes suivantes

---

## 2. Pousser le code sur GitHub

```bash
cd C:\PERSO\Git\proche+
git init
git add .
git commit -m "feat: MVP Proche+ — aidant PWA + back-office pro"
git branch -M main
gh repo create proche-plus --public --source=. --remote=origin --push
```

Sans `gh` CLI :

1. Créer un dépôt vide `proche-plus` sur GitHub
2. Puis :

```bash
git remote add origin https://github.com/VOTRE_USER/proche-plus.git
git push -u origin main
```

---

## 3. Déployer sur Vercel

### Option A — Import GitHub (recommandé)

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Sélectionner le dépôt `proche-plus`
3. Framework : **Next.js** (détecté automatiquement)
4. Build Command : laisser vide (Vercel utilise `vercel-build` du `package.json`)
5. Ajouter les **variables d'environnement** :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Connection string Neon |
| `JWT_SECRET` | Chaîne aléatoire longue (ex. `openssl rand -base64 32`) |

6. **Deploy**

### Option B — Neon + Vercel (intégration directe)

1. Dans le dashboard Vercel : **Storage** → **Create Database** → **Neon**
2. La variable `DATABASE_URL` est injectée automatiquement
3. Ajouter manuellement `JWT_SECRET`
4. Importer le repo GitHub et déployer

---

## 4. Initialiser les données démo (une fois)

Après le premier déploiement réussi, exécuter le seed **en local** contre la base Neon :

```bash
# Récupérer les variables Vercel en local (optionnel)
npx vercel env pull .env.production.local

# Ou copier DATABASE_URL manuellement dans .env
npm run db:seed
```

Comptes démo créés :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Professionnel | `pro@procheplus.demo` | `demo1234` |
| Aidant (5 proches A–E) | `jean.martin@demo.fr` | `demo1234` |

Les 5 proches A–E sont synchronisés à chaque déploiement (`vercel-build` → `ensure-demo-gir-profiles`) sur le compte Jean Martin.

---

## 5. Vérification post-déploiement

- [ ] Page d'accueil accessible (`/`)
- [ ] Connexion aidant → onboarding → transmission
- [ ] Connexion pro → dashboard → création transmission
- [ ] PWA installable sur mobile (`/aidant`)

---

## Variables d'environnement Vercel

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | Oui | PostgreSQL (Neon) |
| `JWT_SECRET` | Oui | Secret sessions JWT |

---

## Déploiements suivants

Chaque push sur `main` déclenche un redéploiement automatique via l'intégration GitHub → Vercel.

`prisma db push` s'exécute à chaque build (`vercel-build`) pour synchroniser le schéma.
`prisma/ensure-catalog.ts` remplit le catalogue thèmes/exercices **s'il est vide** (sans écraser les patients).

Le seed complet (`npm run db:seed`) reste manuel et **réinitialise** les comptes démo.

---

## Limitations MVP sur Vercel

- Pas de SMS/email d'invitation (à brancher plus tard)
- Seed manuel après premier déploiement
- Hébergement HDS France : migration ultérieure (Scaleway, OVHcloud HDS, etc.)
