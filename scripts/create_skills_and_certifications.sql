-- ============================================================
-- NOVAS TABELAS: skills, project_skills, certifications
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- TABELA DE HABILIDADES (SKILLS)
create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  color text default 'text-primary',
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- RELACIONAMENTO N:N entre projetos e habilidades
create table if not exists project_skills (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references projects(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  unique (project_id, skill_id)
);

-- TABELA DE CERTIFICAÇÕES (CERTIFICATIONS)
create table if not exists certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text not null,
  image_url text,
  credential_url text,
  issued_date text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table skills enable row level security;
alter table project_skills enable row level security;
alter table certifications enable row level security;

-- Leitura pública
create policy "Allow public read access" on skills for select using (true);
create policy "Allow public read access" on project_skills for select using (true);
create policy "Allow public read access" on certifications for select using (true);

-- Escrita para usuários autenticados (admin)
create policy "Allow authenticated CRUD" on skills for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on project_skills for all to authenticated using (true) with check (true);
create policy "Allow authenticated CRUD" on certifications for all to authenticated using (true) with check (true);
