(function () {
  "use strict";

  // Platform detection service
  // Detects web, android, windows, or unknown platform
  // Generates and retrieves persistent deviceId

  var PLATFORM_KEY = "necromante_platform";
  var DEVICE_ID_KEY = "necromante_device_id";

  var PlatformService = {
    platform: null,
    deviceId: null,

    // Detect current platform
    getPlatform: function () {
      if (this.platform) return this.platform;

      var ua = (navigator.userAgent || "").toLowerCase();

      // Check for Capacitor (Android native wrapper)
      if (window.Capacitor) {
        this.platform = "android";
        return this.platform;
      }

      // Check for Tauri (Windows/Linux native wrapper)
      if (window.__TAURI__ || window.tauri) {
        this.platform = "windows";
        return this.platform;
      }

      // Check for Android mobile browser
      if (ua.indexOf("android") !== -1 || ua.indexOf("mobile") !== -1) {
        this.platform = "android";
        return this.platform;
      }

      // Check for iOS
      if (ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1 || ua.indexOf("ios") !== -1) {
        this.platform = "android"; // Treat iOS as mobile
        return this.platform;
      }

      // Check for Windows
      if (ua.indexOf("win") !== -1) {
        this.platform = "windows";
        return this.platform;
      }

      // Check for Mac
      if (ua.indexOf("mac") !== -1) {
        this.platform = "windows"; // Treat Mac as desktop
        return this.platform;
      }

      // Check for Linux
      if (ua.indexOf("linux") !== -1) {
        this.platform = "windows";
        return this.platform;
      }

      // Default to web
      this.platform = "web";
      return this.platform;
    },

    // Get or generate persistent device ID
    getDeviceId: function () {
      if (this.deviceId) return this.deviceId;

      // Try to get from storage first
      try {
        var stored = localStorage.getItem(DEVICE_ID_KEY);
        if (stored) {
          this.deviceId = stored;
          return this.deviceId;
        }
      } catch (e) {
        // Ignore storage errors
      }

      // Generate new device ID
      this.deviceId = this.generateDeviceId();

      // Try to save it
      try {
        localStorage.setItem(DEVICE_ID_KEY, this.deviceId);
      } catch (e) {
        // Ignore storage errors
      }

      return this.deviceId;
    },

    // Generate a unique device ID
    generateDeviceId: function () {
      var timestamp = Date.now().toString(36);
      var random = Math.random().toString(36).substring(2, 10);
      var random2 = Math.random().toString(36).substring(2, 10);
      return "dev_" + timestamp + "_" + random + random2;
    },

    // Check if running on mobile
    isMobile: function () {
      var platform = this.getPlatform();
      return platform === "android";
    },

    // Check if running on desktop
    isDesktop: function () {
      var platform = this.getPlatform();
      return platform === "windows" || platform === "web";
    },

    // Check if running in native wrapper (Capacitor/Tauri)
    isNativeWrapper: function () {
      return !!(window.Capacitor || window.__TAURI__ || window.tauri);
    },

    // Get short device ID for display
    getShortDeviceId: function () {
      var id = this.getDeviceId();
      return id.substring(0, 12);
    },

    // Initialize platform on load
    init: function () {
      this.getPlatform();
      this.getDeviceId();
    }
  };

  // Auto-initialize
  if (typeof window !== "undefined") {
    window.PlatformService = PlatformService;
  }

})();
