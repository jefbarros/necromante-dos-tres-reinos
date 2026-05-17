# Bíblia de Design v0.1 — RPG 3D de Mundo Aberto em Godot

**Título de trabalho:** *Necromante dos Três Reinos — Herdeiro da Calamidade*  
**Codinome interno:** Projeto N3R-OpenWorld  
**Engine alvo:** Godot 4.6.x  
**Plataformas-alvo por fase:** PC Windows primeiro; Android depois; Web apenas para protótipos leves, menus, testes sistêmicos e laboratório de mecânicas.  
**Gênero:** RPG de ação em terceira pessoa, mundo aberto 3D, dark fantasy, progressão por classe, exploração, coleta, dungeons, exército de invocações e dominação de monstros.  
**Inspiração temática permitida:** necromante único, mundo em calamidade, profissões despertadas, dungeons/abismos, evolução por níveis, invocações que recebem dano pelo jogador, fantasia de poder crescente.  
**Regra de IP:** não usar personagens, nomes, cenas, diálogos, símbolos ou eventos específicos de obras existentes. O jogo precisa ser uma propriedade intelectual original.

---

## 1. Visão executiva

*N3R — Herdeiro da Calamidade* será um RPG 3D de mundo aberto onde o jogador controla um necromante amaldiçoado que desperta uma classe proibida em um mundo dominado por três potências: o Reino Humano, o Império Demoníaco e os Domínios Dracônicos.

Após o surgimento dos **Portões da Calamidade**, antigas leis mágicas retornam ao mundo. Pessoas comuns passam a despertar “vocações” — guerreiro, curandeiro, arqueiro, artífice, mago, guardião — e monstros começam a emergir de fendas dimensionais. Nesse cenário, o protagonista desperta uma vocação impossível: **Necromante Primordial**, uma classe que não deveria existir desde a fundação dos Três Reinos.

O objetivo do jogador não é apenas subir de nível. O objetivo é construir um exército, descobrir a origem da necromancia, sobreviver à perseguição dos reinos e decidir se a morte será usada como ferramenta de salvação, vingança ou dominação.

O projeto será tratado como se uma grande empresa fosse produzi-lo, mas com escopo realista para desenvolvimento incremental: primeiro um **protótipo jogável**, depois uma **vertical slice**, depois um **MVP premium/early access**, e só então expansão para mundo aberto completo.

---

## 2. Pilares de design

### 2.1 Fantasia central

O jogador deve sentir que começou como um condenado fraco e terminou como o comandante de uma legião impossível.

A experiência precisa entregar:

1. **Poder crescente visível**  
   O jogador vê seus servos ficando maiores, mais numerosos, mais inteligentes e mais assustadores.

2. **Necromancia como sistema, não só magia visual**  
   Matar, estudar, capturar essência, reanimar, fundir, evoluir, comandar e sacrificar mortos-vivos fazem parte do loop principal.

3. **Mundo aberto perigoso**  
   O mapa não é apenas cenário. Ele reage à presença do necromante, às escolhas do jogador e à expansão da calamidade.

4. **Exército pessoal**  
   O jogador não controla apenas um personagem. Ele controla uma força móvel composta por esqueletos, espectros, cavaleiros mortos, bestas reanimadas, dragões ósseos e entidades raras.

5. **Escolhas morais cinzentas**  
   Necromancia pode salvar vilas, profanar túmulos, quebrar maldições ou criar tirania. O jogo não deve tratar o protagonista como herói puro.

---

## 3. Público-alvo

### Público primário

Jogadores que gostam de:

- RPG de ação em terceira pessoa.
- Diablo, Genshin Impact, Elden Ring, Dragon’s Dogma, Skyrim, Shadow of Mordor, Path of Exile e Solo Leveling-like progression.
- Fantasia sombria com progressão de poder extrema.
- Classes raras, builds, loot, dungeons e chefes.
- Jogar solo com aliados controlados por IA.

### Público secundário

- Jogadores mobile que gostam de progressão diária, mas sem pay-to-win obrigatório.
- Fãs de anime/manhwa/donghua com protagonista apelão, mas que querem gameplay real.
- Jogadores que gostam de colecionar criaturas e evoluí-las.

---

## 4. Proposta comercial

### Modelo recomendado por fase

**Fase 1 — Protótipo gratuito**  
Distribuição via itch.io, GitHub Releases ou página própria. Objetivo: validar combate, invocações e câmera.

**Fase 2 — Vertical slice pública**  
Demo fechada ou aberta. Objetivo: validar interesse, captar feedback e montar comunidade.

**Fase 3 — Early Access PC**  
Venda premium de baixo/médio preço. Conteúdo: uma região grande, campanha inicial, 4 famílias de servos, 3 dungeons, 2 bosses mundiais.

**Fase 4 — Expansão mobile**  
Mobile deve vir depois, com interface adaptada, gráficos escaláveis e mapas menores/instanciados.

### Não recomendado no início

- MMO completo.
- Co-op online logo no MVP.
- Mundo aberto gigantesco sem vertical slice.
- Gacha como base principal.
- Cinemáticas AAA longas.
- Sistema de criação de personagem complexo antes do combate estar excelente.

---

## 5. História original

### 5.1 Premissa

Há mil anos, os Três Reinos selaram a **Primeira Calamidade**, uma guerra contra uma força anterior à vida e à morte. Para vencer, humanos, demônios e dragões apagaram da história a quarta linhagem: os **Senhores do Véu**, necromantes capazes de comandar almas, ossos e memórias dos mortos.

Agora, portões surgem por toda a terra. Monstros aparecem. Ruínas despertam. Pessoas recebem vocações inscritas em suas almas. Os reinos chamam isso de “Benção do Sistema”. Os sacerdotes chamam de milagre. Os dragões chamam de erro. Os demônios chamam de oportunidade.

