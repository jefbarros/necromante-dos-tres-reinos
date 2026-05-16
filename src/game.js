(function () {
  "use strict";

  var cfg = window.GameConfig;

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
    this.enteredMap = false;
    this.selectedReserve = 0;
    this.selectedSkill = 0;
    this.selectedMenu = 0;
    this.selectedEquipment = 0;
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
    this.markedTarget = null;
    this.groupingDangerTimer = 0;
    this.tutorialCaptureDone = false;
    this.bossDefeated = false;
    this.boss = null;
    this.trainingTick = 0;
    this.spawnTick = 0;
    this.respawnTimers = { common: 0, elite: 0 };
    this.ui = new window.GameUI(this);
    this.camera = { x: 0, y: 0 };
    this.lastTime = 0;
    this.resize();
    this.setupWorld();
    this.setupStarterReserve();
    this.applyAllBonuses();
    this.allServants().forEach(this.applySkillBonusesToServant.bind(this));
    this.lastSaveStatus = this.hasSave() ? "Save encontrado" : "Sem save local";
  };

  NecromancerGame.prototype.defaultInventory = function () {
    return {
      "Fragmento de Alma": 0,
      "Osso Antigo": 0,
      "Nucleo Sombrio": 0,
      "Cinza Demoniaca": 0,
      "Escama Draconica Rachada": 0
    };
  };

  NecromancerGame.prototype.defaultReputation = function () {
    return {
      Humanos: 0,
      Demonios: 0,
      Dragoes: 0,
      "Mortos-vivos": 0
    };
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
    this.selectedReserve = 0;
    this.selectedSkill = 0;
    this.selectedEquipment = 0;
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    this.setupStarterReserve();
    this.applyAllBonuses();
    this.allServants().forEach(this.applySkillBonusesToServant.bind(this));
    this.screen = "team";
    this.message("Novo jogo iniciado. Selecione ate 3 servos antes de explorar.", true);
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
      tutorialCaptureDone: this.tutorialCaptureDone,
      dragonSignalSeen: this.dragonSignalSeen
    };
    data.inventory["Fragmento de Alma"] = this.player.fragments;
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
    this.player.x = data.currentMapId && data.player && typeof data.player.x === "number" ? data.player.x : loadedSpawn.x;
    this.player.y = data.currentMapId && data.player && typeof data.player.y === "number" ? data.player.y : loadedSpawn.y;
    this.map.secretUnlocked = Boolean(data.secretUnlocked);
    this.bossDefeated = Boolean(data.bossDefeated);
    if (this.isBossDefeatedForMap("cemiterio_neutro")) {
      this.bossDefeated = true;
      this.map.secretUnlocked = true;
    }
    this.inventory = Object.assign(this.defaultInventory(), data.inventory || {});
    this.equipmentOwned = Object.assign({ crackedStaff: true, boneGrimoire: true, cryptRing: true }, data.equipmentOwned || {});
    this.equipment = Object.assign({ weapon: "crackedStaff", tome: "boneGrimoire", ring: "cryptRing" }, data.equipment || {});
    this.unlockedSkills = Object.assign(Object.create(null), data.unlockedSkills || {});
    this.skillPoints = data.skillPoints || 0;
    this.reputation = Object.assign(this.defaultReputation(), data.reputation || {});
    this.tutorialCaptureDone = Boolean(data.tutorialCaptureDone);
    this.dragonSignalSeen = Boolean(data.dragonSignalSeen);
    this.servants = (data.servants || []).map(this.deserializeServant.bind(this));
    this.reserveServants = (data.reserveServants || []).map(this.deserializeServant.bind(this));
    this.projectiles = [];
    this.souls = [];
    this.effects = [];
    this.texts = [];
    this.respawnTimers = { common: 0, elite: 0 };
    this.setupWorld();
    if (this.bossDefeated && this.boss) this.boss.dead = true;
    this.applyAllBonuses();
    this.lastSaveStatus = "Save carregado";
    this.areaTitle = this.map.current.name;
    this.areaTitleTimer = 3;
    this.portalCooldown = 1;
    this.screen = "team";
    this.message("Save carregado. Revise a equipe antes de explorar.", true);
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
    this.inventory["Fragmento de Alma"] = this.player.fragments;
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
    if (this.screen !== "map") {
      this.messages.forEach(function (msg) { msg.life -= dt; });
      this.messages = this.messages.filter(function (msg) { return msg.life > 0; });
      this.camera = this.map.getCameraFor(this.player.x, this.player.y, { width: this.viewWidth, height: this.viewHeight });
      return;
    }
    this.player.update(dt, this);
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
    if (this.input.consume("menu")) this.openScreen("mainMenu");
    if (this.input.consume("save")) this.saveGame();
    if (this.input.consume("deleteSave")) this.deleteSave();
    if (this.input.consume("manage")) this.openScreen("team");
    if (this.input.consume("inventory")) this.openScreen("inventory");
    if (this.input.consume("skills")) this.openScreen("skills");
    if (this.input.consume("start")) {
      if (this.screen === "mainMenu") this.confirmMainMenu();
      else if (this.screen === "controls" || this.screen === "credits") this.screen = "mainMenu";
      else this.enterMap();
    }
    if (this.input.consume("fusion")) this.fuseSelectedKind();

if (this.screen !== "map") {
      if (this.input.consume("command")) this.nextMenuSelection();
      if (this.input.consume("capture") || this.input.consume("attack")) this.confirmMenuAction();
      if (this.input.consume("skill1")) this.selectedSkill = 0;
      if (this.input.consume("skill2")) this.selectedSkill = 1;
      if (this.input.consume("skill3")) {
        if (this.screen === "team") this.sendActiveToReserve();
        else this.selectedSkill = 2;
      }
      if (this.input.consume("skill4")) this.fuseSelectedKind();
      if (this.screen === "account") {
        if (this.input.consume("start") || this.input.consume("inventory")) this.openScreen("mainMenu");
        if (window.AuthService && (this.input.consume("skill1") || this.input.consume("menu"))) {
          if (window.AuthService.isLoggedIn()) {
            window.AuthService.signOut();
            this.message("Deslogado.");
          } else {
            window.AuthService.signInWithMock();
            this.message("Logado como Convidado.");
          }
        }
        if (window.SyncManager && this.input.consume("skill2")) {
          window.SyncManager.syncNow();
          this.message("Sincronizando...");
        }
        if ((this.input.consume("save")) && window.SaveManager) {
          var exported = window.SaveManager.exportSave();
          if (exported) {
            this.message("Save exportado para console.");
            console.log("=== EXPORTED SAVE ===");
            console.log(exported);
            console.log("====================");
          }
        }
        if ((this.input.consume("inventory")) && window.SaveManager) {
          // Import handled via paste in console for now
          this.message("Para importar, use SaveManager.importSave(JSON) no console.");
        }
        if (this.input.consume("deleteSave")) this.deleteSave();
        return;
      }
      return;
    }

    var move = this.input.getMoveVector();
    this.player.move(move.x, move.y, this.player.speed, dt, this.map);

    if (this.input.consume("attack")) this.castAttack();
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
    if (screen === "mainMenu") this.message("Menu principal: CMD alterna, CAP confirma.");
    if (screen === "team") this.message("Gerenciamento: CMD alterna reserva, CAP ativa/remove, F funde repetidos.");
    if (screen === "inventory") this.message("Inventario aberto. Mapa/Enter retorna ao jogo.");
    if (screen === "skills") this.message("Habilidades: CMD alterna, CAP compra com pontos.");
  };

  NecromancerGame.prototype.enterMap = function () {
    this.screen = "map";
    this.portalCooldown = Math.max(this.portalCooldown, 0.6);
    if (!this.enteredMap) {
      this.enteredMap = true;
      this.message("Equipe definida. Capture novas almas para expandir a reserva.", true);
      this.markMapVisited(this.currentMapId);
    }
  };

  NecromancerGame.prototype.getWorldFlags = function () {
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
      this.selectedReserve = (this.selectedReserve + 1) % Math.max(1, this.reserveServants.length);
    } else if (this.screen === "skills") {
      this.selectedSkill = (this.selectedSkill + 1) % cfg.skillTree.length;
    } else if (this.screen === "inventory") {
      var equipmentKeys = Object.keys(cfg.equipment);
      this.selectedEquipment = (this.selectedEquipment + 1) % equipmentKeys.length;
    } else if (this.screen === "account") {
      // Cycle through action buttons using selection state
      this.selectedEquipment = (this.selectedEquipment + 1) % 4;
    }
  };

  NecromancerGame.prototype.confirmMenuAction = function () {
    if (this.screen === "mainMenu") this.confirmMainMenu();
    else if (this.screen === "team") this.toggleSelectedReserve();
    else if (this.screen === "skills") this.unlockSelectedSkill();
    else if (this.screen === "inventory") this.equipSelectedItem();
    else if (this.screen === "controls" || this.screen === "credits") this.screen = "mainMenu";
  };

