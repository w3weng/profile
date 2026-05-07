# Supabase CMS Setup (Portfolio)

This project can run **static** (local data) or **dynamic** (Supabase CMS).  
To enable the CMS + Admin Dashboard, complete the steps below.

## 1) Create a Supabase project

- Create a project in Supabase
- Copy:
  - Project URL → `VITE_SUPABASE_URL`
  - Anon key → `VITE_SUPABASE_ANON_KEY`

Create `.env` in the project root:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## 2) Create tables (SQL)

Open Supabase **SQL Editor**, run:

```sql
-- Extensions
create extension if not exists pgcrypto;

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- CMS Tables
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text not null,
  long_description text not null,
  category text,
  cover_image text,
  screenshots text[] not null default '{}',
  thumbnail_url text,
  featured boolean not null default false,
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  tech text[] not null default '{}',
  features text[] not null default '{}',
  github_url text,
  github text,
  demo text,
  live_url text,
  status text,
  year text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Frontend','Backend','Tools')),
  name text not null,
  level int not null check (level >= 0 and level <= 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  org text not null,
  team text not null,
  period text not null,
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger experience_set_updated_at
before update on public.experience
for each row execute function public.set_updated_at();

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  date text not null,
  description text not null,
  file_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger certificates_set_updated_at
before update on public.certificates
for each row execute function public.set_updated_at();

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  org text not null,
  quote text not null,
  avatar_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

-- Single-row table style
create table if not exists public.currently_working (
  id uuid primary key default gen_random_uuid(),
  items text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Resume table (latest row = active)
create table if not exists public.resume (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  uploaded_at timestamptz not null default now()
);

-- Optional: contact submissions
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
```

If your `projects` table already exists, run:

```sql
alter table public.projects add column if not exists slug text unique;
alter table public.projects add column if not exists category text;
alter table public.projects add column if not exists cover_image text;
alter table public.projects add column if not exists screenshots text[] not null default '{}';
alter table public.projects add column if not exists github text;
alter table public.projects add column if not exists demo text;
alter table public.projects add column if not exists status text;
alter table public.projects add column if not exists year text;
```

## 3) Storage buckets

Create buckets in Supabase **Storage**:
- `portfolio` (public)  
  - `projects/*` thumbnails
  - `resume/*` pdf files

Recommended: mark bucket as **public** so portfolio can display images/PDF without signed URLs.

### Storage policies (required for Admin uploads)

Run this in SQL editor:

```sql
-- Allow public read from storage objects in portfolio bucket
create policy "portfolio objects public read"
on storage.objects
for select
using (bucket_id = 'portfolio');

-- Allow admin users to upload/update/delete files in portfolio bucket
create policy "portfolio objects admin insert"
on storage.objects
for insert
with check (bucket_id = 'portfolio' and public.is_admin());

create policy "portfolio objects admin update"
on storage.objects
for update
using (bucket_id = 'portfolio' and public.is_admin())
with check (bucket_id = 'portfolio' and public.is_admin());

create policy "portfolio objects admin delete"
on storage.objects
for delete
using (bucket_id = 'portfolio' and public.is_admin());
```

## 4) Auth + Admin access

Enable **Email auth** in Supabase Auth.

### Restrict admin
Simplest: create one admin user (your email) and use a profile table.

Run:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: users read own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles: users upsert own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles: users update own"
on public.profiles
for update
using (auth.uid() = id);
```

Then manually set your admin flag in Supabase Table Editor:
- `profiles.is_admin = true` for your user id.

If your row does not exist yet, insert it first:

```sql
insert into public.profiles (id, is_admin)
values ('YOUR_AUTH_USER_UUID', true)
on conflict (id) do update set is_admin = excluded.is_admin;
```

## 5) RLS policies (public read, admin write)

Enable RLS and apply policies:

```sql
-- Helper: admin check
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- Public read policies (portfolio is public)
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.certificates enable row level security;
alter table public.testimonials enable row level security;
alter table public.currently_working enable row level security;
alter table public.resume enable row level security;

create policy "projects: public read" on public.projects for select using (true);
create policy "skills: public read" on public.skills for select using (true);
create policy "experience: public read" on public.experience for select using (true);
create policy "certificates: public read" on public.certificates for select using (true);
create policy "testimonials: public read" on public.testimonials for select using (true);
create policy "currently_working: public read" on public.currently_working for select using (true);
create policy "resume: public read" on public.resume for select using (true);

-- Admin write
create policy "projects: admin write" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "skills: admin write" on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "experience: admin write" on public.experience for all using (public.is_admin()) with check (public.is_admin());
create policy "certificates: admin write" on public.certificates for all using (public.is_admin()) with check (public.is_admin());
create policy "testimonials: admin write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "currently_working: admin write" on public.currently_working for all using (public.is_admin()) with check (public.is_admin());
create policy "resume: admin write" on public.resume for all using (public.is_admin()) with check (public.is_admin());

-- Contact messages: allow insert (public), admin read
alter table public.contact_messages enable row level security;
create policy "contact_messages: public insert" on public.contact_messages for insert with check (true);
create policy "contact_messages: admin read" on public.contact_messages for select using (public.is_admin());
```

## 6) Seed data (optional)

Add a few rows in each table to match your existing portfolio content.

