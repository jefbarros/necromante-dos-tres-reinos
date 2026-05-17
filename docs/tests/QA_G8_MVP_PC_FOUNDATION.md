# QA Checklist - G8 MVP PC Foundation

## Test Environment

- Godot 4.6.x (4.6.2 preferred)
- Branch: `godot/g8-mvp-pc-foundation`

## Pre-Test Setup

1. Open Godot and load project at `godot/`
2. Ensure branch is `godot/g8-mvp-pc-foundation`

## Menu Tests

### Main Menu

- [ ] MainMenu.tscn loads without errors
- [ ] Title displays correctly
- [ ] "Novo Jogo" button visible
- [ ] "Continuar" button shows correct state (enabled/disabled based on save)
- [ ] "Configuracoes" button visible
- [ ] "Sair" button visible
- [ ] Clicking "Sair" closes the game (or exits editor player)

### Settings Menu

- [ ] Settings menu opens from Main Menu
- [ ] Mouse sensitivity slider works
- [ ] Volume slider works
- [ ] Quality dropdown works (Low/Medium/High)
- [ ] Fullscreen toggle works
- [ ] "Voltar" returns to Main Menu

### Pause Menu (In-Game)

- [ ] Press Esc during gameplay opens Pause Menu
- [ ] Pause menu shows correctly with dark background
- [ ] "Continuar" button works
- [ ] "Salvar" button works and saves game
- [ ] "Carregar" button loads game
- [ ] "Voltar ao Menu" returns to Main Menu
- [ ] "Sair" exits to desktop
- [ ] Pressing Esc again closes pause menu

## Gameplay Tests

### New Game Flow

- [ ] Click "Novo Jogo" starts fresh game
- [ ] Player spawns at Hub_VeyrholdOutskirts
- [ ] Player can move with WASD
- [ ] Camera rotates with mouse
- [ ] Shift makes player sprint
- [ ] Space triggers dodge (if applicable)
- [ ] Left click attacks
- [ ] R reanimates corpses
- [ ] 1/2/3 commands work on servos

### Hub Tests

- [ ] Hub scene loads correctly
- [ ] Player visible in hub
- [ ] Can approach NPC Mara
- [ ] E interacts with Mara (starts quest if applicable)
- [ ] Can find dungeon entrance
- [ ] E enters dungeon

### Dungeon Tests

- [ ] MiniDungeon_CryptOfVeyrfall loads
- [ ] Combat works inside dungeon
- [ ] Kill enemies and gain essence
- [ ] Reanimate corpses
- [ ] Boss (Ravan) spawns and fights
- [ ] Defeat boss
- [ ] Collect reward chest
- [ ] Return to hub

### Save/Load Tests

- [ ] Save game creates valid JSON
- [ ] Save includes: version, timestamp, last_scene, player_state
- [ ] Load restores player state
- [ ] Continue loads last scene correctly
- [ ] Invalid saves handled gracefully

### Continue Flow

- [ ] Start game
- [ ] Play for a few minutes
- [ ] Save game
- [ ] Return to menu
- [ ] Click "Continuar"
- [ ] Player restored in same position

## Scene Validation

### Manual Scene Opening

These scenes should still work when opened directly:

- [ ] res://scenes/hub/Hub_VeyrholdOutskirts.tscn
- [ ] res::scenes/world/PrototypeArena3D.tscn
- [ ] res://scenes/dungeons/MiniDungeon_CryptOfVeyrfall.tscn
- [ ] res::scenes/enemies/BossRavanPrototype3D.tscn

### Scene Compatibility

- [ ] PrototypeHUD works in hub
- [ ] Combat system works in dungeon
- [ ] Quest system works in vertical slice
- [ ] Necromancy works (raise, commands)

## Visual/Audio Checks

- [ ] No console errors on startup
- [ ] HUD displays correctly
- [ ] FPS stable (target 60)
- [ ] No visual glitches on scene transitions

## Build Tests

- [ ] Export to Windows executable
- [ ] Executable runs outside Godot
- [ ] Game launches from exe
- [ ] Main menu appears in exe
- [ ] Gameplay works in exe

## Validation Commands

```bash
# Check git status
git status

# Verify no whitespace errors
git diff --check

# Verify HTML5/Canvas unchanged
git diff --name-only HEAD -- src docs/play-godot
```

## Known Issues to Document

_Pre-populate if any issues found during testing_

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|-------|
| QA | | | | |
| Dev | | | | |

## Notes

- Test in both windowed and fullscreen mode
- Test with different quality settings
- Verify mouse capture/release works correctly
