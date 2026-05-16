# Necromante dos Tres Reinos

Prototipo jogavel v0.2.5 em HTML5, JavaScript e Canvas. O jogo continua mobile-first e preparado para uso hibrido em Web, Android via Capacitor e Windows via Tauri, com save local, conta mock, save em nuvem mock e sincronizacao futura entre dispositivos.

## Direcao de Arte v0.2.5

A v0.2.5 melhora a identidade visual propria do jogo com uma leitura 2.5D/isometrica dark fantasy. As referencias externas devem ser entendidas apenas como clima: necromancia, progressao sombria, mortos-vivos, energia espiritual, runas, sombras e cenas dramaticas. O jogo nao copia personagens, simbolos, mapas, roupas, composicoes ou assets protegidos.

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
- HUD e menus com paineis dark fantasy, verde espectral, azul de mana/sync, dourado de recompensa e vermelho de perigo.

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
- J ou Espaco: ataque basico.
- 1: Dreno de Alma.
- 2: Lanca Ossea.
- 3: Marca da Submissao.
- 4: Explosao Cadaverica.
- C: Capturar Alma ou confirmar em menus.
- Q: alternar comando dos servos ou opcao selecionada.
- M: gerenciamento de servos.
- I: inventario/equipamentos/reputacao.
- K: arvore de habilidades.
- L: Conta.
- P: salvar.
- Esc: menu principal.
- E: entrar em portal ou interagir com objeto proximo.
- Enter: confirmar no menu principal ou entrar no mapa.
- F: fusao na tela de servos.
- X: apagar save local.

Mobile:

- Joystick virtual a esquerda.
- Botoes de ataque, habilidades, captura e comando a direita.
- Botoes superiores: Menu, Conta, Equipe, Inventario, Talentos, Salvar e Mapa.
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

Valores previstos: `low`, `medium`, `high`. A v0.2.5 usa `medium` por padrao.

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

## Exportar e Importar Save

Na tela Conta:

- `P` exporta o save para o console.
- Importacao ainda pode ser feita pelo console usando `SaveManager.importSave(JSON)`.

O SaveManager migra saves antigos para o schema atual quando necessario.

## Testar Sync Mock

1. Inicie um Novo Jogo.
2. Abra Conta com `L` ou pelo botao superior.
3. Use `1` ou Menu para mock login.
4. Use `2` para sincronizar agora.
5. Salve com `P`.
6. Veja o indicador da HUD: Local, OK, Sincronizando, Pendente, Offline, Conflito ou Erro.

## Testar Conflito

1. Faca mock login.
2. Salve localmente.
3. Altere manualmente o mock cloud no `localStorage` para ter outro `revision`, `updatedAt`, `platform` ou `deviceId`.
4. Execute sync.
5. A tela Carregar Save mostra o resumo de conflito se `SyncManager.pendingConflict` estiver preenchido.

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
- [ ] save local continua funcionando;
- [ ] conta mock e mockCloud continuam disponiveis;
- [ ] performance basica continua aceitavel.

## Comandos Git Recomendados

```bash
git status -sb
git add README.md PROJECT_STATUS.md index.html package.json src/art.js src/config.js src/entities.js src/game.js src/map.js src/syncManager.js src/ui.js
git commit -m "Evolui direcao de arte para v0.2.5"
git push
```

Inclua outros arquivos apenas se fizerem parte da mudanca intencional.
