# Necromante dos Três Reinos - Godot Web Build

## Visão Geral

Este é o **build público Godot** do projeto **Necromante dos Três Reinos**.

A partir da fase G2, Godot é a plataforma principal de produção. Este build é a base oficial para Jogadores testarem online.

## Status Atual

| Item | Status |
|------|--------|
| Plataforma | Godot 4.x |
| Fase | G1.2 (Build mínimo) |
| Web Export | Validado |
| GitHub Pages | Configurado |
| Smoke Test | Pendente validação manual |

## URL Pública

A URL pública esperada é:

```
https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html
```

## Arquivos do Build

```
docs/play-godot/
├── index.html          # HTML principal
├── index.js           # JavaScript Godot
├── index.wasm        # WebAssembly Godot
├── index.pck         # Pacote de recursos
├── index.png         # Splash/loading
├── index.icon.png    # Favicon
└── index.audio.*   # Audio worklets
```

**Nota**: Os arquivos exportados (index.*) não devem ser alterados diretamente. Para atualizar, use o comando de export do Godot.

## Diferença entre G1 e G2

- **G1**: Protótipo mínimo (movimento, ataque, spawn inimigo)
- **G2**: Evolução funcional (combate, necromancia, inventário, progressão)

Ver `docs/godot/ROADMAP_G2.md` para fases detalhadas.

## Smoke Test Manual

O smoke test manual G1.2.1 está documentado em:

```
docs/play-godot/SMOKE_TEST_G1.2.1.md
```

**Pendente**: Validar manualmente no navegador após deploy.

## Como Regenerar Export

1. Abra o projeto em Godot 4.x
2. Vá em **Project > Export**
3. Selecione preset **Web**
4. Configure path de export para `docs/play-godot/`
5. Clique em **Export Project**
6. Commit os arquivos exportados

## Comandos de Validação

```bash
# Validar Godot (se disponível)
godot --headless --path godot --quit

# Validar JavaScript legado
npm.cmd run check

# Verificar mudanças em src/
git diff --name-only -- src

# Verificar problemas de merge
git diff --check
```

## Limitações Atuais (G1.x)

- Build Godot Web experimental
- Funcionalidade básica apenas (movimento, ataque, spawn inimigo)
- Áudio dependente de browser
- Não substitui o HTML5/Canvas (v0.3.4 preservado)
- Servos, equipe, inventário ainda não implementados

## Roadmap G2

Próximas fases em desenvolvimento:

- G2.1: Base de personagem e combate
- G2.2: Inimigos e spawn
- G2.3: Necromancia mínima
- G2.4: Progressão mínima
- G2.5: Inventário mínimo
- G2.6: Export e publicação contínua

Ver `docs/godot/ROADMAP_G2.md` para detalhes.

## Documentação

- `docs/godot/MIGRATION_TO_GODOT.md` - Documentação de migração
- `docs/godot/ROADMAP_G2.md` - Roadmap G2
- `docs/godot/DEVELOPMENT_GUIDE.md` - Guia de desenvolvimento
- `docs/legacy-html5/README.md` - Legado HTML5
