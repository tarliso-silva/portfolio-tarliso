-- Adiciona colunas de redes sociais na tabela profiles
-- Execute no Supabase SQL Editor

alter table profiles add column if not exists linkedin_url    text;
alter table profiles add column if not exists github_url      text;
alter table profiles add column if not exists instagram_url   text;
alter table profiles add column if not exists whatsapp_number text;
