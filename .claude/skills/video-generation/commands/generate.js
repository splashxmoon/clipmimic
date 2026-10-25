/**
 * /video:generate
 * Create a video from a text prompt using a Replicate video model.
 *
 * Usage (from Claude Code):
 *   /video:generate <prompt>
 *
 * Environment:
 *   REPLICATE_API_TOKEN  - required
 *   REPLICATE_MODEL      - optional, defaults to a zeroscope text->video model
 */

import { ReplicateClient } from "../lib/replicate.js";
import {
  downloadVideo,
  summarizePrediction,
  requirePrompt,
} from "../lib/index.js";

const DEFAULT_MODEL = "anotherjesse/zeroscope-v2-xl";

async function main() {
  const prompt = requirePrompt(process.argv.slice(2).join(" "));
  const model = process.env.REPLICATE_MODEL || DEFAULT_MODEL;

  const client = new ReplicateClient();
  console.log(`Generating video with model: ${model}`);

  const prediction = await client.createPrediction(model, {
    prompt,
    num_frames: 24,
  });

  console.log(`Job started: ${prediction.id}`);

  const finished = await client.poll(prediction.id);
  console.log(summarizePrediction(finished));

  if (finished.status === "succeeded" && finished.output) {
    const outputs = Array.isArray(finished.output)
      ? finished.output
      : [finished.output];
    const url = outputs[0];
    const dest = `./video-${prediction.id}.mp4`;
    await downloadVideo(url, dest);
    console.log(`\nVideo saved to: ${dest}`);
    console.log(`You can reference it in Claude Code as: ${dest}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
