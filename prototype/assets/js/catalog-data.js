window.TOKO_CATALOG = [
  {
    id: 'api-reviewer', type: 'claude-skill', icon: '⌁', name: 'API Reviewer',
    description: 'Revisa mudanças de API contra convenções, contratos e breaking changes.',
    category: 'Development', tags: ['api','review','architecture'], compatibility: ['Claude Code'],
    risk: 'low', tools: ['Read','Grep'], popularity: 9400,
    skillMarkdown: '---\nname: api-reviewer\ndescription: "Review API changes against project conventions. Use before shipping endpoint changes."\nallowed-tools:\n  - Read\n  - Grep\n---\n\n# Goal\nReview API changes and report concrete risks.\n'
  },
  {
    id: 'excel-analyst', type: 'claude-skill', icon: '▦', name: 'Excel Analyst',
    description: 'Analisa bases tabulares e orienta limpeza, exploração e validação.',
    category: 'Data', tags: ['excel','data','analysis'], compatibility: ['Claude Code'],
    risk: 'low', tools: ['Read'], popularity: 12400,
    skillMarkdown: '---\nname: excel-analyst\ndescription: "Analyze spreadsheet-style datasets and propose a reliable workflow."\nallowed-tools:\n  - Read\n---\n\nInspect the available data before making claims.\n'
  },
  {
    id: 'release-assistant', type: 'claude-skill', icon: '↗', name: 'Release Assistant',
    description: 'Prepara checklist, changelog e comandos de release com revisão explícita.',
    category: 'DevOps', tags: ['release','git','devops'], compatibility: ['Claude Code'],
    risk: 'moderate', tools: ['Read','Bash(git status *)'], popularity: 7100,
    skillMarkdown: '---\nname: release-assistant\ndescription: "Prepare release notes and verify repository state."\nallowed-tools:\n  - Read\n  - "Bash(git status *)"\n---\n\nReview the release state. Never publish without explicit user approval.\n'
  },
  {
    id: 'fullstack-scaffolder', type: 'codex-skill', icon: '◇', name: 'Fullstack Scaffolder',
    description: 'Estrutura projetos fullstack com convenções simples e previsíveis.',
    category: 'Development', tags: ['scaffold','fullstack','architecture'], compatibility: ['Codex'],
    risk: 'moderate', tools: ['filesystem'], popularity: 14100
  },
  {
    id: 'test-generator', type: 'codex-skill', icon: '▣', name: 'Test Generator',
    description: 'Gera casos de teste a partir do comportamento esperado e do código existente.',
    category: 'Testing', tags: ['tests','quality'], compatibility: ['Codex'], risk: 'low', tools: [], popularity: 10100
  },
  {
    id: 'docker-setup', type: 'codex-skill', icon: '◫', name: 'Docker Setup',
    description: 'Orienta Dockerfile e compose com foco em imagens pequenas e previsíveis.',
    category: 'DevOps', tags: ['docker','containers'], compatibility: ['Codex'], risk: 'moderate', tools: [], popularity: 7600
  },
  {
    id: 'prd-prompt', type: 'prompt', icon: '✳', name: 'Product Requirements (PRD)',
    description: 'Prompt estruturado para transformar uma ideia em requisitos de produto.',
    category: 'Product', tags: ['prd','product','planning'], compatibility: ['Claude','Codex'], risk: 'low', tools: [], popularity: 18400
  },
  {
    id: 'code-explainer', type: 'prompt', icon: '▤', name: 'Code Explanation',
    description: 'Explica código em camadas, partindo do objetivo até os detalhes.',
    category: 'Learning', tags: ['code','learning'], compatibility: ['Claude','Codex'], risk: 'low', tools: [], popularity: 16700
  },
  {
    id: 'research-agent', type: 'agent', icon: '⌘', name: 'Research Agent',
    description: 'Workflow de pesquisa com coleta, comparação e síntese de fontes.',
    category: 'Research', tags: ['research','analysis'], compatibility: ['Claude','Codex'], risk: 'moderate', tools: ['web'], popularity: 15600
  },
  {
    id: 'devops-agent', type: 'agent', icon: '△', name: 'DevOps Agent',
    description: 'Agente para revisar infraestrutura, deploy e observabilidade.',
    category: 'DevOps', tags: ['devops','deployment'], compatibility: ['Claude','Codex'], risk: 'elevated', tools: ['shell'], popularity: 8400
  }
];
