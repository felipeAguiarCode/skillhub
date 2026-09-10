# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 🤖 Skill Hub

Marketplace gratuito e estático de Skills para **Claude Code** e **Codex**, com um
Skill Builder em wizard. O produto se chama **Skill Hub** (`skill-hub`); os
documentos em `docs/` ainda usam o nome de trabalho original, *Toko* — é a mesma
coisa.

## 📍 Onde o código vive

Só uma árvore é o produto:

| Caminho | O que é |
|---|---|
| `index.html` + `assets/` | **O aplicativo.** É aqui que se mexe. |
| `tools/` | Scripts de desenvolvimento, rodados à mão com `node`. Não fazem parte do app. |
| `prototype/` | Protótipo original do blueprint. **Referência histórica — não editar.** |
| `design-system/` | Vitrine de tokens/componentes do blueprint. **Referência — não editar.** |
| `docs/` | Especificação (PRD, ADR, Design System, Spec do Builder, Gates, QA). |
| `reference/concept-ui.png` | Conceito visual de 6 frames. |
| `.inspo/` | Quatro capturas de uma aula sobre Skills mais um resumo. É a base do conteúdo e do desenho da apresentação. **Referência — não editar.** |

O app está **completo** (gates 1 a 8 de `docs/IMPLEMENTATION_GATES.md`) e já
cresceu além deles: a coleção Coding Styles, a apresentação `#/what-is-a-skill` e
o renderizador de Markdown são posteriores ao blueprint. Não há gate pendente;
trate pedidos novos como evolução, não como continuação da sequência.

Quando um pedido novo contrariar `docs/`, o `docs/` **não** é reescrito — é
registro do blueprint. O estado corrente é este arquivo, e a divergência fica
anotada aqui, onde ela aparece (ver Navegação, sobre o sétimo item da sidebar).

## ▶️ Executar

Não existe build, npm, bundler nem lint configurado — isso é deliberado (ADR-003).

```bash
# Rodar: qualquer uma das três formas funciona
#  1. abrir index.html direto (file:// tem de funcionar, sem flags)
python -m http.server 8000     #  2. servidor estático local
#  3. qualquer host de arquivos estáticos

# Sintaxe de todo o JS (Node é conveniência de dev, não dependência)
for f in $(find assets/js tools -name '*.js'); do node --check "$f" || echo "FAIL $f"; done

# Regerar os guias de coding style depois de editá-los em ~/.claude/coding-styles/
# (escreve data/coding-styles.js e data/coding-styles-extra.js; valida antes de gravar)
node tools/gen-coding-styles.js
```

## 🚀 Git e publicação

O repositório é `felipeAguiarCode/skillhub`, e a branch `main` é publicada por
**GitHub Pages** na raiz: <https://felipeaguiarcode.github.io/skillhub/>. Não há
workflow de build — o Pages serve os arquivos como estão. Publicar é `git push`.

Dois arquivos existem só por causa disso, e removê-los quebra a publicação:

- **`.nojekyll`** — impede o Pages de processar o site com Jekyll, que ignoraria
  qualquer arquivo ou pasta começando com `_`.
- **`.gitattributes`** — `* text=auto eol=lf`. Sem isso, um checkout no Windows
  commitaria CRLF e o diff de qualquer arquivo apareceria inteiro alterado para
  quem clonasse em outro sistema.

Como o app usa **só caminhos relativos** e hash routing, ele funciona igual em
domínio raiz e em subpasta. É por isso que `/skillhub/` no Pages não precisa de
nenhuma regra de rewrite — e é por isso que introduzir um caminho absoluto
quebra a versão publicada sem quebrar o `localhost`.

## 🧪 Verificar

**Não há suíte de testes versionada no repositório**, e isso é uma lacuna real,
não uma decisão. A superfície de aceite formal é `docs/QA_CHECKLIST.md`.

Nesta sessão foram construídas nove suítes que juntas rodam **666 asserções**,
com `node` puro e sem nenhuma dependência. Elas vivem **fora do repositório**, no
scratchpad da sessão, então **serão perdidas**. Se ainda existirem, valem mais
que qualquer verificação manual; se não, o mais barato é reconstruir as duas
primeiras antes de mexer em algo grande.

| Suíte | Asserções | Cobre |
|---|---|---|
| `drive.js` | 157 | bootstrap, as nove rotas mais quatro detalhes, catálogo, busca e filtros, builder, rascunho, `localStorage`, acúmulo de listener |
| `drive-deck.js` | 411 | a apresentação: montagem sem morph, morph, builds, teclado, mapa, deep link, movimento reduzido, foco, slide visível de verdade, nada piscando em laço, resíduo no teardown, os 25 passos a 1440 e a 360 |
| `drive-deck-file.js` | 10 | a mesma apresentação por `file://`, onde `replaceState` lançaria |
| `smoke-serialize.js` | 115 | serialização determinística (ADR-008) |
| `smoke-formats.js` | 77 | o registry de formatos contra o catálogo |
| `smoke-morph.js` | 92 | matemática do morph, com prova algébrica de que a transformação leva o destino exatamente sobre a origem |
| `drive-qa.js` | 57 | itens do QA checklist, conteúdo hostil, filtros recolhíveis |
| `smoke-markdown.js` | 51 | o renderizador de Markdown e os caminhos de injeção |
| `drive-a11y.js` | 44 | overflow de 360 a 1920, movimento reduzido, foco, risco nunca só por cor |
| `drive-export.js` | 11 | download real, `SKILL.md` e ZIP comparados byte a byte |
| `check-catalog.js` | — | integridade do catálogo: ids, ícones, categorias, `content` válido para o formato |

