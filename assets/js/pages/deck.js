/* ==========================================================================
   pages/deck.js — SkillHub.pages.deck

   A apresentação "O que é uma Skill" como keynote: um slide de cada vez, e a
   troca entre eles é o Morph (deck/morph.js). Sem canvas e sem câmera: cada
   slide é uma página responsiva a 1:1, o que mantém o texto nítido em qualquer
   largura e dispensa um segundo renderizador para o celular.

   Cinco coisas aqui são delicadas e já custaram tempo antes:

   1. `render()` devolve árvore DESTACADA. O router só insere depois, então
      medir (e o morph mede) só funciona dentro de um requestAnimationFrame.

   2. `data-deck` na shell entra DENTRO desse rAF, envolto em try/catch que o
      remove. É ele que torna `.page` um contêiner flex; sem ele o palco tem
      altura zero. E uma exceção sem o catch deixaria a shell recolhida sem
      nenhuma rota que chamasse o teardown, e só recarregar resolveria.

   3. O primeiro slide entra SEM morph. Morph precisa de um slide anterior, e
      abrir a apresentação com movimento é justamente o defeito a evitar.

   4. `location.replace`, não `replaceState`: este último lança SecurityError
      em file:// no Chrome, e o app tem de abrir por file://.

   5. Nada aqui escreve em skillhub.ui.v1. A apresentação só põe e tira
      `data-deck`; a preferência real da sidebar volta a valer sozinha na saída.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};
window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;
  var morph = SkillHub.deck.morph;
  var content = SkillHub.deck.slides;

  /* Entrada por roda do mouse: acumula até o limiar e zera depois do silêncio.
     O cooldown é do domínio da ENTRADA, não do movimento. Atrelá-lo à duração
     do morph criaria uma zona morta justamente para quem pediu movimento
     reduzido e não tem animação nenhuma. */
  var WHEEL_THRESHOLD = 140;
  var WHEEL_IDLE = 200;

  var SWIPE_MS = 700;
  var SWIPE_MIN = 60;

  var STAGGER = { step: 26, max: 180 };

  var refs = {
    root: null, stage: null, ghosts: null, current: null, bar: null,
    chapter: null, count: null, caption: null, progress: null,
    prev: null, next: null, status: null, map: null, mapButton: null
  };

  var slides = [];
  var steps = [];
  var index = 0;
  var mounted = false;
  var overview = false;
  var motion = { min: 320, max: 720, easing: 'cubic-bezier(.32, .72, 0, 1)' };
  var rafMount = 0;
  var wheelDelta = 0;
  var wheelTimer = 0;
  var pointerStart = null;

  /* --- Tokens --------------------------------------------------------------- */

  function readToken(name, fallback) {
    if (!refs.stage || typeof window.getComputedStyle !== 'function') return fallback;
    var value = parseFloat(window.getComputedStyle(refs.stage).getPropertyValue(name));
    return isFinite(value) && value >= 0 ? value : fallback;
  }

  /* O easing é string, então não passa por parseFloat como as durações. Ler daqui
     em vez de repetir a curva no JS é o que impede o token e o código de
     divergirem, e é o que mantém `--ease-morph` com consumidor de verdade. */
  function readEasing(name, fallback) {
    if (!refs.stage || typeof window.getComputedStyle !== 'function') return fallback;
    var value = window.getComputedStyle(refs.stage).getPropertyValue(name);
    value = value ? value.trim() : '';
    return value || fallback;
  }

  function readTokens() {
    motion = {
      min: readToken('--duration-morph', motion.min),
      max: readToken('--duration-morph-max', motion.max),
      easing: readEasing('--ease-morph', motion.easing)
    };
  }

  function stageWidth() {
    return (refs.stage && refs.stage.clientWidth) || window.innerWidth || 1;
  }

  /* --- Passos: um slide pode ter mais de um ---------------------------------- */

  /*
   * Um "build" é a revelação em etapas dentro do mesmo slide, como num keynote.
   * A URL numera PASSOS, não slides, então cada build é endereçável, e trocar
   * de build nunca dispara morph, porque o slide é o mesmo.
   */
  function flatten(list) {
    var flat = [];
    list.forEach(function (slide, position) {
      var total = Math.max(1, slide.builds || 1);
      for (var build = 0; build < total; build += 1) {
        flat.push({ slide: position, build: build });
      }
    });
    return flat;
  }

  function clamp(target) {
    if (!steps.length) return 0;
    return Math.max(0, Math.min(steps.length - 1, target));
  }

  /* --- Montagem de um slide -------------------------------------------------- */

  function buildSlide(position, build) {
    var slide = slides[position];
    var node = el('section', {
      class: 'slide',
      'data-slide': slide.id,
      'aria-hidden': 'false'
    }, slide.build());
    applyBuild(node, build);
    return node;
  }

  /**
   * Mostra o que já foi revelado e esconde o resto. Um elemento escondido não
   * pode receber foco: ele está na árvore, mas não está na tela.
   */
  function applyBuild(node, build) {
    if (!node) return;
    /* `buildIndex` na raiz, `build` nos filhos: são coisas diferentes, em que
       build o slide está, versus a partir de qual build o elemento aparece.
       Com o mesmo nome nos dois, a regra que esconde o que ainda não foi
       revelado pega o slide inteiro e a tela fica preta. */
    node.dataset.buildIndex = String(build);
    var staged = node.querySelectorAll('[data-build]');
    Array.prototype.forEach.call(staged, function (item) {
      var needed = parseInt(item.getAttribute('data-build'), 10);
      var shown = !isFinite(needed) || needed <= build;
      item.dataset.shown = shown ? 'true' : 'false';
    });
    updateFocusables(node, true);
  }

  function updateFocusables(node, isCurrent) {
    if (!node) return;
    var focusable = node.querySelectorAll('a[href], button');
    Array.prototype.forEach.call(focusable, function (item) {
      /* Espelha o seletor do CSS: escondido é tudo que NÃO foi marcado como
         revelado, não só o que foi marcado como escondido. */
      var hidden = !isCurrent ||
        (item.closest && item.closest('[data-build]:not([data-shown="true"])'));
      /* O atributo é REMOVIDO em vez de restaurado: nenhum link nosso tem
         tabindex de autor, então não há valor anterior a preservar. */
      if (hidden) item.setAttribute('tabindex', '-1');
      else item.removeAttribute('tabindex');
    });
  }

  function retire(node) {
    if (!node) return;
    node.setAttribute('aria-hidden', 'true');
    updateFocusables(node, false);
  }

  /* --- Transição ------------------------------------------------------------- */

  function clearStage(keep) {
    if (!refs.stage) return;
    var living = refs.stage.querySelectorAll('.slide');
    Array.prototype.forEach.call(living, function (node) {
      if (node !== keep && node.parentNode) node.parentNode.removeChild(node);
    });
    if (refs.ghosts) SkillHub.dom.clear(refs.ghosts);
  }

  function transition(fromStep, toStep) {
    var outgoing = refs.current;
    var target = steps[toStep];

    /* Uma sequência rápida de setas pode chamar isto com uma transição ainda em
       curso. O que sobrou some agora, senão dois slides antigos se acumulam. */
    clearStage(outgoing);

    var before = outgoing ? morph.measure(outgoing) : {};
    var incoming = buildSlide(target.slide, target.build);
    refs.stage.appendChild(incoming);
    refs.current = incoming;
    retire(outgoing);

    if (!outgoing) return;

    morph.run({
      from: outgoing,
      to: incoming,
      before: before,
      ghostLayer: refs.ghosts,
      viewportW: stageWidth(),
      bounds: motion,
      stagger: STAGGER,
      onDone: function () {
        if (!mounted) return;
        if (outgoing !== refs.current && outgoing.parentNode) {
          outgoing.parentNode.removeChild(outgoing);
        }
        if (refs.ghosts) SkillHub.dom.clear(refs.ghosts);
      }
    });
  }

  function go(target) {
    if (!mounted || !steps.length) return;
    var next = clamp(target);
    if (next === index) return;
    var previous = index;
    index = next;
    if (steps[previous].slide === steps[next].slide) {
      applyBuild(refs.current, steps[next].build);
    } else {
      transition(previous, next);
    }
    syncBar(index);
    syncHash(index);
    syncMap(index);
    announce(index);
  }

  /* --- Barra ----------------------------------------------------------------- */

  function syncBar(target) {
    if (!refs.chapter) return;
    var step = steps[target];
    var slide = slides[step.slide];
    refs.chapter.textContent = slide.chapter;
    refs.count.textContent = (target + 1) + ' / ' + steps.length;
    refs.caption.textContent = slide.caption;
    refs.progress.style.setProperty('width',
      Math.round(((target + 1) / steps.length) * 100) + '%');
    if (refs.prev) refs.prev.disabled = target === 0;
    if (refs.next) refs.next.disabled = target === steps.length - 1;
  }

  function announce(target) {
    if (!refs.status) return;
    var step = steps[target];
    var slide = slides[step.slide];
    refs.status.textContent = 'Passo ' + (target + 1) + ' de ' + steps.length +
      ' · ' + slide.chapter + ' · ' + slide.caption;
  }

  /* --- URL -------------------------------------------------------------------- */

  function syncHash(target) {
    var wanted = '#/what-is-a-skill/' + (target + 1);
    if (window.location.hash === wanted) return;
    window.location.replace(wanted);
  }

  function startStep(context) {
    var raw = parseInt(context && context.param, 10);
    if (!isFinite(raw)) return 0;
    return clamp(raw - 1);
  }

  /* A rota declara ownsParam, então o router não re-renderiza quando só o
     parâmetro muda; chama isto. A comparação com `index` evita o laço com o
     hashchange que o próprio syncHash dispara. */
  function onParam(param) {
    if (!mounted) return;
    var raw = parseInt(param, 10);
    var target = isFinite(raw) ? clamp(raw - 1) : 0;
    if (target === index) return;
    go(target);
  }

  /* --- Mapa ------------------------------------------------------------------- */

  function buildMap() {
    var list = el('ul', { class: 'deck__map-list' }, steps.map(function (step, position) {
      var slide = slides[step.slide];
      var button = ui.button({
        label: null,
        className: 'deck__map-item',
        ariaLabel: 'Ir para o passo ' + (position + 1) + ': ' + slide.chapter,
        onClick: function () {
          closeOverview();
          go(position);
        }
      });
      button.appendChild(el('span', { class: 'deck__map-title' },
        (position + 1) + '. ' + slide.chapter));
      button.appendChild(el('span', { class: 'deck__map-meta' }, slide.caption));
      return el('li', {}, button);
    }));

    return el('div', {
      class: 'deck__map',
      role: 'group',
      'aria-label': 'Mapa da apresentação'
    }, list);
  }

  function syncMap(target) {
    if (!refs.map) return;
    var items = refs.map.querySelectorAll('.deck__map-item');
    Array.prototype.forEach.call(items, function (item, position) {
      item.setAttribute('aria-current', position === target ? 'true' : 'false');
    });
  }

  function openOverview() {
    if (overview || !refs.stage) return;
    overview = true;
    refs.root.dataset.overview = 'true';
    if (refs.mapButton) refs.mapButton.setAttribute('aria-pressed', 'true');
    refs.map = buildMap();
    refs.stage.appendChild(refs.map);
    syncMap(index);
    retire(refs.current);
    var current = refs.map.querySelector('[aria-current="true"]');
    if (current) current.focus({ preventScroll: true });
  }

  function closeOverview() {
    if (!overview) return;
    overview = false;
    if (refs.root) delete refs.root.dataset.overview;
    if (refs.mapButton) refs.mapButton.setAttribute('aria-pressed', 'false');
    if (refs.map && refs.map.parentNode) refs.map.parentNode.removeChild(refs.map);
    refs.map = null;
    if (refs.current) {
      refs.current.setAttribute('aria-hidden', 'false');
      updateFocusables(refs.current, true);
      refs.stage.focus({ preventScroll: true });
    }
  }

  function toggleOverview() {
    if (overview) closeOverview();
    else openOverview();
  }

  /* --- Entradas ---------------------------------------------------------------- */

  function onKeydown(event) {
    if (!mounted) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (SkillHub.util.isTyping()) return;

    var key = event.key;
    var active = document.activeElement;
    /* Espaço com um botão focado já é um clique: tratar aqui andaria dois. */
    if (key === ' ' && active && (active.tagName === 'BUTTON' || active.tagName === 'A')) return;

    if (key === 'Escape') {
      event.preventDefault();
      if (overview) closeOverview();
      else SkillHub.router.go('home');
      return;
    }
    if (key === 'o' || key === 'O') {
      event.preventDefault();
      toggleOverview();
      return;
    }
    if (overview) return;

    if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
      event.preventDefault();
      go(index + 1);
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp') {
      event.preventDefault();
      go(index - 1);
      return;
    }
    if (key === 'Home') {
      event.preventDefault();
      go(0);
      return;
    }
    if (key === 'End') {
      event.preventDefault();
      go(steps.length - 1);
    }
  }

  function onWheel(event) {
    if (!mounted || overview) return;
    /* deltaMode: 0 pixels, 1 linhas, 2 páginas. O Firefox reporta linhas. */
    var unit = event.deltaMode === 1 ? 16 : (event.deltaMode === 2 ? 400 : 1);
    var amount = (event.deltaY || event.deltaX) * unit;
    if (!amount) return;
    event.preventDefault();
    wheelDelta += amount;
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
    if (!pointerStart) return;
    var dx = event.clientX - pointerStart.x;
    var dy = event.clientY - pointerStart.y;
    var elapsed = Date.now() - pointerStart.at;
    pointerStart = null;
    if (elapsed > SWIPE_MS) return;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(index + (dx < 0 ? 1 : -1));
  }

  function onClick(event) {
    if (!mounted || overview) return;
    if (event.target.closest && event.target.closest('button, a, .deck__bar')) return;
    go(index + 1);
  }

  /* --- Montagem ---------------------------------------------------------------- */

  function bar() {
    refs.chapter = el('span', { class: 'deck__chapter' }, '');
    refs.count = el('span', { class: 'deck__count' }, '');
    refs.caption = el('p', { class: 'deck__caption' }, '');
    refs.progress = el('span', { class: 'deck__progress-fill' });
    /* Botão de ícone, e não rotulado: a barra é uma linha só, e "Anterior" e
       "Próximo" gastariam a largura que a legenda usa melhor. O nome acessível
       fica no ariaLabel, e o atalho no title. */
    refs.prev = ui.iconButton({
      icon: 'chevron-left', ariaLabel: 'Passo anterior', title: 'Anterior (←)',
      onClick: function () { go(index - 1); }
    });
    refs.next = ui.iconButton({
      icon: 'chevron-right', ariaLabel: 'Próximo passo', title: 'Próximo (→)',
      onClick: function () { go(index + 1); }
    });

    return el('div', { class: 'deck__bar' }, [
      el('span', { class: 'deck__progress' }, refs.progress),
      el('div', { class: 'deck__bar-inner' }, [
        refs.chapter,
        refs.count,
        refs.caption,
        el('div', { class: 'deck__nav u-row' }, [refs.prev, refs.next])
      ])
    ]);
  }

  function render(context) {
    var item = SkillHub.catalog.byId(content.EXAMPLE_ID);
    if (!item || !item.content) {
      return el('div', { class: 'page-pad' }, ui.emptyState({
        icon: 'alert',
        title: 'A apresentação não pôde ser montada',
        copy: 'O exemplo de Skill usado nos slides não foi encontrado no catálogo.'
      }));
    }

    slides = content.all({
      item: item,
      paths: SkillHub.formats.installPaths('claude-skill', item.id)
    });
    steps = flatten(slides);
    index = startStep(context);
    overview = false;

    refs.ghosts = el('div', { class: 'deck__ghosts', 'aria-hidden': 'true' });
    refs.stage = el('div', {
      class: 'deck__stage',
      tabindex: '-1',
      onWheel: onWheel,
      onPointerDown: onPointerDown,
      onPointerUp: onPointerUp,
      onClick: onClick
    });
    refs.status = el('p', { class: 'u-sr-only', role: 'status' });
    refs.root = el('div', { class: 'deck' }, [refs.stage, refs.ghosts, bar(), refs.status]);

    mounted = true;

    /* Remover antes de adicionar: se um teardown se perder, isto evita dois
       listeners disputando a mesma tecla. */
    document.removeEventListener('keydown', onKeydown);
    document.addEventListener('keydown', onKeydown);

    window.cancelAnimationFrame(rafMount);
    rafMount = window.requestAnimationFrame(function () {
      if (!mounted) return;
      var shell = document.querySelector('.app-shell');
      try {
        if (shell) shell.dataset.deck = 'on';
        readTokens();
        var first = steps[index];
        refs.current = buildSlide(first.slide, first.build);
        refs.stage.appendChild(refs.current);
        syncBar(index);
        syncHash(index);
      } catch (error) {
        if (shell) delete shell.dataset.deck;
        throw error;
      }
      /* Região viva populada no mesmo frame em que nasce não é anunciada. */
      rafMount = window.requestAnimationFrame(function () {
        if (!mounted) return;
        announce(index);
      });
    });

    return refs.root;
  }

  function topbar() {
    refs.mapButton = ui.iconButton({
      icon: 'layers',
      ariaLabel: 'Mostrar o mapa da apresentação',
      title: 'Mapa (O)',
      pressed: false,
      onClick: toggleOverview
    });
    return {
      lead: el('span', { class: 'u-row' }, [
        SkillHub.icons.get('sparkle', 'icon--sm'),
        el('span', null, 'O que é uma Skill')
      ]),
      actions: [
        refs.mapButton,
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

  /* --- Saída -------------------------------------------------------------------- */

  function teardown() {
    /* Primeiro de tudo: todo callback assíncrono checa isto e desiste. */
    mounted = false;
    overview = false;

    document.removeEventListener('keydown', onKeydown);
    window.cancelAnimationFrame(rafMount);
    window.clearTimeout(wheelTimer);
    rafMount = 0;
    wheelTimer = 0;
    wheelDelta = 0;
    pointerStart = null;

    /* Nunca deixar a shell recolhida sem apresentação na tela. Note que nada
       aqui escreve em skillhub.ui.v1: só o data-deck foi tocado. */
    var shell = document.querySelector('.app-shell');
    if (shell) delete shell.dataset.deck;

    Object.keys(refs).forEach(function (key) { refs[key] = null; });
    slides = [];
    steps = [];
  }

  SkillHub.pages.deck = {
    title: 'O que é uma Skill',
    render: render,
    topbar: topbar,
    teardown: teardown,
    onParam: onParam,
    /* A apresentação administra o próprio parâmetro: trocar de passo não pode
       re-renderizar, senão o slide em transição seria destruído no meio. */
    ownsParam: true,
    /* E reivindica o teclado, para o atalho "/" não levar quem apresenta para a
       listagem no meio de uma apresentação. */
    capturesKeys: true,
    focusSearch: function () { return true; }
  };
})(window.SkillHub);
