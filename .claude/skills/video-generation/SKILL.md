---
name: video-generation
description: Mimic reference videos via analyze → Style Blueprint → shot prompts, plus generate/generate-image/status/models via Replicate
---

# clipmimic

Mimic high-performing reference videos and generate new video content from inside Claude Code using text-to-video and image-to-video models. This skill wraps video-generation APIs (Replicate by default) so you can create, poll, and retrieve videos without leaving your coding session.

## Commands

| Command | What it does |
|---------|--------------|
| `/clipmimic:analyze <url\|file>` | Analyze a reference video into a Style Blueprint JSON (shots, pacing, aspect). Needs ffmpeg; yt-dlp for URLs |
| `/clipmimic:watch <url>` | Claude opens the reference in the browser (Claude in Chrome extension), watches it shot by shot, and saves observations into the blueprint |
| `/clipmimic:enrich <blueprint.json> <observations.json>` | Merge observations (hook text, shot descriptions, caption style, CTA, engagement) into a blueprint; builds one if none exists |
| `/clipmimic:mimic <blueprint.json> --topic ...` | Turn a blueprint + your topic into per-shot prompts. `--platform tiktok\|reels\|shorts` adds platform framing and pacing advice, `--json` prints the full plan, `--generate` submits to Replicate |
| `/clipmimic:generate` | Create a video from a text prompt (text→video) |
| `/clipmimic:generate-image` | Create a video from an image + prompt (image→video) |
| `/clipmimic:status <job-id>` | Check the status of a generation job |
| `/clipmimic:models` | List Replicate models (API returns the full catalog — pick a video model `owner/name` or `owner/name:version-hash`) |

## Setup

1. Install Node.js 18+. For `/clipmimic:analyze` also install `ffmpeg` (includes `ffprobe`) and, to analyze URLs, `yt-dlp` (e.g. `brew install ffmpeg yt-dlp`). Generation-only commands need just Node.js.
2. Set your Replicate API token:

   ```bash
   export REPLICATE_API_TOKEN="your-token-here"
   ```

3. Use the commands above in Claude Code.

## Example

```
/clipmimic:generate A 5-second product demo video of a sleek smartwatch, cinematic lighting, slow pan, 1080p
```

## Mimic workflow

```
/clipmimic:analyze https://example.com/reference.mp4 --out blueprint.json
/clipmimic:mimic blueprint.json --topic "smartwatch launch" --brand Acme
/clipmimic:mimic blueprint.json --topic "smartwatch launch" --generate
```

The blueprint copies structure and pacing, not footage. Only analyze videos you have the rights to use.

## Watching a reference in the browser

When the Claude in Chrome extension is available, prefer `/clipmimic:watch <url>`: it reads what the page shows (title, hashtags, engagement), measures the `<video>` element, seeks to each shot and screenshots it, then writes `observations.json` and runs `/clipmimic:enrich`. This fills the fields ffmpeg cannot see: hook text and type, shot descriptions, on-screen text, caption style, music, and CTA. Combine both routes: run `/clipmimic:analyze` first for exact cut times, then `/clipmimic:watch` to describe each shot. If a blueprint has keyframes (`--keyframes dir`), you can also view those images and describe them yourself, then run `/clipmimic:enrich`.

Never bypass logins, paywalls or access controls, and only study videos the user may use.

## Platforms

`/clipmimic:mimic --platform tiktok|reels|shorts` applies short-form presets (aspect, duration range, hook timing, caption safe zones) and prints warnings when the reference doesn't fit them. The presets are approximate; check each platform's current specs.
