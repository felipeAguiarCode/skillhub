/* ==========================================================================
   core.js — namespace, DOM factory, storage, clipboard, download e toast.

   Regra estrutural: nada aqui expõe um caminho para injetar HTML. Texto vindo
   do catálogo ou digitado pelo usuario sempre entra como text node
   (ADR-010 / PRD §11).
   ========================================================================== */

window.SkillHub = window.SkillHub || {};

/* --- DOM ------------------------------------------------------------------ */

(function (SkillHub) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:'];

  /**
   * Cria um elemento. `children` aceita string, Node, null ou array aninhado;
   * strings sempre viram text node, nunca markup.
   */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    applyProps(node, props);
    mount(node, children);
    return node;
  }

  /** Igual a `el`, mas no namespace SVG (ícones e ornamentos). */
  function svg(tag, props, children) {
    var node = document.createElementNS(SVG_NS, tag);
    applyProps(node, props, true);
    mount(node, children);
    return node;
  }

  function applyProps(node, props, isSvg) {
    if (!props) return;
    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === false) return;

      if (key === 'class') {
        if (isSvg) node.setAttribute('class', value);
        else node.className = value;
        return;
      }
      if (key === 'text') {
        node.textContent = String(value);
        return;
      }
      if (key === 'dataset') {
        Object.keys(value).forEach(function (dataKey) {
          if (value[dataKey] !== null && value[dataKey] !== undefined) {
            node.dataset[dataKey] = String(value[dataKey]);
          }
        });
        return;
      }
      if (key === 'style') {
        // Aceito somente como objeto, e só para valores calculados em runtime.
        Object.keys(value).forEach(function (prop) {
          node.style.setProperty(prop, String(value[prop]));
        });
        return;
      }
      if (key.indexOf('on') === 0 && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
        return;
      }
      if (key === 'href' && !isSvg) {
        var safe = safeHref(value);
        if (safe) node.setAttribute('href', safe);
        return;
      }
      if (value === true) {
        node.setAttribute(key, '');
        return;
      }
      node.setAttribute(key, String(value));
    });
  }

  function mount(node, children) {
    if (children === null || children === undefined || children === false) return node;
    if (Array.isArray(children)) {
      children.forEach(function (child) { mount(node, child); });
      return node;
    }
    if (children instanceof Node) {
      node.appendChild(children);
      return node;
    }
    node.appendChild(document.createTextNode(String(children)));
    return node;
  }

  function clear(node) {
    if (!node) return node;
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  function replace(node, children) {
    return mount(clear(node), children);
  }

  /**
   * Só devolve a URL quando o protocolo é seguro. Hashes internos passam.
   * Qualquer outra coisa (javascript:, data:, blob: de terceiros) devolve null,
   * e o chamador renderiza o valor como texto.
   */
  function safeHref(value) {
    var raw = String(value === null || value === undefined ? '' : value).trim();
    if (!raw) return null;
    if (raw.charAt(0) === '#') return raw;
    if (raw.charAt(0) === '/' || raw.indexOf('./') === 0) return raw;
    var parsed;
    try {
      parsed = new URL(raw, window.location.href);
    } catch (error) {
      return null;
    }
    return SAFE_PROTOCOLS.indexOf(parsed.protocol) === -1 ? null : parsed.href;
  }

  function query(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  SkillHub.dom = {
    el: el,
    svg: svg,
    clear: clear,
    replace: replace,
    safeHref: safeHref,
    query: query
  };
})(window.SkillHub);

/* --- Util ----------------------------------------------------------------- */

