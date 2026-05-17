# Necromante dos Tres Reinos - Godot

## Cena 3D de prototipo

A fundacao 3D jogavel fica em:

`res://scenes/world/PrototypeArena3D.tscn`

Para testar, abra o projeto em `godot/` com Godot 4.6.x, abra essa cena e execute com **Run Current Scene**.

## G3 - primeira invocacao real

Esta etapa prova a fantasia central em forma minima:

1. matar um `EnemyDummy3D`;
2. gerar um `Corpse3D` simples no local da morte;
3. aproximar o player do cadaver;
4. pressionar `R`;
5. consumir o cadaver e criar um `SkeletonServant3D`;
6. observar o servo seguir o player e atacar outros inimigos proximos.

## Controles atuais

- W, A, S, D: movimento relativo a camera
- Mouse: orbitar camera em terceira pessoa
- Shift: sprint
- Espaco: esquiva/roll placeholder
- Clique esquerdo: ataque basico frontal
- R: reanimar esqueleto a partir de cadaver proximo
- Esc: liberar ou capturar o mouse

## Implementado nesta etapa

- `Corpse3D.tscn` com grupo `corpse`, visual placeholder e consumo unico.
- `RaiseSkeletonSkill.gd` como habilidade simples no `Player3D`.
- Limite inicial de 2 servos ativos.
- `SkeletonServant3D` com `HealthComponent`, estados minimos, follow, chase, attack e morte.
- Ataque basico do servo contra inimigos no grupo `enemy`.
- HUD minimo em `PrototypeHUD.tscn` com `Servos: X/Y` e dica de reanimacao.
- `PrototypeArena3D.tscn` com multiplos `EnemyDummy3D` para validar matar, reanimar e atacar outro alvo.

## Fluxo de teste manual

1. Abra `res://scenes/world/PrototypeArena3D.tscn`.
2. Execute com **Run Current Scene**.
3. Teste WASD, mouse, Shift, Espaco e clique esquerdo.
4. Mate um `EnemyDummy3D` com o ataque basico.
5. Confirme no console `EnemyDummy died` e `Corpse spawned`.
6. Aproxime-se do cadaver.
7. Pressione `R`.
8. Confirme `Skeleton raised` e a atualizacao do HUD.
9. Observe o servo seguir o player.
10. Aproxime o servo de outro `EnemyDummy3D` e confirme o log `Skeleton attacked EnemyDummy for X damage`.

## Fora do escopo

- Essencia da morte completa e custo de essencia.
- Comando manual de servos, roda tatica e modos seguir/atacar/recuar.
- Dano transferido ao servo.
- Evolucao, raridade, inventario, loot e XP.
- Dungeon, boss, mundo aberto, faccoes completas, save system e UI complexa.
- Assets finais, efeitos finais e networking.

## Proximos passos sugeridos

1. G4 necromancia jogavel.
2. Essencia da morte.
3. Comandos seguir/atacar/recuar.
4. Dano transferido.
