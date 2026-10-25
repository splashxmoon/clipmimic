# Security & Responsible Use

## Reporting a vulnerability
Please use GitHub's private "Report a vulnerability" feature on this repo. Don't open a public issue for security problems.

## API tokens
The skill reads `REPLICATE_API_TOKEN` from the environment. Never commit tokens or `.env` files, and never paste them into issues.

## Scraping and copyright
`/video:analyze` can download reference videos with yt-dlp. You are responsible for having the right to download and analyze each video and for following the platform's terms of service. The skill extracts structure and style (cuts, pacing, aspect), not footage to republish.
