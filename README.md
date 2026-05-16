# Necromante dos Tres Reinos

Prototipo jogavel v0.2.2 em HTML5, JavaScript e Canvas. O foco e validar um RPG de acao semi-automatico mobile-first com necromancia, captura, servos autonomos, gerenciamento de equipe, save local, progressao inicial, mapas independentes conectados por portais e uma base melhor para expansao futura do mundo.

## Como Rodar

Abra `index.html` diretamente no navegador.

Tambem pode usar um servidor estatico:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Controles

PC:

- WASD ou setas: mover.
- J ou Espaco: ataque basico.
- 1: Dreno de Alma.
- 2: Lanca Ossea.
- 3: Marca da Submissao.
- 4: Explosao Cadaverica.
- C: Capturar Alma ou confirmar em menus.
- Q: alternar comando dos servos ou opcao selecionada em menus.
- M: gerenciamento de servos.
- I: inventario/equipamentos/reputacao.
- K: arvore de habilidades.
- P: salvar.
- Esc: menu principal.
- E: entrar em portal ou interagir com objeto proximo.
- Enter: confirmar no menu principal ou entrar no mapa.
- F: fusao na tela de servos.
- X: apagar save local.

Mobile:

- Joystick virtual a esquerda.
- Botoes de ataque, habilidades, captura e comando a direita.
- Botoes superiores: Menu, Equipe, Inventario, Talentos, Salvar e Mapa.
- Botao contextual Entrar aparece perto de portais.
- Botao contextual Interagir aparece perto de objetos.
- Em menus, use CMD para alternar selecao e CAP/ATK para confirmar.

Se o necromante estiver perto de um portal e de um objeto ao mesmo tempo, o alvo mais proximo e priorizado.

## Sistemas Mantidos

- Movimentacao do necromante.
- Combate com projeteis e habilidades.
- Captura com primeira captura garantida.
- Ate 3 servos ativos.
- Comandos gerais dos servos.
- IA autonoma de servos.
- Aprendizado contra agrupamento apos dano em area.
- Chefe Guardiao de Tumba.
- Evolucao de Esqueleto Guerreiro para Esqueleto Veterano.
- Area secreta desbloqueavel.
- Morte e renascimento na Cripta Inicial.
- HUD funcional.
- Menu, equipe, inventario, talentos, reputacao, save/load e fusao.
- Mapas independentes com portais, spawn por origem, fade de transicao e camera por mapa.

## Sistemas Adicionados na v0.2.2

- Minimap simples no canto da tela.
- Rota visual dos portais com nome flutuante.
- Portais bloqueados exibem "Selado" ou "Disponivel em versao futura".
- Feedback de portal bloqueado com mensagem clara e efeito visual de selo.
- Pontos de interesse interativos por mapa.
- Tecla E e botao mobile contextual para objetos.
- Respawn simples por mapa para inimigos comuns e elites.
- Chefes derrotados nao reaparecem.
- Estado por mapa salvo em `localStorage`.
- Eventos unicos coletados salvos por mapa.
- Portais/desbloqueios persistidos no estado do mapa.
- Mensagens especiais de primeira visita.
- Transicao de mapas com fade-out, troca, reposicionamento, limpeza de projeteis/almas e fade-in.
- Cooldown apos chegada para evitar retorno imediato pelo mesmo portal.

## Minimap

O minimap mostra:

- posicao do jogador;
- portais proximos;
- area geral do mapa por zonas simbolicas;
- chefe vivo;
- ponto de renascimento ou spawn padrao;
- acesso da area secreta no Cemiterio Neutro quando desbloqueado.

Ele e desenhado no Canvas e funciona em desktop e mobile.

## Pontos de Interesse

Cripta Inicial:

- Trono Funerario;
- Altar de Renascimento.

Cemiterio Neutro:

- Tumulo Rachado;
- Campo de Treinamento;
- Selo da Area Secreta.

Estrada dos Enforcados:

- Forca Quebrada;
- Placa dos Cacadores;
- Restos de Carroca.

Area Secreta da Cripta:

- Escama Draconica Rachada;
- Bau Antigo;
- Mural Apagado.

Interagir com esses objetos mostra lore curta, cura ou recompensa simples. Objetos unicos como tumulo, carroca, escama e bau ficam salvos apos coleta.

## Respawn de Inimigos

Cada mapa tem uma configuracao propria de respawn:

- Cripta Inicial: sem respawn hostil.
- Cemiterio Neutro: Rato de Cripta, Lobo Cadaverico Selvagem, Soldado Humano Caido, Imp Abissal raro e Elite Profanado mais lento.
- Estrada dos Enforcados: Cacador Humano, Cao de Guerra Cadaverico, Cultista Fraco e Imp Abissal raro.
- Area Secreta da Cripta: poucos inimigos, respawn lento e foco em lore/recompensa.

Regras:

