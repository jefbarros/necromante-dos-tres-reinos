(function () {
  "use strict";

  // Sync Manager
  // Handles synchronization between local and cloud saves
  // Rules:
  // - If not logged in, save only local
  // - If logged in and online, save local then upload to cloud
  // - If offline, save local and mark sync pending
  // - When back online, auto-sync
  // - Use revision and updatedAt to compare saves

  var SyncStatus = {
    IDLE: "idle",
    SYNCING: "syncing",
    PENDING: "pending",
    OFFLINE: "offline",
    CONFLICT: "conflict",
    ERROR: "error"
  };

  var SyncManager = {
    // Current sync status
    status: SyncStatus.IDLE,
    lastSyncAt: null,
    pendingSync: false,
    lastError: null,
    pendingConflict: null,

    // Sync now
    syncNow: function (localSave) {
      var self = this;

      // Check if logged in
      if (!window.AuthService || !window.AuthService.isLoggedIn()) {
        this.status = SyncStatus.IDLE;
        return Promise.resolve({ success: true, reason: "Not logged in, sync skipped" });
      }

      var userId = window.AuthService.getCurrentUser().userId;
      if (!userId) {
        return Promise.resolve({ success: true, reason: "No user ID" });
      }

      this.status = SyncStatus.SYNCING;

      // Get cloud save for comparison
      return window.CloudSaveService.downloadSave(userId).then(function (result) {
        if (!result.success) {
          // No cloud save, upload local
          return self.uploadLocal(localSave, userId);
        }

        var cloudSave = result.data;

        // Compare saves
        var comparison = self.compareSaves(localSave, cloudSave);

        if (comparison.conflict) {
          self.status = SyncStatus.CONFLICT;
          self.pendingConflict = {
            local: localSave,
            cloud: cloudSave,
            comparison: comparison
          };
          return {
            success: false,
            conflict: true,
            local: localSave,
            cloud: cloudSave
          };
        }

        if (comparison.localNewer || comparison.tieLocalNewer) {
          // Local is newer or tie, upload
          return self.uploadLocal(localSave, userId);
        } else {
          // Cloud is newer, download
          return self.downloadCloud(userId);
        }
      }).catch(function (error) {
        self.status = SyncStatus.ERROR;
        self.lastError = error.message;
        return { success: false, error: error.message };
      });
    },

    // Upload local save to cloud
    uploadLocal: function (localSave, userId) {
      var self = this;
      var dataToUpload = JSON.parse(JSON.stringify(localSave));

      // Add revision
      dataToUpload.revision = (localSave.revision || 0) + 1;
      dataToUpload.updatedAt = Date.now();
      dataToUpload.platform = window.PlatformService ? window.PlatformService.getPlatform() : "web";
      dataToUpload.deviceId = window.PlatformService ? window.PlatformService.getDeviceId() : null;

      return window.CloudSaveService.uploadSave(userId, dataToUpload).then(function (result) {
        if (result.success) {
          self.status = SyncStatus.IDLE;
          self.lastSyncAt = Date.now();
          self.pendingSync = false;
        } else {
          self.status = SyncStatus.ERROR;
          self.lastError = result.error;
        }
        return result;
      });
    },

    // Download cloud save
    downloadCloud: function (userId) {
      var self = this;
      return window.CloudSaveService.downloadSave(userId).then(function (result) {
        if (result.success) {
          self.status = SyncStatus.IDLE;
          self.lastSyncAt = Date.now();
          self.pendingSync = false;
          return {
            success: true,
            action: "download",
            data: result.data
          };
        } else {
          self.status = SyncStatus.ERROR;
          self.lastError = result.error;
          return result;
        }
      });
    },

    // Queue sync for later
    queueSync: function () {
      this.pendingSync = true;
      this.status = SyncStatus.PENDING;
    },

    // Resolve conflict with choice
    resolveConflict: function (choice) {
      // choice: "local" or "cloud"
      var self = this;

      if (!this.pendingConflict) {
        return Promise.resolve({ success: false, error: "No pending conflict" });
      }

      var userId = window.AuthService.getCurrentUser().userId;

      if (choice === "local") {
        // Use local save
        return this.uploadLocal(this.pendingConflict.local, userId).then(function (result) {
          self.pendingConflict = null;
          self.status = SyncStatus.IDLE;
          return result;
        });
      } else if (choice === "cloud") {
        // Use cloud save
        return this.downloadCloud(userId).then(function (result) {
          self.pendingConflict = null;
          self.status = SyncStatus.IDLE;
          return result;
        });
      } else {
        // Cancel
        self.pendingConflict = null;
        self.status = SyncStatus.IDLE;
        return Promise.resolve({ success: true, cancelled: true });
      }
    },

    // Compare two saves
    compareSaves: function (localSave, cloudSave) {
      if (!localSave && !cloudSave) {
        return { tie: true };
      }
      if (!localSave) {
        return { cloudNewer: true };
      }
      if (!cloudSave) {
        return { localNewer: true };
      }

      var localRevision = localSave.revision || 0;
      var cloudRevision = cloudSave.revision || 0;
      var localUpdated = localSave.updatedAt || localSave.savedAt || 0;
      var cloudUpdated = cloudSave.updatedAt || cloudSave.cloudUploadedAt || 0;
      var localPlatform = localSave.platform;
      var cloudPlatform = cloudSave.platform;

      // Compare by revision first
      if (localRevision > cloudRevision) {
        return { localNewer: true };
      }
      if (cloudRevision > localRevision) {
        return { cloudNewer: true };
      }

      // Tie on revision, compare by timestamp
      if (localUpdated > cloudUpdated) {
        return { tieLocalNewer: true };
      }
      if (cloudUpdated > localUpdated) {
        return { tieCloudNewer: true };
      }

      // Both same, check for potential device conflict
      if (localPlatform && cloudPlatform && localPlatform !== cloudPlatform) {
        return { tie: true, differentPlatform: true };
      }

      return { tie: true };
    },

    // Mark as dirty (needs save)
    markDirty: function () {
      this.queueSync();
    },

    // Get sync status
    getSyncStatus: function () {
      return {
        status: this.status,
        lastSyncAt: this.lastSyncAt,
        pendingSync: this.pendingSync,
        hasConflict: !!this.pendingConflict
      };
    },

    // Get status label
    getStatusLabel: function () {
      switch (this.status) {
        case SyncStatus.IDLE:
          return "OK";
        case SyncStatus.SYNCING:
          return "Sincronizando";
        case SyncStatus.PENDING:
          return "Pendente";
        case SyncStatus.OFFLINE:
          return "Offline";
        case SyncStatus.CONFLITO:
          return "Conflito";
        case SyncStatus.ERROR:
          return "Erro";
        default:
          return "Local";
      }
    },

    // Check if online
    isOnline: function () {
      return navigator && navigator.onLine !== false;
    },

    // Handle online/offline events
    setupNetworkListeners: function () {
      var self = this;

      window.addEventListener("online", function () {
        window.AuthService.setOnline();
        if (self.pendingSync) {
          self.syncNow(window.SaveManager ? window.SaveManager.getCurrentSave() : null);
        }
      });

      window.addEventListener("offline", function () {
        window.AuthService.setOffline();
        self.status = SyncStatus.OFFLINE;
      });
    },

    // Initialize
    init: function () {
      this.status = this.isOnline() ? SyncStatus.IDLE : SyncStatus.OFFLINE;
      this.setupNetworkListeners();
    }
  };

  // Expose to window
  if (typeof window !== "undefined") {
    window.SyncManager = SyncManager;
    window.SyncStatus = SyncStatus;
  }

})();
