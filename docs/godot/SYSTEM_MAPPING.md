# Mapeamento de Sistemas para Godot

Este documento descreve como os sistemas atuais do prototipo HTML5/Canvas devem ser reinterpretados na futura base Godot.

## Visao geral

O prototipo HTML5 continua sendo a referencia jogavel. Godot sera a base de producao, com cenas, nodes, scripts e resources organizados por responsabilidade.

| Sistema atual | Papel no prototipo HTML5 | Direcao em Godot |
| --- | --- | --- |
| Player | Entidade principal controlada pelo jogador | `Player.tscn`, script de movimento, combate e estado do personagem |
| Servos | Aliados invocados/recrutados que apoiam o jogador | `Servant.tscn`, AI aliada, composicao de equipe e progressao |
| Inimigos | Entidades hostis com comportamento de combate | `Enemy.tscn`, AI inimiga, dados por resource |
| Combate | Resolucao de ataques, dano, habilidades e feedback | Sistema compartilhado de combate com componentes de stats, dano e habilidades |
| Inventario | Itens coletados, consumiveis e materiais | UI dedicada e modelo de dados persistente |
| Equipamentos | Itens equipaveis e modificadores de atributos | Slots de equipamento ligados ao Player e possivelmente Servos |
| Talentos | Progressao e escolhas permanentes/semi-permanentes | Arvore ou lista de talentos baseada em resources |
| Mapa | Navegacao e representacao do espaco jogavel | Separacao entre `WorldMap.tscn` e `RegionMap.tscn` |
| Regioes | Areas/biomas/zonas com conteudo e regras proprias | Resources de regioes e cenas regionais reutilizaveis |
| Save | Persistencia de progresso local/cloud no prototipo | Sistema de save Godot com serializacao de estado relevante |
| UI | HUD, menus, inventario, equipe e talentos | Cenas em `UI/` com sinais para comunicacao com o jogo |

## Player

No Godot, o Player deve ser uma cena propria (`Player.tscn`) contendo visual, colisao, movimento e pontos de integracao com combate, inventario, equipamentos e talentos.

Responsabilidades sugeridas:

- Entrada do jogador.
- Movimento.
- Estado de vida/energia/atributos.
- Execucao de ataques e habilidades.
- Aplicacao de bonus de equipamentos e talentos.

## Servos

Servos devem ser tratados como entidades aliadas independentes, reutilizando partes do sistema de combate e atributos.

Responsabilidades sugeridas:

- AI aliada.
- Seguimento do Player.
- Participacao em combate.
- Composicao de equipe.
- Dados individuais vindos de resources.

## Inimigos

Inimigos devem usar uma cena base (`Enemy.tscn`) configurada por resources de inimigo.

Responsabilidades sugeridas:

- AI hostil.
- Percepcao/alvo.
- Ataques e habilidades.
- Recompensas de derrota.
- Escalonamento por regiao.

## Combate

O combate deve ser extraido como sistema compartilhado para evitar logica duplicada entre Player, Servos e Inimigos.

Responsabilidades sugeridas:

- Calculo de dano.
- Aplicacao de efeitos.
- Cooldowns.
- Alvos.
- Eventos de morte, recompensa e feedback.

## Inventario

O inventario deve separar estado persistente, definicoes de item e UI.

Responsabilidades sugeridas:

- Lista de itens possuidos.
- Quantidades.
- Uso de consumiveis.
- Integracao com equipamentos.
- Persistencia no save.

## Equipamentos

Equipamentos devem funcionar como itens com slots e modificadores.

Responsabilidades sugeridas:

- Slots equipaveis.
- Validacao de tipo de item.
- Aplicacao/remocao de modificadores.
- Integracao com Player e possivelmente Servos.

## Talentos

Talentos devem ser data-driven para permitir expansao sem reescrever UI e regras.

Responsabilidades sugeridas:

- Lista/arvore de talentos.
- Pre-requisitos.
- Custos.
- Efeitos permanentes ou condicionais.
- Persistencia de talentos desbloqueados.

## Mapa

O mapa deve ser dividido entre mapa de mundo e mapa de regiao.

Responsabilidades sugeridas:

- `WorldMap.tscn`: selecao de regioes, progresso global e desbloqueios.
- `RegionMap.tscn`: exploracao local, encontros, inimigos e objetivos.

## Regioes

Regioes devem ser definidas por resources para controlar nome, dificuldade, inimigos, recompensas e conexoes.

Responsabilidades sugeridas:

- Identidade da regiao.
- Lista de encontros.
- Regras de spawn.
- Missoes ou objetivos.
- Progressao/desbloqueio.

## Save

O save em Godot deve persistir apenas o estado necessario para reconstruir a partida.

Responsabilidades sugeridas:

- Progresso do jogador.
- Inventario.
- Equipamentos.
- Servos/equipe.
- Talentos.
- Regioes desbloqueadas.
- Estado de missoes.

## UI

A UI deve ser composta por cenas independentes que recebem dados e emitem sinais, evitando dependencia direta de detalhes internos do gameplay.

Responsabilidades sugeridas:

- HUD.
- Menu.
- Inventario.
- Equipe.
- Talentos.
- Feedback de combate e progresso.
