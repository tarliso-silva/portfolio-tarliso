-- ================================================================
-- Interações nos comentários: likes + respostas + admin delete
-- Execute este script no SQL Editor do Supabase
-- ================================================================

-- 1. Adiciona suporte a respostas (reply threading)
ALTER TABLE public.project_comments
  ADD COLUMN IF NOT EXISTS reply_to_id   UUID REFERENCES public.project_comments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reply_to_name TEXT;

-- 2. Tabela de curtidas em comentários (uma por usuário por comentário)
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES public.project_comments(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS: comment_likes
DROP POLICY IF EXISTS "comment_likes_select" ON public.comment_likes;
CREATE POLICY "comment_likes_select" ON public.comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "comment_likes_insert" ON public.comment_likes;
CREATE POLICY "comment_likes_insert" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comment_likes_delete" ON public.comment_likes;
CREATE POLICY "comment_likes_delete" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Permite que o admin (email/senha) exclua qualquer comentário
--    Usuários OAuth (Google, GitHub) não têm provider = 'email'
DROP POLICY IF EXISTS "comments_admin_delete" ON public.project_comments;
CREATE POLICY "comments_admin_delete" ON public.project_comments
  FOR DELETE USING (
    auth.uid() = user_id
    OR
    (auth.jwt()->'app_metadata'->>'provider') = 'email'
  );

-- Remove a policy anterior de delete (que só permitia o próprio usuário)
-- A nova policy acima já a substitui com OR
DROP POLICY IF EXISTS "comments_delete" ON public.project_comments;

NOTIFY pgrst, 'reload schema';
