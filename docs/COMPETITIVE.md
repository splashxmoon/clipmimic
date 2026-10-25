# Competitive Landscape

Research date: 2026-10-25. Star counts are from GitHub page fetches on that date unless marked (approx/unverified). Last-commit dates and maintenance status were not verified for any entry.

## Table

| Name | URL | What it does | Stars | Gaps we can own |
|---|---|---|---|---|
| ReelMimic (edenfunf) | https://github.com/edenfunf/reelmimic | Closest rival. Analyzes a reference video (shots, BPM, transitions, colors, framing) and produces a new 2D animated video in the same style. Local web app plus Claude Code/Codex agents. MIT. | 162 (counts reset 2026-10-20 after repo was briefly private) | 2D animation only, no live-action or photoreal. Slow (30-60s video takes 1-3.5 hrs). Web app, not slash commands. Burns the user's Claude/Codex plan. Mostly Windows-tested. No generative video-model providers. |
| browser-use/video-use | https://github.com/browser-use/video-use | Claude Code skill. Edits the user's raw footage (cuts, filler removal, grading, subtitles) via ElevenLabs Scribe transcript. | 29.7k | Edits footage you already have. No reference analysis, no generation. Requires an ElevenLabs key. |
| MoneyPrinterTurbo | https://github.com/harry0703/MoneyPrinterTurbo | Topic to short video: LLM script, stock footage, TTS, subtitles, music. MIT. | 134.9k | Stock-clip montage, not style imitation. No reference-video input. Standalone app, not an agent skill. |
| ShortGPT | https://github.com/RayVentura/ShortGPT | Experimental framework for YouTube Shorts/TikTok channel automation. MIT. | 8.1k | Template-driven, no reference analysis. Not agent-native. |
| Remotion Agent Skills | https://github.com/remotion-dev/skills | Official skills teaching Claude Code to write Remotion (React) video code. Also a plugin: https://remotion.dev/docs/ai/claude-code-plugin | 5.6k | Programmatic motion graphics only. No analysis or generative-model step. Remotion has a special license, with a company license needed in some cases. |
| remotion-mcp-server (Glama listing only) | https://glama.ai/mcp/servers/qwt21au7pa | MCP server: yt-dlp download of a reference reel, frames and transcript extraction, then generates a Remotion TSX composition in that style. | Unverified (GitHub repo URL not found) | Template reels (dialogue bubbles, listicles) only. Output is Remotion code, not generated footage. Provenance and licence unverified. |
| digitalsamba/claude-code-video-toolkit | https://github.com/digitalsamba/claude-code-video-toolkit | AI-native video production toolkit for Claude Code: narration, music, visuals, Remotion render, LTX-2.3 clips. MIT. | 2.3k | Produces from scratch or briefs. No reference-to-blueprint step. |
| lemo-opuscar (name as listed) | https://github.com/topics/claude-code-skill | Film-style toolbox for Claude Code with 59 coded styles, no video model. Seen on the topic page only. | 6.7k (topic page, unverified) | Preset styles, not extracted from a user-supplied reference. |
| anything2explainer | https://github.com/topics/claude-code-skill | Topic to narrated Remotion explainer with TTS and subtitles. Seen on the topic page only. | 2.7k (topic page, unverified) | Explainer format only. |
| narrator-ai-cli-skill | https://github.com/topics/claude-code-skill | Skill wrapping a CLI for AI narration and film commentary. Topic page only. | 3.1k (topic page, unverified) | Niche (commentary). Depends on an external service. |
| 0xadvait/ai-video-skill | https://github.com/0xadvait/ai-video-skill | Claude Code skill. End-to-end generation across 6 models (Seedance 2.0, Kling, Wan, Veo, OmniHuman) with a QC loop. MIT. | 7 | Generation only, no reference analysis. Very new. |
| yuvalsuede/agent-media-skill | https://github.com/yuvalsuede/agent-media-skill | Skill for UGC-style video and image generation via the agent-media CLI. Apache-2.0. | 43 | Single paid CLI backend. No reference analysis. |
| zysilm-ai/gemini-video-producer-skill | https://github.com/zysilm-ai/gemini-video-producer-skill | Drives the Gemini/Google Flow web UI for continuous-shot video. | Unverified | Browser automation, fragile, needs a Google account with Flow access. |
| deapi-ai/claude-code-skills | https://github.com/deapi-ai/claude-code-skills | Transcription, image, video, TTS and OCR via deAPI. Notes a successor repo, deapi-ai/skills. | Unverified | Vendor-locked. No analysis step. |
| mfrashad/video-analyze | https://github.com/mfrashad/video-analyze | Skill. Downloads IG/TikTok/YouTube/X videos, extracts transcript-aligned frames, writes replication prompts for UI/design. | 0 | Overlaps our analyze step, but for UI replication, not short-form style. Tiny. |
| Higgsfield | https://higgsfield.ai | Commercial video generation platform with a Claude connector. Per the tool's own instructions the connector can browse generations and models but cannot generate media. Higgsfield-prompting skills also exist (e.g. rediumvex/ai-video-generator-claude, unverified). | n/a (closed source) | Closed and paid. No open Style Blueprint. |
| mcp-video-vision / MCP Video Recognition (Gemini) | https://glama.ai/mcp/servers/@mario-andreschak/mcp_video_recognition | MCP building blocks. Frame and scene extraction, Gemini-based video description. | Unverified | Analysis primitives only. No structured blueprint, no regeneration. |

Not verified: no source found for a "viral-video analysis" open-source tool with hook, pacing and caption scoring. GitHub API queries for "viral video analyzer" and "mimic claude skill" returned 0 results, though the API began returning 403 (rate limit) partway through, so treat the negative as weak evidence. Other tools often cited in this space (Higgsfield skills, OpenMontage, etc.) were not confirmed.

## Takeaways

1. The direct concept exists. ReelMimic (162 stars, 2D-animation only, web app) is the one to differentiate from or learn from. Name "ReelMimic" is taken.
2. Big stars sit in topic-to-video (MoneyPrinterTurbo 134.9k) and footage editing (video-use 29.7k). Neither starts from a reference.
3. Reference analysis exists only in fragments: remotion-mcp-server (unverified), video-analyze (0 stars), ReelMimic.

## Gaps to own

- A portable, human-editable Style Blueprint schema (hook, shots, pacing, captions, audio, CTA) that is useful on its own. No competitor publishes one.
- Photoreal/live-action regeneration through swappable providers (Replicate and others), not 2D only and not single-vendor.
- Three-command UX (/video:analyze, /video:mimic, /video:generate) running in minutes. ReelMimic takes hours.
- Cost and provider transparency: cost estimate before generation, dry-run mode, provider fallback.
- Brand/topic injection (captions, CTA, voice, logo) as a first-class step.
- Licensing and ethics guardrails: mimic structure and style, not copy footage or likeness. Warn on scraping ToS. Nobody in the table addresses this.
- Zero extra account for the baseline path (local ffmpeg plus Whisper) versus video-use needing ElevenLabs.
- Works as a Claude Code skill and also exposes an MCP server for other agents.

## Added at final check (2026-10-25)

- **[0xpratzyy/dissect](https://github.com/0xpratzyy/dissect)** (33 stars at time of check): "Reverse-engineer any video (YouTube, TikTok, Reels, X...) into a reusable blueprint for making similar videos. A Claude Code skill." This is a direct competitor, and it contradicts the earlier note that no open-source video analysis skill with blueprints was found. Review it before launch and position clipmimic against it (generation via Replicate, `/video:mimic` per-shot prompts, plugin install). Not reviewed in depth.
