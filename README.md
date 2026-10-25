<p align="left"><img src="assets/logo.svg" width="64" height="64" alt="clipmimic logo: three frames joined by a cut" /></p>

# clipmimic

**Study the rhythm. Make something new.** An open-source **Claude Code skill** for **AI video generation**: analyze a reference video from **TikTok, Instagram Reels, YouTube Shorts** or a local file, turn its shot timing, hook, captions and pacing into a Style Blueprint, and create prompts for a new topic.

Use it to **mimic reference videos**’ structure and edit rhythm for **short-form** explainers, product demos and **UGC ads**. Claude can even watch the reference in your browser through the Claude in Chrome extension. Replicate can optionally render new shots; final editing remains manual. Structural inspiration does not mean copying footage, scripts, music or a creator’s likeness.

[![License: MIT](https://img.shields.io/badge/license-MIT-294936)](LICENSE)
![Node.js 18+](https://img.shields.io/badge/node-%E2%89%A518-294936)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-e9a448)](CONTRIBUTING.md)
[![Claude Code skill](https://img.shields.io/badge/Claude_Code-skill-232823)](.claude/skills/video-generation/SKILL.md)

![An illustrated editing strip becomes a structured blueprint, then a new set of shots. Diagram only, not generated footage.](assets/banner.svg)

[What is clipmimic?](#what-is-clipmimic) · [Quickstart](#quickstart) · [Commands](#commands) · [Watch in the browser](#watch-a-reference-in-the-browser) · [Platforms](#tiktok-reels-and-shorts-presets) · [What v0.1 does](#what-v01-does) · [FAQ](#faq) · [Contribute](CONTRIBUTING.md)

> **v0.1 scope:** reference analysis (scene cuts, pacing, aspect, keyframes, page metadata and captions for URLs), browser-assisted observation, and per-shot prompt planning, with optional paid generation. No automatic final-video assembly. Verified end to end with ffmpeg and yt-dlp on a real public video; see [What v0.1 does](#what-v01-does).

## What is clipmimic?

clipmimic is a Claude Code skill and plugin that turns a high-performing reference video into a reusable **Style Blueprint** (hook, shots, pacing, captions, audio, call to action) and then writes new shot prompts for your own topic, in the same structure and rhythm. It supports TikTok, Instagram Reels and YouTube Shorts references, runs locally with ffmpeg, and can optionally send the shots to Replicate for generation. It copies structure and style, not footage.

## From reference to new shots

```mermaid
flowchart LR
    A["Reference video<br/>rights-cleared file or supported URL"] --> B["Style Blueprint<br/>schemaVersion: &quot;1.0&quot;"]
    B --> C["New shot prompts<br/>your topic + reference timing"]
    C -. "optional --generate" .-> D["Replicate<br/>new shot generation"]
    D --> E["Manual review and editing"]
```

The blueprint keeps the timing inspectable. It records scene-cut boundaries, shot durations, pacing and aspect ratio; for URLs it also records page metadata, engagement counts and the video’s own captions (hook text is taken from the first seconds of speech). Keyframe extraction is optional, and `/video:watch` can add hook type, shot descriptions, on-screen text and caption style. Mimic uses that structure to build prompts about your topic. It does not identify the reference’s meaning or recreate a completed edit.

## Quickstart

**Requirements:** Claude Code for the skill workflow; Node.js **18+** for scripts; **ffmpeg + ffprobe** for analysis; **yt-dlp** for supported URL inputs. Local analysis and prompt planning do not call Replicate. Rendering requires a Replicate account and API token and **costs money**. Claude Code access has its own terms/costs.

### Plugin install

```text
/plugin marketplace add splashxmoon/clipmimic
/plugin install video@video-generation-marketplace
```

The plugin is named `video`, so commands appear as `/video:analyze`, `/video:mimic` and so on.

### 1. Install the skill files

From a checkout of this repository, copy the skill into your project:

```sh
mkdir -p /path/to/your-project/.claude/skills
cp -R .claude/skills/video-generation /path/to/your-project/.claude/skills/
cp -R .claude/commands /path/to/your-project/.claude/
```

`.claude/commands/video/*.md` registers the `/video:*` slash commands (project-level command folders namespace as `video:name`). They call the scripts by project-relative path, so install into the project, not `~/.claude`.

Keep `commands/` and `lib/` together. On macOS, the analysis tools can be installed with `brew install ffmpeg yt-dlp`; on other platforms install those tools through your preferred package manager and confirm they are on `PATH`.

**Future distribution route:** once the public repository layout has been validated with the skills CLI, installation can use `npx skills add splashxmoon/clipmimic`. The owner/repo are placeholders; this route is not yet a verified published install. Copying JavaScript files alone does not establish `/video:*` slash-command registration.

### 2. Analyze a local reference and plan new shots

In Claude Code, the documented command interface is:

```text
/video:analyze ref.mp4 --out blueprint.json
/video:mimic blueprint.json --topic "A launch video for a refillable water bottle"
```

If your installed release does not expose those slash commands, run the scripts from your project root:

```sh
node .claude/skills/video-generation/commands/analyze.js ref.mp4 --out blueprint.json
node .claude/skills/video-generation/commands/mimic.js blueprint.json --topic "A launch video for a refillable water bottle"
```

To save keyframes, add `--keyframes frames` to analysis. URL input additionally needs yt-dlp and permission to access/use that source. Inspect the resulting blueprint and prompts before spending on rendering.

### 3. Optionally generate new shots

Set the token in the environment used by Claude Code or your terminal; never commit it:

```sh
export REPLICATE_API_TOKEN="your-token-here"
```

Use a currently available, compatible Replicate model. `REPLICATE_MODEL` can override the configured model with `owner/name:version-hash`; verify model version, input schema and pricing before submitting. Bundled defaults are not a guarantee of continued model availability.

```text
/video:mimic blueprint.json --topic "A launch video for a refillable water bottle" --generate
/video:status <job-id>
```

Or use the same `mimic.js` Node command above with `--generate`. This submits individual shot jobs and prints their IDs; it does not assemble a final video. Each attempt can incur a charge. Review the number of shots before running, then check the jobs and edit selected outputs in your preferred editor.

## Commands

These are the documented Claude Code command names. Each has a matching script in `.claude/skills/video-generation/commands/` for direct Node execution.

| Command | Purpose | Requirements / output |
| --- | --- | --- |
| `/video:analyze <file-or-url> --out blueprint.json` | Detect scene cuts, shot durations, pacing and aspect; for URLs also metadata, engagement and captions | ffmpeg/ffprobe; yt-dlp for URLs. Optional `--keyframes <dir>`, `--no-metadata`, `--no-transcript` |
| `/video:watch <url>` | Claude watches the reference in your browser and records hook, shots, captions, CTA, engagement | Claude in Chrome extension; then runs `/video:enrich` |
| `/video:enrich blueprint.json observations.json` | Merge observations into a blueprint (or build one from them) | Local; no network |
| `/video:mimic blueprint.json --topic "..."` | Build per-shot prompts for your topic | Local planning; optional `--brand`, `--style`, `--platform tiktok\|reels\|shorts`, `--json`; `--generate` submits paid jobs |
| `/video:generate <prompt>` | Generate video from a text prompt | Replicate token and compatible model |
| `/video:generate-image <image-url-or-path> <prompt>` | Generate video from an image and prompt | Replicate token; image must be accessible in the format the model accepts; a local path is not automatically uploaded |
| `/video:status <job-id>` | Inspect a prediction’s current state | Replicate token |
| `/video:models` | List models through Replicate | Replicate token; results are not restricted to video models |

## Watch a reference in the browser

With the [Claude in Chrome](https://claude.com/chrome) extension, `/video:watch <url>` has Claude open the post in a tab you can see, read what the page shows (title, hashtags, views, likes, comments), measure the `<video>` element, seek to each shot and screenshot it. It writes what it saw to `observations.json` and runs `/video:enrich`, which fills the fields ffmpeg cannot: hook text and type, shot descriptions, on-screen text, caption style, music and CTA. Best results come from running `/video:analyze` first for exact cut times, then `/video:watch` to describe each shot. If the extension is not available, the command says so and falls back to `/video:analyze`.

It only uses a browser session you control. It does not bypass logins, paywalls or access controls, and you are responsible for the right to study each video and for the platform’s terms.

## TikTok, Reels and Shorts presets

`/video:mimic blueprint.json --topic "..." --platform tiktok` (or `reels`, `shorts`) writes prompts for 9:16, adds caption safe-zone framing, carries over the reference’s hook line, caption style and CTA as style cues for new writing, and prints advice when the reference is too long, too slow, the wrong aspect, or opens too slowly for that platform. Add `--json` for the full plan. The presets are approximate public guidelines; check each platform’s current specs.

## What v0.1 does

| Available scope | Still on the roadmap |
| --- | --- |
| Scene-cut detection and shot boundaries | Whisper-style transcription when a video has no captions |
| Shot durations, pacing and aspect ratio | Automatic vision descriptions without Claude in the loop |
| Page metadata, engagement and captions for URLs (yt-dlp) | Semantic understanding of a reference |
| Browser observation and enrichment (`/video:watch`, `/video:enrich`) | Automatic assembly into a final edit |
| Style Blueprint with `schemaVersion: "1.0"` | Broader provider integrations |
| TikTok / Reels / Shorts prompt presets | |
| Optional Replicate job submission, status and generation helpers | |

Scene detection is a heuristic: fades, fast motion and similar shots can produce imperfect boundaries. Inspect the blueprint before using it. “UGC ads” describes a possible creative format, not a claim of authentic customer endorsement or proven ad results.

Read the [architecture and Blueprint contract](docs/ARCHITECTURE.md) and [roadmap](docs/ROADMAP.md) for implementation details and planned work. The installed release is the source of truth for supported behavior.

## How it compares

| Project | What it does | How clipmimic differs |
| --- | --- | --- |
| [0xpratzyy/dissect](https://github.com/0xpratzyy/dissect) | Claude Code skill that reverse-engineers a video into a reusable blueprint | clipmimic adds platform presets, Replicate generation, a browser-observation flow and a plugin install; dissect is a focused analysis skill. Try both. |
| [browser-use/video-use](https://github.com/browser-use/video-use) | Edits footage you already have | clipmimic plans new footage from a reference’s structure |
| [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo), [ShortGPT](https://github.com/RayVentura/ShortGPT) | Topic-to-video from stock clips | clipmimic starts from a specific reference’s pacing and hook, not a topic alone |
| [reelmimic](https://github.com/edenfunf/reelmimic) | Analyzes a reference and makes a new 2D animation in a similar style | clipmimic is a Claude Code skill and does not render animation itself |

Star counts and feature sets change; see [docs/COMPETITIVE.md](docs/COMPETITIVE.md) for sources and dates.

## FAQ

**Does this copy an exact reference video?**  
No. The workflow reuses structure and style cues such as pacing and shot duration to plan new material. It does not grant rights to footage, scripts, music, trademarks or someone’s likeness, and it cannot guarantee an identical result.

**Which references can I use?**  
Use your own footage or references you have permission to access and use for the intended purpose. Follow source-platform terms and applicable rights, including music and likeness permissions. A public URL is not a license. Do not bypass DRM, private accounts or other access restrictions.

**Is it free?**  
The code is [MIT licensed](LICENSE). Local analysis and prompt-only mimic make no Replicate requests. Replicate generation is paid, rates depend on the model, and retries/multiple shots can increase costs. Claude Code may also require a paid account. No free generation credits are included.

**What is inside a Style Blueprint?**  
Versioned JSON (`schemaVersion: "1.0"`) describing a reference’s technical structure: timing, shots, pacing and aspect, with keyframes when requested. It is not a transcript or a vision-generated scene summary. See the [schema documentation](docs/ARCHITECTURE.md).

**Which generation models work?**  
Replicate is the current provider gateway. Choose a model compatible with the command’s inputs and verify its current version and pricing. Model listings can include non-video models; schemas differ and not every model is supported by every command.

**Will I get a finished edited video?**  
Not automatically. Mimic produces shot prompts and optionally submits generation jobs. Review and assemble outputs yourself; audio, captions and final editing remain your responsibility.

**Will this reproduce a high-performing ad’s results?**  
No. A reference’s pacing can inform an experiment; it does not transfer audience fit, distribution, creative quality or measured business results.

[![Star history](https://api.star-history.com/svg?repos=splashxmoon/clipmimic&type=Date)](https://star-history.com/#splashxmoon/clipmimic&Date)

Brand assets: [logo](assets/logo.svg), [banner](assets/banner.svg), [1280×640 social preview](assets/social-preview.svg). The preview is an SVG source: export a PNG/JPG under 1 MB and upload it in GitHub Settings → Social preview manually. Artwork illustrates the workflow; it is not generated output or a benchmark.

[MIT License](LICENSE) · [Contributing](CONTRIBUTING.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](docs/ROADMAP.md) · [Discoverability plan](docs/DISCOVERABILITY.md)
