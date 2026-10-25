---
description: Generate a video from a text prompt via Replicate
argument-hint: <prompt>
allowed-tools: Bash(node:*)
---

Run the video-generation skill's `generate` script with the user's arguments and report the result.

!`node .claude/skills/video-generation/commands/generate.js $ARGUMENTS`

Report the job id and saved file path. Replicate usage is billed.
