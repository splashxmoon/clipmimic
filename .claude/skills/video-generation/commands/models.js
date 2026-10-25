/**
 * /video:models
 * List public Replicate models. Replicate does not expose a video-only filter
 * on this endpoint, so the list is unfiltered and may include non-video models;
 * the caller must pick a video-generation model (owner/name:version-hash).
 *
 * Usage (from Claude Code):
 *   /video:models
 *
 * Environment:
 *   REPLICATE_API_TOKEN  - required
 */

import { ReplicateClient } from "../lib/replicate.js";

async function main() {
  const client = new ReplicateClient();
  const result = await client.listModels();

  const models = result.results || [];
  if (models.length === 0) {
    console.log("No models found.");
    return;
  }

  console.log("Available video-generation models:\n");
  for (const m of models) {
    console.log(`- ${m.owner}/${m.name}`);
    if (m.description) {
      console.log(`  ${m.description}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
