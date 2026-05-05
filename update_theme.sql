-- Adiciona as colunas de tema e cor no profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '189 100% 50%';

-- Atualiza o primary_color para o novo tema neon ciano (Azure)
UPDATE public.profiles SET primary_color = '189 100% 50%' WHERE primary_color = '142 71% 45%';
