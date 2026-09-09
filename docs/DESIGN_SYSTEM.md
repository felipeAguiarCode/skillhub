# 🎨 Design System — Toko

## 🧭 1. Direção visual

O Toko deve parecer uma ferramenta editorial para builders, não um dashboard corporativo genérico.

A referência visual combina:

- fundo preto com subtom quente;
- superfícies grafite/marrom muito escuro;
- laranja queimado como cor de ação;
- off-white para contraste;
- cards grandes e silenciosos;
- grids assimétricos controlados;
- tipografia forte;
- ícones lineares;
- espaços generosos;
- motion curto e preciso.

### 🚫 Evitar

- gradientes roxos;
- glassmorphism intenso;
- sombras neon;
- excesso de badges;
- bordas muito arredondadas;
- cores diferentes para cada card sem função semântica;
- texturas visuais pesadas;
- dashboards com dezenas de métricas.

---

## 🎨 2. Paleta

### 🌑 Neutros escuros

| Token | Valor | Uso |
|---|---:|---|
| `--color-bg` | `#0D0C0B` | fundo global |
| `--color-bg-soft` | `#11100E` | regiões secundárias |
| `--color-surface` | `#161310` | cards e sidebar |
| `--color-surface-2` | `#1C1815` | cards elevados |
| `--color-surface-3` | `#241E1A` | hover selecionado |
| `--color-border` | `rgba(255,255,255,.08)` | borda padrão |
| `--color-border-strong` | `rgba(255,255,255,.14)` | borda enfatizada |

### 🟠 Accent

| Token | Valor | Uso |
|---|---:|---|
| `--color-accent` | `#FF5D3A` | ação primária |
| `--color-accent-hover` | `#FF704F` | hover |
| `--color-accent-deep` | `#A83E25` | fundos editoriais |
| `--color-accent-soft` | `rgba(255,93,58,.14)` | selected state |

### 🦴 Claros

| Token | Valor | Uso |
|---|---:|---|
| `--color-paper` | `#EEE8E0` | card editorial claro |
| `--color-paper-2` | `#F7F2EC` | superfícies claras |
| `--color-text` | `#F6F1EB` | texto principal escuro |
| `--color-text-muted` | `#A9A098` | texto secundário |
| `--color-text-faint` | `#746D66` | metadados |
| `--color-ink` | `#171411` | texto em card claro |

### 🚦 Semânticas

| Token | Valor | Uso |
|---|---:|---|
| `--color-success` | `#7ABF8C` | seguro/ok |
| `--color-warning` | `#E1A85A` | risco moderado |
| `--color-danger` | `#E66B62` | risco elevado |
| `--color-info` | `#7FA8C9` | informação |

> Cores semânticas devem aparecer em pequenos sinais, bordas, ícones e badges. Não transformar grandes áreas em verde/amarelo/vermelho.

---

## 🔤 3. Tipografia

### Família

Preferir stack nativa, rápida e sem dependência:

```css
font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Para snippets/código:

```css
font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

### Escala

| Token | Tamanho | Line-height | Uso |
|---|---:|---:|---|
| `--text-xs` | 11px | 1.4 | microcopy |
| `--text-sm` | 13px | 1.45 | metadata |
| `--text-md` | 15px | 1.55 | body |
| `--text-lg` | 18px | 1.4 | card title |
| `--text-xl` | 24px | 1.2 | section title |
| `--text-2xl` | 34px | 1.08 | page title |
| `--text-hero` | clamp(42px, 6vw, 72px) | .96 | hero |

### Pesos

- 400 — corpo;
- 500 — labels;
- 600 — títulos de componentes;
- 700 — títulos grandes.

Evitar usar 800/900 em blocos grandes.

---

## 📐 4. Spacing

Base de 4 px:

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80
```

Tokens:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

---

## ⭕ 5. Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 22px;
--radius-pill: 999px;
```

Regras:

- inputs: 12px;
- buttons: 10–12px;
- cards: 14–18px;
- hero: 20–22px;
- chips/badges: pill.

---

## 🪟 6. Elevação

O design não depende de sombras fortes.

```css
--shadow-card: 0 14px 40px rgba(0,0,0,.18);
--shadow-float: 0 18px 55px rgba(0,0,0,.28);
```

Preferir borda + contraste de superfície antes de adicionar shadow.

---

## 🧱 7. Grid e layout

### Desktop

```text
┌──────────────┬─────────────────────────────────────────┐
│   Sidebar    │                  Main                   │
│   220 px     │          max-width ~ 1440 px           │
└──────────────┴─────────────────────────────────────────┘
```

### Conteúdo

- padding de página: 32–48px;
- gap principal: 24px;
- cards de catálogo: 2–4 colunas conforme largura;
- linha de listagem: preferível em telas com muito metadata;
- builder: conteúdo principal + aside de preview.

### Breakpoints

```css
--bp-mobile: 768px;
--bp-tablet: 1180px;
--bp-wide: 1480px;
```

---

## 🧭 8. Sidebar

### Anatomia

1. marca;
2. navegação principal;
3. separador visual opcional;
4. Skill Builder em destaque ou inserido na navegação;
5. footer discreto “Free / Open”.

### Estado ativo

- fundo `--color-accent-soft`;
- texto `--color-accent`;
- ícone na mesma cor;
- sem linha lateral extra quando o fundo já comunica seleção.

### Hover

- aumentar contraste do fundo;
- transição de 140–180 ms.

---

## 🔘 9. Buttons

### Primary

