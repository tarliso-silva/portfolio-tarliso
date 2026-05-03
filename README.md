# Portfólio Tarliso Dória

Portfólio profissional de **Tarliso Dória**, especialista em Dados, Business Intelligence e Governança de Dados.

Autor: **Tarliso Dória**

## Descrição

Aplicação web para apresentação de projetos, experiências, formação, conteúdos, cursos, livros, certificações e páginas customizadas. O projeto inclui uma área administrativa protegida por autenticação Supabase para manutenção do conteúdo exibido no site.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Vitest
- ESLint

## Arquitetura

A aplicação é um SPA em React. A camada de dados usa hooks com TanStack Query para leitura e escrita no Supabase. O cliente Supabase é instanciado uma única vez em `src/services/supabase.ts` e reexportado por `src/lib/supabase.ts` para compatibilidade com imports existentes.

O modelo de dados principal está em `supabase_schema.sql`. Os scripts em `scripts/` e os arquivos SQL da raiz são migrações auxiliares mantidas para ambientes que ainda aplicam alterações de forma incremental.

## Estrutura De Pastas

```text
.
├── public/                 # Arquivos públicos, favicon, manifesto, robots e sitemap
├── scripts/                # Scripts auxiliares e migrações SQL incrementais
├── src/
│   ├── assets/             # Imagens locais usadas pela interface
│   ├── components/         # Componentes reutilizáveis, UI e seções do portfólio
│   ├── hooks/              # Hooks de dados e hooks utilitários
│   ├── lib/                # Utilitários e mapeadores
│   ├── pages/              # Páginas públicas e administrativas
│   ├── services/           # Integrações externas, incluindo Supabase e Storage
│   ├── test/               # Configuração e testes
│   └── types/              # Schemas Zod e tipos TypeScript
├── supabase_schema.sql     # Schema canônico do banco de dados
├── .env.example            # Exemplo de variáveis de ambiente
└── package.json            # Scripts, dependências e metadados do projeto
```

## Configuração Local

### 1. Clonar O Repositório

```bash
git clone https://github.com/tarliso-silva/portfolio-tarliso.git
cd portfolio-tarliso
```

### 2. Instalar Dependências

```bash
npm install
```

Use Node.js 20 ou superior, conforme `.node-version` e `package.json`.

### 3. Configurar Variáveis De Ambiente

Crie `.env.local` a partir do exemplo:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Não versionar `.env.local`. O arquivo está protegido por `.gitignore`.

### 4. Configurar Supabase

1. Crie um projeto no Supabase.
2. Acesse **Project Settings > API**.
3. Copie a Project URL para `VITE_SUPABASE_URL`.
4. Copie a chave pública anon para `VITE_SUPABASE_ANON_KEY`.
5. No **SQL Editor**, execute `supabase_schema.sql`.
6. Em **Authentication > Users**, crie o usuário administrativo.
7. Em **Storage**, crie um bucket público chamado `portfolio`.

O schema habilita RLS e permite leitura pública das tabelas exibidas no site. Escrita é liberada apenas para usuários autenticados.

### 5. Executar O Projeto

```bash
npm run dev
```

Acesse:

```text
http://localhost:8080
http://localhost:8080/admin/login
```

### 6. Executar Scripts De Banco

Para uma instalação nova, execute apenas:

```text
supabase_schema.sql
```

Para bases antigas que já existiam antes deste schema consolidado, avalie os scripts incrementais:

```text
add_category_to_contents.sql
create_journey_items.sql
update_content_drive_url.sql
update_profile_and_create_pages.sql
update_profile_hero_stats.sql
update_theme.sql
scripts/add_markdown_column.sql
scripts/add_project_detail_fields.sql
scripts/create_profiles.sql
scripts/create_skills_and_certifications.sql
```

Não execute migrações incrementais sem validar previamente se as colunas já existem no banco.

## Scripts NPM

```bash
npm run dev       # Servidor local
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Validação ESLint
npm run test      # Testes com Vitest
```

## Segurança

- Credenciais reais não devem ficar no repositório.
- `.env`, `.env.*`, arquivos de chave e credenciais estão no `.gitignore`.
- O cliente usa apenas a chave pública anon do Supabase no frontend.
- Regras de RLS estão declaradas em `supabase_schema.sql`.
- O sitemap é gerado com rotas estáticas quando as credenciais do Supabase não estão disponíveis.

## Deploy

O projeto está preparado para Netlify conforme `netlify.toml`:

```text
Build command: npm run build
Publish directory: dist
Node version: 20
```

Configure no provedor de deploy:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Validação

Antes de publicar alterações:

```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run test
npm run build
```

## Licença

MIT.
