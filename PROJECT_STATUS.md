# Project Status

## Versao Atual

v0.3.3

## Estado Geral

UX/UI overhaul com mouse, barra rapida, menus ricos, equipamentos, talentos clicaveis e mapa-mundi interativo antes de expansoes maiores.

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao futura para Android e Windows;
- arte dark fantasy/isometrica via `src/art.js`.

A v0.3.3 adiciona hover/clique nos menus de Canvas, barra rapida no HUD, scroll em listas, status e comparacao de equipamentos, talentos em caminhos e interacao direta no Mapa do Mundo. Neblina de Guerra, mapas completos de todas as racas, builds nativos, 3D real e faccoes avancadas seguem fora desta versao.

## Sistemas Alterados

- `src/config.js` & `package.json`: v0.3.3 e metadados de equipamentos.
- `src/game.js`: ponte de clique/hover/scroll para Canvas, barra rapida, filtros/ordenacao de reserva, comparacao de equipamentos e regra de regiao por nivel/Guardiao/futuro.
- `src/ui.js`: hit areas consolidadas, botoes/cards/abas/scroll, barra rapida, Equipe, Inventario, Talentos e Mapa mais ricos.
- `src/input.js`: ponte de ponteiro e roda do Canvas para a UI sem quebrar ataque no gameplay.
- `src/saveManager.js` & `src/localSave.js`: schema 0.3.3.
- `index.html`: favicon embutido simples.
- `.gitattributes`: padronizacao LF/CRLF.
- `README.md`: atualizado para v0.3.3.
- `docs/tests/REGRESSION_v0.3.3.md`: novo roteiro de regressao.

## Bugs Corrigidos

- Favicon deixa de gerar 404 comum no navegador.
- Cliques no Canvas em menus deixam de disparar ataque quando uma area de UI foi acionada.

## Arte e UI

- Mantida a identidade dark fantasy/isometrica da v0.2.5/v0.2.6/v0.2.8.
- HUD mostra Auto-ataque ON/OFF.
- Barra rapida no HUD abre Menu, Equipe, Inventario, Talentos e Mapa por mouse.
- Telas de Equipe, Inventario, Talentos, Menu, Save/Carregar, Conta e Mapa respondem a mouse com hover.
- Equipe mostra ativos e reserva em cards, filtros, ordenacao, scroll e painel de detalhes/acoes.
- Inventario mostra abas, cards por item, raridade, quantidade, scroll, acoes e comparacao de equipamento.
- Talentos mostram quatro caminhos com nodes clicaveis e painel de desbloqueio.
- Mapa do Mundo mostra lista, nos visuais, painel da regiao e botao Viajar.
- Save/export continua sem persistir estado runtime de UI.
- Objetivo inicial continua no HUD.

## Mapas Testados

- Cripta Inicial: combate com dano reduzido.
- Cemiterio Neutro: boss com telegraph e danos ajustados.
- Estrada dos Enforcados:portal futuro/bloqueado.
- Area Secreta da Cripta: recompensas e pontos de lore.

## Testes Realizados

- `npm.cmd run check`.
- Regressao manual prevista em `docs/tests/REGRESSION_v0.3.3.md`.

## Bugs Conhecidos

- Firebase real segue como estrutura preparada; sem `src/firebaseConfig.local.js`, o jogo usa mockCloud.
- Builds Android/Windows nativos seguem fora da v0.3.3.
- Algumas strings do codigo seguem em ASCII para manter consistencia com arquivos existentes.
- MockCloud exige login mock e dados em `localStorage`.

## Proxima Etapa Recomendada

Validar manualmente a regressao v0.3.3 e, depois, priorizar mapa/visibilidade somente quando a navegacao por mouse estiver estavel.

## Regra Permanente

Toda versao que alterar visual, mapa, personagem, UI ou efeito deve atualizar `ART_BIBLE.md` quando necessario, alem de `README.md` e `PROJECT_STATUS.md`.
