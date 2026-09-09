/* ==========================================================================
   zip.js — SkillHub.zip

   Writer ZIP em JavaScript puro, sem dependência externa (ADR-012).
   Método 0 (store, sem compressão), permitido pela SKILL_BUILDER_SPEC §13 e
   suficiente para arquivos de texto.

   Cuidados que fazem o arquivo abrir no Explorer do Windows e no Archive
   Utility do macOS:
   - CRC e tamanhos calculados sobre os BYTES UTF-8, nunca sobre string.length;
   - bit 11 do general purpose flag ligado, sinalizando nome em UTF-8;
   - bit 3 (data descriptor) nunca ligado: os tamanhos são conhecidos antes;
   - entradas de diretório explícitas, terminadas em "/", com CRC e tamanho 0;
   - external attributes com 0x10 nos diretórios;
   - tudo little-endian.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};

(function (SkillHub) {
  'use strict';

  var LOCAL_SIGNATURE = 0x04034b50;
  var CENTRAL_SIGNATURE = 0x02014b50;
  var END_SIGNATURE = 0x06054b50;
  var VERSION = 20;
  var FLAG_UTF8 = 0x0800;
  var METHOD_STORE = 0;
  var MAX_ENTRIES = 65535;
  var MAX_SIZE = 0xffffffff;

  var crcTable = null;

  function buildCrcTable() {
    var table = new Int32Array(256);
    for (var i = 0; i < 256; i += 1) {
      var value = i;
      for (var bit = 0; bit < 8; bit += 1) {
        value = (value & 1) ? ((value >>> 1) ^ 0xedb88320) : (value >>> 1);
      }
      table[i] = value;
    }
    return table;
  }

  function crc32(bytes) {
    if (!crcTable) crcTable = buildCrcTable();
    var crc = -1;
    for (var i = 0; i < bytes.length; i += 1) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  var encoder = new TextEncoder();

  function encode(text) {
    return encoder.encode(String(text === null || text === undefined ? '' : text));
  }

  /* --- Data e hora no formato DOS ------------------------------------------ */

  function dosTime(date) {
    return ((date.getHours() & 0x1f) << 11) |
           ((date.getMinutes() & 0x3f) << 5) |
           ((Math.floor(date.getSeconds() / 2)) & 0x1f);
  }

  function dosDate(date) {
    var year = Math.max(1980, date.getFullYear());
    return (((year - 1980) & 0x7f) << 9) |
           (((date.getMonth() + 1) & 0x0f) << 5) |
           (date.getDate() & 0x1f);
  }

  /* --- Normalização de caminhos -------------------------------------------- */

  function normalize(path) {
    return String(path).replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/{2,}/g, '/');
  }

  /**
   * Expande os diretórios implícitos de cada caminho. Sem estas entradas, o
   * Explorer do Windows costuma abrir o ZIP como se estivesse vazio.
   */
  function withDirectories(files) {
    var seen = Object.create(null);
    var entries = [];

    files.forEach(function (file) {
      var path = normalize(file.path);
      var segments = path.split('/');
      var prefix = '';
      for (var i = 0; i < segments.length - 1; i += 1) {
        prefix += segments[i] + '/';
        if (!seen[prefix]) {
          seen[prefix] = true;
          entries.push({ path: prefix, directory: true, bytes: new Uint8Array(0) });
        }
      }
      if (seen[path]) return;
      seen[path] = true;
      entries.push({ path: path, directory: false, bytes: encode(file.content) });
    });

    return entries;
  }

  /* --- Registros ----------------------------------------------------------- */

  function localHeader(entry, time, date) {
    var name = encode(entry.path);
    var buffer = new ArrayBuffer(30 + name.length);
    var view = new DataView(buffer);

    view.setUint32(0, LOCAL_SIGNATURE, true);
    view.setUint16(4, VERSION, true);
    view.setUint16(6, FLAG_UTF8, true);
    view.setUint16(8, METHOD_STORE, true);
    view.setUint16(10, time, true);
    view.setUint16(12, date, true);
    view.setUint32(14, entry.crc, true);
    view.setUint32(18, entry.bytes.length, true);
    view.setUint32(22, entry.bytes.length, true);
    view.setUint16(26, name.length, true);
    view.setUint16(28, 0, true);

    var bytes = new Uint8Array(buffer);
    bytes.set(name, 30);
    return bytes;
  }

  function centralHeader(entry, time, date) {
    var name = encode(entry.path);
    var buffer = new ArrayBuffer(46 + name.length);
    var view = new DataView(buffer);

    view.setUint32(0, CENTRAL_SIGNATURE, true);
    view.setUint16(4, VERSION, true);
    view.setUint16(6, VERSION, true);
    view.setUint16(8, FLAG_UTF8, true);
    view.setUint16(10, METHOD_STORE, true);
    view.setUint16(12, time, true);
    view.setUint16(14, date, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.bytes.length, true);
    view.setUint32(24, entry.bytes.length, true);
    view.setUint16(28, name.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, entry.directory ? 0x10 : 0, true);
    view.setUint32(42, entry.offset, true);

    var bytes = new Uint8Array(buffer);
    bytes.set(name, 46);
    return bytes;
  }

  function endRecord(count, size, offset) {
    var buffer = new ArrayBuffer(22);
    var view = new DataView(buffer);

    view.setUint32(0, END_SIGNATURE, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, count, true);
    view.setUint16(10, count, true);
    view.setUint32(12, size, true);
    view.setUint32(16, offset, true);
    view.setUint16(20, 0, true);

    return new Uint8Array(buffer);
  }

  /* --- API ----------------------------------------------------------------- */

  /**
   * files: [{ path: 'my-skill/SKILL.md', content: '...' }]
   * Devolve um Blob application/zip.
   */
  function create(files) {
    var list = (files || []).filter(function (file) {
      return file && normalize(file.path);
    });
    if (!list.length) throw new Error('Nenhum arquivo para compactar.');

    var entries = withDirectories(list);
    if (entries.length > MAX_ENTRIES) {
      throw new Error('O pacote excede ' + MAX_ENTRIES + ' entradas, limite do formato ZIP básico.');
    }

    var now = new Date();
    var time = dosTime(now);
    var date = dosDate(now);

    var parts = [];
    var offset = 0;

    entries.forEach(function (entry) {
      entry.crc = entry.directory ? 0 : crc32(entry.bytes);
      entry.offset = offset;

      var header = localHeader(entry, time, date);
      parts.push(header);
      offset += header.length;

      if (entry.bytes.length) {
        parts.push(entry.bytes);
        offset += entry.bytes.length;
      }

      if (offset > MAX_SIZE) {
        throw new Error('O pacote excede 4 GB, limite do formato ZIP básico.');
      }
    });

    var centralOffset = offset;
    var centralSize = 0;

    entries.forEach(function (entry) {
      var header = centralHeader(entry, time, date);
      parts.push(header);
      centralSize += header.length;
    });

    parts.push(endRecord(entries.length, centralSize, centralOffset));

    return new Blob(parts, { type: 'application/zip' });
  }

  SkillHub.zip = { create: create, crc32: crc32 };
})(window.SkillHub);
