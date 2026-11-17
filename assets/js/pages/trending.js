/* ==========================================================================
   pages/trending.js — SkillHub.pages.trending

   "Trendings": skills de terceiros que circulam no mercado, por especialidade,
   cada uma com link para o repositório oficial. O dado mora em data/trending.js.

   Estas NÃO são entradas do catálogo: o Skill Hub não hospeda o conteúdo delas,
   então a linha não leva a #/skill/<id> — abre a origem numa aba nova. E o app
   não mede uso (ver CLAUDE.md §Catálogo): a lista é curadoria do que aparece de
   forma recorrente em rankings e listas da comunidade, sem número nenhum.

   Filtros no estilo de base de dados: busca por texto, uma especialidade e
   várias tags ao mesmo tempo. Cada filtro ligado vira uma pílula removível
   acima da lista, e só a lista é refeita — os controles ficam no lugar, o que
   mantém o foco no campo de busca enquanto se digita.

   A lista tem efeito de menu de jogo (.select-list): um cursor aparece ao lado
   do item sob foco, o título acende, e as setas do teclado andam pelas linhas.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  /* A ordem aqui é a ordem na página; o dado carrega só a chave. */
  var CATEGORIES = [
    { key: 'engineering', title: 'Disciplina de engenharia', copy: 'Como o agente escreve, testa e corrige código.' },
    { key: 'planning', title: 'Planejamento', copy: 'Do pedido vago ao plano que dá para executar.' },
    { key: 'frontend', title: 'Frontend e design', copy: 'Interface, React e revisão visual.' },
    { key: 'testing', title: 'Testes e navegador', copy: 'Dirigir um navegador de verdade para testar.' },
    { key: 'documents', title: 'Documentos', copy: 'PDF, Word, PowerPoint e Excel.' },
    { key: 'meta', title: 'Criar e descobrir skills', copy: 'Skills que ajudam a fazer e a achar outras skills.' },
    { key: 'collections', title: 'Coleções e diretórios', copy: 'Onde procurar mais.' }
  ];

  /* Vive enquanto a aba está aberta: voltar à página mantém o recorte. */
  var state = { text: '', category: 'all', tags: [] };
  var refs = { list: null, active: null, filters: null, input: null };

  function entries() {
    return window.SKILL_HUB_TRENDING || [];
  }

  function categoryTitle(key) {
    var found = CATEGORIES.filter(function (category) { return category.key === key; })[0];
    return found ? found.title : key;
  }

  /** Todas as tags em uso, em ordem alfabética. */
  function allTags() {
    var seen = Object.create(null);
    entries().forEach(function (entry) {
      (entry.tags || []).forEach(function (tag) { seen[tag] = true; });
    });
    return Object.keys(seen).sort(function (a, b) { return a.localeCompare(b); });
  }

  /* --- Filtro --------------------------------------------------------------- */

  /**
   * Especialidade é uma só. Tags somam: com duas ligadas, fica quem tem as
   * DUAS — cada tag a mais estreita a lista, como numa base de dados.
   */
  function matches(entry) {
    if (state.category !== 'all' && entry.category !== state.category) return false;
    var tags = entry.tags || [];
    if (!state.tags.every(function (tag) { return tags.indexOf(tag) !== -1; })) return false;

    var text = state.text.trim().toLowerCase();
    if (!text) return true;
    return [entry.name, entry.author, entry.repo, entry.description, tags.join(' ')]
      .join(' ').toLowerCase().indexOf(text) !== -1;
  }

  function hasFilters() {
    return Boolean(state.text.trim()) || state.category !== 'all' || state.tags.length > 0;
  }

  function clearFilters() {
    state.text = '';
    state.category = 'all';
    state.tags = [];
    if (refs.input) refs.input.value = '';
    update();
    if (refs.input) refs.input.focus();
  }

  function toggleTag(tag) {
    var at = state.tags.indexOf(tag);
    if (at === -1) state.tags.push(tag);
    else state.tags.splice(at, 1);
    update();
  }

  /* --- Render dirigido ------------------------------------------------------- */

  /** Vira o aria-pressed dos chips no lugar, sem recriar nós. */
  function syncChips() {
    if (!refs.filters) return;
    Array.prototype.forEach.call(refs.filters.querySelectorAll('[data-group]'), function (line) {
      var group = line.dataset.group;
      Array.prototype.forEach.call(line.querySelectorAll('.chip'), function (chip) {
        var value = chip.dataset.value;
        var pressed = group === 'tags' ? state.tags.indexOf(value) !== -1 : state.category === value;
        chip.setAttribute('aria-pressed', String(pressed));
      });
    });
  }

  function pill(label, value, onRemove) {
    return el('span', { class: 'filter-pill' }, [
      el('span', { class: 'filter-pill__key' }, label),
      el('span', null, value),
      el('button', {
        class: 'filter-pill__remove',
        type: 'button',
        'aria-label': 'Remover filtro ' + label + ': ' + value,
        onclick: onRemove
      }, SkillHub.icons.get('x', 'icon--sm'))
    ]);
  }

  function renderActive(shown, total) {
    if (!refs.active) return;
    var pills = [];
    if (state.category !== 'all') {
      pills.push(pill('Especialidade', categoryTitle(state.category), function () {
        state.category = 'all';
        update();
      }));
    }
    state.tags.forEach(function (tag) {
      pills.push(pill('Tag', tag, function () { toggleTag(tag); }));
    });

    SkillHub.dom.replace(refs.active, [
      el('span', { class: 'listing__count' }, shown === total
        ? total + ' ' + SkillHub.util.pluralize(total, 'skill', 'skills')
        : shown + ' de ' + total + ' ' + SkillHub.util.pluralize(total, 'skill', 'skills'))
    ].concat(pills, hasFilters() ? ui.button({
      label: 'Limpar filtros',
      variant: 'ghost',
      className: 'filterbar__clear',
      onClick: clearFilters
    }) : null));
  }

  function renderList() {
    var all = entries();
    var shown = all.filter(matches);
    renderActive(shown.length, all.length);
    if (!refs.list) return;

    if (!shown.length) {
      SkillHub.dom.replace(refs.list, ui.emptyState({
        icon: 'search',
        title: 'Nenhuma skill com esses filtros',
        copy: 'Tags somam: cada uma a mais estreita a lista. Tire uma, ou limpe tudo.',
        action: ui.button({ label: 'Limpar filtros', variant: 'secondary', onClick: clearFilters })
      }));
      return;
    }

    SkillHub.dom.replace(refs.list, CATEGORIES.map(function (category) {
      var items = shown.filter(function (entry) { return entry.category === category.key; });
      /* Especialidade vazia é omitida, como nas áreas do Coding Styles. */
      if (!items.length) return null;
      return ui.section({
        title: category.title,
        description: category.copy,
        body: el('div', { class: 'catalog select-list' }, items.map(function (entry) {
          return ui.externalCard(entry);
        }))
      });
    }));
  }

  function update() {
    syncChips();
    renderList();
  }

  /* --- Página ---------------------------------------------------------------- */

  /**
   * Seta para cima e para baixo andam pelos itens, como num menu: a página
   * inteira é uma lista só, atravessando as especialidades. Só age quando o
   * foco já está numa linha, para não roubar a rolagem de quem está lendo.
   */
  function onKeydown(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    var current = event.target.closest ? event.target.closest('.select-list .skill-card') : null;
    if (!current) return;

    var rows = Array.prototype.slice.call(event.currentTarget.querySelectorAll('.select-list .skill-card'));
    var next = rows[rows.indexOf(current) + (event.key === 'ArrowDown' ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus();
  }

  function buildFilters() {
    var search = ui.searchField({
      id: 'trending-search',
      label: 'Buscar nas trendings',
      placeholder: 'Buscar por nome, autor ou repositório...',
      value: state.text,
      kbd: '/',
      onInput: function (value) {
        state.text = value;
        renderList();
      }
    });
    refs.input = search.__input;

    var lines = el('div', { class: 'listing__filters' }, [
      ui.chipLine('Especialidade', 'category',
        [{ value: 'all', label: 'Todas' }].concat(CATEGORIES.map(function (category) {
          return { value: category.key, label: category.title };
        })),
        function (value) {
          state.category = value;
          update();
        }),
      ui.chipLine('Tags', 'tags',
        allTags().map(function (tag) { return { value: tag, label: tag }; }),
        toggleTag)
    ]);
    refs.filters = lines;

    refs.active = el('div', { class: 'filterbar__active', 'aria-live': 'polite' });

    return el('div', { class: 'filterbar' }, [search, lines, refs.active]);
  }

  function render() {
    refs.list = el('div', null);

    var page = el('div', { onkeydown: onKeydown }, [
      ui.pageHeader({
        eyebrow: 'Do mercado',
        title: 'Trendings',
        copy: 'Skills que os devs estão usando, por especialidade. Cada linha abre o repositório ' +
          'oficial. A seleção é curadoria: o Skill Hub não mede uso nem hospeda esses arquivos.'
      }),
      ui.notice({
        icon: 'shield',
        strong: 'Conteúdo de terceiros.',
        copy: 'Leia o SKILL.md na origem antes de instalar: uma Skill pode pré-aprovar ferramentas e rodar comandos.'
      }),
      buildFilters(),
      refs.list
    ]);

    update();
    return page;
  }

  function topbar() {
    return {
      lead: null,
      actions: [
        ui.button({
          label: 'Criar Skill',
          variant: 'secondary',
          iconAfter: 'arrow-right',
          href: '#/skill-builder'
        })
      ]
    };
  }

  function focusSearch() {
    if (refs.input) refs.input.focus();
    return Boolean(refs.input);
  }

  function teardown() {
    refs = { list: null, active: null, filters: null, input: null };
  }

  SkillHub.pages.trending = {
    title: 'Trendings',
    render: render,
    topbar: topbar,
    teardown: teardown,
    focusSearch: focusSearch
  };
})(window.SkillHub);
