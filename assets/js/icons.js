/* ==========================================================================
   icons.js — SkillHub.icons

   Ícones lineares em SVG inline (CLAUDE.md §Regras visuais). Todos usam
   `currentColor`, viewBox 24 e stroke definido no CSS (.icon), para herdar cor
   do contexto sem variante extra. Ornamentos de página ficam em `ornament()`.
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  var svg = SkillHub.dom.svg;

  /* Cada entrada é uma lista de primitivas [tag, attrs]. */
  var PATHS = {
    /* --- Marca e navegação --- */
    hub: [
      ['circle', { cx: '12', cy: '12', r: '2.6', fill: 'currentColor', stroke: 'none' }],
      ['path', { d: 'M12 3.4v3.6M12 17v3.6M3.4 12h3.6M17 12h3.6', 'stroke-width': '2.2' }]
    ],
    home: [['path', { d: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z' }]],
    sparkle: [
      ['path', { d: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4' }]
    ],
    hexagon: [['path', { d: 'M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3z' }]],
    doc: [
      ['path', { d: 'M6 3h8l4 4v14H6z' }],
      ['path', { d: 'M14 3v4h4M9 12h6M9 16h6' }]
    ],
    graph: [
      ['circle', { cx: '12', cy: '5', r: '2.2' }],
      ['circle', { cx: '5', cy: '18', r: '2.2' }],
      ['circle', { cx: '19', cy: '18', r: '2.2' }],
      ['path', { d: 'M10.4 6.7 6.2 15.9M13.6 6.7l4.2 9.2M7.2 18h9.6' }]
    ],
    wand: [
      ['path', { d: 'M4 20 15 9M13.5 4v3M19.5 6.5l-2 2M20 12.5h-3M17.5 3.5l-1.5 1.5' }],
      ['path', { d: 'M14 7.5 16.5 10' }]
    ],

    /* --- Controles --- */
    search: [
      ['circle', { cx: '11', cy: '11', r: '6.5' }],
      ['path', { d: 'M16 16l4 4' }]
    ],
    bookmark: [['path', { d: 'M7 4h10v17l-5-3.5L7 21z' }]],
    copy: [
      ['rect', { x: '9', y: '9', width: '11', height: '11', rx: '2.5' }],
      ['path', { d: 'M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5' }]
    ],
    download: [['path', { d: 'M12 4v11M8 11.5l4 4 4-4M5 20h14' }]],
    upload: [['path', { d: 'M12 20V9M8 12.5l4-4 4 4M5 4h14' }]],
    check: [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
    x: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
    plus: [['path', { d: 'M12 5v14M5 12h14' }]],
    trash: [
      ['path', { d: 'M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13' }],
      ['path', { d: 'M10 11v6M14 11v6' }]
    ],
    'chevron-right': [['path', { d: 'M9 5l7 7-7 7' }]],
    'chevron-left': [['path', { d: 'M15 5l-7 7 7 7' }]],
    'arrow-right': [['path', { d: 'M4 12h15M13 6l6 6-6 6' }]],
    'arrow-left': [['path', { d: 'M20 12H5M11 6l-6 6 6 6' }]],
    external: [
      ['path', { d: 'M14 4h6v6' }],
      ['path', { d: 'M20 4l-8 8' }],
      ['path', { d: 'M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4' }]
    ],
    alert: [
      ['path', { d: 'M12 4.5 21 20H3z' }],
      ['path', { d: 'M12 10v4.5M12 17.2v.3' }]
    ],
    info: [
      ['circle', { cx: '12', cy: '12', r: '8.5' }],
      ['path', { d: 'M12 11v6M12 7.8v.3' }]
    ],
    shield: [
      ['path', { d: 'M12 3.5 19 6v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6z' }],
      ['path', { d: 'M9 12.2l2.2 2.3L15.5 10' }]
    ],
    lock: [
      ['rect', { x: '5', y: '11', width: '14', height: '9', rx: '2' }],
      ['path', { d: 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3' }]
    ],
    server: [
      ['rect', { x: '4', y: '4.5', width: '16', height: '6', rx: '1.6' }],
      ['rect', { x: '4', y: '13.5', width: '16', height: '6', rx: '1.6' }],
      ['path', { d: 'M7.5 7.5h.01M7.5 16.5h.01' }]
    ],
    eye: [
      ['path', { d: 'M2.8 12S6.2 6.5 12 6.5 21.2 12 21.2 12 17.8 17.5 12 17.5 2.8 12 2.8 12z' }],
      ['circle', { cx: '12', cy: '12', r: '2.8' }]
    ],
    panel: [
      ['rect', { x: '3.5', y: '4.5', width: '17', height: '15', rx: '2.5' }],
      ['path', { d: 'M9.5 4.5v15' }]
    ],
    sliders: [
      ['path', { d: 'M4 8h10M18 8h2M4 16h4M12 16h8' }],
      ['circle', { cx: '16', cy: '8', r: '2' }],
      ['circle', { cx: '10', cy: '16', r: '2' }]
    ],
    layers: [
      ['path', { d: 'M12 4 4 8.2l8 4.3 8-4.3z' }],
      ['path', { d: 'M4 13.2 12 17.5l8-4.3' }]
    ],

    /* --- Domínio --- */
    terminal: [
      ['rect', { x: '3.5', y: '4.5', width: '17', height: '15', rx: '2.5' }],
      ['path', { d: 'M7.5 9.5l2.5 2.5-2.5 2.5M12.5 15h4' }]
    ],
    code: [
      ['path', { d: 'M9 8l-4 4 4 4M15 8l4 4-4 4' }]
    ],
    file: [
      ['path', { d: 'M6.5 3.5h7l4.5 4.5v12.5h-11.5z' }],
      ['path', { d: 'M13.5 3.5V8H18' }]
    ],
    folder: [['path', { d: 'M3.5 6.5h5.5l2 2.5h9.5v10.5h-17z' }]],
    package: [
      ['path', { d: 'M12 3.5 20 7.7v8.6L12 20.5 4 16.3V7.7z' }],
      ['path', { d: 'M4 7.7l8 4.2 8-4.2M12 11.9v8.6' }]
    ],
    'git-branch': [
      ['circle', { cx: '7', cy: '6', r: '2.2' }],
      ['circle', { cx: '7', cy: '18', r: '2.2' }],
      ['circle', { cx: '17', cy: '9', r: '2.2' }],
      ['path', { d: 'M7 8.2v7.6M17 11.2c0 3-3.5 3-6 4.4' }]
    ],
    database: [
      ['ellipse', { cx: '12', cy: '6.5', rx: '7', ry: '2.8' }],
      ['path', { d: 'M5 6.5v11c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-11' }],
      ['path', { d: 'M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8' }]
    ],
    table: [
      ['rect', { x: '4', y: '5', width: '16', height: '14', rx: '2' }],
      ['path', { d: 'M4 10h16M10 10v9' }]
    ],
    chart: [['path', { d: 'M4 20V4M4 20h16M8 16V11M12.5 16V7.5M17 16v-3' }]],
    flask: [
      ['path', { d: 'M9.5 4h5v4.5l4.5 8.5a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 17z' }],
      ['path', { d: 'M8 4h8M7.4 15h9.2' }]
    ],
    rocket: [
      ['path', { d: 'M12 3.5c3.4 2.4 5 5.6 5 9.2L12 17l-5-4.3c0-3.6 1.6-6.8 5-9.2z' }],
      ['path', { d: 'M9.5 16.5 8 21l4-2 4 2-1.5-4.5' }],
      ['circle', { cx: '12', cy: '10', r: '1.6' }]
    ],
    book: [
      ['path', { d: 'M4 5.5A2 2 0 0 1 6 3.5h13v15H6a2 2 0 0 0-2 2z' }],
      ['path', { d: 'M8 8h7M8 11.5h7' }]
    ],
    pen: [
      ['path', { d: 'M4 20l1-4 11-11 3 3-11 11z' }],
      ['path', { d: 'M14.5 6.5 17.5 9.5' }]
    ],
    users: [
      ['circle', { cx: '9.5', cy: '8.5', r: '3' }],
      ['path', { d: 'M4 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5' }],
      ['path', { d: 'M16 6.2a3 3 0 0 1 0 5.6M17.5 20c0-2.2-.8-3.9-2.2-5' }]
    ],
    cloud: [['path', { d: 'M7.5 18a3.5 3.5 0 0 1-.3-7A5 5 0 0 1 17 10.6a3.7 3.7 0 0 1-.4 7.4z' }]],
    zap: [['path', { d: 'M13 3 6 13.5h5L10.5 21 18 10h-5z' }]],
    bug: [
      ['rect', { x: '8', y: '8', width: '8', height: '11', rx: '4' }],
      ['path', { d: 'M8 12H4M20 12h-4M8.5 16H5M19 16h-3.5M9.5 8.5 8 5M14.5 8.5 16 5' }]
    ],
    refresh: [
      ['path', { d: 'M19.5 12a7.5 7.5 0 0 1-13 5' }],
      ['path', { d: 'M4.5 12a7.5 7.5 0 0 1 13-5' }],
      ['path', { d: 'M17.5 3.5V7h-3.5M6.5 20.5V17H10' }]
    ],
    globe: [
      ['circle', { cx: '12', cy: '12', r: '8.5' }],
      ['path', { d: 'M3.5 12h17' }],
      ['ellipse', { cx: '12', cy: '12', rx: '4', ry: '8.5' }]
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

  /* --- Ornamentos editoriais ---------------------------------------------- */

  /** Starburst do frame "Claude Skills" do conceito. */
  function starburst(size) {
    var rays = [];
    var count = 12;
    for (var i = 0; i < count; i += 1) {
      var angle = (Math.PI * 2 * i) / count;
      var inner = 12;
      var outer = i % 2 === 0 ? 52 : 38;
      rays.push(svg('path', {
        d: 'M' + (60 + Math.cos(angle) * inner).toFixed(1) + ' ' + (60 + Math.sin(angle) * inner).toFixed(1) +
           'L' + (60 + Math.cos(angle) * outer).toFixed(1) + ' ' + (60 + Math.sin(angle) * outer).toFixed(1),
        'stroke-width': '5',
        'stroke-linecap': 'round'
      }));
    }
    return svg('svg', {
      class: 'ornament',
      width: String(size),
      height: String(size),
      viewBox: '0 0 120 120',
      'aria-hidden': 'true',
      focusable: 'false',
      stroke: 'currentColor',
      fill: 'none'
    }, rays);
  }

  /** Globo wireframe do frame "Codex Skills". */
  function wireGlobe(size) {
    var shapes = [
      svg('circle', { cx: '60', cy: '60', r: '52' }),
      svg('ellipse', { cx: '60', cy: '60', rx: '52', ry: '20' }),
      svg('ellipse', { cx: '60', cy: '60', rx: '52', ry: '38' }),
      svg('ellipse', { cx: '60', cy: '60', rx: '20', ry: '52' }),
      svg('ellipse', { cx: '60', cy: '60', rx: '38', ry: '52' }),
      svg('path', { d: 'M8 60h104M60 8v104' })
    ];
    return svg('svg', {
      class: 'ornament',
      width: String(size),
      height: String(size),
      viewBox: '0 0 120 120',
      'aria-hidden': 'true',
      focusable: 'false',
      stroke: 'currentColor',
      fill: 'none',
      'stroke-width': '1.4'
    }, shapes);
  }

  /** Documento do frame "Prompt Engineering". */
  function paper(size) {
    var shapes = [
      svg('rect', { x: '22', y: '10', width: '76', height: '100', rx: '6', 'stroke-width': '3' }),
      svg('path', { d: 'M38 36h44M38 52h44M38 68h30M38 84h20', 'stroke-width': '4', 'stroke-linecap': 'round' })
    ];
    return svg('svg', {
      class: 'ornament',
      width: String(size),
      height: String(size),
      viewBox: '0 0 120 120',
      'aria-hidden': 'true',
      focusable: 'false',
      stroke: 'currentColor',
      fill: 'none'
    }, shapes);
  }

  /** Grafo triangular do frame "Agentes". */
  function triangleGraph(size) {
    var shapes = [
      svg('path', { d: 'M60 22 100 96H20z', 'stroke-width': '3' }),
      svg('circle', { cx: '60', cy: '22', r: '11', 'stroke-width': '3', fill: 'var(--color-bg)' }),
      svg('circle', { cx: '20', cy: '96', r: '11', 'stroke-width': '3', fill: 'var(--color-bg)' }),
      svg('circle', { cx: '100', cy: '96', r: '11', 'stroke-width': '3', fill: 'var(--color-bg)' })
    ];
    return svg('svg', {
      class: 'ornament',
      width: String(size),
      height: String(size),
      viewBox: '0 0 120 120',
      'aria-hidden': 'true',
      focusable: 'false',
      stroke: 'currentColor',
      fill: 'none'
    }, shapes);
  }

  /** Arte geométrica do hero da Home: bloco de código + cruz. */
  function heroArt(size) {
    var shapes = [
      svg('rect', {
        x: '34', y: '26', width: '116', height: '116', rx: '18',
        fill: 'var(--color-accent-deep)', stroke: 'none', opacity: '.5'
      }),
      svg('rect', {
        x: '12', y: '48', width: '104', height: '104', rx: '16',
        fill: 'var(--color-accent)', stroke: 'none'
      }),
      svg('path', {
        d: 'M52 84 40 100l12 16M76 84l12 16-12 16',
        stroke: 'var(--color-ink)', 'stroke-width': '6',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none'
      }),
      svg('path', {
        d: 'M138 158v34M121 175h34',
        stroke: 'var(--color-accent)', 'stroke-width': '8', 'stroke-linecap': 'round'
      })
    ];
    return svg('svg', {
      class: 'ornament',
      width: String(size),
      height: String(size),
      viewBox: '0 0 200 210',
      'aria-hidden': 'true',
      focusable: 'false'
    }, shapes);
  }

  var ORNAMENTS = {
    'claude-skills': starburst,
    'codex-skills': wireGlobe,
    'prompt-engineering': paper,
    agents: triangleGraph
  };

  function ornament(key, size) {
    var factory = ORNAMENTS[key];
    return factory ? factory(size || 116) : null;
  }

  SkillHub.icons = {
    get: get,
    has: has,
    ornament: ornament,
    heroArt: heroArt
  };
})(window.SkillHub);
