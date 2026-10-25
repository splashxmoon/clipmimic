/**
 * Thin wrapper around external binaries (ffmpeg, ffprobe, yt-dlp).
 * `run` is injectable so tests can mock the binaries.
 */

import { execFile } from "node:child_process";

export function run(bin, args, { timeoutMs = 10 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    execFile(bin, args, { timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        if (err.code === "ENOENT") {
          return reject(new Error(`"${bin}" was not found. Install it (e.g. brew install ${bin === "ffprobe" ? "ffmpeg" : bin}) and try again.`));
        }
        return reject(new Error(`${bin} failed: ${(stderr || err.message).trim().slice(0, 500)}`));
      }
      resolve({ stdout, stderr });
    });
  });
}
