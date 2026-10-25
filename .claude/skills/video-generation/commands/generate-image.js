/**
 * /video:generate-image
 * Create a video from an image + text prompt using a Replicate image->video model.
 *
 * Usage (from Claude Code):
 *   /video:generate-image <image-url-or-path> <prompt>
 *
 * Environment:
 *   REPLICATE_API_TOKEN  - required
 *   REPLICATE_MODEL      - optional, defaults to a stable video diffusion model
 */

import { ReplicateClient } from "../lib/replicate.js";
import {
  downloadVideo,
  summarizePrediction,
  requirePrompt,
} from "../lib/index.js";

const DEFAULT_MODEL = "stability-ai/stable-video-diffusion";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(
      "Usage: /video:generate-image <image-url-or-path> <prompt>"
    );
    process.exit(1);
  }

  const image = args[0];
  const prompt = requirePrompt(args.slice(1).join(" "));
  const model = process.env.REPLICATE_MODEL || DEFAULT_MODEL;

  const client = new ReplicateClient();
  console.log(`Generating video from image with model: ${model}`);

  const prediction = await client.createPrediction(model, {
    image,
    prompt,
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
