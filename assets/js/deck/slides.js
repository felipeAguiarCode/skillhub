/* ==========================================================================
   deck/slides.js — SkillHub.deck.slides

   O conteúdo da apresentação como DADO. Zero lógica de movimento: quem anima é
   deck/morph.js, e o que este arquivo faz é dizer o que existe em cada slide e
   quais elementos são "o mesmo objeto" entre slides.

   O contrato do morph é o atributo `data-morph="<chave>"`. A mesma chave em
   dois slides consecutivos faz o elemento VIAJAR de um para o outro; chave só
   num deles faz entrar ou sair. `data-morph-type="text"` pede interpolação de
   font-size em vez de escala: é o que mantém o título nítido enquanto encolhe.

   As chaves em uso, e o caminho que cada uma percorre:

     eyebrow, title  → em todos os slides (a espinha do keynote)
     folder          → capa → estrutura → agente (onde ela se divide em duas)
     pill-skill      → pílula SKILL.md → a code box → o nível 2
     pill-refs       → pílula Arquivos Refs → o nível 3
     pill-scripts    → pílula Scripts → a nota sobre execução
     pill-assets     → pílula Assets → o nível 3

   Duas coisas nunca são escritas à mão aqui, porque já existem em código:
   o SKILL.md de exemplo vem de catalog.byId('api-reviewer') e os caminhos de
   instalação vêm de formats.installPaths(). Copiar qualquer um dos dois criaria
   uma segunda fonte de verdade que só divergiria.
   ========================================================================== */

window.SkillHub = window.SkillHub || {};
window.SkillHub.deck = window.SkillHub.deck || {};

