# Project Status

## Versao Atual

Godot G3.0 MVP jogavel

## Estado Geral

Migração oficial para Godot como plataforma principal de producao em andamento.

- **Plataforma Principal**: Godot (G3+)
- **Plataforma Legada**: HTML5/Canvas v0.3.4 (congelado)
- Godot G1 mínimo validado
- G1.1 export Web validado
- G2.1 baseline visual e jogavel minimo concluido
- G3.0 MVP jogavel completo em Godot
- G3.0.1 responsividade Web minima concluida como complemento do MVP G3.0
- G1.2 Pages configurado
- G1.2.1 smoke test manual pendente

## Plataforma Principal

**Godot 4.x**

- Cenas e scripts em `godot/`
- Build Web em `docs/play-godot/`
- Roadmap G3 prioriza polimento pos-MVP

## Plataforma Legada

**HTML5/Canvas v0.3.4**

- Prototipo congelado em v0.3.4
- Nao recebera novas features
- Mantido como referencia/laboratorio
- Codigo fonte permanece intocado em tarefas Godot

## Marcos Concluidos

| Marco | Descricao | Status |
|-------|----------|--------|
| G1 | Build Godot minimo | Completo |
| G1.1 Web | Export Web | Completo |
| G1.2 Pages | GitHub Pages | Completo |
| G2.1 | Baseline visual e jogavel minimo Godot | Completo |
| G3.0 | MVP jogavel completo Godot | Completo |
| G3.0.1 | Responsividade Web minima complementar ao MVP G3.0 | Completo |
| v0.3.4 | HTML5 estavel | Congelado |

## Tags

| Tag | Descricao |
|-----|------------|
| godot-g1 | Build Godot minimo |
| godot-g1.1-web | Export Web validado |
| godot-g1.2-pages | GitHub Pages configurado |
| godot-g2.1-visual-baseline | Baseline visual e combate G2.1 |
| v0.3.4 | HTML5 estavel |

## Proximas Etapas

1. Validar G3.0.1 no GitHub Pages apos merge
2. G3.1 polimento final e bugs
3. Melhorar smoke test Web por release
4. Planejar persistencia simples somente apos estabilizar o loop jogavel

Ver `docs/godot/ROADMAP_G3.md` para detalhes.

## Regras de Desenvolvimento

- Novas features devem ser implementadas primeiro em Godot.
- **Não alterar `src/*.js` em tarefas Godot**, exceto correções emergenciais documentadas.
- Não reimplementar tudo de uma vez - evoluir por marcos.
- Cada marco deve ter validação e documentação.
- Arquivos exportados de `docs/play-godot/` não devem ser alterados desnecessariamente.
- O único preset Godot válido continua sendo `godot/export_presets.cfg`.

## Validacoes

```bash
# Validar JS legado
npm.cmd run check

# Verificar src intacto
git diff --name-only -- src

# Verificar whitespace
git diff --check

# Verificar preset
git ls-files | findstr /i "export_presets.cfg"
# Resultado esperado: godot/export_presets.cfg
```

## Pendencias

- Smoke test manual G1.2.1 precisa ser validado no navegador
- Validar build Web em https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html
- Validar G3.0 publicado no GitHub Pages apos merge
- Validar G3.0.1 responsivo no GitHub Pages apos merge

## Documentacao

- `docs/godot/MIGRATION_TO_GODOT.md`
- `docs/godot/ROADMAP_G2.md`
- `docs/godot/ROADMAP_G3.md`
- `docs/godot/DEVELOPMENT_GUIDE.md`
- `docs/godot/G2.1_VISUAL_GAMEPLAY_BASELINE.md`
- `docs/godot/G3.0_MVP_COMPLETE.md`
- `docs/godot/G3.0.1_RESPONSIVE_WEB.md`
- `docs/play-godot/README.md`
- `docs/legacy-html5/README.md`