O protagonista desperta uma vocação que todos julgavam extinta: **Necromante Primordial**.

Ao despertar, ele não recebe apenas magia. Ele recebe uma sentença: sempre que usa seu poder, o mundo lembra que a quarta linhagem existiu.

### 5.2 Tema narrativo

**“A morte não é o fim. É um exército esperando ordens.”**

Temas principais:

- Poder e responsabilidade.
- Memória apagada pela história oficial.
- Medo social do diferente.
- Guerra entre fé, ciência arcana e sobrevivência.
- Sacrifício: até onde usar os mortos para proteger os vivos?
- Identidade: o protagonista é monstro, salvador ou rei?

### 5.3 Protagonista

**Nome sugerido:** Kael Varron  
**Título inicial:** O Sem-Vocação  
**Título intermediário:** O Herege de Ossos  
**Título final possível:** Rei do Véu, Arauto da Calamidade ou Guardião dos Mortos

**Origem:** jovem sobrevivente de uma vila de fronteira destruída por um Portão da Calamidade. Durante o massacre, todos despertam vocações comuns. Kael desperta tarde demais — e de forma errada. Os cadáveres ao seu redor se levantam para protegê-lo.

**Conflito interno:** ele odeia a necromancia no início, pois associa o poder à morte da própria vila. Aos poucos entende que seus servos não são apenas cadáveres; alguns carregam ecos, memórias e dívidas não resolvidas.

**Personalidade:** reservado, pragmático, desconfiado, com senso de justiça quebrado. Não é cruel por prazer, mas pode se tornar cruel por necessidade.

### 5.4 Antagonistas principais

#### 5.4.1 Ordem da Chama Branca

Instituição humana religiosa que caça necromantes, demônios, hereges e qualquer pessoa associada à Calamidade.

- Líder: Santa-General Elianor Veyr.
- Motivação: impedir que a Primeira Calamidade retorne.
- Problema moral: a Ordem realmente protege cidades, mas também executa inocentes.

#### 5.4.2 Império Demoníaco de Khar-Zul

Sociedade brutal, hierárquica e expansionista. Acredita que os Portões são a chance de quebrar antigos selos.

- Líder: Imperador Malgorth, o Sangue-Coroado.
- Motivação: usar a necromancia do protagonista para abrir um caminho ao Abismo Raiz.
- Relação com o jogador: inimigos, aliados temporários ou fonte de pactos perigosos.

#### 5.4.3 Domínios Dracônicos de Aurelion

Dragões antigos que tratam humanos e demônios como raças jovens e irresponsáveis.

- Líder: Matriarca Seryndra, Escama de Cinza.
- Motivação: destruir qualquer vestígio da quarta linhagem.
- Segredo: os dragões participaram do apagamento histórico dos necromantes.

#### 5.4.4 O Rei Vazio

Entidade presa além do Véu. Não é exatamente vivo nem morto. Foi o primeiro a tentar transformar toda vida em memória obediente.

- Função: antagonista final da saga principal.
- Presença: sussurros, sonhos, dungeons corrompidas, servos que falam com vozes erradas.
- Risco: o jogador pode acabar repetindo seus passos.

---

## 6. Estrutura da campanha

### Ato 1 — O despertar errado

Local: fronteira humana, vila destruída, cripta antiga e primeira cidade.

Objetivos:

- Ensinar movimento, câmera, combate e primeira invocação.
- Apresentar o protagonista como sobrevivente perseguido.
- Introduzir o conceito de vocações.
- Abrir o primeiro hub: **Bastião de Veyrhold**.

Chefão: Paladino Inquisidor Ravan.

Final do ato: Kael descobre que sua classe não é uma mutação, mas uma herança.

### Ato 2 — O exército dos esquecidos

Local: pântanos, campos de batalha antigos, catacumbas e ruínas.

Objetivos:

- Liberar sistema de captura de essência.
- Desbloquear três famílias de servos: Ossários, Espectrais e Bestiais.
- Introduzir escolhas: salvar uma vila usando mortos reanimados ou esconder o poder e deixar pessoas morrerem.

Chefão: Rainha Ghoul de Marrowfen.

Final do ato: a Ordem da Chama Branca declara Kael inimigo público.

### Ato 3 — Guerra dos Três Reinos

Local: fronteiras entre humanos, demônios e dragões.

Objetivos:

- Introduzir reputação com facções.
- Liberar montaria morta-viva.
- Permitir que o jogador conquiste fortalezas menores.
- Mostrar que cada reino quer usar ou destruir Kael.

Chefes:

- General Demoníaco Vorak.
- Dragão jovem corrompido Izharn.
- Campeã humana Mirelle Dusk.

Final do ato: Kael descobre que os Portões da Calamidade respondem ao seu sangue.

### Ato 4 — A Coroa do Véu

Local: deserto de ossos, cidadela esquecida dos necromantes, abismo subterrâneo.

Objetivos:

- Liberar evolução avançada de servos.
- Apresentar o Rei Vazio diretamente.
- Dar ao jogador escolhas permanentes de build moral.

Chefão: Guardião da Coroa, um antigo necromante que recusou morrer.

Final do ato: Kael recebe a chance de se tornar rei dos mortos ou destruir a fonte da necromancia.

### Ato 5 — Fim da Calamidade

Local: mundo aberto alterado pela escolha do jogador.

Três finais principais:

1. **Guardião do Véu**  
   Kael mantém a necromancia como barreira entre vivos e mortos.

2. **Rei da Calamidade**  
   Kael domina os reinos e substitui a guerra pela obediência dos mortos.

3. **Último Necromante**  
   Kael sacrifica sua classe e liberta as almas presas.

---

## 7. Mundo aberto

### 7.1 Estrutura do mapa

O mundo não deve nascer gigante. Ele deve nascer modular.

**Versão MVP:** uma região aberta chamada **Fronteira de Cinzas**.  
**Versão completa:** cinco macrorregiões conectadas por streaming de células.

