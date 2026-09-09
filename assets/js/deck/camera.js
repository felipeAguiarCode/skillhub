/* ==========================================================================
   deck/camera.js — SkillHub.deck.camera

   A matemática da apresentação, separada da renderização para poder ser
   conferida sem navegador.

   Modelo: o conteúdo vive num canvas cujas coordenadas são pixels ANTES do
   transform. A câmera enquadra um retângulo desse canvas no viewport aplicando
   um transform ao próprio canvas.

   A composição é lida da direita para a esquerda:

     translate(ax, ay)  ·  rotate(r)  ·  scale(k)  ·  translate(-cx, -cy)

     1. translate(-cx, -cy) leva o centro do alvo à origem do canvas;
     2. scale(k) e rotate(r) acontecem em volta dessa origem, porque o CSS
        aplica transform-origin: 0 0 (05-pages.css) — com o padrão 50% 50% tudo
        deslocaria metade do canvas;
     3. translate(ax, ay) leva a origem ao ponto de âncora do viewport.

   Trocar a ordem quebra o enquadramento: escalar antes de centralizar faz o
   alvo escapar proporcionalmente à distância dele até a origem.
   ========================================================================== */

window.SkillHub.deck = window.SkillHub.deck || {};

(function (SkillHub) {
  'use strict';

  /* Respiro em volta do alvo, em pixels de TELA (não de canvas): assim a margem
     parece a mesma em qualquer nível de zoom. */
  var DEFAULT_INSET = 32;

  /* Limites de escala. Sem o teto, um alvo pequeno seria ampliado até o texto
     virar mancha; sem o piso, o canvas inteiro sumiria. Cada passo pode
     apertar mais esses limites (kMin/kMax). */
  var MIN_SCALE = 0.04;
  var MAX_SCALE = 3.2;

  /**
   * Retângulo de um nó em espaço de canvas, somando a cadeia de offsetParent.
   *
   * Usa offsetLeft/offsetTop de propósito: são valores de LAYOUT, que o
   * transform do canvas não afeta. getBoundingClientRect devolveria o retângulo
   * já transformado, tornando a medida circular — a câmera dependeria de onde a
   * câmera já está.
   *
   * Precondições, todas garantidas pelo CSS da apresentação:
   *  - anda por `offsetParent`, nunca por `parentElement`: offsetLeft é relativo
   *    ao offsetParent, e andar por pais contaria a mesma distância duas vezes;
   *  - o canvas é `position: absolute`, então ele É offsetParent e a cadeia
   *    termina nele. Sem isso a cadeia passaria direto por ele. Vale lembrar que
   *    `transform` não faz de um elemento um offsetParent;
   *  - nada de `display: contents` no meio: um elemento assim não tem caixa,
   *    devolve offsetParent nulo e ofsets zero.
   *
   * Se a cadeia terminar antes do canvas, devolve `null` — coordenada errada
   * levaria a câmera para um lugar plausível e errado, o que é bem mais difícil
   * de diagnosticar do que um passo que não se move.
   */
  function measure(node, canvas) {
    if (!node || !canvas) return null;
    var x = 0;
    var y = 0;
    var current = node;
    while (current && current !== canvas) {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent;
    }
    if (current !== canvas) return null;
    return { x: x, y: y, w: node.offsetWidth, h: node.offsetHeight };
  }

  /** União de retângulos — usada só onde um alvo é composto por vários nós. */
  function union(rects) {
    var list = (rects || []).filter(Boolean);
    if (!list.length) return null;
    var left = list[0].x;
    var top = list[0].y;
    var right = list[0].x + list[0].w;
    var bottom = list[0].y + list[0].h;
    list.slice(1).forEach(function (rect) {
      left = Math.min(left, rect.x);
      top = Math.min(top, rect.y);
      right = Math.max(right, rect.x + rect.w);
      bottom = Math.max(bottom, rect.y + rect.h);
    });
    return { x: left, y: top, w: right - left, h: bottom - top };
  }

  /**
   * Enquadra um retângulo de canvas no viewport.
   *
   * `viewport` é { w, h } em pixels de tela, e é a caixa útil inteira: na
   * apresentação a barra de controle é irmã do viewport, não sobreposta, então
   * não há chrome a descontar aqui.
   *
   * Devolve `null` — nunca um enquadramento inválido — para alvo de tamanho
   * zero, viewport degenerado ou conta que não fecha. Isso importa porque
   * `style.setProperty('transform', '... scale(NaN)')` é descartado em silêncio
   * pelo CSSOM: a câmera simplesmente pararia de andar, sem erro no console e
   * sem nada que a Definition of Done pegasse.
   */
  function frame(rect, viewport, options) {
    if (!rect || !viewport) return null;
    if (!(viewport.w > 0) || !(viewport.h > 0)) return null;
    if (!(rect.w > 0) || !(rect.h > 0)) return null;

    var opts = options || {};
    var inset = opts.inset === undefined ? DEFAULT_INSET : opts.inset;
    var rotate = opts.rotate || 0;

    /* Com rotação, um retângulo w×h ocupa uma caixa alinhada aos eixos maior que
       ele. Resolver a escala no retângulo não rotacionado faria todo passo
       inclinado cortar o próprio conteúdo, em quantidade que varia com a
       proporção — o que parece defeito aleatório. */
    var rad = rotate * Math.PI / 180;
    var cos = Math.abs(Math.cos(rad));
    var sin = Math.abs(Math.sin(rad));
    var boundsW = rect.w * cos + rect.h * sin;
    var boundsH = rect.w * sin + rect.h * cos;

    var availableW = viewport.w - inset * 2;
    var availableH = viewport.h - inset * 2;
    if (availableW <= 0 || availableH <= 0) return null;

    var k = Math.min(availableW / boundsW, availableH / boundsH);
    var min = opts.kMin === undefined ? MIN_SCALE : opts.kMin;
    var max = opts.kMax === undefined ? MAX_SCALE : opts.kMax;
    k = Math.min(max, Math.max(min, k));
    if (!isFinite(k) || k <= 0) return null;

    return {
      k: k,
      r: rotate,
      cx: rect.x + rect.w / 2,
      cy: rect.y + rect.h / 2,
      ax: viewport.w / 2,
      ay: viewport.h / 2
    };
  }

  /** Enquadra o canvas inteiro: é a visão geral da tecla "o". */
  function fitAll(canvas, viewport, options) {
    if (!canvas) return null;
    return frame(
      { x: 0, y: 0, w: canvas.offsetWidth, h: canvas.offsetHeight },
      viewport,
      options
    );
  }

  /**
   * A string de transform, pronta para `style: { transform: ... }`.
   *
   * Emite SEMPRE as quatro funções, com unidade em toda medida, mesmo quando a
   * rotação é zero. Se os dois lados de uma transição tiverem listas de funções
   * diferentes, o navegador abandona a interpolação função por função e cai em
   * decomposição de matriz — e então alguns voos saem numa curva, sem que se
   * entenda por que só alguns.
   */
  function toTransform(shot) {
    if (!shot) return null;
    return 'translate(' + round(shot.ax) + 'px, ' + round(shot.ay) + 'px)' +
      ' rotate(' + round(shot.r, 3) + 'deg)' +
      ' scale(' + round(shot.k, 5) + ')' +
      ' translate(' + round(-shot.cx) + 'px, ' + round(-shot.cy) + 'px)';
  }

  /* Arredondar evita strings quilométricas e diferenças falsas entre dois
     enquadramentos do mesmo alvo. */
  function round(value, digits) {
    var factor = Math.pow(10, digits === undefined ? 2 : digits);
    return Math.round(value * factor) / factor;
  }

  /**
   * Duração do voo, proporcional à distância.
   *
   * O DESIGN_SYSTEM §20 mapeia motion em 140–360ms, e a maioria dos passos é um
   * zoom curto dentro do mesmo capítulo — esses ficam no piso. Só a travessia
   * entre capítulos distantes, ou uma troca grande de escala, chega ao teto:
   * ali o movimento longo é o que comunica que o assunto mudou.
   *
   * A distância é medida em telas percorridas — unidades de canvas não querem
   * dizer nada depois do zoom — somada à troca de escala em oitavas.
   */
  function flightDuration(from, to, viewport, bounds) {
    var floor = (bounds && bounds.min) || 420;
    var ceiling = (bounds && bounds.max) || 900;
    if (!from || !to || !viewport || !(viewport.w > 0)) return ceiling;

    var dx = (to.cx - from.cx) * to.k;
    var dy = (to.cy - from.cy) * to.k;
    var screens = Math.sqrt(dx * dx + dy * dy) / viewport.w;

    var ratio = to.k / (from.k || to.k);
    var octaves = Math.abs(Math.log(ratio > 0 ? ratio : 1) / Math.LN2);

    var effort = Math.min(1, screens / 2.5 + octaves / 3);
    return Math.round(floor + (ceiling - floor) * effort);
  }

  SkillHub.deck.camera = {
    DEFAULT_INSET: DEFAULT_INSET,
    MIN_SCALE: MIN_SCALE,
    MAX_SCALE: MAX_SCALE,
    measure: measure,
    union: union,
    frame: frame,
    fitAll: fitAll,
    toTransform: toTransform,
    flightDuration: flightDuration
  };
})(window.SkillHub);
