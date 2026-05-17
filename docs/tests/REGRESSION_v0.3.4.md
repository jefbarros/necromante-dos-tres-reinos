# Regressao v0.3.4

## Build
- [ ] `npm.cmd run check` passou
- [ ] Versao exibida no menu e em `package.json` e `src/config.js` e 0.3.4

## Responsividade e mobile
- [ ] Barra rapida aparece horizontal no modo compacto e nao cobre joystick/botoes mobile
- [ ] Equipe compacta empilha ativos e reserva sem sobrepor cards
- [ ] Inventario compacto mostra abas, lista e detalhes sem texto estourado
- [ ] Talentos compactos mostram seletor de caminho e nodes do caminho selecionado
- [ ] Mapa compacto mostra lista, detalhes e botao Viajar sem sair do painel principal

## Canvas, clique e scroll
- [ ] Clique em botoes de Canvas nao dispara ataque no gameplay por engano
- [ ] Clique fora de hit areas no gameplay ainda dispara ataque quando esperado
- [ ] Hover continua visivel em Menu, Equipe, Inventario, Talentos, Mapa, Save/Carregar e Conta
- [ ] Scroll da reserva funciona apenas sobre a area da reserva
- [ ] Scroll do inventario funciona apenas sobre a lista de itens
- [ ] Itens/botoes desabilitados consomem clique sem executar acao bloqueada

## Equipe
- [ ] Reserva com muitos servos nao duplica nem perde servos ao rolar
- [ ] Filtros Todos, Tanque, Dano, Rapido e Magico/Suporte funcionam
- [ ] Ordenacao Poder, Nivel e Tipo funciona
- [ ] Ativar, Remover e Substituir respeitam `MAX_ACTIVE_SERVANTS` e `soulControl`
- [ ] Fusao usa o servo selecionado na reserva filtrada/ordenada

## Inventario e equipamentos
- [ ] Equipamentos mostram slot, raridade, poder, bonus, descricao e estado
- [ ] Comparacao mostra Melhora, Piora, Equipado ou Diferente corretamente
- [ ] Equipar/desequipar atualiza bonus sem quebrar saves
- [ ] Pocoes de vida/mana ainda podem ser usadas
- [ ] Materiais continuam mostrando quantidade

## Talentos
- [ ] Nodes indicam Desbloqueado, Disponivel ou Bloqueado
- [ ] Motivo de bloqueio aparece por nivel, pontos ou requisito anterior
- [ ] Botao Desbloquear gasta pontos somente quando valido
- [ ] Efeitos da v0.3.2 continuam aplicados apos desbloquear

## Mapa
- [ ] Lista e nos selecionam regiao sem viajar imediatamente
- [ ] Botao Viajar leva para regiao liberada/visitada
- [ ] Regiao bloqueada mostra requisito por nivel ou Guardiao
- [ ] Regiao futura mostra conteudo futuro e nao viaja
- [ ] `unlockedRegions`, nivel do jogador e Guardiao derrotado continuam respeitados

## Saves antigos
- [ ] Save v0.3.2 carrega e normaliza inventario/equipamentos
- [ ] Save v0.3.3 carrega com regioes, talentos, reserva e inventario preservados
- [ ] Novo save/export usa schema/gameVersion 0.3.4
- [ ] Save/export nao persiste estado runtime de UI como tela atual ou inputLock

## Regressao central
- [ ] Novo Jogo entra no mapa, nao em menus
- [ ] Continuar, Carregar Local e Carregar Nuvem voltam ao gameplay
- [ ] ESC, Enter/Mapa, M, I, K e F10 continuam funcionando
- [ ] Auto-ataque, captura, portal/interacao e combate basico continuam funcionando
- [ ] Favicon e `.gitattributes` permanecem no projeto
