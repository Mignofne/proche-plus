# PRD Quality Review — Éditeur de posts Community Semi (prd-proche-plus-2026-08-01)

## Overall verdict
This is a lean, thesis-driven fast-path PRD that fits an internal Proche+ brand-publishing tool: Vision → UJs → FRs with testable consequences → Non-Goals → operational SMs hang together without persona or NFR theater. What holds up is scope honesty and strategic spine (WYSIWYG preview + Publication réelle). What’s at risk is shipping FR-11 / SM-2 while Open Question 1 (prod Comptes connectés) and a few FR gaps (file-size bounds, Bibliothèque médias, Overlay couleur) remain unresolved — fine for UX kickoff, not yet airtight for architecture lock on the publish path.

## Decision-readiness — adequate

The PRD states the core bet plainly (§1 Vision): today’s Semi path “enregistre surtout des brouillons” and “‘publier’ qui marque un statut interne sans pousser vers les plateformes,” and v1 must deliver “publication réelle vers les comptes connectés.” Non-Goals (§5) and Out of Scope (§6.2) name real cuts with reasons (“Canvas design libre… complexité UX/tech disproportionnée”). Open Questions (§8) are genuine, not rhetorical — especially #1 (which Comptes connectés exist in prod) and #4 (IG-first vs network-specific Preview).

Trade-offs are acknowledged more as open items than as closed decisions with “what we gave up.” For a founder-approved “Go” feature PRD that’s acceptable, but the load-bearing publish decision still lacks an explicit go/no-go gate tied to Q1. Someone pushing back on “API intégration in v1” finds the choice in FR-11’s assumption, not a surfaced alternative (export manuel is rejected, but “improve editor only / keep draft status” is only implied by Non-Goals and Q2).

### Findings
- **high** Publish path gated by unanswered prod readiness (§8 Q1 ↔ FR-11 / SM-2) — “Quels Comptes connectés Proche+ sont déjà disponibles en prod” is the blocker for “preuve d’envoi plateforme,” yet MVP In Scope (§6.1) lists “Publication réelle avec statut par canal” as if that dependency were settled. *Fix:* Add a decision gate (e.g. “SM-2 / FR-11 ship only if ≥1 IG or FB Compte connecté is live; else v1 ships editor+Preview with draft-only”) before architecture freeze.
- **medium** Preview format trade-off left open while FR-8/9 specify feed fidelity (§8 Q4 ↔ §4.4) — Q4 asks IG 4:5 vs FB vs “IG-first uniquement,” but FR-9 already commits to Instagram-like hierarchy (“média… → actions → preuve sociale… → Légende”). UX can start IG-first; architecture/stories need the answer written as a decision. *Fix:* Close as `[DECISION: Preview v1 = IG-first; other réseaux reuse same frame]` or similar, and move multi-format to Non-Goals / NOTE FOR PM.
- **low** Retry policy deferred without interim default (§8 Q3) — “retry auto vs alerte fondateur seule” affects FR-12 (“Retry possible…”) and ops. *Fix:* State MVP default (manual retry + named failure) in FR-12 consequences; leave auto-retry as Non-Goal.

## Substance over theater — strong

Content is earned for this shape. One named operator journey (Mégane / fondatrice), JTBD instead of a persona catalog, Vision anchored in Proche+ + Semi + reference `avec_alan` (not swappable into any CMS PRD). Success Metrics are capability proofs (compose without JSON; real platform proof), with counter-metrics that actually restrain bad optimization (SM-C1/C2). Non-Users (§2.2) do real work (aidants, agence multi-clients, SEO blog). No innovation theater; no boilerplate “must be scalable/secure.”

### Findings
*(none — dimension is strong.)*

## Strategic coherence — strong

Thesis is clear and repeated without dilution: end draft-only / JSON-overlay / fake-publish, deliver live Preview + overlays + real send so Proche+ posts match editorial bar. Features (§4.1–4.6) are a single arc matching UJ-1 then UJ-2, not a wishlist. Frustration #1 (“absence d’une preview live”) correctly centers FR-8/9. SM-1/SM-2 validate the thesis; SM-C1/C2 protect it. MVP kind is problem-solving + operator experience for an admin surface — matches stakes. Priority follows insight (Preview + Publication réelle), not “easy first.”

### Findings
*(none — dimension is strong.)*

## Done-ness clarity — adequate

FR pattern is strong for a fast-path PRD: almost every FR has **Consequences (testable)** with verifiable conditions (11ᵉ Slide refusée; Overlay ≠ Légende; succès/échec par canal; Europe/Paris labeled). That will carry story extraction better than adjective-heavy PRDs.

Gaps remain where UJs or descriptions imply behavior without FR-level bounds, and where conditionals leave in/out unclear.