As três de `smoke-*` rodam sem navegador. As de `drive-*` precisam de um servidor
e de um Chrome com `--remote-debugging-port`, dirigido por WebSocket — o Node 22
já tem `WebSocket` e `fetch` globais, então dá para automatizar sem npm. É assim
que se capturam erros de console de verdade (`Runtime.exceptionThrown`,
`Log.entryAdded`).

### Armadilhas de automação que já custaram tempo

- **Screenshot headless:** use um `--user-data-dir` novo a cada captura. O perfil
  persistente **cacheia o CSS** e você fotografa a versão anterior.
- `Page.navigate` para uma URL que **só difere no hash não recarrega** a página.
  Estado em memória vaza entre blocos de teste; use `about:blank` no meio.
- Atribuir `location.hash` por script **sem gesto do usuário** é convertido em
  *replace* pelo Chrome. Testar voltar/avançar exige clique real via
  `Input.dispatchMouseEvent`.
- `Browser.setDownloadBehavior` precisa do caminho **com barras invertidas** do
  Windows, e de `eventsEnabled: true`. Com barra normal, o download é cancelado
  em silêncio.
- Ao medir posição depois de rolar um contêiner por script, **releia o
  retângulo**: um `getBoundingClientRect` guardado antes da rolagem transforma um
  teste que passaria em falha inexplicável.
- Ao testar `AGENTS.md`/ZIP no Windows, confira a extração em **duas** ferramentas
  (`Expand-Archive` e o leitor do Explorer) — elas discordam sobre ZIPs malformados.

## 🧱 Restrições inegociáveis

- Somente **HTML, CSS e JavaScript puro**.
- Nenhum framework: React, Vue, Svelte, Angular, Tailwind, Bootstrap.
- Sem backend, sem autenticação/login, sem banco de dados.
- Sem npm, bundler ou etapa de build como requisito de execução.
- **Sem ES modules** (ADR-003): o app tem de abrir via `file://`. Cada arquivo é um
  IIFE que pendura sua API em `window.SkillHub`, carregado por `<script>` em ordem
  fixa no fim do `<body>`.
- Catálogo em arquivo JavaScript estático (`window.SKILL_HUB_CATALOG`), nunca `fetch`.
- `localStorage` só para estado local não sensível.
- Caminhos sempre relativos: o app roda em subpasta sem rewrite.

## 🗂️ Especificação e precedência

Ler antes de alterar comportamento: `docs/PRD.md`, `docs/ADR.md`,
`docs/DESIGN_SYSTEM.md`, `docs/SKILL_BUILDER_SPEC.md`, `docs/QA_CHECKLIST.md`.

Em caso de conflito, a ADR-017 manda: **ADR → PRD → DESIGN_SYSTEM →
SKILL_BUILDER_SPEC → IMPLEMENTATION_GATES → CLAUDE.md**.

O `concept-ui.png` define o *visual*, não o comportamento. Conflitos já resolvidos,
não reabrir sem motivo: o conceito mostra um botão **"Sign in"** (proibido aqui →
virou ícone de favoritos), um wizard de **5 passos** (a spec pede 7 → vale a spec) e
uma estrutura com `CLAUDE.md`/`README.md` (o artefato correto é `SKILL.md`).

## 🎯 Arquitetura: um formato por ferramenta

**`assets/js/formats.js` é a fonte única do que cada ferramenta espera.** O catálogo,
o detalhe e o Skill Builder leem de lá — nada de conhecimento de formato espalhado.
Para acompanhar mudanças na documentação oficial, esse é o único arquivo a mudar.

| | Claude Code | Codex |
|---|---|---|
| Artefato | `<nome>/SKILL.md` (diretório) | `AGENTS.md` **ou** `~/.codex/prompts/<nome>.md` |
| Frontmatter | ~20 campos opcionais | `AGENTS.md`: **nenhum** · prompt: só `description` + `argument-hint` |
| Acionamento | `/nome`, auto-invocável | `AGENTS.md`: automático por diretório · prompt: `/prompts:nome` |
| Placeholders | `$ARGUMENTS`, `$N`, `$nome`, `${CLAUDE_*}` | `$1`–`$9`, `$ARGUMENTS`, `$MAIUSCULO`, `$$` |
| Limite | manter < 500 linhas | 32 KiB (`project_doc_max_bytes`) |
| Passos do wizard | 7 | prompt: 5 · `AGENTS.md`: 4 |

