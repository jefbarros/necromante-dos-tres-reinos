# TODO - v0.2.9 Combat Balance and Telegraphs

## Escopo
- Telegraphs visuais para ataques perigosos
- Balanceamento de danos de inimigos básicos
- Telegraph do Guardião de Tumba
- Documentation updates
- Tests

## Tarefas

### 1. Balanceamento de Inimigos Básicos (config.js)
- [ ] rat: damage 7 -> 5 (reduzir mortes injustas)
- [ ] wolf: damage 12 -> 10
- [ ] soldier: damage 15 -> 12
- [ ] warhound: damage 14 -> 11
- [ ] cultist: damage 10 -> 8

### 2. Telegraph do Guardião de Tumba (ai.js)
- [ ] Adicionar telegraphTimer antes do AOE (2 segundos de aviso)
- [ ] Efeito visual de telegraph (area color changing to warning)
- [ ] Reduzir damage AOE: 24 -> 18 (mais justo)
- [ ] Reduzir melee damage: 28 -> 22

### 3. Telegraph para Inimigos (entities.js)
- [ ] Adicionar telegraphColor/telegraphTimer em Enemy
- [ ] Desenhar indication visual quando telegraphing
- [ ] Imp: telegraph antes de projectile

### 4. Documentação (README.md, PROJECT_STATUS.md)
- [ ] Atualizar para v0.2.9
- [ ] Documentar mudanças de balance

### 5. Testes (REGRESSION_v0.2.9.md)
- [ ] Criar docs/tests/REGRESSION_v0.2.9.md

### 6. Versão (package.json, config.js)
- [ ] Atualizar versão para 0.2.9

## Bugs Conhecidos (pre-calibrados)
- O balanceamento é baseado em mobile touch controls
- Telegraphs usam cores padrão (poderiam usar sprites customizados no futuro)
