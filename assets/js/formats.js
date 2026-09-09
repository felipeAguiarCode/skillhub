/* ==========================================================================
   formats.js — SkillHub.formats

   Fonte única do que cada ferramenta espera. O catálogo e o Skill Builder leem
   daqui, para o conhecimento de formato não ficar espalhado.

   Referências oficiais consultadas:
   - Claude Code Skills ....... https://code.claude.com/docs/en/skills
   - Codex AGENTS.md .......... https://developers.openai.com/codex/guides/agents-md
   - Codex custom prompts ..... https://developers.openai.com/codex/custom-prompts

   Diferenças que o app precisa respeitar:
   - Claude Code: diretório com SKILL.md e ~20 campos de frontmatter opcionais.
   - Codex AGENTS.md: Markdown puro, SEM frontmatter, carregado automaticamente
     por diretório, com limite de 32 KiB (project_doc_max_bytes).
   - Codex prompt: um .md direto em ~/.codex/prompts/ (sem subdiretórios), com
     apenas `description` e `argument-hint` de frontmatter, invocado por
     /prompts:<nome>.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};

(function (SkillHub) {
  'use strict';

  /* Campos de frontmatter aceitos por cada formato, na ordem canônica de
     emissão. O que não está na lista simplesmente não é emitido. */
  var CLAUDE_KEYS = [
    'name', 'description', 'when_to_use', 'argument-hint', 'arguments',
    'disable-model-invocation', 'user-invocable', 'allowed-tools',
    'disallowed-tools', 'model', 'effort', 'context', 'agent', 'background',
    'paths', 'shell', 'hooks', 'license', 'compatibility', 'metadata'
  ];

  /* Subconjunto portátil do padrão Agent Skills (ADR-009). */
  var PORTABLE_SKILL_KEYS = [
    'name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'
  ];

  /* Codex custom prompt: a documentação lista exatamente estes dois. */
  var CODEX_PROMPT_KEYS = ['description', 'argument-hint'];

  /* --- Modelos ------------------------------------------------------------- */

  /**
   * O `model` do Claude Code é um campo de frontmatter, então a lista abaixo vira
   * valor do arquivo. Aceita os mesmos valores de `/model`, mais `inherit`.
   * Modelos de acesso restrito ficam fora de propósito.
   */
  var CLAUDE_MODELS = [
    { value: '', label: 'Padrão do ambiente (não emitir)' },
    { value: 'inherit', label: 'inherit — herda o modelo da sessão' },
    { value: 'claude-fable-5-1', label: 'Claude Fable 5.1' },
    { value: 'claude-fable-5', label: 'Claude Fable 5' },
    { value: 'claude-opus-5', label: 'Claude Opus 5' },
    { value: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
    { value: 'claude-opus-4-7', label: 'Claude Opus 4.7' },
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { value: 'claude-sonnet-5', label: 'Claude Sonnet 5' },
    { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' }
  ];

  /**
   * No Codex o modelo NÃO é campo do arquivo: nem AGENTS.md nem o prompt têm
   * frontmatter para isso. Ele vive em ~/.codex/config.toml (`model`), na flag
   * `--model`/`-m` ou no comando `/model` da sessão. Por isso a escolha aparece
   * na exportação, como configuração, e nunca entra no artefato.
   */
  var CODEX_MODELS = [
    { value: '', label: 'Não sugerir modelo' },
    { value: 'gpt-6-astra', label: 'gpt-6-astra — mais capaz' },
    { value: 'gpt-5.6-sol', label: 'gpt-5.6-sol — código e pesquisa' },
    { value: 'gpt-5.6-terra', label: 'gpt-5.6-terra — equilibrado' },
    { value: 'gpt-5.6-luna', label: 'gpt-5.6-luna — rápido e barato' },
    { value: 'gpt-5.3-codex-spark', label: 'gpt-5.3-codex-spark — preview, só texto' },
    { value: 'gpt-5.5', label: 'gpt-5.5 — geração anterior' }
  ];

  var DEFINITIONS = {
    'claude-skill': {
      id: 'claude-skill',
      tool: 'claude-code',
      toolLabel: 'Claude Code',
      label: 'Skill do Claude Code',
      short: 'Claude Skill',
      icon: 'sparkle',
      summary: 'Um diretório com SKILL.md: frontmatter YAML declarando quando usar e o que pode usar, mais instruções em Markdown.',
      entryFile: 'SKILL.md',
      /* O arquivo mora dentro de um diretório com o nome da Skill. */
      usesDirectory: true,
      frontmatter: 'yaml',
      frontmatterKeys: CLAUDE_KEYS,
      portableKeys: PORTABLE_SKILL_KEYS,
      supportsFiles: true,
      supportsTools: true,
      supportsInvocation: true,
      supportsExecution: true,
      autoLoaded: false,
      invocation: '/<nome>',
      placeholders: ['$ARGUMENTS', '$0 … $9', '$nome', '${CLAUDE_SKILL_DIR}', '${CLAUDE_PROJECT_DIR}', '${CLAUDE_SESSION_ID}', '${CLAUDE_EFFORT}'],
      /* A documentação recomenda manter o SKILL.md abaixo de 500 linhas. */
      maxLines: 500,
      docUrl: 'https://code.claude.com/docs/en/skills',
      models: CLAUDE_MODELS,
      /* O modelo é campo do arquivo neste formato. */
      modelField: 'frontmatter',
      steps: ['Básico', 'Gatilhos', 'Ferramentas', 'Instruções', 'Arquivos', 'Revisão', 'Exportar'],
      stepKeys: ['basic', 'invocation', 'execution', 'instructions', 'files', 'review', 'export']
    },

    'codex-agents': {
      id: 'codex-agents',
      tool: 'codex',
      toolLabel: 'Codex',
      label: 'AGENTS.md do Codex',
      short: 'Codex AGENTS.md',
      icon: 'book',
      summary: 'Markdown puro, sem frontmatter. O Codex carrega automaticamente, do raiz do repositório até o diretório atual, e concatena na ordem.',
      entryFile: 'AGENTS.md',
      usesDirectory: false,
      frontmatter: 'none',
      frontmatterKeys: [],
      portableKeys: [],
      supportsFiles: false,
      supportsTools: false,
      supportsInvocation: false,
      supportsExecution: false,
      /* Não se invoca: entra no contexto por estar no diretório. */
      autoLoaded: true,
      invocation: 'carregado automaticamente',
      placeholders: [],
      /* project_doc_max_bytes, 32 KiB por padrão. */
      maxBytes: 32 * 1024,
      docUrl: 'https://developers.openai.com/codex/guides/agents-md',
      models: CODEX_MODELS,
      /* AGENTS.md não carrega modelo: ele vive na configuração do Codex. */
      modelField: 'config',
      steps: ['Básico', 'Instruções', 'Revisão', 'Exportar'],
      stepKeys: ['basic', 'instructions', 'review', 'export']
    },

    'codex-prompt': {
      id: 'codex-prompt',
      tool: 'codex',
      toolLabel: 'Codex',
      label: 'Prompt do Codex',
      short: 'Codex prompt',
      icon: 'terminal',
      summary: 'Um .md direto em ~/.codex/prompts/, sem subdiretórios. Só description e argument-hint no frontmatter, invocado por /prompts:<nome>.',
      entryFile: null,
      usesDirectory: false,
      frontmatter: 'yaml',
      frontmatterKeys: CODEX_PROMPT_KEYS,
      portableKeys: CODEX_PROMPT_KEYS,
      supportsFiles: false,
      supportsTools: false,
      supportsInvocation: true,
      supportsExecution: false,
      autoLoaded: false,
      invocation: '/prompts:<nome>',
      placeholders: ['$ARGUMENTS', '$1 … $9', '$MAIUSCULO (KEY=valor)', '$$ para $ literal'],
      docUrl: 'https://developers.openai.com/codex/custom-prompts',
      models: CODEX_MODELS,
      modelField: 'config',
      steps: ['Básico', 'Gatilhos', 'Instruções', 'Revisão', 'Exportar'],
      stepKeys: ['basic', 'invocation', 'instructions', 'review', 'export']
    },

    'portable-prompt': {
      id: 'portable-prompt',
      tool: 'any',
      toolLabel: 'Claude Code e Codex',
      label: 'Prompt portátil',
      short: 'Portátil',
      icon: 'layers',
      /* description e argument-hint são válidos NOS DOIS: são dois dos campos do
         Claude Code e são exatamente os dois campos do prompt do Codex. Por isso
         um prompt limitado a eles instala nas duas ferramentas sem alteração. */
      summary: 'Usa só description e argument-hint — os dois únicos campos do prompt do Codex, e ambos válidos no Claude Code. Instala nas duas ferramentas sem alterar o arquivo.',
      entryFile: null,
      usesDirectory: false,
      frontmatter: 'yaml',
      frontmatterKeys: CODEX_PROMPT_KEYS,
      portableKeys: CODEX_PROMPT_KEYS,
      supportsFiles: false,
      supportsTools: false,
      supportsInvocation: true,
      supportsExecution: false,
      autoLoaded: false,
      invocation: '/<nome> no Claude Code · /prompts:<nome> no Codex',
      placeholders: ['$ARGUMENTS', '$1 … $9'],
      docUrl: 'https://code.claude.com/docs/en/skills',
      models: [],
      /* Nenhum dos dois campos portáteis é modelo. */
      modelField: null,
      steps: ['Básico', 'Gatilhos', 'Instruções', 'Revisão', 'Exportar'],
      stepKeys: ['basic', 'invocation', 'instructions', 'review', 'export']
    }
  };

  var ORDER = ['claude-skill', 'codex-prompt', 'codex-agents', 'portable-prompt'];

  function get(id) {
    return DEFINITIONS[id] || DEFINITIONS['claude-skill'];
  }

  function has(id) {
    return Object.prototype.hasOwnProperty.call(DEFINITIONS, id);
  }

  function all() {
    return ORDER.map(get);
  }

  /** Nome do arquivo de entrada, que em alguns formatos depende do nome. */
  function entryFileName(id, name) {
    var format = get(id);
    if (format.entryFile) return format.entryFile;
    return (name || 'meu-prompt') + '.md';
  }

  /** Onde cada formato é instalado, na linguagem da própria ferramenta. */
  function installPaths(id, name) {
    var safeName = name || 'meu-item';
    if (id === 'codex-agents') {
      return [
        { key: 'Repositório', value: 'AGENTS.md', hint: 'raiz do projeto, carregado em toda sessão' },
        { key: 'Subdiretório', value: 'services/<area>/AGENTS.md', hint: 'sobrepõe o do raiz naquela área' },
        { key: 'Global', value: '~/.codex/AGENTS.md', hint: 'vale para todos os projetos' },
        { key: 'Override', value: '~/.codex/AGENTS.override.md', hint: 'tem precedência sobre o global' }
      ];
    }
    if (id === 'codex-prompt') {
      return [
        { key: 'Pessoal', value: '~/.codex/prompts/' + safeName + '.md', hint: 'sem subdiretórios: o Codex só lê o nível de cima' }
      ];
    }
    if (id === 'portable-prompt') {
      return [
        { key: 'Claude Code', value: '.claude/skills/' + safeName + '/SKILL.md', hint: 'projeto' },
        { key: 'Claude Code', value: '~/.claude/skills/' + safeName + '/SKILL.md', hint: 'pessoal' },
        { key: 'Codex', value: '~/.codex/prompts/' + safeName + '.md', hint: 'pessoal' }
      ];
    }
    return [
      { key: 'Projeto', value: '.claude/skills/' + safeName + '/SKILL.md', hint: 'só este projeto' },
      { key: 'Pessoal', value: '~/.claude/skills/' + safeName + '/SKILL.md', hint: 'todos os seus projetos' },
      { key: 'Plugin', value: '<plugin>/skills/' + safeName + '/SKILL.md', hint: 'namespace plugin:skill' },
      { key: 'Aninhado', value: 'apps/web/.claude/skills/' + safeName + '/SKILL.md', hint: 'ativa em /apps/web:' + safeName }
    ];
  }

  /** Como o item é acionado, com o nome já aplicado. */
  function invocationLabel(id, name) {
    var safeName = name || 'meu-item';
    var format = get(id);
    return format.invocation.replace(/<nome>/g, safeName);
  }

  SkillHub.formats = {
    get: get,
    has: has,
    all: all,
    order: ORDER.slice(),
    entryFileName: entryFileName,
    installPaths: installPaths,
    invocationLabel: invocationLabel,
    CLAUDE_KEYS: CLAUDE_KEYS,
    PORTABLE_SKILL_KEYS: PORTABLE_SKILL_KEYS,
    CODEX_PROMPT_KEYS: CODEX_PROMPT_KEYS,
    CLAUDE_MODELS: CLAUDE_MODELS,
    CODEX_MODELS: CODEX_MODELS
  };
})(window.SkillHub);
