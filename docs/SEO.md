# ClipMimic landing site and search launch

Canonical destination: **https://splashxmoon.github.io/clipmimic/**. Source: `site/`. Prepared 2026-10-25; not evidence that hosting, indexing or repository visibility has changed. This work adds a buildless site and deployment workflow, not a live deployment or search-account verification.

## What ships

- Hand-written semantic HTML and responsive CSS using the README's ink, paper, amber and storyboard motif. No runtime JavaScript, trackers, external fonts or framework. Local SVGs are workflow illustrations, not generated-video evidence.
- One descriptive title (under the task's 60-character cap), meta description (under 155), self-canonical URL, Open Graph and Twitter card metadata, favicon and explicit image dimensions.
- Factual SoftwareSourceCode and SoftwareApplication JSON-LD: MIT, JavaScript, repository URL, dependencies and manual-edit limits. No fabricated ratings, reviews, usage figures, price offers or endorsements.
- FAQPage JSON-LD whose questions and answers exactly match visible FAQ content. This is semantic markup, not a promise of a search enhancement.
- `sitemap.xml` containing only the canonical landing page; no invented last-modified date. `404.html` is noindex and excluded from the sitemap. Local `llms.txt` guides agents to the site and source docs; it is not a ranking signal guarantee.
- `robots.txt` with an informational sitemap declaration. **GitHub project Pages serves it at `/clipmimic/robots.txt`, while crawlers consult `/robots.txt` at the host root.** It does not govern host crawling. If the account owner controls the root Pages site, configure the real root robots file there; otherwise submit the sitemap directly. [Google robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).
- `.github/workflows/pages.yml` deploys only `site/` using checkout, configure-pages, upload-pages-artifact and deploy-pages, with Pages/OIDC permissions and the `github-pages` environment. No build step or paid generation.

The title/description character caps are editorial constraints, not Google limits. Google can rewrite title links and snippets and truncate to the device. Helpful visible text, crawlable links and accurate claims matter more than keyword density. [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [title guidance](https://developers.google.com/search/docs/appearance/title-link), [snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

## Deploy and verify public access

1. Review and merge the site/workflow into `main`. In GitHub Settings → Pages, choose **GitHub Actions** as the source. Confirm the `github-pages` environment permits the intended branch. Trigger the workflow or merge a `site/` change.
2. The repository is currently private. Pages for a private repository requires an eligible GitHub plan; repository privacy does not imply the deployed site is private. Confirm the owner's plan and intended public visibility before deployment. Source access is still required to install the private plugin. Do not promise anonymous installation until the repo is public or access is granted. [Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).
3. Check the Actions run and literal deployment URL. Visit the canonical URL without authentication. It must return HTTP 200, useful content and the correct canonical. Check CSS, logo, `llms.txt`, sitemap and an intentionally missing URL (real 404 status). A login wall or private Pages deployment cannot support the intended public indexing.
4. The workflow does not change Pages settings, repository visibility, account permissions, DNS or search-account ownership. No secrets are needed for the website. [GitHub custom workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Social preview: manual PNG export remains

`site/og.svg` copies `assets/social-preview.svg` (1280×640). SVG is not a reliable Open Graph/Twitter image format; the current metadata points to the existing source as a temporary fallback, **not a verified working social card**.

Before public launch, export `site/og.svg` to **`site/og.png` at 1280×640**, inspect its text/edges and optimize it below 1 MB. Change both `og:image` and `twitter:image` to `https://splashxmoon.github.io/clipmimic/og.png`, and change `og:image:type` to `image/png`. Verify the deployed image is public with the correct MIME type. Upload the exported preview separately in the GitHub repository's Settings → Social preview; website tags do not configure GitHub's repository card. The export and Settings upload are manual tasks, not completed by this change.

## Google Search Console

1. An authorized owner signs into [Search Console](https://search.google.com/search-console/). Add the **URL-prefix property** `https://splashxmoon.github.io/clipmimic/`. A domain property needs DNS control; the URL-prefix method supports a project path. [Property setup](https://support.google.com/webmasters/answer/34592).
2. Choose an offered verification method. For HTML-tag verification, add the exact supplied `google-site-verification` meta tag to `site/index.html` and redeploy. For file verification, place the supplied file at the exact required path and verify public access. Do not insert invented tokens or assume this task has verified ownership. Keep the verification proof after success. [Verification methods](https://support.google.com/webmasters/answer/9008080).
3. Under Sitemaps, submit `https://splashxmoon.github.io/clipmimic/sitemap.xml`. Confirm it is fetched successfully. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
4. Inspect the canonical homepage URL, run the live test and, once accessible and correct, request indexing. Review indexing status and Google's selected canonical later. Submission is a discovery hint, not a guarantee of crawling, indexing, ranking or timing.

## Bing Webmaster Tools

An authorized owner adds the same site in [Bing Webmaster Tools](https://www.bing.com/webmasters/). Either import an already verified Search Console property with the owner's authorization, or use Bing's offered meta-tag/file verification. Add the exact supplied verification artifact and redeploy; no account tokens are included here. Submit the full sitemap URL in Sitemaps, then inspect processing and URL-indexing reports. [Bing import guide](https://blogs.bing.com/webmaster/2019/9/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools/), [Bing sitemap help](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed).

## Structured-data verification

1. Run the [Rich Results Test](https://search.google.com/test/rich-results) on the deployed URL (or paste the code before deployment). Save the date, tested URL and result. It checks supported Google features, not every Schema.org type.
2. Also run [Schema Markup Validator](https://validator.schema.org/) to inspect SoftwareSourceCode, SoftwareApplication and FAQPage vocabulary. Parse the static JSON-LD locally; compare each FAQ question and answer against visible text whenever either is edited.
3. Google **stopped FAQ rich results on May 7, 2026**, then removed the feature documentation in June. FAQPage is kept here because requested and truthful, not because it earns FAQ results. Rich Results Test may show no supported FAQ item. Software markup without eligible offers/ratings may likewise produce no rich-result eligibility; do not fabricate fields to clear warnings. [Google changelog](https://developers.google.com/search/updates).
4. Ensure markup describes visible content, with no hidden promotional claims or fake reviews. Even eligible, valid markup never guarantees a rich result. [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Keyword and intent map

| Phrase / intent | Visible placement | Honest answer |
| --- | --- | --- |
| Claude Code video skill | Title, hero, install heading | Plugin and project-copy workflow, with access requirements |
| AI video generation | Hero, optional generation section, FAQ | Replicate is optional and paid; review outputs |
| Reference video analysis | Workflow heading and first step | Scene boundaries, shot durations, pacing, aspect and optional keyframes |
| Style Blueprint | Workflow, excerpt and FAQ | Schema version "1.0", structural JSON; not semantic scene understanding |
| Mimic viral videos | Platform section and FAQ question | Structural inspiration; no virality, identical output or performance guarantee |
| UGC ad clone | Platform copy and FAQ | New material only; no copied footage/likeness or fake endorsements |
| TikTok video mimic / Instagram Reels / YouTube Shorts | Platform section and FAQ | Rights-cleared short-form reference structure; manual export and labeling |
| 9:16 / short-form pacing | Platform copy and illustrative excerpt | Creative target/source aspect, not a guaranteed render setting |

One useful page answers related intents; do not create thin duplicate landing pages or repeat awkward keywords. No claim of search volume or ranking position is made.

## TikTok, Instagram and Shorts distribution

The platform section explains use cases rather than promising platform integrations. ClipMimic does not upload, label posts or automatically assemble 9:16 exports. A 9:16 reference can inform a vertical plan; current generation sends prompts, so actual duration/aspect must be checked in model settings/output and final edit. The lead is developing a `--platform` preset; do not advertise it as shipped until the merged implementation and release help agree.

Use the [platform launch drafts](launch/tiktok-instagram.md) for a captioned, manually assembled demo showing actual tool output and costs. Required native AI-content disclosure depends on the finished footage/audio and each platform's current rules; caption disclosure is helpful context, not a replacement. Ad/sponsorship and rights requirements are separate. These channels can bring viewers to useful docs, but video views are not evidence of installs or successful renders.

## Measurement and owner checklist

Local verification: HTML and XML parse as well-formed; both JSON-LD blocks parse; all five FAQ question/answer pairs match visible text; local page assets resolve. The title is 51 characters and description 149. The static server returned HTTP 200. Friday screenshots were inspected at 1440px and 390px widths; code blocks scroll within their containers. Independent scope/install review found no material issues. These checks do not replace deployed HTTP/404 checks, keyboard testing, Rich Results Test, or public PageSpeed measurement.

- [ ] **Release owner:** correct Pages settings/plan, successful deployment, public 200 homepage, real 404 response and working assets; no auth gate on intended indexed content.
- [ ] **Docs owner:** all install steps match the merged release; transcript/vision/assembly remain roadmap until shipped; private-source access caveat is current.
- [ ] **Design owner:** export PNG, update both image tags/type and upload repository preview manually; check social unfurls.
- [ ] **Search owner:** verify Google/Bing using real supplied credentials/artifacts; submit sitemap and record processing status.
- [ ] **Search owner:** save structured-data validation results and FAQ text comparison; no fake ratings/offers.
- [ ] **QA owner:** inspect mobile/desktop, keyboard focus, skip link, contrast, horizontal overflow and code scrolling. Use PageSpeed Insights after public deployment; this task does not invent performance scores.
- [ ] **Search owner, weekly:** track impressions, clicks, CTR, average position and indexed canonical by date/query/page in Search Console and Bing. Averages are diagnostic, not a target guarantee; initial data may be sparse.
- [ ] **Community owner:** record source-channel links and voluntary install/first-output feedback. Distinguish page visits, video views, clones, installs and actual successful runs; none is a unique-user proxy by itself.
- [ ] **Team, after 30 days:** compare to the first observed baseline, fix common setup failures and update useful examples. Avoid attributing gains to a single tag or schema change without evidence.

No analytics script or personal-data collection is added. Search submission, account verification, PNG export, repository visibility changes and live deployment remain owner actions. Search rankings and inclusion are never promised.