Os quatro `format` existentes: `claude-skill`, `codex-prompt`, `codex-agents` e
`portable-prompt`. O último não é invenção: como `description` e `argument-hint` são
os **dois únicos** campos do prompt do Codex *e* dois campos válidos do Claude Code,
um prompt limitado a eles instala nas duas ferramentas sem alterar o arquivo.

Fontes oficiais conferidas (reconfira antes de ampliar campos):
`code.claude.com/docs/en/skills`, `developers.openai.com/codex/guides/agents-md`,
`developers.openai.com/codex/custom-prompts`.

### Modelo: campo de arquivo no Claude Code, configuração no Codex

`formats.js` também carrega as listas de modelo (`models`) e **onde o modelo mora**
(`modelField`), porque as duas ferramentas discordam:

- `claude-skill` → `modelField: 'frontmatter'`. O modelo é campo do `SKILL.md`, e a
  lista é a da Anthropic (`inherit` mais os IDs atuais).
- `codex-prompt` e `codex-agents` → `modelField: 'config'`. O Codex **não** aceita
  modelo no arquivo: vive em `~/.codex/config.toml`, na flag `--model` ou em `/model`.
  Por isso o builder mostra a escolha no passo de **exportação**, como snippet de
  configuração, e o modelo escolhido nunca entra no arquivo gerado.
- `portable-prompt` → `models: []`, `modelField: null`. Declarar modelo mataria a
  portabilidade.

Ao atualizar as listas, mexa só em `formats.js` — `steps.js` e `state.js` já leem de lá
(`execution.model` para o Claude Code, `execution.codexModel` para o Codex, que existe
só para montar o snippet e nunca passa por `collectFields`).

## 🧩 Módulos que importam

Ordem dos `<script>` é dependência real — ao adicionar um arquivo, insira na posição
certa em `index.html`.

- **`core.js`** — `SkillHub.dom`, `util`, `store`, `toast`, `clipboard`, `download`.
- **`formats.js`** — o registry acima.
- **`components.js`** — `SkillHub.ui.*`: toda fábrica de componente. Reutilize antes
  de criar CSS de página. `ui.rowActivatable(node, href)` faz a linha inteira de um
  card navegar: o botão continua sendo o **único** focável, e o clique na linha é
  conveniência de mouse. Envolver o card num `<a>` colocaria um botão dentro de um
  link — HTML inválido e ruim de teclado. `ui.chipLine(label, group, options, onSelect)`
  é a linha de chips de filtro, usada por `listing` e por `coding-styles`: o
  `data-group`/`data-value` é contrato, porque quem consome vira o `aria-pressed`
  **no lugar** em vez de recriar os nós — é isso que mantém o foco no campo de busca.
  `ui.openDialog(opts)` serve dois papéis, e quem decide é a presença de
  `onConfirm`: **com** ela é confirmação (Cancelar + Confirmar, `items` como lista
  de aviso, foco na ação); **sem** ela é informativo (`dismissLabel` como única
  ação, `body` com nós livres, `wide` para caminho em monoespaçado, e o foco vai
  para o próprio diálogo — focar o botão do fim faria a caixa abrir rolada até
  embaixo, escondendo o primeiro passo).
- **`catalog.js`** — busca, facetas, filtros por rota, ordenação.
- **`data/*.js`** — o catálogo em si, dividido em arquivos por coleção (nenhum deles
  grande demais para ler de uma vez). Cada um faz
  `window.SKILL_HUB_CATALOG = (window.SKILL_HUB_CATALOG || []).concat([...])`, então
  a ordem entre eles não importa — só precisam vir **antes** de `catalog.js` no
  `index.html`. Para acrescentar uma coleção, crie `data/<nome>.js` e registre a tag.
  `coding-styles.js` e `coding-styles-extra.js` seguem o mesmo padrão de concat, mas
  num global separado (`SKILL_HUB_CODING_STYLES`) e são **gerados** — ver a seção
  Coding Styles.
- **`router.js`** — hash router, um único listener de `hashchange`, `teardown()` da
  rota anterior (é o que impede acúmulo de listeners), 404 real. Três coisas que
  uma rota pode declarar: `ownsParam` (o router não re-renderiza quando só o
  parâmetro muda, e chama `onParam()` para a página acompanhar), `capturesKeys`
  (o atalho `/` não leva para a listagem) e `focusSearch()`. `router.definition(name)`
  devolve a definição registrada — `app.js` usa isso em vez de manter uma segunda
  tabela de rotas, que era o que fazia `/` sequestrar rotas novas.
- **`builder/`** — `state` (estado único serializável), `serialize` (geração
  determinística), `validate` (por passo + scores), `steps` (renderizadores),
  `export`.
- **`markdown.js`** — renderizador de Markdown para DOM, sem `innerHTML`. Só para
  conteúdo do repositório; ver a seção Markdown abaixo.
- **`deck/`** — a apresentação `#/what-is-a-skill`: `morph` (o FLIP; a parte pura
  é testável sem navegador), `doodles` (ilustrações de traço à mão, no molde de
  `icons.js`), `slides` (os 10 slides como dado). `pages/deck.js` orquestra. Ver a
  seção da apresentação abaixo.
