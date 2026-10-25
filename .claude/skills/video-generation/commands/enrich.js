/**
 * /clipmimic:enrich
 * Merge observations (what Claude saw watching the reference in the browser, or in
 * its keyframes) into a Style Blueprint. Creates the blueprint if it doesn't exist
 * and the observations include durationSec and shots with startSec/endSec.
 *
 * Usage (from Claude Code):
 *   /clipmimic:enrich <blueprint.json> <observations.json> [--out blueprint.json]
 */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { enrichBlueprint } from "../lib/enrich.js";

function parseArgs(argv) {
  const o = { files: [], out: "" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") {
      const v = argv[++i];
      if (!v || v.startsWith("--")) throw new Error("--out requires a value.");
      o.out = v;
    } else o.files.push(argv[i]);
  }
  return o;
}

async function main() {
  const { files, out } = parseArgs(process.argv.slice(2));
  if (files.length !== 2) throw new Error("Usage: /clipmimic:enrich <blueprint.json> <observations.json> [--out file]");
  const [bpPath, obsPath] = files;
  const obs = JSON.parse(await readFile(obsPath, "utf8"));
  const existing = existsSync(bpPath) ? JSON.parse(await readFile(bpPath, "utf8")) : null;
  const bp = enrichBlueprint(existing, obs);
  const dest = out || bpPath;
  await writeFile(dest, JSON.stringify(bp, null, 2));
  const described = bp.shots.filter((s) => s.description).length;
  console.log(`Blueprint saved to ${dest}: ${bp.shots.length} shots (${described} described), hook ${bp.hook.text ? "set" : "empty"}, CTA ${bp.cta ? "set" : "empty"}.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
