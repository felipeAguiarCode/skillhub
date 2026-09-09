/* ==========================================================================
   builder/serialize.js — SkillHub.builder.serialize

   Serialização determinística (ADR-008): o mesmo estado produz sempre o mesmo
   arquivo, byte a byte. A ordem de emissão é fixa e campos vazios nunca são
   emitidos (SKILL_BUILDER_SPEC §6).

   O FORMATO decide o que pode ser emitido (assets/js/formats.js):
   - claude-skill ..... os ~20 campos do Claude Code
   - codex-prompt ..... só description e argument-hint
   - portable-prompt .. só description e argument-hint
   - codex-agents ..... nenhum campo: AGENTS.md é Markdown puro

   Os nomes buildFrontmatter / buildSkillBody / buildSkillMarkdown são os
   exigidos pela ADR-008 e ficam como API pública, mesmo quando o arquivo de
   entrada não se chama SKILL.md.
   ========================================================================== */

window.SkillHub.builder = window.SkillHub.builder || {};

(function (SkillHub) {
  'use strict';

  var util = SkillHub.util;

  var SIMPLE_SCALAR = /^[A-Za-z0-9._-]+$/;

  /* --- Normalização -------------------------------------------------------- */

  function trim(value) {
    return String(value === null || value === undefined ? '' : value).trim();
  }

  function normalizeList(value) {
    if (Array.isArray(value)) return util.unique(value.map(trim).filter(Boolean));
    return util.unique(util.splitList(value));
  }

  function normalizePath(value) {
    return trim(value).replace(/\\/g, '/').replace(/^\.\//, '');
  }

  /**
   * Produz uma cópia normalizada do estado. Todo o resto deste módulo consome
   * esta forma, o que mantém a saída estável e testável.
   */
  function normalizeBuilderState(state) {
    var spec = SkillHub.formats.get(state.format);
    /* O perfil Portable só existe dentro do formato do Claude Code; nos outros
       o próprio formato já restringe o frontmatter. */
    var portableProfile = spec.id === 'claude-skill' && state.profile === 'portable';
    var directoryName = util.slugify(state.metadata.directoryName);
    var displayNameRaw = trim(state.metadata.displayName);

    return {
      format: spec.id,
      formatSpec: spec,
      profile: portableProfile ? 'portable' : 'claude-code-full',
      portable: portableProfile,
      target: portableProfile ? 'portable' : state.target,
      directoryName: directoryName,
      directoryNameRaw: trim(state.metadata.directoryName),
      displayName: displayNameRaw ? util.slugify(displayNameRaw) : '',
      displayNameRaw: displayNameRaw,
      description: trim(state.metadata.description),
      category: trim(state.metadata.category),
      tags: normalizeList(state.metadata.tags),
      license: trim(state.metadata.license),
      compatibility: trim(state.metadata.compatibility),
      whenToUse: trim(state.invocation.whenToUse),
      argumentHint: trim(state.invocation.argumentHint),
      args: normalizeList(state.invocation.args),
      autoInvoke: Boolean(state.invocation.autoInvoke),
      userInvocable: Boolean(state.invocation.userInvocable),
      allowedTools: normalizeList(state.execution.allowedTools),
      disallowedTools: normalizeList(state.execution.disallowedTools),
      model: trim(state.execution.model),
      /* Nunca entra em collectFields: o Codex não tem campo de modelo no
         arquivo, isto alimenta apenas o snippet de configuração. */
      codexModel: trim(state.execution.codexModel),
      effort: trim(state.execution.effort),
      context: trim(state.execution.context),
      agent: trim(state.execution.agent),
      waitForResult: Boolean(state.execution.waitForResult),
      shell: trim(state.execution.shell),
      paths: normalizeList(state.execution.paths),
      hooks: String(state.execution.hooks === null || state.execution.hooks === undefined ? '' : state.execution.hooks).replace(/\s+$/, ''),
      body: String(state.instructions.body === null || state.instructions.body === undefined ? '' : state.instructions.body),
      files: (state.files || []).map(function (file) {
        return {
          path: normalizePath(file.path),
          rawPath: trim(file.path),
          type: trim(file.type) || 'text',
          content: String(file.content === null || file.content === undefined ? '' : file.content)
        };
      })
    };
  }

  /* --- YAML ---------------------------------------------------------------- */

  /** Aspas JSON-style resolvem `:`, `#`, `-` inicial e quebras de linha. */
  function yamlScalar(value) {
    var text = String(value);
    return SIMPLE_SCALAR.test(text) ? text : JSON.stringify(text);
  }

  /** Descrições sempre entre aspas: são frases com pontuação. */
  function yamlQuoted(value) {
    return JSON.stringify(String(value));
  }

  function yamlList(key, values) {
    var lines = [key + ':'];
    values.forEach(function (value) { lines.push('  - ' + yamlScalar(value)); });
    return lines;
  }

  function yamlBlock(key, text) {
    var lines = [key + ': |'];
    String(text).split('\n').forEach(function (line) { lines.push('  ' + line); });
    return lines;
  }

  /* --- Frontmatter --------------------------------------------------------- */

  /**
   * Todos os pares possíveis, como mapa chave -> linhas. Quem filtra por
   * formato e por perfil é frontmatterLines(), o que mantém uma só definição de
   * como cada campo é serializado.
   */
  function collectFields(model) {
    var fields = Object.create(null);

    if (model.displayName) fields.name = ['name: ' + yamlScalar(model.displayName)];
    else if (model.directoryName) fields.name = ['name: ' + yamlScalar(model.directoryName)];

    if (model.description) fields.description = ['description: ' + yamlQuoted(model.description)];
    if (model.whenToUse) fields.when_to_use = ['when_to_use: ' + yamlQuoted(model.whenToUse)];
    if (model.argumentHint) fields['argument-hint'] = ['argument-hint: ' + yamlQuoted(model.argumentHint)];
    if (model.args.length) fields.arguments = yamlList('arguments', model.args);

    // Toggles emitem só a forma negativa, como manda a SPEC §4.
    if (!model.autoInvoke) fields['disable-model-invocation'] = ['disable-model-invocation: true'];
    if (!model.userInvocable) fields['user-invocable'] = ['user-invocable: false'];

    if (model.allowedTools.length) fields['allowed-tools'] = yamlList('allowed-tools', model.allowedTools);
    if (model.disallowedTools.length) fields['disallowed-tools'] = yamlList('disallowed-tools', model.disallowedTools);

    if (model.model) fields.model = ['model: ' + yamlScalar(model.model)];
    if (model.effort) fields.effort = ['effort: ' + yamlScalar(model.effort)];
    if (model.context) fields.context = ['context: ' + yamlScalar(model.context)];
    if (model.agent) fields.agent = ['agent: ' + yamlScalar(model.agent)];
    /* `background` é true por padrão na documentação: o valor que significa algo
       é `false`, usado para esperar o resultado do fork. */
    if (model.waitForResult) fields.background = ['background: false'];
    if (model.paths.length) fields.paths = yamlList('paths', model.paths);
    if (model.shell) fields.shell = ['shell: ' + yamlScalar(model.shell)];
    if (model.hooks) fields.hooks = yamlBlock('hooks', model.hooks);

    if (model.license) fields.license = ['license: ' + yamlScalar(model.license)];
    if (model.compatibility) fields.compatibility = ['compatibility: ' + yamlQuoted(model.compatibility)];

    var metadata = [];
    if (model.category) metadata.push('  category: ' + yamlScalar(model.category));
    if (model.tags.length) metadata.push('  tags: ' + yamlQuoted(model.tags.join(', ')));
    if (metadata.length) fields.metadata = ['metadata:'].concat(metadata);

    return fields;
  }

  /** Chaves aceitas pelo formato, considerando também o perfil Portable. */
  function allowedKeys(model) {
    return model.portable ? model.formatSpec.portableKeys : model.formatSpec.frontmatterKeys;
  }

  /**
   * Campos preenchidos que o formato (ou o perfil) descarta — é o que a UI
   * mostra antes de o usuário confirmar uma troca de formato ou de perfil.
   */
  function droppedKeys(model) {
    var keep = allowedKeys(model);
    var fields = collectFields(model);
    return Object.keys(fields).filter(function (key) {
      return keep.indexOf(key) === -1;
    }).sort(function (a, b) {
      return SkillHub.formats.CLAUDE_KEYS.indexOf(a) - SkillHub.formats.CLAUDE_KEYS.indexOf(b);
    });
  }

  /** Mantido com este nome porque a UI de perfil Portable já o consumia. */
  function nonPortableKeys(model) {
    return droppedKeys(model);
  }

  function frontmatterLines(model) {
    var spec = model.formatSpec;
    if (spec.frontmatter === 'none') return [];

    var fields = collectFields(model);
    var keep = allowedKeys(model);
    var lines = [];
    /* A ordem é a canônica do formato, não a ordem em que o usuário preencheu. */
    spec.frontmatterKeys.forEach(function (key) {
      if (!fields[key]) return;
      if (keep.indexOf(key) === -1) return;
      lines = lines.concat(fields[key]);
    });
    return lines;
  }

  function buildFrontmatter(model) {
    var lines = frontmatterLines(model);
    if (!lines.length) return '';
    return ['---'].concat(lines).concat(['---']).join('\n');
  }

  /* --- Corpo e arquivo final ----------------------------------------------- */

  function buildSkillBody(model) {
    var body = String(model.body || '').replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
    return body ? body + '\n' : '';
  }

  /** Conteúdo do arquivo de entrada, qualquer que seja o formato. */
  function buildSkillMarkdown(model) {
    var frontmatter = buildFrontmatter(model);
    var body = buildSkillBody(model);
    if (!frontmatter) return body;
    if (!body) return frontmatter + '\n';
    return frontmatter + '\n\n' + body;
  }

  /* --- Estrutura ----------------------------------------------------------- */

  function skillDirName(model) {
    return model.directoryName || 'meu-item';
  }

  function entryFileName(model) {
    return SkillHub.formats.entryFileName(model.format, skillDirName(model));
  }

  /** Como o arquivo aparece instalado: dentro de um diretório ou solto. */
  function entryLabel(model) {
    return model.formatSpec.usesDirectory
      ? skillDirName(model) + '/' + entryFileName(model)
      : entryFileName(model);
  }

  function supportsFiles(model) {
    return model.formatSpec.supportsFiles === true;
  }

  /** ZIP só faz sentido onde existe um diretório com mais de um arquivo. */
  function supportsZip(model) {
    return supportsFiles(model);
  }

  function filePaths(model) {
    var entry = [entryFileName(model)];
    if (!supportsFiles(model)) return entry;
    return entry.concat(model.files.map(function (file) { return file.path; }).filter(Boolean));
  }

  function buildFileTree(model) {
    if (!model.formatSpec.usesDirectory) return filePaths(model);
    return util.treeLines(skillDirName(model), filePaths(model));
  }

  function installPaths(model) {
    return SkillHub.formats.installPaths(model.format, skillDirName(model));
  }

  function invocationLabel(model) {
    return SkillHub.formats.invocationLabel(model.format, skillDirName(model));
  }

  function zipFileName(model) {
    return skillDirName(model) + '.zip';
  }

  /** Todos os arquivos do pacote, prontos para o writer ZIP. */
  function packageFiles(model) {
    var entry = [{ path: entryFileName(model), content: buildSkillMarkdown(model) }];
    if (!supportsFiles(model)) return entry;
    return entry.concat(
      model.files.filter(function (file) { return file.path; }).map(function (file) {
        return { path: file.path, content: file.content };
      })
    );
  }

  SkillHub.builder.serialize = {
    normalizeBuilderState: normalizeBuilderState,
    buildFrontmatter: buildFrontmatter,
    buildSkillBody: buildSkillBody,
    buildSkillMarkdown: buildSkillMarkdown,
    buildFileTree: buildFileTree,
    installPaths: installPaths,
    invocationLabel: invocationLabel,
    droppedKeys: droppedKeys,
    nonPortableKeys: nonPortableKeys,
    allowedKeys: allowedKeys,
    skillDirName: skillDirName,
    entryFileName: entryFileName,
    entryLabel: entryLabel,
    supportsFiles: supportsFiles,
    supportsZip: supportsZip,
    zipFileName: zipFileName,
    packageFiles: packageFiles,
    filePaths: filePaths
  };
})(window.SkillHub);
