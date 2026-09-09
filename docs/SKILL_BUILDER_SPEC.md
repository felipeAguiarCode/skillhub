# 🧩 Skill Builder — Especificação Claude Code

## 🎯 1. Objetivo

O Skill Builder deve transformar um formulário guiado em uma estrutura de Skill pronta para uso no Claude Code, reduzindo a necessidade de o usuário memorizar YAML, convenções de diretório e diferenças de portabilidade.

O builder **não executa a Skill**. Ele apenas gera, valida, visualiza e exporta arquivos.

---

## 📚 2. Base técnica

Claude Code descobre Skills em diretórios contendo `SKILL.md`.

Exemplos de localização:

```text
~/.claude/skills/<skill-name>/SKILL.md
.claude/skills/<skill-name>/SKILL.md
<plugin>/skills/<skill-name>/SKILL.md
```

A estrutura mínima é:

```text
my-skill/
└── SKILL.md
```

A estrutura pode incluir arquivos auxiliares:

```text
my-skill/
├── SKILL.md
├── reference.md
├── examples.md
├── templates/
│   └── template.md
└── scripts/
    └── helper.sh
```

---

## 🧭 3. Perfis de saída

### 🟠 Perfil A — Claude Code Full

Padrão do builder.

Permite campos e recursos específicos do Claude Code.

### 🌐 Perfil B — Portable Agent Skill

Usar quando a intenção for maximizar compatibilidade fora de Claude Code.

Nesse perfil, limitar o frontmatter ao conjunto portátil:

- `name`;
- `description`;
- `license`;
- `compatibility`;
- `metadata`;
- `allowed-tools`.

Se o usuário já preencheu campos específicos de Claude Code, mostrar aviso antes de mudar para Portable.

---

## 🪄 4. Wizard

### 1️⃣ Step 1 — Basic Info

Campos:

| Campo | Obrigatório | Regra |
|---|---|---|
| Directory name | ✅ | lowercase, números e hífens |
| Display name | ❌ | usado em `name` |
| Description | 🟠 recomendado | explicar o que faz e quando usar |
| Category | ❌ | metadata do marketplace |
| Tags | ❌ | metadata do marketplace |
| Target | ✅ | project / personal / plugin / portable |

#### Validação do diretório

Regex recomendada para o builder:

```text
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

### Preview

```text
Command: /my-skill
Project path: .claude/skills/my-skill/SKILL.md
Personal path: ~/.claude/skills/my-skill/SKILL.md
```

---

### 2️⃣ Step 2 — Invocation

Campos Claude Code Full:

- `when_to_use`;
- `argument-hint`;
- `arguments`;
- `disable-model-invocation`;
- `user-invocable`.

#### UX para `disable-model-invocation`

Label amigável:

```text
Claude pode invocar automaticamente
```

Mapeamento:

```text
ON  -> não emitir disable-model-invocation
OFF -> disable-model-invocation: true
```

#### UX para `user-invocable`

Label:

```text
Mostrar no menu / e permitir invocação manual
```

Mapeamento:

```text
ON  -> não emitir user-invocable ou emitir true
OFF -> user-invocable: false
```

### Conflito visual

Se:

```text
disable-model-invocation: true
user-invocable: false
```

mostrar warning forte porque a Skill fica difícil/impossível de acionar pelos fluxos normais.

---

### 3️⃣ Step 3 — Tools & Execution

Campos possíveis no perfil Claude Code Full:

- `allowed-tools`;
- `disallowed-tools`;
- `model`;
- `effort`;
- `context`;
- `agent`;
- `background`;
- `paths`;
- `shell`;
- `hooks` avançado.

### 🧰 Tool picker

O picker deve aceitar tokens de ferramenta como texto, por exemplo:

```text
Read
Grep
Glob
Bash(git status *)
Bash(${CLAUDE_SKILL_DIR}/scripts/helper.sh *)
```

Não tentar “validar” todas as ferramentas possíveis por lista fixa. Usar sugestões, mas permitir entrada manual.

### 🚨 Risco

Aumentar risco quando houver:

- `Bash(...)`;
- PowerShell;
- allow amplo;
- scripts;
- hooks;
- comandos destrutivos no corpo.

---

### 4️⃣ Step 4 — Instructions

O corpo do `SKILL.md` deve ser editável como Markdown.

Template inicial sugerido:

```markdown
# 🎯 Goal

