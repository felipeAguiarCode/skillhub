# 🏛️ ADR — Arquitetura do Toko

## 📌 ADR-001 — Aplicação 100% estática

### Status

✅ Aceito

### Contexto

O produto precisa ser simples de executar, fácil de hospedar e não terá login, backend ou banco de dados.

### Decisão

Construir a aplicação somente com:

- HTML;
- CSS;
- JavaScript puro;
- arquivos de dados JavaScript estáticos;
- `localStorage` para estado local não sensível.

### Consequências

**Positivas**

- deploy simples;
- custo operacional praticamente zero;
- pouca superfície de ataque;
- baixa complexidade;
- código facilmente editável com Claude Code.

**Negativas**

- não existe publicação dinâmica no catálogo;
- não existe sincronização entre dispositivos;
- métricas e comunidade exigem solução futura externa.

---

## 📌 ADR-002 — SPA estática com hash routing

### Status

✅ Aceito

### Contexto

Precisamos navegar por seis seções sem depender de servidor com rewrite rules.

### Decisão

Usar uma única página HTML principal e roteamento por hash:

```text
#/home
#/claude-skills
#/codex-skills
#/prompt-engineering
#/agents
#/skill-builder
#/skill/<id>
```

### Por quê

Hash routing funciona:

- em hospedagem estática;
- em subpastas;
- sem configuração de servidor;
- com abertura local via `file://`.

### Consequência

A camada de renderização JavaScript precisa ser simples e bem organizada para evitar que a SPA vire um arquivo monolítico.

---

## 📌 ADR-003 — Sem framework e sem build step

### Status

✅ Aceito

### Decisão

Não usar:

- React;
- Vue;
- Angular;
- Svelte;
- Tailwind;
- Sass como requisito;
- TypeScript;
- bundlers;
- npm como requisito de runtime.

### Padrão de código

Organizar JavaScript por responsabilidade, usando IIFEs ou namespaces simples quando necessário.

Evitar ES modules no core do protótipo se a meta for suportar abertura via `file://` em navegadores que imponham restrições a módulos locais.

---

## 📌 ADR-004 — Catálogo como dados JavaScript estáticos

### Status

✅ Aceito

### Contexto

`fetch()` de JSON pode ter comportamento problemático quando o usuário abre a página diretamente com `file://`.

### Decisão

Carregar o catálogo como script:

```html
<script src="assets/js/catalog-data.js"></script>
```

O arquivo expõe:

```javascript
window.TOKO_CATALOG = [];
```

### Consequências

- funciona sem servidor local;
- conteúdo continua separado do renderizador;
- edição manual do catálogo é simples;
- um pipeline futuro pode gerar esse arquivo automaticamente.

---

## 📌 ADR-005 — Design tokens em CSS Custom Properties

### Status

✅ Aceito

### Decisão

Toda decisão visual recorrente deve nascer de tokens CSS.

Exemplo:

```css
:root {
  --color-bg: #0d0c0b;
  --color-surface: #161310;
  --color-accent: #ff5d3a;
  --radius-card: 16px;
  --space-4: 16px;
}
```

### Consequência

Novos componentes não devem introduzir valores visuais aleatórios quando existe token equivalente.

---

## 📌 ADR-006 — Componentes via classes CSS e helpers JS

### Status

✅ Aceito

### Decisão

Sem framework, o sistema de componentes será composto por:

- markup semântico;
- classes CSS reutilizáveis;
- funções JS pequenas para renderização quando necessário;
- `data-*` attributes para comportamento.

### Exemplo

```html
<button class="btn btn--primary" data-action="builder-next">
  Próximo
</button>
```

---

## 📌 ADR-007 — Skill Builder como máquina de estado simples

### Status

✅ Aceito

### Decisão

O builder deve manter um único estado serializável:

```javascript
const builderState = {
  step: 1,
  profile: "claude-code-project",
  metadata: {},
  invocation: {},
  execution: {},
  instructions: {},
  files: []
};
```

Mudanças no formulário atualizam o estado; o preview é derivado desse estado.

### Persistência

Salvar o rascunho em `localStorage` com debounce.

### Regra

Nunca usar o DOM como fonte de verdade do builder.

---

## 📌 ADR-008 — Geração de SKILL.md por serialização determinística

### Status

✅ Aceito

### Decisão

Criar funções dedicadas:

```text
normalizeBuilderState()
validateBuilderState()
buildFrontmatter()
buildSkillBody()
buildSkillMarkdown()
```

A saída deve ser determinística: o mesmo estado produz o mesmo arquivo.

### Motivo

