# JobProof Launch Kit

This is the operating manual for launching JobProof from zero budget to first paid users.

## The offer

**Name:** JobProof  
**Promise:** Turn completed jobs into reviews, referrals, local SEO pages, Google Business Profile posts, and social captions.

### Beta offer

> I’ll turn 5 recent completed jobs into professional project pages, Google review QR codes, Google Business Profile posts, and social captions for $49. If you like it, keep using JobProof for $19/month.

### Target niches, in order

1. Pressure washing
2. Cleaning companies
3. Landscaping / lawn care
4. Painting
5. Handyman services
6. Junk removal
7. Mobile detailing
8. Window cleaning

## First 50 prospect spreadsheet

Columns:

- Business name
- Niche
- City
- Website
- Google Business Profile URL
- Google review count
- Rating
- Facebook URL
- Instagram URL
- Last social post date
- Has before/after photos? yes/no
- Has project pages? yes/no
- Owner name
- Contact method
- Message sent date
- Follow-up date
- Reply
- Sample page URL
- Status
- Paid? yes/no
- Notes

## Prospect scoring

Score each prospect from 0-10.

- +2 if under 50 Google reviews
- +2 if they post job photos but captions are weak
- +2 if they have no project/case-study pages
- +1 if owner-operated
- +1 if one job is worth $150+
- +1 if recent social activity within 30 days
- +1 if their competitors have stronger review profiles

Contact prospects with score 6+ first.

## Outreach script: Facebook/Instagram DM

Hey [Name] — I saw your recent [specific job type] photos. Nice work.

I’m testing JobProof, a simple tool that turns completed jobs into a mini project page, Google review request, QR code, and ready-to-post Google/Facebook caption.

I made a quick example of what it could look like for your business: [sample link]

If useful, I can set up 5 of these for your recent jobs for $49 while I validate the product. Want me to send one for your latest job?

## Outreach script: email

Subject: Made a quick project page for your recent work

Hi [Name],

I noticed your [service] business has strong job photos, but they could be doing more work for you.

I’m building JobProof, a simple tool that turns completed jobs into:

- a mini before/after project page
- a Google review request link
- a QR code
- a Google Business Profile post
- a Facebook/Instagram caption

I made a quick sample here: [link]

I’m offering the first few businesses 5 completed job pages for $49 while I validate the product.

Want me to make one for your latest job?

## Follow-up 1: 48 hours later

Hey [Name], quick follow-up. I think this would work especially well for your [specific service] jobs because they’re visual and customers want proof before calling.

Want me to turn one recent job into a free sample?

## Follow-up 2: 5 days later

No worries if now isn’t the right time. If you want the simple version, here’s the playbook:

1. Take 2-4 photos after every job
2. Send every real customer an honest review request
3. Post the job to Google Business Profile
4. Save it as a project page you can send future customers

That’s what JobProof automates. Happy to make a sample if useful.

## Manual fulfillment process for first customers

1. Customer sends 3-5 job photos and notes.
2. Enter business details in the JobProof app.
3. Generate the proof package.
4. Open the proof page.
5. Copy the review SMS, Google post, and social caption into a delivery email.
6. Send them the proof page URL and QR code.
7. Ask if they want 4 more for the $49 beta package.
8. After 5 pages, offer $19/month.

## Payment setup

Fastest validation:

- Create a Stripe Payment Link for **$49 JobProof Beta Setup**.
- Create a Stripe subscription product for **JobProof Starter - $19/month**.
- Add both links to your replies manually.

Suggested Stripe products:

1. JobProof Beta Setup
   - One-time
   - $49
   - Description: 5 job proof pages, review QR codes, Google posts, and social captions.

2. JobProof Starter
   - Recurring monthly
   - $19/month
   - Description: 20 job proof pages per month, QR codes, Google posts, social captions, public portfolio.

3. JobProof Pro
   - Recurring monthly
   - $39/month
   - Description: Unlimited job proof pages, branding, review replies, lead capture, analytics.

## Production database schema

### users

- id uuid primary key
- email text unique not null
- created_at timestamptz default now()

### businesses

- id uuid primary key
- user_id uuid references users(id)
- business_name text not null
- slug text unique not null
- phone text
- website text
- google_review_url text
- service_area text
- primary_service text
- logo_url text
- brand_color text default '#155EEF'
- offer text
- created_at timestamptz default now()

### jobs

- id uuid primary key
- business_id uuid references businesses(id)
- slug text not null
- service_type text
- city text
- neighborhood text
- customer_name text
- notes text
- ai_title text
- ai_summary text
- ai_page_body text
- ai_google_post text
- ai_social_caption text
- ai_review_sms text
- ai_review_email text
- ai_testimonial_prompt text
- status text default 'published'
- created_at timestamptz default now()

### job_images

- id uuid primary key
- job_id uuid references jobs(id)
- image_url text not null
- label text
- sort_order int default 0

### events

- id uuid primary key
- job_id uuid references jobs(id)
- event_type text not null
- created_at timestamptz default now()

### subscriptions

- id uuid primary key
- user_id uuid references users(id)
- stripe_customer_id text
- stripe_subscription_id text
- plan text
- status text
- created_at timestamptz default now()

## AI prompt for production

```text
You are a marketing assistant for a local home-service business.

Business:
- Name: {{business_name}}
- Service: {{primary_service}}
- City/service area: {{service_area}}
- Phone: {{phone}}

Completed job:
- Service type: {{service_type}}
- Location: {{city_or_neighborhood}}
- Notes: {{job_notes}}

Create compliant, honest marketing assets. Do not claim specific outcomes unless stated. Do not pressure customers to leave 5-star reviews. Do not offer incentives for reviews. Do not filter unhappy customers.

Return valid JSON with:
- seo_title
- short_summary
- project_page_heading
- project_page_body
- google_business_profile_post
- facebook_instagram_caption
- honest_review_request_sms
- honest_review_request_email_subject
- honest_review_request_email
- testimonial_request
- alt_text_suggestions
- hashtags
```

## 30-day launch plan

### Week 1

- Pick one niche and one city.
- Build 5 sample pages.
- Contact 100 businesses.
- Try to sell $49 setup.

### Week 2

- Improve the app from prospect feedback.
- Close 1-3 beta customers.
- Manually fulfill quickly.
- Add real screenshots/testimonials.

### Week 3

- Contact 150 more businesses.
- Publish 3 SEO articles/free tools.
- Ask early users for referrals.
- Convert setup customers to $19/month.

### Week 4

- Contact 300 total prospects.
- Aim for 5-15 paying users.
- Decide whether to double down on the niche or pivot.

## Go/no-go criteria

Continue if by day 30:

- 5+ businesses used a sample
- 3+ paid at least once, or
- 5+ say they would pay after one missing feature is added

Stop or reposition if:

- Nobody pays $19-$49 after 300 targeted messages
- Users like the idea but never upload jobs
- The niche has poor job frequency or weak visual proof

## Compliance rule

JobProof should ask real customers for honest feedback. Do not build review gating. Do not ask only happy customers for public reviews. Do not offer discounts, gifts, or rewards in exchange for reviews.
