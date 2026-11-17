/* ==========================================================================
   pages/listing.js — SkillHub.pages.listing

   As quatro rotas de coleção (Claude, Codex, Prompts, Agentes) compartilham
   este renderizador; só os dados e o microcopy mudam.

   Só a lista, a contagem e o estado dos chips são re-renderizados quando um
   filtro muda, para o foco não sair do campo de busca enquanto se digita.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var refs = { list: null, count: null, filters: null, input: null, toggle: null };
  var active = { route: null, config: null, state: null };

  /* Em tablet/mobile os filtros começam recolhidos (DESIGN_SYSTEM §22). O
     estado é da sessão, não da rota: é preferência de quem está navegando. */
  var filtersExpanded = false;

  var RISK_CHIPS = [
    { value: 'all', label: 'Qualquer risco' },
    { value: 'low', label: 'Baixo' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'elevated', label: 'Elevado' }
  ];

  /* --- Chips --------------------------------------------------------------- */

  var chipLine = ui.chipLine;

  /** Atualiza os chips no lugar, sem recriar nós, para não roubar o foco. */
  function syncChips() {
    if (!refs.filters) return;
    var lines = refs.filters.querySelectorAll('[data-group]');
    Array.prototype.forEach.call(lines, function (line) {
      var group = line.dataset.group;
      var chips = line.querySelectorAll('.chip');
      Array.prototype.forEach.call(chips, function (chip) {
        var value = chip.dataset.value;
        var pressed = group === 'toggles'
          ? Boolean(active.state[value])
          : String(active.state[group]) === value;
        chip.setAttribute('aria-pressed', String(pressed));
      });
    });
  }

  /* --- Lista --------------------------------------------------------------- */

  function clearFilters() {
    active.state = SkillHub.catalog.resetFilters(active.route);
    if (refs.input) refs.input.value = '';
    update();
    if (refs.input) refs.input.focus();
  }

  function renderList() {
    var items = SkillHub.catalog.query(active.config.type, active.state);
    var total = SkillHub.catalog.byType(active.config.type).length;

    /* Na coleção com pasta entram também as skills do mercado daquela
       categoria: não são hospedadas aqui, então vêm depois das do catálogo, sob
       um rótulo que diz isso, e cada linha abre o link oficial. Seguem a busca e
       a categoria. Plataforma, formato, risco, scripts e shell são fatos que só
       o catálogo declara: com um deles ligado, as do mercado saem da lista em vez
       de aparecerem como se tivessem passado no filtro. */
    var state = active.state;
    var onlyCatalog = state.platform !== 'all' || state.format !== 'all' || state.risk !== 'all' ||
      state.scripts || state.shell;
    var external = active.config.folder && !onlyCatalog
      ? SkillHub.catalog.marketSkills(state.category, state.text)
      : [];
    var externalTotal = active.config.folder ? SkillHub.catalog.marketSkills('all').length : 0;
    var shown = items.length + external.length;
    var all = total + externalTotal;

    if (refs.count) {
      refs.count.textContent = shown === all
        ? all + ' ' + SkillHub.util.pluralize(all, 'item', 'itens')
        : shown + ' de ' + all + ' ' + SkillHub.util.pluralize(all, 'item', 'itens');
    }

    if (!refs.list) return;

    if (!shown) {
      SkillHub.dom.replace(refs.list, ui.emptyState({
        icon: 'search',
        title: 'Nenhum resultado com esses filtros',
        copy: 'Combinações muito específicas podem não ter correspondência neste catálogo. Ajuste a busca ou limpe os filtros.',
        action: ui.button({ label: 'Limpar filtros', variant: 'secondary', onClick: clearFilters })
      }));
      return;
    }

    SkillHub.dom.replace(refs.list, [
      items.length ? el('div', { class: 'catalog' }, items.map(function (item) {
        return ui.skillCard(item, {
          categoryLabel: SkillHub.catalog.categoryLabel(item.category),
          favorite: SkillHub.catalog.isFavorite(item.id)
        });
      })) : null,
      external.length ? el('p', { class: 'card__label listing__sublabel' },
        'Do mercado · cada linha abre o repositório oficial') : null,
      external.length ? externalList(external, state.category) : null
    ]);
  }

  /**
   * As do mercado. Numa categoria com subseções (Coding style), uma seção por
   * subseção, na ordem da árvore; o que não tiver subseção fica em "Outras".
   */
  function externalList(entries, category) {
    var children = active.config.folder ? SkillHub.catalog.childCategories(category) : [];
    var cards = function (list) {
      return el('div', { class: 'catalog' }, list.map(function (entry) { return ui.externalCard(entry); }));
    };
    if (!children.length) return cards(entries);

    var placed = Object.create(null);
    var sections = children.map(function (child) {
      var list = entries.filter(function (entry) { return (entry.categories || []).indexOf(child.key) !== -1; });
      list.forEach(function (entry) { placed[entry.id] = true; });
      return list.length ? ui.section({
        title: child.label,
        description: list.length + ' ' + SkillHub.util.pluralize(list.length, 'skill', 'skills'),
        linkHref: '#/' + active.route + '/' + encodeURIComponent(child.key),
        linkLabel: 'Só ' + child.label,
        body: cards(list)
      }) : null;
    });
    var rest = entries.filter(function (entry) { return !placed[entry.id]; });
    if (rest.length) sections.push(ui.section({ title: 'Outras', body: cards(rest) }));
    return el('div', { class: 'listing__groups' }, sections);
  }

  /** Rótulo e estado do botão que recolhe os filtros. */
  function syncToggle() {
    if (!refs.toggle) return;
    var count = SkillHub.catalog.activeFilterCount(active.state);
    var label = refs.toggle.querySelector('span');
    if (label) label.textContent = count ? 'Filtros · ' + count : 'Filtros';
    refs.toggle.setAttribute('aria-expanded', String(filtersExpanded));
    if (refs.filters) refs.filters.classList.toggle('is-collapsed', !filtersExpanded);
  }

  function update() {
    syncChips();
    syncToggle();
    renderList();
  }

  function setFilter(key, value) {
    active.state[key] = value;
    update();
  }

  function toggleFilter(key) {
    active.state[key] = !active.state[key];
    update();
  }

  /* --- Página -------------------------------------------------------------- */

  function buildFilters() {
    var facets = SkillHub.catalog.facets(active.config.type);

    var categoryOptions = [{ value: 'all', label: 'Todos' }].concat(
      categoryKeys().map(function (key) {
        return { value: key, label: SkillHub.catalog.categoryLabel(key) };
      })
    );

    var lines = [
      /* A categoria mora na URL (#/<rota>/<categoria>): é o que deixa a pasta do
         menu lateral e os chips da página apontarem para o mesmo lugar, e o
         voltar do navegador desfazer a escolha. O clique só troca o hash; quem
         aplica é onParam. */
      chipLine('Categoria', 'category', categoryOptions, function (value) {
        window.location.hash = '#/' + active.route + (value === 'all' ? '' : '/' + encodeURIComponent(value));
      })
    ];

    // Formato só aparece quando a coleção tem mais de um — é o caso do Codex,
    // que tem AGENTS.md e prompt, dois artefatos bem diferentes.
    if (facets.formats.length > 1) {
      var formatOptions = [{ value: 'all', label: 'Todos' }].concat(
        facets.formats.map(function (id) {
          return { value: id, label: SkillHub.formats.get(id).short };
        })
      );
      lines.push(chipLine('Formato', 'format', formatOptions, function (value) {
        setFilter('format', value);
      }));
    }

    // Plataforma só aparece quando a coleção realmente tem mais de uma.
    if (facets.platforms.length > 1) {
      var platformOptions = [{ value: 'all', label: 'Todas' }].concat(
        facets.platforms.map(function (key) {
          return { value: key, label: SkillHub.catalog.platformLabel(key) };
        })
      );
      lines.push(chipLine('Plataforma', 'platform', platformOptions, function (value) {
        setFilter('platform', value);
      }));
    }

    var toggles = [];
    if (facets.hasScripts) toggles.push({ value: 'scripts', label: 'Com scripts' });
    if (facets.hasShell) toggles.push({ value: 'shell', label: 'Com shell' });

    lines.push(chipLine('Risco', 'risk', RISK_CHIPS, function (value) {
      setFilter('risk', value);
    }));
    /* Coleções só de prompt não têm script nem shell: a linha ficaria vazia. */
    if (toggles.length) {
      lines.push(chipLine('Conteúdo', 'toggles', toggles, function (value) {
        toggleFilter(value);
      }));
    }

    var panel = el('div', {
      class: 'listing__filters' + (filtersExpanded ? '' : ' is-collapsed'),
      id: 'listing-filters'
    }, lines);
    refs.filters = panel;

    // Visível só em tablet/mobile: no desktop o CSS esconde o botão e o painel
    // fica sempre aberto, então o estado recolhido não afeta telas largas.
    var toggle = el('button', {
      class: 'btn btn--secondary listing__toggle',
      type: 'button',
      'aria-expanded': String(filtersExpanded),
      'aria-controls': 'listing-filters',
      onclick: function () {
        filtersExpanded = !filtersExpanded;
        syncToggle();
      }
    }, [
      SkillHub.icons.get('sliders'),
      el('span', null, 'Filtros')
    ]);
    refs.toggle = toggle;

    return el('div', { class: 'listing__filter-block' }, [toggle, panel]);
  }

  /** Na coleção com pasta, as categorias incluem as que só existem no mercado. */
  function categoryKeys() {
    return active.config.folder
      ? SkillHub.catalog.folderCategories(active.config.type)
      : SkillHub.catalog.facets(active.config.type).categories;
  }

  /** Categoria vinda da URL. Uma que não existe na coleção vale como "todas". */
  function applyCategory(param) {
    var known = categoryKeys();
    active.state.category = param && known.indexOf(param) !== -1 ? param : 'all';
    if (SkillHub.shell) SkillHub.shell.syncFolder(active.route, active.state.category);
  }

  /* A rota administra o próprio parâmetro (ownsParam): trocar de categoria
     atualiza chips e lista no lugar, sem re-renderizar nem rolar para o topo. */
  function onParam(param) {
    if (!active.config) return;
    applyCategory(param);
    update();
  }

  function render(context) {
    var config = SkillHub.catalog.collection(context.name);
    active.route = context.name;
    active.config = config;
    active.state = SkillHub.catalog.filters(context.name);
    applyCategory(context.param);

    var search = ui.searchField({
      id: 'listing-search',
      small: true,
      label: 'Buscar em ' + config.title,
      placeholder: config.searchPlaceholder,
      value: active.state.text,
      kbd: '/',
      onInput: function (value) { setFilter('text', value); }
    });
    refs.input = search.__input;

    var sort = ui.bareSelect({
      ariaLabel: 'Ordenar resultados',
      value: active.state.sort,
      options: SkillHub.catalog.SORT_OPTIONS,
      onChange: function (value) { setFilter('sort', value); }
    });

    refs.count = el('p', { class: 'listing__count', 'aria-live': 'polite' });
    refs.list = el('div', null);

    /* Coleção com pasta no menu (Skills): a categoria se escolhe lá, e a página
       fica só com a busca — sem ordenação e, em tela larga, sem o bloco de
       filtros. Abaixo de 1180px a pasta some junto com os rótulos do menu, então
       o bloco continua disponível atrás do botão "Filtros" (regra no CSS): sem
       isso não haveria como escolher categoria no celular. */
    var page = el('div', { class: config.folder ? 'listing--folder' : null }, [
      /* Sem cabeçalho visível na coleção com pasta, por pedido: o menu já diz
         onde se está. O h1 continua existindo para leitor de tela — página sem
         título é página sem ponto de partida. */
      config.folder
        ? el('h1', { class: 'u-sr-only' }, config.title)
        : ui.pageHeader({
            eyebrow: config.eyebrow,
            title: config.title,
            copy: config.copy
          }),
      el('div', { class: 'toolbar' + (config.folder ? ' toolbar--single' : '') },
        config.folder ? [search] : [search, sort]),
      buildFilters(),
      refs.count,
      refs.list
    ]);

    update();
    return page;
  }

  function topbar() {
    return {
      lead: null,
      actions: [
        ui.iconButton({
          icon: 'search',
          ariaLabel: 'Focar a busca',
          onClick: function () { if (refs.input) refs.input.focus(); }
        }),
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
    refs = { list: null, count: null, filters: null, input: null, toggle: null };
    if (SkillHub.shell) SkillHub.shell.syncFolder(null);
  }

  /** Uma definição de rota por coleção, todas compartilhando o renderizador. */
  function definitions() {
    var map = {};
    SkillHub.catalog.collections().forEach(function (entry) {
      map[entry.route] = {
        title: entry.title,
        render: render,
        topbar: topbar,
        teardown: teardown,
        ownsParam: true,
        onParam: onParam,
        focusSearch: focusSearch
      };
    });
    return map;
  }

  SkillHub.pages.listing = {
    definitions: definitions,
    focusSearch: focusSearch
  };
})(window.SkillHub);
