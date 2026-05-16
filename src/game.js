(function () {
  "use strict";

var cfg = window.GameConfig;

  // Constant for max active servants
  var MAX_ACTIVE_SERVANTS = 3;
  var HP_REGEN_BASE = 0.01; // 1% per second
  var MANA_REGEN_BASE = 0.02; // 2% per second
  var SAFE_ZONE_REGEN = 3; // 3x regen in safe zones
  var INITIAL_OBJECTIVE_VERSION = "0.2.8";
  var INITIAL_OBJECTIVE_STEPS = [
    {
      id: "awakenCrypt",
      title: "Despertar na Cripta Inicial",
      hint: "Reconheca a cripta antes de atravessar o limiar."
    },
    {
      id: "touchFuneralThrone",
      title: "Tocar o Trono Funerario",
      hint: "Interaja com o trono ou altar que responde a sua coroa fria."
    },
    {
      id: "reachNeutralCemetery",
      title: "Ir ao Cemiterio Neutro",
      hint: "Use o portal da cripta para encontrar almas fracas."
    },
    {
      id: "defeatBasicEnemies",
      title: "Derrotar inimigos basicos",
      hint: "Abata criaturas menores no cemiterio.",
      target: 2
    },
    {
      id: "captureFirstSoul",
      title: "Capturar a primeira alma",
      hint: "Aproxime-se de uma alma e use Capturar."
    },
    {
      id: "defeatTombGuardian",
      title: "Derrotar o Guardiao de Tumba",
      hint: "Enfrente o guardiao na arena tumular."
    },
    {
      id: "unlockSecretArea",
      title: "Desbloquear a Area Secreta",
      hint: "A queda do guardiao rompe o selo antigo."
    },
    {
      id: "initialLoopComplete",
      title: "Ciclo inicial estabilizado",
      hint: "A Area Secreta esta aberta para exploracao."
    }
  ];

  function norm(x, y) {
    var len = Math.hypot(x, y);
    if (len <= 0.001) return { x: 1, y: 0 };
    return { x: x / len, y: y / len };
  }

window.NecromancerGame = function NecromancerGame(canvas, input) {
    // Initialize services
    if (window.SaveManager) {
      window.SaveManager.init();
    }

    // Store reference for autosave
    window.NecromancerGameInstance = this;

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.input = input;
    this.saveKey = "necromanteTresReinosSaveV02";
    this.map = new window.GameMap();
    this.currentMapId = this.map.currentId;
    this.mapState = this.createDefaultMapState();
    var initialSpawn = this.map.getSpawn("default");
    this.player = new window.Player(initialSpawn.x, initialSpawn.y);
    this.player.baseNecroDomain = this.player.necroDomain;
    this.enemies = [];
    this.servants = [];
    this.reserveServants = [];
    this.inventory = this.defaultInventory();
    this.equipmentOwned = {
      crackedStaff: true,
      boneGrimoire: true,
      cryptRing: true
    };
    this.equipment = {
      weapon: "crackedStaff",
      tome: "boneGrimoire",
      ring: "cryptRing"
    };
    this.reputation = this.defaultReputation();
    this.unlockedSkills = Object.create(null);
    this.skillPoints = 0;
    this.screen = "mainMenu";
    this.uiMode = "menu";
    this.activeMenu = "mainMenu";
    this.activeModal = null;
    this.selectedPanel = null;
    this.inputLock = false;
    this.enteredMap = false;
    this.teamColumn = "active";
    this.selectedActive = 0;
    this.selectedReserve = 0;
    this.reserveFilter = "all";
    this.selectedSkill = 0;
    this.selectedMenu = 0;
    this.inventoryTab = "equipment";
    this.selectedInventory = 0;
    this.selectedEquipment = 0;
    this.selectedLoadSave = 0;
    this.importCandidate = null;
    this.saveOverlayMode = "";
    this.captureBonus = 0;
    this.magicDamageBonus = 0;
    this.servantHpBonus = 0;
    this.commandEfficiency = 1;
    this.dragonSignalSeen = false;
    this.portalCooldown = 1;
    this.blockedPortalCooldown = 0;
    this.transitionAlpha = 0;
    this.transitionPhase = "";
    this.transitionTimer = 0;
    this.pendingTransition = null;
    this.transitionText = "";
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.nearbyPortal = null;
    this.nearbyInterest = null;
    this.nearbyContext = null;
    this.lastSaveStatus = "Sem save";
    this.itemNotice = "";
    this.itemNoticeTimer = 0;
    this.reputationNotice = "";
    this.reputationNoticeTimer = 0;
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.messages = [];
    this.servantCommandIndex = 0;
    this.servantCommand = cfg.commands[this.servantCommandIndex];
    this.autoAttackEnabled = false;
    this.autoAttackRangeBonus = 0;
    this.soulAutoCollectBonus = 0;
    this.attackDamageBonus = 0;
    this.boneSpearDamageBonus = 0;
    this.markedTarget = null;
    this.groupingDangerTimer = 0;
    this.tutorialCaptureDone = false;
    this.objectiveProgress = this.createDefaultObjectiveProgress();
    this.bossDefeated = false;
    this.unlockedRegions = {
      cripta_inicial: true,
      cemiterio_neutro: true,
      estrada_dos_enforcados: true
    };
    this.boss = null;
    this.trainingTick = 0;
    this.spawnTick = 0;
this.respawnTimers = { common: 0, elite: 0 };
    this.ui = new window.GameUI(this);
    this.camera = { x: 0, y: 0 };
    this.lastTime = 0;
    // Track damage and combat for regen
    this.lastDamageTime = 0;
    this.inCombat = false;
    this.resize();
    this.setupWorld();
    this.setupStarterReserve();
    this.applyAllBonuses();
    this.allServants().forEach(this.applySkillBonusesToServant.bind(this));
    this.setupSaveOverlay();
    this.lastSaveStatus = this.hasSave() ? "Save encontrado" : "Sem save local";
    this.exposeRuntimeDebugTools();
  };

  NecromancerGame.prototype.setupSaveOverlay = function () {
    var overlay = document.getElementById("saveOverlay");
    if (!overlay) return;
    this.saveOverlay = overlay;
    this.saveOverlayTitle = document.getElementById("saveOverlayTitle");
    this.saveOverlayMessage = document.getElementById("saveOverlayMessage");
    this.saveOverlaySummary = document.getElementById("saveOverlaySummary");
    this.saveOverlayText = document.getElementById("saveOverlayText");
    this.saveOverlayValidate = document.getElementById("saveOverlayValidate");
    this.saveOverlayConfirm = document.getElementById("saveOverlayConfirm");
    this.saveOverlayLocal = document.getElementById("saveOverlayLocal");
    this.saveOverlayCloud = document.getElementById("saveOverlayCloud");
    this.saveOverlayCancel = document.getElementById("saveOverlayCancel");

    this.saveOverlayValidate.addEventListener("click", this.validateImportFromOverlay.bind(this));
    this.saveOverlayConfirm.addEventListener("click", this.confirmSaveOverlay.bind(this));
    this.saveOverlayLocal.addEventListener("click", this.resolveSaveConflict.bind(this, "local"));
    this.saveOverlayCloud.addEventListener("click", this.resolveSaveConflict.bind(this, "cloud"));
    this.saveOverlayCancel.addEventListener("click", this.cancelSaveOverlay.bind(this));
  };

  NecromancerGame.prototype.setSaveOverlayButtons = function (mode) {
    if (!this.saveOverlay) return;
    this.saveOverlayValidate.hidden = mode !== "import";
    this.saveOverlayConfirm.hidden = mode === "conflict";
    this.saveOverlayLocal.hidden = mode !== "conflict";
    this.saveOverlayCloud.hidden = mode !== "conflict";
    this.saveOverlayText.hidden = mode === "conflict";
    this.saveOverlayConfirm.textContent = mode === "export" ? "Copiar" : "Importar";
  };

  NecromancerGame.prototype.showSaveOverlay = function (mode, title, message, text, summary) {
    if (!this.saveOverlay) {
      this.message("Interface de save indisponivel.");
      return;
    }
    this.saveOverlayMode = mode;
    this.activeModal = mode;
    this.inputLock = true;
    this.importCandidate = null;
    this.setSaveOverlayButtons(mode);
    this.saveOverlayTitle.textContent = title;
    this.saveOverlayMessage.textContent = message || "";
    this.saveOverlaySummary.textContent = summary || "";
    this.saveOverlayText.value = text || "";
    this.saveOverlay.hidden = false;
    if (mode === "import") this.saveOverlayText.focus();
  };

  NecromancerGame.prototype.hideSaveOverlay = function () {
    if (this.saveOverlay) this.saveOverlay.hidden = true;
    this.saveOverlayMode = "";
    this.importCandidate = null;
    this.activeModal = null;
    this.inputLock = false;
  };

  NecromancerGame.prototype.cancelSaveOverlay = function () {
    if (this.saveOverlayMode === "conflict" && window.SyncManager) {
      window.SyncManager.resolveConflict("cancel");
      this.message("Conflito mantido para resolver depois.");
    }
    this.hideSaveOverlay();
  };

  NecromancerGame.prototype.resetRuntimeUIState = function () {
    this.hideSaveOverlay();
    this.screen = "map";
    this.uiMode = "game";
    this.activeMenu = null;
    this.activeModal = null;
    this.selectedPanel = null;
    this.selectedMenu = 0;
    this.selectedLoadSave = 0;
    this.inputLock = false;
    this.enteredMap = true;
    this.nearbyPortal = null;
    this.nearbyInterest = null;
    this.nearbyContext = null;
    if (this.input && this.input.clearRuntimeInput) this.input.clearRuntimeInput();
  };

  NecromancerGame.prototype.closeAllMenusAndReturnToGame = function () {
    if (!this.enteredMap && this.screen !== "map") {
      this.hideSaveOverlay();
      this.screen = "mainMenu";
      this.uiMode = "menu";
      this.activeMenu = "mainMenu";
      this.activeModal = null;
      this.selectedPanel = null;
      this.inputLock = false;
      if (this.input && this.input.clearRuntimeInput) this.input.clearRuntimeInput();
      return false;
    }
    this.resetRuntimeUIState();
    this.markMapVisited(this.currentMapId);
    return true;
  };

  NecromancerGame.prototype.exposeRuntimeDebugTools = function () {
    var self = this;
    window.debugUIState = function () {
      return {
        currentScreen: self.screen,
        activeMenu: self.activeMenu,
        activeModal: self.activeModal,
        uiMode: self.uiMode,
        inputLock: self.inputLock,
        saveOverlayMode: self.saveOverlayMode,
        overlayVisible: Boolean(self.saveOverlay && !self.saveOverlay.hidden)
      };
    };
    window.forceReturnToGame = function () {
      return self.closeAllMenusAndReturnToGame();
    };
  };

  NecromancerGame.prototype.saveSummaryText = function (save, title) {
    if (!save) return title + "\nIndisponivel.";
    var player = save.player || {};
    var updated = save.updatedAt || save.savedAt || save.cloudUploadedAt;
    return [
      title,
      "Versao: " + (save.gameVersion || save.version || save.schemaVersion || "-"),
      "Mapa: " + (save.currentMapId || "-"),
      "Nivel: " + (player.level || 1),
      "Fragmentos: " + (player.fragments || 0),
      "Servos ativos: " + (Array.isArray(save.servants) ? save.servants.length : 0),
      "Servos reserva: " + (Array.isArray(save.reserveServants) ? save.reserveServants.length : 0),
      "Atualizado: " + (updated ? new Date(updated).toLocaleString() : "-"),
      "Plataforma: " + (save.platform || "-"),
      "Revision: " + (save.revision || 0)
    ].join("\n");
  };

  NecromancerGame.prototype.openSaveExport = function () {
    if (!window.SaveManager) return;
    if (!window.SaveManager.getCurrentSave() && !window.SaveManager.hasLocalSave()) this.saveGame(true);
    var exported = window.SaveManager.exportSave();
    if (!exported) {
      this.message("Nenhum save para exportar.");
      return;
    }
    this.showSaveOverlay("export", "Exportar Save", "Save exportado. Copie o conteudo abaixo.", exported, "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(exported).then(function () {
        this.saveOverlayMessage.textContent = "Save exportado e copiado. Copie novamente se necessario.";
      }.bind(this)).catch(function () {});
    }
  };

  NecromancerGame.prototype.openSaveImport = function () {
    this.showSaveOverlay("import", "Importar Save", "Cole o JSON do save e use Validar antes de importar.", "", "");
  };

  NecromancerGame.prototype.validateImportFromOverlay = function () {
    if (!window.SaveManager || !this.saveOverlayText) return false;
    var raw = this.saveOverlayText.value.trim();
    if (!raw) {
      this.saveOverlaySummary.textContent = "Cole um JSON de save antes de validar.";
      return false;
    }
    var data = window.SaveManager.importSave(raw);
    if (!data) {
      this.importCandidate = null;
      this.saveOverlaySummary.textContent = "Save invalido. Verifique se o JSON esta completo e pertence ao jogo.";
      return false;
    }
    if (window.SaveManager.validateSaveData) {
      var validation = window.SaveManager.validateSaveData(data);
      if (!validation.valid) {
        this.importCandidate = null;
        this.saveOverlaySummary.textContent = "Save invalido: " + validation.error;
        return false;
      }
    }
    this.importCandidate = window.SaveManager.normalizeServantRoster ? window.SaveManager.normalizeServantRoster(data) : data;
    this.saveOverlaySummary.textContent = this.saveSummaryText(this.importCandidate, "Resumo do save importado");
    this.saveOverlayMessage.textContent = "Save valido. Confirme para substituir o save local.";
    return true;
  };

  NecromancerGame.prototype.confirmSaveOverlay = function () {
    if (this.saveOverlayMode === "export") {
      var text = this.saveOverlayText ? this.saveOverlayText.value : "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          this.message("Save copiado.", true);
        }.bind(this)).catch(function () {
          this.message("Save exportado. Copie o conteudo do campo.", true);
        }.bind(this));
      } else {
        this.message("Save exportado. Copie o conteudo do campo.", true);
      }
      return;
    }
    if (this.saveOverlayMode !== "import") return;
    if (!this.importCandidate && !this.validateImportFromOverlay()) return;
    if (!window.SaveManager.applyImportedSave(this.importCandidate)) {
      this.saveOverlaySummary.textContent = "Falha ao gravar o save importado.";
      return;
    }
    if (window.SyncManager) {
      window.SyncManager.markDirty();
      window.SyncManager.queueSync();
    }
    this.applyLoadedData(this.importCandidate);
    this.hideSaveOverlay();
    this.message("Save importado.", true);
  };

  NecromancerGame.prototype.openSaveConflict = function () {
    if (!window.SyncManager || !window.SyncManager.pendingConflict) {
      this.message("Nenhum conflito de save pendente.");
      return;
    }
    var conflict = window.SyncManager.pendingConflict;
    var summary = this.saveSummaryText(conflict.local, "Save Local") + "\n\n" + this.saveSummaryText(conflict.cloud, "Save Nuvem");
    this.showSaveOverlay("conflict", "Conflito de Save", "Encontramos dois saves diferentes.", "", summary);
  };

  NecromancerGame.prototype.resolveSaveConflict = function (choice) {
    if (!window.SyncManager) return;
    var self = this;
    window.SyncManager.resolveConflict(choice).then(function (result) {
      if (choice === "cloud" && result && result.success && result.data) {
        if (!window.SaveManager.applyImportedSave(result.data)) {
          self.message("Save da nuvem invalido.");
          self.hideSaveOverlay();
          return;
        }
        self.applyLoadedData(window.SaveManager.getCurrentSave() || result.data);
      }
      if (choice === "local") self.message("Save local enviado para a nuvem mock.", true);
      if (choice === "cloud") self.message("Save da nuvem aplicado.", true);
      self.hideSaveOverlay();
      if (result && result.success && !result.cancelled) self.closeAllMenusAndReturnToGame();
    });
  };

  NecromancerGame.prototype.getCloudMetadata = function () {
    if (!window.AuthService || !window.AuthService.isLoggedIn() || !window.CloudSaveService) return null;
    var user = window.AuthService.getCurrentUser();
    return user ? window.CloudSaveService.getCloudSaveMetadata(user.userId) : null;
  };

  // Normalize servant roster - ensure max 3 active
  NecromancerGame.prototype.normalizeServantRoster = function () {
    var active = this.servants.filter(function (s) { return s && !s.destroyed; });
    var reserve = this.reserveServants.filter(function (s) { return s && !s.destroyed; });
    
    if (active.length > MAX_ACTIVE_SERVANTS) {
      var excess = active.splice(MAX_ACTIVE_SERVANTS);
      excess.forEach(function (s) {
        s.dead = false;
        s.destroyed = false;
        reserve.push(s);
      });
      this.message("Equipe corrigida: servos excedentes enviados para a reserva.", true);
    }
    
    this.servants = active;
    this.reserveServants = reserve;
  };

  NecromancerGame.prototype.defaultInventory = function () {
    return {
      equipment: {
        crackedStaff: 1,
        boneGrimoire: 1,
        cryptRing: 1,
        rustyBlade: 0,
        boneAmulet: 0,
        shadowRing: 0
      },
      consumables: {
        healthPotion: 1,
        manaPotion: 1
      },
      materials: {
        soulFragment: 0,
        oldBone: 0,
        darkCore: 0,
        demonAsh: 0,
        crackedDragonScale: 0
      }
    };
  };

  NecromancerGame.prototype.normalizeInventory = function (inventory) {
    var base = this.defaultInventory();
    var source = inventory || {};
    if (source.equipment || source.consumables || source.materials) {
      ["equipment", "consumables", "materials"].forEach(function (section) {
        base[section] = Object.assign(base[section], source[section] || {});
      });
      return base;
    }

    var legacyMap = {
      "Fragmento de Alma": ["materials", "soulFragment"],
      "Osso Antigo": ["materials", "oldBone"],
      "Nucleo Sombrio": ["materials", "darkCore"],
      "Cinza Demoniaca": ["materials", "demonAsh"],
      "Escama Draconica Rachada": ["materials", "crackedDragonScale"],
      "Pocao de Vida": ["consumables", "healthPotion"],
      "Pocao de Mana": ["consumables", "manaPotion"],
      "Amuleto de Ossos": ["equipment", "boneAmulet"],
      "Lamina Enferrujada": ["equipment", "rustyBlade"],
      "Anel Sombrio": ["equipment", "shadowRing"]
    };
    Object.keys(source).forEach(function (name) {
      var target = legacyMap[name];
      if (target) base[target[0]][target[1]] = Math.max(base[target[0]][target[1]] || 0, source[name] || 0);
    });
    return base;
  };

  NecromancerGame.prototype.defaultReputation = function () {
    return {
      Humanos: 0,
      Demonios: 0,
      Dragoes: 0,
      "Mortos-vivos": 0
    };
  };

  NecromancerGame.prototype.createDefaultObjectiveProgress = function () {
    return {
      version: INITIAL_OBJECTIVE_VERSION,
      completed: {},
      basicEnemiesDefeated: 0,
      currentStep: "awakenCrypt",
      completedInitialLoop: false
    };
  };

  NecromancerGame.prototype.normalizeObjectiveProgress = function (savedProgress) {
    var progress = this.createDefaultObjectiveProgress();
    if (savedProgress && typeof savedProgress === "object") {
      progress.version = savedProgress.version || INITIAL_OBJECTIVE_VERSION;
      progress.completed = Object.assign({}, savedProgress.completed || {});
      progress.basicEnemiesDefeated = Math.max(0, savedProgress.basicEnemiesDefeated || 0);
      progress.completedInitialLoop = Boolean(savedProgress.completedInitialLoop);
    }
    return this.reconcileObjectiveProgress(progress);
  };

  NecromancerGame.prototype.reconcileObjectiveProgress = function (progress) {
    progress = progress || this.createDefaultObjectiveProgress();
    progress.completed = progress.completed || {};
    if (this.getMapState("cripta_inicial").visited || this.currentMapId === "cripta_inicial") {
      progress.completed.awakenCrypt = true;
    }
    if (this.getMapState("cripta_inicial").events.trono_funerario || this.getMapState("cripta_inicial").events.altar_renascimento) {
      progress.completed.touchFuneralThrone = true;
    }
    if (this.getMapState("cemiterio_neutro").visited || this.currentMapId === "cemiterio_neutro") {
      progress.completed.reachNeutralCemetery = true;
    }
    if (progress.basicEnemiesDefeated >= 2) progress.completed.defeatBasicEnemies = true;
    if (this.tutorialCaptureDone || this.servants.length > 0 || this.reserveServants.length > 3) {
      progress.completed.captureFirstSoul = true;
    }
    if (this.isBossDefeatedForMap("cemiterio_neutro")) progress.completed.defeatTombGuardian = true;
    if (this.getMapState("cemiterio_neutro").secretUnlocked || this.map.secretUnlocked) {
      progress.completed.unlockSecretArea = true;
    }
    if (progress.completed.unlockSecretArea) {
      progress.completed.initialLoopComplete = true;
      progress.completedInitialLoop = true;
    }
    progress.currentStep = this.getCurrentObjectiveStep(progress).id;
    progress.version = INITIAL_OBJECTIVE_VERSION;
    return progress;
  };

  NecromancerGame.prototype.getCurrentObjectiveStep = function (progress) {
    var current = progress || this.objectiveProgress || this.createDefaultObjectiveProgress();
    var completed = current.completed || {};
    for (var i = 0; i < INITIAL_OBJECTIVE_STEPS.length; i += 1) {
      if (!completed[INITIAL_OBJECTIVE_STEPS[i].id]) return INITIAL_OBJECTIVE_STEPS[i];
    }
    return INITIAL_OBJECTIVE_STEPS[INITIAL_OBJECTIVE_STEPS.length - 1];
  };

  NecromancerGame.prototype.getCurrentObjectiveText = function () {
    this.objectiveProgress = this.reconcileObjectiveProgress(this.objectiveProgress);
    var step = this.getCurrentObjectiveStep(this.objectiveProgress);
    var suffix = "";
    if (step.id === "defeatBasicEnemies") {
      suffix = " (" + Math.min(this.objectiveProgress.basicEnemiesDefeated, step.target) + "/" + step.target + ")";
    }
    return {
      title: step.title + suffix,
      hint: step.hint,
      complete: step.id === "initialLoopComplete"
    };
  };

  NecromancerGame.prototype.completeObjectiveStep = function (stepId) {
    this.objectiveProgress = this.objectiveProgress || this.createDefaultObjectiveProgress();
    this.objectiveProgress.completed = this.objectiveProgress.completed || {};
    if (this.objectiveProgress.completed[stepId]) return false;
    this.objectiveProgress.completed[stepId] = true;
    if (stepId === "unlockSecretArea") {
      this.objectiveProgress.completed.initialLoopComplete = true;
      this.objectiveProgress.completedInitialLoop = true;
    }
    this.objectiveProgress.currentStep = this.getCurrentObjectiveStep(this.objectiveProgress).id;
    return true;
  };

  NecromancerGame.prototype.incrementBasicObjectiveKill = function (enemy) {
    if (!enemy || enemy.type === "boss" || this.currentMapId !== "cemiterio_neutro") return;
    this.objectiveProgress = this.reconcileObjectiveProgress(this.objectiveProgress);
    if (this.objectiveProgress.completed.defeatBasicEnemies) return;
    this.objectiveProgress.basicEnemiesDefeated += 1;
    if (this.objectiveProgress.basicEnemiesDefeated >= 2 && this.completeObjectiveStep("defeatBasicEnemies")) {
      this.message("Objetivo concluido: inimigos basicos abatidos.", true);
      this.saveGame(true);
    }
  };

  NecromancerGame.prototype.createDefaultMapState = function () {
    return {
      cripta_inicial: {
        visited: false,
        bossDefeated: false,
        secretUnlocked: false,
        events: {},
        portalsUnlocked: {}
      },
      cemiterio_neutro: {
        visited: false,
        bossDefeated: false,
        secretUnlocked: false,
        events: {},
        portalsUnlocked: {}
      },
      estrada_dos_enforcados: {
        visited: false,
        bossDefeated: false,
        secretUnlocked: false,
        events: {},
        portalsUnlocked: {}
      },
      area_secreta_cripta: {
        visited: false,
        bossDefeated: false,
        secretUnlocked: false,
        dragonScaleCollected: false,
        chestOpened: false,
        events: {},
        portalsUnlocked: {}
      }
    };
  };

  NecromancerGame.prototype.getMapState = function (id) {
    var key = id || this.currentMapId;
    if (!this.mapState) this.mapState = this.createDefaultMapState();
    if (!this.mapState[key]) {
      this.mapState[key] = {
        visited: false,
        bossDefeated: false,
        secretUnlocked: false,
        events: {},
        portalsUnlocked: {}
      };
    }
    if (!this.mapState[key].events) this.mapState[key].events = {};
    if (!this.mapState[key].portalsUnlocked) this.mapState[key].portalsUnlocked = {};
    return this.mapState[key];
  };

  NecromancerGame.prototype.mergeMapState = function (savedState) {
    var base = this.createDefaultMapState();
    Object.keys(savedState || {}).forEach(function (id) {
      base[id] = Object.assign(base[id] || {}, savedState[id] || {});
      base[id].events = Object.assign({}, base[id].events || {}, (savedState[id] && savedState[id].events) || {});
      base[id].portalsUnlocked = Object.assign({}, base[id].portalsUnlocked || {}, (savedState[id] && savedState[id].portalsUnlocked) || {});
    });
    return base;
  };

  NecromancerGame.prototype.applyLegacyMapFlags = function (data) {
    var cemetery = this.getMapState("cemiterio_neutro");
    if (data && data.bossDefeated) {
      cemetery.bossDefeated = true;
      cemetery.secretUnlocked = true;
      cemetery.portalsUnlocked.cemiterio_para_secreta = true;
    }
    if (data && data.secretUnlocked) cemetery.secretUnlocked = true;
    var secret = this.getMapState("area_secreta_cripta");
    if (data && data.dragonSignalSeen) {
      secret.dragonScaleCollected = true;
      secret.events.escama_draconica_rachada = true;
    }
  };

  NecromancerGame.prototype.markMapVisited = function (id) {
    var state = this.getMapState(id);
    if (state.visited) return false;
    state.visited = true;
    if (id === "cripta_inicial" && this.completeObjectiveStep("awakenCrypt")) {
      this.message("Objetivo concluido: despertar na Cripta Inicial.", true);
    }
    if (id === "cemiterio_neutro" && this.completeObjectiveStep("reachNeutralCemetery")) {
      this.message("Objetivo concluido: Cemiterio Neutro alcancado.", true);
    }
    var mapData = window.WorldMaps[id] || this.map.current;
    if (mapData && mapData.firstVisitMessage) this.message(mapData.firstVisitMessage, true);
    return true;
  };

  NecromancerGame.prototype.isBossDefeatedForMap = function (id) {
    return Boolean(this.getMapState(id).bossDefeated || (id === "cemiterio_neutro" && this.bossDefeated));
  };

  NecromancerGame.prototype.resize = function () {
    var scale = Math.max(1, window.devicePixelRatio || 1);
    var w = Math.floor(window.innerWidth * scale);
    var h = Math.floor(window.innerHeight * scale);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
  };

  NecromancerGame.prototype.setupWorld = function () {
    this.enemies = [];
    this.boss = null;
    var spawns = this.map.current.enemies || [];
    spawns.forEach(function (spawn) {
      if (spawn[0] === "boss" && this.isBossDefeatedForMap(this.currentMapId)) return;
      var enemy = this.spawnEnemy(spawn[0], spawn[1], spawn[2], spawn[3] || {});
      enemy.spawnRole = spawn[0] === "boss" ? "boss" : spawn[0] === "elite" ? "elite" : "common";
      if (spawn[0] === "boss") this.boss = enemy;
    }.bind(this));
  };

  NecromancerGame.prototype.setupStarterReserve = function () {
    this.reserveServants = [];
    this.reserveServants.push(new window.Servant("skeleton", this.player.x - 0.8, this.player.y + 0.8));
    this.reserveServants.push(new window.Servant("feral", this.player.x, this.player.y + 1));
    this.reserveServants.push(new window.Servant("fallen", this.player.x + 0.8, this.player.y + 0.8));
  };

  NecromancerGame.prototype.newGame = function () {
    this.map = new window.GameMap();
    this.currentMapId = this.map.currentId;
    var spawn = this.map.getSpawn("default");
    this.player = new window.Player(spawn.x, spawn.y);
    this.player.baseNecroDomain = this.player.necroDomain;
    this.servants = [];
    this.reserveServants = [];
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.inventory = this.defaultInventory();
    this.equipmentOwned = { crackedStaff: true, boneGrimoire: true, cryptRing: true };
    this.equipment = { weapon: "crackedStaff", tome: "boneGrimoire", ring: "cryptRing" };
    this.reputation = this.defaultReputation();
    this.unlockedSkills = Object.create(null);
    this.skillPoints = 0;
    this.captureBonus = 0;
    this.magicDamageBonus = 0;
    this.servantHpBonus = 0;
    this.commandEfficiency = 1;
    this.bossDefeated = false;
    this.mapState = this.createDefaultMapState();
    this.objectiveProgress = this.createDefaultObjectiveProgress();
    this.dragonSignalSeen = false;
    this.portalCooldown = 1;
    this.blockedPortalCooldown = 0;
    this.transitionAlpha = 0;
    this.transitionPhase = "";
    this.pendingTransition = null;
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.tutorialCaptureDone = false;
    this.enteredMap = false;
    this.teamColumn = "active";
    this.selectedActive = 0;
    this.selectedReserve = 0;
    this.reserveFilter = "all";
    this.selectedSkill = 0;
    this.inventoryTab = "equipment";
    this.selectedInventory = 0;
    this.selectedEquipment = 0;
    this.autoAttackEnabled = false;
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    this.setupStarterReserve();
    this.applyAllBonuses();
    this.allServants().forEach(this.applySkillBonusesToServant.bind(this));
    this.resetRuntimeUIState();
    this.markMapVisited(this.currentMapId);
    this.message("Novo jogo iniciado.", true);
  };

  NecromancerGame.prototype.spawnEnemy = function (type, x, y, options) {
    var enemy = new window.Enemy(type, x, y, options || {});
    if (options && options.summoned) enemy.aggro = true;
    this.enemies.push(enemy);
    return enemy;
  };

  NecromancerGame.prototype.message = function (text, important) {
    this.messages.unshift({ text: text, life: important ? 5.4 : 3.4, important: Boolean(important) });
    this.messages = this.messages.slice(0, 6);
  };