### 7.2 Macrorregiões

#### 7.2.1 Fronteira de Cinzas

Região inicial, rural e devastada.

- Vilas queimadas.
- Campos de batalha.
- Criptas menores.
- Florestas mortas.
- Primeiro hub humano.
- Inimigos: lobos corrompidos, saqueadores, esqueletos, soldados da Ordem.

Função: tutorial expandido e zona de progressão inicial.

#### 7.2.2 Pântano de Marrowfen

Região úmida, venenosa e cheia de corpos preservados.

- Árvores retorcidas.
- Névoa volumétrica.
- Ruínas semi-submersas.
- Vilas isoladas.
- Boss mundial: Rainha Ghoul.

Função: ensinar resistência elemental, controle de multidão e servos bestiais.

#### 7.2.3 Bastilha da Chama Branca

Região humana fortificada.

- Cidade vertical.
- Catedral militar.
- Prisões subterrâneas.
- Arena de julgamento.
- Inimigos: paladinos, arqueiros, sacerdotes, autômatos sagrados.

Função: conflito político e stealth/social.

#### 7.2.4 Khar-Zul, Terras Demoníacas

Região vulcânica e hostil.

- Rios de lava.
- Fortalezas demoníacas.
- Campos de escravidão.
- Portões abissais.
- Inimigos: demônios, cães infernais, cultistas, monstros de sangue.

Função: builds agressivas, pactos e servos demoníacos.

#### 7.2.5 Aurelion, Domínio dos Dragões

Região montanhosa e antiga.

- Picos nevados.
- Ruínas ciclópicas.
- Ninhos de dragões.
- Torres de observação.
- Inimigos: draconatos, wyverns, elementais, guardiões antigos.

Função: verticalidade, montarias e fim de campanha.

#### 7.2.6 Cidadela do Véu

Região final parcialmente fora da realidade.

- Arquitetura impossível.
- Céu quebrado.
- Salas que mudam.
- Memórias dos mortos manifestadas.
- Inimigos: ecos, necromantes antigos, fragmentos do Rei Vazio.

Função: endgame narrativo e desafios avançados.

---

## 8. Loop principal de gameplay

### 8.1 Loop de 30 segundos

1. Avistar inimigos ou evento.
2. Posicionar-se.
3. Invocar/ordenar servos.
4. Atacar, esquivar, drenar, amaldiçoar.
5. Coletar essência/corpos/loot.
6. Decidir: reanimar, sacrificar ou armazenar.

### 8.2 Loop de 5 minutos

1. Explorar uma área.
2. Encontrar combate, recurso, NPC ou segredo.
3. Usar servos para vencer ou resolver obstáculo.
4. Obter XP, essência, loot e materiais.
5. Evoluir personagem ou servos.

### 8.3 Loop de 30 minutos

1. Aceitar missão ou escolher rota.
2. Explorar um bioma.
3. Entrar em dungeon/evento.
4. Derrotar elite/boss.
5. Voltar ao hub/base.
6. Melhorar build, equipamentos e exército.

### 8.4 Loop de longo prazo

1. Liberar regiões.
2. Expandir exército.
3. Conquistar fortalezas.
4. Alterar reputação com facções.
5. Desbloquear finais e endgame.

---

## 9. Sistema de combate

### 9.1 Câmera

- Terceira pessoa.
- Câmera livre com lock-on opcional.
- Zoom dinâmico em chefes.
- Distância maior quando muitos servos estão ativos.
- Auto-ajuste para evitar paredes.

### 9.2 Controles PC

- WASD: movimento.
- Mouse: câmera.
- Clique esquerdo: ataque básico.
- Clique direito: habilidade principal.
- Espaço: esquiva/rolamento.
- Shift: sprint.
- Q/E/R/F: habilidades.
- 1-4: comandos de servos.
- Tab: lock-on.
- Ctrl: modo tático rápido.

### 9.3 Controles mobile futuros

- Joystick esquerdo virtual.
- Botões de ataque/habilidades à direita.
- Botão de comando de servos radial.
- Auto-lock opcional.
- Assistência de câmera.
- Redução de microgerenciamento.

### 9.4 Estatísticas do jogador

- Vida.
- Mana.
- Vigor.
- Essência da Morte.
- Defesa física.
- Defesa arcana.
- Resistência a luz.
- Resistência a trevas.
- Poder necromântico.
- Capacidade de comando.
- Corrupção.
- Vínculo de alma.

### 9.5 Recurso especial: Essência da Morte

A Essência da Morte é usada para:

- Invocar servos.
- Reanimar corpos recentes.
- Curar servos.
- Fortalecer ataques.
- Ativar ultimate.
- Sacrificar servos para defesa.

Fontes:

- Inimigos mortos.
- Altares.
- Ossários.
- Itens consumíveis.
- Execuções especiais.
- Drenagem de vida.

### 9.6 Dano transferido aos servos

Inspirado no arquétipo do necromante protegido por suas invocações, mas com regra original:

**Pacto do Túmulo:** uma porcentagem do dano recebido por Kael é redirecionada para seus servos ativos. Quanto maior o vínculo, maior a transferência. Se não houver servos, Kael fica vulnerável.

Níveis:

- Nível 1: 10% do dano redirecionado.
- Nível 2: 20%.
- Nível 3: 30%.
- Nível 4: 40%.
- Nível 5: 50%, mas com risco de colapso de servos frágeis.

Esse sistema cria decisões:

- Levar muitos servos fracos para absorver dano.
- Levar poucos servos fortes para controle.
- Sacrificar servos para sobreviver.
- Proteger necromante ou jogar agressivamente.

---

## 10. Sistema de necromancia

### 10.1 Famílias de servos

#### Ossários

Servos físicos feitos de ossos.

Tipos:

- Esqueleto Soldado.
- Esqueleto Arqueiro.
- Escudeiro Ossário.
- Lanceiro de Cripta.
- Cavaleiro Ossário.
- Gigante de Ossos.

Função: linha de frente, dano físico, tanques baratos.

#### Espectrais

Servos espirituais.

Tipos:

- Sombra Menor.
- Aparição.
- Lamento Espectral.
- Ceifador do Véu.
- Guardião de Memória.

Função: atravessar barreiras, aplicar medo, drenar mana, atacar inimigos blindados.

#### Bestiais

Animais e monstros reanimados.

Tipos:

- Lobo Cadavérico.
- Urso Putrefato.
- Corvo de Ossos.
- Aranha de Cripta.
- Wyvern Morta.

Função: mobilidade, perseguição, exploração, rastreamento.

#### Profanos

Servos criados por fusão e rituais.

Tipos:

- Abominação de Carne.
- Colosso de Túmulos.
- Arauto Pestilento.
- Dragão Ossário.

Função: alto custo, alto impacto, visual marcante.

### 10.2 Raridade de servos

- Comum.
- Incomum.
- Raro.
- Épico.
- Lendário.
- Ancestral.

Raridade define:

- Número de habilidades.
- Potencial de evolução.
- Aparência.
- Slots de runas.
- Inteligência tática.
- Vínculo máximo.

### 10.3 Captura de essência

Nem todo inimigo morto vira servo. O jogador precisa escolher:

1. **Colher essência**: recurso genérico.
2. **Preservar corpo**: permite reanimação física.
3. **Aprisionar alma**: permite servo espectral.
4. **Consumir memória**: desbloqueia lore, habilidade ou resistência.
5. **Purificar**: reduz corrupção e melhora reputação com algumas facções.

### 10.4 Evolução de servos

Cada servo evolui por:

- Nível.
- Essência investida.
- Materiais.
- Memórias absorvidas.
- Combate real.
- Rituais.

Exemplo:

Esqueleto Soldado → Guarda Ossário → Cavaleiro Ossário → Campeão de Cripta → Senhor dos Ossos.

### 10.5 Comandos de servos

Comandos básicos:

- Seguir.
- Atacar alvo.
- Defender jogador.
- Manter posição.
- Explorar área.
- Recuar.
- Sacrificar.

Comandos avançados:

- Formar muralha.
- Cercar inimigo.
- Focar conjuradores.
- Proteger NPC.
- Carregar objeto.
- Abrir passagem.

### 10.6 Limite de exército

O limite não deve ser apenas número fixo. Deve ser baseado em **Capacidade de Comando**.

Exemplo:

- Esqueleto comum: 1 ponto.
- Arqueiro: 2 pontos.
- Cavaleiro: 5 pontos.
- Abominação: 12 pontos.
- Dragão Ossário: 30 pontos.

Isso evita excesso de unidades e ajuda performance.

---

## 11. Progressão do personagem

### 11.1 Níveis

- Nível máximo inicial MVP: 30.
- Nível máximo jogo completo: 100.
- Endgame: níveis de domínio necromântico.

### 11.2 Árvores de habilidade

#### Árvore 1 — Ossos

Foco: dano físico, defesa, escudos, armas ósseas.

Habilidades:

- Lança de Osso.
- Armadura de Costelas.
- Prisão Óssea.
- Estilhaço de Cripta.
- Muralha dos Mortos.

#### Árvore 2 — Almas

Foco: dano mágico, medo, controle, drenagem.

Habilidades:

- Toque do Véu.
- Grito dos Esquecidos.
- Drenar Alma.
- Marca do Lamento.
- Possessão Breve.

#### Árvore 3 — Praga

Foco: dano ao longo do tempo, veneno, debuffs, área.

Habilidades:

- Nuvem Pestilenta.
- Sangue Ruim.
- Contágio.
- Explosão Cadavérica.
- Solo Profanado.

#### Árvore 4 — Comando

Foco: buffar servos, tática, formação e sobrevivência.

Habilidades:

- Ordem de Ataque.
- Vínculo de Ossos.
- Marcha dos Mortos.
- Sacrifício Protetor.
- General do Túmulo.

### 11.3 Builds possíveis

1. **Comandante de Legião**  
   Muitos servos fracos, buffs globais, foco em controle de campo.

2. **Cavaleiro Necromante**  
   Combate corpo a corpo com poucos servos fortes.

3. **Ceifador Espectral**  
   Magias de alma, medo, dano mágico e mobilidade.

4. **Senhor da Praga**  
   Debuffs, venenos, explosões e dano em área.

5. **Domador de Horrores**  
   Poucos monstros raros e enormes.

---

## 12. Equipamentos e loot

### 12.1 Slots

- Arma principal.
- Foco necromântico.
- Capuz/elmo.
- Peitoral.
- Luvas.
- Botas.
- Amuleto.
- Anel 1.
- Anel 2.
- Relíquia.
- Grimório.

### 12.2 Tipos de arma

- Cajado.
- Foice.
- Espada ritual.
- Adaga de sacrifício.
- Orbe.
- Livro proibido.

### 12.3 Atributos de item

- +Poder necromântico.
- +Capacidade de comando.
- +Dano de servos.
- +Vida dos servos.
- +Redução de custo de invocação.
- +Dano de alma.
- +Dano de praga.
- +Chance de preservar corpo.
- +Chance de capturar alma rara.

### 12.4 Conjuntos

Exemplo: **Set do Rei Sepultado**

- 2 peças: +15% vida dos servos ossários.
- 4 peças: esqueletos têm chance de bloquear dano ao jogador.
- 6 peças: invoca um Cavaleiro Ossário temporário ao usar ultimate.

---

## 13. Dungeons

### 13.1 Tipos

- Criptas.
- Ruínas antigas.
- Portões da Calamidade.
- Fortalezas de facção.
- Ninhos de monstros.
- Memórias do Véu.

