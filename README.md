# Necromante dos Tres Reinos

Prototipo jogavel v0.3.4 em HTML5, JavaScript e Canvas. O jogo evolui para uma estrutura de Mundo Aberto por Regioes, com lore e identidade propria baseada nos Tres Reinos: Humanos, Demonios e Dragoes.

## v0.3.4 - Polimento visual, mobile e regressao dos sistemas centrais

A v0.3.4 estabiliza a revisao de UX/UI da v0.3.3, com foco em leitura, responsividade e regressao dos sistemas centrais. Nao adiciona mapas maiores, novas regioes reais, novas racas completas, 3D, builds nativos ou faccoes inteligentes.

Mudancas principais:
- Responsividade melhorada em Equipe, Inventario, Talentos e Mapa para desktop estreito e mobile.
- Textos de botoes, cards e paineis passam a truncar ou limitar linhas para evitar estouro visual.
- Barra rapida fica horizontal tambem no modo compacto, reduzindo conflito com controles mobile.
- Equipe compacta empilha ativos e reserva, preservando scroll, filtros, ordenacao e acoes.
- Talentos compactos mostram abas por caminho e nodes do caminho selecionado.
- Inventario e Mapa recebem limites de linhas e paineis mais defensivos em telas pequenas.
- Comparacao de equipamentos usa estado "Diferente" para itens de mesmo poder com foco distinto.
- Fusao de servos passa a respeitar a reserva filtrada/ordenada selecionada.
- Saves v0.3.2/v0.3.3 continuam aceitos pela migracao e novos saves usam schema 0.3.4.

## v0.3.3 - UX/UI Overhaul: mouse, menus ricos, equipamentos e mapa

A v0.3.3 amplia a navegacao por mouse nos menus em Canvas, adiciona uma barra rapida fora do Menu, reformula Equipe/Inventario/Talentos e torna o Mapa do Mundo mais visual e interativo sem copiar nomes, assets, lore ou layout de outras obras.

Mudancas principais:
- Barra rapida visivel no HUD com Menu, Equipe, Inventario, Talentos e Mapa, mantendo os atalhos de teclado.
- Base de UI clicavel consolidada com hit areas, hover, botoes, cards, abas e indicador de scroll.
- Menus principais e internos aceitam clique com hover visual, mantendo teclado/controle.
- Equipe usa cards para ativos e reserva, filtros por papel, ordenacao por poder/nivel/tipo, scroll da reserva e painel de detalhes.
- Inventario usa abas e cards com raridade, quantidade, scroll, detalhes, acoes e comparacao com o item equipado.
- Equipar/desequipar continua usando a logica da v0.3.2.
- Talentos aparecem em quatro caminhos clicaveis, com estados desbloqueado/disponivel/bloqueado e painel de detalhes.
- Mapa do Mundo permite selecionar lista/nos visuais e viajar por botao, com bloqueios por nivel, Guardiao e conteudo futuro.
- Save/Carregar e Conta agora tambem usam botoes clicaveis no Canvas.
- Favicon simples embutido evita 404 de favicon.
- `.gitattributes` padroniza arquivos texto para reduzir avisos LF/CRLF no Windows.

## v0.3.2 - Revisao de Sistemas Centrais e UX

A v0.3.2 reprioriza a base jogavel antes de expansoes maiores. Neblina de Guerra, mapas maiores, Android/Capacitor, Windows/Tauri, 3D real e faccoes avancadas ficam fora desta versao.

Mudancas principais:
- Equipe com selecao separada entre coluna ativa e reserva, filtros por papel/poder, remocao, movimentacao e substituicao de servos.
- Inventario separado em equipamentos, consumiveis e materiais, com equipar, desequipar e usar pocoes.
- Talentos expandidos em quatro caminhos: Invocador, Ceifador, Senhor das Almas e Estrategista Sombrio.
- Menu principal concentra Conta e Salvar/Carregar.
- Almas de monstros mortos sao coletadas automaticamente como recurso.
- Drops simples entram direto no inventario.
- Ataque basico passa para tecla/botao `1`; habilidades seguem `2` a `5`.
- Auto-ataque ON/OFF escolhe alvo proximo e usa apenas o ataque basico.