Describe the task this skill should accomplish.

## 🧭 Workflow

1. Inspect the relevant context.
2. Perform the requested task.
3. Validate the result.

## ✅ Quality checks

- Keep the output focused.
- Verify assumptions against available files.
- Report blockers instead of inventing missing information.
```

### Regras editoriais

- preferir instruções imperativas;
- evitar longas explicações conceituais;
- colocar detalhes extensos em arquivos auxiliares;
- incentivar `SKILL.md` conciso;
- permitir `$ARGUMENTS`, `$0`, `$1`, argumentos nomeados e variáveis `${CLAUDE_*}` quando o perfil for Claude Code Full.

---

### 5️⃣ Step 5 — Supporting Files

Tipos sugeridos:

- referência;
- exemplo;
- template;
- script;
- texto genérico.

Modelo interno:

```javascript
{
  path: "reference.md",
  type: "reference",
  content: "..."
}
```

Regras:

- impedir `../`;
- impedir caminho absoluto;
- impedir nomes vazios;
- normalizar `\\` para `/` na visualização;
- impedir colisão com `SKILL.md`;
- tratar conteúdo como texto.

---

### 6️⃣ Step 6 — Review & Validate

A tela deve possuir quatro regiões:

1. resumo;
2. árvore de arquivos;
3. preview `SKILL.md`;
4. painel de validação.

#### Erros bloqueantes

- directory name inválido;
- `SKILL.md` vazio;
- frontmatter mal formado gerado internamente;
- path auxiliar inseguro;
- arquivo duplicado.

#### Warnings

- descrição vazia;
- Skill muito longa;
- permissões shell;
- `allowed-tools` muito amplo;
- `!` dynamic shell context;
- scripts anexados;
- conflito de invocação;
- campos Claude Code-only no modo Portable;
- referências a arquivo auxiliar inexistente.

---

### 7️⃣ Step 7 — Export

Ações:

- copiar `SKILL.md`;
- download `SKILL.md`;
- download ZIP;
- copiar path de instalação;
- copiar árvore;
- novo projeto.

#### Instalação por projeto

```text
.claude/skills/<skill-name>/SKILL.md
```

#### Instalação pessoal

```text
~/.claude/skills/<skill-name>/SKILL.md
```

#### Plugin

```text
<plugin>/skills/<skill-name>/SKILL.md
```

---

## 📝 5. Frontmatter Claude Code Full

O builder deve conhecer estes campos:

| Campo | Tipo visual | Nota |
|---|---|---|
| `name` | text | display name opcional |
| `description` | textarea | recomendado |
| `when_to_use` | textarea | gatilhos extras |
| `argument-hint` | text | autocomplete |
| `arguments` | tags | argumentos posicionais nomeados |
| `disable-model-invocation` | toggle | bloqueia auto-invocação |
| `user-invocable` | toggle | controla menu `/` |
| `allowed-tools` | tags/editor | pré-aprovação no turno |
| `disallowed-tools` | tags/editor | remove ferramentas no turno |
| `model` | text/select | override de modelo |
| `effort` | select | low/medium/high/xhigh/max |
| `context` | select | `fork` quando usado |
| `agent` | text/select | agente do fork |
| `background` | toggle | comportamento do fork |
| `hooks` | YAML editor avançado | opcional |
| `paths` | tags | globs de ativação |
| `shell` | select | bash/powershell |
| `metadata` | key-value | mapa livre |
| `license` | text | licença |
| `compatibility` | textarea | requisitos de ambiente |

---

## 🧾 6. Serialização YAML

### Regra geral

Não emitir campos vazios.

### Strings simples

```yaml
name: api-reviewer
```

### Strings com caracteres problemáticos

Usar aspas JSON-style para simplificar serialização segura:

```yaml
description: "Review API changes: contracts, errors, and versioning."
```

### Booleanos

```yaml
disable-model-invocation: true
```

### Arrays

Preferir YAML list para legibilidade:

```yaml
allowed-tools:
  - Read
  - Grep
  - "Bash(git status *)"
```

### Metadata

```yaml
metadata:
  category: development
  marketplace: toko
