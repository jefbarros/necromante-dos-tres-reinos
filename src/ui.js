(function () {
  "use strict";

  function bar(ctx, x, y, w, h, ratio, fill, label) {
    if (window.GameArt) {
      window.GameArt.drawHealthBar(ctx, x + w * 0.5, y, w, h, ratio, fill, label);
      return;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w * Math.max(0, Math.min(1, ratio)), h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 8, y + h - 5);
  }

  function skillLabel(skill, cd, key, name) {
    if (cd > 0) return key + " " + Math.ceil(cd) + "s";
    return key + " " + name;
  }

  window.GameUI = function GameUI(game) {
    this.game = game;
    this.clickAreas = [];
    this.hoveredArea = null;
  };

  GameUI.prototype.resetHitAreas = function () {
    this.clickAreas = [];
    this.hoveredArea = null;
  };

  GameUI.prototype.beginInteractiveFrame = function () {
    this.resetHitAreas();
  };

  GameUI.prototype.addHitArea = function (id, x, y, w, h, onClick, options) {
    var area = Object.assign({}, options || {}, {
      id: id,
      x: x,
      y: y,
      w: w,
      h: h,
      onClick: onClick
    });
    return this.addClickArea(area);
  };

  GameUI.prototype.addClickArea = function (area) {
    if (!area) return false;
    this.clickAreas.push(area);
    if (this.pointInArea(this.game.pointer, area)) {
      this.hoveredArea = area;
      return true;
    }
    return false;
  };

  GameUI.prototype.pointInArea = function (point, area) {
    return point && point.x >= area.x && point.x <= area.x + area.w && point.y >= area.y && point.y <= area.y + area.h;
  };

  GameUI.prototype.hitTest = function (x, y) {
    for (var i = this.clickAreas.length - 1; i >= 0; i -= 1) {
      if (this.pointInArea({ x: x, y: y }, this.clickAreas[i])) return this.clickAreas[i];
    }
    return null;
  };

  GameUI.prototype.getHoveredHitArea = function () {
    return this.hoveredArea;
  };

  GameUI.prototype.handleCanvasClick = function (x, y) {
    var area = this.hitTest(x, y);
    if (!area) return false;
    if (area.disabled) return true;
    if (typeof area.onClick === "function") area.onClick(area);
    else if (this.game && this.game.activateClickArea) this.game.activateClickArea(area);
    return true;
  };

  GameUI.prototype.handleCanvasWheel = function (x, y, deltaY) {
    var point = { x: x, y: y };
    for (var i = this.clickAreas.length - 1; i >= 0; i -= 1) {
      var area = this.clickAreas[i];
      if (this.pointInArea(point, area) && typeof area.onWheel === "function") {
        area.onWheel(deltaY, area);
        return true;
      }
    }
    return false;
  };

  GameUI.prototype.drawButtonBox = function (ctx, x, y, w, h, selected, hovered, disabled) {
    ctx.fillStyle = disabled ? "rgba(255,255,255,0.035)" : hovered ? "rgba(159, 243, 216, 0.24)" : selected ? "rgba(117, 212, 183, 0.2)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = disabled ? "rgba(255,255,255,0.08)" : hovered || selected ? "#9ff3d8" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = hovered ? 2 : 1;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1;
  };

  GameUI.prototype.drawButton = function (ctx, label, x, y, w, h, options) {
    var opts = options || {};
    var hovered = opts.hovered || false;
    if (opts.id) {
      var areaOptions = Object.assign({}, opts.area || {}, { disabled: opts.disabled });
      hovered = this.addHitArea(opts.id, x, y, w, h, opts.onClick, areaOptions);
    }
    this.drawButtonBox(ctx, x, y, w, h, opts.selected, hovered, opts.disabled);
    ctx.fillStyle = opts.disabled ? "#78827c" : (opts.selected || hovered ? "#9ff3d8" : "#edf5ea");
    ctx.font = opts.font || "900 12px system-ui, sans-serif";
    ctx.textAlign = opts.align || "center";
    ctx.fillText(label, opts.align === "left" ? x + 12 : x + w * 0.5, y + Math.floor(h * 0.62));
    ctx.textAlign = "left";
    return hovered;
  };

  GameUI.prototype.drawCard = function (ctx, x, y, w, h, options) {
    var opts = options || {};
    ctx.fillStyle = opts.disabled ? "rgba(255,255,255,0.035)" : opts.selected ? "rgba(117, 212, 183, 0.17)" : opts.hovered ? "rgba(159, 243, 216, 0.14)" : "rgba(255,255,255,0.055)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = opts.rarityColor || (opts.disabled ? "rgba(255,255,255,0.08)" : opts.selected || opts.hovered ? "#9ff3d8" : "rgba(255,255,255,0.13)");
    ctx.lineWidth = opts.selected || opts.hovered ? 2 : 1;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1;
  };

  GameUI.prototype.drawTabs = function (ctx, tabs, activeKey, x, y, w, h, onSelect) {
    var gap = 8;
    var tabW = Math.max(82, (w - gap * (tabs.length - 1)) / Math.max(1, tabs.length));
    tabs.forEach(function (tab, index) {
      var tx = x + index * (tabW + gap);
      this.drawButton(ctx, tab.label, tx, y, tabW, h, {
        id: "tab-" + tab.key,
        selected: tab.key === activeKey,
        onClick: function () { onSelect(tab.key); },
        area: { screen: this.game.screen, action: tab.action || "tab", tab: tab.key }
      });
    }.bind(this));
  };

  GameUI.prototype.drawScrollIndicator = function (ctx, x, y, w, h, offset, total, visible) {
    if (total <= visible) return;
    var trackH = Math.max(24, h);
    var thumbH = Math.max(20, trackH * (visible / total));
    var maxOffset = Math.max(1, total - visible);
    var thumbY = y + (trackH - thumbH) * Math.max(0, Math.min(1, offset / maxOffset));
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x, y, w, trackH);
    ctx.fillStyle = "#9ff3d8";
    ctx.fillRect(x, thumbY, w, thumbH);
  };

  GameUI.prototype.drawPanel = function (ctx, x, y, w, h) {
    if (window.GameArt) {
      window.GameArt.drawPanel(ctx, x, y, w, h);
      return;
    }
    ctx.fillStyle = "rgba(7, 10, 14, 0.64)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(227, 241, 226, 0.16)";
    ctx.strokeRect(x, y, w, h);
  };

  GameUI.prototype.draw = function (ctx, canvas) {
    var game = this.game;
    var player = game.player;
    var width = canvas.width;
    this.beginInteractiveFrame();
    var compact = width < 760 || canvas.height < 520;

    var hudW = compact ? Math.min(292, width - 24) : Math.min(430, width - 24);
    this.drawPanel(ctx, 12, 12, hudW, compact ? 92 : 116);
    bar(ctx, 24, 26, compact ? 152 : 190, 18, player.hp / player.maxHp, "#76df95", "Vida " + Math.ceil(player.hp) + "/" + player.maxHp);
    bar(ctx, 24, 51, compact ? 152 : 190, 16, player.mana / player.maxMana, "#68a9ff", "Mana " + Math.floor(player.mana) + "/" + player.maxMana);
    bar(ctx, 24, 75, compact ? 152 : 190, 14, player.exp / player.expToNext, "#d6bf61", "Nv " + player.level);

ctx.fillStyle = "#ecf4dc";
    ctx.font = compact ? "700 11px system-ui, sans-serif" : "700 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    var infoX = compact ? 190 : 232;
    ctx.fillText("Frag: " + player.fragments, infoX, 34);
    ctx.fillText("Dom: " + player.necroDomain.toFixed(1), infoX, 56);
    ctx.fillText("Ctrl: " + game.servants.filter(function (s) { return !s.destroyed; }).length + "/" + player.soulControl, infoX, 78);
    if (!compact) {
      ctx.fillText("Ordem: " + game.servantCommand, 232, 101);
      ctx.fillStyle = game.skillPoints > 0 ? "#ffe58a" : "#b9cbc0";
      ctx.fillText("Pontos: " + game.skillPoints, 330, 101);
    }
    ctx.fillStyle = game.autoAttackEnabled ? "#9ff3d8" : "#b9cbc0";
    ctx.fillText("Auto-ataque: " + (game.autoAttackEnabled ? "ON" : "OFF"), compact ? 190 : 232, compact ? 101 : 122);

    // Draw sync/platform status indicator
    this.drawSyncStatus(ctx, 12, compact ? 108 : 130, width);
    this.drawObjectiveStatus(ctx, 12, compact ? 136 : 158, compact ? Math.min(292, width - 24) : Math.min(430, width - 24), compact);
    this.drawQuickBar(ctx, canvas, compact);

    var zone = game.map.current.name;
    this.drawPanel(ctx, Math.max(12, width - (compact ? 214 : 312)), 12, compact ? 202 : 300, 58);
    ctx.fillStyle = "#eaf1e2";
    ctx.font = "800 15px system-ui, sans-serif";
    ctx.fillText(zone, Math.max(24, width - (compact ? 202 : 300)), 35);
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("Save: " + game.lastSaveStatus, Math.max(24, width - (compact ? 202 : 300)), 56);

    if (game.nearbyContext && game.screen === "map") {
      this.drawPanel(ctx, Math.max(12, width * 0.5 - 160), 84, 320, 58);
      ctx.textAlign = "center";
      if (game.nearbyContext.kind === "portal") {
        var unlocked = game.map.isPortalUnlocked(game.nearbyContext.portal, game.getWorldFlags());
        ctx.fillStyle = unlocked ? "#9ff3d8" : "#f1b2bf";
        ctx.font = "900 15px system-ui, sans-serif";
        ctx.fillText("Portal: " + game.map.getPortalDisplayName(game.nearbyContext.portal, game.getWorldFlags()), width * 0.5, 108);
        ctx.font = "800 12px system-ui, sans-serif";
        ctx.fillStyle = "#d9e6dc";
        ctx.fillText(unlocked ? "Pressione E ou Entrar" : (game.nearbyContext.portal.lockedMessage || "Portal bloqueado"), width * 0.5, 128);
      } else {
        ctx.fillStyle = "#fff1ac";
        ctx.font = "900 15px system-ui, sans-serif";
        ctx.fillText(game.nearbyContext.point.label, width * 0.5, 108);
        ctx.font = "800 12px system-ui, sans-serif";
        ctx.fillStyle = "#d9e6dc";
        ctx.fillText("Pressione E ou Interagir", width * 0.5, 128);
      }
      ctx.textAlign = "left";
    }

    var soul = game.findNearestSoul();
    if (soul) {
      var chance = game.getCaptureChance(soul);
      this.drawPanel(ctx, Math.max(12, width * 0.5 - 150), 84, 300, 58);
      ctx.fillStyle = chance >= 1 ? "#fff0a0" : "#8ff1dc";
      ctx.font = "800 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(chance >= 1 ? "Captura tutorial garantida" : "Chance de captura: " + Math.round(chance * 100) + "%", width * 0.5, 108);
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillStyle = "#d9e6dc";
      ctx.fillText("C / CAP perto da alma: " + soul.name, width * 0.5, 128);
      ctx.textAlign = "left";
    }

    if (game.boss && !game.boss.dead && game.boss.engaged) {
      var bw = Math.min(520, width - 40);
      this.drawPanel(ctx, width * 0.5 - bw * 0.5, canvas.height - 40, bw, 24);
      bar(ctx, width * 0.5 - bw * 0.5 + 8, canvas.height - 33, bw - 16, 10, game.boss.hp / game.boss.maxHp, "#c36af0", "Guardiao de Tumba");
    }

    this.drawMessages(ctx, canvas);
    this.drawNotices(ctx, canvas);
    if (game.screen === "map") this.drawMinimap(ctx, canvas);
    this.drawAreaTitle(ctx, canvas);
    this.drawSkillStrip(ctx, canvas);
    if (game.screen !== "map") this.drawMenuOverlay(ctx, canvas);
    if (game.canvas && game.canvas.style) game.canvas.style.cursor = this.hoveredArea ? "pointer" : "default";
  };

  GameUI.prototype.drawQuickBar = function (ctx, canvas, compact) {
    var game = this.game;
    var buttons = [
      { label: "Menu", target: "mainMenu", screens: ["mainMenu", "controls", "credits", "loadSave", "account"] },
      { label: "Equipe", target: "team", screens: ["team"] },
      { label: "Invent.", target: "inventory", screens: ["inventory"] },
      { label: "Talentos", target: "skills", screens: ["skills"] },
      { label: "Mapa", target: "map", screens: ["worldMap"] }
    ];
    var bw = compact ? 42 : 76;
    var bh = compact ? 28 : 30;
    var gap = compact ? 5 : 8;
    var totalW = buttons.length * bw + (buttons.length - 1) * gap;
    var x = compact ? Math.max(8, canvas.width - bw - 10) : Math.max(12, canvas.width * 0.5 - totalW * 0.5);
    var y = compact ? 142 : 12;
    buttons.forEach(function (button, index) {
      var bx = compact ? x : x + index * (bw + gap);
      var by = compact ? y + index * (bh + gap) : y;
      var active = button.screens.indexOf(game.screen) >= 0;
      this.drawButton(ctx, compact ? button.label.slice(0, 4) : button.label, bx, by, bw, bh, {
        id: "quick-" + button.target,
        selected: active,
        font: compact ? "900 10px system-ui, sans-serif" : "900 12px system-ui, sans-serif",
        onClick: function () { game.openQuickScreen(button.target); },
        area: { action: "quickScreen", target: button.target }
      });
    }.bind(this));
  };

  GameUI.prototype.drawAreaTitle = function (ctx, canvas) {
    var game = this.game;
    if (game.areaTitleTimer <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, game.areaTitleTimer / 1.2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f1ead1";
    ctx.font = "900 28px system-ui, sans-serif";
    ctx.strokeStyle = "rgba(0,0,0,0.82)";
    ctx.lineWidth = 5;
    ctx.strokeText(game.areaTitle, canvas.width * 0.5, 70);
    ctx.fillText(game.areaTitle, canvas.width * 0.5, 70);
    ctx.restore();
  };

  GameUI.prototype.drawMinimap = function (ctx, canvas) {
    var game = this.game;
    var map = game.map;
    var compact = canvas.width < 720 || canvas.height < 520;
    var w = compact ? 112 : 156;
    var h = compact ? 88 : 122;
    var x = Math.max(12, canvas.width - w - 12);
    var y = compact ? 74 : 78;
    var pad = 10;
    var sx = (w - pad * 2) / Math.max(1, map.cols);
    var sy = (h - pad * 2) / Math.max(1, map.rows);
    function mx(px) { return x + pad + px * sx; }
    function my(py) { return y + pad + py * sy; }

    ctx.save();
    this.drawPanel(ctx, x, y, w, h);
    ctx.fillStyle = "rgba(222, 235, 220, 0.06)";
    ctx.fillRect(x + pad, y + pad, w - pad * 2, h - pad * 2);
    ctx.strokeStyle = "rgba(225, 238, 226, 0.18)";
    ctx.strokeRect(x + pad, y + pad, w - pad * 2, h - pad * 2);

    (map.zones || []).forEach(function (zone) {
      ctx.fillStyle = zone.color || "rgba(160,160,160,0.22)";
      ctx.fillRect(mx(zone.x), my(zone.y), Math.max(3, zone.w * sx), Math.max(3, zone.h * sy));
    });

    var spawn = map.current.spawns && (map.current.spawns.renascimento || map.current.spawns.default);
    if (spawn) {
      ctx.fillStyle = "#76df95";
      ctx.beginPath();
      ctx.rect(mx(spawn.x) - 3, my(spawn.y) - 3, 6, 6);
      ctx.fill();
    }

    var flags = game.getWorldFlags();
    (map.portals || []).forEach(function (portal) {
      var near = Math.hypot(portal.x - game.player.x, portal.y - game.player.y) <= 8;
      var unlocked = map.isPortalUnlocked(portal, flags);
      ctx.fillStyle = unlocked ? "#7df0cd" : "#d36c84";
      ctx.globalAlpha = near ? 1 : 0.55;
      ctx.beginPath();
      ctx.moveTo(mx(portal.x), my(portal.y) - 4);
      ctx.lineTo(mx(portal.x) + 4, my(portal.y) + 4);
      ctx.lineTo(mx(portal.x) - 4, my(portal.y) + 4);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (game.boss && !game.boss.dead) {
      ctx.fillStyle = "#c36af0";
      ctx.beginPath();
      ctx.arc(mx(game.boss.x), my(game.boss.y), 4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (flags.secretUnlocked && map.currentId === "cemiterio_neutro") {
      var secretPortal = (map.portals || []).find(function (portal) { return portal.targetMap === "area_secreta_cripta"; });
      if (secretPortal) {
        ctx.strokeStyle = "#94d7ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(mx(secretPortal.x) - 5, my(secretPortal.y) - 5, 10, 10);
      }
    }

    ctx.fillStyle = "#f1ead1";
    ctx.beginPath();
    ctx.arc(mx(game.player.x), my(game.player.y), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#11151c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#dfe9d9";
    ctx.font = "800 10px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Mapa", x + 8, y + 13);
    ctx.restore();
  };

  GameUI.prototype.drawNotices = function (ctx, canvas) {
    var game = this.game;
    ctx.textAlign = "right";
    ctx.font = "800 13px system-ui, sans-serif";
    if (game.itemNoticeTimer > 0) {
      ctx.fillStyle = "#f1d57a";
      ctx.fillText("Item: " + game.itemNotice, canvas.width - 24, 92);
    }
    if (game.reputationNoticeTimer > 0) {
      ctx.fillStyle = "#9fd8ff";
      ctx.fillText("Reputacao: " + game.reputationNotice, canvas.width - 24, 113);
    }
    ctx.textAlign = "left";
  };

  GameUI.prototype.drawMessages = function (ctx, canvas) {
    var messages = this.game.messages.slice(0, 4);
    ctx.textAlign = "center";
    messages.forEach(function (msg, index) {
      ctx.globalAlpha = Math.min(1, msg.life);
      ctx.fillStyle = msg.important ? "#ffe698" : "#edf5ea";
      ctx.font = msg.important ? "900 18px system-ui, sans-serif" : "800 15px system-ui, sans-serif";
      ctx.strokeStyle = "rgba(0,0,0,0.82)";
      ctx.lineWidth = 4;
      var y = 162 + index * 25;
      ctx.strokeText(msg.text, canvas.width * 0.5, y);
      ctx.fillText(msg.text, canvas.width * 0.5, y);
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = "left";
  };

  GameUI.prototype.drawSkillStrip = function (ctx, canvas) {
    var player = this.game.player;
    var labels = [
      skillLabel("attack", player.cooldowns.attack, "1", "Ataque"),
      skillLabel("skill1", player.cooldowns.skill1, "2", "Dreno"),
      skillLabel("skill2", player.cooldowns.skill2, "3", "Lanca"),
      skillLabel("skill3", player.cooldowns.skill3, "4", "Marca"),
      skillLabel("skill4", player.cooldowns.skill4, "5", "Explosao"),
      "R Auto " + (this.game.autoAttackEnabled ? "ON" : "OFF"),
      "C Capturar",
      "Q Ordem"
    ];
    var cellW = Math.min(104, Math.max(74, (canvas.width - 36) / labels.length));
    var y = canvas.height - 82;
    var startX = Math.max(12, canvas.width * 0.5 - (cellW * labels.length) * 0.5);
    ctx.font = "800 11px system-ui, sans-serif";
    labels.forEach(function (label, index) {
      var x = startX + index * cellW;
      ctx.fillStyle = "rgba(8, 12, 16, 0.48)";
      ctx.fillRect(x, y, cellW - 6, 24);
      ctx.strokeStyle = "rgba(255,255,255,0.13)";
      ctx.strokeRect(x, y, cellW - 6, 24);
      ctx.fillStyle = "#edf6e9";
      ctx.textAlign = "center";
      ctx.fillText(label, x + (cellW - 6) * 0.5, y + 16);
    });
    ctx.textAlign = "left";
  };

  GameUI.prototype.drawMenuOverlay = function (ctx, canvas) {
    var game = this.game;
    var compact = canvas.width < 760 || canvas.height < 520;
    var panelW = Math.min(compact ? canvas.width - 16 : 760, canvas.width - 28);
    var panelH = Math.min(compact ? canvas.height - 58 : 430, canvas.height - 82);
    var x = canvas.width * 0.5 - panelW * 0.5;
    var y = compact ? 46 : 78;
    ctx.fillStyle = "rgba(5, 8, 12, 0.9)";
    ctx.fillRect(x, y, panelW, panelH);
    ctx.strokeStyle = "rgba(220, 241, 230, 0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, panelW, panelH);
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 22px system-ui, sans-serif";
    ctx.textAlign = "left";

if (game.screen === "mainMenu") this.drawMainMenu(ctx, x, y, panelW, panelH);
    if (game.screen === "controls") this.drawControls(ctx, x, y, panelW, panelH);
    if (game.screen === "credits") this.drawCredits(ctx, x, y, panelW, panelH);
    if (game.screen === "team") this.drawTeamScreen(ctx, x, y, panelW, panelH);
    if (game.screen === "inventory") this.drawInventoryScreen(ctx, x, y, panelW, panelH);
if (game.screen === "skills") this.drawSkillTreeScreen(ctx, x, y, panelW, panelH);
    if (game.screen === "account") this.drawAccountScreen(ctx, x, y, panelW, panelH);
    if (game.screen === "loadSave") this.drawLoadSaveScreen(ctx, x, y, panelW, panelH);
    if (game.screen === "worldMap") this.drawWorldMap(ctx, x, y, panelW, panelH);
  };

  GameUI.prototype.drawMainMenu = function (ctx, x, y, w, h) {
    var game = this.game;
    var options = game.getMainMenuOptions();
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 26px system-ui, sans-serif";
    ctx.fillText("Necromante dos Tres Reinos", x + 24, y + 42);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
ctx.fillText("v" + window.GameConfig.version + " - Menu concentra Conta e Salvar/Carregar; 1 ataca, R alterna auto-ataque.", x + 24, y + 68);
    options.forEach(function (option, index) {
      var selected = index === game.selectedMenu;
      var bx = x + 42;
      var by = y + 105 + index * 48;
      var bw = Math.min(360, w - 84);
      var hovered = this.addClickArea({
        screen: "mainMenu",
        x: bx,
        y: by,
        w: bw,
        h: 36,
        action: "mainMenu",
        select: function () { game.selectedMenu = index; }
      });
      this.drawButtonBox(ctx, bx, by, bw, 36, selected, hovered, false);
      ctx.fillStyle = selected || hovered ? "#9ff3d8" : "#edf5ea";
      ctx.font = "900 16px system-ui, sans-serif";
      ctx.fillText(option, bx + 20, by + 24);
    }.bind(this));
    this.drawReputation(ctx, x + 430, y + 118, Math.max(270, w - 460));
    ctx.fillStyle = "#dbe9e1";
    ctx.font = "700 13px system-ui, sans-serif";
    this.wrapText(ctx, "Continuar aparece quando existe save local. Novo Jogo reinicia a campanha local em memoria; use Salvar para persistir.", x + 430, y + 232, Math.max(250, w - 470), 18);
  };

  GameUI.prototype.drawControls = function (ctx, x, y, w, h) {
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("Controles", x + 24, y + 42);
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.fillStyle = "#dbe9e1";
    var lines = [
      "PC: WASD/setas move, 1/espaco ataca, 2-5 habilidades, R auto-ataque, C captura, Q comando.",
      "E interage com portal ou objeto proximo, priorizando o alvo mais perto.",
      "Menus: Esc/Menu abre/fecha Menu, M Equipe, I Inventario, K Talentos, Salvar/Carregar e Conta ficam no Menu.",
      "F10 recupera a UI se algum menu prender o input.",
      "Mobile: joystick esquerdo, botoes de acao a direita e menus no topo.",
      "Nesta tela, CAP/ATK volta ao menu principal."
    ];
    lines.forEach(function (line, index) {
      ctx.fillText(line, x + 32, y + 92 + index * 32);
    });
  };

  GameUI.prototype.drawCredits = function (ctx, x, y, w, h) {
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("Creditos", x + 24, y + 42);
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.fillStyle = "#dbe9e1";
    this.wrapText(ctx, "ProtÃ³tipo original criado em HTML5, JavaScript e Canvas. Visual simbÃ³lico feito apenas com formas, texto e particulas simples, sem assets externos obrigatorios.", x + 32, y + 92, w - 64, 22);
    ctx.fillText("CAP/ATK volta ao menu principal.", x + 32, y + 190);
  };

  GameUI.prototype.drawTeamScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    var compact = w < 650 || h < 390;
    ctx.fillText("Gerenciamento de Servos", x + 22, y + 34);
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("M abre equipe, clique seleciona, roda move a reserva. CMD troca coluna, 2 substitui, 3 remove.", x + 22, y + 58);

    var activeLimit = Math.min(3, game.player.soulControl);
    var leftW = compact ? w - 48 : Math.floor(w * 0.45);
    var rightX = compact ? x + 24 : x + leftW + 42;
    var rightW = compact ? w - 48 : w - leftW - 66;
    var topY = y + 86;
    ctx.font = "900 15px system-ui, sans-serif";
    ctx.fillStyle = game.teamColumn === "active" ? "#9ff3d8" : "#e7f0df";
    ctx.fillText("Equipe ativa (" + game.servants.length + "/" + activeLimit + ")", x + 24, topY);

    for (var i = 0; i < activeLimit; i += 1) {
      var servant = game.servants[i];
      var rowY = topY + 18 + i * 62;
      var selectedActive = game.teamColumn === "active" && i === game.selectedActive;
      var hoveredActive = this.addClickArea({
        screen: "team",
        x: x + 24,
        y: rowY,
        w: leftW,
        h: 52,
        action: "teamSelect",
        select: function (slot) { return function () { game.teamColumn = "active"; game.selectedActive = slot; }; }(i)
      });
      this.drawCard(ctx, x + 24, rowY, leftW, 52, { selected: selectedActive, hovered: hoveredActive });
      ctx.fillStyle = servant ? servant.color : "#6f7a76";
      ctx.fillRect(x + 36, rowY + 12, 22, 22);
      ctx.fillStyle = "#edf5ea";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.fillText(servant ? servant.name : "Espaco vazio", x + 68, rowY + 20);
      ctx.fillStyle = "#b9cbc0";
      ctx.font = "700 11px system-ui, sans-serif";
      ctx.fillText(servant ? "Nv " + servant.level + " | " + game.getServantRole(servant) + " | Pwr " + game.getServantPower(servant) : "Selecione uma reserva para ocupar.", x + 68, rowY + 38);
      if (servant) {
        this.drawButton(ctx, "Remover", x + leftW - 64, rowY + 13, 74, 26, {
          id: "team-remove-" + i,
          font: "800 11px system-ui, sans-serif",
          onClick: function (slot) { return function () { game.teamColumn = "active"; game.selectedActive = slot; game.sendActiveToReserve(slot); }; }(i),
          area: { screen: "team", action: "teamRemove" }
        });
      }
    }

    var reserve = game.filteredReserveServants();
    ctx.fillStyle = game.teamColumn === "reserve" ? "#9ff3d8" : "#e7f0df";
    ctx.font = "900 15px system-ui, sans-serif";
    ctx.fillText("Reserva (" + game.reserveServants.length + ")", rightX, topY);
    var filters = [
      ["all", "Todos"], ["tank", "Tanque"], ["damage", "Dano"], ["fast", "Rapido"], ["support", "Magico"]
    ];
    filters.forEach(function (filter, index) {
      var fx = rightX + index * Math.min(72, rightW / 5);
      this.drawButton(ctx, filter[1], fx, topY + 10, Math.min(66, rightW / 5 - 4), 24, {
        id: "reserve-filter-" + filter[0],
        selected: game.reserveFilter === filter[0],
        font: "800 10px system-ui, sans-serif",
        onClick: function () { game.setReserveFilter(filter[0]); },
        area: { screen: "team", action: "reserveFilter", filter: filter[0] }
      });
    }.bind(this));
    var sorts = [["power", "Poder"], ["level", "Nivel"], ["type", "Tipo"]];
    sorts.forEach(function (sort, index) {
      this.drawButton(ctx, sort[1], rightX + index * 64, topY + 40, 58, 24, {
        id: "reserve-sort-" + sort[0],
        selected: game.reserveSort === sort[0],
        font: "800 10px system-ui, sans-serif",
        onClick: function () { game.setReserveSort(sort[0]); },
        area: { screen: "team", action: "reserveSort", sort: sort[0] }
      });
    }.bind(this));

    var reserveY = topY + 72;
    var rowH = 46;
    var visibleRows = Math.max(1, Math.floor((y + h - 142 - reserveY) / rowH));
    var maxScroll = Math.max(0, reserve.length - visibleRows);
    game.reserveScroll = Math.max(0, Math.min(maxScroll, game.reserveScroll || 0));
    this.addClickArea({
      screen: "team",
      x: rightX,
      y: reserveY,
      w: rightW,
      h: visibleRows * rowH,
      action: "teamSelect",
      onWheel: function (delta) { game.scrollReserve(delta, visibleRows); }
    });
    for (var r = 0; r < visibleRows; r += 1) {
      var reserveIndex = (game.reserveScroll || 0) + r;
      var res = reserve[reserveIndex];
      var ry = reserveY + r * rowH;
      var selected = game.teamColumn === "reserve" && reserveIndex === game.selectedReserve;
      var hoveredReserve = this.addClickArea({
        screen: "team",
        x: rightX,
        y: ry,
        w: rightW - 12,
        h: 38,
        action: "teamSelect",
        select: function (slot) { return function () { game.teamColumn = "reserve"; game.selectedReserve = slot; }; }(reserveIndex)
      });
      this.drawCard(ctx, rightX, ry, rightW - 12, 38, { selected: selected, hovered: hoveredReserve, disabled: !res });
      if (res) {
        ctx.fillStyle = res.color;
        ctx.fillRect(rightX + 10, ry + 10, 16, 16);
        ctx.fillStyle = selected ? "#9ff3d8" : "#edf5ea";
        ctx.font = "800 12px system-ui, sans-serif";
        ctx.fillText(res.name + " | " + game.getServantRole(res), rightX + 34, ry + 15);
        ctx.fillStyle = "#b9cbc0";
        ctx.font = "700 11px system-ui, sans-serif";
        ctx.fillText("Nv " + res.level + " | HP " + Math.ceil(res.hp) + "/" + res.maxHp + " | Pwr " + game.getServantPower(res), rightX + 34, ry + 30);
      } else {
        ctx.fillStyle = "#8d9990";
        ctx.fillText("Reserva vazia", rightX + 14, ry + 22);
      }
    }
    this.drawScrollIndicator(ctx, rightX + rightW - 8, reserveY, 5, visibleRows * rowH - 8, game.reserveScroll || 0, reserve.length, visibleRows);

    var selected = game.teamColumn === "active" ? game.servants[game.selectedActive] : reserve[game.selectedReserve];
    var detailY = y + h - 108;
    this.drawPanel(ctx, x + 24, detailY, w - 48, 72);
    if (selected) {
      ctx.fillStyle = "#dbe9e1";
      ctx.font = "900 14px system-ui, sans-serif";
      ctx.fillText(selected.name + " | " + game.getServantRole(selected), x + 38, detailY + 22);
      ctx.font = "800 11px system-ui, sans-serif";
      this.wrapText(ctx, this.servantDetails(selected), x + 38, detailY + 42, w - 230, 14);
      if (game.teamColumn === "reserve") {
        this.drawButton(ctx, "Ativar", x + w - 188, detailY + 18, 70, 28, {
          id: "team-activate-reserve",
          onClick: function () { game.activateReserveServant(reserve[game.selectedReserve]); },
          area: { screen: "team", action: "teamActivateReserve" }
        });
        this.drawButton(ctx, "Substituir", x + w - 112, detailY + 18, 86, 28, {
          id: "team-replace",
          onClick: function () { game.replaceActiveWithReserve(); },
          area: { screen: "team", action: "teamReplace" }
        });
      }
    } else {
      ctx.fillStyle = "#8d9990";
      ctx.font = "800 13px system-ui, sans-serif";
      ctx.fillText("Selecione um servo para ver detalhes e acoes.", x + 38, detailY + 34);
    }
  };

  GameUI.prototype.servantSummary = function (servant) {
    return servant.name + " | Nv " + servant.level + " HP " + Math.ceil(servant.hp) + "/" + servant.maxHp + " Pwr " + this.game.getServantPower(servant);
  };

  GameUI.prototype.servantDetails = function (servant) {
    var behavior = servant.kind === "veteran" ? "protetor" : servant.kind === "feral" ? "agressivo" : servant.kind === "ember" ? "instavel" : "obediente";
    var canEvolve = servant.kind === "skeleton" ? " evolui: sim" : " evolui: nao";
    return "Tipo " + servant.kind + " | Nivel " + servant.level + " | Vida " + Math.ceil(servant.hp) + "/" + servant.maxHp + " | Dano " + servant.damage + " | Defesa " + servant.defense + " | Poder " + this.game.getServantPower(servant) + " | Comportamento " + this.game.getServantRole(servant) + "/" + behavior + " | Estado " + servant.state + " |" + canEvolve;
  };

  GameUI.prototype.rarityColor = function (rarity) {
    if (rarity === "Raro") return "#9fc5ff";
    if (rarity === "Incomum") return "#9ff3d8";
    return "#c9d7ce";
  };

  GameUI.prototype.drawInventoryScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    var compact = w < 650 || h < 390;
    ctx.fillText("Inventario", x + 22, y + 34);
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("Clique em abas e cards. CAP usa/equipa/desequipa; roda rola a lista quando houver muitos itens.", x + 22, y + 58);
    this.drawTabs(ctx, [
      { key: "equipment", label: "Equipamentos", action: "inventoryTab" },
      { key: "consumables", label: "Consumiveis", action: "inventoryTab" },
      { key: "materials", label: "Materiais", action: "inventoryTab" }
    ], game.inventoryTab, x + 24, y + 76, Math.min(440, w - 48), 30, function (tab) { game.cycleToInventoryTab(tab); });

    var entries = game.getInventoryEntries(game.inventoryTab);
    var listX = x + 24;
    var listY = y + 122;
    var listW = compact ? w - 48 : Math.floor(w * 0.48);
    var detailX = compact ? x + 24 : listX + listW + 24;
    var detailY = compact ? y + h - 168 : listY;
    var detailW = compact ? w - 48 : w - listW - 72;
    var cardH = 58;
    var cols = compact ? 1 : 2;
    var cardW = (listW - 12 - (cols - 1) * 10) / cols;
    var rowsVisible = Math.max(1, Math.floor(((compact ? detailY - 12 : y + h - 118) - listY) / cardH));
    var maxScroll = Math.max(0, Math.ceil(entries.length / cols) - rowsVisible);
    game.inventoryScroll = Math.max(0, Math.min(maxScroll, game.inventoryScroll || 0));
    this.addClickArea({
      screen: "inventory",
      x: listX,
      y: listY,
      w: listW,
      h: rowsVisible * cardH,
      action: "inventoryItem",
      onWheel: function (delta) { game.scrollInventory(delta, rowsVisible); }
    });
    entries.forEach(function (entry, index) {
      var row = Math.floor(index / cols) - (game.inventoryScroll || 0);
      if (row < 0 || row >= rowsVisible) return;
      var col = index % cols;
      var ix = listX + col * (cardW + 10);
      var iy = listY + row * cardH;
      var selected = index === game.selectedInventory;
      var equipped = entry.section === "equipment" && window.GameConfig.equipment[entry.key] && game.equipment[window.GameConfig.equipment[entry.key].slot] === entry.key;
      var rarity = entry.section === "equipment" ? window.GameConfig.equipment[entry.key].rarity : "";
      var hovered = this.addClickArea({
        screen: "inventory",
        x: ix,
        y: iy,
        w: cardW,
        h: cardH - 8,
        action: "inventoryItem",
        select: function (slot) { return function () { game.selectedInventory = slot; }; }(index)
      });
      this.drawCard(ctx, ix, iy, cardW, cardH - 8, { selected: selected || equipped, hovered: hovered, rarityColor: this.rarityColor(rarity) });
      ctx.fillStyle = "#f1ead1";
      ctx.font = "800 13px system-ui, sans-serif";
      this.wrapText(ctx, entry.name, ix + 12, iy + 17, cardW - 24, 14);
      ctx.fillStyle = "#c9d7ce";
      ctx.font = "700 11px system-ui, sans-serif";
      if (entry.section === "equipment") ctx.fillText(rarity + " | Pwr " + window.GameConfig.equipment[entry.key].power + (equipped ? " | Equipado" : ""), ix + 12, iy + 42);
      if (entry.section === "consumables") ctx.fillText("Qtd " + entry.amount + " | Usar", ix + 12, iy + 42);
      if (entry.section === "materials") ctx.fillText("Qtd " + entry.amount + " | Material", ix + 12, iy + 42);
    }.bind(this));
    this.drawScrollIndicator(ctx, listX + listW - 6, listY, 5, rowsVisible * cardH - 10, game.inventoryScroll || 0, Math.ceil(entries.length / cols), rowsVisible);
    this.drawInventoryDetails(ctx, detailX, detailY, detailW, compact ? 154 : h - 206, entries[game.selectedInventory]);
  };

  GameUI.prototype.drawInventoryDetails = function (ctx, x, y, w, h, entry) {
    var game = this.game;
    if (!entry || w < 190) return;
    var boxH = Math.max(132, Math.min(190, h));
    this.drawPanel(ctx, x, y, w, boxH);
    ctx.fillStyle = "#edf5ea";
    ctx.font = "900 15px system-ui, sans-serif";
    ctx.fillText(entry.name, x + 14, y + 24);
    ctx.font = "700 12px system-ui, sans-serif";
    if (entry.section !== "equipment") {
      ctx.fillStyle = "#c9d7ce";
      var text = entry.section === "consumables" ? window.GameConfig.consumables[entry.key].text : "Quantidade: " + entry.amount;
      this.wrapText(ctx, text, x + 14, y + 48, w - 28, 16);
      if (entry.section === "consumables") {
        this.drawButton(ctx, "Usar", x + 14, y + boxH - 42, 78, 28, {
          id: "inventory-use",
          onClick: function () { game.confirmInventorySelection(); },
          area: { screen: "inventory", action: "inventoryItem" }
        });
      }
      return;
    }
    var item = window.GameConfig.equipment[entry.key];
    var equipped = game.equipment[item.slot] === entry.key;
    var comparison = game.getEquipmentComparison(entry.key);
    var current = window.GameConfig.equipment[comparison.currentKey];
    var lines = [
      "Slot: " + item.type + " (" + item.slot + ") | " + item.rarity + " | Poder " + item.power,
      "Bonus: " + game.getBonusText(item),
      "Estado: " + (equipped ? "Equipado" : "Nao equipado"),
      "Comparacao: " + comparison.label + (current ? " vs " + current.name : "") + " | " + comparison.detail
    ];
    lines.forEach(function (line, index) {
      ctx.fillStyle = index === 3 ? (comparison.label === "Melhora" ? "#9ff3d8" : comparison.label === "Piora" ? "#f1b2bf" : "#f3d478") : "#dbe9e1";
      ctx.font = index === 3 ? "900 12px system-ui, sans-serif" : "700 12px system-ui, sans-serif";
      this.wrapText(ctx, line, x + 14, y + 48 + index * 18, w - 28, 14);
    }.bind(this));
    ctx.fillStyle = "#b9cbc0";
    ctx.font = "700 12px system-ui, sans-serif";
    this.wrapText(ctx, item.desc || item.text, x + 14, y + boxH - 56, w - 28, 15);
    this.drawButton(ctx, equipped ? "Desequipar" : "Equipar", x + 14, y + boxH - 36, 104, 28, {
      id: "inventory-equip",
      onClick: function () { game.confirmInventorySelection(); },
      area: { screen: "inventory", action: "inventoryItem" }
    });
  };

  GameUI.prototype.drawSkillTreeScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    ctx.fillText("Arvore Inicial do Necromante", x + 22, y + 34);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("Pontos: " + game.skillPoints + " | Nivel " + game.player.level + " | clique escolhe, Desbloquear confirma.", x + 22, y + 58);

    var paths = ["Invocador", "Ceifador", "Senhor das Almas", "Estrategista Sombrio"];
    var treeX = x + 22;
    var treeY = y + 88;
    var detailH = 92;
    var nodeGap = 10;
    var colW = (w - 56) / 4;
    var nodeH = Math.max(54, Math.min(72, (h - 190) / 3 - nodeGap));
    paths.forEach(function (path, pathIndex) {
      var px = treeX + pathIndex * colW;
      ctx.fillStyle = "#e7f0df";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.fillText(path, px + 4, treeY);
      var nodes = window.GameConfig.skillTree.filter(function (node) { return node.path === path; });
      nodes.forEach(function (node, row) {
        var index = window.GameConfig.skillTree.indexOf(node);
        var nx = px + 4;
        var ny = treeY + 18 + row * (nodeH + nodeGap);
        var selected = index === game.selectedSkill;
        var unlocked = game.unlockedSkills[node.id];
        var ready = !unlocked && game.getTalentRequirementText(node).indexOf("Requer:") !== 0;
        var locked = !unlocked && !ready;
        var hovered = this.addClickArea({
          screen: "skills",
          x: nx,
          y: ny,
          w: colW - 12,
          h: nodeH,
          action: "skillSelect",
          select: function (slot) { return function () { game.selectedSkill = slot; }; }(index)
        });
        this.drawCard(ctx, nx, ny, colW - 12, nodeH, {
          selected: selected,
          hovered: hovered,
          disabled: locked,
          rarityColor: unlocked ? "#9ff3d8" : ready ? "#f3d478" : "#8e4653"
        });
        ctx.fillStyle = unlocked ? "#9ff3d8" : ready ? "#f3d478" : "#c99aa2";
        ctx.font = "900 11px system-ui, sans-serif";
        ctx.fillText(unlocked ? "Desbloqueado" : ready ? "Disponivel" : "Bloqueado", nx + 8, ny + 16);
        ctx.fillStyle = "#edf5ea";
        ctx.font = "800 12px system-ui, sans-serif";
        this.wrapText(ctx, node.name, nx + 8, ny + 34, colW - 28, 13);
        ctx.fillStyle = "#b9cbc0";
        ctx.font = "700 10px system-ui, sans-serif";
        ctx.fillText("Custo " + node.cost + " | Nv " + node.levelRequired, nx + 8, ny + nodeH - 8);
      }.bind(this));
    }.bind(this));

    var selectedNode = window.GameConfig.skillTree[game.selectedSkill] || window.GameConfig.skillTree[0];
    var detailY = y + h - detailH - 18;
    this.drawPanel(ctx, x + 24, detailY, w - 48, detailH);
    if (selectedNode) {
      var unlockedSelected = game.unlockedSkills[selectedNode.id];
      var reqText = game.getTalentRequirementText(selectedNode);
      ctx.fillStyle = "#edf5ea";
      ctx.font = "900 16px system-ui, sans-serif";
      ctx.fillText(selectedNode.name + " - " + selectedNode.path, x + 40, detailY + 24);
      ctx.fillStyle = unlockedSelected ? "#9ff3d8" : (reqText.indexOf("Requer:") === 0 ? "#f1b2bf" : "#f3d478");
      ctx.font = "900 12px system-ui, sans-serif";
      ctx.fillText(unlockedSelected ? "Desbloqueado" : reqText, x + 40, detailY + 44);
      ctx.fillStyle = "#dbe9e1";
      ctx.font = "700 12px system-ui, sans-serif";
      this.wrapText(ctx, "Efeito: " + selectedNode.text, x + 40, detailY + 64, w - 210, 15);
      this.drawButton(ctx, unlockedSelected ? "Ativo" : "Desbloquear", x + w - 160, detailY + 28, 118, 32, {
        id: "skill-unlock",
        disabled: unlockedSelected,
        onClick: function () { if (!unlockedSelected) game.unlockSelectedSkill(); },
        area: { screen: "skills", action: "skillNode" }
      });
    }
  };

  GameUI.prototype.drawReputation = function (ctx, x, y, w) {
    var game = this.game;
    var names = ["Humanos", "Demonios", "Dragoes", "Mortos-vivos"];
    ctx.font = "900 15px system-ui, sans-serif";
    ctx.fillStyle = "#e7f0df";
    ctx.fillText("Reputacao", x, y);
    names.forEach(function (name, index) {
      var value = game.reputation[name];
      var bx = x + index * (w / 4);
      var by = y + 24;
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.fillRect(bx, by, w / 4 - 16, 16);
      ctx.fillStyle = value >= 0 ? "#7bd79a" : "#e36d6d";
      var half = (w / 4 - 16) * 0.5;
      if (value >= 0) ctx.fillRect(bx + half, by, half * Math.min(1, value / 100), 16);
      else ctx.fillRect(bx + half * (1 + value / 100), by, half * Math.min(1, -value / 100), 16);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.strokeRect(bx, by, w / 4 - 16, 16);
      ctx.fillStyle = "#edf5ea";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.fillText(name + " " + value, bx, by + 34);
    });
  };

GameUI.prototype.wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    for (var i = 0; i < words.length; i += 1) {
      var test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  };

// Draw sync status indicator in HUD
  GameUI.prototype.drawSyncStatus = function (ctx, x, y, width) {
    var platform = window.PlatformService ? window.PlatformService.getPlatform() : "web";
    var deviceShort = window.PlatformService ? window.PlatformService.getShortDeviceId() : "N/A";
    var authState = window.AuthService ? window.AuthService.getStateLabel() : "Local";
    var syncStatus = window.SyncManager ? window.SyncManager.getSyncStatus() : { status: "idle", label: "Local" };

    var statusText = platform + " | " + authState;
    var syncText = syncStatus.label;

    // Colors based on status
    var syncColor = "#b9cbc0";
    if (syncStatus.status === "syncing") syncColor = "#ffe58a";
    else if (syncStatus.status === "pending") syncColor = "#f1d57a";
    else if (syncStatus.status === "conflict") syncColor = "#e36d6d";
    else if (syncStatus.status === "offline") syncColor = "#8d9990";
    else if (syncStatus.status === "idle" && window.AuthService && window.AuthService.isLoggedIn()) syncColor = "#7bd79a";

    ctx.fillStyle = "#727c76";
    ctx.font = "700 10px system-ui, sans-serif";
    ctx.fillText(statusText, x + 190, y + 10);
    ctx.fillStyle = syncColor;
    ctx.fillText(syncText, x + 190, y + 24);
  };

  GameUI.prototype.drawObjectiveStatus = function (ctx, x, y, w, compact) {
    var game = this.game;
    if (!game.getCurrentObjectiveText) return;
    var objective = game.getCurrentObjectiveText();
    var h = compact ? 58 : 66;
    this.drawPanel(ctx, x, y, w, h);
    ctx.fillStyle = objective.complete ? "#9ff3d8" : "#fff1ac";
    ctx.font = compact ? "900 11px system-ui, sans-serif" : "900 12px system-ui, sans-serif";
    ctx.fillText("Objetivo", x + 12, y + 19);
    ctx.fillStyle = "#ecf4dc";
    ctx.font = compact ? "800 12px system-ui, sans-serif" : "800 14px system-ui, sans-serif";
    this.wrapText(ctx, objective.title, x + 12, y + (compact ? 36 : 39), w - 24, compact ? 14 : 16);
    if (!compact) {
      ctx.fillStyle = "#b9cbc0";
      ctx.font = "700 11px system-ui, sans-serif";
      this.wrapText(ctx, objective.hint, x + 12, y + 57, w - 24, 13);
    }
  };

  // Account screen
  GameUI.prototype.drawAccountScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    var authState = window.AuthService ? window.AuthService.getStateLabel() : "Convidado";
    var platform = window.PlatformService ? window.PlatformService.getPlatform() : "web";
    var deviceShort = window.PlatformService ? window.PlatformService.getShortDeviceId() : "N/A";
    var syncStatus = window.SyncManager ? window.SyncManager.getSyncStatus() : { status: "idle", label: "Local" };
    var isLoggedIn = window.AuthService ? window.AuthService.isLoggedIn() : false;
    var quality = window.GameArt && window.GameArt.getQualityLabel ? window.GameArt.getQualityLabel() : "Media";

    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("Conta", x + 24, y + 42);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("ESC/M/Mapa/Enter volta ao jogo. CAP/ATK confirma a acao selecionada.", x + 24, y + 68);

    ctx.fillStyle = "#e7f0df";
    ctx.font = "800 15px system-ui, sans-serif";
    ctx.fillText("Status:", x + 24, y + 108);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(x + 24, y + 116, w - 48, 80);
    ctx.fillStyle = "#edf5ea";
    ctx.fillText("Estado: " + authState, x + 40, y + 140);
    ctx.fillText("Plataforma: " + platform, x + 40, y + 164);
    ctx.fillText("Device: " + deviceShort, x + 40, y + 188);
    ctx.fillText("Sync: " + syncStatus.label + " | Qualidade: " + quality, x + 240, y + 140);
    ctx.fillText("Modo nuvem: " + (window.CloudSaveService ? window.CloudSaveService.mode : "local"), x + 240, y + 164);

    ctx.fillStyle = "#e7f0df";
    ctx.font = "800 15px system-ui, sans-serif";
    ctx.fillText("Acoes:", x + 24, y + 220);
    var btnW = Math.min(180, (w - 72) / 3);
    var btnH = 32;
    var labels = [isLoggedIn ? "Sair" : "Entrar", "Sincronizar", "Qualidade", "Exportar", "Importar", "Apagar local"];
    labels.forEach(function (label, index) {
      var col = index % 3;
      var row = Math.floor(index / 3);
      var bx = x + 24 + col * (btnW + 8);
      var by = y + 240 + row * 42;
      var selected = index === game.selectedEquipment;
      var hovered = this.addClickArea({
        screen: "account",
        x: bx,
        y: by,
        w: btnW,
        h: btnH,
        action: "accountAction",
        select: function (slot) { return function () { game.selectedEquipment = slot; }; }(index)
      });
      this.drawButtonBox(ctx, bx, by, btnW, btnH, selected, hovered, false);
      ctx.fillStyle = selected || hovered ? "#9ff3d8" : "#edf5ea";
      ctx.font = "800 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, bx + btnW / 2, by + 20);
    }.bind(this));

    ctx.textAlign = "left";
    ctx.fillStyle = "#b9cbc0";
    ctx.font = "700 12px system-ui, sans-serif";
    this.wrapText(ctx, "Atalhos: 1 entrar/sair, 2 sincronizar, 3 qualidade, P exportar, I importar, X apagar local.", x + 24, y + h - 44, w - 48, 16);
  };

  GameUI.prototype.drawWorldMap = function (ctx, x, y, w, h) {
    var game = this.game;
    var compact = w < 600;
    var listW = compact ? w - 48 : Math.floor(w * 0.38);
    
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("Mapa do Mundo", x + 24, y + 42);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("CMD alterna regiao, CAP/ATK viaja, ESC/Voltar retorna.", x + 24, y + 68);

    window.WorldRegions.forEach(function (reg, index) {
      var selected = index === game.selectedMenu;
      var unlocked = game.isRegionUnlocked ? game.isRegionUnlocked(reg) : Boolean(game.unlockedRegions[reg.id]);
      var rx = x + 24;
      var ry = y + 92 + index * 52;
      var hovered = this.addClickArea({
        screen: "worldMap",
        x: rx,
        y: ry,
        w: listW,
        h: 44,
        action: "regionSelect",
        select: function (slot) { return function () { game.selectedMenu = slot; }; }(index)
      });
      this.drawButtonBox(ctx, rx, ry, listW, 44, selected, hovered, reg.status === "future");

      ctx.fillStyle = reg.status === "future" ? "#8d9990" : unlocked ? "#edf5ea" : "#e36d6d";
      ctx.font = "900 15px system-ui, sans-serif";
      var statusLabel = this.getRegionStatusLabel(reg, unlocked);
      ctx.fillText(reg.name, rx + 12, ry + 18);
      
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillStyle = selected || hovered ? "#9ff3d8" : "#b9cbc0";
      ctx.fillText(statusLabel + " | Nvl " + reg.level + " | " + reg.type.toUpperCase(), rx + 12, ry + 36);
      
      if (selected || hovered) {
        ctx.fillStyle = "#9ff3d8";
        ctx.fillRect(rx + 2, ry + 2, 4, 40);
      }
    }.bind(this));
    var selectedRegion = window.WorldRegions[game.selectedMenu] || window.WorldRegions[0];
    if (!compact) {
      this.drawRegionNodeMap(ctx, x + listW + 48, y + 92, w - listW - 72, 128);
    }
    this.drawSelectedRegionDetails(
      ctx,
      compact ? x + 24 : x + listW + 48,
      compact ? y + 92 + window.WorldRegions.length * 52 + 8 : y + 238,
      compact ? w - 48 : w - listW - 72,
      selectedRegion,
      game.isRegionUnlocked ? game.isRegionUnlocked(selectedRegion) : Boolean(game.unlockedRegions[selectedRegion.id])
    );
  };

  GameUI.prototype.drawRegionNodeMap = function (ctx, x, y, w, h) {
    var game = this.game;
    var positions = [
      { x: 0.18, y: 0.5 },
      { x: 0.38, y: 0.44 },
      { x: 0.58, y: 0.58 },
      { x: 0.76, y: 0.38 },
      { x: 0.88, y: 0.68 }
    ];
    this.drawPanel(ctx, x, y, w, h);
    ctx.strokeStyle = "rgba(159,243,216,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    positions.forEach(function (pos, index) {
      var px = x + pos.x * w;
      var py = y + pos.y * h;
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    window.WorldRegions.forEach(function (region, index) {
      var pos = positions[index] || positions[positions.length - 1];
      var px = x + pos.x * w;
      var py = y + pos.y * h;
      var unlocked = game.isRegionUnlocked ? game.isRegionUnlocked(region) : Boolean(game.unlockedRegions[region.id]);
      var selected = index === game.selectedMenu;
      var hovered = this.addClickArea({
        screen: "worldMap",
        x: px - 16,
        y: py - 16,
        w: 32,
        h: 32,
        action: "regionSelect",
        select: function (slot) { return function () { game.selectedMenu = slot; }; }(index)
      });
      ctx.fillStyle = region.status === "future" ? "#555e61" : unlocked ? "#7df0cd" : "#8e4653";
      ctx.globalAlpha = selected || hovered ? 1 : 0.78;
      ctx.beginPath();
      ctx.arc(px, py, selected || hovered ? 14 : 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = selected || hovered ? "#f1ead1" : "rgba(255,255,255,0.22)";
      ctx.stroke();
      ctx.fillStyle = "#dbe9e1";
      ctx.font = "800 10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(region.type.toUpperCase(), px, py + 28);
    }.bind(this));
    ctx.textAlign = "left";
  };

  GameUI.prototype.getRegionStatusLabel = function (region, unlocked) {
    if (region.status === "future") return "[FUTURO]";
    return unlocked ? "[DESBLOQUEADO]" : "[BLOQUEADO]";
  };

  GameUI.prototype.getRegionRequirementText = function (region) {
    if (this.game && this.game.player && this.game.player.level < (region.level || 1)) return "Nivel " + region.level;
    if (region.requires === "tombGuardianDefeated") return "Derrotar Guardiao de Tumba";
    if (region.requires === "futureContent") return "Expansao Futura";
    return region.requires || "Nivel insuficiente";
  };

  GameUI.prototype.drawSelectedRegionDetails = function (ctx, x, y, w, region, unlocked) {
    this.drawPanel(ctx, x, y - 18, w, 178);
    ctx.fillStyle = "#edf5ea";
    ctx.font = "900 18px system-ui, sans-serif";
    ctx.fillText(region.name, x + 14, y + 10);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    this.wrapText(ctx, region.desc, x + 14, y + 36, w - 28, 18);
    if (!unlocked && region.status !== "future") {
      ctx.fillStyle = "#e36d6d";
      ctx.font = "900 14px system-ui, sans-serif";
      ctx.fillText("Requisito: " + this.getRegionRequirementText(region), x + 14, y + 80);
    } else if (region.status === "future") {
      ctx.fillStyle = "#8d9990";
      ctx.font = "900 14px system-ui, sans-serif";
      ctx.fillText("Conteudo futuro", x + 14, y + 80);
    } else {
      ctx.fillStyle = "#9ff3d8";
      ctx.font = "900 14px system-ui, sans-serif";
      ctx.fillText((this.game.getMapState(region.id).visited ? "Visitado" : "Liberado") + " | Nivel recomendado " + region.level, x + 14, y + 80);
    }
    ctx.fillStyle = "#e7f0df";
    ctx.font = "900 14px system-ui, sans-serif";
    ctx.fillText("Pontos de Interesse:", x + 14, y + 108);
    (region.pointsOfInterest || []).forEach(function (poi, i) {
      if (i >= 3) return;
      ctx.fillStyle = "#edf5ea";
      ctx.font = "700 11px system-ui, sans-serif";
      ctx.fillText("- " + poi.name + ": " + poi.desc, x + 18, y + 130 + i * 17);
    });
    this.drawButton(ctx, region.status === "future" ? "Futuro" : unlocked ? "Viajar" : "Bloqueado", x + w - 122, y + 100, 94, 30, {
      id: "region-travel",
      disabled: region.status === "future" || !unlocked,
      onClick: function () { if (unlocked && region.status !== "future") this.game.confirmRegionTravel(); }.bind(this),
      area: { screen: "worldMap", action: "regionTravel" }
    });
  };

  GameUI.prototype.drawLoadSaveScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    var hasSave = window.SaveManager ? window.SaveManager.hasLocalSave() : this.game.hasSave();
    var save = window.LocalSaveService ? window.LocalSaveService.loadLocal() : null;
    var cloudMeta = this.game.getCloudMetadata ? this.game.getCloudMetadata() : null;
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 24px system-ui, sans-serif";
    ctx.fillText("Carregar Save", x + 24, y + 42);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("CMD alterna, CAP/ATK confirma, ESC/Mapa volta. 1 local, 2 nuvem, 3 sync, I importar, P exportar.", x + 24, y + 68);

    this.drawPanel(ctx, x + 24, y + 92, (w - 62) * 0.5, 150);
    this.drawPanel(ctx, x + 38 + (w - 62) * 0.5, y + 92, (w - 62) * 0.5, 150);
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.fillStyle = hasSave ? "#9ff3d8" : "#f1b2bf";
    ctx.fillText(hasSave ? "Save Local" : "Nao ha save local.", x + 44, y + 122);
    ctx.fillStyle = "#dbe9e1";
    this.drawSaveMeta(ctx, save, x + 44, y + 148, (w - 100) * 0.5);

    ctx.font = "800 14px system-ui, sans-serif";
    ctx.fillStyle = cloudMeta ? "#9fc5ff" : "#f1b2bf";
    ctx.fillText(cloudMeta ? "Save Nuvem/MockCloud" : "Nao ha save em nuvem.", x + 58 + (w - 62) * 0.5, y + 122);
    this.drawSaveMeta(ctx, cloudMeta, x + 58 + (w - 62) * 0.5, y + 148, (w - 100) * 0.5);

    var options = this.game.getLoadSaveOptions ? this.game.getLoadSaveOptions() : ["Voltar"];
    var btnW = Math.min(170, (w - 72) / 3);
    options.forEach(function (option, index) {
      var col = index % 3;
      var row = Math.floor(index / 3);
      var bx = x + 24 + col * (btnW + 8);
      var by = y + 264 + row * 42;
      var selected = index === this.game.selectedLoadSave;
      var hovered = this.addClickArea({
        screen: "loadSave",
        x: bx,
        y: by,
        w: btnW,
        h: 32,
        action: "loadSaveAction",
        select: function (slot) { return function () { game.selectedLoadSave = slot; }; }(index)
      });
      this.drawButtonBox(ctx, bx, by, btnW, 32, selected, hovered, false);
      ctx.fillStyle = selected || hovered ? "#9ff3d8" : "#edf5ea";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(option, bx + btnW / 2, by + 20);
    }.bind(this));
    ctx.textAlign = "left";

    if (window.SyncManager && window.SyncManager.pendingConflict) {
      this.drawConflictSummary(ctx, x + 24, y + 358, w - 48, h - 378, window.SyncManager.pendingConflict);
    }
  };

  GameUI.prototype.drawSaveMeta = function (ctx, save, x, y, maxW) {
    if (!save) return;
    var player = save.player || {};
    var updated = save.updatedAt || save.savedAt || save.cloudUploadedAt;
    var lines = [
      "Versao: " + (save.gameVersion || save.version || save.schemaVersion || "-"),
      "Mapa: " + (save.currentMapId || "-"),
      "Nivel: " + (player.level || save.playerLevel || 1) + " | Frag: " + (player.fragments || save.fragments || 0),
      "Data: " + (updated ? new Date(updated).toLocaleString() : "-"),
      "Plataforma: " + (save.platform || "-") + " | Rev: " + (save.revision || 0)
    ];
    ctx.fillStyle = "#dbe9e1";
    ctx.font = "700 12px system-ui, sans-serif";
    lines.forEach(function (line, index) {
      this.wrapText(ctx, line, x, y + index * 18, maxW, 14);
    }.bind(this));
  };

  GameUI.prototype.drawConflictSummary = function (ctx, x, y, w, h, conflict) {
    function summary(save) {
      var player = save && save.player || {};
      return {
        version: save && (save.gameVersion || save.version || save.schemaVersion) || "-",
        map: save && (save.currentMapId || (save.world && save.world.currentMapId)) || "-",
        level: player.level || 1,
        fragments: player.fragments || 0,
        updatedAt: save && save.updatedAt ? new Date(save.updatedAt).toLocaleString() : "-",
        platform: save && save.platform || "-"
      };
    }
    var local = summary(conflict.local);
    var cloud = summary(conflict.cloud);
    this.drawPanel(ctx, x, y, w, Math.max(120, h));
    ctx.fillStyle = "#ffe698";
    ctx.font = "900 16px system-ui, sans-serif";
    ctx.fillText("Encontramos dois saves diferentes.", x + 16, y + 26);
    ctx.font = "800 12px system-ui, sans-serif";
    ctx.fillStyle = "#9ff3d8";
    ctx.fillText("Save Local: v" + local.version + " | " + local.map + " | Nv " + local.level + " | Frag " + local.fragments, x + 16, y + 54);
    ctx.fillText(local.updatedAt + " | " + local.platform, x + 16, y + 72);
    ctx.fillStyle = "#9fc5ff";
    ctx.fillText("Save Nuvem: v" + cloud.version + " | " + cloud.map + " | Nv " + cloud.level + " | Frag " + cloud.fragments, x + 16, y + 100);
    ctx.fillText(cloud.updatedAt + " | " + cloud.platform, x + 16, y + 118);
  };
})();
