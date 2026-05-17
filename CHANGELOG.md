# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- G9 MVP PC Content Expansion branch: `godot/g9-mvp-pc-content-expansion`
- G8 MVP PC Foundation branch: `godot/g8-mvp-pc-foundation`

### Changed
- Updated PROJECT_STATUS.md with G8 and G9 status

## [0.9.0] - 2024-XX-XX

### Godot G9 - MVP PC Content Expansion

**Branch**: `godot/g9-mvp-pc-content-expansion`

#### Added
- **AreaTransition3D.gd/tscn** - Area transition system for hub ↔ external areas
- **CorruptedWolf3D.gd** - Fast melee enemy (low HP, high speed, low damage)
- **OrderSoldier3D.gd** - Human soldier, White Flame Order
- **SkeletonArcherServant3D.gd** - Ranged servant, 20 essence cost
- **QA_G9_MVP_PC_CONTENT_EXPANSION.md** - Manual QA checklist

#### Changed
- **RaiseSkeletonSkill.gd**: Added try_raise_archer() for Shift+R
- **PlayerController3D.gd**: Added Shift+R for archer summon
- **BossRavanPrototype3D.gd**: Phase 2 at 50% HP, 25% damage increase, Sacred Fury message

#### New Controls
- R: Reanimar esqueleto soldado (15 essencia)
- Shift+R: Reanimar esqueleto arqueiro (20 essencia)
- 1/2/3: FOLLOW/ATTACK/RECALL
- E: Interagir/viajar

#### Outside Scope
- Full region/world streaming
- Inventory/equipment
- Multiple dungeons

## [0.8.0] - 2024-XX-XX

### Godot G8 - MVP PC Foundation

**Branch**: `godot/g8-mvp-pc-foundation`

#### Added
- **MainMenu.tscn** - Initial menu scene with buttons:
  - Novo Jogo (starts fresh in hub)
  - Continuar (loads save if exists)
  - Configuracoes (opens settings)
  - Sair (quits game)
- **MainMenu.gd** - MainMenu script handling menu flow
- **PauseMenu.tscn** - Pause menu scene with:
  - Continuar
  - Salvar
  - Carregar
  - Voltar ao Menu
  - Sair
- **PauseMenu.gd** - PauseMenu script with save/load logic
- **SettingsMenu.tscn** - Settings menu with:
  - Mouse sensitivity slider
  - Master volume slider  
  - Quality dropdown (Low/Medium/High)
  - Fullscreen toggle
- **SettingsMenu.gd** - Settings persistence to `user://n3r_settings.json`
- **SimpleSaveManager.gd** - Enhanced save system with:
  - Save version tracking (v1)
  - Timestamp
  - Last scene tracking
  - Player level/XP/essence
  - Quest state
  - Validation on load
  - Fallback to hub if save incomplete
- **BUILD_WINDOWS.md** - Windows export documentation
- **QA_G8_MVP_PC_FOUNDATION.md** - Manual QA checklist
- **Hub labels** - Label3D for Mara and dungeon entrance

#### Changed
- **project.godot**: 
  - Changed `run/main_scene` to `res://scenes/ui/MainMenu.tscn`
  - Added `SimpleSaveManager` as autoload
- **PlayerController3D.gd**: 
  - Modified Esc to toggle pause menu
  - Added pause menu instantiation logic
  - Mouse mode handling for pause menu
- **godot/README.md**: Updated with G8 documentation
- **PROJECT_STATUS.md**: Updated G8 status and completed G7

#### Systems Delivered
- Menu initial flow
- Pause menu during gameplay  
- Settings persistence
- Save/load with versioning
- Export ready for Windows

#### Compatible Scenes
- Hub_VeyrholdOutskirts.tscn (hub)
- PrototypeArena3D.tscn (laboratory)
- MiniDungeon_CryptOfVeyrfall.tscn (dungeon)
- BossRavanPrototype3D.tscn (boss)

#### Known Risks
- Save system is basic (single slot)
- Settings menu is placeholder quality
- No inventory system yet

#### Outside Scope (Not Implemented)
- Full inventory system
- Equipment/gear
- World open region
- Factions/reputation
- Multiple save slots

## [0.7.0] - 2024-XX-XX

### Godot G7 - Vertical Slice Prototype

**Branch**: `godot/g7-vertical-slice-prototype`

#### Added
- Hub_VeyrholdOutskirts.tscn with Mara NPC
- MiniDungeon_CryptOfVeyrfall.tscn (3 rooms, gates, boss)
- QuestManager3D.gd for main quest
- NPCInteractable3D.gd for NPC interaction
- BossRavanPrototype3D.tscn (incomplete)
- Dungeon flow: hub → crypt → boss → reward → hub
- Vertical slice playable end-to-end

## [0.6.0] - 2024-XX-XX

### Godot G6 - Mini Dungeon

**Branch**: `godot/g6-mini-dungeon`

#### Added
- MiniDungeon_CryptOfVeyrfall.tscn (prototype)
- DungeonEntrance3D.gd / .tscn
- DungeonGate3D.gd / .tscn
- DungeonManager3D.gd for room management
- Basic dungeon flow
- Reward chest

## [0.5.0] - 2024-XX-XX

### Godot G5 - First Arena Loop

**Branch**: `godot/g5-first-arena-loop`

#### Added
- PrototypeArena3D.tscn with waves
- ArenaManager3D.gd for wave management
- SpawnPoint3D.gd for spawning enemies
- ExperienceComponent.gd for XP/level up
- LootDrop3D.gd for loot collection
- Enter to start waves, wave progression

## [0.4.0] - 2024-XX-XX

### Godot G4 - Playable Necromancy

**Branch**: `godot/g4-playable-necromancy`

#### Added
- EssenceComponent.gd for death essence
- RaiseSkeletonSkill.gd for reanimation
- SummonCommandComponent.gd for servo commands
- DamageTransferComponent.gd for damage split
- Complete necromancy loop: kill → essence → corpse → raise → command

## [0.3.4] - 2024-XX-XX

### HTML5/Canvas Legacy

**Status**: Frozen

- Prototype HTML5/Canvas v0.3.4 preserved as legacy
- No new features
- Reference/laboratory only

## Earlier Versions

- G1-G3 Godot foundation progression documented in legacy