```text
fundo: accent
texto: ink
borda: transparente
altura: 42–46px
```

### Secondary

```text
fundo: surface-2
texto: text
borda: border-strong
```

### Ghost

```text
fundo: transparente
texto: muted → text no hover
```

### Icon button

- 36–40px;
- ícone 18px;
- tooltip quando ação não for óbvia.

### Estados

- hover;
- active;
- focus-visible;
- disabled;
- loading apenas quando ação realmente assíncrona.

---

## 🏷️ 10. Chips e badges

### Filter chip

- pill;
- borda fina;
- selecionado usa accent;
- padding compacto.

### Badge semântico

Exemplos:

- Claude Code;
- Codex;
- Portable;
- Bash;
- Scripts;
- Low risk;
- Fork.

Badges de risco sempre devem ter texto ou ícone, não apenas cor.

---

## 🔎 11. Search field

### Anatomia

```text
[ícone] Buscar skills, prompts e agentes...                  [⌘ K]
```

### Dimensões

- altura: 48–52px;
- radius: 14px;
- fundo: surface;
- borda: border;
- focus: border accent + ring discreto.

---

## 🧩 12. Skill card

### Variante escura

```text
┌──────────────────────────────────────────┐
│ [icon] Skill Name               [badge] │
│ descrição curta                         │
│                                          │
│ tag  tag                     risk / uses │
└──────────────────────────────────────────┘
```

### Variante clara

Usar `--color-paper` para 1 card a cada grupo ou para card editorial em destaque.

Não usar aleatoriamente em todos os cards.

### Hover

- `translateY(-2px)`;
- borda mais clara;
- sem scaling perceptível.

---

## 🦸 13. Hero

O hero deve ser editorial e compacto.

Elementos:

- eyebrow;
- headline grande;
- descrição curta;
- CTA;
- ilustração geométrica simples ou orb/planeta abstrato;
- no máximo 1 accent visual forte.

Evitar hero com múltiplos botões competindo.

---

## 📃 14. Form fields

### Input/select

- altura: 44px;
- fundo: `surface-2`;
- borda: `border`;
- label 12–13px;
- placeholder com `text-faint`.

### Textarea

- mínimo 120px;
- resize vertical;
- contador apenas onde relevante.

### Error

```text
label normal
[input border danger]
⚠ Mensagem objetiva
```

---

## 🪄 15. Wizard stepper

### Desktop

```text
1────2────3────4────5────6────7
Básico   ...              Exportar
```

Estados:

- atual: círculo accent;
- concluído: accent-soft + check;
- futuro: surface + muted;
- erro: danger.

### Mobile/tablet

Mostrar passo atual como:

```text
Passo 3 de 7 · Ferramentas
```

---

## 💻 16. Code preview

- fundo quase preto;
- border;
- radius 12px;
- mono 12–13px;
- botão copiar no topo;
- scroll horizontal;
- linhas sem syntax highlighting obrigatório no MVP.

O código deve ser inserido com `textContent`.

---

## 🌳 17. File tree

Exemplo:

```text
▾ my-skill/
  ├─ SKILL.md
  ├─ reference.md
  └─ scripts/
     └─ helper.sh
```

Usar mono font e ícones discretos.

---

## 🚦 18. Risk panel

### Baixo

- ícone de check;
- texto “Baixo risco aparente”;
- não usar verde grande.

### Moderado

- explicar exatamente qual recurso elevou o score.

### Elevado

- mostrar lista curta e concreta;
- nunca impedir download apenas por heurística;
- exigir clique consciente quando houver ações shell muito amplas.

---

## 🔔 19. Toast

Tipos:

- sucesso;
- info;
- warning;
- erro.

Duração padrão: 2.5–4 s.

Toast não deve ser usado para erro de formulário persistente; nesse caso usar mensagem inline.

---

## 🎞️ 20. Motion

Tokens:

```css
--duration-fast: 140ms;
--duration-normal: 220ms;
--duration-slow: 360ms;
--ease-standard: cubic-bezier(.2,.8,.2,1);
```

Aplicações:

- hover: 140–180ms;
- mudança de step: 220–300ms;
- drawer/modal: 280–360ms.

### ♿ Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🧷 21. Ícones

Padrão:

- line art;
- 1.5–1.8px stroke;
- 18–22px em controles;
- 28–36px em cards editoriais;
- preferir SVG inline;
- `currentColor` para stroke/fill quando possível.

---

## 📊 22. Densidade

O produto deve parecer denso o suficiente para builders, mas sem excesso.

Regras:

- 1 ação primária por região;
- no máximo 3 níveis de texto num card;
- metadata em uma única linha quando possível;
- filtros ficam recolhíveis em tablet/mobile;
- descrições de cards limitadas a 2 linhas.

---

## 🧱 23. CSS layers sugeridas

```text
01 tokens
02 reset/base
03 layout
04 components
05 pages
06 utilities
07 responsive overrides
```

---

## ✅ 24. Checklist de fidelidade

Antes de aprovar uma tela:

- [ ] fundo é quente, não azul-preto;
- [ ] accent laranja está sob controle;
- [ ] cards têm borda sutil;
- [ ] card claro aparece apenas como contraste editorial;
- [ ] tipografia principal tem boa hierarquia;
- [ ] sidebar não rouba atenção;
- [ ] não há gradiente roxo;
- [ ] ícones são lineares e consistentes;
- [ ] motion é curto e funcional;
- [ ] há espaço negativo suficiente;
- [ ] componentes reutilizam tokens;
- [ ] foco de teclado é claramente visível.
