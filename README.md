# Necromante dos Tres Reinos

RPG de acao com necromancia. Estrutura de Mundo Aberto por Regioes com lore e identidade propria baseada nos Tres Reinos: Humanos, Demonios e Dragoes.

## Plataforma Principal

### Godot (G3+)

**Status**: G10 MVP PC Playtest Build & Polish

O projeto principal utiliza Godot 4.x como engine de producao.

- Projeto: `godot/`
- Executar: Abrir `godot/project.godot` no Godot 4.6.x
- Build Web: `docs/play-godot/index.html`
- URL publica: https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html
- Documentacao: `docs/godot/`

---

## Tags Importantes

| Tag | Descricao |
|-----|------------|
| godot-g1 | Build Godot minimo |
| godot-g1.1-web | Export Web validado |
| godot-g1.2-pages | GitHub Pages configurado |
| godot-g2.1-visual-baseline | Baseline visual e combate G2.1 |

---

## Estrutura do Projeto

```
necromante-dos-tres-reinos/
├── godot/                  # Projeto Godot principal
│   ├── project.godot      # Arquivo do projeto
│   ├── scenes/           # Cenas do jogo
│   ├── scripts/         # Scripts GDScript
│   ├── assets/          # Recursos visuais
│   └── resources/       # Recursos do editor
├── docs/
│   ├── godot/           # Documentacao Godot
│   └── play-godot/      # Build Web exportado
├── README.md
├── PROJECT_STATUS.md
└── ART_BIBLE.md
```

---

## Roadmap

- **G1.x**: Prototipo Godot (completo)
- **G2.x**: Evolucao funcional em Godot (baseline visual concluido)
- **G3.x**: MVP jogavel e polimento pos-MVP (completo)
- **G4.x**: Necromancia jogavel (completo)
- **G5.x**: Primeira arena com ondas (completo)
- **G6-G10**: Conteudo e polimento
- Ver `docs/godot/ROADMAP_G3.md` para o plano atual

---

## Documentacao

- `docs/godot/MIGRATION_TO_GODOT.md` - Documentacao de migracao
- `docs/godot/ROADMAP_G2.md` - Roadmap G2
- `docs/godot/ROADMAP_G3.md` - Roadmap G3+
- `docs/godot/G3.0_MVP_COMPLETE.md` - Documentacao do MVP jogavel
- `docs/godot/DEVELOPMENT_GUIDE.md` - Guia de desenvolvimento Godot
- `docs/play-godot/README.md` - Build Web Godot

---

## Como Contribuir

1. Crie uma branch para sua feature
2. Desenvolva em Godot 4.x
3. Valide com os comandos em `docs/godot/DEVELOPMENT_GUIDE.md`
4. Abra um Pull Request

---

## Regras de Desenvolvimento

- Novas features devem ser implementadas em Godot.
- Cada marco deve ter validacao e documentacao.
- Evitar reescrever a arquitetura toda de uma vez.

---

## Licenca

MIT
