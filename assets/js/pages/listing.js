/* ==========================================================================
   pages/listing.js — SkillHub.pages.listing

   As quatro rotas de coleção (Claude, Codex, Prompts, Agentes) compartilham
   este renderizador; só os dados, o ornamento e o microcopy mudam.

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

    if (refs.count) {
      refs.count.textContent = items.length === total
        ? total + ' ' + SkillHub.util.pluralize(total, 'item', 'itens')
        : items.length + ' de ' + total + ' ' + SkillHub.util.pluralize(total, 'item', 'itens');
    }

    if (!refs.list) return;

    if (!items.length) {
      SkillHub.dom.replace(refs.list, ui.emptyState({
        icon: 'search',
        title: 'Nenhum resultado com esses filtros',
        copy: 'Combinações muito específicas podem não ter correspondência neste catálogo. Ajuste a busca ou limpe os filtros.',
        action: ui.button({ label: 'Limpar filtros', variant: 'secondary', onClick: clearFilters })
      }));
      return;
    }

    SkillHub.dom.replace(refs.list, el('div', { class: 'catalog' }, items.map(function (item) {
      return ui.skillCard(item, { categoryLabel: SkillHub.catalog.categoryLabel(item.category) });
    })));
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
      facets.categories.map(function (key) {
        return { value: key, label: SkillHub.catalog.categoryLabel(key) };
      })
    );

    var lines = [
      chipLine('Categoria', 'category', categoryOptions, function (value) {
        setFilter('category', value);
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

  function render(context) {
    var config = SkillHub.catalog.collection(context.name);
    active.route = context.name;
    active.config = config;
    active.state = SkillHub.catalog.filters(context.name);

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

    var page = el('div', null, [
      ui.pageHeader({
        eyebrow: config.eyebrow,
        title: config.title,
        copy: config.copy,
        art: SkillHub.icons.ornament(context.name, 116)
      }),
      el('div', { class: 'toolbar' }, [search, sort]),
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
