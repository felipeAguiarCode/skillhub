# 🔗 Fontes Técnicas

## 🟠 Claude Code Skills

Documentação oficial consultada para estruturar o Skill Builder:

- `https://code.claude.com/docs/en/skills`
- `https://code.claude.com/docs/en/claude-directory`
- `https://code.claude.com/docs/en/best-practices`

## 📌 Pontos que o projeto usa dessas referências

- Skills são diretórios contendo um `SKILL.md` como entrypoint.
- Skills de projeto podem viver em `.claude/skills/<name>/SKILL.md`.
- Skills pessoais podem viver em `~/.claude/skills/<name>/SKILL.md`.
- Skills podem conter arquivos auxiliares.
- Claude Code suporta frontmatter YAML e campos específicos para invocação, ferramentas e contexto.
- `description` é recomendado para ajudar Claude a decidir quando utilizar a Skill.
- O corpo da Skill deve permanecer conciso e referências grandes podem ser movidas para arquivos auxiliares.
- Campos específicos de Claude Code podem reduzir a portabilidade para outros ambientes Agent Skills.

## 🗓️ Revisão

A especificação deste blueprint foi conferida contra a documentação pública disponível em **08/09/2026**.

Como Claude Code evolui rapidamente, revisar as referências oficiais antes de adicionar novos campos ao Builder.
