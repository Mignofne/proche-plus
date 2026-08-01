# Test Automation Summary

**Date :** 2026-08-01  
**Périmètre :** Studio Ours (génération + API image)  
**Framework :** Playwright (existant)

## Generated Tests

### API Tests
- [x] `tests/api/mascot-gen-image.spec.ts` — `GET /api/community/mascot-gen/image/[name]`
  - 401 sans session / session aidant
  - 400 nom ou extension invalide
  - 404 image absente
  - 200 image présente (fondateur)

### E2E Tests
- [x] `tests/e2e/studio-ours.spec.ts` — parcours fondateur Studio Ours
  - Redirect connexion sans session
  - Aidant refusé
  - Brief + garde-fous visibles
  - Blocage S1 (contenu inapproprié)
  - Génération mock → résultat + prompt

### Config
- [x] `playwright.config.ts` — `MASCOT_GEN_PROVIDER=mock` pour E2E déterministes

## Coverage

| Zone | Couvert | Notes |
|------|---------|--------|
| API image mascot-gen | 6/6 chemins critiques | Auth + validation + happy path |
| UI Studio Ours accès | Oui | Fondateur / aidant / anonyme |
| Garde-fous client | Oui | S1 |
| Génération mock | Oui | Affichage résultat |
| Génération remote (Pollinations/OpenAI) | Unitaires existants | `tests/unit/mascot-gen-remote.spec.ts` |
| Autres features Community / aidant / pro | Existants | Non modifiés |

- API endpoints Studio Ours image : **couverts**
- UI Studio Ours : **happy path + 2 erreurs critiques** (auth, safeguards)

## Résultat d’exécution

```
npx playwright test tests/e2e/studio-ours.spec.ts tests/api/mascot-gen-image.spec.ts
→ 11 passed
```

## Next Steps
- Brancher ces specs dans le CI GitHub Actions si pas déjà inclus via `npm test`
- Ajouter un smoke E2E remote (stub fetch) si besoin de non-régression prod sans Pollinations
- Installer TEA pour stratégie risque / NFR plus large si besoin