NecromancerGame.prototype.hasSave = function () {
    // Check new save format first, then legacy
    if (window.SaveManager && window.SaveManager.hasLocalSave) {
      return window.SaveManager.hasLocalSave();
    }
    try {
      return Boolean(localStorage.getItem(this.saveKey));
    } catch (error) {
      return false;
    }
  };

  NecromancerGame.prototype.serializeServant = function (servant) {
    return {
      kind: servant.kind,
      level: servant.level,
      exp: servant.exp,
      hp: Math.max(1, Math.ceil(servant.hp)),
      maxHp: servant.maxHp,
      damage: servant.damage,
      defense: servant.defense,
      state: servant.state
    };
  };

  NecromancerGame.prototype.deserializeServant = function (data) {
    var servant = new window.Servant(data.kind || "skeleton", this.player.x, this.player.y + 1);
    servant.level = data.level || 1;
    servant.exp = data.exp || 0;
    servant.maxHp = data.maxHp || servant.maxHp;
    servant.hp = Math.min(servant.maxHp, data.hp || servant.maxHp);
    servant.damage = data.damage || servant.damage;
    servant.defense = data.defense || servant.defense;
    servant.state = data.state || servant.state;
    return servant;
  };

NecromancerGame.prototype.saveGame = function (silent) {
    // Use SaveManager if available
    if (window.SaveManager) {
      var result = window.SaveManager.saveGame(this, silent);
      if (result) {
        this.lastSaveStatus = "Salvo";
        return true;
      }
    }
    // Fallback to legacy save
    var data = {
      version: cfg.version,
      player: {
        level: this.player.level,
        exp: this.player.exp,
        expToNext: this.player.expToNext,
        fragments: this.player.fragments,
        maxHp: this.player.maxHp,
        maxMana: this.player.maxMana,
        necroDomain: this.player.necroDomain,
        x: this.player.x,
        y: this.player.y
      },
      currentMapId: this.currentMapId,
      servants: this.servants.map(this.serializeServant.bind(this)),
      reserveServants: this.reserveServants.map(this.serializeServant.bind(this)),
      secretUnlocked: this.bossDefeated || this.map.secretUnlocked,
      bossDefeated: this.bossDefeated,
      inventory: this.inventory,
      equipment: this.equipment,
      equipmentOwned: this.equipmentOwned,
      unlockedSkills: this.unlockedSkills,
      skillPoints: this.skillPoints,
      reputation: this.reputation,
      mapState: this.mapState,
      unlockedRegions: this.unlockedRegions,
      objectiveProgress: this.objectiveProgress,
      tutorialCaptureDone: this.tutorialCaptureDone,
      dragonSignalSeen: this.dragonSignalSeen,
      autoAttackEnabled: this.autoAttackEnabled
    };
    data.inventory.materials.soulFragment = this.player.fragments;
    try {
      localStorage.setItem(this.saveKey, JSON.stringify(data));
      this.lastSaveStatus = "Salvo agora";
      if (!silent) this.message("Jogo salvo localmente.", true);
    } catch (error) {
      this.lastSaveStatus = "Falha ao salvar";
      this.message("Nao foi possivel salvar neste navegador.");
    }
  };

