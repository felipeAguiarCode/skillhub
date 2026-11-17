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
     estar em mais de uma: NestJS é backend e é Node. Uma subseção (como
     'clean-code', dentro de Coding style) vai junto com a categoria-mãe:
     ['coding-style', 'clean-code'] — a árvore está em CHILD_CATEGORIES.

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
    categories: ['database', 'backend'],
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
    categories: ['api', 'backend'],
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
    categories: ['api', 'backend'],
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
    categories: ['node', 'frontend'],
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
    categories: ['node', 'frontend'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'clean-code'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'conventions'],
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
    categories: ['coding-style', 'readability'],
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
    categories: ['coding-style', 'code-review'],
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
    categories: ['coding-style', 'code-review'],
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
    categories: ['coding-style', 'code-review'],
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
    categories: ['node', 'frontend'],
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
    categories: ['node', 'frontend'],
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
    categories: ['node', 'backend'],
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
    categories: ['node', 'backend'],
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
    categories: ['node', 'backend'],
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
    categories: ['scaffolding', 'frontend'],
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
  },

  /* --- Frontend ------------------------------------------------------------ */
  {
    id: 'shadcn-skill',
    name: 'shadcn',
    author: 'shadcn',
    repo: 'shadcn-ui/ui',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'shadcn', 'ui', 'oficial'],
    description: 'Gerencia componentes e projetos shadcn: adicionar, buscar, corrigir, estilizar e compor UI, com documentação e exemplos de uso.',
    url: 'https://github.com/shadcn-ui/ui/tree/main/skills/shadcn'
  },
  {
    id: 'angular-developer-official',
    name: 'angular-developer',
    author: 'Angular',
    repo: 'angular/skills',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'angular', 'oficial'],
    description: 'Gera código Angular e orienta a arquitetura: componentes, serviços, comunicação HTTP e reatividade com signals.',
    url: 'https://github.com/angular/skills/tree/main/angular-developer'
  },
  {
    id: 'angular-new-app-official',
    name: 'angular-new-app',
    author: 'Angular',
    repo: 'angular/skills',
    categories: ['frontend', 'scaffolding'],
    icon: 'rocket',
    tags: ['frontend', 'angular', 'inicializador', 'oficial'],
    description: 'Cria uma aplicação Angular nova pela Angular CLI, com as orientações para fazer isso bem.',
    url: 'https://github.com/angular/skills/tree/main/angular-new-app'
  },
  {
    id: 'svelte-code-writer',
    name: 'svelte-code-writer',
    author: 'Svelte',
    repo: 'sveltejs/ai-tools',
    categories: ['frontend'],
    icon: 'code',
    tags: ['frontend', 'svelte', 'oficial'],
    description: 'Ferramentas de linha de comando para consultar a documentação do Svelte 5 e analisar componentes, ao criar ou editar qualquer .svelte.',
    url: 'https://github.com/sveltejs/ai-tools/tree/main/tools/skills/svelte-code-writer'
  },
  {
    id: 'svelte-core-bestpractices',
    name: 'svelte-core-bestpractices',
    author: 'Svelte',
    repo: 'sveltejs/ai-tools',
    categories: ['frontend'],
    icon: 'code',
    tags: ['frontend', 'svelte', 'oficial'],
    description: 'Orientação para escrever Svelte moderno, rápido e robusto, ao criar, editar ou analisar componentes e módulos.',
    url: 'https://github.com/sveltejs/ai-tools/tree/main/tools/skills/svelte-core-bestpractices'
  },
  {
    id: 'antfu-vue',
    name: 'vue',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'vue'],
    description: 'Vue 3 com Composition API, macros do script setup, reatividade e os componentes nativos como Transition e Teleport.',
    url: 'https://github.com/antfu/skills/tree/main/skills/vue'
  },
  {
    id: 'antfu-nuxt',
    name: 'nuxt',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'vue', 'nuxt'],
    description: 'Nuxt, o framework full-stack de Vue: SSR, auto-imports, rotas por arquivo, server routes e useFetch.',
    url: 'https://github.com/antfu/skills/tree/main/skills/nuxt'
  },
  {
    id: 'antfu-pinia',
    name: 'pinia',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'database',
    tags: ['frontend', 'vue', 'estado'],
    description: 'Pinia, a biblioteca oficial de estado do Vue: stores, getters e actions com tipagem.',
    url: 'https://github.com/antfu/skills/tree/main/skills/pinia'
  },
  {
    id: 'antfu-vite',
    name: 'vite',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'zap',
    tags: ['frontend', 'vite', 'build'],
    description: 'Configuração do Vite, API de plugins, SSR e migração para o Rolldown do Vite 8.',
    url: 'https://github.com/antfu/skills/tree/main/skills/vite'
  },
  {
    id: 'antfu-unocss',
    name: 'unocss',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'sliders',
    tags: ['frontend', 'css', 'unocss'],
    description: 'UnoCSS, engine de CSS atômico superconjunto do Tailwind: regras, atalhos e presets.',
    url: 'https://github.com/antfu/skills/tree/main/skills/unocss'
  },
  {
    id: 'vercel-react-best-practices',
    name: 'react-best-practices',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'react', 'nextjs', 'oficial'],
    description: 'Diretrizes de performance de React e Next.js da engenharia da Vercel, para escrever, revisar ou refatorar código.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices'
  },
  {
    id: 'vercel-web-design-guidelines',
    name: 'web-design-guidelines',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    categories: ['frontend'],
    icon: 'eye',
    tags: ['frontend', 'ui', 'revisão', 'oficial'],
    description: 'Revisa uma interface contra as diretrizes de design web da Vercel.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines'
  },
  {
    id: 'vercel-composition-patterns',
    name: 'composition-patterns',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'react', 'componentes', 'oficial'],
    description: 'Padrões de composição de React que escalam: quando props booleanas se multiplicam ou ao desenhar componentes reutilizáveis.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns'
  },
  {
    id: 'vercel-react-view-transitions',
    name: 'react-view-transitions',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    categories: ['frontend'],
    icon: 'refresh',
    tags: ['frontend', 'react', 'animação', 'oficial'],
    description: 'Animações com a View Transition API do React, com aparência de transição nativa.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/react-view-transitions'
  },
  {
    id: 'anthropics-frontend-design',
    name: 'frontend-design',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    categories: ['frontend'],
    icon: 'pen',
    tags: ['frontend', 'design', 'ui', 'oficial'],
    description: 'Direção visual intencional para UI nova ou redesenhada: tipografia e escolhas que não leem como template.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/frontend-design'
  },
  {
    id: 'addyosmani-frontend-ui-engineering',
    name: 'frontend-ui-engineering',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['frontend'],
    icon: 'panel',
    tags: ['frontend', 'ui', 'acessibilidade'],
    description: 'Constrói interfaces de produção acessíveis e responsivas: componentes, layouts e páginas.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/frontend-ui-engineering'
  },
  {
    id: 'jeffallan-react-expert',
    name: 'react-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'react'],
    description: 'React 18+ e Next.js App Router: componentes, hooks customizados e depuração de renderização.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/react-expert'
  },
  {
    id: 'jeffallan-vue-expert',
    name: 'vue-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'vue', 'nuxt'],
    description: 'Componentes Vue 3 com Composition API, Nuxt 3 em SSR ou SSG, stores Pinia e PWA.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/vue-expert'
  },
  {
    id: 'jeffallan-angular-architect',
    name: 'angular-architect',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'angular', 'rxjs'],
    description: 'Angular 17+ com componentes standalone, rotas com lazy loading e guards, NgRx e RxJS.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/angular-architect'
  },
  {
    id: 'ecc-frontend-patterns',
    name: 'frontend-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'panel',
    tags: ['frontend', 'react', 'nextjs'],
    description: 'Padrões de frontend para React e Next.js: estado, performance e boas práticas de UI.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/frontend-patterns'
  },
  {
    id: 'ecc-react-patterns',
    name: 'react-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'react'],
    description: 'Padrões de React 18 e 19: disciplina de hooks, fronteira entre server e client, Suspense, error boundaries e form actions.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/react-patterns'
  },
  {
    id: 'ecc-react-performance',
    name: 'react-performance',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'chart',
    tags: ['frontend', 'react', 'performance'],
    description: 'Performance de React e Next.js, com mais de 70 regras adaptadas das boas práticas da Vercel.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/react-performance'
  },
  {
    id: 'ecc-vue-patterns',
    name: 'vue-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'vue'],
    description: 'Vue 3 com Composition API: arquitetura de componentes, reatividade, Pinia, Vue Router e SSR com Nuxt.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/vue-patterns'
  },
  {
    id: 'ecc-vite-patterns',
    name: 'vite-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'zap',
    tags: ['frontend', 'vite', 'build'],
    description: 'Padrões de Vite: configuração, plugins, HMR, variáveis de ambiente, proxy, SSR e modo biblioteca.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/vite-patterns'
  },
  {
    id: 'ecc-frontend-a11y',
    name: 'frontend-a11y',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend', 'accessibility'],
    icon: 'eye',
    tags: ['frontend', 'acessibilidade', 'react'],
    description: 'Acessibilidade em React e Next.js: HTML semântico, ARIA, rótulos de formulário, teclado e foco.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/frontend-a11y'
  },
  {
    id: 'ecc-design-system',
    name: 'design-system',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'sliders',
    tags: ['frontend', 'design', 'tokens'],
    description: 'Gera um design system a partir do código existente, ou audita a consistência visual: extrai tokens de cor, tipografia e espaçamento.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/design-system'
  },
  {
    id: 'ecc-typescript-patterns',
    name: 'typescript-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend', 'coding-style', 'conventions'],
    icon: 'code',
    tags: ['typescript', 'convenções', 'tipos'],
    description: 'TypeScript estrito e seguro: configuração do compilador, desenho de tipos e narrowing.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/typescript-patterns'
  },

  /* --- Backend, mais ------------------------------------------------------- */
  {
    id: 'jeffallan-django-expert',
    name: 'django-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'python', 'django'],
    description: 'Aplicações Django e APIs com Django REST Framework: models, settings e manage.py.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/django-expert'
  },
  {
    id: 'jeffallan-spring-boot-engineer',
    name: 'spring-boot-engineer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'java', 'spring'],
    description: 'Spring Boot 3: configuração, controllers REST, Spring Security 6 e repositórios Spring Data JPA.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/spring-boot-engineer'
  },
  {
    id: 'jeffallan-laravel-specialist',
    name: 'laravel-specialist',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'php', 'laravel'],
    description: 'Laravel 10+: models e relações Eloquent, autenticação com Sanctum e filas com Horizon.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/laravel-specialist'
  },
  {
    id: 'jeffallan-rails-expert',
    name: 'rails-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'ruby', 'rails'],
    description: 'Rails 7+: queries do Active Record com eager loading, Turbo Frames e Turbo Streams, e Action Cable.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/rails-expert'
  },
  {
    id: 'jeffallan-dotnet-core-expert',
    name: 'dotnet-core-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'dotnet', 'csharp'],
    description: '.NET 8 com minimal APIs, clean architecture, Entity Framework Core e CQRS com MediatR.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/dotnet-core-expert'
  },
  {
    id: 'jeffallan-golang-pro',
    name: 'golang-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'zap',
    tags: ['backend', 'go', 'microsserviços'],
    description: 'Go concorrente com goroutines e channels, microsserviços em gRPC ou REST e profiling com pprof.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/golang-pro'
  },
  {
    id: 'jeffallan-php-pro',
    name: 'php-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'code',
    tags: ['backend', 'php'],
    description: 'PHP 8.3+ com tipagem estrita, PHPStan nível 9, Laravel ou Symfony e padrões PSR.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/php-pro'
  },
  {
    id: 'jeffallan-java-architect',
    name: 'java-architect',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'layers',
    tags: ['backend', 'java', 'spring'],
    description: 'Java corporativo com Spring Boot 3, microsserviços e programação reativa com WebFlux.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/java-architect'
  },
  {
    id: 'jeffallan-microservices-architect',
    name: 'microservices-architect',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend', 'architecture'],
    icon: 'graph',
    tags: ['backend', 'arquitetura', 'microsserviços'],
    description: 'Desenha sistemas distribuídos: divide monólitos em serviços por contexto e escolhe padrões de comunicação e resiliência.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/microservices-architect'
  },
  {
    id: 'ecc-django-patterns',
    name: 'django-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'python', 'django'],
    description: 'Arquitetura Django: APIs com DRF, ORM, cache, signals e middleware para apps de produção.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/django-patterns'
  },
  {
    id: 'ecc-springboot-patterns',
    name: 'springboot-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'java', 'spring'],
    description: 'Arquitetura Spring Boot: API REST, serviços em camadas, acesso a dados, cache, processamento assíncrono e logging.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/springboot-patterns'
  },
  {
    id: 'ecc-laravel-patterns',
    name: 'laravel-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'php', 'laravel'],
    description: 'Arquitetura Laravel: rotas e controllers, Eloquent, camada de serviço, filas, eventos, cache e API resources.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/laravel-patterns'
  },
  {
    id: 'ecc-rails-patterns',
    name: 'rails-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'ruby', 'rails'],
    description: 'Padrões de Rails 7.1+ e 8: controllers enxutos com service objects, form e query objects e Active Record idiomático.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/rails-patterns'
  },
  {
    id: 'ecc-fastapi-patterns',
    name: 'fastapi-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'zap',
    tags: ['backend', 'python', 'fastapi'],
    description: 'FastAPI: estrutura de projeto, schemas Pydantic v2, injeção de dependência, handlers assíncronos, autenticação e testes.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/fastapi-patterns'
  },
  {
    id: 'ecc-dotnet-patterns',
    name: 'dotnet-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'coding-style', 'conventions'],
    icon: 'code',
    tags: ['backend', 'dotnet', 'csharp', 'convenções'],
    description: 'C# e .NET idiomáticos: convenções, injeção de dependência, async/await e boas práticas.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/dotnet-patterns'
  },
  {
    id: 'ecc-redis-patterns',
    name: 'redis-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'redis', 'cache'],
    description: 'Redis em produção: estruturas de dados, estratégias de cache, locks distribuídos, rate limiting e pub/sub.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/redis-patterns'
  },
  {
    id: 'ecc-hexagonal-architecture',
    name: 'hexagonal-architecture',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'architecture'],
    icon: 'package',
    tags: ['backend', 'arquitetura', 'ports-adapters'],
    description: 'Ports & Adapters: fronteiras de domínio claras, inversão de dependência e casos de uso testáveis.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/hexagonal-architecture'
  },
  {
    id: 'ecc-error-handling',
    name: 'error-handling',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'alert',
    tags: ['backend', 'erros', 'resiliência'],
    description: 'Tratamento de erro robusto em TypeScript, Python e Go: erros tipados, retries, circuit breakers e mensagens ao usuário.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/error-handling'
  },
  {
    id: 'ecc-kotlin-ktor-patterns',
    name: 'kotlin-ktor-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'kotlin', 'ktor'],
    description: 'Servidor Ktor: DSL de rotas, plugins, autenticação, injeção com Koin, serialização e testes.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/kotlin-ktor-patterns'
  },

  /* --- Docker -------------------------------------------------------------- */
  /* Só Docker e Docker Compose. As oficiais são da própria Docker (docker/skills). */
  {
    id: 'docker-build-strategies',
    name: 'docker-build-strategies',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker'],
    icon: 'package',
    tags: ['docker', 'dockerfile', 'oficial'],
    description: 'Escrever, revisar ou otimizar Dockerfiles: imagem grande demais, build lento ou container a endurecer.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-build-strategies'
  },
  {
    id: 'docker-compose-patterns',
    name: 'docker-compose-patterns',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker'],
    icon: 'layers',
    tags: ['docker', 'compose', 'oficial'],
    description: 'Criar, alterar ou depurar configurações do Docker Compose: ligar serviços e pôr um banco na stack.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-compose-patterns'
  },
  {
    id: 'docker-project-foundations',
    name: 'docker-project-foundations',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker', 'scaffolding'],
    icon: 'rocket',
    tags: ['docker', 'compose', 'inicializador', 'oficial'],
    description: 'Configurar, iniciar ou dockerizar um projeto, mesmo quando o pedido só descreve um ambiente local em container.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-project-foundations'
  },
  {
    id: 'docker-destructive-guardrails',
    name: 'docker-destructive-guardrails',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker'],
    icon: 'shield',
    tags: ['docker', 'segurança', 'oficial'],
    description: 'Antes de rodar ou sugerir um comando Docker que apaga, limpa ou muda estado de forma irreversível.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-destructive-guardrails'
  },
  {
    id: 'docker-docs',
    name: 'docker-docs',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker'],
    icon: 'book',
    tags: ['docker', 'documentação', 'oficial'],
    description: 'Responde sobre qualquer produto Docker a partir da documentação oficial atual, não da memória.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-docs'
  },
  {
    id: 'docker-sandboxes-lifecycle',
    name: 'docker-sandboxes-lifecycle',
    author: 'Docker',
    repo: 'docker/skills',
    categories: ['docker'],
    icon: 'terminal',
    tags: ['docker', 'sandbox', 'agentes', 'oficial'],
    description: 'Criar, rodar, listar, parar e remover Docker Sandboxes, o CLI sbx que roda agentes em microVMs isoladas.',
    url: 'https://github.com/docker/skills/tree/main/skills/docker-sandboxes-lifecycle'
  },
  {
    id: 'ecc-docker-patterns',
    name: 'docker-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['docker'],
    icon: 'package',
    tags: ['docker', 'compose', 'segurança'],
    description: 'Docker e Docker Compose para desenvolvimento local: segurança de container, rede, volumes e orquestração de vários serviços.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/docker-patterns'
  },

  /* --- Coding style, mais --------------------------------------------------- */
  {
    id: 'obra-requesting-code-review',
    name: 'requesting-code-review',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['coding-style', 'code-review'],
    icon: 'eye',
    tags: ['revisão', 'disciplina'],
    description: 'Ao terminar uma tarefa ou uma feature grande, antes do merge: pede revisão para confirmar que o trabalho atende aos requisitos.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/requesting-code-review'
  },
  {
    id: 'obra-receiving-code-review',
    name: 'receiving-code-review',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['coding-style', 'code-review'],
    icon: 'eye',
    tags: ['revisão', 'disciplina'],
    description: 'Ao receber feedback de revisão, antes de aplicar as sugestões: exige rigor técnico e verificação, não concordância automática.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/receiving-code-review'
  },
  {
    id: 'ecc-plankton-code-quality',
    name: 'plankton-code-quality',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style', 'readability'],
    icon: 'sliders',
    tags: ['lint', 'formatação', 'qualidade'],
    description: 'Qualidade de código na hora da escrita: formatação, lint e correções automáticas a cada edição, por hooks.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/plankton-code-quality'
  },
  {
    id: 'ecc-inherit-legacy-style',
    name: 'inherit-legacy-style',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style', 'readability'],
    icon: 'book',
    tags: ['convenções', 'legado', 'estilo'],
    description: 'Evita que a IA desvie do estilo de um projeto legado: levanta as convenções implícitas e grava um guia que pode ser cobrado.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/inherit-legacy-style'
  },
  {
    id: 'ecc-conventional-commit-review',
    name: 'conventional-commit-review',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style', 'commits', 'git', 'git-commits'],
    icon: 'git-branch',
    tags: ['commits', 'git', 'convenções'],
    description: 'Revisa as mudanças em stage e escreve uma mensagem de commit no padrão Conventional Commits.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/conventional-commit-review'
  },
  {
    id: 'ecc-git-workflow',
    name: 'git-workflow',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['coding-style', 'commits', 'git', 'git-branching'],
    icon: 'git-branch',
    tags: ['git', 'branches', 'commits'],
    description: 'Fluxo de Git: estratégia de branch, convenção de commit, histórico limpo, merge ou rebase e resolução de conflito.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/git-workflow'
  },
  {
    id: 'addyosmani-git-workflow-and-versioning',
    name: 'git-workflow-and-versioning',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['coding-style', 'commits', 'git', 'git-branching'],
    icon: 'git-branch',
    tags: ['git', 'commits'],
    description: 'Práticas de Git para qualquer mudança: commits, branches, conflitos e divisão de trabalho ainda não commitado.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/git-workflow-and-versioning'
  },
  {
    id: 'addyosmani-documentation-and-adrs',
    name: 'documentation-and-adrs',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['coding-style', 'code-docs'],
    icon: 'doc',
    tags: ['documentação', 'adr'],
    description: 'Registra decisões em ADRs e documentação, e detecta quando a documentação se afastou do código.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/documentation-and-adrs'
  },
  {
    id: 'jeffallan-code-documenter',
    name: 'code-documenter',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['coding-style', 'code-docs'],
    icon: 'doc',
    tags: ['documentação', 'openapi', 'jsdoc'],
    description: 'Gera e valida documentação técnica: docstrings, especificações OpenAPI, JSDoc e guias.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/code-documenter'
  },

  /* --- Frontend, mais ------------------------------------------------------ */
  {
    id: 'cloudflare-web-perf',
    name: 'web-perf',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['frontend', 'performance'],
    icon: 'chart',
    tags: ['frontend', 'performance', 'web-vitals', 'oficial'],
    description: 'Audita, diagnostica e otimiza o carregamento e a interação de um site: Core Web Vitals e a nota de performance do Lighthouse.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/web-perf'
  },
  {
    id: 'cloudflare-frameworks',
    name: 'frameworks-on-cloudflare',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['frontend'],
    icon: 'cloud',
    tags: ['frontend', 'astro', 'sveltekit', 'oficial'],
    description: 'Constrói, migra e publica apps de frameworks web nos Cloudflare Workers: Astro, SvelteKit, React Router, TanStack Start e outros.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/frameworks-on-cloudflare'
  },
  {
    id: 'cloudflare-nextjs',
    name: 'nextjs-on-cloudflare',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['frontend'],
    icon: 'cloud',
    tags: ['frontend', 'nextjs', 'oficial'],
    description: 'Constrói, migra e publica apps Next.js nos Cloudflare Workers com o vinext.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/nextjs-on-cloudflare'
  },
  {
    id: 'netlify-frameworks',
    name: 'netlify-frameworks',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['frontend'],
    icon: 'cloud',
    tags: ['frontend', 'ssr', 'deploy', 'oficial'],
    description: 'Publica e configura frameworks web na Netlify: build, adaptadores de SSR e edge, emulação local e variáveis de ambiente.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-frameworks'
  },
  {
    id: 'netlify-image-cdn',
    name: 'netlify-image-cdn',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['frontend'],
    icon: 'eye',
    tags: ['frontend', 'imagens', 'cdn', 'oficial'],
    description: 'Transforma imagens sob demanda pela Image CDN da Netlify: redimensiona, recorta e troca formato e qualidade por parâmetro.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-image-cdn'
  },
  {
    id: 'netlify-forms',
    name: 'netlify-forms',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['frontend'],
    icon: 'doc',
    tags: ['frontend', 'formulários', 'oficial'],
    description: 'Formulários sem servidor na Netlify: detecta os formulários HTML no deploy, guarda envios, filtra spam e manda notificação.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-forms'
  },
  {
    id: 'remotion-best-practices',
    name: 'remotion-best-practices',
    author: 'Remotion',
    repo: 'remotion-dev/skills',
    categories: ['frontend'],
    icon: 'zap',
    tags: ['frontend', 'react', 'vídeo', 'oficial'],
    description: 'Ponto de entrada das skills do Remotion, para criar vídeo de forma programática com React.',
    url: 'https://github.com/remotion-dev/skills/tree/main/skills/remotion-best-practices'
  },
  {
    id: 'sanity-best-practices',
    name: 'sanity-best-practices',
    author: 'Sanity',
    repo: 'sanity-io/agent-toolkit',
    categories: ['frontend'],
    icon: 'book',
    tags: ['frontend', 'cms', 'sanity', 'oficial'],
    description: 'Boas práticas de Sanity: schemas, queries GROQ, TypeGen, Visual Editing, imagens, Portable Text e estrutura do Studio.',
    url: 'https://github.com/sanity-io/agent-toolkit/tree/main/skills/sanity-best-practices'
  },
  {
    id: 'sanity-content-modeling',
    name: 'content-modeling-best-practices',
    author: 'Sanity',
    repo: 'sanity-io/agent-toolkit',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'cms', 'modelagem', 'oficial'],
    description: 'Modelagem de conteúdo estruturado: desenho de schema, reuso, referência ou objeto embutido e separação de conteúdo e apresentação.',
    url: 'https://github.com/sanity-io/agent-toolkit/tree/main/skills/content-modeling-best-practices'
  },
  {
    id: 'sanity-portable-text',
    name: 'portable-text-serialization',
    author: 'Sanity',
    repo: 'sanity-io/agent-toolkit',
    categories: ['frontend'],
    icon: 'code',
    tags: ['frontend', 'react', 'vue', 'oficial'],
    description: 'Renderiza e serializa Portable Text para React, Svelte, Vue, Astro, HTML, Markdown e texto puro.',
    url: 'https://github.com/sanity-io/agent-toolkit/tree/main/skills/portable-text-serialization'
  },
  {
    id: 'sanity-seo-aeo',
    name: 'seo-aeo-best-practices',
    author: 'Sanity',
    repo: 'sanity-io/agent-toolkit',
    categories: ['frontend', 'marketing'],
    icon: 'search',
    tags: ['frontend', 'seo', 'metadados', 'oficial'],
    description: 'SEO e AEO: metadados, Open Graph, sitemaps, robots.txt, hreflang e dados estruturados JSON-LD.',
    url: 'https://github.com/sanity-io/agent-toolkit/tree/main/skills/seo-aeo-best-practices'
  },
  {
    id: 'stitch-shadcn-ui',
    name: 'shadcn-ui',
    author: 'Google Labs',
    repo: 'google-labs-code/stitch-skills',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'shadcn', 'componentes', 'oficial'],
    description: 'Orientação para montar apps com componentes shadcn/ui: descoberta, instalação e customização.',
    url: 'https://github.com/google-labs-code/stitch-skills/tree/main/plugins/stitch-build/skills/shadcn-ui'
  },
  {
    id: 'stitch-react-components',
    name: 'react-components',
    author: 'Google Labs',
    repo: 'google-labs-code/stitch-skills',
    categories: ['frontend'],
    icon: 'hexagon',
    tags: ['frontend', 'react', 'vite', 'oficial'],
    description: 'Converte designs do Stitch em componentes React e Vite modulares, ou atualiza os existentes para o design mais recente.',
    url: 'https://github.com/google-labs-code/stitch-skills/tree/main/plugins/stitch-build/skills/react-components'
  },
  {
    id: 'stitch-react-vite-dashboard',
    name: 'react-vite-dashboard',
    author: 'Google Labs',
    repo: 'google-labs-code/stitch-skills',
    categories: ['frontend'],
    icon: 'chart',
    tags: ['frontend', 'react', 'dashboard', 'oficial'],
    description: 'Converte designs do Stitch em dashboards React e Vite de produção, com TanStack Query e tokens acessíveis.',
    url: 'https://github.com/google-labs-code/stitch-skills/tree/main/plugins/stitch-build/skills/react-vite-dashboard'
  },
  {
    id: 'stitch-design-md',
    name: 'design-md',
    author: 'Google Labs',
    repo: 'google-labs-code/stitch-skills',
    categories: ['frontend'],
    icon: 'doc',
    tags: ['frontend', 'design', 'design-system', 'oficial'],
    description: 'Analisa projetos do Stitch e sintetiza um design system semântico em arquivos DESIGN.md.',
    url: 'https://github.com/google-labs-code/stitch-skills/tree/main/plugins/stitch-utilities/skills/design-md'
  },
  {
    id: 'ecc-react-testing',
    name: 'react-testing',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend', 'testing'],
    icon: 'flask',
    tags: ['frontend', 'react', 'testes'],
    description: 'Testes de componente React com Testing Library, Vitest ou Jest, MSW para mockar rede e asserções de acessibilidade com axe.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/react-testing'
  },
  {
    id: 'ecc-nextjs-turbopack',
    name: 'nextjs-turbopack',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'zap',
    tags: ['frontend', 'nextjs', 'turbopack'],
    description: 'Next.js 16+ e Turbopack: bundling incremental, cache em disco, HMR mais rápido e quando ficar no webpack.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/nextjs-turbopack'
  },
  {
    id: 'ecc-motion-foundations',
    name: 'motion-foundations',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'refresh',
    tags: ['frontend', 'animação', 'react'],
    description: 'Fundamentos de animação com motion/react: tokens de movimento, presets de mola, performance, acessibilidade e SSR.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/motion-foundations'
  },
  {
    id: 'ecc-motion-patterns',
    name: 'motion-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'refresh',
    tags: ['frontend', 'animação', 'react'],
    description: 'Padrões de animação para React e Next.js: botão, modal, toast, stagger, transição de página, saída, scroll e layout.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/motion-patterns'
  },
  {
    id: 'ecc-frontend-design-direction',
    name: 'frontend-design-direction',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'pen',
    tags: ['frontend', 'design', 'ui'],
    description: 'Define uma direção de design para UI de produção: sites, dashboards, apps, componentes e landing pages.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/frontend-design-direction'
  },
  {
    id: 'ecc-make-interfaces-feel-better',
    name: 'make-interfaces-feel-better',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'sparkle',
    tags: ['frontend', 'ui', 'polimento'],
    description: 'Detalhes de design engineering que deixam a interface polida: espaçamento, tipografia, bordas, sombras e movimento.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/make-interfaces-feel-better'
  },
  {
    id: 'ecc-ui-to-vue',
    name: 'ui-to-vue',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'layers',
    tags: ['frontend', 'vue', 'design'],
    description: 'Converte telas e exports de design em lote para componentes Vue 3, com Vant, Element Plus ou Ant Design Vue.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/ui-to-vue'
  },
  {
    id: 'ecc-i18n-sync',
    name: 'i18n-sync',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend'],
    icon: 'refresh',
    tags: ['frontend', 'i18n', 'traduções'],
    description: 'Traduz e sincroniza os arquivos JSON de idioma da aplicação, respeitando a terminologia do projeto.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/i18n-sync'
  },
  {
    id: 'ecc-browser-qa',
    name: 'browser-qa',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['frontend', 'testing'],
    icon: 'panel',
    tags: ['frontend', 'qa', 'navegador'],
    description: 'Verificação de UI depois do deploy com automação de navegador: erros de console, Core Web Vitals e fluxos de formulário.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/browser-qa'
  },
  {
    id: 'jeffallan-wordpress-pro',
    name: 'wordpress-pro',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['frontend', 'backend'],
    icon: 'doc',
    tags: ['frontend', 'backend', 'wordpress', 'php'],
    description: 'Temas e plugins WordPress, blocos Gutenberg, lojas WooCommerce e a REST API do WordPress.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/wordpress-pro'
  },
  {
    id: 'jeffallan-shopify-expert',
    name: 'shopify-expert',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['frontend', 'backend'],
    icon: 'package',
    tags: ['frontend', 'backend', 'shopify', 'ecommerce'],
    description: 'Temas Shopify em Liquid, apps customizados com OAuth e webhooks, e a Storefront API.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/shopify-expert'
  },
  {
    id: 'antfu-vitepress',
    name: 'vitepress',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend'],
    icon: 'book',
    tags: ['frontend', 'vue', 'documentação'],
    description: 'VitePress, o gerador de site estático com Vite e Vue: sites de documentação, temas e Markdown com componentes Vue.',
    url: 'https://github.com/antfu/skills/tree/main/skills/vitepress'
  },
  {
    id: 'antfu-vitest',
    name: 'vitest',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['frontend', 'testing'],
    icon: 'flask',
    tags: ['frontend', 'testes', 'vitest'],
    description: 'Vitest, o framework de testes do Vite com API compatível com Jest: mocks, cobertura, filtros e fixtures.',
    url: 'https://github.com/antfu/skills/tree/main/skills/vitest'
  },
  {
    id: 'addyosmani-performance-optimization',
    name: 'performance-optimization',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    categories: ['frontend', 'backend', 'performance'],
    icon: 'chart',
    tags: ['performance', 'frontend', 'backend'],
    description: 'Otimiza performance no frontend, no backend, nas queries e no banco, quando há requisito ou suspeita de lentidão.',
    url: 'https://github.com/addyosmani/agent-skills/tree/main/skills/performance-optimization'
  },
  {
    id: 'vercel-deploy-to-vercel',
    name: 'deploy-to-vercel',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    categories: ['frontend', 'devops'],
    icon: 'rocket',
    tags: ['frontend', 'deploy', 'oficial'],
    description: 'Publica aplicações e sites na Vercel quando o pedido é colocar no ar e devolver o link.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/deploy-to-vercel'
  },

  /* --- Backend, mais ainda ------------------------------------------------- */
  {
    id: 'stripe-best-practices',
    name: 'stripe-best-practices',
    author: 'Stripe',
    repo: 'stripe/ai',
    categories: ['backend'],
    icon: 'shield',
    tags: ['backend', 'pagamentos', 'stripe', 'oficial'],
    description: 'Orienta decisões de integração com a Stripe: ambientes de teste e sandbox, chaves e versões da API.',
    url: 'https://github.com/stripe/ai/tree/main/providers/claude/plugin/skills/stripe-best-practices'
  },
  {
    id: 'stripe-upgrade',
    name: 'upgrade-stripe',
    author: 'Stripe',
    repo: 'stripe/ai',
    categories: ['backend'],
    icon: 'refresh',
    tags: ['backend', 'pagamentos', 'stripe', 'oficial'],
    description: 'Atualiza versões da API da Stripe, endpoints de webhook, SDKs de servidor, Stripe.js e SDKs mobile.',
    url: 'https://github.com/stripe/ai/tree/main/providers/claude/plugin/skills/upgrade-stripe'
  },
  {
    id: 'stripe-implementation-planner',
    name: 'stripe-implementation-planner',
    author: 'Stripe',
    repo: 'stripe/ai',
    categories: ['backend'],
    icon: 'doc',
    tags: ['backend', 'pagamentos', 'arquitetura', 'oficial'],
    description: 'Planeja a escolha de produtos e a arquitetura de integração para uma configuração inicial ou uma expansão da Stripe.',
    url: 'https://github.com/stripe/ai/tree/main/providers/claude/plugin/skills/stripe-implementation-planner'
  },
  {
    id: 'stripe-docs',
    name: 'stripe-docs',
    author: 'Stripe',
    repo: 'stripe/ai',
    categories: ['backend'],
    icon: 'book',
    tags: ['backend', 'stripe', 'documentação', 'oficial'],
    description: 'Lê e busca a documentação e a referência da API da Stripe, no lugar de curl ou fetch.',
    url: 'https://github.com/stripe/ai/tree/main/providers/claude/plugin/skills/stripe-docs'
  },
  {
    id: 'better-auth-best-practices',
    name: 'best-practices',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend'],
    icon: 'lock',
    tags: ['backend', 'autenticação', 'oficial'],
    description: 'Configura servidor e cliente do Better Auth: adaptadores de banco, sessões, plugins e variáveis de ambiente.',
    url: 'https://github.com/better-auth/skills/tree/main/better-auth/best-practices'
  },
  {
    id: 'better-auth-create-auth',
    name: 'create-auth',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend', 'scaffolding'],
    icon: 'lock',
    tags: ['backend', 'autenticação', 'inicializador', 'oficial'],
    description: 'Monta autenticação com Better Auth em apps TypeScript ou JavaScript: detecta o framework, configura banco e rotas e adiciona OAuth.',
    url: 'https://github.com/better-auth/skills/tree/main/better-auth/create-auth'
  },
  {
    id: 'better-auth-email-password',
    name: 'emailAndPassword',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend'],
    icon: 'lock',
    tags: ['backend', 'autenticação', 'senhas', 'oficial'],
    description: 'Verificação de e-mail, redefinição de senha, política de senha e algoritmo de hash na autenticação por e-mail e senha.',
    url: 'https://github.com/better-auth/skills/tree/main/better-auth/emailAndPassword'
  },
  {
    id: 'better-auth-organization',
    name: 'organization',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend'],
    icon: 'users',
    tags: ['backend', 'multi-tenant', 'rbac', 'oficial'],
    description: 'Organizações multi-tenant: membros, convites, papéis e permissões, times e RBAC.',
    url: 'https://github.com/better-auth/skills/tree/main/better-auth/organization'
  },
  {
    id: 'better-auth-two-factor',
    name: 'twoFactor',
    author: 'Better Auth',
    repo: 'better-auth/skills',
    categories: ['backend', 'security'],
    icon: 'shield',
    tags: ['backend', 'autenticação', '2fa', 'oficial'],
    description: 'Autenticação em dois fatores: TOTP, códigos por e-mail ou SMS, códigos de recuperação e dispositivos confiáveis.',
    url: 'https://github.com/better-auth/skills/tree/main/better-auth/twoFactor'
  },
  {
    id: 'cloudflare-workers-best-practices',
    name: 'workers-best-practices',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'workers', 'serverless', 'oficial'],
    description: 'Boas práticas de Cloudflare Workers em produção: ao escrever, revisar ou configurar um Worker.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/workers-best-practices'
  },
  {
    id: 'cloudflare-workers-development',
    name: 'workers-development',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'terminal',
    tags: ['backend', 'workers', 'dev-local', 'oficial'],
    description: 'Roda, inspeciona e depura Workers em desenvolvimento local com cf dev, wrangler dev ou o plugin do Vite.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/workers-development'
  },
  {
    id: 'cloudflare-durable-objects',
    name: 'durable-objects',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'database',
    tags: ['backend', 'estado', 'coordenação', 'oficial'],
    description: 'Constrói, depura e revisa Durable Objects para estado persistente e coordenação.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/durable-objects'
  },
  {
    id: 'cloudflare-agents-sdk',
    name: 'agents-sdk',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'graph',
    tags: ['backend', 'agentes', 'oficial'],
    description: 'Constrói, depura e revisa aplicações com o Agents SDK da Cloudflare.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/agents-sdk'
  },
  {
    id: 'cloudflare-wrangler',
    name: 'wrangler',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend', 'devops'],
    icon: 'terminal',
    tags: ['backend', 'cli', 'deploy', 'oficial'],
    description: 'Roda e diagnostica comandos do Wrangler em projetos com wrangler.toml: desenvolvimento local, previews e deploy.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/wrangler'
  },
  {
    id: 'cloudflare-email-service',
    name: 'cloudflare-email-service',
    author: 'Cloudflare',
    repo: 'cloudflare/skills',
    categories: ['backend'],
    icon: 'external',
    tags: ['backend', 'e-mail', 'oficial'],
    description: 'Implementa e diagnostica o envio e o roteamento de e-mail da Cloudflare e a configuração de entrega.',
    url: 'https://github.com/cloudflare/skills/tree/main/skills/cloudflare-email-service'
  },
  {
    id: 'netlify-functions',
    name: 'netlify-functions',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'serverless', 'oficial'],
    description: 'Escreve, configura e publica funções serverless na Netlify em TypeScript, JavaScript ou Go, para endpoints e rotas de backend.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-functions'
  },
  {
    id: 'netlify-edge-functions',
    name: 'netlify-edge-functions',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend'],
    icon: 'zap',
    tags: ['backend', 'edge', 'deno', 'oficial'],
    description: 'Escreve, roteia, faz cache e depura Edge Functions da Netlify, os handlers em Deno que rodam na borda.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-edge-functions'
  },
  {
    id: 'netlify-database',
    name: 'netlify-database',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'postgres', 'oficial'],
    description: 'Postgres sem configuração para apps na Netlify: queries a partir das Functions, migrações de schema e setup.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-database'
  },
  {
    id: 'netlify-blobs',
    name: 'netlify-blobs',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend'],
    icon: 'package',
    tags: ['backend', 'armazenamento', 'oficial'],
    description: 'Guarda e lê objetos, arquivos e estado tipo cache na Netlify com @netlify/blobs.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-blobs'
  },
  {
    id: 'netlify-identity',
    name: 'netlify-identity',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend'],
    icon: 'lock',
    tags: ['backend', 'autenticação', 'oauth', 'oficial'],
    description: 'Autenticação num site Netlify: cadastro, login, OAuth com Google e GitHub e verificação no servidor.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-identity'
  },
  {
    id: 'netlify-caching',
    name: 'netlify-caching',
    author: 'Netlify',
    repo: 'netlify/context-and-tools',
    categories: ['backend', 'performance'],
    icon: 'zap',
    tags: ['backend', 'cache', 'cdn', 'oficial'],
    description: 'Cache de respostas dinâmicas e estáticas no CDN da Netlify a partir de Functions, Edge Functions e proxies.',
    url: 'https://github.com/netlify/context-and-tools/tree/main/agent-plugin/skills/netlify-caching'
  },
  {
    id: 'clickhouse-best-practices',
    name: 'clickhouse-best-practices',
    author: 'ClickHouse',
    repo: 'clickhouse/agent-skills',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'clickhouse', 'sql', 'oficial'],
    description: 'Revisão de schemas, queries e configurações de ClickHouse contra 31 regras, antes de qualquer recomendação.',
    url: 'https://github.com/clickhouse/agent-skills/tree/main/skills/clickhouse-best-practices'
  },
  {
    id: 'clickhouse-js-node-coding',
    name: 'clickhouse-js-node-coding',
    author: 'ClickHouse',
    repo: 'clickhouse/agent-skills',
    categories: ['backend', 'node'],
    icon: 'code',
    tags: ['backend', 'node', 'clickhouse', 'oficial'],
    description: 'Código de aplicação idiomático com o cliente Node.js do ClickHouse (@clickhouse/client).',
    url: 'https://github.com/clickhouse/agent-skills/tree/main/skills/clickhouse-js-node-coding'
  },
  {
    id: 'clickhouse-architecture-advisor',
    name: 'clickhouse-architecture-advisor',
    author: 'ClickHouse',
    repo: 'clickhouse/agent-skills',
    categories: ['backend', 'data'],
    icon: 'layers',
    tags: ['backend', 'clickhouse', 'arquitetura', 'oficial'],
    description: 'Desenha arquiteturas ClickHouse: escolhe padrões de ingestão e modelagem e traduz boas práticas para a carga em questão.',
    url: 'https://github.com/clickhouse/agent-skills/tree/main/skills/clickhouse-architecture-advisor'
  },
  {
    id: 'ecc-jpa-patterns',
    name: 'jpa-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'java', 'jpa', 'hibernate'],
    description: 'JPA e Hibernate no Spring Boot: entidades, relações, otimização de query, transações, índices, paginação e pool.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/jpa-patterns'
  },
  {
    id: 'ecc-mybatis-patterns',
    name: 'mybatis-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'java', 'mybatis', 'sql'],
    description: 'MyBatis: desenho de mappers, SQL em XML e anotação, SQL dinâmico seguro, transações, lotes e paginação.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/mybatis-patterns'
  },
  {
    id: 'ecc-mysql-patterns',
    name: 'mysql-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'mysql', 'mariadb'],
    description: 'MySQL e MariaDB em produção: schema, queries, índices, transações, replicação e pool de conexões.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/mysql-patterns'
  },
  {
    id: 'ecc-prisma-patterns',
    name: 'prisma-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database', 'node'],
    icon: 'database',
    tags: ['backend', 'prisma', 'typescript'],
    description: 'Prisma em backends TypeScript: schema, otimização de query, transações, paginação e as armadilhas mais comuns.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/prisma-patterns'
  },
  {
    id: 'ecc-quarkus-patterns',
    name: 'quarkus-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'java', 'quarkus'],
    description: 'Quarkus 3 LTS: mensageria com Camel, APIs REST, serviços CDI, dados com Panache e processamento assíncrono.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/quarkus-patterns'
  },
  {
    id: 'ecc-kotlin-exposed-patterns',
    name: 'kotlin-exposed-patterns',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'database'],
    icon: 'database',
    tags: ['backend', 'kotlin', 'orm'],
    description: 'ORM Exposed da JetBrains: queries em DSL, DAO, transações, pool com HikariCP e migrações com Flyway.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/kotlin-exposed-patterns'
  },
  {
    id: 'ecc-django-celery',
    name: 'django-celery',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend'],
    icon: 'refresh',
    tags: ['backend', 'python', 'filas'],
    description: 'Tarefas assíncronas com Django e Celery: configuração, agendamento com beat, retries, workflows e testes.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/django-celery'
  },
  {
    id: 'ecc-api-connector-builder',
    name: 'api-connector-builder',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'api'],
    icon: 'external',
    tags: ['backend', 'integrações', 'api'],
    description: 'Constrói um conector de API novo copiando exatamente o padrão de integração que o repositório já usa.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/api-connector-builder'
  },
  {
    id: 'ecc-contract-first',
    name: 'contract-first',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'api'],
    icon: 'shield',
    tags: ['backend', 'api', 'openapi'],
    description: 'Coordena frontend e backend por um contrato verificável (OpenAPI, AsyncAPI, Protocol Buffers ou JSON Schema).',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/contract-first'
  },
  {
    id: 'ecc-latency-critical-systems',
    name: 'latency-critical-systems',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['backend', 'performance'],
    icon: 'zap',
    tags: ['backend', 'latência', 'performance'],
    description: 'Otimiza e verifica sistemas sensíveis a latência: dashboards em tempo real, filas e caches, medindo percentis.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/latency-critical-systems'
  },
  {
    id: 'jeffallan-mcp-developer',
    name: 'mcp-developer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'server',
    tags: ['backend', 'mcp', 'integrações'],
    description: 'Constrói, depura e estende servidores e clientes MCP que ligam a IA a ferramentas e dados externos.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/mcp-developer'
  },
  {
    id: 'jeffallan-csharp-developer',
    name: 'csharp-developer',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    categories: ['backend'],
    icon: 'code',
    tags: ['backend', 'csharp', 'aspnet'],
    description: 'C# com .NET 8+: APIs REST em ASP.NET Core, minimal ou por controller, e apps Blazor.',
    url: 'https://github.com/Jeffallan/claude-skills/tree/main/skills/csharp-developer'
  },
  {
    id: 'antfu-nitro',
    name: 'nitro',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['backend', 'node'],
    icon: 'server',
    tags: ['backend', 'node', 'nitro'],
    description: 'Nitro, o toolkit de servidor que move o Nuxt: rotas, event handlers e deploy em qualquer lugar.',
    url: 'https://github.com/antfu/skills/tree/main/skills/nitro'
  },

  /* --- Git ----------------------------------------------------------------- */
  /* Subseções em CHILD_CATEGORIES.git (catalog.js). */
  {
    id: 'jkappers-conventional-commit',
    name: 'conventional-commit',
    author: 'jkappers',
    repo: 'jkappers/agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos', 'conventional-commits'],
    description: 'Padrão Conventional Commits 1.0.0 ao criar commits, escrever ou revisar mensagens de commit.',
    url: 'https://github.com/jkappers/agent-skills/tree/main/skills/conventional-commit'
  },
  {
    id: 'marcelorodrigo-conventional-commit',
    name: 'conventional-commit',
    author: 'marcelorodrigo',
    repo: 'marcelorodrigo/agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos', 'conventional-commits'],
    description: 'Mensagens de commit no padrão Conventional Commits, ao commitar ou ao formatar o histórico.',
    url: 'https://github.com/marcelorodrigo/agent-skills/tree/master/skills/conventional-commit'
  },
  {
    id: 'dmythro-git-commit',
    name: 'git-commit',
    author: 'dmythro',
    repo: 'dmythro/agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos', 'breaking-change'],
    description: 'Conventional Commits para commits e títulos de PR: tipos, escopo, breaking change e estrutura da mensagem.',
    url: 'https://github.com/dmythro/agent-skills/tree/main/skills/git-commit'
  },
  {
    id: 'fvadicamo-git-commit',
    name: 'git-commit',
    author: 'fvadicamo',
    repo: 'fvadicamo/dev-agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos'],
    description: 'Cria commits no formato Conventional Commits, com tipo, escopo e assunto.',
    url: 'https://github.com/fvadicamo/dev-agent-skills/tree/main/plugins/github-workflow/skills/git-commit'
  },
  {
    id: 'metalagman-conventional-commits',
    name: 'conventional-commits',
    author: 'metalagman',
    repo: 'metalagman/agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos', 'validação'],
    description: 'Escreve, valida ou gera mensagens de commit que seguem a especificação Conventional Commits.',
    url: 'https://github.com/metalagman/agent-skills/tree/master/conventional-commits'
  },
  {
    id: 'wesleysmits-commit-message-formatter',
    name: 'commit-message-formatter',
    author: 'wesleysmits',
    repo: 'wesleysmits/agent-skills',
    categories: ['git', 'git-commits'],
    icon: 'git-branch',
    tags: ['git', 'commits-semânticos', 'formatação'],
    description: 'Formata mensagens de commit no padrão Conventional Commits quando o pedido é commitar ou escrever a mensagem.',
    url: 'https://github.com/wesleysmits/agent-skills/tree/main/.agent/skills/commit-message-formatter'
  },
  {
    id: 'jkappers-resolve-pr-feedback',
    name: 'resolve-pr-feedback',
    author: 'jkappers',
    repo: 'jkappers/agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'eye',
    tags: ['git', 'pull-request', 'revisão'],
    description: 'Resolve as discussões abertas de revisão de um PR: avalia cada uma e corrige o que procede, com commits convencionais.',
    url: 'https://github.com/jkappers/agent-skills/tree/main/skills/resolve-pr-feedback'
  },
  {
    id: 'marcelorodrigo-create-pr',
    name: 'create-pr',
    author: 'marcelorodrigo',
    repo: 'marcelorodrigo/agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'git-branch',
    tags: ['git', 'pull-request'],
    description: 'Abre pull requests seguindo boas convenções: descrição do PR e preparação das mudanças para revisão.',
    url: 'https://github.com/marcelorodrigo/agent-skills/tree/master/skills/create-pr'
  },
  {
    id: 'dmythro-git-pr',
    name: 'git-pr',
    author: 'dmythro',
    repo: 'dmythro/agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'git-branch',
    tags: ['git', 'pull-request', 'gitlab'],
    description: 'Fluxos de PR e MR no GitHub (gh) e no GitLab (glab): criar, responder revisão, resolver threads e fazer merge, inclusive de PRs empilhados.',
    url: 'https://github.com/dmythro/agent-skills/tree/main/skills/git-pr'
  },
  {
    id: 'fvadicamo-github-pr-creation',
    name: 'github-pr-creation',
    author: 'fvadicamo',
    repo: 'fvadicamo/dev-agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'git-branch',
    tags: ['git', 'pull-request', 'github'],
    description: 'Cria pull requests no GitHub com validação automática e acompanhamento de tarefas.',
    url: 'https://github.com/fvadicamo/dev-agent-skills/tree/main/plugins/github-workflow/skills/github-pr-creation'
  },
  {
    id: 'fvadicamo-github-pr-review',
    name: 'github-pr-review',
    author: 'fvadicamo',
    repo: 'fvadicamo/dev-agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'eye',
    tags: ['git', 'pull-request', 'revisão'],
    description: 'Trata os comentários de revisão de um PR e resolve o feedback.',
    url: 'https://github.com/fvadicamo/dev-agent-skills/tree/main/plugins/github-workflow/skills/github-pr-review'
  },
  {
    id: 'fvadicamo-github-pr-merge',
    name: 'github-pr-merge',
    author: 'fvadicamo',
    repo: 'fvadicamo/dev-agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'check',
    tags: ['git', 'pull-request', 'merge'],
    description: 'Faz o merge de pull requests no GitHub depois de conferir um checklist de pré-merge.',
    url: 'https://github.com/fvadicamo/dev-agent-skills/tree/main/plugins/github-workflow/skills/github-pr-merge'
  },
  {
    id: 'antfu-create-pr',
    name: 'antfu-create-pr',
    author: 'Anthony Fu',
    repo: 'antfu/skills',
    categories: ['git', 'git-prs'],
    icon: 'git-branch',
    tags: ['git', 'pull-request', 'conventional-commits'],
    description: 'Abre um PR revisável a partir do branch atual: título em Conventional Commits, corpo baseado em evidência e telas antes e depois.',
    url: 'https://github.com/antfu/skills/tree/main/skills/antfu-create-pr'
  },
  {
    id: 'wesleysmits-pr-linter-enforcer',
    name: 'pr-linter-enforcer',
    author: 'wesleysmits',
    repo: 'wesleysmits/agent-skills',
    categories: ['git', 'git-prs'],
    icon: 'sliders',
    tags: ['git', 'lint', 'pull-request'],
    description: 'Roda ESLint, Prettier e stylelint nos arquivos alterados e sugere ou aplica as correções.',
    url: 'https://github.com/wesleysmits/agent-skills/tree/main/.agent/skills/pr-linter-enforcer'
  },
  {
    id: 'metalagman-gitflow',
    name: 'gitflow',
    author: 'metalagman',
    repo: 'metalagman/agent-skills',
    categories: ['git', 'git-branching'],
    icon: 'git-branch',
    tags: ['git', 'gitflow', 'releases'],
    description: 'Branches, releases e hotfixes no Gitflow, com as convenções de nome e as regras de sincronização.',
    url: 'https://github.com/metalagman/agent-skills/tree/master/gitflow'
  },
  {
    id: 'metalagman-github-flow',
    name: 'github-flow',
    author: 'metalagman',
    repo: 'metalagman/agent-skills',
    categories: ['git', 'git-branching'],
    icon: 'git-branch',
    tags: ['git', 'github-flow', 'entrega-contínua'],
    description: 'O modelo leve do GitHub Flow, para projetos com entrega contínua em que a main está sempre pronta para deploy.',
    url: 'https://github.com/metalagman/agent-skills/tree/master/github-flow'
  },
  {
    id: 'obra-using-git-worktrees',
    name: 'using-git-worktrees',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['git', 'git-branching'],
    icon: 'layers',
    tags: ['git', 'worktrees', 'isolamento'],
    description: 'Ao começar uma feature que precisa ficar isolada do workspace atual: garante uma worktree separada antes de executar o plano.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/using-git-worktrees'
  },
  {
    id: 'obra-finishing-a-development-branch',
    name: 'finishing-a-development-branch',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    categories: ['git', 'git-branching'],
    icon: 'check',
    tags: ['git', 'merge', 'branches'],
    description: 'Com a implementação pronta e os testes passando: decide como integrar o trabalho do branch.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch'
  },
  {
    id: 'dmythro-git-ci',
    name: 'git-ci',
    author: 'dmythro',
    repo: 'dmythro/agent-skills',
    categories: ['git', 'git-ci'],
    icon: 'refresh',
    tags: ['git', 'ci', 'github-actions'],
    description: 'Consulta o estado de CI no GitHub Actions e no GitLab CI: pipelines, jobs com falha, logs e se o merge está liberado.',
    url: 'https://github.com/dmythro/agent-skills/tree/main/skills/git-ci'
  },
  {
    id: 'ecc-github-ops',
    name: 'github-ops',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    categories: ['git', 'git-ci'],
    icon: 'git-branch',
    tags: ['git', 'github', 'releases'],
    description: 'Operações de repositório no GitHub com o gh: triagem de issues, PRs, CI/CD, releases e alertas de segurança.',
    url: 'https://github.com/affaan-m/ECC/tree/main/skills/github-ops'
  },
  {
    id: 'callstack-github-actions',
    name: 'github-actions',
    author: 'Callstack',
    repo: 'callstackincubator/agent-skills',
    categories: ['git', 'git-ci', 'mobile'],
    icon: 'refresh',
    tags: ['git', 'github-actions', 'react-native'],
    description: 'Workflows do GitHub Actions para builds de React Native em simulador iOS e emulador Android, com artefatos para baixar.',
    url: 'https://github.com/callstackincubator/agent-skills/tree/main/skills/github-actions'
  }
]);
