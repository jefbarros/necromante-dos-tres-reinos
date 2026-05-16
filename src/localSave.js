(function () {
  "use strict";

  // Local Save Service
  // Uses localStorage for local persistence
  // Encapsulated to allow future swap to IndexedDB

  var LOCAL_SAVE_KEY = "necromante_local_save";
  var SCHEMA_VERSION = "0.2.8";

  var LocalSaveService = {

    // Save data to local storage
    saveLocal: function (data) {
      if (!data) return false;
      try {
        // Add timestamp
        data.savedAt = Date.now();
        data.schemaVersion = SCHEMA_VERSION;
        localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error("Local save failed:", error);
        return false;
      }
    },

    // Load data from local storage
    loadLocal: function () {
      try {
        var raw = localStorage.getItem(LOCAL_SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (error) {
        console.error("Local load failed:", error);
        return null;
      }
    },

    // Delete local save
    deleteLocal: function () {
      try {
        localStorage.removeItem(LOCAL_SAVE_KEY);
        return true;
      } catch (error) {
        console.error("Local delete failed:", error);
        return false;
      }
    },

    // Check if local save exists
    hasLocalSave: function () {
      try {
        return !!localStorage.getItem(LOCAL_SAVE_KEY);
      } catch (error) {
        return false;
      }
    },

    // Export local save as JSON string
    exportLocalSave: function () {
      var data = this.loadLocal();
      if (!data) return null;
      try {
        return JSON.stringify(data, null, 2);
      } catch (error) {
        return null;
      }
    },

    // Import save from JSON string
    importLocalSave: function (jsonString) {
      if (!jsonString) return null;
      try {
        var data = JSON.parse(jsonString);
        // Validate schema version exists
        if (!data.schemaVersion && !data.version) {
          console.warn("Imported data has no schema version");
        }
        return data;
      } catch (error) {
        console.error("Import failed:", error);
        return null;
      }
    },

    // Get metadata without full data
    getLocalSaveMetadata: function () {
      var data = this.loadLocal();
      if (!data) return null;
      return {
        schemaVersion: data.schemaVersion,
        gameVersion: data.gameVersion,
        revision: data.revision,
        updatedAt: data.updatedAt || data.savedAt,
        playerLevel: data.player ? data.player.level : null,
        currentMapId: data.currentMapId,
        fragments: data.player ? data.player.fragments : 0,
        activeServants: Array.isArray(data.servants) ? data.servants.length : 0,
        reserveServants: Array.isArray(data.reserveServants) ? data.reserveServants.length : 0,
        platform: data.platform,
        playerName: "Jogador"
      };
    }
  };

  // Expose to window
  if (typeof window !== "undefined") {
    window.LocalSaveService = LocalSaveService;
  }

})();