NecromancerGame.prototype.loadGame = function () {
    // Try SaveManager first
    if (window.SaveManager) {
      var data = window.SaveManager.loadGame();
      if (data) {
        return this.applyLoadedData(data);
      }
    }

    // Fallback to legacy load
    var raw;
    try {
      raw = localStorage.getItem(this.saveKey);
    } catch (error) {
      raw = null;
    }
    if (!raw) {
      this.message("Nenhum save local encontrado.");
      return false;
    }
    var data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      this.message("Save local corrompido.");
      return false;
    }

    return this.applyLoadedData(data);
  };

  // Helper to apply loaded save data (shared by new and legacy)
  NecromancerGame.prototype.applyLoadedData = function (data) {
    this.map = new window.GameMap();
    this.map.load(data.currentMapId || "cripta_inicial");
    this.currentMapId = this.map.currentId;
    this.mapState = this.mergeMapState(data.mapState || {});
    this.applyLegacyMapFlags(data || {});
    var loadedSpawn = this.map.getSpawn("default");
    this.player = new window.Player(loadedSpawn.x, loadedSpawn.y);
    this.player.level = data.player && data.player.level || 1;
    this.player.exp = data.player && data.player.exp || 0;
    this.player.expToNext = data.player && data.player.expToNext || 100;
    this.player.fragments = data.player && data.player.fragments || 0;
    this.player.maxHp = data.player && data.player.maxHp || this.player.maxHp;
    this.player.maxMana = data.player && data.player.maxMana || this.player.maxMana;
    this.player.hp = this.player.maxHp;
    this.player.mana = this.player.maxMana;
    this.player.necroDomain = data.player && data.player.necroDomain || this.player.necroDomain;
    this.player.baseNecroDomain = this.player.necroDomain;
    this.player.x = data.currentMapId && data.player && typeof data.player.x === "number" ? data.player.x : loadedSpawn.x;
    this.player.y = data.currentMapId && data.player && typeof data.player.y === "number" ? data.player.y : loadedSpawn.y;
    this.map.secretUnlocked = Boolean(data.secretUnlocked);
    this.bossDefeated = Boolean(data.bossDefeated);
    if (this.isBossDefeatedForMap("cemiterio_neutro")) {
      this.bossDefeated = true;
      this.map.secretUnlocked = true;
    }
    this.inventory = this.normalizeInventory(data.inventory);
    this.inventory.materials.soulFragment = data.player && data.player.fragments || this.inventory.materials.soulFragment || 0;
    this.equipmentOwned = Object.assign({ crackedStaff: true, boneGrimoire: true, cryptRing: true }, data.equipmentOwned || {});
    Object.keys(this.inventory.equipment).forEach(function (key) {
      if (this.inventory.equipment[key] > 0) this.equipmentOwned[key] = true;
    }.bind(this));
    this.equipment = Object.assign({ weapon: "crackedStaff", tome: "boneGrimoire", ring: "cryptRing" }, data.equipment || {});
    this.unlockedSkills = Object.assign(Object.create(null), data.unlockedSkills || {});
    this.skillPoints = data.skillPoints || 0;
    this.reputation = Object.assign(this.defaultReputation(), data.reputation || {});
    this.tutorialCaptureDone = Boolean(data.tutorialCaptureDone);
    this.dragonSignalSeen = Boolean(data.dragonSignalSeen);
    this.autoAttackEnabled = Boolean(data.autoAttackEnabled);
    this.unlockedRegions = Object.assign({
      cripta_inicial: true,
      cemiterio_neutro: true,
      estrada_dos_enforcados: true
    }, data.unlockedRegions || {});

this.servants = (data.servants || []).map(this.deserializeServant.bind(this));
    this.reserveServants = (data.reserveServants || []).map(this.deserializeServant.bind(this));
    // Normalize team after loading
    this.normalizeServantRoster();
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    if (this.bossDefeated && this.boss) this.boss.dead = true;
    this.applyAllBonuses();
    this.objectiveProgress = this.normalizeObjectiveProgress(data.objectiveProgress);
    this.lastSaveStatus = "Save carregado";
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.portalCooldown = 1;
    this.resetRuntimeUIState();
    this.markMapVisited(this.currentMapId);
    this.message("Save carregado.", true);
    return true;
  };

