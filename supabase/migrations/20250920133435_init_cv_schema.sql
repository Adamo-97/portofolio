-- 1) Tables
create table if not exists public.cv_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('experience','education')),
  title text not null,
  organization text,
  location text,
  from_date date not null,
  to_date date,
  summary text,              -- short paragraph OR null if using bullets
  bullets text[],            -- array of bullet points OR null if using summary
  icon_url text,
  visibility text not null default 'public' check (visibility in ('public','draft')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.cv_skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,    -- e.g. "Programming Languages", "Strengths"
  tags text[] not null,      -- ["C#", "Python", ...]
  order_index int not null default 0
);

create table if not exists public.cv_languages (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  level int not null check (level between 1 and 5)  -- 1–5 like your LaTeX stars
);

-- 2) Triggers to keep updated_at fresh (optional but nice)
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists t_cv_entries_touch on public.cv_entries;
create trigger t_cv_entries_touch
before update on public.cv_entries
for each row execute function public.touch_updated_at();

-- 3) Row Level Security (RLS)
alter table public.cv_entries enable row level security;
alter table public.cv_skills  enable row level security;
alter table public.cv_languages enable row level security;

-- 4) Public read policies (anon can SELECT only public things)
drop policy if exists "public read entries" on public.cv_entries;
create policy "public read entries"
on public.cv_entries for select
to anon
using (visibility = 'public');

drop policy if exists "public read skills" on public.cv_skills;
create policy "public read skills"
on public.cv_skills for select
to anon
using (true);

drop policy if exists "public read languages" on public.cv_languages;
create policy "public read languages"
on public.cv_languages for select
to anon
using (true);

-- (You can add INSERT/UPDATE policies later for authenticated users.)
