# HTML5/Canvas Legado

## Visão Geral

O protótipo **HTML5/Canvas** está **congelado em v0.3.4** como legado e laboratório de referência.

Ele served como base essencial para:
- Validação rápida de sistemas.
- Teste de balanceamento.
- Experimentos de UX e gameplay.
- Desenvolvimento independente de game engine.

## Status

| Item | Status |
|------|--------|
| Versão | v0.3.4 |
| Plataforma | HTML5/JavaScript/Canvas |
| Estado | **Congelado** |
| Manutenção | Correções emergenciais apenas |

## O que foi entregue (até v0.3.4)

### Sistemas Implementados

- Mapas separados (Cripta, Cemitério, Estrada, Área Secreta)
- Portais e teleporte
- Minimapa e pontos de interesse
- Sistema de combate (ataque, habilidades)
- Captura de almas
- Servos (ativos e reserva)
- Inventário e equipamentos
- Árvore de talentos
- Fusão de servos
- Reputação
- Área Secreta
- Save local
- Save Cloud Mock
- Conta Mock
- Sistema de sync
- HUD completo
- Responsividade mobile

### Controles

- WASD / Setas: mover
- 1 / Espaço: ataque básico
- 2-5: habilidades
- C: capturar/confirma
- Q: comando de servos
- M: menu / fechar
- ESC: fechar / menu
- E: entrar em portal
- Enter/Mapa: confirmar

## Por que está congelado

O HTML5/Canvas serviu seu propósito como:
1. **Laboratório**: Validou sistemas de forma rápida.
2. **Protótipo**: Demonstrou jogabilidade.
3. **Referência**: Forneceu design para portar para Godot.

A partir da fase G2, **Godot é a nova plataforma principal de produção**.

## Regras de Legado

- **Não receber novas features** - Apenas correções emergenciais.
- **Código fonte `src/*.js` não deve ser alterado** em tarefas Godot.
- **Pode ser usado como referência** para:
  - Sistemas (captura, servos, inventário)
  - UI (menus, HUD, inventário)
  - Progressão (XP, level, atributos)
  - Equipe e gerenciamento de servos
  - Mapa e regiões
  - Responsividade mobile/desktop

## Tags Relevantes

- `v0.3.4` - Última versão estável
- `v0.3.3` - UX/Mouse overhaul
- `v0.3.2` - Sistemas centrais

## Executando o Legado

```bash
# Servidor local
npm run dev

# ou
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Validação

```bash
npm.cmd run check
```

## Notas

- Saves do HTML5 **não são compatíveis** com Godot.
- Não há migração automática de saves.
- O legado permanece como referência histórica.
- A comunidade pode usar para aprendizado.

## Links

- README principal: `README.md`
- PROJECT_STATUS: `PROJECT_STATUS.md`
- Documentação Godot: `docs/godot/`
- Build Godot Web: `docs/play-godot/index.html`
