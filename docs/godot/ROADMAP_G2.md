# Roadmap Godot G2

> G3.0 consolidou as entregas de jogabilidade minima em um MVP jogavel. Para o plano atual, ver `docs/godot/ROADMAP_G3.md`.

## Objetivo

Evoluir o protótipo Godot de build mínimo para base jogável principal.

---

## Fases Sugeridas

### G2.0 - Fundação pós-migração

**Status**: Em progresso

- [x] Godot declarado como plataforma principal
- [x] HTML5 congelado como legado
- [x] Smoke test manual documentado
- [x] Regras de validação consolidadas
- [ ] Documentação de migração criada
- [ ] Roadmap G2 definido

### G2.1 - Base de personagem e combate

**Status**: Consolidado em G3.0

- [ ] Movimento refinado (aceleração, inércia, colisão)
- [ ] Ataque básico melhorado (animação, hitbox)
- [ ] Hit feedback (sangue, partículas,screen shake)
- [ ] Vida/dano/morte (health bar, game over)
- [ ] HUD mínimo Godot (vida, mana, objetiva)

### G2.2 - Inimigos e spawn

**Status**: Consolidado em G3.0

- [ ] Spawn controlado (wave, timer)
- [ ] IA simples (perseguir, atacar)
- [ ] Dano recebido (hit do inimigo)
- [ ] Reaparecimento (respawn seguro)
- [ ] Balanceamento inicial (dano, HP, velocidade)

### G2.3 - Necromancia mínima

**Status**: Consolidado em G3.0

- [ ] Captura/ressurreição básica (ao matar)
- [ ] Servo simples seguindo jogador
- [ ] Servo atacando inimigo
- [ ] Limite inicial de servos (1-3)
- [ ] UI de comando de servos

### G2.4 - Progressão mínima

**Status**: Consolidado em G3.0

- [ ] Sistema de XP
- [ ] Level up
- [ ] Atributos básicos (STR, DEX, INT)
- [ ] Melhorias simples (upgrades)
- [ ]曲线 de progressão

### G2.5 - Inventário mínimo

**Status**: Consolidado em G3.0

- [ ] Drops de inimigos
- [ ] Itens simples (poção, chave)
- [ ] Equipamento básico (arma, armadura)
- [ ] UI de inventário mínima
- [ ] Equipar/desequipar

### G2.6 - Export e publicação contínua

**Status**: Pendente

- [ ] Regenerar docs/play-godot
- [ ] Validar GitHub Pages
- [ ] Criar tags por marco
- [ ] Smoke test Web por versão
- [ ] Documentação de release

---

## Regras de Desenvolvimento

- **Cada fase deve ser pequena**: Foco em entregar algo jogável em cada marco.
- **Cada fase deve ter validação**: Teste headless e/ou manual antes de avançar.
- **Evitar reescrever arquitetura toda**: Usar a estrutura atual como base.
- **Não portar todos os sistemas do HTML5 de uma vez**: Implementar aos poucos.
- **Usar HTML5 apenas como referência de design/sistemas**: Não copiar código.
- **Não alterar `src/*.js`**: O legado HTML5 permanece intocado.

---

## Critérios de Conclusão G2

- Godot G2.6 com inventário, progressão e necromancia funcionando.
- Build Web público em docs/play-godot/index.html acessível.
- Smoke test automatizado e manual passando.
- Próxima fase pode definir expansão para regiões,mapa-mundo,factions.

---

## Notas

- A ordem das fases pode ser ajustada conforme necessidade.
- Recursos e tempo disponível influenciam a velocidade de desenvolvimento.
- Feedback dos jogadores pode repriorizar fases.
- Algumas fases podem ser combinadas se o escopo permitir.
