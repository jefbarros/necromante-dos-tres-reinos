# QA G10 - MVP PC Playtest Build & Polish

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
- [ ] Portal da Arena visivel
- [ ] Portal da Fronteira de Cinzas visivel

### Travel - Hub <-> Fronteira de Cinzas
- [ ] Label "E: Viajar para Fronteira de Cinzas" aparece
- [ ] Pressionar E troca para FronteiraCinzas_PrototypeArea
- [ ] Player spawn na Fronteira de Cinzas
- [ ] ReturnToHub visivel
- [ ] Pressionar E retorna ao hub
- [ ] Player spawn corretamente ao retornar

### Fronteira de Cinzas
- [ ] FronteiraCinzas_PrototypeArea carrega
- [ ] TitleLabel "Fronteira de Cinzas" visivel
- [ ] 2x CorruptedWolf presentes
- [ ] 2x OrderSoldier presentes
- [ ] Props (ruins, trees, bones) visiveis
- [ ] Ambiente renderiza corretamente

### Combate
- [ ] CorruptedWolf persegue player
- [ ] CorruptedWolf causa dano
- [ ] OrderSoldier persegue player
- [ ] OrderSoldier causa dano
- [ ] Ataque basico causa dano aos inimigos
- [ ] Inimigos morte e concedem essencia
- [ ] Inimigos concedem XP
- [ ] Cadaver spawna onde aplicavel

### Necromancia
- [ ] R invoca esqueleto soldado (15 essencia)
- [ ] Shift+R invoca esqueleto arqueiro (20 essencia)
- [ ] Servo soldado segue player
- [ ] Servo arqueiro segue player
- [ ] Comando 1: FOLLOW funciona
- [ ] Comando 2: ATTACK funciona
- [ ] Comando 3: RECALL funciona
- [ ] Arqueiro ataca de longe
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
- [ ] Salvar durante gameplay no hub
- [ ] Carregar save funciona no hub
- [ ] Salvar na Fronteira de Cinzas
- [ ] Carregar save funciona na Fronteira
- [ ] Last scene persiste corretamente

### Pause Menu
- [ ] Esc abre pause menu
- [ ] Continuar funciona
- [ ] Salvar funciona
- [ ] Carregar funciona
- [ ] Voltar ao Menu funciona
- [ ] Sair funciona

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
- R: reanimar esqueleto soldado (15 essencia)
- Shift+R: reanimar esqueleto arqueiro (20 essencia)
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
- CorruptedWolf3D.tscn
- OrderSoldier3D.tscn
- SkeletonArcherServant3D.tscn
- SkeletonServant3D.tscn

### Nova Area - Fronteira de Cinzas (G10)
- [ ] Terreno simples 20x20 renderiza
- [ ] Parede de colisao funciona
- [ ] Iluminacao ambiente funcao
- [ ] Propriedades placeholder visiveis
- [ ] 4 inimigos distribuidos (2 wolves + 2 soldiers)
- [ ] AreaTransition para hub funciona
- [ ] Combate com necromancia funcional

### Segundo Servo - Arqueiro
- [ ] SkeletonArcher funcional
- [ ] Atira de lejos (8m range)
- [ ] Vida menor que soldado (25 HP)
- [ ] Respeita comandos 1/2/3
- [ ] Custo: 20 essencia
- [ ] Dano: 8

### Boss Ravan Fase 2
- [ ] Ativa abaixo de 50% HP
- [ ] Log: "Ravan enters phase 2 - Sacred Fury"
- [ ] HUD message 显示
- [ ] Dano aumento 25%
- [ ] Velocidade mantida ou aumentada

### Build Windows
- [ ] Export preset configurado
- [ ] Build gera sem erro
- [ ] .exe executa
- [ ] Jogo inicia corretamente

### Balanceamento Inicial (Documentar)
- Player HP: 100
- Player Attack: 18
- CorruptedWolf HP: 30, Dano: 12, Essencia: 5
- OrderSoldier HP: 50, Dano: 15, Essencia: 8
- SkeletonServant HP: 35, Dano: 10
- SkeletonArcher HP: 25, Dano: 8, Range: 8
- Boss Ravan HP: 300, Dano: 25->31 (fase 2)

### Riscos Conhecidos
- Save system e basico (slot unico)
- AreaTransition depende de get_tree().change_scene_to_packed()
- Inimigos tem pathfinding simples
- HUD e Placeholder visual
