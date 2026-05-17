# Guia de Desenvolvimento Godot

## Visão Geral

Este guia estabelece os comandos e políticas para desenvolvimento do projeto em Godot.

## Estrutura de Diretórios

```
godot/                    # Projeto Godot
├── scenes/              # Cenas Godot
├── scripts/             # Scripts GDScript
├── assets/              # Recursos (imagens, áudio)
├── addons/              # Addons Godot
├── project.godot        # Arquivo de projeto
└── export_presets.cfg   # Configuração de export

docs/play-godot/          # Build Web público (exportado)
docs/godot/              # Documentação Godot
docs/legacy-html5/      # Documentação legado HTML5
src/                     # Código HTML5/Canvas (legado, intocado)
```

## Comandos de Validação

### Validar Godot (headless)

```bash
# Windows (com Godot instalado)
godot --headless --path godot --quit

# Ou se godot_console estiver disponível
godot_console --headless --path godot --quit
```

### Exportar Web Godot

```bash
# Windows (com Godot instalado)
godot --headless --path godot --export-release "Web" ../docs/play-godot/index.html

# Ou se godot_console estiver disponível
godot_console --headless --path godot --export-release "Web" ../docs/play-godot/index.html
```

### Validar JavaScript Legado

```bash
npm.cmd run check
```

### Validar whitespace

```bash
git diff --check
```

### Garantir que src não foi alterado

```bash
git diff --name-only -- src
```

### Verificar preset de export

```bash
git ls-files | findstr /i "export_presets.cfg"
```

**Resultado esperado**: `godot/export_presets.cfg`

---

## Política de Arquivos

### O que pode ser alterado

- `godot/scenes/*` - Cenas Godot
- `godot/scripts/*` - Scripts Godot
- `godot/assets/*` - Recursos Godot
- `docs/godot/*` - Documentação Godot
- `docs/play-godot/README.md` - Documentação do build

### O que NÃO pode ser alterado

- `src/*.js` - Código HTML5/Canvas (legado)
- `docs/play-godot/index.*` - Arquivos exportados (index.html, index.js, index.wasm, index.pck)
- `docs/play-godot/*.png` - Imagens do build
- `docs/play-godot/*.worklet.js` - Audio worklets
- Arquivos de cenas/scripts sem tarefa explícita

### Regras de Desenvolvimento

1. **Não alterar `src/*.js` em tarefas Godot** - O legado HTML5 permanece intocado.
2. **Não recriar export_presets.cfg na raiz** - O único válido é `godot/export_presets.cfg`.
3. **Não alterar arquivos exportados desnecessariamente** - Manter consistência do build.
4. **Cada marco deve ter validação** - Teste headless e documentação.
5. **Evoluir por fases pequenas** - Evitar big bang rewrites.

---

## Fluxo de Desenvolvimento

### 1. Criar branch

```bash
git switch -c godot/g2-minha-feature
```

### 2. Desenvolver

- Implementar mudanças em `/godot`
- Testar localmente

### 3. Validar

```bash
# Validar Godot
godot --headless --path godot --quit

# Validar legado
npm.cmd run check

# Verificar alterações em src
git diff --name-only -- src

# Verificar whitespace
git diff --check
```

### 4. Commitar

```bash
git add .
git commit -m "docs(godot): minha mudança"
```

### 5. Push e PR

```bash
git push -u origin godot/g2-minha-feature
gh pr create --base main --head godot/g2-minha-feature --title "Minha mudança"
```

---

## Smoke Test Manual

Após cada export Web significativo, execute o teste manual documentado em:

```
docs/play-godot/SMOKE_TEST_G1.2.1.md
```

Registre os resultados e atualize a documentação conforme necessário.

---

## Links Úteis

- Build Web: `docs/play-godot/index.html`
- URL pública: `https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html`
- Projeto Godot: `godot/project.godot`
- Documentação Godot: https://docs.godotengine.org/
