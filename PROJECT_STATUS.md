# Project Status

## Estado Atual

G10 Playtest Build & Polish.

Godot e a unica base ativa do jogo. O projeto principal esta em `godot/`, com `godot/project.godot` apontando para `res://scenes/ui/MainMenu.tscn`.

## Branch E PR

- Branch de trabalho: `godot/g10-audit-first-real-test`
- Base anterior: `godot/g10-playtest-build-polish`
- PR atual: #8, limpeza e correcoes para o primeiro teste real

## Situacao Da Limpeza

- Itens proibidos da raiz e lockfiles de stack externa estao ausentes.
- `docs/legacy-html5/` ausente.
- `docs/play-godot/` preservado como export Web do Godot.
- Arquivos Godot soltos da raiz removidos: `icon.svg` e `icon.svg.import`.
- Estrutura profissional criada sem mover cenas/scripts referenciados.

## Validacao Tecnica

- `godot --headless --path godot --quit`: passa.
- `python tools/audit_godot_project.py`: gera `docs/qa/AUDIT_GODOT_PROJECT.md`.
- Auditoria estatica atual: sem `res://` quebrado, sem script de cena ausente, sem `class_name` duplicado, sem `:=` perigoso detectado e sem sinais quebrados detectaveis.

## Correcoes G10 Aplicadas

- Corrigidos erros de parser em HUD, dungeon, boss, quest manager e cenas com `sub_resource`.
- Corrigidos caminhos de botoes do menu principal.
- Corrigida sintaxe quebrada em `MainMenu.tscn`.
- Adicionadas cenas faltantes de `CorruptedWolf3D` e `OrderSoldier3D`.
- Removido ciclo direto de dependencia entre Hub e cenas de retorno usando caminhos de cena.
- Ajustados usos de `:=` em retornos genericos detectados pela auditoria.

## Primeiro Teste Real

Checklist completo: `docs/qa/FIRST_REAL_TEST_CHECKLIST.md`.

Fluxo minimo:

- Abrir `godot/project.godot`.
- Rodar `res://scenes/ui/MainMenu.tscn`.
- Novo Jogo entra no Hub.
- Testar movimento, camera, sprint, dodge, ataque, pause, save/load se disponivel, transicoes, combate, cadaver, essencia, reanimacao e comandos de servo.
- Registrar resultado em `docs/qa/FIRST_REAL_TEST_RESULTS.md`.

## Bugs Conhecidos Restantes

- O teste manual completo ainda precisa ser executado no editor com janela grafica.
- Algumas pastas historicas continuam fora da taxonomia ideal para evitar quebra de referencias; reorganizar somente em tarefa dedicada com atualizacao de paths.
- `docs/play-godot/` pode estar defasado em relacao ao estado atual do editor ate novo export Web.

## Proximos Passos

1. Executar o primeiro teste manual completo no Godot.
2. Registrar bugs em `docs/qa/FIRST_REAL_TEST_RESULTS.md`.
3. Corrigir apenas bloqueadores encontrados no teste.
4. Reexportar `docs/play-godot/` quando o build manual estiver aprovado.
5. Criar tag/release de playtest apos validacao.
