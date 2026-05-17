# Estrutura de Cenas Godot

Esta e uma proposta inicial de organizacao de cenas. Ela nao deve ser implementada nesta etapa; serve apenas como guia para a futura base de producao em Godot.

## Arvore sugerida

```text
scenes/
  Main.tscn
  actors/
    Player.tscn
    Servant.tscn
    Enemy.tscn
  maps/
    WorldMap.tscn
    RegionMap.tscn
  UI/
    HUD.tscn
    Menu.tscn
    Inventory.tscn
    Team.tscn
    Talents.tscn
```

## Main.tscn

Cena raiz da aplicacao Godot.

Responsabilidades:

- Inicializar estado global.
- Carregar mapa atual.
- Instanciar Player e sistemas principais.
- Controlar transicoes entre jogo, menus e mapas.
- Coordenar save/load.

## Player.tscn

Cena da entidade controlada pelo jogador.

Responsabilidades:

- Movimento e entrada.
- Estado do personagem.
- Integracao com combate.
- Integracao com equipamentos e talentos.
- Ponto de referencia para camera e UI.

## Servant.tscn

Cena base para servos aliados.

Responsabilidades:

- AI aliada.
- Seguimento do Player.
- Ataques e habilidades.
- Dados configuraveis por resource.
- Participacao no sistema de equipe.

## Enemy.tscn

Cena base para inimigos.

Responsabilidades:

- AI hostil.
- Percepcao de alvo.
- Movimento e ataques.
- Dados configuraveis por resource.
- Emissao de eventos de derrota/recompensa.

## WorldMap.tscn

Cena de navegacao macro entre regioes.

Responsabilidades:

- Mostrar regioes disponiveis.
- Indicar regioes bloqueadas/desbloqueadas.
- Permitir selecao de destino.
- Expor progresso global.

## RegionMap.tscn

Cena de gameplay dentro de uma regiao.

Responsabilidades:

- Carregar layout/terreno da regiao.
- Instanciar inimigos e encontros.
- Controlar objetivos locais.
- Reportar conclusao, derrota ou saida da regiao.

## UI/HUD.tscn

Interface principal durante o gameplay.

Responsabilidades:

- Vida/energia/recursos.
- Feedback de combate.
- Indicadores de servos/equipe.
- Atalhos para menus principais.

## UI/Menu.tscn

Menu geral do jogo.

Responsabilidades:

- Pausa.
- Navegacao para inventario, equipe e talentos.
- Opcoes principais.
- Save/load quando aplicavel.

## UI/Inventory.tscn

Tela de inventario.

Responsabilidades:

- Listar itens.
- Exibir quantidades.
- Usar consumiveis.
- Enviar itens equipaveis para slots de equipamento.

## UI/Team.tscn

Tela de equipe e servos.

Responsabilidades:

- Listar servos disponiveis.
- Selecionar composicao ativa.
- Mostrar atributos e funcoes.
- Preparar futuras melhorias de progressao de servos.

## UI/Talents.tscn

Tela de talentos.

Responsabilidades:

- Exibir talentos disponiveis e desbloqueados.
- Mostrar custos e pre-requisitos.
- Confirmar desbloqueios.
- Refletir efeitos ativos no Player e sistemas relacionados.
