# Project Status

## Versao Atual

Godot G2 em preparacao

## Estado Geral

Migração oficial para Godot como plataforma principal de producao em andamento.

- **Plataforma Principal**: Godot (G2+)
- **Plataforma Legada**: HTML5/Canvas v0.3.4 (congelado)
- Godot G1 mínimo validado
- G1.1 export Web validado
- G1.2 Pages configurado
- G1.2.1 smoke test manual pendente

## Plataforma Principal

**Godot 4.x**

- Cenas e scripts em `godot/`
- Build Web em `docs/play-godot/`
- Roadmap G2 define fases de evolucao

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
| v0.3.4 | HTML5 estavel | Congelado |

## Tags

| Tag | Descricao |
|-----|------------|
| godot-g1 | Build Godot minimo |
| godot-g1.1-web | Export Web validado |
| godot-g1.2-pages | GitHub Pages configurado |
| v0.3.4 | HTML5 estavel |

## Proximas Etapas

1. Validar smoke test manual G1.2.1
2. Implementar G2.1 - Base de personagem e combate
3. Implementar G2.2 - Inimigos e spawn
4. Implementar G2.3 - Necromancia minima
5. Implementar G2.4 - Progressao minima
6. Implementar G2.5 - Inventario minimo
7. Implementar G2.6 - Export e publicacao continua

Ver `docs/godot/ROADMAP_G2.md` para detalhes.

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

## Documentacao

- `docs/godot/MIGRATION_TO_GODOT.md`
- `docs/godot/ROADMAP_G2.md`
- `docs/godot/DEVELOPMENT_GUIDE.md`
- `docs/play-godot/README.md`
- `docs/legacy-html5/README.md`
