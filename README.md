# Necromante dos Tres Reinos

RPG 3D de acao e necromancia feito em Godot. O jogo principal fica em `godot/`, e o unico arquivo de projeto valido e `godot/project.godot`.

## Base Do Projeto

- Engine: Godot 4.x
- Projeto: `godot/project.godot`
- Cena principal: `res://scenes/ui/MainMenu.tscn`
- Build Web exportado pelo Godot: `docs/play-godot/`
- Status atual: G10 Playtest Build & Polish

## Como Abrir

1. Abra o Godot 4.x.
2. Escolha Importar/Abrir.
3. Selecione a pasta `godot/`.
4. Confirme que a cena principal e `res://scenes/ui/MainMenu.tscn`.
5. Pressione Play.

Pelo terminal, quando `godot` estiver no PATH:

```powershell
godot --headless --path godot --quit
```

## Primeiro Teste Manual

1. Rode `res://scenes/ui/MainMenu.tscn`.
2. Clique em Novo Jogo.
3. Entre no Hub.
4. Teste WASD, mouse, Shift, Espaco, ataque com clique esquerdo, ESC, save/load se disponivel, inimigos, morte, cadaver, essencia, R para reanimar e comandos 1/2/3.
5. Registre o resultado em `docs/qa/FIRST_REAL_TEST_RESULTS.md`.

Checklist completo: `docs/qa/FIRST_REAL_TEST_CHECKLIST.md`.

## Export Web Godot

O export Web versionado para GitHub Pages fica em `docs/play-godot/`. Nao edite os arquivos exportados manualmente; gere novamente pelo preset Web do Godot quando necessario.

Exemplo:

```powershell
godot --headless --path godot --export-release "Web" ../docs/play-godot/index.html
```

## Estrutura

```text
/
|-- godot/
|   |-- project.godot
|   |-- scenes/
|   |-- scripts/
|   |-- assets/
|   |-- resources/
|   |-- tests/
|   `-- tools/
|-- docs/
|   |-- godot/
|   |-- play-godot/
|   |-- qa/
|   |-- setup/
|   |-- pipeline/
|   `-- decisions/
|-- README.md
|-- PROJECT_STATUS.md
|-- ART_BIBLE.md
`-- .gitignore
```

## Ferramentas

Stack sem custo adicional: Godot, VS Code, Git/GitHub, Blender, Krita, Audacity, LMMS, assets CC0 da Kenney e ChatGPT/Codex para apoio tecnico.

Detalhes: `docs/setup/FREE_STACK_WINDOWS.md` e `docs/pipeline/FREE_TOOLCHAIN.md`.