### 13.2 Estrutura de dungeon

1. Entrada com preparação.
2. Área de exploração.
3. Primeiro encontro de combate.
4. Puzzle simples ou obstáculo.
5. Elite.
6. Evento de risco/recompensa.
7. Boss.
8. Sala de recompensa.

### 13.3 Modificadores

- Inimigos explodem ao morrer.
- Servos perdem vida lentamente.
- Luz sagrada enfraquece necromancia.
- Corpos não podem ser reanimados.
- Almas têm chance de se rebelar.
- Boss invoca reforços.

---

## 14. Bosses

### 14.1 Princípios

Cada boss deve testar um aspecto do sistema:

- Mobilidade.
- Controle de servos.
- Sacrifício.
- Dano em área.
- Resistência elemental.
- Posicionamento.
- Uso do cenário.

### 14.2 Boss inicial — Inquisidor Ravan

Função: ensinar que servos podem ser destruídos rapidamente por dano sagrado.

Fases:

1. Espada e escudo.
2. Chamas sagradas no chão.
3. Execução de servos.
4. Duelo com janela para contra-ataque.

Recompensa: primeira relíquia anti-luz.

### 14.3 Boss de mundo — Rainha Ghoul

Função: testar controle de multidão.

Mecânicas:

- Invoca enxames.
- Cura ao comer cadáveres.
- Grita e causa medo nos servos fracos.
- Pode ser transformada em servo lendário se derrotada com ritual especial.

### 14.4 Boss final — Rei Vazio

Função: testar domínio completo do jogador.

Mecânicas:

- Copia servos do jogador.
- Corrompe comandos.
- Inverte dano transferido.
- Usa memórias de NPCs mortos contra o jogador.
- Final muda conforme reputação, corrupção e escolhas.

---

## 15. Facções e reputação

### 15.1 Reino Humano de Veyrhold

Valores: ordem, fé, medo da magia proibida.  
Reage mal à necromancia pública.  
Pode aceitar o jogador se ele salvar cidades e purificar mortos.

### 15.2 Ordem da Chama Branca

Valores: pureza, disciplina, extermínio de hereges.  
Quase sempre hostil.  
Alguns membros podem desertar.

### 15.3 Clãs Livres da Fronteira

Valores: sobrevivência, comércio, pragmatismo.  
Aceitam ajuda do necromante se ele proteger vilas.

### 15.4 Império Demoníaco

Valores: força, pacto, conquista.  
Pode oferecer habilidades poderosas com custo moral.

### 15.5 Domínios Dracônicos

Valores: memória, equilíbrio, arrogância ancestral.  
Podem ensinar verdades antigas, mas exigem sacrifícios.

### 15.6 Os Sem-Túmulo

Mortos conscientes que não querem servir nem desaparecer.  
Facção central para dilemas morais.

---

## 16. Sistema de escolhas

### 16.1 Corrupção

A corrupção não deve ser apenas “bom/mau”. Ela representa o quanto o jogador força a morte a obedecer.

Ações que aumentam corrupção:

- Reanimar inocentes.
- Profanar túmulos.
- Sacrificar almas conscientes.
- Fazer pactos demoníacos.
- Usar magia de praga em civis.

Ações que reduzem corrupção:

- Libertar almas.
- Purificar dungeons.
- Recusar pactos.
- Proteger vilas sem profanar mortos locais.
- Enterrar servos antigos.

### 16.2 Consequências

- NPCs fogem ou negociam.
- Cidades fecham portões.
- Preços mudam.
- Facções caçam ou ajudam.
- Aparência do protagonista muda.
- Servos ganham efeitos visuais.
- Finais mudam.

---

## 17. Base do jogador

### 17.1 Nome

**O Ossuário Errante** — uma fortaleza móvel construída com pedra, ossos e magia do Véu.

### 17.2 Funções

- Gerenciar servos.
- Guardar corpos raros.
- Evoluir unidades.
- Craftar equipamentos.
- Pesquisar necromancia.
- Receber NPCs aliados.
- Planejar expedições.
- Mudar aparência.

### 17.3 Melhorias

- Câmara de Rituais.
- Forja de Ossos.
- Biblioteca Proibida.
- Estábulo Cadavérico.
- Altar de Purificação.
- Prisão de Almas.
- Mesa de Guerra.

---

## 18. IA

### 18.1 IA de inimigos

Estados básicos:

- Patrulhar.
- Investigar.
- Alertar.
- Atacar.
- Recuar.
- Chamar reforços.
- Fugir.
- Executar servo.

### 18.2 IA de servos

Estados básicos:

- Seguir líder.
- Buscar formação.
- Atacar alvo prioritário.
- Defender área.
- Evitar dano de área.
- Retornar ao jogador.
- Sacrificar-se se comando ativo.

### 18.3 Prioridades por tipo

- Tanques protegem o jogador.
- Arqueiros mantêm distância.
- Espectros focam conjuradores.
- Bestas perseguem alvos móveis.
- Abominações atacam grupos.

---

## 19. Direção de arte

### 19.1 Estilo visual

Dark fantasy estilizado-realista. Não tentar realismo extremo no início. O ideal para Godot e equipe pequena é um visual forte, com silhuetas claras e materiais otimizados.

Referências de sensação:

- Fantasia sombria.
- Anime/manhwa de poder crescente.
- Ruínas antigas.
- Alto contraste entre magia sagrada, magia demoníaca e necromancia.

### 19.2 Paleta

- Necromancia: verde espectral, azul frio, cinza osso.
- Chama Branca: dourado, branco, vermelho queimado.
- Demônios: vermelho escuro, preto, laranja lava.
- Dragões: prata, azul antigo, bronze, cinza montanha.
- Véu: roxo profundo, preto, azul vazio.

### 19.3 Silhueta do protagonista