NecromancerGame.prototype.getMainMenuOptions = function () {
    var options = ["Novo Jogo"];
    if (this.hasSave()) options.push("Continuar");
    options.push("Conta", "Controles", "Creditos", "Apagar Save");
    return options;
  };

NecromancerGame.prototype.confirmMainMenu = function () {
    var option = this.getMainMenuOptions()[this.selectedMenu] || "Novo Jogo";
    if (option === "Novo Jogo") this.newGame();
    else if (option === "Continuar") this.loadGame();
    else if (option === "Conta") this.openScreen("account");
    else if (option === "Controles") this.screen = "controls";
    else if (option === "Creditos") this.screen = "credits";
    else if (option === "Apagar Save") this.deleteSave();
  };

  NecromancerGame.prototype.toggleSelectedReserve = function () {
    if (this.reserveServants.length === 0) {
      this.message("Reserva vazia.");
      return;
    }
    var servant = this.reserveServants[this.selectedReserve];
    if (!servant) return;
    if (this.servants.filter(function (s) { return !s.destroyed; }).length >= this.player.soulControl) {
      var returned = this.servants.pop();
      returned.dead = false;
      returned.destroyed = false;
      this.reserveServants.push(returned);
    }
    this.reserveServants.splice(this.selectedReserve, 1);
    servant.dead = false;
    servant.destroyed = false;
    servant.hp = servant.maxHp;
    servant.x = this.player.x - 0.8 + this.servants.length * 0.7;
    servant.y = this.player.y + 0.9;
    this.servants.push(servant);
    this.selectedReserve = Math.min(this.selectedReserve, Math.max(0, this.reserveServants.length - 1));
    this.message(servant.name + " entrou na equipe ativa.");
  };

  NecromancerGame.prototype.sendActiveToReserve = function () {
    if (this.servants.length === 0) return;
    var servant = this.servants.pop();
    servant.dead = false;
    servant.destroyed = false;
    this.reserveServants.push(servant);
    this.message(servant.name + " voltou para a reserva.");
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
    if (this.skillPoints < node.cost) {
      this.message("Pontos de habilidade insuficientes para " + node.path + ".");
      return;
    }
    this.skillPoints -= node.cost;
    this.unlockedSkills[node.id] = true;
    if (node.id === "invocador") {
      this.allServants().forEach(function (servant) {
        servant.maxHp += 18;
        servant.hp += 18;
      });
    } else if (node.id === "estrategista") {
      this.allServants().forEach(function (servant) {
        servant.defense += 1;
        servant.protectBias += 0.25;
      });
    }
    this.applyAllBonuses();
    this.saveGame();
    this.message("Talento desbloqueado: " + node.name + ".", true);
  };

  NecromancerGame.prototype.addItem = function (name, amount) {
    if (!amount) return;
    this.inventory[name] = (this.inventory[name] || 0) + amount;
    this.itemNotice = "+" + amount + " " + name;
    this.itemNoticeTimer = 3;
  };

  NecromancerGame.prototype.applySkillBonusesToServant = function (servant) {
    if (this.unlockedSkills.invocador) {
      servant.maxHp += 18;
      servant.hp = Math.min(servant.maxHp, servant.hp + 18);
    }
    if (this.equipment.ring === "cryptRing") {
      servant.maxHp += 10;
      servant.hp = Math.min(servant.maxHp, servant.hp + 10);
    }
    if (this.unlockedSkills.estrategista) {
      servant.defense += 1;
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
    if (this.equipment.weapon === "crackedStaff") this.magicDamageBonus += 5;
    if (this.equipment.tome === "boneGrimoire") this.captureBonus += 0.1;
    if (this.equipment.ring === "cryptRing") this.servantHpBonus += 10;
    if (this.unlockedSkills.ceifador) cfg.skills.skill1.damage = 30;
    else cfg.skills.skill1.damage = 20;
    if (this.unlockedSkills.senhor_almas) this.captureBonus += 0.12;
    if (this.unlockedSkills.estrategista) this.commandEfficiency = 1.25;
    if (this.unlockedSkills.invocador) this.servantHpBonus += 18;
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
      damage: skill.damage + this.magicDamageBonus,
      life: skill.range / skill.speed,
      color: "#a972ff"
    }));
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
    if (!success) {
      soul.dead = true;
      this.player.fragments += Math.max(1, Math.floor(soul.fragments * 0.5));
      this.message("A alma resistiu. Fragmentos residuais absorvidos.");
      return;
    }

    var kind = this.servantKindForSoul(soul);
    var servant = new window.Servant(kind, this.player.x - 0.8 + Math.random() * 1.6, this.player.y + 0.8);
    this.applySkillBonusesToServant(servant);
    if (this.servants.filter(function (s) { return !s.destroyed; }).length < this.player.soulControl) {
      this.servants.push(servant);
      this.message((this.tutorialCaptureDone ? "Servo capturado: " : "Primeira captura garantida: ") + servant.name + ".", true);
    } else {
      this.reserveServants.push(servant);
      this.message("Limite ativo cheio. " + servant.name + " foi enviado a reserva.");
    }
    this.tutorialCaptureDone = true;
    this.player.fragments += soul.fragments + 1;
    this.inventory["Fragmento de Alma"] = this.player.fragments;
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
        this.player.fragments += enemy.fragments;
        this.applyEnemyRewards(enemy);
        this.souls.push(new window.Soul(enemy));
        this.floatText("alma", enemy.x, enemy.y, "#8ff2df");
        if (enemy === this.boss) this.defeatBoss();
      }
    }.bind(this));
  };

  NecromancerGame.prototype.applyEnemyRewards = function (enemy) {
    if (enemy.type === "rat" || enemy.type === "wolf" || enemy.type === "warhound") {
      this.addItem("Osso Antigo", 1);
    } else if (enemy.type === "soldier" || enemy.type === "elite" || enemy.type === "hunter") {
      this.addItem("Osso Antigo", 2);
      this.adjustReputation("Humanos", -2);
    } else if (enemy.type === "cultist") {
      this.addItem("Nucleo Sombrio", 1);
      this.adjustReputation("Humanos", -1);
    } else if (enemy.type === "imp") {
      this.addItem("Cinza Demoniaca", 1);
      this.adjustReputation("Demonios", -2);
    } else if (enemy.type === "boss") {
      this.addItem("Nucleo Sombrio", 2);
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
