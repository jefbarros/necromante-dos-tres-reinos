# Necromante dos Tres Reinos - Godot

## Cena 3D de prototipo combatível

A fundacao 3D jogavel fica em:

`res://scenes/world/PrototypeArena3D.tscn`

Para testar, abra o projeto em `godot/` com Godot 4.6.x, abra essa cena e execute com **Run Current Scene**.

## Controles atuais

- W, A, S, D: movimento relativo a camera
- Mouse: orbitar camera em terceira pessoa
- Shift: sprint
- Espaco: esquiva/roll placeholder
- Clique esquerdo: ataque basico frontal
- Esc: liberar ou capturar o mouse

## Implementado nesta etapa

- G2 combate basico 3D.
- `Player3D.tscn` com `CharacterBody3D`, colisao, gravidade, sprint e dodge placeholder.
- Ataque basico do player com `Area3D` frontal, curta janela ativa e cooldown simples.
- `HealthComponent.gd` reutilizavel com dano, cura e morte.
- `Hitbox3D.gd` e `Hurtbox3D.gd` para aplicar dano entre areas.
- `ThirdPersonCameraRig.tscn` com camera orbital suave e pitch limitado.
- `PrototypeArena3D.tscn` com chao, paredes, obstaculos, luz direcional, player, servo e dummy em distancia facil para teste.
- `EnemyDummy3D.tscn` com grupo `enemy`, `HealthComponent`, hurtbox, log de dano e morte/desativacao como placeholder de cadaver.
- `SkeletonServant3D.tscn` com grupo `summon` e seguimento basico do player.
- Materiais placeholder gerados com `StandardMaterial3D`.
- InputMap 3D preparado com `move_forward`, `move_back`, `move_left`, `move_right`, `sprint`, `dodge` e `attack_primary`.

## Como testar dano no EnemyDummy

1. Abra `res://scenes/world/PrototypeArena3D.tscn`.
2. Execute com **Run Current Scene**.
3. Aproxime-se do `EnemyDummy3D`.
4. Mire/posicione o player de frente para o dummy.
5. Clique com o botao esquerdo do mouse.
6. Confirme no console os logs `Player basic attack`, dano recebido e `EnemyDummy died` ao zerar a vida.

O dummy permanece na cena escurecido e com hurtbox/colisao desativadas. A reanimacao real fica para G3.

## Fora do escopo

- Primeira invocacao real.
- Reanimacao de cadaver.
- Essencia da morte, comando de servos e dano transferido.
- Loot, XP, inventario, arvore de habilidades e save system.
- Dungeons, bosses, mundo aberto e UI complexa.
- Assets finais, efeitos finais e networking.

## Proximos passos sugeridos

1. G3 primeira invocacao real.
2. G4 necromancia jogavel.
3. G5 primeira arena com spawns, loot simples e XP.
