/* ==========================================================================
   data/market-skills.js — window.SKILL_HUB_MARKET

   Skills de terceiros que aparecem DENTRO da página de Skills, na categoria a
   que pertencem (TDD, Backend, Banco de dados, APIs, Dados, Refatoração,
   Node.js, Coding style, Automação, Office, Marketing, Copywriting, Testes,
   Mobile, Segurança, Inicializadores). Como as de data/trending.js, não são entradas do catálogo: o Skill
   Hub não hospeda o conteúdo, então cada linha abre o link oficial.

   Regras desta lista (as mesmas de trending.js):
   - toda `url` foi aberta e respondeu 200 antes de entrar, e o SKILL.md de cada
     pasta foi lido (conferido em 2026-11-17). Nunca uma URL deduzida do nome;
   - `description` é a tradução do que o próprio SKILL.md (ou a descrição do
     repositório) diz que a skill faz. Nenhum número de estrela ou instalação;
   - `categories` são chaves de CATEGORY_LABELS (catalog.js). Uma skill pode
     estar em mais de uma: NestJS é backend e é Node.

   A seleção é curadoria do que aparece de forma recorrente em buscas e listas
   da comunidade — o app não mede uso.
   ========================================================================== */

window.SKILL_HUB_MARKET = (window.SKILL_HUB_MARKET || []).concat([
  /* --- TDD ----------------------------------------------------------------- */
  {
    id: 'obra-test-driven-development',
    name: 'test-driven-development',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['tdd'],
    icon: 'flask',
    tags: ['tdd', 'testes', 'disciplina'],
    description: 'Para qualquer feature ou correção, antes de escrever a implementação: o teste falha primeiro, e você o vê falhar.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/test-driven-development'
  },
  {
    id: 'mattpocock-tdd',
    name: 'tdd',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['tdd'],
    icon: 'flask',
    tags: ['tdd', 'testes', 'integração'],
    description: 'Construir features ou corrigir bugs test-first, no ciclo red-green-refactor, inclusive com testes de integração.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd'
  },
  {
    id: 'addyosmani-test-driven-development',
    name: 'test-driven-development',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['tdd'],
    icon: 'flask',
    tags: ['tdd', 'testes'],
    description: 'Conduz o desenvolvimento por testes no ciclo red-green-refactor: ao implementar lógica, corrigir bug ou mudar comportamento.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/test-driven-development'
  },
  {
    id: 'ecc-tdd-workflow',
    name: 'tdd-workflow',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['tdd'],
    icon: 'flask',
    tags: ['tdd', 'testes', 'cobertura'],
    description: 'Teste que falha primeiro, a menor mudança até o verde, depois refatorar, com meta de 80%+ de cobertura entre unitário, integração e E2E.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/tdd-workflow'
  },
  {
    id: 'intent-driven-test-driven-development',
    name: 'test-driven-development',
    author: 'intent-driven-dev',
    repo: 'intent-driven-dev/skills',
    categories: ['tdd'],
    icon: 'flask',
    tags: ['tdd', 'testes', 'disciplina'],
    description: 'Implementar uma mudança test-first, em ciclos red-green curtos e focados.',
    url: 'https://github.com/intent-driven-dev/skills/tree/main/.agents/skills/test-driven-development'
  },
  {
    id: 'alirezarezvani-tdd-guide',
    name: 'tdd-guide',
    author: 'alirezarezvani',
    repo: 'alirezarezvani/claude-code-skill-factory',
    categories: ['tdd'],
    icon: 'book',
    tags: ['tdd', 'testes', 'cobertura'],
    description: 'Guia de TDD para subagentes de engenharia, com suporte a vários frameworks, análise de cobertura e geração de testes.',
    url: 'https://github.com/alirezarezvani/claude-code-skill-factory/tree/dev/generated-skills/tdd-guide'
  },

  /* --- Backend ------------------------------------------------------------- */
  {
    id: 'ecc-backend-patterns',
    name: 'backend-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'node'],
    icon: 'server',
    tags: ['backend', 'node', 'express', 'nextjs'],
    description: 'Padrões de arquitetura de backend, desenho de API e otimização de banco para Node.js, Express e rotas de API do Next.js.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/backend-patterns'
  },
  {
    id: 'jeffallan-nestjs-expert',
    name: 'nestjs-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend', 'node'],
    icon: 'layers',
    tags: ['backend', 'node', 'nestjs', 'typescript'],
    description: 'Cria e configura módulos, controllers, services, DTOs, guards e interceptors do NestJS para backends em TypeScript.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/nestjs-expert'
  },
  {
    id: 'ecc-nestjs-patterns',
    name: 'nestjs-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'node'],
    icon: 'layers',
    tags: ['backend', 'node', 'nestjs', 'typescript'],
    description: 'Padrões de arquitetura NestJS: módulos, controllers, providers, validação de DTO, guards, interceptors e configuração.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/nestjs-patterns'
  },
  {
    id: 'jeffallan-fastapi-expert',
    name: 'fastapi-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'zap',
    tags: ['backend', 'python', 'fastapi'],
    description: 'APIs assíncronas em Python com FastAPI e Pydantic V2: endpoints REST, modelos, autenticação e SQLAlchemy assíncrono.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/fastapi-expert'
  },
  {
    id: 'supabase-skill',
    name: 'supabase',
    author: 'Supabase',
    repo: 'supabase/agent-skills',
    categories: ['backend', 'database'],
    icon: 'cloud',
    tags: ['backend', 'supabase', 'oficial'],
    description: 'Para qualquer tarefa com Supabase: Database, Auth, Edge Functions, Realtime, Storage e as bibliotecas cliente.',
    url: 'https://github.com/supabase/agent-skills/tree/main/skills/supabase'
  },
  {
    id: 'cloudflare-skills',
    name: 'cloudflare/skills',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'cloud',
    tags: ['backend', 'cloudflare', 'oficial', 'coleção'],
    description: 'Skills que ensinam o agente a construir na Cloudflare.',
    url: 'https://github.com/cloudflare/skills'
  },
  {
    id: 'better-auth-skills',
    name: 'better-auth/skills',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend'],
    icon: 'lock',
    tags: ['backend', 'autenticação', 'oficial', 'coleção'],
    description: 'O repositório de skills do Better Auth, a biblioteca de autenticação.',
    url: 'https://github.com/better-auth/skills'
  },
  {
    id: 'prisma-skills',
    name: 'prisma/skills',
    author: 'Prisma',
    repo: 'prisma/skills',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'orm', 'oficial', 'coleção'],
    description: 'O repositório de skills da Prisma, o ORM.',
    url: 'https://github.com/prisma/skills'
  },

  /* --- Banco de dados ------------------------------------------------------ */
  {
    id: 'supabase-postgres-best-practices',
    name: 'supabase-postgres-best-practices',
    author: 'Supabase',
    repo: 'supabase/agent-skills',
    categories: ['database'],
    icon: 'database',
    tags: ['postgres', 'sql', 'oficial'],
    description: 'Boas práticas de Postgres mantidas pela Supabase, para Postgres rodando em qualquer lugar: carregue antes de criar ou alterar tabelas, índices e queries.',
    url: 'https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices'
  },
  {
    id: 'neon-postgres',
    name: 'neon-postgres',
    author: 'Neon',
    repo: 'neondatabase/agent-skills',
    categories: ['database'],
    icon: 'database',
    tags: ['postgres', 'serverless', 'oficial'],
    description: 'Guias para Postgres na Neon: conexão pooled ou direta, migrações de schema, branching e autoscaling.',
    url: 'https://github.com/neondatabase/agent-skills/tree/main/skills/neon-postgres'
  },
  {
    id: 'jeffallan-postgres-pro',
    name: 'postgres-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['database'],
    icon: 'database',
    tags: ['postgres', 'performance'],
    description: 'Otimizar queries PostgreSQL, configurar replicação e usar recursos avançados: EXPLAIN, JSONB, extensões e ajuste de VACUUM.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/postgres-pro'
  },
  {
    id: 'jeffallan-database-optimizer',
    name: 'database-optimizer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['database'],
    icon: 'chart',
    tags: ['postgres', 'mysql', 'performance'],
    description: 'Investiga queries lentas e planos de execução em PostgreSQL e MySQL: desenho de índice e reescrita de query.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/database-optimizer'
  },
  {
    id: 'ecc-postgres-patterns',
    name: 'postgres-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['database'],
    icon: 'database',
    tags: ['postgres', 'sql', 'segurança'],
    description: 'Padrões de PostgreSQL para otimização de query, desenho de schema, índices e políticas RLS.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/postgres-patterns'
  },
  {
    id: 'ecc-database-migrations',
    name: 'database-migrations',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['database'],
    icon: 'refresh',
    tags: ['migrações', 'postgres', 'orm'],
    description: 'Migrações seguras e reversíveis: expand-contract sem downtime, índices concorrentes e backfill em lotes, por ferramenta.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/database-migrations'
  },

  /* --- APIs ---------------------------------------------------------------- */
  {
    id: 'addyosmani-api-and-interface-design',
    name: 'api-and-interface-design',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['api'],
    icon: 'shield',
    tags: ['api', 'rest', 'graphql', 'contratos'],
    description: 'Desenho de API e de interface estáveis: endpoints REST ou GraphQL, contratos de tipo entre módulos e fronteiras públicas.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/api-and-interface-design'
  },
  {
    id: 'ecc-api-design',
    name: 'api-design',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['api'],
    icon: 'shield',
    tags: ['api', 'rest', 'versionamento'],
    description: 'Padrões de API REST: nomes de recurso, status codes, paginação, filtros, respostas de erro, versionamento e rate limiting.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/api-design'
  },
  {
    id: 'jeffallan-api-designer',
    name: 'api-designer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['api'],
    icon: 'doc',
    tags: ['api', 'rest', 'graphql', 'openapi'],
    description: 'Desenhar APIs REST ou GraphQL e escrever especificações OpenAPI: modelagem de recursos, versionamento, paginação e erros.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/api-designer'
  },

  /* --- Dados --------------------------------------------------------------- */
  {
    id: 'jeffallan-pandas-pro',
    name: 'pandas-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['data'],
    icon: 'table',
    tags: ['dados', 'python', 'pandas'],
    description: 'Operações com DataFrames do pandas: limpeza, agregação, junção e séries temporais.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/pandas-pro'
  },
  {
    id: 'jeffallan-sql-pro',
    name: 'sql-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['data', 'database'],
    icon: 'database',
    tags: ['dados', 'sql', 'performance'],
    description: 'Otimiza queries SQL, desenha schemas e investiga lentidão: joins e agregações complexas.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/sql-pro'
  },
  {
    id: 'ecc-clickhouse-io',
    name: 'clickhouse-io',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['data'],
    icon: 'chart',
    tags: ['dados', 'clickhouse', 'analytics'],
    description: 'Padrões de ClickHouse para schema, otimização de query e engenharia de dados em carga analítica.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/clickhouse-io'
  },
  {
    id: 'anthropics-xlsx',
    name: 'xlsx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['data'],
    icon: 'table',
    tags: ['dados', 'excel', 'csv', 'oficial'],
    description: 'Para quando uma planilha é a entrada ou a saída: abrir, ler, editar ou corrigir .xlsx, .csv e .tsv.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/xlsx'
  },

  /* --- Refatoração --------------------------------------------------------- */
  {
    id: 'addyosmani-code-simplification',
    name: 'code-simplification',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['refactoring'],
    icon: 'code',
    tags: ['refatoração', 'legibilidade'],
    description: 'Simplifica código que funciona mas é difícil de ler, manter ou estender, sem mudar o comportamento.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/code-simplification'
  },
  {
    id: 'mattpocock-improve-codebase-architecture',
    name: 'improve-codebase-architecture',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['refactoring'],
    icon: 'layers',
    tags: ['refatoração', 'arquitetura'],
    description: 'Varre a base atrás de oportunidades de aprofundar módulos, mostra um relatório e discute a que você escolher.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture'
  },
  {
    id: 'mattpocock-codebase-design',
    name: 'codebase-design',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['refactoring'],
    icon: 'package',
    tags: ['refatoração', 'arquitetura', 'módulos'],
    description: 'Vocabulário para desenhar módulos profundos: melhorar a interface de um módulo e decidir onde fica uma emenda.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design'
  },
  {
    id: 'jeffallan-legacy-modernizer',
    name: 'legacy-modernizer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['refactoring'],
    icon: 'refresh',
    tags: ['refatoração', 'legado', 'migrações'],
    description: 'Estratégia de migração incremental para base antiga: fronteiras de serviço, mapa de dependências e roteiro.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/legacy-modernizer'
  },

  /* --- Node.js ------------------------------------------------------------- */
  {
    id: 'jeffallan-javascript-pro',
    name: 'javascript-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['node'],
    icon: 'code',
    tags: ['node', 'javascript', 'esm'],
    description: 'Escreve, depura e refatora JavaScript moderno: async/await, módulos ESM e as APIs do Node.js.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/javascript-pro'
  },
  {
    id: 'jeffallan-typescript-pro',
    name: 'typescript-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['node'],
    icon: 'code',
    tags: ['node', 'typescript', 'tipos'],
    description: 'Sistemas de tipo avançados em TypeScript: type guards, utility types, branded types e tRPC.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/typescript-pro'
  },
  {
    id: 'ecc-bun-runtime',
    name: 'bun-runtime',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['node'],
    icon: 'zap',
    tags: ['node', 'bun', 'runtime'],
    description: 'Bun como runtime, gerenciador de pacotes, bundler e test runner: quando escolher Bun ou Node, e notas de migração.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/bun-runtime'
  },

  /* --- Coding style -------------------------------------------------------- */
  /* Padronização, convenções e código limpo. Algumas também estão em outras
     categorias com outro id: a mesma skill serve a mais de uma busca. */
  {
    id: 'unclebob-ub-mode',
    name: 'ub-mode',
    author: 'Robert C. Martin (Uncle Bob)',
    repo: 'unclebob/ub-mode',
    categories: ['coding-style'],
    icon: 'shield',
    tags: ['clean-code', 'tdd', 'disciplina'],
    description: 'Do próprio Uncle Bob: "primeiro funcione, depois fique certo", com TDD, causa raiz e limites de complexidade e duplicação.',
    url: 'https://github.com/unclebob/ub-mode'
  },
  {
    id: 'jonax1337-clean-code-skill',
    name: 'clean-code-skill',
    author: 'jonax1337',
    repo: 'jonax1337/clean-code-skill',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['clean-code', 'avaliação'],
    description: 'Clean Code, de Robert C. Martin, reescrito para agentes, com regras de precedência e suíte de avaliação. Projeto da comunidade.',
    url: 'https://github.com/jonax1337/clean-code-skill'
  },
  {
    id: 'hatlesswizard-clean-code-skills',
    name: 'clean-code-skills',
    author: 'hatlesswizard',
    repo: 'hatlesswizard/clean-code-skills',
    categories: ['coding-style'],
    icon: 'book',
    tags: ['clean-code', 'revisão', 'coleção'],
    description: 'Dezoito verificadores de qualidade, um por capítulo do Clean Code de Robert C. Martin. Projeto da comunidade.',
    url: 'https://github.com/hatlesswizard/clean-code-skills'
  },
  {
    id: 'nghorbani-clean-code-skill',
    name: 'clean-code-skill',
    author: 'nghorbani',
    repo: 'nghorbani/clean-code-skill',
    categories: ['coding-style'],
    icon: 'book',
    tags: ['clean-code', 'referência'],
    description: 'O Clean Code como base de consulta sob demanda: princípios e as heurísticas G1 a G36. Projeto da comunidade.',
    url: 'https://github.com/nghorbani/clean-code-skill'
  },
  {
    id: 'markoa-clean-code-skill',
    name: 'clean-code-skill',
    author: 'markoa',
    repo: 'markoa/clean-code-skill',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['clean-code', 'convenções'],
    description: 'Skill de padrões de programação de código limpo para agentes.',
    url: 'https://github.com/markoa/clean-code-skill'
  },
  {
    id: 'ertugrul-clean-code-skills',
    name: 'clean-code-skills',
    author: 'ertugrul-dmr',
    repo: 'ertugrul-dmr/clean-code-skills',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['clean-code', 'coleção'],
    description: 'Skills de código limpo para Claude Code.',
    url: 'https://github.com/ertugrul-dmr/clean-code-skills'
  },
  {
    id: 'ecc-coding-standards',
    name: 'coding-standards',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'sliders',
    tags: ['convenções', 'nomes', 'legibilidade'],
    description: 'Convenções de base entre projetos: nomes, legibilidade, imutabilidade e revisão de qualidade de código.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/coding-standards'
  },
  {
    id: 'ecc-java-coding-standards',
    name: 'java-coding-standards',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'sliders',
    tags: ['convenções', 'java', 'spring'],
    description: 'Padrões de Java para Spring Boot e Quarkus: nomes, imutabilidade, Optional, streams, exceções e layout do projeto.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/java-coding-standards'
  },
  {
    id: 'ecc-cpp-coding-standards',
    name: 'cpp-coding-standards',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'sliders',
    tags: ['convenções', 'cpp'],
    description: 'Padrões de C++ baseados nas C++ Core Guidelines, para código moderno, seguro e idiomático.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/cpp-coding-standards'
  },
  {
    id: 'ecc-python-patterns',
    name: 'python-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['convenções', 'python', 'pep8'],
    description: 'Idiomas de Python, PEP 8 e type hints, para escrever e revisar código Python.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/python-patterns'
  },
  {
    id: 'ecc-golang-patterns',
    name: 'golang-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['convenções', 'go'],
    description: 'Padrões e convenções idiomáticas de Go, para escrever e revisar código Go.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/golang-patterns'
  },
  {
    id: 'ecc-rust-patterns',
    name: 'rust-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['convenções', 'rust'],
    description: 'Rust idiomático: ownership, tratamento de erro, traits e concorrência.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/rust-patterns'
  },
  {
    id: 'ecc-kotlin-patterns',
    name: 'kotlin-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['convenções', 'kotlin'],
    description: 'Kotlin idiomático: coroutines, null safety e DSL builders.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/kotlin-patterns'
  },
  {
    id: 'addyosmani-code-simplification-style',
    name: 'code-simplification',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['coding-style'],
    icon: 'code',
    tags: ['legibilidade', 'refatoração'],
    description: 'Simplifica código que funciona mas é difícil de ler, manter ou estender, sem mudar o comportamento.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/code-simplification'
  },
  {
    id: 'addyosmani-code-review-and-quality',
    name: 'code-review-and-quality',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['coding-style'],
    icon: 'eye',
    tags: ['revisão', 'qualidade'],
    description: 'Revisão de código em vários eixos, antes de qualquer merge: para código seu, de outro agente ou de uma pessoa.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/code-review-and-quality'
  },
  {
    id: 'mattpocock-code-review',
    name: 'code-review',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['coding-style'],
    icon: 'eye',
    tags: ['revisão', 'convenções'],
    description: 'Revisa as mudanças em dois eixos: se o código segue os padrões documentados do repositório e se bate com a especificação.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review'
  },
  {
    id: 'jeffallan-code-reviewer',
    name: 'code-reviewer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['coding-style'],
    icon: 'eye',
    tags: ['revisão', 'qualidade', 'nomes'],
    description: 'Analisa diffs e arquivos atrás de bugs, vulnerabilidades, code smells, N+1 e problemas de nome, e entrega um relatório estruturado.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/code-reviewer'
  },

  /* --- Automação ----------------------------------------------------------- */
  {
    id: 'n8n-skills',
    name: 'n8n-skills',
    author: 'czlonkowski',
    repo: 'czlonkowski/n8n-skills',
    categories: ['automation'],
    icon: 'graph',
    tags: ['automação', 'n8n', 'workflows', 'coleção'],
    description: 'Conjunto de skills para o Claude Code montar workflows do n8n.',
    url: 'https://github.com/czlonkowski/n8n-skills'
  },
  {
    id: 'addyosmani-ci-cd-and-automation',
    name: 'ci-cd-and-automation',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['automation'],
    icon: 'refresh',
    tags: ['automação', 'ci', 'deploy'],
    description: 'Monta e altera pipelines de build e deploy: portões de qualidade, testes no CI e estratégia de entrega.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/ci-cd-and-automation'
  },
  {
    id: 'jeffallan-devops-engineer',
    name: 'devops-engineer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['automation'],
    icon: 'server',
    tags: ['automação', 'docker', 'kubernetes', 'terraform'],
    description: 'Cria Dockerfiles, pipelines de CI/CD, manifests de Kubernetes e templates de Terraform ou Pulumi.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/devops-engineer'
  },
  {
    id: 'ecc-deployment-patterns',
    name: 'deployment-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['automation'],
    icon: 'rocket',
    tags: ['automação', 'ci', 'deploy', 'docker'],
    description: 'Fluxos de deploy e de CI/CD, containerização, health checks, rollback e checklist de prontidão para produção.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/deployment-patterns'
  },
  {
    id: 'jeffallan-playwright-expert',
    name: 'playwright-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['automation'],
    icon: 'flask',
    tags: ['automação', 'playwright', 'e2e'],
    description: 'Testes E2E com Playwright: scripts, page objects, fixtures, relatórios, CI e depuração de teste instável.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/playwright-expert'
  },
  {
    id: 'ecc-e2e-testing',
    name: 'e2e-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['automation'],
    icon: 'flask',
    tags: ['automação', 'playwright', 'e2e', 'ci'],
    description: 'Padrões de E2E com Playwright: Page Object Model, configuração, integração com CI e estratégia para teste instável.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/e2e-testing'
  },
  {
    id: 'addyosmani-browser-testing-with-devtools',
    name: 'browser-testing-with-devtools',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['automation'],
    icon: 'panel',
    tags: ['automação', 'navegador', 'devtools'],
    description: 'Testa em navegador de verdade pelo Chrome DevTools MCP: inspeciona o DOM, captura erros de console e analisa rede.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/browser-testing-with-devtools'
  },
  {
    id: 'vercel-agent-browser',
    name: 'agent-browser',
    author: 'Vercel',
    repo: 'vercel-labs/agent-browser',
    categories: ['automation'],
    icon: 'panel',
    tags: ['automação', 'navegador', 'cli', 'oficial'],
    description: 'CLI de automação de navegador feita para agentes de IA.',
    url: 'https://github.com/vercel-labs/agent-browser'
  },
  {
    id: 'anthropics-webapp-testing',
    name: 'webapp-testing',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['automation'],
    icon: 'flask',
    tags: ['automação', 'playwright', 'navegador', 'oficial'],
    description: 'Interage com aplicações web locais e as testa com Playwright: verifica o frontend, captura telas e lê os logs do navegador.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/webapp-testing'
  },
  {
    id: 'jeffallan-cli-developer',
    name: 'cli-developer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['automation'],
    icon: 'terminal',
    tags: ['automação', 'cli', 'scripts'],
    description: 'Constrói ferramentas de linha de comando: flags e subcomandos, barras de progresso e scripts de completion.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/cli-developer'
  },

  /* --- Office -------------------------------------------------------------- */
  /* O dia a dia de escritório: documentos, planilhas, apresentações, escrita. */
  {
    id: 'anthropics-docx',
    name: 'docx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'doc',
    tags: ['office', 'word', 'documentos', 'oficial'],
    description: 'Cria, lê e edita documentos e modelos do Word (.docx, .dotx).',
    url: 'https://github.com/anthropics/skills/tree/main/skills/docx'
  },
  {
    id: 'anthropics-pptx',
    name: 'pptx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'chart',
    tags: ['office', 'powerpoint', 'apresentações', 'oficial'],
    description: 'Para qualquer tarefa com .pptx: criar decks e apresentações, ler e extrair o texto de um arquivo existente.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pptx'
  },
  {
    id: 'anthropics-xlsx-office',
    name: 'xlsx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'table',
    tags: ['office', 'excel', 'planilhas', 'oficial'],
    description: 'Para quando uma planilha é a entrada ou a saída: abrir, ler, editar ou corrigir .xlsx, .csv e .tsv.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/xlsx'
  },
  {
    id: 'anthropics-pdf',
    name: 'pdf',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'file',
    tags: ['office', 'pdf', 'documentos', 'oficial'],
    description: 'Tudo com PDF: extrair texto e tabelas, juntar e dividir arquivos, girar páginas e pôr marca d\'água.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pdf'
  },
  {
    id: 'anthropics-internal-comms',
    name: 'internal-comms',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'users',
    tags: ['office', 'comunicação', 'escrita', 'oficial'],
    description: 'Recursos para escrever comunicação interna nos formatos da empresa, como relatórios de status.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/internal-comms'
  },
  {
    id: 'anthropics-doc-coauthoring',
    name: 'doc-coauthoring',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'pen',
    tags: ['office', 'escrita', 'documentação', 'oficial'],
    description: 'Fluxo estruturado para escrever a quatro mãos: documentação, propostas, especificações técnicas e documentos de decisão.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring'
  },
  {
    id: 'anthropics-theme-factory',
    name: 'theme-factory',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'sliders',
    tags: ['office', 'apresentações', 'design', 'oficial'],
    description: 'Aplica um tema a slides, documentos, relatórios e landing pages, a partir de dez temas prontos de cor e fonte.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/theme-factory'
  },
  {
    id: 'anthropics-canvas-design',
    name: 'canvas-design',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'pen',
    tags: ['office', 'design', 'pdf', 'oficial'],
    description: 'Cria peças visuais estáticas em .png e .pdf, como um pôster.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/canvas-design'
  },
  {
    id: 'anthropics-slack-gif-creator',
    name: 'slack-gif-creator',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['office'],
    icon: 'zap',
    tags: ['office', 'slack', 'gif', 'oficial'],
    description: 'Conhecimento e utilitários para criar GIFs animados otimizados para o Slack.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator'
  },
  {
    id: 'mattpocock-handoff',
    name: 'handoff',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['office'],
    icon: 'external',
    tags: ['office', 'produtividade', 'contexto'],
    description: 'Compacta a conversa atual num documento de passagem, para outro agente continuar.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff'
  },
  {
    id: 'mattpocock-grill-me',
    name: 'grill-me',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['office'],
    icon: 'search',
    tags: ['office', 'produtividade', 'planejamento'],
    description: 'Uma entrevista insistente para afiar um plano ou um desenho.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me'
  },
  {
    id: 'ecc-article-writing',
    name: 'article-writing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['office'],
    icon: 'pen',
    tags: ['office', 'escrita', 'conteúdo'],
    description: 'Escreve artigos, guias, posts e newsletters numa voz tirada de exemplos ou de um guia de marca.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/article-writing'
  },
  {
    id: 'ecc-investor-materials',
    name: 'investor-materials',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['office'],
    icon: 'chart',
    tags: ['office', 'apresentações', 'finanças'],
    description: 'Cria e atualiza pitch decks, one-pagers, memorandos para investidor e modelos financeiros.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/investor-materials'
  },
  {
    id: 'ecc-market-research',
    name: 'market-research',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['office'],
    icon: 'search',
    tags: ['office', 'pesquisa', 'análise'],
    description: 'Pesquisa de mercado e análise de concorrência, com atribuição de fonte e resumo voltado à decisão.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/market-research'
  },

  /* --- Marketing ----------------------------------------------------------- */
  {
    id: 'marketingskills',
    name: 'marketingskills',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'package',
    tags: ['marketing', 'cro', 'seo', 'coleção'],
    description: 'Skills de marketing para Claude Code e outros agentes: CRO, copywriting, SEO, analytics e growth.',
    url: 'https://github.com/coreyhaines31/marketingskills'
  },
  {
    id: 'ch-seo-audit',
    name: 'seo-audit',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'search',
    tags: ['marketing', 'seo', 'auditoria'],
    description: 'Audita e diagnostica SEO: por que o tráfego caiu, por que uma página não ranqueia, se canonicals e redirects estão certos.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit'
  },
  {
    id: 'ch-programmatic-seo',
    name: 'programmatic-seo',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'layers',
    tags: ['marketing', 'seo', 'escala'],
    description: 'Páginas de SEO em escala a partir de templates e dados, cada uma útil em vez de rala.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/programmatic-seo'
  },
  {
    id: 'ch-content-strategy',
    name: 'content-strategy',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'doc',
    tags: ['marketing', 'conteúdo', 'planejamento'],
    description: 'Planeja conteúdo: que tema priorizar, clusters de tópico e calendário editorial ligados a clientes e busca.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/content-strategy'
  },
  {
    id: 'ch-marketing-psychology',
    name: 'marketing-psychology',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'users',
    tags: ['marketing', 'psicologia', 'persuasão'],
    description: 'Psicologia aplicada a marketing: vieses, ancoragem, prova social, escassez, e se uma tática de persuasão é honesta.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-psychology'
  },
  {
    id: 'ch-marketing-ideas',
    name: 'marketing-ideas',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'sparkle',
    tags: ['marketing', 'growth', 'ideias'],
    description: 'Ideias de marketing e táticas de crescimento para um produto de software, com pouco tempo ou orçamento.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-ideas'
  },
  {
    id: 'ch-cold-email',
    name: 'cold-email',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'external',
    tags: ['marketing', 'outbound', 'email'],
    description: 'Outbound B2B a frio: e-mails, follow-ups, cadências, domínios de envio e entregabilidade.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/cold-email'
  },
  {
    id: 'ch-ad-creative',
    name: 'ad-creative',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['marketing'],
    icon: 'zap',
    tags: ['marketing', 'anúncios', 'criativo'],
    description: 'Escreve e avalia criativo de anúncio: títulos, texto e variações para Google, Meta, LinkedIn e TikTok.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/ad-creative'
  },
  {
    id: 'ecc-content-engine',
    name: 'content-engine',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['marketing'],
    icon: 'refresh',
    tags: ['marketing', 'conteúdo', 'social'],
    description: 'Sistemas de conteúdo nativos de cada plataforma: posts, threads, roteiros e um ativo adaptado para vários canais.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/content-engine'
  },
  {
    id: 'ecc-market-research-mkt',
    name: 'market-research',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['marketing'],
    icon: 'search',
    tags: ['marketing', 'pesquisa', 'concorrência'],
    description: 'Pesquisa de mercado e análise de concorrência, com atribuição de fonte e resumo voltado à decisão.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/market-research'
  },
  {
    id: 'stillwell-marketing-skills',
    name: 'marketing-skills',
    author: 'robertbstillwell',
    repo: 'robertbstillwell/marketing-skills',
    categories: ['marketing'],
    icon: 'package',
    tags: ['marketing', 'growth', 'coleção'],
    description: 'Skills de marketing e growth para agentes de IA.',
    url: 'https://github.com/robertbstillwell/marketing-skills'
  },

  /* --- Copywriting --------------------------------------------------------- */
  {
    id: 'ch-copywriting',
    name: 'copywriting',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['copywriting'],
    icon: 'pen',
    tags: ['copywriting', 'landing', 'headline'],
    description: 'Escreve ou reescreve a copy de uma página (home, landing, preços, feature) e decide com que título e promessa abrir.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting'
  },
  {
    id: 'ch-copy-editing',
    name: 'copy-editing',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['copywriting'],
    icon: 'pen',
    tags: ['copywriting', 'edição', 'revisão'],
    description: 'Edita, enxuga e revisa copy existente sem reescrever do zero, tirando os cacoetes de texto gerado por IA.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/copy-editing'
  },
  {
    id: 'alirezarezvani-copywriting',
    name: 'copywriting',
    author: 'alirezarezvani',
    repo: 'alirezarezvani/claude-skills',
    categories: ['copywriting'],
    icon: 'pen',
    tags: ['copywriting', 'headline', 'cta'],
    description: 'Para título, tagline, CTA e copy de landing ou preços: pontua títulos candidatos e aplica um framework por seção da página.',
    url: 'https://github.com/alirezarezvani/claude-skills/tree/main/marketing-skill/skills/copywriting'
  },
  {
    id: 'borghei-copywriting',
    name: 'copywriting',
    author: 'borghei',
    repo: 'borghei/Claude-Skills',
    categories: ['copywriting'],
    icon: 'pen',
    tags: ['copywriting', 'landing', 'cta'],
    description: 'Copy persuasiva para home, landing, preços e páginas de produto, com fórmulas de título, frameworks de CTA e tratamento de objeção.',
    url: 'https://github.com/borghei/Claude-Skills/tree/main/marketing/copywriting'
  },
  {
    id: 'robpalmer-copywriting-skills',
    name: 'claude-code-copywriting-skills',
    author: 'Rob Palmer',
    repo: 'robpalmer99/claude-code-copywriting-skills',
    categories: ['copywriting'],
    icon: 'package',
    tags: ['copywriting', 'resposta-direta', 'coleção'],
    description: 'Cinco skills gratuitas de copywriting de resposta direta para o Claude Code.',
    url: 'https://github.com/robpalmer99/claude-code-copywriting-skills'
  },
  {
    id: 'boraoztunc-skills',
    name: 'boraoztunc/skills',
    author: 'boraoztunc',
    repo: 'boraoztunc/skills',
    categories: ['copywriting'],
    icon: 'package',
    tags: ['copywriting', 'seo', 'coleção'],
    description: 'Skills do Claude Code para copywriting, SEO, design e mais.',
    url: 'https://github.com/boraoztunc/skills'
  },
  {
    id: 'ecc-brand-voice',
    name: 'brand-voice',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['copywriting'],
    icon: 'users',
    tags: ['copywriting', 'voz', 'estilo'],
    description: 'Monta um perfil de estilo de escrita a partir de textos reais e o reaplica em conteúdo, outreach e social.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/brand-voice'
  },
  {
    id: 'ecc-article-writing-copy',
    name: 'article-writing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['copywriting'],
    icon: 'doc',
    tags: ['copywriting', 'artigos', 'conteúdo'],
    description: 'Escreve artigos, guias, posts e newsletters numa voz tirada de exemplos ou de um guia de marca.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/article-writing'
  },
  {
    id: 'ch-ad-creative-copy',
    name: 'ad-creative',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    categories: ['copywriting'],
    icon: 'zap',
    tags: ['copywriting', 'anúncios', 'headline'],
    description: 'Escreve e avalia criativo de anúncio: títulos, texto e variações para Google, Meta, LinkedIn e TikTok.',
    url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/ad-creative'
  },

  /* --- Testes -------------------------------------------------------------- */
  /* TDD tem categoria própria; aqui ficam verificação, E2E e teste por linguagem. */
  {
    id: 'jeffallan-test-master',
    name: 'test-master',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'cobertura', 'mocks'],
    description: 'Gera arquivos de teste, cria estratégias de mock, analisa cobertura e desenha planos de teste funcional, de performance e de segurança.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/test-master'
  },
  {
    id: 'obra-verification-before-completion',
    name: 'verification-before-completion',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['testing'],
    icon: 'check',
    tags: ['testes', 'verificação', 'disciplina'],
    description: 'Antes de dizer que algo está pronto, corrigido ou passando: rodar a verificação e conferir a saída.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/verification-before-completion'
  },
  {
    id: 'ecc-verification-loop',
    name: 'verification-loop',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'refresh',
    tags: ['testes', 'verificação', 'ci'],
    description: 'Verificação em seis fases do trabalho de uma sessão: build, tipos, lint, testes com cobertura, busca de segurança e revisão do diff.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/verification-loop'
  },
  {
    id: 'ecc-ai-regression-testing',
    name: 'ai-regression-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'bug',
    tags: ['testes', 'regressão', 'ia'],
    description: 'Testes de regressão para desenvolvimento com IA, e padrões para pegar os pontos cegos de quando o mesmo modelo escreve e revisa.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/ai-regression-testing'
  },
  {
    id: 'ecc-python-testing',
    name: 'python-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'python', 'pytest'],
    description: 'Testes em Python com pytest: fixtures, mocks, parametrização e requisitos de cobertura.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/python-testing'
  },
  {
    id: 'ecc-golang-testing',
    name: 'golang-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'go', 'benchmark'],
    description: 'Testes em Go: table-driven, subtests, benchmarks, fuzzing e cobertura.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/golang-testing'
  },
  {
    id: 'ecc-rust-testing',
    name: 'rust-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'rust'],
    description: 'Testes em Rust: unitários, de integração, assíncronos, baseados em propriedade e mocks.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/rust-testing'
  },
  {
    id: 'ecc-kotlin-testing',
    name: 'kotlin-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'kotlin'],
    description: 'Testes em Kotlin com Kotest e MockK, coroutines, testes baseados em propriedade e cobertura com Kover.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/kotlin-testing'
  },
  {
    id: 'ecc-cpp-testing',
    name: 'cpp-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'flask',
    tags: ['testes', 'cpp', 'googletest'],
    description: 'Escrever e corrigir testes de C++, configurar GoogleTest e CTest, diagnosticar teste instável e adicionar sanitizers.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/cpp-testing'
  },
  {
    id: 'jeffallan-playwright-expert-test',
    name: 'playwright-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['testing'],
    icon: 'panel',
    tags: ['testes', 'playwright', 'e2e'],
    description: 'Testes E2E com Playwright: scripts, page objects, fixtures, relatórios, CI e depuração de teste instável.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/playwright-expert'
  },
  {
    id: 'ecc-e2e-testing-test',
    name: 'e2e-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['testing'],
    icon: 'panel',
    tags: ['testes', 'playwright', 'e2e'],
    description: 'Padrões de E2E com Playwright: Page Object Model, configuração, integração com CI e estratégia para teste instável.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/e2e-testing'
  },
  {
    id: 'anthropics-webapp-testing-test',
    name: 'webapp-testing',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['testing'],
    icon: 'panel',
    tags: ['testes', 'playwright', 'navegador', 'oficial'],
    description: 'Interage com aplicações web locais e as testa com Playwright: verifica o frontend, captura telas e lê os logs do navegador.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/webapp-testing'
  },
  {
    id: 'addyosmani-browser-testing-test',
    name: 'browser-testing-with-devtools',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['testing'],
    icon: 'panel',
    tags: ['testes', 'navegador', 'devtools'],
    description: 'Testa em navegador de verdade pelo Chrome DevTools MCP: inspeciona o DOM, captura erros de console e analisa rede.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/browser-testing-with-devtools'
  },

  /* --- Mobile -------------------------------------------------------------- */
  {
    id: 'jeffallan-react-native-expert',
    name: 'react-native-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['mobile'],
    icon: 'layers',
    tags: ['mobile', 'react-native', 'expo'],
    description: 'Constrói, otimiza e depura apps multiplataforma com React Native e Expo: navegação e módulos nativos.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/react-native-expert'
  },
  {
    id: 'jeffallan-flutter-expert',
    name: 'flutter-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['mobile'],
    icon: 'layers',
    tags: ['mobile', 'flutter', 'dart'],
    description: 'Apps multiplataforma com Flutter 3+ e Dart: widgets, estado com Riverpod ou Bloc e navegação com GoRouter.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/flutter-expert'
  },
  {
    id: 'jeffallan-swift-expert',
    name: 'swift-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['mobile'],
    icon: 'code',
    tags: ['mobile', 'ios', 'swift', 'swiftui'],
    description: 'Apps para iOS, macOS, watchOS e tvOS: views SwiftUI, arquitetura orientada a protocolo e concorrência com async/await.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/swift-expert'
  },
  {
    id: 'jeffallan-kotlin-specialist',
    name: 'kotlin-specialist',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['mobile'],
    icon: 'code',
    tags: ['mobile', 'android', 'kotlin', 'compose'],
    description: 'Kotlin idiomático: coroutines, Flow, arquitetura multiplataforma e UI com Compose.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/kotlin-specialist'
  },
  {
    id: 'ecc-android-clean-architecture',
    name: 'android-clean-architecture',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['mobile'],
    icon: 'package',
    tags: ['mobile', 'android', 'arquitetura'],
    description: 'Clean Architecture para Android e Kotlin Multiplatform: estrutura de módulos, regras de dependência, UseCases e Repositories.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/android-clean-architecture'
  },
  {
    id: 'ecc-compose-multiplatform-patterns',
    name: 'compose-multiplatform-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['mobile'],
    icon: 'layers',
    tags: ['mobile', 'android', 'compose', 'kmp'],
    description: 'Padrões de Compose Multiplatform e Jetpack Compose: estado, navegação, tema e performance.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/compose-multiplatform-patterns'
  },
  {
    id: 'ecc-swiftui-patterns',
    name: 'swiftui-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['mobile'],
    icon: 'layers',
    tags: ['mobile', 'ios', 'swiftui'],
    description: 'Arquitetura SwiftUI: estado com @Observable, composição de views, navegação e performance.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/swiftui-patterns'
  },
  {
    id: 'ecc-swift-concurrency',
    name: 'swift-concurrency-6-2',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['mobile'],
    icon: 'zap',
    tags: ['mobile', 'ios', 'swift', 'concorrência'],
    description: 'A concorrência do Swift 6.2: single-threaded por padrão e @concurrent para trabalho em segundo plano.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/swift-concurrency-6-2'
  },
  {
    id: 'ecc-flutter-dart-code-review',
    name: 'flutter-dart-code-review',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['mobile'],
    icon: 'eye',
    tags: ['mobile', 'flutter', 'revisão'],
    description: 'Checklist de revisão de código Flutter e Dart: widgets, padrões de estado, idiomas de Dart e performance.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/flutter-dart-code-review'
  },

  /* --- Segurança ----------------------------------------------------------- */
  {
    id: 'trailofbits-skills',
    name: 'trailofbits/skills',
    author: 'Trail of Bits',
    repo: 'trailofbits/skills',
    categories: ['security'],
    icon: 'shield',
    tags: ['segurança', 'auditoria', 'coleção'],
    description: 'As skills da Trail of Bits para pesquisa de segurança, detecção de vulnerabilidade e fluxos de auditoria.',
    url: 'https://github.com/trailofbits/skills'
  },
  {
    id: 'addyosmani-security-and-hardening',
    name: 'security-and-hardening',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['security'],
    icon: 'lock',
    tags: ['segurança', 'hardening', 'entrada'],
    description: 'Endurece o código contra vulnerabilidades: ao tratar entrada de usuário, autenticação, armazenamento de dados ou integrações.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/security-and-hardening'
  },
  {
    id: 'jeffallan-secure-code-guardian',
    name: 'secure-code-guardian',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['security'],
    icon: 'lock',
    tags: ['segurança', 'owasp', 'autenticação'],
    description: 'Ao implementar autenticação e autorização, proteger entrada de usuário ou prevenir as vulnerabilidades do OWASP Top 10.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/secure-code-guardian'
  },
  {
    id: 'jeffallan-security-reviewer',
    name: 'security-reviewer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['security'],
    icon: 'eye',
    tags: ['segurança', 'auditoria', 'revisão'],
    description: 'Identifica vulnerabilidades e gera um relatório de auditoria com severidade e orientação de correção.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/security-reviewer'
  },
  {
    id: 'ecc-security-review',
    name: 'security-review',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['security'],
    icon: 'shield',
    tags: ['segurança', 'revisão', 'segredos'],
    description: 'Checklist de revisão de segurança para autenticação, entrada de usuário, segredos, endpoints de API e pagamento.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/security-review'
  },
  {
    id: 'ecc-security-scan',
    name: 'security-scan',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['security'],
    icon: 'search',
    tags: ['segurança', 'claude-code', 'configuração'],
    description: 'Varre a configuração do Claude Code (.claude/) atrás de vulnerabilidade, má configuração e risco de injeção.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/security-scan'
  },
  {
    id: 'ecc-django-security',
    name: 'django-security',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['security'],
    icon: 'shield',
    tags: ['segurança', 'django', 'python'],
    description: 'Segurança em Django: autenticação, autorização, CSRF e prevenção de SQL injection e XSS.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/django-security'
  },
  {
    id: 'ecc-springboot-security',
    name: 'springboot-security',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['security'],
    icon: 'shield',
    tags: ['segurança', 'spring', 'java'],
    description: 'Spring Security: autenticação e autorização, validação, CSRF, segredos, headers e rate limiting.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/springboot-security'
  },
  {
    id: 'jeffallan-fullstack-guardian',
    name: 'fullstack-guardian',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['security'],
    icon: 'layers',
    tags: ['segurança', 'fullstack'],
    description: 'Constrói aplicações full-stack com segurança em camadas, do banco à interface.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/fullstack-guardian'
  },

  /* --- Node.js, especialistas ---------------------------------------------- */
  {
    id: 'jeffallan-nextjs-developer',
    name: 'nextjs-developer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['node'],
    icon: 'layers',
    tags: ['node', 'nextjs', 'react'],
    description: 'Aplicações Next.js 14+ com App Router, server components e server actions: route handlers, middleware e rotas de API.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/nextjs-developer'
  },
  {
    id: 'ecc-nuxt4-patterns',
    name: 'nuxt4-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['node'],
    icon: 'layers',
    tags: ['node', 'nuxt', 'vue'],
    description: 'Padrões de Nuxt 4: hidratação segura, performance, route rules e busca de dados compatível com SSR.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/nuxt4-patterns'
  },
  {
    id: 'ecc-mcp-server-patterns',
    name: 'mcp-server-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['node'],
    icon: 'server',
    tags: ['node', 'typescript', 'mcp'],
    description: 'Servidores MCP com o SDK de Node/TypeScript: tools, resources, prompts e validação com Zod.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/mcp-server-patterns'
  },
  {
    id: 'jeffallan-graphql-architect',
    name: 'graphql-architect',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['node'],
    icon: 'graph',
    tags: ['node', 'graphql', 'apollo'],
    description: 'Schemas GraphQL, Apollo Federation e subscriptions em tempo real: resolvers com DataLoader e otimização de query.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/graphql-architect'
  },
  {
    id: 'jeffallan-websocket-engineer',
    name: 'websocket-engineer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['node'],
    icon: 'zap',
    tags: ['node', 'websocket', 'tempo-real'],
    description: 'Comunicação em tempo real com WebSockets ou Socket.IO: mensagens bidirecionais, escala com Redis, presença e salas.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/websocket-engineer'
  },

  /* --- Inicializadores de projeto ------------------------------------------ */
  /* As seis node-*-init do catálogo estão nesta categoria também: são daqui. */
  {
    id: 'anthropics-web-artifacts-builder',
    name: 'web-artifacts-builder',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['scaffolding'],
    icon: 'package',
    tags: ['inicializador', 'react', 'tailwind', 'oficial'],
    description: 'Ferramentas para criar artifacts HTML de vários componentes com React, Tailwind CSS e shadcn/ui.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder'
  },
  {
    id: 'anthropics-mcp-builder-init',
    name: 'mcp-builder',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['scaffolding'],
    icon: 'server',
    tags: ['inicializador', 'mcp', 'oficial'],
    description: 'Guia para criar um servidor MCP de qualidade, que liga o modelo a serviços externos por tools bem desenhadas.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/mcp-builder'
  },
  {
    id: 'anthropics-skill-creator-init',
    name: 'skill-creator',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['scaffolding'],
    icon: 'wand',
    tags: ['inicializador', 'skills', 'oficial'],
    description: 'Cria uma skill do zero, edita e melhora as existentes e mede o desempenho com avaliações.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/skill-creator'
  },
  {
    id: 'addyosmani-spec-driven-development',
    name: 'spec-driven-development',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['scaffolding'],
    icon: 'doc',
    tags: ['inicializador', 'especificação', 'planejamento'],
    description: 'Escreve a especificação antes do código: ao começar um projeto, uma feature ou uma mudança grande sem spec.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/spec-driven-development'
  },
  {
    id: 'mattpocock-setup',
    name: 'setup-matt-pocock-skills',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    categories: ['scaffolding'],
    icon: 'sliders',
    tags: ['inicializador', 'configuração', 'repositório'],
    description: 'Configura o repositório para as skills de engenharia: issue tracker, vocabulário de triagem e layout dos docs de domínio.',
    url: 'https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills'
  },
  {
    id: 'ecc-configure-ecc',
    name: 'configure-ecc',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['scaffolding'],
    icon: 'sliders',
    tags: ['inicializador', 'configuração', 'claude-code'],
    description: 'Assistente de configuração conversacional do ECC: inventaria a instalação e coleta escopo e modo de hooks.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/configure-ecc'
  }
]);
