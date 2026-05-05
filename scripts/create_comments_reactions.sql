-- ================================================================
-- Comentários e reações em projetos
-- Execute este script no SQL Editor do Supabase
-- ================================================================

-- 1. Habilitar extensão UUID (geralmente já ativa)
create extension if not exists "uuid-ossp";

-- 2. Tabela de comentários
create table if not exists public.project_comments (
  id          uuid primary key default uuid_generate_v4(),
  project_id  text not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  user_name   text not null,
  user_avatar text,
  body        text not null check (char_length(body) between 1 and 1000),
  created_at  timestamptz default now()
);

-- Índice para busca por projeto
create index if not exists idx_comments_project_id on public.project_comments(project_id);

-- 3. Tabela de reações (like/dislike — uma por usuário por projeto)
create table if not exists public.project_reactions (
  id         uuid primary key default uuid_generate_v4(),
  project_id text not null,
  user_id    uuid not null references auth.users(id) on delete cascade,
  reaction   text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz default now(),
  unique(project_id, user_id)
);

create index if not exists idx_reactions_project_id on public.project_reactions(project_id);

-- ================================================================
-- Row Level Security
-- ================================================================

alter table public.project_comments enable row level security;
alter table public.project_reactions enable row level security;

-- Comentários: qualquer um pode ler
create policy "comments_select" on public.project_comments
  for select using (true);

-- Comentários: usuário autenticado pode inserir o próprio
create policy "comments_insert" on public.project_comments
  for insert with check (auth.uid() = user_id);

-- Comentários: usuário pode deletar o próprio
create policy "comments_delete" on public.project_comments
  for delete using (auth.uid() = user_id);

-- Reações: qualquer um pode ler
create policy "reactions_select" on public.project_reactions
  for select using (true);

-- Reações: usuário autenticado pode inserir a própria
create policy "reactions_insert" on public.project_reactions
  for insert with check (auth.uid() = user_id);

-- Reações: usuário pode atualizar a própria (mudar like/dislike)
create policy "reactions_update" on public.project_reactions
  for update using (auth.uid() = user_id);

-- Reações: usuário pode deletar a própria (remover reação)
create policy "reactions_delete" on public.project_reactions
  for delete using (auth.uid() = user_id);

-- Atualiza cache do schema
notify pgrst, 'reload schema';
