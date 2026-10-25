/**
 * /video:mimic
 * Turn a Style Blueprint plus a new topic into per-shot generation prompts,
 * optionally submitting each shot to Replicate.
 *
 * Usage (from Claude Code):
 *   /video:mimic <blueprint.json> --topic "..." [--brand "..."] [--style "..."] [--generate]
 *
 * Without --generate it only prints the shot prompts (free, no API calls).
 */

import { readFile } from "node:fs/promises";
import { buildShotPrompts } from "../lib/mimic.js";
import { ReplicateClient } from "../lib/replicate.js";

function parseArgs(argv) {
  const o = { file: "", topic: "", brand: "", style: "", generate: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--topic") o.topic = argv[++i];
    else if (a === "--brand") o.brand = argv[++i];
    else if (a === "--style") o.style = argv[++i];
    else if (a === "--generate") o.generate = true;
    else o.file = a;
  }
  return o;
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.file) throw new Error('Usage: /video:mimic <blueprint.json> --topic "..." [--generate]');
  const bp = JSON.parse(await readFile(o.file, "utf8"));
  const shots = buildShotPrompts(bp, o);

  if (!o.generate) {
    for (const s of shots) console.log(`Shot ${s.index} (${s.durationSec}s): ${s.prompt}`);
    console.log("\nRe-run with --generate to submit these to Replicate.");
    return;
  }

  const model = process.env.REPLICATE_MODEL || "anotherjesse/zeroscope-v2-xl";
  const client = new ReplicateClient();
  for (const s of shots) {
    const p = await client.createPrediction(model, { prompt: s.prompt });
    console.log(`Shot ${s.index}: job ${p.id} started (check with /video:status ${p.id})`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
