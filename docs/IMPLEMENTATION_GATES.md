# 🚧 Plano de Implementação por Gates

## 🧭 Como usar

O objetivo dos gates é impedir que Claude Code tente construir tudo de uma vez.

Cada gate deve ser implementado, revisado e aprovado antes do próximo.

---

## 🟤 Gate 0 — Fundação documental

### 🎯 Objetivo

Garantir que o projeto tenha direção clara antes da implementação.

### Entregas

- `PRD.md` lido e compreendido;
- `ADR.md` lido e compreendido;
- `DESIGN_SYSTEM.md` lido e compreendido;
- `SKILL_BUILDER_SPEC.md` lido e compreendido;
- estrutura de pastas criada;
- nenhum framework instalado.

### ✅ Saída

- [ ] Claude Code consegue explicar a arquitetura em poucas linhas;
- [ ] nenhuma dependência foi adicionada;
- [ ] escopo do Gate 1 está claro.

---

## 🟠 Gate 1 — Visual foundations

### 🎯 Objetivo

Construir somente o shell visual e o design system.

### Implementar

- tokens CSS;
- reset/base;
- tipografia;
- sidebar;
- topbar;
- botões;
- inputs;
- chips;
- badges;
- cards;
- code block;
- stepper;
- toast;
- estados de foco;
- responsividade base.

### Não implementar ainda

- busca real;
- filtros reais;
- catálogo real;
- Skill Builder funcional;
- exportação.

### ✅ Saída

- [ ] fidelidade visual ao conceito;
- [ ] todas as cores vêm de tokens;
- [ ] componentes reutilizáveis;
- [ ] sidebar tem os seis itens obrigatórios;
- [ ] foco visível;
- [ ] reduced motion aplicado;
- [ ] zero erro de console.

---

## 🟧 Gate 2 — Navegação e catálogo

### 🎯 Objetivo

Transformar o shell em marketplace navegável.

### Implementar

- hash router;
- Home;
- Claude Skills;
- Codex Skills;
- Prompt Engineering;
- Agentes;
- dados estáticos;
- cards renderizados por JS;
- busca local;
- filtros;
- ordenação;
- estados vazios.

### Não implementar ainda

- Builder funcional;
- ZIP;
- importação de Skill.

### ✅ Saída

- [ ] navegação funciona por mouse e teclado;
- [ ] reload preserva rota;
- [ ] busca filtra por nome/descrição/tags;
- [ ] filtros combinam corretamente;
- [ ] nenhum dado depende de backend;
- [ ] zero erro de console.

---

## 🟨 Gate 3 — Detalhe e segurança visual

### 🎯 Objetivo

Permitir inspecionar uma Skill antes de baixar.

### Implementar

- rota de detalhe;
- overview;
- tags;
- compatibilidade;
- license/source metadata;
- árvore de arquivos;
- preview `SKILL.md`;
- copiar;
- painel de risco;
- badges de ferramentas;
- aviso “conteúdo não executado”.

### ✅ Saída

- [ ] conteúdo é renderizado como texto seguro;
- [ ] nenhum script de Skill é executado;
- [ ] riscos são explicados;
- [ ] preview pode ser copiado;
- [ ] arquivos inexistentes geram estado vazio, não erro.

---

## 🟥 Gate 4 — Skill Builder core

### 🎯 Objetivo

Criar o wizard funcional até o preview final, sem ZIP.

### Implementar

- estado central;
- 7 passos;
- validação do nome;
- campos de metadata;
- invocação;
- ferramentas;
- instruções;
- arquivos auxiliares textuais;
- review;
- geração determinística de `SKILL.md`;
- draft no `localStorage`;
- download individual de `SKILL.md`.

### ✅ Saída

- [ ] refresh recupera draft;
- [ ] next/back preserva estado;
- [ ] erros bloqueiam avanço quando necessário;
- [ ] preview muda em tempo real;
- [ ] `SKILL.md` inicia com `---` quando possui frontmatter;
- [ ] conteúdo não é executado;
- [ ] download individual funciona.

---

## 🟥 Gate 5 — Portabilidade, risco e validação avançada

### 🎯 Objetivo

Tornar o builder confiável e educativo.

### Implementar

- Claude Code Full vs Portable;
- warnings de campos não portáveis;
- score de portabilidade;
- score de risco;
- detecção de shell injection textual;
- paths seguros;
- colisão de arquivos;
- validação de referências;
- resumo dos fatores de risco.

### ✅ Saída

- [ ] usuário entende por que o score mudou;
- [ ] path traversal é bloqueado;
- [ ] modo Portable não exporta campos exclusivos;
- [ ] nenhum alerta é apresentado apenas por cor;
- [ ] warnings não bloqueiam download sem motivo técnico.

---

## 🟫 Gate 6 — ZIP e exportação completa

### 🎯 Objetivo

Gerar um pacote de Skill baixável sem dependência externa obrigatória.

### Implementar

- gerador ZIP em JS puro;
- diretório raiz da Skill no arquivo;
- arquivos auxiliares;
- MIME/download correto;
- nome de arquivo seguro;
- copiar comando de instalação;
- reset após exportação opcional.

### ✅ Saída

- [ ] ZIP abre em ferramenta padrão;
- [ ] árvore interna está correta;
- [ ] `SKILL.md` é idêntico ao preview;
- [ ] arquivos auxiliares preservam conteúdo;
- [ ] nenhuma dependência npm é necessária.

---

## 🟪 Gate 7 — Polish e qualidade

### 🎯 Objetivo

Finalizar experiência, performance e consistência.

### Implementar

- motion final;
- states de loading apenas onde existirem operações reais;
- empty states;
- atalhos de teclado úteis;
- responsividade tablet/mobile;
- revisão de contraste;
- revisão de copy;
- revisão de acessibilidade;
- limpeza de código morto.

### ✅ Saída

- [ ] Lighthouse/manual checks aceitáveis;
- [ ] navegação principal 100% teclado;
- [ ] reduced motion respeitado;
- [ ] nenhuma quebra em 768/1024/1440 px;
- [ ] zero erro de console;
- [ ] sem CSS duplicado evidente.

---

## 🚀 Gate 8 — Deploy estático

### 🎯 Objetivo

Preparar para hospedagem.

### Implementar

- README de deploy;
- favicon/metadata;
- Open Graph básico;
- paths relativos;
- fallback visual offline simples;
- revisão final do catálogo.

### Destinos compatíveis

- GitHub Pages;
- Cloudflare Pages;
- Netlify;
- Vercel static;
- qualquer host de arquivos estáticos.

### ✅ Saída

- [ ] projeto funciona em subpath;
- [ ] hash routing funciona após reload;
- [ ] nenhum segredo no repositório;
- [ ] zero dependência de backend.

---

## 🛑 Regra de parada do Claude Code

Ao final de cada gate, responder no formato:

```markdown
## ✅ Gate N — Review

### Concluído
- [x] ...

### Pendente
- [ ] ...

### Testes realizados
- ...

### Riscos encontrados
- ...

### Próximo gate
Não iniciar até aprovação explícita.
```
