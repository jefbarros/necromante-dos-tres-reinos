# Project Status

## Versao Atual

v0.3.0

## Estado Geral

O projeto inicia a fundacao de mundo aberto, estruturando o gameplay por regioes desbloqueaveis.

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao para Android e Windows;
- arte dark fantasy/isometrica via `src/art.js`.

A v0.2.9.1 refina a logica do Guardiao de Tumba, garantindo que o ataque AOE so ocorra sob condicoes especificas de proximidade, evitando gastos desnecessarios de recursos visuais e tornando o Boss mais reativo.

## Sistemas Alterados

- `src/config.js` & `package.json`: v0.3.0.
- `src/map.js`: Definicao de `WorldRegions`.
- `src/game.js`: Sistema de viagem e desbloqueio de regioes.
- `src/ui.js`: Tela de Mapa do Mundo funcional.
- `src/saveManager.js`: Novo schema v0.3.0 com suporte a regioes.
- `README.md`: documentacao atualizada para v0.2.9.
- `PROJECT_STATUS.md`: status atualizado para v0.2.9.
- `docs/tests/REGRESSION_v0.2.9.md`: roteiro de regressao do balanceamento e telegraphs.

## Bugs Corrigidos

- Dano de inimigos basicos reduzido para evitar mortes injustas no inicio do jogo.
- Guardiao de Tumba melee e AOE com danos reduzidos.
- Telegraph visual amarelo "cuidado!" 2 segundos antes do AOE do Guardiao.
- **IA Fix**: AOE do Guardiao agora respeita condicao de ameaca proxima (v0.2.9.1).
- **Visual/Audio Fix**: Pulso condicional (azul/vermelho) e som metalico indicam que o Guardiao esta carregado para o AOE.

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
