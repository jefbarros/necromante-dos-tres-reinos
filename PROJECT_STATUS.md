# Project Status

## Versao Atual

v0.3.2

## Estado Geral

Revisao de sistemas centrais e UX antes de expansoes maiores.

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao futura para Android e Windows;
- arte dark fantasy/isometrica via `src/art.js`.

A v0.3.2 melhora Equipe, Inventario, Talentos, Menu, coleta de almas, drops e ataque basico/auto-ataque. Neblina de Guerra, mapas maiores, builds nativos, 3D real e faccoes avancadas seguem fora desta versao.

## Sistemas Alterados

- `src/config.js` & `package.json`: v0.3.2.
- `src/game.js`: gerenciamento de equipe, inventario estruturado, talentos, auto-coleta, drops e auto-ataque.
- `src/ui.js`: telas de Equipe, Inventario, Talentos, Menu e HUD atualizadas.
- `src/input.js` & `index.html`: sequencia de ataque/habilidades atualizada e botao de auto-ataque.
- `src/saveManager.js` & `src/localSave.js`: schema 0.3.2 e migracao suave de inventario antigo.
- `README.md`: atualizado para v0.3.2.
- `docs/tests/REGRESSION_v0.3.2.md`: novo roteiro de regressao.

## Bugs Corrigidos

- Selecao de talentos agora percorre todos os talentos da lista.
- Inventarios antigos sao normalizados para equipamentos, consumiveis e materiais.
- Conta e Salvar/Carregar nao dependem mais de botoes superiores separados.

## Arte e UI

- Mantida a identidade dark fantasy/isometrica da v0.2.5/v0.2.6/v0.2.8.
- HUD mostra Auto-ataque ON/OFF.
- Telas de Equipe, Inventario e Talentos exibem dados e requisitos mais claros.
- Save/export continua sem persistir estado runtime de UI.
- Objetivo inicial continua no HUD.

## Mapas Testados

- Cripta Inicial: combate com dano reduzido.
- Cemiterio Neutro: boss com telegraph e danos ajustados.
- Estrada dos Enforcados:portal futuro/bloqueado.
- Area Secreta da Cripta: recompensas e pontos de lore.

## Testes Realizados

- `npm.cmd run check`.
- Regressao manual prevista em `docs/tests/REGRESSION_v0.3.2.md`.

## Bugs Conhecidos

- Firebase real segue como estrutura preparada; sem `src/firebaseConfig.local.js`, o jogo usa mockCloud.
- Builds Android/Windows nativos seguem fora da v0.3.2.
- Algumas strings do codigo seguem em ASCII para manter consistencia com arquivos existentes.
- MockCloud exige login mock e dados em `localStorage`.

## Proxima Etapa Recomendada

Validar manualmente a regressao v0.3.2 e, depois, retomar priorizacao de mapa/visibilidade somente quando os sistemas centrais estiverem estaveis.

## Regra Permanente

Toda versao que alterar visual, mapa, personagem, UI ou efeito deve atualizar `ART_BIBLE.md` quando necessario, alem de `README.md` e `PROJECT_STATUS.md`.
