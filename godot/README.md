# Necromante dos Tres Reinos - Godot

## G8 - MVP PC Foundation

Esta fase transforma a vertical slice em uma base executável, testável e empacotável para PC Windows.

**Fluxo do MVP PC**:
1. Menu inicial → novo jogo / continuar / configurações / sair
2. Hub_VeyrholdOutskirts (início)
3. Quest vertical slice (Mara → Cripta → Boss → Recompensa)
4. Save/Load
5. Pause menu
6. Configurações
7. Export Windows

**Cena inicial**: `res://scenes/ui/MainMenu.tscn`

**Menu**:
- Novo Jogo: inicia no hub com estado limpo
- Continuar: carrega save existente (se houver)
- Configurações: sensibilidade, volume, qualidade, tela cheia
- Sair: fecha o jogo

**Pause (durante gameplay)**:
- Esc abre/fecha menu de pausa
- Salvar, Carregar, Voltar ao Menu, Sair

**Save**:
- Localização: `user://n3r_prototype_save.json`
- Inclui: versão, timestamp, última cena, level, XP, essência, estado da quest

**Controles** (inalterados desde G7):
- W, A, S, D: mover
- Mouse: câmera
- Shift: sprint
- Espaço: dodge
- Clique esquerdo: ataque
- R: reanimar cadáver
- 1/2/3: comandos de servo (FOLLOW/ATTACK/RECALL)
- E: interagir
- Esc: pause menu

**Cenas principais**:
- `res://scenes/ui/MainMenu.tscn` (início)
- `res::scenes/hub/Hub_VeyrholdOutskirts.tscn` (hub)
- `res::scenes/dungeons/MiniDungeon_CryptOfVeyrfall.tscn` (dungeon)
- `res::scenes/enemies/BossRavanPrototype3D.tscn` (boss)
- `res::scenes/ui/PauseMenu.tscn` (pausa)
- `res::scenes/ui/SettingsMenu.tscn` (configurações)

**Scripts adicionados**:
- `res::scripts/ui/MainMenu.gd`
- `res::scripts/ui/PauseMenu.gd`
- `res::scripts/ui/SettingsMenu.gd`

**Export Windows**:
- Ver `docs/godot/BUILD_WINDOWS.md`

## Cena 3D de prototipo (laboratório)

A fundação 3D jogavel original ainda disponível em:

`res::scenes/world/PrototypeArena3D.tscn`

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

## G6 - mini dungeon

Esta fase adiciona a `Cripta de Veyrfall` como uma dungeon pequena e jogavel que prova o loop minimo:

1. entrar na dungeon a partir de `PrototypeArena3D` usando `E`;
2. limpar sala 1 com 2 inimigos;
3. abrir a primeira porta/gate;
4. limpar sala 2 com 3 inimigos;
5. abrir a segunda porta/gate;
6. derrotar o `EliteEnemy3D` na sala 3;
7. colher a recompensa final em um baú;
8. salvar progresso simples em `user://n3r_prototype_save.json`;
9. voltar para a arena com `E`.

O save simples é gravado em `user://n3r_prototype_save.json`.

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
- E: interagir com entradas, portas e recompensas
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
- `MiniDungeon_CryptOfVeyrfall.tscn` adiciona uma dungeon de 3 salas, gates de porta, elite, recompensa e retorno à arena.

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
11. Tome dano sem servo ativo e confirme `No summons available for damage transfer`.9. Aproxime-se da entrada da dungeon no `PrototypeArena3D` e pressione `E`.
10. Limpe sala 1, avance e confirme que o gate abre.
11. Limpe sala 2, avance e confirme que o segundo gate abre.
12. Derrote o elite na sala 3 e colete o baú final.
13. Verifique que `user://n3r_prototype_save.json` foi criado.
14. Use `E` no portal de saida para retornar para a arena.
## Fora do escopo

- Roda tatica.
- UI final/bonita.
- Arvore de habilidade.
- Evolucao, raridade e multiplas familias de servos.
- Inventario, loot, XP e level up.
- Boss complexo e mundo aberto completo.
- Inventario real, equipamentos finais e arvores de habilidade completas.
- Reputacao, corrupcao moral e sistemas narrativos completos.
- Pathfinding avancado, assets finais, efeitos finais e networking.

## G7 - Vertical Slice Prototype

A Vertical Slice transforma os sistemas existentes em uma experiencia curta e jogavel:

**Fluxo**:
1. Abrir Hub_VeyrholdOutskirts.tscn
2. Falar com Mara (NPC) - pressione E
3. Entrar na Cripta de Veyrfall
4. Limpar sala 1
5. Limpar sala 2
6. Derrotar Ravan, Lama da Chama Branca (Boss)
7. Coletar recompensa
8. Retornar ao hub

**Cenas principais**:
- res://scenes/hub/Hub_VeyrholdOutskirts.tscn (inicio)
- res::scenes/npcs/NPC_MaraSurvivor.tscn
- res://scenes/dungeons/MiniDungeon_CryptOfVeyrfall.tscn
- res://scenes/enemies/BossRavanPrototype3D.tscn

**Scripts adicionados**:
- res://scripts/quests/QuestManager3D.gd
- res://scripts/npcs/NPCInteractable3D.gd
- res://scripts/enemies/BossRavanPrototype3D.gd

**Save**: user://n3r_prototype_save.json

**Fora do escopo**:
- Mundo aberto completo
- Inventario real
- Arvore de habilidades
- Faccoes e reputacao
- Cutscenes complexas

## Proximos passos sugeridos

1. G8 MVP PC foundation
2. Regiao pequena Fronteira de Cinzas
3. Melhorias de combate
4. 3 tipos de inimigo reais
5. 3 servos jogaveis
6. Save mais robusto
7. Build Windows
