# First Real Test Checklist

## Setup

- [ ] Open Godot 4.x.
- [ ] Open/import `godot/`.
- [ ] Confirm project file is `godot/project.godot`.
- [ ] Confirm main scene is `res://scenes/ui/MainMenu.tscn`.
- [ ] Run the project or run `res://scenes/ui/MainMenu.tscn`.

## Main Menu And Hub

- [ ] Main Menu opens without red blocking errors.
- [ ] Click Novo Jogo.
- [ ] Hub loads.
- [ ] HUD appears.
- [ ] No blocking red error appears in Output.

## Player Controls

- [ ] WASD moves the player.
- [ ] Mouse controls the camera.
- [ ] Shift triggers sprint.
- [ ] Space triggers dodge.
- [ ] Left click attacks.
- [ ] ESC opens Pause Menu.
- [ ] ESC closes Pause Menu.
- [ ] Continuar closes Pause Menu.

## Save And Load

- [ ] Open Pause Menu.
- [ ] Press Save.
- [ ] Press Load.
- [ ] Confirm no fatal error occurs.

## Combat And Necromancy

- [ ] Enter an available test/playtest area.
- [ ] Find an enemy.
- [ ] Attack the enemy.
- [ ] Kill the enemy.
- [ ] Confirm corpse generation if applicable.
- [ ] Confirm essence gain if applicable.
- [ ] Press R near a corpse.
- [ ] Confirm a servant is raised.
- [ ] Confirm servant follows or attacks.
- [ ] Press 1 and confirm FOLLOW behavior if available.
- [ ] Press 2 and confirm ATTACK behavior if available.
- [ ] Press 3 and confirm RECALL behavior if available.

## Transitions

- [ ] Test Hub to Arena transition if available.
- [ ] Test Hub to dungeon transition if available.
- [ ] Test return transition if available.

## Result

- [ ] Record pass/fail notes in `docs/qa/FIRST_REAL_TEST_RESULTS.md`.
- [ ] Record every blocking red Output error with scene, action and reproduction steps.
