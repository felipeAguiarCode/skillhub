/* ==========================================================================
   markdown.js — SkillHub.markdown

   Renderiza Markdown para nós do DOM, construídos com SkillHub.dom.el. Não
   existe caminho de injeção aqui: todo texto vira nó de texto, e só os
   elementos desta lista são criados. Nenhum innerHTML, nenhum eval.

   ESCOPO: conteúdo autorado NESTE repositório — hoje os guias de coding style.
   Conteúdo de catálogo continua sendo exibido como TEXTO, em code box, porque é
   material de terceiros (ADR-010). Não use este módulo para renderizar
   `item.content` de uma Skill.

   O subconjunto suportado é o que os guias usam, e nada além:

     # ## ###        títulos
     ```lang         bloco de código (conteúdo sempre como texto)
     | a | b |       tabela com linha separadora
     * -             lista não ordenada
     * [ ] * [x]     lista de tarefas
     1.              lista ordenada
     >               citação
     ---             régua
     `code`          código inline
     **bold**        negrito
     [texto](url)    link, sempre por dom.safeHref

   O que não estiver na lista é renderizado como texto literal, de propósito:
   melhor um asterisco visível do que uma regra silenciosa que ninguém revisou.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;

  /* --- Inline --------------------------------------------------------------- */

  /* Uma passada só, alternando entre os três padrões. Ordem importa: código
     inline vem primeiro, para que **texto** dentro de `crase` fique literal. */
  var INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]\n]+\]\([^)\s]+\))/;

  function inline(text) {
    var nodes = [];
    var rest = String(text);

    while (rest) {
      var match = INLINE.exec(rest);
      if (!match) {
        nodes.push(rest);
        break;
      }
      if (match.index > 0) nodes.push(rest.slice(0, match.index));

      var token = match[0];
      if (match[1]) {
        nodes.push(el('code', null, token.slice(1, -1)));
      } else if (match[2]) {
        nodes.push(el('strong', null, token.slice(2, -2)));
      } else {
        var split = token.indexOf('](');
        var label = token.slice(1, split);
        var href = SkillHub.dom.safeHref(token.slice(split + 2, -1));
        /* URL recusada pelo safeHref cai para texto: o rótulo continua legível
           e o endereço não vira link. */
        nodes.push(href
          ? el('a', { class: 'markdown__link', href: href }, label)
          : label);
      }
      rest = rest.slice(match.index + token.length);
    }

    return nodes;
  }

  /* --- Blocos --------------------------------------------------------------- */

  function isTableSeparator(line) {
    return /^\|[\s:|-]+\|$/.test(line) && line.indexOf('-') !== -1;
  }

  function tableCells(line) {
    return line.replace(/^\||\|$/g, '').split('|').map(function (cell) {
      return cell.trim();
    });
  }

  function heading(level, text, id) {
    return el('h' + level, {
      class: 'markdown__h' + level,
      id: id || null
    }, inline(text));
  }

  /**
   * Slug estável para âncora de seção. Reusa util.slugify, que já remove
   * acentos e emojis — sem isso "🧠 1. Paradigma" não viraria id válido.
   */
  function anchorId(prefix, text) {
    var slug = SkillHub.util.slugify(text);
    return prefix + '-' + (slug || 'secao');
  }

  /**
   * render(text, options) → DocumentFragment
   *
   * options.anchorPrefix — prefixo dos ids de título, para dois guias na mesma
   * página não colidirem.
   */
  function render(text, options) {
    var opts = options || {};
    var prefix = opts.anchorPrefix || 'md';
    var lines = String(text).replace(/\r\n/g, '\n').split('\n');
    var fragment = document.createDocumentFragment();
    var index = 0;

    function flushParagraph(buffer) {
      if (!buffer.length) return;
      fragment.appendChild(el('p', { class: 'markdown__p' }, inline(buffer.join(' '))));
      buffer.length = 0;
    }

    var paragraph = [];

    while (index < lines.length) {
      var line = lines[index];

      /* Bloco de código: conteúdo cru, sempre como texto. */
      var fence = /^```(\w*)\s*$/.exec(line);
      if (fence) {
        flushParagraph(paragraph);
        var code = [];
        index += 1;
        while (index < lines.length && !/^```\s*$/.test(lines[index])) {
          code.push(lines[index]);
          index += 1;
        }
        index += 1;
        fragment.appendChild(el('pre', {
          class: 'markdown__code',
          dataset: fence[1] ? { lang: fence[1] } : null
        }, el('code', null, code.join('\n'))));
        continue;
      }

      /* Régua. Precisa vir antes do parágrafo para não virar texto. */
      if (/^---+\s*$/.test(line)) {
        flushParagraph(paragraph);
        fragment.appendChild(el('hr', { class: 'markdown__rule' }));
        index += 1;
        continue;
      }

      var title = /^(#{1,3})\s+(.*)$/.exec(line);
      if (title) {
        flushParagraph(paragraph);
        var level = title[1].length;
        fragment.appendChild(heading(level, title[2],
          level === 1 ? anchorId(prefix, title[2]) : null));
        index += 1;
        continue;
      }

      /* Tabela: só quando a linha seguinte é o separador. */
      if (line.indexOf('|') === 0 && isTableSeparator(lines[index + 1] || '')) {
        flushParagraph(paragraph);
        var head = tableCells(line);
        index += 2;
        var rows = [];
        while (index < lines.length && lines[index].indexOf('|') === 0) {
          rows.push(tableCells(lines[index]));
          index += 1;
        }
        fragment.appendChild(el('div', { class: 'markdown__table-wrap' },
          el('table', { class: 'markdown__table' }, [
            el('thead', null, el('tr', null, head.map(function (cell) {
              return el('th', null, inline(cell));
            }))),
            el('tbody', null, rows.map(function (row) {
              return el('tr', null, row.map(function (cell) {
                return el('td', null, inline(cell));
              }));
            }))
          ])));
        continue;
      }

      /* Citação: linhas consecutivas viram um bloco. */
      if (/^>\s?/.test(line)) {
        flushParagraph(paragraph);
        var quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quote.push(lines[index].replace(/^>\s?/, ''));
          index += 1;
        }
        fragment.appendChild(el('blockquote', { class: 'markdown__quote' },
          quote.filter(Boolean).map(function (part) {
            return el('p', null, inline(part));
          })));
        continue;
      }

      /* Listas. Itens de tarefa mantêm a caixa como texto, sem checkbox real:
         não há estado para guardar e um input aqui seria só decoração focável. */
      var bullet = /^[*-]\s+(.*)$/.exec(line);
      var ordered = /^\d+\.\s+(.*)$/.exec(line);
      if (bullet || ordered) {
        flushParagraph(paragraph);
        var isOrdered = Boolean(ordered);
        var items = [];
        var hasTask = false;
        while (index < lines.length) {
          var itemMatch = isOrdered
            ? /^\d+\.\s+(.*)$/.exec(lines[index])
            : /^[*-]\s+(.*)$/.exec(lines[index]);
          if (!itemMatch) {
            /* Continuação indentada pertence ao item anterior. */
            var continuation = /^\s{2,}(\S.*)$/.exec(lines[index]);
            if (continuation && items.length) {
              items[items.length - 1] += ' ' + continuation[1];
              index += 1;
              continue;
            }
            break;
          }
          items.push(itemMatch[1]);
          index += 1;
        }
        var listItems = items.map(function (item) {
          var task = /^\[([ xX])\]\s*(.*)$/.exec(item);
          if (!task) return el('li', null, inline(item));
          hasTask = true;
          return el('li', { class: 'markdown__task' }, [
            el('span', { class: 'markdown__box', 'aria-hidden': 'true' },
              task[1].toLowerCase() === 'x' ? '✓' : ''),
            el('span', null, inline(task[2]))
          ]);
        });
        fragment.appendChild(el(isOrdered ? 'ol' : 'ul', {
          class: 'markdown__list' + (hasTask ? ' markdown__list--tasks' : '')
        }, listItems));
        continue;
      }

      if (!line.trim()) {
        flushParagraph(paragraph);
        index += 1;
        continue;
      }

      paragraph.push(line.trim());
      index += 1;
    }

    flushParagraph(paragraph);
    return fragment;
  }

  /** Índice das seções de nível 1, para navegação. */
  function outline(text, options) {
    var prefix = (options || {}).anchorPrefix || 'md';
    var sections = [];
    var inFence = false;

    String(text).replace(/\r\n/g, '\n').split('\n').forEach(function (line) {
      if (/^```/.test(line)) {
        inFence = !inFence;
        return;
      }
      if (inFence) return;
      var title = /^#\s+(.*)$/.exec(line);
      if (!title) return;
      sections.push({
        title: title[1],
        id: anchorId(prefix, title[1])
      });
    });

    return sections;
  }

  SkillHub.markdown = {
    render: render,
    outline: outline,
    inline: inline
  };
})(window.SkillHub);
