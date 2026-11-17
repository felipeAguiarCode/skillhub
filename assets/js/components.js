/* ==========================================================================
   components.js — SkillHub.ui

   Fábricas de componentes. Toda função devolve um Node construído com
   SkillHub.dom, então nenhum texto de catálogo ou de formulário passa por HTML.
   ========================================================================== */

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var icon = SkillHub.icons.get;

  /* --- Texto de apoio ------------------------------------------------------ */

  var RISK_LABELS = {
    low: 'Baixo risco aparente',
    moderate: 'Risco moderado',
    elevated: 'Risco elevado'
  };
  var RISK_ICONS = { low: 'shield', moderate: 'alert', elevated: 'alert' };

  function riskLabel(level) {
    return RISK_LABELS[level] || 'Risco não avaliado';
  }

  /* --- Primitivos ---------------------------------------------------------- */

  function eyebrow(label) {
    return el('span', { class: 'eyebrow' }, label);
  }

  function badge(label, variant, iconName) {
    return el('span', {
      class: 'badge' + (variant ? ' badge--' + variant : '')
    }, [
      iconName ? icon(iconName, 'icon--sm') : null,
      el('span', null, label)
    ]);
  }

  /** Badge de risco sempre com ícone + texto: nunca só cor (DESIGN_SYSTEM §10). */
  function riskBadge(level) {
    var key = RISK_LABELS[level] ? level : 'moderate';
    return badge(riskLabel(key), key, RISK_ICONS[key]);
  }

  function badgeRow(children) {
    return el('div', { class: 'badge-row' }, children);
  }

  function button(options) {
    var opts = options || {};
    var classes = ['btn'];
    if (opts.variant) classes.push('btn--' + opts.variant);
    if (opts.block) classes.push('btn--block');
    if (opts.className) classes.push(opts.className);

    var props = {
      class: classes.join(' '),
      type: opts.href ? null : (opts.type || 'button'),
      disabled: opts.disabled ? true : null,
      title: opts.title || null,
      'aria-label': opts.ariaLabel || null,
      'aria-pressed': opts.pressed === undefined ? null : String(Boolean(opts.pressed)),
      dataset: opts.dataset || null,
      onclick: opts.onClick || null
    };

    /* O rótulo é o PRIMEIRO <span> do botão, e isso é contrato: quem troca o
       texto depois (favoritar, contador de filtros) escreve nele. */
    var content = [
      opts.icon ? icon(opts.icon) : null,
      opts.label ? el('span', null, opts.label) : null,
      opts.iconAfter ? icon(opts.iconAfter) : null
    ];

    if (opts.href) {
      props.href = opts.href;
      // Link para fora do app nunca compartilha o contexto de navegação.
      if (opts.external) {
        props.target = '_blank';
        props.rel = 'noopener noreferrer';
      }
      return el('a', props, content);
    }
    return el('button', props, content);
  }

  function iconButton(options) {
    var opts = options || {};
    return el('button', {
      class: 'btn btn--icon' + (opts.active ? ' is-active' : '') + (opts.className ? ' ' + opts.className : ''),
      type: 'button',
      title: opts.title || opts.ariaLabel,
      'aria-label': opts.ariaLabel || opts.title,
      'aria-pressed': opts.pressed === undefined ? null : String(Boolean(opts.pressed)),
      onclick: opts.onClick || null
    }, icon(opts.icon));
  }

  /* --- Cabeçalho de página ------------------------------------------------ */

  function pageHeader(options) {
    var opts = options || {};
    return el('header', { class: 'page-header' }, [
      opts.eyebrow ? eyebrow(opts.eyebrow) : null,
      el('h1', { class: 'page-title' }, opts.title),
      opts.copy ? el('p', { class: 'page-copy' }, opts.copy) : null
    ]);
  }

  /**
   * Cabeçalho de grupo. `large` é o título de bloco de página (home).
   * `index` ("01") e `description` são opcionais — número
   * só quando os grupos formam uma sequência de verdade.
   */
  function section(options) {
    var opts = options || {};
    return el('section', { class: 'section' + (opts.large ? ' section--large' : '') }, [
      el('div', { class: 'section__head' }, [
        el('div', { class: 'section__heading' }, [
          el('div', { class: 'section__top' }, [
            opts.index ? el('span', { class: 'section__index', 'aria-hidden': 'true' }, opts.index) : null,
            el('h2', { class: 'section__title' }, opts.title)
          ]),
          opts.description ? el('p', { class: 'section__desc' }, opts.description) : null
        ]),
        /* `linkButton`: o link vira botão de contorno, para a seção que abre
           um bloco inteiro da página. */
        opts.linkHref && opts.linkButton ? button({
          label: opts.linkLabel || 'Ver todos',
          variant: 'outline',
          iconAfter: 'arrow-right',
          href: opts.linkHref
        }) : null,
        opts.linkHref && !opts.linkButton ? el('a', { class: 'section__link', href: opts.linkHref }, [
          el('span', null, opts.linkLabel || 'Ver todos'),
          icon('arrow-right', 'icon--sm')
        ]) : null
      ]),
      opts.body
    ]);
  }

  /* --- Cards --------------------------------------------------------------- */

  function card(options) {
    var opts = options || {};
    var classes = ['card'];
    if (opts.href) classes.push('card--link');
    if (opts.className) classes.push(opts.className);

    var props = { class: classes.join(' ') };
    if (opts.href) props.href = opts.href;
    return el(opts.href ? 'a' : 'div', props, opts.body);
  }

  /**
   * Painéis empilhados numa borda só: [{ kicker, body }]. Para explicar um
   * conceito em duas a quatro partes; nada de botão dentro.
   */
  function panels(items) {
    return el('div', { class: 'panels' }, (items || []).map(function (item) {
      return el('section', { class: 'panel' }, [
        el('h3', { class: 'panel__kicker' }, item.kicker),
        el('p', { class: 'panel__body' }, item.body)
      ]);
    }));
  }

  /**
   * Bloco de chamada com fundo em degradê: título, uma frase e UMA ação.
   * `action` é um nó pronto — quem chama escolhe a variante do botão, porque
   * só a página sabe se já tem um primário.
   */
  function banner(options) {
    var opts = options || {};
    return el('div', { class: 'banner' }, [
      el('div', { class: 'banner__text' }, [
        opts.eyebrow ? eyebrow(opts.eyebrow) : null,
        el('h2', { class: 'banner__title' }, opts.title),
        opts.copy ? el('p', { class: 'banner__copy' }, opts.copy) : null
      ]),
      opts.action ? el('div', { class: 'banner__action' }, opts.action) : null
    ]);
  }

  /** Número com rótulo. Só para contagem real: o app não mede uso. */
  function stat(options) {
    var opts = options || {};
    return el('div', { class: 'stat' }, [
      opts.icon ? el('span', { class: 'stat__icon' }, icon(opts.icon, 'icon--xl')) : null,
      el('span', { class: 'stat__value' }, String(opts.value)),
      el('span', { class: 'stat__label' }, opts.label)
    ]);
  }

  /* --- Linha de catálogo --------------------------------------------------- */

  /**
   * O item padrão do sistema: tile, slug mono, título, uma frase, badges, seta.
   *
   * A linha inteira é UM link. Não há controle dentro dela — por isso a estrela
   * é só indicador (com texto para leitor de tela) e favoritar continua na
   * página do item: um botão dentro de um <a> é HTML inválido e ruim de teclado.
   */
  function row(opts) {
    return el('a', {
      class: 'skill-card',
      href: opts.href,
      // Link para fora do app nunca compartilha o contexto de navegação.
      target: opts.external ? '_blank' : null,
      rel: opts.external ? 'noopener noreferrer' : null
    }, [
      opts.trophy
        ? SkillHub.icons.trophy(opts.icon)
        : el('span', { class: 'skill-card__icon' }, icon(opts.icon, 'icon--lg')),
      el('div', { class: 'skill-card__body' }, [
        opts.slug ? el('span', { class: 'skill-card__slug' }, opts.slug) : null,
        el('h3', { class: 'skill-card__title' }, opts.title),
        opts.desc ? el('p', { class: 'skill-card__desc', title: opts.desc }, opts.desc) : null,
        opts.meta && opts.meta.length ? el('div', { class: 'skill-card__meta' }, opts.meta) : null
      ]),
      opts.favorite ? [
        icon('star', 'skill-card__star'),
        el('span', { class: 'u-sr-only' }, 'Favorito')
      ] : null,
      opts.external ? el('span', { class: 'u-sr-only' }, '(abre em nova aba)') : null,
      icon(opts.external ? 'external' : 'arrow-right', 'skill-card__arrow')
    ]);
  }

  function categoryCard(options) {
    var opts = options || {};
    return row({ href: opts.href, icon: opts.icon, slug: opts.slug, title: opts.title, desc: opts.copy });
  }

  /**
   * `categoryLabel` e `favorite` vêm de quem chama: os rótulos e os favoritos
   * moram em catalog.js, que carrega depois deste arquivo.
   */
  function skillCard(item, options) {
    var opts = options || {};
    var format = SkillHub.formats.get(item.format);
    var flags = item.flags || {};
    return row({
      href: '#/skill/' + encodeURIComponent(item.id),
      icon: item.icon,
      trophy: true,
      slug: SkillHub.formats.slug(item.format, item.id),
      title: item.name,
      desc: item.description,
      favorite: opts.favorite,
      meta: [
        // O formato vem primeiro: é o que decide onde o arquivo é instalado.
        badge(format.short, 'info', format.icon),
        badge(opts.categoryLabel || item.category),
        riskBadge(item.risk),
        /* Neutros de propósito: flag colorida ao lado do badge de risco leria
           como um segundo aviso, e o acento ficaria espalhado pela lista. */
        flags.shell ? badge(flags.shell === 'powershell' ? 'PowerShell' : 'Bash', null, 'terminal') : null,
        flags.scripts ? badge('Scripts', null, 'file') : null,
        flags.fork ? badge('Fork', null, 'layers') : null
      ]
    });
  }

  /**
   * Mesma linha, dado diferente. Não reuso skillCard porque ele espera a forma
   * de uma entrada de catálogo (format, risk, flags), e um guia de estilo não
   * tem nenhuma dessas coisas.
   *
   * Os rótulos de área e de profundidade vêm de fora (opts.areaLabel,
   * opts.depthLabel): quem tem a lista ordenada de áreas é a página, e duas
   * tabelas de rótulo divergiriam.
   */
  function styleCard(guide, options) {
    var opts = options || {};
    var count = guide.sectionCount;
    return row({
      href: '#/coding-styles/' + encodeURIComponent(guide.id),
      icon: guide.icon,
      slug: guide.id,
      title: guide.title,
      desc: guide.summary,
      meta: [
        badge(opts.areaLabel || guide.area, 'info', 'book'),
        badge(opts.depthLabel || guide.depth, null, guide.depth === 'full' ? 'layers' : 'zap'),
        badge(count + ' ' + SkillHub.util.pluralize(count, 'seção', 'seções'))
      ].concat((guide.stack || []).map(function (item) {
        return badge(item);
      }))
    });
  }

  /**
   * Linha para uma skill de terceiro (data/trending.js): não é entrada do
   * catálogo, então leva ao repositório oficial, numa aba nova. O slug é o
   * repositório, e os badges dizem de quem é.
   */
  function externalCard(entry) {
    return row({
      href: entry.url,
      external: true,
      icon: entry.icon,
      trophy: true,
      slug: entry.repo,
      title: entry.name,
      desc: entry.description,
      meta: [badge(entry.author, 'info', 'users')].concat((entry.tags || []).map(function (tag) {
        return badge(tag);
      }))
    });
  }

  /* --- Command ------------------------------------------------------------- */

  /**
   * Uma linha que se digita, com botão de copiar. O botão vira um check por
   * 1,6s — e só quando a cópia aconteceu de fato (ver clipboard.copy).
   * `prompt` é decorativo ("$" para shell); nunca entra no texto copiado.
   */
  function command(options) {
    var opts = options || {};
    var text = String(opts.command === null || opts.command === undefined ? '' : opts.command);
    var timer = null;
    var copy = el('button', {
      class: 'command__copy',
      type: 'button',
      title: opts.copyLabel || 'Copiar',
      'aria-label': opts.copyLabel || 'Copiar',
      onclick: function () {
        SkillHub.clipboard.copy(text, opts.copiedMessage, function () {
          SkillHub.dom.replace(copy, icon('check'));
          if (timer) window.clearTimeout(timer);
          timer = window.setTimeout(function () {
            SkillHub.dom.replace(copy, icon('copy'));
            timer = null;
          }, 1600);
        });
      }
    }, icon('copy'));

    return el('div', { class: 'command' }, [
      opts.prompt ? el('span', { class: 'command__prompt', 'aria-hidden': 'true' }, opts.prompt) : null,
      el('code', { class: 'command__code' }, text),
      copy
    ]);
  }

  /* --- Chips, segmented ---------------------------------------------------- */

  /**
   * Uma linha de chips de filtro, com rótulo. O data-group e o data-value são
   * parte do contrato: quem consome atualiza o aria-pressed no lugar, varrendo
   * [data-group], em vez de recriar os nós — é o que impede o foco de sair do
   * campo de busca enquanto se digita.
   */
  function chipLine(label, group, options, onSelect) {
    return el('div', { class: 'listing__filter-line', dataset: { group: group } }, [
      el('span', { class: 'listing__filter-label' }, label),
      el('div', { class: 'chips', role: 'group', 'aria-label': label }, options.map(function (option) {
        return el('button', {
          class: 'chip',
          type: 'button',
          'aria-pressed': 'false',
          dataset: { value: option.value },
          onclick: function () { onSelect(option.value); }
        }, option.label);
      }))
    ]);
  }

  function segmented(options) {
    var opts = options || {};
    return el('div', { class: 'segmented', role: 'group', 'aria-label': opts.ariaLabel || 'Modo' },
      (opts.options || []).map(function (option) {
        return el('button', {
          class: 'segmented__option',
          type: 'button',
          'aria-pressed': String(option.value === opts.value),
          onclick: function () { if (opts.onSelect) opts.onSelect(option.value); }
        }, option.label);
      }));
  }

  /* --- Busca --------------------------------------------------------------- */

  var searchSeq = 0;

  function searchField(options) {
    var opts = options || {};
    searchSeq += 1;
    var id = opts.id || 'search-' + searchSeq;
    var input = el('input', {
      id: id,
      type: 'search',
      value: opts.value || '',
      placeholder: opts.placeholder || 'Buscar...',
      autocomplete: 'off',
      spellcheck: 'false',
      oninput: opts.onInput ? function (event) { opts.onInput(event.target.value); } : null,
      onkeydown: opts.onEnter ? function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          opts.onEnter(event.target.value);
        }
      } : null
    });

    var wrapper = el('div', {
      class: 'search' + (opts.small ? ' search--sm' : '') + (opts.className ? ' ' + opts.className : '')
    }, [
      icon('search'),
      el('label', { class: 'u-sr-only', for: id }, opts.label || opts.placeholder || 'Buscar'),
      input,
      opts.kbd ? el('kbd', null, opts.kbd) : null,
      opts.action || null
    ]);

    wrapper.__input = input;
    return wrapper;
  }

  /* --- Campos de formulário ------------------------------------------------ */

  var fieldSeq = 0;

  /**
   * O slot de erro é sempre criado (oculto quando vazio) para que a mensagem
   * possa aparecer e desaparecer via setFieldError, sem re-renderizar o passo —
   * caso contrário o erro fica na tela depois de o usuário corrigir o campo.
   */
  function fieldShell(opts, control, id) {
    var message = el('span', null, opts.error || '');
    var errorSlot = el('p', { class: 'field__error', hidden: !opts.error }, [
      icon('alert', 'icon--sm'),
      message
    ]);

    var node = el('div', {
      class: 'field' + (opts.full ? ' field--full' : ''),
      dataset: opts.errorKey ? { errorKey: opts.errorKey } : null
    }, [
      el('label', { class: 'field__label', for: id }, [
        el('span', null, opts.label),
        opts.required ? el('span', { class: 'field__req' }, ' *') : null
      ]),
      control,
      opts.hint ? el('p', { class: 'field__hint' }, opts.hint) : null,
      errorSlot
    ]);

    node.__control = control;
    node.__errorSlot = errorSlot;
    node.__errorMessage = message;
    return node;
  }

  /** Liga ou desliga o erro inline de um campo já montado. */
  function setFieldError(fieldNode, error) {
    if (!fieldNode || !fieldNode.__errorSlot) return;
    var message = error || '';
    fieldNode.__errorMessage.textContent = message;
    fieldNode.__errorSlot.hidden = !message;
    if (fieldNode.__control) {
      fieldNode.__control.classList.toggle('is-invalid', Boolean(message));
      if (message) fieldNode.__control.setAttribute('aria-invalid', 'true');
      else fieldNode.__control.removeAttribute('aria-invalid');
    }
  }

  function textField(options) {
    var opts = options || {};
    fieldSeq += 1;
    var id = opts.id || 'field-' + fieldSeq;
    var control = el('input', {
      id: id,
      class: 'input' + (opts.error ? ' is-invalid' : ''),
      type: opts.type || 'text',
      value: opts.value === null || opts.value === undefined ? '' : String(opts.value),
      placeholder: opts.placeholder || null,
      autocomplete: 'off',
      spellcheck: 'false',
      'aria-invalid': opts.error ? 'true' : null,
      oninput: opts.onInput ? function (event) { opts.onInput(event.target.value); } : null
    });
    return fieldShell(opts, control, id);
  }

  function textareaField(options) {
    var opts = options || {};
    fieldSeq += 1;
    var id = opts.id || 'field-' + fieldSeq;
    var control = el('textarea', {
      id: id,
      class: 'textarea' + (opts.code ? ' textarea--code' : '') + (opts.error ? ' is-invalid' : ''),
      placeholder: opts.placeholder || null,
      rows: opts.rows || null,
      spellcheck: opts.code ? 'false' : null,
      'aria-invalid': opts.error ? 'true' : null,
      oninput: opts.onInput ? function (event) { opts.onInput(event.target.value); } : null
    });
    control.value = opts.value === null || opts.value === undefined ? '' : String(opts.value);
    return fieldShell(opts, control, id);
  }

  function selectField(options) {
    var opts = options || {};
    fieldSeq += 1;
    var id = opts.id || 'field-' + fieldSeq;
    var control = el('select', {
      id: id,
      class: 'select',
      onchange: opts.onChange ? function (event) { opts.onChange(event.target.value); } : null
    }, (opts.options || []).map(function (option) {
      return el('option', {
        value: option.value,
        selected: option.value === opts.value ? true : null
      }, option.label);
    }));
    control.value = opts.value === null || opts.value === undefined ? '' : String(opts.value);
    return fieldShell(opts, control, id);
  }

  /** Select solto, sem label visível (usado na toolbar de ordenação). */
  function bareSelect(options) {
    var opts = options || {};
    var control = el('select', {
      class: 'select',
      'aria-label': opts.ariaLabel || 'Ordenação',
      onchange: opts.onChange ? function (event) { opts.onChange(event.target.value); } : null
    }, (opts.options || []).map(function (option) {
      return el('option', { value: option.value }, option.label);
    }));
    control.value = opts.value;
    return control;
  }

  /**
   * O botão lê o estado ao vivo do próprio aria-checked antes de alternar, então
   * o toggle continua correto sem precisar re-renderizar a linha (e sem perder
   * o foco de quem está navegando por teclado).
   */
  function switchRow(options) {
    var opts = options || {};
    var control = el('button', {
      class: 'switch',
      type: 'button',
      role: 'switch',
      'aria-checked': String(Boolean(opts.checked)),
      'aria-label': opts.label,
      onclick: function () {
        var next = control.getAttribute('aria-checked') !== 'true';
        control.setAttribute('aria-checked', String(next));
        if (opts.onToggle) opts.onToggle(next);
      }
    });

    return el('div', { class: 'switch-row' }, [
      el('div', { class: 'switch-row__text' }, [
        el('span', { class: 'switch-row__title' }, opts.label),
        opts.hint ? el('span', { class: 'switch-row__hint' }, opts.hint) : null
      ]),
      control
    ]);
  }

  /* --- Code preview e árvore ---------------------------------------------- */

  function codeBox(options) {
    var opts = options || {};
    var pre = el('pre', { tabindex: '0' });
    pre.textContent = opts.content === null || opts.content === undefined ? '' : String(opts.content);

    var node = el('div', { class: 'code-box' }, [
      el('div', { class: 'code-box__top' }, [
        el('span', null, opts.title || 'SKILL.md'),
        opts.onCopy ? button({
          label: 'Copiar',
          variant: 'accent',
          icon: 'copy',
          onClick: opts.onCopy
        }) : null
      ]),
      pre
    ]);
    node.__pre = pre;
    return node;
  }

  function setCodeContent(node, content) {
    if (!node || !node.__pre) return;
    node.__pre.textContent = content === null || content === undefined ? '' : String(content);
  }

  function fileTree(lines) {
    var node = el('pre', { class: 'file-tree', tabindex: '0' });
    node.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines || '');
    return node;
  }

  function setTreeContent(node, lines) {
    if (!node) return;
    node.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines || '');
  }

  /* --- Stepper ------------------------------------------------------------- */

  function stepper(options) {
    var opts = options || {};
    var steps = opts.steps || [];
    var current = opts.current || 1;

    return el('div', null, [
      el('ol', { class: 'stepper' }, steps.map(function (label, index) {
        var number = index + 1;
        var classes = ['step'];
        if (number === current) classes.push('is-active');
        else if (number < current) classes.push('is-done');
        if (opts.invalidSteps && opts.invalidSteps.indexOf(number) !== -1) classes.push('is-invalid');

        var dotContent = number < current && !(opts.invalidSteps || []).length
          ? icon('check', 'icon--sm')
          : (number < 10 ? '0' : '') + number;

        var reachable = Boolean(opts.onSelect) && number <= (opts.maxReachable || current);
        var dot = reachable
          ? el('button', {
              class: 'step__dot',
              type: 'button',
              'aria-label': 'Ir para o passo ' + number + ': ' + label,
              onclick: function () { opts.onSelect(number); }
            }, dotContent)
          : el('span', { class: 'step__dot', 'aria-hidden': 'true' }, dotContent);

        return el('li', {
          class: classes.join(' '),
          'aria-current': number === current ? 'step' : null
        }, [dot, el('span', null, label)]);
      })),
      el('p', { class: 'stepper__compact' },
        'Passo ' + current + ' de ' + steps.length + ' · ' + (steps[current - 1] || ''))
    ]);
  }

  /* --- Validação, risco e scores ------------------------------------------ */

  function validationList(options) {
    var opts = options || {};
    var errors = opts.errors || [];
    var warnings = opts.warnings || [];
    var items = [];

    errors.forEach(function (message) {
      items.push(el('li', { class: 'validation__item validation__item--error' }, [
        icon('alert', 'icon--sm'),
        el('span', null, message)
      ]));
    });
    warnings.forEach(function (message) {
      items.push(el('li', { class: 'validation__item validation__item--warning' }, [
        icon('alert', 'icon--sm'),
        el('span', null, message)
      ]));
    });
    if (!items.length) {
      items.push(el('li', { class: 'validation__item validation__item--ok' }, [
        icon('check', 'icon--sm'),
        el('span', null, opts.okMessage || 'Nenhum alerta no estado atual.')
      ]));
    }
    return el('ul', { class: 'validation' }, items);
  }

  function riskPanel(options) {
    var opts = options || {};
    var level = opts.level || 'moderate';
    return el('div', { class: 'risk' }, [
      el('div', { class: 'risk__head' }, [
        el('h3', { class: 'risk__title' }, riskLabel(level)),
        riskBadge(level)
      ]),
      el('p', { class: 'risk__copy' }, opts.copy ||
        'Avaliação heurística e local. Não substitui a revisão humana do conteúdo.'),
      (opts.factors || []).length
        ? el('ul', { class: 'risk__factors' }, opts.factors.map(function (factor) {
            // Fator com peso mostra a pontuação; sem peso (catálogo) usa marcador.
            return el('li', { class: 'risk__factor' }, [
              factor.weight
                ? badge('+' + factor.weight)
                : icon('chevron-right', 'icon--sm'),
              el('span', null, factor.detail || factor.label)
            ]);
          }))
        : null
    ]);
  }

  function score(options) {
    var opts = options || {};
    var value = Math.max(0, Math.min(100, Number(opts.value) || 0));
    return el('div', { class: 'score' }, [
      el('div', { class: 'score__head' }, [
        el('span', { class: 'u-muted u-sm' }, opts.label),
        el('span', { class: 'score__value' }, opts.display || (value + '/100'))
      ]),
      el('div', {
        class: 'score__bar',
        role: 'progressbar',
        'aria-label': opts.label,
        'aria-valuenow': String(value),
        'aria-valuemin': '0',
        'aria-valuemax': '100'
      }, el('div', { class: 'score__fill', style: { width: value + '%' } })),
      opts.hint ? el('p', { class: 'u-faint u-xs' }, opts.hint) : null
    ]);
  }

  /* --- Meta, notice, empty ------------------------------------------------ */

  function metaList(rows) {
    return el('dl', { class: 'meta-list' }, rows.map(function (row) {
      return el('div', { class: 'meta-row' }, [
        el('dt', { class: 'meta-row__key' }, row.key),
        el('dd', { class: 'meta-row__value' }, row.value)
      ]);
    }));
  }

  function notice(options) {
    var opts = options || {};
    return el('p', { class: 'notice' }, [
      icon(opts.icon || 'info'),
      el('span', null, [
        opts.strong ? el('strong', null, opts.strong + ' ') : null,
        opts.copy
      ])
    ]);
  }

  function emptyState(options) {
    var opts = options || {};
    return el('div', { class: 'empty' }, [
      el('div', { class: 'empty__icon' }, icon(opts.icon || 'search', 'icon--xl')),
      el('h3', { class: 'empty__title' }, opts.title),
      el('p', { class: 'empty__copy' }, opts.copy),
      opts.action || null
    ]);
  }

  /* --- Dialog -------------------------------------------------------------- */

  /**
   * Diálogo modal simples com foco preso ao conteúdo e fechamento por Esc.
   * Usado no builder para confirmar a troca de perfil (ADR-009).
   *
   * Serve dois papéis, e o que decide é a presença de `onConfirm`:
   *
   * - com `onConfirm` → confirmação, Cancelar + Confirmar, e `items` como lista
   *   de aviso (é para isso que ela tem ícone de alerta);
   * - sem `onConfirm` → informativo, um botão só (`dismissLabel`), e `body`
   *   com nós livres — usado pelo help de instalação do detalhe.
   *
   * `wide` alarga o diálogo, para caminho de arquivo em monoespaçado caber sem
   * quebrar no meio.
   */
  function openDialog(options) {
    var opts = options || {};
    var root = document.getElementById('dialog-root');
    if (!root) return function () {};

    var lastFocus = document.activeElement;

    function close() {
      document.removeEventListener('keydown', onKeydown, true);
      SkillHub.dom.clear(root);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        if (opts.onCancel) opts.onCancel();
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      /* Com o foco no próprio diálogo, Tab cai naturalmente no primeiro filho,
         mas Shift+Tab sairia da caixa: aqui ele volta para o último. */
      if (event.shiftKey && document.activeElement === dialog) {
        event.preventDefault();
        last.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    /* Sem onConfirm, o diálogo não decide nada: uma ação só, e primária, porque
       é ela que recebe o foco na abertura (ver o final desta função). */
    var dismissOnly = !opts.onConfirm;
    var actions = dismissOnly
      ? [button({
          label: opts.dismissLabel || 'Fechar',
          variant: 'primary',
          onClick: function () { close(); if (opts.onCancel) opts.onCancel(); }
        })]
      : [
          button({
            label: opts.cancelLabel || 'Cancelar',
            variant: 'ghost',
            onClick: function () { close(); if (opts.onCancel) opts.onCancel(); }
          }),
          button({
            label: opts.confirmLabel || 'Confirmar',
            variant: 'primary',
            onClick: function () { close(); opts.onConfirm(); }
          })
        ];

    var dialog = el('div', {
      class: 'dialog' + (opts.wide ? ' dialog--wide' : ''),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': opts.title,
      /* Alvo de foco quando o diálogo informa em vez de perguntar. O -1 o mantém
         fora do ciclo de Tab, que só percorre o conteúdo. */
      tabindex: dismissOnly ? '-1' : null
    }, [
      el('h2', { class: 'dialog__title' }, opts.title),
      opts.copy ? el('p', { class: 'dialog__copy' }, opts.copy) : null,
      (opts.items || []).length
        ? el('ul', { class: 'dialog__list' }, opts.items.map(function (item) {
            return el('li', { class: 'validation__item validation__item--warning' }, [
              icon('alert', 'icon--sm'),
              el('span', null, item)
            ]);
          }))
        : null,
      /* Corpo livre, para o diálogo que informa em vez de perguntar. */
      opts.body ? el('div', { class: 'dialog__body' }, opts.body) : null,
      el('div', { class: 'dialog__actions' }, actions)
    ]);

    var backdrop = el('div', {
      class: 'dialog-backdrop',
      onclick: function (event) {
        if (event.target === backdrop) {
          close();
          if (opts.onCancel) opts.onCancel();
        }
      }
    }, dialog);

    SkillHub.dom.replace(root, backdrop);
    document.addEventListener('keydown', onKeydown, true);

    /* Confirmação foca a ação, porque é a decisão. Informativo foca o próprio
       diálogo: o conteúdo é longo, e focar o botão do fim faria a caixa abrir
       rolada até embaixo, escondendo o primeiro passo. */
    if (dismissOnly) {
      dialog.focus();
      dialog.scrollTop = 0;
    } else {
      var confirmButton = dialog.querySelector('.btn--primary');
      if (confirmButton) confirmButton.focus();
    }

    return close;
  }

  SkillHub.ui = {
    riskLabel: riskLabel,
    eyebrow: eyebrow,
    badge: badge,
    riskBadge: riskBadge,
    badgeRow: badgeRow,
    button: button,
    iconButton: iconButton,
    pageHeader: pageHeader,
    section: section,
    card: card,
    panels: panels,
    banner: banner,
    stat: stat,
    categoryCard: categoryCard,
    skillCard: skillCard,
    styleCard: styleCard,
    externalCard: externalCard,
    command: command,
    chipLine: chipLine,
    segmented: segmented,
    searchField: searchField,
    textField: textField,
    textareaField: textareaField,
    selectField: selectField,
    setFieldError: setFieldError,
    bareSelect: bareSelect,
    switchRow: switchRow,
    codeBox: codeBox,
    setCodeContent: setCodeContent,
    fileTree: fileTree,
    setTreeContent: setTreeContent,
    stepper: stepper,
    validationList: validationList,
    riskPanel: riskPanel,
    score: score,
    metaList: metaList,
    notice: notice,
    emptyState: emptyState,
    openDialog: openDialog
  };
})(window.SkillHub);
