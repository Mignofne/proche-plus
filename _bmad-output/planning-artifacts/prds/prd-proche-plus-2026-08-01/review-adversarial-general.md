# Adversarial Review — PRD Éditeur de posts Community Semi

**Reviewed:** `prd.md` (status: draft, 2026-08-01)  
**Memlog skimmed:** `.memlog.md` (founder Go / fast-path finalize)  
**Reviewer stance:** Cynical — assume the PRD under-specifies the hard parts and over-promises the easy ones.

---

## Findings

- The document still says `status: draft` while memlog records founder « Go » to finalize — ship-ready claims and draft metadata contradict each other; nobody can tell whether this is approved contract or work-in-progress.

- « Publication réelle » is the entire product bet, yet Open Question #1 still asks which connected accounts even exist in prod — the PRD green-lights Meta Graph + TikTok API without a verified auth/token baseline, so SM-2 can fail before a single FR is built.

- FR-11 assumes Meta Graph for IG/FB/Threads and TikTok API for video, but never defines how overlays become publishable assets: bake text into images client-side, server-side compositing, or platform-native text? Without that, « WYSIWYG preview » and « real API publish » can diverge silently and ship lies.

- Preview fidelity is the #1 frustration and SM-1/SM-3 hinge on it, yet Open Question #4 leaves IG 4:5 vs FB aspect ratio unresolved — « Instagram-like » without a primary aspect contract means false confidence on every non-IG channel.

- FR-3 allows « couleur si déjà supportée » without stating whether color is in or out of v1 — implementers will either invent a half-palette or drop color and break Alan-parity expectations the vision sells.

- Multi-network publish (FR-7, FR-11, FR-12) never specifies per-channel caption length, hashtag rules, carousel support, or required image dimensions — TikTok is listed as a v1 network while photo/carousel is « prioritarily » IG/FB/Threads; partial support is not a product rule, it is a surprise failure at send time.

- Scheduling (FR-10) requires Europe/Paris display but does not define storage (UTC instant vs local wall time), DST transition behavior, or what the worker does if the process is down at fire time — « programmé » without an execution contract is calendar theater.

- Open Question #3 (retry auto vs founder alert only) is left open while UJ-2 and FR-12 already promise retry on failed channels — ops policy and UX promise are unresolved and will fight each other in implementation.

- Open Question #2 (explicit Proche+-only draft vs real publish) is still open though the vision and FR-11 treat « Envoyer » as real publish replacing the internal `published` flip — without a safe dry-run path, every rehearsal risks a live post.

- FR-1 rejects unsupported formats « per file » but never states max file size, dimension limits, EXIF/orientation handling, or HEIC (ubiquitous on iPhone) — phone-first upload without HEIC/size rules guarantees the edge case in UJ-1 is the common path.

- Carousel reorder (FR-2) has no persistence/conflict rule if two sessions edit the same draft, and « live or quasi-live » preview (FR-3/FR-8) never defines latency, debounce, or offline — « without full page reload » is not an acceptance bar.

- Tags (FR-6) defers to existing anti-PHI rules without citing where those rules live or whether overlay text is scanned the same way as tags/caption — PHI can leak through title/subtitle/footer while tags look compliant.

- Success metrics are binary checkboxes (one composable post, one real publish) with no time box, error budget, or operator sample — SM-3 is « perceived time » with no measurement method; counter-metrics are slogans, not instruments.

- Non-goals exclude full video timeline but keep « existing video kind » and TikTok-if-video — the PRD never states whether video posts are editable, previewable, or publishable in this MVP, so scope bleeds at the edges.

- Bibliothèque médias appears in the glossary and FR-1 description but has zero FR of its own (search, license check, reuse into slides) — either cut it from v1 language or specify it; name-dropping is not scope.

- Auth is « authentifié fondateur » only; no FR for roles, audit of who published what, or what happens if a non-founder hits the route — brownfield admin surface without an explicit gate is an incident waiting.

- Status model is underspecified: draft / prêt / programmé / publié / échec partiel are narrative words, not a state machine — FR-12 partial success needs durable per-channel states, idempotency keys, and « do not republish successes » semantics that are absent.

- Reference `avec_alan` is aesthetic aspiration, not a checklist (safe zones, font scale relative to 1080-wide export, contrast, truncation) — « type Alan » will be argued in review forever without measurable visual acceptance criteria.

- Assumption index says networks and API path were « confirmé OK partout » / founder Go, yet §8 still lists account availability and preview format as open — confirmed assumptions and open questions overlap; the contract is not closed.

- MVP in-scope lists « Publication réelle avec statut par canal » while out-of-scope waves at « crops automatiques avancés » — without a minimum crop/fit rule per network, real publish will stretch or letterbox and the live preview will not match the live feed.

---

## Notes for downstream

This PRD is strong on jobs and FR numbering, weak where the weasel always hides: publish pipeline, asset baking, scheduling worker, and per-network constraints. Fast-path « Go » does not close Open Questions #1–#4; treating them as post-MVP is how you ship a prettier draft button.
