(function () {
  "use strict";

  // Auth Service
  // Handles player authentication
  // Mock mode initially, structure ready for Firebase

  var AUTH_DATA_KEY = "necromante_auth_data";

  // Auth states
  var AuthState = {
    GUEST: "guest",
    LOGGED_IN: "loggedIn",
    OFFLINE: "offline",
    ERROR: "error"
  };

  var AuthService = {
    // Current state
    state: AuthState.GUEST,
    currentUser: null,
    lastError: null,

    // Get current user info
    getCurrentUser: function () {
      return this.currentUser;
    },

    // Sign in with email and password (mock)
    signInWithEmail: function (email, password) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          // Simple mock validation
          if (!email || !password) {
            self.state = AuthState.ERROR;
            self.lastError = "Email e senha sao obrigatorios";
            resolve({ success: false, error: self.lastError });
            return;
          }

          if (password.length < 4) {
            self.state = AuthState.ERROR;
            self.lastError = "Senha deve ter pelo menos 4 caracteres";
            resolve({ success: false, error: self.lastError });
            return;
          }

          // Mock successful login
          var userId = "user_" + btoa(email).substring(0, 16);
          self.currentUser = {
            userId: userId,
            email: email,
            createdAt: Date.now()
          };
          self.state = AuthState.LOGGED_IN;
          self.lastError = null;

          // Save auth data
          self.saveAuthData();

          resolve({ success: true, user: self.currentUser });
        }, 400); // Simulate network
      });
    },

    // Sign up with email and password (mock)
    signUpWithEmail: function (email, password) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          if (!email || !password) {
            self.state = AuthState.ERROR;
            self.lastError = "Email e senha sao obrigatorios";
            resolve({ success: false, error: self.lastError });
            return;
          }

          if (password.length < 4) {
            self.state = AuthState.ERROR;
            self.lastError = "Senha deve ter pelo menos 4 caracteres";
            resolve({ success: false, error: self.lastError });
            return;
          }

          // Check for @ in email
          if (email.indexOf("@") === -1) {
            self.state = AuthState.ERROR;
            self.lastError = "Email invalido";
            resolve({ success: false, error: self.lastError });
            return;
          }

          // Create mock account
          var userId = "user_" + btoa(email).substring(0, 16);
          self.currentUser = {
            userId: userId,
            email: email,
            createdAt: Date.now()
          };
          self.state = AuthState.LOGGED_IN;
          self.lastError = null;

          // Save auth data
          self.saveAuthData();

          resolve({ success: true, user: self.currentUser });
        }, 400);
      });
    },

    // Sign out
    signOut: function () {
      this.currentUser = null;
      this.state = AuthState.GUEST;
      this.lastError = null;
      this.clearAuthData();
      return Promise.resolve({ success: true });
    },

    // Check if logged in
    isLoggedIn: function () {
      return this.state === AuthState.LOGGED_IN && this.currentUser !== null;
    },

    // Link guest save to account (placeholder)
    linkGuestSaveToAccount: function () {
      // Placeholder for linking guest progress to account
      return Promise.resolve({ success: true });
    },

    // Restore session from storage
    restoreSession: function () {
      var data = this.loadAuthData();
      if (data && data.user) {
        this.currentUser = data.user;
        this.state = AuthState.LOGGED_IN;
      } else {
        this.state = AuthState.GUEST;
      }
    },

    // Set offline state
    setOffline: function () {
      if (this.state === AuthState.LOGGED_IN) {
        this.state = AuthState.OFFLINE;
      }
    },

    // Set online state
    setOnline: function () {
      if (this.state === AuthState.OFFLINE) {
        this.state = AuthState.LOGGED_IN;
      }
    },

    // Get state label
    getStateLabel: function () {
      switch (this.state) {
        case AuthState.GUEST:
          return "Convidado";
        case AuthState.LOGGED_IN:
          return "Logado";
        case AuthState.OFFLINE:
          return "Offline";
        case AuthState.ERROR:
          return "Erro";
        default:
          return "Desconhecido";
      }
    },

    // Save auth data
    saveAuthData: function () {
      try {
        var data = {
          user: this.currentUser,
          savedAt: Date.now()
        };
        localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn("Could not save auth data:", e);
      }
    },

    // Load auth data
    loadAuthData: function () {
      try {
        var raw = localStorage.getItem(AUTH_DATA_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    // Clear auth data
    clearAuthData: function () {
      try {
        localStorage.removeItem(AUTH_DATA_KEY);
      } catch (e) {
        // Ignore
      }
    },

    // Initialize
    init: function () {
      this.restoreSession();
    }
  };

  // Expose to window
  if (typeof window !== "undefined") {
    window.AuthService = AuthService;
    window.AuthState = AuthState;
  }

})();
