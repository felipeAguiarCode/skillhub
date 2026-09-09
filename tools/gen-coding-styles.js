/* Gera assets/js/data/coding-styles.js a partir dos guias em
   ~/.claude/coding-styles/. Byte a byte: o texto não é redigitado. */
'use strict';
const fs = require('fs');
const path = require('path');

/* Os guias moram fora do repositório de propósito: valem entre projetos.
   Sobrescreva com CODING_STYLES_DIR se a pasta estiver em outro lugar. */
const STYLES_DIR = process.env.CODING_STYLES_DIR ||
  path.join(require('node:os').homedir(), '.claude', 'coding-styles');
const OUT = path.join(__dirname, '..', 'assets', 'js', 'data', 'coding-styles.js');

/* Metadados por guia. O texto vem do arquivo; só isto é escrito à mão. */
const GUIDES = [
  {
    id: 'node-typescript',
    file: 'node-typescript.md',
    title: 'Node.js + TypeScript',
    eyebrow: 'Backend',
    summary: 'Naming, cases, funções, types, espaçamento, APIs REST, HTTP, erros e testes. Paradigma funcional: sem class, sem herança, type em vez de interface.',
    icon: 'server',
    tags: ['funcional', 'rest', 'types'],
    stack: ['Node.js', 'TypeScript'],
    updatedAt: '2026-09-09'
  },
  {
    id: 'vanilla-web',
    file: 'vanilla-web.md',
    title: 'Vanilla Web',
    eyebrow: 'Frontend',
    summary: 'HTML, CSS e JavaScript puro, sem build step. Namespace único, ordem de script como dependência, zero innerHTML e CSS em camadas com tokens.',
    icon: 'panel',
    tags: ['sem build', 'dom', 'css'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    updatedAt: '2026-09-09'
  },
  {
    id: 'react-typescript',
    file: 'react-typescript.md',
    title: 'React + TypeScript',
    eyebrow: 'Frontend',
    summary: 'Componente como função, props com union fechada, ordem estável de hooks, nada de estado derivado e useEffect só para sincronizar com o mundo externo.',
    icon: 'layers',
    tags: ['componentes', 'hooks', 'a11y'],
    stack: ['React', 'TypeScript'],
    updatedAt: '2026-09-09'
  },
  {
    id: 'python',
    file: 'python.md',
    title: 'Python',
    eyebrow: 'Backend',
    summary: 'PEP 8 onde ele decide, e decisão onde ele se cala. Função antes de classe, dataclass congelado, type hints modernos, Decimal para dinheiro e datetime com timezone.',
    icon: 'flask',
    tags: ['pep 8', 'type hints', 'dataclass'],
    stack: ['Python'],
    updatedAt: '2026-09-09'
  },
  {
    id: 'sql-postgres',
    file: 'sql-postgres.md',
    title: 'SQL + PostgreSQL',
    eyebrow: 'Dados',
    summary: 'Schema, consultas e migrações: naming, escolha de tipo, restrição no banco, ordem de coluna em índice, transação curta e mudança em três fases.',
    icon: 'database',
    tags: ['schema', 'índices', 'migrações'],
    stack: ['PostgreSQL', 'SQL'],
    updatedAt: '2026-09-09'
  }
];

function quote(line) {
  return "'" + line.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function readLines(file) {
  const raw = fs.readFileSync(path.join(STYLES_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

const header = [
  '/* ==========================================================================',
  '   data/coding-styles.js — window.SKILL_HUB_CODING_STYLES',
  '',
  '   ARQUIVO GERADO. Não editar à mão.',
  '',
  '   Os guias de estilo do usuário moram fora do repositório, em',
  '   ~/.claude/coding-styles/. O navegador não lê aquele caminho e o app não faz',
  '   fetch (ADR-004), então o texto entra aqui como dado estático — o mesmo',
  '   tratamento que o catálogo recebe.',
  '',
  '   Para regerar depois de editar um guia, ver a seção Coding Style do',
  '   CLAUDE.md. O conteúdo é idêntico ao arquivo de origem, byte a byte.',
  '   ========================================================================== */',
  '',
  'window.SKILL_HUB_CODING_STYLES = ['
];

const blocks = GUIDES.map(function (guide) {
  const lines = readLines(guide.file);
  return [
    '  {',
    '    id: ' + quote(guide.id) + ',',
    '    title: ' + quote(guide.title) + ',',
    '    eyebrow: ' + quote(guide.eyebrow) + ',',
    '    summary: ' + quote(guide.summary) + ',',
    '    icon: ' + quote(guide.icon) + ',',
    '    tags: [' + guide.tags.map(quote).join(', ') + '],',
    '    stack: [' + guide.stack.map(quote).join(', ') + '],',
    '    fileName: ' + quote(guide.file) + ',',
    '    source: ' + quote('~/.claude/coding-styles/' + guide.file) + ',',
    '    updatedAt: ' + quote(guide.updatedAt) + ',',
    '    content: ['
  ].concat(lines.map(function (line, index) {
    return '      ' + quote(line) + (index === lines.length - 1 ? '' : ',');
  })).concat([
    "    ].join('\\n')",
    '  }'
  ]).join('\n');
});

fs.writeFileSync(OUT, header.join('\n') + '\n' + blocks.join(',\n') + '\n];\n');

/* Confere fidelidade carregando o que acabou de ser escrito. */
global.window = {};
delete require.cache[require.resolve(OUT)];
require(OUT);
let ok = true;
global.window.SKILL_HUB_CODING_STYLES.forEach(function (guide) {
  const expected = readLines(guide.fileName).join('\n');
  const same = guide.content === expected;
  if (!same) ok = false;
  console.log(guide.id + ': ' + guide.content.length + ' bytes | ' +
    (guide.content.match(/^# /gm) || []).length + ' seções | idêntico: ' + same);
});
console.log(ok ? 'gerado e conferido' : 'DIVERGÊNCIA — não usar');
process.exit(ok ? 0 : 1);
