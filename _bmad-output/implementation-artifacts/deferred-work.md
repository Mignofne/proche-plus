# Deferred work

- source_spec: `_bmad-output/implementation-artifacts/spec-multi-exercices-visite-post-outcome.md`
  summary: CAP-4 — lier tous les outcomes d’une session au check-in / VisitSession pour « Mes dernières visites » et timeline pro
  evidence: Hors slice UI post-outcome ; `VisitCheckIn` et `ExerciseAttempt` non reliés aujourd’hui ; schéma + surfaces historique à traiter à part.

- source_spec: `_bmad-output/implementation-artifacts/spec-multi-exercices-visite-post-outcome.md`
  summary: Microcopy `submitExerciseOutcome` encore orientée « prochaine visite » alors que l’aidant peut enchaîner maintenant
  evidence: Messages advance/fallback dans actions.ts ; headline post-outcome OK mais sous-texte peut contredire le CTA.

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

- source_spec: `_bmad-output/implementation-artifacts/spec-studio-ours-mock-ux.md`
  summary: Bouton copier/télécharger le prompt Phase 1 absent
  evidence: Le prompt est le livrable mais reste dans un `<pre>` sans action d’export.

- source_spec: `_bmad-output/implementation-artifacts/spec-studio-ours-remote-gen.md`
  summary: Fidélité C-v3 du free tier Pollinations limitée — OpenAI + Blob recommandés en prod
  evidence: Sans OPENAI_API_KEY le remote utilise Pollinations ; identité approximative vs sheet validé.

- source_spec: `_bmad-output/implementation-artifacts/spec-studio-ours-remote-gen.md`
  summary: Images /tmp éphémères sur Vercel sans BLOB_READ_WRITE_TOKEN
  evidence: image-store écrit sous /tmp ; cold start → 404 sur l’API image.
