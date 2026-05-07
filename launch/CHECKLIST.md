# GhostMeta Launch Checklist

Sequential plan. Tick as you go. Times in your local TZ (Europe/Paris).

## T-7 days — Foundation

- [ ] Apply Supabase migration `20260508_api_keys.sql` (Phase 1.4)
- [ ] Set Vercel env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Create Lemon Squeezy B2B Pro $19/mo variant; set `VITE_LEMON_SQUEEZY_B2B_MONTHLY_ID`
- [ ] Deploy main branch to Vercel; verify all 23 prerendered pages return 200
- [ ] Run a manual QA pass on the 12 landings (`/tools/...`) on mobile + desktop
- [ ] Submit updated sitemap to Google Search Console + Bing Webmaster
- [ ] Trigger IndexNow: `curl -X POST -H "Authorization: Bearer $INDEXNOW_SECRET" https://www.ghostmeta.online/api/indexnow`
- [ ] Generate the demo GIF (see `MEDIA_BRIEF.md` for spec)
- [ ] Generate the 5 Product Hunt gallery images
- [ ] Update OG image (`public/og-image-v2.jpg`) so it visually announces C2PA + AI generators

## T-3 days — Test the funnel

- [ ] Test the full B2B Pro flow with a real card (use Lemon's test mode if available)
- [ ] Generate a real API key via `/settings`, call `/api/v1/inspect` and `/api/v1/strip` from `curl`
- [ ] Verify quota counter increments in Supabase
- [ ] Test on a real Sora image, real Midjourney image, real DALL-E image — confirm detector reports the right generator
- [ ] Set up a basic alert (email or Sentry rule) on `/api/v1/*` 4xx/5xx spikes

## T-1 day — Warm-up

- [ ] Schedule Product Hunt launch for Tuesday or Wednesday, 12:01 AM PST (best window for upvote velocity)
- [ ] Pre-write the maker's first comment on PH (see `PRODUCT_HUNT.md`)
- [ ] Pre-warm Twitter: post 1-2 lighter tweets about C2PA in the days before so the launch thread isn't from a dead account
- [ ] DM 5-10 friendly accounts that might amplify (not asking for upvotes, asking for honest feedback)
- [ ] Confirm `/settings` works for a brand-new account (gates correctly, no errors)

## T-0 — Launch day

Launch order matters: PH first (algorithmic ranking), then HN, then Reddit, then Twitter. Spreading across the day prevents bot-detection clustering.

| Local time (Paris) | Action |
|---|---|
| **09:01** | Product Hunt goes live (was scheduled for 00:01 PST = 09:01 Paris). Post the maker's first comment immediately |
| **09:30** | Tweet the launch thread (`TWITTER_THREAD.md`); pin it; reply to PH page in tweet 1 |
| **10:00** | Post Show HN (`SHOW_HN.md`). HN front page window is 09:00-12:00 PST = 18:00-21:00 Paris but morning often gets less competition |
| **11:00** | Post r/StableDiffusion (`REDDIT_R_STABLEDIFFUSION.md`) |
| **14:00** | Post r/midjourney (`REDDIT_R_MIDJOURNEY.md`) |
| **17:00** | Post r/sora (`REDDIT_R_SORA.md`) |
| **20:00** | Post r/ChatGPT (`REDDIT_R_CHATGPT.md`) — biggest sub, stricter mod, post last so other channels are warm |
| All day | Reply to every PH / HN / Reddit comment within 30 min. Don't argue; thank, clarify, fix |

## T+1 to T+7 — Sustain

- [ ] Reply to every overnight comment within an hour of waking
- [ ] If PH cracks top 5 of the day, screenshot + share to Twitter
- [ ] Capture all "feature requests" from comments into a tracker — these are pre-validated Phase 1.6 candidates
- [ ] Watch GA4 / Cloudflare for spike pattern; verify Worker `/prices`-style canary (we use `/api/health`) shows real-human ratio is sane (recall the stabilité-protocole 99.9%-bots lesson)
- [ ] Day 3: post a thank-you thread on Twitter with one stat ("X images cleaned in 72h")
- [ ] Day 7: write a "what we learned launching" blog post; submit to /r/IndieHackers

## Hard rules

- Never ask for upvotes anywhere. Ask for feedback.
- Never cross-post identical text. Each post in `launch/REDDIT_*.md` is deliberately different.
- If a sub bans the post, do not repost. Move on. Long-term subreddit health > one launch.
- If HN flags as "too promotional", let it die quietly. Don't argue with the mods. Try again in a few weeks with a technical post (not a launch).
- Keep `/api/v1/*` quota counters honest — if a real customer hits 429s during launch surge, raise their quota by hand in Supabase, don't lie about it in marketing.
