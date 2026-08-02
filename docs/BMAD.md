# BMAD Method — Proche+

BMAD (Build More, Architect Dreams) est installé sur ce projet pour orchestrer le développement agentique.

## Installation

- **Module** : BMM (BMad Method) v6.10.0
- **IDE** : Cursor → skills dans `.agents/skills/`
- **Config** : `_bmad/config.toml`
- **Langue** : Français (communication + documents)
- **Connaissances projet** : `docs/`

## Démarrer dans Cursor

1. Ouvrir une **nouvelle conversation**
2. Demander : **`bmad-help`** ou *« que dois-je faire ensuite ? »*
3. L'agent analyse l'état du projet et recommande le workflow suivant

## Workflows utiles pour Proche+ (projet existant)

| Skill | Usage |
|-------|-------|
| `bmad-help` | Orientation — toujours commencer ici |
| `bmad-studio-ours` | Nouvelle **photo** ou **vidéo MP4** de l’ours (canon C-v3 → Remotion) — « Studio Ours » / « nouvelle vidéo ours » |
| `bmad-document-project` | Documenter l'état actuel du code |
| `bmad-check-implementation-readiness` | Vérifier si les specs sont prêtes pour l'implémentation |
| `bmad-create-story` / `bmad-dev-story` | Créer et implémenter des user stories |
| `bmad-quick-dev` | Corrections rapides sans cérémonie complète |
| `bmad-code-review` | Revue de code structurée |
| `bmad-sprint-planning` | Planifier un sprint |

## Artefacts BMAD

| Dossier | Contenu |
|---------|---------|
| `_bmad-output/planning-artifacts/` | PRD, architecture, UX, epics |
| `_bmad-output/implementation-artifacts/` | Stories, sprint status, reviews |
| `docs/` | Connaissances projet persistantes |

## Réinstaller / mettre à jour

```bash
npx bmad-method install --modules bmm --tools cursor --yes
```

## Prérequis optionnel

BMAD utilise des scripts Python via `uv` :

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Ressources

- [Documentation BMAD](https://docs.bmad-method.org/)
- [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
