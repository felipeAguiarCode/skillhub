# 📘 PRD — Toko Free Skills Marketplace

## 🧭 1. Visão do produto

**Toko** é o nome de trabalho de um marketplace gratuito, aberto e estático para descoberta, inspeção e exportação de recursos para assistentes de programação e agentes de IA.

O produto organiza quatro tipos principais de conteúdo:

- Claude Skills;
- Codex Skills;
- prompts de Prompt Engineering;
- agentes.

A principal ferramenta autoral da plataforma é o **Skill Builder**, um wizard guiado para criar uma Skill de Claude Code no formato esperado pelo produto.

A primeira versão deve ser simples o bastante para ser hospedada como site estático e aberta sem autenticação.

---

## 🎯 2. Objetivos

### ✅ Objetivos primários

1. Tornar fácil descobrir Skills gratuitas para Claude e Codex.
2. Permitir comparar rapidamente finalidade, categoria, permissões e compatibilidade.
3. Ensinar visualmente como uma Skill de Claude Code é estruturada.
4. Permitir criar uma Skill sem escrever YAML manualmente.
5. Permitir revisar o arquivo final antes de exportar.
6. Manter a experiência rápida, minimalista e sem cadastro.
7. Manter toda a aplicação em HTML, CSS e JavaScript puro.

### 📈 Métricas de sucesso do MVP

Como o MVP não possui backend, métricas de produto não serão coletadas nativamente. Os indicadores abaixo são critérios de produto/teste e podem futuramente ser medidos por uma camada externa de analytics:

- usuário encontra uma Skill relevante em até 3 interações;
- usuário entende permissões de uma Skill antes do download;
- usuário conclui o Skill Builder sem editar YAML diretamente;
- tempo de carregamento inicial percebido inferior a 2 s em conexão comum;
- nenhum erro de console em fluxo principal;
- navegação principal totalmente utilizável por teclado.

---

## 🚫 3. Não objetivos do MVP

Não fazem parte desta versão:

- autenticação;
- cadastro de usuários;
- perfis persistidos em servidor;
- comentários;
- avaliações persistidas;
- pagamentos;
- upload para servidor;
- publicação automática no catálogo;
- execução de Skills;
- instalação automática na máquina do usuário;
- sincronização entre dispositivos;
- painel administrativo;
- API pública;
- backend;
- banco de dados.

---

## 👥 4. Público-alvo

### 👨‍💻 Desenvolvedor individual

Quer encontrar instruções reutilizáveis para acelerar tarefas em Claude Code ou Codex.

### 🧠 Usuário de IA avançado

Quer estruturar prompts, workflows e agentes de maneira mais consistente.

### 🧩 Criador de Skills

Quer gerar uma Skill compatível com Claude Code sem decorar frontmatter, caminhos ou convenções.

### 🎓 Pessoa aprendendo agentic coding

Quer entender visualmente o que são Skills, quando usar e como são empacotadas.

---

## 🧭 5. Arquitetura de informação

A sidebar deve conter exatamente:

1. **Home**
2. **Claude Skills**
3. **Codex Skills**
4. **Prompt Engineering**
5. **Agentes**
6. **Skill Builder**

Não existe item de login ou conta.

### 🏠 Home

Objetivo: apresentar a proposta do marketplace e oferecer entrada rápida por categoria.

Conteúdo mínimo:

- headline editorial;
- descrição curta;
- busca global;
- CTA para explorar;
- quatro cards de categoria;
- seção “em destaque”;
- seção “tendências”;
- bloco sobre comunidade/free/open;
- CTA para Skill Builder.

### 🟠 Claude Skills

Objetivo: listar Skills direcionadas a Claude Code.

Conteúdo mínimo:

- título e descrição;
- busca;
- filtros por categoria;
- ordenação;
- cards em lista ou grid;
- badges de compatibilidade;
- indicação de risco/permissões;
- acesso ao detalhe.

### 🔵 Codex Skills

Objetivo: listar recursos e Skills voltados ao ecossistema Codex.

A estrutura visual deve ser equivalente à tela de Claude Skills, variando dados, ícones e microcopy.

### ✍️ Prompt Engineering

Objetivo: oferecer prompts reutilizáveis por intenção.

Categorias sugeridas:

- produtividade;
- escrita;
- análise;
- código;
- documentação;
- criatividade;
- pesquisa.

### 🤖 Agentes

Objetivo: apresentar agentes e workflows compostos.

Cada card deve destacar:

- função;
- entradas esperadas;
- ferramentas relevantes;
- grau de autonomia;
- compatibilidade;
- riscos.

### 🧩 Skill Builder

Objetivo: gerar uma Skill de Claude Code por wizard.