## v0.3.1 - Padronizacao de Mapa e Regioes

A v0.3.1 foca na organizacao de dados do mundo e comunicacao visual das regioes.

Mudancas principais:
- Padronizacao do schema de metadados para todas as regioes.
- Adicao de Pontos de Interesse (POIs) narrativos para cada regiao no mapa-mundi.
- Interface de Mapa do Mundo agora mostra detalhes, requisitos e POIs da regiao selecionada.
- Requisitos de bloqueio agora sao exibidos de forma legivel ao jogador.
- Versionamento e status do projeto atualizados.

A v0.3.0 introduz o sistema de navegacao por regioes, permitindo que o necromante viaje entre areas desbloqueadas e visualize o progresso do mundo.

Mudancas principais:
- Novo sistema de Regioes com metadados (nivel, tipo, status).
- Interface de Mapa do Mundo acessivel por tecla Mapa/Enter.
- Viagem rapida entre regioes desbloqueadas.
- Regiao "Fronteira dos Tres Reinos" desbloqueada apos derrotar o Guardiao.
- Persistencia do progresso de exploracao no save.
- README e PROJECT_STATUS atualizados para a nova fase.
- Migracao segura de saves v0.2.x.

## v0.2.9.1 - Refinamento de IA de Chefe

A v0.2.9.1 corrige a condicao de disparo do ataque em area do Guardiao de Tumba.

Mudancas:
- O AOE do Guardiao so inicia o telegraph se houver ameaca real (Jogador a menos de 2.1m ou 2+ servos proximos).
- Preservado todo o balanceamento e telegraphs visuais da v0.2.9.
- Adicionado efeito de pulso espectral (azul ou vermelho/frequente se HP < 20%) quando o AOE esta carregado mas fora de alcance.
- Adicionado feedback sonoro metálico ao pulso espectral de prontidão.

## v0.2.9 - Balanceamento de Combate e Telegraphs

A v0.2.9 melhora o balanceamento de combate para dispositivos moveis e adiciona telegraphs visuais para ataques perigosos, reduzindo mortes injustas no inicio do jogo.

Mudancas principais:

- Dano de inimigos basicos reduzido: rat (7->5), wolf (12->10), soldier (15->12), warhound (14->11), cultist (10->8).
- Guardiao de Tumba melee: damage reduzido de 28 para 22.
- Guardiao de Tumba AOE: damage reduzido de 24 para 18.
- Telegraph visual de 2 segundos antes do AOE do Guardiao (efeito amarelo "cuidado!").
- Save/export continua sem persistir estado runtime de UI.
- Objetivo inicial continue no HUD.

Teste manual minimo da v0.2.9:

1. Clique em `Novo Jogo` e confirme gameplay com objetivo no HUD.
2. Derrote inimigos basicos e confirme dano reduzido.
3. Derrote o Guardiao de Tumba e confirme telegraph antes do AOE.
4. Salve e exporte JSON; confirme presenca de `objectiveProgress` e ausencia de `screen`, `activeModal`, `selectedMenu`, `inputLock`.

## v0.2.8 - Objetivos Iniciais

A v0.2.8 adiciona um sistema simples de objetivo atual no HUD para estabilizar o primeiro ciclo jogavel sem abrir menus automaticamente. O objetivo guia o jogador por despertar na Cripta Inicial, interagir com o Trono Funerario ou altar equivalente, ir ao Cemiterio Neutro, derrotar inimigos basicos, capturar a primeira alma, derrotar o Guardiao de Tumba e desbloquear a Area Secreta.

Mudancas principais:

- HUD mostra o objetivo atual e uma dica curta.
- Save persiste apenas `objectiveProgress` para o tutorial inicial.
- Saves antigos migram com progresso de objetivo seguro, inferido de mapa, boss, captura e area secreta quando possivel.
- Save/export continua sem persistir `screen`, `activeModal`, `selectedMenu`, `inputLock` ou outro estado runtime de UI.
- Novo Jogo, Continuar, Carregar Local e Carregar MockCloud continuam entrando direto no gameplay.
- A direcao dark fantasy/necromancia permanece propria, sem copiar nomes, personagens, cenas, simbolos, arte ou lore de referencia externa.

