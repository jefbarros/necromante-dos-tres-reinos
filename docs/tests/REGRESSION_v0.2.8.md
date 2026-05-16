# Regressao v0.2.8 - Objetivos Iniciais

## Objetivo

Validar que o loop inicial guia o jogador sem reintroduzir regressao de UI da v0.2.7.

## Checklist Obrigatorio

- [ ] `node --check` passa em todos os arquivos JS.
- [ ] `npm run check` passa.
- [ ] Novo Jogo entra direto no gameplay.
- [ ] Continuar entra direto no gameplay.
- [ ] Carregar Local entra direto no gameplay.
- [ ] Carregar MockCloud entra direto no gameplay.
- [ ] ESC/M/Mapa/Voltar continuam fechando menus e modais.
- [ ] F10 continua recuperando UI presa.
- [ ] Objetivo inicial aparece no HUD.
- [ ] Objetivo avanca ao despertar na Cripta Inicial.
- [ ] Objetivo avanca ao interagir com o Trono Funerario ou Altar de Renascimento.
- [ ] Objetivo avanca ao chegar no Cemiterio Neutro.
- [ ] Objetivo avanca apos derrotar inimigos basicos.
- [ ] Objetivo avanca apos capturar a primeira alma/servo.
- [ ] Objetivo avanca apos derrotar o Guardiao de Tumba.
- [ ] Objetivo avanca ao desbloquear a Area Secreta.
- [ ] Save/export contem `objectiveProgress`.
- [ ] Save/export nao contem `screen`, `activeModal`, `selectedMenu` ou `inputLock`.
- [ ] Console do navegador fica sem erros.

## Roteiro Manual

1. Limpe ou ignore saves anteriores e inicie `Novo Jogo`.
2. Confirme que a Cripta Inicial abre no gameplay, sem tela de Equipe.
3. Confira o objetivo no HUD.
4. Interaja com o Trono Funerario ou Altar de Renascimento.
5. Use o portal para o Cemiterio Neutro.
6. Derrote dois inimigos basicos.
7. Capture a primeira alma.
8. Derrote o Guardiao de Tumba.
9. Confirme que a Area Secreta foi desbloqueada.
10. Salve, exporte e inspecione o JSON.
11. Recarregue via Continuar, Carregar Local e MockCloud.
12. Abra Equipe, Inventario, Talentos, Conta, Carregar Save e modais de save; feche com ESC/M/Mapa/Voltar.
13. Abra uma tela qualquer e pressione F10.

## Criterios de Aceite

- O jogador nunca cai automaticamente na tela de Equipe apos Novo Jogo ou carregamento.
- O progresso persistente novo fica restrito a `objectiveProgress`.
- O objetivo atual sempre tem uma etapa valida em saves novos e migrados.
- A identidade dark fantasy/necromancia permanece propria e nao copia nomes, personagens, cenas, simbolos, arte ou lore de referencia externa.
