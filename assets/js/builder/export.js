/* ==========================================================================
   builder/export.js — SkillHub.builder.export

   Copiar, baixar o arquivo de entrada e baixar o ZIP quando o formato tem um
   diretório. O nome do arquivo vem do formato, não é fixo em SKILL.md.

   Nada é exportado com erro bloqueante pendente; avisos não bloqueiam, porque
   descrevem escolhas legítimas (SKILL_BUILDER_SPEC §6 / Gate 5).
   ========================================================================== */

window.SkillHub.builder = window.SkillHub.builder || {};

(function (SkillHub) {
  'use strict';

  /** Devolve true quando pode seguir; caso contrário avisa e interrompe. */
  function guard(model) {
    var validation = SkillHub.builder.validate.all(model);
    if (!validation.blocking.length) return true;
    SkillHub.toast.show(validation.blocking[0], 'error');
    return false;
  }

  function copyContent(model) {
    var serialize = SkillHub.builder.serialize;
    var content = serialize.buildSkillMarkdown(model);
    if (!content.trim()) {
      SkillHub.toast.show('Não há conteúdo para copiar: o arquivo está vazio.', 'warning');
      return;
    }
    SkillHub.clipboard.copy(content, serialize.entryFileName(model) + ' copiado.');
  }

  function downloadContent(model) {
    if (!guard(model)) return;
    var serialize = SkillHub.builder.serialize;
    var file = serialize.entryFileName(model);
    SkillHub.download.textFile(file, serialize.buildSkillMarkdown(model));
    SkillHub.toast.show(file + ' baixado.', 'success');
  }

  function copyTree(model) {
    var lines = SkillHub.builder.serialize.buildFileTree(model);
    SkillHub.clipboard.copy(lines.join('\n'), 'Estrutura copiada.');
  }

  /**
   * ZIP com o diretório raiz preservado: my-skill/SKILL.md, my-skill/scripts/...
   * (SKILL_BUILDER_SPEC §13). Só existe para formatos com diretório.
   */
  function downloadZip(model) {
    if (!guard(model)) return;

    var serialize = SkillHub.builder.serialize;
    if (!serialize.supportsZip(model)) {
      SkillHub.toast.show('Este formato é um arquivo único: não há pacote a compactar.', 'info');
      return;
    }

    var root = serialize.skillDirName(model);
    var files = serialize.packageFiles(model).map(function (file) {
      return { path: root + '/' + file.path, content: file.content };
    });

    var blob;
    try {
      blob = SkillHub.zip.create(files);
    } catch (error) {
      SkillHub.toast.show('Não foi possível gerar o ZIP: ' + error.message, 'error');
      return;
    }

    SkillHub.download.blob(serialize.zipFileName(model), blob);
    SkillHub.toast.show(
      serialize.zipFileName(model) + ' baixado com ' + files.length + ' ' +
      SkillHub.util.pluralize(files.length, 'arquivo', 'arquivos') + '.',
      'success'
    );
  }

  SkillHub.builder.export = {
    copyContent: copyContent,
    downloadContent: downloadContent,
    downloadZip: downloadZip,
    copyTree: copyTree
  };
})(window.SkillHub);
