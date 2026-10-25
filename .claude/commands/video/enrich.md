---
description: Merge observations (from watching a reference, or from its keyframes) into a Style Blueprint
argument-hint: <blueprint.json> <observations.json> [--out file]
allowed-tools: Bash(node:*)
---

Merge the observations into the blueprint and report what changed.

!`node .claude/skills/video-generation/commands/enrich.js $ARGUMENTS`

Summarize how many shots now have descriptions and whether the hook and CTA are set.
