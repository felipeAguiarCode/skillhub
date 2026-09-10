/* ==========================================================================
   pages/builder.js — SkillHub.pages.builder

   Orquestra o wizard: stepper, corpo do passo e painel lateral.

   A lista de passos vem do FORMATO escolhido no primeiro passo — sete para o
   Claude Code, cinco para prompt do Codex, quatro para AGENTS.md. Por isso a
   navegação trabalha com a CHAVE do passo, e o número é só apresentação.

   Re-render dirigido:
   - digitar num campo atualiza SÓ o painel lateral (preview, árvore, validação,
     scores), então o foco e o caret não se movem;
   - Back/Next e mudanças estruturais re-renderizam o corpo do passo e o
     stepper, devolvendo o foco ao primeiro controle do passo.
   ========================================================================== */

window.SkillHub.pages = window.SkillHub.pages || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  var refs = {
    stepper: null,
    step: null,
    aside: null,
    code: null,
    tree: null,
    validation: null,
    scores: null,
    draft: null
  };

  /* --- Estado derivado ----------------------------------------------------- */

  function state() {
    return SkillHub.builder.state.get();
  }

  function model() {
    return SkillHub.builder.serialize.normalizeBuilderState(state());
  }

  function currentStep() {
    return state().step;
  }

  function currentKey() {
    return SkillHub.builder.state.stepKeyAt(state(), currentStep());
  }

  function stepCount() {
    return SkillHub.builder.state.stepCount(state());
  }

  /* --- Painel lateral ------------------------------------------------------ */

  function infoCard(current) {
    var spec = current.formatSpec;
    var docHref = SkillHub.dom.safeHref(spec.docUrl);
    return ui.card({
      body: [
        el('h3', { class: 'card__title' }, spec.label),
        el('p', { class: 'card__copy' }, spec.summary),
        el('a', {
          class: 'section__link',
          href: '#/what-is-a-skill',
          style: { 'margin-top': 'var(--space-3)' }
        }, [
          el('span', null, 'O que é uma Skill, em dez slides'),
          SkillHub.icons.get('arrow-right', 'icon--sm')
        ]),
        docHref
          ? el('a', {
              class: 'section__link',
              href: docHref,
              target: '_blank',
              rel: 'noopener noreferrer',
              style: { 'margin-top': 'var(--space-3)' }
            }, [
              el('span', null, 'Documentação oficial'),
              SkillHub.icons.get('external', 'icon--sm')
            ])
          : null
      ]
    });
  }

  function buildAside() {
    var current = model();
    var serialize = SkillHub.builder.serialize;

    refs.code = ui.codeBox({
      title: serialize.entryLabel(current),
      content: serialize.buildSkillMarkdown(current),
      onCopy: function () { SkillHub.builder.export.copyContent(model()); }
    });
    refs.tree = ui.fileTree(serialize.buildFileTree(current));
    refs.validation = el('div');
    refs.scores = el('div', { class: 'u-stack' });

    var node = el('aside', { class: 'builder__aside', id: 'builder-aside' }, [
      currentKey() === 'basic' ? infoCard(current) : null,
      ui.card({
        body: [
          el('div', { class: 'card__head' }, el('span', { class: 'card__label' }, 'Preview')),
          refs.code
        ]
      }),
      ui.card({
        body: [
          el('div', { class: 'card__head' }, el('span', { class: 'card__label' }, 'Estrutura esperada')),
          refs.tree
        ]
      }),
      ui.card({
        body: [
          el('div', { class: 'card__head' }, el('span', { class: 'card__label' }, 'Validação deste passo')),
          refs.validation,
          el('div', { class: 'u-stack', style: { 'margin-top': 'var(--space-4)' } }, refs.scores)
        ]
      })
    ]);

    refs.aside = node;
    updateAside();
    return node;
  }

  function updateAside() {
    var current = model();
    var serialize = SkillHub.builder.serialize;
    var key = currentKey();

    if (refs.code) {
      ui.setCodeContent(refs.code, serialize.buildSkillMarkdown(current));
      var title = refs.code.querySelector('.code-box__top span');
      if (title) title.textContent = serialize.entryLabel(current);
    }
    if (refs.tree) ui.setTreeContent(refs.tree, serialize.buildFileTree(current));

    if (refs.validation) {
      var stepValidation = SkillHub.builder.validate.step(key, current);
      SkillHub.dom.replace(refs.validation, ui.validationList({
        errors: stepValidation.blocking,
        warnings: stepValidation.warnings,
        okMessage: 'Passo sem alertas.'
      }));
    }

    if (refs.scores) {
      var risk = SkillHub.builder.validate.riskScore(current);
      var portability = SkillHub.builder.validate.portabilityScore(current);
      SkillHub.dom.replace(refs.scores, [
        el('div', { class: 'u-row u-row--between' }, [
          el('span', { class: 'u-muted u-sm' }, 'Risco aparente'),
          ui.riskBadge(risk.level)
        ]),
        ui.score({
          label: 'Portabilidade',
          value: portability.score,
          display: portability.score + '/100 · ' + portability.band,
          hint: portability.factors[0] ? portability.factors[0].detail : null
        }),
        ui.button({
          label: 'Ver fatores na revisão',
          variant: 'ghost',
          icon: 'sliders',
          block: true,
          onClick: function () { goToStepKey('review'); }
        })
      ]);
    }
  }

  /* --- Contexto dos passos ------------------------------------------------- */

  /**
   * Reavalia os erros inline dos campos do passo sem re-renderizar o corpo,
   * para que a mensagem suma no instante em que o usuário corrige o campo.
   */
  function syncFieldErrors() {
    if (!refs.step) return;
    var blocking = SkillHub.builder.validate.step(currentKey(), model()).blocking;
    var fields = refs.step.querySelectorAll('[data-error-key]');
    Array.prototype.forEach.call(fields, function (field) {
      var needle = field.dataset.errorKey.toLowerCase();
      var found = null;
      blocking.forEach(function (message) {
        if (!found && message.toLowerCase().indexOf(needle) !== -1) found = message;
      });
      ui.setFieldError(field, found);
    });
  }

  function context() {
    var current = model();
    return {
      state: state(),
      model: current,
      validation: SkillHub.builder.validate.step(currentKey(), current),
      set: function (path, value) {
        SkillHub.builder.state.update(path, value);
        acknowledgeDraft();
        syncFieldErrors();
        updateAside();
      },
      touch: function () {
        acknowledgeDraft();
        syncFieldErrors();
        updateAside();
      },
      refresh: refreshStep,
      goToStepKey: goToStepKey
    };
  }

  /* --- Stepper e navegação ------------------------------------------------- */

  function buildStepper() {
    var current = model();
    var currentState = state();
    var invalidKeys = SkillHub.builder.validate.invalidStepKeys(current);
    var keys = SkillHub.builder.state.stepKeys(currentState);

    return ui.stepper({
      steps: SkillHub.builder.state.stepLabels(currentState),
      current: currentStep(),
      invalidSteps: invalidKeys.map(function (key) { return keys.indexOf(key) + 1; }),
      maxReachable: stepCount(),
      onSelect: goToStepIndex
    });
  }

  function refreshStepper() {
    if (refs.stepper) SkillHub.dom.replace(refs.stepper, buildStepper());
  }

  function refreshStep() {
    if (!refs.step) return;
    SkillHub.dom.replace(refs.step, buildStepBody());
    refreshStepper();
    /* O badge da topbar mostra o formato, então acompanha a troca. */
    SkillHub.router.refreshTopbar();

    /* Trocar de formato ou de passo muda o próprio conteúdo do aside (o card do
       formato só aparece no primeiro passo), então ele é remontado.
       O nó antigo e o pai são guardados ANTES de chamar buildAside(), porque ela
       já reatribui refs.aside para o nó novo — que ainda não tem pai. */
    var previous = refs.aside;
    var host = previous && previous.parentNode;
    if (host) {
      host.replaceChild(buildAside(), previous);
    } else {
      updateAside();
    }

    focusFirstControl();
  }

  /**
   * O foco vai para o primeiro CAMPO do passo. Botões ficam de fora de
   * propósito: no passo básico o primeiro botão é um card de formato, e cair
   * nele a cada render daria a impressão de que a escolha vai mudar.
   */
  function focusFirstControl() {
    if (!refs.step) return;
    var target = refs.step.querySelector('input, textarea, select');
    if (target) target.focus({ preventScroll: true });
  }

  function goToStepIndex(number) {
    var currentState = state();
    var from = currentState.step;
    var target = Math.min(stepCount(), Math.max(1, number));
    if (target === from) return;

    // Avançar exige os passos intermediários sem erro bloqueante.
    if (target > from) {
      for (var i = from; i < target; i += 1) {
        var key = SkillHub.builder.state.stepKeyAt(currentState, i);
        var check = SkillHub.builder.validate.step(key, model());
        if (check.blocking.length) {
          SkillHub.builder.state.setStep(i);
          refreshStep();
          SkillHub.toast.show(check.blocking[0], 'error');
          return;
        }
      }
    }

    SkillHub.builder.state.setStep(target);
    acknowledgeDraft();
    refreshStep();
  }

  function goToStepKey(key) {
    goToStepIndex(SkillHub.builder.state.indexOfStepKey(state(), key));
  }

  function actions() {
    var step = currentStep();
    var total = stepCount();
    var isLast = step === total;

    return el('div', { class: 'builder__actions' }, [
      ui.button({
        label: 'Voltar',
        variant: 'ghost',
        icon: 'chevron-left',
        disabled: step === 1,
        onClick: function () { goToStepIndex(step - 1); }
      }),
      el('span', { class: 'u-faint u-xs' },
        'Passo ' + step + ' de ' + total + ' · rascunho salvo no navegador'),
      isLast
        ? ui.button({
            label: 'Concluir',
            variant: 'secondary',
            icon: 'check',
            onClick: function () {
              SkillHub.toast.show('Pronto. Use os botões de exportação acima.', 'success');
            }
          })
        : ui.button({
            label: 'Próximo',
            variant: 'primary',
            iconAfter: 'arrow-right',
            onClick: function () { goToStepIndex(step + 1); }
          })
    ]);
  }

  function buildStepBody() {
    return el('div', null, [
      SkillHub.builder.steps.render(currentKey(), context()),
      actions()
    ]);
  }

  /* --- Aviso de rascunho recuperado ---------------------------------------- */

  function acknowledgeDraft() {
    if (!SkillHub.builder.state.wasRestored()) return;
    SkillHub.builder.state.acknowledgeDraft();
    if (refs.draft) refs.draft.hidden = true;
  }

  function draftBanner() {
    var updatedAt = state().updatedAt;
    var node = el('div', { class: 'builder__draft', hidden: !SkillHub.builder.state.wasRestored() }, [
      el('span', { class: 'u-row' }, [
        SkillHub.icons.get('refresh', 'icon--sm'),
        el('span', null, 'Rascunho recuperado do navegador' +
          (updatedAt ? ' (' + SkillHub.util.formatDate(String(updatedAt).slice(0, 10)) + ')' : '') + '.')
      ]),
      ui.button({
        label: 'Descartar e começar do zero',
        variant: 'ghost',
        icon: 'trash',
        onClick: function () {
          SkillHub.builder.state.discard();
          node.hidden = true;
          SkillHub.builder.state.setStep(1);
          refreshStep();
          SkillHub.toast.show('Rascunho descartado.', 'success');
        }
      })
    ]);
    refs.draft = node;
    return node;
  }

  /* --- Página -------------------------------------------------------------- */

  function render() {
    refs.stepper = el('div', { class: 'builder__stepper', id: 'builder-stepper' }, buildStepper());
    refs.step = el('div', { class: 'card', id: 'builder-step' }, buildStepBody());

    return el('div', null, [
      el('div', { class: 'builder__head' }, [
        ui.eyebrow('Skill Builder'),
        el('h1', { class: 'builder__title' }, 'Crie uma Skill, um prompt ou um AGENTS.md'),
        el('p', { class: 'page-copy' },
          'Escolha a ferramenta e o Skill Hub gera o arquivo no formato que ela espera. Nada é executado e nada sai do seu navegador.')
      ]),
      draftBanner(),
      refs.stepper,
      el('div', { class: 'builder__layout' }, [refs.step, buildAside()])
    ]);
  }

  function topbar() {
    var spec = SkillHub.formats.get(state().format);
    return {
      lead: el('span', { class: 'u-row' }, [
        SkillHub.icons.get('wand', 'icon--sm'),
        el('span', null, 'Skill Builder'),
        ui.badge(spec.short, 'info', spec.icon)
      ]),
      actions: ui.button({
        label: 'Sair do builder',
        variant: 'ghost',
        icon: 'x',
        href: '#/home'
      })
    };
  }

  function teardown() {
    refs = {
      stepper: null, step: null, aside: null, code: null,
      tree: null, validation: null, scores: null, draft: null
    };
  }

  SkillHub.pages.builder = {
    title: 'Skill Builder',
    render: render,
    topbar: topbar,
    teardown: teardown
  };
})(window.SkillHub);