Teste manual minimo da v0.2.8:

1. Clique em `Novo Jogo` e confirme que a Cripta Inicial abre em gameplay com objetivo no HUD.
2. Interaja com o Trono Funerario ou Altar de Renascimento e confirme o avanco do objetivo.
3. Entre no Cemiterio Neutro, derrote dois inimigos basicos e capture a primeira alma.
4. Derrote o Guardiao de Tumba e confirme que a Area Secreta fica desbloqueada.
5. Salve/exporte e confirme que o JSON contem `objectiveProgress`, mas nao contem `screen`, `activeModal`, `selectedMenu` ou `inputLock`.
6. Recarregue via Continuar, Carregar Local e MockCloud; todos devem voltar ao mapa, nao para Equipe.

## Hotfix v0.2.7

A v0.2.7 e um hotfix emergencial de fluxo de UI. Ela corrige o travamento em que Novo Jogo, Continuar e Carregar Save abriam diretamente a tela de gerenciamento de servos/equipe e deixavam o jogador preso fora do gameplay.

Mudancas do hotfix:

- Novo Jogo, Continuar, Carregar Save Local, Carregar Save Nuvem e Importar Save agora resetam a UI temporaria e entram no mapa.
- A tela de equipe, inventario, talentos, conta e carregar save podem ser fechadas por `ESC`, `M` ou `Mapa/Enter`.
- `F10` executa recuperacao emergencial de UI e volta ao gameplay.
- `window.forceReturnToGame()` e `window.debugUIState()` ficam disponiveis no console para diagnostico.
- Saves antigos sao migrados para `0.2.7` ignorando campos de UI runtime como tela atual, modal aberto e inputLock.

Teste manual minimo:

1. Clique em `Novo Jogo` e confirme que a Cripta Inicial abre em gameplay.
2. Mova o personagem.
3. Abra `Equipe`, feche com `ESC`, abra novamente e feche com `Mapa/Enter`.
4. Abra e feche `Inventario`, `Talentos` e `Conta`.
5. Salve, recarregue o navegador e use `Continuar`; confirme que volta ao mapa.
6. Use `Carregar Save` > `Carregar Local`; confirme que a tela fecha e o personagem move.
7. Abra `Exportar Save` e `Importar Save`, cancele/volte e confirme que o input nao fica preso.
8. Abra uma tela qualquer e pressione `F10`; a mensagem `UI recuperada.` deve aparecer.

## Direcao de Arte v0.2.6

A v0.2.6 consolida a identidade visual propria do jogo com leitura 2.5D/isometrica dark fantasy, seletor de qualidade visual e documentacao permanente em `ART_BIBLE.md`. As referencias externas devem ser entendidas apenas como concept art/clima: necromancia, progressao sombria, mortos-vivos, energia espiritual, runas, sombras e cenas dramaticas. O jogo nao copia personagens, simbolos, mapas, roupas, composicoes ou assets protegidos.

Melhorias visuais:

- novo `src/art.js` com helpers reutilizaveis de Canvas;
- sombras isometricas, aura, runas, barras estilizadas e labels;
- tiles com variacao deterministica por mapa;
- portais com circulo magico, particulas, anel pulsante e estado visual;
- necromante com capuz, manto rasgado, olhos brilhantes, grimorio/cajado e particulas;
- servos visualmente diferenciados;
- inimigos visualmente diferenciados;
- Guardiao de Tumba maior, com runas, nucleo espiritual, aura e telegraph de area;
- projeteis, dreno, captura, marca e explosoes com efeitos melhores;
- HUD e menus com paineis dark fantasy, verde espectral, azul de mana/sync, dourado de recompensa e vermelho de perigo;
- escala de HUD, minimapa, botoes mobile e modais ajustada para telas pequenas.

## Biblia de Arte e Concept Art

- `ART_BIBLE.md`: documenta direcao visual, principios, necromante, servos, inimigos, mapas, portais, HUD e regras de uso de referencias.
- `docs/concept-art/`: pasta para imagens de referencia/concept art usadas apenas para documentacao.

As imagens de `docs/concept-art/` nao sao carregadas pelo jogo em runtime. Se alguma imagem virar asset real futuramente, ela deve ser movida para `assets/images/` e ter licenca/origem documentadas.

