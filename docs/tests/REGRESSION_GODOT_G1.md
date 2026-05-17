# Regression Godot G1

Checklist manual para o prototipo minimo Godot G1.

- [x] Projeto abre pela cena principal configurada em `godot/project.godot`
- [x] `godot/scenes/Main.tscn` existe e instancia Player, Enemy e HUD
- [x] Player aparece
- [x] Player se move com WASD/setas via Input Map
- [x] Camera acompanha o player
- [x] HUD aparece
- [x] HUD mostra nome do prototipo, `Godot G1`, HP, mana placeholder, controles e status
- [x] Inimigo aparece
- [x] Ataque basico por `1` ou clique causa dano em alcance curto
- [x] Inimigo recebe dano sem erro
- [x] Inimigo morre/desaparece ao chegar a 0 HP
- [x] HTML5 ainda passa em `npm.cmd run check`
- [x] Nenhum arquivo `src/*.js` foi alterado

Validacao local esperada para fechamento:

- `npm.cmd run check`
- `git diff --check`
- `git diff --name-only -- src` deve retornar vazio
- Godot CLI, quando disponivel no PATH: `godot --headless --path godot --quit` ou `godot4 --headless --path godot --quit`
