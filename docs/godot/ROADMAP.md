# Roadmap Godot

Este roadmap organiza a transicao para Godot em fases. O prototipo HTML5/Canvas continua sendo o prototipo jogavel e a principal referencia de validacao durante a migracao.

## G0 Documentacao

Objetivo: preparar a transicao sem implementar Godot.

Entregas:

- Documentacao inicial em `docs/godot`.
- Plano de port.
- Mapeamento de sistemas.
- Proposta de estrutura de cenas.
- Proposta de modelo de dados.
- Roadmap de migracao.

Criterios de conclusao:

- Nenhum gameplay HTML5 alterado.
- Nenhum codigo Godot implementado por esta fase.
- Sistemas principais mapeados.

## G1 Movimento/combate minimo

Objetivo: criar uma primeira base jogavel em Godot com o menor conjunto possivel.

Entregas futuras:

- `Main.tscn`.
- `Player.tscn`.
- `Enemy.tscn`.
- Movimento basico.
- Colisao basica.
- Ataque/dano minimo.
- HUD temporario para vida e feedback.

Criterios de conclusao:

- Player se move.
- Inimigo pode receber dano.
- Player pode receber dano.
- Combate minimo validado contra o comportamento esperado do prototipo.

## G2 Servos/equipe

Objetivo: migrar a base de servos e composicao de equipe.

Entregas futuras:

- `Servant.tscn`.
- AI aliada inicial.
- Seguimento do Player.
- Participacao de servos em combate.
- Tela inicial `UI/Team.tscn`.

Criterios de conclusao:

- Pelo menos um servo pode acompanhar o Player.
- Servo participa do combate.
- Equipe ativa pode ser representada na UI.

## G3 Inventario/talentos/save

Objetivo: migrar os sistemas de progressao e persistencia.

Entregas futuras:

- `UI/Inventory.tscn`.
- `UI/Talents.tscn`.
- Modelo de itens em `resources/items`.
- Modelo de talentos em `resources/talents`.
- Save/load Godot.
- Equipamentos basicos.

Criterios de conclusao:

- Inventario persiste no save.
- Equipamentos alteram atributos.
- Talentos podem ser desbloqueados e persistidos.
- Save reconstrui o estado principal da partida.

## G4 Mundo/regioes/missoes

Objetivo: consolidar estrutura de mundo e progressao macro.

Entregas futuras:

- `WorldMap.tscn`.
- `RegionMap.tscn`.
- Dados em `resources/regions`.
- Dados em `resources/enemies`.
- Desbloqueio de regioes.
- Objetivos/missoes iniciais.

Criterios de conclusao:

- Jogador pode selecionar regioes.
- Regioes carregam encontros e inimigos adequados.
- Progresso de regioes e missoes persiste no save.
- Estrutura suporta expansao de conteudo.
