# Discoverability and launch plan

Working name: **clipmimic**. Canonical repository: `https://github.com/splashxmoon/clipmimic` (replace before publication). Plan reviewed 2026-10-25. This document proposes work; it does not assert that packaging, listings or releases already exist.

## Positioning and release truth

Lead with: “An open-source Claude Code skill for turning video references into reusable creative structure and generating new shots with Replicate.” Target developers making product demos, short-form explainers and creative prototypes. Search phrases: Claude Code video generation skill, reference video analysis, video style blueprint, text-to-video and image-to-video.

The prior implementation supports generate, generate-image, status and models. The lead and architecture owner agree that v0.1 scope also includes analyze (ffprobe/ffmpeg metadata, scene cuts, shot list, pacing, aspect and keyframes; yt-dlp URL input) and mimic (Style Blueprint plus new topic to per-shot prompts, optional Replicate submission with `--generate`). Verify all advertised commands against the released tag before posting. Transcript/hook-text extraction, vision scene descriptions and automatic final-video assembly remain roadmap. A scene-cut timestamp is not a semantic understanding of a scene.

“Reference-inspired” means structure, pacing and edit grammar, not copied footage, scripts, music or creator likeness. Use owned or licensed references; respect source terms and access restrictions. Never promise virality, matching commercial performance or identical output. Open-source software does not mean free provider inference. State the code license actually shipped and paid-provider requirements beside installation.

## GitHub is the primary conversion page