- Capa longa rasgada.
- Foco flutuante ou grimório.
- Marcas brilhando nos braços.
- Armadura assimétrica.
- Visual evolui conforme corrupção.

### 19.4 Design dos servos

Cada servo precisa ser reconhecido pela silhueta, mesmo sem UI.

- Esqueleto soldado: espada e escudo simples.
- Arqueiro: costas curvadas e arco ósseo.
- Cavaleiro: elmo alto e ombreiras.
- Espectro: forma fluida sem pernas.
- Abominação: massa grande, ombros desiguais.
- Dragão ossário: asas quebradas, costelas expostas.

---

## 20. Som e música

### 20.1 Direção sonora

- Vozes sussurradas para necromancia.
- Ossos rangendo em invocações.
- Coros graves em dungeons.
- Silêncio pesado antes de bosses.
- Cordas e percussão para combate.

### 20.2 Sistema musical

Camadas dinâmicas:

- Exploração calma.
- Perigo próximo.
- Combate leve.
- Combate intenso.
- Boss.
- Vitória.
- Corrupção alta.

### 20.3 Feedback sonoro obrigatório

- Servo invocado.
- Servo morreu.
- Corpo disponível para reanimação.
- Alma rara capturada.
- Dano transferido.
- Corrupção aumentou.
- Facção ficou hostil.

---

## 21. UI/UX

### 21.1 HUD

Elementos:

- Vida.
- Mana.
- Vigor.
- Essência da Morte.
- Slots de habilidade.
- Mini status de servos.
- Alvo atual.
- Indicador de corrupção.
- Minimapa.

### 21.2 Tela de servos

Deve mostrar:

- Lista de servos ativos.
- Reserva de servos.
- Tipo.
- Raridade.
- Nível.
- Custo de comando.
- Habilidades.
- Evolução possível.
- Botão sacrificar/libertar.

### 21.3 UX de comando

O jogador não deve abrir menu complexo no meio da luta. O comando deve ser rápido:

- Toque curto: comando principal.
- Segurar botão: roda tática.
- Apontar alvo: direcionar servos.
- Duplo toque: reunir todos.

---

## 22. Arquitetura técnica em Godot

### 22.1 Linguagem

Recomendação:

- **GDScript** para protótipos, gameplay, UI, scripts rápidos.
- **C#** apenas se algum sistema pesado justificar: simulação de muitos agentes, geração procedural, ferramentas internas ou pathfinding customizado.

### 22.2 Organização de pastas

```text
/godot
  /addons
  /assets
    /characters
    /creatures
    /environment
    /fx
    /icons
    /materials
    /audio
  /scenes
    /player
    /enemies
    /summons
    /world
    /dungeons
    /ui
    /systems
  /scripts
    /core
    /combat
    /necromancy
    /ai
    /world
    /inventory
    /quests
    /save
  /resources
    /items
    /skills
    /summons
    /quests
    /factions
  /tools
  /tests
  project.godot
```

### 22.3 Princípio de cenas

Tudo que for reutilizável deve ser cena:

- Player.tscn.
- SummonBase.tscn.
- EnemyBase.tscn.
- SkillProjectile.tscn.
- LootDrop.tscn.
- DungeonEntrance.tscn.
- WorldCell.tscn.

### 22.4 Princípio de Resources

Tudo que for dado configurável deve ser Resource:

- SkillData.
- ItemData.
- SummonData.
- EnemyData.
- QuestData.
- FactionData.
- BiomeData.
- LootTable.

Isso permite balanceamento sem reescrever lógica.

### 22.5 Autoloads recomendados

- GameManager.
- SaveManager.
- AudioManager.
- SceneLoader.
- InputManager.
- QuestManager.
- FactionManager.
- NecromancyManager.
- WorldStreamingManager.
- DebugConsole.

---

## 23. Mundo aberto em Godot

### 23.1 Regra principal

Godot não deve carregar um mundo gigante inteiro. O mapa precisa ser dividido em células.

### 23.2 Células de mundo

Cada região será dividida em WorldCells.

Exemplo:

```text
World_FronteiraCinzas
  Cell_00_00
  Cell_00_01
  Cell_01_00
  Cell_01_01
```

Cada célula contém:

- Terreno.
- Props.
- Inimigos locais.
- Eventos.
- Pontos de coleta.
- Entradas de dungeon.
- Dados de navegação.

### 23.3 Streaming simples

O WorldStreamingManager carrega:

- Célula atual.
- Células vizinhas imediatas.
- Pontos de interesse próximos.

Descarrega:

- Células distantes.
- Inimigos fora de alcance.
- FX e sons não usados.

### 23.4 LOD

Obrigatório para:

- Árvores.
- Rochas.
- Construções.
- Inimigos grandes.
- Servos grandes.
- Props repetidos.

### 23.5 Occlusion culling

Usar principalmente em:

- Cidades.
- Fortalezas.
- Dungeons.
- Ruínas.
- Corredores.
- Áreas com paredes e obstáculos.

### 23.6 Performance alvo

PC MVP:

- 1080p.
- 60 FPS alvo.
- 30 FPS mínimo aceitável em máquinas fracas.
- Máximo inicial: 15 a 25 agentes ativos em combate.

Mobile futuro:

- 30 FPS alvo.
- Menos servos simultâneos.
- Distância de visão reduzida.
- Texturas menores.
- Mais instanciamento.

---

## 24. Save system

### 24.1 Dados salvos

- Posição do jogador.
- Região/célula atual.
- Nível e atributos.
- Habilidades desbloqueadas.
- Inventário.
- Servos ativos e reserva.
- Estado de quests.
- Reputação por facção.
- Corrupção.
- Estado de mundo.
- Dungeons concluídas.
- Bosses derrotados.
- Configurações.

### 24.2 Slots

- Autosave.
- Save manual 1.
- Save manual 2.
- Save manual 3.

### 24.3 Proteção

