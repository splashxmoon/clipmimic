/**
 * Resolve a reference (local file or URL) to a local video path.
 * URLs are fetched with yt-dlp. You are responsible for having the rights to
 * download and analyze the video.
 */

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { run as defaultRun } from "./tools.js";

export function isUrl(ref) {
  return /^https?:\/\//i.test(ref);
}

export async function ingest(ref, { outDir = "./reference", run = defaultRun, dryRun = false } = {}) {
  if (!ref || !ref.trim()) throw new Error("A reference video URL or file path is required.");
  ref = ref.trim();

  if (!isUrl(ref)) {
    if (!existsSync(ref)) throw new Error(`File not found: ${ref}`);
    return { path: path.resolve(ref), source: ref };
  }

  const template = path.join(outDir, "%(id)s.%(ext)s");
  const args = ["-f", "mp4/best", "--no-playlist", "-o", template, "--print", "after_move:filepath", ref];
  if (dryRun) return { path: null, source: ref, command: ["yt-dlp", ...args].join(" ") };

  await mkdir(outDir, { recursive: true });
  const { stdout } = await run("yt-dlp", args);
  const file = stdout.trim().split("\n").pop();
  if (!file) throw new Error("yt-dlp did not report an output file.");
  return { path: path.resolve(file), source: ref };
}
