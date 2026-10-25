# TikTok, Instagram Reels and Shorts demo drafts

Drafts only. Prepared 2026-10-25. Verify the merged release, actual demo results and current upload rules before a human posts. No automatic posting, uploads, disclosure labels or final assembly are supplied by ClipMimic. Do not post placeholder costs/results or imply the demo exists until recorded.

## The demo to make

Use an owned or rights-cleared reference with short-form pacing, ideally 9:16. Analyze it, inspect the Style Blueprint, and create prompts about a genuinely different topic. Optionally generate original shots through Replicate. Record the real terminal output and blueprint, then edit the selected shots into a vertical demo yourself. Count attempts and actual billed cost; never disguise manual editing as an automatic feature. Do not use unlicensed reference footage in a before/after comparison.

Suggested working commands:

```text
/video:analyze ref.mp4 --out blueprint.json --keyframes frames
/video:mimic blueprint.json --topic "A refillable water bottle launch"
```

Only add `--generate` after reviewing the shot count, model pricing and prompts. The lead is developing `--platform`; omit that flag until verified in the released command. Prompted timing/aspect is not an exact render/export guarantee.

## TikTok caption draft

I used ClipMimic to study a reference’s cut rhythm, then plan new shots for a different topic inside Claude Code. This is AI-generated demo footage, manually selected and edited—not a copied video or an automatic final edit.

The code is open source. This example used [model/version], [attempt count] attempts and [actual billed cost] in Replicate. Reference: [owned/licensed source and credit, if shared].

Workflow and setup: github.com/splashxmoon/clipmimic (repository access may be required while private). What would make the shot blueprint more useful for your next short-form experiment?

Suggested relevant hashtags, choose a few: **#ClaudeCode #AIVideo #VideoEditing #OpenSource #ClipMimic**. Add **#AIGenerated** for clear context; it does not replace TikTok's native disclosure control. Do not add unrelated trending tags or claims of guaranteed viral reach.

## Instagram Reels caption draft

Same starting rhythm. A different story.

I built this example with ClipMimic: reference analysis → Style Blueprint → new-topic shot prompts → optional Replicate generation. I assembled the final reel manually. Footage in this demo is AI-generated; the reference was [owned/licensed reference details].

Model: [model/version]. Actual generation cost: [amount], across [attempts]. The code is MIT licensed; provider rendering is paid. It doesn't extract transcripts, understand scenes with vision or automatically make the final edit in v0.1.

Code and setup: github.com/splashxmoon/clipmimic. Which part would you want to inspect first: shot timing or the new-topic prompts?

Suggested hashtags: **#ClaudeCode #AIVideo #ReelsEditing #CreativeCoding #ClipMimic**. Keep only genuinely relevant tags. Apply the native AI disclosure control when required; caption language alone is not enough.

## On-screen script / shot plan

This is a proposed manually edited demo, not an output guarantee. Replace sample timing to fit actual recorded material; captions should remain legible within platform safe areas.

| Time | Show | On-screen words / spoken context |
| --- | --- | --- |
| 0–3s | Actual new-topic generated shot with persistent disclosure | “AI-generated demo · edited manually” / “Can a reference’s rhythm help plan a different story?” |
| 3–7s | Rights-cleared reference or your own abstract timing diagram | “Study the timing. Create original material.” Do not show the reference without publication rights |
| 7–12s | Actual analyze command and output | “Scene cuts → shots → pacing” |
| 12–17s | Actual JSON excerpt | “Style Blueprint · schemaVersion 1.0” / “This is structural analysis, not scene understanding” |
| 17–22s | Actual mimic command and generated prompts | “New topic → per-shot prompts” |
| 22–28s | Generated shots, with any manual assembly clearly labeled | “Optional paid Replicate rendering · [real cost / attempts]” |
| 28–33s | Actual terminal output or repo page | “MIT code. Manual final edit. Setup: github.com/splashxmoon/clipmimic” |

For YouTube Shorts, an honest title is **“Reference pacing → new shot prompts with Claude Code”**. Use the same disclosure/cost context in the description, link setup, and apply YouTube's required native altered/synthetic disclosure where applicable. Do not claim an automated finished Short.

## Current AI-content labeling rules

These notes address organic demo posts, not an exhaustive paid-ad policy review. Recheck the finished clip and audio against current rules on upload day; UI wording can change.

- **TikTok:** requires labeling AI-generated content containing realistic images, audio or video; also encourages labeling fully generated or substantially AI-edited content generally. For realistic demo footage, enable the **AI-generated content** setting in the posting options. Caption/on-screen context supplements the native tool. [TikTok official guidance](https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content).
- **Instagram / Meta:** use the disclosure tool for digitally created/altered photorealistic video or realistic-sounding audio. Meta's displayed **AI info** labels can also come from detected signals; do not assume detection fulfills your uploader duty. [Meta disclosure requirements](https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/), [updated labeling approach](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/).
- **YouTube / Shorts:** disclose realistic, meaningfully altered or synthetic material, including realistic invented scenes and fabricated actions/speech, using the native upload disclosure control. Ordinary production assistance and clearly unrealistic animation do not automatically trigger the same requirement. Current help describes **AI use** controls; follow the UI presented to your account. [YouTube official requirements](https://support.google.com/youtube/answer/14328491?hl=en).
- **Sponsorship is separate:** disclose qualifying brand relationships using the required platform tools and applicable ad disclosures. AI labeling is not a substitute for a paid-partnership label. [Instagram branded-content guidance](https://www.facebook.com/help/instagram/616901995832907).

## Human posting checklist

- [ ] Release commands match what the demo actually runs; no unreleased preset claims.
- [ ] Show real output, actual costs/retries and manual steps. No invented testimonials, customer endorsements, view counts or performance comparisons.
- [ ] Reference, generated subjects, music, fonts, voice and likeness permissions reviewed; no DRM/private-access bypass. AI disclosure does not grant rights.
- [ ] Manually export/check 9:16 if appropriate; inspect safe areas, readable captions, audio levels and current upload specifications.
- [ ] Apply each required native AI disclosure to the finished clip/audio, plus plain-language context. Retain provenance metadata where available.
- [ ] Apply sponsorship/paid-partnership disclosure where relevant. Check additional policies if publishing as an advertisement.
- [ ] Remove placeholders and confirm the destination link is usable for the intended audience; do not advertise an inaccessible private repo as openly installable.
- [ ] Ask a useful feedback question, not for likes, follows or coordinated comments. No fake accounts, engagement pods, bought views or unrelated hashtags.
- [ ] After posting, answer real questions and log platform views separately from voluntary install/first-output feedback. No virality promises.
