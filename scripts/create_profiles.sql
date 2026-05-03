-- Cria a tabela profiles usada pelo portfólio de Tarliso Dória.
-- Este script é mantido para ambientes que aplicam migrações incrementais.

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
  theme text default 'dark',
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

alter table public.profiles enable row level security;

drop policy if exists "public_read_profiles" on public.profiles;
drop policy if exists "authenticated_crud_profiles" on public.profiles;

create policy "public_read_profiles"
  on public.profiles for select
  using (true);

create policy "authenticated_crud_profiles"
  on public.profiles for all to authenticated
  using (true)
  with check (true);

insert into public.profiles (full_name, bio_summary, current_focus)
select
  'Tarliso Dória',
  'Especialista em Dados, Business Intelligence e Governança de Dados.',
  'Engenharia de Dados'
where not exists (select 1 from public.profiles);
