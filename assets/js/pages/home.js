/* ==========================================================================
   pages/home.js — SkillHub.pages.home

   A home segue a composição de aihero.dev, seção por seção:
   1. hero: título grande, uma frase, dois botões, e três números embaixo de
      uma linha — sem campo de busca dentro dele;
   2. a tese: uma afirmação à esquerda, o argumento à direita;
   3. as skills numa grade de seis células, cada uma com índice, slugs de
      amostra e um "Comece por /slug";
   4. "O que você quer fazer?": à esquerda a pergunta, à direita as respostas
      em linhas com etiqueta de tipo.
   Em tela larga a home também troca a moldura: o menu lateral sai e os links
   vão para o cabeçalho, as seções vão de borda a borda e uma faixa de anúncio
   abre a página (atributo data-home na shell, posto aqui e tirado no teardown,
   como o data-deck da apresentação — nenhuma preferência é gravada).

   Depois vêm o que é só daqui: a busca global, favoritos, destaques e a
   chamada para o builder.

   O texto, os números e a arte são do Skill Hub. Todo número é contagem real
   do que o app carrega, e toda linha aponta para algo que existe.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var MIN_QUERY = 2;
  var SKILL_TYPES = ['claude-skill', 'codex-skill'];
  /* Quantas categorias viram célula na grade, e quantos slugs cabem em cada. */
  var GRID_CELLS = 6;
  var CELL_SLUGS = 5;
  /* Quantas respostas cada pergunta mostra. */
  var ANSWERS = 3;

  /* Espelhado no campo de busca: o input lê deste estado, nunca o contrário. */
  var state = { query: '' };

  var refs = { results: null, sections: null, input: null, favorites: null };

  /* Os destinos do cabeçalho da home. Os mesmos da sidebar, na mesma ordem. */
  var TOP_LINKS = [
    { label: 'Trendings', href: '#/trending' },
    { label: 'Skills', href: '#/skills' },
    { label: 'Prompts', href: '#/prompt-engineering' },
    { label: 'Coding Styles', href: '#/coding-styles' },
    { label: 'Agentes', href: '#/agents' },
    { label: 'Skill Builder', href: '#/skill-builder' }
  ];

  function skills() {
    return SkillHub.catalog.byType(SKILL_TYPES);
  }

  function catalogList(items) {
    return el('div', { class: 'catalog' }, items.map(function (item) {
      return ui.skillCard(item, {
        categoryLabel: SkillHub.catalog.categoryLabel(item.category),
        favorite: SkillHub.catalog.isFavorite(item.id)
      });
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

  /* --- Faixa de anúncio --------------------------------------------------------- */

  function announcement() {
    var market = SkillHub.catalog.marketSkills('all').length;
    return el('a', { class: 'announce', href: '#/skills' }, [
      el('span', { class: 'badge badge--accent' }, el('span', null, 'Novo')),
      el('span', null, market + ' skills do mercado, por categoria, com link oficial.'),
      SkillHub.icons.get('arrow-right', 'icon--sm announce__arrow')
    ]);
  }

  /* --- 1. Hero ---------------------------------------------------------------- */

  /** Contagens reais, tiradas do que o app carrega. Nada de métrica de uso. */
  function stats() {
    return el('div', { class: 'stats hero__stats' }, [
      ui.stat({ value: skills().length, label: 'Skills do catálogo' }),
      ui.stat({ value: SkillHub.catalog.marketSkills('all').length, label: 'Skills do mercado' }),
      ui.stat({ value: (window.SKILL_HUB_CODING_STYLES || []).length, label: 'Guias de estilo' })
    ]);
  }

  function hero() {
    return el('section', { class: 'hero' }, [
      el('div', { class: 'hero__content' }, [
        el('h1', { class: 'hero__title' }, 'Skills for a more capable you.'),
        el('p', { class: 'hero__copy' },
          'O processo de engenharia que você já segue, escrito num arquivo que o agente lê. ' +
          'Para Claude Code e Codex, do pedido vago ao código revisado.'),
        /* O único preenchido da tela: criar é a ação que o Skill Hub tem de
           próprio. O segundo botão é só contorno, para não competir. */
        el('div', { class: 'hero__actions' }, [
          ui.button({
            label: 'Criar uma Skill',
            variant: 'primary',
            className: 'btn--lg',
            href: '#/skill-builder'
          }),
          ui.button({
            label: 'Ver as skills',
            variant: 'outline',
            className: 'btn--lg',
            iconAfter: 'arrow-right',
            href: '#/skills'
          })
        ]),
        stats()
      ]),
      el('div', { class: 'hero__art' }, SkillHub.icons.heroArt())
    ]);
  }

  /* --- 2. A tese ---------------------------------------------------------------- */

  function statement() {
    return el('section', { class: 'section statement' }, [
      el('h2', { class: 'statement__title' }, 'Agente sem processo escreve código plausível.'),
      el('div', { class: 'statement__body' }, [
        el('p', null,
          'Um agente de código é rápido, e é exatamente por isso que o que você pede a ele importa mais. ' +
          'Sem um processo, ele entrega algo que compila, parece certo e piora a base aos poucos.'),
        el('p', null,
          'Uma Skill é esse processo por escrito: quando usar, em que ordem, o que conferir antes de dizer ' +
          'que acabou. O agente segue do mesmo jeito toda vez, e você revisa o arquivo uma vez só.'),
        el('p', null,
          'O Skill Hub mostra cada arquivo inteiro antes de qualquer cópia, e nunca executa conteúdo de Skill.')
      ])
    ]);
  }

  /* --- 3. Skills por categoria ---------------------------------------------------- */

  /** As categorias com mais skills, cada uma com alguns slugs de amostra. */
  function categoryCells() {
    var byCategory = Object.create(null);
    skills().forEach(function (item) {
      (byCategory[item.category] = byCategory[item.category] || []).push(item);
    });

    return Object.keys(byCategory).sort(function (a, b) {
      return byCategory[b].length - byCategory[a].length ||
        SkillHub.catalog.categoryLabel(a).localeCompare(SkillHub.catalog.categoryLabel(b));
    }).slice(0, GRID_CELLS).map(function (key, index) {
      var items = byCategory[key];
      var first = items[0];
      var label = SkillHub.catalog.categoryLabel(key);
      return el('article', { class: 'cell' + (index === 0 ? ' cell--lead' : '') }, [
        el('div', { class: 'cell__top' }, [
          el('span', { class: 'section__index', 'aria-hidden': 'true' }, '0' + (index + 1)),
          el('h3', { class: 'cell__title' },
            el('a', { href: '#/skills/' + encodeURIComponent(key) }, label))
        ]),
        el('p', { class: 'cell__desc' },
          items.length + ' ' + SkillHub.util.pluralize(items.length, 'skill', 'skills') + ' nesta categoria.'),
        el('div', { class: 'chips' }, items.slice(0, CELL_SLUGS).map(function (item) {
          return el('span', { class: 'chip chip--static' }, SkillHub.formats.slug(item.format, item.id));
        })),
        /* "Comece por": leva à skill, não à categoria — a categoria é o título. */
        el('a', { class: 'cell__link', href: '#/skill/' + encodeURIComponent(first.id) }, [
          el('span', null, 'Comece por ' + SkillHub.formats.slug(first.format, first.id)),
          SkillHub.icons.get('arrow-right', 'icon--sm')
        ])
      ]);
    });
  }

  function skillsGrid() {
    var total = skills().length;
    return ui.section({
      large: true,
      title: 'Um processo de engenharia, em skills instaláveis',
      description: 'Toda skill aqui é gratuita e vem com o arquivo aberto. Comece por qualquer categoria.',
      linkHref: '#/skills',
      linkLabel: 'Ver as ' + total + ' skills',
      linkButton: true,
      body: el('div', { class: 'cells' }, categoryCells())
    });
  }

  /* --- 4. Por intenção ---------------------------------------------------------- */

  function answerRow(tag, title, href, external) {
    return el('a', {
      class: 'answer',
      href: href,
      target: external ? '_blank' : null,
      rel: external ? 'noopener noreferrer' : null
    }, [
      el('span', { class: 'badge answer__tag' }, el('span', null, tag)),
      el('span', { class: 'answer__title' }, title),
      external ? el('span', { class: 'u-sr-only' }, '(abre em nova aba)') : null,
      SkillHub.icons.get(external ? 'external' : 'arrow-right', 'answer__arrow')
    ]);
  }

  /** Uma pergunta à esquerda, suas respostas à direita. */
  function question(opts) {
    return el('div', { class: 'question' }, [
      el('div', { class: 'question__ask' }, [
        el('span', { class: 'badge' }, el('span', null, opts.kicker)),
        el('h3', { class: 'question__title' }, opts.title),
        el('a', { class: 'section__link', href: opts.moreHref }, [
          el('span', null, opts.moreLabel),
          SkillHub.icons.get('arrow-right', 'icon--sm')
        ])
      ]),
      el('div', { class: 'question__answers' }, opts.answers)
    ]);
  }

  function intents() {
    /* As respostas saem do dado, não de uma lista escrita à mão: os três
       primeiros guias completos, e as três primeiras trendings. */
    var guides = (window.SKILL_HUB_CODING_STYLES || []).filter(function (guide) {
      return guide.depth === 'full';
    }).slice(0, ANSWERS);
    var trending = (window.SKILL_HUB_TRENDING || []).slice(0, ANSWERS);

    return ui.section({
      large: true,
      title: 'O que você quer fazer?',
      description: 'Escolha pelo que precisa agora, não pelo tipo de arquivo.',
      linkHref: '#/skills',
      linkLabel: 'Ver tudo',
      linkButton: true,
      body: el('div', { class: 'questions' }, [
        question({
          kicker: 'Entender',
          title: 'O que é uma Skill, e como o agente a carrega?',
          moreHref: '#/what-is-a-skill',
          moreLabel: 'Abrir a apresentação',
          answers: [
            answerRow('Slides', 'O que é uma Skill, em doze slides', '#/what-is-a-skill'),
            answerRow('Exemplo', 'API Reviewer, a skill usada de exemplo', '#/skill/api-reviewer'),
            answerRow('Builder', 'Montar a sua, passo a passo', '#/skill-builder')
          ]
        }),
        question({
          kicker: 'Padronizar',
          title: 'Como faço o agente escrever no meu padrão?',
          moreHref: '#/coding-styles',
          moreLabel: 'Mais em Coding Styles',
          answers: guides.map(function (guide) {
            return answerRow('Guia', guide.title, '#/coding-styles/' + encodeURIComponent(guide.id));
          })
        }),
        question({
          kicker: 'Descobrir',
          title: 'O que os outros devs estão usando?',
          moreHref: '#/trending',
          moreLabel: 'Ver as Trendings',
          answers: trending.map(function (entry) {
            return answerRow('Mercado', entry.name + ', de ' + entry.author, entry.url, true);
          })
        })
      ])
    });
  }

  /* --- O que é só daqui ---------------------------------------------------------- */

  /* A busca global sai do hero e ganha uma seção: é o que o "/" e o ícone da
     topbar focam. */
  function searchBand() {
    var search = ui.searchField({
      id: 'home-search',
      className: 'home__search',
      label: 'Buscar no catálogo',
      placeholder: 'Buscar skills, prompts, agentes...',
      value: state.query,
      kbd: '/',
      onInput: onSearchInput
    });
    refs.input = search.__input;
    return el('div', { class: 'home__searchband' }, search);
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

  /* O primário da tela é o do hero; aqui o convite se repete sem competir. */
  function cta() {
    return el('div', { class: 'home__cta' }, ui.banner({
      eyebrow: 'Skill Builder',
      title: 'Tem um passo a passo que você repete?',
      copy: 'Transforme em Skill. O builder gera o arquivo no formato da ferramenta e mostra o risco de cada escolha antes de exportar.',
      action: ui.button({
        label: 'Abrir o Skill Builder',
        variant: 'outline',
        className: 'btn--lg',
        iconAfter: 'arrow-right',
        href: '#/skill-builder'
      })
    }));
  }

  /* --- Página -------------------------------------------------------------- */

  function render() {
    var sections = el('div', { class: 'home__sections' }, [
      statement(),
      skillsGrid(),
      intents(),
      favoritesSection(),
      ui.section({
        title: 'Em destaque',
        description: 'Escolhidas pela curadoria do catálogo.',
        linkHref: '#/skills',
        body: catalogList(SkillHub.catalog.featured(4))
      }),
      cta()
    ]);

    var results = el('div', { class: 'home__results', hidden: true, 'aria-live': 'polite' });

    refs.sections = sections;
    refs.results = results;

    var page = el('div', { class: 'home' }, [announcement(), hero(), searchBand(), results, sections]);
    renderResults();

    /* Só depois de a página existir: se algo acima lançar, a shell não fica
       presa na moldura da home sem rota nenhuma para desfazer. */
    var shell = document.querySelector('.app-shell');
    if (shell) shell.dataset.home = 'on';
    return page;
  }

  function teardown() {
    var shell = document.querySelector('.app-shell');
    if (shell) delete shell.dataset.home;
    refs = { results: null, sections: null, input: null, favorites: null };
  }

  function topbar() {
    return {
      /* Marca e links: aparecem só onde a sidebar saiu (CSS), então em tela
         estreita a navegação continua sendo a da sidebar. */
      lead: el('nav', { class: 'topnav', 'aria-label': 'Navegação da home' }, [
        el('a', { class: 'brand topnav__brand', href: '#/home', 'aria-label': 'Skill Hub, página inicial' }, [
          el('span', { class: 'brand__mark', 'aria-hidden': 'true' }, '/'),
          el('span', { 'aria-hidden': 'true' }, 'skill-hub')
        ])
      ].concat(TOP_LINKS.map(function (link) {
        return el('a', { class: 'topnav__link', href: link.href }, link.label);
      }))),
      actions: [
        ui.iconButton({
          icon: 'search',
          ariaLabel: 'Focar a busca',
          onClick: function () { if (refs.input) refs.input.focus(); }
        }),
        ui.iconButton({
          icon: 'star',
          ariaLabel: 'Ir para seus favoritos',
          onClick: function () {
            if (!SkillHub.catalog.favorites().length) {
              SkillHub.toast.show('Você ainda não marcou favoritos. Abra uma Skill e use a estrela.', 'info');
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
    teardown: teardown,
    focusSearch: focusSearch
  };
})(window.SkillHub);
