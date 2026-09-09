/* ==========================================================================
   pages/coding-style.js — SkillHub.pages.codingStyles

   A coleção Coding Styles, lida de window.SKILL_HUB_CODING_STYLES
   (data/coding-styles.js, gerado a partir de ~/.claude/coding-styles/).

   Uma rota, duas vistas — o mesmo desenho de #/skill/<id>:

     #/coding-styles        → coleção em cards, com busca
     #/coding-styles/<id>   → o guia, com índice das seções

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

  /* Espelhado no campo de busca da coleção: o input lê deste estado. */
  var listState = { query: '' };

  var refs = { results: null, search: null, index: null, empty: null };

  /* --- Dados --------------------------------------------------------------- */

  function guides() {
    var list = window.SKILL_HUB_CODING_STYLES;
    if (!Array.isArray(list)) return [];
    return list.map(function (guide) {
      var view = {};
      Object.keys(guide).forEach(function (key) { view[key] = guide[key]; });
      /* A contagem sai do próprio texto: fixá-la no gerador criaria um número
         que envelhece em silêncio quando o guia é editado. */
      view.sectionCount = SkillHub.markdown.outline(guide.content).length;
      return view;
    });
  }

  function findGuide(id) {
    if (!id) return null;
    return guides().filter(function (guide) { return guide.id === id; })[0] || null;
  }

  function matches(guide, query) {
    var needle = query.trim().toLowerCase();
    if (needle.length < MIN_QUERY) return true;
    var haystack = [guide.title, guide.eyebrow, guide.summary]
      .concat(guide.tags || [], guide.stack || [])
      .join(' ')
      .toLowerCase();
    /* O corpo do guia também entra: procurar "decimal" tem de achar o de Python. */
    return haystack.indexOf(needle) !== -1 ||
      guide.content.toLowerCase().indexOf(needle) !== -1;
  }

  /* --- Coleção ------------------------------------------------------------- */

  function renderResults() {
    if (!refs.results) return;
    var found = guides().filter(function (guide) {
      return matches(guide, listState.query);
    });

    SkillHub.dom.replace(refs.results, [
      el('p', { class: 'listing__count' },
        found.length + ' ' + SkillHub.util.pluralize(found.length, 'guia', 'guias')),
      found.length
        ? el('div', { class: 'catalog' }, found.map(ui.styleCard))
        : ui.emptyState({
            icon: 'search',
            title: 'Nenhum guia encontrado',
            copy: 'A busca cobre título, stack, tags e o texto inteiro de cada guia.',
            action: ui.button({
              label: 'Limpar busca',
              variant: 'secondary',
              onClick: function () {
                listState.query = '';
                if (refs.search) refs.search.value = '';
                renderResults();
                if (refs.search) refs.search.focus();
              }
            })
          })
    ]);
  }

  function renderCollection() {
    var search = ui.searchField({
      id: 'coding-styles-search',
      label: 'Buscar guias de estilo',
      placeholder: 'Buscar por stack, regra ou termo do guia...',
      value: listState.query,
      onInput: function (value) {
        listState.query = value;
        renderResults();
      }
    });
    refs.search = search.__input;

    var results = el('div', { 'aria-live': 'polite' });
    refs.results = results;

    var page = el('div', null, [
      ui.pageHeader({
        eyebrow: 'Convenções',
        title: 'Coding Styles',
        copy: 'Guias de estilo por stack. Cada um define naming, formatação e as ' +
          'decisões que um agente deve seguir ao escrever código naquela stack.',
        art: SkillHub.icons.ornament('prompt-engineering')
      }),
      ui.notice({
        icon: 'info',
        strong: 'Os guias moram fora do repositório.',
        copy: 'A fonte é ~/.claude/coding-styles/, um arquivo por stack. O que está ' +
          'aqui é uma cópia estática gerada dali, porque o navegador não lê aquele ' +
          'caminho e o app não faz fetch.'
      }),
      el('div', { class: 'toolbar' }, search),
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
        eyebrow: guide.eyebrow,
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
    refs = { results: null, search: null, index: null, empty: null };
  }

  SkillHub.pages.codingStyles = {
    title: 'Coding Styles',
    render: render,
    topbar: topbar,
    teardown: teardown,
    focusSearch: focusSearch
  };
})(window.SkillHub);
