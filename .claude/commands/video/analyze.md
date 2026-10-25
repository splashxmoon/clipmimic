---
description: Analyze a reference video into a Style Blueprint JSON
argument-hint: <url|file> [--out blueprint.json] [--keyframes dir] [--dry-run]
allowed-tools: Bash(node:*)
---

Run the video-generation skill's `analyze` script with the user's arguments and report the result.

!`node .claude/skills/video-generation/commands/analyze.js $ARGUMENTS`

Summarize the blueprint (shots, pacing, aspect) and the output path. If ffmpeg or yt-dlp is missing, tell the user how to install it.
