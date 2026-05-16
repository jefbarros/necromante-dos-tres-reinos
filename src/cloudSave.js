(function () {
  "use strict";

  // Cloud Save Service
  // Uses Firebase Firestore when configured, otherwise falls back to mock
  // Mock mode uses separate localStorage key to simulate cloud behavior

  var MOCK_CLOUD_KEY = "necromante_cloud_save";
  var USE_MOCK_KEY = "necromante_use_mock";

  var CloudSaveService = {
    // Mode: "mockCloud" or "firebase"
    mode: "mockCloud",
    initialized: false,

    // Initialize the service
    init: function () {
      if (this.initialized) return;

      // Check if firebaseConfig.local.js exists
      if (typeof window !== "undefined" && window.firebaseConfig && window.firebaseConfig.apiKey) {
        this.mode = "firebase";
        this.initFirebase();
      } else {
        this.mode = "mockCloud";
      }

      this.initialized = true;
    },

    // Initialize Firebase (placeholder for future)
    initFirebase: function () {
      // Placeholder for Firebase Firestore initialization
      // Will be implemented when firebaseConfig.local.js is added
      console.log("CloudSave: Firebase mode ready");
    },

    // Check if using mock mode
    isMockMode: function () {
      return this.mode === "mockCloud";
    },

    // Upload save to cloud
    uploadSave: function (userId, saveData) {
      if (!userId || !saveData) {
        return Promise.resolve({ success: false, error: "Invalid parameters" });
      }

      // Add cloud metadata
      saveData.cloudUserId = userId;
      saveData.cloudUploadedAt = Date.now();

      var self = this;

      if (this.mode === "mockCloud") {
        return this.mockUpload(userId, saveData);
      } else {
        return this.firebaseUpload(userId, saveData);
      }
    },

    // Mock upload using localStorage
    mockUpload: function (userId, data) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          try {
            // Store in separate key with userId prefix
            var key = MOCK_CLOUD_KEY + "_" + userId;
            localStorage.setItem(key, JSON.stringify(data));
            resolve({ success: true });
          } catch (error) {
            resolve({ success: false, error: error.message });
          }
        }, 300); // Simulate network delay
      });
    },

    // Firebase upload (placeholder)
    firebaseUpload: function (userId, data) {
      // Placeholder - will be implemented with Firebase Firestore
      console.log("Firebase upload for user:", userId);
      return Promise.resolve({ success: false, error: "Not implemented" });
    },

    // Download save from cloud
    downloadSave: function (userId) {
      if (!userId) {
        return Promise.resolve({ success: false, error: "No userId" });
      }

      if (this.mode === "mockCloud") {
        return this.mockDownload(userId);
      } else {
        return this.firebaseDownload(userId);
      }
    },

    // Mock download using localStorage
    mockDownload: function (userId) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          try {
            var key = MOCK_CLOUD_KEY + "_" + userId;
            var raw = localStorage.getItem(key);
            if (!raw) {
              resolve({ success: false, error: "No cloud save found" });
              return;
            }
            var data = JSON.parse(raw);
            resolve({ success: true, data: data });
          } catch (error) {
            resolve({ success: false, error: error.message });
          }
        }, 300);
      });
    },

    // Firebase download (placeholder)
    firebaseDownload: function (userId) {
      // Placeholder
      console.log("Firebase download for user:", userId);
      return Promise.resolve({ success: false, error: "Not implemented" });
    },

    // Delete cloud save
    deleteCloudSave: function (userId) {
      if (!userId) {
        return Promise.resolve({ success: false, error: "No userId" });
      }

      if (this.mode === "mockCloud") {
        return this.mockDelete(userId);
      } else {
        return this.firebaseDelete(userId);
      }
    },

    // Mock delete
    mockDelete: function (userId) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          try {
            var key = MOCK_CLOUD_KEY + "_" + userId;
            localStorage.removeItem(key);
            resolve({ success: true });
          } catch (error) {
            resolve({ success: false, error: error.message });
          }
        }, 200);
      });
    },

    // Firebase delete (placeholder)
    firebaseDelete: function (userId) {
      return Promise.resolve({ success: false, error: "Not implemented" });
    },

    // Check if cloud save exists for user
    hasCloudSave: function (userId) {
      if (!userId) return false;

      if (this.mode === "mockCloud") {
        var key = MOCK_CLOUD_KEY + "_" + userId;
        return !!localStorage.getItem(key);
      } else {
        // Placeholder for Firebase check
        return false;
      }
    },

    // Get cloud save metadata
    getCloudSaveMetadata: function (userId) {
      if (!userId) return null;

      if (this.mode === "mockCloud") {
        var key = MOCK_CLOUD_KEY + "_" + userId;
        var raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
          var data = JSON.parse(raw);
          return {
            schemaVersion: data.schemaVersion,
            gameVersion: data.gameVersion,
            revision: data.revision,
            updatedAt: data.cloudUploadedAt || data.savedAt,
            playerLevel: data.player ? data.player.level : null,
            currentMapId: data.currentMapId,
            platform: data.platform
          };
        } catch (error) {
          return null;
        }
      } else {
        return null; // Placeholder
      }
    }
  };

  // Expose to window
  if (typeof window !== "undefined") {
    window.CloudSaveService = CloudSaveService;
  }

})();
