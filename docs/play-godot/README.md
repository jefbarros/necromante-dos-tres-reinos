# Necromante dos Três Reinos - Godot G1 Web Build

Build Godot Web para validação da etapa G1.2.

## Como Acessar

Após habilitar GitHub Pages com source em `/docs`:

```
https://<usuario>.github.io/<repo>/play-godot/index.html
```

Exemplo: `https://username.github.io/necromante-dos-tres-reinos/play-godot/index.html`

## Arquivos do Build

```
docs/play-godot/
├── index.html          # HTML principal
├── index.js           # JavaScript Godot
├── index.wasm        # WebAssembly Godot
├── index.pck         # Pacote de recursos
├── index.png         # Splash/loading
├── index.icon.png    # Favicon
└── index.audio.*   # Audio worklets
```

## Como Regenerar Export

1. Abra o projeto em Godot 4.x
2. Vá em **Project > Export**
3. Selecione preset **Web**
4. Configure path de export para `docs/play-godot/`
5. Clique em **Export Project**
6. Commit os arquivos exportados

## Comandos de Validação

```bash
# Validar JavaScript
node --check src/config.js

# Verificar mudanças em src/
git diff --name-only -- src

# Verificar problemas de merge
git diff --check
```

## Limitações Atuais (G1)

- Build Godot Web experimental
- Funcionalidade básica apenas (movimento, ataque, spawn inimigo)
- Áudio dependente de browser
- Não substitui o HTML5/Canvas (v0.3.4 preservado)
- Servos, equipe, inventário ainda não implementados

## Roadmap G1

- G1.1: Build Godot Web mínimo
- G1.2: Publicação GitHub Pages (etapa atual)
- G1.3: Sistemas centrais (servos, equipe)
- G1.4: Inventário e equipamentos
- G1.5: Talentos e progressão
- G1.6: Regiões e mapa-mundi
