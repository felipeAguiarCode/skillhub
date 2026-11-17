/* ==========================================================================
   icons.js — SkillHub.icons

   Ícones de linha em SVG inline: traço 2, terminações arredondadas, grade de
   24, sempre `currentColor`. O traço vem do CSS (.icon), então o ícone herda
   cor e peso do contexto sem variante extra.

   Os caminhos são do Lucide (https://lucide.dev, licença ISC, versão 0.460.0),
   copiados sem alteração. As CHAVES são as do app e são contrato: o catálogo
   referencia ícone por nome, e tools/gen-coding-styles.js lê as chaves deste
   arquivo por regex — da declaração de PATHS até a de FALLBACK, com 4 espaços
   de recuo e valor em array. Não mude esse formato, e não escreva essas duas
   declarações por extenso em comentário: o gerador ancora na primeira
   ocorrência do texto, e ancoraria aqui.

   A estrela é o único ícone que aparece preenchido, e quem a preenche é o CSS
   do consumidor (favorito marcado), não este arquivo.
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  var svg = SkillHub.dom.svg;

  /* Cada entrada é uma lista de primitivas [tag, attrs]. */
  var PATHS = {
    /* --- Navegação --- */
    home: [
      ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }],
      ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }]
    ],
    sparkle: [
      ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
      ['path', { d: 'M20 3v4' }],
      ['path', { d: 'M22 5h-4' }],
      ['path', { d: 'M4 17v2' }],
      ['path', { d: 'M5 18H3' }]
    ],
    hexagon: [
      ['path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }]
    ],
    doc: [
      ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
      ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }],
      ['path', { d: 'M10 9H8' }],
      ['path', { d: 'M16 13H8' }],
      ['path', { d: 'M16 17H8' }]
    ],
    graph: [
      ['rect', { width: '8', height: '8', x: '3', y: '3', rx: '2' }],
      ['path', { d: 'M7 11v4a2 2 0 0 0 2 2h4' }],
      ['rect', { width: '8', height: '8', x: '13', y: '13', rx: '2' }]
    ],
    wand: [
      ['path', { d: 'm21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72' }],
      ['path', { d: 'm14 7 3 3' }],
      ['path', { d: 'M5 6v4' }],
      ['path', { d: 'M19 14v4' }],
      ['path', { d: 'M10 2v2' }],
      ['path', { d: 'M7 8H3' }],
      ['path', { d: 'M21 16h-4' }],
      ['path', { d: 'M11 3H9' }]
    ],

    /* --- Controles --- */
    search: [
      ['circle', { cx: '11', cy: '11', r: '8' }],
      ['path', { d: 'm21 21-4.3-4.3' }]
    ],
    star: [
      ['path', { d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' }]
    ],
    copy: [
      ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
      ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]
    ],
    download: [
      ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
      ['polyline', { points: '7 10 12 15 17 10' }],
      ['line', { x1: '12', x2: '12', y1: '15', y2: '3' }]
    ],
    check: [
      ['path', { d: 'M20 6 9 17l-5-5' }]
    ],
    x: [
      ['path', { d: 'M18 6 6 18' }],
      ['path', { d: 'm6 6 12 12' }]
    ],
    plus: [
      ['path', { d: 'M5 12h14' }],
      ['path', { d: 'M12 5v14' }]
    ],
    trash: [
      ['path', { d: 'M3 6h18' }],
      ['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
      ['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }],
      ['line', { x1: '10', x2: '10', y1: '11', y2: '17' }],
      ['line', { x1: '14', x2: '14', y1: '11', y2: '17' }]
    ],
    'chevron-right': [
      ['path', { d: 'm9 18 6-6-6-6' }]
    ],
    'chevron-left': [
      ['path', { d: 'm15 18-6-6 6-6' }]
    ],
    'arrow-right': [
      ['path', { d: 'M5 12h14' }],
      ['path', { d: 'm12 5 7 7-7 7' }]
    ],
    'arrow-left': [
      ['path', { d: 'm12 19-7-7 7-7' }],
      ['path', { d: 'M19 12H5' }]
    ],
    external: [
      ['path', { d: 'M7 7h10v10' }],
      ['path', { d: 'M7 17 17 7' }]
    ],
    alert: [
      ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }],
      ['path', { d: 'M12 9v4' }],
      ['path', { d: 'M12 17h.01' }]
    ],
    info: [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['path', { d: 'M12 16v-4' }],
      ['path', { d: 'M12 8h.01' }]
    ],
    shield: [
      ['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }],
      ['path', { d: 'm9 12 2 2 4-4' }]
    ],
    lock: [
      ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }],
      ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }]
    ],
    server: [
      ['rect', { width: '20', height: '8', x: '2', y: '2', rx: '2', ry: '2' }],
      ['rect', { width: '20', height: '8', x: '2', y: '14', rx: '2', ry: '2' }],
      ['line', { x1: '6', x2: '6.01', y1: '6', y2: '6' }],
      ['line', { x1: '6', x2: '6.01', y1: '18', y2: '18' }]
    ],
    eye: [
      ['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }],
      ['circle', { cx: '12', cy: '12', r: '3' }]
    ],
    panel: [
      ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
      ['path', { d: 'M9 3v18' }]
    ],
    sliders: [
      ['line', { x1: '21', x2: '14', y1: '4', y2: '4' }],
      ['line', { x1: '10', x2: '3', y1: '4', y2: '4' }],
      ['line', { x1: '21', x2: '12', y1: '12', y2: '12' }],
      ['line', { x1: '8', x2: '3', y1: '12', y2: '12' }],
      ['line', { x1: '21', x2: '16', y1: '20', y2: '20' }],
      ['line', { x1: '12', x2: '3', y1: '20', y2: '20' }],
      ['line', { x1: '14', x2: '14', y1: '2', y2: '6' }],
      ['line', { x1: '8', x2: '8', y1: '10', y2: '14' }],
      ['line', { x1: '16', x2: '16', y1: '18', y2: '22' }]
    ],
    layers: [
      ['path', { d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }],
      ['path', { d: 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' }],
      ['path', { d: 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' }]
    ],

    /* --- Domínio --- */
    terminal: [
      ['polyline', { points: '4 17 10 11 4 5' }],
      ['line', { x1: '12', x2: '20', y1: '19', y2: '19' }]
    ],
    code: [
      ['polyline', { points: '16 18 22 12 16 6' }],
      ['polyline', { points: '8 6 2 12 8 18' }]
    ],
    file: [
      ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
      ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }]
    ],
    folder: [
      ['path', { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' }]
    ],
    'folder-open': [
      ['path', { d: 'm6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2' }]
    ],
    package: [
      ['path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }],
      ['path', { d: 'M12 22V12' }],
      ['path', { d: 'm3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7' }],
      ['path', { d: 'm7.5 4.27 9 5.15' }]
    ],
    'git-branch': [
      ['line', { x1: '6', x2: '6', y1: '3', y2: '15' }],
      ['circle', { cx: '18', cy: '6', r: '3' }],
      ['circle', { cx: '6', cy: '18', r: '3' }],
      ['path', { d: 'M18 9a9 9 0 0 1-9 9' }]
    ],
    database: [
      ['ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }],
      ['path', { d: 'M3 5V19A9 3 0 0 0 21 19V5' }],
      ['path', { d: 'M3 12A9 3 0 0 0 21 12' }]
    ],
    table: [
      ['path', { d: 'M12 3v18' }],
      ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
      ['path', { d: 'M3 9h18' }],
      ['path', { d: 'M3 15h18' }]
    ],
    chart: [
      ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16' }],
      ['path', { d: 'M18 17V9' }],
      ['path', { d: 'M13 17V5' }],
      ['path', { d: 'M8 17v-3' }]
    ],
    flask: [
      ['path', { d: 'M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2' }],
      ['path', { d: 'M8.5 2h7' }],
      ['path', { d: 'M7 16h10' }]
    ],
    rocket: [
      ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' }],
      ['path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' }],
      ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }],
      ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }]
    ],
    book: [
      ['path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' }]
    ],
    pen: [
      ['path', { d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' }],
      ['path', { d: 'm15 5 4 4' }]
    ],
    users: [
      ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
      ['circle', { cx: '9', cy: '7', r: '4' }],
      ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
      ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]
    ],
    cloud: [
      ['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }]
    ],
    zap: [
      ['path', { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z' }]
    ],
    bug: [
      ['path', { d: 'm8 2 1.88 1.88' }],
      ['path', { d: 'M14.12 3.88 16 2' }],
      ['path', { d: 'M9 7.13v-1a3.003 3.003 0 1 1 6 0v1' }],
      ['path', { d: 'M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6' }],
      ['path', { d: 'M12 20v-9' }],
      ['path', { d: 'M6.53 9C4.6 8.8 3 7.1 3 5' }],
      ['path', { d: 'M6 13H2' }],
      ['path', { d: 'M3 21c0-2.1 1.7-3.9 3.8-4' }],
      ['path', { d: 'M20.97 5c0 2.1-1.6 3.8-3.5 4' }],
      ['path', { d: 'M22 13h-4' }],
      ['path', { d: 'M17.2 17c2.1.1 3.8 1.9 3.8 4' }]
    ],
    refresh: [
      ['path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }],
      ['path', { d: 'M21 3v5h-5' }],
      ['path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }],
      ['path', { d: 'M8 16H3v5' }]
    ]
  };

  var FALLBACK = 'sparkle';

  /** Devolve um novo <svg> a cada chamada (nós não podem ser reutilizados). */
  function get(name, className) {
    var primitives = PATHS[name] || PATHS[FALLBACK];
    return svg('svg', {
      class: 'icon' + (className ? ' ' + className : ''),
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
      focusable: 'false'
    }, primitives.map(function (item) {
      return svg(item[0], item[1]);
    }));
  }

  function has(name) {
    return Object.prototype.hasOwnProperty.call(PATHS, name);
  }

  /* --- Medalha ---------------------------------------------------------------- */

  /**
   * A medalha de uma skill: um hexágono no acento com a miniatura do ícone
   * dentro. Desenho próprio, igual para todas — não há nível nem ranking: o app
   * não mede uso. É decorativa (aria-hidden); nenhuma informação mora nela.
   */
  function trophy(name) {
    var primitives = PATHS[name] || PATHS[FALLBACK];
    return svg('svg', {
      class: 'trophy',
      viewBox: '0 0 40 40',
      'aria-hidden': 'true',
      focusable: 'false'
    }, [
      svg('polygon', { class: 'trophy__frame', points: '20,1.5 36,10.75 36,29.25 20,38.5 4,29.25 4,10.75' }),
      svg('polygon', { class: 'trophy__inner', points: '20,5.5 32.5,12.75 32.5,27.25 20,34.5 7.5,27.25 7.5,12.75' }),
      svg('svg', { class: 'trophy__glyph', x: '12', y: '12', width: '16', height: '16', viewBox: '0 0 24 24' },
        primitives.map(function (item) { return svg(item[0], item[1]); }))
    ]);
  }

  /* --- Arte do hero --------------------------------------------------------- */

  /**
   * Composição de blocos da Home: uma laje no acento cortada pela barra da marca
   * e três barras descendo em tinta. As cores vêm de classes (05-pages.css) e
   * não de atributos, para saírem dos tokens.
   */
  function heroArt() {
    return svg('svg', {
      class: 'hero-art',
      viewBox: '0 0 400 240',
      'aria-hidden': 'true',
      focusable: 'false'
    }, [
      svg('rect', { class: 'hero-art__accent', x: '0', y: '0', width: '150', height: '240', rx: '9' }),
      svg('polygon', { class: 'hero-art__cut', points: '30,240 74,240 132,0 88,0' }),
      svg('rect', { class: 'hero-art__accent', x: '166', y: '72', width: '44', height: '16', rx: '4' }),
      svg('rect', { class: 'hero-art__ink', x: '166', y: '100', width: '84', height: '140', rx: '9' }),
      svg('rect', { class: 'hero-art__mid', x: '264', y: '56', width: '64', height: '184', rx: '9' }),
      svg('rect', { class: 'hero-art__faint', x: '342', y: '20', width: '58', height: '220', rx: '9' })
    ]);
  }

  SkillHub.icons = {
    get: get,
    has: has,
    trophy: trophy,
    heroArt: heroArt
  };
})(window.SkillHub);
