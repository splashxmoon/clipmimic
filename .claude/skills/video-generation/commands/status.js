/**
 * /clipmimic:status <job-id>
 * Check the status of a video generation job.
 *
 * Usage (from Claude Code):
 *   /clipmimic:status <prediction-id>
 *
 * Environment:
 *   REPLICATE_API_TOKEN  - required
 */

import { ReplicateClient } from "../lib/replicate.js";
import { summarizePrediction } from "../lib/index.js";

async function main() {
  const id = process.argv.slice(2).join(" ").trim();
  if (!id) {
    console.error("Usage: /clipmimic:status <prediction-id>");
    process.exit(1);
  }

  const client = new ReplicateClient();
  const prediction = await client.getPrediction(id);
  console.log(summarizePrediction(prediction));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
