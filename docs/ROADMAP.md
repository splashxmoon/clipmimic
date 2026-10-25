# Roadmap — Reference-Video Mimicking Skill

Milestones for the open-source Claude Code skill that turns a reference short into a **Style Blueprint**, adapts it to the user's topic/brand, optionally generates per-shot clips, and (later) assembles a final video. See [ARCHITECTURE.md](./ARCHITECTURE.md) for pipeline, status, and schema.

**Launch wording:** Describe analyze + mimic as **v0.1 release scope**. Publication / “available now” claims are **gated on tagged-release verification**. Do not claim full assemble or rich transcript/vision until those milestones land.

## v0.1 — Analyze + Mimic prompts (release scope)

**Goal:** From a local file (and optionally a public URL via `yt-dlp`), produce a validated Style Blueprint and turn it into per-shot prompts for a new topic/brand. Optional Replicate submit per prompt; **no** final ffmpeg assemble yet.

**Deliverables**

- [x] Skill layout with `SKILL.md` declaring `/video:analyze`, `/video:mimic`, plus `/video:generate`, `/video:generate-image`, `/video:status`, `/video:models`
- [x] Analyze path: ffmpeg/ffprobe metadata, scene/shot cuts, keyframes → Blueprint JSON
- [x] Mimic path: blueprint + `--topic` / `--brand` → per-shot prompts (optional `--generate`)
- [x] Style Blueprint `schemaVersion: "1.0"` fields: `source`, `durationSec`, `aspect`, `hook`, `shots[]`, `pacing`, `captions`, `audio`, `cta` (reconcile in `lib/blueprint.js` if worktrees overlapped)
- [ ] Sparse enrichment OK: empty `hook.text` / `captions.style` / `audio.transcript` / thin `shots[].description` until v0.2
- [ ] Provider client behind `lib/providers/` (or documented Replicate adapter)
- [ ] Fixture tests for blueprint validate + mimic prompts (no live API in PR CI)
- [ ] Docs linked from README; legal/ethics summary; **tagged-release verification** before “available” claims

**Exit criteria:** `/video:analyze` writes valid Blueprint; `/video:mimic` prints prompts; `npm test` green; generate/status/models still work; tag only after maintainer verification.

## v0.2 — Enrich + generate loop + assemble

**Goal:** Fill sparse blueprint fields; bounded per-shot generation; ffmpeg assemble into one MP4.

**Deliverables**

- [ ] Whisper (or API) → `audio.transcript` / hook & caption text where appropriate
- [ ] Vision over keyframes → richer `shots[].description` / hook visuals
- [ ] Full mimic generate path: cost estimate, `--yes`, `maxShots` / `maxDurationSec`, concurrency limits, resume
- [ ] `lib/assemble/` — concat clips to timings, burn or sidecar captions, simple audio bed
- [ ] Platform ingest stretch: thin TikTok / Reels / Shorts helpers where ToS-safe
- [ ] Beat/audio enrichment: optional BPM / beat-sync
- [ ] Examples: fixture video + sample blueprint + mimic prompts
- [ ] CI: unit + fixture e2e; optional paid smoke gated on secrets

**Exit criteria:** Dry-run and paid-path mimic can produce `mimic-<id>.mp4` under budget caps; ethics warning once per run.

## v1.0 — Reliable open-source release

**Goal:** Installable, discoverable skill with stable Blueprint contract, pluggable providers, and community packaging.

**Deliverables**

- [ ] Stable Style Blueprint `1.0` (changelog policy for breaking `schemaVersion` bumps)
- [ ] Second provider adapter **or** clear extension guide + interface tests (mocks)
- [ ] Programmatic overlays (Hyperframes/Remotion or equivalent) for readable on-screen text
- [ ] Quality bar: hook-window check, aspect presets (9:16 default), caption accessibility defaults
- [ ] Packaging: `.claude-plugin` / install docs, `LICENSE`, `CODE_OF_CONDUCT`, `SECURITY`, `CITATION.cff`
- [ ] Launch kit: README, examples gallery, CONTRIBUTING, issue/PR templates
- [ ] Local spend log + in-repo model price table
- [ ] Legal checklist (user rights attestation before scrape/download)

**Exit criteria:** Tagged `v1.0.0`; documented Claude Code install; fixture e2e without paid APIs; live provider e2e optional for maintainers.

## Out of scope (for now)

- Training or fine-tuning on scraped corpora
- Circumventing DRM / private accounts
- Pixel-perfect restyle of a specific creator’s face or trademarked IP
- Fully automated posting to social platforms
- Guaranteeing viral or performance outcomes

## Dependency map (other board work)

| Track | Needs from this plan |
|-------|----------------------|
| Skill BUILD | Schema + command status in ARCHITECTURE (v0.1 = analyze + mimic prompts) |
| README / brand | Mimic **style**, not footage; no “available now” until tag verified |
| Competitive / positioning | Blueprint + Claude Code slash UX |
| Discoverability / launch | v0.1 scope wording + tagged-release gate; no viral promises |