- inimigos comuns podem reaparecer apos o intervalo do mapa;
- elites reaparecem mais lentamente;
- chefes nao reaparecem apos derrotados;
- inimigos nao reaparecem perto demais do jogador;
- cada mapa respeita limite maximo de inimigos vivos.

## Estado por Mapa

O save inclui `mapState`, por exemplo:

```js
mapState = {
  cemiterio_neutro: {
    bossDefeated: true,
    secretUnlocked: true,
    visited: true,
    events: {},
    portalsUnlocked: {
      cemiterio_para_secreta: true
    }
  },
  area_secreta_cripta: {
    dragonScaleCollected: true,
    chestOpened: true,
    visited: true,
    events: {
      escama_draconica_rachada: true,
      bau_antigo: true
    }
  }
}
```

Saves antigos sao migrados a partir de `bossDefeated`, `secretUnlocked` e `dragonSignalSeen`.

## Mensagens de Primeira Visita

- Cripta Inicial: "Voce desperta onde a morte recusou sua alma."
- Cemiterio Neutro: "Entre tumulos esquecidos, almas fracas ainda vagam."
- Estrada dos Enforcados: "Aqui, humanos executavam aqueles que temiam."
- Area Secreta da Cripta: "Algo antigo repousa abaixo da cripta."

Cada mensagem aparece apenas uma vez por save.

## Como Usar Portais

1. Aproxime o necromante de um portal brilhante.
2. A HUD mostra `Portal: [nome da area]`.
3. No PC, pressione E.
4. No mobile, toque no botao contextual Entrar.

Portais bloqueados mostram uma mensagem de bloqueio, exibem selo visual e nao iniciam transicao. O portal da Area Secreta libera apos derrotar o Guardiao de Tumba. O portal para Posto dos Cacadores permanece marcado como conteudo futuro.

## Como Testar Objetos Interativos

1. Inicie Novo Jogo.
2. Monte a equipe e entre no mapa.
3. Aproxime-se do Trono Funerario ou Altar de Renascimento na Cripta Inicial.
4. Pressione E no PC ou toque em Interagir no mobile.
5. Va para o Cemiterio Neutro e teste Tumulo Rachado, Campo de Treinamento e Selo da Area Secreta.
6. Va para Estrada dos Enforcados e teste Forca Quebrada, Placa dos Cacadores e Restos de Carroca.
7. Derrote o Guardiao, entre na Area Secreta e teste Escama Draconica Rachada, Bau Antigo e Mural Apagado.
8. Salve, recarregue e confirme que recompensas unicas nao reaparecem.

## Como Testar Respawn

1. Entre no Cemiterio Neutro.
2. Derrote inimigos comuns ate reduzir a populacao viva.
3. Afaste o jogador dos pontos de combate.
4. Aguarde alguns segundos para novos inimigos surgirem.
5. Derrote o Elite Profanado e aguarde mais tempo para validar respawn lento.
6. Derrote o Guardiao de Tumba, salve e recarregue.
7. Confirme que o Guardiao nao reaparece.

## Como Testar Mapas e Portais

1. Inicie Novo Jogo.
2. Monte uma equipe e entre no mapa.
3. Voce comeca na Cripta Inicial.
4. Use o portal para Cemiterio Neutro com E ou Entrar.
5. No Cemiterio, use o portal de volta para a Cripta.
6. No Cemiterio, use o portal sul para Estrada dos Enforcados.
7. Na Estrada, use o portal de volta para o Cemiterio.
8. Na Estrada, tente o portal para Posto dos Cacadores e veja a mensagem de area futura.
9. Antes de derrotar o Guardiao, tente o portal da Area Secreta no Cemiterio e veja o selo bloqueado.
10. Derrote o Guardiao de Tumba.
11. Volte ao portal da Area Secreta e entre.
12. Observe fade, nome da nova area, servos reposicionados e projeteis/almas limpos.
13. Salve dentro de qualquer mapa, recarregue e use Continuar para validar mapa atual e posicao.

## Como Testar Salvamento

1. Inicie um Novo Jogo.
2. Ative pelo menos um servo na tela Equipe.
3. Entre no mapa, derrote inimigos, interaja com um objeto unico ou desbloqueie a Area Secreta.
4. Pressione P ou o botao Salvar.
5. Recarregue a pagina.
6. No menu inicial, escolha Continuar.

O save deve restaurar nivel, EXP, fragmentos, servos ativos, reserva, inventario, habilidades, reputacao, boss derrotado, area secreta, mapa atual, posicao do necromante, `mapState`, eventos unicos e mensagens de primeira visita ja vistas.

## Melhorias Futuras

- Tela de pausa dedicada.
- Save em multiplos slots.
- Mais equipamentos e slots reais.
- Evolucoes especificas por especie capturada.
- Fusao com preview antes de confirmar.
- Reputacao com efeitos de faccao mais fortes.
- Missoes curtas por area.
- Melhor colisao com obstaculos.
- Balanceamento fino de captura, dano, EXP e respawn.
- Sons e sprites originais.