NecromancerGame.prototype.deleteSave = function () {
    // Use SaveManager if available
    if (window.SaveManager) {
      var result = window.SaveManager.deleteLocalSave();
      if (result) {
        this.lastSaveStatus = "Save apagado";
        this.message("Save local apagado.", true);
        return;
      }
    }
    // Fallback to legacy delete
    try {
      localStorage.removeItem(this.saveKey);
      this.lastSaveStatus = "Save apagado";
      this.message("Save local apagado.", true);
    } catch (error) {
      this.message("Nao foi possivel apagar o save.");
    }
  };

  NecromancerGame.prototype.floatText = function (text, x, y, color) {
    this.texts.push(new window.FloatingText(text, x, y, color));
  };

  NecromancerGame.prototype.start = function () {
    requestAnimationFrame(this.loop.bind(this));
  };

  NecromancerGame.prototype.loop = function (time) {
    var dt = Math.min(0.033, (time - this.lastTime) / 1000 || 0.016);
    this.lastTime = time;
    this.update(dt);
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  };

  NecromancerGame.prototype.update = function (dt) {
    this.resize();
    if (this.transitionPhase === "out") {
      this.updateTransition(dt);
      this.messages.forEach(function (msg) { msg.life -= dt; });
      this.messages = this.messages.filter(function (msg) { return msg.life > 0; });
      return;
    }
    this.handleInput(dt);
    this.inventory.materials.soulFragment = this.player.fragments;
    this.itemNoticeTimer = Math.max(0, this.itemNoticeTimer - dt);
    this.reputationNoticeTimer = Math.max(0, this.reputationNoticeTimer - dt);
    this.portalCooldown = Math.max(0, this.portalCooldown - dt);
    this.blockedPortalCooldown = Math.max(0, this.blockedPortalCooldown - dt);
    this.areaTitleTimer = Math.max(0, this.areaTitleTimer - dt);
    this.updateTransition(dt);
    this.nearbyPortal = this.screen === "map" ? this.map.getNearbyPortal(this.player.x, this.player.y, this.getWorldFlags()) : null;
    this.nearbyInterest = this.screen === "map" ? this.map.getNearbyInterestInfo(this.player.x, this.player.y, this.getWorldFlags()) : null;
    this.nearbyContext = this.getNearbyContext();
    this.updateContextButton();
    this.updateReturnButton();
    if (this.screen !== "map") {
      this.messages.forEach(function (msg) { msg.life -= dt; });
      this.messages = this.messages.filter(function (msg) { return msg.life > 0; });
      this.camera = this.map.getCameraFor(this.player.x, this.player.y, { width: this.viewWidth, height: this.viewHeight });
      return;
    }
    this.player.update(dt, this);
    this.updateAutoAttack();
    this.trainingUpdate(dt);
    this.narrativeUpdate();
    this.groupingDangerTimer = Math.max(0, this.groupingDangerTimer - dt);

    this.enemies.forEach(function (enemy) { enemy.update(dt, this); }.bind(this));
    this.servants.forEach(function (servant) { servant.update(dt, this); }.bind(this));
    this.projectiles.forEach(function (projectile) { projectile.update(dt, this); }.bind(this));
    this.souls.forEach(function (soul) { soul.update(dt, this); }.bind(this));
    this.effects.forEach(function (effect) { effect.update(dt); });
    this.texts.forEach(function (text) { text.update(dt); });

    this.resolveProjectiles();
    this.resolveDeaths();
    this.cleanup();
    this.respawnWildEnemies(dt);

    this.messages.forEach(function (msg) { msg.life -= dt; });
    this.messages = this.messages.filter(function (msg) { return msg.life > 0; });
    this.camera = this.map.getCameraFor(this.player.x, this.player.y, { width: this.viewWidth, height: this.viewHeight });
  };

  NecromancerGame.prototype.handleInput = function (dt) {
    if (this.input.consume("recoverUI")) {
      this.closeAllMenusAndReturnToGame();
      this.message("UI recuperada.", true);
      return;
    }
    if (this.saveOverlay && !this.saveOverlay.hidden) {
      if (this.input.consume("menu")) {
        this.cancelSaveOverlay();
      } else if (this.input.consume("start") || this.input.consume("returnToGame") || this.input.consume("manage")) {
        this.cancelSaveOverlay();
        this.closeAllMenusAndReturnToGame();
      }
      return;
    }
    if (this.screen === "account") {
      if (this.input.consume("menu") || this.input.consume("start") || this.input.consume("returnToGame") || this.input.consume("manage")) {
        this.closeAllMenusAndReturnToGame();
        return;
      }
      if (this.input.consume("command")) this.selectedEquipment = (this.selectedEquipment + 1) % 6;
      if (this.input.consume("capture") || this.input.consume("attack")) this.confirmAccountAction();
      if (this.input.consume("skill1")) this.toggleMockLogin();
      if (this.input.consume("skill2")) this.syncNow();
      if (this.input.consume("skill3")) this.cycleVisualQuality();
      if (this.input.consume("save")) this.openSaveExport();
      if (this.input.consume("inventory")) this.openSaveImport();
      if (this.input.consume("deleteSave")) this.deleteSave();
      return;
    }
    if (this.screen === "loadSave") {
      if (this.input.consume("menu") || this.input.consume("start") || this.input.consume("returnToGame") || this.input.consume("manage")) {
        this.closeAllMenusAndReturnToGame();
        return;
      }
      if (this.input.consume("command")) this.nextMenuSelection();
      if (this.input.consume("capture") || this.input.consume("attack")) this.confirmLoadSaveAction();
      if (this.input.consume("skill1")) this.loadGame();
      if (this.input.consume("skill2")) this.loadCloudSave();
      if (this.input.consume("skill3")) this.syncNow();
      if (this.input.consume("skill4")) this.openSaveConflict();
      if (this.input.consume("save")) this.openSaveExport();
      if (this.input.consume("inventory")) this.openSaveImport();
      return;
    }
    if (this.screen === "worldMap") {
      if (this.input.consume("menu") || this.input.consume("start") || this.input.consume("returnToGame") || this.input.consume("manage")) {
        this.closeAllMenusAndReturnToGame();
        return;
      }
      if (this.input.consume("command")) this.selectedMenu = (this.selectedMenu + 1) % window.WorldRegions.length;
      if (this.input.consume("capture") || this.input.consume("attack")) this.confirmRegionTravel();
      return;
    }
    if (this.input.consume("menu")) {
      if (this.screen === "map") this.openScreen("mainMenu");
      else this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("returnToGame")) {
      if (this.screen !== "map") this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("save")) this.saveGame();
    if (this.input.consume("deleteSave")) this.deleteSave();
if (this.input.consume("manage")) {
      if (this.screen === "map") this.openScreen("team");
      else this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("account")) {
      if (this.screen === "map" || this.screen === "mainMenu") this.openScreen("account");
      else this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("inventory")) {
      if (this.screen === "map") this.openScreen("inventory");
      else this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("skills")) {
      if (this.screen === "map") this.openScreen("skills");
      else this.closeAllMenusAndReturnToGame();
      return;
    }
    if (this.input.consume("start")) {
      if (this.screen === "mainMenu") this.confirmMainMenu();
      else if (this.screen === "controls" || this.screen === "credits") {
        if (this.enteredMap) this.closeAllMenusAndReturnToGame();
        else this.openScreen("mainMenu");
      } else if (this.screen === "map") {
        this.openScreen("worldMap");
      } else {
        this.closeAllMenusAndReturnToGame();
      }
      return;
    }
    if (this.input.consume("fusion")) this.fuseSelectedKind();

if (this.screen !== "map") {
      if (this.input.consume("command")) {
        if (this.screen === "team") this.cycleTeamColumn();
        else if (this.screen === "inventory") this.cycleInventoryTab();
        else this.nextMenuSelection();
      }
      if (this.input.consume("capture") || this.input.consume("attack")) this.confirmMenuAction();
      if (this.input.consume("skill1")) {
        if (this.screen === "team") this.nextMenuSelection();
        else if (this.screen === "inventory") this.nextMenuSelection();
        else if (this.screen === "skills") this.selectedSkill = 0;
      }
      if (this.input.consume("skill2")) {
        if (this.screen === "team") this.replaceActiveWithReserve();
        else if (this.screen === "skills") this.selectedSkill = 1;
      }
      if (this.input.consume("skill3")) {
        if (this.screen === "team") this.sendActiveToReserve();
        else this.selectedSkill = 2;
      }
      if (this.input.consume("skill4")) {
        if (this.screen === "team") this.cycleReserveFilter();
        else this.selectedSkill = Math.min(3, cfg.skillTree.length - 1);
      }
      if (this.input.consume("fusion")) this.fuseSelectedKind();
      return;
    }

    var move = this.input.getMoveVector();
    this.player.move(move.x, move.y, this.player.speed, dt, this.map);

    if (this.input.consume("attack")) this.castAttack();
    if (this.input.consume("autoAttack")) this.toggleAutoAttack();
    if (this.input.consume("skill1")) this.castDrain();
    if (this.input.consume("skill2")) this.castBoneSpear();
    if (this.input.consume("skill3")) this.castMark();
    if (this.input.consume("skill4")) this.castCorpseExplosion();
    if (this.input.consume("capture")) this.captureSoul();
    if (this.input.consume("enterPortal")) this.useContextAction();
    if (this.input.consume("command")) this.nextCommand();
  };

  NecromancerGame.prototype.openScreen = function (screen) {
    this.screen = screen;
    this.uiMode = screen === "map" ? "game" : "menu";
    this.activeMenu = screen === "map" ? null : screen;
    this.activeModal = null;
    this.inputLock = false;
    if (screen === "mainMenu") this.message("Menu: CMD alterna, CAP confirma.");
    if (screen === "team") this.message("Equipe: CMD coluna, 2 substitui, 3 reserva, 5 filtro.");
    if (screen === "inventory") this.message("Inventario: CMD aba, 2 item, CAP usa/equipa.");
    if (screen === "skills") this.message("Talentos: CMD alterna, CAP compra com pontos.");
    if (screen === "loadSave") this.message("Carregar Save: CMD alterna, CAP confirma, I importa, P exporta.");
    if (screen === "account") this.message("Conta: CMD alterna, CAP confirma, 3 muda qualidade visual.");
    if (screen === "worldMap") this.message("Mapa do Mundo: CMD alterna regiao, CAP viaja.");
  };

  NecromancerGame.prototype.toggleMockLogin = function () {
    if (!window.AuthService) return;
    if (window.AuthService.isLoggedIn()) {
      window.AuthService.signOut();
      this.message("Deslogado.");
    } else {
      window.AuthService.signInWithMock();
      this.message("Login mock ativo.");
    }
  };

  NecromancerGame.prototype.syncNow = function () {
    if (!window.SyncManager) return;
    window.SyncManager.syncNow(window.SaveManager ? window.SaveManager.getCurrentSave() : null).then(function (result) {
      if (result && result.conflict) this.openSaveConflict();
      else if (result && result.success) this.message("Sincronizacao concluida.", true);
      else this.message("Sincronizacao pendente ou indisponivel.");
    }.bind(this));
    this.message("Sincronizando...");
  };

  NecromancerGame.prototype.cycleVisualQuality = function () {
    if (!window.GameArt || !window.GameArt.nextQuality) return;
    window.GameArt.nextQuality();
    this.message("Qualidade visual: " + window.GameArt.getQualityLabel() + ".", true);
  };

  NecromancerGame.prototype.confirmAccountAction = function () {
    var action = this.selectedEquipment % 6;
    if (action === 0) this.toggleMockLogin();
    else if (action === 1) this.syncNow();
    else if (action === 2) this.cycleVisualQuality();
    else if (action === 3) this.openSaveExport();
    else if (action === 4) this.openSaveImport();
    else this.deleteSave();
  };

  NecromancerGame.prototype.getLoadSaveOptions = function () {
    return ["Carregar Local", "Carregar Nuvem", "Sincronizar", "Importar JSON", "Exportar Save", "Voltar"];
  };

  NecromancerGame.prototype.confirmLoadSaveAction = function () {
    var option = this.getLoadSaveOptions()[this.selectedLoadSave] || "Voltar";
    if (option === "Carregar Local") this.loadGame();
    else if (option === "Carregar Nuvem") this.loadCloudSave();
    else if (option === "Sincronizar") this.syncNow();
    else if (option === "Importar JSON") this.openSaveImport();
    else if (option === "Exportar Save") this.openSaveExport();
    else this.closeAllMenusAndReturnToGame();
  };

  NecromancerGame.prototype.confirmRegionTravel = function () {
    var region = window.WorldRegions[this.selectedMenu];
    if (!region) return;
    if (region.status === "future") {
      this.message("Regiao disponivel em expansoes futuras.");
      return;
    }

    var unlocked = this.unlockedRegions[region.id];
    
    // Regra especifica para Fronteira baseada no Guardiao
    if (region.requires === "tombGuardianDefeated" && this.isBossDefeatedForMap("cemiterio_neutro")) {
      unlocked = true;
    }

    if (!unlocked) {
      this.message("Regiao bloqueada. Requisito: " + this.ui.getRegionRequirementText(region) + ".");
      return;
    }
    this.changeMap(region.id, "default");
    this.closeAllMenusAndReturnToGame();
  };

  NecromancerGame.prototype.loadCloudSave = function () {
    if (!window.AuthService || !window.AuthService.isLoggedIn() || !window.CloudSaveService) {
      this.message("Entre na conta mock antes de carregar nuvem.");
      return;
    }
    var user = window.AuthService.getCurrentUser();
    window.CloudSaveService.downloadSave(user.userId).then(function (result) {
      if (!result.success || !result.data) {
        this.message("Nenhum save em nuvem encontrado.");
        return;
      }
      if (!window.SaveManager.applyImportedSave(result.data)) {
        this.message("Save da nuvem invalido.");
        return;
      }
      this.applyLoadedData(window.SaveManager.getCurrentSave() || result.data);
      this.message("Save da nuvem carregado.", true);
    }.bind(this));
  };

  NecromancerGame.prototype.enterMap = function () {
    this.screen = "map";
    this.uiMode = "game";
    this.activeMenu = null;
    this.activeModal = null;
    this.inputLock = false;
    this.portalCooldown = Math.max(this.portalCooldown, 0.6);
    if (!this.enteredMap) {
      this.enteredMap = true;
      this.message("Equipe definida. Capture novas almas para expandir a reserva.", true);
      this.markMapVisited(this.currentMapId);
    }
  };

  NecromancerGame.prototype.getWorldFlags = function () {
    // Unlock Frontier if boss defeated
    if (this.isBossDefeatedForMap("cemiterio_neutro")) {
      this.unlockedRegions.fronteira_tres_reinos = true;
    }
    return {
      tombGuardianDefeated: this.isBossDefeatedForMap("cemiterio_neutro"),
      secretUnlocked: this.getMapState("cemiterio_neutro").secretUnlocked || this.map.secretUnlocked,
      dragonScaleCollected: this.dragonSignalSeen || this.getMapState("area_secreta_cripta").dragonScaleCollected
    };
  };

  NecromancerGame.prototype.getNearbyContext = function () {
    if (this.screen !== "map") return null;
    var portalInfo = this.map.getNearbyPortalInfo(this.player.x, this.player.y, this.getWorldFlags());
    var interestInfo = this.map.getNearbyInterestInfo(this.player.x, this.player.y, this.getWorldFlags());
    if (portalInfo && (!interestInfo || portalInfo.dist <= interestInfo.dist)) {
      return { kind: "portal", portal: portalInfo.portal, dist: portalInfo.dist };
    }
    if (interestInfo) return { kind: "interest", point: interestInfo.point, dist: interestInfo.dist };
    return null;
  };

  NecromancerGame.prototype.updateContextButton = function () {
    var button = document.getElementById("portalButton");
    if (!button) return;
    if (this.nearbyContext && this.screen === "map" && this.portalCooldown <= 0) {
      button.classList.add("is-visible");
      button.textContent = this.nearbyContext.kind === "portal" ? "Entrar" : "Interagir";
      button.setAttribute("aria-label", button.textContent);
    } else {
      button.classList.remove("is-visible");
    }
  };

  NecromancerGame.prototype.updateReturnButton = function () {
    var button = document.querySelector(".menu-button.start");
    if (!button) return;
    var shouldReturn = this.screen !== "map" && (this.screen !== "mainMenu" || this.enteredMap);
    button.textContent = shouldReturn ? "Voltar" : "Mapa";
    button.setAttribute("aria-label", shouldReturn ? "Voltar ao jogo" : "Entrar ou voltar ao mapa");
  };

  NecromancerGame.prototype.useContextAction = function () {
    if (this.screen !== "map" || this.portalCooldown > 0) return;
    var context = this.nearbyContext || this.getNearbyContext();
    if (!context) {
      this.message("Nada para interagir por perto.");
      return;
    }
    if (context.kind === "portal") this.useNearbyPortal(context.portal);
    else this.interactWithPoint(context.point);
  };

  NecromancerGame.prototype.useNearbyPortal = function (providedPortal) {
    if (this.screen !== "map" || this.portalCooldown > 0) return;
    var portal = providedPortal || this.nearbyPortal || this.map.getNearbyPortal(this.player.x, this.player.y, this.getWorldFlags());
    if (!portal) {
      this.message("Nenhum portal proximo.");
      return;
    }
    if (!this.map.isPortalUnlocked(portal, this.getWorldFlags())) {
      if (this.blockedPortalCooldown <= 0) {
        this.message(portal.lockedMessage || "Um selo antigo bloqueia esta passagem.", true);
        this.floatText(portal.future ? "Futuro" : "Selado", portal.x, portal.y, "#f1b2bf");
        this.effects.push(new window.AreaEffect(portal.x, portal.y, 1.15, "#d36c84"));
        this.blockedPortalCooldown = 1.3;
      }
      this.portalCooldown = 1;
      return;
    }
    this.changeMap(portal.targetMap, portal.targetSpawn);
  };

  NecromancerGame.prototype.changeMap = function (targetMap, targetSpawn) {
    if (!window.WorldMaps[targetMap]) {
      this.message("Esta area estara disponivel em uma versao futura.", true);
      this.portalCooldown = 1;
      return;
    }
    this.pendingTransition = { targetMap: targetMap, targetSpawn: targetSpawn || "default" };
    this.transitionPhase = "out";
    this.transitionTimer = 0.22;
    this.transitionAlpha = Math.max(this.transitionAlpha, 0.18);
    this.transitionText = "Entrando...";
  };

  NecromancerGame.prototype.updateTransition = function (dt) {
    if (this.transitionPhase === "out") {
      this.transitionAlpha = Math.min(1, this.transitionAlpha + dt * 4.8);
      this.transitionTimer -= dt;
      if (this.transitionTimer <= 0 && this.pendingTransition) {
        this.performMapChange(this.pendingTransition.targetMap, this.pendingTransition.targetSpawn);
        this.pendingTransition = null;
        this.transitionPhase = "in";
        this.transitionTimer = 0.35;
        this.transitionAlpha = 1;
      }
      return;
    }
    if (this.transitionPhase === "in") {
      this.transitionTimer -= dt;
      this.transitionAlpha = Math.max(0, this.transitionAlpha - dt * 2.8);
      if (this.transitionTimer <= 0 || this.transitionAlpha <= 0) {
        this.transitionPhase = "";
        this.transitionAlpha = 0;
      }
      return;
    }
    this.transitionAlpha = Math.max(0, this.transitionAlpha - dt * 1.8);
  };

  NecromancerGame.prototype.performMapChange = function (targetMap, targetSpawn) {
    this.transitionAlpha = 1;
    this.map.load(targetMap);
    this.currentMapId = this.map.currentId;
    this.map.secretUnlocked = this.getMapState("cemiterio_neutro").secretUnlocked || this.isBossDefeatedForMap("cemiterio_neutro");
    var spawn = this.map.getSpawn(targetSpawn || "default");
    this.player.x = spawn.x;
    this.player.y = spawn.y;
    this.repositionServants();
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.markedTarget = null;
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    this.camera = this.map.getCameraFor(this.player.x, this.player.y, { width: this.viewWidth, height: this.viewHeight });
    this.portalCooldown = 1.15;
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.markMapVisited(this.currentMapId);
    this.message(this.map.current.name, true);
    this.saveGame(true);
  };

  NecromancerGame.prototype.interactWithPoint = function (point) {
    if (!point) {
      this.message("Nenhum objeto proximo.");
      return;
    }
    var state = this.getMapState(this.currentMapId);
    var eventKey = point.id;
    if (point.once && state.events[eventKey]) {
      this.message(point.doneMessage || "Nada mais responde aqui.");
      return;
    }

    if (point.id === "selo_area_secreta") {
      if (this.isBossDefeatedForMap("cemiterio_neutro")) {
        state.secretUnlocked = true;
        state.portalsUnlocked.cemiterio_para_secreta = true;
        this.map.secretUnlocked = true;
        if (this.completeObjectiveStep("unlockSecretArea")) {
          this.message("Objetivo concluido: Area Secreta desbloqueada.", true);
        }
        this.message(point.unlockedMessage || point.message, true);
        this.effects.push(new window.AreaEffect(point.x, point.y, 1.2, "#7df0cd"));
        this.saveGame(true);
      } else {
        this.message(point.message, true);
        this.effects.push(new window.AreaEffect(point.x, point.y, 1.05, "#d36c84"));
      }
      this.portalCooldown = 0.35;
      return;
    }

    if (point.heal) {
      this.player.hp = this.player.maxHp;
      this.player.mana = this.player.maxMana;
      this.servants.forEach(function (servant) {
        if (!servant.destroyed) servant.hp = servant.maxHp;
      });
      this.effects.push(new window.AreaEffect(point.x, point.y, 1.1, "#76df95"));
    }

    if (point.rewardItem && point.rewardAmount) {
      this.addItem(point.rewardItem, point.rewardAmount);
      if (point.rewardItem === "Escama Draconica Rachada") {
        this.dragonSignalSeen = true;
        state.dragonScaleCollected = true;
        this.adjustReputation("Dragoes", 5);
      }
      if (point.id === "bau_antigo") state.chestOpened = true;
    }

    if (point.once) state.events[eventKey] = true;
    if ((point.id === "trono_funerario" || point.id === "altar_renascimento") && this.completeObjectiveStep("touchFuneralThrone")) {
      this.message("Objetivo concluido: o poder da cripta respondeu.", true);
    }
    this.floatText(point.label, point.x, point.y, "#fff1ac");
    this.message(point.message, true);
    this.portalCooldown = 0.35;
    this.saveGame(true);
  };

  NecromancerGame.prototype.repositionServants = function () {
    this.servants.forEach(function (servant, index) {
      servant.dead = false;
      servant.destroyed = false;
      servant.hp = Math.max(1, servant.hp);
      servant.x = this.player.x - 0.8 + index * 0.7;
      servant.y = this.player.y + 0.9;
    }.bind(this));
  };