- **`zip.js`** — writer ZIP store-only em JS puro. Entradas de diretório explícitas e
  bit 11 de UTF-8 são o que faz o arquivo abrir no Explorer do Windows.

### `SkillHub.dom` proíbe `innerHTML` por construção

`el(tag, props, children)` não tem `props.html`. String em `children` sempre vira
`createTextNode`. `props.style` só aceita objeto e existe apenas para valores
calculados em runtime — estilo estático vive no CSS. Toda URL de catálogo passa por
`dom.safeHref()`, que rejeita tudo fora de `http:`/`https:`/`mailto:`.

Consequência prática: **o código novo não deve introduzir `innerHTML`.** Hoje há zero
usos reais no app. A varredura precisa excluir os falsos positivos, que são
menção e não uso — os guias `vanilla-web` e `react-typescript` têm seção sobre
nunca usar `innerHTML` (e `dangerouslySetInnerHTML`), e `markdown.js` cita a
proibição no cabeçalho:

```bash
grep -rn "innerHTML" index.html assets/   | grep -v "assets/js/data/coding-styles.js"   | grep -v "assets/js/data/coding-styles-extra.js"   | grep -v "assets/js/markdown.js:"
```

Isso deve continuar vazio.

### Builder: passos por chave, não por número

O passo 2 é *Gatilhos* no Claude Code e *Instruções* no `AGENTS.md`. Por isso
`validate.step()` e `steps.render()` recebem **chave** (`basic`, `invocation`,
`execution`, `instructions`, `files`, `review`, `export`); o número é só apresentação.
Trocar de formato remapeia o passo atual pela chave.

### Builder: re-render dirigido

- Digitar num campo → `ctx.set()` → atualiza **só** o painel lateral e os erros inline.
  É isso que mantém foco e caret parados.
- Back/Next ou mudança estrutural → `ctx.refresh()` → re-renderiza corpo do passo,
  stepper, topbar e **remonta** o aside.
- Cuidado em `refreshStep()`: `buildAside()` já reatribui `refs.aside` para o nó novo,
  então guarde o nó antigo e o pai **antes** de chamá-la. Errar isso lança
  silenciosamente dentro do handler e congela o painel lateral.
- Ações estruturais (`setStep`, `setFormat`, `setProfile`, arquivos) gravam o rascunho
  **na hora**; só edição de campo é debounced. Sem isso, uma sequência rápida de
  cliques reinicia o timer e o rascunho nunca chega ao `localStorage`.

### Coding Styles: guias que moram fora do repositório

A coleção `#/coding-styles` lista **20 guias** de estilo em cards, e
`#/coding-styles/<id>` abre o guia com índice de seções.

São **10 stacks × 2 variantes**, ligadas pelo campo `family`:

| | |
|---|---|
| Backend | Node.js + TypeScript · Python · Java + Spring · C# + .NET |
| Frontend | Vanilla Web · React + TypeScript |
| Mobile | Kotlin + Android |
| Dados | PostgreSQL + SQL |
| Infra | Bash + Shell · Docker + CI |

`depth: 'full'` é o guia inteiro; `depth: 'essential'` é o cartão de referência
da mesma stack (12–17 seções), para citar numa sessão sem gastar contexto. O
Essencial é **documento próprio, não um recorte** do completo — um subconjunto
copiado divergiria na primeira edição.

**A fonte não está aqui.** Os guias vivem em `~/.claude/coding-styles/`, um
arquivo Markdown por guia, porque valem entre projetos. O navegador não lê
aquele caminho e o app não faz `fetch` (ADR-004), então o texto entra como dado
estático gerado:

```bash
node tools/gen-coding-styles.js
```

Saem **dois** arquivos, particionados por `depth`: `data/coding-styles.js` (os
completos) e `data/coding-styles-extra.js` (os essenciais). Num arquivo só
seriam doze mil linhas. Cada um faz `concat` no mesmo global, então a ordem
entre eles não importa — só precisam vir antes de `catalog.js`.

O gerador copia byte a byte, grava em `.gen.js`, confere carregando o que
escreveu e só então renomeia: divergência sai com código 1 **sem** deixar
arquivo ruim no disco. Antes disso ele valida `GUIDES` na fronteira — `icon`
existe em `icons.js`, `area` está na lista, `depth` é `full`/`essential`, id
único e no máximo uma variante por `family`+`depth`. Essa validação é a rede de
proteção real: ícone inexistente não gera erro de console, só renderiza
`sparkle` calado (`icons.js:181`).

Os dois arquivos de dado são **gerados**: editar à mão é perder a mudança na
próxima geração. Para acrescentar um guia, escreva o `.md` na pasta de origem,
acrescente a linha no `README.md` de lá e registre os metadados de card
(`area`, `depth`, `family`, `icon`, `tags`, `stack`, `summary`) na lista
`GUIDES` do gerador. São três lugares, e nenhum deles é o arquivo de dado.