### Findings
- **high** “Photo trop lourde” has no FR threshold (UJ-1 edge ↔ FR-1) — UJ-1: “une photo trop lourde / format refusé → message clair,” but FR-1 only covers formats refused, not size/weight. Engineers cannot know “done” for upload rejection. *Fix:* Add consequence e.g. “fichier > N Mo (ou pixels > …) → refus nommé ; autres Slides inchangées.”
- **medium** Bibliothèque médias described but not FR’d (§4.1 Description ↔ Glossary) — “peut aussi piocher dans la Bibliothèque médias” sits in the feature blurb; no FR/consequences for browse/select/license-ok. Silent scope: existing UI reuse vs new work. *Fix:* Add FR-2b (or fold into FR-1) with testable pick-from-library consequence, or mark `[NON-GOAL for MVP]` / `[ASSUMPTION: réutilise UI bibliothèque existante sans changement]`.
- **medium** Overlay couleur in/out ambiguous (FR-3) — “et couleur si déjà supportée” is not a requirement. *Fix:* Decide: “couleur in scope iff present in current Semi overlay model; else Non-Goal v1” with one testable consequence.
- **low** “Live ou quasi-live” softens FR-8 (§4.4) — consequence allows “live ou quasi-live” without a bound (e.g. update on blur vs <N ms). Acceptable for this tool, but story writers will invent the bar. *Fix:* Prefer “update without full page reload on Overlay/Légende/ordre change” (already partly stated) and drop “quasi-live.”

## Scope honesty — strong

Omissions are explicit and useful: §5 Non-Goals (Studio Ours, agence, vidéo timeline, A/B, aidant publish, blog SEO), §6.2 with rationale and a real `[NOTE FOR PM]` on stories/reels. `[ASSUMPTION]` tags appear on the inferences that matter (carousel 10, formats, overlay blocks, single schedule slot, API path) and are indexed in §9. Non-Users prevent silent expansion to consumer surfaces. Open-items density (4 OQs + assumptions + 1 NOTE) is appropriate for stakes — honest, not theater — provided Q1 is treated as a ship gate (see Decision-readiness).

### Findings
- **low** Video boundary is soft (§5 ↔ FR-1 assumption) — Non-Goal says “Éditeur vidéo timeline complet (le kind vidéo existant peut rester)” while FR-1 assumes “vidéo hors scope éditeur photo sauf kind vidéo déjà existant.” Readers might assume video publish polish is in or out inconsistently. *Fix:* One sentence: “v1 n’ajoute pas de capacité vidéo ; kind vidéo existant inchangé / hors critères d’acceptation de ce PRD.”

## Downstream usability — adequate

Chain-top intent is stated (§0: “fondateur / PM, puis UX, architecture et epics”). Glossary (§3) is present and mostly used identically across FRs/UJs (Post, Slide, Overlay, Légende, Preview, Publication réelle, etc.). IDs are contiguous and unique (UJ-1–2, FR-1–12, SM-1–3, SM-C1–2) with “Realizes UJ-…” / “Valide FR-…” cross-refs that resolve. UJs name Mégane as protagonist with entry/climax/resolution — right weight for a single-operator admin tool.

Extract friction: Bibliothèque médias and “preuve sociale simplifiée” / likes appear in requirements language without glossary or FR backing; mixed EN tokens (`kind`, `published`) are fine if brownfield but should stay consistent.

### Findings
- **medium** Glossary term without FR coverage (§3 Bibliothèque médias ↔ §4.1) — Same as Done-ness: UX/stories cannot source-extract a library path cleanly. *Fix:* FR or explicit Non-Goal / assumption (see above).
- **low** Unglossaried Preview chrome (§4.4 FR-9) — “preuve sociale simplifiée,” “likes,” “barre d’actions” drive UI fidelity but aren’t Glossary entries or bounded (static fake likes vs live counts). *Fix:* Glossary “Preuve sociale (Preview)” = simplified static affordance; Non-Goal real engagement counts.

## Shape fit — strong

Shape matches the product: internal admin Semi for Proche+ brand Community publishing — capability-spec spine, two operator UJs (not consumer multi-stakeholder journeys), operational SMs (not DAU theater), brownfield nods to existing editor/preview/tags/anti-PHI without rewriting the whole product. Length and formality are calibrated to a founder “Go” feature PRD, not enterprise ceremony. Not over-UJ’d; not under-specified on the publish thesis.

### Findings
*(none — dimension is strong.)*

## Mechanical notes

- **Glossary drift:** “Carrousel” (FR/Glossary) vs “carousel” in Vision/UJ path copy; “Semi” / “Community Semi” used as product surface but not defined in Glossary; `published` (statut interne) vs “Publication réelle” — intentional contrast, keep both if brownfield flag name is real.
- **ID continuity:** FR-1…12, UJ-1…2, SM-1…3, SM-C1…2 — contiguous, no duplicates; cross-refs resolve.
- **Assumptions Index roundtrip:** Inline tags for max 10, formats, overlay blocks, kind↔canal, single créneau, API path are indexed. Index also lists Europe/Paris, “Réseaux v1… OK partout,” and “Enjeu produit : Proche+” without matching `[ASSUMPTION: …]` inline tags — minor index-only entries (timezone is stated as FR requirement, not assumption).
- **UJ protagonists:** UJ-1 and UJ-2 both carry Mégane / fondatrice inline — OK.
- **Required sections for stakes:** Purpose, Vision, Target user + UJs, Glossary, Features/FRs, Non-Goals, MVP, Success Metrics (+ counters), Open Questions, Assumptions Index — sufficient for this internal feature PRD; no addendum.md present.
- **Missing addendum:** None expected; review based on `prd.md` alone.
