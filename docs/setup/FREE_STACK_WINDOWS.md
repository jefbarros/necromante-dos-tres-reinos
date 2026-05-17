# Free Stack On Windows

This project uses only free tooling.

## Git And GitHub

Used for branches, pull requests, tags, reviews and release history.

```powershell
winget install -e --id Git.Git
```

Check:

```powershell
where git
```

## VS Code

Used for GDScript, documentation and repository maintenance.

```powershell
winget install -e --id Microsoft.VisualStudioCode
```

Check:

```powershell
where code
```

## Godot 4.x

Engine target for the game. Open `godot/project.godot`; the main scene is `res://scenes/ui/MainMenu.tscn`.

```powershell
winget install -e --id GodotEngine.GodotEngine
```

Check:

```powershell
where godot
godot --headless --path godot --quit
```

## Blender

Used for 3D source models, proxy meshes, rigs and animation sources stored under `godot/assets/source/blender/`.

```powershell
winget install -e --id BlenderFoundation.Blender
```

Check:

```powershell
where blender
```

## Krita

Used for 2D art, UI source files, portraits and texture paint sources stored under `godot/assets/source/krita/`.

```powershell
winget install -e --id KDE.Krita
```

Check:

```powershell
where krita
```

## Audacity

Used for sound cleanup, trimming and export sources stored under `godot/assets/source/audacity/`.

```powershell
winget install -e --id Audacity.Audacity
```

Check:

```powershell
where audacity
```

## LMMS

Used for music loops and track sources stored under `godot/assets/source/lmms/`.

```powershell
winget install -e --id LMMS.LMMS
```

Check:

```powershell
where lmms
```

## Kenney Assets

Kenney assets are preferred placeholders when license-compatible, ideally CC0. Store them under `godot/assets/third_party/kenney/` and include:

- `LICENSE.md`
- `SOURCE.md`

Do not add assets without clear license provenance.

## Current PATH Check

Last audit result:

- `git`: found
- `code`: found
- `godot`: found
- `blender`: not found in PATH
- `krita`: not found in PATH
- `audacity`: not found in PATH
- `lmms`: not found in PATH