(function (SkillHub) {
  'use strict';

  /**
   * Debounce com `flush()` e `cancel()`. O flush existe para que um estado
   * pendente possa ser gravado na hora quando a página vai sumir — sem ele, uma
   * sequência de ações mais rápida que `wait` reinicia o timer indefinidamente
   * e nada é persistido.
   */
  function debounce(fn, wait) {
    var timer = null;
    var lastArgs = null;
    var lastSelf = null;

    function run() {
      var args = lastArgs;
      var self = lastSelf;
      timer = null;
      lastArgs = null;
      lastSelf = null;
      if (args) fn.apply(self, args);
    }

    function debounced() {
      lastArgs = arguments;
      lastSelf = this;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(run, wait);
    }

    debounced.flush = function () {
      if (!timer) return;
      window.clearTimeout(timer);
      run();
    };

    debounced.cancel = function () {
      if (timer) window.clearTimeout(timer);
      timer = null;
      lastArgs = null;
      lastSelf = null;
    };

    return debounced;
  }

  /** Divide uma entrada de texto separada por vírgula ou nova linha. */
  function splitList(value) {
    return String(value === null || value === undefined ? '' : value)
      .split(/[\n,]/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function unique(list) {
    var seen = Object.create(null);
    return list.filter(function (item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }

  /** kebab-case seguro, sem acentos, para nomes de diretório e de arquivo. */
  function slugify(value) {
    return String(value === null || value === undefined ? '' : value)
      .normalize('NFD')
      .replace(/[^\x00-\x7F]/g, '') // pós-NFD isso remove as marcas de acento
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function formatDate(iso) {
    if (!iso) return 'Data não informada';
    var parsed = new Date(iso + 'T00:00:00');
    if (isNaN(parsed.getTime())) return 'Data não informada';
    return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  /**
   * Monta a árvore ASCII de um pacote de Skill a partir de caminhos planos.
   * Ordem: SKILL.md, demais arquivos A–Z, depois diretórios A–Z — a mesma do
   * exemplo em docs/SKILL_BUILDER_SPEC.md §2.
   */
  function treeLines(root, paths) {
    var tree = Object.create(null);

    (paths || []).forEach(function (path) {
      var parts = String(path).replace(/\\/g, '/').split('/').filter(Boolean);
      var level = tree;
      parts.forEach(function (part, index) {
        var isLeaf = index === parts.length - 1;
        if (!level[part]) level[part] = { children: Object.create(null), isDir: !isLeaf };
        if (!isLeaf) level[part].isDir = true;
        level = level[part].children;
      });
    });

    var lines = [String(root).replace(/\/+$/, '') + '/'];

    function sortNames(level) {
      return Object.keys(level).sort(function (a, b) {
        var aDir = level[a].isDir;
        var bDir = level[b].isDir;
        if (aDir !== bDir) return aDir ? 1 : -1;
        if (!aDir) {
          if (a === 'SKILL.md') return -1;
          if (b === 'SKILL.md') return 1;
        }
        return a.localeCompare(b);
      });
    }

    function walk(level, prefix) {
      var names = sortNames(level);
      names.forEach(function (name, index) {
        var isLast = index === names.length - 1;
        var entry = level[name];
        lines.push(prefix + (isLast ? '└── ' : '├── ') + name + (entry.isDir ? '/' : ''));
        if (entry.isDir) walk(entry.children, prefix + (isLast ? '    ' : '│   '));
      });
    }

    walk(tree, '');
    return lines;
  }

  var TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

  /**
   * O foco está num campo de texto?
   *
   * Mora aqui porque tem dois consumidores: o atalho "/" do app.js e as teclas
   * de navegação da apresentação. Atalho de uma tecla que não checa isto rouba
   * a digitação de quem está preenchendo um formulário.
   */
  function isTyping() {
    var active = document.activeElement;
    if (!active) return false;
    if (TYPING_TAGS.indexOf(active.tagName) !== -1) return true;
    return active.isContentEditable === true;
  }

  SkillHub.util = {
    debounce: debounce,
    isTyping: isTyping,
    splitList: splitList,
    unique: unique,
    slugify: slugify,
    formatDate: formatDate,
    pluralize: pluralize,
    treeLines: treeLines
  };
})(window.SkillHub);

/* --- Storage -------------------------------------------------------------- */

(function (SkillHub) {
  'use strict';

  var KEYS = {
    draft: 'skillhub.builder.draft.v1',
    favorites: 'skillhub.favorites.v1',
    ui: 'skillhub.ui.v1'
  };

  /** Toda leitura tolera storage bloqueado e JSON corrompido (QA §localStorage). */
  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * O app se chamava "toko" antes do rename. Move o que existir das chaves
   * antigas para as novas, uma única vez, para ninguém perder rascunho nem
   * favoritos. Só copia quando a chave nova ainda não existe.
   */
  var LEGACY_KEYS = {
    'toko.builder.draft.v1': KEYS.draft,
    'toko.favorites.v1': KEYS.favorites,
    'toko.ui.v1': KEYS.ui
  };

  function migrateLegacyKeys() {
    Object.keys(LEGACY_KEYS).forEach(function (oldKey) {
      try {
        var value = window.localStorage.getItem(oldKey);
        if (value === null) return;
        if (window.localStorage.getItem(LEGACY_KEYS[oldKey]) === null) {
          window.localStorage.setItem(LEGACY_KEYS[oldKey], value);
        }
        window.localStorage.removeItem(oldKey);
      } catch (error) {
        // Storage bloqueado: seguir sem migrar não quebra nada.
      }
    });
  }

  migrateLegacyKeys();

  SkillHub.store = { KEYS: KEYS, read: read, write: write, remove: remove };
})(window.SkillHub);

/* --- Toast ---------------------------------------------------------------- */

(function (SkillHub) {
  'use strict';

  var TYPES = { success: 'check', info: 'info', warning: 'alert', error: 'alert' };
  var timer = null;

  function show(message, type) {
    var host = document.getElementById('toast');
    if (!host) return;
    var kind = TYPES[type] ? type : 'info';

    host.className = 'toast toast--' + kind;
    SkillHub.dom.replace(host, [
      SkillHub.icons.get(TYPES[kind]),
      SkillHub.dom.el('span', null, message)
    ]);

    // Reinicia a transição mesmo quando um toast já está visível.
    if (timer) window.clearTimeout(timer);
    window.requestAnimationFrame(function () { host.classList.add('is-visible'); });
    timer = window.setTimeout(function () {
      host.classList.remove('is-visible');
      timer = null;
    }, 3200);
  }

  SkillHub.toast = { show: show };
})(window.SkillHub);

/* --- Clipboard ------------------------------------------------------------ */

(function (SkillHub) {
  'use strict';

  /**
   * `navigator.clipboard` não existe em contexto não seguro (file://), por isso
   * a API é sempre checada e há fallback por textarea + execCommand.
   */
  function copy(value, successMessage) {
    var content = String(value === null || value === undefined ? '' : value);
    var done = successMessage || 'Copiado para a área de transferência.';

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(content).then(function () {
        SkillHub.toast.show(done, 'success');
      }).catch(function () {
        fallback(content, done);
      });
      return;
    }
    fallback(content, done);
  }

  function fallback(content, done) {
    var area = SkillHub.dom.el('textarea', {
      'aria-hidden': 'true',
      tabindex: '-1',
      style: { position: 'fixed', top: '0', left: '0', opacity: '0' }
    });
    area.value = content;
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }
    area.remove();
    if (copied) SkillHub.toast.show(done, 'success');
    else SkillHub.toast.show('Não foi possível copiar automaticamente. Selecione o texto e use Ctrl+C.', 'warning');
  }

  SkillHub.clipboard = { copy: copy };
})(window.SkillHub);

/* --- Download ------------------------------------------------------------- */

(function (SkillHub) {
  'use strict';

  function blob(filename, data, mime) {
    var target = data instanceof Blob ? data : new Blob([data], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(target);
    var link = SkillHub.dom.el('a', { download: filename });
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revogar cedo cancela o download em Firefox/Safari.
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  function textFile(filename, content, mime) {
    blob(filename, content, mime || 'text/markdown;charset=utf-8');
  }

  SkillHub.download = { blob: blob, textFile: textFile };
})(window.SkillHub);
