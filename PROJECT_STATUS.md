# Project Status

## Versao Atual

Godot G10 MVP PC Playtest Build & Polish

## Estado Geral

Migração oficial para Godot como plataforma principal de producao em andamento.

- **Plataforma Principal**: Godot (G3+)
- **Plataforma Legada**: HTML5/Canvas v0.3.4 (congelado)
- Godot G1 mínimo validado
- G1.1 export Web validado
- G2.1 baseline visual e jogavel minimo concluido
- G3.0 MVP jogavel completo em Godot
- G3.0.1 responsividade Web minima concluida como complemento do MVP G3.0
- G4.0 necromancia jogavel implementada em Godot
- G5 primeira arena com loop de ondas e recompensas implementada em Godot
- G6 mini dungeon prototipado em Godot na branch `godot/g6-mini-dungeon`
- G7 vertical slice prototype concluido na branch `godot/g7-vertical-slice-prototype`
- G8 MVP PC Foundation concluido na branch `godot/g8-mvp-pc-foundation`
- G9 MVP PC Content Expansion concluido na branch `godot/g9-mvp-pc-content-expansion`
- G10 MVP PC Playtest Build & Poland em desenvolvimento na branch `godot/g10-playtest-build-polish`
- FronteiraCinzas_PrototypeArea.tscn criada
- CorruptedWolf3D e OrderSoldier3D posicionados
- AreaTransition3D conectando hub <-> Fronteira
- SkeletonArcherServant3D funcional
- G1.2 Pages configurado
- G1.2.1 smoke test manual pendente
- SimpleSaveManager autoload conflict corrigido (removido class_name)

## Godot 3D Foundation / G2

G2 3D foundation concluido em branch dedicada: cena `godot/scenes/world/PrototypeArena3D.tscn` com player 3D, camera orbital, arena de teste, inimigo dummy e servo esqueleto dummy seguindo o jogador. Esta entrega nao substitui o prototipo HTML5/Canvas nem a cena Godot 2D atual.

## Godot G2 Basic Combat

G2 combate basico concluido na branch `godot/g2-basic-combat`.

- Ciclo minimo validado em prototipo: mover, mirar/posicionar, atacar, causar dano e matar `EnemyDummy3D`.
- Arquivos principais: `godot/scripts/combat/HealthComponent.gd`, `godot/scripts/combat/Hitbox3D.gd`, `godot/scripts/combat/Hurtbox3D.gd`, `godot/scenes/player/Player3D.tscn`, `godot/scripts/player/PlayerController3D.gd`, `godot/scenes/enemies/EnemyDummy3D.tscn`, `godot/scripts/enemies/EnemyDummy3D.gd` e `godot/scenes/world/PrototypeArena3D.tscn`.
- Validacao manual esperada: abrir `godot/` no Godot 4.6.x, executar `res://scenes/world/PrototypeArena3D.tscn`, testar WASD, camera com mouse, Shift, Espaco, clique esquerdo, dano/morte do dummy e servo seguindo o player.
- Fora do escopo: primeira invocacao real, reanimacao, essencia da morte, comando de servos, loot, XP, dungeon, boss, inventario, skill tree, UI complexa e save system.

## Godot G3 First Real Summon

G3 primeira invocacao real implementada na branch `godot/g3-first-real-summon`.

- Ciclo minimo: matar `EnemyDummy3D`, gerar `Corpse3D`, pressionar `R` perto do cadaver, criar `SkeletonServant3D`, consumir o cadaver, seguir o player e atacar outro inimigo.
- Arquivos principais: `godot/scripts/necromancy/Corpse3D.gd`, `godot/scripts/necromancy/RaiseSkeletonSkill.gd`, `godot/scenes/necromancy/Corpse3D.tscn`, `godot/scripts/summons/SkeletonServant3D.gd`, `godot/scenes/summons/SkeletonServant3D.tscn`, `godot/scenes/ui/PrototypeHUD.tscn`, `godot/scripts/ui/PrototypeHUD.gd` e `godot/scenes/world/PrototypeArena3D.tscn`.
- Validacao manual esperada: abrir `godot/` no Godot 4.6.x, executar `res://scenes/world/PrototypeArena3D.tscn`, testar movimento/camera/sprint/dodge/ataque, matar um dummy, reanimar um esqueleto com `R` e observar o servo atacar outro dummy.
- Fora do escopo: essencia da morte, custo, comando manual, roda tatica, dano transferido, evolucao de servos, raridade, inventario, loot, XP, dungeon, boss, save e UI complexa.

