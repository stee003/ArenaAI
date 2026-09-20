# JobProof Production Handoff

This file converts the current browser MVP into a production SaaS without changing the product strategy.

## Current MVP state

The app is currently a complete validation product that runs in the browser using localStorage. It is enough to sell demos, create sample pages, and validate whether small service businesses pay.

## Production milestone 1: hosted self-serve MVP

Goal: users can create accounts, save businesses/jobs/images, accept leads, and pay.

### Tasks

1. Create a Supabase project.
2. Run `src/production-schema.sql` in Supabase SQL editor.
3. Create a Supabase Storage bucket named `job-images`.
4. Add environment variables from `.env.example`.
5. Replace localStorage state with Supabase queries.
6. Replace browser image data URLs with Supabase Storage uploads.
7. Add Stripe Checkout for:
   - $49 beta setup
   - $19/month Starter
   - $39/month Pro
8. Add lead notification email via Resend.
9. Deploy to Vercel.

## Production milestone 2: real AI generation

Use a serverless function. Never call OpenAI/Anthropic/Gemini directly from the browser.

### API route behavior

`POST /api/generate-assets`

Input:

```json
{
  "business": {
    "name": "BrightWash Pressure Cleaning",
    "phone": "(555) 014-8821",
    "serviceArea": "Plano, TX",
    "primaryService": "Pressure washing",
    "reviewUrl": "https://g.page/r/example/review"
  },
  "job": {
    "serviceType": "Driveway pressure washing",
    "city": "Plano, TX",
    "neighborhood": "Willow Bend",
    "customerName": "M.",
    "notes": "Removed algae and tire marks from concrete driveway."
  }
}
```

Output:

```json
{
  "seoTitle": "Driveway Pressure Washing in Plano, TX | BrightWash Pressure Cleaning",
  "projectHeading": "Driveway Pressure Washing in Plano, TX",
  "shortSummary": "...",
  "pageBody": "...",
  "googlePost": "...",
  "socialCaption": "...",
  "reviewSms": "...",
  "reviewEmailSubject": "...",
  "reviewEmail": "...",
  "testimonialPrompt": "...",
  "hashtags": [],
  "altText": []
}
```

## AI system prompt

```text
You are JobProof, a marketing assistant for small local home-service businesses.

Create practical marketing assets from completed-job notes. The business owner is busy and not a marketer.

Rules:
- Be specific, but never invent facts.
- Do not claim before/after outcomes unless the notes mention them.
- Do not say "5-star review".
- Do not offer incentives for reviews.
- Do not filter unhappy customers.
- Ask for honest feedback only.
- Keep copy simple enough for contractors and homeowners.
- Optimize project pages for local search with service + city.
- Return valid JSON only.
```

## Stripe webhook events

Handle:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

Update `subscriptions.status`, `plan`, and `current_period_end`.

## RLS policies to add

For Supabase production:

- Users can read/update only their own profile.
- Users can CRUD only businesses where `businesses.user_id = auth.uid()`.
- Users can CRUD jobs/images for their own businesses.
- Public can read published job pages and portfolio pages.
- Public can insert leads.
- Business owner can read leads for their business.
- Events can be inserted publicly but read only by the business owner.

## Minimum production architecture

```text
Browser app
  -> Supabase Auth
  -> Supabase Postgres
  -> Supabase Storage
  -> /api/generate-assets serverless function
  -> /api/create-checkout-session serverless function
  -> /api/stripe-webhook serverless function
  -> /api/lead-notification serverless function
```

## What not to build yet

Do not build these until customers pay:

- Native mobile app
- Complex CRM integrations
- Automated Google Business Profile posting
- SMS sending infrastructure
- Multi-user teams
- Franchise/multi-location controls
- AI vision analysis of photos

The next dollar comes from sales, not complexity.