1. About description proposal: “Claude Code video generation skill: reference analysis, style blueprints and new-shot prompts, with Replicate generation.” Drop unshipped features until verified. Link the actual documentation/demo URL.
2. Start with truthful topics: `claude-code`, `agent-skills`, `video-generation`, `ai-video`, `replicate`, `text-to-video`, `image-to-video`, `javascript`, `open-source`. GitHub permits up to 20 topics; add reference-analysis only once shipped. [Topic rules](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).
3. README first screen: name + plain description, captioned output clip, exact tested install, requirements/cost, first successful command. Put natural keywords in title, first paragraph and descriptive headings; avoid keyword blocks. Follow with workflow, supported commands, example blueprint, limitations, troubleshooting, FAQ and contribution links. Link architecture/roadmap rather than presenting plans as features.
4. Design a **1280×640** social preview: legible name, one-line purpose, reference → blueprint → original output strip, real frames with permission. Export PNG/JPG under 1 MB and upload in repository Settings; committing it alone does not configure the preview. [GitHub guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
5. Tag tested releases (`v0.1.0`, then semver); release notes explain behavior, install, compatibility, known limits and migration. Attach reproducible sample assets/blueprints where licensed. No empty releases to manufacture activity.
6. Enable Discussions when a maintainer can answer: Q&A, Show and tell, Ideas. Pin “Start here / install troubleshooting” and “v0.1 feedback / known limitations” issues. Label small, bounded tasks `good first issue` and `help wanted`; include file pointers, acceptance criteria and how to verify. Welcome first contributions; do not label vague roadmap epics as beginner tasks.

## Skill and plugin distribution

These routes are separate; test each before documenting it as available.

| Route | Implementation / discovery action | Publication gate |
| --- | --- | --- |
| Direct skill | Self-contained `SKILL.md` plus needed scripts/resources, documented install location | Fresh-machine install and first command work |
| Claude plugin marketplace | Package a real plugin with `.claude-plugin/plugin.json`; publish `.claude-plugin/marketplace.json` containing marketplace `name`, `owner`, `plugins` with entry `name` and `source` | `claude plugin validate PATH`, then end-to-end install; no metadata-only promise |
| Anthropic directory | Follow the official plugin submission route after release | Review/acceptance is external; never imply Anthropic endorsement |
| anthropics/skills ecosystem | Follow its skill conventions and examples; link compatible format in docs | It is an example repository, not automatic listing for third-party skills |
| skills.sh | Test `npx skills add splashxmoon/clipmimic --skill video-generation -a claude-code` against actual layout | Correct command is **add**, not `npx skills install`; confirm final skill name |
| MCP registries | Defer unless a functioning MCP server adapter ships | A skill or REST wrapper alone is not an MCP server |

Proposed marketplace session commands (placeholders, not runnable release instructions yet):

```text
/plugin marketplace add splashxmoon/clipmimic
/plugin install <plugin-name>@<marketplace-name>
```

Use the manifest names, not guessed repo names. Read [marketplace docs](https://code.claude.com/docs/en/plugin-marketplaces), [plugin manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference), [publish instructions](https://code.claude.com/docs/en/plugins/publish), [anthropics/skills](https://github.com/anthropics/skills), [skills.sh docs](https://www.skills.sh/docs), [skills CLI](https://www.npmjs.com/package/skills), and [MCP Registry scope](https://modelcontextprotocol.io/registry/about). skills.sh installation telemetry is not a count of independent active users.

## npm publishing

Publish only a usable package/CLI, if that distribution is useful; npm is optional for a skill installed from GitHub. Choose an available name, set `description`, `keywords`, `repository`, `homepage`, `bugs`, SPDX `license`, supported Node engines and an explicit packaged-file allowlist. Suggested keywords: `claude-code`, `agent-skill`, `video-generation`, `replicate`, `text-to-video`, `image-to-video`. Add reference-analysis only when shipped. npm uses description/keywords for search. [package.json reference](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/).

Release owner runs tests and `npm pack --dry-run`, inspects the tarball for secrets/unneeded media, tests installation from that tarball, then publishes an approved release with the registry's current authentication requirements. Never embed API credentials. Keep npm version, Git tag and README installation aligned; do not publish an empty package for search exposure.

## Curated lists and directories

| Destination | Fit and action | Owner / constraint |
| --- | --- | --- |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code/blob/main/CONTRIBUTING.md) | After eligibility, recommend one useful resource | Community: current rules require 14 days with later activity OR 100 stars; human web issue form, no PR/CLI submission |
| [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills/blob/main/CONTRIBUTING.md) | Assess standalone reference-analysis value, not just API wrapping | Community: current rules require 10 stars and reject AI-assisted submissions; commercial API wrappers generally poor fit. Do not submit generated draft |
| [awesome-ai-video-tools](https://github.com/Thedurancode/awesome-ai-video-tools), [awesome-text-to-video](https://github.com/jianzhnie/awesome-text-to-video) | Read contribution rules and choose developer-tools category if present | Community: avoid paper/model-only categories and duplicate entries |
| [Product Hunt](https://help.producthunt.com/en/articles/17350772-launch-guide) | Public usable release, demo, maker comment, accurate free-code/paid-API distinction | Launch owner: self-hunt; ask for feedback, not votes; no ranking guarantee |
| [TAAFT](https://theresanaiforthat.com/submit) | Check current submission fit, terms and fees manually | Launch owner: route/fees not verified; no budget or listing promise |
| [Futurepedia](https://www.futurepedia.io/editorial-guidelines) | Curated listing candidate once release is usable | Launch owner: active submission route not verified; use official `.io` domain |
| [AlternativeTo](https://alternativeto.net/faq/) | Explain developer workflow and genuine alternatives; label license/platform accurately | Community: public/open beta and verified account; review/acceptance external |
| [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces) | A real static demo/gallery or runnable example with its own README | Demo owner: not a generic directory listing; do not expose provider token in a public client; verify hosting costs |

## AI search / AEO

Make documentation useful to quote: clear headings, stable links, versioned examples, explicit dependencies, limitations and short factual answers. Publish FAQ answers for “Can I generate video in Claude Code?”, “What does a Style Blueprint contain?”, “Does this recreate an exact video?”, “Is it free?”, “Which models work?” and “Can it assemble a final edit?”. Answers must match the released tag; explain paid inference and roadmap boundaries.

Root `llms.txt` is a concise navigation aid with relative links to maintained Markdown. Once hosted as documentation, resolve links and expose it at the site's root, with canonical absolute URLs if needed. It is a [documentation proposal](https://llmstxt.org/), not a ranking guarantee or access-control file. Google says no special AI text files or schema are required for its AI search features; prioritize crawlable, useful visible content. [Google guidance](https://developers.google.com/search/docs/appearance/ai-features). If a website ships, use accurate SoftwareSourceCode/SoftwareApplication structured data reflecting visible content; do not invent reviews or ratings. GitHub README metadata is not equivalent to controlling a website's JSON-LD.

## Community distribution

| Channel | Useful contribution | Posting gate |
| --- | --- | --- |
| HN Show HN | Runnable project, technical tradeoffs, evidence and author available for questions | Human must write final submission: HN prohibits generated text/automated posting. Recheck [Show HN](https://news.ycombinator.com/showhn.html), [guidelines](https://news.ycombinator.com/newsguidelines.html), and current [restriction notice](https://news.ycombinator.com/showlim) |
| r/ClaudeCode | Detailed build/lessons post or concise weekly showcase reply | [Rules](https://www.reddit.com/r/ClaudeCode/about/rules.json): ordinary project promotion belongs in showcase; no repeated ads |
| r/ClaudeAI | Explain how Claude helped and offer genuinely free-to-try path | [Rules](https://www.reddit.com/r/ClaudeAI/about/rules.json): eligibility/free-use requirements; paid Replicate rendering is not free |
| r/aivideo | Optional finished entertainment output only | [Full rules](https://www.reddit.com/r/aivideo/wiki/rules/) prohibit tool promotion, ads and demos/tests; do not post launch pitch here |
| r/SideProject | Builder story, one concrete question, honest limitations | Read current sidebar/pins; absence of listed rules is not blanket permission |
| X | Captioned clip + concise build thread + repo | No automated tagging, repeated unsolicited replies or vote requests |
| LinkedIn | Workflow/cost lessons for creator/developer teams | Show real outputs and attributable observations, not performance claims |
| YouTube | 2–4 minute install → reference → blueprint → shot prompts → output walkthrough | Captions, chapters, pinned repo link, recorded model/version/cost and failures |
| Discord | Help in Claude/AI-video/developer communities, then share in allowed showcase channel | Ask moderators where rules are unclear; no bulk DMs or unsolicited cross-posts |

Read local rules on posting day. Reddit's “10%” convention is not a universal platform permission rule. [Reddit guidance](https://support.reddithelp.com/hc/en-us/articles/28012014962580-How-do-I-keep-spam-out-of-my-community). Drafts under `launch/` are for review, not automatic sending.

## Content flywheel and legitimate growth

Each week use the tool to make one new demo: owned reference → structural analysis → new topic → prompts → generated shots. Publish a captioned reference-vs-output comparison with timing labels, explaining what was retained (e.g. cut rhythm) and what changed. Never call it a finished automatic edit if shots were assembled manually. Include model/version, settings, date, approximate billed cost, retries and manual steps; don't cherry-pick without saying how many attempts were made.

Turn that same evidence into one README example, YouTube walkthrough, short clip and a troubleshooting note. Invite community examples with explicit permission/credit; improve onboarding from recurring questions; release the improvement; repeat. Make output quality the reason to share.

Legitimate star growth: tasteful “Star to bookmark/follow updates” link, responsive issues, useful releases, credited contributors, relevant list submissions and transparent build notes. No purchased stars, bots, star exchanges, rewards contingent on stars, coordinated vote rings or unsolicited DMs. Track stars as secondary interest, not adoption.

## 30-day calendar

Day 1 starts when the team begins preparation, not a promised public date. Owner roles below are assignments to confirm within the team; engineering completion controls launch timing.

| Day | Owner | Deliverable / decision |
| --- | --- | --- |
| 1 | Lead | Freeze audience, release scope, working name and canonical URL |
| 2 | Release | Audit commands against tag; record shipped/planned matrix |
| 3 | Docs | Fresh-machine install walkthrough; cost/dependency explanation |
| 4 | Demo | Select licensed reference and new topic; record provenance |
| 5 | Demo | Capture blueprint and reproducible shot prompts |
| 6 | Release | Test failure paths with fixtures; inspect secret handling |
| 7 | Lead | Gate review: narrow scope if any advertised path fails |
| 8 | Docs | README first screen, FAQ and limitations |
| 9 | Design | 1280×640 preview and captioned thumbnail |
| 10 | Release | Validate skill/plugin packaging and install examples |
| 11 | Community | Invite a small set of willing testers; no mass outreach |
| 12 | Release | Fix highest-impact tester friction |
| 13 | Demo | Record full walkthrough; document actual cost/retries |
| 14 | Docs | Edit six channel drafts with real URLs and verified claims |
| 15 | Release | Tag release, changelog, clean install check; npm only if useful |
| 16 | Lead | Public repo/owned announcement; monitor issues |
| 17 | Community | X thread; answer questions and log source traffic |
| 18 | Community | Eligible Reddit showcase; tailor rather than duplicate |
| 19 | Demo | YouTube tutorial + linked example assets |
| 20 | Community | LinkedIn workflow post and concrete feedback question |
| 21 | Lead | Show HN only if current eligibility holds; human-written text |
| 22 | Release | Fix onboarding issues; patch release if warranted |
| 23 | Community | Assess list eligibility and submit only to fitting routes |
| 24 | Launch | Product Hunt if demo/readiness support it; otherwise defer |
| 25 | Community | Review directory terms; submit selected ones within budget |
| 26 | Demo | Second example based on recurring user question |
| 27 | Docs | Publish lessons, limitations and FAQ updates |
| 28 | Release | Evaluate optional npm/MCP distribution by actual demand |
| 29 | Lead | Review adoption and support burden by source |
| 30 | Team | Share outcomes; choose next month’s improvement and demo |

## Release checklist and owners

- [ ] **Lead:** replace `splashxmoon/clipmimic`, final name, URLs and human author details across all drafts; resolve architecture/implementation discrepancies.
- [ ] **Release:** verify advertised commands from a clean tagged checkout; public CI uses fixtures/dry-runs, never required paid live generation.
- [ ] **Demo:** an authorized human runs any optional billed demo, records actual charges and licenses, and approves media publication.
- [ ] **Docs:** install, requirements, code license, paid API costs, examples and limitations agree; no unsupported viral/clone claims.
- [ ] **Release:** validate chosen package routes and inspect artifacts; no placeholder install instructions in public copy.
- [ ] **Design:** upload preview in GitHub Settings; captions and small-screen legibility checked.
- [ ] **Community:** assign response coverage, set Discussions/pinned issues and bounded good-first-issues.
- [ ] **Launch:** re-read each destination's rules; human author rewrites HN and any human-only submission; confirm directory budget before spending.
- [ ] **Lead:** approve final public release/posts. This plan creates drafts only; posting, publishing and spending are separate actions.
- [ ] **Analytics owner:** baseline GitHub traffic/clones/stars, release/npm downloads where available, discussion/install-friction reports and voluntary first-output feedback. Keep weekly aggregates; do not collect tokens, prompts or videos without consent.

Success at day 30: identify which channels produce successful installs and useful feedback, reduce recurring install failures, and publish a reproducible second example. Record visitors → install attempts (when voluntarily reported) → first output → repeat use separately; GitHub clones, npm downloads and skills telemetry are proxies, not unique users. Set numeric targets only after baseline; no invented growth forecasts.
