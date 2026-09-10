/* Gera assets/js/data/coding-styles.js e data/coding-styles-extra.js a partir
   dos guias em ~/.claude/coding-styles/. Byte a byte: o texto não é redigitado. */
'use strict';
const fs = require('fs');
const path = require('path');

/* Os guias moram fora do repositório de propósito: valem entre projetos.
   Sobrescreva com CODING_STYLES_DIR se a pasta estiver em outro lugar. */
const STYLES_DIR = process.env.CODING_STYLES_DIR ||
  path.join(require('node:os').homedir(), '.claude', 'coding-styles');
const DATA_DIR = path.join(__dirname, '..', 'assets', 'js', 'data');
const ICONS_FILE = path.join(__dirname, '..', 'assets', 'js', 'icons.js');

/* Chaves de área, na ordem em que a vitrine agrupa. pages/coding-styles.js tem
   a mesma lista com os rótulos; aqui só a chave é validada. */
const AREAS = ['backend', 'frontend', 'mobile', 'data', 'infra'];
const DEPTHS = ['full', 'essential'];

/* Um arquivo de saída por profundidade. Num arquivo só, vinte guias dariam
   doze mil linhas — e aqui nenhum arquivo de dado é grande demais para ler de
   uma vez. A ordem entre eles não importa: ambos fazem concat. */
const OUTPUTS = [
  { depth: 'full', file: 'coding-styles.js' },
  { depth: 'essential', file: 'coding-styles-extra.js' }
];

