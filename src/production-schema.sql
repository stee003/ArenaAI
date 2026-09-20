-- JobProof production schema for Supabase/Postgres
-- Run this in Supabase SQL editor when converting the browser MVP into a real SaaS.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text unique not null,
  phone text,
  website text,
  google_review_url text,
  service_area text,
  primary_service text,
  logo_url text,
  brand_color text not null default '#155EEF',
  offer text,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  slug text not null,
  service_type text,
  city text,
  neighborhood text,
  customer_name text,
  notes text,
  ai_title text,
  ai_summary text,
  ai_page_body text,
  ai_google_post text,
  ai_social_caption text,
  ai_review_sms text,
  ai_review_email_subject text,
  ai_review_email text,
  ai_testimonial_prompt text,
  ai_alt_text jsonb default '[]'::jsonb,
  ai_hashtags jsonb default '[]'::jsonb,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  unique (business_id, slug)
);

create table if not exists public.job_images (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade not null,
  image_url text not null,
  label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  event_type text not null check (event_type in ('page_view','review_click','quote_click','call_click','website_click')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete set null,
  name text,
  phone text,
  email text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_businesses_user_id on public.businesses(user_id);
create index if not exists idx_jobs_business_id on public.jobs(business_id);
create index if not exists idx_events_job_id on public.events(job_id);
create index if not exists idx_leads_business_id on public.leads(business_id);

-- Enable RLS before production and add policies matching your auth model.
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.jobs enable row level security;
alter table public.job_images enable row level security;
alter table public.events enable row level security;
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;
