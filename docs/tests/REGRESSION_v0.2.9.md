# Regressao v0.2.9 - Balanceamento de Combate e Telegraphs

## Objetivo

Validar que o balanceamento de combate foi ajustado para reduzir mortes injustas e que os telegraphs visuais dao aviso antes de ataques perigosos.

## Checklist Obrigatorio

- [ ] `node --check` passa em todos os arquivos JS.
- [ ] `npm run check` passa.
- [ ] Novo Jogo entra direto no gameplay.
- [ ] Objetivo inicial aparece no HUD.
- [ ] Objetivo da v0.2.8 continua avançando.
- [ ] Inimigos basicos fazem damage reduzido (rat: 5, wolf: 10, soldier: 12, warhound: 11, cultist: 8).
- [ ] Guardiao de Tumba melee damage reduzido (22).
- [ ] Guardiao mostra telegraph antes do AOE (efeito amarelo "cuidado!").
- [ ] AOE do Guardiao reduzida (18 de damage).
- [ ] Captura da primeira alma continua fluida.
- [ ] Save/export contem `objectiveProgress`.
- [ ] Save/export nao contem `screen`, `activeModal`, `selectedMenu` ou `inputLock`.
- [ ] Continuar, Carregar Local e MockCloud voltam ao gameplay.
- [ ] ESC/M/Mapa/Voltar e F10 continuam funcionando.
- [ ] Console do navegador fica sem erros.

## Mudancas de Balanceamento

### Dano de Inimigos Basicos

| Inimigo | Damage Anterior | Damage Novo | Redução |
|--------|----------------|------------|---------|
| rat    | 7             | 5          | -2      |
| wolf   | 12            | 10         | -2      |
| soldier| 15            | 12         | -3      |
| warhound| 14            | 11         | -3      |
| cultist| 10            | 8          | -2      |

### Guardiao de Tumba

| Ataque  | Anterior | Novo | Mudanca |
|--------|---------|------|--------|
| Melee  | 28      | 22   | -6     |
| AOE    | 24      | 18   | -6     |
| Telegraph | N/A | 2s | Novo   |

## Roteiro Manual

1. Limpe saves anteriores e inicie `Novo Jogo`.
2. Confirme que a Cripta Inicial abre no gameplay com objetivo no HUD.
3. Interaja com o Trono Funerario ou Altar de Renascimento.
4. Use o portal para o Cemiterio Neutro.
5. Derrote dois inimigos basicos (rato e lobo) e confirme que o dano recebido e menor.
6. Capture a primeira alma.
7. Derrote o Guardiao de Tumba:
   - Confirme que o telegraph amarelo aparece antes do AOE.
   - Confirme que a mensagem "cuidado!" aparece.
   - Confirme que o dano do AOE e menor (18 em vez de 24).
8. Salve, exporte e inspecione o JSON.
9. Recarregue via Continuar, Carregar Local e MockCloud.
10. Abra e feche menus com ESC/M/Mapa/Voltar.
11. Pressione F10 e confirme recuperacao.
12. Navegue pelo console para verificar telegraphs.

## Criterios de Aceite

- O jogador recebe menos dano de inimigos basicos no inicio.
- O Guardiao de Tumba da aviso visual antes de usar AOE.
- O dano do AOE do Guardiao foi reduzido.
- O objetivo inicial continua funcionando.
- A identidade dark fantasy/necromancia permanece propria.
