# TODO - v0.2.3 - COMPLETO

## 1. Sistema de Save Separado
- [x] Criar src/saveManager.js - Camada única de save
- [x] Criar src/localSave.js - Save local com localStorage
- [x] Criar src/cloudSave.js - Save em nuvem (mock)
- [x] Criar src/auth.js - Serviço de autenticação
- [x] Criar src/platform.js - Detecção de plataforma
- [x] Criar src/syncManager.js - Sincronização

## 2. Modelo de Save Versionado
- [x] Definir schemaVersion
- [x] Criar migrateSave(oldSave) para compatibilidade

## 3. Firebase Config
- [x] Criar src/firebaseConfig.example.js
- [x] Adicionar firebaseConfig.local.js ao .gitignore

## 4. Telas UI
- [x] Tela de Conta
- [ ] Tela de Conflito de Save (simplificado via console)
- [x] Indicador de Sync na HUD

## 5. Autosave
- [x] Implementar debounce
- [x] Eventos que marcam savedirty

## 6. package.json
- [x] Criar package.json com scripts

## 7. README
- [x] Atualizar com nova arquitetura híbrida
- [x] Instruções Capacitor/Android
- [x] Instruções Tauri/Windows

## 8. Integração com game.js
- [x] Migrar saveGame/loadGame/deleteSave para SaveManager

## Verificações Realizadas
- [x] node --check src/platform.js ✓
- [x] node --check src/localSave.js ✓
- [x] node --check src/cloudSave.js ✓
- [x] node --check src/auth.js ✓
- [x] node --check src/syncManager.js ✓
- [x] node --check src/saveManager.js ✓
- [x] node --check src/config.js ✓
- [x] node --check src/game.js ✓
- [x] node --check src/ui.js ✓
