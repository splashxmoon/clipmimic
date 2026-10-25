/**
 * /video:analyze
 * Analyze a reference video (URL or file) into a Style Blueprint JSON.
 *
 * Usage (from Claude Code):
 *   /video:analyze <url|file> [--out blueprint.json] [--keyframes dir] [--dry-run]
 *
 * Requires: ffmpeg + ffprobe; yt-dlp for URLs. Only analyze videos you have the rights to use.
 */

import { writeFile } from "node:fs/promises";
import { ingest } from "../lib/ingest.js";
import { analyze } from "../lib/analyze.js";

function parseArgs(argv) {
  const opts = { ref: "", out: "blueprint.json", keyframes: "", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "--keyframes") {
      const value = argv[++i];
      if (!value || value.startsWith("--")) throw new Error(`${a} requires a value.`);
      if (a === "--out") opts.out = value;
      else opts.keyframes = value;
    }
    else if (a === "--dry-run") opts.dryRun = true;
    else opts.ref = opts.ref ? `${opts.ref} ${a}` : a;
  }
  return opts;
}

async function main() {
  const { ref, out, keyframes, dryRun } = parseArgs(process.argv.slice(2));
  const item = await ingest(ref, { dryRun });
  if (dryRun) {
    console.log(item.command || `Would analyze ${item.path}`);
    return;
  }
  const bp = await analyze(item.path, { source: item.source, keyframesDir: keyframes || undefined });
  await writeFile(out, JSON.stringify(bp, null, 2));
  console.log(`Blueprint saved to ${out}: ${bp.pacing.shotCount} shots, ${bp.durationSec.toFixed(1)}s, ${bp.aspect}, ${bp.pacing.cutsPerMinute} cuts/min.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
