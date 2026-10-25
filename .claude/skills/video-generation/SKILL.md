---
name: video-generation
description: Mimic reference videos via analyze → Style Blueprint → shot prompts, plus generate/generate-image/status/models via Replicate
---

# clipmimic

Mimic high-performing reference videos and generate new video content from inside Claude Code using text-to-video and image-to-video models. This skill wraps video-generation APIs (Replicate by default) so you can create, poll, and retrieve videos without leaving your coding session.

## Commands

| Command | What it does |
|---------|--------------|
| `/video:analyze <url\|file>` | Analyze a reference video into a Style Blueprint JSON (shots, pacing, aspect). Needs ffmpeg; yt-dlp for URLs |
| `/video:mimic <blueprint.json> --topic ...` | Turn a blueprint + your topic into per-shot prompts; add `--generate` to submit to Replicate |
| `/video:generate` | Create a video from a text prompt (text→video) |
| `/video:generate-image` | Create a video from an image + prompt (image→video) |
| `/video:status <job-id>` | Check the status of a generation job |
| `/video:models` | List Replicate models (API returns the full catalog — pick a video model `owner/name` or `owner/name:version-hash`) |

## Setup

1. Install Node.js 18+. For `/video:analyze` also install `ffmpeg` (includes `ffprobe`) and, to analyze URLs, `yt-dlp` (e.g. `brew install ffmpeg yt-dlp`). Generation-only commands need just Node.js.
2. Set your Replicate API token:

   ```bash
   export REPLICATE_API_TOKEN="your-token-here"
   ```

3. Use the commands above in Claude Code.

## Example

```
/video:generate A 5-second product demo video of a sleek smartwatch, cinematic lighting, slow pan, 1080p
```

## Mimic workflow

```
/video:analyze https://example.com/reference.mp4 --out blueprint.json
/video:mimic blueprint.json --topic "smartwatch launch" --brand Acme
/video:mimic blueprint.json --topic "smartwatch launch" --generate
```

The blueprint copies structure and pacing, not footage. Only analyze videos you have the rights to use.
