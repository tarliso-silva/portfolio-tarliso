import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega variáveis locais para execução fora do ambiente de deploy.
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const BASE_URL = 'https://tarlisodoria.com';

async function generateSitemap() {
  try {
    console.log("Gerando sitemap...");
    let projects = [];
    let posts = [];

    if (supabase) {
      // Busca conteúdos dinâmicos publicados.
      const { data: projectRows, error: projectsError } = await supabase.from('projects').select('id').eq('is_published', true);
      const { data: postRows, error: postsError } = await supabase.from('contents').select('id');

      if (projectsError) console.error("Erro ao buscar projetos para o sitemap:", projectsError.message);
      if (postsError) console.error("Erro ao buscar posts para o sitemap:", postsError.message);

      projects = projectRows || [];
      posts = postRows || [];
    } else {
      console.warn("Credenciais do Supabase ausentes. Sitemap será gerado apenas com rotas estáticas.");
    }

    const urls = [
      '/',
      '/about',
      '/projects',
      '/blog',
    ];

    projects.forEach(p => urls.push(`/projects/${p.id}`));

    posts.forEach(p => urls.push(`/blog/${p.id}`));

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemapContent.trim());
    console.log('Sitemap gerado em public/sitemap.xml');
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
  }
}

generateSitemap();
