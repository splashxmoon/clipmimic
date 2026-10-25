import assert from "node:assert";
import { describe, it } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { enrichBlueprint } from "../.claude/skills/video-generation/lib/enrich.js";
import { createBlueprint, computePacing } from "../.claude/skills/video-generation/lib/blueprint.js";
import { cutsToShots } from "../.claude/skills/video-generation/lib/analyze.js";
import { planMimic } from "../.claude/skills/video-generation/lib/mimic.js";
import { getPlatform, platformWarnings } from "../.claude/skills/video-generation/lib/platforms.js";

function base() {
  const shots = cutsToShots([2, 5], 8);
  return createBlueprint({ durationSec: 8, shots, pacing: computePacing(shots, 8) });
}

describe("enrichBlueprint", () => {
  it("merges observations into an existing blueprint without mutating it", () => {
    const bp = base();
    const out = enrichBlueprint(bp, {
      hook: { text: "Stop scrolling", type: "bold claim" },
      shots: [{ index: 1, description: "handheld demo", onScreenText: "50% off" }],
      captions: { style: "bold white bottom third" },
      audio: { music: "upbeat", transcript: "hello" },
      cta: "Link in bio",
      engagement: { viewCount: 1200000, likeCount: "bad" },
      notes: ["fast zoom on cut 1"],
    });
    assert.strictEqual(out.hook.text, "Stop scrolling");
    assert.strictEqual(out.shots[1].description, "handheld demo");
    assert.strictEqual(out.shots[1].onScreenText, "50% off");
    assert.strictEqual(out.captions.present, true);
    assert.strictEqual(out.audio.hasSpeech, true);
    assert.strictEqual(out.engagement.viewCount, 1200000);
    assert.strictEqual(out.engagement.likeCount, undefined);
    assert.strictEqual(bp.hook.text, "");
  });

  it("builds a blueprint from browser observations alone", () => {
    const out = enrichBlueprint(null, {
      page: { url: "https://example.com/v", platform: "tiktok" },
      durationSec: 10,
      shots: [
        { startSec: 0, endSec: 3, description: "face to camera" },
        { startSec: 3, endSec: 10, description: "product demo" },
      ],
    });
    assert.strictEqual(out.shots.length, 2);
    assert.strictEqual(out.pacing.shotCount, 2);
    assert.strictEqual(out.shots[0].description, "face to camera");
    assert.strictEqual(out.source, "https://example.com/v");
  });

  it("rejects bad input", () => {
    assert.throws(() => enrichBlueprint(null, { shots: [] }), /durationSec and shots/);
    assert.throws(() => enrichBlueprint(base(), { shots: [{ index: 9, description: "x" }] }), /shot 9/);
  });
});

describe("platform presets and mimic plan", () => {
  it("normalizes platform names and rejects unknown ones", () => {
    assert.strictEqual(getPlatform("Instagram").key, "reels");
    assert.strictEqual(getPlatform("youtube").key, "shorts");
    assert.throws(() => getPlatform("myspace"), /Unknown platform/);
  });

  it("warns when the reference is long, slow or the wrong aspect", () => {
    const shots = cutsToShots([30], 90);
    const bp = createBlueprint({ durationSec: 90, aspect: "16:9", shots, pacing: computePacing(shots, 90) });
    const w = platformWarnings(bp, getPlatform("reels"));
    assert.ok(w.some((m) => /short-form usually performs/.test(m)));
    assert.ok(w.some((m) => /aspect/.test(m)));
    assert.ok(w.some((m) => /slow/.test(m)));
  });

  it("carries hook, CTA, caption style and platform framing into prompts", () => {
    const bp = enrichBlueprint(base(), { hook: { text: "Wait for it" }, cta: "Follow", captions: { style: "yellow pop-in" } });
    const plan = planMimic(bp, { topic: "coffee", platform: "tiktok" });
    assert.match(plan.shots[0].prompt, /Wait for it/);
    assert.match(plan.shots.at(-1).prompt, /Follow/);
    assert.match(plan.shots[1].prompt, /yellow pop-in/);
    assert.match(plan.shots[1].prompt, /bottom ~25%/);
    assert.strictEqual(plan.platform, "tiktok");
  });
});

describe("CLI", () => {
  const cmd = (name, ...args) =>
    execFileSync("node", [`.claude/skills/video-generation/commands/${name}.js`, ...args], { encoding: "utf8" });

  it("enrich creates a blueprint, and mimic --json plans from it", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "enrich-"));
    const obs = path.join(dir, "obs.json");
    const bpPath = path.join(dir, "bp.json");
    writeFileSync(obs, JSON.stringify({ durationSec: 6, shots: [{ startSec: 0, endSec: 2 }, { startSec: 2, endSec: 6, description: "demo" }], hook: { text: "Hey" } }));
    assert.match(cmd("enrich", bpPath, obs), /2 shots \(1 described\)/);
    const plan = JSON.parse(cmd("mimic", bpPath, "--topic", "tea", "--platform", "shorts", "--json"));
    assert.strictEqual(plan.shots.length, 2);
    assert.strictEqual(JSON.parse(readFileSync(bpPath, "utf8")).hook.text, "Hey");
  });

  it("mimic and analyze fail clearly on missing flag values", () => {
    assert.throws(() => execFileSync("node", [".claude/skills/video-generation/commands/mimic.js", "x.json", "--topic"], { stdio: "pipe" }), /requires a value/);
  });
});
