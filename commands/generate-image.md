---
description: Generate a video from an image and prompt via Replicate
argument-hint: <image-url> <prompt>
allowed-tools: Bash(node:*)
---

Run the video-generation skill's `generate-image` script with the user's arguments and report the result.

!`node ${CLAUDE_PLUGIN_ROOT}/skills/video-generation/commands/generate-image.js $ARGUMENTS`

Report the job id and saved file path. Replicate usage is billed.
