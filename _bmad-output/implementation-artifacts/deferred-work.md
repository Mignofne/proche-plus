# Deferred work

- source_spec: `_bmad-output/implementation-artifacts/spec-community-facebook-formats.md`
  summary: Templates / teasers article ne renseignent pas encore couleurs, scène ni channelsJson
  evidence: `applyTemplateToDraftAction` et créations teaser créent des drafts sans les nouveaux champs ; preview retombe sur défauts IG.

- source_spec: `_bmad-output/implementation-artifacts/spec-community-facebook-formats.md`
  summary: Sélecteur de canaux ne se resynchronise pas dynamiquement quand kind change (client)
  evidence: checkboxes statiques ; TikTok peut être coché en classique et n’échoue qu’au submit.

- source_spec: `_bmad-output/implementation-artifacts/spec-fix-studio-ours-vercel-fs.md`
  summary: Historique Studio Ours reste éphémère sur Vercel (/tmp) — pas de modèle Prisma CommunityMascotGeneration
  evidence: Architecture Phase 1 fichier local ; cold starts / instances multiples perdent l’historique ; migration Postgres prévue docs/mascot-generation-architecture.md.

- source_spec: `_bmad-output/implementation-artifacts/spec-fix-studio-ours-vercel-fs.md`
  summary: saveGeneration soft-fail ne signale pas l’échec de persistance aux callers (ok:true avec record non écrit)
  evidence: Choix Phase 1 pour éviter le crash UI ; le client garde le record en session ; signal métier dédié reporté.

- source_spec: `_bmad-output/implementation-artifacts/spec-fix-studio-ours-vercel-fs.md`
  summary: Chemins ok:false (blocked/failed) n’ajoutent pas le record à l’historique client local
  evidence: Comportement pré-existant de StudioOursForm ; incohérence mineure vs refresh serveur.
