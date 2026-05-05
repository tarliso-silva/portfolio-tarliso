-- Adiciona coluna slug na tabela projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Cria índice único (ignorar nulos para projetos antigos sem slug)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug)
  WHERE slug IS NOT NULL AND slug != '';

-- Atualiza projetos existentes com slug gerado do título
-- (executa uma vez; novos projetos terão slug definido pelo admin)
UPDATE public.projects
SET slug = lower(
  regexp_replace(
    regexp_replace(
      translate(
        title,
        'àáâãäåæçèéêëìíîïðñòóôõöùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝ',
        'aaaaaaeceeeeiiiidnoooooouuuuyyAAAAAEACEEEEIIIIDNOOOOOUUUUY'
      ),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

NOTIFY pgrst, 'reload schema';