NecromancerGame.prototype.nextMenuSelection = function () {
    if (this.screen === "mainMenu") {
      this.selectedMenu = (this.selectedMenu + 1) % this.getMainMenuOptions().length;
    } else if (this.screen === "team") {
      if (this.teamColumn === "active") this.selectedActive = (this.selectedActive + 1) % Math.max(1, Math.min(MAX_ACTIVE_SERVANTS, this.player.soulControl));
      else this.selectedReserve = (this.selectedReserve + 1) % Math.max(1, this.filteredReserveServants().length);
    } else if (this.screen === "skills") {
      this.selectedSkill = (this.selectedSkill + 1) % cfg.skillTree.length;
    } else if (this.screen === "inventory") {
      this.selectedInventory = (this.selectedInventory + 1) % Math.max(1, this.getInventoryEntries(this.inventoryTab).length);
    } else if (this.screen === "account") {
      // Cycle through action buttons using selection state
      this.selectedEquipment = (this.selectedEquipment + 1) % 6;
    } else if (this.screen === "loadSave") {
      this.selectedLoadSave = (this.selectedLoadSave + 1) % this.getLoadSaveOptions().length;
    }
  };

  NecromancerGame.prototype.confirmMenuAction = function () {
    if (this.screen === "mainMenu") this.confirmMainMenu();
    else if (this.screen === "team") this.confirmTeamSelection();
    else if (this.screen === "skills") this.unlockSelectedSkill();
    else if (this.screen === "inventory") this.confirmInventorySelection();
    else if (this.screen === "account") this.confirmAccountAction();
    else if (this.screen === "loadSave") this.confirmLoadSaveAction();
    else if (this.screen === "controls" || this.screen === "credits") this.openScreen("mainMenu");
  };

NecromancerGame.prototype.getMainMenuOptions = function () {
    var options = ["Continuar", "Equipe", "Inventario", "Talentos", "Mapa", "Salvar/Carregar", "Conta", "Controles", "Creditos"];
    if (!this.enteredMap) options.unshift("Novo Jogo");
    return options;
  };

