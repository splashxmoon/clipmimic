/**
 * /clipmimic:mimic
 * Turn a Style Blueprint plus a new topic into per-shot generation prompts,
 * optionally submitting each shot to Replicate.
 *
 * Usage (from Claude Code):
 *   /clipmimic:mimic <blueprint.json> --topic "..." [--brand "..."] [--style "..."] [--platform tiktok|reels|shorts] [--json] [--generate]
 *
 * Without --generate it only prints the shot prompts (free, no API calls).
 */

import { readFile } from "node:fs/promises";
import { planMimic } from "../lib/mimic.js";
import { ReplicateClient } from "../lib/replicate.js";

function parseArgs(argv) {
  const o = { file: "", topic: "", brand: "", style: "", platform: "", generate: false, json: false };
  const value = (flag, i) => {
    const v = argv[i];
    if (!v || v.startsWith("--")) throw new Error(`${flag} requires a value.`);
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--topic") o.topic = value(a, ++i);
    else if (a === "--brand") o.brand = value(a, ++i);
    else if (a === "--style") o.style = value(a, ++i);
    else if (a === "--platform") o.platform = value(a, ++i);
    else if (a === "--generate") o.generate = true;
    else if (a === "--json") o.json = true;
    else o.file = a;
  }
  return o;
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.file) throw new Error('Usage: /clipmimic:mimic <blueprint.json> --topic "..." [--generate]');
  const bp = JSON.parse(await readFile(o.file, "utf8"));
  const plan = planMimic(bp, o);
  const { shots } = plan;

  if (o.json) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  for (const w of plan.warnings) console.log(`Note: ${w}`);

  if (!o.generate) {
    for (const s of shots) console.log(`Shot ${s.index} (${s.durationSec}s): ${s.prompt}`);
    console.log("\nRe-run with --generate to submit these to Replicate.");
    return;
  }

  const model = process.env.REPLICATE_MODEL || "anotherjesse/zeroscope-v2-xl";
  const client = new ReplicateClient();
  for (const s of shots) {
    const p = await client.createPrediction(model, { prompt: s.prompt });
    console.log(`Shot ${s.index}: job ${p.id} started (check with /clipmimic:status ${p.id})`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
