/* ==========================================================================
   pages/coding-style.js — SkillHub.pages.codingStyles

   A coleção Coding Styles, lida de window.SKILL_HUB_CODING_STYLES
   (data/coding-styles.js e data/coding-styles-extra.js, gerados a partir de
   ~/.claude/coding-styles/).

   Uma rota, duas vistas — o mesmo desenho de #/skill/<id>:

     #/coding-styles        → coleção em cards, com busca, filtros e ordenação
     #/coding-styles/<id>   → o guia, com índice das seções

   Cada stack tem duas variantes, Completo e Essencial, ligadas pelo campo
   family. A vitrine agrupa por área quando a ordenação é "Por área", que é o
   padrão: com vinte guias, lista plana não se varre.

   O texto é Markdown autorado fora do catálogo, então passa pelo
   SkillHub.markdown. Conteúdo de catálogo continua exibido como TEXTO em code
   box, porque é material de terceiros (ADR-010).
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var MIN_QUERY = 2;

  /* As áreas na ordem em que a coleção agrupa, que não é alfabética. As chaves
     são as mesmas que tools/gen-coding-styles.js valida — um guia com área fora
     desta lista não entraria na vista agrupada, e é o gerador que impede. */
  var AREAS = [
    { key: 'backend', label: 'Backend' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'data', label: 'Dados' },
    { key: 'infra', label: 'Infra' }
  ];

  /* Profundidade: o guia inteiro, ou o cartão de referência da mesma stack.
     linkLabel não é derivado de label porque tem de concordar com "versão", que
     é feminino: "Ver a versão completo" estaria errado. */
  var DEPTHS = [
    { key: 'full', label: 'Completo', linkLabel: 'Ver a versão completa' },
    { key: 'essential', label: 'Essencial', linkLabel: 'Ver a versão essencial' }
  ];

  /* Ordenar por área é o que agrupa. As outras ordens são de lista plana, e é
     por isso que o agrupamento não precisa de um segundo controle. */
  var SORT_OPTIONS = [
    { value: 'area', label: 'Por área' },
    { value: 'name', label: 'Título A→Z' },
    { value: 'sections', label: 'Mais seções' },
    { value: 'recent', label: 'Atualização' }
  ];

  /* Espelhado nos controles da coleção: os controles leem daqui, nunca o
     contrário (ADR-007). Estado de sessão, como os filtros das outras rotas. */
  var listState = { text: '', area: 'all', depth: 'all', sort: 'area' };

  /* Em tablet/mobile os filtros começam recolhidos (DESIGN_SYSTEM §22); no
     desktop o CSS esconde o botão e o painel fica sempre aberto. */
  var filtersExpanded = false;

  var refs = {
    results: null, search: null, filters: null, toggle: null, index: null, empty: null
  };

  /* --- Rótulos ------------------------------------------------------------- */

  function labelOf(list, key) {
    for (var index = 0; index < list.length; index += 1) {
      if (list[index].key === key) return list[index].label;
    }
    return key;
  }

  function areaLabel(key) { return labelOf(AREAS, key); }

  function depthLabel(key) { return labelOf(DEPTHS, key); }

  function depthLinkLabel(key) {
    for (var index = 0; index < DEPTHS.length; index += 1) {
      if (DEPTHS[index].key === key) return DEPTHS[index].linkLabel;
    }
    return depthLabel(key);
  }

  /* --- Dados --------------------------------------------------------------- */

  /**
   * Deriva do texto o que a UI precisa, e memoiza no próprio guia — mesma
   * técnica do __haystack de catalog.js.
   *
   * As duas coisas são caras e são pedidas a cada tecla digitada: a contagem
   * roda o outline sobre o guia inteiro, e a busca cobre o corpo do texto. Com
   * vinte guias e ~200 KB de Markdown, recalcular a cada keystroke trava a
   * digitação.
   */
  function prepare(guide) {
    if (guide.sectionCount === undefined) {
      /* A contagem sai do texto: fixá-la no gerador criaria um número que
         envelhece em silêncio quando o guia é editado. */
      guide.sectionCount = SkillHub.markdown.outline(guide.content).length;
    }
    if (guide.__haystack === undefined) {
      /* O corpo do guia entra na busca: procurar "decimal" tem de achar o de
         Python, e "pipefail" o de Bash. */
      guide.__haystack = [guide.title, areaLabel(guide.area), depthLabel(guide.depth), guide.summary]
        .concat(guide.tags || [], guide.stack || [], [guide.content])
        .join(' ')
        .toLowerCase();
    }
    return guide;
  }

  function guides() {
    var list = window.SKILL_HUB_CODING_STYLES;
    if (!Array.isArray(list)) return [];
    return list.map(prepare);
  }

  function findGuide(id) {
    if (!id) return null;
    return guides().filter(function (guide) { return guide.id === id; })[0] || null;
  }

  /** A outra variante da mesma stack, quando ela existe. */
  function sibling(guide) {
    return guides().filter(function (other) {
      return other.family === guide.family && other.id !== guide.id;
    })[0] || null;
  }

  function matches(guide) {
    if (listState.area !== 'all' && guide.area !== listState.area) return false;
    if (listState.depth !== 'all' && guide.depth !== listState.depth) return false;
    var needle = listState.text.trim().toLowerCase();
    if (needle.length < MIN_QUERY) return true;
    return guide.__haystack.indexOf(needle) !== -1;
  }

  /* --- Ordenação ----------------------------------------------------------- */

  function byTitle(a, b) {
    return a.title.localeCompare(b.title, 'pt-BR');
  }

  /* Desempate por título em toda ordem, para a lista não dançar entre renders. */
  function sortFlat(found) {
    if (listState.sort === 'sections') {
      return found.sort(function (a, b) {
        return (b.sectionCount - a.sectionCount) || byTitle(a, b);
      });
    }
    if (listState.sort === 'recent') {
      return found.sort(function (a, b) {
        return String(b.updatedAt).localeCompare(String(a.updatedAt)) || byTitle(a, b);
      });
    }
    return found.sort(byTitle);
  }

  /* Dentro da área, as duas variantes da mesma stack ficam juntas, o completo
     antes do essencial. */
  function byVariant(a, b) {
    if (a.family !== b.family) return a.family.localeCompare(b.family, 'pt-BR');
    if (a.depth === b.depth) return 0;
    return a.depth === 'full' ? -1 : 1;
  }

  /* --- Coleção ------------------------------------------------------------- */

  function card(guide) {
    return ui.styleCard(guide, {
      areaLabel: areaLabel(guide.area),
      depthLabel: depthLabel(guide.depth)
    });
  }

  function setFilter(key, value) {
    listState[key] = value;
    renderResults();
  }

  function clearFilters() {
    /* A ordenação não é filtro: zerá-la trocaria o layout de agrupado para
       plano sem ninguém ter pedido. */
    listState.text = '';
    listState.area = 'all';
    listState.depth = 'all';
    if (refs.search) refs.search.value = '';
    renderResults();
    if (refs.search) refs.search.focus();
  }

  function activeFilterCount() {
    return (listState.area === 'all' ? 0 : 1) + (listState.depth === 'all' ? 0 : 1);
  }

  /** Atualiza os chips no lugar, sem recriar nós, para não roubar o foco. */
  function syncChips() {
    if (!refs.filters) return;
    var lines = refs.filters.querySelectorAll('[data-group]');
    Array.prototype.forEach.call(lines, function (line) {
      var group = line.dataset.group;
      Array.prototype.forEach.call(line.querySelectorAll('.chip'), function (chip) {
        var pressed = String(listState[group]) === chip.dataset.value;
        chip.setAttribute('aria-pressed', String(pressed));
      });
    });
  }

  /** Rótulo e estado do botão que recolhe os filtros. */
  function syncToggle() {
    if (!refs.toggle) return;
    var count = activeFilterCount();
    var label = refs.toggle.querySelector('span');
    if (label) label.textContent = count ? 'Filtros · ' + count : 'Filtros';
    refs.toggle.setAttribute('aria-expanded', String(filtersExpanded));
    if (refs.filters) refs.filters.classList.toggle('is-collapsed', !filtersExpanded);
  }

  function buildFilters() {
    var areaOptions = [{ value: 'all', label: 'Todas' }].concat(AREAS.map(function (area) {
      return { value: area.key, label: area.label };
    }));
    var depthOptions = [{ value: 'all', label: 'Qualquer' }].concat(DEPTHS.map(function (depth) {
      return { value: depth.key, label: depth.label };
    }));

    var panel = el('div', {
      class: 'listing__filters' + (filtersExpanded ? '' : ' is-collapsed'),
      id: 'coding-styles-filters'
    }, [
      ui.chipLine('Área', 'area', areaOptions, function (value) {
        setFilter('area', value);
      }),
      ui.chipLine('Profundidade', 'depth', depthOptions, function (value) {
        setFilter('depth', value);
      })
    ]);
    refs.filters = panel;

    var toggle = el('button', {
      class: 'btn btn--secondary listing__toggle',
      type: 'button',
      'aria-expanded': String(filtersExpanded),
      'aria-controls': 'coding-styles-filters',
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

  function buildGroups(found) {
    return AREAS.map(function (area) {
      var inArea = found.filter(function (guide) {
        return guide.area === area.key;
      }).sort(byVariant);
      /* Área sem resultado não vira seção vazia. */
      if (!inArea.length) return null;
      return ui.section({
        title: area.label,
        body: el('div', { class: 'catalog' }, inArea.map(card))
      });
    });
  }

  function renderResults() {
    if (!refs.results) return;
    var all = guides();
    var found = all.filter(matches);
    var total = all.length;

    syncChips();
    syncToggle();

    var count = found.length === total
      ? total + ' ' + SkillHub.util.pluralize(total, 'guia', 'guias')
      : found.length + ' de ' + total + ' ' + SkillHub.util.pluralize(total, 'guia', 'guias');

    var body;
    if (!found.length) {
      body = ui.emptyState({
        icon: 'search',
        title: 'Nenhum guia com esses filtros',
        copy: 'A busca cobre título, stack, tags e o texto inteiro de cada guia. ' +
          'Combinações de área e profundidade podem não ter guia correspondente.',
        action: ui.button({
          label: 'Limpar filtros',
          variant: 'secondary',
          onClick: clearFilters
        })
      });
    } else if (listState.sort === 'area') {
      body = el('div', null, buildGroups(found));
    } else {
      body = el('div', { class: 'catalog' }, sortFlat(found).map(card));
    }

    SkillHub.dom.replace(refs.results, [
      el('p', { class: 'listing__count' }, count),
      body
    ]);
  }

  function renderCollection() {
    var search = ui.searchField({
      id: 'coding-styles-search',
      small: true,
      label: 'Buscar guias de estilo',
      placeholder: 'Buscar por stack, regra ou termo do guia...',
      value: listState.text,
      kbd: '/',
      onInput: function (value) {
        listState.text = value;
        renderResults();
      }
    });
    refs.search = search.__input;

    var sort = ui.bareSelect({
      ariaLabel: 'Ordenar os guias',
      value: listState.sort,
      options: SORT_OPTIONS,
      onChange: function (value) {
        listState.sort = value;
        renderResults();
      }
    });

    var results = el('div', { 'aria-live': 'polite' });
    refs.results = results;

    var page = el('div', null, [
      ui.pageHeader({
        eyebrow: 'Convenções',
        title: 'Coding Styles',
        copy: 'Guias de estilo por stack. Cada um define naming, formatação e as ' +
          'decisões que um agente deve seguir ao escrever código naquela stack, em ' +
          'duas profundidades: o guia completo e o cartão de referência.',
        art: SkillHub.icons.ornament('prompt-engineering')
      }),
      ui.notice({
        icon: 'info',
        strong: 'Os guias moram fora do repositório.',
        copy: 'A fonte é ~/.claude/coding-styles/, um arquivo por guia. O que está ' +
          'aqui é uma cópia estática gerada dali, porque o navegador não lê aquele ' +
          'caminho e o app não faz fetch.'
      }),
      el('div', { class: 'toolbar' }, [search, sort]),
      buildFilters(),
      results
    ]);

    renderResults();
    return page;
  }

  /* --- Leitor -------------------------------------------------------------- */

  function filterIndex(term) {
    if (!refs.index) return;
    var needle = String(term || '').trim().toLowerCase();
    var links = refs.index.querySelectorAll('.doc-index__link');
    var visible = 0;

    Array.prototype.forEach.call(links, function (link) {
      var match = !needle || link.textContent.toLowerCase().indexOf(needle) !== -1;
      link.hidden = !match;
      if (match) visible += 1;
    });

    if (refs.empty) refs.empty.hidden = visible > 0;
  }

  function buildIndex(sections) {
    var links = sections.map(function (section, position) {
      return el('a', {
        class: 'doc-index__link',
        href: '#' + section.id,
        onClick: function (event) {
          /* Rolagem interna: deixar o hash mudar trocaria de rota. */
          event.preventDefault();
          var target = document.getElementById(section.id);
          if (!target) return;
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
          target.focus({ preventScroll: true });
        }
      }, [
        el('span', { class: 'doc-index__number' }, String(position + 1)),
        el('span', { class: 'doc-index__title' }, section.title)
      ]);
    });

    var empty = el('p', {
      class: 'doc-index__empty u-faint u-xs',
      hidden: true
    }, 'Nenhuma seção com esse termo.');
    refs.empty = empty;

    var search = ui.searchField({
      id: 'coding-style-sections',
      small: true,
      label: 'Filtrar seções do guia',
      placeholder: 'Filtrar seções...',
      onInput: filterIndex
    });
    refs.search = search.__input;

    var list = el('nav', {
      class: 'doc-index__list',
      'aria-label': 'Seções do guia'
    }, links);
    refs.index = list;

    return ui.card({
      className: 'doc-index',
      body: [
        el('p', { class: 'doc-index__label' },
          sections.length + ' ' + SkillHub.util.pluralize(sections.length, 'seção', 'seções')),
        search,
        list,
        empty
      ]
    });
  }

  /** Botão para a outra variante da mesma stack, quando ela existe. */
  function variantLink(guide) {
    var other = sibling(guide);
    if (!other) return null;
    return ui.button({
      label: depthLinkLabel(other.depth),
      variant: 'secondary',
      icon: other.depth === 'full' ? 'layers' : 'zap',
      href: '#/coding-styles/' + encodeURIComponent(other.id)
    });
  }

  function renderGuide(guide) {
    var anchorPrefix = 'cs-' + guide.id;
    var sections = SkillHub.markdown.outline(guide.content, { anchorPrefix: anchorPrefix });

    var article = el('article', { class: 'markdown' },
      SkillHub.markdown.render(guide.content, { anchorPrefix: anchorPrefix }));

    /* Cada seção recebe foco programático ao ser escolhida no índice, então
       precisa ser alcançável — sem virar parada de tabulação. */
    Array.prototype.forEach.call(article.querySelectorAll('.markdown__h1'), function (node) {
      node.setAttribute('tabindex', '-1');
    });

    return el('div', null, [
      el('div', null, el('a', { class: 'detail__back', href: '#/coding-styles' }, [
        SkillHub.icons.get('arrow-left', 'icon--sm'),
        el('span', null, 'Voltar para Coding Styles')
      ])),
      ui.pageHeader({
        eyebrow: areaLabel(guide.area) + ' · ' + depthLabel(guide.depth),
        title: guide.title,
        copy: guide.summary
      }),
      ui.badgeRow((guide.stack || []).map(function (item) {
        return ui.badge(item, 'info');
      }).concat((guide.tags || []).map(function (item) {
        return ui.badge(item);
      }))),
      el('div', { class: 'doc-actions' }, [
        ui.button({
          label: 'Copiar o guia',
          variant: 'secondary',
          icon: 'copy',
          onClick: function () {
            SkillHub.clipboard.copy(guide.content, guide.fileName + ' copiado');
          }
        }),
        ui.button({
          label: 'Baixar ' + guide.fileName,
          variant: 'secondary',
          icon: 'download',
          onClick: function () {
            SkillHub.download.textFile(guide.fileName, guide.content);
          }
        }),
        variantLink(guide),
        el('span', { class: 'doc-actions__source u-faint u-xs' }, guide.source)
      ]),
      el('div', { class: 'split split--doc' }, [buildIndex(sections), article])
    ]);
  }

  /* --- Rota ---------------------------------------------------------------- */

  function render(context) {
    var all = guides();
    if (!all.length) {
      return ui.emptyState({
        icon: 'alert',
        title: 'Nenhum guia de estilo',
        copy: 'Os guias moram em ~/.claude/coding-styles/ e entram no app por ' +
          'data/coding-styles.js, que é gerado. Ver a seção Coding Styles do CLAUDE.md.',
        action: ui.button({ label: 'Voltar para a Home', variant: 'primary', href: '#/home' })
      });
    }

    var param = context && context.param;
    if (!param) return renderCollection();

    var guide = findGuide(param);
    if (!guide) {
      return ui.emptyState({
        icon: 'alert',
        title: 'Guia não encontrado',
        copy: 'Não existe guia com o identificador "' + param + '".',
        action: ui.button({
          label: 'Ver todos os guias',
          variant: 'primary',
          href: '#/coding-styles'
        })
      });
    }
    return renderGuide(guide);
  }

  function topbar(context) {
    var guide = findGuide(context && context.param);
    return {
      lead: el('span', { class: 'u-row' }, [
        SkillHub.icons.get('book', 'icon--sm'),
        el('span', null, guide ? guide.title : 'Coding Styles')
      ]),
      actions: ui.button({
        label: 'Criar uma Skill',
        variant: 'secondary',
        iconAfter: 'arrow-right',
        href: '#/skill-builder'
      })
    };
  }

  function focusSearch() {
    if (refs.search) refs.search.focus();
    return Boolean(refs.search);
  }

  function teardown() {
    refs = {
      results: null, search: null, filters: null, toggle: null, index: null, empty: null
    };
  }

  SkillHub.pages.codingStyles = {
    title: 'Coding Styles',
    render: render,
    topbar: topbar,
    teardown: teardown,
    focusSearch: focusSearch
  };
})(window.SkillHub);
