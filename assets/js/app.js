/* ==========================================================================
   app.js — bootstrap

   Injeta os ícones da sidebar, registra as rotas, carrega o rascunho do
   builder e inicia o router. É o único arquivo que conhece todos os outros.
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  /* --- Ícones do shell estático --------------------------------------------- */

  /**
   * O shell é HTML estático, mas os ícones vêm do mesmo conjunto SVG do resto do
   * app: qualquer elemento com data-icon recebe o ícone correspondente.
   */
  function mountIcons() {
    var hosts = document.querySelectorAll('.app-shell [data-icon]');
    Array.prototype.forEach.call(hosts, function (host) {
      var name = host.dataset.icon;
      if (!SkillHub.icons.has(name)) return;
      host.insertBefore(SkillHub.icons.get(name), host.firstChild);
    });
  }

  /* --- Sidebar colapsável --------------------------------------------------- */

  /**
   * Estado guardado em skillhub.ui.v1. Com a sidebar recolhida, os rótulos
   * ficam clipados na bitola, então cada link recebe aria-label fixo (nome
   * acessível garantido) e title (dica para o mouse).
   */
  function setupSidebar() {
    var shell = document.querySelector('.app-shell');
    var toggle = document.getElementById('sidebar-toggle');
    if (!shell || !toggle) return;

    var links = document.querySelectorAll('.sidebar [data-route]');
    Array.prototype.forEach.call(links, function (link) {
      var label = link.textContent.trim();
      if (label) {
        link.setAttribute('aria-label', label);
        link.setAttribute('title', label);
      }
    });

    var preferences = SkillHub.store.read(SkillHub.store.KEYS.ui, {});
    if (!preferences || typeof preferences !== 'object') preferences = {};
    var collapsed = Boolean(preferences.sidebarCollapsed);

    function apply(next, persist) {
      collapsed = Boolean(next);
      shell.dataset.sidebar = collapsed ? 'collapsed' : 'expanded';
      toggle.setAttribute('aria-expanded', String(!collapsed));

      var action = collapsed ? 'Expandir menu' : 'Recolher menu';
      toggle.setAttribute('aria-label', action);
      toggle.setAttribute('title', action);

      Array.prototype.forEach.call(links, function (link) {
        if (collapsed) link.setAttribute('title', link.getAttribute('aria-label'));
        else link.removeAttribute('title');
      });

      if (persist) {
        preferences.sidebarCollapsed = collapsed;
        SkillHub.store.write(SkillHub.store.KEYS.ui, preferences);
      }
    }

    apply(collapsed, false);

    // A transição entra só no frame seguinte, para o estado inicial não animar.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { shell.classList.add('is-animated'); });
    });

    toggle.addEventListener('click', function () { apply(!collapsed, true); });
  }

  /* --- Pasta de skills -------------------------------------------------------- */

  var FOLDER_ROUTE = 'skills';

  /**
   * "Skills" no menu é uma pasta recolhível. Ela abre sozinha ao entrar na
   * rota e fecha ao sair; o botão de seta a recolhe e expande a qualquer hora.
   * As categorias saem do que existe de fato (catálogo + skills do mercado),
   * cada uma um link para #/skills/<categoria>.
   *
   * Os sublinks NÃO levam data-route: updateNav marcaria todos como página
   * atual. Quem marca o atual é syncFolder, chamado pela listagem.
   */
  var folder = { open: false, route: null };

  function setFolderOpen(open) {
    var host = document.getElementById('nav-skills');
    var toggle = document.getElementById('nav-skills-toggle');
    if (!host || !toggle) return;
    folder.open = Boolean(open);
    /* O CSS anima a altura por este atributo e tira os links do teclado
       (visibility) quando fechada — por isso não é o atributo hidden. */
    host.dataset.open = String(folder.open);
    toggle.setAttribute('aria-expanded', String(folder.open));
    /* A pasta aberta tem ícone de pasta aberta: é dele que desce a linha guia. */
    var link = document.querySelector('.sidebar [data-route="' + FOLDER_ROUTE + '"]');
    var glyph = link ? link.querySelector('svg') : null;
    if (glyph) link.replaceChild(folder.open ? SkillHub.icons.get('folder-open') : SkillHub.icons.get('folder'), glyph);
    var label = (folder.open ? 'Recolher' : 'Expandir') + ' categorias de skills';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  /** Abre ou fecha uma subárvore (hoje, as subseções de Coding style). */
  function setBranchOpen(branch, open) {
    var body = branch.querySelector('.nav__collapse');
    var twisty = branch.querySelector('.nav__twisty');
    if (!body || !twisty) return;
    body.dataset.open = String(Boolean(open));
    twisty.setAttribute('aria-expanded', String(Boolean(open)));
    var label = (open ? 'Recolher ' : 'Expandir ') + twisty.dataset.label;
    twisty.setAttribute('aria-label', label);
    twisty.setAttribute('title', label);
  }

  /**
   * A árvore da pasta, no padrão do angular.dev: "Visão geral", depois grupos
   * com título (Engenharia, Stacks...) e seus itens; um item com subseções ganha
   * uma seta que abre a subárvore. A estrutura vem de catalog.folderTree — nada
   * de lista de categorias escrita aqui.
   */
  function setupSkillsFolder() {
    var list = document.getElementById('nav-skills-list');
    var toggle = document.getElementById('nav-skills-toggle');
    var config = SkillHub.catalog.collection(FOLDER_ROUTE);
    if (!list || !toggle || !config) return;

    var el = SkillHub.dom.el;

    function link(key, label) {
      return el('a', {
        class: 'nav__sublink',
        href: '#/' + FOLDER_ROUTE + (key === 'all' ? '' : '/' + encodeURIComponent(key)),
        dataset: { category: key }
      }, el('span', null, label));
    }

    function node(item) {
      if (!item.children.length) return el('li', null, link(item.key, item.label));
      var id = 'nav-branch-' + item.key;
      var twisty = el('button', {
        class: 'nav__twisty',
        type: 'button',
        'aria-controls': id,
        'aria-expanded': 'false',
        dataset: { label: 'subseções de ' + item.label }
      }, SkillHub.icons.get('chevron-right'));
      var branch = el('li', {
        class: 'nav__branch',
        dataset: { branch: [item.key].concat(item.children.map(function (child) { return child.key; })).join(' ') }
      }, [
        el('div', { class: 'nav__branch-head' }, [link(item.key, item.label), twisty]),
        el('div', { class: 'nav__collapse', id: id, dataset: { open: 'false' } },
          el('ul', { class: 'nav__tree nav__tree--nested' }, item.children.map(function (child) {
            return el('li', null, link(child.key, child.label));
          })))
      ]);
      twisty.addEventListener('click', function () {
        setBranchOpen(branch, branch.querySelector('.nav__collapse').dataset.open !== 'true');
      });
      setBranchOpen(branch, false);
      return branch;
    }

    SkillHub.dom.replace(list, [link('all', 'Visão geral')].concat(
      SkillHub.catalog.folderTree(config.type).map(function (group) {
        return el('div', { class: 'nav__group' }, [
          el('p', { class: 'nav__group-title' }, group.title),
          el('ul', { class: 'nav__tree' }, group.items.map(node))
        ]);
      })
    ));

    toggle.addEventListener('click', function () { setFolderOpen(!folder.open); });
    setFolderOpen(false);
  }

  /**
   * Chamado pela listagem. Entrar na rota de skills abre a pasta, sair fecha;
   * dentro da rota quem manda é o botão — trocar de categoria não reabre uma
   * pasta que a pessoa acabou de recolher.
   */
  function syncFolder(route, category) {
    var list = document.getElementById('nav-skills-list');
    if (!list) return;
    var inside = route === FOLDER_ROUTE;
    if (inside !== (folder.route === FOLDER_ROUTE)) setFolderOpen(inside);
    folder.route = route;
    Array.prototype.forEach.call(list.querySelectorAll('.nav__sublink'), function (link) {
      if (inside && link.dataset.category === category) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    /* Chegar numa subseção (pelo menu, pela página ou pela URL) abre o ramo
       dela. Sair do ramo não o fecha: quem recolhe é a pessoa. */
    Array.prototype.forEach.call(list.querySelectorAll('.nav__branch'), function (branch) {
      if (inside && branch.dataset.branch.split(' ').indexOf(category) !== -1) setBranchOpen(branch, true);
    });
  }

  SkillHub.shell = { syncFolder: syncFolder };

  /* --- Rotas ---------------------------------------------------------------- */

  function registerRoutes() {
    SkillHub.router.register('home', SkillHub.pages.home);

    var listings = SkillHub.pages.listing.definitions();
    Object.keys(listings).forEach(function (route) {
      SkillHub.router.register(route, listings[route]);
    });

    /* As duas coleções viraram uma. Link antigo não dá 404: cai em #/skills. */
    ['claude-skills', 'codex-skills'].forEach(function (old) {
      SkillHub.router.register(old, {
        title: 'Skills',
        render: function () {
          window.location.replace('#/' + FOLDER_ROUTE);
          return SkillHub.dom.el('div');
        }
      });
    });

    SkillHub.router.register('skill', SkillHub.pages.detail);
    SkillHub.router.register('skill-builder', SkillHub.pages.builder);
    /* Apresentação sem item de sidebar, como #/skill/<id>: a navegação tem
       exatamente seis itens (PRD §5) e a entrada é por link na Home. */
    SkillHub.router.register('coding-styles', SkillHub.pages.codingStyles);
    SkillHub.router.register('trending', SkillHub.pages.trending);
    SkillHub.router.register('what-is-a-skill', SkillHub.pages.deck);
  }

  /* --- Atalhos de teclado --------------------------------------------------- */

  /** "/" foca a busca da página atual; se a página não tem busca, vai listar. */
  function onKeydown(event) {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (SkillHub.util.isTyping()) return;

    var route = SkillHub.router.current();
    var page = route ? SkillHub.router.definition(route.name) : null;
    if (page && typeof page.focusSearch === 'function') {
      event.preventDefault();
      if (page.focusSearch()) return;
    }
    /* Uma rota pode vetar o atalho. Sem isto, "/" numa rota sem busca leva para
       a listagem — o que, no meio de uma apresentação, joga quem apresenta
       fora dela. */
    if (page && page.capturesKeys === true) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    SkillHub.router.go('skills');
  }

  /* --- Boot ----------------------------------------------------------------- */

  /**
   * As fontes são `font-display: swap`: o texto aparece na fonte de sistema e
   * troca quando o arquivo chega. Pedir os dois arquivos já no boot faz a troca
   * acontecer antes de qualquer interação — importa para a apresentação, cujo
   * morph mede a posição do texto e mediria errado se a fonte trocasse no meio.
   * Cada família é um arquivo variável só, então um pedido por família basta.
   */
  function warmFonts() {
    if (!document.fonts || typeof document.fonts.load !== 'function') return;
    ['700 34px Geist', '500 12px "Geist Mono"'].forEach(function (font) {
      document.fonts.load(font).catch(function () { /* cai na fonte de sistema */ });
    });
  }

  function start() {
    warmFonts();
    mountIcons();
    setupSkillsFolder();
    setupSidebar();
    SkillHub.builder.state.load();
    registerRoutes();
    document.addEventListener('keydown', onKeydown);
    SkillHub.router.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.SkillHub);
