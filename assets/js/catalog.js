/* ==========================================================================
   catalog.js — SkillHub.catalog

   Índice, busca, filtros e ordenação sobre `window.SKILL_HUB_CATALOG` (ADR-004).
   Tudo client-side; nenhuma requisição de rede.
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  var items = Array.isArray(window.SKILL_HUB_CATALOG) ? window.SKILL_HUB_CATALOG : [];

  /* --- Vocabulário exibido ------------------------------------------------- */

  var CATEGORY_LABELS = {
    /* Desenvolvimento, em recortes que fazem diferença na busca */
    development: 'Desenvolvimento',
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile',
    api: 'APIs',
    architecture: 'Arquitetura',
    refactoring: 'Refatoração',
    debugging: 'Depuração',
    performance: 'Performance',
    testing: 'Testes',
    tdd: 'TDD',
    'coding-style': 'Coding style',
    /* Subseções de Coding style (ver CHILD_CATEGORIES). */
    'clean-code': 'Clean code',
    'code-review': 'Code review',
    conventions: 'Convenções',
    readability: 'Legibilidade e lint',
    commits: 'Commits e Git',
    'code-docs': 'Docs de código',
    docker: 'Docker',
    /* Subseções de Git. */
    'git-commits': 'Commits semânticos',
    'git-prs': 'Pull requests',
    'git-branching': 'Branches e fluxo',
    'git-ci': 'CI e GitHub',
    office: 'Office',
    scaffolding: 'Inicializadores',
    marketing: 'Marketing',
    copywriting: 'Copywriting',
    node: 'Node.js',
    git: 'Git e versionamento',
    /* Infra e operação */
    devops: 'DevOps',
    cloud: 'Cloud',
    database: 'Banco de dados',
    security: 'Segurança',
    automation: 'Automação',
    /* Dados e produto */
    data: 'Dados',
    analysis: 'Análise',
    product: 'Produto',
    documentation: 'Documentação',
    /* Interface e conteúdo */
    design: 'Design',
    accessibility: 'Acessibilidade',
    writing: 'Escrita',
    creativity: 'Criatividade',
    /* Trabalho e aprendizado */
    productivity: 'Produtividade',
    learning: 'Aprendizagem',
    research: 'Pesquisa',
    ai: 'IA e agentes'
  };

  var PLATFORM_LABELS = {
    claude: 'Claude Code',
    codex: 'Codex',
    any: 'Portável'
  };

  var RISK_ORDER = { low: 0, moderate: 1, elevated: 2 };

  /** Configuração editorial de cada coleção (usada pelas 4 rotas de listagem). */
  var COLLECTIONS = {
    /* Claude Code e Codex numa coleção só: quem procura uma skill procura pelo
       que ela faz, e a plataforma é um filtro dentro da página. `type` aceita
       lista por causa disto. */
    skills: {
      type: ['claude-skill', 'codex-skill'],
      /* A categoria é escolhida na pasta do menu lateral, então a página fica
         só com a busca (ver pages/listing.js). */
      folder: true,
      eyebrow: 'Claude Code · Codex',
      title: 'Skills',
      copy: 'Skills para Claude Code e Codex num lugar só. Escolha a categoria no menu ao lado.',
      searchPlaceholder: 'Buscar skills...'
    },
    'prompt-engineering': {
      type: 'prompt',
      eyebrow: 'Prompts',
      title: 'Prompt Engineering',
      copy: 'Prompts de alta qualidade para qualquer caso de uso.',
      searchPlaceholder: 'Buscar prompts...'
    },
    agents: {
      type: 'agent',
      eyebrow: 'Agentes',
      title: 'Agentes',
      copy: 'Agentes prontos para automatizar seus fluxos de trabalho.',
      searchPlaceholder: 'Buscar agentes...'
    }
  };

  /* Sem contagem de uso não existe ordenação por popularidade: o catálogo é
     estático, e qualquer número desses seria inventado. */
  var SORT_OPTIONS = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'name', label: 'Nome A–Z' },
    { value: 'risk', label: 'Menor risco' }
  ];

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] || key;
  }

  function platformLabel(key) {
    return PLATFORM_LABELS[key] || key;
  }

  function collection(routeName) {
    return COLLECTIONS[routeName] || null;
  }

  function collections() {
    return Object.keys(COLLECTIONS).map(function (route) {
      var config = COLLECTIONS[route];
      return {
        route: route,
        type: config.type,
        title: config.title,
        copy: config.copy
      };
    });
  }

  /* --- Acesso -------------------------------------------------------------- */

  function all() {
    return items.slice();
  }

  function byId(id) {
    for (var i = 0; i < items.length; i += 1) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  /** `type` é um tipo ou uma lista deles (a coleção "skills" junta dois). */
  function byType(type) {
    var wanted = [].concat(type);
    return items.filter(function (item) { return wanted.indexOf(item.type) !== -1; });
  }

  /** Texto pesquisável de uma entrada (PRD §6). Calculado uma vez por item. */
  function haystack(item) {
    if (item.__haystack) return item.__haystack;
    var tools = (item.tools && item.tools.allowed ? item.tools.allowed : [])
      .concat(item.tools && item.tools.disallowed ? item.tools.disallowed : []);
    var format = SkillHub.formats.get(item.format);
    var parts = [item.name, item.description, item.whenToUse, item.category,
      categoryLabel(item.category), item.platform, platformLabel(item.platform), item.author,
      format.label, format.short, format.toolLabel, format.entryFile]
      .concat(item.tags || [])
      .concat(item.compatibility || [])
      .concat(tools);
    item.__haystack = parts.filter(Boolean).join(' ').toLowerCase();
    return item.__haystack;
  }

  /* --- Facetas ------------------------------------------------------------- */

  function facets(type) {
    var pool = type ? byType(type) : all();
    return {
      categories: SkillHub.util.unique(pool.map(function (item) { return item.category; })).sort(),
      platforms: SkillHub.util.unique(pool.map(function (item) { return item.platform; })),
      /* Ordenado pela ordem canônica dos formatos, não pela ordem do catálogo. */
      formats: SkillHub.formats.order.filter(function (id) {
        return pool.some(function (item) { return item.format === id; });
      }),
      risks: SkillHub.util.unique(pool.map(function (item) { return item.risk; })).sort(function (a, b) {
        return (RISK_ORDER[a] || 0) - (RISK_ORDER[b] || 0);
      }),
      hasScripts: pool.some(function (item) { return item.flags && item.flags.scripts; }),
      hasShell: pool.some(function (item) { return item.flags && item.flags.shell; })
    };
  }

  /* --- Estado de filtro por rota ------------------------------------------- */

  function defaultFilters() {
    return {
      text: '',
      category: 'all',
      platform: 'all',
      format: 'all',
      risk: 'all',
      scripts: false,
      shell: false,
      sort: 'recent'
    };
  }

  var filterStates = Object.create(null);

  /**
   * O estado vive por rota e persiste durante a sessão. O input de busca é
   * espelho deste objeto — nunca o contrário — o que impede a dessincronia
   * entre campo visível e lista renderizada.
   */
  function filters(routeName) {
    if (!filterStates[routeName]) filterStates[routeName] = defaultFilters();
    return filterStates[routeName];
  }

  function resetFilters(routeName) {
    filterStates[routeName] = defaultFilters();
    return filterStates[routeName];
  }

  /** Quantos filtros estão ativos — vira o contador do botão em tablet/mobile. */
  function activeFilterCount(state) {
    var count = 0;
    if (state.category !== 'all') count += 1;
    if (state.platform !== 'all') count += 1;
    if (state.format !== 'all') count += 1;
    if (state.risk !== 'all') count += 1;
    if (state.scripts) count += 1;
    if (state.shell) count += 1;
    return count;
  }

  /* --- Query --------------------------------------------------------------- */

  function byName(a, b) {
    return a.name.localeCompare(b.name, 'pt-BR');
  }

  /* Desempate por nome mantém a ordem estável quando duas entradas têm a mesma
     data — sem isso a lista embaralha entre renders. */
  function byRecent(a, b) {
    var diff = String(b.updatedAt).localeCompare(String(a.updatedAt));
    return diff !== 0 ? diff : byName(a, b);
  }

  var SORTERS = {
    recent: byRecent,
    name: byName,
    risk: function (a, b) {
      var diff = (RISK_ORDER[a.risk] || 0) - (RISK_ORDER[b.risk] || 0);
      return diff !== 0 ? diff : byRecent(a, b);
    }
  };

  function query(type, state) {
    var filterState = state || defaultFilters();
    var needle = String(filterState.text || '').trim().toLowerCase();
    var pool = type ? byType(type) : all();

    var result = pool.filter(function (item) {
      if (needle && haystack(item).indexOf(needle) === -1) return false;
      if (filterState.category !== 'all' && item.category !== filterState.category) return false;
      if (filterState.platform !== 'all' && item.platform !== filterState.platform) return false;
      if (filterState.format !== 'all' && item.format !== filterState.format) return false;
      if (filterState.risk !== 'all' && item.risk !== filterState.risk) return false;
      if (filterState.scripts && !(item.flags && item.flags.scripts)) return false;
      if (filterState.shell && !(item.flags && item.flags.shell)) return false;
      return true;
    });

    var sorter = SORTERS[filterState.sort] || SORTERS.recent;
    return result.sort(sorter);
  }

  /** Busca global usada pela Home: varre o catálogo inteiro. */
  function search(text, limit) {
    var needle = String(text || '').trim().toLowerCase();
    if (!needle) return [];
    var found = all().filter(function (item) {
      return haystack(item).indexOf(needle) !== -1;
    }).sort(byRecent);
    return limit ? found.slice(0, limit) : found;
  }

  /** Destaque é curadoria declarada no dado (`featured: true`), não métrica. */
  function featured(limit) {
    return all().filter(function (item) {
      return item.featured === true;
    }).sort(byRecent).slice(0, limit || 4);
  }

  /**
   * Atualizados mais recentemente. Sem uso medido, não há "tendência".
   *
   * `skipIds` existe porque a Home mostra destaque e recentes um sob o outro:
   * como os destaques também são recentes, sem isso as duas listas repetiriam
   * as mesmas entradas.
   */
  function recent(limit, skipIds) {
    var skip = {};
    (skipIds || []).forEach(function (id) { skip[id] = true; });
    return all().filter(function (item) {
      return !skip[item.id];
    }).sort(byRecent).slice(0, limit || 4);
  }

  /* --- Skills do mercado ---------------------------------------------------- */

  /* Skills de terceiros que entram na página de Skills, na categoria a que
     pertencem (data/market-skills.js). Não são itens do catálogo — sem content,
     format nem risk — então têm consulta própria, e a linha abre o link oficial. */
  var market = Array.isArray(window.SKILL_HUB_MARKET) ? window.SKILL_HUB_MARKET : [];

  /** As do mercado numa categoria ('all' para todas), filtradas pelo texto. */
  function marketSkills(category, text) {
    var needle = String(text || '').trim().toLowerCase();
    return market.filter(function (entry) {
      if (category && category !== 'all' && (entry.categories || []).indexOf(category) === -1) return false;
      if (!needle) return true;
      return [entry.name, entry.author, entry.repo, entry.description, (entry.tags || []).join(' ')]
        .join(' ').toLowerCase().indexOf(needle) !== -1;
    });
  }

  /**
   * A árvore da pasta de skills no menu lateral, no padrão do angular.dev:
   * grupos com título, e uma categoria pode ter subseções. A ordem aqui é a
   * ordem no menu. Categoria que existe nos dados e não está em grupo nenhum vai
   * para "Outras" — nada some do menu por esquecimento.
   */
  var FOLDER_GROUPS = [
    { title: 'Engenharia', keys: ['development', 'tdd', 'testing', 'debugging', 'refactoring', 'coding-style', 'performance', 'architecture', 'git', 'documentation', 'accessibility'] },
    { title: 'Stacks', keys: ['frontend', 'backend', 'node', 'mobile', 'api', 'database', 'data'] },
    { title: 'Infra e operação', keys: ['docker', 'devops', 'cloud', 'automation', 'security', 'scaffolding'] },
    { title: 'Produto e negócio', keys: ['marketing', 'copywriting', 'office'] }
  ];
  var CHILD_CATEGORIES = {
    'coding-style': ['clean-code', 'code-review', 'conventions', 'readability', 'commits', 'code-docs'],
    git: ['git-commits', 'git-prs', 'git-branching', 'git-ci']
  };

  /** Subseções de uma categoria que têm ao menos um item. */
  function childCategories(key, type) {
    var present = folderCategories(type || COLLECTIONS.skills.type);
    return (CHILD_CATEGORIES[key] || []).filter(function (child) {
      return present.indexOf(child) !== -1;
    }).map(function (child) {
      return { key: child, label: categoryLabel(child) };
    });
  }

  function folderTree(type) {
    var present = folderCategories(type);
    var placed = Object.create(null);
    Object.keys(CHILD_CATEGORIES).forEach(function (parent) {
      CHILD_CATEGORIES[parent].forEach(function (child) { placed[child] = true; });
    });
    var groups = FOLDER_GROUPS.map(function (group) {
      return {
        title: group.title,
        items: group.keys.filter(function (key) { return present.indexOf(key) !== -1; }).map(function (key) {
          placed[key] = true;
          return { key: key, label: categoryLabel(key), children: childCategories(key, type) };
        })
      };
    }).filter(function (group) { return group.items.length; });
    var rest = present.filter(function (key) { return !placed[key]; });
    if (rest.length) {
      groups.push({ title: 'Outras', items: rest.map(function (key) {
        return { key: key, label: categoryLabel(key), children: [] };
      }) });
    }
    return groups;
  }

  /**
   * Categorias da pasta de skills: as do catálogo MAIS as que só existem no
   * mercado (TDD, Node.js), em ordem de rótulo. É a lista do menu lateral e a
   * que valida a categoria da URL.
   */
  function folderCategories(type) {
    var keys = facets(type).categories.slice();
    market.forEach(function (entry) {
      (entry.categories || []).forEach(function (key) {
        if (keys.indexOf(key) === -1) keys.push(key);
      });
    });
    return keys.sort(function (a, b) { return categoryLabel(a).localeCompare(categoryLabel(b)); });
  }

  /* --- Favoritos ----------------------------------------------------------- */

  function favorites() {
    var stored = SkillHub.store.read(SkillHub.store.KEYS.favorites, []);
    return Array.isArray(stored) ? stored : [];
  }

  function isFavorite(id) {
    return favorites().indexOf(id) !== -1;
  }

  function toggleFavorite(id) {
    var list = favorites();
    var index = list.indexOf(id);
    if (index === -1) list.push(id);
    else list.splice(index, 1);
    SkillHub.store.write(SkillHub.store.KEYS.favorites, list);
    return index === -1;
  }

  SkillHub.catalog = {
    SORT_OPTIONS: SORT_OPTIONS,
    all: all,
    byId: byId,
    byType: byType,
    facets: facets,
    filters: filters,
    resetFilters: resetFilters,
    activeFilterCount: activeFilterCount,
    query: query,
    search: search,
    featured: featured,
    recent: recent,
    marketSkills: marketSkills,
    folderCategories: folderCategories,
    folderTree: folderTree,
    childCategories: childCategories,
    collection: collection,
    collections: collections,
    categoryLabel: categoryLabel,
    platformLabel: platformLabel,
    favorites: favorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite
  };
})(window.SkillHub);
