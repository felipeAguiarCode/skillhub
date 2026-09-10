/* ==========================================================================
   deck/doodles.js — SkillHub.deck.doodles

   Ilustrações de traço desenhado à mão para a apresentação, no molde de
   icons.js: cada nome é uma lista de primitivas, `get()` devolve um SVG novo a
   cada chamada (nó de DOM não se reutiliza).

   O que faz parecer desenhado à mão é o BOIL: o mesmo desenho existe em duas
   variantes com as coordenadas levemente diferentes, e elas se alternam a ~8
   quadros por segundo. É a técnica da animação tradicional, e é exatamente por
   isso que as duas variantes são escritas à mão em vez de geradas — um ruído
   procedural fica regular demais e o olho percebe.

   A alternância é @keyframes CSS de propósito, e não Web Animations API: o
   bloco global de prefers-reduced-motion (02-base.css:91) desliga @keyframes
   sozinho. Quem pede movimento reduzido vê o desenho parado no primeiro quadro.

   Tudo aqui é decorativo: o SVG sai com aria-hidden e quem chama é responsável
   por dizer em texto o que a figura mostra.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};
window.SkillHub.deck = window.SkillHub.deck || {};

(function (SkillHub) {
  'use strict';

  var dom = SkillHub.dom;
  var VIEWBOX = '0 0 48 48';

  /* Cada entrada tem duas variantes do MESMO desenho. Uma lista de `d` por
     variante; a espessura e o linecap vêm do CSS, via currentColor. */
  var DOODLES = {
    /* Pasta — o glifo que abre o capítulo de estrutura. */
    folder: [
      ['M6 15.5 L6.4 39.5 L42 39.2 L41.6 20.6 L23.8 20.4 L19.6 15.2 Z',
        'M6.2 20.8 L41.4 20.6'],
      ['M6.5 15 L5.9 40.1 L41.5 39.6 L42.2 20.2 L24.2 19.8 L20.1 15.6 Z',
        'M6.6 20.2 L41.8 21.1']
    ],

    /* Agente: cabeça, dois olhos quadrados, antena e braços. */
    robot: [
      ['M13.5 18.2 L13.8 34 L34.2 33.8 L33.9 18 Z',
        'M19 24.4 L19.2 27.6 L22.4 27.4 L22.2 24.2 Z',
        'M25.6 24.2 L25.8 27.5 L29 27.3 L28.8 24.1 Z',
        'M23.8 18 L23.6 12.4', 'M21.2 10.4 L26.2 10.2',
        'M13.6 23 L9 25.4', 'M34 23.2 L38.6 25.6'],
      ['M13.9 17.8 L13.5 34.3 L33.8 34.1 L34.3 17.6 Z',
        'M19.3 24 L18.9 27.9 L22.7 27.7 L22.4 23.9 Z',
        'M25.9 23.9 L25.5 27.8 L29.3 27.6 L29 23.8 Z',
        'M24.1 17.6 L23.9 12', 'M21 10.8 L26.5 10.5',
        'M13.4 23.4 L8.7 25.8', 'M34.3 22.9 L39 25.2']
    ],

    /* Faísca de quatro pontas, para a capa. */
    sparkle: [
      ['M24 6.5 C25.4 17.6 30.3 22.4 41.4 23.9 C30.3 25.4 25.4 30.3 24 41.4 C22.6 30.3 17.7 25.4 6.6 23.9 C17.7 22.4 22.6 17.6 24 6.5 Z',
        'M38.5 8.4 L38.7 14.2', 'M35.6 11.3 L41.4 11.4'],
      ['M23.9 6 C25.6 17.9 30.6 22.6 41.9 24.1 C30.6 25.2 25.2 30.6 23.9 41.9 C22.8 30.6 17.4 25.6 6.2 24.1 C17.4 22.8 22.8 17.4 23.9 6 Z',
        'M38.8 8 L38.4 14.6', 'M35.2 11.6 L41.8 11']
    ],

    /* Camadas: os três níveis de carregamento. */
    layers: [
      ['M24 8.4 L41.4 16.2 L24 24 L6.6 16.2 Z',
        'M6.6 24 L24 31.8 L41.4 24', 'M6.6 31.6 L24 39.4 L41.4 31.6'],
      ['M23.8 8 L41.8 16.4 L24.2 24.3 L6.2 16 Z',
        'M6.2 24.3 L23.8 32.2 L41.8 23.7', 'M6.9 31.2 L24.2 39.8 L41 31.9']
    ],

    /* Documento com o canto dobrado — arquivo de referência. */
    doc: [
      ['M12 7.5 L12.4 40.4 L36 40.1 L35.7 16.2 L27 7.6 Z',
        'M27 7.6 L27.2 16.4 L35.7 16.2',
        'M17.4 23 L30.6 22.8', 'M17.5 28.4 L30.5 28.2', 'M17.6 33.6 L25.4 33.4'],
      ['M12.4 7 L11.8 40.8 L36.4 40.4 L35.4 16 L27.4 7.2 Z',
        'M27.4 7.2 L26.8 16.6 L35.4 16',
        'M17 23.4 L31 22.6', 'M17.8 28 L30.2 28.7', 'M17.2 34 L25.8 33.2']
    ],

    /* Terminal: scripts que rodam sem entrar no contexto. */
    terminal: [
      ['M6.5 10.4 L6.8 38 L41.5 37.7 L41.2 10.2 Z',
        'M6.6 17.4 L41.3 17.2',
        'M14 24 L19.4 28.4 L14 32.8', 'M23 32.8 L32 32.6'],
      ['M6.9 10 L6.4 38.4 L41.1 38.1 L41.6 9.8 Z',
        'M7 17 L41 17.7',
        'M13.6 23.6 L19.8 28.2 L13.7 33.2', 'M22.6 33.2 L32.4 32.4']
    ],

    /* Paleta: templates, fontes e ícones. */
    palette: [
      ['M24 7.4 C33.9 7.4 41.4 14.2 41.4 22.6 C41.4 28.4 36.8 31.2 32.6 31.2 C29.8 31.2 28 32.8 28 35.2 C28 38 25.8 40.6 22.6 40.6 C13.6 40.6 6.6 32.6 6.6 23.4 C6.6 14.4 14.1 7.4 24 7.4 Z',
        'M15 19.6 L15.2 19.8', 'M22.4 15.2 L22.6 15.4', 'M30.6 18.4 L30.8 18.6', 'M15.4 28.6 L15.6 28.8'],
      ['M23.8 7 C34.2 7.2 41.8 14 41.7 22.9 C41.6 28.8 36.4 31.6 32.4 31.5 C29.6 31.4 27.7 33.1 27.8 35.5 C27.9 38.3 25.5 41 22.3 40.9 C13.3 40.6 6.2 32.3 6.4 23.1 C6.6 14.1 13.4 6.8 23.8 7 Z',
        'M14.7 19.9 L15 20.1', 'M22.7 14.9 L22.9 15.2', 'M30.9 18.7 L31.1 18.9', 'M15.1 28.9 L15.4 29.1']
    ],

    /* Ponte estreita sobre o abismo: tarefa frágil, pouca liberdade. */
    bridge: [
      ['M4 17.5 L14 17.6 L14.2 40 L4.2 40 Z', 'M33.8 17.6 L44 17.5 L44.2 40 L34 40 Z',
        'M14.2 21.4 L33.8 21.4', 'M18 21.4 L18.2 25.6', 'M30 21.4 L29.8 25.6'],
      ['M4.3 17 L14.3 17.9 L13.8 40.3 L3.8 39.7 Z', 'M34.1 17.9 L43.7 17 L44.5 39.7 L33.7 40.3 Z',
        'M13.8 21 L34.1 21.8', 'M18.3 21.1 L17.8 25.9', 'M29.7 21.7 L30.2 25.3']
    ],

    /* Campo aberto: muitos caminhos servem, liberdade alta. */
    field: [
      ['M4 32.5 L44 32.4', 'M10 32.4 C12 28 13 26 13.2 22.6', 'M20 32.4 C21.4 27.6 21.6 25.4 21.4 21.8',
        'M30 32.4 C31.6 28.6 33 26.6 34.4 24', 'M38 32.4 C39 29.6 39.6 28.4 40.4 26.6'],
      ['M4.2 32 L43.8 33', 'M9.7 33 C12.4 28.4 13.4 26.4 13.6 22.2', 'M20.4 32.9 C21 27.2 21.2 25.8 20.9 21.4',
        'M29.6 33 C31.9 29 33.4 26.2 34.8 23.6', 'M38.4 32.9 C39.3 29.2 39.9 28.8 40.8 26.2']
    ],

    /* Etiqueta: os metadados, o que o Claude lê antes de qualquer coisa. */
    tag: [
      ['M6.4 22.6 L22.6 6.4 L41.4 6.6 L41.6 25.4 L25.4 41.6 Z',
        'M31.2 14.4 a2.7 2.7 0 1 0 5.4 0 a2.7 2.7 0 1 0 -5.4 0'],
      ['M6 23 L22.2 6 L41.8 6.2 L41.2 25.8 L25 41.2 Z',
        'M31 14.7 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0']
    ],

    /* Duas pessoas: a Skill que sai do seu computador e vale para a equipe. */
    people: [
      ['M13.2 19.4 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
        'M8.6 38.6 C8.6 31.6 13.2 28.2 18.2 28.2 C23.2 28.2 27.8 31.6 27.8 38.6',
        'M28.8 22.6 a4.2 4.2 0 1 0 8.4 0 a4.2 4.2 0 1 0 -8.4 0',
        'M27 38.6 C27 32.8 29.6 29.8 33 29.8 C36.8 29.8 40 32.8 40 38.6'],
      ['M13 19.8 a5.2 5.2 0 1 0 10.4 0 a5.2 5.2 0 1 0 -10.4 0',
        'M8.2 38.2 C8.4 31.2 13.6 28.6 18.4 28.6 C23.4 28.7 28.2 31.2 28.2 38.2',
        'M28.6 22.2 a4.4 4.4 0 1 0 8.8 0 a4.4 4.4 0 1 0 -8.8 0',
        'M26.6 38.2 C26.8 32.4 29.2 30.2 33.2 30.2 C37.2 30.2 40.4 32.4 40.2 38.2']
    ],

    /* Ponteiro do mouse — o mesmo cursor que aparece nas capturas de origem. */
    cursor: [
      ['M15 8.5 L15.4 34.6 L21.8 28.4 L26.2 38.8 L30.6 36.8 L26.2 26.8 L34.8 26.4 Z'],
      ['M15.4 8 L14.8 35 L22 28.8 L26 39.4 L31 37.2 L26.6 27 L35.2 26 Z']
    ]
  };

  var ORDER = Object.keys(DOODLES);

  function path(d) {
    return dom.svg('path', { d: d });
  }

  function frame(paths, position) {
    return dom.svg('g', {
      class: 'doodle__frame',
      style: { '--doodle-frame': String(position) }
    }, paths.map(path));
  }

  /**
   * @param {string} name  chave de DOODLES
   * @param {number} size  lado em px (o viewBox é sempre 48)
   * @returns {SVGElement|null} nó NOVO, ou null para nome desconhecido
   *
   * Nome desconhecido devolve null em vez de um desenho de reserva: um doodle
   * errado no meio de um slide passa despercebido, um buraco não.
   */
  function get(name, size) {
    var variants = DOODLES[name];
    if (!variants) return null;
    var side = size || 48;
    return dom.svg('svg', {
      class: 'doodle',
      viewBox: VIEWBOX,
      width: String(side),
      height: String(side),
      'aria-hidden': 'true',
      focusable: 'false'
    }, variants.map(function (paths, position) {
      return frame(paths, position);
    }));
  }

  function has(name) {
    return Object.prototype.hasOwnProperty.call(DOODLES, name);
  }

  SkillHub.deck.doodles = {
    get: get,
    has: has,
    names: function () { return ORDER.slice(); }
  };
})(window.SkillHub);