## Como Rodar

Abra `index.html` diretamente no navegador ou use servidor local:

```bash
npm run dev
```

Tambem funciona com:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Scripts

```bash
npm run dev
npm run start
npm run check
npm run build:web
```

`npm run check` executa `node --check` nos arquivos JavaScript principais.

## Controles

PC:

- WASD ou setas: mover.
- 1 ou Espaco: ataque basico.
- 2: Dreno de Alma.
- 3: Lanca Ossea.
- 4: Marca da Submissao.
- 5: Explosao Cadaverica.
- R: alternar auto-ataque.
- C: Capturar Alma ou confirmar em menus.
- Q: alternar comando dos servos ou opcao selecionada.
- M: abre gerenciamento de servos no jogo; fecha a tela atual quando algum menu/modal esta aberto.
- I: inventario/equipamentos/reputacao.
- K: arvore de habilidades.
- L: Conta.
- P: salvar rapido; Salvar/Carregar tambem fica dentro do Menu.
- Esc: fecha a tela/modal atual; no gameplay abre o menu principal.
- E: entrar em portal ou interagir com objeto proximo.
- Enter/Mapa: confirmar no menu principal; fechar a tela atual e voltar ao gameplay quando um menu esta aberto.
- F: fusao na tela de servos.
- F10: recuperacao emergencial de UI presa.
- X: apagar save local.

Mobile:

- Joystick virtual a esquerda.
- Botoes de ataque, habilidades, captura e comando a direita.
- Botoes superiores: Menu, Equipe, Inventario, Talentos e Mapa.
- Botao contextual Entrar aparece perto de portais.
- Botao contextual Interagir aparece perto de objetos.

## Sistemas Mantidos

- mapas separados;
- portais;
- minimapa;
- pontos de interesse;
- respawn;
- interacao contextual;
- captura;
- servos ativos e reserva;
- inventario;
- equipamentos;
- arvore de habilidades;
- fusao;
- reputacao;
- area secreta;
- save local;
- SaveManager;
- mockCloud;
- conta mock;
- HUD;
- preparacao para Android e Windows.

## Arquitetura Visual

Arquivo novo:

- `src/art.js`: helpers visuais e renderizacao detalhada.

Helpers principais:

- `drawIsoShadow(ctx, x, y, w, h, alpha)`
- `drawAura(ctx, x, y, radius, color, pulse)`
- `drawRuneCircle(ctx, x, y, radius, color, pulse)`
- `drawFloatingLabel(ctx, text, x, y, color)`
- `drawDetailedPortal(ctx, portal, unlocked, label, tick)`
- `drawNecromancer(ctx, player, tick)`
- `drawSkeletonServant(ctx, servant, tick)`
- `drawFeralServant(ctx, servant, tick)`
- `drawFallenServant(ctx, servant, tick)`
- `drawEnemyHumanoid(ctx, enemy, tick)`
- `drawDemonImp(ctx, enemy, tick)`
- `drawTombGuardian(ctx, boss, tick)`

Qualidade visual:

```js
GameConfig.visualQuality = "medium";
```

Valores: `low`, `medium`, `high`. A v0.2.6 usa `medium` por padrao e salva a escolha em `localStorage`.

Como alterar pela UI:

- Abra `Conta` com `L` ou pelo botao superior.
- Use `CMD/Q` para selecionar `Qualidade` e confirme com `CAP/ATK`.
- Atalho: tecla `3` na tela Conta alterna entre Baixa, Media e Alta.

Efeitos por qualidade:

- `low`: menos particulas, menos auras, menos detalhes de tile e portal.
- `medium`: equilibrio padrao para Web/Android.
- `high`: mais particulas, auras completas, portais mais brilhantes e mais detalhes decorativos.

## Mapas Detalhados

Cripta Inicial:

- piso rachado com variacao por tile;
- altar de renascimento com aura;
- trono/obelisco funerario mais marcado;
- sarcofagos/tumulos adicionais;
- velas e runas sugeridas por prop e tile;
- portal com arco e runas.

Cemiterio Neutro:

- tumulos variados;
- arvores mortas;
- ossadas;
- arena do Guardiao com pilares e runas;
- fissura infernal com brilho.