Isso simplifica testes manuais, debugging e futura adoção de testes automatizados.

---

## 📌 ADR-009 — Perfis de compatibilidade no builder

### Status

✅ Aceito

### Decisão

O builder terá dois modos conceituais:

### 🟠 Claude Code Full

Pode expor campos específicos do Claude Code, como:

- `when_to_use`;
- `argument-hint`;
- `arguments`;
- `disable-model-invocation`;
- `user-invocable`;
- `disallowed-tools`;
- `model`;
- `effort`;
- `context`;
- `agent`;
- `background`;
- `hooks`;
- `paths`;
- `shell`.

### 🌐 Portable Agent Skill

Limitar frontmatter ao subconjunto portátil aceito pelo padrão/fluxos de upload:

- `name`;
- `description`;
- `license`;
- `compatibility`;
- `metadata`;
- `allowed-tools`.

### UX

Quando o usuário muda de Claude Code Full para Portable, campos não portáveis devem ser sinalizados antes de serem removidos/ignorados.

---

## 📌 ADR-010 — Conteúdo de Skill nunca é executado

### Status

✅ Aceito

### Decisão

A aplicação é um **browser/editor**, não um runtime.

É proibido:

- `eval`;
- `new Function`;
- execução de shell;
- carregamento de scripts de uma Skill no contexto da página;
- iframe executável de conteúdo importado;
- execução automática de URLs/comandos.

### Renderização

Conteúdo importado deve ser tratado como texto.

---

## 📌 ADR-011 — Score local de risco

### Status

✅ Aceito

### Decisão

Calcular um score local, explicável e não “inteligente”.

Exemplo de regras:

- +1: `allowed-tools` definido;
- +2: Bash ou PowerShell;
- +2: scripts anexados;
- +2: `!` shell injection;
- +1: `context: fork`;
- +2: comandos destrutivos detectados em texto;
- +1: URL externa em script.

Classificação:

- 0–1: baixo;
- 2–4: moderado;
- 5+: elevado.

O score é informativo e não substitui revisão humana.

---

## 📌 ADR-012 — Exportação por Blob

### Status

✅ Aceito

### Decisão

Arquivos individuais devem ser exportados com `Blob` + `URL.createObjectURL()`.

Para o pacote ZIP, implementar um writer ZIP mínimo em JavaScript puro no gate de exportação, ou manter download de arquivos individuais até esse gate ser aprovado.

### Restrição

Não adicionar dependência externa obrigatória apenas para compactação.

---

## 📌 ADR-013 — localStorage apenas para dados não sensíveis

### Status

✅ Aceito

### Chaves sugeridas

```text
toko.builder.draft.v1
toko.favorites.v1
toko.ui.v1
```

### Não armazenar

- tokens;
- chaves de API;
- cookies de autenticação;
- credenciais;
- conteúdo secreto.

---

## 📌 ADR-014 — Sem publicação direta no catálogo

### Status

✅ Aceito

### Contexto

Sem backend, o browser não consegue alterar o catálogo canônico do site.

### Decisão

No MVP, o botão “Compartilhar/Publicar” deve:

- explicar a limitação;
- permitir exportar o pacote;
- opcionalmente apontar para uma futura contribuição via GitHub.

Não simular publicação bem-sucedida em servidor.

---

## 📌 ADR-015 — Estrutura de arquivos sugerida

```text
prototype/
├── index.html
└── assets/
    ├── css/
    │   └── app.css
    └── js/
        ├── catalog-data.js
        └── app.js
```

Na implementação final, Claude Code pode separar `app.js` em arquivos menores se isso melhorar manutenção, desde que continue sem build step.

---

## 📌 ADR-016 — Acessibilidade como requisito arquitetural

### Status

✅ Aceito

### Decisão

Componentes interativos devem nascer acessíveis, não receber correção apenas no final.

Regras mínimas:

- elementos semânticos;
- foco visível;
- teclado;
- labels;
- `aria-current`;
- estados `aria-expanded` quando aplicável;
- `prefers-reduced-motion`.

---

## 📌 ADR-017 — Fonte de verdade documental

### Status

✅ Aceito

Em caso de conflito:

1. `docs/ADR.md` define decisões técnicas;
2. `docs/PRD.md` define comportamento do produto;
3. `docs/DESIGN_SYSTEM.md` define visual;
4. `docs/SKILL_BUILDER_SPEC.md` define geração/validação de Skills;
5. `docs/IMPLEMENTATION_GATES.md` define sequência de implementação;
6. `CLAUDE.md` define como Claude Code deve trabalhar no repositório.
