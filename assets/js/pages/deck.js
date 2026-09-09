/* ==========================================================================
   pages/deck.js — SkillHub.pages.deck

   A apresentação "O que é uma Skill" (#/what-is-a-skill/<passo>).

   Um canvas com todos os quadros e uma câmera que voa entre eles. O quadro tem
   o tamanho da área útil, então um passo que enquadra um quadro inteiro fica em
   escala 1: em repouso isto é uma página responsiva comum, e a câmera só
   acrescenta o movimento. É o que dispensa um segundo renderizador para telas
   estreitas.

   Três detalhes que não são óbvios e que quebram a página se mudarem:

   1. `render()` devolve uma árvore DESTACADA — o router só a insere depois. Por
      isso medir tem de acontecer num requestAnimationFrame, e não no render.
   2. `data-deck` na shell é posto DEPOIS de tudo que pode lançar. Se fosse
      antes, uma exceção deixaria a shell recolhida sem nenhuma rota que
      chamasse o teardown, e só recarregar a página resolveria.
   3. A transição da câmera entra um frame depois do primeiro enquadramento,
      senão abrir a apresentação começaria com um voo indesejado.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;
  var camera = SkillHub.deck.camera;
  var content = SkillHub.deck.steps;

  /* Espaçamento da grade do canvas, em múltiplos do quadro. */
  var COL_GAP = 1.14;
  var ROW_GAP = 1.18;

  /* Roda do mouse: quanto acumular antes de trocar de passo, e quanto tempo de
     silêncio encerra o gesto. O cooldown é do domínio da ENTRADA, não do
     movimento — atrelá-lo à duração da câmera criaria uma zona morta de 900ms
     justamente para quem pediu movimento reduzido, que não tem voo nenhum. */
  var WHEEL_THRESHOLD = 140;
  var WHEEL_IDLE = 200;

  /* Duração do voo: os valores vivem em 01-tokens.css e são LIDOS daqui, não
     copiados. Repetir 420/900 no JS criaria duas fontes de verdade para o mesmo
     valor visual, que é exatamente o que a ADR-005 proíbe. */
  var motion = { min: 420, max: 900 };

  var refs = {
    root: null, viewport: null, canvas: null, live: null,
    chapter: null, caption: null, count: null, progress: null,
    prev: null, next: null, map: null, overview: null
  };

  var steps = [];
  var frameNodes = {};
  var shots = [];
  var index = 0;
  var mounted = false;
  var overview = false;
  var inset = 32;

  var rafMount = 0;
  var rafFlight = 0;
  var wheelDelta = 0;
  var wheelTimer = 0;
  var pointerStart = null;

  /* --- Geometria ------------------------------------------------------------ */

  function viewportSize() {
    if (!refs.viewport) return { w: 0, h: 0 };
    return { w: refs.viewport.clientWidth, h: refs.viewport.clientHeight };
  }

  /** Lê um token de medida do canvas. Devolve o padrão se não der para ler. */
  function readToken(name, fallback) {
    if (!refs.canvas || typeof window.getComputedStyle !== 'function') return fallback;
    var value = parseFloat(window.getComputedStyle(refs.canvas).getPropertyValue(name));
    return isFinite(value) && value >= 0 ? value : fallback;
  }

  function readTokens() {
    inset = readToken('--deck-inset', inset);
    motion = {
      min: readToken('--duration-camera', motion.min),
      max: readToken('--duration-camera-max', motion.max)
    };
  }

  /**
   * Dimensiona quadro e canvas a partir do viewport. Roda na montagem e a cada
   * resize: é o que mantém a promessa de escala 1 em qualquer largura.
   */
  function layout(frames) {
    var size = viewportSize();
    if (!size.w || !size.h) return;

    readTokens();
    var frameW = Math.max(120, size.w - inset * 2);
    var frameH = Math.max(120, size.h - inset * 2);

    var spanX = 1;
    var spanY = 1;
    frames.forEach(function (frame) {
      spanX = Math.max(spanX, frame.col * COL_GAP + (frame.spanX || 1));
      spanY = Math.max(spanY, frame.row * ROW_GAP + (frame.spanY || 1));
    });

    refs.canvas.style.setProperty('--deck-frame-w', frameW + 'px');
    refs.canvas.style.setProperty('--deck-frame-h', frameH + 'px');
    refs.canvas.style.setProperty('--deck-canvas-w', Math.ceil(spanX * frameW) + 'px');
    refs.canvas.style.setProperty('--deck-canvas-h', Math.ceil(spanY * frameH) + 'px');
  }

  /** Resolve o alvo de cada passo num enquadramento. */
  function measure() {
    var size = viewportSize();
    shots = steps.map(function (step) {
      var frame = frameNodes[step.frame];
      if (!frame) return null;
      var node = frame;
      if (step.target) {
        node = frame.querySelector('[data-target="' + step.target + '"]') || frame;
      }
      var rect = camera.measure(node, refs.canvas);
      return camera.frame(rect, size, {
        inset: inset,
        rotate: step.rotate || 0,
        kMin: step.kMin,
        kMax: step.kMax
      });
    });
  }

  /* --- Câmera --------------------------------------------------------------- */

  function applyShot(target, animate) {
    var shot = shots[target];
    /* Sem enquadramento válido a câmera fica onde está: mexer com valor inválido
       produziria `scale(NaN)`, que o CSSOM descarta em silêncio — a câmera
       pararia de responder sem nenhum erro no console. */
    if (!shot) return;

    var transform = camera.toTransform(shot);
    if (!transform) return;

    if (!animate) {
      refs.canvas.classList.remove('is-animated');
      refs.canvas.style.setProperty('transform', transform);
      window.cancelAnimationFrame(rafFlight);
      rafFlight = window.requestAnimationFrame(function () {
        if (!mounted) return;
        rafFlight = window.requestAnimationFrame(function () {
          if (!mounted) return;
          refs.canvas.classList.add('is-animated');
        });
      });
      return;
    }

    var duration = camera.flightDuration(shots[index], shot, viewportSize(), motion);
    refs.canvas.style.setProperty('transition-duration', duration + 'ms');
    refs.canvas.style.setProperty('transform', transform);
  }

  /* --- Estado visível ------------------------------------------------------- */

  function setCurrentFrame(target) {
    var activeFrame = steps[target] ? steps[target].frame : null;
    Object.keys(frameNodes).forEach(function (id) {
      var node = frameNodes[id];
      var isCurrent = id === activeFrame;
      node.dataset.current = isCurrent ? 'true' : 'false';
      node.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
      /* Um quadro escondido não pode conter parada de tabulação. Os links são
         nossos e não têm tabindex de autor, então remover o atributo devolve a
         focabilidade natural — nada de guardar valor original. */
      var focusable = node.querySelectorAll('a[href], button');
      Array.prototype.forEach.call(focusable, function (item) {
        if (isCurrent) item.removeAttribute('tabindex');
        else item.setAttribute('tabindex', '-1');
      });
    });

    /* Realce do trecho do arquivo que a câmera está enquadrando. */
    var codeFrame = frameNodes.code;
    if (codeFrame) {
      var wanted = steps[target] && steps[target].frame === 'code'
        ? steps[target].target : null;
      var groups = codeFrame.querySelectorAll('.deck__group');
      Array.prototype.forEach.call(groups, function (group) {
        group.dataset.focus = wanted && group.dataset.group === wanted ? 'true' : 'false';
      });
    }
  }

  function syncBar(target) {
    var step = steps[target];
    if (!step) return;
    refs.chapter.textContent = step.chapter;
    refs.caption.textContent = step.caption;
    refs.count.textContent = (target + 1) + ' / ' + steps.length;
    refs.progress.style.setProperty('width', ((target + 1) / steps.length * 100) + '%');
    refs.prev.disabled = target === 0;
    refs.next.disabled = target === steps.length - 1;
    if (refs.map) syncMap(target);
  }

  function announce(target) {
    var step = steps[target];
    if (!refs.live || !step) return;
    refs.live.textContent = 'Passo ' + (target + 1) + ' de ' + steps.length +
      ' · ' + step.chapter + ' · ' + step.caption;
  }

  /**
   * Mantém a URL no passo atual sem re-renderizar.
   *
   * `location.replace` em vez de `replaceState`: funciona igual em file:// e em
   * http:// (replaceState com URL lança SecurityError em file:// no Chrome),
   * não enche o histórico com 20 entradas, e o F5 volta no passo certo. O
   * router ignora troca só de parâmetro em rota que declara `ownsParam`.
   */
  function syncHash(target) {
    var wanted = '#/what-is-a-skill/' + (target + 1);
    if (window.location.hash === wanted) return;
    window.location.replace(wanted);
  }

  function go(target, animate) {
    if (!mounted) return;
    var next = Math.min(steps.length - 1, Math.max(0, target));
    applyShot(next, animate !== false);
    index = next;
    setCurrentFrame(next);
    syncBar(next);
    announce(next);
    syncHash(next);
  }

  /* --- Visão geral ---------------------------------------------------------- */

  function syncMap(target) {
    var items = refs.map.querySelectorAll('.deck__map-item');
    Array.prototype.forEach.call(items, function (item, position) {
      item.setAttribute('aria-current', position === target ? 'true' : 'false');
    });
  }

  function buildMap() {
    var list = el('ul', { class: 'deck__map-list' }, steps.map(function (step, position) {
      return el('li', null, ui.button({
        className: 'deck__map-item',
        ariaLabel: 'Ir para o passo ' + (position + 1) + ': ' + step.chapter,
        onClick: function () {
          closeOverview();
          go(position);
        },
        label: null
      }));
    }));
    /* ui.button monta o rótulo como texto simples; aqui o item tem duas linhas,
       então o conteúdo é montado por fora. */
    var buttons = list.querySelectorAll('.deck__map-item');
    Array.prototype.forEach.call(buttons, function (button, position) {
      var step = steps[position];
      button.appendChild(el('span', { class: 'deck__map-title' },
        (position + 1) + '. ' + step.chapter));
      button.appendChild(el('span', { class: 'deck__map-meta' }, step.caption));
    });

    return el('div', {
      class: 'deck__map',
      role: 'group',
      'aria-label': 'Mapa da apresentação'
    }, list);
  }

  function openOverview() {
    if (overview || !mounted) return;
    overview = true;
    refs.root.dataset.overview = 'true';
    if (refs.overview) refs.overview.setAttribute('aria-pressed', 'true');

    refs.map = buildMap();
    refs.viewport.appendChild(refs.map);
    syncMap(index);

    var shot = camera.fitAll(refs.canvas, viewportSize(), { inset: inset, kMin: 0.01 });
    if (shot) {
      var transform = camera.toTransform(shot);
      if (transform) refs.canvas.style.setProperty('transform', transform);
    }

    var current = refs.map.querySelectorAll('.deck__map-item')[index];
    if (current) current.focus();
  }

  function closeOverview() {
    if (!overview) return;
    overview = false;
    delete refs.root.dataset.overview;
    if (refs.overview) refs.overview.setAttribute('aria-pressed', 'false');
    if (refs.map && refs.map.parentNode) refs.map.parentNode.removeChild(refs.map);
    refs.map = null;
    applyShot(index, true);
    if (refs.viewport) refs.viewport.focus({ preventScroll: true });
  }

  function toggleOverview() {
    if (overview) closeOverview();
    else openOverview();
  }

  /* --- Entrada -------------------------------------------------------------- */

  var NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
  var PREV_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp'];

  function onKeydown(event) {
    if (!mounted) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (SkillHub.util.isTyping()) return;

    /* Espaço num botão focado já é "ativar": sem isto o clique do botão e este
       handler disparariam juntos e a apresentação andaria dois passos. */
    var tag = event.target && event.target.tagName;
    if (event.key === ' ' && (tag === 'BUTTON' || tag === 'A')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      if (overview) closeOverview();
      else SkillHub.router.go('home');
      return;
    }
    if (event.key === 'o' || event.key === 'O') {
      event.preventDefault();
      toggleOverview();
      return;
    }
    if (overview) return;

    if (NEXT_KEYS.indexOf(event.key) !== -1) {
      event.preventDefault();
      go(index + 1);
      return;
    }
    if (PREV_KEYS.indexOf(event.key) !== -1) {
      event.preventDefault();
      go(index - 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      go(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      go(steps.length - 1);
    }
  }

  /**
   * Roda e trackpad. `deltaMode` normalizado porque o Firefox reporta linhas
   * (±3 por clique) e o Chrome pixels (±100): um limiar calibrado num exigiria
   * catorze voltas no outro.
   */
  function onWheel(event) {
    if (!mounted || overview) return;
    event.preventDefault();

    var delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= 400;

    wheelDelta += delta;
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(function () { wheelDelta = 0; }, WHEEL_IDLE);

    if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) return;
    go(index + (wheelDelta > 0 ? 1 : -1));
    wheelDelta = 0;
  }

  function onPointerDown(event) {
    if (event.pointerType === 'mouse') return;
    pointerStart = { x: event.clientX, y: event.clientY, at: Date.now() };
  }

  function onPointerUp(event) {
    if (!pointerStart || !mounted || overview) { pointerStart = null; return; }
    var dx = event.clientX - pointerStart.x;
    var dy = event.clientY - pointerStart.y;
    var elapsed = Date.now() - pointerStart.at;
    pointerStart = null;
    /* Horizontal, decidido, e rápido: qualquer coisa fora disso é rolagem ou
       pinça, e o toque continua com pan-y e zoom por pinça disponíveis. */
    if (elapsed > 700) return;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(index + (dx < 0 ? 1 : -1));
  }

  function onClick(event) {
    if (!mounted || overview) return;
    if (event.target.closest('button, a, .deck__bar')) return;
    go(index + 1);
  }

  var onResize = SkillHub.util.debounce(function () {
    if (!mounted) return;
    layout(currentFrames);
    measure();
    applyShot(index, false);
  }, 150);

  /* --- Montagem ------------------------------------------------------------- */

  var currentFrames = [];

  function buildFrame(frame, item) {
    var node = el('section', {
      class: 'deck__frame' + (frame.hero ? ' deck__frame--hero' : ''),
      dataset: { frame: frame.id, current: 'false' },
      'aria-hidden': 'true',
      style: {
        '--deck-col': String(frame.col),
        '--deck-row': String(frame.row),
        '--deck-span-x': String(frame.spanX || 1),
        '--deck-span-y': String(frame.spanY || 1)
      }
    }, frame.build(item));
    frameNodes[frame.id] = node;
    return node;
  }

  function startStep(context) {
    var raw = parseInt(context && context.param, 10);
    if (!isFinite(raw)) return 0;
    return Math.min(steps.length - 1, Math.max(0, raw - 1));
  }

  function render(context) {
    var item = SkillHub.catalog.byId(content.EXAMPLE_ID);
    if (!item || !item.content) {
      /* O arquivo de estudo é lido do catálogo. Se a entrada sumir, a
         apresentação diz isso em vez de renderizar um capítulo vazio. */
      return el('div', { class: 'page-pad' }, ui.emptyState({
        icon: 'alert',
        title: 'Apresentação indisponível',
        copy: 'O exemplo "' + content.EXAMPLE_ID + '" não está no catálogo, e o capítulo de anatomia depende dele.',
        action: ui.button({ label: 'Ver o catálogo', variant: 'primary', href: '#/claude-skills' })
      }));
    }

    frameNodes = {};
    steps = content.steps();
    currentFrames = content.frames(item, {
      claude: SkillHub.catalog.byType('claude-skill').length
    });

    var canvas = el('div', { class: 'deck__canvas' },
      currentFrames.map(function (frame) { return buildFrame(frame, item); }));

    var viewport = el('div', {
      class: 'deck__viewport',
      tabindex: '-1',
      onWheel: onWheel,
      onPointerDown: onPointerDown,
      onPointerUp: onPointerUp,
      onClick: onClick
    }, canvas);

    var progress = el('div', { class: 'deck__progress-fill' });
    var chapter = el('span', { class: 'deck__chapter' }, '');
    var caption = el('p', { class: 'deck__caption u-clamp-2' }, '');
    var count = el('span', { class: 'deck__count' }, '');

    var prev = ui.button({
      label: 'Voltar', variant: 'ghost', icon: 'chevron-left',
      onClick: function () { go(index - 1); }
    });
    var next = ui.button({
      label: 'Avançar', variant: 'primary', iconAfter: 'chevron-right',
      onClick: function () { go(index + 1); }
    });

    var bar = el('div', { class: 'deck__bar' }, [
      el('div', { class: 'deck__bar-meta' }, [
        el('div', { class: 'deck__bar-head' }, [chapter, count]),
        caption,
        el('div', { class: 'deck__progress' }, progress)
      ]),
      el('div', { class: 'deck__nav' }, [prev, next])
    ]);

    var live = el('p', { class: 'u-sr-only', role: 'status' }, '');

    var root = el('div', { class: 'deck' }, [viewport, bar, live]);

    refs.root = root;
    refs.viewport = viewport;
    refs.canvas = canvas;
    refs.live = live;
    refs.chapter = chapter;
    refs.caption = caption;
    refs.count = count;
    refs.progress = progress;
    refs.prev = prev;
    refs.next = next;

    index = startStep(context);
    mounted = true;

    /* Remove antes de adicionar: se um teardown for perdido, isto evita dois
       handlers e cada tecla andando dois passos. */
    document.removeEventListener('keydown', onKeydown);
    document.addEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    window.addEventListener('resize', onResize);

    /* A árvore ainda está destacada: medir aqui daria zero em tudo. O primeiro
       frame mede e enquadra sem animação; o segundo liga a transição e anuncia
       (região viva populada no mesmo frame em que nasce não é lida). */
    window.cancelAnimationFrame(rafMount);
    rafMount = window.requestAnimationFrame(function () {
      if (!mounted) return;
      var shell = document.querySelector('.app-shell');
      /* O modo apresentação tem de valer ANTES de medir: é ele que torna .page
         um contêiner flex, e sem isso o viewport tem altura zero, o
         enquadramento não fecha e a câmera fica na identidade.

         O try/catch é o que mantém a garantia de não travar o app: se algo aqui
         lançar, a shell volta ao normal. Sem isso, uma exceção deixaria a
         sidebar recolhida sem nenhuma rota que chamasse o teardown, e só
         recarregar a página resolveria. */
      try {
        if (shell) shell.dataset.deck = 'on';
        layout(currentFrames);
        measure();
        applyShot(index, false);
        setCurrentFrame(index);
        syncBar(index);
        syncHash(index);
      } catch (error) {
        if (shell) delete shell.dataset.deck;
        throw error;
      }
      /* A região viva populada no mesmo frame em que nasce não é anunciada. */
      rafMount = window.requestAnimationFrame(function () {
        if (!mounted) return;
        announce(index);
      });
    });

    return root;
  }

  /**
   * O router chama isto quando o parâmetro muda sem partir da apresentação —
   * URL editada à mão, ou voltar/avançar. Comparar com o passo atual evita
   * laço: o syncHash do próprio go() também dispara hashchange.
   */
  function onParam(param) {
    if (!mounted) return;
    var target = parseInt(param, 10);
    if (!isFinite(target)) return;
    var wanted = Math.min(steps.length - 1, Math.max(0, target - 1));
    if (wanted === index) return;
    go(wanted);
  }

  function topbar() {
    return {
      lead: el('span', { class: 'u-row' }, [
        SkillHub.icons.get('sparkle', 'icon--sm'),
        el('span', null, 'O que é uma Skill')
      ]),
      actions: [
        ui.iconButton({
          icon: 'layers',
          ariaLabel: 'Mostrar o mapa da apresentação',
          title: 'Mapa (O)',
          pressed: false,
          onClick: toggleOverview
        }),
        ui.button({
          label: 'Criar uma Skill', variant: 'secondary', className: 'deck__topbar-cta',
          iconAfter: 'arrow-right', href: '#/skill-builder'
        }),
        ui.iconButton({
          icon: 'x',
          ariaLabel: 'Sair da apresentação',
          title: 'Sair (Esc)',
          onClick: function () { SkillHub.router.go('home'); }
        })
      ]
    };
  }

  /* --- Saída ---------------------------------------------------------------- */

  function teardown() {
    /* Primeiro de tudo: todo callback assíncrono checa isto e desiste. */
    mounted = false;
    overview = false;

    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    /* O resize é debounced: sem cancelar, um callback pendente rodaria depois do
       teardown contra referências nulas — e erro de console reprova a DoD. */
    onResize.cancel();

    window.cancelAnimationFrame(rafMount);
    window.cancelAnimationFrame(rafFlight);
    window.clearTimeout(wheelTimer);
    rafMount = 0;
    rafFlight = 0;
    wheelTimer = 0;
    wheelDelta = 0;
    pointerStart = null;

    /* Nunca deixar a shell recolhida sem apresentação na tela. Note que nada
       aqui escreve em skillhub.ui.v1: a preferência real da sidebar volta a
       valer sozinha, porque só o data-deck foi tocado. */
    var shell = document.querySelector('.app-shell');
    if (shell) delete shell.dataset.deck;

    Object.keys(refs).forEach(function (key) { refs[key] = null; });
    frameNodes = {};
    currentFrames = [];
    steps = [];
    shots = [];
  }

  SkillHub.pages.deck = {
    title: 'O que é uma Skill',
    render: render,
    topbar: topbar,
    teardown: teardown,
    onParam: onParam,
    /* A apresentação administra o próprio parâmetro: trocar de passo não pode
       re-renderizar, senão o canvas e o voo em curso seriam destruídos. */
    ownsParam: true,
    /* E reivindica o teclado, para o atalho "/" não levar quem apresenta para a
       listagem no meio de uma apresentação. */
    capturesKeys: true,
    focusSearch: function () { return true; }
  };
})(window.SkillHub);
