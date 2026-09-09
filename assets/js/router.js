/* ==========================================================================
   router.js — SkillHub.router

   Hash router (ADR-002). Um único listener de `hashchange` para toda a vida da
   página, e `teardown()` da rota anterior antes de renderizar a próxima, para
   que listeners não acumulem entre navegações (QA §Performance).
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  var DEFAULT_ROUTE = 'home';

  var routes = Object.create(null);
  var current = null;      // { name, param, definition }
  var started = false;

  /**
   * definition = {
   *   title: string,
   *   render: function (context) -> Node,
   *   topbar: function (context) -> { lead: Node|Node[], actions: Node|Node[] },
   *   teardown: function ()
   * }
   */
  function register(name, definition) {
    routes[name] = definition;
  }

  function parse(hash) {
    var raw = String(hash || '').replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
    return {
      name: parts[0] || DEFAULT_ROUTE,
      param: parts[1] || null
    };
  }

  function currentRoute() {
    return current ? { name: current.name, param: current.param } : null;
  }

  function go(name, param) {
    var hash = '#/' + name + (param ? '/' + encodeURIComponent(param) : '');
    if (window.location.hash === hash) render();
    else window.location.hash = hash;
  }

  function notFound(context) {
    return SkillHub.dom.el('div', null, [
      SkillHub.ui.pageHeader({
        eyebrow: 'Erro 404',
        title: 'Rota não encontrada',
        copy: 'O endereço "#/' + context.name + '" não corresponde a nenhuma área do Skill Hub.'
      }),
      SkillHub.ui.emptyState({
        icon: 'alert',
        title: 'Nada por aqui',
        copy: 'Verifique o link ou volte para a Home para explorar o catálogo.',
        action: SkillHub.ui.button({ label: 'Voltar para a Home', variant: 'primary', href: '#/home' })
      })
    ]);
  }

  function updateNav(name) {
    /* Qualquer elemento da sidebar que aponte para uma rota, não só os links da
       nav: o botão do fim do menu também precisa marcar a rota atual. */
    var links = document.querySelectorAll('.sidebar [data-route]');
    Array.prototype.forEach.call(links, function (link) {
      if (link.dataset.route === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function renderTopbar(definition, context) {
    var lead = document.getElementById('topbar-lead');
    var actions = document.getElementById('topbar-actions');
    if (!lead || !actions) return;

    var config = definition && definition.topbar ? definition.topbar(context) : null;
    SkillHub.dom.replace(lead, config && config.lead ? config.lead : null);
    SkillHub.dom.replace(actions, config && config.actions ? config.actions : null);
  }

  /**
   * Re-renderiza só a topbar da rota atual. O builder usa isto ao trocar de
   * formato, porque o badge da topbar mostra o formato escolhido.
   */
  function refreshTopbar() {
    if (!current || !current.definition) return;
    renderTopbar(current.definition, { name: current.name, param: current.param });
  }

  function render() {
    var app = document.getElementById('app');
    if (!app) return;

    var parsed = parse(window.location.hash);
    var definition = routes[parsed.name];
    var context = { name: parsed.name, param: parsed.param };

    // Desmonta a rota anterior antes de trocar o conteúdo.
    if (current && current.definition && typeof current.definition.teardown === 'function') {
      current.definition.teardown();
    }

    var body = definition ? definition.render(context) : notFound(context);
    SkillHub.dom.replace(app, body);

    current = { name: parsed.name, param: parsed.param, definition: definition || null };

    updateNav(parsed.name);
    renderTopbar(definition, context);

    var title = definition && definition.title ? definition.title : 'Rota não encontrada';
    document.title = title + ' · Skill Hub';

    window.scrollTo({ top: 0, behavior: 'auto' });
    window.requestAnimationFrame(function () {
      app.focus({ preventScroll: true });
    });
  }

  /**
   * Uma rota pode declarar `ownsParam: true` e passar a administrar o próprio
   * parâmetro. A apresentação faz isso: cada passo é um param, e re-renderizar a
   * cada passo destruiria o canvas e a animação da câmera. Aqui o param é
   * atualizado no estado e o render é evitado.
   */
  function onHashChange() {
    var parsed = parse(window.location.hash);
    if (current && current.definition && current.definition.ownsParam === true &&
        current.name === parsed.name) {
      current.param = parsed.param;
      /* A rota é avisada para poder acompanhar uma troca que não partiu dela —
         alguém editando a URL, ou voltar/avançar do navegador. Sem isto o
         estado da página e a URL se separariam em silêncio. */
      if (typeof current.definition.onParam === 'function') {
        current.definition.onParam(parsed.param);
      }
      return;
    }
    render();
  }

  function start() {
    if (started) return;
    started = true;

    window.addEventListener('hashchange', onHashChange);

    // Bootstrap explícito: nunca depende do `hashchange` disparar sozinho.
    if (!window.location.hash) {
      window.location.replace('#/' + DEFAULT_ROUTE);
    }
    render();
  }

  /** A definição registrada de uma rota, ou null. */
  function definition(name) {
    return routes[name] || null;
  }

  SkillHub.router = {
    register: register,
    definition: definition,
    start: start,
    go: go,
    render: render,
    refreshTopbar: refreshTopbar,
    current: currentRoute
  };
})(window.SkillHub);