A contagem de seções de cada card é derivada do texto em runtime, não gravada
pelo gerador — número fixo envelheceria em silêncio quando o guia mudasse. Por
isso ela é memoizada no próprio guia junto com o `__haystack`, na técnica do
`catalog.js`: a busca cobre o corpo do texto, e recalcular 20 outlines sobre
~200 KB de Markdown a cada tecla digitada trava a digitação.

A vitrine reusa as classes de `listing` (`.listing__filter-block`,
`.listing__filters`, `.listing__toggle`) e por isso não tem CSS próprio —
inclusive o colapso de filtro só em tablet/mobile, que vem de
`05-pages.css:87-95`. Duas linhas de chip (área, profundidade) e um
`ui.bareSelect` de ordenação. **Agrupar é um modo da ordenação, não um segundo
controle**: em `Por área` (o padrão) sai um `ui.section` por área, com área
vazia omitida; nas outras três ordens sai um `.catalog` plano.

`AREAS` vive em `pages/coding-styles.js` com a ordem de exibição (Backend →
Frontend → Mobile → Dados → Infra, não alfabética) e os rótulos; o dado carrega
só a chave. `ui.styleCard(guide, { areaLabel, depthLabel })` recebe os rótulos
de fora, como o `categoryLabel` do `skillCard` — duas tabelas de rótulo
divergiriam. E `linkLabel` de `DEPTHS` não é derivado do `label` porque tem de
concordar com "versão": "Ver a versão completo" estaria errado.

Um dos guias, `vanilla-web.md`, descreve a stack **deste** app. Os outros não se
aplicam aqui: este projeto não tem TypeScript, npm nem build.

### Markdown renderizado, e só para conteúdo do repositório

`assets/js/markdown.js` renderiza um subconjunto de Markdown para nós de DOM via
`dom.el`. Não há caminho de injeção: todo texto vira nó de texto, só elementos de
uma lista fixa são criados, e link passa por `dom.safeHref` — URL recusada vira
texto.

**Escopo:** conteúdo autorado no repositório, hoje os guias de estilo. Conteúdo
de catálogo continua exibido como TEXTO em code box, porque é material de
terceiros (ADR-010). Não use este módulo para `item.content` de uma Skill.

O subconjunto é o que os guias usam e nada além: `#`/`##`/`###`, ` ``` `, tabela,
lista, lista de tarefa, citação, régua, `` `code` ``, `**bold**` e link. O que
não estiver na lista sai como texto literal, de propósito.

### Apresentação: keynote com morph, e doodles que respiram

`#/what-is-a-skill` é um keynote de **12 slides / 25 passos**. Não há canvas nem
câmera: cada slide é uma página responsiva comum, em escala 1, e a transição
entre eles é o **Morph do PowerPoint** — o elemento que existe nos dois slides
viaja de um para o outro, e o resto entra e sai. Isso é o que mantém o texto
nítido em qualquer largura e dispensa um segundo renderizador para o celular.

O conteúdo e o desenho vêm de `.inspo/` (quatro capturas de uma aula: o que são,
estrutura, pra que serve, exemplo de agente) — a composição, a borda tracejada, a
pílula clara e a pasta. A paleta roxa do material **não** foi adotada: a estrutura
é de lá, a cor é a do Skill Hub.

Consequências práticas:

- **O contrato do morph é `data-morph="<chave>"`.** A mesma chave em dois slides
  faz o elemento viajar. `data-morph-type="text"` interpola `font-size` em vez de
  escalar — escalar texto o deixa borrado no meio do caminho. O padrão é `box`,
  que escala **e** cria um fantasma clonado do elemento que sai, fazendo
  cross-fade por cima; sem o fantasma, o conteúdo do destino apareceria espremido
  no tamanho da origem.
- **Aqui `getBoundingClientRect` é a ferramenta certa**, ao contrário da câmera
  que existiu antes (aquela media por `offsetParent` para não ficar circular). No
  FLIP é justamente a posição renderizada que se compara. Consequência: o palco
  **não pode ganhar `transform`, `filter` nem `perspective`** — mudariam o
  referencial do `.deck__ghosts`, que é `position: fixed`, e os fantasmas
  apareceriam deslocados.
- **`prefers-reduced-motion` tem DOIS caminhos aqui, e só um é automático.** O
  bloco global de `02-base.css` cobre `@keyframes` e `transition` — é o que
  desliga o balanço dos doodles. Ele **não alcança a Web Animations API**, e o morph
  é a única coisa do app que usa WAAPI: por isso `morph.js` consulta
  `matchMedia('(prefers-reduced-motion: reduce)')` na mão e troca o slide sem
  animar. Tirar essa checagem faz a apresentação continuar voando para quem pediu
  que não voasse, e isso reprova a DoD.
- **O movimento contínuo dos doodles é transform, nunca troca de imagem.** A
  primeira versão usava *boil* — duas variantes do mesmo desenho alternando a ~8
  quadros por segundo, a técnica da animação tradicional. É fiel ao traço à mão e
  errado aqui: ao lado de texto que se lê, numa tela parada, aquilo não passa
  vida, passa **pisca**. Ficou um balanço lento (`doodle-sway`, ~5s) de rotação e
  deslocamento mínimos, na raiz do SVG para não brigar com o `doodle-drop` do
  invólucro. Qualquer animação de opacidade ou de troca de quadro volta a piscar.