É a funcionalidade central da primeira versão e deve receber maior atenção de UX, validação e documentação.

---

## 🔎 6. Busca e filtros

### 🔍 Busca global

A busca deve encontrar correspondências em:

- nome;
- descrição;
- tags;
- categoria;
- plataforma;
- autor/curador;
- ferramentas declaradas.

No MVP, a busca é totalmente client-side.

### 🧱 Filtros

Filtros mínimos:

- categoria;
- plataforma;
- nível de risco;
- compatibilidade;
- popularidade;
- presença de scripts;
- presença de ferramentas shell.

### ↕️ Ordenação

Opções mínimas:

- mais populares;
- mais recentes;
- nome A–Z;
- menor risco.

---

## 🧩 7. Modelo de card de Skill

Cada card deve ser escaneável em poucos segundos.

### 📌 Informação primária

- ícone;
- nome;
- descrição de 1–2 linhas;
- categoria;
- compatibilidade;
- autor/curador opcional;
- uso/downloads fictícios apenas se forem dados editoriais claramente marcados.

### 🛡️ Informação de segurança

Mostrar badges quando aplicável:

- `Bash`;
- `PowerShell`;
- `allowed-tools`;
- scripts;
- shell injection;
- fork/subagent;
- Skill portátil;
- Claude Code only.

### 🎯 Ações

- Ver detalhes;
- Copiar estrutura;
- Baixar;
- Abrir fonte externa, quando existir.

---

## 📄 8. Detalhe de uma Skill

A tela de detalhe deve responder:

1. O que essa Skill faz?
2. Quando ela deve ser usada?
3. Em qual ambiente funciona?
4. Quais ferramentas/permissões solicita?
5. Ela contém comandos shell?
6. Ela contém scripts?
7. Quais arquivos fazem parte do pacote?
8. Como instalar?
9. Qual é o conteúdo de `SKILL.md`?
10. Qual é a fonte/licença?

### 🧱 Layout sugerido

- coluna principal: overview, instruções, arquivos e preview;
- coluna lateral: compatibilidade, risco, licença, tags e ações;
- code viewer com copiar;
- árvore de arquivos;
- aviso de conteúdo não executado.

---

## 🪄 9. Skill Builder — fluxo funcional

O wizard deve usar passos claros e manter o usuário orientado durante todo o processo.

### 1️⃣ Passo 1 — Básico

Campos:

- nome do diretório;
- display name opcional;
- descrição;
- categoria;
- tags;
- destino da Skill.

Destinos:

- Claude Code — projeto;
- Claude Code — pessoal;
- Claude Code — plugin;
- modo portátil/Agent Skills.

Validações:

- nome em lowercase/kebab-case;
- impedir espaços no nome do diretório;
- descrição recomendada;
- mostrar preview do comando `/skill-name`.

### 2️⃣ Passo 2 — Gatilhos e argumentos

Campos:

- `when_to_use`;
- argumentos;
- `argument-hint`;
- invocável pelo usuário;
- invocável pelo modelo.

A interface deve explicar, sem excesso de texto, como cada opção muda a forma de invocação.

### 3️⃣ Passo 3 — Ferramentas e execução

Campos avançados:

- `allowed-tools`;
- `disallowed-tools`;
- `context`;
- `agent`;
- `model`;
- `effort`;
- `shell`;
- `paths`;
- modo fork/background quando suportado.

A seleção de ferramentas sensíveis deve gerar aviso de risco.

### 4️⃣ Passo 4 — Instruções

Editor Markdown estruturado com seções sugeridas:

- objetivo;
- contexto;
- procedimento;
- critérios de qualidade;
- exemplos;
- limitações;
- recursos adicionais.

O usuário deve poder editar texto livremente.

### 5️⃣ Passo 5 — Arquivos auxiliares

Permitir cadastrar arquivos textuais opcionais:

- `reference.md`;
- `examples.md`;
- templates;
- scripts;
- outros arquivos.

No MVP, arquivos ficam somente em memória/localStorage até exportação.

### 6️⃣ Passo 6 — Revisão e validação

Exibir:

- árvore de arquivos;
- preview do frontmatter;
- preview do Markdown;
- warnings;
- erros bloqueantes;
- score de portabilidade;
- score de risco.

### 7️⃣ Passo 7 — Exportar

Ações:

- copiar `SKILL.md`;
- baixar `SKILL.md`;
- baixar pacote ZIP;
- copiar comando/caminho de instalação;
- começar nova Skill.

---

## 📦 10. Saída esperada do Skill Builder

Estrutura mínima:

```text
<skill-name>/
└── SKILL.md
```

Estrutura estendida:

```text
<skill-name>/
├── SKILL.md
├── reference.md
├── examples.md
├── templates/
│   └── template.md
└── scripts/
    └── helper.sh
```

