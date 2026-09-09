/* ==========================================================================
   pages/home.js — SkillHub.pages.home

   Hero editorial, entrada por categoria, destaques, tendências, favoritos e o
   bloco claro de comunidade (PRD §5). A busca do hero é a busca global: filtra
   o catálogo inteiro e troca as seções por resultados.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var MIN_QUERY = 2;

  /* Espelhado no campo de busca: o input lê deste estado, nunca o contrário. */
  var state = { query: '' };

  var refs = { results: null, sections: null, input: null, favorites: null };

  var CATEGORY_ENTRIES = [
    { route: 'claude-skills', icon: 'sparkle', title: 'Claude Skills', copy: 'Estenda o Claude Code.' },
    { route: 'codex-skills', icon: 'hexagon', title: 'Codex Skills', copy: 'Turbine seu fluxo com Codex.' },
    { route: 'prompt-engineering', icon: 'doc', title: 'Prompt Engineering', copy: 'Prompts melhores, respostas melhores.' },
    { route: 'agents', icon: 'graph', title: 'Agentes', copy: 'Automatize com IA.' }
  ];

  function catalogList(items) {
    return el('div', { class: 'catalog' }, items.map(function (item) {
      return ui.skillCard(item, { categoryLabel: SkillHub.catalog.categoryLabel(item.category) });
    }));
  }

  /* --- Busca global --------------------------------------------------------- */

  function renderResults() {
    if (!refs.results || !refs.sections) return;

    var query = state.query.trim();
    var active = query.length >= MIN_QUERY;

    refs.sections.hidden = active;
    refs.results.hidden = !active;
    if (!active) {
      SkillHub.dom.clear(refs.results);
      return;
    }

    var found = SkillHub.catalog.search(query, 12);
    SkillHub.dom.replace(refs.results, ui.section({
      title: found.length
        ? found.length + ' ' + SkillHub.util.pluralize(found.length, 'resultado', 'resultados') + ' para "' + query + '"'
        : 'Nenhum resultado para "' + query + '"',
      body: found.length
        ? catalogList(found)
        : ui.emptyState({
            icon: 'search',
            title: 'Nada encontrado',
            copy: 'A busca cobre nome, descrição, tags, categoria, autor e ferramentas declaradas. Tente um termo mais curto.',
            action: ui.button({
              label: 'Limpar busca',
              variant: 'secondary',
              onClick: function () {
                state.query = '';
                if (refs.input) refs.input.value = '';
                renderResults();
                if (refs.input) refs.input.focus();
              }
            })
          })
    }));
  }

  function onSearchInput(value) {
    state.query = value;
    renderResults();
  }

  /* --- Seções -------------------------------------------------------------- */

  function hero() {
    var search = ui.searchField({
      id: 'home-search',
      className: 'hero__search',
      label: 'Buscar no catálogo',
      placeholder: 'Buscar skills, prompts, agentes...',
      value: state.query,
      onInput: onSearchInput,
      action: ui.button({
        variant: 'round',
        icon: 'arrow-right',
        ariaLabel: 'Ver resultados da busca',
        onClick: function () {
          if (state.query.trim().length >= MIN_QUERY) renderResults();
          else SkillHub.router.go('claude-skills');
        }
      })
    });
    refs.input = search.__input;

    return el('section', { class: 'hero' }, [
      el('div', { class: 'hero__content' }, [
        ui.eyebrow('Open source'),
        el('h1', { class: 'hero__title' }, 'Skills for a more capable you.'),
        el('p', { class: 'hero__copy' },
          'Um marketplace gratuito de skills, prompts e agentes para Claude, Codex e além. Sem login, sem backend.'),
        search
      ]),
      el('div', { class: 'hero__art' }, SkillHub.icons.heroArt(260))
    ]);
  }

  function categories() {
    return ui.section({
      title: 'Explore por categoria',
      body: el('div', { class: 'grid grid--4' }, CATEGORY_ENTRIES.map(function (entry) {
        return ui.categoryCard({
          href: '#/' + entry.route,
          icon: entry.icon,
          title: entry.title,
          copy: entry.copy
        });
      }))
    });
  }

  function favoritesSection() {
    var ids = SkillHub.catalog.favorites();
    var items = ids.map(SkillHub.catalog.byId).filter(Boolean);
    var node = el('div', { id: 'home-favorites' });
    refs.favorites = node;

    if (!items.length) return node;
    return SkillHub.dom.replace(node, ui.section({
      title: 'Seus favoritos',
      body: catalogList(items)
    }));
  }

  function pitch() {
    return el('section', { class: 'section' }, ui.card({
      paper: true,
      className: 'pitch',
      body: [
        el('h2', { class: 'pitch__title' }, 'Crie skills de maneira rápida e prática'),
        ui.button({
          label: 'Criar uma Skill',
          variant: 'primary',
          iconAfter: 'arrow-right',
          href: '#/skill-builder'
        })
      ]
    }));
  }

  /* --- Página -------------------------------------------------------------- */

  function render() {
    var highlights = SkillHub.catalog.featured(4);
    var sections = el('div', null, [
      categories(),
      favoritesSection(),
      ui.section({
        title: 'Em destaque',
        linkHref: '#/claude-skills',
        body: catalogList(highlights)
      }),
      ui.section({
        title: 'Atualizados recentemente',
        linkHref: '#/agents',
        body: catalogList(SkillHub.catalog.recent(4, highlights.map(function (item) {
          return item.id;
        })))
      }),
      pitch()
    ]);

    var results = el('div', { hidden: true, 'aria-live': 'polite' });

    refs.sections = sections;
    refs.results = results;

    var page = el('div', null, [hero(), results, sections]);
    renderResults();
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
        ui.iconButton({
          icon: 'bookmark',
          ariaLabel: 'Ir para seus favoritos',
          onClick: function () {
            if (!SkillHub.catalog.favorites().length) {
              SkillHub.toast.show('Você ainda não marcou favoritos. Abra uma Skill e use o ícone de marcador.', 'info');
              return;
            }
            if (refs.favorites) refs.favorites.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
      ]
    };
  }

  function focusSearch() {
    if (refs.input) refs.input.focus();
    return Boolean(refs.input);
  }

  SkillHub.pages.home = {
    title: 'Home',
    render: render,
    topbar: topbar,
    focusSearch: focusSearch
  };
})(window.SkillHub);