- **Os trechos do `SKILL.md` são agrupados por TEXTO, não por índice de linha.**
  O arquivo vem de `catalog.byId('api-reviewer')` em runtime; casar por texto é o
  que faz o realce sobreviver a uma edição no catálogo. As quebras de linha ficam
  **dentro do texto** e quem as desenha é o `white-space: pre` — um `<span>` por
  linha em `display: block` desenharia igual, mas `textContent` sairia sem
  nenhum `\n` e copiar o arquivo da tela devolveria tudo numa linha só.
- **`render()` devolve árvore destacada.** Montar e medir só funciona dentro de um
  `requestAnimationFrame`, e o primeiro slide entra **sem morph** — morph precisa
  de um slide anterior, e abrir com movimento é o defeito a evitar.
- **`data-deck` na shell é posto dentro desse rAF** (é ele que torna `.page` um
  contêiner flex, e sem isso o palco tem altura zero), com `try/catch` que o
  remove se algo lançar. Sem isso uma exceção deixaria a sidebar recolhida sem
  rota nenhuma que chamasse o `teardown`.
- **A apresentação nunca escreve em `skillhub.ui.v1`.** Ela só põe e tira
  `data-deck`; a preferência real da sidebar volta a valer sozinha na saída.
- **Slide centralizado por margem automática, nunca por `justify-content: center`.**
  Com conteúdo mais alto que o palco, o `center` empurra o começo para fora da
  área rolável e o título fica inalcançável acima do topo. `margin-top: auto` no
  primeiro filho e `margin-bottom: auto` no último centralizam quando cabe e
  alinham ao topo quando não cabe.
- **Nenhum elemento focável fora do que está visível**: slide escondido ganha
  `aria-hidden` e os focáveis ganham `tabindex="-1"`, e o mesmo vale para o que
  ainda não foi revelado por *build* — opacidade zero não basta para o teclado.
- **O estado padrão de um `[data-build]` é ESCONDIDO**, por
  `:not([data-shown="true"])` no CSS e o mesmo seletor no JS. Com o negativo
  (`[data-shown="false"]`) o elemento nasce visível e some quando o JS marca —
  e um slide aberto direto num build adiantado pisca o conteúdo antes de
  escondê-lo. Justamente por isso a raiz do slide guarda o build em
  **`data-build-index`**, e não em `data-build`: são coisas diferentes — em que
  build o slide está, versus a partir de qual build o elemento aparece — e com
  o mesmo nome nos dois a regra pega o slide inteiro e a tela fica preta, sem
  erro nenhum no console.
- **Teste de apresentação afirma o que se VÊ**, não só o que existe. Toda
  asserção de geometria passa num slide com `opacity: 0`; o que denuncia é
  medir a opacidade computada da raiz e contar quantos nós de texto têm caixa
  na tela.
- **A URL acompanha por `location.replace`**, não `replaceState` — que lança
  `SecurityError` em `file://` no Chrome. A rota declara `ownsParam`, então trocar
  de passo não re-renderiza, e `onParam()` cobre a URL editada à mão. A URL numera
  **passos**, não slides: um build é endereçável.
- **Duração do morph é proporcional ao esforço** (`morph.duration`), entre
  `--duration-morph` e `--duration-morph-max`, somando distância em larguras de
  tela e troca de escala em oitavas. É o que reconcilia o movimento com o "motion
  curto e funcional" do `DESIGN_SYSTEM.md` §20.

### Catálogo

Cada entrada declara `tool` + `format`, e **`content` tem de ser válido para o próprio
formato** — um `codex-agents` com frontmatter é bug. `files[]` precisa conter o arquivo
de entrada que `formats.entryFileName()` deriva. `license: null` é renderizado como
"não informada", nunca omitido.

Coerência que a UI assume e que ninguém verifica em runtime: `tools.allowed` /
`tools.disallowed` e `flags.fork` têm de refletir o que o `content` realmente declara,
e `category` tem de existir em `CATEGORY_LABELS` (`catalog.js`) e `icon` em
`icons.js` — uma chave inexistente renderiza vazio, sem erro de console.

**Não existe métrica de uso.** Nada de downloads, likes ou "tendência": o app é
estático e não mede nada, então exibir número seria invenção. Destaque é curadoria
declarada no dado (`featured: true`) e a segunda seção da Home é `updatedAt`
descendente, já excluindo o que apareceu em destaque logo acima.

O card também não mostra data: `updatedAt` existe no dado e alimenta ordenação e a
seção de recentes, mas sumiu da linha do card por pedido. `ui.statRow`, `.stat-row` e
o ícone `calendar` foram removidos junto, porque ficaram sem consumidor.

### CSS

