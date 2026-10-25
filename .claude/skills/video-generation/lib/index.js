/**
 * Shared helpers for the video generation skill.
 */

/**
 * Download a video from a URL and save it to a local path.
 * @param {string} url - Video URL (e.g. Replicate output URL).
 * @param {string} dest - Local file path to write to.
 * @returns {Promise<string>} The destination path.
 */
export async function downloadVideo(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download video: ${res.status} ${res.statusText}`);
  }

  const { createWriteStream } = await import("node:fs");
  const { Readable } = await import("node:stream");
  const { pipeline } = await import("node:stream/promises");
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));

  return dest;
}

/**
 * Format a prediction object into a human-readable summary.
 * @param {object} prediction
 * @returns {string}
 */
export function summarizePrediction(prediction) {
  const lines = [
    `ID: ${prediction.id}`,
    `Status: ${prediction.status}`,
    `Created: ${new Date(prediction.created_at).toLocaleString()}`,
  ];

  if (prediction.output) {
    const outputs = Array.isArray(prediction.output) ? prediction.output : [prediction.output];
    lines.push(`Output: ${outputs.join(", ")}`);
  }

  if (prediction.error) {
    lines.push(`Error: ${prediction.error}`);
  }

  return lines.join("\n");
}

/**
 * Validate that a prompt is non-empty.
 * @param {string} prompt
 * @returns {string} The trimmed prompt.
 * @throws {Error} if empty.
 */
export function requirePrompt(prompt) {
  const trimmed = (prompt || "").trim();
  if (!trimmed) {
    throw new Error("Prompt is required. Provide a description of the video you want.");
  }
  return trimmed;
}