- Save em JSON no protótipo.
- Migração de versão.
- Backup automático do save anterior.
- Checagem de integridade.

---

## 25. Pipeline de produção AAA adaptado

### 25.1 Fase 0 — Conceito

Objetivo: provar que a ideia merece existir.

Entregáveis:

- One-page pitch.
- Game pillars.
- Público-alvo.
- Benchmark.
- Riscos técnicos.
- Escopo inicial.

Critério de saída:

- O time entende o jogo em 2 minutos.
- O diferencial está claro: necromante + exército + mundo aberto reativo.

### 25.2 Fase 1 — Pré-produção

Objetivo: provar a viabilidade.

Entregáveis:

- GDD v0.1.
- Protótipo de câmera e movimento.
- Protótipo de combate.
- Protótipo de invocação.
- Protótipo de IA de servos.
- Art bible.
- Technical design document.
- Plano de vertical slice.

Critério de saída:

- O core loop é divertido sem conteúdo final.
- O jogador entende por que ser necromante é diferente.

### 25.3 Fase 2 — Vertical slice

Objetivo: criar uma fatia com qualidade próxima do produto final.

Conteúdo:

- Uma pequena região aberta.
- Uma dungeon.
- Um hub.
- Três tipos de inimigo.
- Três tipos de servo.
- Um boss.
- Uma missão principal.
- Duas missões secundárias.
- UI quase final.
- Save funcional.

Critério de saída:

- 30 a 60 minutos de gameplay sólido.
- Performance aceitável.
- Direção visual definida.
- Sistemas centrais integrados.

### 25.4 Fase 3 — Produção

Objetivo: criar conteúdo em escala.

Frentes:

- Regiões.
- Dungeons.
- Quests.
- Inimigos.
- Servos.
- Itens.
- Bosses.
- História.
- UI.
- Áudio.
- Otimização.

Ritmo:

- Sprints semanais ou quinzenais.
- Build jogável toda semana.
- Revisão de bugs semanal.
- Playtest interno contínuo.

### 25.5 Fase 4 — Alpha

Objetivo: jogo completo do começo ao fim, mesmo feio ou desbalanceado.

Critério:

- Todas as regiões MVP existem.
- Campanha MVP pode ser concluída.
- Principais sistemas funcionam.
- Conteúdo placeholder permitido.

### 25.6 Fase 5 — Beta

Objetivo: polimento, bugfix, balanceamento e UX.

Critério:

- Nada grande entra sem aprovação.
- Foco em estabilidade.
- Save não pode quebrar.
- Performance medida.
- Tutoriais revisados.

### 25.7 Fase 6 — Release candidate

Objetivo: versão candidata a lançamento.

Checklist:

- Sem crashes conhecidos críticos.
- Saves migrando corretamente.
- Build instalável.
- Menu/configurações completos.
- Créditos.
- Licenças de assets.
- Página de loja.
- Trailer.
- Press kit.

### 25.8 Fase 7 — Lançamento

Objetivo: publicar, monitorar, responder.

Ações:

- Publicar build.
- Monitorar bugs.
- Coletar feedback.
- Hotfixes.
- Comunidade.
- Roadmap público.

### 25.9 Fase 8 — LiveOps/expansões

Conteúdo futuro:

- Novas regiões.
- Novas classes secundárias.
- Novos servos lendários.
- Arena de sobrevivência.
- Temporadas opcionais.
- Bosses mundiais.

---

## 26. Equipe ideal por fase

### Solo/duo inicial

- Game designer/programador.
- Artista generalista ou asset packs.
- Apoio de IA para documentação, código auxiliar e conceitos.

### Vertical slice pequena

- Diretor/game designer.
- Programador Godot.
- Artista 3D.
- Animador técnico.
- UI artist.
- Sound designer freelancer.
- QA eventual.

### Produção maior

- Producer.
- Lead game designer.
- Combat designer.
- Narrative designer.
- Lead programmer.
- Gameplay programmer.
- AI programmer.
- Technical artist.
- Environment artists.
- Character artist.
- Animator.
- VFX artist.
- UI/UX designer.
- Audio.
- QA.
- Community/marketing.

---

## 27. Ferramentas recomendadas

### Produção

- Godot 4.6.x.
- Blender.
- Krita ou Photoshop.
- GIMP opcional.
- Audacity/Reaper.
- Git + GitHub.
- Git LFS para assets grandes.
- Trello, Linear, Notion ou GitHub Projects.

### IA auxiliar

- ChatGPT/Codex para arquitetura, scripts e revisão.
- Ferramentas de imagem apenas para conceito, não como asset final sem revisão de licença.
- Ferramentas de voz/música apenas com cuidado jurídico.

### Assets

Usar assets temporários no protótipo e substituir depois.

Regra:

- Separar `/assets_placeholder` de `/assets_final`.
- Registrar licença de tudo.
- Não misturar asset sem origem conhecida.

---

## 28. Roadmap realista

### G0 — Fundação

- Definir GDD v0.1.
- Criar projeto Godot limpo.
- Criar repositório organizado.
- Definir padrões de pasta.
- Criar cena de teste.

### G1 — Movimento 3D

- Player em terceira pessoa.
- Câmera.
- Colisão.
- Sprint.
- Esquiva.
- Lock-on simples.

### G2 — Combate básico

- Ataque básico.
- Hitboxes/hurtboxes.
- Dano.
- Vida.
- Morte.
- Um inimigo simples.

### G3 — Primeira invocação

- Servo esqueleto.
- Seguir jogador.
- Atacar inimigo.
- Morrer.
- UI de servo.

### G4 — Necromancia jogável

- Reanimar corpo.
- Essência da morte.
- Comando atacar/seguir/recuar.
- Dano transferido.

### G5 — Primeira arena

- Área 3D pequena.
- Spawn de inimigos.
- Loot simples.
- XP.
- Level up.

### G6 — Mini dungeon

