/* ==========================================================================
   builder/steps.js — SkillHub.builder.steps

   Os renderizadores de passo, endereçados por CHAVE (basic, invocation,
   execution, instructions, files, review, export). Quais existem e em que ordem
   é decidido pelo FORMATO escolhido no primeiro passo.

   ctx = {
     state,       // estado bruto (SkillHub.builder.state.get())
     model,       // estado normalizado (serialize.normalizeBuilderState)
     validation,  // { blocking, warnings } só deste passo
     set,         // grava no estado e atualiza apenas o painel lateral
     touch,       // só atualiza o painel lateral
     refresh,     // re-renderiza o corpo do passo (mudanças estruturais)
     goToStepKey
   }
   ========================================================================== */

window.SkillHub.builder = window.SkillHub.builder || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var CATEGORY_OPTIONS = [
    'development', 'data', 'devops', 'testing', 'documentation', 'product',
    'learning', 'research', 'writing', 'analysis', 'creativity', 'productivity',
    'security', 'design'
  ].map(function (key) {
    return { value: key, label: SkillHub.catalog.categoryLabel(key) };
  });

  var EFFORT_OPTIONS = [
    { value: '', label: 'Padrão do ambiente' },
    { value: 'low', label: 'low' },
    { value: 'medium', label: 'medium' },
    { value: 'high', label: 'high' },
    { value: 'xhigh', label: 'xhigh' },
    { value: 'max', label: 'max' }
  ];

  var CONTEXT_OPTIONS = [
    { value: '', label: 'Inline, no turno atual' },
    { value: 'fork', label: 'fork — contexto isolado' }
  ];

  var SHELL_OPTIONS = [
    { value: '', label: 'Não declarar (bash é o padrão)' },
    { value: 'bash', label: 'bash' },
    { value: 'powershell', label: 'powershell' }
  ];

  var TOOL_SUGGESTIONS = [
    'Read', 'Grep', 'Glob', 'Write', 'Edit', 'WebFetch', 'WebSearch',
    'Bash(git status *)', 'Bash(git diff *)', 'Bash(npm test *)'
  ];

  var QUICK_FILES = [
    { path: 'reference.md', type: 'reference', label: 'reference.md' },
    { path: 'examples.md', type: 'example', label: 'examples.md' },
    { path: 'templates/template.md', type: 'template', label: 'templates/template.md' },
    { path: 'scripts/helper.sh', type: 'script', label: 'scripts/helper.sh' }
  ];

  /* --- Helpers -------------------------------------------------------------- */

  function stepHead(title, copy) {
    return el('div', null, [
      el('h2', { class: 'builder__step-title' }, title),
      el('p', { class: 'builder__step-copy' }, copy)
    ]);
  }

  /** Primeiro erro bloqueante que menciona um termo — vira erro inline. */
  function fieldError(ctx, needle) {
    var found = null;
    ctx.validation.blocking.forEach(function (message) {
      if (!found && message.toLowerCase().indexOf(needle) !== -1) found = message;
    });
    return found;
  }

  function listValue(list) {
    return (list || []).join(', ');
  }

  function fieldset(legend, children) {
    return el('fieldset', { class: 'builder__fieldset' }, [
      el('legend', null, legend),
      children
    ]);
  }

  function pathPreview(model) {
    var serialize = SkillHub.builder.serialize;
    var rows = serialize.installPaths(model);
    return el('div', { class: 'builder__path' }, [
      el('div', { class: 'builder__path-row' }, [
        el('span', { class: 'builder__path-key' }, 'Acionamento'),
        el('span', { class: 'builder__path-value' }, serialize.invocationLabel(model))
      ])
    ].concat(rows.map(function (row) {
      return el('div', { class: 'builder__path-row' }, [
        el('span', { class: 'builder__path-key' }, row.key),
        el('span', null, [
          el('span', { class: 'builder__path-value' }, row.value),
          row.hint ? el('span', { class: 'u-faint u-xs builder__path-hint' }, row.hint) : null
        ])
      ]);
    })));
  }

  /** Clona o estado trocando um campo, para prever o que se perderia. */
  function previewDrop(state, changes) {
    var copy = JSON.parse(JSON.stringify(state));
    Object.keys(changes).forEach(function (key) { copy[key] = changes[key]; });
    return SkillHub.builder.serialize.droppedKeys(
      SkillHub.builder.serialize.normalizeBuilderState(copy)
    );
  }

  /* --- Seletor de ferramenta e formato -------------------------------------- */

  /**
   * Primeira decisão do wizard: para qual ferramenta o item está sendo criado.
   * A escolha muda a lista de passos, os campos disponíveis, o nome do arquivo
   * e os caminhos de instalação.
   */
  function formatChooser(ctx) {
    var state = ctx.state;

    function choose(id) {
      if (id === state.format) return;
      var target = SkillHub.formats.get(id);
      var dropped = previewDrop(state, { format: id });

      if (!dropped.length) {
        SkillHub.builder.state.setFormat(id);
        ctx.refresh();
        return;
      }
      ui.openDialog({
        title: 'Trocar para ' + target.label + '?',
        copy: 'Esse formato aceita menos campos. Os itens abaixo estão preenchidos e deixariam de ser emitidos no arquivo exportado — eles continuam salvos no rascunho.',
        items: dropped,
        confirmLabel: 'Trocar formato',
        onConfirm: function () {
          SkillHub.builder.state.setFormat(id);
          ctx.refresh();
          SkillHub.toast.show(target.label + ' ativo.', 'info');
        }
      });
    }

    return el('div', { class: 'format-grid', role: 'group', 'aria-label': 'Ferramenta e formato de saída' },
      SkillHub.formats.all().map(function (spec) {
        var selected = spec.id === state.format;
        return el('button', {
          class: 'format-card' + (selected ? ' is-selected' : ''),
          type: 'button',
          'aria-pressed': String(selected),
          onclick: function () { choose(spec.id); }
        }, [
          el('span', { class: 'format-card__head' }, [
            el('span', { class: 'card__icon' }, SkillHub.icons.get(spec.icon, 'icon--lg')),
            el('span', { class: 'format-card__tool' }, spec.toolLabel)
          ]),
          el('span', { class: 'format-card__label' }, spec.label),
          el('span', { class: 'format-card__file' }, spec.entryFile || '<nome>.md'),
          el('span', { class: 'format-card__copy' }, spec.summary)
        ]);
      }));
  }

  /* --- basic --------------------------------------------------------------- */

  function stepBasic(ctx) {
    var state = ctx.state;
    var model = ctx.model;
    var spec = model.formatSpec;

    function switchProfile(profile) {
      if (profile === state.profile) return;
      if (profile !== 'portable') {
        SkillHub.builder.state.setProfile(profile);
        ctx.refresh();
        return;
      }
      var dropped = previewDrop(state, { profile: 'portable' });
      if (!dropped.length) {
        SkillHub.builder.state.setProfile('portable');
        ctx.refresh();
        return;
      }
      ui.openDialog({
        title: 'Trocar para o perfil Portable?',
        copy: 'No perfil Portable o frontmatter fica restrito a name, description, license, compatibility, metadata e allowed-tools. Os campos abaixo estão preenchidos e deixariam de ser emitidos:',
        items: dropped,
        confirmLabel: 'Trocar para Portable',
        onConfirm: function () {
          SkillHub.builder.state.setProfile('portable');
          ctx.refresh();
          SkillHub.toast.show('Perfil Portable ativo. Os campos continuam no rascunho, mas não são exportados.', 'info');
        }
      });
    }

    var fields = [
      ui.textField({
        label: spec.usesDirectory ? 'Nome do diretório' : 'Nome do arquivo',
        required: true,
        value: state.metadata.directoryName,
        placeholder: spec.usesDirectory ? 'ex.: api-reviewer' : 'ex.: revisar-api',
        hint: spec.usesDirectory
          ? 'Lowercase e kebab-case. Vira o diretório e o comando da Skill.'
          : 'Lowercase e kebab-case. Vira o nome do arquivo — é dele que sai o nome do prompt.',
        errorKey: 'o nome',
        error: fieldError(ctx, 'o nome'),
        onInput: function (value) { ctx.set('metadata.directoryName', value); }
      })
    ];

    if (spec.frontmatterKeys.indexOf('name') !== -1) {
      fields.push(ui.textField({
        label: 'Display name',
        value: state.metadata.displayName,
        placeholder: 'opcional',
        hint: 'Preenche o campo name:. Se vazio, o nome do diretório é usado.',
        onInput: function (value) { ctx.set('metadata.displayName', value); }
      }));
    }

    if (spec.frontmatter !== 'none') {
      fields.push(ui.textareaField({
        label: 'description',
        full: true,
        value: state.metadata.description,
        placeholder: 'O que faz e quando deve ser usado.',
        hint: spec.id === 'claude-skill'
          ? 'Fortemente recomendada. Somada a when_to_use, aceita até ' +
            SkillHub.builder.validate.DESCRIPTION_LIMIT + ' caracteres.'
          : 'Aparece no menu de comandos do Codex.',
        errorKey: 'description +',
        error: fieldError(ctx, 'description +'),
        onInput: function (value) { ctx.set('metadata.description', value); }
      }));
    }

    fields.push(ui.selectField({
      label: 'Categoria',
      value: state.metadata.category,
      options: CATEGORY_OPTIONS,
      hint: spec.frontmatterKeys.indexOf('metadata') !== -1
        ? 'Sai em metadata.category.'
        : 'Só organiza no catálogo; este formato não emite metadata.',
      onChange: function (value) { ctx.set('metadata.category', value); }
    }));

    fields.push(ui.textField({
      label: 'Tags',
      value: listValue(state.metadata.tags),
      placeholder: 'api, review, contratos',
      hint: 'Separadas por vírgula.',
      onInput: function (value) { ctx.set('metadata.tags', SkillHub.util.splitList(value)); }
    }));

    if (spec.frontmatterKeys.indexOf('license') !== -1) {
      fields.push(ui.textField({
        label: 'license',
        value: state.metadata.license,
        placeholder: 'MIT, Apache-2.0, CC0-1.0...',
        onInput: function (value) { ctx.set('metadata.license', value); }
      }));
    }

    if (spec.frontmatterKeys.indexOf('compatibility') !== -1) {
      fields.push(ui.textareaField({
        label: 'compatibility',
        full: true,
        value: state.metadata.compatibility,
        placeholder: 'Requisitos de ambiente, versões, dependências externas.',
        hint: 'Até 500 caracteres.',
        onInput: function (value) { ctx.set('metadata.compatibility', value); }
      }));
    }

    return el('div', null, [
      stepHead('Para qual ferramenta você quer criar?',
        'A escolha define o formato do arquivo, os campos disponíveis e onde ele é instalado. Você pode trocar depois.'),

      formatChooser(ctx),

      spec.id === 'claude-skill'
        ? fieldset('Perfil de saída', el('div', { class: 'u-stack--sm' }, [
            ui.segmented({
              ariaLabel: 'Perfil de saída',
              value: state.profile,
              options: [
                { value: 'claude-code-full', label: 'Claude Code Full' },
                { value: 'portable', label: 'Portable' }
              ],
              onSelect: switchProfile
            }),
            el('p', { class: 'field__hint' }, state.profile === 'portable'
              ? 'Frontmatter restrito ao subconjunto portátil do padrão Agent Skills.'
              : 'Todos os campos do Claude Code disponíveis, incluindo invocação, ferramentas e execução.')
          ]))
        : null,

      fieldset('Identidade', el('div', { class: 'form-grid' }, fields)),

      spec.id === 'claude-skill'
        ? fieldset('Destino', ui.selectField({
            label: 'Onde vai ser instalada',
            value: state.target,
            options: SkillHub.builder.state.TARGETS,
            onChange: function (value) {
              SkillHub.builder.state.update('target', value);
              ctx.refresh();
            }
          }))
        : null,

      fieldset('Onde o arquivo vai morar', pathPreview(model))
    ]);
  }

  /* --- invocation ---------------------------------------------------------- */

  function stepInvocation(ctx) {
    var state = ctx.state;
    var spec = ctx.model.formatSpec;
    var isClaude = spec.id === 'claude-skill';

    return el('div', null, [
      stepHead('Gatilhos e argumentos', isClaude
        ? 'Defina como a Skill é acionada: automaticamente pelo modelo, manualmente por você, ou ambos.'
        : 'Este formato é sempre acionado explicitamente. Aqui você declara a dica de argumentos.'),

      ui.notice({
        icon: 'info',
        strong: 'Acionamento: ' + SkillHub.builder.serialize.invocationLabel(ctx.model) + '.',
        copy: spec.placeholders.length
          ? 'Placeholders disponíveis no corpo: ' + spec.placeholders.join(', ') + '.'
          : 'Este formato não substitui placeholders.'
      }),

      el('div', { class: 'u-stack' }, [
        isClaude
          ? ui.textareaField({
              label: 'when_to_use',
              value: state.invocation.whenToUse,
              placeholder: 'Situações concretas em que esta Skill deve entrar.',
              hint: 'Gatilhos extras, além da description. Ajuda a escolher entre Skills parecidas.',
              onInput: function (value) { ctx.set('invocation.whenToUse', value); }
            })
          : null,

        el('div', { class: 'form-grid' }, [
          ui.textField({
            label: 'argument-hint',
            value: state.invocation.argumentHint,
            placeholder: isClaude ? '[issue-number]' : 'FILE=<caminho>',
            hint: 'Dica mostrada no autocomplete ao invocar.',
            onInput: function (value) { ctx.set('invocation.argumentHint', value); }
          }),
          spec.frontmatterKeys.indexOf('arguments') !== -1
            ? ui.textField({
                label: 'arguments',
                value: listValue(state.invocation.args),
                placeholder: 'issue, branch',
                hint: 'Argumentos nomeados, separados por vírgula. Use $nome no corpo.',
                onInput: function (value) { ctx.set('invocation.args', SkillHub.util.splitList(value)); }
              })
            : null
        ]),

        isClaude ? ui.switchRow({
          label: 'Claude pode invocar automaticamente',
          hint: 'Desligado emite disable-model-invocation: true.',
          checked: state.invocation.autoInvoke,
          onToggle: function (value) { ctx.set('invocation.autoInvoke', value); }
        }) : null,

        isClaude ? ui.switchRow({
          label: 'Mostrar no menu / e permitir invocação manual',
          hint: 'Desligado emite user-invocable: false.',
          checked: state.invocation.userInvocable,
          onToggle: function (value) { ctx.set('invocation.userInvocable', value); }
        }) : null
      ])
    ]);
  }

  /* --- execution ----------------------------------------------------------- */

  function stepExecution(ctx) {
    var state = ctx.state;
    var spec = ctx.model.formatSpec;
    var isFork = state.execution.context === 'fork';

    function appendTool(token) {
      var current = state.execution.allowedTools || [];
      if (current.indexOf(token) !== -1) {
        SkillHub.toast.show('"' + token + '" já está em allowed-tools.', 'info');
        return;
      }
      ctx.set('execution.allowedTools', current.concat([token]));
      ctx.refresh();
    }

    return el('div', null, [
      stepHead('Ferramentas e execução',
        'Pré-aprove só o necessário. Ferramentas de shell e permissões amplas elevam o risco de quem instalar.'),

      state.profile === 'portable'
        ? ui.notice({
            icon: 'alert',
            strong: 'Perfil Portable.',
            copy: 'Apenas allowed-tools é emitido. Os demais campos deste passo ficam de fora do arquivo exportado.'
          })
        : null,

      fieldset('Ferramentas', el('div', { class: 'builder__tools' }, [
        ui.textareaField({
          label: 'allowed-tools',
          value: (state.execution.allowedTools || []).join('\n'),
          placeholder: 'Read\nGrep\nBash(git status *)',
          hint: 'Uma por linha, ou separadas por vírgula. Entrada livre: padrões como Bash(${CLAUDE_SKILL_DIR}/scripts/helper.sh *) são aceitos.',
          onInput: function (value) { ctx.set('execution.allowedTools', SkillHub.util.splitList(value)); }
        }),
        el('div', { class: 'builder__suggestions' }, TOOL_SUGGESTIONS.map(function (token) {
          return el('button', {
            class: 'chip',
            type: 'button',
            onclick: function () { appendTool(token); }
          }, token);
        })),
        ui.textareaField({
          label: 'disallowed-tools',
          value: (state.execution.disallowedTools || []).join('\n'),
          placeholder: 'Bash\nWrite',
          hint: 'Ferramentas removidas do turno enquanto a Skill roda.',
          onInput: function (value) { ctx.set('execution.disallowedTools', SkillHub.util.splitList(value)); }
        })
      ])),

      /* Modelo e esforço andam juntos: os dois controlam quanto a Skill gasta. */
      fieldset('Modelo e esforço', el('div', { class: 'u-stack' }, [
        el('div', { class: 'form-grid' }, [
          ui.selectField({
            label: 'model',
            value: state.execution.model,
            options: spec.models,
            hint: 'Modelo usado enquanto a Skill está ativa. Vazio não emite o campo.',
            onChange: function (value) { ctx.set('execution.model', value); }
          }),
          ui.selectField({
            label: 'effort',
            value: state.execution.effort,
            options: EFFORT_OPTIONS,
            hint: 'Profundidade de raciocínio. Sobrepõe o esforço da sessão.',
            onChange: function (value) { ctx.set('execution.effort', value); }
          })
        ]),
        el('p', { class: 'field__hint' },
          'A lista segue os modelos atualmente disponíveis da Anthropic. Um modelo fixo pode envelhecer: ' +
          'inherit acompanha a sessão de quem instalar.')
      ])),

      /* Contexto isolado: os campos que só valem com fork aparecem só com fork,
         em vez de ficarem inertes na tela esperando um aviso. */
      fieldset('Contexto de execução', el('div', { class: 'u-stack' }, [
        ui.selectField({
          label: 'context',
          value: state.execution.context,
          options: CONTEXT_OPTIONS,
          hint: 'fork roda a Skill num subagente isolado do turno principal.',
          onChange: function (value) {
            ctx.set('execution.context', value);
            ctx.refresh();
          }
        }),
        isFork ? ui.textField({
          label: 'agent',
          value: state.execution.agent,
          placeholder: 'nome do agente do fork',
          hint: 'Qual tipo de subagente o fork usa.',
          onInput: function (value) { ctx.set('execution.agent', value); }
        }) : null,
        isFork ? ui.switchRow({
          label: 'Esperar o resultado do fork',
          hint: 'Emite background: false. Na documentação, background é true por padrão.',
          checked: state.execution.waitForResult,
          onToggle: function (value) { ctx.set('execution.waitForResult', value); }
        }) : null,
        isFork ? null : el('p', { class: 'field__hint' },
          'Com execução inline, agent e background não têm efeito e ficam ocultos.')
      ])),

      fieldset('Ativação e shell', el('div', { class: 'form-grid' }, [
        ui.textField({
          label: 'paths',
          full: true,
          value: listValue(state.execution.paths),
          placeholder: 'src/**/*.ts, docs/**/*.md',
          hint: 'Globs que limitam quando a Skill é ativada. Vazio ativa em qualquer arquivo.',
          onInput: function (value) { ctx.set('execution.paths', SkillHub.util.splitList(value)); }
        }),
        ui.selectField({
          label: 'shell',
          value: state.execution.shell,
          options: SHELL_OPTIONS,
          hint: 'Interpretador de !`comando` e blocos ```!.',
          onChange: function (value) { ctx.set('execution.shell', value); }
        })
      ])),

      fieldset('Hooks (avançado)', ui.textareaField({
        label: 'hooks',
        code: true,
        value: state.execution.hooks,
        placeholder: 'PreToolUse:\n  - matcher: Bash\n    command: ./scripts/audit.sh',
        hint: 'YAML livre, emitido como bloco literal. Hooks rodam automaticamente e são o campo menos portátil.',
        onInput: function (value) { ctx.set('execution.hooks', value); }
      }))
    ]);
  }

  /* --- instructions -------------------------------------------------------- */

  function stepInstructions(ctx) {
    var state = ctx.state;
    var spec = ctx.model.formatSpec;

    return el('div', null, [
      stepHead('Instruções', spec.frontmatter === 'none'
        ? 'O AGENTS.md é só isto: Markdown puro. Escreva as regras que o Codex deve seguir no diretório.'
        : 'O corpo do arquivo em Markdown. Prefira instruções imperativas e curtas; detalhes longos vão para arquivos auxiliares.'),

      ui.notice({
        icon: 'shield',
        strong: 'Nada aqui é executado.',
        copy: spec.placeholders.length
          ? 'Placeholders deste formato (' + spec.placeholders.join(', ') + ') e linhas de shell dinâmico são preservados como texto. O Skill Hub nunca roda esse conteúdo.'
          : 'O conteúdo é preservado como texto. O Skill Hub nunca roda nada daqui.'
      }),

      ui.textareaField({
        label: 'Corpo do ' + SkillHub.builder.serialize.entryFileName(ctx.model),
        code: true,
        full: true,
        value: state.instructions.body,
        placeholder: '# Goal\n\n...',
        errorKey: 'ficaria vazio',
        error: fieldError(ctx, 'ficaria vazio'),
        onInput: function (value) { ctx.set('instructions.body', value); }
      }),

      el('div', { class: 'btn-row' }, [
        ui.button({
          label: 'Restaurar template',
          variant: 'secondary',
          icon: 'refresh',
          onClick: function () {
            ui.openDialog({
              title: 'Restaurar o template inicial?',
              copy: 'O corpo atual será substituído pelo template sugerido. Esta ação não pode ser desfeita.',
              confirmLabel: 'Restaurar',
              onConfirm: function () {
                ctx.set('instructions.body', SkillHub.builder.state.BODY_TEMPLATE);
                ctx.refresh();
              }
            });
          }
        }),
        ui.button({
          label: 'Limpar corpo',
          variant: 'ghost',
          icon: 'trash',
          onClick: function () {
            ctx.set('instructions.body', '');
            ctx.refresh();
          }
        })
      ])
    ]);
  }

  /* --- files --------------------------------------------------------------- */

  function stepFiles(ctx) {
    var state = ctx.state;

    function fileCard(file, index) {
      return el('div', { class: 'builder__file' }, [
        el('div', { class: 'builder__file-head' }, [
          ui.textField({
            label: 'Caminho',
            value: file.path,
            placeholder: 'reference.md',
            onInput: function (value) {
              SkillHub.builder.state.updateFile(index, 'path', value);
              ctx.touch();
            }
          }),
          ui.selectField({
            label: 'Tipo',
            value: file.type,
            options: SkillHub.builder.state.FILE_TYPES,
            onChange: function (value) {
              SkillHub.builder.state.updateFile(index, 'type', value);
              ctx.touch();
            }
          }),
          ui.button({
            label: 'Remover',
            variant: 'danger',
            icon: 'trash',
            onClick: function () {
              SkillHub.builder.state.removeFile(index);
              ctx.refresh();
            }
          })
        ]),
        ui.textareaField({
          label: 'Conteúdo',
          code: true,
          value: file.content,
          placeholder: 'Conteúdo textual do arquivo.',
          onInput: function (value) {
            SkillHub.builder.state.updateFile(index, 'content', value);
            ctx.touch();
          }
        })
      ]);
    }

    return el('div', null, [
      stepHead('Arquivos auxiliares',
        'Arquivos textuais opcionais que acompanham a Skill. Ficam no rascunho local até você exportar.'),

      ui.notice({
        icon: 'info',
        strong: 'Regras de caminho.',
        copy: 'Relativos ao diretório da Skill. "../" e caminhos absolutos são bloqueados, o arquivo de entrada é reservado, e nomes que diferem só por maiúsculas colidem na extração.'
      }),

      state.files.length
        ? el('div', { class: 'builder__files' }, state.files.map(fileCard))
        : ui.emptyState({
            icon: 'folder',
            title: 'Nenhum arquivo auxiliar',
            copy: 'Uma Skill válida precisa apenas do SKILL.md. Adicione arquivos quando o corpo começar a ficar longo.'
          }),

      el('div', { class: 'btn-row', style: { 'margin-top': 'var(--space-4)' } },
        [ui.button({
          label: 'Adicionar arquivo',
          variant: 'primary',
          icon: 'plus',
          onClick: function () {
            SkillHub.builder.state.addFile({ path: '', type: 'reference', content: '' });
            ctx.refresh();
          }
        })].concat(QUICK_FILES.map(function (quick) {
          return ui.button({
            label: quick.label,
            variant: 'secondary',
            icon: 'file',
            onClick: function () {
              SkillHub.builder.state.addFile({
                path: quick.path,
                type: quick.type,
                content: quick.type === 'script'
                  ? '#!/usr/bin/env bash\nset -euo pipefail\n\n# TODO: implementar\n'
                  : '# ' + quick.label + '\n\n'
              });
              ctx.refresh();
            }
          });
        })))
    ]);
  }

  /* --- review -------------------------------------------------------------- */

  function stepReview(ctx) {
    var model = ctx.model;
    var spec = model.formatSpec;
    var serialize = SkillHub.builder.serialize;
    var validation = SkillHub.builder.validate.all(model);
    var risk = SkillHub.builder.validate.riskScore(model);
    var portability = SkillHub.builder.validate.portabilityScore(model);
    var content = serialize.buildSkillMarkdown(model);

    function summaryItem(key, value) {
      return ui.card({
        body: [
          el('p', { class: 'card__label' }, key),
          el('p', { class: 'u-strong', style: { 'margin-top': 'var(--space-2)' } }, value)
        ]
      });
    }

    return el('div', { class: 'builder__review' }, [
      stepHead('Revisão e validação',
        'Confira a estrutura, o arquivo gerado e os alertas antes de exportar.'),

      el('div', { class: 'builder__summary' }, [
        summaryItem('Ferramenta', spec.toolLabel),
        summaryItem('Formato', spec.label),
        summaryItem('Arquivo', serialize.entryLabel(model)),
        summaryItem('Acionamento', serialize.invocationLabel(model))
      ]),

      el('div', null, [
        el('p', { class: 'card__label', style: { 'margin-bottom': 'var(--space-3)' } },
          spec.usesDirectory ? 'Árvore do pacote' : 'Arquivo gerado'),
        ui.fileTree(serialize.buildFileTree(model))
      ]),

      el('div', null, [
        el('p', { class: 'card__label', style: { 'margin-bottom': 'var(--space-3)' } },
          serialize.entryFileName(model) + ' gerado'),
        ui.codeBox({
          title: serialize.entryLabel(model),
          content: content,
          onCopy: function () { SkillHub.clipboard.copy(content, serialize.entryFileName(model) + ' copiado.'); }
        })
      ]),

      el('div', null, [
        el('p', { class: 'card__label', style: { 'margin-bottom': 'var(--space-3)' } }, 'Validação completa'),
        ui.validationList({
          errors: validation.blocking,
          warnings: validation.warnings,
          okMessage: 'Nenhum erro e nenhum aviso no estado atual.'
        })
      ]),

      el('div', { class: 'grid grid--2' }, [
        ui.riskPanel({
          level: risk.level,
          copy: 'Score ' + risk.score + '. Heurística local e explicável; não afirma que o conteúdo é seguro.',
          factors: risk.factors
        }),
        ui.card({
          body: el('div', { class: 'u-stack' }, [
            ui.score({
              label: 'Portabilidade',
              value: portability.score,
              display: portability.score + '/100 · ' + portability.band
            }),
            el('ul', { class: 'risk__factors' }, portability.factors.map(function (factor) {
              return el('li', { class: 'risk__factor' }, [
                factor.weight ? ui.badge('-' + factor.weight) : SkillHub.icons.get('chevron-right', 'icon--sm'),
                el('span', null, factor.detail)
              ]);
            }))
          ])
        })
      ])
    ]);
  }

  /* --- export -------------------------------------------------------------- */

  /**
   * Modelo do Codex. Nem AGENTS.md nem o prompt têm campo de modelo, então isto
   * não entra no artefato: gera o trecho de ~/.codex/config.toml, que é onde o
   * Codex realmente lê o modelo (além de `--model` e do comando /model).
   */
  function codexConfigGroup(ctx) {
    var state = ctx.state;
    var spec = ctx.model.formatSpec;
    var chosen = state.execution.codexModel;
    var snippet = chosen
      ? '# ~/.codex/config.toml\nmodel = "' + chosen + '"\n'
      : '';

    return el('div', { class: 'builder__export-group' }, [
      el('p', { class: 'builder__export-title' }, 'Modelo do Codex'),
      el('p', { class: 'builder__export-copy' },
        'Este formato não carrega modelo: o arquivo exportado não muda com esta escolha. ' +
        'O Codex lê o modelo de ~/.codex/config.toml, da flag --model e do comando /model na sessão.'),
      ui.selectField({
        label: 'Modelo sugerido',
        value: chosen,
        options: spec.models,
        onChange: function (value) {
          ctx.set('execution.codexModel', value);
          ctx.refresh();
        }
      }),
      chosen
        ? el('div', { class: 'u-stack--sm' }, [
            ui.codeBox({
              title: '~/.codex/config.toml',
              content: snippet,
              onCopy: function () {
                SkillHub.clipboard.copy(snippet, 'Configuração copiada.');
              }
            }),
            el('div', { class: 'btn-row' }, [
              ui.button({
                label: 'Copiar comando com --model',
                variant: 'ghost',
                icon: 'terminal',
                onClick: function () {
                  SkillHub.clipboard.copy('codex --model ' + chosen, 'Comando copiado.');
                }
              })
            ])
          ])
        : el('p', { class: 'u-faint u-xs' },
            'Sem modelo escolhido, quem instalar usa o modelo padrão da própria sessão.')
    ]);
  }

  function stepExport(ctx) {
    var model = ctx.model;
    var spec = model.formatSpec;
    var serialize = SkillHub.builder.serialize;
    var exporter = SkillHub.builder.export;
    var validation = SkillHub.builder.validate.all(model);
    var blocked = validation.blocking.length > 0;
    var entry = serialize.entryFileName(model);

    function pathRow(row) {
      return el('div', { class: 'u-row u-row--between' }, [
        el('div', null, [
          el('p', { class: 'card__label' }, row.key),
          el('p', { class: 'u-mono u-sm u-accent u-break', style: { 'margin-top': 'var(--space-1)' } }, row.value),
          row.hint ? el('p', { class: 'u-faint u-xs' }, row.hint) : null
        ]),
        ui.iconButton({
          icon: 'copy',
          ariaLabel: 'Copiar caminho ' + row.key,
          onClick: function () { SkillHub.clipboard.copy(row.value, 'Caminho copiado.'); }
        })
      ]);
    }

    return el('div', { class: 'builder__export' }, [
      stepHead('Exportar',
        'Baixe ou copie os arquivos. A instalação é uma ação sua: o Skill Hub nunca escreve nesses caminhos.'),

      blocked
        ? ui.validationList({ errors: validation.blocking })
        : ui.notice({
            icon: 'check',
            strong: 'Pronto para exportar.',
            copy: 'Nenhum erro bloqueante. Avisos não impedem o download — eles descrevem o que quem instalar vai aceitar.'
          }),

      el('div', { class: 'builder__export-group' }, [
        el('p', { class: 'builder__export-title' }, 'Arquivo'),
        el('p', { class: 'builder__export-copy' }, 'Só o ' + entry + ', exatamente igual ao preview.'),
        el('div', { class: 'btn-row' }, [
          ui.button({
            label: 'Copiar ' + entry,
            variant: 'secondary',
            icon: 'copy',
            onClick: function () { exporter.copyContent(model); }
          }),
          ui.button({
            label: 'Baixar ' + entry,
            variant: 'primary',
            icon: 'download',
            disabled: blocked,
            onClick: function () { exporter.downloadContent(model); }
          })
        ])
      ]),

      serialize.supportsZip(model)
        ? el('div', { class: 'builder__export-group' }, [
            el('p', { class: 'builder__export-title' }, 'Pacote completo'),
            el('p', { class: 'builder__export-copy' },
              'ZIP com o diretório raiz ' + serialize.skillDirName(model) + '/ e ' +
              serialize.filePaths(model).length + ' ' +
              SkillHub.util.pluralize(serialize.filePaths(model).length, 'arquivo', 'arquivos') + '.'),
            el('div', { class: 'btn-row' }, [
              ui.button({
                label: 'Baixar ' + serialize.zipFileName(model),
                variant: 'primary',
                icon: 'package',
                disabled: blocked,
                onClick: function () { exporter.downloadZip(model); }
              }),
              ui.button({
                label: 'Copiar árvore',
                variant: 'ghost',
                icon: 'folder',
                onClick: function () { exporter.copyTree(model); }
              })
            ])
          ])
        : ui.notice({
            icon: 'info',
            strong: 'Formato de arquivo único.',
            copy: spec.frontmatter === 'none'
              ? 'AGENTS.md é um arquivo só, colocado no diretório que deve receber as regras. Não há pacote a compactar.'
              : 'O prompt do Codex é um arquivo só, direto em ~/.codex/prompts/ — o Codex não lê subdiretórios.'
          }),

      el('div', { class: 'builder__export-group' }, [
        el('p', { class: 'builder__export-title' }, 'Onde instalar'),
        el('div', { class: 'u-stack' }, serialize.installPaths(model).map(pathRow))
      ]),

      /* No Codex o modelo não é campo do arquivo, então a escolha vive aqui —
         junto da instalação, que é o momento em que ela realmente se aplica. */
      spec.modelField === 'config' ? codexConfigGroup(ctx) : null,

      ui.notice({
        icon: 'info',
        strong: 'Publicar no catálogo não existe nesta versão.',
        copy: 'O Skill Hub é estático e não tem backend, então o navegador não consegue alterar o catálogo do site. Exporte o arquivo e contribua pelo repositório.'
      }),

      el('div', { class: 'builder__export-group' }, [
        el('p', { class: 'builder__export-title' }, 'Começar de novo'),
        el('p', { class: 'builder__export-copy' }, 'Reiniciar limpa os campos. Descartar remove também o rascunho salvo no navegador.'),
        el('div', { class: 'btn-row' }, [
          ui.button({
            label: 'Novo item',
            variant: 'secondary',
            icon: 'plus',
            onClick: function () {
              ui.openDialog({
                title: 'Começar um item novo?',
                copy: 'Os campos voltam ao padrão e o rascunho salvo é sobrescrito.',
                confirmLabel: 'Começar novo',
                onConfirm: function () {
                  SkillHub.builder.state.reset();
                  ctx.goToStepKey('basic');
                  SkillHub.toast.show('Novo rascunho criado.', 'success');
                }
              });
            }
          }),
          ui.button({
            label: 'Descartar rascunho',
            variant: 'ghost',
            icon: 'trash',
            onClick: function () {
              ui.openDialog({
                title: 'Descartar o rascunho salvo?',
                copy: 'A chave skillhub.builder.draft.v1 é removida do navegador. Seus favoritos e preferências não são afetados.',
                confirmLabel: 'Descartar',
                onConfirm: function () {
                  SkillHub.builder.state.discard();
                  ctx.goToStepKey('basic');
                  SkillHub.toast.show('Rascunho descartado.', 'success');
                }
              });
            }
          })
        ])
      ])
    ]);
  }

  var RENDERERS = {
    basic: stepBasic,
    invocation: stepInvocation,
    execution: stepExecution,
    instructions: stepInstructions,
    files: stepFiles,
    review: stepReview,
    export: stepExport
  };

  /** render('basic', ctx) — endereçado por chave. */
  function render(key, ctx) {
    var renderer = RENDERERS[key] || stepBasic;
    return renderer(ctx);
  }

  SkillHub.builder.steps = { render: render };
})(window.SkillHub);