### 📝 Regras do `SKILL.md`

- frontmatter YAML deve começar na primeira linha;
- `description` deve ser fortemente recomendado;
- `name` deve ser opcional;
- o corpo deve ser Markdown;
- campos exclusivos de Claude Code devem ser identificados como não portáveis quando o usuário selecionar modo portátil.

---

## 🔐 11. Segurança e confiança

### 🛡️ Princípio principal

**O marketplace nunca executa conteúdo de Skills.**

Tudo deve ser tratado como conteúdo potencialmente não confiável.

### 🚨 Indicadores de risco

Uma Skill deve receber alertas quando contiver:

- comandos shell;
- `allowed-tools` com Bash/PowerShell;
- scripts;
- instruções destrutivas;
- ferramentas com escrita em arquivos;
- comandos de Git destrutivos;
- execução em subagent/fork;
- URLs externas em scripts.

### 🧯 Proteções de interface

- nunca inserir conteúdo de terceiros com `innerHTML` sem sanitização;
- preferir `textContent`;
- não executar scripts importados;
- não oferecer botão “Run”;
- separar “download” de “instalação”;
- exibir permissões antes de exportar/baixar.

---

## 🗃️ 12. Modelo de dados estático

O catálogo pode ser carregado de um arquivo JavaScript local para funcionar inclusive via `file://`.

Exemplo conceitual:

```javascript
window.TOKO_CATALOG = [
  {
    id: "claude-api-reviewer",
    type: "claude-skill",
    name: "API Reviewer",
    description: "Review API changes against project conventions.",
    category: "development",
    tags: ["api", "review"],
    compatibility: ["claude-code"],
    risk: "low",
    sourceUrl: null,
    files: ["SKILL.md"]
  }
];
```

---

## 💾 13. Persistência local

`localStorage` pode ser usado para:

- rascunho do Skill Builder;
- favoritos;
- último filtro selecionado;
- preferência de densidade;
- estado recolhido/expandido da sidebar.

Não armazenar segredos, tokens ou credenciais.

---

## 🎨 14. Direção visual

A interface deve seguir o conceito visual fornecido:

- fundo preto/grafite aquecido;
- laranja queimado como accent;
- cards off-white como contraste editorial;
- bordas discretas;
- tipografia grande e limpa;
- layout denso, porém respirado;
- sidebar estreita;
- gráficos e ornamentos geométricos simples;
- ícones lineares;
- motion curto e suave.

A fonte de verdade visual está em `docs/DESIGN_SYSTEM.md`.

---

## ♿ 15. Acessibilidade

Requisitos mínimos:

- foco visível;
- contraste suficiente;
- labels reais em inputs;
- navegação por teclado;
- uso correto de `button` e `a`;
- `aria-current` na navegação;
- `aria-live` para toasts e validações quando necessário;
- suporte a `prefers-reduced-motion`;
- não depender apenas de cor para indicar risco/estado.

---

## 📱 16. Responsividade

### 🖥️ Desktop ≥ 1180 px

- sidebar fixa;
- grid de 3–4 cards;
- builder com conteúdo + painel lateral.

### 💻 Tablet 768–1179 px

- sidebar compacta;
- grid de 2 cards;
- painel do builder abaixo ou recolhível.

### 📱 Mobile < 768 px

Não é prioridade de design do MVP, mas o conteúdo não deve quebrar. Sidebar pode virar drawer e grids passam para uma coluna.

---

## ⚡ 17. Performance

- evitar bibliotecas pesadas;
- evitar imagens grandes fora da hero;
- usar SVG para ícones;
- limitar animações a `transform` e `opacity` quando possível;
- não criar observers/event listeners duplicados;
- lazy-render de previews longos quando necessário.

---

## 🧪 18. Critérios de aceite do MVP

O MVP está aprovado quando:

- todas as seis áreas da navegação existem;
- busca e filtros funcionam client-side;
- detalhe de Skill mostra estrutura e permissões;
- nenhuma Skill é executada;
- Skill Builder conclui os sete passos;
- frontmatter e `SKILL.md` são gerados;
- exportação mínima funciona;
- rascunho do builder sobrevive a reload;
- não há login ou dependência de backend;
- a experiência visual está coerente com o conceito;
- não há erros de console nos fluxos principais.

---

## 🧭 19. Futuro fora do MVP

Possíveis evoluções, sem compromisso no escopo atual:

- catálogo mantido via GitHub;
- importação de repositórios públicos;
- validação automatizada de pacotes;
- assinatura/checksum;
- curadoria comunitária;
- analytics;
- PWA;
- integração opcional com APIs;
- versão desktop.
