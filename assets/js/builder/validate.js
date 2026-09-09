/* ==========================================================================
   builder/validate.js — SkillHub.builder.validate

   Validação por passo (bloqueante vs. aviso) e os dois scores explicados.

   Os passos são endereçados por CHAVE, não por número: "passo 2" é Gatilhos no
   formato do Claude Code e Instruções no AGENTS.md, então o número não serve
   como identidade.

   Next é travado só pelos erros do passo atual; a exportação é travada pelo
   agregado de todos os passos do formato.
   ========================================================================== */

window.SkillHub.builder = window.SkillHub.builder || {};

(function (SkillHub) {
  'use strict';

  var DIR_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  var SHELL_TOOL = /(^|[^a-z])(bash|powershell|pwsh|sh|cmd)([^a-z]|$)/i;
  var BROAD_TOOL = /^(\*|bash|powershell|pwsh|bash\(\s*\*\s*\)|powershell\(\s*\*\s*\))$/i;

  /* Injeção dinâmica de shell do Claude Code, nas duas formas documentadas:
     inline com !`comando` e bloco de várias linhas abrindo com ```! */
  var SHELL_INJECTION_INLINE = /!`/;
  var SHELL_INJECTION_BLOCK = /^\s*```!\s*$/m;

  var DESTRUCTIVE = [
    { pattern: /rm\s+-[a-z]*r[a-z]*f/i, label: 'rm -rf' },
    { pattern: /git\s+push\s+(-f|--force)/i, label: 'git push --force' },
    { pattern: /git\s+reset\s+--hard/i, label: 'git reset --hard' },
    { pattern: /git\s+clean\s+-[a-z]*f/i, label: 'git clean -f' },
    { pattern: /drop\s+(table|database)/i, label: 'DROP TABLE' },
    { pattern: /truncate\s+table/i, label: 'TRUNCATE TABLE' },
    { pattern: /mkfs(\.|\s)/i, label: 'mkfs' },
    { pattern: /remove-item[^\n]*-recurse/i, label: 'Remove-Item -Recurse' },
    { pattern: /\bformat\s+[a-z]:/i, label: 'format <drive>' },
    { pattern: /dd\s+if=[^\s]+\s+of=\/dev\//i, label: 'dd of=/dev/...' }
  ];

  var EXTERNAL_URL = /\bhttps?:\/\/[^\s"'`)]+/i;
  /* Placeholders só do Claude Code. */
  var CLAUDE_PLACEHOLDER = /\$\{CLAUDE_[A-Z_]+\}/;
  var CLAUDE_ARG_PLACEHOLDER = /\$ARGUMENTS(\[\d+\])?|\$[0-9]\b/;
  /* Placeholder nomeado do Codex: MAIÚSCULO, alimentado por KEY=valor.
     $ARGUMENTS fica fora do padrão porque é válido nas duas ferramentas e não
     deve ser sinalizado como específico do Codex. */
  var CODEX_NAMED_PLACEHOLDER = /\$(?!ARGUMENTS\b)[A-Z][A-Z0-9_]{2,}\b/;
  var AUX_REFERENCE = /\b(reference\.md|examples?\.md|(?:templates?|scripts?)\/[\w.-]+)\b/g;

  // Caracteres que impedem a extração no Windows. Hífen, ponto, sublinhado
  // e espaço interno são válidos e não entram aqui.
  var WINDOWS_INVALID = /[<>:"|?*]/;
  var WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;

  /* A documentação do Claude Code limita description + when_to_use somados. */
  var DESCRIPTION_LIMIT = 1536;

  function result() {
    return { blocking: [], warnings: [] };
  }

  function merge(target, source) {
    target.blocking = target.blocking.concat(source.blocking);
    target.warnings = target.warnings.concat(source.warnings);
    return target;
  }

  /** Caracteres de controle checados por code point, sem regex escapada. */
  function hasControlChar(value) {
    var text = String(value);
    for (var i = 0; i < text.length; i += 1) {
      var code = text.charCodeAt(i);
      if (code < 32 || code === 127) return true;
    }
    return false;
  }

  function isScriptFile(file) {
    return file.type === 'script' || /^scripts?\//i.test(file.path) || /\.(sh|ps1|bat|cmd|py|rb|pl)$/i.test(file.path);
  }

  function hasShellInjection(body) {
    return SHELL_INJECTION_INLINE.test(body) || SHELL_INJECTION_BLOCK.test(body);
  }

  /** Bytes UTF-8 contados por code point, sem depender de TextEncoder. */
  function byteLength(text) {
    var bytes = 0;
    for (var i = 0; i < text.length; i += 1) {
      var code = text.charCodeAt(i);
      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code >= 0xd800 && code <= 0xdbff) { bytes += 4; i += 1; }
      else bytes += 3;
    }
    return bytes;
  }

  /* --- basic --------------------------------------------------------------- */

  function stepBasic(model) {
    var out = result();
    var spec = model.formatSpec;

    if (!model.directoryNameRaw) {
      out.blocking.push(spec.usesDirectory
        ? 'Informe o nome do diretório da Skill.'
        : 'Informe o nome do arquivo, sem a extensão .md.');
    } else if (!DIR_NAME.test(model.directoryNameRaw)) {
      out.blocking.push('O nome deve usar lowercase e kebab-case, sem espaços. Sugestão: "' +
        (model.directoryName || 'meu-item') + '".');
    }

    /* AGENTS.md não tem campo de descrição: cobrar uma ali seria inventar regra. */
    if (spec.frontmatter === 'none') {
      if (model.description) {
        out.warnings.push('AGENTS.md não tem frontmatter: a descrição não será emitida. Coloque esse contexto no próprio corpo.');
      }
    } else if (!model.description) {
      out.warnings.push('Sem description, a ferramenta tem pouca informação para decidir quando acionar este item.');
    } else if (model.description.length < 40) {
      out.warnings.push('A description está curta. Diga o que faz e quando deve ser usada.');
    }

    if (spec.id === 'claude-skill') {
      var combined = model.description.length + model.whenToUse.length;
      if (combined > DESCRIPTION_LIMIT) {
        out.blocking.push('description + when_to_use somam ' + combined + ' caracteres; o Claude Code aceita até ' +
          DESCRIPTION_LIMIT + '. Reduza ' + (combined - DESCRIPTION_LIMIT) + '.');
      }
      if (model.compatibility.length > 500) {
        out.warnings.push('compatibility passa de 500 caracteres, o limite documentado do campo.');
      }
    }

    if (model.displayNameRaw) {
      if (spec.frontmatterKeys.indexOf('name') === -1) {
        out.warnings.push('Este formato não emite o campo name — o nome vem do arquivo. O display name será ignorado.');
      } else if (model.displayName !== model.displayNameRaw) {
        out.warnings.push('O display name foi normalizado para "' + model.displayName + '" ao ser emitido em name:.');
      }
    }

    var dropped = SkillHub.builder.serialize.droppedKeys(model);
    if (dropped.length) {
      out.warnings.push('Neste formato estes campos preenchidos não são emitidos: ' + dropped.join(', ') + '.');
    }

    return out;
  }

  /* --- invocation ---------------------------------------------------------- */

  function stepInvocation(model) {
    var out = result();
    var spec = model.formatSpec;

    if (spec.id === 'claude-skill') {
      if (!model.autoInvoke && !model.userInvocable) {
        out.warnings.push('Invocação automática e manual estão desativadas: a Skill fica sem gatilho pelos fluxos normais.');
      }
      if (model.portable && (model.whenToUse || !model.autoInvoke || !model.userInvocable)) {
        out.warnings.push('No perfil Portable, os campos de invocação específicos do Claude Code não são emitidos.');
      }
    } else {
      /* Prompt do Codex é sempre explícito: não existe auto-invocação. */
      out.warnings.push('Neste formato o acionamento é sempre explícito (' +
        SkillHub.builder.serialize.invocationLabel(model) + '); não há invocação automática.');
    }

    if (model.argumentHint && !model.args.length && spec.frontmatterKeys.indexOf('arguments') !== -1) {
      out.warnings.push('Há argument-hint sem argumentos declarados; o autocomplete sugere algo que o item não nomeia.');
    }
    if (model.args.length && spec.frontmatterKeys.indexOf('arguments') === -1) {
      out.warnings.push('Este formato não tem campo arguments. Use os placeholders do corpo: ' +
        spec.placeholders.join(', ') + '.');
    }
    if (model.args.length && !model.argumentHint) {
      out.warnings.push('Há argumentos declarados sem argument-hint; quem invoca não vê o formato esperado.');
    }

    return out;
  }

  /* --- execution ----------------------------------------------------------- */

  function stepExecution(model) {
    var out = result();

    if (!model.formatSpec.supportsTools) {
      out.warnings.push('Este formato não declara ferramentas nem permissões; o que a ferramenta pode fazer vem da sessão.');
      return out;
    }

    var tools = model.allowedTools;

    var broad = tools.filter(function (tool) { return BROAD_TOOL.test(tool.trim()); });
    if (broad.length) {
      out.warnings.push('allowed-tools muito amplo: ' + broad.join(', ') + '. Restrinja o padrão, por exemplo Bash(git status *).');
    }

    var shellTools = tools.filter(function (tool) { return SHELL_TOOL.test(tool); });
    if (shellTools.length && !broad.length) {
      out.warnings.push('Ferramentas de shell pré-aprovadas: ' + shellTools.join(', ') + '. Quem instalar aceita esses comandos sem novo aviso.');
    }

    if (model.hooks) {
      out.warnings.push('Hooks executam automaticamente em pontos do fluxo, sem confirmação a cada uso.');
    }
    if (model.waitForResult && model.context !== 'fork') {
      out.warnings.push('Esperar o resultado (background: false) só tem efeito junto com context: fork.');
    }
    if (model.agent && model.context !== 'fork') {
      out.warnings.push('agent só é considerado quando context: fork está ativo.');
    }

    return out;
  }

  /* --- instructions -------------------------------------------------------- */

  function stepInstructions(model) {
    var out = result();
    var spec = model.formatSpec;
    var serialize = SkillHub.builder.serialize;
    var body = serialize.buildSkillBody(model);
    var content = serialize.buildSkillMarkdown(model);

    if (!content.trim()) {
      out.blocking.push('O ' + serialize.entryFileName(model) + ' ficaria vazio: escreva as instruções.');
    } else if (!body.trim()) {
      out.warnings.push('O corpo está vazio; o arquivo só teria frontmatter.');
    }

    /* Injeção dinâmica de shell é recurso do Claude Code. Fora dele, a linha
       fica literal — o que muda o significado do arquivo. */
    if (hasShellInjection(model.body)) {
      if (spec.id === 'claude-skill' && !model.portable) {
        out.warnings.push('Injeção dinâmica de shell detectada: o comando roda a cada invocação da Skill. O Skill Hub nunca o executa.');
      } else {
        out.warnings.push('Injeção dinâmica de shell (!`comando` ou bloco ```!) só é interpretada pelo Claude Code. Neste formato a linha fica como texto literal.');
      }
    }

    DESTRUCTIVE.forEach(function (rule) {
      if (rule.pattern.test(model.body)) {
        out.warnings.push('Comando potencialmente destrutivo no corpo: ' + rule.label + '. Confirme se é intencional.');
      }
    });

    /* Placeholders: cada ferramenta substitui um conjunto diferente. */
    if (spec.tool === 'codex' || spec.tool === 'any') {
      if (CLAUDE_PLACEHOLDER.test(model.body)) {
        out.warnings.push('O corpo usa ${CLAUDE_*}, que só o Claude Code substitui. No Codex isso fica literal.');
      }
    }
    if (spec.id === 'portable-prompt' && CODEX_NAMED_PLACEHOLDER.test(model.body)) {
      out.warnings.push('Placeholder nomeado em MAIÚSCULAS ($NOME) é do Codex; o Claude Code não o substitui. Use $ARGUMENTS ou $1 para manter a portabilidade.');
    }
    if (spec.id === 'claude-skill' && model.portable &&
        (CLAUDE_PLACEHOLDER.test(model.body) || CLAUDE_ARG_PLACEHOLDER.test(model.body))) {
      out.warnings.push('O corpo usa placeholders do Claude Code que não são substituídos em outros ambientes.');
    }

    if (spec.maxLines) {
      var lines = body.split('\n').length;
      if (lines > spec.maxLines) {
        out.warnings.push('O arquivo tem ' + lines + ' linhas; a documentação recomenda manter abaixo de ' +
          spec.maxLines + '. Mova o material extenso para arquivos auxiliares.');
      }
    }
    if (spec.maxBytes) {
      var bytes = byteLength(content);
      if (bytes > spec.maxBytes) {
        out.blocking.push('O AGENTS.md tem ' + Math.round(bytes / 1024) + ' KiB e o Codex lê no máximo ' +
          Math.round(spec.maxBytes / 1024) + ' KiB (project_doc_max_bytes). O excedente é ignorado.');
      } else if (bytes > spec.maxBytes * 0.8) {
        out.warnings.push('O AGENTS.md está em ' + Math.round(bytes / 1024) + ' KiB, perto do limite de ' +
          Math.round(spec.maxBytes / 1024) + ' KiB.');
      }
    }

    return out;
  }

  /* --- files --------------------------------------------------------------- */

  function stepFiles(model) {
    var out = result();
    var serialize = SkillHub.builder.serialize;

    if (!model.formatSpec.supportsFiles) {
      if (model.files.length) {
        out.warnings.push('Este formato é um arquivo único: os ' + model.files.length +
          ' arquivos auxiliares não serão exportados.');
      }
      return out;
    }

    var entry = serialize.entryFileName(model).toUpperCase();
    var seen = Object.create(null);

    model.files.forEach(function (file, index) {
      var position = 'Arquivo ' + (index + 1);
      var path = file.path;

      if (!file.rawPath) {
        out.blocking.push(position + ': informe o caminho do arquivo.');
        return;
      }
      if (/^([a-z]:)?[\/]/i.test(path)) {
        out.blocking.push(position + ': caminho absoluto não é permitido ("' + file.rawPath + '").');
        return;
      }
      if (path.split('/').indexOf('..') !== -1) {
        out.blocking.push(position + ': o caminho não pode sair do diretório da Skill ("' + file.rawPath + '").');
        return;
      }
      if (path.toUpperCase() === entry) {
        out.blocking.push(position + ': ' + serialize.entryFileName(model) + ' já é gerado pelo builder.');
        return;
      }
      if (WINDOWS_INVALID.test(path)) {
        out.blocking.push(position + ': o caminho tem caracteres que impedem a extração no Windows (< > : " | ? *).');
        return;
      }
      if (hasControlChar(path)) {
        out.blocking.push(position + ': o caminho tem caracteres de controle e não pode ser extraído.');
        return;
      }

      var badSegment = null;
      path.split('/').forEach(function (segment) {
        if (!segment) badSegment = badSegment || 'segmento vazio';
        else if (/[. ]$/.test(segment)) badSegment = badSegment || 'segmento terminando em ponto ou espaço';
        else if (WINDOWS_RESERVED.test(segment)) badSegment = badSegment || 'nome reservado do Windows (' + segment + ')';
      });
      if (badSegment) {
        out.blocking.push(position + ': caminho inválido — ' + badSegment + '.');
        return;
      }

      var key = path.toLowerCase();
      if (seen[key]) {
        out.blocking.push(position + ': caminho duplicado ("' + path + '"). Nomes que diferem só por maiúsculas colidem na extração.');
        return;
      }
      seen[key] = true;

      if (!file.content.trim()) {
        out.warnings.push(position + ' ("' + path + '") está sem conteúdo e seria exportado vazio.');
      }
      if (isScriptFile(file)) {
        out.warnings.push('"' + path + '" é um script anexado: quem instalar recebe código executável.');
        if (EXTERNAL_URL.test(file.content)) {
          out.warnings.push('"' + path + '" referencia uma URL externa. Scripts que baixam conteúdo em runtime merecem revisão extra.');
        }
      }
      DESTRUCTIVE.forEach(function (rule) {
        if (rule.pattern.test(file.content)) {
          out.warnings.push('Comando potencialmente destrutivo em "' + path + '": ' + rule.label + '.');
        }
      });
    });

    // Referências no corpo a arquivos que não existem no pacote.
    var declared = Object.create(null);
    serialize.filePaths(model).forEach(function (path) {
      declared[path.toLowerCase()] = true;
    });
    var missing = [];
    var match;
    AUX_REFERENCE.lastIndex = 0;
    while ((match = AUX_REFERENCE.exec(model.body)) !== null) {
      if (!declared[match[0].toLowerCase()] && missing.indexOf(match[0]) === -1) missing.push(match[0]);
    }
    if (missing.length) {
      out.warnings.push('O corpo cita arquivos que não estão no pacote: ' + missing.join(', ') + '.');
    }

    return out;
  }

  /* --- Agregação ----------------------------------------------------------- */

  var VALIDATORS = {
    basic: stepBasic,
    invocation: stepInvocation,
    execution: stepExecution,
    instructions: stepInstructions,
    files: stepFiles
  };

  /** step('basic', model) — endereçado por chave, nunca por número. */
  function step(key, model) {
    var validator = VALIDATORS[key];
    return validator ? validator(model) : result();
  }

  /** Só os passos que o formato realmente tem e que possuem validador. */
  function validatedKeys(model) {
    return model.formatSpec.stepKeys.filter(function (key) {
      return Object.prototype.hasOwnProperty.call(VALIDATORS, key);
    });
  }

  function all(model) {
    var out = result();
    validatedKeys(model).forEach(function (key) {
      merge(out, step(key, model));
    });
    return out;
  }

  /** Chaves de passo com erro bloqueante — o stepper marca essas. */
  function invalidStepKeys(model) {
    return validatedKeys(model).filter(function (key) {
      return step(key, model).blocking.length > 0;
    });
  }

  /* --- Score de risco (SPEC §11) ------------------------------------------ */

  function riskScore(model) {
    var factors = [];
    var spec = model.formatSpec;

    function add(weight, label, detail) {
      factors.push({ weight: weight, label: label, detail: detail });
    }

    if (spec.supportsTools && model.allowedTools.length) {
      add(1, 'allowed-tools', 'Declara allowed-tools: ' + model.allowedTools.length + ' ' +
        SkillHub.util.pluralize(model.allowedTools.length, 'ferramenta pré-aprovada', 'ferramentas pré-aprovadas') + '.');
    }

    var shellTools = spec.supportsTools
      ? model.allowedTools.filter(function (tool) { return SHELL_TOOL.test(tool); })
      : [];
    if (shellTools.length || (spec.supportsExecution && model.shell)) {
      add(2, 'shell', 'Pré-aprova execução de shell (' + (shellTools.join(', ') || model.shell) + ').');
    }

    var scripts = spec.supportsFiles ? model.files.filter(isScriptFile) : [];
    if (scripts.length) {
      add(2, 'script', scripts.length + ' ' + SkillHub.util.pluralize(scripts.length, 'script anexado', 'scripts anexados') +
        ': ' + scripts.map(function (file) { return file.path; }).join(', ') + '.');
    }

    if (hasShellInjection(model.body)) {
      add(2, 'shell dinâmico', 'O corpo injeta saída de comando, executada a cada invocação.');
    }

    if (spec.supportsExecution && model.context === 'fork') {
      add(1, 'fork', 'Executa em contexto isolado (context: fork), com menos visibilidade do turno principal.');
    }

    if (spec.supportsExecution && model.hooks) {
      add(2, 'hooks', 'Declara hooks, que rodam automaticamente em pontos do fluxo.');
    }

    /* AGENTS.md entra em toda sessão do diretório sem ninguém pedir. */
    if (spec.autoLoaded) {
      add(1, 'carregamento automático', 'AGENTS.md entra no contexto de toda sessão naquele diretório, sem invocação explícita.');
    }

    var destructive = [];
    var haystack = model.body + '\n' + model.files.map(function (file) { return file.content; }).join('\n');
    DESTRUCTIVE.forEach(function (rule) {
      if (rule.pattern.test(haystack)) destructive.push(rule.label);
    });
    if (destructive.length) {
      add(2, 'comando destrutivo', 'Padrão destrutivo detectado no texto: ' + destructive.join(', ') + '.');
    }

    if (scripts.some(function (file) { return EXTERNAL_URL.test(file.content); })) {
      add(1, 'URL externa', 'Um script referencia URL externa, então o conteúdo pode mudar depois da instalação.');
    }

    var score = factors.reduce(function (sum, factor) { return sum + factor.weight; }, 0);
    var level = score >= 5 ? 'elevated' : score >= 2 ? 'moderate' : 'low';

    return { score: score, level: level, factors: factors };
  }

  /* --- Score de portabilidade (SPEC §10) ---------------------------------- */

  var PORTABILITY_BANDS = [
    { min: 100, label: 'Portátil' },
    { min: 70, label: 'Quase portátil' },
    { min: 30, label: 'Específico de uma ferramenta' },
    { min: 0, label: 'Altamente específico' }
  ];

  function portabilityBand(score) {
    for (var i = 0; i < PORTABILITY_BANDS.length; i += 1) {
      if (score >= PORTABILITY_BANDS[i].min) return PORTABILITY_BANDS[i].label;
    }
    return PORTABILITY_BANDS[PORTABILITY_BANDS.length - 1].label;
  }

  function portabilityScore(model) {
    var factors = [];
    var spec = model.formatSpec;

    function penalize(weight, detail) {
      factors.push({ weight: weight, detail: detail });
    }

    /* O corpo pesa em qualquer formato: placeholders não são substituídos fora
       da ferramenta que os define. */
    if (hasShellInjection(model.body)) {
      penalize(20, 'Injeção dinâmica de shell no corpo só é interpretada pelo Claude Code.');
    }
    if (CLAUDE_PLACEHOLDER.test(model.body)) {
      penalize(8, 'O corpo usa ${CLAUDE_*}, específico do Claude Code.');
    }
    if (CODEX_NAMED_PLACEHOLDER.test(model.body) && spec.tool !== 'codex') {
      penalize(8, 'O corpo usa placeholder nomeado em MAIÚSCULAS, que é do Codex.');
    }

    /* O formato em si já amarra a ferramenta. */
    if (spec.id === 'codex-agents') {
      penalize(45, 'AGENTS.md é um formato exclusivo do Codex; o Claude Code não o carrega.');
    }
    if (spec.id === 'codex-prompt') {
      penalize(15, 'O arquivo mora em ~/.codex/prompts/ e é invocado por /prompts:<nome>, convenção só do Codex.');
    }

    if (spec.id === 'claude-skill' && !model.portable) {
      if (model.whenToUse) penalize(8, 'when_to_use é um campo específico do Claude Code.');
      if (model.argumentHint || model.args.length) penalize(12, 'argument-hint e arguments são específicos do Claude Code.');
      if (!model.autoInvoke || !model.userInvocable) penalize(12, 'disable-model-invocation e user-invocable são específicos do Claude Code.');
      if (model.context || model.agent || model.waitForResult) penalize(18, 'context, agent e background dependem do modelo de execução do Claude Code.');
      if (model.paths.length) penalize(10, 'paths ativa por glob, comportamento específico do Claude Code.');
      if (model.shell) penalize(8, 'shell fixa o interpretador esperado no ambiente.');
      if (model.disallowedTools.length) penalize(6, 'disallowed-tools não faz parte do subconjunto portátil.');
      if (model.model || model.effort) penalize(6, 'model e effort amarram a um provedor específico.');
      if (model.hooks) penalize(20, 'hooks é o campo menos portátil: depende do runtime do Claude Code.');
    }

    var penalty = factors.reduce(function (sum, factor) { return sum + factor.weight; }, 0);
    var score = Math.max(0, 100 - penalty);

    if (!factors.length) {
      factors.push({
        weight: 0,
        detail: spec.id === 'portable-prompt'
          ? 'Só description e argument-hint: os dois campos que o Claude Code e o Codex aceitam igualmente.'
          : 'Só campos do subconjunto portátil e Markdown genérico.'
      });
    }

    return { score: score, band: portabilityBand(score), factors: factors };
  }

  SkillHub.builder.validate = {
    DIR_NAME: DIR_NAME,
    DESCRIPTION_LIMIT: DESCRIPTION_LIMIT,
    step: step,
    all: all,
    validatedKeys: validatedKeys,
    invalidStepKeys: invalidStepKeys,
    riskScore: riskScore,
    portabilityScore: portabilityScore,
    portabilityBand: portabilityBand,
    hasShellInjection: hasShellInjection,
    byteLength: byteLength
  };
})(window.SkillHub);