NecromancerGame.prototype.confirmMainMenu = function () {
    var option = this.getMainMenuOptions()[this.selectedMenu] || "Novo Jogo";
    if (option === "Novo Jogo") this.newGame();
    else if (option === "Continuar") {
      if (!this.hasSave()) this.message("Nenhum save local encontrado.");
      else this.loadGame();
    }
    else if (option === "Equipe") this.openScreen("team");
    else if (option === "Inventario") this.openScreen("inventory");
    else if (option === "Talentos") this.openScreen("skills");
    else if (option === "Mapa") this.closeAllMenusAndReturnToGame();
    else if (option === "Salvar/Carregar") this.openScreen("loadSave");
    else if (option === "Conta") this.openScreen("account");
    else if (option === "Controles") this.openScreen("controls");
    else if (option === "Creditos") this.openScreen("credits");
  };

NecromancerGame.prototype.toggleSelectedReserve = function () {
    this.confirmTeamSelection();
  };

  NecromancerGame.prototype.getServantRole = function (servant) {
    return cfg.servantRoles[servant.kind] || "Dano";
  };

  NecromancerGame.prototype.getServantPower = function (servant) {
    return Math.round(servant.level * 8 + servant.maxHp * 0.18 + servant.damage * 2.4 + servant.defense * 5 + servant.speed * 3);
  };

  NecromancerGame.prototype.filteredReserveServants = function () {
    var filter = this.reserveFilter || "all";
    return this.reserveServants.filter(function (servant) {
      var role = this.getServantRole(servant);
      if (filter === "tank") return role === "Tanque/defensivo";
      if (filter === "damage") return role === "Dano";
      if (filter === "fast") return role === "Rapido/agressivo";
      if (filter === "support") return role === "Suporte/magico";
      return true;
    }.bind(this)).sort(function (a, b) {
      if (filter === "power") return this.getServantPower(b) - this.getServantPower(a);
      return 0;
    }.bind(this));
  };

  NecromancerGame.prototype.cycleTeamColumn = function () {
    this.teamColumn = this.teamColumn === "active" ? "reserve" : "active";
  };

  NecromancerGame.prototype.cycleReserveFilter = function () {
    var keys = ["all", "tank", "damage", "fast", "support", "power"];
    var index = keys.indexOf(this.reserveFilter || "all");
    this.reserveFilter = keys[(index + 1) % keys.length];
    this.selectedReserve = 0;
    this.message("Filtro da reserva: " + this.getReserveFilterLabel() + ".");
  };

  NecromancerGame.prototype.getReserveFilterLabel = function () {
    if (this.reserveFilter === "power") return "Poder";
    return cfg.reserveFilters[this.reserveFilter || "all"] || "Todos";
  };

  NecromancerGame.prototype.activateReserveServant = function (servant) {
    if (!servant) {
      this.message("Reserva vazia.");
      return false;
    }
    if (this.servants.length >= Math.min(MAX_ACTIVE_SERVANTS, this.player.soulControl)) {
      this.message("Equipe ativa cheia. Substitua ou remova um servo.");
      return false;
    }
    this.removeServant(servant);
    servant.dead = false;
    servant.destroyed = false;
    servant.hp = Math.max(1, servant.hp);
    servant.x = this.player.x - 0.8 + this.servants.length * 0.7;
    servant.y = this.player.y + 0.9;
    this.servants.push(servant);
    this.repositionServants();
    this.message(servant.name + " entrou na equipe ativa.");
    this.saveGame(true);
    return true;
  };

  NecromancerGame.prototype.confirmTeamSelection = function () {
    if (this.teamColumn === "active") {
      var active = this.servants[this.selectedActive];
      if (!active) {
        this.teamColumn = "reserve";
        this.message("Selecione um servo da reserva para preencher o espaco.");
        return;
      }
      this.sendActiveToReserve(this.selectedActive);
      return;
    }
    var filtered = this.filteredReserveServants();
    var reserve = filtered[this.selectedReserve];
    this.activateReserveServant(reserve);
  };

  NecromancerGame.prototype.replaceActiveWithReserve = function () {
    var filtered = this.filteredReserveServants();
    var reserve = filtered[this.selectedReserve];
    var active = this.servants[this.selectedActive];
    if (!reserve) {
      this.message("Reserva vazia.");
      return;
    }
    if (!active) {
      this.activateReserveServant(reserve);
      return;
    }
    this.removeServant(reserve);
    this.servants[this.selectedActive] = reserve;
    active.dead = false;
    active.destroyed = false;
    this.reserveServants.push(active);
    this.repositionServants();
    this.message(reserve.name + " substituiu " + active.name + ".");
    this.saveGame(true);
  };

  NecromancerGame.prototype.sendActiveToReserve = function (index) {
    if (this.servants.length === 0) return;
    var selectedIndex = typeof index === "number" ? index : this.selectedActive;
    var servant = this.servants.splice(Math.max(0, Math.min(this.servants.length - 1, selectedIndex)), 1)[0];
    if (!servant) return;
    servant.dead = false;
    servant.destroyed = false;
    this.reserveServants.push(servant);
    this.selectedActive = Math.min(this.selectedActive, Math.max(0, this.servants.length - 1));
    this.repositionServants();
    this.message(servant.name + " voltou para a reserva.");
    this.saveGame(true);
  };

  NecromancerGame.prototype.allServants = function () {
    return this.servants.concat(this.reserveServants);
  };

  NecromancerGame.prototype.fuseSelectedKind = function () {
    if (this.screen !== "team") return;
    var selected = this.reserveServants[this.selectedReserve] || this.servants[0];
    if (!selected) {
      this.message("Nenhum servo disponivel para fusao.");
      return;
    }
    var pool = this.allServants().filter(function (servant) {
      return servant.kind === selected.kind;
    });
    if (pool.length < 3) {
      this.message("Fusao exige 3 servos iguais do mesmo tipo.");
      return;
    }
    pool.slice(0, 3).forEach(this.removeServant.bind(this));
    var resultKind = selected.kind === "skeleton" ? "veteran" : selected.kind;
    var fused = new window.Servant(resultKind, this.player.x - 0.6, this.player.y + 0.8);
    fused.level = Math.max(pool[0].level, pool[1].level, pool[2].level) + 1;
    fused.maxHp += 20;
    fused.hp = fused.maxHp;
    fused.damage += 5;
    fused.defense += 1;
    this.applySkillBonusesToServant(fused);
    if (this.servants.length < this.player.soulControl) this.servants.push(fused);
    else this.reserveServants.push(fused);
    this.addItem("Nucleo Sombrio", 1);
    this.saveGame();
    this.message("Fusao concluida: 3 " + selected.name + " geraram " + fused.name + ".", true);
  };

  NecromancerGame.prototype.removeServant = function (servant) {
    var activeIndex = this.servants.indexOf(servant);
    if (activeIndex >= 0) {
      this.servants.splice(activeIndex, 1);
      return;
    }
    var reserveIndex = this.reserveServants.indexOf(servant);
    if (reserveIndex >= 0) this.reserveServants.splice(reserveIndex, 1);
  };

  NecromancerGame.prototype.unlockSelectedSkill = function () {
    var node = cfg.skillTree[this.selectedSkill];
    if (!node || this.unlockedSkills[node.id]) {
      this.message("Talento ja desbloqueado.");
      return;
    }
    if (this.player.level < node.levelRequired) {
      this.message("Nivel necessario: " + node.levelRequired + ".");
      return;
    }
    if (node.requires && !this.unlockedSkills[node.requires]) {
      this.message("Requer talento anterior: " + this.getTalentName(node.requires) + ".");
      return;
    }
    if (this.skillPoints < node.cost) {
      this.message("Pontos necessarios: " + node.cost + ".");
      return;
    }
    this.skillPoints -= node.cost;
    this.unlockedSkills[node.id] = true;
    if (node.effect === "servantHp18") {
      this.allServants().forEach(function (servant) {
        servant.maxHp += 18;
        servant.hp += 18;
      });
    } else if (node.effect === "servantDefense1") {
      this.allServants().forEach(function (servant) { servant.defense += 1; });
    } else if (node.effect === "protectBias25") {
      this.allServants().forEach(function (servant) {
        servant.protectBias += 0.25;
      });
    }
    this.applyAllBonuses();
    this.saveGame();
    this.message("Talento desbloqueado: " + node.name + ".", true);
  };

  NecromancerGame.prototype.getTalentName = function (id) {
    var node = cfg.skillTree.filter(function (item) { return item.id === id; })[0];
    return node ? node.name : id;
  };

  NecromancerGame.prototype.getTalentRequirementText = function (node) {
    if (!node) return "";
    var parts = [];
    if (this.player.level < node.levelRequired) parts.push("nivel " + node.levelRequired);
    if (this.skillPoints < node.cost) parts.push(node.cost + " ponto(s)");
    if (node.requires && !this.unlockedSkills[node.requires]) parts.push(this.getTalentName(node.requires));
    return parts.length ? "Requer: " + parts.join(" | ") : "Pronto para desbloquear";
  };

  NecromancerGame.prototype.getItemDisplayName = function (section, key) {
    if (section === "equipment" && cfg.equipment[key]) return cfg.equipment[key].name;
    if (section === "consumables" && cfg.consumables[key]) return cfg.consumables[key].name;
    if (section === "materials" && cfg.materials[key]) return cfg.materials[key];
    return key;
  };

  NecromancerGame.prototype.resolveLegacyItem = function (name) {
    var legacy = {
      "Fragmento de Alma": ["materials", "soulFragment"],
      "Osso Antigo": ["materials", "oldBone"],
      "Nucleo Sombrio": ["materials", "darkCore"],
      "Cinza Demoniaca": ["materials", "demonAsh"],
      "Escama Draconica Rachada": ["materials", "crackedDragonScale"],
      "Pocao de Vida": ["consumables", "healthPotion"],
      "Pocao de Mana": ["consumables", "manaPotion"],
      "Amuleto de Ossos": ["equipment", "boneAmulet"],
      "Lamina Enferrujada": ["equipment", "rustyBlade"],
      "Anel Sombrio": ["equipment", "shadowRing"]
    };
    return legacy[name] || null;
  };

  NecromancerGame.prototype.addItem = function (name, amount, section) {
    if (!amount) return;
    if (!this.inventory || !this.inventory.equipment) this.inventory = this.normalizeInventory(this.inventory);
    var resolved = section ? [section, name] : this.resolveLegacyItem(name);
    if (!resolved) {
      if (cfg.equipment[name]) resolved = ["equipment", name];
      else if (cfg.consumables[name]) resolved = ["consumables", name];
      else if (cfg.materials[name]) resolved = ["materials", name];
    }
    if (!resolved) resolved = ["materials", name];
    var bucket = resolved[0];
    var key = resolved[1];
    this.inventory[bucket][key] = (this.inventory[bucket][key] || 0) + amount;
    if (bucket === "equipment") this.equipmentOwned[key] = true;
    if (key === "soulFragment") this.player.fragments = this.inventory.materials.soulFragment;
    this.itemNotice = "+" + amount + " " + this.getItemDisplayName(bucket, key);
    this.itemNoticeTimer = 3;
  };

  NecromancerGame.prototype.applySkillBonusesToServant = function (servant) {
    if (this.unlockedSkills.invocador || this.unlockedSkills.invocador_vinculo) {
      servant.maxHp += 18;
      servant.hp = Math.min(servant.maxHp, servant.hp + 18);
    }
    if (this.equipment.ring === "cryptRing") {
      servant.maxHp += 10;
      servant.hp = Math.min(servant.maxHp, servant.hp + 10);
    }
    if (this.equipment.amulet === "boneAmulet") {
      servant.maxHp += 12;
      servant.hp = Math.min(servant.maxHp, servant.hp + 12);
    }
    if (this.unlockedSkills.estrategista || this.unlockedSkills.invocador_protecao) {
      servant.defense += 1;
    }
    if (this.unlockedSkills.estrategista || this.unlockedSkills.estrategista_ia) {
      servant.protectBias += 0.25;
    }
  };

  NecromancerGame.prototype.adjustReputation = function (faction, amount) {
    this.reputation[faction] = Math.max(-100, Math.min(100, (this.reputation[faction] || 0) + amount));
    if (amount !== 0) {
      this.reputationNotice = faction + " " + (amount > 0 ? "+" : "") + amount;
      this.reputationNoticeTimer = 3;
    }
  };

  NecromancerGame.prototype.applyAllBonuses = function () {
    this.captureBonus = 0;
    this.magicDamageBonus = 0;
    this.servantHpBonus = 0;
    this.commandEfficiency = 1;
    this.autoAttackRangeBonus = 0;
    this.soulAutoCollectBonus = 0;
    this.attackDamageBonus = 0;
    this.boneSpearDamageBonus = 0;
    this.player.soulControl = cfg.player.soulControl;
    if (typeof this.player.baseNecroDomain !== "number") this.player.baseNecroDomain = this.player.necroDomain;
    this.player.necroDomain = Math.max(this.player.baseNecroDomain, cfg.player.necroDomain);
    if (this.equipment.weapon === "crackedStaff") this.magicDamageBonus += 5;
    if (this.equipment.weapon === "rustyBlade") this.attackDamageBonus += 3;
    if (this.equipment.tome === "boneGrimoire") this.captureBonus += 0.1;
    if (this.equipment.ring === "cryptRing") this.servantHpBonus += 10;
    if (this.equipment.ring === "shadowRing") this.player.necroDomain += 0.1;
    if (this.equipment.amulet === "boneAmulet") this.servantHpBonus += 12;
    if (this.unlockedSkills.ceifador || this.unlockedSkills.ceifador_dreno) cfg.skills.skill1.damage = 30;
    else cfg.skills.skill1.damage = 20;
    cfg.skills.skill2.damage = this.unlockedSkills.ceifador_lanca ? 39 : 31;
    if (this.unlockedSkills.ceifador_sangue_frio) this.attackDamageBonus += 4;
    if (this.unlockedSkills.senhor_almas || this.unlockedSkills.senhor_almas_mao) this.captureBonus += 0.12;
    if (this.unlockedSkills.senhor_almas_coleta) this.soulAutoCollectBonus += 1;
    if (this.unlockedSkills.senhor_almas_dominio) this.player.necroDomain += 0.3;
    if (this.unlockedSkills.estrategista || this.unlockedSkills.estrategista_ordens) this.commandEfficiency = 1.25;
    if (this.unlockedSkills.estrategista_auto) this.autoAttackRangeBonus += 1;
    if (this.unlockedSkills.invocador || this.unlockedSkills.invocador_vinculo) this.servantHpBonus += 18;
    if (this.unlockedSkills.invocador_limite) this.player.soulControl += 1;
  };

  NecromancerGame.prototype.equipSelectedItem = function () {
    var key = Object.keys(cfg.equipment)[this.selectedEquipment] || "crackedStaff";
    var item = cfg.equipment[key];
    if (!this.equipmentOwned[key]) {
      this.message("Equipamento ainda nao encontrado.");
      return;
    }
    this.equipment[item.slot] = key;
    this.applyAllBonuses();
    this.saveGame();
    this.message("Equipado: " + item.name + ".", true);
  };

  NecromancerGame.prototype.getInventoryEntries = function (tab) {
    if (!this.inventory || !this.inventory.equipment) this.inventory = this.normalizeInventory(this.inventory);
    var section = tab || this.inventoryTab || "equipment";
    var bucket = this.inventory[section] || {};
    return Object.keys(bucket).filter(function (key) {
      if (section === "equipment" || section === "consumables") return bucket[key] > 0;
      return true;
    }).map(function (key) {
      return { key: key, amount: bucket[key] || 0, section: section, name: this.getItemDisplayName(section, key) };
    }.bind(this));
  };

  NecromancerGame.prototype.cycleInventoryTab = function () {
    var tabs = ["equipment", "consumables", "materials"];
    var index = tabs.indexOf(this.inventoryTab || "equipment");
    this.inventoryTab = tabs[(index + 1) % tabs.length];
    this.selectedInventory = 0;
    this.message("Inventario: " + cfg.inventoryTabs[this.inventoryTab] + ".");
  };

  NecromancerGame.prototype.confirmInventorySelection = function () {
    var entries = this.getInventoryEntries(this.inventoryTab);
    var entry = entries[this.selectedInventory];
    if (!entry) {
      this.message("Nada selecionado.");
      return;
    }
    if (entry.section === "equipment") {
      this.toggleEquipment(entry.key);
    } else if (entry.section === "consumables") {
      this.useConsumable(entry.key);
    } else {
      this.message(entry.name + ": " + entry.amount + ".");
    }
  };

  NecromancerGame.prototype.toggleEquipment = function (key) {
    var item = cfg.equipment[key];
    if (!item || !this.inventory.equipment[key]) {
      this.message("Equipamento indisponivel.");
      return;
    }
    if (this.equipment[item.slot] === key) {
      this.equipment[item.slot] = "";
      this.applyAllBonuses();
      this.saveGame(true);
      this.message("Desequipado: " + item.name + ".", true);
      return;
    }
    this.equipment[item.slot] = key;
    this.equipmentOwned[key] = true;
    this.applyAllBonuses();
    this.saveGame(true);
    this.message("Equipado: " + item.name + ".", true);
  };

  NecromancerGame.prototype.useConsumable = function (key) {
    var item = cfg.consumables[key];
    if (!item || !this.inventory.consumables[key]) {
      this.message("Consumivel indisponivel.");
      return;
    }
    if (item.effect === "heal") this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.amount);
    if (item.effect === "mana") this.player.mana = Math.min(this.player.maxMana, this.player.mana + item.amount);
    this.inventory.consumables[key] -= 1;
    this.selectedInventory = Math.min(this.selectedInventory, Math.max(0, this.getInventoryEntries("consumables").length - 1));
    this.saveGame(true);
    this.message("Usado: " + item.name + ".", true);
  };

  NecromancerGame.prototype.findNearestEnemy = function (range, includePassive) {
    var best = null;
    var bestDist = Infinity;
    this.enemies.forEach(function (enemy) {
      if (enemy.dead) return;
      if (!includePassive && enemy.passive && !enemy.aggro) return;
      var dist = this.player.distanceTo(enemy);
      if (dist <= range && dist < bestDist) {
        best = enemy;
        bestDist = dist;
      }
    }.bind(this));
    return best;
  };

  NecromancerGame.prototype.aimDirection = function (range) {
    var target = this.findNearestEnemy(range, true);
    if (target) return norm(target.x - this.player.x, target.y - this.player.y);
    return this.input.getLastAim();
  };

  NecromancerGame.prototype.spendMana = function (skillKey) {
    var skill = cfg.skills[skillKey];
    if (this.player.cooldowns[skillKey] > 0) return false;
    if (this.player.mana < skill.mana) {
      this.message("Mana insuficiente.");
      return false;
    }
    this.player.mana -= skill.mana;
    this.player.cooldowns[skillKey] = skill.cooldown;
    return true;
  };

  NecromancerGame.prototype.castAttack = function () {
    if (!this.spendMana("attack")) return;
    var skill = cfg.skills.attack;
    var dir = this.aimDirection(skill.range);
    this.projectiles.push(new window.Projectile(this.player, this.player.x, this.player.y, dir.x, dir.y, {
      speed: skill.speed,
      damage: skill.damage + this.magicDamageBonus + this.attackDamageBonus,
      life: skill.range / skill.speed,
      color: "#8f5dff"
    }));
    this.effects.push(new window.AreaEffect(this.player.x + dir.x * 0.7, this.player.y + dir.y * 0.7, 0.45, "#8f5dff"));
  };

  NecromancerGame.prototype.toggleAutoAttack = function () {
    this.autoAttackEnabled = !this.autoAttackEnabled;
    this.message("Auto-ataque: " + (this.autoAttackEnabled ? "ON" : "OFF") + ".");
  };

  NecromancerGame.prototype.updateAutoAttack = function () {
    if (!this.autoAttackEnabled || this.screen !== "map") return;
    var skill = cfg.skills.attack;
    var target = this.findNearestEnemy(skill.range + this.autoAttackRangeBonus, true);
    if (!target || this.player.cooldowns.attack > 0) return;
    this.castAttack();
  };

  NecromancerGame.prototype.castDrain = function () {
    if (!this.spendMana("skill1")) return;
    var skill = cfg.skills.skill1;
    var target = this.findNearestEnemy(skill.range, true);
    if (!target) {
      this.message("Dreno de Alma sem alvo.");
      return;
    }
    target.aggro = true;
    target.takeDamage(skill.damage + this.magicDamageBonus);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 10);
    this.player.mana = Math.min(this.player.maxMana, this.player.mana + 5);
    this.effects.push(new window.AreaEffect(target.x, target.y, 0.75, "#70e3c2"));
    if (window.SpiritBeamEffect) this.effects.push(new window.SpiritBeamEffect(target, this.player, "#70e3c2"));
    this.floatText("dreno", target.x, target.y, "#85f5d2");
  };

  NecromancerGame.prototype.castBoneSpear = function () {
    if (!this.spendMana("skill2")) return;
    var skill = cfg.skills.skill2;
    var dir = this.aimDirection(skill.range);
    this.projectiles.push(new window.Projectile(this.player, this.player.x, this.player.y, dir.x, dir.y, {
      speed: skill.speed,
      damage: skill.damage + this.magicDamageBonus,
      life: skill.range / skill.speed,
      color: "#e7e5c9",
      kind: "bone",
      radius: 0.25,
      pierce: 1
    }));
    this.effects.push(new window.AreaEffect(this.player.x + dir.x * 0.5, this.player.y + dir.y * 0.5, 0.35, "#93d7ff"));
  };

  NecromancerGame.prototype.castMark = function () {
    if (!this.spendMana("skill3")) return;
    var target = this.findNearestEnemy(cfg.skills.skill3.range, true);
    if (!target) {
      this.message("Marca da Submissao sem alvo.");
      return;
    }
    if (this.markedTarget) this.markedTarget.marked = false;
    target.marked = true;
    target.markTimer = 9;
    target.aggro = true;
    this.markedTarget = target;
    this.effects.push(new window.AreaEffect(target.x, target.y, 0.9, "#e95b86"));
    this.floatText("marcado", target.x, target.y, "#ff8ab0");
    this.message("Servos focando: " + target.name + ".");
  };

  NecromancerGame.prototype.castCorpseExplosion = function () {
    if (!this.spendMana("skill4")) return;
    var skill = cfg.skills.skill4;
    var soul = this.findNearestSoul(skill.range + 0.01);
    if (!soul) {
      this.message("Nenhuma alma/corpo perto para explodir.");
      return;
    }
    this.areaDamage(this.player, soul.x, soul.y, skill.radius, skill.damage, "enemies");
    this.effects.push(new window.AreaEffect(soul.x, soul.y, skill.radius, "#bd5dff"));
    soul.dead = true;
    this.message("Explosao Cadaverica consome uma alma.");
  };

  NecromancerGame.prototype.nextCommand = function () {
    this.servantCommandIndex = (this.servantCommandIndex + 1) % cfg.commands.length;
    this.servantCommand = cfg.commands[this.servantCommandIndex];
    this.message("Ordem dos servos: " + this.servantCommand + ".");
  };

  NecromancerGame.prototype.findNearestSoul = function (customRange) {
    var range = customRange || 2.1;
    var best = null;
    var bestDist = Infinity;
    this.souls.forEach(function (soul) {
      if (soul.dead) return;
      var dist = this.player.distanceTo(soul);
      if (dist <= range && dist < bestDist) {
        best = soul;
        bestDist = dist;
      }
    }.bind(this));
    return best;
  };

  NecromancerGame.prototype.getCaptureChance = function (soul) {
    if (!this.tutorialCaptureDone && soul.captureKey !== "boss") return 1;
    var chance = cfg.capture[soul.captureKey] || 0;
    chance += (this.player.necroDomain - 1) * 0.04;
    chance += this.captureBonus;
    if (soul.marked) chance += 0.2;
    return Math.max(0, Math.min(0.95, chance));
  };

  NecromancerGame.prototype.servantKindForSoul = function (soul) {
    if (!this.tutorialCaptureDone) return "skeleton";
    if (soul.sourceType === "wolf" || soul.sourceType === "rat" || soul.sourceType === "warhound") return "feral";
    if (soul.sourceType === "soldier" || soul.sourceType === "elite") return "fallen";
    if (soul.sourceType === "hunter") return "hunterShade";
    if (soul.sourceType === "cultist") return "cultistShade";
    if (soul.sourceType === "imp") return "ember";
    return "skeleton";
  };

  NecromancerGame.prototype.captureSoul = function () {
    if (this.player.cooldowns.capture > 0) return;
    this.player.cooldowns.capture = 0.7;
    var soul = this.findNearestSoul();
    if (!soul) {
      this.message("Aproxime-se de uma alma para capturar.");
      return;
    }
    if (soul.captureKey === "boss") {
      this.message("O Guardiao nao pode virar servo completo no MVP.");
      return;
    }
    var chance = this.getCaptureChance(soul);
    var success = Math.random() <= chance;
    if (window.SpiritBeamEffect) this.effects.push(new window.SpiritBeamEffect(soul, this.player, "#8ff2df"));
    this.effects.push(new window.AreaEffect(soul.x, soul.y, 0.8, success ? "#7df0cd" : "#d36c84"));
    if (!success) {
      soul.dead = true;
      this.player.fragments += Math.max(1, Math.floor(soul.fragments * 0.5));
      this.message("A alma resistiu. Fragmentos residuais absorvidos.");
      return;
    }

var kind = this.servantKindForSoul(soul);
    var servant = new window.Servant(kind, this.player.x - 0.8 + Math.random() * 1.6, this.player.y + 0.8);
    this.applySkillBonusesToServant(servant);
    var activeCount = this.servants.filter(function (s) { return !s.destroyed; }).length;
    if (activeCount < MAX_ACTIVE_SERVANTS) {
      this.servants.push(servant);
      this.message((this.tutorialCaptureDone ? "Servo capturado: " : "Primeira captura garantida: ") + servant.name + ".", true);
    } else {
      this.reserveServants.push(servant);
      this.message("Limite ativo cheio. " + servant.name + " foi enviado a reserva.");
    }
    this.tutorialCaptureDone = true;
    if (this.completeObjectiveStep("captureFirstSoul")) {
      this.message("Objetivo concluido: primeira alma capturada.", true);
    }
    this.player.fragments += soul.fragments + 1;
    this.inventory.materials.soulFragment = this.player.fragments;
    if (soul.sourceType === "soldier" || soul.sourceType === "hunter") this.adjustReputation("Humanos", -3);
    if (soul.sourceType === "elite") this.addItem("Nucleo Sombrio", 1);
    this.saveGame();
    soul.dead = true;
  };

  NecromancerGame.prototype.resolveProjectiles = function () {
    this.projectiles.forEach(function (projectile) {
      if (projectile.dead) return;
      if (projectile.team === "player") {
        this.enemies.forEach(function (enemy) {
          if (enemy.dead || projectile.dead) return;
          if (Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) <= projectile.radius + enemy.radius + 0.22) {
            enemy.aggro = true;
            enemy.takeDamage(projectile.damage);
            this.floatText("-" + projectile.damage, enemy.x, enemy.y, "#f2d1ff");
            if (projectile.pierce > 0) projectile.pierce -= 1;
            else projectile.dead = true;
          }
        }.bind(this));
      } else if (projectile.team === "enemy") {
        var allies = [this.player].concat(this.servants.filter(function (servant) {
          return !servant.dead && !servant.destroyed;
        }));
        allies.forEach(function (ally) {
          if (projectile.dead || ally.dead || ally.destroyed) return;
          if (Math.hypot(projectile.x - ally.x, projectile.y - ally.y) <= projectile.radius + ally.radius + 0.22) {
            ally.takeDamage(projectile.damage);
            this.floatText("-" + projectile.damage, ally.x, ally.y, "#ffb3b3");
            projectile.dead = true;
            if (ally === this.player && ally.hp <= 0) this.killPlayer();
          }
        }.bind(this));
      }
    }.bind(this));
  };

  NecromancerGame.prototype.areaDamage = function (source, x, y, radius, damage, affects) {
    var servantsHit = [];
    if (affects === "enemies") {
      this.enemies.forEach(function (enemy) {
        if (!enemy.dead && Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.radius) {
          enemy.aggro = true;
          enemy.takeDamage(damage);
          this.floatText("-" + damage, enemy.x, enemy.y, "#f2d1ff");
        }
      }.bind(this));
      return;
    }

    if ((affects === "servantsAndPlayer" || affects === "allies") && Math.hypot(this.player.x - x, this.player.y - y) <= radius + this.player.radius) {
      this.player.takeDamage(damage);
      this.floatText("-" + damage, this.player.x, this.player.y, "#ffb0b0");
      if (this.player.hp <= 0) this.killPlayer();
    }

    this.servants.forEach(function (servant) {
      if (servant.destroyed || servant.dead) return;
      if (Math.hypot(servant.x - x, servant.y - y) <= radius + servant.radius) {
        servant.takeDamage(damage);
        servantsHit.push(servant);
        this.floatText("-" + damage, servant.x, servant.y, "#ffb0b0");
      }
    }.bind(this));

    if (servantsHit.length >= 2) {
      this.groupingDangerTimer = 8.5;
      servantsHit.forEach(function (servant) { servant.memoryDanger = 8.5; });
      this.message("Servos aprenderam: evitar agrupamento.", true);
    }
  };

  NecromancerGame.prototype.resolveDeaths = function () {
    this.enemies.forEach(function (enemy) {
      if (!enemy.dead && enemy.hp <= 0) {
        enemy.dead = true;
        this.player.gainExp(enemy.exp, this);
        this.collectEnemySoul(enemy);
        this.applyEnemyRewards(enemy);
        this.incrementBasicObjectiveKill(enemy);
        if (enemy === this.boss) this.defeatBoss();
      }
    }.bind(this));
  };

  NecromancerGame.prototype.collectEnemySoul = function (enemy) {
    var gained = Math.max(1, (enemy.fragments || 0) + this.soulAutoCollectBonus);
    this.player.fragments += gained;
    this.inventory.materials.soulFragment = this.player.fragments;
    this.floatText("+" + gained + " alma", enemy.x, enemy.y, "#8ff2df");
    this.message("Alma coletada: " + enemy.name);
    if (!this.tutorialCaptureDone && enemy.captureKey !== "boss") {
      this.tutorialCaptureDone = true;
      if (this.completeObjectiveStep("captureFirstSoul")) {
        this.message("Objetivo concluido: primeira alma coletada.", true);
      }
    }
  };

  NecromancerGame.prototype.applyEnemyRewards = function (enemy) {
    var table = cfg.dropTables[enemy.type] || [];
    table.forEach(function (drop) {
      if (Math.random() <= drop.chance) {
        this.addItem(drop.item, drop.amount || 1, drop.type);
        this.message("Item obtido: " + this.getItemDisplayName(drop.type, drop.item));
      }
    }.bind(this));
    if (enemy.type === "soldier" || enemy.type === "elite" || enemy.type === "hunter") {
      this.adjustReputation("Humanos", -2);
    } else if (enemy.type === "cultist") {
      this.adjustReputation("Humanos", -1);
    } else if (enemy.type === "imp") {
      this.adjustReputation("Demonios", -2);
    } else if (enemy.type === "boss") {
      this.adjustReputation("Humanos", 3);
      this.adjustReputation("Mortos-vivos", 8);
    }
  };

  NecromancerGame.prototype.defeatBoss = function () {
    if (this.bossDefeated) return;
    this.bossDefeated = true;
    this.map.secretUnlocked = true;
    var cemetery = this.getMapState("cemiterio_neutro");
    cemetery.bossDefeated = true;
    cemetery.secretUnlocked = true;
    cemetery.portalsUnlocked.cemiterio_para_secreta = true;
    if (this.completeObjectiveStep("defeatTombGuardian")) {
      this.message("Objetivo concluido: Guardiao de Tumba derrotado.", true);
    }
    this.completeObjectiveStep("unlockSecretArea");
    this.message("Guardiao derrotado. Area Secreta desbloqueada.", true);
    this.adjustReputation("Mortos-vivos", 10);
    var evolved = false;
    this.servants.concat(this.reserveServants).forEach(function (servant) {
      if (servant.kind === "skeleton") {
        servant.evolveToVeteran();
        evolved = true;
      }
    });
    if (evolved) {
      this.message("Esqueleto Guerreiro evoluiu para Esqueleto Veterano.", true);
    }
    this.saveGame();
  };

  NecromancerGame.prototype.killPlayer = function () {
    if (this.player.hp > 0) return;
    var loss = Math.ceil(this.player.fragments * 0.35);
    this.player.fragments = Math.max(0, this.player.fragments - loss);
    this.map.load("cripta_inicial");
    this.currentMapId = this.map.currentId;
    this.map.secretUnlocked = this.getMapState("cemiterio_neutro").secretUnlocked;
    var spawn = this.map.getSpawn("renascimento");
    this.player.x = spawn.x;
    this.player.y = spawn.y;
    this.player.hp = this.player.maxHp;
    this.player.mana = this.player.maxMana;
    this.repositionServants();
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.portalCooldown = 1;
    this.markMapVisited(this.currentMapId);
    this.message("Renascimento na Cripta Inicial. Fragmentos perdidos: " + loss + ".", true);
    this.saveGame();
  };

  NecromancerGame.prototype.trainingUpdate = function (dt) {
    if (!this.map.inZone(this.player.x, this.player.y, "training")) return;
    this.trainingTick += dt;
    if (this.trainingTick < 2.5) return;
    this.trainingTick = 0;
    var active = this.servants.filter(function (s) { return !s.destroyed; });
    active.forEach(function (servant) { servant.gainExp(8); });
    if (active.length > 0) this.message("Treinamento: servos ganharam EXP passiva.");
  };

  NecromancerGame.prototype.respawnWildEnemies = function (dt) {
    var config = this.map.current.respawn;
    if (!config) return;
    this.respawnTimers.common += dt;
    this.respawnTimers.elite += dt;
    if (this.respawnTimers.common >= config.commonInterval) {
      this.respawnTimers.common = 0;
      this.spawnFromRespawnPool(config.common || [], config.maxCommon || 0, "common");
    }
    if (this.respawnTimers.elite >= config.eliteInterval) {
      this.respawnTimers.elite = 0;
      this.spawnFromRespawnPool(config.elite || [], config.maxElite || 0, "elite");
    }
  };

  NecromancerGame.prototype.spawnFromRespawnPool = function (pool, limit, role) {
    if (!pool.length || limit <= 0) return;
    var alive = this.enemies.filter(function (enemy) {
      return !enemy.dead && enemy.type !== "boss" && (role !== "elite" || enemy.spawnRole === "elite");
    });
    if (role === "common") {
      alive = this.enemies.filter(function (enemy) {
        return !enemy.dead && enemy.type !== "boss" && enemy.spawnRole !== "elite";
      });
    }
    if (alive.length >= limit) return;
    for (var attempt = 0; attempt < 8; attempt += 1) {
      var pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick.chance && Math.random() > pick.chance) continue;
      var spread = pick.spread || 1;
      var x = pick.x + (Math.random() * 2 - 1) * spread;
      var y = pick.y + (Math.random() * 2 - 1) * spread;
      x = Math.max(1, Math.min(this.map.cols - 1, x));
      y = Math.max(1, Math.min(this.map.rows - 1, y));
      if (Math.hypot(x - this.player.x, y - this.player.y) < 4.2) continue;
      var enemy = this.spawnEnemy(pick.type, x, y, {});
      enemy.spawnRole = role;
      this.floatText("surge", x, y, "#cfe8d2");
      return;
    }
  };

  NecromancerGame.prototype.narrativeUpdate = function () {
    var state = this.getMapState("area_secreta_cripta");
    if (!this.dragonSignalSeen && !state.events.escama_draconica_rachada && this.currentMapId === "area_secreta_cripta" && Math.hypot(this.player.x - 11.2, this.player.y - 8.3) < 1.7) {
      this.message("A Escama Draconica Rachada reage. Pressione E para recolher.", true);
    }
  };

  NecromancerGame.prototype.cleanup = function () {
    this.projectiles = this.projectiles.filter(function (item) { return !item.dead; });
    this.souls = this.souls.filter(function (item) { return !item.dead; });
    this.effects = this.effects.filter(function (item) { return !item.dead; });
    this.texts = this.texts.filter(function (item) { return !item.dead; });
    this.enemies = this.enemies.filter(function (enemy) {
      return enemy.type === "boss" || !enemy.dead;
    });
    if (this.markedTarget && this.markedTarget.dead) this.markedTarget = null;
  };

  NecromancerGame.prototype.draw = function () {
    var ctx = this.ctx;
    var canvas = { width: this.viewWidth, height: this.viewHeight };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.map.draw(ctx, this.camera, canvas, this.getWorldFlags(), this.getMapState(this.currentMapId));

    var drawables = []
      .concat(this.souls, this.projectiles, this.enemies.filter(function (e) { return !e.dead; }), this.servants, [this.player], this.effects, this.texts)
      .filter(function (item) { return item && !item.dead; });
    drawables.sort(function (a, b) { return (a.y || 0) - (b.y || 0); });
    drawables.forEach(function (item) {
      if (item.draw) item.draw(ctx, this.map, this.camera, canvas);
    }.bind(this));

    this.ui.draw(ctx, canvas);
    if (this.transitionAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.transitionAlpha);
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#eaf7ef";
      ctx.font = "900 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.transitionText || this.map.current.name, canvas.width * 0.5, canvas.height * 0.5);
      ctx.restore();
    }
  };
})();
