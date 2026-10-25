---
description: Turn a Style Blueprint and a topic into per-shot prompts (add --generate to submit to Replicate)
argument-hint: <blueprint.json> --topic "..." [--brand ...] [--style ...] [--generate]
allowed-tools: Bash(node:*)
---

Run the video-generation skill's `mimic` script with the user's arguments and report the result.

!`node ${CLAUDE_PLUGIN_ROOT}/skills/video-generation/commands/mimic.js $ARGUMENTS`

Show the shot prompts. Without --generate nothing is billed; mention that --generate submits paid Replicate jobs.
