# Necromante dos Tres Reinos - Godot

## Cena 3D de prototipo

A fundacao 3D jogavel fica em:

`res://scenes/world/PrototypeArena3D.tscn`

Para testar, abra o projeto em `godot/` com Godot 4.6.x, abra essa cena e execute com **Run Current Scene**.

## Controles atuais

- W, A, S, D: movimento relativo a camera
- Mouse: orbitar camera em terceira pessoa
- Shift: sprint
- Espaco: esquiva/roll placeholder
- Esc: liberar ou capturar o mouse

## Implementado nesta etapa

- `Player3D.tscn` com `CharacterBody3D`, colisao, gravidade, sprint e dodge placeholder.
- `ThirdPersonCameraRig.tscn` com camera orbital suave e pitch limitado.
- `PrototypeArena3D.tscn` com chao, paredes, obstaculos, luz direcional e ambiente basico.
- `EnemyDummy3D.tscn` com grupo `enemy`, vida simples e `receive_damage(amount: float)`.
- `SkeletonServant3D.tscn` com grupo `summon` e seguimento basico do player.
- Materiais placeholder gerados com `StandardMaterial3D`.
- InputMap 3D preparado com `move_forward`, `move_back`, `move_left`, `move_right`, `sprint` e `dodge`.

## Fora do escopo

- Combate completo.
- Dano avancado, loot, inventario, arvore de habilidades e save system.
- Dungeons, bosses, mundo aberto e UI complexa.
- Assets finais, efeitos finais e networking.

## Proximos passos sugeridos

1. G2 combate basico.
2. G3 primeira invocacao real.
3. G4 necromancia jogavel.
