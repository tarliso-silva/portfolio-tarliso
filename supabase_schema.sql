-- Schema principal do portfólio de Tarliso Dória.
-- Execute este arquivo no SQL Editor do Supabase antes de usar a aplicação.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamptz default now(),
  full_name text default 'Tarliso Dória',
  bio_summary text,
  bio_detailed text,
  phone text,
  email text,
  avatar_url text,
  location text,
  current_focus text default 'Engenharia de Dados',
  about_title text,
  cv_url text,
  favicon_url text,
  hero_title text,
  navbar_icon text default 'Database',
  theme text default 'dark' check (theme in ('dark', 'light')),
  primary_color text default '142 71% 45%',
  stat_1_number text default '+15',
  stat_1_label text default 'Projetos Ativos',
  stat_2_number text default '5+',
  stat_2_label text default 'Anos de Experiência',
  hero_phrase_start text default 'Dados são o',
  hero_phrase_strike text default 'futuro',
  hero_phrase_end text default 'presente.',
  contact_form_key text
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Dados', 'Web', 'IA')),
  description text not null default '',
  technologies text[] default '{}',
  image_url text,
  business_problem text,
  context text,
  premises text[] default '{}',
  strategy text[] default '{}',
  insights text[] default '{}',
  results text[] default '{}',
  next_steps text[] default '{}',
  github_url text,
  demo_url text,
  display_order integer default 0,
  is_published boolean default true,
  markdown text,
  business_problem_image text,
  context_image text,
  premises_image text,
  strategy_image text,
  results_image text,
  next_steps_image text,
  gallery_images text[] default '{}',
  overview text,
  role text,
  methodology text,
  tools text[] default '{}',
  card_problem text,
  card_solution text,
  card_result text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null,
  period text,
  description text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('profissional', 'embaixador', 'projeto', 'outros')),
  icon_type text check (icon_type in ('rocket', 'award', 'briefcase')) default 'rocket',
  title text not null,
  institution text not null,
  description text,
  period text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  markdown text,
  image_url text,
  category text,
  drive_folder_url text,
  created_at timestamptz default now()
);

create table if not exists public.custom_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  markdown text,
  created_at timestamptz default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  period text,
  certificate_url text,
  description text,
  topics text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.journey_items (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text,
  order_index integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  items text[] default '{}',
  description text,
  icon text default 'Zap',
  color text default 'text-primary',
  created_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  color text default 'text-primary',
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.project_skills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  unique (project_id, skill_id)
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  image_url text,
  credential_url text,
  issued_date text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.contents enable row level security;
alter table public.custom_pages enable row level security;
alter table public.books enable row level security;
alter table public.courses enable row level security;
alter table public.journey_items enable row level security;
alter table public.technologies enable row level security;
alter table public.skills enable row level security;
alter table public.project_skills enable row level security;
alter table public.certifications enable row level security;

drop policy if exists "public_read_profiles" on public.profiles;
drop policy if exists "authenticated_crud_profiles" on public.profiles;
create policy "public_read_profiles" on public.profiles for select using (true);
create policy "authenticated_crud_profiles" on public.profiles for all to authenticated using (true) with check (true);

drop policy if exists "public_read_projects" on public.projects;
drop policy if exists "authenticated_crud_projects" on public.projects;
create policy "public_read_projects" on public.projects for select using (true);
create policy "authenticated_crud_projects" on public.projects for all to authenticated using (true) with check (true);

drop policy if exists "public_read_education" on public.education;
drop policy if exists "authenticated_crud_education" on public.education;
create policy "public_read_education" on public.education for select using (true);
create policy "authenticated_crud_education" on public.education for all to authenticated using (true) with check (true);

drop policy if exists "public_read_experience" on public.experience;
drop policy if exists "authenticated_crud_experience" on public.experience;
create policy "public_read_experience" on public.experience for select using (true);
create policy "authenticated_crud_experience" on public.experience for all to authenticated using (true) with check (true);

drop policy if exists "public_read_contents" on public.contents;
drop policy if exists "authenticated_crud_contents" on public.contents;
create policy "public_read_contents" on public.contents for select using (true);
create policy "authenticated_crud_contents" on public.contents for all to authenticated using (true) with check (true);

drop policy if exists "public_read_custom_pages" on public.custom_pages;
drop policy if exists "authenticated_crud_custom_pages" on public.custom_pages;
create policy "public_read_custom_pages" on public.custom_pages for select using (true);
create policy "authenticated_crud_custom_pages" on public.custom_pages for all to authenticated using (true) with check (true);

drop policy if exists "public_read_books" on public.books;
drop policy if exists "authenticated_crud_books" on public.books;
create policy "public_read_books" on public.books for select using (true);
create policy "authenticated_crud_books" on public.books for all to authenticated using (true) with check (true);

drop policy if exists "public_read_courses" on public.courses;
drop policy if exists "authenticated_crud_courses" on public.courses;
create policy "public_read_courses" on public.courses for select using (true);
create policy "authenticated_crud_courses" on public.courses for all to authenticated using (true) with check (true);

drop policy if exists "public_read_journey_items" on public.journey_items;
drop policy if exists "authenticated_crud_journey_items" on public.journey_items;
create policy "public_read_journey_items" on public.journey_items for select using (true);
create policy "authenticated_crud_journey_items" on public.journey_items for all to authenticated using (true) with check (true);

drop policy if exists "public_read_technologies" on public.technologies;
drop policy if exists "authenticated_crud_technologies" on public.technologies;
create policy "public_read_technologies" on public.technologies for select using (true);
create policy "authenticated_crud_technologies" on public.technologies for all to authenticated using (true) with check (true);

drop policy if exists "public_read_skills" on public.skills;
drop policy if exists "authenticated_crud_skills" on public.skills;
create policy "public_read_skills" on public.skills for select using (true);
create policy "authenticated_crud_skills" on public.skills for all to authenticated using (true) with check (true);

drop policy if exists "public_read_project_skills" on public.project_skills;
drop policy if exists "authenticated_crud_project_skills" on public.project_skills;
create policy "public_read_project_skills" on public.project_skills for select using (true);
create policy "authenticated_crud_project_skills" on public.project_skills for all to authenticated using (true) with check (true);

drop policy if exists "public_read_certifications" on public.certifications;
drop policy if exists "authenticated_crud_certifications" on public.certifications;
create policy "public_read_certifications" on public.certifications for select using (true);
create policy "authenticated_crud_certifications" on public.certifications for all to authenticated using (true) with check (true);

insert into public.profiles (full_name, bio_summary, current_focus)
select
  'Tarliso Dória',
  'Especialista em Dados, Business Intelligence e Governança de Dados.',
  'Engenharia de Dados'
where not exists (select 1 from public.profiles);