Sete camadas (`01-tokens` → `07-responsive`), na ordem de `DESIGN_SYSTEM.md` §23.
Nomes de componente são os do `design-system/` (`.btn`, `.card`, `.skill-card`,
`.chip`, `.badge`, `.stepper`, `.code-box`, `.risk`, `.toast`, `.field`), sem prefixo.
**Nenhum valor visual novo sem token equivalente** — hoje os 86 tokens estão todos em
uso e é assim que deve continuar. Cuidado ao varrer por token morto:
`--duration-morph` e `--duration-morph-max` são lidos pelo JS via
`getComputedStyle`, então um `grep` por `var(` não os encontra.

### Grid e flex: quem pode encolher

Duas armadilhas da mesma família, e as duas já custaram tempo aqui.

**Item de grid ou flex não encolhe abaixo do conteúdo** sem `min-width: 0` /
`min-height: 0`. É por isso que `.split > *`, `.grid > *`, `.builder__layout > *` e
`.builder__aside > *` têm `min-width: 0`: sem isso um `<pre>` largo estoura a coluna
em vez de rolar dentro dela.

**Linha de grid dimensionada por `auto` também não encolhe** — e `min-height: 0` no
filho não resolve, porque quem não cede é a linha. Foi o defeito do índice de seções
do Coding Styles: `.doc-index` era `display: grid` com `max-height`, o card respeitava
o limite, e a lista de 27 seções vazava para fora da janela com links inclicáveis
abaixo da dobra. Para uma coluna com uma região que rola, use **flex**:

```css
.doc-index      { display: flex; flex-direction: column; max-height: ...; }
.doc-index__list { flex: 1; min-height: 0; overflow-y: auto; }
```

`flex: 1` mais `min-height: 0` é o par que cria um contêiner de rolagem de verdade.

**Lista numerada tem duas armadilhas, e as duas já custaram tempo.** No
`.dialog__steps` do help de instalação:

- `display: grid` num `<li>` **substitui** `display: list-item`, e o número do
  marcador desaparece sem erro nenhum;
- e com o `<ol>` em `display: grid`, o `<li>` vira item de grid e deixa de
  encolher abaixo do conteúdo — a barra "Copiar" da code box estourava a coluna
  em 13 px a 390 px, o diálogo passava a rolar na horizontal e **cortava o
  texto** em vez de quebrar.

Para uma lista vertical, fluxo de bloco com `> li + li { margin-top }` resolve as
duas de uma vez: grid ali não acrescenta nada.
Com grid seria preciso declarar `grid-template-rows` com um `minmax(0, 1fr)` na linha
certa — frágil, porque a contagem de filhos muda (um filho `hidden` não cria linha).

### Chaves de `localStorage`

`skillhub.builder.draft.v1` · `skillhub.favorites.v1` · `skillhub.ui.v1`.
`core.js` migra as chaves `toko.*` antigas uma única vez. Descartar rascunho remove
**apenas** a chave do builder.

## 🎨 Regras visuais

- Tokens de `docs/DESIGN_SYSTEM.md` como fonte de verdade.
- Laranja quente só como destaque, nunca como cor dominante de grandes áreas.
- Fundo quase preto com subtom quente (não azulado).
- Card off-white como contraste editorial **pontual** — hoje há exatamente um, no
  bloco de comunidade da Home. Não espalhar.
- Bordas finas, cantos arredondados sem aparência "bubble", pouco shadow, separação
  por espaço e contraste.
- Evitar gradiente roxo, glassmorphism exagerado, estética genérica de SaaS.
- Ícones lineares em SVG inline (`SkillHub.icons`), `currentColor`.
- Motion curto e funcional; `prefers-reduced-motion` respeitado globalmente. A
  **única** animação contínua do app é o balanço lento dos doodles da
  apresentação — decorativa, só no slide visível, e nunca por opacidade ou troca
  de quadro, que é o que faz um desenho piscar ao lado de texto. Exceção
  deliberada, anotada no token `--duration-sway`.

## 🧭 Navegação

A sidebar contém, nesta ordem: Home, Claude Skills, Codex Skills, Prompt
Engineering, **Coding Styles**, Agentes, divisor, Skill Builder. **Não criar
Login, Dashboard, My Skills ou Account** — a proibição é de conceito de conta,
não de coleção.

Coding Styles é o sétimo item, posterior aos seis que `docs/PRD.md` §5 e
`docs/IMPLEMENTATION_GATES.md` fixam. Foi pedido explicitamente; os docs de
especificação não foram reescritos porque são registro do blueprint, e o estado
corrente é este arquivo.

A apresentação tem um **botão** no fim do menu (`.sidebar__cta`), e ele fica
deliberadamente **fora de `#main-nav`**: a navegação continua com exatamente os
seis itens, e o botão tem aparência própria. Mesmo assim carrega `data-route`,
porque `updateNav()` e o nome acessível de `setupSidebar()` agora selecionam
`.sidebar [data-route]` — qualquer alvo de rota na sidebar, e não só os links da
nav. Rota sem item de nav é normal e já havia precedente (`#/skill/<id>`).

Ao mexer no botão, lembre que o rótulo encolhe por **dois** mecanismos distintos:
`max-width: 0` no estado `[data-sidebar="collapsed"]`, e `display: none` na bitola
imposta pela media query de 1180px (onde o estado guardado não vale). Faltando um
dos dois, o botão estoura a coluna — foi o que aconteceu na primeira tentativa.