Estrada dos Enforcados:

- forcas quebradas;
- arvores mortas;
- placas e restos de execucao;
- barro/trilha via tiles;
- portal futuro apagado.

Area Secreta da Cripta:

- marcas draconicas;
- escama brilhante;
- obeliscos;
- mural/ritual sugerido por runas;
- bau e pontos de lore mantidos.

## Conta, Save Local e Nuvem Mock

A branch atual ja possui a base hibrida:

- `src/platform.js`: detecta plataforma e deviceId.
- `src/localSave.js`: save local em `localStorage`.
- `src/cloudSave.js`: cloud save mock via `localStorage` separado.
- `src/auth.js`: autenticacao mock.
- `src/syncManager.js`: sincronizacao local/nuvem.
- `src/saveManager.js`: camada unificada de save.

Sem login, o jogo salva localmente. Com mock login, `SyncManager.syncNow()` tenta comparar e sincronizar com o mock cloud.

## Exportar e Importar Save pela UI

Na tela Conta ou Carregar Save:

- `P` ou o botao `Exportar Save` abre um modal com JSON formatado para copiar.
- `I` ou o botao `Importar JSON` abre um modal com textarea.
- O fluxo de importacao valida JSON, migra save antigo, normaliza servos ativos/reserva, mostra resumo e substitui o save local apenas apos confirmacao.

O SaveManager migra saves antigos para o schema atual quando necessario. A tela atual de UI nao e salva como estado persistente obrigatorio. Na v0.2.8, o progresso persistente do tutorial fica limitado a `objectiveProgress`.

## Tela Carregar Save

A tela `Carregar Save` mostra:

- Save Local;
- Save Nuvem/MockCloud;
- metadados de versao, mapa, nivel, fragmentos, data, plataforma e revision;
- botoes para Carregar Local, Carregar Nuvem, Sincronizar, Importar JSON, Exportar Save e Voltar.

## Testar Sync Mock

1. Inicie um Novo Jogo.
2. Abra Conta com `L` ou pelo botao superior.
3. Use `1` para mock login.
4. Use `2` para sincronizar agora.
5. Salve com `P`.
6. Veja o indicador da HUD: Local, OK, Sincronizando, Pendente, Offline, Conflito ou Erro.

## Testar Conflito

1. Faca mock login.
2. Salve localmente.
3. Altere manualmente o mock cloud no `localStorage` para ter outro `revision`, `updatedAt`, `platform` ou `deviceId`.
4. Execute sync.
5. A tela Carregar Save mostra o resumo de conflito se `SyncManager.pendingConflict` estiver preenchido.
6. Abra o modal de conflito pela tela Carregar Save ou pelo sync automatico.
7. Escolha `Usar Local`, `Usar Nuvem` ou `Cancelar`.

## Telas Pequenas e Mobile

A v0.2.6 reduz HUD, minimapa, menus e botoes em alturas/larguras menores. Menus de save usam modal rolavel com textarea responsiva. Os botoes mobile mantem area de toque grande, opacidade controlada e o botao contextual continua priorizando o alvo mais proximo: `Entrar` para portal, `Interagir` para objeto e `Falar` reservado para NPC futuro. A v0.2.7 preserva a direcao visual e altera apenas fluxo, input e navegacao de telas. A v0.2.8 acrescenta um bloco compacto de objetivo atual no HUD.

## Preparacao Android com Capacitor

