/* ==========================================================================
   deck/morph.js — SkillHub.deck.morph

   A transição Morph do PowerPoint, em FLIP: o elemento que existe nos dois
   slides viaja de um para o outro; o que só existe num deles entra ou sai.

   Três decisões que sustentam o resto:

   1. `getBoundingClientRect` é a ferramenta certa AQUI. A câmera antiga media
      por cadeia de offsetParent porque o ancestral estava transformado e a
      medida sairia circular. No FLIP é o oposto: o que se compara é justamente
      a posição RENDERIZADA nos dois estados.

   2. Nada de animar layout. Largura, altura e posição em fluxo animadas
      empurrariam os irmãos a cada frame. Só `transform` e `opacity` — e
      `font-size` no caso de texto, que é a exceção deliberada abaixo.

   3. Duas espécies de morph, porque escalar texto o deixa borrado:
      - `text`  → translada e interpola `font-size`. Sem escala, sempre nítido.
      - `box`   → escala, e um FANTASMA do elemento que sai faz cross-fade por
                  cima. Os dois estão distorcidos só enquanto um esvanece no
                  outro, que é o que o olho lê como "a mesma caixa mudando".
                  Sem o fantasma, o conteúdo do destino apareceria espremido no
                  tamanho da origem.

   O bloco global de prefers-reduced-motion (02-base.css) zera `animation-` e
   `transition-duration`, mas NÃO alcança a Web Animations API. Como este módulo
   é a única coisa no app que usa WAAPI, a checagem é feita aqui, na mão.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};
window.SkillHub.deck = window.SkillHub.deck || {};

(function (SkillHub) {
  'use strict';

  /* Espelham os tokens --duration-morph, --duration-morph-max e --ease-morph.
     Quem chama passa os valores lidos do CSS; isto é só a rede de segurança
     para quando getComputedStyle não estiver disponível. */
  var DEFAULT_BOUNDS = { min: 320, max: 720, easing: 'cubic-bezier(.32, .72, 0, 1)' };
  var DEFAULT_STAGGER = { step: 26, max: 180 };

  /* Abaixo disso, dois retângulos são o mesmo lugar: um sub-pixel de diferença
     não é movimento, é arredondamento do layout. */
  var EPSILON = 0.5;

  /* --- Parte pura: nada aqui toca no DOM ------------------------------------ */

  /**
   * Transformação que, aplicada ao elemento JÁ posicionado em `to`, o faz
   * aparecer exatamente sobre `from`. Assume `transform-origin: 0 0` e a ordem
   * `translate(...) scale(...)`.
   *
   * Devolve null para destino degenerado: `scale(Infinity)` e `scale(NaN)` são
   * descartados em silêncio pelo CSSOM, e a transição pararia sem erro nenhum
   * no console — o mesmo cuidado que a câmera antiga tomava.
   */
  function delta(from, to) {
    if (!from || !to) return null;
    if (!(to.width > 0) || !(to.height > 0)) return null;
    if (!(from.width > 0) || !(from.height > 0)) return null;
    return {
      dx: from.left - to.left,
      dy: from.top - to.top,
      sx: from.width / to.width,
      sy: from.height / to.height
    };
  }

  function isIdentity(d) {
    if (!d) return false;
    return Math.abs(d.dx) < EPSILON && Math.abs(d.dy) < EPSILON &&
      Math.abs(d.sx - 1) < 0.001 && Math.abs(d.sy - 1) < 0.001;
  }

  function toTransform(d) {
    if (!d) return null;
    /* A lista de funções é sempre a mesma nos dois lados da animação. Listas
       diferentes fazem o navegador cair em decomposição de matriz, e o
       movimento sai em curva em vez de ir reto. */
    return 'translate(' + round(d.dx) + 'px, ' + round(d.dy) + 'px) ' +
      'scale(' + round(d.sx, 5) + ', ' + round(d.sy, 5) + ')';
  }

  function round(value, digits) {
    var factor = Math.pow(10, typeof digits === 'number' ? digits : 2);
    return Math.round(value * factor) / factor;
  }

  function log2(value) {
    return Math.log(value > 0 ? value : 1) / Math.LN2;
  }

  /**
   * Duração proporcional ao esforço, como a câmera fazia: distância medida em
   * larguras de tela (pixel não diz nada sozinho) somada à troca de escala em
   * oitavas. Um deslocamento curto fica no piso; a travessia grande chega ao
   * teto. Sem isso, todo morph teria a mesma duração e o curto pareceria lento.
   */
  function duration(d, viewportW, bounds) {
    var limits = bounds || DEFAULT_BOUNDS;
    var floor = limits.min;
    var ceiling = limits.max;
    if (!d || !(viewportW > 0)) return floor;
    var travel = Math.sqrt(d.dx * d.dx + d.dy * d.dy) / viewportW;
    var octaves = (Math.abs(log2(d.sx)) + Math.abs(log2(d.sy))) / 2;
    var effort = Math.min(1, travel / 1.2 + octaves / 3);
    return Math.round(floor + (ceiling - floor) * effort);
  }

  /** Atraso do i-ésimo elemento que entra, com teto para a última linha não
      esperar meio segundo em pé. */
  function stagger(index, options) {
    var opts = options || DEFAULT_STAGGER;
    var step = typeof opts.step === 'number' ? opts.step : DEFAULT_STAGGER.step;
    var max = typeof opts.max === 'number' ? opts.max : DEFAULT_STAGGER.max;
    if (!(index > 0)) return 0;
    return Math.min(max, Math.round(index * step));
  }

  /* --- Movimento reduzido --------------------------------------------------- */

  function reduced() {
    if (typeof window.matchMedia !== 'function') return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {
      return false;
    }
  }

  function canAnimate(node) {
    return !!(node && typeof node.animate === 'function');
  }

  /* --- Medição -------------------------------------------------------------- */

  function measure(root) {
    var map = {};
    if (!root) return map;
    var nodes = root.querySelectorAll('[data-morph]');
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute('data-morph');
      if (!key || map[key]) return;
      var rect = node.getBoundingClientRect();
      if (!(rect.width > 0) || !(rect.height > 0)) return;
      var style = window.getComputedStyle(node);
      map[key] = {
        node: node,
        rect: rect,
        kind: node.getAttribute('data-morph-type') === 'text' ? 'text' : 'box',
        fontSize: style.fontSize,
        color: style.color
      };
    });
    return map;
  }

  /* --- Execução ------------------------------------------------------------- */

  /**
   * Anima a troca de `from` para `to`, ambos já no `stage`.
   * Devolve a duração total em ms — zero quando não houve animação nenhuma.
   *
   * O chamador é dono do DOM: insere `to` no stage ANTES de chamar, e remove
   * `from` no `onDone`. Assim este módulo não precisa saber como o slide nasce.
   */
  function run(options) {
    var opts = options || {};
    var from = opts.from || null;
    var to = opts.to || null;
    var ghostLayer = opts.ghostLayer || null;
    var bounds = opts.bounds || DEFAULT_BOUNDS;
    var viewportW = opts.viewportW || window.innerWidth || 1;
    var done = typeof opts.onDone === 'function' ? opts.onDone : function () {};
    var easing = bounds.easing || DEFAULT_BOUNDS.easing;

    if (!to || !from || reduced() || !canAnimate(to)) {
      done();
      return 0;
    }

    var before = opts.before || measure(from);
    var after = measure(to);
    var longest = 0;
    var matched = {};

    Object.keys(after).forEach(function (key) {
      var origin = before[key];
      var target = after[key];
      if (!origin) return;
      var d = delta(origin.rect, target.rect);
      if (!d) return;
      matched[key] = true;
      if (isIdentity(d) && origin.fontSize === target.fontSize) return;
      var ms = duration(d, viewportW, bounds);
      if (ms > longest) longest = ms;
      if (target.kind === 'text') animateText(origin, target, d, ms, easing);
      else animateBox(origin, target, d, ms, ghostLayer, easing);
    });

    /* O que não casou: sai o que ficou para trás, entra o que é novo. É o
       comportamento do Morph para elemento sem par. */
    longest = Math.max(longest, fadeOut(from, before, matched, bounds, easing));
    longest = Math.max(longest, fadeIn(to, after, matched, bounds, opts.stagger, easing));

    if (longest <= 0) {
      done();
      return 0;
    }
    window.setTimeout(done, longest + 40);
    return longest;
  }

  function animateText(origin, target, d, ms, easing) {
    /* Só translada. Escalar texto o deixa borrado no meio do caminho, e a
       nitidez a 1:1 é a propriedade que mais importa numa apresentação. */
    var shift = 'translate(' + round(d.dx) + 'px, ' + round(d.dy) + 'px)';
    var first = { transform: shift };
    var last = { transform: 'translate(0px, 0px)' };
    if (origin.fontSize !== target.fontSize) {
      first.fontSize = origin.fontSize;
      last.fontSize = target.fontSize;
    }
    if (origin.color !== target.color) {
      first.color = origin.color;
      last.color = target.color;
    }
    play(target.node, [first, last], ms, 0, easing);
  }

  function animateBox(origin, target, d, ms, ghostLayer, easing) {
    play(target.node, [
      { transform: toTransform(d), opacity: 0.4 },
      { transform: 'translate(0px, 0px) scale(1, 1)', opacity: 1 }
    ], ms, 0, easing);
    ghost(origin, target, ms, ghostLayer, easing);
  }

  /**
   * Clona o elemento que sai, prende-o na posição medida e leva-o até o
   * retângulo de destino esvanecendo. É o que impede o conteúdo do destino de
   * aparecer espremido no tamanho da origem.
   */
  function ghost(origin, target, ms, ghostLayer, easing) {
    if (!ghostLayer) return;
    var clone;
    try {
      clone = origin.node.cloneNode(true);
    } catch (error) {
      return;
    }
    clone.removeAttribute('data-morph');
    clone.setAttribute('aria-hidden', 'true');
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('left', round(origin.rect.left) + 'px');
    clone.style.setProperty('top', round(origin.rect.top) + 'px');
    clone.style.setProperty('width', round(origin.rect.width) + 'px');
    clone.style.setProperty('height', round(origin.rect.height) + 'px');
    clone.style.setProperty('margin', '0');
    clone.style.setProperty('transform-origin', '0 0');
    ghostLayer.appendChild(clone);

    /* O original some na hora: ele e o fantasma na mesma posição dariam uma
       imagem dupla enquanto o slide que sai esvanece. */
    origin.node.style.setProperty('visibility', 'hidden');

    var forward = delta(target.rect, origin.rect);
    var animation = play(clone, [
      { transform: 'translate(0px, 0px) scale(1, 1)', opacity: 1 },
      { transform: toTransform(forward), opacity: 0 }
    ], ms, 0, easing);

    if (animation) animation.onfinish = drop;
    else drop();

    function drop() {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
    }
  }

  function fadeOut(root, before, matched, bounds, easing) {
    var ms = Math.round(bounds.min * 0.55);
    Object.keys(before).forEach(function (key) {
      if (matched[key]) return;
      play(before[key].node, [
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(-10px)' }
      ], ms, 0, easing);
    });
    /* O slide inteiro também esvanece, senão o que não é [data-morph] ficaria
       parado até o corte. */
    play(root, [{ opacity: 1 }, { opacity: 0 }], ms, 0, easing);
    return ms;
  }

  function fadeIn(root, after, matched, bounds, staggerOptions, easing) {
    var ms = Math.round(bounds.min * 0.8);
    var total = ms;
    var index = 0;
    Object.keys(after).forEach(function (key) {
      if (matched[key]) return;
      var delay = stagger(index, staggerOptions);
      index += 1;
      total = Math.max(total, ms + delay);
      play(after[key].node, [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ], ms, delay, easing);
    });
    return total;
  }

  function play(node, frames, ms, delay, easing) {
    if (!canAnimate(node) || !(ms > 0)) return null;
    try {
      return node.animate(frames, {
        duration: ms,
        delay: delay || 0,
        easing: easing || DEFAULT_BOUNDS.easing,
        fill: 'both'
      });
    } catch (error) {
      return null;
    }
  }

  SkillHub.deck.morph = {
    DEFAULT_BOUNDS: DEFAULT_BOUNDS,
    DEFAULT_STAGGER: DEFAULT_STAGGER,
    delta: delta,
    isIdentity: isIdentity,
    toTransform: toTransform,
    duration: duration,
    stagger: stagger,
    reduced: reduced,
    measure: measure,
    run: run
  };
})(window.SkillHub);
