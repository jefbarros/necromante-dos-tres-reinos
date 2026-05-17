# Transicao para Godot

Este diretorio concentra a documentacao inicial do port Godot de **Necromante dos Tres Reinos**.

O jogo atual em **HTML5 + JavaScript + Canvas** segue como prototipo jogavel ate a v0.3.4 e continua sendo a base para validacao rapida de sistemas, balanceamento, UX e fluxo de gameplay. Nenhum comportamento do prototipo web deve ser alterado por esta etapa de documentacao.

O **Godot** sera a futura base de producao do projeto. A transicao deve preservar os sistemas validados no prototipo e reorganiza-los em cenas, recursos e scripts adequados para uma producao mais robusta.

## Objetivo desta pasta

- Registrar o plano de port sem implementar codigo Godot agora.
- Mapear os sistemas atuais para equivalentes em Godot.
- Sugerir uma estrutura inicial de cenas.
- Sugerir uma estrutura de dados baseada em resources.
- Definir fases de migracao claras.

## Documentos

- [PORT_PLAN.md](PORT_PLAN.md): estrategia geral de port e limites da transicao.
- [SYSTEM_MAPPING.md](SYSTEM_MAPPING.md): mapeamento dos sistemas atuais para Godot.
- [SCENE_STRUCTURE.md](SCENE_STRUCTURE.md): proposta inicial de cenas e responsabilidades.
- [DATA_MODEL.md](DATA_MODEL.md): proposta de organizacao de dados e resources.
- [ROADMAP.md](ROADMAP.md): fases G0 a G4 da migracao.

## Regras da transicao

- O prototipo HTML5/Canvas continua jogavel e util para validar sistemas.
- Godot passa a ser tratado como futura base de producao.
- Esta etapa nao implementa cenas, scripts, assets ou logica em Godot.
- Esta etapa nao altera gameplay, UI, save ou regras do prototipo HTML5.
