# JobProof

JobProof is a working MVP for a low-budget digital product: an AI-style proof-of-work marketing engine for local home-service businesses.

It turns each completed job into:

- A public proof/case-study page
- A Google review request SMS/email
- A QR code
- A Google Business Profile post
- A Facebook/Instagram caption
- Testimonial prompt
- Image alt-text ideas
- A local portfolio/dashboard
- Lead capture on public proof pages
- Local analytics counters and CSV exports
- First-customer outreach scripts and a launch execution center
- Prospect CRM with scoring, statuses, personalized outreach copy, and CSV export
- One-click niche demo portfolio generator
- Launch checklist tracker
- Payment-link setup panel
- Backup/import/export for local MVP data
- PWA manifest and icon

The MVP is intentionally built to validate demand fast. It runs fully in the browser with localStorage persistence, so it can be shown to prospects immediately without backend costs.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Product pages

- `#home` — landing page and builder
- `#dashboard` — job proof dashboard
- `#portfolio` — public portfolio page
- `#proof/:id` — individual public proof page

## MVP validation offer

Start manually before automating everything:

> I’ll turn 5 recent completed jobs into project pages, Google review QR codes, Google Business Profile posts, and social captions for $49. If you like it, continue for $19/month.

## Production path

When validation works, wire the MVP to:

- Supabase Auth, Postgres, Storage
- Stripe Checkout + Customer Portal
- OpenAI/Anthropic/Gemini API for generated assets
- Resend for lead notifications and reminders
- PostHog for analytics
- Vercel for hosting

A production Supabase schema is included at `src/production-schema.sql`. Production API examples are included in `api-examples/`. Sales execution is documented in `SALES_PLAYBOOK.md`.

## Compliance note

JobProof should request honest reviews from real customers. Do not implement review gating, do not ask only happy customers for public reviews, do not ask for 5-star reviews, and do not incentivize reviews.
