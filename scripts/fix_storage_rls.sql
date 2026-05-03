-- ============================================================
-- CORREÇÃO: RLS para Supabase Storage — bucket "portfolio"
-- ============================================================
-- Execute no SQL Editor do Supabase (uma única vez).
--
-- PROBLEMA
-- --------
-- O Supabase Storage usa RLS na tabela interna `storage.objects`.
-- Sem policies de INSERT, mesmo usuários autenticados recebem:
--   "new row violates row-level security policy"
--
-- SOLUÇÃO
-- -------
-- 4 policies para o bucket "portfolio":
--   1. public_read     — qualquer pessoa pode ler (SELECT)
--   2. auth_insert     — admin autenticado pode fazer upload (INSERT)
--   3. auth_update     — admin autenticado pode substituir arquivo (UPDATE)
--   4. auth_delete     — admin autenticado pode excluir arquivo (DELETE)
--
-- O bucket deve existir e ser marcado como público para que
-- getPublicUrl() retorne URLs acessíveis sem autenticação.
-- ============================================================

-- 1. Criar bucket (idempotente — não sobrescreve se já existe)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

-- 2. Remover policies antigas (evita duplicatas em re-execuções)
drop policy if exists "portfolio_public_read"  on storage.objects;
drop policy if exists "portfolio_auth_insert"  on storage.objects;
drop policy if exists "portfolio_auth_update"  on storage.objects;
drop policy if exists "portfolio_auth_delete"  on storage.objects;

-- 3. SELECT público — qualquer visitante pode carregar imagens
--    Necessário para que as URLs públicas funcionem no frontend.
create policy "portfolio_public_read"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

-- 4. INSERT autenticado — somente admin logado pode fazer upload
--    `auth.role() = 'authenticated'` garante que anônimos não sobem nada.
create policy "portfolio_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'portfolio' );

-- 5. UPDATE autenticado — permite sobrescrever arquivo existente
--    Usado quando upsert = true ou ao substituir uma imagem.
create policy "portfolio_auth_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'portfolio' );

-- 6. DELETE autenticado — permite remoção de arquivos pelo admin
create policy "portfolio_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'portfolio' );