## Godot G4 Playable Necromancy

G4 necromancia jogavel implementada na branch `godot/g4-playable-necromancy`.

- Ciclo minimo: matar `EnemyDummy3D`, ganhar Essencia da Morte, gerar `Corpse3D`, pressionar `R` perto do cadaver, gastar essencia, criar `SkeletonServant3D`, comandar servos e transferir parte do dano do player para servos ativos.
- Arquivos principais: `godot/scripts/necromancy/EssenceComponent.gd`, `godot/scripts/necromancy/DamageTransferComponent.gd`, `godot/scripts/summons/SummonCommandComponent.gd`, `godot/scripts/necromancy/RaiseSkeletonSkill.gd`, `godot/scripts/player/PlayerController3D.gd`, `godot/scripts/enemies/EnemyDummy3D.gd`, `godot/scripts/summons/SkeletonServant3D.gd`, `godot/scripts/ui/PrototypeHUD.gd`, `godot/scenes/player/Player3D.tscn`, `godot/scenes/ui/PrototypeHUD.tscn`, `godot/scenes/world/PrototypeArena3D.tscn` e `godot/project.godot`.
- Validacao manual esperada: abrir `godot/` no Godot 4.6.x, executar `res://scenes/world/PrototypeArena3D.tscn`, testar movimento/camera/sprint/dodge/ataque, matar um dummy, confirmar essencia e cadaver, reanimar com `R`, usar `1` FOLLOW, `2` ATTACK e `3` RECALL, tomar dano com servo ativo e confirmar transferencia, tomar dano sem servo ativo e confirmar dano total no player.
- Validacao tecnica: cenas G4 principais carregadas em Godot 4.6.2 headless e `git diff --check` deve passar antes do commit.
- Fora do escopo: roda tatica, UI final, skill tree, evolucao/raridade de servos, inventario, loot, XP/level up, dungeon, boss, save system, mundo aberto, reputacao, corrupcao moral, faccoes completas, pathfinding avancado e multiplas familias de servos.

## Godot G5 First Arena Loop

G5 primeira arena implementada na branch `godot/g5-first-arena-loop`.

- Ciclo minimo:Enter inicia onda, matar inimigos, ganhar essencia/XP/loot, reanimar cadaveres, comandar servos, concluir onda, iniciar proxima onda.
-Arquivos principais: `godot/scripts/world/ArenaManager3D.gd`, `godot/scripts/world/SpawnPoint3D.gd`, `godot/scripts/progression/ExperienceComponent.gd`, `godot/scripts/loot/LootDrop3D.gd`, `godot/scenes/world/SpawnPoint3D.tscn`, `godot/scenes/loot/LootDrop3D.tscn`, `godot/scenes/player/Player3D.tscn`, `godot/scenes/world/PrototypeArena3D.tscn`, `godot/scripts/enemies/EnemyDummy3D.gd`, `godot/scripts/player/PlayerController3D.gd`, `godot/scripts/ui/PrototypeHUD.gd`.
- Validacao manual esperada: abrir `godot/` no Godot 4.6.x, executar `res://scenes/world/PrototypeArena3D.tscn`, testar Enter para iniciar onda, matar inimigos, confirmar essencia/XP/loot, reanimar com `R`, usar `1` FOLLOW, `2` ATTACK e `3` RECALL, concluir onda, Enter para proxima onda, F5 para reiniciar.
- Validacao tecnica: cenas G5 principais carregadas em Godot 4.6.2 headless e `git diff --check` deve passar antes do commit.
- Controles: WASD mover, Mouse camera, Shift sprint, Espaco dodge, Clique esquerdo ataque, R reanimar, 1 FOLLOW, 2 ATTACK, 3 RECALL, Enter inicia onda, F5 reinicia, Esc captura mouse.
- Fora do escopo: dungeon, boss, save system, inventario completo, equipamentos reais, raridade avancada, arvore de habilidades, loja, quests, mundo aberto, faccoes, reputacao, corrupcao moral.

