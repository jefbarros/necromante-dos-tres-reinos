(function () {
  "use strict";

  // Save Manager
  // Single layer for all save operations
  // Handles save, load, delete, export, import, sync
  // Uses versioned save format with migration support

  var SCHEMA_VERSION = "0.2.3";
  var GAME_VERSION = "0.2.3";

  // Legacy save key from v0.2.2
  var LEGACY_SAVE_KEY = "necromanteTresReinosSaveV02";

  var SaveManager = {
    // Current save data in memory
    currentSave: null,
    
    // Track if save is dirty (needs autosave)
    isDirty: false,
    
    // Autosave timer
    autosaveTimer: null,
    autosaveDelay: 3000, // 3 seconds
    
    // Pending autosave events
    pendingAutosaveEvents: [],

    // Initialize services
    init: function () {
      // Initialize platform service
      if (window.PlatformService) {
        window.PlatformService.init();
      }

      // Initialize auth service
      if (window.AuthService) {
        window.AuthService.init();
      }

      // Initialize cloud service
      if (window.CloudSaveService) {
        window.CloudSaveService.init();
      }

      // Initialize sync manager
      if (window.SyncManager) {
        window.SyncManager.init();
      }

      console.log("SaveManager initialized");
    },

    // Create new save data structure
    createSaveData: function (game) {
      if (!game) return null;

      return {
        schemaVersion: SCHEMA_VERSION,
        gameVersion: GAME_VERSION,
        userId: window.AuthService ? window.AuthService.getCurrentUser().userId : null,
        slotId: "default",
        deviceId: window.PlatformService ? window.PlatformService.getDeviceId() : null,
        platform: window.PlatformService ? window.PlatformService.getPlatform() : "web",
        revision: 1,
        savedAt: Date.now(),
        updatedAt: Date.now(),

        // Game data
        player: {
          level: game.player.level,
          exp: game.player.exp,
          expToNext: game.player.expToNext,
          fragments: game.player.fragments,
          maxHp: game.player.maxHp,
          maxMana: game.player.maxMana,
          necroDomain: game.player.necroDomain,
          x: game.player.x,
          y: game.player.y
        },
        currentMapId: game.currentMapId,
        servants: game.servants.map(function (s) {
          return {
            kind: s.kind,
            level: s.level,
            exp: s.exp,
            hp: Math.max(1, Math.ceil(s.hp)),
            maxHp: s.maxHp,
            damage: s.damage,
            defense: s.defense,
            state: s.state
          };
        }),
        reserveServants: game.reserveServants.map(function (s) {
          return {
            kind: s.kind,
            level: s.level,
            exp: s.exp,
            hp: Math.max(1, Math.ceil(s.hp)),
            maxHp: s.maxHp,
            damage: s.damage,
            defense: s.defense,
            state: s.state
          };
        }),

        // World state
        bossDefeated: game.bossDefeated,
        secretUnlocked: game.secretUnlocked || game.bossDefeated,

        // Items
        inventory: game.inventory,
        equipment: game.equipment,
        equipmentOwned: game.equipmentOwned,

        // Skills
        unlockedSkills: game.unlockedSkills,
        skillPoints: game.skillPoints,

        // Reputation
        reputation: game.reputation,

        // Map state
        mapState: game.mapState,

        // Flags
        tutorialCaptureDone: game.tutorialCaptureDone,
        dragonSignalSeen: game.dragonSignalSeen
      };
    },

    // Save game
    saveGame: function (game, silent) {
      if (!game) return false;

      var data = this.createSaveData(game);

      // Save revision if existing save
      var existing = window.LocalSaveService.loadLocal();
      if (existing && existing.revision) {
        data.revision = existing.revision + 1;
      }

      // Save locally first
      var localResult = window.LocalSaveService.saveLocal(data);

      if (!localResult) {
        game.lastSaveStatus = "Falha ao salvar";
        if (!silent) game.message("Nao foi possível salvar localmente.");
        return false;
      }

      this.currentSave = data;

      // Clear dirty flag after save
      this.isDirty = false;

      // Show success message
      game.lastSaveStatus = "Salvo";
      if (!silent) game.message("Jogo salvo.", true);

      // Try sync if logged in
      this.syncIfLoggedIn(data);

      return true;
    },

    // Load game
    loadGame: function () {
      // First try new format
      var data = window.LocalSaveService.loadLocal();

      // If no new format, try legacy
      if (!data) {
        data = this.loadLegacySave();
      }

      // If still no data, return null
      if (!data) {
        return null;
      }

      // Migrate if needed
      if (data.schemaVersion !== SCHEMA_VERSION) {
        data = this.migrateSave(data);
      }

      this.currentSave = data;
      return data;
    },

    // Load legacy save (v0.2.2 and earlier)
    loadLegacySave: function () {
      try {
        var raw = localStorage.getItem(LEGACY_SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    // Migrate save from older format
    migrateSave: function (oldSave) {
      if (!oldSave) return null;

      var newSave = {
        schemaVersion: SCHEMA_VERSION,
        gameVersion: oldSave.version || oldSave.gameVersion || GAME_VERSION,
        userId: null,
        slotId: "default",
        deviceId: window.PlatformService ? window.PlatformService.getDeviceId() : null,
        platform: "web",
        revision: 1,
        savedAt: oldSave.savedAt || Date.now(),
        updatedAt: Date.now(),

        // Player
        player: {
          level: oldSave.player ? oldSave.player.level : 1,
          exp: oldSave.player ? oldSave.player.exp : 0,
          expToNext: oldSave.player ? oldSave.player.expToNext : 100,
          fragments: oldSave.player ? oldSave.player.fragments : 0,
          maxHp: oldSave.player ? oldSave.player.maxHp : 130,
          maxMana: oldSave.player ? oldSave.player.maxMana : 100,
          necroDomain: oldSave.player ? oldSave.player.necroDomain : 1,
          x: oldSave.player ? oldSave.player.x : 5.5,
          y: oldSave.player ? oldSave.player.y : 5.2
        },

        currentMapId: oldSave.currentMapId || "cripta_inicial",
        servants: oldSave.servants || [],
        reserveServants: oldSave.reserveServants || [],
        bossDefeated: oldSave.bossDefeated || false,
        secretUnlocked: oldSave.secretUnlocked || false,
        inventory: oldSave.inventory || {},
        equipment: oldSave.equipment || {},
        equipmentOwned: oldSave.equipmentOwned || {},
        unlockedSkills: oldSave.unlockedSkills || {},
        skillPoints: oldSave.skillPoints || 0,
        reputation: oldSave.reputation || {},
        mapState: oldSave.mapState || {},
        tutorialCaptureDone: oldSave.tutorialCaptureDone || false,
        dragonSignalSeen: oldSave.dragonSignalSeen || false
      };

      // Handle legacy mapState formats
      if (oldSave.bossDefeated) {
        if (!newSave.mapState.cemiterio_neutro) {
          newSave.mapState.cemiterio_neutro = {};
        }
        newSave.mapState.cemiterio_neutro.bossDefeated = true;
        newSave.mapState.cemiterio_neutro.secretUnlocked = true;
        newSave.mapState.cemiterio_neutro.portalsUnlocked = {
          cemiterio_para_secreta: true
        };
      }

      if (oldSave.dragonSignalSeen) {
        if (!newSave.mapState.area_secreta_cripta) {
          newSave.mapState.area_secreta_cripta = {};
        }
        newSave.mapState.area_secreta_cripta.dragonScaleCollected = true;
        newSave.mapState.area_secreta_cripta.events = {
          escama_draconica_rachada: true
        };
      }

      console.log("Save migrated from", oldSave.version || oldSave.schemaVersion || "legacy", "to", SCHEMA_VERSION);

      return newSave;
    },

    // Delete local save
    deleteLocalSave: function () {
      var result = window.LocalSaveService.deleteLocal();
      this.currentSave = null;
      return result;
    },

    // Export save as JSON
    exportSave: function () {
      var data = this.currentSave || window.LocalSaveService.loadLocal();
      if (!data) return null;
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return null;
      }
    },

    // Import save from JSON
    importSave: function (jsonString) {
      if (!jsonString) return null;
      try {
        var data = JSON.parse(jsonString);

        // Validate basic structure
        if (!data.player && !data.schemaVersion && !data.version) {
          console.warn("Invalid save format");
          return null;
        }

        // Migrate if needed
        if (data.schemaVersion !== SCHEMA_VERSION) {
          data = this.migrateSave(data);
        }

        return data;
      } catch (e) {
        console.error("Import failed:", e);
        return null;
      }
    },

    // Apply imported save
    applyImportedSave: function (data) {
      if (!data) return false;

      // Save locally
      var result = window.LocalSaveService.saveLocal(data);
      if (result) {
        this.currentSave = data;
        this.isDirty = false;
        return true;
      }
      return false;
    },

    // Check if has local save
    hasLocalSave: function () {
      return window.LocalSaveService.hasLocalSave();
    },

    // Sync if logged in
    syncIfLoggedIn: function (saveData) {
      if (!window.AuthService || !window.AuthService.isLoggedIn()) {
        return;
      }

      if (!window.SyncManager) {
        return;
      }

      // Check if online
      if (!window.SyncManager.isOnline()) {
        window.SyncManager.queueSync();
        return;
      }

      // Start sync
      window.SyncManager.syncNow(saveData);
    },

    // Mark save as dirty (for autosave)
    markDirty: function () {
      this.isDirty = true;

      // Cancel existing timer
      if (this.autosaveTimer) {
        clearTimeout(this.autosaveTimer);
      }

      // Schedule autosave
      var self = this;
      this.autosaveTimer = setTimeout(function () {
        if (self.isDirty && window.NecromancerGameInstance) {
          self.saveGame(window.NecromancerGameInstance, true);
        }
      }, this.autosaveDelay);
    },

    // Get current save for sync
    getCurrentSave: function () {
      return this.currentSave;
    },

    // Queue autosave event
    queueAutosaveEvent: function (eventType) {
      if (!this.pendingAutosaveEvents.includes(eventType)) {
        this.pendingAutosaveEvents.push(eventType);
      }
      this.markDirty();
    },

    // Get platform info for display
    getPlatformInfo: function () {
      return window.PlatformService ? window.PlatformService.getPlatform() : "web";
    },

    // Get device short ID
    getShortDeviceId: function () {
      return window.PlatformService ? window.PlatformService.getShortDeviceId() : "N/A";
    },

    // Get sync status info
    getSyncStatusInfo: function () {
      if (!window.SyncManager) {
        return { status: "local", label: "Local" };
      }

      var status = window.SyncManager.getSyncStatus();
      var label = window.SyncManager.getStatusLabel();

      // Override label based on auth state
      if (window.AuthService) {
        if (!window.AuthService.isLoggedIn()) {
          label = "Local";
        }
      }

      return {
        status: status.status,
        label: label,
        hasConflict: status.hasConflict
      };
    }
  };

  // Expose to window
  if (typeof window !== "undefined") {
    window.SaveManager = SaveManager;
  }

})();
