-- =====================================================================
-- Gamuna Foundation — database schema (run once in Supabase SQL Editor)
-- =====================================================================

-- ---------- Admins ----------
-- Anyone listed here (and signed in via Supabase Auth) can edit the site.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins can read own row" on public.admins;
create policy "admins can read own row" on public.admins
  for select using (user_id = auth.uid());

-- ---------- Site-wide text (contact details, hero text, vision, etc.) ----------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "public read settings" on public.site_settings;
drop policy if exists "admin insert settings" on public.site_settings;
drop policy if exists "admin update settings" on public.site_settings;
create policy "public read settings"  on public.site_settings for select using (true);
create policy "admin insert settings" on public.site_settings for insert with check (public.is_admin());
create policy "admin update settings" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

-- ---------- Content tables ----------
create table if not exists public.pillars (
  id           uuid primary key default gen_random_uuid(),
  icon         text not null default '⭐',
  title        text not null,
  description  text not null,
  sort_order   int  not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.programs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  sort_order   int  not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  event_date   date not null,
  badge        text not null default 'workshop'
               check (badge in ('workshop','outreach','seminar','donation','launch','service','training')),
  location     text,
  time_label   text,          -- e.g. "9:00 AM – 4:00 PM"
  outcome      text,          -- shown on past events, e.g. "Successfully launched"
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  tag          text not null default 'Announcement',
  published_on date not null default current_date,
  date_label   text,          -- optional override such as "July 2026"
  source_url   text,
  source_label text,          -- e.g. "Read more at The National"
  image_url    text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null,
  photo_url    text,
  group_name   text not null default 'executive' check (group_name in ('executive','training')),
  sort_order   int  not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Public can read published rows; only admins can write.
do $$
declare t text;
begin
  foreach t in array array['pillars','programs','events','news','team_members'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "read published" on public.%I', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "read published" on public.%I for select using (is_published or public.is_admin())', t);
    execute format('create policy "admin insert" on public.%I for insert with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete using (public.is_admin())', t);
  end loop;
end $$;

-- ---------- Contact-form messages ----------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name)    between 1 and 120),
  email      text not null check (char_length(email)   between 3 and 200),
  phone      text          check (phone   is null or char_length(phone)   <= 40),
  subject    text          check (subject is null or char_length(subject) <= 80),
  message    text not null check (char_length(message) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;

drop policy if exists "anyone can send a message" on public.messages;
drop policy if exists "admin read messages"   on public.messages;
drop policy if exists "admin update messages" on public.messages;
drop policy if exists "admin delete messages" on public.messages;
create policy "anyone can send a message" on public.messages for insert with check (is_read = false);
create policy "admin read messages"   on public.messages for select using (public.is_admin());
create policy "admin update messages" on public.messages for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete messages" on public.messages for delete using (public.is_admin());

-- ---------- Image storage (team photos, news images) ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "admin upload media" on storage.objects;
drop policy if exists "admin update media" on storage.objects;
drop policy if exists "admin delete media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
