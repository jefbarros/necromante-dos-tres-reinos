# First Real Test Results

Date: 2026-05-17

## Automated/Headless Checks

- `godot --headless --path godot --quit`: pass.
- `python tools/audit_godot_project.py`: pass, report generated.

## Manual Godot Test

Status: partial.

- Editor smoke: `godot --path godot --editor --scene res://scenes/ui/MainMenu.tscn --quit-after 120` exited 0 with no dependency dialog output.
- Full visual click-through still needs user confirmation in the interactive Godot editor:
  - Open `res://scenes/ui/MainMenu.tscn`.
  - Confirm no missing dependency window.
  - Run MainMenu.
  - Novo Jogo -> Hub.
  - Hub -> Fronteira -> Hub.
  - Hub -> MiniDungeon -> Hub.
  - Confirm no blocking red Output error.

## Bugs Found During Audit

- `PrototypeHUD.gd` had parser-breaking indentation.
- `DungeonManager3D.gd` reused `dungeon_cleared` as both signal and variable.
- `DungeonManager3D.gd` used old `onready` syntax.
- `BossRavanPrototype3D.gd` accessed `$HealthComponent` before `_ready`.
- Multiple scenes used invalid `sub_sub_resource`/`SubSubResource`.
- `MainMenu.gd` pointed to button paths that did not exist in `MainMenu.tscn`.
- `MainMenu.tscn` had malformed syntax after `QuitButton`.
- `CorruptedWolf3D.tscn` and `OrderSoldier3D.tscn` were referenced but missing.
- Hub return references created direct scene dependency cycles.
- Several scripts used `:=` with generic load/instantiate/group lookup expressions.
- Transition scenes serialized map destinations as `PackedScene`/`res://` dependencies, causing missing dependency dialogs in the editor.

## Bugs Remaining

- Full manual click-through playtest results are not recorded yet.
- Exported Web build may need regeneration after editor playtest approval.
- Direct headless MiniDungeon shutdown emits Godot cleanup/leak noise after scene instantiation; it does not reproduce the missing dependency dialog.