(function (SkillHub) {
  'use strict';

  var el = SkillHub.dom.el;
  var svg = SkillHub.dom.svg;
  var doodles = SkillHub.deck.doodles;

  var EXAMPLE_ID = 'api-reviewer';
  var EYEBROW = 'Skills';

  /* Links oficiais. Conferidos contra as próprias páginas: um link morto numa
     apresentação sobre a documentação seria a pior propaganda possível. */
  var SOURCES = [
    {
      href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
      title: 'Agent Skills: visão geral',
      copy: 'O que é uma Skill, a arquitetura de sistema de arquivos e a divulgação progressiva em três níveis.'
    },
    {
      href: 'https://code.claude.com/docs/en/skills',
      title: 'Skills no Claude Code',
      copy: 'Criar, descobrir e compartilhar Skills no Claude Code, com todos os caminhos de instalação.'
    },
    {
      href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices',
      title: 'Boas práticas de autoria',
      copy: 'Como escrever a description, quanto detalhe dar e por que manter o corpo abaixo de 500 linhas.'
    },
    {
      href: 'https://github.com/anthropics/skills',
      title: 'anthropics/skills',
      copy: 'O repositório público da Anthropic: exemplos, a especificação e um template para começar.'
    },
    {
      href: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
      title: 'Equipping agents with Agent Skills',
      copy: 'O post de engenharia que apresentou o formato, em 16 de outubro de 2025.'
    }
  ];

  /* --- Peças de composição -------------------------------------------------- */

  function eyebrow() {
    return el('span', {
      class: 'eyebrow slide__eyebrow',
      'data-morph': 'eyebrow',
      'data-morph-type': 'text'
    }, EYEBROW);
  }

  function title(text, hero) {
    return el('h2', {
      class: 'slide__title' + (hero ? ' slide__title--hero' : ''),
      'data-morph': 'title',
      'data-morph-type': 'text'
    }, text);
  }

  function lead(text) {
    return el('p', { class: 'slide__lead' }, text);
  }

  function para(text) {
    return el('p', { class: 'slide__para' }, text);
  }

  /** Cartão de borda tracejada, o motivo visual que vem do material de origem. */
  function dashCard(opts) {
    return el('div', {
      class: 'dash-card',
      'data-morph': opts.morph || null,
      'data-build': opts.build || null
    }, opts.children);
  }

  /** Pílula clara sobre o fundo escuro, com a explicação ao lado. */
  function pillRow(opts) {
    return el('div', { class: 'pill-row', 'data-build': opts.build || null }, [
      el('span', {
        class: 'pill',
        'data-morph': opts.morph || null
      }, opts.label),
      opts.doodle ? doodleSlot(opts.doodle, 34, 'slide__doodle--faint') : null,
      el('div', { class: 'pill-row__note' }, [
        el('strong', { class: 'pill-row__title' }, opts.title),
        el('span', { class: 'pill-row__copy' }, opts.copy)
      ])
    ]);
  }

  function folderMark(opts) {
    var options = opts || {};
    return el('div', {
      class: 'folder-mark',
      'data-morph': options.morph || 'folder'
    }, [
      doodles.get('folder', options.size || 64),
      el('span', { class: 'folder-mark__label' }, options.label || 'Skills')
    ]);
  }

  /* Reusa o componente global em vez de inventar um segundo aviso: `ui.notice`
     já tem ícone, texto forte e cópia, e o CSS dele vale aqui sem mudança. */
  function noticeNode(opts) {
    var node = SkillHub.ui.notice({
      icon: opts.icon || 'info',
      strong: opts.strong,
      copy: opts.copy
    });
    if (opts.accent) node.classList.add('notice--accent');
    if (opts.morph) node.setAttribute('data-morph', opts.morph);
    if (opts.build) node.setAttribute('data-build', opts.build);
    return node;
  }

  function doodleSlot(name, size, className) {
    var node = doodles.get(name, size);
    if (!node) return null;
    return el('div', { class: 'slide__doodle' + (className ? ' ' + className : '') }, node);
  }

  /* --- O SKILL.md de exemplo, agrupado por TEXTO ---------------------------- */

  /*
   * Agrupar por texto e não por índice de linha é o que faz o destaque
   * sobreviver a uma edição no catálogo. Com índice fixo, acrescentar uma linha
   * no dado moveria o realce para o trecho errado SEM erro nenhum no console.
   */
  function groupOf(line, state) {
    var fences = state.fences;
    if (line.trim() === '---') {
      state.fences += 1;
      return state.fences <= 2 ? 'frontmatter' : null;
    }
    if (fences >= 2) return 'body';
    if (/^name:/.test(line)) return 'name';
    if (/^description:/.test(line)) return 'description';
    if (/^when_to_use:/.test(line)) return 'when_to_use';
    if (/^allowed-tools:/.test(line)) return 'tools';
    if (/^\s+-\s/.test(line) && state.open === 'tools') return 'tools';
    if (/^\s+\S/.test(line) && state.open) return state.open;
    return 'frontmatter';
  }

  /*
   * As quebras de linha ficam DENTRO do texto, e o `white-space: pre` do <pre>
   * as desenha. A alternativa, um <span> em display:block por linha, desenha
   * igual, mas o textContent sai sem nenhum "\n": copiar o arquivo da tela
   * devolveria tudo grudado numa linha só. Aqui `pre.textContent` é idêntico ao
   * `content` do catálogo, byte a byte.
   */
  function codeNode(content, morphKey) {
    var lines = String(content == null ? '' : content).split('\n');
    var state = { fences: 0, open: null };
    var groups = [];
    var current = null;

    lines.forEach(function (line) {
      var name = groupOf(line, state);
      state.open = name;
      if (!current || current.name !== name) {
        current = { name: name, lines: [] };
        groups.push(current);
      }
      current.lines.push(line);
    });

    return el('pre', {
      class: 'slide__code',
      'data-morph': morphKey || null
    }, groups.map(function (group, position) {
      var text = group.lines.join('\n');
      if (position < groups.length - 1) text += '\n';
      return el('span', {
        class: 'slide__group',
        'data-group': group.name || 'body'
      }, text);
    }));
  }

  /* --- Os slides ------------------------------------------------------------ */

  function cover() {
    return [
      el('div', { class: 'slide__cover' }, [
        el('div', { class: 'slide__cover-text' }, [
          eyebrow(),
          title('O que é uma Skill?', true),
          lead('Um passeio pelo formato que ensina o Claude a trabalhar do seu jeito, do arquivo à instalação.'),
          el('p', { class: 'slide__hint' }, 'Use as setas, o espaço ou clique para avançar. A tecla O abre o mapa.')
        ]),
        el('div', { class: 'slide__cover-art' }, [
          doodleSlot('sparkle', 120, 'slide__doodle--accent'),
          folderMark({ size: 72 }),
          doodleSlot('cursor', 56, 'slide__doodle--faint')
        ])
      ])
    ];
  }

  function whatTheyAre() {
    return [
      eyebrow(),
      title('O que são'),
      el('div', { class: 'slide__split' }, [
        dashCard({
          morph: 'card-def',
          children: [
            el('p', { class: 'slide__para slide__para--strong' },
              'Uma Skill é um arquivo de instruções que ensina o Claude a trabalhar do seu jeito.'),
            para('Em vez de explicar tudo de novo a cada conversa, você escreve uma vez e ele passa a seguir sozinho quando o assunto aparece.'),
            para('É o manual que você daria a alguém no primeiro dia, só que ele fica pronto para sempre.')
          ]
        }),
        el('div', { class: 'slide__aside-art' }, [
          doodleSlot('doc', 96),
          el('p', { class: 'slide__caption' },
            'Dois campos bastam para existir: um nome e uma descrição do que ela faz e de quando usar.')
        ])
      ])
    ];
  }

  function structure() {
    return [
      eyebrow(),
      title('A estrutura'),
      el('div', { class: 'slide__split slide__split--folder' }, [
        el('div', { class: 'slide__folder-col' }, [
          folderMark({ size: 88 }),
          el('p', { class: 'slide__caption' },
            'Uma Skill é uma pasta. O que muda de uma para outra é o que você põe dentro dela.')
        ]),
        el('div', { class: 'pill-stack' }, [
          pillRow({
            morph: 'pill-skill',
            doodle: 'doc',
            label: 'SKILL.md',
            title: 'As instruções',
            copy: 'O núcleo: regras, método e exemplos. É o único arquivo obrigatório.'
          }),
          pillRow({
            morph: 'pill-refs',
            doodle: 'layers',
            label: 'Arquivos Refs',
            title: 'O material de apoio',
            copy: 'PDFs, planilhas, esquemas de banco. Lidos só quando a tarefa pede.'
          }),
          pillRow({
            morph: 'pill-scripts',
            doodle: 'terminal',
            label: 'Scripts',
            title: 'O que executa',
            copy: 'Código que roda por fora. Só a saída volta para a conversa.'
          }),
          pillRow({
            morph: 'pill-assets',
            doodle: 'palette',
            label: 'Assets',
            title: 'A identidade',
            copy: 'Templates, fontes e ícones: o que dá forma ao resultado.'
          })
        ])
      ])
    ];
  }

  function insideFile(item) {
    return [
      eyebrow(),
      title('Dentro do SKILL.md'),
      el('div', { class: 'slide__split slide__split--code' }, [
        codeNode(item && item.content, 'pill-skill'),
        el('div', { class: 'slide__notes' }, [
          noticeNode({
            icon: 'file',
            strong: 'Frontmatter.',
            copy: 'O cabeçalho em YAML. name e description são os dois únicos campos obrigatórios: até 64 e até 1024 caracteres.'
          }),
          noticeNode({
            icon: 'doc',
            strong: 'Corpo.',
            copy: 'Markdown comum. A recomendação oficial é ficar abaixo de 500 linhas e mandar o resto para arquivos ao lado.'
          }),
          noticeNode({
            icon: 'zap',
            accent: true,
            strong: 'A description decide tudo.',
            copy: 'É por ela que o Claude escolhe entre dezenas de Skills. Escreva em terceira pessoa, dizendo o que faz e quando usar.'
          })
        ])
      ])
    ];
  }

  /* A árvore é literal de propósito: o slide anterior mostrou UM arquivo, e a
     pergunta que sobra é onde mora o resto. Ver a pasta inteira ao lado dos três
     níveis é o que liga "estrutura no disco" a "custo no contexto". */
  function tree() {
    return el('pre', { class: 'tree' }, [
      el('span', { class: 'tree__root' }, 'perfil-para-cv/\n'),
      el('span', { class: 'tree__line', 'data-level': '2' }, '├── SKILL.md\n'),
      el('span', { class: 'tree__line', 'data-level': '3' }, '├── reference.md\n'),
      el('span', { class: 'tree__line', 'data-level': '3' }, '├── assets/\n'),
      el('span', { class: 'tree__line', 'data-level': '3' }, '│   └── modelo.docx\n'),
      el('span', { class: 'tree__line', 'data-level': '3' }, '└── scripts/\n'),
      el('span', { class: 'tree__line', 'data-level': '3' }, '    └── exporta.py')
    ]);
  }

  function levelRow(opts) {
    return el('li', {
      class: 'levels__item',
      'data-morph': opts.morph || null,
      'data-build': opts.build || null
    }, [
      doodleSlot(opts.doodle, 52, 'slide__doodle--accent'),
      el('div', { class: 'levels__body' }, [
        el('span', { class: 'level__tag' }, opts.tag),
        el('strong', { class: 'level__title' }, opts.title),
        el('span', { class: 'levels__copy' }, opts.copy)
      ]),
      el('span', { class: 'levels__cost' }, opts.cost)
    ]);
  }

  function levels() {
    return [
      eyebrow(),
      title('O que ele carrega, e quando'),
      lead('A Skill inteira mora no disco, mas só o que a tarefa pede entra no contexto. É isso que permite ter muitas instaladas sem pagar por todas.'),
      el('div', { class: 'slide__split slide__split--levels' }, [
        el('div', { class: 'slide__tree-col' }, [
          tree(),
          el('p', { class: 'slide__caption' },
            'A mesma pasta do exemplo, por inteiro. Cada linha é lida num momento diferente.')
        ]),
        el('ul', { class: 'levels' }, [
          levelRow({
            morph: 'level-1',
            doodle: 'tag',
            tag: 'Nível 1',
            title: 'Metadados',
            copy: 'name e description, do frontmatter. Carregados na abertura da sessão, sempre.',
            cost: '~100 tokens'
          }),
          levelRow({
            morph: 'pill-skill',
            build: '1',
            doodle: 'doc',
            tag: 'Nível 2',
            title: 'Instruções',
            copy: 'O corpo do SKILL.md. Entra só quando o pedido casa com a descrição.',
            cost: 'ao acionar'
          }),
          levelRow({
            morph: 'pill-refs',
            build: '2',
            doodle: 'layers',
            tag: 'Nível 3',
            title: 'Recursos',
            copy: 'reference.md, assets/ e scripts/. Lidos um a um, conforme a tarefa pede.',
            cost: 'sob demanda'
          })
        ])
      ]),
      noticeNode({
        icon: 'terminal',
        accent: true,
        morph: 'pill-scripts',
        build: '2',
        strong: 'Script é diferente de arquivo.',
        copy: 'O código de um script nunca entra no contexto: ele roda e só a saída volta. Por isso trabalho determinístico vale mais como script do que como instrução.'
      })
    ];
  }

  function useRow(opts) {
    return el('li', { class: 'uses__item', 'data-build': opts.build || null }, [
      doodleSlot(opts.doodle, 72),
      el('div', { class: 'uses__body' }, [
        el('strong', { class: 'level__title' }, opts.title),
        el('span', { class: 'uses__copy' }, opts.copy),
        el('span', { class: 'uses__example' }, opts.example)
      ])
    ]);
  }

  /* Linhas horizontais, e não os mesmos três cartões do slide anterior: duas
     telas seguidas com a mesma forma o público lê como uma tela só. */
  function whatFor() {
    return [
      eyebrow(),
      title('Pra que serve'),
      el('ul', { class: 'uses' }, [
        useRow({
          doodle: 'terminal',
          title: 'Padronizar e automatizar',
          copy: 'O passo a passo que a equipe repete vira arquivo e para de depender de quem lembra dele.',
          example: 'Ex.: o roteiro de release, sempre na mesma ordem.'
        }),
        useRow({
          build: '1',
          doodle: 'doc',
          title: 'Apoiar o desenvolvimento',
          copy: 'As convenções do projeto e o jeito certo de usar aquele serviço, no lugar onde o código é escrito.',
          example: 'Ex.: como esta base trata migração de banco.'
        }),
        useRow({
          build: '2',
          doodle: 'people',
          title: 'Compartilhar com a equipe',
          copy: 'Uma pasta commitada em .claude/skills vale para todo mundo que clonar o repositório.',
          example: 'Ex.: quem entra amanhã já herda o combinado.'
        })
      ])
    ];
  }

  function agentExample() {
    return [
      eyebrow(),
      title('Um agente, várias Skills'),
      el('div', { class: 'wiring' }, [
        el('div', { class: 'wiring__agent' }, [
          dashCard({
            morph: 'agent-box',
            children: [
              el('span', { class: 'badge badge--accent wiring__seal' }, 'Agente'),
              doodleSlot('robot', 92),
              el('strong', { class: 'level__title' }, 'Leitor de LinkedIn'),
              para('Lê o perfil e a vaga, e decide qual Skill acionar. Nada disso ocupa o system prompt enquanto não for preciso.')
            ]
          })
        ]),
        wires(),
        el('div', { class: 'wiring__skills' }, [
          skillFolder({
            morph: 'folder',
            name: 'perfil-para-cv',
            rows: [
              { morph: 'pill-skill', label: 'SKILL.md', copy: 'Como virar o perfil num CV de uma página, sem inventar experiência.' },
              { morph: 'pill-refs', label: 'Arquivos Refs', copy: 'Modelos de currículo e o glossário de cargos.' },
              { morph: 'pill-assets', label: 'Assets', copy: 'A fonte e o gabarito de diagramação.' }
            ]
          }),
          skillFolder({
            morph: 'folder-2',
            build: '1',
            name: 'vaga-para-mapa-de-estudos',
            rows: [
              { label: 'SKILL.md', copy: 'Compara a vaga com o perfil e nomeia o que falta.' },
              { label: 'Arquivos Refs', copy: 'Trilhas e fontes confiáveis por tecnologia.' },
              { morph: 'pill-scripts', label: 'Scripts', copy: 'Distribui o plano nas semanas até a candidatura.' }
            ]
          })
        ])
      ])
    ];
  }

  function skillFolder(opts) {
    return el('div', { class: 'skill-folder', 'data-build': opts.build || null }, [
      el('div', { class: 'skill-folder__head', 'data-morph': opts.morph || null }, [
        doodles.get('folder', 44),
        el('strong', { class: 'skill-folder__name' }, opts.name)
      ]),
      el('div', { class: 'skill-folder__rows' }, opts.rows.map(function (row) {
        return el('div', { class: 'pill-row pill-row--tight' }, [
          el('span', { class: 'pill pill--sm', 'data-morph': row.morph || null }, row.label),
          el('span', { class: 'pill-row__copy' }, row.copy)
        ]);
      }))
    ]);
  }

  /* Os fios que ligam o agente às pastas. `preserveAspectRatio: none` deixa a
     curva esticar com a coluna: é decoração, não diagrama de precisão. */
  function wires() {
    return svg('svg', {
      class: 'wiring__wires',
      viewBox: '0 0 100 100',
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
      focusable: 'false'
    }, [
      svg('path', { d: 'M0 50 C 40 50, 55 22, 100 22' }),
      svg('path', { d: 'M0 50 C 40 50, 55 78, 100 78' })
    ]);
  }

  function craft() {
    return [
      eyebrow(),
      title('Como escrever uma boa'),
      lead('A janela de contexto é um bem público: cada linha da sua Skill disputa espaço com a conversa.'),
      el('div', { class: 'slide__split slide__split--craft' }, [
        el('ul', { class: 'rules' }, [
          rule('A descrição em terceira pessoa', 'Ela é injetada no system prompt. "Revisa mudanças de API" funciona; "eu posso te ajudar a revisar" atrapalha a escolha.'),
          rule('Diga o que faz e quando usar', 'Sem o "quando", o Claude não tem como saber que esta é a Skill certa entre dezenas.'),
          rule('Corpo abaixo de 500 linhas', 'Passou disso, o resto vai para arquivos ao lado, que só são lidos quando a tarefa pede.', '1'),
          rule('Referências a um nível só', 'Arquivo que aponta para arquivo que aponta para arquivo acaba lido pela metade.', '1'),
          rule('Nada com data de validade', 'Instrução que fala em "até agosto" envelhece sozinha e ninguém percebe.', '1')
        ]),
        el('div', { class: 'freedom', 'data-build': '2' }, [
          el('div', { class: 'freedom__case' }, [
            doodleSlot('bridge', 84),
            el('strong', { class: 'freedom__title' }, 'Ponte estreita'),
            el('span', { class: 'freedom__copy' }, 'Operação frágil, um jeito certo só. Dê o comando exato e diga para não improvisar.')
          ]),
          el('div', { class: 'freedom__case' }, [
            doodleSlot('field', 84),
            el('strong', { class: 'freedom__title' }, 'Campo aberto'),
            el('span', { class: 'freedom__copy' }, 'Muitos caminhos servem. Dê a direção e deixe o julgamento com quem está lá.')
          ])
        ])
      ])
    ];
  }

  function rule(strong, copy, build) {
    return el('li', { class: 'rules__item', 'data-build': build || null }, [
      el('strong', { class: 'rules__title' }, strong),
      el('span', { class: 'rules__copy' }, copy)
    ]);
  }

  /* Passo numerado com comando ao lado. Serve aos dois slides seguintes: criar
     e refinar são a mesma forma, sequência de passos curtos, e um componente
     só evita duas listas quase iguais no CSS. */
  function howto(opts) {
    return el('li', { class: 'howto__item', 'data-build': opts.build || null }, [
      el('span', { class: 'howto__num', 'aria-hidden': 'true' }, String(opts.step)),
      el('div', { class: 'howto__body' }, [
        el('strong', { class: 'howto__title' }, opts.title),
        el('span', { class: 'howto__copy' }, opts.copy),
        opts.code ? el('code', {
          class: 'howto__code',
          'data-morph': opts.morph || null
        }, opts.code) : null
      ])
    ]);
  }

  function creating() {
    return [
      eyebrow(),
      title('Criando no Claude Code'),
      lead('Não existe comando de scaffold, e isso é a vantagem: uma Skill é uma pasta com um arquivo de texto, então ela entra no repositório como qualquer outro código.'),
      el('div', { class: 'slide__split slide__split--howto' }, [
        el('ol', { class: 'howto' }, [
          howto({
            step: 1,
            title: 'Crie a pasta',
            copy: 'Dentro do projeto, para valer no repositório. Em ~/.claude/skills, para valer em tudo que você abre.',
            code: 'mkdir -p .claude/skills/revisor-de-api'
          }),
          howto({
            step: 2,
            build: '1',
            title: 'Escreva o SKILL.md',
            copy: 'Dois campos bastam. A description é o que o Claude compara com o seu pedido, então diga o que faz e quando usar.',
            morph: 'pill-skill',
            code: '---\nname: revisor-de-api\ndescription: Revisa mudanças de API contra as\n  convenções do projeto. Use antes de publicar\n  alterações em endpoints.\n---\n\n# Objetivo\n...'
          }),
          howto({
            step: 3,
            build: '2',
            title: 'Acione na sessão',
            copy: 'Digite a barra para chamar pelo nome, ou apenas peça a revisão: se a description casar, o Claude aciona sozinho.',
            code: '/revisor-de-api  ·  ou  "revisa essa API pra mim"'
          })
        ]),
        el('div', { class: 'slide__aside-art' }, [
          doodleSlot('terminal', 88),
          noticeNode({
            icon: 'sparkle',
            build: '2',
            strong: 'Peça ao próprio Claude.',
            copy: 'Ele conhece o formato: descreva o que você acabou de fazer à mão e peça que transforme numa Skill. Depois revise o excesso, que é o erro mais comum.'
          })
        ])
      ])
    ];
  }

  function refining() {
    return [
      eyebrow(),
      title('Refinar até ficar boa'),
      lead('A primeira versão nunca é a versão boa. O ciclo é curto, e quem manda nele é o caso real, não a impressão.'),
      el('ol', { class: 'howto howto--wide' }, [
        howto({
          step: 1,
          title: 'Faça a tarefa sem Skill nenhuma',
          copy: 'O que você explicou duas vezes na mesma conversa é exatamente o que vira arquivo. Antes disso, você está adivinhando o que é útil.'
        }),
        howto({
          step: 2,
          title: 'Escreva o mínimo que resolve',
          copy: 'Contexto que o Claude já tem só ocupa espaço. Corte cada frase que explica algo que ele faria certo sozinho.'
        }),
        howto({
          step: 3,
          build: '1',
          title: 'Use em trabalho de verdade e observe',
          copy: 'Onde ele pulou um passo, qual arquivo leu na ordem errada, qual nunca abriu. Arquivo que nunca é lido ou está mal sinalizado ou não precisava existir.'
        }),
        howto({
          step: 4,
          build: '1',
          title: 'Volte ao arquivo com o caso concreto',
          copy: '"Esqueceu de filtrar conta de teste no relatório regional" muda a Skill. "Ficou vago" não muda nada.'
        })
      ]),
      noticeNode({
        icon: 'refresh',
        accent: true,
        build: '2',
        strong: 'Três cenários antes de escrever muito.',
        copy: 'A documentação recomenda montar as avaliações primeiro: rode a tarefa sem a Skill, anote onde falhou, e escreva só o suficiente para passar nesses casos. Sem isso você documenta um problema imaginado.'
      })
    ];
  }

  function install(paths) {
    return [
      eyebrow(),
      title('Onde ela mora'),
      lead('No Claude Code a Skill é um diretório no disco. O lugar decide quem enxerga.'),
      /* A lista inteira aparece de uma vez: partir um inventário no meio deixa
         o primeiro passo com cara de slide quebrado, não de revelação. O que
         espera o segundo passo é o aviso, que é o remate. */
      el('ul', { class: 'paths' }, (paths || []).map(function (entry) {
        return el('li', { class: 'paths__item' }, [
          el('strong', { class: 'paths__key' }, entry.key),
          el('code', { class: 'paths__value' }, entry.value),
          entry.hint ? el('span', { class: 'paths__hint' }, entry.hint) : null
        ]);
      })),
      noticeNode({
        icon: 'shield',
        accent: true,
        build: '1',
        strong: 'Conteúdo de terceiros é código de terceiros.',
        copy: 'Uma Skill instala instruções e scripts. Leia antes de usar, como você leria antes de rodar qualquer programa que baixou.'
      })
    ];
  }

  function sources() {
    return [
      eyebrow(),
      title('Direto da fonte'),
      lead('Cinco páginas oficiais da Anthropic: a documentação, as boas práticas e o repositório público.'),
      el('ul', { class: 'sources' }, SOURCES.map(function (source) {
        return el('li', { class: 'sources__item' }, [
          el('a', {
            class: 'sources__link',
            href: source.href,
            target: '_blank',
            rel: 'noopener noreferrer'
          }, source.title),
          el('span', { class: 'sources__copy' }, source.copy)
        ]);
      })),
      el('div', { class: 'slide__actions', 'data-build': '1' }, [
        el('a', { class: 'btn btn--primary', href: '#/skill-builder' }, el('span', {}, 'Criar uma Skill')),
        el('a', { class: 'btn', href: '#/claude-skills' }, el('span', {}, 'Ver o catálogo'))
      ])
    ];
  }

  /* --- A lista ------------------------------------------------------------- */

  /**
   * @param {object} ctx  { item, paths }, o que vem de fora e não se repete aqui
   * @returns {object[]}  { id, chapter, caption, builds, layout, build(ctx) }
   */
  function all(ctx) {
    var item = (ctx && ctx.item) || null;
    var paths = (ctx && ctx.paths) || [];
    return [
      { id: 'cover', chapter: 'Abertura', caption: 'O que é uma Skill, em doze slides.', builds: 1, layout: 'cover', build: cover },
      { id: 'what', chapter: 'A definição', caption: 'Um arquivo de instruções que o Claude passa a seguir sozinho.', builds: 1, build: whatTheyAre },
      { id: 'structure', chapter: 'A estrutura', caption: 'Uma pasta com quatro tipos de conteúdo dentro.', builds: 1, build: structure },
      { id: 'file', chapter: 'A estrutura', caption: 'O SKILL.md por dentro: frontmatter e corpo.', builds: 1, build: function () { return insideFile(item); } },
      { id: 'levels', chapter: 'Como funciona', caption: 'Três níveis de carregamento, e nada antes da hora.', builds: 3, build: levels },
      { id: 'why', chapter: 'Pra que serve', caption: 'Padronizar, apoiar o desenvolvimento e compartilhar.', builds: 3, build: whatFor },
      { id: 'agent', chapter: 'Pra que serve', caption: 'Um agente de LinkedIn com duas Skills: o CV e o mapa de estudos.', builds: 2, build: agentExample },
      { id: 'craft', chapter: 'Como escrever', caption: 'Concisão, descrição honesta e o grau certo de liberdade.', builds: 3, build: craft },
      { id: 'create', chapter: 'Na prática', caption: 'Uma Skill criada do zero no Claude Code, em três passos.', builds: 3, build: creating },
      { id: 'refine', chapter: 'Na prática', caption: 'O ciclo de refino, guiado pelo caso real.', builds: 3, build: refining },
      { id: 'install', chapter: 'Onde ela mora', caption: 'Os caminhos reais de instalação no Claude Code.', builds: 2, build: function () { return install(paths); } },
      { id: 'sources', chapter: 'Fecho', caption: 'As cinco fontes oficiais, e por onde começar.', builds: 2, build: sources }
    ];
  }

  SkillHub.deck.slides = {
    EXAMPLE_ID: EXAMPLE_ID,
    SOURCES: SOURCES,
    all: all,
    codeNode: codeNode,
    groupOf: groupOf
  };
})(window.SkillHub);
