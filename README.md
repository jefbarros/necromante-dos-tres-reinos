# Necromante dos Tres Reinos

RPG de acao com necromancia. Evolui para uma estrutura de Mundo Aberto por Regioes, com lore e identidade propria baseada nos Tres Reinos: Humanos, Demonios e Dragoes.

## Plataformas

### Godot (Plataforma Principal - G2+)

**Status**: Em desenvolvimento

Godot e a nova plataforma principal de producao a partir da fase G2.

- Build Web atual: `docs/play-godot/index.html`
- URL publica esperada: https://jefbarros.github.io/necromante-dos-tres-reinos/play-godot/index.html
- Documentacao: `docs/godot/`

### HTML5/Canvas (Legado - v0.3.4)

**Status**: Congelado

O prototipo HTML5/Canvas permanece como legado e laboratorio de referencia. Nao recebera novas features.

- Versao: v0.3.4
- Documentacao legado: `docs/legacy-html5/README.md`
- Executar: `npm run dev`

---

## Tags Importantes

| Tag | Descricao |
|-----|------------|
| godot-g1 | Build Godot minimo |
| godot-g1.1-web | Export Web validado |
| godot-g1.2-pages | GitHub Pages configurado |
| v0.3.4 | Ultima versao HTML5/Canvas estabilidade |

---

## Roadmap

- **G1.x**: Prototipo Godot (completo)
- **G2.x**: Evolucao funcional em Godot (em progresso)
- Ver `docs/godot/ROADMAP_G2.md` para fases detalhadas

---

## Smoke Test

O smoke test manual G1.2.1 esta pendente de validacao no navegador.

Ver `docs/play-godot/SMOKE_TEST_G1.2.1.md` para detalhes.

---

## Documentacao

- `docs/godot/MIGRATION_TO_GODOT.md` - Documentacao de migracao
- `docs/godot/ROADMAP_G2.md` - Roadmap G2
- `docs/godot/DEVELOPMENT_GUIDE.md` - Guia de desenvolvimento Godot
- `docs/play-godot/README.md` - Build Web Godot
- `docs/legacy-html5/README.md` - Legado HTML5

---

## Como Contribuir

1. Crie uma branch para sua feature
2. Desenvolva em Godot (nao altere `src/*.js`)
3. Valide com os comandos em `docs/godot/DEVELOPMENT_GUIDE.md`
4. Abra um Pull Request

---

## Regras de Desenvolvimento

- Novas features devem ser implementadas primeiro em Godot.
- **Não alterar `src/*.js` em tarefas Godot** - O legado permanece intocado.
- Cada marco deve ter validacao e documentacao.
- Evitar reescrever a arquitetura toda de uma vez.

---

## Comandos Git

```bash
# Verificar status
git status -sb

# Criar branch Godot
git switch -c godot/g2-minha-feature

# Validacoes
npm.cmd run check
git diff --name-only -- src
git diff --check
```

---

## Licenca

MIT
