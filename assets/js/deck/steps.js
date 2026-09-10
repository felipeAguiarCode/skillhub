/* ==========================================================================
   deck/steps.js — SkillHub.deck.steps

   O conteúdo da apresentação, como dado. Nenhuma lógica de câmera aqui.

   Dois níveis:

   - QUADRO (`frames`) — uma caixa posicionada no canvas, na grade col/row. O
     quadro tem o tamanho da área útil, então enquadrá-lo inteiro dá escala 1.
   - PASSO (`steps`) — o que a câmera enquadra e o que a legenda diz. Vários
     passos podem compartilhar um quadro: o capítulo da anatomia são sete passos
     descendo por um único arquivo.

   Um passo aponta para `frame` e, opcionalmente, para `target` — o valor de um
   `data-target` dentro daquele quadro. É assim que "dar zoom na linha
   allowed-tools" funciona sem coordenada digitada à mão.

   Copy em pt-BR. As frases entre aspas vêm de formats.js, builder/steps.js,
   pages/detail.js e docs/SKILL_BUILDER_SPEC.md — são a explicação que o app já
   dá, e não uma versão paralela dela.
   ========================================================================== */

window.SkillHub.deck = window.SkillHub.deck || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var ui = SkillHub.ui;

  /* O arquivo de estudo. Lido do catálogo em runtime, nunca copiado para cá: se
     a entrada mudar, a apresentação acompanha. */
  var EXAMPLE_ID = 'api-reviewer';

  var CHAPTERS = {
    opening: 'Abertura',
    problem: 'O problema',
    definition: 'A definição',
    anatomy: 'Anatomia do SKILL.md',
    trigger: 'Como ela é acionada',
    judgement: 'Julgamento',
    closing: 'Fecho'
  };

  /* --- Peças de conteúdo ---------------------------------------------------- */

  function title(text) {
    return el('h2', { class: 'deck__title' }, text);
  }

  function lead(text) {
    return el('p', { class: 'deck__lead' }, text);
  }

  function body(paragraphs) {
    return el('div', { class: 'deck__body' }, paragraphs.map(function (part) {
      return Array.isArray(part) ? el('p', null, part) : el('p', null, part);
    }));
  }

  function panel(options) {
    return el('div', {
      class: 'deck__panel' + (options.accent ? ' deck__panel--accent' : ''),
      dataset: options.target ? { target: options.target } : null
    }, [
      el('h3', { class: 'deck__panel-title' }, options.title),
      el('p', { class: 'deck__panel-copy' }, options.copy)
    ]);
  }

  function grid(children) {
    return el('div', { class: 'deck__grid' }, children);
  }

  /* --- O arquivo, com um nó por linha e grupos por TEXTO -------------------- */

  /**
   * Descobre a que grupo cada linha pertence, lendo o conteúdo — nunca índices.
   *
   * Índice fixo ("linhas 5 a 8") descolaria do arquivo na primeira edição do
   * catálogo, e a câmera passaria a enquadrar o trecho errado sem nenhum sinal
   * de erro. Casar por texto sobrevive a inserção, remoção e reordenação.
   */
  function groupOf(line, state) {
    var fenceCount = state.fences;

    if (line.trim() === '---') {
      state.fences += 1;
      /* As duas cercas pertencem ao frontmatter. */
      return state.fences <= 2 ? 'frontmatter' : null;
    }
    /* Depois da segunda cerca começa o corpo em Markdown. */
    if (fenceCount >= 2) return 'body';

    if (/^name:/.test(line)) return 'name';
    if (/^description:/.test(line)) return 'description';
    if (/^when_to_use:/.test(line)) return 'when_to_use';
    if (/^allowed-tools:/.test(line)) return 'tools';
    /* Item de lista YAML continua o grupo aberto — é o que mantém as três
       ferramentas dentro do alvo de `allowed-tools`. */
    if (/^\s+-\s/.test(line) && state.open === 'tools') return 'tools';
    /* Continuação indentada de um valor longo (uma description que quebra). */
    if (/^\s+\S/.test(line) && state.open) return state.open;

    return 'frontmatter';
  }

  function lineNode(text) {
    return el('span', {
      class: 'deck__line' + (text.length ? '' : ' deck__line--blank')
    }, text.length ? text : '');
  }

  /**
   * O arquivo como sequência de grupos. Cada grupo é um nó, então a câmera mede
   * UM retângulo e o realce usa o mesmo nó — sem união de intervalos.
   */
  function codeNode(content) {
    var lines = String(content).split('\n');
    var state = { fences: 0, open: null };
    var children = [];
    var currentGroup = null;
    var currentNode = null;

    lines.forEach(function (line) {
      var group = groupOf(line, state);
      state.open = group === 'frontmatter' || group === 'body' ? null : group;

      if (group && group === currentGroup) {
        currentNode.appendChild(lineNode(line));
        return;
      }
      currentGroup = group;
      if (!group) {
        currentNode = null;
        children.push(lineNode(line));
        return;
      }
      currentNode = el('span', {
        class: 'deck__group',
        dataset: { group: group, target: group },
        'data-focus': 'false'
      }, lineNode(line));
      children.push(currentNode);
    });

    /* <pre> simples de propósito: ui.codeBox põe tabindex no <pre> (um ponto de
       foco dentro de um quadro) e limita a altura a 460px, o que cortaria o
       arquivo e faria a câmera voar para uma região vazia. */
    return el('pre', { class: 'deck__code' }, children);
  }

  /* --- Quadros -------------------------------------------------------------- */

  /**
   * A grade do canvas. O caminho da câmera é deliberado: começa na capa à
   * esquerda, atravessa o problema, desce para a definição, volta à esquerda
   * para o arquivo, varre o acionamento para a direita e sobe para o julgamento.
   *
   *        col 0        col 1        col 2         col 3
   * row 0  capa         problema     custo         risco
   * row 1  definição    o-que-não-é  três          vale-a-pena
   * row 2  ARQUIVO      gatilhos     interruptores instalação
   * row 3  (arquivo)    fecho
   */
  function frames(item, counts) {
    return [
      {
        id: 'cover',
        col: 0, row: 0, hero: true,
        build: function () {
          return [
            ui.eyebrow('Skill Hub · 20 passos'),
            title('O que é uma Skill?'),
            lead('E por que escrever uma muda o jeito de trabalhar com o Claude Code.'),
            el('p', { class: 'u-faint u-sm' },
              'Use as setas, o espaço, a roda do mouse ou os botões abaixo. A tecla O mostra o mapa.')
          ];
        }
      },
      {
        id: 'problem',
        col: 1, row: 0,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.problem),
            title('Você já escreveu isso antes.'),
            body([
              'Toda vez que pede uma revisão de API, você redigita o mesmo critério: confira o path e o método, os campos obrigatórios, os códigos de status, a paginação, o escopo de autenticação.'
            ]),
            panel({
              target: 'prompt',
              title: 'Colado no chat, pela terceira vez esta semana',
              copy: '"Revise essa mudança de API. Compare com a forma anterior: path, método, campos obrigatórios e tipos, status e envelope de erro, paginação, escopo de auth. Classifique cada mudança como breaking, aditiva ou interna. Para cada breaking, diga qual consumidor quebra."'
            })
          ];
        }
      },
      {
        id: 'cost',
        col: 2, row: 0,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.problem),
            title('O custo não é o tempo de digitar.'),
            grid([
              panel({ title: 'Cada um inventa o seu', copy: 'Duas pessoas pedem a mesma revisão e recebem critérios diferentes. A qualidade passa a depender de quem pediu.' }),
              panel({ title: 'Nada disso entra em revisão', copy: 'O critério vive no histórico de chat. Ninguém revisa, ninguém corrige, ninguém herda.' }),
              panel({ title: 'Some quando você sai', copy: 'Conhecimento do projeto que não está no projeto é conhecimento que vaza pela porta.' })
            ])
          ];
        }
      },
      {
        id: 'definition',
        col: 0, row: 1,
        build: function () {
          var spec = SkillHub.formats.get('claude-skill');
          return [
            ui.eyebrow(CHAPTERS.definition),
            title('Uma Skill é esse procedimento, escrito num arquivo.'),
            el('p', { class: 'deck__lead' }, spec.summary),
            el('p', { class: 'u-faint u-sm' },
              'A definição é a do próprio Skill Hub, em assets/js/formats.js — a mesma que o builder mostra no primeiro passo.')
          ];
        }
      },
      {
        id: 'notwhat',
        col: 1, row: 1,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.definition),
            title('O que ela não é.'),
            grid([
              panel({ title: 'Não é plugin', copy: 'Não há API para chamar, nem ciclo de vida, nem instalação de código.' }),
              panel({ title: 'Não é código que roda', copy: 'É texto que o agente lê. O Skill Hub, inclusive, nunca executa esse conteúdo — só exibe, copia e exporta.' }),
              panel({ title: 'Não é memória', copy: 'Não guarda o que aconteceu antes. Descreve como fazer, não o que já foi feito.' }),
              panel({ title: 'Não é treino do modelo', copy: 'Nada é ajustado. O arquivo entra no contexto quando a situação aparece.' })
            ])
          ];
        }
      },
      {
        id: 'three',
        col: 2, row: 1,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.definition),
            title('Toda Skill responde três perguntas.'),
            grid([
              panel({ accent: true, title: '1 · Quando usar', copy: 'Em que situação este procedimento serve — e em que situação não serve.' }),
              panel({ accent: true, title: '2 · O que pode usar', copy: 'Quais ferramentas ficam pré-aprovadas enquanto a Skill está ativa.' }),
              panel({ accent: true, title: '3 · O que fazer', copy: 'O procedimento em si, em instruções imperativas e curtas.' })
            ]),
            el('p', { class: 'u-faint u-sm' },
              'As três viram, respectivamente, a description, o allowed-tools e o corpo do arquivo.')
          ];
        }
      },
      {
        id: 'code',
        col: 0, row: 2, spanY: 1.75,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.anatomy),
            el('div', { class: 'u-row u-row--between' }, [
              el('h2', { class: 'deck__title' }, item.name),
              ui.badge(item.id + '/SKILL.md', 'info', 'file')
            ]),
            codeNode(item.content)
          ];
        }
      },
      {
        id: 'triggers',
        col: 1, row: 2,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.trigger),
            title('Dois caminhos até ela.'),
            grid([
              panel({ title: 'Você chama', copy: 'Digita /api-reviewer. O nome do diretório virou o comando.' }),
              panel({ title: 'O modelo chama', copy: 'Ele lê a description das Skills disponíveis e decide sozinho que esta serve para o que você pediu.' })
            ]),
            el('p', { class: 'deck__body' },
              'O segundo caminho é o que muda o dia a dia: você pede "revisa essa API" com suas palavras, e o procedimento entra sem você lembrar que ele existe.')
          ];
        }
      },
      {
        id: 'switches',
        col: 2, row: 2,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.trigger),
            title('E dois interruptores.'),
            grid([
              panel({ title: 'disable-model-invocation: true', copy: 'Desliga o acionamento automático. A Skill passa a existir só quando você a chama pelo nome.' }),
              panel({ title: 'user-invocable: false', copy: 'Tira do menu de comandos. Sobra o acionamento automático, para procedimentos que ninguém precisa invocar à mão.' })
            ]),
            ui.notice({
              icon: 'alert',
              strong: 'Desligar os dois deixa a Skill inalcançável.',
              copy: 'O builder emite um aviso forte nesse caso: o arquivo continua válido, mas nenhum fluxo normal chega até ele.'
            })
          ];
        }
      },
      {
        id: 'install',
        col: 3, row: 2,
        build: function () {
          var paths = SkillHub.formats.installPaths('claude-skill', item.id);
          return [
            ui.eyebrow(CHAPTERS.trigger),
            title('Onde o arquivo mora.'),
            /* O contrato de installPaths é { key, value, hint }: ler label/path
               renderizava dt/dd vazios, sem erro de console. */
            ui.metaList(paths.map(function (row) {
              return { key: row.key, value: row.value };
            })),
            el('p', { class: 'deck__body' }, [
              'A primeira linha é a que importa para um time: dentro do repositório, o critério passa a ser versionado, entra em pull request e vale para quem clonar.'
            ]),
            ui.notice({
              strong: 'Instalar é uma ação sua.',
              copy: 'O Skill Hub baixa e copia arquivos, mas nunca escreve nesses caminhos nem instala nada na sua máquina.'
            })
          ];
        }
      },
      {
        id: 'worth',
        col: 3, row: 1,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.judgement),
            title('Quando vale a pena.'),
            grid([
              panel({
                accent: true,
                title: 'Vale',
                copy: 'Quando há repetição, existe um critério de qualidade que dá para escrever, e o conhecimento é do projeto — não do mundo.'
              }),
              panel({
                title: 'Não vale',
                copy: 'Tarefa única. Algo que cabe numa frase no chat. Ou uma Skill que só repete o que o modelo já faz por padrão.'
              })
            ]),
            el('p', { class: 'deck__body' },
              'O teste rápido: se você não conseguir escrever o critério de aceite, ainda não é uma Skill — é uma intenção.')
          ];
        }
      },
      {
        id: 'risk',
        col: 3, row: 0,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.judgement),
            title('E o que pesa no risco.'),
            body([
              'Uma Skill que só lê arquivos é uma coisa. Uma que pré-aprova shell, anexa scripts, injeta saída de comando no corpo, declara hooks ou roda em contexto isolado é outra — e quem instalar aceita tudo isso junto.'
            ]),
            grid([
              panel({ title: 'Baixo', copy: 'Esta Skill: três ferramentas de leitura, nada de shell, nada de script.' }),
              panel({ title: 'Elevado', copy: 'Bash pré-aprovado, script no pacote, hooks, ou !`comando` no corpo rodando a cada invocação.' })
            ]),
            ui.notice({
              icon: 'shield',
              strong: 'O score é heurístico e sempre explica os fatores.',
              copy: 'Ele não afirma que o conteúdo é seguro. Revise o arquivo antes de instalar — é texto de terceiros.'
            })
          ];
        }
      },
      {
        id: 'outro',
        col: 1, row: 3,
        build: function () {
          return [
            ui.eyebrow(CHAPTERS.closing),
            title('Agora escolha um caminho.'),
            grid([
              panel({
                accent: true,
                title: 'Escrever a sua',
                copy: 'O Skill Builder pergunta a ferramenta, valida o nome, mostra o arquivo sendo gerado e explica cada aviso.'
              }),
              panel({
                title: 'Ler as que já existem',
                copy: counts.claude + ' Skills de Claude Code no catálogo, cada uma com o SKILL.md completo, os fatores de risco e os caminhos de instalação.'
              })
            ]),
            el('div', { class: 'deck__actions' }, [
              ui.button({
                label: 'Abrir o Skill Builder', variant: 'primary',
                iconAfter: 'arrow-right', href: '#/skill-builder'
              }),
              ui.button({
                label: 'Ver as ' + counts.claude + ' Skills do catálogo', variant: 'secondary',
                iconAfter: 'arrow-right', href: '#/claude-skills'
              })
            ]),
            el('p', { class: 'u-faint u-sm' }, 'A tecla Esc sai da apresentação.')
          ];
        }
      }
    ];
  }

  /* --- Passos --------------------------------------------------------------- */

  /**
   * Os 20 passos. `kMin` existe para os planos de conjunto: enquadrar o arquivo
   * inteiro é de propósito ilegível — é um plano de estabelecimento, e a legenda
   * diz o que se está olhando. Todo passo que carrega informação no próprio
   * quadro enquadra algo que fecha em escala 1.
   */
  function steps() {
    return [
      { id: 'cover', chapter: CHAPTERS.opening, frame: 'cover',
        caption: 'Uma apresentação de 20 passos sobre o que é uma Skill do Claude Code, para que serve e como o arquivo é feito.' },

      { id: 'repeat', chapter: CHAPTERS.problem, frame: 'problem',
        caption: 'Antes de definir o que é: o incômodo que faz alguém escrever a primeira.' },
      { id: 'repeat-zoom', chapter: CHAPTERS.problem, frame: 'problem', target: 'prompt',
        caption: 'Olhe o que está colado aí. Isso não é uma pergunta — é um procedimento, com passos e critério de aceite.' },
      { id: 'cost', chapter: CHAPTERS.problem, frame: 'cost',
        caption: 'O problema não é redigitar. É que o procedimento não existe em lugar nenhum que o time possa ver, revisar ou herdar.' },

      { id: 'definition', chapter: CHAPTERS.definition, frame: 'definition', rotate: -1.5,
        caption: 'Duas partes: o frontmatter, que diz quando usar e o que pode usar; e o corpo, que diz o que fazer.' },
      { id: 'notwhat', chapter: CHAPTERS.definition, frame: 'notwhat',
        caption: 'Quatro coisas que uma Skill não é. A confusão mais comum é a segunda.' },
      { id: 'three', chapter: CHAPTERS.definition, frame: 'three',
        caption: 'Se você souber responder estas três perguntas, já sabe escrever o arquivo. O resto é sintaxe.' },

      { id: 'file-whole', chapter: CHAPTERS.anatomy, frame: 'code', kMin: 0.18,
        caption: 'Uma Skill real do catálogo, inteira. Trinta e sete linhas — e a maior parte é o procedimento em português claro, não configuração.' },
      { id: 'fence', chapter: CHAPTERS.anatomy, frame: 'code', target: 'frontmatter',
        caption: 'O frontmatter começa na linha 1, entre três hifens. Se não começar ali, o arquivo é só um Markdown comum e nada disso vale.' },
      { id: 'name', chapter: CHAPTERS.anatomy, frame: 'code', target: 'name',
        caption: 'name vira o comando: /api-reviewer. Lowercase e kebab-case, porque é isso que o menu de comandos aceita.' },
      { id: 'description', chapter: CHAPTERS.anatomy, frame: 'code', target: 'description',
        caption: 'O campo mais importante do arquivo. É lendo esta frase que o modelo decide sozinho se a Skill serve para o que você pediu.' },
      { id: 'when', chapter: CHAPTERS.anatomy, frame: 'code', target: 'when_to_use',
        caption: 'Gatilhos extras, além da description. É o que ajuda a escolher entre duas Skills parecidas.' },
      { id: 'tools', chapter: CHAPTERS.anatomy, frame: 'code', target: 'tools',
        caption: 'Pré-aprovadas: rodam sem novo pedido de permissão no turno que invoca a Skill. Aqui só há leitura — por isso o risco é baixo.' },
      { id: 'body', chapter: CHAPTERS.anatomy, frame: 'code', target: 'body', kMin: 0.3,
        caption: 'O corpo é o procedimento. Instruções imperativas e curtas; material extenso vai para arquivos auxiliares, e o SKILL.md fica abaixo de 500 linhas.' },

      { id: 'two-ways', chapter: CHAPTERS.trigger, frame: 'triggers',
        caption: 'Escrito o arquivo, ele entra em cena por dois caminhos — e o segundo é o que faz diferença no dia a dia.' },
      { id: 'switches', chapter: CHAPTERS.trigger, frame: 'switches',
        caption: 'Dois campos opcionais controlam esses caminhos. Desligar os dois é o erro que o builder avisa em vermelho.' },
      { id: 'install', chapter: CHAPTERS.trigger, frame: 'install', rotate: 1.5,
        caption: 'Quatro lugares possíveis. A escolha entre projeto e pessoal é a escolha entre um critério do time e um hábito seu.' },

      { id: 'worth', chapter: CHAPTERS.judgement, frame: 'worth',
        caption: 'Nem toda repetição merece um arquivo. Três condições juntas justificam uma Skill; faltando uma, não.' },
      { id: 'risk', chapter: CHAPTERS.judgement, frame: 'risk',
        caption: 'Instalar uma Skill é aceitar as permissões que ela declara. Vale ler o frontmatter antes, como se leria um script.' },

      { id: 'outro', chapter: CHAPTERS.closing, frame: 'outro',
        caption: 'Fim. Escreva a sua no builder, ou leia as do catálogo para ver como outras pessoas resolveram o mesmo problema.' }
    ];
  }

  SkillHub.deck.steps = {
    EXAMPLE_ID: EXAMPLE_ID,
    CHAPTERS: CHAPTERS,
    frames: frames,
    steps: steps,
    codeNode: codeNode
  };
})(window.SkillHub);