- Entrada.
- 3 salas.
- Elite.
- Boss.
- Recompensa.
- Save.

### G7 — Vertical slice

- Região aberta pequena.
- Hub.
- NPCs.
- Quest principal.
- Quest secundária.
- Boss.
- 3 servos.
- 5 inimigos.
- UI funcional.

### G8 — MVP PC

- Região Fronteira de Cinzas.
- 5 a 8 horas de conteúdo.
- 3 dungeons.
- 2 bosses mundiais.
- 4 famílias de servos iniciais.
- Sistema de reputação básico.
- Final parcial.

---

## 29. Backlog inicial

### Épico: Player 3D

- Criar PlayerController3D.
- Criar câmera orbital.
- Criar lock-on.
- Criar animações placeholder.
- Criar estado idle/walk/run/dodge/attack/hit/death.

### Épico: Combate

- Sistema de atributos.
- Sistema de dano.
- Sistema de equipe/facção.
- Hitbox/hurtbox.
- Floating damage opcional.
- Cooldowns.

### Épico: Necromancia

- EssenceManager.
- SummonManager.
- Corpses.
- RaiseSkeletonSkill.
- DamageTransferComponent.
- CommandWheel.

### Épico: IA

- EnemyBrain.
- SummonBrain.
- Behavior states.
- Target selection.
- Leash distance.
- Group positioning.

### Épico: Mundo

- WorldCell.
- Loading/unloading.
- Spawn points.
- Resource nodes.
- Dungeon entrances.

### Épico: UI

- HUD.
- Servo panel.
- Inventory.
- Skill tree.
- Quest log.
- Settings.

---

## 30. Critérios de qualidade

### Gameplay

- Movimento responde rápido.
- Câmera não atrapalha.
- Comando de servos é claro.
- Inimigos dão sinais antes de ataques fortes.
- O jogador entende por que perdeu.

### Visual

- Silhuetas legíveis.
- VFX não escondem ataques importantes.
- Servos não poluem a tela.
- UI legível em PC e mobile.

### Performance

- Medir FPS desde o começo.
- Evitar muitos agentes ativos.
- Usar pooling para projéteis e FX.
- Usar LOD.
- Dividir mundo em células.
- Otimizar materiais e sombras.

### Produção

- Toda feature deve ter dono.
- Toda sprint deve gerar build jogável.
- Toda mudança grande deve ter checklist.
- Todo asset deve ter licença registrada.
- Todo bug crítico deve bloquear release.

---

## 31. Riscos principais

### Risco 1 — Escopo grande demais

Mitigação: vertical slice antes do mundo completo.

### Risco 2 — Muitos servos derrubam FPS

Mitigação: limite por capacidade de comando, LOD de IA, pooling, grupos e simplificação de pathfinding.

### Risco 3 — Mundo aberto vazio

Mitigação: criar densidade em uma região pequena antes de expandir.

### Risco 4 — Godot exige soluções próprias para streaming amplo

Mitigação: criar sistema simples de células desde cedo.

### Risco 5 — Arte 3D demora demais

Mitigação: usar estilo estilizado, assets placeholder, kitbash e pipeline modular.

### Risco 6 — História grande sem gameplay

Mitigação: toda lore precisa virar missão, boss, dungeon, item ou decisão.

---

## 32. Vertical slice recomendada

### Nome

**A Cripta de Veyrfall**

### Duração

30 a 60 minutos.

### Conteúdo

- Tutorial narrativo na vila destruída.
- Primeira invocação de esqueleto.
- Fuga da Ordem da Chama Branca.
- Pequena área aberta.
- Uma cripta.
- Um mini-boss.
- Primeiro hub.
- Escolha moral: libertar almas ou usá-las para ganhar poder.

### Servos disponíveis

- Esqueleto Soldado.
- Esqueleto Arqueiro.
- Sombra Menor.

### Inimigos disponíveis

- Lobo corrompido.
- Saqueador.
- Soldado da Ordem.
- Acólito da Chama.
- Guardião de Cripta.

### Boss

**Inquisidor Ravan, Lâmina da Chama Branca**

### Objetivo da vertical slice

Provar que comandar mortos-vivos em terceira pessoa é divertido, legível e tecnicamente viável em Godot.

---

## 33. Próxima etapa prática

A próxima etapa ideal é criar um pacote de prompts para o Codex/Godot com foco em implementação incremental:

1. Criar branch `godot/g2-3d-necromancer-foundation`.
2. Criar estrutura base de pastas.
3. Criar cena `PrototypeArena3D.tscn`.
4. Criar `PlayerController3D`.
5. Criar câmera terceira pessoa.
6. Criar inimigo dummy.
7. Criar servo esqueleto dummy.
8. Criar comando seguir/atacar.
9. Criar essência e reanimação simples.
10. Criar checklist de validação.

---

## 34. Frase de venda

Em um mundo onde vocações despertam e dungeons devoram reinos, você nasce com a única classe proibida pela história. Cace monstros, roube suas almas, erga seu exército morto-vivo e decida se a necromancia será a última esperança dos vivos ou o começo de uma nova calamidade.

---

## 35. Elevator pitch

*N3R — Herdeiro da Calamidade* é um RPG de ação 3D em mundo aberto feito em Godot, onde o jogador controla um necromante perseguido pelos três grandes reinos. Em vez de lutar sozinho, ele captura essências, reanima monstros, evolui servos mortos-vivos e comanda uma legião em tempo real. O mundo reage ao uso da necromancia: vilas podem temer, facções podem caçar, almas podem se rebelar e o jogador decide se será guardião, tirano ou o último necromante.

---

## 36. Definição de sucesso

O projeto será considerado no caminho certo quando, mesmo usando assets simples, o jogador disser:

> “Eu quero matar esse monstro porque quero transformar ele em parte do meu exército.”

Esse é o núcleo emocional do jogo.

