# QA G9 - MVP PC Content Expansion

## Checklist de Testes Manuais

### Menu Inicial
- [ ] Abrir MainMenu.tscn
- [ ] Novo Jogo inicia no hub
- [ ] Continuar carrega save existente
- [ ] Configuracoes abre menu de settings
- [ ] Sair fecha o jogo

### Hub
- [ ] Hub_VeyrholdOutskirts carrega
- [ ] Player spawn no hub
- [ ] Label de Mara visivel
- [ ] Label de entrada da cripta visivel

### Transicao Hub <-> Fronteira de Cinzas
- [ ] AreaTransition do hub para FronteiraCinzas funciona
- [ ] Label "E: Viajar" aparece
- [ ] Pressionar E troca para nova area
- [ ] AreaTransition de retorno funciona
- [ ] Transicao de volta para hub funciona

### Combate na Fronteira de Cinzas
- [ ] Corrupted Wolf aparece e persegue player
- [ ] Order Soldier aparece e persegue player
- [ ] Ataque basico causa dano
- [ ] Inimigos concedem essencia ao morrer
- [ ] Inimigos concedem XP ao morrer
- [ ] Cadaver spawna onde aplicavel

### Necromancia
- [ ] R invoca esqueleto soldado (15 essencia)
- [ ] Shift+R invoca esqueleto arqueiro (20 essencia)
- [ ] Servo segue player
- [ ] Servo ataca inimigos
- [ ] Comando 1: FOLLOW funciona
- [ ] Comando 2: ATTACK funciona
- [ ] Comando 3: RECALL funciona
- [ ] Dano transferido para servos funciona

### Dungeon e Boss
- [ ] Entrar na Cripta de Veyrfall
- [ ] Derrotar inimigos na dungeon
- [ ] Boss Ravan spawn
- [ ] Fase 2 ativa abaixo de 50% HP
- [ ] "Ravan enters Sacred Fury!" aparece
- [ ] Dano aumenta na fase 2
- [ ] Recompensa dropa
- [ ] Retornar ao hub funciona

### Save/Load
- [ ] Salvar durante gameplay
- [ ] Carregar save funciona
- [ ] Last scene persiste
- [ ] Estado do player persiste

### Pause Menu
- [ ] Esc abre pause menu
- [ ] Continuar funciona
- [ ] Salvar funciona
- [ ] Carregar funciona
- [ ] Voltar ao Menu funciona

### Validacao Tecnica
- [ ] git diff --check passa limpo
- [ ] HTML5/Canvas intocado
- [ ] Cenas abrem sem erro no Godot

### Controles
- W, A, S, D: mover
- Mouse: camera
- Shift: sprint
- Espaco: dodge
- Clique esquerdo: ataque
- R: reanimar esqueleto soldado
- Shift+R: reanimar esqueleto arqueiro
- 1: FOLLOW
- 2: ATTACK
- 3: RECALL
- E: interagir/viajar
- Esc: pause menu
- F5: reiniciar cena

### Cenas para Validacao
- MainMenu.tscn
- Hub_VeyrholdOutskirts.tscn
- FronteiraCinzas_PrototypeArea.tscn
- MiniDungeon_CryptOfVeyrfall.tscn
- BossRavanPrototype3D.tscn
- PrototypeArena3D.tscn

### Nova Area - Fronteira de Cinzas
- Terreno simples renderiza
- Propriedades placeholder visiveis
- 3-6 inimigos distribuidos
- Pelo menos 1 entrada/retorno para hub
- Combate com necromancia util

### Segundo Servo
- SkeletonArcher funcional
- Atira de longe
- Vida menor que soldado
- Respeita comandos 1/2/3
- Custo: 20 essencia

### Boss Ravan Fase 2
- Ativa abaixo de 50% HP
- Log: "Ravan enters phase 2 - Sacred Fury"
- HUD message
- Dano aumento 25%
- Velocidade aumentada
