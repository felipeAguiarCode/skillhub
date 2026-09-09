# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 🤖 Skill Hub

Marketplace gratuito e estático de Skills para **Claude Code** e **Codex**, com um
Skill Builder em wizard. O produto se chama **Skill Hub** (`skill-hub`); os
documentos em `docs/` ainda usam o nome de trabalho original, *Toko* — é a mesma
coisa.

## 📍 Onde o código vive

Três árvores, e só uma é o produto:

| Caminho | O que é |
|---|---|
| `index.html` + `assets/` | **O aplicativo.** É aqui que se mexe. |
| `prototype/` | Protótipo original do blueprint. **Referência histórica — não editar.** |
| `design-system/` | Vitrine de tokens/componentes do blueprint. **Referência — não editar.** |
| `docs/` | Especificação (PRD, ADR, Design System, Spec do Builder, Gates, QA). |
| `reference/concept-ui.png` | Conceito visual de 6 frames. |

O app está **completo** (gates 1 a 8 de `docs/IMPLEMENTATION_GATES.md`). Não há
gate pendente; trate pedidos novos como evolução, não como continuação da
sequência de gates.

## ▶️ Executar e verificar

Não existe build, npm, bundler nem lint configurado — isso é deliberado (ADR-003).

```bash
# Rodar: qualquer uma das três formas funciona
#  1. abrir index.html direto (file:// tem de funcionar, sem flags)
python -m http.server 8000     #  2. servidor estático local
#  3. qualquer host de arquivos estáticos

# Checar sintaxe de um arquivo (Node é conveniência de dev, não dependência)
node --check assets/js/pages/builder.js
for f in $(find assets/js -name '*.js'); do node --check "$f" || echo "FAIL $f"; done
```

**Não há suíte de testes no repositório.** A verificação é manual e dirigida por
`docs/QA_CHECKLIST.md`, que é a superfície de aceite. O que funciona sem instalar
nada:

- **Screenshot headless** para conferir visual:
  `chrome --headless=new --window-size=1440,1400 --virtual-time-budget=4000 --screenshot=out.png "http://127.0.0.1:8000/#/claude-skills"`
  Use um `--user-data-dir` novo a cada captura: o perfil persistente **cacheia o CSS**
  e você vai fotografar a versão anterior.
- **Teste interativo** via DevTools Protocol: subir o Chrome com
  `--remote-debugging-port=9222` e dirigir por WebSocket (o Node 22 já tem
  `WebSocket` e `fetch` globais, então dá para automatizar sem npm). É assim que se
  capturam erros de console de verdade (`Runtime.exceptionThrown`, `Log.entryAdded`).
- Ao testar `AGENTS.md`/ZIP no Windows, confira a extração em **duas** ferramentas
  (`Expand-Archive` e o leitor do Explorer) — elas discordam sobre ZIPs malformados.

Duas armadilhas de automação que já custaram tempo: `Page.navigate` para uma URL que
só difere no hash **não recarrega** a página (estado em memória vaza entre testes,
use `about:blank` no meio); e atribuir `location.hash` por script **sem gesto do
usuário** é convertido em *replace* pelo Chrome, então testar voltar/avançar exige
clique real via `Input.dispatchMouseEvent`.

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
  de criar CSS de página.
- **`catalog.js`** — busca, facetas, filtros por rota, ordenação.
- **`data/*.js`** — o catálogo em si, dividido em arquivos por coleção (nenhum deles
  grande demais para ler de uma vez). Cada um faz
  `window.SKILL_HUB_CATALOG = (window.SKILL_HUB_CATALOG || []).concat([...])`, então
  a ordem entre eles não importa — só precisam vir **antes** de `catalog.js` no
  `index.html`. Para acrescentar uma coleção, crie `data/<nome>.js` e registre a tag.
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
- **`deck/`** — a apresentação `#/what-is-a-skill`: `camera` (matemática pura de
  enquadramento, testável sem navegador), `steps` (os 20 passos como dado).
  `pages/deck.js` orquestra. Ver a seção da apresentação abaixo.
- **`zip.js`** — writer ZIP store-only em JS puro. Entradas de diretório explícitas e
  bit 11 de UTF-8 são o que faz o arquivo abrir no Explorer do Windows.

### `SkillHub.dom` proíbe `innerHTML` por construção

`el(tag, props, children)` não tem `props.html`. String em `children` sempre vira
`createTextNode`. `props.style` só aceita objeto e existe apenas para valores
calculados em runtime — estilo estático vive no CSS. Toda URL de catálogo passa por
`dom.safeHref()`, que rejeita tudo fora de `http:`/`https:`/`mailto:`.

Consequência prática: **o código novo não deve introduzir `innerHTML`.** Hoje há zero
usos reais no app. A varredura precisa excluir dois falsos positivos, que são
menção e não uso — o guia `vanilla-web` tem uma seção sobre nunca usar `innerHTML`,
e `markdown.js` cita a proibição no cabeçalho:

```bash
grep -rn "innerHTML" index.html assets/   | grep -v "assets/js/data/coding-styles.js"   | grep -v "assets/js/markdown.js:"
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

A coleção `#/coding-styles` lista guias de estilo por stack, em cards, e
`#/coding-styles/<id>` abre o guia com índice de seções.