Rotas: `#/home`, `#/claude-skills`, `#/codex-skills`, `#/prompt-engineering`,
`#/coding-styles/<id>`, `#/agents`, `#/skill-builder`, `#/skill/<id>`,
`#/what-is-a-skill/<passo>`.

A última é posterior à ADR-002 e ao PRD §5, que enumeram sete. A ADR não foi
reescrita porque é registro histórico; o estado corrente é este.

## 🧠 JavaScript

- Código, nomes e comentários de estrutura em inglês; **UI em Português do Brasil**.
- O nome do produto em copy é "Skill Hub" (com espaço); `SkillHub` é só o namespace.
- Funções pequenas e coesas. **Não criar abstração para uso único** — um pub/sub sem
  assinante já foi removido daqui por essa razão.
- Estado do builder isolado num objeto serializável; **o DOM nunca é fonte de verdade**
  (ADR-007).
- Validar nas fronteiras: entrada do usuário e exportação.
- Nunca `eval`, `new Function`, ou execução de conteúdo de Skill.
- Serialização determinística com os nomes da ADR-008: `normalizeBuilderState`,
  `buildFrontmatter`, `buildSkillBody`, `buildSkillMarkdown`. Mesmo estado ⇒ mesmo
  arquivo, byte a byte.

⚠️ **Nunca escreva caracteres de controle literais dentro de regex.** Um
`[\x00-\x1f]` escrito com os bytes reais transforma o arquivo em "binário": `grep`,
`sed` e edição por string param de funcionar. Use escapes, ou checque por
`charCodeAt`.

## 🔐 Segurança

O navegador **nunca** executa conteúdo de Skill, visualizado ou importado. Tratar como
texto não confiável: Markdown e YAML de terceiros, comandos shell, conteúdo de
scripts, URLs do catálogo.

No Skill Builder, sinalizar com destaque: `allowed-tools` amplo; injeção dinâmica de
shell (`` !`cmd` `` **e** bloco ` ```! `); scripts anexados; `context: fork`; hooks;
permissões de Bash/PowerShell; carregamento automático do `AGENTS.md`; e campos que
reduzem portabilidade.

Score de risco e de portabilidade são heurísticos e **sempre explicam os fatores** —
nunca afirmam que algo é seguro. Risco nunca é comunicado só por cor: todo badge tem
texto e ícone.

## 📦 Exportação

Por formato, o builder produz no mínimo: preview do arquivo de entrada, copiar,
baixar, preview da estrutura e os caminhos de instalação reais daquela ferramenta.
ZIP só existe onde o formato tem diretório (`claude-skill`) — para um arquivo solto
não há pacote a compactar. Sem dependência externa para compactar.

Avisos **não** bloqueiam download; só erros bloqueantes bloqueiam.

### Instalar: caminhos são referência, passos são procedimento

`formats.js` tem as duas coisas, e a diferença importa:

- **`installPaths(id, name)`** → `{ key, value, hint }[]`, todos os lugares onde
  aquele formato pode morar. É **referência**, e aparece no bloco `Como instalar`
  do detalhe, no builder e na apresentação.
- **`installSteps(id, name)`** → `{ title, copy, code, codeLabel }[]`, o
  procedimento em ordem. É o que o help do detalhe abre, e `installStepsText()` é
  a mesma coisa em texto, para copiar.

Passo é **condicional, não fixo**: `placeholders` só entra quando a lista não é
vazia, o limite só quando o formato declara `maxLines`/`maxBytes`, e o passo de
acionamento **não existe** quando `autoLoaded` (o `AGENTS.md` não se invoca). É
por isso que o passo a passo tem tamanho diferente por formato, e o teste afirma
isso em vez de contar passos.

Nada de comportamento de CLI inventado: cada passo sai do que `formats.js` já
declara, e o resto manda ler o `docUrl`.

O help fica **fora do `.split`** em `pages/detail.js`, como irmão das duas
colunas: abaixo de 1180px o split vira uma coluna e o aside cai embaixo do main,
então um bloco dentro do main não seria o fim da página no celular.

## ✅ Definition of Done

- funciona sem login e sem backend;
- funciona via `file://` sem flags e em subpasta;
- zero erro de console (404 conta);
- navegação por teclado nos controles principais, foco visível;
- `prefers-reduced-motion` respeitado — e o que usa Web Animations API checa
  `matchMedia` na mão, porque o bloco global de CSS não o alcança;
- sem overflow horizontal de 360 a 1920 px;
- todo input tem label; todo botão tem nome acessível;
- a apresentação abre sem morph indesejado, sai sem deixar `data-deck` na shell e
  não altera a preferência da sidebar;
- nenhum caminho absoluto: quebra o Pages em `/skillhub/` sem quebrar o `localhost`;
- região que rola cabe na janela — item de grid com linha `auto` não encolhe;
- o builder gera arquivo válido **para o formato escolhido**;
- nenhum conteúdo de Skill é executado;
- código novo não duplica tokens/componentes existentes e não introduz `innerHTML`.
