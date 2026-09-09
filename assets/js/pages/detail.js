/* ==========================================================================
   pages/detail.js — SkillHub.pages.detail

   Rota #/skill/<id>. Responde as dez perguntas do PRD §8 e exibe permissões
   antes de qualquer download.

   A página é dirigida pelo FORMATO da entrada (assets/js/formats.js): o nome do
   arquivo, os caminhos de instalação, a existência de frontmatter e a presença
   de ferramentas mudam entre Claude Code e Codex, e a UI acompanha.

   O conteúdo é sempre texto: preview e árvore entram por textContent (ADR-010).
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var refs = { favorite: null };
  var activeItem = null;

  var TYPE_LABELS = {
    'claude-skill': 'Claude Skill',
    'codex-skill': 'Codex',
    prompt: 'Prompt',
    agent: 'Agente'
  };

  /* --- Helpers -------------------------------------------------------------- */

  function block(title, body) {
    return el('section', { class: 'detail__block' }, [
      el('h2', { class: 'detail__block-title' }, title),
      body
    ]);
  }

  function format(item) {
    return SkillHub.formats.get(item.format);
  }

  function entryFile(item) {
    return SkillHub.formats.entryFileName(item.format, item.id);
  }

  /** Rótulo do arquivo como ele aparece instalado. */
  function entryLabel(item) {
    var spec = format(item);
    return spec.usesDirectory ? item.id + '/' + entryFile(item) : entryFile(item);
  }

  function treeText(item) {
    var paths = (item.files || []).map(function (file) { return file.path; });
    // Só o formato do Claude Code embrulha os arquivos num diretório com o nome
    // da Skill. AGENTS.md e prompts do Codex são arquivos soltos.
    if (format(item).usesDirectory) {
      return SkillHub.util.treeLines(item.id, paths).join('\n');
    }
    return paths.join('\n');
  }

  /* --- Blocos -------------------------------------------------------------- */

  function formatBlock(item) {
    var spec = format(item);
    var rows = [
      { key: 'Ferramenta', value: spec.toolLabel },
      { key: 'Arquivo', value: entryLabel(item) },
      {
        key: 'Frontmatter',
        value: spec.frontmatter === 'none'
          ? 'Nenhum — Markdown puro'
          : spec.frontmatterKeys.length + ' ' +
            SkillHub.util.pluralize(spec.frontmatterKeys.length, 'campo possível', 'campos possíveis')
      },
      { key: 'Acionamento', value: SkillHub.formats.invocationLabel(item.format, item.id) }
    ];
    if (spec.placeholders.length) {
      rows.push({ key: 'Placeholders', value: spec.placeholders.join(' · ') });
    }
    if (spec.maxLines) rows.push({ key: 'Tamanho', value: 'manter abaixo de ' + spec.maxLines + ' linhas' });
    if (spec.maxBytes) rows.push({ key: 'Tamanho', value: 'limite de ' + Math.round(spec.maxBytes / 1024) + ' KiB (project_doc_max_bytes)' });

    var docHref = SkillHub.dom.safeHref(spec.docUrl);

    return el('div', { class: 'u-stack' }, [
      el('p', { class: 'detail__prose' }, spec.summary),
      ui.metaList(rows),
      docHref
        ? el('a', {
            class: 'section__link',
            href: docHref,
            target: '_blank',
            rel: 'noopener noreferrer'
          }, [
            el('span', null, 'Documentação oficial do formato'),
            SkillHub.icons.get('external', 'icon--sm')
          ])
        : null
    ]);
  }

  function toolBadges(item) {
    var spec = format(item);

    if (!spec.supportsTools) {
      return el('div', { class: 'u-stack--sm' }, [
        ui.badgeRow([ui.badge('O formato não declara ferramentas', 'low', 'shield')]),
        el('p', { class: 'u-muted u-sm' }, spec.frontmatter === 'none'
          ? 'AGENTS.md é Markdown puro: não existe campo de permissão. O que o Codex pode fazer vem da sua sessão, não deste arquivo.'
          : 'O prompt do Codex aceita apenas description e argument-hint. Permissões continuam sendo as da sua sessão.')
      ]);
    }

    var allowed = (item.tools && item.tools.allowed) || [];
    var disallowed = (item.tools && item.tools.disallowed) || [];

    if (!allowed.length && !disallowed.length) {
      return el('div', { class: 'u-stack--sm' }, [
        ui.badgeRow([ui.badge('Nenhuma ferramenta declarada', 'low', 'shield')]),
        el('p', { class: 'u-muted u-sm' },
          'A Skill não pré-aprova ferramentas: usa apenas as permissões já ativas na sua sessão.')
      ]);
    }

    return el('div', { class: 'u-stack' }, [
      allowed.length ? el('div', { class: 'u-stack--sm' }, [
        el('p', { class: 'card__label' }, 'allowed-tools'),
        el('p', { class: 'u-faint u-xs' }, 'Pré-aprovadas: rodam sem novo pedido de permissão no turno que invoca a Skill.'),
        el('div', { class: 'badge-row' }, allowed.map(function (tool) {
          var isShell = /bash|powershell|pwsh|sh\b/i.test(tool);
          return ui.badge(tool, isShell ? 'elevated' : 'accent', isShell ? 'terminal' : null);
        }))
      ]) : null,
      disallowed.length ? el('div', { class: 'u-stack--sm' }, [
        el('p', { class: 'card__label' }, 'disallowed-tools'),
        el('p', { class: 'u-faint u-xs' }, 'Removidas do turno enquanto a Skill está ativa.'),
        el('div', { class: 'badge-row' }, disallowed.map(function (tool) {
          return ui.badge(tool, null, 'lock');
        }))
      ]) : null
    ]);
  }

  function capabilityBadges(item) {
    var flags = item.flags || {};
    var spec = format(item);
    var badges = [];

    if (flags.autoLoaded || spec.autoLoaded) {
      badges.push(ui.badge('Carregado automaticamente', 'moderate', 'refresh'));
    }
    if (flags.shell) badges.push(ui.badge(flags.shell === 'powershell' ? 'PowerShell' : 'Bash', 'elevated', 'terminal'));
    if (flags.scripts) badges.push(ui.badge('Scripts anexados', 'elevated', 'file'));
    if (flags.shellInjection) badges.push(ui.badge('Shell dinâmico no corpo', 'elevated', 'alert'));
    if (flags.fork) badges.push(ui.badge('context: fork', 'moderate', 'layers'));
    if (flags.hooks) badges.push(ui.badge('hooks', 'moderate', 'refresh'));
    if (flags.portable) badges.push(ui.badge('Portável', 'low', 'check'));
    if (flags.claudeCodeOnly) badges.push(ui.badge('Claude Code only', 'moderate', 'sparkle'));
    if (!badges.length) badges.push(ui.badge('Nenhuma capacidade sensível declarada', 'low', 'shield'));

    return ui.badgeRow(badges);
  }

  function installBlock(item) {
    var rows = SkillHub.formats.installPaths(item.format, item.id);

    return el('div', { class: 'u-stack' }, [
      el('div', { class: 'builder__path' }, rows.map(function (row) {
        return el('div', { class: 'builder__path-row' }, [
          el('span', { class: 'builder__path-key' }, row.key),
          el('span', null, [
            el('span', { class: 'builder__path-value' }, row.value),
            row.hint ? el('span', { class: 'u-faint u-xs builder__path-hint' }, row.hint) : null
          ])
        ]);
      })),
      ui.notice({
        icon: 'info',
        strong: 'Instalar é uma ação sua.',
        copy: 'O Skill Hub baixa e copia arquivos, mas nunca escreve nesses caminhos nem instala nada na sua máquina.'
      })
    ]);
  }

  /* --- Aside --------------------------------------------------------------- */

  function metaCard(item) {
    var spec = format(item);
    var rows = [
      { key: 'Formato', value: spec.label },
      { key: 'Categoria', value: SkillHub.catalog.categoryLabel(item.category) },
      { key: 'Plataforma', value: SkillHub.catalog.platformLabel(item.platform) },
      { key: 'Compatível com', value: (item.compatibility || []).join(', ') || 'Não informado' },
      { key: 'Licença', value: item.license || 'Não informada' },
      { key: 'Curadoria', value: item.author || 'Não informado' },
      { key: 'Atualizado', value: SkillHub.util.formatDate(item.updatedAt) }
    ];

    return ui.card({
      body: [
        el('div', { class: 'card__head' }, el('span', { class: 'card__label' }, 'Ficha')),
        ui.metaList(rows)
      ]
    });
  }

  function actionsCard(item) {
    var file = entryFile(item);

    var favorite = ui.button({
      label: SkillHub.catalog.isFavorite(item.id) ? 'Nos favoritos' : 'Favoritar',
      variant: 'secondary',
      icon: 'bookmark',
      block: true,
      onClick: function () { toggleFavorite(item); }
    });
    refs.favorite = favorite;

    var source = SkillHub.dom.safeHref(item.sourceUrl);

    return ui.card({
      body: el('div', { class: 'u-stack--sm' }, [
        ui.button({
          label: 'Copiar ' + file,
          variant: 'primary',
          icon: 'copy',
          block: true,
          onClick: function () {
            SkillHub.clipboard.copy(item.content, file + ' copiado.');
          }
        }),
        ui.button({
          label: 'Baixar ' + file,
          variant: 'secondary',
          icon: 'download',
          block: true,
          onClick: function () {
            SkillHub.download.textFile(file, item.content);
            SkillHub.toast.show(file + ' baixado. Revise o conteúdo antes de instalar.', 'success');
          }
        }),
        ui.button({
          label: 'Copiar caminho de instalação',
          variant: 'ghost',
          icon: 'folder',
          block: true,
          onClick: function () {
            var paths = SkillHub.formats.installPaths(item.format, item.id);
            SkillHub.clipboard.copy(paths[0].value, 'Caminho copiado.');
          }
        }),
        favorite,
        source
          ? ui.button({
              label: 'Abrir fonte externa',
              variant: 'ghost',
              icon: 'external',
              block: true,
              href: source,
              external: true
            })
          : el('p', { class: 'u-faint u-xs' }, 'Sem fonte externa declarada para esta entrada.')
      ])
    });
  }

  function toggleFavorite(item) {
    var added = SkillHub.catalog.toggleFavorite(item.id);
    if (refs.favorite) {
      var label = refs.favorite.querySelector('span');
      if (label) label.textContent = added ? 'Nos favoritos' : 'Favoritar';
    }
    SkillHub.toast.show(added ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.', 'success');
  }

  /* --- Página -------------------------------------------------------------- */

  function backRoute(item) {
    var found = 'claude-skills';
    SkillHub.catalog.collections().forEach(function (entry) {
      if (entry.type === item.type) found = entry.route;
    });
    return found;
  }

  function notFound(param) {
    return el('div', null, [
      el('div', null, el('a', { class: 'detail__back', href: '#/home' }, [
        SkillHub.icons.get('arrow-left', 'icon--sm'),
        el('span', null, 'Voltar para a Home')
      ])),
      ui.pageHeader({
        eyebrow: 'Não encontrado',
        title: 'Item não encontrado',
        copy: 'Nenhuma entrada do catálogo tem o identificador "' + String(param || '') + '".'
      }),
      ui.emptyState({
        icon: 'alert',
        title: 'Item inexistente',
        copy: 'O catálogo é estático: se o link veio de uma versão anterior, o item pode ter sido renomeado.',
        action: ui.button({ label: 'Explorar Claude Skills', variant: 'primary', href: '#/claude-skills' })
      })
    ]);
  }

  function render(context) {
    var item = SkillHub.catalog.byId(context.param);
    activeItem = item;
    refs.favorite = null;

    if (!item) return notFound(context.param);

    var spec = format(item);
    var route = backRoute(item);
    var collection = SkillHub.catalog.collection(route) || {};

    var main = el('div', null, [
      el('div', null, el('a', { class: 'detail__back', href: '#/' + route }, [
        SkillHub.icons.get('arrow-left', 'icon--sm'),
        el('span', null, 'Voltar para ' + collection.title)
      ])),
      ui.eyebrow(TYPE_LABELS[item.type] || 'Skill'),
      el('h1', { class: 'detail__title' }, [
        el('span', { class: 'card__icon' }, SkillHub.icons.get(item.icon, 'icon--lg')),
        el('span', null, item.name)
      ]),
      el('p', { class: 'page-copy' }, item.description),
      el('div', { class: 'badge-row', style: { 'margin-top': 'var(--space-4)' } }, [
        ui.badge(spec.short, 'info', spec.icon),
        ui.badge(SkillHub.catalog.categoryLabel(item.category)),
        ui.riskBadge(item.risk)
      ].concat((item.tags || []).map(function (tag) { return ui.badge(tag); }))),

      block('Não executamos este conteúdo', ui.notice({
        icon: 'shield',
        strong: 'Só leitura.',
        copy: 'O Skill Hub exibe, copia e exporta arquivos. Comandos shell, scripts e URLs desta página são ' +
          'tratados como texto e nunca executados pelo navegador. Revise o conteúdo antes de usar.'
      })),

      block('Quando usar', el('p', { class: 'detail__prose' }, item.whenToUse)),

      block('Formato e acionamento', formatBlock(item)),

      block('Ferramentas e permissões', el('div', { class: 'u-stack' }, [
        toolBadges(item),
        capabilityBadges(item)
      ])),

      block(spec.usesDirectory ? 'Arquivos do pacote' : 'Arquivo', ui.fileTree(treeText(item))),

      block(entryLabel(item), ui.codeBox({
        title: entryLabel(item),
        content: item.content,
        onCopy: function () {
          SkillHub.clipboard.copy(item.content, entryFile(item) + ' copiado.');
        }
      })),

      block('Como instalar', installBlock(item))
    ]);

    var aside = el('aside', { class: 'detail__aside' }, [
      ui.riskPanel({
        level: item.risk,
        factors: (item.riskFactors || []).map(function (factor) {
          return { detail: factor };
        })
      }),
      actionsCard(item),
      metaCard(item)
    ]);

    return el('div', { class: 'split' }, [main, aside]);
  }

  function topbar() {
    var item = activeItem;
    return {
      lead: el('span', null, item ? item.name : 'Item'),
      actions: [
        ui.iconButton({
          icon: 'bookmark',
          ariaLabel: item && SkillHub.catalog.isFavorite(item.id) ? 'Remover dos favoritos' : 'Favoritar',
          active: Boolean(item && SkillHub.catalog.isFavorite(item.id)),
          onClick: function () { if (item) toggleFavorite(item); }
        }),
        ui.button({
          label: 'Criar Skill',
          variant: 'secondary',
          iconAfter: 'arrow-right',
          href: '#/skill-builder'
        })
      ]
    };
  }

  function teardown() {
    refs.favorite = null;
    activeItem = null;
  }

  SkillHub.pages.detail = {
    title: 'Detalhe',
    render: render,
    topbar: topbar,
    teardown: teardown
  };
})(window.SkillHub);