```

---

## 🧪 7. Exemplo de saída simples

```markdown
---
name: api-reviewer
description: "Review API changes against project conventions. Use when the user asks for an API review or before shipping endpoint changes."
allowed-tools:
  - Read
  - Grep
---

# 🎯 Goal

Review API changes for consistency, correctness, and maintainability.

## 🧭 Workflow

1. Read the changed API files.
2. Compare routes, payloads, error formats, and versioning.
3. Identify breaking changes.
4. Report findings by severity.

## ✅ Quality checks

- Cite concrete files or code locations.
- Distinguish confirmed issues from suggestions.
- Do not invent project conventions that are not present.
```

---

## ⚙️ 8. Exemplo com argumentos

```markdown
---
name: fix-issue
description: "Fix a tracked issue by number. Use when the user wants a specific issue implemented."
argument-hint: "[issue-number]"
arguments:
  - issue
disable-model-invocation: true
---

Fix issue $issue.

1. Read the issue context supplied by the user or project tools.
2. Inspect the relevant code.
3. Implement the smallest correct change.
4. Validate the result.
```

---

## ⚡ 9. Dynamic context injection

Claude Code pode interpretar linhas shell dinâmicas no corpo da Skill usando sintaxe própria.

O builder deve:

- permitir esse conteúdo apenas em modo Claude Code Full;
- mostrar warning;
- destacar visualmente a linha;
- nunca executar o comando no browser.

Exemplo tratado apenas como texto:

```markdown
## Current changes

!`git diff HEAD`
```

---

## 🧠 10. Score de portabilidade

### 100 — portátil

Apenas campos do padrão portátil e Markdown genérico.

### 70–99 — quase portátil

Corpo contém placeholders específicos, mas frontmatter é portátil.

### 30–69 — Claude Code específico

Campos como `context`, `paths`, `shell`, `arguments`, `user-invocable`.

### 0–29 — altamente específico

Hooks, dynamic shell injection, scripts dependentes de ambiente e campos específicos combinados.

O score deve explicar fatores, não apenas exibir número.

---

## 🛡️ 11. Score de risco

Pontuação sugerida:

```text
+1 allowed-tools definido
+2 Bash ou PowerShell
+2 script auxiliar
+2 dynamic shell injection
+1 context: fork
+2 hook
+2 comando destrutivo detectado
+1 URL externa em script
```

Classificação:

```text
0–1  baixo
2–4  moderado
5+   elevado
```

---

## 💾 12. Rascunho local

Salvar automaticamente:

```text
toko.builder.draft.v1
```

Dados:

- step atual;
- campos;
- arquivos auxiliares textuais;
- data da última alteração.

Ações:

- continuar rascunho;
- descartar;
- reiniciar.

---

## 📦 13. ZIP

A estrutura do ZIP deve preservar diretório raiz:

```text
my-skill.zip
└── my-skill/
    ├── SKILL.md
    └── ...
```

No MVP, o ZIP pode usar entradas sem compressão desde que seja um ZIP válido e gerado em JavaScript puro.

---

## 🚫 14. O que o builder não deve fazer

- executar a Skill;
- validar se comandos shell são realmente seguros;
- solicitar credenciais;
- instalar arquivos no computador;
- escrever em `.claude/skills/` diretamente;
- afirmar que uma Skill é “segura” de forma absoluta;
- publicar em servidor inexistente.

---

## ✅ 15. Critérios de aceite

- [ ] wizard possui 7 passos;
- [ ] stepper funciona por teclado;
- [ ] draft persiste em reload;
- [ ] nome é validado;
- [ ] perfil Portable oculta/sinaliza campos exclusivos;
- [ ] `SKILL.md` é gerado determinísticamente;
- [ ] preview usa texto seguro;
- [ ] risco é explicado;
- [ ] portabilidade é explicada;
- [ ] arquivos auxiliares não aceitam path traversal;
- [ ] download de `SKILL.md` funciona;
- [ ] ZIP funciona no gate correspondente;
- [ ] nenhum conteúdo da Skill é executado.

---

## 🔗 16. Referências oficiais

- Claude Code Skills: `https://code.claude.com/docs/en/skills`
- Claude Code directory: `https://code.claude.com/docs/en/claude-directory`

A implementação deve conferir a documentação oficial antes de ampliar campos do builder em releases futuras.