## Plataforma Principal

**Godot 4.x**

- Cenas e scripts em `godot/`
- Build Web em `docs/play-godot/`
- Roadmap G3 prioriza polimento pos-MVP

## Plataforma Legada

**HTML5/Canvas v0.3.4**

- Prototipo congelado em v0.3.4
- Nao recebera novas features
- Mantido como referencia/laboratorio
- Codigo fonte permanece intocado em tarefas Godot

## Marcos Concluidos

| Marco | Descricao | Status|
|-------|----------|--------|
| G1 | Build Godot minimo | Completo |
| G1.1 Web | Export Web | Completo |
| G1.2 Pages | GitHub Pages | Completo |
| G2.1 | Baseline visual e jogavel minimo Godot | Completo |
| G3.0 | MVP jogavel completo Godot | Completo |
| G3.0.1 | Responsividade Web minima complementar ao MVP G3.0 | Completo |
| G4.0 | Necromancia jogavel minima Godot | Completo |
| G5 | Primeira arena com ondas, XP e loot | Completo |
| G6 | Mini dungeon prototipo | Completo |
| G7 | Vertical slice prototype | Completo |
| G8 | MVP PC Foundation | Completo |
| G9 | MVP PC Content Expansion | Completo |
| G10 | MVP PC Playtest Build & Polish | Em Desenvolvimento |
| v0.3.4 | HTML5 estavel | Congelado |

## Tags

| Tag | Descricao |
|-----|------------|
| godot-g1 | Build Godot minimo |
| godot-g1.1-web | Export Web validado |
| godot-g1.2-pages | GitHub Pages configurado |
| godot-g2.1-visual-baseline | Baseline visual e combate G2.1 |
| v0.3.4 | HTML5 estavel |

## Proximas Etapas

1. G7 vertical slice
2. Expandir a dungeon para um hub simples
3. Melhorar smoke test Web por release
4. Planejar persistencia expandida apos estabilizar o loop jogavel

Ver `docs/godot/ROADMAP_G3.md` para detalhes.

## Regras de Desenvolvimento

- Novas features devem ser implementadas primeiro em Godot.
- **Não alterar `src/*.js` em tarefas Godot**, exceto correções emergenciais documentadas.
- Não reimplementar tudo de uma vez - evoluir por marcos.
- Cada marco deve ter validação e documentação.
- Arquivos exportados de `docs/play-godot/` não devem ser alterados desnecessariamente.
- O único preset Godot válido continua sendo `godot/export_presets.cfg`.

## Validacoes

```bash
# Validar JS legado
npm.cmd run check

# Verificar src intacto
git diff --name-only -- src

# Verificar whitespace
git diff --check

# Verificar preset
git ls-files | findstr /i "export_presets.cfg"
# Resultado esperado: godot/export_presets.cfg
```

## Pendencias

- Smoke test manual G1.2.1 precisa ser validado no navegador
- Validar build Web em https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html
- Validar G3.0 publicado no GitHub Pages apos merge
- Validar G3.0.1 responsivo no GitHub Pages apos merge

## Documentacao

- `docs/godot/MIGRATION_TO_GODOT.md`
- `docs/godot/ROADMAP_G2.md`
- `docs/godot/ROADMAP_G3.md`
- `docs/godot/DEVELOPMENT_GUIDE.md`
- `docs/godot/G2.1_VISUAL_GAMEPLAY_BASELINE.md`
- `docs/godot/G3.0_MVP_COMPLETE.md`
- `docs/godot/G3.0.1_RESPONSIVE_WEB.md`
- `docs/play-godot/README.md`
- `docs/legacy-html5/README.md`