/* Metadados por guia. O texto vem do arquivo; só isto é escrito à mão. */
const GUIDES = [
  {
    id: 'node-typescript',
    file: 'node-typescript.md',
    title: 'Node.js + TypeScript',
    area: 'backend',
    depth: 'full',
    family: 'node-typescript',
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
    area: 'frontend',
    depth: 'full',
    family: 'vanilla-web',
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
    area: 'frontend',
    depth: 'full',
    family: 'react-typescript',
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
    area: 'backend',
    depth: 'full',
    family: 'python',
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
    area: 'data',
    depth: 'full',
    family: 'sql-postgres',
    summary: 'Schema, consultas e migrações: naming, escolha de tipo, restrição no banco, ordem de coluna em índice, transação curta e mudança em três fases.',
    icon: 'database',
    tags: ['schema', 'índices', 'migrações'],
    stack: ['PostgreSQL', 'SQL'],
    updatedAt: '2026-09-09'
  },
  {
    id: 'node-typescript-essential',
    file: 'node-typescript-essential.md',
    title: 'Node.js + TypeScript',
    area: 'backend',
    depth: 'essential',
    family: 'node-typescript',
    summary: 'As regras que mais mudam decisão, condensadas: paradigma funcional, prefixo como contrato, types sem any, Promise.all e erro de domínio com código.',
    icon: 'server',
    tags: ['referência', 'funcional', 'types'],
    stack: ['Node.js', 'TypeScript'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'vanilla-web-essential',
    file: 'vanilla-web-essential.md',
    title: 'Vanilla Web',
    area: 'frontend',
    depth: 'essential',
    family: 'vanilla-web',
    summary: 'O cartão de referência da stack sem build: namespace único, ordem de script, zero innerHTML, estado fora do DOM e teardown de listener.',
    icon: 'panel',
    tags: ['referência', 'sem build', 'dom'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'react-typescript-essential',
    file: 'react-typescript-essential.md',
    title: 'React + TypeScript',
    area: 'frontend',
    depth: 'essential',
    family: 'react-typescript',
    summary: 'O essencial de componente: ordem estável de hooks, nada de estado derivado, useEffect só para o mundo externo e key por identidade.',
    icon: 'layers',
    tags: ['referência', 'hooks', 'componentes'],
    stack: ['React', 'TypeScript'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'python-essential',
    file: 'python-essential.md',
    title: 'Python',
    area: 'backend',
    depth: 'essential',
    family: 'python',
    summary: 'O essencial de PEP 8 e do resto: dataclass congelado, type hints modernos, sem default mutável, Decimal para dinheiro e datetime com timezone.',
    icon: 'flask',
    tags: ['referência', 'pep 8', 'type hints'],
    stack: ['Python'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'sql-postgres-essential',
    file: 'sql-postgres-essential.md',
    title: 'SQL + PostgreSQL',
    area: 'data',
    depth: 'essential',
    family: 'sql-postgres',
    summary: 'O essencial de schema e consulta: timestamptz, numeric para dinheiro, nunca concatenar SQL, is null, transação sem rede e mudança em três fases.',
    icon: 'database',
    tags: ['referência', 'schema', 'índices'],
    stack: ['PostgreSQL', 'SQL'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'java-spring',
    file: 'java-spring.md',
    title: 'Java + Spring',
    area: 'backend',
    depth: 'full',
    family: 'java-spring',
    summary: 'record para dado, Optional só no retorno, injeção por construtor, controller sem regra, entidade JPA fora da fronteira HTTP e BigDecimal para dinheiro.',
    icon: 'package',
    tags: ['record', 'jpa', 'rest'],
    stack: ['Java', 'Spring Boot'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'java-spring-essential',
    file: 'java-spring-essential.md',
    title: 'Java + Spring',
    area: 'backend',
    depth: 'essential',
    family: 'java-spring',
    summary: 'O essencial: record, Optional como retorno, construtor em vez de @Autowired, LAZY com join fetch e transação que não espera a rede.',
    icon: 'package',
    tags: ['referência', 'record', 'jpa'],
    stack: ['Java', 'Spring Boot'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'csharp-dotnet',
    file: 'csharp-dotnet.md',
    title: 'C# + .NET',
    area: 'backend',
    depth: 'full',
    family: 'csharp-dotnet',
    summary: 'Naming da Microsoft, record e sealed, nullable ligado, async até o topo sem .Result, CancellationToken propagado, EF com AsNoTracking e decimal para dinheiro.',
    icon: 'hexagon',
    tags: ['nullable', 'async', 'ef core'],
    stack: ['C#', '.NET'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'csharp-dotnet-essential',
    file: 'csharp-dotnet-essential.md',
    title: 'C# + .NET',
    area: 'backend',
    depth: 'essential',
    family: 'csharp-dotnet',
    summary: 'O essencial: PascalCase em método e constante, nullable ligado, nada de .Result, throw que preserva o stack e projeção com Select no EF.',
    icon: 'hexagon',
    tags: ['referência', 'nullable', 'async'],
    stack: ['C#', '.NET'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'kotlin-android',
    file: 'kotlin-android.md',
    title: 'Kotlin + Android',
    area: 'mobile',
    depth: 'full',
    family: 'kotlin-android',
    summary: 'data class com val, estado de tela em sealed, zero !!, coroutine com dono, Dispatcher injetado, Compose com estado que sobe e Fragment sem regra.',
    icon: 'zap',
    tags: ['coroutines', 'compose', 'sealed'],
    stack: ['Kotlin', 'Android', 'Compose'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'kotlin-android-essential',
    file: 'kotlin-android-essential.md',
    title: 'Kotlin + Android',
    area: 'mobile',
    depth: 'essential',
    family: 'kotlin-android',
    summary: 'O essencial: val e copy, sealed para estado impossível não ser representável, nenhum GlobalScope, asStateFlow e efeito em LaunchedEffect.',
    icon: 'zap',
    tags: ['referência', 'coroutines', 'compose'],
    stack: ['Kotlin', 'Android', 'Compose'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'bash-shell',
    file: 'bash-shell.md',
    title: 'Bash + Shell',
    area: 'infra',
    depth: 'full',
    family: 'bash-shell',
    summary: 'set -euo pipefail, aspas em toda expansão, mktemp com trap, nunca parsear ls, printf em vez de echo, curl com --fail e shellcheck no CI.',
    icon: 'terminal',
    tags: ['shellcheck', 'quoting', 'trap'],
    stack: ['Bash', 'POSIX sh'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'bash-shell-essential',
    file: 'bash-shell-essential.md',
    title: 'Bash + Shell',
    area: 'infra',
    depth: 'essential',
    family: 'bash-shell',
    summary: 'O essencial: o preâmbulo que não é opcional, quoting sempre, trap EXIT, o glob em vez de ls e curl sem --fail gravando a página de erro.',
    icon: 'terminal',
    tags: ['referência', 'shellcheck', 'quoting'],
    stack: ['Bash', 'POSIX sh'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'docker-ci',
    file: 'docker-ci.md',
    title: 'Docker + CI',
    area: 'infra',
    depth: 'full',
    family: 'docker-ci',
    summary: 'Multi-stage, ordem de camada pelo que muda menos, pin de versão, usuário não-root, segredo fora da camada, CMD em forma exec e permissão mínima no CI.',
    icon: 'cloud',
    tags: ['dockerfile', 'camadas', 'ci'],
    stack: ['Docker', 'Compose', 'GitHub Actions'],
    updatedAt: '2026-09-10'
  },
  {
    id: 'docker-ci-essential',
    file: 'docker-ci-essential.md',
    title: 'Docker + CI',
    area: 'infra',
    depth: 'essential',
    family: 'docker-ci',
    summary: 'O essencial: multi-stage, cache que não invalida à toa, nenhum latest, não-root, segredo fora da imagem e a mesma imagem em todos os ambientes.',
    icon: 'cloud',
    tags: ['referência', 'dockerfile', 'ci'],
    stack: ['Docker', 'Compose', 'GitHub Actions'],
    updatedAt: '2026-09-10'
  }
];

/* --- Validação na fronteira ---------------------------------------------- */

/** Chaves de PATHS em icons.js. Ícone inexistente renderiza sparkle calado. */
function iconKeys() {
  const src = fs.readFileSync(ICONS_FILE, 'utf8');
  const body = src.slice(src.indexOf('var PATHS = {'), src.indexOf('var FALLBACK'));
  return [...body.matchAll(/^ {4}'?([a-z][a-z0-9-]*)'?:\s*\[/gm)].map((match) => match[1]);
}

function validate() {
  const icons = iconKeys();
  const problems = [];
  const seenId = new Set();
  const seenVariant = new Set();

  GUIDES.forEach((guide) => {
    const where = guide.id || guide.file || '(sem id)';
    if (seenId.has(guide.id)) problems.push(where + ': id repetido');
    seenId.add(guide.id);

    if (!AREAS.includes(guide.area)) {
      problems.push(where + ': area "' + guide.area + '" fora de ' + AREAS.join('|'));
    }
    if (!DEPTHS.includes(guide.depth)) {
      problems.push(where + ': depth "' + guide.depth + '" fora de ' + DEPTHS.join('|'));
    }
    if (!icons.includes(guide.icon)) {
      problems.push(where + ': icon "' + guide.icon + '" não existe em icons.js');
    }
    if (!guide.family) problems.push(where + ': family ausente');

    /* Duas variantes por família no máximo, e nunca duas da mesma
       profundidade — que é o erro de copiar a entrada e esquecer o depth. */
    const variant = guide.family + '/' + guide.depth;
    if (seenVariant.has(variant)) problems.push(where + ': ' + variant + ' duplicado');
    seenVariant.add(variant);

    if (!fs.existsSync(path.join(STYLES_DIR, guide.file))) {
      problems.push(where + ': ' + guide.file + ' não existe em ' + STYLES_DIR);
    }
  });

  if (!problems.length) return;
  problems.forEach((problem) => console.error('ERRO ' + problem));
  console.error('GUIDES inválido — nada foi gravado');
  process.exit(1);
}

/* --- Geração -------------------------------------------------------------- */

function quote(line) {
  return "'" + line.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function readLines(file) {
  const raw = fs.readFileSync(path.join(STYLES_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** Conta as seções como a UI conta: H1 fora de bloco de código. */
function countSections(content) {
  let inFence = false;
  return content.split('\n').filter((line) => {
    if (/^```/.test(line)) { inFence = !inFence; return false; }
    return !inFence && /^#\s+\S/.test(line);
  }).length;
}

function banner(fileName) {
  return [
    '/* ==========================================================================',
    '   data/' + fileName + ' — window.SKILL_HUB_CODING_STYLES',
    '',
    '   ARQUIVO GERADO. Não editar à mão.',
    '',
    '   Os guias de estilo do usuário moram fora do repositório, em',
    '   ~/.claude/coding-styles/. O navegador não lê aquele caminho e o app não faz',
    '   fetch (ADR-004), então o texto entra aqui como dado estático — o mesmo',
    '   tratamento que o catálogo recebe.',
    '',
    '   A coleção é dividida em dois arquivos por profundidade, e cada um faz',
    '   concat: a ordem entre eles não importa, só precisam vir antes de',
    '   catalog.js no index.html.',
    '',
    '   Para regerar depois de editar um guia, ver a seção Coding Styles do',
    '   CLAUDE.md. O conteúdo é idêntico ao arquivo de origem, byte a byte.',
    '   ========================================================================== */',
    '',
    'window.SKILL_HUB_CODING_STYLES = (window.SKILL_HUB_CODING_STYLES || []).concat(['
  ].join('\n');
}

function block(guide) {
  const lines = readLines(guide.file);
  return [
    '  {',
    '    id: ' + quote(guide.id) + ',',
    '    title: ' + quote(guide.title) + ',',
    '    area: ' + quote(guide.area) + ',',
    '    depth: ' + quote(guide.depth) + ',',
    '    family: ' + quote(guide.family) + ',',
    '    summary: ' + quote(guide.summary) + ',',
    '    icon: ' + quote(guide.icon) + ',',
    '    tags: [' + guide.tags.map(quote).join(', ') + '],',
    '    stack: [' + guide.stack.map(quote).join(', ') + '],',
    '    fileName: ' + quote(guide.file) + ',',
    '    source: ' + quote('~/.claude/coding-styles/' + guide.file) + ',',
    '    updatedAt: ' + quote(guide.updatedAt) + ',',
    '    content: ['
  ].concat(lines.map((line, index) => {
    return '      ' + quote(line) + (index === lines.length - 1 ? '' : ',');
  })).concat([
    "    ].join('\\n')",
    '  }'
  ]).join('\n');
}

/* --- Gravação ------------------------------------------------------------- */

validate();

/* Grava em .gen.js, confere o que foi gravado e só então renomeia. A
   conferência precisa carregar o arquivo de verdade, então não dá para checar
   apenas em memória — mas o arquivo final nunca fica divergente no disco. */
const targets = OUTPUTS.map((output) => {
  const guides = GUIDES.filter((guide) => guide.depth === output.depth);
  const final = path.join(DATA_DIR, output.file);
  return {
    final: final,
    temp: final.replace(/\.js$/, '.gen.js'),
    count: guides.length,
    body: banner(output.file) + '\n' + guides.map(block).join(',\n') + '\n]);\n'
  };
});

targets.forEach((target) => fs.writeFileSync(target.temp, target.body));

function discard() {
  targets.forEach((target) => {
    if (fs.existsSync(target.temp)) fs.unlinkSync(target.temp);
  });
}

global.window = {};
try {
  targets.forEach((target) => {
    delete require.cache[require.resolve(target.temp)];
    require(target.temp);
  });
} catch (error) {
  discard();
  console.error('ERRO ao carregar o arquivo gerado: ' + error.message);
  process.exit(1);
}

const loaded = global.window.SKILL_HUB_CODING_STYLES || [];
let ok = loaded.length === GUIDES.length;
if (!ok) {
  console.error('ERRO ' + loaded.length + ' guias carregados, ' + GUIDES.length + ' esperados');
}

loaded.forEach((guide) => {
  const same = guide.content === readLines(guide.fileName).join('\n');
  if (!same) ok = false;
  console.log(guide.id + ' [' + guide.depth + ']: ' + guide.content.length + ' bytes | ' +
    countSections(guide.content) + ' seções | idêntico: ' + same);
});

if (!ok) {
  discard();
  console.error('DIVERGÊNCIA — nada foi gravado');
  process.exit(1);
}

targets.forEach((target) => {
  fs.renameSync(target.temp, target.final);
  console.log(path.basename(target.final) + ': ' + target.count + ' guias');
});
console.log('gerado e conferido');
