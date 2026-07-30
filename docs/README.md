# Proche+ — Base de connaissances projet

Dossier référencé par BMAD (`project_knowledge = docs`).

## Documents clés

| Document | Description |
|----------|-------------|
| [Proche+_Specs_Fonctionnelles_Architecture.md](./Proche+_Specs_Fonctionnelles_Architecture.md) | Specs fonctionnelles, modèle de données, Gherkin, identité de marque |
| [project-context.md](./project-context.md) | Contexte synthétique pour les agents BMAD |
| [../README.md](../README.md) | Stack technique, démarrage local |
| [../DEPLOYMENT.md](../DEPLOYMENT.md) | Déploiement GitHub + Vercel |

## État du MVP (implémenté)

- Next.js 15 + Prisma PostgreSQL + Tailwind
- Espace aidant (PWA) : onboarding, transmission, mode visite, feedback, questions, ressources
- Espace pro : dashboard, fiche patient, création transmission, questions
- Déploiement cible : GitHub + Vercel + Neon

## Boucle produit

```
VISITE → TRANSMISSION → MODE VISITE → FEEDBACK → ADAPTATION → VISITE SUIVANTE
```

## Contraintes métier

- **Pas** un logiciel de soin — couche de continuité éducative
- Cloisonnement strict : données pro / éducatives / feedback
- Cible aidants 60+ : accessibilité, grands caractères, ton chaleureux
- Hébergement santé France (HDS) — ultérieur au MVP Vercel