**A fonte não está aqui.** Os guias vivem em `~/.claude/coding-styles/`, um
arquivo Markdown por stack, porque valem entre projetos. O navegador não lê
aquele caminho e o app não faz `fetch` (ADR-004), então o texto entra como dado
estático gerado:

```bash
node tools/gen-coding-styles.js
```

O gerador copia byte a byte e confere o resultado carregando o que escreveu — se
divergir, ele falha em vez de gravar. `assets/js/data/coding-styles.js` é
**gerado**: editar à mão é perder a mudança na próxima geração. Para acrescentar
um guia, escreva o `.md` na pasta de origem e registre os metadados de card
(`icon`, `tags`, `eyebrow`, `summary`) na lista `GUIDES` do gerador.

A contagem de seções de cada card é derivada do texto em runtime, não gravada
pelo gerador — número fixo envelheceria em silêncio quando o guia mudasse.

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

### Apresentação: um canvas, uma câmera, um modo

`#/what-is-a-skill` é uma apresentação de 20 passos no estilo Prezi: todos os
quadros vivem num canvas e a câmera voa entre eles.

**A decisão que sustenta o resto:** o quadro tem o tamanho da área útil, então um
passo que enquadra um quadro inteiro cai em **escala exatamente 1**. Em repouso a
apresentação é uma página responsiva comum, e a câmera só acrescenta o movimento.
É isso que a deixa legível a 360px sem um segundo renderizador, e que mantém o
texto nítido — a maioria dos voos é translação pura, e os passos de conteúdo ficam
a 1:1. `layout()` recalcula `--deck-frame-w/h` a cada resize; o teste afirma
`k ≈ 1` em quatro larguras, e é essa asserção que denuncia se o desenho quebrou.

Consequências práticas:

- **Alvo de câmera é sempre um nó do DOM**, medido pela cadeia de `offsetParent`
  (valor de layout, que o transform do ancestral não afeta — `getBoundingClientRect`
  tornaria a medida circular). O canvas precisa continuar `position: absolute`,
  senão a cadeia passa direto por ele e a medida sai errada em silêncio. Nada de
  `display: contents` nem de `vw`/`vh` dentro do canvas.
- **Os trechos do `SKILL.md` são agrupados por TEXTO, não por índice de linha.**
  O arquivo vem de `catalog.byId('api-reviewer')` em runtime; casar por texto é o
  que faz o zoom sobreviver a uma edição no catálogo.
- **`render()` devolve árvore destacada.** Medir só funciona dentro de um
  `requestAnimationFrame`, e a transição da câmera entra um frame depois do
  primeiro enquadramento — senão a apresentação abre com um voo indesejado.
- **`data-deck` na shell é posto dentro desse rAF, antes de medir** (é ele que
  torna `.page` um contêiner flex, e sem isso o viewport tem altura zero), com
  `try/catch` que o remove se algo lançar. Sem isso uma exceção deixaria a
  sidebar recolhida sem rota nenhuma que chamasse o `teardown`.
- **A apresentação nunca escreve em `skillhub.ui.v1`.** Ela só põe e tira
  `data-deck`; a preferência real da sidebar volta a valer sozinha na saída. O
  botão de recolher fica escondido justamente para que não haja caminho de
  gravação.
- **Nenhum quadro contém elemento focável fora do passo atual**: quadro escondido
  ganha `aria-hidden` e os focáveis ganham `tabindex="-1"`, removido ao virar o
  atual (são links nossos, sem tabindex de autor).
- **A URL acompanha por `location.replace`**, não `replaceState` — que lança
  `SecurityError` em `file://` no Chrome. A rota declara `ownsParam`, então trocar
  de passo não re-renderiza, e `onParam()` cobre a URL editada à mão.
- **Duração do voo é proporcional à distância** (`camera.flightDuration`), entre
  `--duration-camera` e `--duration-camera-max`. É o que reconcilia o movimento de
  câmera com o "motion curto e funcional" do `DESIGN_SYSTEM.md` §20: zoom curto
  fica no piso, só travessia entre capítulos chega ao teto.

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

### CSS

Sete camadas (`01-tokens` → `07-responsive`), na ordem de `DESIGN_SYSTEM.md` §23.
Nomes de componente são os do `design-system/` (`.btn`, `.card`, `.skill-card`,
`.chip`, `.badge`, `.stepper`, `.code-box`, `.risk`, `.toast`, `.field`), sem prefixo.
**Nenhum valor visual novo sem token equivalente** — hoje os 86 tokens estão todos em
uso e é assim que deve continuar. Cuidado ao varrer por token morto: `--deck-inset`,
`--duration-camera` e `--duration-camera-max` também são lidos pelo JS via
`getComputedStyle`, então um `grep` por `var(` não os encontra.

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
- Motion curto e funcional; `prefers-reduced-motion` respeitado globalmente.

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

## ✅ Definition of Done

- funciona sem login e sem backend;
- funciona via `file://` sem flags e em subpasta;
- zero erro de console (404 conta);
- navegação por teclado nos controles principais, foco visível;
- `prefers-reduced-motion` respeitado;
- sem overflow horizontal de 360 a 1920 px;
- todo input tem label; todo botão tem nome acessível;
- a apresentação abre sem voo indesejado, sai sem deixar `data-deck` na shell e
  não altera a preferência da sidebar;
- o builder gera arquivo válido **para o formato escolhido**;
- nenhum conteúdo de Skill é executado;
- código novo não duplica tokens/componentes existentes e não introduz `innerHTML`.
