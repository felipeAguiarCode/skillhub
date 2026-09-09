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

  /* --- Rotas ---------------------------------------------------------------- */

  function registerRoutes() {
    SkillHub.router.register('home', SkillHub.pages.home);

    var listings = SkillHub.pages.listing.definitions();
    Object.keys(listings).forEach(function (route) {
      SkillHub.router.register(route, listings[route]);
    });

    SkillHub.router.register('skill', SkillHub.pages.detail);
    SkillHub.router.register('skill-builder', SkillHub.pages.builder);
    /* Apresentação sem item de sidebar, como #/skill/<id>: a navegação tem
       exatamente seis itens (PRD §5) e a entrada é por link na Home. */
    SkillHub.router.register('coding-styles', SkillHub.pages.codingStyles);
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
    SkillHub.router.go('claude-skills');
  }

  /* --- Boot ----------------------------------------------------------------- */

  function start() {
    mountIcons();
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
