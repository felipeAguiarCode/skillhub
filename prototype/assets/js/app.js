(function () {
  'use strict';

  var catalog = Array.isArray(window.TOKO_CATALOG) ? window.TOKO_CATALOG : [];
  var app = document.getElementById('app');
  var nav = document.getElementById('main-nav');
  var globalSearch = document.getElementById('global-search');
  var toast = document.getElementById('toast');
  var toastTimer;
  var activeQuery = '';
  var activeCategory = 'All';
  var activeSort = 'popular';

  var builderDefaults = {
    step: 1,
    profile: 'claude-code-project',
    directoryName: 'api-reviewer',
    displayName: 'api-reviewer',
    description: 'Review API changes against project conventions. Use before shipping endpoint changes.',
    category: 'Development',
    whenToUse: '',
    argumentHint: '',
    arguments: '',
    autoInvoke: true,
    userInvocable: true,
    allowedTools: 'Read, Grep',
    context: '',
    shell: 'bash',
    body: '# Goal\n\nReview API changes for consistency, correctness, and maintainability.\n\n## Workflow\n\n1. Read the relevant files.\n2. Identify concrete risks.\n3. Report findings by severity.\n',
    extraFilePath: '',
    extraFileContent: ''
  };

  var builderState = loadBuilderDraft();

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadBuilderDraft() {
    try {
      var raw = localStorage.getItem('toko.builder.draft.v1');
      if (!raw) return clone(builderDefaults);
      var parsed = JSON.parse(raw);
      return Object.assign(clone(builderDefaults), parsed || {});
    } catch (error) {
      return clone(builderDefaults);
    }
  }

  function saveBuilderDraft() {
    try {
      localStorage.setItem('toko.builder.draft.v1', JSON.stringify(builderState));
    } catch (error) {
      // Prototype: storage failure should not block the UI.
    }
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function routeInfo() {
    var hash = location.hash || '#/home';
    var path = hash.replace(/^#\/?/, '');
    var parts = path.split('/').filter(Boolean);
    return { name: parts[0] || 'home', id: parts[1] || '' };
  }

  function updateNav(route) {
    nav.querySelectorAll('a').forEach(function (link) {
      var active = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function badge(label, extraClass) {
    return '<span class="badge ' + (extraClass || '') + '">' + escapeHtml(label) + '</span>';
  }

  function riskBadge(risk) {
    var cls = risk === 'elevated' ? 'badge--elevated' : risk === 'moderate' ? 'badge--moderate' : 'badge--low';
    var text = risk === 'elevated' ? 'Risco elevado' : risk === 'moderate' ? 'Risco moderado' : 'Baixo risco';
    return badge(text, cls);
  }

  function formatPopularity(value) {
    if (value >= 1000) return (value / 1000).toFixed(value >= 10000 ? 1 : 1).replace('.0', '') + 'k';
    return String(value || 0);
  }

  function skillCard(item) {
    var meta = [];
    (item.compatibility || []).slice(0, 2).forEach(function (x) { meta.push(badge(x)); });
    meta.push(badge(item.category));
    meta.push(riskBadge(item.risk));
    return '' +
      '<article class="skill-card">' +
        '<div class="skill-card__icon" aria-hidden="true">' + escapeHtml(item.icon || '✦') + '</div>' +
        '<div>' +
          '<h3>' + escapeHtml(item.name) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
          '<div class="skill-card__meta">' + meta.join('') + badge(formatPopularity(item.popularity) + ' usos') + '</div>' +
        '</div>' +
        '<a class="btn btn--primary" href="#/skill/' + encodeURIComponent(item.id) + '">Ver</a>' +
      '</article>';
  }

  function pageHeader(eyebrow, title, copy) {
    return '<div class="page-header"><div><div class="eyebrow">' + escapeHtml(eyebrow) + '</div><h1 class="page-title">' + title + '</h1><p class="page-copy">' + escapeHtml(copy) + '</p></div></div>';
  }

  function renderHome() {
    activeQuery = '';
    activeCategory = 'All';
    globalSearch.value = '';
    var featured = catalog.slice().sort(function (a, b) { return b.popularity - a.popularity; }).slice(0, 4);
    app.innerHTML = '' +
      '<section class="hero">' +
        '<div class="hero__content">' +
          '<div class="eyebrow">FREE · OPEN · NO LOGIN</div>' +
          '<h1 class="hero__title">Skills for a more <em>capable you.</em></h1>' +
          '<p class="hero__copy">Descubra, inspecione e crie Skills para Claude Code e Codex, além de prompts e agentes. Tudo em uma experiência estática e direta.</p>' +
          '<a class="btn btn--primary" href="#/claude-skills">Explorar Skills →</a>' +
        '</div>' +
        '<div class="hero__art" aria-hidden="true"><div class="hero__orb"></div><div class="hero__note">Build.<br>Share.<br>Improve.</div></div>' +
      '</section>' +
      '<section class="section">' +
        '<div class="section__head"><h2>Explore por categoria</h2></div>' +
        '<div class="category-grid">' +
          categoryCard('✳','Claude Skills','Skills nativas e workflows para Claude Code.','#/claude-skills',false) +
          categoryCard('◇','Codex Skills','Recursos para acelerar desenvolvimento com Codex.','#/codex-skills',true) +
          categoryCard('▤','Prompt Engineering','Prompts estruturados e reutilizáveis.','#/prompt-engineering',false) +
          categoryCard('⌘','Agentes','Workflows mais autônomos e compostos.','#/agents',false) +
        '</div>' +
      '</section>' +
      '<section class="section">' +
        '<div class="section__head"><h2>Em destaque</h2><a href="#/claude-skills">Ver todos →</a></div>' +
        '<div class="catalog">' + featured.map(skillCard).join('') + '</div>' +
      '</section>';
  }

  function categoryCard(icon, title, copy, href, paper) {
    return '<a class="category-card ' + (paper ? 'category-card--paper' : '') + '" href="' + href + '"><div class="category-card__icon">' + icon + '</div><div><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(copy) + '</p></div></a>';
  }

  var routeCatalogMap = {
    'claude-skills': { type: 'claude-skill', eyebrow: 'CLAUDE CODE', title: 'Claude Skills', copy: 'Descubra Skills reutilizáveis para projetos, automações e padrões no Claude Code.' },
    'codex-skills': { type: 'codex-skill', eyebrow: 'CODEX', title: 'Codex Skills', copy: 'Recursos focados em acelerar desenvolvimento, testes, scaffolding e produtividade com Codex.' },
    'prompt-engineering': { type: 'prompt', eyebrow: 'PROMPTS', title: 'Prompt Engineering', copy: 'Prompts reutilizáveis para produto, escrita, análise, código e aprendizagem.' },
    'agents': { type: 'agent', eyebrow: 'AGENTS', title: 'Agentes', copy: 'Workflows compostos para tarefas que exigem pesquisa, execução e coordenação.' }
  };

  function renderCatalogPage(route) {
    var config = routeCatalogMap[route];
    var items = catalog.filter(function (item) { return item.type === config.type; });
    var categories = ['All'].concat(Array.from(new Set(items.map(function (x) { return x.category; }))));
    app.innerHTML = pageHeader(config.eyebrow, escapeHtml(config.title), config.copy) +
      '<div class="toolbar">' +
        '<div class="search-box"><span aria-hidden="true">⌕</span><input id="catalog-search" placeholder="Buscar nesta coleção..." value="' + escapeHtml(activeQuery) + '"></div>' +
        '<select id="catalog-sort" class="select" aria-label="Ordenação"><option value="popular">Mais populares</option><option value="name">Nome A–Z</option><option value="risk">Menor risco</option></select>' +
      '</div>' +
      '<div class="chips" id="catalog-chips">' + categories.map(function (category) {
        return '<button class="chip ' + (category === activeCategory ? 'is-active' : '') + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category === 'All' ? 'Todos' : category) + '</button>';
      }).join('') + '</div>' +
      '<div class="catalog" id="catalog-list"></div>';

    var sort = document.getElementById('catalog-sort');
    sort.value = activeSort;
    document.getElementById('catalog-search').addEventListener('input', function (event) {
      activeQuery = event.target.value;
      renderCatalogList(route);
    });
    sort.addEventListener('change', function (event) {
      activeSort = event.target.value;
      renderCatalogList(route);
    });
    document.getElementById('catalog-chips').addEventListener('click', function (event) {
      var button = event.target.closest('[data-category]');
      if (!button) return;
      activeCategory = button.getAttribute('data-category');
      document.querySelectorAll('[data-category]').forEach(function (node) { node.classList.toggle('is-active', node === button); });
      renderCatalogList(route);
    });
    renderCatalogList(route);
  }

  function renderCatalogList(route) {
    var config = routeCatalogMap[route];
    var list = document.getElementById('catalog-list');
    if (!list) return;
    var q = activeQuery.trim().toLowerCase();
    var items = catalog.filter(function (item) {
      if (item.type !== config.type) return false;
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (!q) return true;
      var haystack = [item.name, item.description, item.category].concat(item.tags || []).concat(item.compatibility || []).join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
    if (activeSort === 'name') items.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (activeSort === 'risk') items.sort(function (a, b) { return riskValue(a.risk) - riskValue(b.risk); });
    else items.sort(function (a, b) { return b.popularity - a.popularity; });
    list.innerHTML = items.length ? items.map(skillCard).join('') : '<div class="empty">Nenhum resultado para os filtros atuais.</div>';
  }

  function riskValue(value) {
    return value === 'elevated' ? 3 : value === 'moderate' ? 2 : 1;
  }

  function renderSkillDetail(id) {
    var item = catalog.find(function (x) { return x.id === id; });
    if (!item) {
      app.innerHTML = pageHeader('404', 'Skill não encontrada', 'O item solicitado não existe no catálogo local.') + '<a class="btn btn--primary" href="#/home">Voltar para Home</a>';
      return;
    }
    var markdown = item.skillMarkdown || '# ' + item.name + '\n\n' + item.description + '\n';
    var tree = item.type === 'claude-skill' ? item.id + '/\n└── SKILL.md' : item.id + '/\n└── README.md';
    app.innerHTML = pageHeader(item.type.replace('-', ' ').toUpperCase(), escapeHtml(item.name), item.description) +
      '<div class="detail-grid">' +
        '<div class="code-box"><div class="code-box__top"><span>' + (item.type === 'claude-skill' ? 'SKILL.md' : 'Preview') + '</span><button class="btn btn--ghost" id="copy-skill">Copiar</button></div><pre id="detail-code"></pre></div>' +
        '<aside class="detail-aside">' +
          '<div class="meta-card"><h3>Compatibilidade</h3><div class="skill-card__meta">' + (item.compatibility || []).map(function (x) { return badge(x); }).join('') + '</div></div>' +
          '<div class="meta-card"><h3>Permissões / ferramentas</h3><div class="skill-card__meta">' + ((item.tools || []).length ? item.tools.map(function (x) { return badge(x, /bash|shell|powershell/i.test(x) ? 'badge--moderate' : ''); }).join('') : badge('Nenhuma declarada')) + '</div></div>' +
          '<div class="meta-card"><h3>Risco aparente</h3><div>' + riskBadge(item.risk) + '</div><p style="color:var(--muted);font-size:11px;margin:10px 0 0">O marketplace apenas inspeciona texto e nunca executa a Skill.</p></div>' +
          '<div class="meta-card"><h3>Arquivos</h3><div class="preview-tree">' + escapeHtml(tree) + '</div></div>' +
        '</aside>' +
      '</div>';
    document.getElementById('detail-code').textContent = markdown;
    document.getElementById('copy-skill').addEventListener('click', function () { copyText(markdown, 'Conteúdo copiado.'); });
  }

  function renderBuilder() {
    app.innerHTML = '' +
      '<div class="builder-head">' +
        '<div class="eyebrow">CLAUDE CODE · SKILL BUILDER</div>' +
        '<h1 class="page-title">Create a Claude Code Skill</h1>' +
        '<p class="page-copy">Um wizard para gerar, revisar e exportar uma Skill sem editar YAML manualmente.</p>' +
      '</div>' +
      renderStepper() +
      '<div class="builder-layout">' +
        '<section class="panel" id="builder-form"></section>' +
        '<aside class="panel">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div><h3 style="margin-bottom:4px">Live preview</h3><p class="panel__copy">Gerado a partir do estado do wizard.</p></div><button class="btn btn--ghost" id="copy-builder">Copiar</button></div>' +
          '<div class="preview-tree" id="builder-tree"></div>' +
          '<div class="code-box"><div class="code-box__top"><span>SKILL.md</span><span id="builder-portability"></span></div><pre id="builder-code"></pre></div>' +
          '<div class="validation" id="builder-validation"></div>' +
        '</aside>' +
      '</div>';
    renderBuilderStep();
    updateBuilderPreview();
    document.getElementById('copy-builder').addEventListener('click', function () { copyText(buildSkillMarkdown(), 'SKILL.md copiado.'); });
  }

  function renderStepper() {
    var labels = ['Básico','Invocação','Ferramentas','Instruções','Arquivos','Revisão','Exportar'];
    return '<div class="stepper">' + labels.map(function (label, index) {
      var n = index + 1;
      var cls = n < builderState.step ? 'is-done' : n === builderState.step ? 'is-active' : '';
      return '<div class="step ' + cls + '"><div class="step__dot">' + (n < builderState.step ? '✓' : n) + '</div><span>' + label + '</span></div>';
    }).join('') + '</div>';
  }

  function renderBuilderStep() {
    var form = document.getElementById('builder-form');
    if (!form) return;
    var html = '';
    if (builderState.step === 1) html = stepBasic();
    if (builderState.step === 2) html = stepInvocation();
    if (builderState.step === 3) html = stepTools();
    if (builderState.step === 4) html = stepInstructions();
    if (builderState.step === 5) html = stepFiles();
    if (builderState.step === 6) html = stepReview();
    if (builderState.step === 7) html = stepExport();
    form.innerHTML = html + builderActions();
    bindBuilderControls();
  }

  function stepBasic() {
    return '<h2>1. Informações básicas</h2><p class="panel__copy">Defina identidade e destino da Skill.</p><div class="form-grid">' +
      field('directoryName','Nome do diretório',builderState.directoryName,'api-reviewer') +
      field('displayName','Display name',builderState.displayName,'API Reviewer') +
      '<div class="field"><label for="profile">Destino</label><select class="select" id="profile" data-builder="profile"><option value="claude-code-project">Claude Code — projeto</option><option value="claude-code-personal">Claude Code — pessoal</option><option value="claude-code-plugin">Claude Code — plugin</option><option value="portable">Portable Agent Skill</option></select></div>' +
      field('category','Categoria',builderState.category,'Development') +
      textareaField('description','Descrição',builderState.description,'O que faz e quando usar.',true) +
    '</div>';
  }

  function stepInvocation() {
    return '<h2>2. Invocação</h2><p class="panel__copy">Controle quando Claude e o usuário podem acionar a Skill.</p><div class="form-grid">' +
      textareaField('whenToUse','When to use',builderState.whenToUse,'Ex.: Use when the user asks to review an API.',true) +
      field('argumentHint','Argument hint',builderState.argumentHint,'[issue-number]') +
      field('arguments','Argumentos nomeados',builderState.arguments,'issue, branch') +
      '<div class="field"><label>Controles</label><div class="panel" style="padding:0 14px">' +
        switchRow('autoInvoke','Claude pode invocar automaticamente',builderState.autoInvoke,'Se desligado, gera disable-model-invocation: true.') +
        switchRow('userInvocable','Usuário pode invocar via /',builderState.userInvocable,'Se desligado, gera user-invocable: false.') +
      '</div></div>' +
    '</div>';
  }

  function stepTools() {
    return '<h2>3. Ferramentas e execução</h2><p class="panel__copy">Campos avançados de Claude Code. O browser nunca executa essas ferramentas.</p><div class="form-grid">' +
      textareaField('allowedTools','Allowed tools',builderState.allowedTools,'Read, Grep, Bash(git status *)',true) +
      '<div class="field"><label for="context">Context</label><select class="select" id="context" data-builder="context"><option value="">Inline / padrão</option><option value="fork">Forked subagent</option></select></div>' +
      '<div class="field"><label for="shell">Shell</label><select class="select" id="shell" data-builder="shell"><option value="bash">bash</option><option value="powershell">powershell</option></select></div>' +
      '<div class="field field--full"><div class="validation"><strong>Segurança:</strong> Bash, PowerShell e comandos dinâmicos aumentam o score de risco. Eles continuam apenas como texto dentro deste marketplace.</div></div>' +
    '</div>';
  }

  function stepInstructions() {
    return '<h2>4. Instruções</h2><p class="panel__copy">Escreva o corpo Markdown da Skill. Seja conciso e operacional.</p><div class="form-grid">' + textareaField('body','SKILL.md body',builderState.body,'# Goal...',true,260) + '</div>';
  }

  function stepFiles() {
    return '<h2>5. Arquivos auxiliares</h2><p class="panel__copy">O protótipo demonstra um arquivo textual opcional. A implementação final pode permitir vários.</p><div class="form-grid">' +
      field('extraFilePath','Caminho opcional',builderState.extraFilePath,'reference.md') +
      textareaField('extraFileContent','Conteúdo',builderState.extraFileContent,'# Reference...',true,220) +
    '</div>';
  }

  function stepReview() {
    var validation = validateBuilder();
    return '<h2>6. Revisão</h2><p class="panel__copy">Revise estrutura, risco e portabilidade antes de exportar.</p>' +
      '<div class="validation"><strong>' + (validation.errors.length ? 'Há erros bloqueantes.' : 'Estrutura pronta para exportação.') + '</strong><br>' +
      'Risco: ' + riskLabel(calculateRisk().score) + ' · Portabilidade: ' + calculatePortability() + '/100' +
      (validation.warnings.length ? '<br><span class="warning">' + escapeHtml(validation.warnings.join(' · ')) + '</span>' : '') + '</div>';
  }

  function stepExport() {
    var validation = validateBuilder();
    var path = builderState.profile === 'claude-code-personal' ? '~/.claude/skills/' + safeSkillName() + '/SKILL.md' : builderState.profile === 'claude-code-plugin' ? '<plugin>/skills/' + safeSkillName() + '/SKILL.md' : '.claude/skills/' + safeSkillName() + '/SKILL.md';
    return '<h2>7. Exportar</h2><p class="panel__copy">Baixe o arquivo ou copie o caminho de instalação.</p>' +
      '<div class="panel" style="background:var(--surface-2)"><div class="preview-tree">' + escapeHtml(path) + '</div><div style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn--primary" id="download-skill" ' + (validation.errors.length ? 'disabled' : '') + '>Baixar SKILL.md</button>' +
      '<button class="btn btn--secondary" id="copy-path">Copiar path</button>' +
      '<button class="btn btn--ghost" id="reset-builder">Nova Skill</button>' +
      '</div></div>' +
      '<p class="panel__copy" style="margin-top:12px">O ZIP completo está especificado nos documentos para o Gate 6.</p>';
  }

  function builderActions() {
    var backDisabled = builderState.step === 1 ? 'disabled' : '';
    var nextDisabled = builderState.step === 7 ? 'disabled' : '';
    return '<div class="builder-actions"><button class="btn btn--secondary" id="builder-back" ' + backDisabled + '>← Voltar</button><button class="btn btn--primary" id="builder-next" ' + nextDisabled + '>Próximo →</button></div>';
  }

  function field(key, label, value, placeholder) {
    return '<div class="field"><label for="' + key + '">' + escapeHtml(label) + '</label><input class="input" id="' + key + '" data-builder="' + key + '" value="' + escapeHtml(value) + '" placeholder="' + escapeHtml(placeholder || '') + '"></div>';
  }

  function textareaField(key, label, value, placeholder, full, minHeight) {
    return '<div class="field ' + (full ? 'field--full' : '') + '"><label for="' + key + '">' + escapeHtml(label) + '</label><textarea class="textarea" style="' + (minHeight ? 'min-height:' + minHeight + 'px' : '') + '" id="' + key + '" data-builder="' + key + '" placeholder="' + escapeHtml(placeholder || '') + '">' + escapeHtml(value) + '</textarea></div>';
  }

  function switchRow(key, title, value, help) {
    return '<div class="switch-row"><div><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(help) + '</span></div><button type="button" class="switch ' + (value ? 'is-on' : '') + '" data-switch="' + key + '" aria-pressed="' + (value ? 'true' : 'false') + '" aria-label="' + escapeHtml(title) + '"></button></div>';
  }

  function bindBuilderControls() {
    document.querySelectorAll('[data-builder]').forEach(function (control) {
      var key = control.getAttribute('data-builder');
      if (key === 'profile' || key === 'context' || key === 'shell') control.value = builderState[key];
      control.addEventListener('input', function (event) {
        builderState[key] = event.target.value;
        saveBuilderDraft();
        updateBuilderPreview();
      });
      control.addEventListener('change', function (event) {
        builderState[key] = event.target.value;
        saveBuilderDraft();
        updateBuilderPreview();
      });
    });

    document.querySelectorAll('[data-switch]').forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-switch');
        builderState[key] = !builderState[key];
        button.classList.toggle('is-on', builderState[key]);
        button.setAttribute('aria-pressed', builderState[key] ? 'true' : 'false');
        saveBuilderDraft();
        updateBuilderPreview();
      });
    });

    var back = document.getElementById('builder-back');
    var next = document.getElementById('builder-next');
    if (back) back.addEventListener('click', function () { if (builderState.step > 1) { builderState.step -= 1; saveBuilderDraft(); renderBuilder(); } });
    if (next) next.addEventListener('click', function () {
      var validation = validateBuilder();
      if (builderState.step === 1 && validation.errors.length) { showToast(validation.errors[0]); return; }
      if (builderState.step < 7) { builderState.step += 1; saveBuilderDraft(); renderBuilder(); }
    });

    var download = document.getElementById('download-skill');
    if (download) download.addEventListener('click', downloadSkillMarkdown);
    var copyPath = document.getElementById('copy-path');
    if (copyPath) copyPath.addEventListener('click', function () {
      var path = builderState.profile === 'claude-code-personal' ? '~/.claude/skills/' + safeSkillName() + '/SKILL.md' : builderState.profile === 'claude-code-plugin' ? '<plugin>/skills/' + safeSkillName() + '/SKILL.md' : '.claude/skills/' + safeSkillName() + '/SKILL.md';
      copyText(path, 'Path copiado.');
    });
    var reset = document.getElementById('reset-builder');
    if (reset) reset.addEventListener('click', function () {
      builderState = clone(builderDefaults);
      saveBuilderDraft();
      renderBuilder();
      showToast('Novo rascunho criado.');
    });
  }

  function splitList(value) {
    return String(value || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function yamlString(value) {
    return JSON.stringify(String(value));
  }

  function buildFrontmatter() {
    var portable = builderState.profile === 'portable';
    var lines = ['---'];
    if (builderState.displayName.trim()) lines.push('name: ' + safeYamlScalar(builderState.displayName.trim()));
    if (builderState.description.trim()) lines.push('description: ' + yamlString(builderState.description.trim()));
    if (!portable && builderState.whenToUse.trim()) lines.push('when_to_use: ' + yamlString(builderState.whenToUse.trim()));
    if (!portable && builderState.argumentHint.trim()) lines.push('argument-hint: ' + yamlString(builderState.argumentHint.trim()));
    if (!portable && splitList(builderState.arguments).length) {
      lines.push('arguments:');
      splitList(builderState.arguments).forEach(function (item) { lines.push('  - ' + safeYamlScalar(item)); });
    }
    if (!portable && !builderState.autoInvoke) lines.push('disable-model-invocation: true');
    if (!portable && !builderState.userInvocable) lines.push('user-invocable: false');
    if (splitList(builderState.allowedTools).length) {
      lines.push('allowed-tools:');
      splitList(builderState.allowedTools).forEach(function (item) { lines.push('  - ' + yamlString(item)); });
    }
    if (!portable && builderState.context === 'fork') lines.push('context: fork');
    if (!portable && builderState.shell && builderState.shell !== 'bash') lines.push('shell: ' + builderState.shell);
    lines.push('---');
    return lines.join('\n');
  }

  function safeYamlScalar(value) {
    return /^[a-zA-Z0-9._-]+$/.test(value) ? value : yamlString(value);
  }

  function buildSkillMarkdown() {
    var body = String(builderState.body || '').trim();
    return buildFrontmatter() + '\n\n' + body + (body ? '\n' : '');
  }

  function safeSkillName() {
    var value = String(builderState.directoryName || '').trim().toLowerCase();
    return value || 'my-skill';
  }

  function validateBuilder() {
    var errors = [];
    var warnings = [];
    var name = String(builderState.directoryName || '').trim();
    if (!name) errors.push('Informe o nome do diretório da Skill.');
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) errors.push('Use lowercase e kebab-case no nome do diretório.');
    if (!builderState.description.trim()) warnings.push('Descrição vazia reduz descoberta automática.');
    if (!builderState.autoInvoke && !builderState.userInvocable && builderState.profile !== 'portable') warnings.push('A Skill está com invocação automática e manual desativadas.');
    if (builderState.extraFilePath) {
      if (builderState.extraFilePath.indexOf('..') !== -1 || /^[/\\]/.test(builderState.extraFilePath)) errors.push('O caminho do arquivo auxiliar não pode sair do diretório da Skill.');
      if (builderState.extraFilePath.replace(/\\/g, '/').toUpperCase() === 'SKILL.MD') errors.push('SKILL.md já é gerado pelo builder.');
    }
    if (/!`/.test(builderState.body)) warnings.push('Dynamic shell injection detectada no corpo.');
    if (/bash|powershell/i.test(builderState.allowedTools)) warnings.push('Ferramentas shell aumentam o risco operacional.');
    return { errors: errors, warnings: warnings };
  }

  function calculateRisk() {
    var score = 0;
    var factors = [];
    var tools = splitList(builderState.allowedTools);
    if (tools.length) { score += 1; factors.push('allowed-tools'); }
    if (/bash|powershell/i.test(builderState.allowedTools)) { score += 2; factors.push('shell tools'); }
    if (builderState.extraFilePath && /(^|\/)scripts?\//i.test(builderState.extraFilePath)) { score += 2; factors.push('script file'); }
    if (/!`/.test(builderState.body)) { score += 2; factors.push('dynamic shell'); }
    if (builderState.context === 'fork') { score += 1; factors.push('fork'); }
    return { score: score, factors: factors };
  }

  function riskLabel(score) {
    return score >= 5 ? 'elevado' : score >= 2 ? 'moderado' : 'baixo';
  }

  function calculatePortability() {
    if (builderState.profile === 'portable') return 100;
    var score = 100;
    if (builderState.whenToUse.trim()) score -= 8;
    if (builderState.argumentHint.trim() || splitList(builderState.arguments).length) score -= 12;
    if (!builderState.autoInvoke || !builderState.userInvocable) score -= 12;
    if (builderState.context === 'fork') score -= 18;
    if (builderState.shell === 'powershell') score -= 8;
    if (/!`/.test(builderState.body)) score -= 20;
    return Math.max(0, score);
  }

  function updateBuilderPreview() {
    var code = document.getElementById('builder-code');
    var tree = document.getElementById('builder-tree');
    var validation = document.getElementById('builder-validation');
    var portability = document.getElementById('builder-portability');
    if (!code || !tree || !validation || !portability) return;
    code.textContent = buildSkillMarkdown();
    var file = String(builderState.extraFilePath || '').trim();
    tree.textContent = safeSkillName() + '/\n├── SKILL.md' + (file ? '\n└── ' + file.replace(/\\/g, '/') : '');
    var result = validateBuilder();
    var risk = calculateRisk();
    var chunks = [];
    chunks.push('<strong>Risco ' + riskLabel(risk.score) + '</strong> · score ' + risk.score);
    if (result.errors.length) chunks.push('<div class="error">' + escapeHtml(result.errors.join(' · ')) + '</div>');
    if (result.warnings.length) chunks.push('<div class="warning">' + escapeHtml(result.warnings.join(' · ')) + '</div>');
    if (!result.errors.length && !result.warnings.length) chunks.push('<div>Sem alertas adicionais no estado atual.</div>');
    validation.innerHTML = chunks.join('');
    portability.textContent = 'Portabilidade ' + calculatePortability() + '/100';
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast(successMessage); }).catch(function () { fallbackCopy(text, successMessage); });
    } else fallbackCopy(text, successMessage);
  }

  function fallbackCopy(text, successMessage) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); showToast(successMessage); } catch (error) { showToast('Não foi possível copiar automaticamente.'); }
    area.remove();
  }

  function downloadSkillMarkdown() {
    var result = validateBuilder();
    if (result.errors.length) { showToast(result.errors[0]); return; }
    var blob = new Blob([buildSkillMarkdown()], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'SKILL.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast('SKILL.md baixado.');
  }

  function render() {
    var route = routeInfo();
    updateNav(route.name);
    if (route.name === 'home') renderHome();
    else if (routeCatalogMap[route.name]) renderCatalogPage(route.name);
    else if (route.name === 'skill-builder') renderBuilder();
    else if (route.name === 'skill') renderSkillDetail(route.id);
    else renderHome();
    requestAnimationFrame(function () { app.focus({ preventScroll: true }); });
  }

  window.addEventListener('hashchange', function () {
    activeQuery = '';
    activeCategory = 'All';
    render();
  });

  globalSearch.addEventListener('input', function (event) {
    activeQuery = event.target.value;
    var route = routeInfo().name;
    if (routeCatalogMap[route]) {
      var local = document.getElementById('catalog-search');
      if (local) local.value = activeQuery;
      renderCatalogList(route);
    }
  });

  globalSearch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !routeCatalogMap[routeInfo().name]) {
      location.hash = '#/claude-skills';
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      event.preventDefault();
      globalSearch.focus();
    }
  });

  if (!location.hash) location.hash = '#/home';
  else render();
})();
