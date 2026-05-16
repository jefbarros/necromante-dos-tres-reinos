# Project Status

## Versao Atual

v0.2.5

## Estado Geral

O projeto esta em uma branch com a base hibrida de v0.2.3/v0.2.4 ja presente:

- HTML5/JavaScript/Canvas;
- SaveManager;
- save local;
- mock cloud;
- auth mock;
- sync manager;
- platform/deviceId;
- preparacao para Android e Windows.

A v0.2.5 adiciona uma camada de direcao de arte sem remover sistemas existentes.

## Sistemas Alterados

- `src/art.js`: novo sistema de helpers visuais.
- `src/config.js`: versao atualizada para `0.2.5` e `visualQuality: "medium"`.
- `src/entities.js`: necromante, servos, inimigos, projeteis, almas, texto flutuante e efeitos usam a camada visual nova.
- `src/map.js`: tiles com variacao deterministica, props adicionais, portais detalhados e pontos de interesse com aura/runa.
- `src/game.js`: efeitos adicionais em ataque, dreno, lanca, marca e captura.
- `src/ui.js`: paineis, barras, HUD, indicador de sync e tela de carregar save receberam acabamento visual e correcoes.
- `src/syncManager.js`: status agora retorna `label` e corrige label de conflito.
- `index.html`: carrega `src/art.js`.
- `package.json`: versao e scripts atualizados.
- `README.md`: documentacao atualizada para v0.2.5.

## Arte Detalhada

Aplicado:

- sombra isometrica;
- aura espectral;
- circulos runicos;
- barra de vida estilizada;
- labels flutuantes;
- portal com runas, particulas e estado visual;
- necromante com capuz, manto, olhos, grimorio/cajado e particulas;
- servos distinguiveis por tipo;
- inimigos distinguiveis por familia;
- Guardiao de Tumba com escala maior, runas, nucleo e telegraph;
- tiles com rachaduras, manchas e runas deterministicas;
- mapas com props adicionais;
- HUD e menus mais consistentes com dark fantasy.

## Testes Realizados

- `node --check` em todos os arquivos JS: passou apos as alteracoes de renderizacao.

Testes de navegador ainda devem ser executados ao final da rodada:

- abrir jogo local;
- verificar console;
- novo jogo;
- continuar;
- portais;
- combate;
- captura;
- menus;
- minimapa;
- mock login;
- mock cloud sync;
- conflito de save;
- performance basica.

## Bugs Conhecidos

- A tela de importacao ainda depende de uso do console via `SaveManager.importSave(JSON)`.
- A tela de conflito mostra resumo quando `SyncManager.pendingConflict` existe, mas a escolha visual completa ainda precisa ser refinada.
- Alguns textos antigos usam ASCII sem acentos para evitar problemas de encoding no workspace.
- `TODO.md` ja estava modificado antes desta rodada e nao foi alterado por esta implementacao.

## Proxima Etapa Recomendada

v0.2.6 deve focar em:

- fluxo real de importacao de JSON por textarea/modal;
- tela completa de resolucao de conflito com botoes funcionais;
- selector de qualidade visual low/medium/high;
- mais telegraphs de inimigos;
- ajustes de balanceamento visual para telas pequenas;
- preparar build Android/Windows em ambiente dedicado.
