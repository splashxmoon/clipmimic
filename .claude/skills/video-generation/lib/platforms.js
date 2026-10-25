/**
 * Short-form platform presets used by /video:mimic --platform.
 * Values are approximate public guidelines and change over time: treat them as
 * defaults to check against the platform's current documentation.
 */

export const PLATFORMS = {
  tiktok: {
    label: "TikTok",
    aspect: "9:16",
    resolution: "1080x1920",
    sweetSpotSec: [15, 45],
    maxSec: 600,
    hookSec: 2,
    avgShotSec: [1.5, 3.5],
    captionSafe: "keep captions and key subjects clear of the top ~12% and bottom ~25% and the right-edge button column",
  },
  reels: {
    label: "Instagram Reels",
    aspect: "9:16",
    resolution: "1080x1920",
    sweetSpotSec: [10, 30],
    maxSec: 180,
    hookSec: 2,
    avgShotSec: [1.5, 3],
    captionSafe: "keep captions and key subjects clear of the top ~14% and bottom ~20%, and inside the central 4:5 area so the profile grid crop works",
  },
  shorts: {
    label: "YouTube Shorts",
    aspect: "9:16",
    resolution: "1080x1920",
    sweetSpotSec: [15, 45],
    maxSec: 180,
    hookSec: 3,
    avgShotSec: [2, 4],
    captionSafe: "keep captions and key subjects clear of the bottom ~20% (title and channel overlay) and the right-edge buttons",
  },
};

export function getPlatform(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().replace(/^instagram$|^ig$|^instagram-reels$/, "reels").replace(/^yt$|^youtube$|^youtube-shorts$/, "shorts");
  const p = PLATFORMS[key];
  if (!p) throw new Error(`Unknown platform "${name}". Use one of: ${Object.keys(PLATFORMS).join(", ")}.`);
  return { key, ...p };
}

/** Advice comparing a blueprint with a platform preset; never blocks. */
export function platformWarnings(bp, platform) {
  if (!platform) return [];
  const w = [];
  const [lo, hi] = platform.sweetSpotSec;
  if (bp.durationSec > platform.maxSec) w.push(`Reference is ${bp.durationSec.toFixed(0)}s, longer than the ${platform.label} limit (~${platform.maxSec}s).`);
  else if (bp.durationSec > hi) w.push(`Reference is ${bp.durationSec.toFixed(0)}s; ${platform.label} short-form usually performs in the ${lo}-${hi}s range. Consider trimming shots.`);
  if (bp.aspect !== platform.aspect) w.push(`Reference aspect is ${bp.aspect}; ${platform.label} expects ${platform.aspect}. Shot prompts will be written for ${platform.aspect}.`);
  const first = bp.shots[0];
  if (first && first.endSec - first.startSec > platform.hookSec * 2) w.push(`The first shot runs ${(first.endSec - first.startSec).toFixed(1)}s; ${platform.label} hooks usually land within ~${platform.hookSec}s.`);
  const [minShot, maxShot] = platform.avgShotSec;
  const avg = bp.pacing?.avgShotSec;
  if (avg && avg > maxShot * 2) w.push(`Average shot length is ${avg}s, slow for ${platform.label} (typically ${minShot}-${maxShot}s).`);
  return w;
}
