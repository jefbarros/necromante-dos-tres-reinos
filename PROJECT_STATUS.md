# Project Status

## Versao Atual

v0.3.4

## Estado Geral

Polimento visual/mobile da UX/UI v0.3.3 e regressao dos sistemas centrais antes de expansoes maiores.

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao futura para Android e Windows;
- arte dark fantasy/isometrica via `src/art.js`.

A v0.3.4 estabiliza hover/clique/scroll nos menus de Canvas, melhora a responsividade de Equipe, Inventario, Talentos e Mapa, limita textos que estouravam em cards/botoes e preserva compatibilidade com saves v0.3.2/v0.3.3. Neblina de Guerra, mapas completos de todas as racas, builds nativos, 3D real e faccoes avancadas seguem fora desta versao.

## Sistemas Alterados

- `src/config.js` & `package.json`: v0.3.4.
- `src/game.js`: compatibilidade de selecao em reserva filtrada/ordenada, comparacao "Diferente" e schema 0.3.4 via saves.
- `src/ui.js`: truncamento de texto, barra rapida compacta, layout mobile de Equipe, Talentos compactos por caminho, Inventario/Mapa mais defensivos.
- `src/input.js`: ponte de ponteiro e roda do Canvas mantida sem quebrar ataque no gameplay.
- `src/saveManager.js` & `src/localSave.js`: schema 0.3.4 mantendo migracao de saves antigos.
- `index.html`: favicon embutido simples.
- `.gitattributes`: padronizacao LF/CRLF.
- `README.md`: atualizado para v0.3.4.
- `docs/tests/REGRESSION_v0.3.4.md`: novo roteiro de regressao.

## Bugs Corrigidos

- Favicon deixa de gerar 404 comum no navegador.
- Cliques no Canvas em menus deixam de disparar ataque quando uma area de UI foi acionada.

## Arte e UI

- Mantida a identidade dark fantasy/isometrica da v0.2.5/v0.2.6/v0.2.8.
- HUD mostra Auto-ataque ON/OFF.
- Barra rapida no HUD abre Menu, Equipe, Inventario, Talentos e Mapa por mouse.
- Barra rapida compacta usa linha horizontal para reduzir conflito com controles mobile.
- Telas de Equipe, Inventario, Talentos, Menu, Save/Carregar, Conta e Mapa respondem a mouse com hover.
- Equipe mostra ativos e reserva em cards, filtros, ordenacao, scroll e painel de detalhes/acoes, com empilhamento no mobile.
- Inventario mostra abas, cards por item, raridade, quantidade, scroll, acoes e comparacao de equipamento com textos limitados.
- Talentos mostram quatro caminhos no desktop e seletor de caminho no compact/mobile.
- Mapa do Mundo mostra lista, nos visuais, painel da regiao e botao Viajar com layout compacto defensivo.
- Save/export continua sem persistir estado runtime de UI.
- Objetivo inicial continua no HUD.

## Mapas Testados

- Cripta Inicial: combate com dano reduzido.
- Cemiterio Neutro: boss com telegraph e danos ajustados.
- Estrada dos Enforcados:portal futuro/bloqueado.
- Area Secreta da Cripta: recompensas e pontos de lore.

## Testes Realizados

- `npm.cmd run check`.
- Regressao manual prevista em `docs/tests/REGRESSION_v0.3.4.md`.

## Bugs Conhecidos

- Firebase real segue como estrutura preparada; sem `src/firebaseConfig.local.js`, o jogo usa mockCloud.
- Builds Android/Windows nativos seguem fora da v0.3.4.
- Algumas strings do codigo seguem em ASCII para manter consistencia com arquivos existentes.
- MockCloud exige login mock e dados em `localStorage`.

## Proxima Etapa Recomendada

Validar manualmente a regressao v0.3.4 em desktop e mobile. Depois, priorizar expansao de conteudo apenas se a navegacao por mouse/toque e saves antigos estiverem estaveis.

## Regra Permanente

Toda versao que alterar visual, mapa, personagem, UI ou efeito deve atualizar `ART_BIBLE.md` quando necessario, alem de `README.md` e `PROJECT_STATUS.md`.
