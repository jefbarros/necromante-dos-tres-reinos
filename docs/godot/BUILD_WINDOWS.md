# Build Windows - G8 MVP PC Foundation

## Windows Export Guide

### Prerequisites

- Godot 4.6.x (4.6.2 recommended)
- Windows 10/11

### Export Steps

1. Open the Godot project in `godot/`
2. Go to **Project > Export**
3. Click **Add...** and select **Windows**
4. Configure the export preset:

```
Name: Necromante dos Tres Reinos
Executable Name: n3r_mvp_pc
Project Export Path: ./build/n3r_mvp_pc.exe
```

5. Click **Export Project**

### Export Settings Used

- **Renderer**: Compatibility (GL Compatibility)
- **Export Mode**: Regular
- **Thread Support**: Disabled (for wider compatibility)
- **VRAM Compression**: Enabled

### Build Output

The exported executable will be at:
```
godot/build/n3r_mvp_pc.exe
```

### Running the Build

1. Navigate to `godot/build/`
2. Run `n3r_mvp_pc.exe`
3. The game should launch with the Main Menu

### Save Location

Saves are stored at:
```
%APPDATA%/Godot/app_userdata/Necromante dos Tres Reinos - Godot G4.0/n3r_prototype_save.json
```

Settings are stored at:
```
%APPDATA%/Godot/app_userdata/Necromante dos Tres Reinos - Godot G4.0/n3r_settings.json
```

### Known Issues

- Some anti-virus software may flag the exe as suspicious
- Requires Windows 10 or later
- Desktop resolution recommended: 1280x720 or higher

### Performance Targets

- **Target FPS**: 60
- **Minimum FPS**: 30
- **Resolution**: 1080p recommended
- **Active Agents**: Max 15-25 in combat
