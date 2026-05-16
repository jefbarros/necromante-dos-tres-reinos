# Project Status

## Versao Atual

v0.2.9

## Estado Geral

O projeto esta em uma branch com a base hibrida de v0.2.3/v0.2.4 e a direcao visual da v0.2.5 preservadas:

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao para Android e Windows;
- arte dark fantasy/isometrica via `src/art.js`.

A v0.2.9 melhora o balanceamento de combate para dispositivos moveis e adiciona telegraphs visuais para ataques perigosos, reduzindo mortes injustas no inicio do jogo. O fluxo preserva a correcao da v0.2.7 que impede abertura automatica da tela de Equipe e o objetivo no HUD da v0.2.8.

## Sistemas Alterados

- `src/config.js`: versao atualizada para `0.2.9`, dano de inimigos basicos reduzido (rat: 7->5, wolf: 12->10, soldier: 15->12, warhound: 14->11, cultist: 10->8), guardiao melee 28->22, guardiao AOE 24->18.
- `package.json`: versao atualizada para `0.2.9`.
- `src/ai.js`: telegraph visual de 2 segundos antes do AOE do Guardiao de Tumba (efeito amarelo "cuidado!").
- `README.md`: documentacao atualizada para v0.2.9.
- `PROJECT_STATUS.md`: status atualizado para v0.2.9.
- `docs/tests/REGRESSION_v0.2.9.md`: roteiro de regressao do balanceamento e telegraphs.

## Bugs Corrigidos

- Dano de inimigos basicos reduzido para evitar mortes injustas no inicio do jogo.
- Guardiao de Tumba melee e AOE com danos reduzidos.
- Telegraph visual amarelo "cuidado!" 2 segundos antes do AOE do Guardiao.

## Arte e UI

- Mantida a identidade dark fantasy/isometrica da v0.2.5/v0.2.6/v0.2.8.
- Telegraph visual do Guardiao de Tumba usa efeito amarelo para aviso de AOE.
- Save/export continua sem persistir estado runtime de UI.
- Objetivo inicial continua no HUD.

## Mapas Testados

- Cripta Inicial: combate com dano reduzido.
- Cemiterio Neutro: boss com telegraph e danos ajustados.
- Estrada dos Enforcados:portal futuro/bloqueado.
- Area Secreta da Cripta: recompensas e pontos de lore.

## Testes Realizados

- `node --check` em todos os arquivos JS.
- `node --check src/config.js`, `src/ai.js`, `src/game.js`, `src/entities.js`.
- Novo Jogo entra direto no gameplay com objetivo no HUD.
- Inimigos basicos com dano reduzido visivel.
- Guardiao de Tumba mostra telegraph antes do AOE.
- Save/export contem `objectiveProgress`.
- Save/export nao contem `screen`, `activeModal`, `selectedMenu` ou `inputLock`.

## Bugs Conhecidos

- Firebase real segue como estrutura preparada; sem `src/firebaseConfig.local.js`, o jogo usa mockCloud.
- Builds Android/Windows nativos ainda nao foram gerados nesta maquina.
- Algumas strings do codigo seguem em ASCII para manter consistencia com arquivos existentes.
- MockCloud exige login mock e dados em `localStorage`.

## Proxima Etapa Recomendada

v0.2.10 deve continuar refinando combat balance, adicionando mais telegraphs, construcao de area bosses e uma tela dedicada de configuracoes fora da tela Conta.

## Regra Permanente

Toda versao que alterar visual, mapa, personagem, UI ou efeito deve atualizar `ART_BIBLE.md` quando necessario, alem de `README.md` e `PROJECT_STATUS.md`.
