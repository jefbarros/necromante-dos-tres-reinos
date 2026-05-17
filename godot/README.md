# Necromante dos Tres Reinos - Godot

## Cena 3D de prototipo

A fundacao 3D jogavel fica em:

`res://scenes/world/PrototypeArena3D.tscn`

Para testar, abra o projeto em `godot/` com Godot 4.6.x, abra essa cena e execute com **Run Current Scene**.

## G4 - necromancia jogavel

Esta etapa prova o loop minimo de necromancia jogavel:

1. matar um `EnemyDummy3D`;
2. ganhar Essencia da Morte;
3. gerar um `Corpse3D` no local da morte;
4. aproximar o player do cadaver;
5. pressionar `R`;
6. gastar essencia;
7. criar um `SkeletonServant3D`;
8. comandar servos com `1`, `2` e `3`;
9. tomar dano e observar parte do dano ser transferida para servos ativos.

## Controles atuais

- W, A, S, D: movimento relativo a camera
- Mouse: orbitar camera em terceira pessoa
- Shift: sprint
- Espaco: esquiva/roll placeholder
- Clique esquerdo: ataque basico frontal
- R: reanimar esqueleto a partir de cadaver proximo
- 1: servos seguem/protegem o jogador
- 2: servos atacam inimigo proximo
- 3: servos recuam e reunem no jogador
- Esc: liberar ou capturar o mouse

## Implementado nesta etapa

- `EssenceComponent.gd` no `Player3D`, com essencia inicial, limite, ganho e gasto.
- `EnemyDummy3D` concede essencia uma unica vez ao morrer por player ou servo.
- `RaiseSkeletonSkill.gd` cobra essencia antes de consumir cadaver.
- `SummonCommandComponent.gd` centraliza os comandos FOLLOW, ATTACK e RECALL.
- `SkeletonServant3D` respeita modos de comando com ranges diferentes.
- `DamageTransferComponent.gd` redireciona 20% do dano do player para servos ativos.
- `EnemyDummy3D` tem ataque simples por proximidade contra player ou servo.
- `PrototypeHUD.tscn` mostra HP, essencia, servos ativos/limite, comando atual e dica.
- `PrototypeArena3D.tscn` mantem multiplos inimigos em area pequena para validar o fluxo.

## Fluxo de teste manual

1. Abra `res://scenes/world/PrototypeArena3D.tscn`.
2. Execute com **Run Current Scene**.
3. Teste WASD, mouse, Shift, Espaco e clique esquerdo.
4. Mate um `EnemyDummy3D` com o ataque basico.
5. Confirme no console `EnemyDummy died`, `Essence gained: X` e `Corpse spawned`.
6. Aproxime-se do cadaver.
7. Pressione `R`.
8. Confirme `Essence spent: X`, `Skeleton raised` e a atualizacao do HUD.
9. Use `1` para FOLLOW, `2` para ATTACK e `3` para RECALL.
10. Tome dano com servo ativo e confirme `Damage transferred to summons: X`.
11. Tome dano sem servo ativo e confirme `No summons available for damage transfer`.

## Fora do escopo

- Roda tatica.
- UI final/bonita.
- Arvore de habilidade.
- Evolucao, raridade e multiplas familias de servos.
- Inventario, loot, XP e level up.
- Dungeon, boss, mundo aberto, faccoes completas e save system.
- Reputacao, corrupcao moral e sistemas narrativos completos.
- Pathfinding avancado, assets finais, efeitos finais e networking.

## Proximos passos sugeridos

1. G5 primeira arena com spawn, loot simples, XP e level up.
2. G6 mini dungeon.
