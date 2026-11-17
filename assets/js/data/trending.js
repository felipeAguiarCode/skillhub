/* ==========================================================================
   data/trending.js — window.SKILL_HUB_TRENDING

   Skills de terceiros que circulam no mercado, para a página #/trending.
   NÃO são entradas do catálogo: o Skill Hub não hospeda o conteúdo delas, só
   aponta para o repositório oficial. Por isso moram num global próprio e não
   têm `content`, `format` nem `risk` — quem quiser inspecionar lê na origem.

   Regras desta lista:
   - toda entrada tem `url`, e a URL foi aberta e respondeu 200 antes de entrar
     (conferido em 2026-11-17). Nunca uma URL deduzida do nome;
   - `description` diz o que a skill faz, com base no README ou na descrição do
     repositório. Nada de número de estrela ou de instalação: o app não mede
     uso, e os rankings públicos discordam entre si e envelhecem;
   - a seleção é curadoria. "Popular" aqui quer dizer "aparece de forma
     recorrente em rankings e listas da comunidade", não uma medição nossa.

   Toda entrada tem `tags` (minúsculas, sem espaço): são o segundo eixo de
   filtro da página, ao lado da especialidade. "oficial" quer dizer publicada
   pela própria empresa dona da ferramenta ou do framework, não um selo nosso.

   `category` tem de existir em CATEGORIES (pages/trending.js) e `icon` em
   icons.js — chave inexistente renderiza o ícone de fallback, sem erro.
   ========================================================================== */

