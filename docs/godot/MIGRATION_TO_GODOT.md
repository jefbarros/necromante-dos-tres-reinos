# Migração Oficial para Godot

## Decisão

**Godot passa a ser a plataforma principal de produção a partir da fase G2.**

## Motivo

- Melhor base para mobile/Windows nativos.
- Melhor escalabilidade para RPG de ação com física,animação e UI.
- Cenas, física, animação, UI e export multiplataforma nativos.
- HTML5/Canvas cumpriu papel de laboratório e protótipo de sistemas até a v0.3.4.

## O que muda

- Novas features serão implementadas em `/godot`.
- `docs/play-godot/` será o build Web público.
- HTML5/Canvas fica congelado em v0.3.4 como legado/laboratório.
- Documentação, roadmap e guias operacionais migram para `/docs/godot`.

## O que não muda

- Histórico preservado.
- Protótipo HTML5 não será apagado.
- Mecânicas e aprendizados do HTML5 podem ser usados como referência de design/sistemas.
- Saves HTML5 são mantidos (não há migração automática para Godot nesta etapa).

## Regras de Desenvolvimento

- **Não alterar `src/*.js` em tarefas Godot**, exceto correções emergenciais documentadas.
- Não reimplementar tudo de uma vez.
- Evoluir por marcos G2.x (cada marco com validação e documentação).
- Cada marco deve ter:
  - Validação headless (se aplicável).
  - Export Web quando necessário.
  - Documentação de mudanças.

## Estado Atual (G1.x)

| Marco | Status | Descrição |
|-------|--------|------------|
| G1 | ✅ Completo | Build Godot mínimo validado |
| G1.1 Web | ✅ Completo | Export Web validado |
| G1.2 Pages | ✅ Completo | GitHub Pages configurado |
| G1.2.1 Smoke Test | ⏳ Pendente | Validação manual no navegador necessária |

## Próximos Passos

- Continuar evolução em Godot (G2.x).
- Roadmap G2 define as fases de evolução.
- Smoke test manual G1.2.1 precisa ser preenchido após teste no navegador.

## Links Úteis

- Build Web Godot: `docs/play-godot/index.html`
- URL pública esperada: `https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html`
- Documentação legacy: `docs/legacy-html5/README.md`
