# Project Status

## Versao Atual

v0.2.8

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

A v0.2.8 estabiliza o loop jogavel inicial com objetivo atual no HUD. O fluxo guia o jogador da Cripta Inicial ao Cemiterio Neutro, captura da primeira alma, queda do Guardiao de Tumba e desbloqueio da Area Secreta, preservando a correcao da v0.2.7 que impede abertura automatica da tela de Equipe.

## Sistemas Alterados

- `ART_BIBLE.md`: novo documento permanente de direcao visual.
- `docs/concept-art/README.md`: documenta uso de concept art e referencias.
- `src/config.js`: versao atualizada para `0.2.8`.
- `package.json`: versao atualizada para `0.2.8`.
- `src/art.js`: qualidade visual dinamica `low`/`medium`/`high`, persistida localmente.
- `src/game.js`: objetivo inicial, reset runtime de UI, fechamento central de telas, F10 de recuperacao, Novo Jogo/Continuar/Carregar Save voltando ao gameplay.
- `src/input.js`: atalho `F10` e limpeza de input runtime.
- `src/ui.js`: HUD com objetivo atual e textos de navegacao atualizados para ESC/M/Mapa/F10.
- `src/saveManager.js`: schema v0.2.8, migracao de saves antigos, progresso de objetivo e remocao de campos runtime de UI.
- `src/localSave.js`: schema/metadados v0.2.8.
- `src/cloudSave.js`: metadados mockCloud mais completos.
- `src/syncManager.js`: syncNow usa save local quando nenhum save e passado e Cancelar conflito preserva status de conflito.
- `src/auth.js`: login mock direto para uso pela tela Conta.
- `index.html`: modal de save/conflito.
- `styles.css`: modal responsivo e ajustes de controles mobile.
- `README.md`: documentacao atualizada para v0.2.8.
- `docs/tests/REGRESSION_v0.2.8.md`: roteiro de regressao do loop inicial e fluxo de UI.

## Bugs Corrigidos

- Corrigido bug critico da v0.2.6 em que Novo Jogo e saves carregados abriam `screen = "team"` automaticamente.
- Equipe, Inventario, Talentos, Conta e Carregar Save agora possuem saida por ESC/M/Mapa quando o jogo ja esta em gameplay.
- `F10` e `window.forceReturnToGame()` recuperam UI presa durante desenvolvimento.
- Importar Save, Carregar Local, Carregar Nuvem e resolver conflito resetam a UI runtime antes de voltar ao gameplay.
- SaveManager ignora campos antigos de tela/menu/modal/inputLock em saves migrados.
- Importacao de save deixou de depender do console e agora usa modal com textarea.
- Exportacao de save deixou de depender do console e agora mostra JSON formatado na UI.
- Resolucao de conflito agora tem botoes funcionais para usar Local, usar Nuvem ou cancelar.
- Tela Carregar Save agora mostra metadados local/nuvem/mockCloud.
- Login mock da tela Conta agora possui funcao dedicada.
- Qualidade visual pode ser alternada por UI e fica persistida localmente.
- HUD, minimapa, botoes mobile e modais foram reduzidos para telas pequenas.
- Objetivo atual aparece no HUD e guia o ciclo inicial de gameplay.
- Save/export persiste `objectiveProgress` sem persistir `screen`, `activeModal`, `selectedMenu` ou `inputLock`.

## Arte e UI

- Mantida a identidade dark fantasy/isometrica da v0.2.5.
- A v0.2.8 preserva a direcao visual propria e apenas acrescenta o bloco de objetivo no HUD.
- `ART_BIBLE.md` passa a ser referencia obrigatoria para mudancas visuais.
- `VISUAL_QUALITY`/`GameConfig.visualQuality` segue `medium` por padrao.
- `low` reduz particulas, auras e detalhes.
- `high` aumenta particulas, brilho de portais e detalhes de tile.

## Mapas Testados

- Cripta Inicial: spawn, HUD, minimapa, portal, objetos e leitura visual.
- Cemiterio Neutro: portal, inimigos, boss/arena, minimapa e labels.
- Estrada dos Enforcados: portal futuro/bloqueado, props, inimigos e leitura de caminho.
- Area Secreta da Cripta: portal, props, pontos de lore/recompensa e minimapa.

## Testes Realizados

- `node --check` em todos os arquivos JS.
- `npm run check`.
- Navegador local via servidor estatico.
- Novo Jogo entra direto na Cripta Inicial em gameplay.
- Movimento do jogador apos Novo Jogo.
- Equipe abre e fecha com ESC, M, Mapa/Enter, botao Voltar contextual e `window.forceReturnToGame()`.
- Inventario, Talentos, Conta e Carregar Save fecham sem prender input.
- Continuar carrega save e volta ao mapa.
- Carregar Save Local e MockCloud voltam ao gameplay.
- Exportar/Importar Save podem ser cancelados sem travar a UI.
- Conflito local/nuvem mantem Cancelar funcional e opcoes Local/Nuvem sem prender input.
- F10 recupera a UI e mostra `UI recuperada.`.
- Objetivo inicial aparece no HUD.
- Objetivo avanca por interacao na cripta, entrada no cemiterio, combate, captura, boss e area secreta.
- Save/export contem `objectiveProgress`.
- Save/export nao contem estado runtime de UI como `screen`, `activeModal`, `selectedMenu` ou `inputLock`.

## Bugs Conhecidos

- Firebase real segue como estrutura preparada; sem `src/firebaseConfig.local.js`, o jogo usa mockCloud.
- Builds Android/Windows nativos ainda nao foram gerados nesta maquina.
- Algumas strings do codigo seguem em ASCII para manter consistencia com arquivos existentes.
- MockCloud exige login mock e dados em `localStorage`; quando nao ha save em nuvem, o jogo apenas notifica indisponibilidade.

## Proxima Etapa Recomendada

v0.2.9 deve focar em balanceamento, telegraphs de inimigos, configuracoes dedicadas fora da tela Conta e validacao real em Android/Windows quando o ambiente Capacitor/Tauri estiver pronto.

## Regra Permanente

Toda versao que alterar visual, mapa, personagem, UI ou efeito deve atualizar `ART_BIBLE.md` quando necessario, alem de `README.md` e `PROJECT_STATUS.md`.