window.SKILL_HUB_TRENDING = (window.SKILL_HUB_TRENDING || []).concat([
  /* --- Disciplina de engenharia ------------------------------------------- */
  {
    id: 'ub-mode',
    name: 'ub-mode',
    author: 'Robert C. Martin (Uncle Bob)',
    repo: 'unclebob/ub-mode',
    category: 'engineering',
    icon: 'shield',
    tags: ['clean-code', 'tdd', 'disciplina'],
    description: 'Faz o agente seguir "primeiro funcione, depois fique certo": TDD, causa raiz e commits pequenos, com limites de complexidade e duplicação.',
    url: 'https://github.com/unclebob/ub-mode'
  },
  {
    id: 'superpowers',
    name: 'Superpowers',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'engineering',
    icon: 'zap',
    tags: ['metodologia', 'tdd', 'planejamento'],
    description: 'Framework de skills e metodologia de desenvolvimento para agentes: planejar, testar primeiro, depurar com método e revisar.',
    url: 'https://github.com/obra/superpowers'
  },
  {
    id: 'test-driven-development',
    name: 'test-driven-development',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'engineering',
    icon: 'flask',
    tags: ['tdd', 'testes', 'disciplina'],
    description: 'Conduz a implementação por teste: escreve o teste que falha antes de escrever o código que o faz passar.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/test-driven-development'
  },
  {
    id: 'systematic-debugging',
    name: 'systematic-debugging',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'engineering',
    icon: 'bug',
    tags: ['debug', 'causa-raiz', 'disciplina'],
    description: 'Depuração com método: investiga a causa antes de propor correção, em vez de tentativa e erro.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/systematic-debugging'
  },
  {
    id: 'clean-code-skill',
    name: 'clean-code-skill',
    author: 'jonax1337',
    repo: 'jonax1337/clean-code-skill',
    category: 'engineering',
    icon: 'code',
    tags: ['clean-code', 'refatoração'],
    description: 'Clean Code, de Robert C. Martin, reescrito para agentes, com regras de precedência e suíte de avaliação. Projeto da comunidade, não do autor do livro.',
    url: 'https://github.com/jonax1337/clean-code-skill'
  },
  {
    id: 'mattpocock-skills',
    name: 'Skills for Real Engineers',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    category: 'engineering',
    icon: 'terminal',
    tags: ['workflow', 'engenharia', 'coleção'],
    description: 'As skills de engenharia que Matt Pocock usa no dia a dia, publicadas direto do diretório de agentes dele.',
    url: 'https://github.com/mattpocock/skills'
  },
  {
    id: 'addyosmani-agent-skills',
    name: 'agent-skills',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    category: 'engineering',
    icon: 'layers',
    tags: ['workflow', 'engenharia', 'coleção'],
    description: 'Skills de engenharia de nível de produção para agentes de código, cobrindo o ciclo de desenvolvimento.',
    url: 'https://github.com/addyosmani/agent-skills'
  },

  /* --- Planejamento -------------------------------------------------------- */
  {
    id: 'brainstorming',
    name: 'brainstorming',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'planning',
    icon: 'sparkle',
    tags: ['planejamento', 'design'],
    description: 'Transforma uma ideia vaga em desenho acordado, por perguntas, antes de qualquer código.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/brainstorming'
  },
  {
    id: 'writing-plans',
    name: 'writing-plans',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'planning',
    icon: 'doc',
    tags: ['planejamento', 'documentação'],
    description: 'Escreve o plano de implementação em passos pequenos e verificáveis, para outro agente executar.',
    url: 'https://github.com/obra/superpowers/tree/main/skills/writing-plans'
  },

  /* --- Frontend e design --------------------------------------------------- */
  {
    id: 'frontend-design',
    name: 'frontend-design',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'frontend',
    icon: 'pen',
    tags: ['ui', 'design', 'oficial'],
    description: 'Orienta o agente a produzir interface com direção visual própria, em vez do visual genérico de IA.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/frontend-design'
  },
  {
    id: 'react-best-practices',
    name: 'react-best-practices',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    category: 'frontend',
    icon: 'hexagon',
    tags: ['react', 'nextjs', 'oficial'],
    description: 'Boas práticas de React e Next.js da Vercel, para escrever e revisar componentes.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices'
  },
  {
    id: 'web-design-guidelines',
    name: 'web-design-guidelines',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    category: 'frontend',
    icon: 'eye',
    tags: ['ui', 'revisão', 'oficial'],
    description: 'Revisa uma interface contra as diretrizes de design web da Vercel.',
    url: 'https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines'
  },

  /* --- Testes e navegador -------------------------------------------------- */
  {
    id: 'webapp-testing',
    name: 'webapp-testing',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'testing',
    icon: 'flask',
    tags: ['testes', 'navegador', 'playwright', 'oficial'],
    description: 'Testa uma aplicação web local dirigindo um navegador de verdade.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/webapp-testing'
  },
  {
    id: 'agent-browser',
    name: 'agent-browser',
    author: 'Vercel',
    repo: 'vercel-labs/agent-browser',
    category: 'testing',
    icon: 'panel',
    tags: ['navegador', 'automação', 'cli'],
    description: 'CLI de automação de navegador feita para agentes de IA.',
    url: 'https://github.com/vercel-labs/agent-browser'
  },

  /* --- Documentos ---------------------------------------------------------- */
  {
    id: 'pdf',
    name: 'pdf',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'documents',
    icon: 'file',
    tags: ['documentos', 'pdf', 'oficial'],
    description: 'Lê, cria, combina e preenche arquivos PDF.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pdf'
  },
  {
    id: 'docx',
    name: 'docx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'documents',
    icon: 'doc',
    tags: ['documentos', 'word', 'oficial'],
    description: 'Cria e edita documentos do Word.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/docx'
  },
  {
    id: 'pptx',
    name: 'pptx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'documents',
    icon: 'chart',
    tags: ['documentos', 'powerpoint', 'oficial'],
    description: 'Cria e edita apresentações do PowerPoint.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/pptx'
  },
  {
    id: 'xlsx',
    name: 'xlsx',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'documents',
    icon: 'table',
    tags: ['documentos', 'excel', 'oficial'],
    description: 'Cria, lê e edita planilhas do Excel.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/xlsx'
  },

  /* --- Criar e descobrir skills -------------------------------------------- */
  {
    id: 'skill-creator',
    name: 'skill-creator',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'meta',
    icon: 'wand',
    tags: ['skills', 'avaliação', 'oficial'],
    description: 'Guia a criação de uma Skill nova, do rascunho à avaliação.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/skill-creator'
  },
  {
    id: 'mcp-builder',
    name: 'mcp-builder',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'meta',
    icon: 'server',
    tags: ['mcp', 'integração', 'oficial'],
    description: 'Guia a construção de um servidor MCP para ligar o agente a serviços externos.',
    url: 'https://github.com/anthropics/skills/tree/main/skills/mcp-builder'
  },
  {
    id: 'find-skills',
    name: 'find-skills',
    author: 'Vercel',
    repo: 'vercel-labs/skills',
    category: 'meta',
    icon: 'search',
    tags: ['skills', 'descoberta', 'cli'],
    description: 'Ajuda o agente a encontrar e instalar skills pelo `npx skills`.',
    url: 'https://github.com/vercel-labs/skills/tree/main/skills/find-skills'
  },

  /* --- Coleções e diretórios ----------------------------------------------- */
  {
    id: 'anthropics-skills',
    name: 'anthropics/skills',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    category: 'collections',
    icon: 'package',
    tags: ['coleção', 'oficial'],
    description: 'O repositório público de Agent Skills da Anthropic.',
    url: 'https://github.com/anthropics/skills'
  },
  {
    id: 'vercel-agent-skills',
    name: 'vercel-labs/agent-skills',
    author: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    category: 'collections',
    icon: 'package',
    tags: ['coleção', 'oficial'],
    description: 'A coleção oficial de skills para agentes da Vercel.',
    url: 'https://github.com/vercel-labs/agent-skills'
  },
  {
    id: 'ecc',
    name: 'ECC',
    author: 'affaan-m',
    repo: 'affaan-m/ECC',
    category: 'collections',
    icon: 'rocket',
    tags: ['coleção', 'workflow'],
    description: 'Skills, memória, segurança e fluxo de pesquisa para Claude Code, Codex e outros agentes.',
    url: 'https://github.com/affaan-m/ECC'
  },
  {
    id: 'awesome-claude-skills',
    name: 'awesome-claude-skills',
    author: 'ComposioHQ',
    repo: 'ComposioHQ/awesome-claude-skills',
    category: 'collections',
    icon: 'book',
    tags: ['coleção', 'lista'],
    description: 'Lista curada de Claude Skills, recursos e ferramentas.',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills'
  },
  {
    id: 'awesome-agent-skills',
    name: 'awesome-agent-skills',
    author: 'VoltAgent',
    repo: 'VoltAgent/awesome-agent-skills',
    category: 'collections',
    icon: 'book',
    tags: ['coleção', 'lista'],
    description: 'Coleção curada de skills de times oficiais e da comunidade, para Claude Code, Codex e outros.',
    url: 'https://github.com/VoltAgent/awesome-agent-skills'
  },
  {
    id: 'skills-sh',
    name: 'skills.sh',
    author: 'Vercel',
    repo: 'skills.sh',
    category: 'collections',
    icon: 'graph',
    tags: ['diretório', 'descoberta'],
    description: 'Diretório para descobrir e instalar skills de agentes, com ranking público de instalações.',
    url: 'https://www.skills.sh/'
  }
]);
