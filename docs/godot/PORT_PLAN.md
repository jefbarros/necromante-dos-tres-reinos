# Plano de Port para Godot

## Contexto

**Necromante dos Tres Reinos** existe atualmente como um prototipo jogavel em **HTML5 + JavaScript + Canvas**, consolidado ate a v0.3.4. Esse prototipo deve continuar ativo para testes rapidos, validacao de sistemas, iteracao de balanceamento e demonstracao jogavel.

A partir desta transicao, **Godot** sera planejado como a futura base de producao. O objetivo nao e descartar o prototipo web, mas usar o que ele validou como referencia para uma implementacao mais estruturada.

## Escopo desta etapa

G0 cobriu apenas documentacao e planejamento. G1 entrega uma base Godot jogavel minima na branch `godot/g1-minimum-prototype`, sem remover nem alterar o prototipo HTML5/Canvas.

Inclui:

- Definicao da estrategia de migracao.
- Mapeamento dos sistemas atuais para Godot.
- Proposta de cenas Godot.
- Proposta de modelo de dados.
- Roadmap inicial por fases.
- Subprojeto Godot em `godot/`.
- Cena principal, player, inimigo e HUD placeholders.
- Movimento basico por WASD/setas, camera, ataque simples por `1` ou clique, dano minimo e morte/desaparecimento do inimigo.
- HUD com nome do prototipo, marcador `Godot G1`, vida do player, mana placeholder, controles e status de combate.
- Checklist de regressao especifico em `docs/tests/REGRESSION_GODOT_G1.md`.

Nao inclui:

- Conversao de assets.
- Alteracao de gameplay HTML5.
- Mudancas em arquivos JavaScript, HTML ou CSS.
- Inventario, talentos, save, mapa-mundi, servos, assets finais ou builds Android/Windows.
- Export Web obrigatorio; ele deve ser feito em fase separada caso os templates Godot estejam disponiveis.

## Estrategia

1. Manter o HTML5/Canvas como prototipo jogavel.
2. Congelar o comportamento validado como referencia funcional para o port.
3. Criar uma base Godot pequena e verificavel, com movimento e combate minimo.
4. Migrar sistemas em blocos independentes.
5. Usar dados externos/resources para reduzir acoplamento entre conteudo e codigo.
6. Validar paridade de regras entre prototipo web e Godot a cada fase.

## Principios de migracao

- Priorizar equivalencia de comportamento antes de melhorias.
- Evitar reescrever sistemas grandes de uma vez.
- Separar dados, apresentacao e regras de jogo.
- Preservar nomes conceituais ja usados no prototipo quando fizer sentido.
- Registrar divergencias intencionais entre HTML5 e Godot.

## Resultado esperado

Ao final da transicao planejada, o projeto deve ter:

- Prototipo HTML5 ainda jogavel e util para validacao.
- Projeto Godot estruturado como base de producao.
- Sistemas centrais migrados em fases.
- Dados de itens, talentos, inimigos e regioes organizados em resources.
- Roadmap claro para expansao de mundo, regioes e missoes.
