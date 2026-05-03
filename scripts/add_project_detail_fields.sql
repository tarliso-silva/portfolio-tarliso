-- Adiciona colunas para seções estruturadas da página de detalhes de projeto
-- Execute no SQL Editor do Supabase

alter table projects add column if not exists overview    text;
alter table projects add column if not exists role        text;
alter table projects add column if not exists methodology text;
alter table projects add column if not exists tools       text[] default '{}';
