# Modelo de Dados Godot

O port Godot deve separar definicoes de conteudo do estado salvo da partida. Definicoes estaticas devem ficar em resources; progresso do jogador deve ficar no save.

## Estrutura sugerida

```text
resources/
  items/
  skills/
  talents/
  enemies/
  regions/
```

## resources/items

Definicoes de itens.

Campos sugeridos:

- `id`
- `name`
- `description`
- `type`
- `rarity`
- `stackable`
- `max_stack`
- `equip_slot`
- `modifiers`
- `use_effects`

Tipos iniciais possiveis:

- Consumivel.
- Equipamento.
- Material.
- Chave/progresso.

## resources/skills

Definicoes de habilidades usadas por Player, Servos e Inimigos.

Campos sugeridos:

- `id`
- `name`
- `description`
- `owner_type`
- `cooldown`
- `range`
- `cost`
- `targeting`
- `effects`
- `animation_key`

## resources/talents

Definicoes de talentos e progressao.

Campos sugeridos:

- `id`
- `name`
- `description`
- `cost`
- `prerequisites`
- `effects`
- `tier`
- `icon_key`

## resources/enemies

Definicoes de inimigos configurando a cena base `Enemy.tscn`.

Campos sugeridos:

- `id`
- `name`
- `max_health`
- `stats`
- `skills`
- `ai_profile`
- `loot_table`
- `experience_reward`
- `region_tags`

## resources/regions

Definicoes de regioes usadas por `WorldMap.tscn` e `RegionMap.tscn`.

Campos sugeridos:

- `id`
- `name`
- `description`
- `difficulty`
- `biome`
- `enemy_pool`
- `encounters`
- `rewards`
- `unlock_requirements`
- `mission_hooks`

## Estado salvo

O save deve guardar referencias por `id`, nao copias completas dos resources.

Estado sugerido:

- Player: atributos atuais, progresso, recursos e posicao quando aplicavel.
- Inventario: `item_id` e quantidade.
- Equipamentos: slot e `item_id`.
- Servos: servos desbloqueados, equipe ativa e progresso individual.
- Talentos: `talent_id` desbloqueados.
- Regioes: regioes desbloqueadas, progresso e objetivos concluidos.
- Missoes: estado de objetivos ativos/concluidos.

## Regras de compatibilidade

- Resources definem o conteudo padrao.
- Save define o progresso do jogador.
- Alteracoes de balanceamento em resources nao devem quebrar saves existentes.
- IDs devem ser estaveis depois de publicados.
- Conversores de save devem ser previstos caso o formato mude.
