# Roadmap Godot G3

## Estado

G3.0 fecha o primeiro MVP jogavel completo em Godot.

## G3.0 - MVP jogavel completo

**Status**: Concluido nesta etapa.

- [x] Estados de jogo: start, playing, victory e game over.
- [x] Player com movimento, vida, mana, ataque e feedback.
- [x] Inimigos com IA simples, dano e ondas.
- [x] Necromancia minima com alma/corpo e servo.
- [x] Servo seguindo e atacando.
- [x] XP e level up simples.
- [x] Inventario minimo com drops.
- [x] HUD completo para vertical slice.
- [x] Vitoria e derrota.
- [x] Export Web em `docs/play-godot/`.

## Pos-MVP

A proxima etapa deve priorizar polimento, estabilidade e validacao publica, nao expansao infinita.

Focos recomendados:

- Balanceamento do loop curto.
- Polimento visual e feedback de combate.
- Melhorias de UX no HUD e inventario.
- Smoke test manual e automatizado do build Web.
- Ajuste de performance Web.
- Documentacao de release e tag por marco.

## Regras mantidas

- Godot e a plataforma principal.
- HTML5/Canvas v0.3.4 segue congelado.
- `src/*.js` permanece intocado em tarefas Godot.
- O unico preset de export valido segue sendo `godot/export_presets.cfg`.
