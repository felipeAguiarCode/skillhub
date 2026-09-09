/* ==========================================================================
   builder/state.js — SkillHub.builder.state

   Estado único e serializável do wizard (ADR-007). O DOM nunca é fonte de
   verdade: todo campo escreve aqui via update() e lê daqui na renderização.

   Persistência em skillhub.builder.draft.v1 com debounce; leitura tolerante a
   JSON corrompido e a versões antigas (QA §localStorage).
   ========================================================================== */

window.SkillHub.builder = window.SkillHub.builder || {};

(function (SkillHub) {
  'use strict';

  /* v2: o estado passou a carregar o formato de saída, porque a quantidade de
     passos e os campos disponíveis dependem da ferramenta escolhida. */
  var VERSION = 2;

  var BODY_TEMPLATE = [
    '# Goal',
    '',
    'Describe the task this skill should accomplish.',
    '',
    '## Workflow',
    '',
    '1. Inspect the relevant context.',
    '2. Perform the requested task.',
    '3. Validate the result.',
    '',
    '## Quality checks',
    '',
    '- Keep the output focused.',
    '- Verify assumptions against available files.',
    '- Report blockers instead of inventing missing information.',
    ''
  ].join('\n');

  var FILE_TYPES = [
    { value: 'reference', label: 'Referência' },
    { value: 'example', label: 'Exemplo' },
    { value: 'template', label: 'Template' },
    { value: 'script', label: 'Script' },
    { value: 'text', label: 'Texto genérico' }
  ];

  var TARGETS = [
    { value: 'project', label: 'Claude Code — projeto' },
    { value: 'personal', label: 'Claude Code — pessoal' },
    { value: 'plugin', label: 'Claude Code — plugin' },
    { value: 'portable', label: 'Portátil / Agent Skills' }
  ];

  /* --- Passos derivados do formato ------------------------------------------ */

  /**
   * A lista de passos vem do formato: o Claude Code tem sete, o prompt do Codex
   * cinco (não declara ferramentas) e o AGENTS.md quatro (não tem frontmatter
   * nem invocação). Índice e chave andam juntos para a validação não depender
   * de números que mudam de significado entre formatos.
   */
  function stepLabels(state) {
    return SkillHub.formats.get(state.format).steps;
  }

  function stepKeys(state) {
    return SkillHub.formats.get(state.format).stepKeys;
  }

  function stepCount(state) {
    return stepKeys(state).length;
  }

  function stepKeyAt(state, index) {
    return stepKeys(state)[index - 1] || 'basic';
  }

  function indexOfStepKey(state, key) {
    var found = stepKeys(state).indexOf(key);
    return found === -1 ? 0 : found + 1;
  }

  function defaults() {
    return {
      version: VERSION,
      step: 1,
      format: 'claude-skill',
      profile: 'claude-code-full',
      target: 'project',
      metadata: {
        directoryName: '',
        displayName: '',
        description: '',
        category: 'development',
        tags: [],
        license: '',
        compatibility: ''
      },
      invocation: {
        whenToUse: '',
        argumentHint: '',
        args: [],
        autoInvoke: true,
        userInvocable: true
      },
      execution: {
        allowedTools: [],
        disallowedTools: [],
        model: '',
        /* Modelo sugerido para o Codex. NÃO é campo de arquivo: o Codex define
           modelo em ~/.codex/config.toml, em --model ou em /model. Fica aqui só
           para o builder poder montar o snippet de configuração. */
        codexModel: '',
        effort: '',
        context: '',
        agent: '',
        waitForResult: false,
        shell: '',
        paths: [],
        hooks: ''
      },
      instructions: { body: BODY_TEMPLATE },
      files: [],
      updatedAt: null
    };
  }

  var current = defaults();
  var restoredFromDraft = false;

  /* --- Merge tolerante ----------------------------------------------------- */

  /** Copia só as chaves conhecidas do default, no tipo esperado. */
  function mergeInto(base, incoming) {
    if (!incoming || typeof incoming !== 'object') return base;
    Object.keys(base).forEach(function (key) {
      var expected = base[key];
      var value = incoming[key];
      if (value === undefined || value === null) return;
      if (Array.isArray(expected)) {
        if (Array.isArray(value)) base[key] = value.slice();
        return;
      }
      if (expected !== null && typeof expected === 'object') {
        mergeInto(expected, value);
        return;
      }
      if (typeof expected === 'boolean') {
        base[key] = Boolean(value);
        return;
      }
      if (typeof expected === 'number') {
        var number = Number(value);
        if (!isNaN(number)) base[key] = number;
        return;
      }
      base[key] = String(value);
    });
    return base;
  }

  function load() {
    var stored = SkillHub.store.read(SkillHub.store.KEYS.draft, null);
    if (!stored || typeof stored !== 'object' || stored.version !== VERSION) {
      current = defaults();
      restoredFromDraft = false;
      return current;
    }
    current = mergeInto(defaults(), stored);
    current.files = sanitizeFiles(stored.files);
    current.step = clampStep(current.step);
    restoredFromDraft = true;
    return current;
  }

  function sanitizeFiles(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (file) {
      return file && typeof file === 'object';
    }).map(function (file) {
      return {
        path: String(file.path === undefined || file.path === null ? '' : file.path),
        type: String(file.type || 'text'),
        content: String(file.content === undefined || file.content === null ? '' : file.content)
      };
    });
  }

  function clampStep(step) {
    var number = Number(step) || 1;
    return Math.min(stepCount(current), Math.max(1, Math.round(number)));
  }

  /* --- Persistência -------------------------------------------------------- */

  function writeDraft() {
    current.updatedAt = new Date().toISOString();
    SkillHub.store.write(SkillHub.store.KEYS.draft, current);
  }

  /* Edição de campo é debounced: não faz sentido gravar a cada tecla. */
  var persist = SkillHub.util.debounce(writeDraft, 400);

  /**
   * Ações estruturais (trocar de passo, de perfil, mexer em arquivos) gravam na
   * hora. Se todas fossem debounced, uma sequência rápida de cliques reiniciaria
   * o timer sem parar e o rascunho nunca chegaria ao localStorage.
   */
  function persistNow() {
    persist.cancel();
    writeDraft();
  }

  /* Última chance de gravar o que estava pendente antes da página sumir. */
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('pagehide', function () { persist.flush(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') persist.flush();
    });
  }

  /* --- Leitura e escrita --------------------------------------------------- */

  function get() {
    return current;
  }

  /** update('metadata.description', 'texto') — única porta de escrita. */
  function update(path, value) {
    var parts = String(path).split('.');
    var node = current;
    for (var i = 0; i < parts.length - 1; i += 1) {
      if (!node[parts[i]] || typeof node[parts[i]] !== 'object') node[parts[i]] = {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
    persist();
    return current;
  }

  function setStep(step) {
    current.step = clampStep(step);
    persistNow();
    return current.step;
  }

  /**
   * Trocar o formato troca a lista de passos. O passo atual é remapeado pela
   * CHAVE, então quem estava em "Instruções" continua em "Instruções" mesmo que
   * o número do passo mude entre formatos.
   */
  function setFormat(format) {
    if (!SkillHub.formats.has(format)) return current.format;
    var previousKey = stepKeyAt(current, current.step);
    current.format = format;
    if (format !== 'claude-skill') current.profile = 'claude-code-full';
    var keys = stepKeys(current);
    current.step = keys.indexOf(previousKey) === -1 ? 1 : keys.indexOf(previousKey) + 1;
    persistNow();
    return current.format;
  }

  function setProfile(profile) {
    current.profile = profile === 'portable' ? 'portable' : 'claude-code-full';
    persistNow();
    return current.profile;
  }

  /* --- Arquivos auxiliares ------------------------------------------------- */

  function addFile(file) {
    current.files.push({
      path: (file && file.path) || '',
      type: (file && file.type) || 'reference',
      content: (file && file.content) || ''
    });
    persistNow();
    return current.files;
  }

  function updateFile(index, key, value) {
    if (!current.files[index]) return current.files;
    current.files[index][key] = value;
    persist();
    return current.files;
  }

  function removeFile(index) {
    current.files.splice(index, 1);
    persistNow();
    return current.files;
  }

  /* --- Ciclo de vida do rascunho ------------------------------------------- */

  function reset() {
    current = defaults();
    restoredFromDraft = false;
    SkillHub.store.write(SkillHub.store.KEYS.draft, current);
    return current;
  }

  /** Descarta apenas a chave do builder, nunca favoritos ou preferências. */
  function discard() {
    SkillHub.store.remove(SkillHub.store.KEYS.draft);
    current = defaults();
    restoredFromDraft = false;
    return current;
  }

  function wasRestored() {
    return restoredFromDraft;
  }

  function acknowledgeDraft() {
    restoredFromDraft = false;
  }

  SkillHub.builder.state = {
    VERSION: VERSION,
    stepLabels: stepLabels,
    stepKeys: stepKeys,
    stepCount: stepCount,
    stepKeyAt: stepKeyAt,
    indexOfStepKey: indexOfStepKey,
    BODY_TEMPLATE: BODY_TEMPLATE,
    FILE_TYPES: FILE_TYPES,
    TARGETS: TARGETS,
    defaults: defaults,
    load: load,
    get: get,
    update: update,
    setStep: setStep,
    setFormat: setFormat,
    setProfile: setProfile,
    addFile: addFile,
    updateFile: updateFile,
    removeFile: removeFile,
    reset: reset,
    discard: discard,
    wasRestored: wasRestored,
    acknowledgeDraft: acknowledgeDraft
  };
})(window.SkillHub);
