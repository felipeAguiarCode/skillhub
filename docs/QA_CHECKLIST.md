# 🧪 QA Checklist — Toko

## 🧭 Navegação

- [ ] Home abre corretamente.
- [ ] Claude Skills abre corretamente.
- [ ] Codex Skills abre corretamente.
- [ ] Prompt Engineering abre corretamente.
- [ ] Agentes abre corretamente.
- [ ] Skill Builder abre corretamente.
- [ ] `aria-current` acompanha a rota.
- [ ] voltar/avançar do navegador funciona.
- [ ] reload preserva rota hash.

## 🎨 Visual

- [ ] fundo usa tom escuro quente.
- [ ] accent principal é laranja.
- [ ] cards off-white são usados com moderação.
- [ ] não há gradiente roxo.
- [ ] radius é consistente.
- [ ] bordas são discretas.
- [ ] hierarquia tipográfica está clara.
- [ ] ícones seguem linguagem linear.
- [ ] layout está coerente em 768, 1024, 1440 e 1920 px.

## ♿ Acessibilidade

- [ ] todos os controles são alcançáveis via Tab.
- [ ] foco é visível.
- [ ] labels estão associados a inputs.
- [ ] botões usam `<button>`.
- [ ] links usam `<a>`.
- [ ] mensagens de erro não dependem só de cor.
- [ ] `prefers-reduced-motion` funciona.
- [ ] toast usa região `aria-live`.

## 🔍 Catálogo

- [ ] busca por nome funciona.
- [ ] busca por descrição funciona.
- [ ] busca por tag funciona.
- [ ] filtros combinam corretamente.
- [ ] ordenação funciona.
- [ ] resultado vazio possui estado apropriado.
- [ ] conteúdo inesperado não quebra card.
- [ ] URLs são tratadas com cuidado.

## 📄 Detalhe de Skill

- [ ] preview usa `textContent` ou equivalente seguro.
- [ ] botão copiar funciona.
- [ ] árvore de arquivos reflete dados.
- [ ] badges de risco são exibidos.
- [ ] scripts não são executados.
- [ ] comandos shell não são executados.
- [ ] ausência de licença é explicitada como desconhecida.

## 🪄 Skill Builder — Básico

- [ ] nome vazio é rejeitado.
- [ ] nome com espaço é rejeitado.
- [ ] nome com uppercase é rejeitado ou normalizado de forma explícita.
- [ ] kebab-case válido é aceito.
- [ ] preview `/skill-name` atualiza.
- [ ] descrição vazia gera warning, não crash.

## 🧭 Skill Builder — Invocação

- [ ] `when_to_use` serializa corretamente.
- [ ] `argument-hint` serializa corretamente.
- [ ] argumentos aparecem no preview.
- [ ] auto-invocação OFF gera `disable-model-invocation: true`.
- [ ] user-invocable OFF gera `user-invocable: false`.
- [ ] combinação que remove ambas as formas de invocação gera warning.

## 🧰 Skill Builder — Tools

- [ ] tool simples é serializada.
- [ ] `Bash(...)` aumenta score de risco.
- [ ] PowerShell aumenta score de risco.
- [ ] `allowed-tools` aceita múltiplos valores.
- [ ] `disallowed-tools` aceita múltiplos valores.
- [ ] shell não é executado.

## ✍️ Skill Builder — Instructions

- [ ] conteúdo Markdown é preservado.
- [ ] `$ARGUMENTS` é preservado como texto.
- [ ] `$0`/`$1` são preservados como texto.
- [ ] `${CLAUDE_SKILL_DIR}` é preservado como texto.
- [ ] `!` shell injection é apenas destacado, nunca executado.
- [ ] corpo vazio é tratado corretamente.

## 📁 Skill Builder — Arquivos

- [ ] `reference.md` funciona.
- [ ] nested path como `templates/template.md` funciona.
- [ ] `../secret` é bloqueado.
- [ ] `/absolute/path` é bloqueado.
- [ ] `SKILL.md` duplicado é bloqueado.
- [ ] arquivo duplicado é bloqueado.
- [ ] conteúdo de script é tratado como texto.

## 🌐 Portabilidade

- [ ] modo Claude Code Full mostra campos avançados.
- [ ] modo Portable restringe frontmatter.
- [ ] mudança de Full para Portable informa perdas.
- [ ] score de portabilidade explica fatores.

## 🛡️ Risco

- [ ] Skill sem ferramentas = baixo risco aparente.
- [ ] Bash = fator explicado.
- [ ] script auxiliar = fator explicado.
- [ ] dynamic shell injection = fator explicado.
- [ ] hooks = fator explicado.
- [ ] classificação nunca afirma segurança absoluta.

## 💾 localStorage

- [ ] rascunho salva após edição.
- [ ] reload recupera rascunho.
- [ ] descartar limpa apenas a chave do builder.
- [ ] JSON corrompido não quebra a aplicação.
- [ ] nenhum segredo é armazenado.

## 📦 Exportação

- [ ] copiar `SKILL.md` funciona.
- [ ] download `SKILL.md` funciona.
- [ ] nome de arquivo é seguro.
- [ ] ZIP abre sem erro.
- [ ] ZIP contém diretório raiz.
- [ ] conteúdo exportado coincide com preview.
- [ ] UTF-8 é preservado.

## 🔐 Segurança

- [ ] nenhum uso de `eval`.
- [ ] nenhum uso de `new Function`.
- [ ] nenhum script importado é injetado na página.
- [ ] nenhum comando shell é executado.
- [ ] conteúdo de terceiros não entra em `innerHTML` sem tratamento.
- [ ] links externos usam protocolo permitido.
- [ ] não há token/chave no source.

## ⚡ Performance

- [ ] não existem listeners duplicados após navegar várias vezes.
- [ ] filtros respondem instantaneamente em catálogo pequeno/médio.
- [ ] animações usam preferencialmente transform/opacity.
- [ ] imagens de referência não são carregadas na aplicação final sem necessidade.

## ✅ Release smoke test

- [ ] abrir Home.
- [ ] buscar uma Skill.
- [ ] filtrar por categoria.
- [ ] abrir detalhe.
- [ ] copiar `SKILL.md`.
- [ ] abrir Skill Builder.
- [ ] criar uma Skill simples.
- [ ] recarregar e recuperar draft.
- [ ] finalizar e baixar.
- [ ] abrir arquivo baixado.
- [ ] confirmar zero erro no console.
