---
description: Watch a reference video in the browser (Claude in Chrome), then save what you observed into a Style Blueprint
argument-hint: <video-or-post-url> [--out blueprint.json]
---

Study the reference video at the URL in `$ARGUMENTS` the way an editor would, then save a Style Blueprint. Only do this for videos the user has the right to analyze, and never bypass logins, paywalls or access controls.

## 0. Pick the route

- If browser tools from the **Claude in Chrome** extension are available (tab/navigate, read page, screenshot, run JavaScript), use them for steps 1-4.
- If they are not, say so, tell the user to install and enable the extension (or paste frames), and fall back to `/clipmimic:analyze <url>` which needs `yt-dlp` and `ffmpeg`.

## 1. Open the page and collect page facts
Navigate to the URL in a tab the user can see. Read the page text and record: platform, title/caption, creator, hashtags, posted date, and engagement (views, likes, comments, shares) exactly as displayed. Skim the top comments for what the audience reacted to (quote sparingly).

## 2. Measure the video
Use JavaScript on the page to read the `<video>` element: `duration`, `videoWidth`, `videoHeight`. If you cannot reach the element, estimate from the player and say it is an estimate.

## 3. Watch it shot by shot
Pause and seek with `video.pause(); video.currentTime = t` and take a screenshot at t = 0, 0.5, 1, 2 and then every cut or every ~2s. For each shot note: start/end seconds, what is on screen (subject, framing, camera move), on-screen text, transition. Also record: the hook (what happens and what is said in the first ~3s, and the hook type: question, bold claim, pattern interrupt, demo), caption style (font weight, color, position, animation), music/voice-over, and the call to action. If the video is long, say how many shots you sampled.

## 4. Save the observations
Write `observations.json` in the working directory:

```json
{
  "page": {"url": "", "title": "", "creator": "", "platform": ""},
  "engagement": {"viewCount": 0, "likeCount": 0, "commentCount": 0, "shareCount": 0},
  "durationSec": 0, "aspect": "9:16",
  "hook": {"text": "", "endSec": 3, "type": ""},
  "shots": [{"startSec": 0, "endSec": 2, "description": "", "onScreenText": "", "camera": "", "transition": ""}],
  "captions": {"present": true, "style": ""},
  "audio": {"music": "", "voiceover": "", "transcript": ""},
  "cta": "", "notes": []
}
```

Use only what you actually saw; leave a field out rather than guessing. Then run:

`node .claude/skills/video-generation/commands/enrich.js blueprint.json observations.json`

(This is the project-installed skill; plugin installs use ${CLAUDE_PLUGIN_ROOT}/skills/video-generation/commands/enrich.js.) If `blueprint.json` already exists from `/clipmimic:analyze`, shots are matched by index and enriched; otherwise it is built from your observations.

## 5. Report
Summarize the blueprint: what makes the hook work, pacing (avg shot length, cuts per minute), caption style, CTA. Suggest the next command: `/clipmimic:mimic blueprint.json --topic "..." --platform tiktok|reels|shorts`.
