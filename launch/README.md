# `launch/` — GhostMeta launch package

Phase 1.5 of the AI-image-privacy pivot. Everything in this directory
is *content* — copy templates, checklists, and asset specs that you
fire when ready. The code itself is already shippable (see Phase 1.4
commit `f1a52a4`).

## Files

| File | Purpose |
|---|---|
| `CHECKLIST.md` | T-7 → T+7 day-by-day plan with timing |
| `PRODUCT_HUNT.md` | Submission fields + maker's first comment |
| `SHOW_HN.md` | Show HN title + first-comment dive |
| `REDDIT_R_STABLEDIFFUSION.md` | Tech-heavy SD prompt-leak angle |
| `REDDIT_R_MIDJOURNEY.md` | Visual / job_id leak angle |
| `REDDIT_R_SORA.md` | Sora-specific C2PA panic angle |
| `REDDIT_R_CHATGPT.md` | Casual-user "did you know" angle |
| `TWITTER_THREAD.md` | 8-tweet launch thread, pinnable |
| `MEDIA_BRIEF.md` | Specs for demo GIF, OG image, PH gallery |

## How to use

1. Read `CHECKLIST.md` start-to-finish before T-7.
2. Capture the visual assets per `MEDIA_BRIEF.md` first — they bottleneck everything.
3. Pre-fill PH submission (everything but the actual click) at T-3.
4. On launch day, post in this exact order: PH → Twitter → HN → r/StableDiffusion → r/midjourney → r/sora → r/ChatGPT.
5. Reply to every comment within 30 minutes for the first 8 hours.

## What's intentionally NOT here

- Email blast (no list yet — defer until 1k+ subscribers)
- Press release (over-engineered for an indie launch)
- Paid promo budget (organic first; if PH ranks top 5, consider $200-500 of LinkedIn promoted post in week 2)
- Affiliate / partnerships package (after the first 1000 active users)

## After launch

- Move this whole directory to `launch/archive/2026-05/` once the dust
  settles. Don't keep stale launch copy in the repo's main `launch/`
  surface — it looks dated and confuses contributors.
- Capture every "feature request" comment from PH/HN/Reddit into a
  tracker; those are pre-validated Phase 1.6 candidates.
- Write a "what we learned" retrospective on day 7 and post it to
  /r/IndieHackers — it's the cheapest second wave.