A pasta `android/` nao precisa existir nesta etapa. Fluxo esperado:

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Necromante dos Tres Reinos" "com.seudominio.necromante"
npx cap add android
npx cap sync android
npx cap open android
```

## Preparacao Windows com Tauri

A pasta `src-tauri/` nao precisa existir nesta etapa. Fluxo esperado:

```bash
npm install
npm install -D @tauri-apps/cli
npm run tauri init
npm run tauri build
```

Requer Rust/Tauri configurado no ambiente.

## Seguranca

Nunca coloque chaves privadas, tokens ou credenciais no repositorio.

Arquivos ignorados esperados:

- `src/firebaseConfig.local.js`
- `.env`
- `.env.local`
- `dist/`
- `node_modules/`
- `android/`
- `src-tauri/target/`

## Checklist de Validacao

- [ ] jogo abre no navegador sem erros;
- [ ] `node --check` passa em todos os JS;
- [ ] Cripta Inicial renderiza com visual melhor;
- [ ] Cemiterio Neutro renderiza com visual melhor;
- [ ] Estrada dos Enforcados renderiza com visual melhor;
- [ ] Area Secreta renderiza com visual melhor;
- [ ] necromante esta mais detalhado;
- [ ] servos estao distinguiveis;
- [ ] inimigos estao distinguiveis;
- [ ] Guardiao de Tumba parece chefe;
- [ ] portais mostram estados claros;
- [ ] habilidades mostram efeitos melhores;
- [ ] HUD e menus seguem o estilo dark fantasy;
- [ ] objetivo inicial aparece no HUD;
- [ ] objetivo avanca por interacao, combate, captura, chefe e area secreta;
- [ ] seletor low/medium/high funciona;
- [ ] importacao de save funciona pela UI;
- [ ] exportacao de save funciona pela UI;
- [ ] conflito permite escolher Local ou Nuvem;
- [ ] tela Carregar Save mostra metadados local/nuvem;
- [ ] UI fica usavel em tela pequena;
- [ ] save local continua funcionando;
- [ ] conta mock e mockCloud continuam disponiveis;
- [ ] performance basica continua aceitavel.

## Testes Realizados na v0.2.8

- `node --check` em todos os arquivos JS;
- `npm run check`;
- Novo Jogo entra direto no gameplay;
- Continuar, Carregar Local e MockCloud devem voltar ao gameplay;
- ESC/M/Mapa/Voltar continuam fechando menus;
- F10 continua recuperando UI presa;
- objetivo inicial aparece no HUD;
- objetivo avanca por interacao, combate, captura, chefe e desbloqueio da Area Secreta;
- save/export contem `objectiveProgress`;
- save/export nao contem `screen`, `activeModal`, `selectedMenu` ou `inputLock`.

## Testes Realizados na v0.2.7

- `node --check` em todos os arquivos JS;
- `npm run check`;
- Novo Jogo entra direto no gameplay;
- Equipe abre e fecha com `ESC`, `M`, `Mapa/Enter` e `window.forceReturnToGame()`;
- Inventario, Talentos, Conta e Carregar Save fecham sem prender input;
- Continuar carrega save e volta ao mapa;
- Carregar Save Local e MockCloud voltam ao gameplay;
- Exportar/Importar Save podem ser cancelados sem travar a UI;
- Conflito local/nuvem foi forçado via importacao de save, testando `Cancelar` e `Usar Local`;
- F10 recupera a UI presa;
- save v0.2.7 nao persiste tela/menu/modal como estado obrigatorio.

## Testes Realizados na v0.2.6

- `node --check` nos arquivos alterados durante a implementacao;
- `node --check` em todos os arquivos JS;
- `npm run check`;
- abertura do jogo em servidor local;
- novo jogo e continuar;
- exportacao/importacao pela UI;
- mock login e mock sync;
- conflito local/nuvem;
- qualidade visual `low`, `medium` e `high`;
- Cripta Inicial, Cemiterio Neutro, Estrada dos Enforcados e Area Secreta da Cripta;
- combate, captura, portais, minimapa, menus e redimensionamento para tela pequena.

## Bugs Conhecidos

- Firebase real segue apenas preparado; a v0.2.9 continua usando mockCloud quando nao houver configuracao local.
- O teste Android/Windows nativo ainda depende de ambiente Capacitor/Tauri dedicado.
- Alguns textos permanecem em ASCII no codigo para manter compatibilidade com arquivos existentes.
- O fluxo MockCloud depende de login mock e dados existentes em `localStorage`.

## Proxima Etapa Recomendada

v0.2.10 deve continuar refinando combat balance, adicionando mais variacao de inimigos, construcao de chefes de area e uma tela dedicada de configuracoes fora da tela Conta.

## Comandos Git Recomendados

```bash
git status -sb
git add .
git commit -m "v0.2.9 - balanceamento de combate e telegraphs"
git push
git tag v0.2.9
git push origin v0.2.9
```

Inclua outros arquivos apenas se fizerem parte da mudanca intencional.
