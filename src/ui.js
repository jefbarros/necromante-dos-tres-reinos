(function () {
  "use strict";

  function bar(ctx, x, y, w, h, ratio, fill, label) {
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
  };

  GameUI.prototype.drawPanel = function (ctx, x, y, w, h) {
    ctx.fillStyle = "rgba(7, 10, 14, 0.64)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(227, 241, 226, 0.16)";
    ctx.strokeRect(x, y, w, h);
  };

  GameUI.prototype.draw = function (ctx, canvas) {
    var game = this.game;
    var player = game.player;
    var width = canvas.width;

    this.drawPanel(ctx, 12, 12, Math.min(430, width - 24), 116);
    bar(ctx, 24, 26, 190, 18, player.hp / player.maxHp, "#76df95", "Vida " + Math.ceil(player.hp) + "/" + player.maxHp);
    bar(ctx, 24, 51, 190, 16, player.mana / player.maxMana, "#68a9ff", "Mana " + Math.floor(player.mana) + "/" + player.maxMana);
    bar(ctx, 24, 75, 190, 14, player.exp / player.expToNext, "#d6bf61", "Nv " + player.level + " EXP " + player.exp + "/" + player.expToNext);

    ctx.fillStyle = "#ecf4dc";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Fragmentos: " + player.fragments, 232, 34);
    ctx.fillText("Dominio: " + player.necroDomain.toFixed(1), 232, 56);
    ctx.fillText("Controle: " + game.servants.filter(function (s) { return !s.destroyed; }).length + "/" + player.soulControl, 232, 78);
    ctx.fillText("Ordem: " + game.servantCommand, 232, 101);
    ctx.fillStyle = game.skillPoints > 0 ? "#ffe58a" : "#b9cbc0";
    ctx.fillText("Pontos: " + game.skillPoints, 330, 101);

    var zone = game.map.current.name;
    this.drawPanel(ctx, Math.max(12, width - 312), 12, 300, 58);
    ctx.fillStyle = "#eaf1e2";
    ctx.font = "800 15px system-ui, sans-serif";
    ctx.fillText(zone, Math.max(24, width - 300), 35);
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("Save: " + game.lastSaveStatus, Math.max(24, width - 300), 56);

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
    var w = canvas.width < 720 ? 132 : 156;
    var h = canvas.width < 720 ? 104 : 122;
    var x = Math.max(12, canvas.width - w - 12);
    var y = 78;
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
      skillLabel("attack", player.cooldowns.attack, "J", "Ataque"),
      skillLabel("skill1", player.cooldowns.skill1, "1", "Dreno"),
      skillLabel("skill2", player.cooldowns.skill2, "2", "Lanca"),
      skillLabel("skill3", player.cooldowns.skill3, "3", "Marca"),
      skillLabel("skill4", player.cooldowns.skill4, "4", "Explosao"),
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
    var panelW = Math.min(760, canvas.width - 28);
    var panelH = Math.min(430, canvas.height - 112);
    var x = canvas.width * 0.5 - panelW * 0.5;
    var y = 78;
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
  };

  GameUI.prototype.drawMainMenu = function (ctx, x, y, w, h) {
    var game = this.game;
    var options = game.getMainMenuOptions();
    ctx.fillStyle = "#f3f7ef";
    ctx.font = "900 26px system-ui, sans-serif";
    ctx.fillText("Necromante dos Tres Reinos", x + 24, y + 42);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("v0.2.2 - CMD/Q alterna, CAP/C ou ATK/J confirma. X apaga save.", x + 24, y + 68);
    options.forEach(function (option, index) {
      var selected = index === game.selectedMenu;
      ctx.fillStyle = selected ? "rgba(117, 212, 183, 0.2)" : "rgba(255,255,255,0.06)";
      ctx.fillRect(x + 42, y + 105 + index * 48, Math.min(360, w - 84), 36);
      ctx.strokeStyle = selected ? "#9ff3d8" : "rgba(255,255,255,0.12)";
      ctx.strokeRect(x + 42, y + 105 + index * 48, Math.min(360, w - 84), 36);
      ctx.fillStyle = selected ? "#9ff3d8" : "#edf5ea";
      ctx.font = "900 16px system-ui, sans-serif";
      ctx.fillText(option, x + 62, y + 129 + index * 48);
    });
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
      "PC: WASD/setas move, J/espaco ataca, 1-4 habilidades, C captura, Q comando.",
      "E interage com portal ou objeto proximo, priorizando o alvo mais perto.",
      "Menus: Esc/Menu, M Equipe, I Inventario, K Habilidades, P Salvar, Enter Mapa.",
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
    this.wrapText(ctx, "Protótipo original criado em HTML5, JavaScript e Canvas. Visual simbólico feito apenas com formas, texto e particulas simples, sem assets externos obrigatorios.", x + 32, y + 92, w - 64, 22);
    ctx.fillText("CAP/ATK volta ao menu principal.", x + 32, y + 190);
  };

  GameUI.prototype.drawTeamScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    ctx.fillText("Gerenciamento de Servos", x + 22, y + 34);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("CAP/ATK ativa reserva, CMD alterna, 3 remove ultimo ativo, 4/F funde 3 iguais, Mapa/Enter entra.", x + 22, y + 58);

    ctx.font = "900 16px system-ui, sans-serif";
    ctx.fillStyle = "#e7f0df";
    ctx.fillText("Equipe ativa (" + game.servants.length + "/" + game.player.soulControl + ")", x + 24, y + 94);
    ctx.fillText("Reserva (" + game.reserveServants.length + ")", x + w * 0.52, y + 94);

    ctx.font = "700 13px system-ui, sans-serif";
    for (var i = 0; i < 3; i += 1) {
      var servant = game.servants[i];
      var rowY = y + 122 + i * 48;
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.fillRect(x + 24, rowY - 22, w * 0.43, 36);
      ctx.fillStyle = servant ? servant.color : "#6f7a76";
      ctx.fillRect(x + 34, rowY - 14, 16, 16);
      ctx.fillStyle = "#edf5ea";
      ctx.fillText(servant ? this.servantSummary(servant) : "Espaco vazio", x + 58, rowY);
    }

    var maxRows = Math.min(5, Math.max(1, game.reserveServants.length));
    for (var r = 0; r < maxRows; r += 1) {
      var res = game.reserveServants[r];
      var ry = y + 122 + r * 48;
      var selected = r === game.selectedReserve;
      ctx.fillStyle = selected ? "rgba(117, 212, 183, 0.18)" : "rgba(255,255,255,0.055)";
      ctx.fillRect(x + w * 0.52, ry - 22, w * 0.42, 36);
      if (res) {
        ctx.fillStyle = res.color;
        ctx.fillRect(x + w * 0.52 + 10, ry - 14, 16, 16);
        ctx.fillStyle = selected ? "#9ff3d8" : "#edf5ea";
        ctx.fillText(this.servantSummary(res), x + w * 0.52 + 34, ry);
      } else {
        ctx.fillStyle = "#8d9990";
        ctx.fillText("Reserva vazia", x + w * 0.52 + 14, ry);
      }
    }

    var selected = game.reserveServants[game.selectedReserve] || game.servants[0];
    if (selected) {
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.fillRect(x + 24, y + h - 148, w - 48, 44);
      ctx.fillStyle = "#dbe9e1";
      ctx.font = "800 12px system-ui, sans-serif";
      this.wrapText(ctx, this.servantDetails(selected), x + 36, y + h - 126, w - 72, 16);
    }

    this.drawReputation(ctx, x + 24, y + h - 82, w - 48);
  };

  GameUI.prototype.servantSummary = function (servant) {
    return servant.name + " | " + servant.kind + " Nv " + servant.level + " HP " + Math.ceil(servant.hp) + "/" + servant.maxHp;
  };

  GameUI.prototype.servantDetails = function (servant) {
    var behavior = servant.kind === "veteran" ? "protetor" : servant.kind === "feral" ? "agressivo" : servant.kind === "ember" ? "instavel" : "obediente";
    var canEvolve = servant.kind === "skeleton" ? " evolui: sim" : " evolui: nao";
    return "Tipo " + servant.kind + " | dano " + servant.damage + " | defesa " + servant.defense + " | personalidade " + behavior + " | estado " + servant.state + " |" + canEvolve;
  };

  GameUI.prototype.drawInventoryScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    ctx.fillText("Inventario e Reputacao", x + 22, y + 34);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("CMD alterna equipamento, CAP/ATK equipa. Drops e sinais narrativos ficam registrados aqui.", x + 22, y + 58);
    var items = Object.keys(game.inventory);
    items.forEach(function (name, index) {
      var col = index % 2;
      var row = Math.floor(index / 2);
      var ix = x + 28 + col * (w * 0.45);
      var iy = y + 102 + row * 48;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(ix, iy - 22, w * 0.38, 34);
      ctx.fillStyle = "#f1ead1";
      ctx.font = "800 14px system-ui, sans-serif";
      ctx.fillText(name + ": " + game.inventory[name], ix + 12, iy);
    });
    var equipmentKeys = Object.keys(window.GameConfig.equipment);
    equipmentKeys.forEach(function (key, index) {
      var item = window.GameConfig.equipment[key];
      var ex = x + 28 + index * ((w - 70) / 3);
      var ey = y + 245;
      var selected = index === game.selectedEquipment;
      var equipped = game.equipment[item.slot] === key;
      ctx.fillStyle = equipped ? "rgba(105, 178, 130, 0.22)" : selected ? "rgba(117, 212, 183, 0.16)" : "rgba(255,255,255,0.055)";
      ctx.fillRect(ex, ey - 24, (w - 96) / 3, 68);
      ctx.strokeStyle = selected ? "#9ff3d8" : "rgba(255,255,255,0.13)";
      ctx.strokeRect(ex, ey - 24, (w - 96) / 3, 68);
      ctx.fillStyle = "#f1ead1";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.fillText(item.name, ex + 10, ey);
      ctx.fillStyle = "#c9d7ce";
      ctx.font = "700 11px system-ui, sans-serif";
      ctx.fillText(item.text, ex + 10, ey + 20);
      ctx.fillText(equipped ? "Equipado" : "Disponivel", ex + 10, ey + 38);
    });
    this.drawReputation(ctx, x + 24, y + h - 110, w - 48);
    ctx.fillStyle = "#dbe9e1";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText("Reputacao muda por capturas, chefes, demonios e sinais draconicos.", x + 24, y + h - 24);
  };

  GameUI.prototype.drawSkillTreeScreen = function (ctx, x, y, w, h) {
    var game = this.game;
    ctx.fillText("Arvore Inicial do Necromante", x + 22, y + 34);
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillStyle = "#b9cbc0";
    ctx.fillText("CMD alterna caminho. CAP/ATK desbloqueia. Pontos disponiveis: " + game.skillPoints, x + 22, y + 58);

    window.GameConfig.skillTree.forEach(function (node, index) {
      var nx = x + 24 + index * ((w - 48) / 4);
      var ny = y + 140;
      var selected = index === game.selectedSkill;
      var unlocked = game.unlockedSkills[node.id];
      ctx.fillStyle = unlocked ? "rgba(105, 178, 130, 0.24)" : selected ? "rgba(117, 212, 183, 0.18)" : "rgba(255,255,255,0.06)";
      ctx.fillRect(nx, ny - 54, (w - 78) / 4, 168);
      ctx.strokeStyle = selected ? "#9ff3d8" : "rgba(255,255,255,0.15)";
      ctx.strokeRect(nx, ny - 54, (w - 78) / 4, 168);
      ctx.fillStyle = unlocked ? "#a7f2bf" : "#f0ead8";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.fillText(node.path, nx + 10, ny - 28);
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.fillText(node.name, nx + 10, ny - 8);
      ctx.font = "800 13px system-ui, sans-serif";
      ctx.fillStyle = "#f3d478";
      ctx.fillText((unlocked ? "Desbloqueado" : "Custo " + node.cost + " ponto"), nx + 10, ny + 16);
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillStyle = "#c9d7ce";
      this.wrapText(ctx, node.text, nx + 10, ny + 44, (w - 122) / 4, 17);
    }.bind(this));

    this.drawReputation(ctx, x + 24, y + h - 82, w - 48);
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
})();
