(function () {
  "use strict";

  var QUALITY = (window.GameConfig && window.GameConfig.visualQuality) || "medium";
  var qualityScale = QUALITY === "high" ? 1.2 : QUALITY === "low" ? 0.65 : 1;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function hash(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function tileSeed(mapId, x, y) {
    var base = 0;
    for (var i = 0; i < mapId.length; i += 1) base += mapId.charCodeAt(i) * (i + 3);
    return base + x * 37 + y * 97;
  }

  function colorMix(a, b, t) {
    function c(hex, index) {
      return parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
    }
    var r = Math.round(c(a, 0) + (c(b, 0) - c(a, 0)) * t);
    var g = Math.round(c(a, 1) + (c(b, 1) - c(a, 1)) * t);
    var bl = Math.round(c(a, 2) + (c(b, 2) - c(a, 2)) * t);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  function diamond(ctx, p, w, h, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - h * 0.5);
    ctx.lineTo(p.x + w * 0.5, p.y);
    ctx.lineTo(p.x, p.y + h * 0.5);
    ctx.lineTo(p.x - w * 0.5, p.y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawIsoShadow(ctx, x, y, w, h, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha == null ? 0.36 : alpha;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawAura(ctx, x, y, radius, color, pulse) {
    var r = radius * (1 + Math.sin(pulse || 0) * 0.08);
    var gradient = ctx.createRadialGradient(x, y, 2, x, y, r);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawRuneCircle(ctx, x, y, radius, color, pulse) {
    var tick = pulse || 0;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    for (var i = 0; i < 10; i += 1) {
      var a = i / 10 * Math.PI * 2 + tick * 0.25;
      var rx = x + Math.cos(a) * radius * 0.84;
      var ry = y + Math.sin(a) * radius * 0.36;
      ctx.beginPath();
      ctx.moveTo(rx - 3, ry);
      ctx.lineTo(rx + 3, ry);
      ctx.moveTo(rx, ry - 3);
      ctx.lineTo(rx, ry + 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFloatingLabel(ctx, text, x, y, color) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 12px system-ui, sans-serif";
    ctx.strokeStyle = "rgba(0,0,0,0.82)";
    ctx.lineWidth = 4;
    ctx.fillStyle = color || "#eafff6";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawHealthBar(ctx, x, y, w, h, ratio, fill, label) {
    ctx.save();
    ctx.fillStyle = "rgba(2, 5, 8, 0.72)";
    ctx.fillRect(x - w / 2, y, w, h);
    ctx.fillStyle = fill;
    ctx.fillRect(x - w / 2, y, w * clamp01(ratio), h);
    ctx.strokeStyle = "rgba(210, 245, 232, 0.35)";
    ctx.strokeRect(x - w / 2, y, w, h);
    if (label) {
      ctx.textAlign = "center";
      ctx.font = "800 10px system-ui, sans-serif";
      ctx.fillStyle = "#edf8ee";
      ctx.fillText(label, x, y - 3);
    }
    ctx.restore();
  }

  function mapBase(mapId) {
    if (mapId === "cemiterio_neutro") return ["#101617", "#1b221d"];
    if (mapId === "estrada_dos_enforcados") return ["#17120e", "#2a1d15"];
    if (mapId === "area_secreta_cripta") return ["#0b1118", "#172233"];
    return ["#11181c", "#202934"];
  }

  function drawIsoTile(ctx, p, w, h, mapId, x, y) {
    var colors = mapBase(mapId);
    var s = tileSeed(mapId, x, y);
    var fill = colorMix(colors[0], colors[1], hash(s));
    diamond(ctx, p, w, h, fill, "rgba(206, 231, 221, 0.08)");
    if (QUALITY === "low") return;

    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1;
    if (hash(s + 3) > 0.46) {
      ctx.beginPath();
      ctx.moveTo(p.x - w * 0.22, p.y - h * 0.05);
      ctx.lineTo(p.x - w * 0.06, p.y + h * 0.08);
      ctx.lineTo(p.x + w * 0.18, p.y + h * 0.02);
      ctx.stroke();
    }
    if (hash(s + 8) > 0.72) {
      ctx.fillStyle = mapId === "estrada_dos_enforcados" ? "rgba(66,46,31,0.45)" : "rgba(130,145,132,0.16)";
      ctx.beginPath();
      ctx.ellipse(p.x + (hash(s + 9) - 0.5) * w * 0.42, p.y + (hash(s + 10) - 0.5) * h * 0.42, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (hash(s + 12) > 0.88) {
      ctx.strokeStyle = mapId === "area_secreta_cripta" ? "rgba(112,205,255,0.35)" : "rgba(121,238,203,0.2)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBone(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale || 1, scale || 1);
    ctx.strokeStyle = "#b9b49c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.stroke();
    ctx.fillStyle = "#d1cbb1";
    ctx.beginPath();
    ctx.arc(-12, -2, 4, 0, Math.PI * 2);
    ctx.arc(-12, 3, 4, 0, Math.PI * 2);
    ctx.arc(12, -2, 4, 0, Math.PI * 2);
    ctx.arc(12, 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawMapProp(ctx, prop, p, mapId) {
    ctx.save();
    ctx.translate(p.x, p.y);
    drawIsoShadow(ctx, 0, 5, 28, 9, 0.28);
    ctx.lineJoin = "round";
    if (prop.t === "crypt") {
      ctx.fillStyle = "#27313a";
      ctx.fillRect(-34, -50, 68, 48);
      ctx.fillStyle = "#10161d";
      ctx.fillRect(-18, -28, 36, 25);
      ctx.strokeStyle = "#738997";
      ctx.lineWidth = 2;
      ctx.strokeRect(-34, -50, 68, 48);
      drawRuneCircle(ctx, 0, -4, 26, "rgba(111,226,205,0.45)", 0);
    } else if (prop.t === "grave") {
      ctx.fillStyle = "#889083";
      ctx.fillRect(-9, -28, 18, 29);
      ctx.fillStyle = "#576059";
      ctx.fillRect(-6, -22, 12, 3);
      ctx.strokeStyle = "#bcc5b4";
      ctx.strokeRect(-9, -28, 18, 29);
      drawBone(ctx, 18, -2, 0.55);
    } else if (prop.t === "tree") {
      ctx.strokeStyle = "#34291f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(-3, -30);
      ctx.lineTo(-22, -52);
      ctx.moveTo(-3, -30);
      ctx.lineTo(15, -54);
      ctx.moveTo(-1, -18);
      ctx.lineTo(22, -34);
      ctx.stroke();
      ctx.fillStyle = "rgba(56,77,58,0.35)";
      ctx.beginPath();
      ctx.arc(0, -34, 20, 0, Math.PI * 2);
      ctx.fill();
    } else if (prop.t === "dummy") {
      ctx.strokeStyle = "#b79b65";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(0, 7);
      ctx.moveTo(-18, -20);
      ctx.lineTo(18, -20);
      ctx.stroke();
      ctx.strokeStyle = "#75d4b7";
      ctx.strokeRect(-12, -30, 24, 16);
    } else if (prop.t === "bossgate") {
      ctx.strokeStyle = "#7c4c58";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-28, -6);
      ctx.lineTo(28, -6);
      ctx.moveTo(-22, -36);
      ctx.lineTo(-22, 6);
      ctx.moveTo(22, -36);
      ctx.lineTo(22, 6);
      ctx.stroke();
      drawRuneCircle(ctx, 0, -8, 34, "rgba(236,95,126,0.55)", 0);
    } else if (prop.t === "rift") {
      drawAura(ctx, 0, -12, 42, "rgba(225,91,61,0.8)", 2);
      ctx.fillStyle = "#5a1916";
      ctx.beginPath();
      ctx.ellipse(0, -12, 27, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ff744f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-14, -18);
      ctx.lineTo(-3, -39);
      ctx.lineTo(8, -17);
      ctx.lineTo(19, -33);
      ctx.stroke();
    } else if (prop.t === "dragonmark" || prop.t === "scale") {
      drawAura(ctx, 0, -18, 38, "rgba(126,214,255,0.7)", 1);
      ctx.fillStyle = "#9ed5ff";
      ctx.shadowColor = "#9ed5ff";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(20, -8);
      ctx.lineTo(3, 10);
      ctx.lineTo(-17, -5);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (prop.t === "gallows") {
      ctx.strokeStyle = "#8e755f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-18, 6);
      ctx.lineTo(-18, -46);
      ctx.lineTo(18, -46);
      ctx.lineTo(18, -25);
      ctx.stroke();
      ctx.strokeStyle = "#cab89a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(18, -19, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#879498";
      ctx.fillRect(-8, -30, 16, 34);
      ctx.strokeStyle = "#c3d5d0";
      ctx.strokeRect(-8, -30, 16, 34);
    }
    ctx.restore();
    return true;
  }

  function drawDetailedPortal(ctx, portal, unlocked, label, tick) {
    var color = portal.future ? "#7e95ad" : unlocked ? "#7df0cd" : "#d36c84";
    ctx.save();
    drawAura(ctx, 0, -15, unlocked ? 58 : 46, color, tick);
    drawRuneCircle(ctx, 0, 0, 34 + Math.sin(tick * 2) * 2, color, tick);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -20, 27, Math.PI, 0);
    ctx.stroke();
    if (!unlocked) {
      ctx.strokeStyle = portal.future ? "rgba(158,174,193,0.78)" : "rgba(245,123,154,0.86)";
      ctx.lineWidth = 3;
      for (var c = -1; c <= 1; c += 2) {
        ctx.beginPath();
        ctx.moveTo(-23, -18 + c * 6);
        ctx.lineTo(23, 10 - c * 6);
        ctx.stroke();
      }
    }
    var particleCount = Math.round(8 * qualityScale);
    for (var i = 0; i < particleCount; i += 1) {
      var a = tick * 1.2 + i * 1.9;
      var px = Math.cos(a) * (18 + hash(i + 7) * 19);
      var py = -8 - ((tick * 20 + i * 13) % 42);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.25 + hash(i + 2) * 0.45;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    drawFloatingLabel(ctx, portal.future ? "Versao futura" : label, 0, -48, unlocked ? "#dffdf2" : "#f0c4cd");
    ctx.restore();
  }

  function outline(ctx, color, width) {
    ctx.strokeStyle = color || "#101418";
    ctx.lineWidth = width || 3;
    ctx.stroke();
  }

  function drawNecromancer(ctx, player, tick) {
    var moving = Math.hypot(player.vx || 0, player.vy || 0) > 0.1;
    var low = player.hp / player.maxHp < 0.3;
    var bob = moving ? Math.sin(tick * 9) * 2 : Math.sin(tick * 2.5);
    drawIsoShadow(ctx, 0, 12, 28, 10, 0.42);
    drawAura(ctx, 0, -21, low ? 42 : 34, low ? "rgba(227,83,108,0.75)" : "rgba(87,241,203,0.72)", tick);

    ctx.save();
    ctx.translate(0, bob);
    ctx.fillStyle = "#071016";
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(21, 8);
    ctx.lineTo(7, 5);
    ctx.lineTo(0, 17);
    ctx.lineTo(-8, 5);
    ctx.lineTo(-23, 9);
    ctx.closePath();
    ctx.fill();
    outline(ctx, "#1b2a31", 2);
    ctx.fillStyle = "#1b2229";
    ctx.beginPath();
    ctx.moveTo(-13, -18);
    ctx.lineTo(-5, 8);
    ctx.lineTo(6, 8);
    ctx.lineTo(14, -18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0b0f14";
    ctx.beginPath();
    ctx.moveTo(0, -57);
    ctx.lineTo(15, -35);
    ctx.lineTo(10, -21);
    ctx.lineTo(-10, -21);
    ctx.lineTo(-15, -35);
    ctx.closePath();
    ctx.fill();
    outline(ctx, "#42505a", 2);
    ctx.fillStyle = "#78f5d3";
    ctx.beginPath();
    ctx.arc(-5, -31, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -31, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d8d1b7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, -19);
    ctx.lineTo(28, -44);
    ctx.lineTo(24, -47);
    ctx.stroke();
    ctx.fillStyle = "#29231c";
    ctx.fillRect(-25, -20, 12, 16);
    ctx.strokeStyle = "#8cf7d8";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-25, -20, 12, 16);
    drawAura(ctx, -19, -17, 13, "rgba(112,243,210,0.85)", tick * 1.7);
    drawAura(ctx, 19, -16, 13, "rgba(112,243,210,0.85)", tick * 1.9);
    for (var i = 0; i < Math.round(5 * qualityScale); i += 1) {
      var px = (hash(i + 41) - 0.5) * 48;
      var py = -18 - ((tick * 16 + i * 11) % 42);
      ctx.fillStyle = "rgba(117,240,205,0.75)";
      ctx.beginPath();
      ctx.arc(px, py, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    drawHealthBar(ctx, 0, 17, 50, 5, player.hp / player.maxHp, low ? "#e95b6e" : "#72e096");
  }

  function drawSkeletonServant(ctx, servant, tick) {
    var veteran = servant.kind === "veteran";
    drawIsoShadow(ctx, 0, 10, veteran ? 23 : 19, 7, 0.34);
    if (veteran) drawAura(ctx, 0, -19, 28, "rgba(248,218,105,0.42)", tick);
    ctx.fillStyle = veteran ? "#7a6f5d" : "#d8d7c3";
    ctx.strokeStyle = "#111417";
    ctx.lineWidth = 2;
    ctx.fillRect(-8, -34, 16, 23);
    ctx.strokeRect(-8, -34, 16, 23);
    ctx.fillStyle = veteran ? "#d1c286" : "#ece8cd";
    ctx.beginPath();
    ctx.arc(0, -42, 9, 0, Math.PI * 2);
    ctx.fill();
    outline(ctx, "#15181a", 2);
    ctx.fillStyle = "#7df0cd";
    ctx.fillRect(-4, -43, 2, 2);
    ctx.fillRect(3, -43, 2, 2);
    ctx.strokeStyle = veteran ? "#efd16a" : "#b9b19a";
    ctx.lineWidth = veteran ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(11, -22);
    ctx.lineTo(27, -36);
    ctx.lineTo(23, -14);
    ctx.stroke();
    ctx.fillStyle = veteran ? "#665c52" : "#4f5658";
    ctx.fillRect(-26, -25, 13, 17);
    if (servant.memoryDanger > 0) drawRuneCircle(ctx, 0, -19, 26, "#73d7ff", tick);
    drawHealthBar(ctx, 0, 13, 42, 5, servant.hp / servant.maxHp, "#86d8ff");
  }

  function drawFeralServant(ctx, servant, tick) {
    drawIsoShadow(ctx, 0, 9, 23, 8, 0.34);
    drawAura(ctx, 0, -12, 22, "rgba(117,240,205,0.28)", tick);
    ctx.fillStyle = "#9fc6be";
    ctx.beginPath();
    ctx.ellipse(0, -15, 19, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    outline(ctx, "#101418", 2);
    ctx.fillStyle = "#d8d7c3";
    ctx.beginPath();
    ctx.arc(17, -20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#78f5d3";
    ctx.fillRect(19, -22, 2, 2);
    ctx.strokeStyle = "#cfd5bd";
    ctx.lineWidth = 3;
    for (var i = -1; i <= 1; i += 2) {
      ctx.beginPath();
      ctx.moveTo(-10, -7);
      ctx.lineTo(-17, 4 + i * 2);
      ctx.moveTo(8, -7);
      ctx.lineTo(2, 5 + i * 2);
      ctx.stroke();
    }
    if (servant.memoryDanger > 0) drawRuneCircle(ctx, 0, -12, 25, "#73d7ff", tick);
    drawHealthBar(ctx, 0, 12, 40, 5, servant.hp / servant.maxHp, "#86d8ff");
  }

  function drawFallenServant(ctx, servant, tick) {
    drawIsoShadow(ctx, 0, 10, 21, 7, 0.36);
    drawAura(ctx, 0, -18, 24, "rgba(151,112,205,0.36)", tick);
    ctx.fillStyle = "#8f7a63";
    ctx.fillRect(-12, -34, 24, 35);
    outline(ctx, "#12161a", 2);
    ctx.fillStyle = "#3f4649";
    ctx.fillRect(-10, -44, 20, 12);
    ctx.strokeStyle = "#cbb18b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(13, -20);
    ctx.lineTo(27, -28);
    ctx.stroke();
    if (servant.memoryDanger > 0) drawRuneCircle(ctx, 0, -16, 25, "#73d7ff", tick);
    drawHealthBar(ctx, 0, 13, 42, 5, servant.hp / servant.maxHp, "#86d8ff");
  }

  function drawEnemyHumanoid(ctx, enemy, tick) {
    var elite = enemy.type === "elite";
    var hunter = enemy.type === "hunter";
    var cultist = enemy.type === "cultist";
    var scale = elite ? 1.18 : 1;
    ctx.save();
    ctx.scale(scale, scale);
    drawIsoShadow(ctx, 0, 10, 21, 8, 0.38);
    if (elite) drawAura(ctx, 0, -24, 32, "rgba(255,213,105,0.34)", tick);
    if (cultist) drawAura(ctx, 0, -20, 26, "rgba(177,104,240,0.32)", tick);
    ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : hunter ? "#9b704d" : cultist ? "#604b72" : elite ? "#9b8247" : "#a98d72";
    ctx.fillRect(-14, -35, 28, 40);
    outline(ctx, "#111418", 2);
    ctx.fillStyle = hunter ? "#2d211b" : elite ? "#eee0a3" : "#d4c4aa";
    ctx.fillRect(-11, -45, 22, 13);
    ctx.strokeStyle = hunter ? "#c69b68" : "#d7c4a4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(13, -20);
    ctx.lineTo(29, -31);
    ctx.stroke();
    if (enemy.marked) drawRuneCircle(ctx, 0, -22, 30, "#e95b86", tick);
    ctx.restore();
    drawHealthBar(ctx, 0, 16 * scale, 48 * scale, 5, enemy.hp / enemy.maxHp, "#ef6b6b");
  }

  function drawBeastEnemy(ctx, enemy, tick) {
    var wolf = enemy.type === "wolf" || enemy.type === "warhound";
    drawIsoShadow(ctx, 0, 10, wolf ? 25 : 17, wolf ? 8 : 6, 0.34);
    ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : enemy.color;
    if (wolf) {
      ctx.beginPath();
      ctx.moveTo(-22, 2);
      ctx.lineTo(-8, -25);
      ctx.lineTo(15, -19);
      ctx.lineTo(26, 3);
      ctx.closePath();
      ctx.fill();
      outline(ctx, "#101418", 2);
      ctx.fillStyle = "#bcd8cc";
      ctx.beginPath();
      ctx.arc(19, -18, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, -7, 18, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      outline(ctx, "#101418", 2);
      ctx.fillRect(13, -8, 14, 3);
      ctx.fillStyle = "#78f5d3";
      ctx.fillRect(8, -10, 2, 2);
    }
    if (enemy.marked) drawRuneCircle(ctx, 0, -13, 24, "#e95b86", tick);
    drawHealthBar(ctx, 0, 14, wolf ? 46 : 36, 5, enemy.hp / enemy.maxHp, "#ef6b6b");
  }

  function drawDemonImp(ctx, enemy, tick) {
    drawIsoShadow(ctx, 0, 10, 22, 8, 0.38);
    drawAura(ctx, 0, -18, 26, "rgba(238,89,57,0.36)", tick);
    ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#d05a45";
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.lineTo(16, -16);
    ctx.lineTo(11, 7);
    ctx.lineTo(-11, 7);
    ctx.lineTo(-16, -16);
    ctx.closePath();
    ctx.fill();
    outline(ctx, "#1a1010", 2);
    ctx.fillStyle = "#ffd08a";
    ctx.beginPath();
    ctx.moveTo(-11, -33);
    ctx.lineTo(-28, -44);
    ctx.lineTo(-18, -20);
    ctx.moveTo(11, -33);
    ctx.lineTo(28, -44);
    ctx.lineTo(18, -20);
    ctx.fill();
    if (enemy.marked) drawRuneCircle(ctx, 0, -20, 28, "#e95b86", tick);
    drawHealthBar(ctx, 0, 15, 46, 5, enemy.hp / enemy.maxHp, "#ef6b6b");
  }

  function drawTombGuardian(ctx, boss, tick) {
    var pulse = tick * 1.4;
    drawIsoShadow(ctx, 0, 18, 50, 18, 0.55);
    drawAura(ctx, 0, -34, 76, "rgba(107,230,224,0.34)", pulse);
    drawRuneCircle(ctx, 0, 13, 55, "rgba(125,240,205,0.36)", tick);
    ctx.save();
    ctx.scale(1.55, 1.55);
    ctx.fillStyle = boss.hitFlash > 0 ? "#ffffff" : "#454a57";
    ctx.fillRect(-24, -50, 48, 58);
    outline(ctx, "#0d1115", 3);
    ctx.fillStyle = "#2c313b";
    ctx.fillRect(-32, -40, 16, 28);
    ctx.fillRect(16, -40, 16, 28);
    ctx.fillStyle = "#c3b7ff";
    ctx.fillRect(-14, -62, 28, 15);
    ctx.fillStyle = "#6ff1dc";
    ctx.beginPath();
    ctx.arc(0, -25, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7b6bd8";
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -20, 30, 17);
    ctx.strokeStyle = "#d8c98f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-27, -10);
    ctx.lineTo(-45, 8);
    ctx.moveTo(27, -10);
    ctx.lineTo(45, 8);
    ctx.stroke();
    ctx.restore();
    if (boss.aoeTimer < 1.1) drawRuneCircle(ctx, 0, 12, 64, "rgba(236,95,126,0.72)", tick * 2);
    if (boss.marked) drawRuneCircle(ctx, 0, -33, 52, "#e95b86", tick);
    drawHealthBar(ctx, 0, 32, 76, 7, boss.hp / boss.maxHp, "#c36af0");
  }

  function drawProjectile(ctx, projectile, tick) {
    ctx.save();
    ctx.fillStyle = projectile.color;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 18;
    var angle = Math.atan2(projectile.dy, projectile.dx);
    ctx.rotate(angle);
    if (projectile.kind === "bone") {
      ctx.fillStyle = "#f3edd1";
      ctx.fillRect(-18, -3, 36, 6);
      ctx.fillRect(7, -8, 10, 16);
      ctx.strokeStyle = "#93d7ff";
      ctx.strokeRect(-18, -3, 36, 6);
    } else {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.32;
      ctx.fillRect(-28, -3, 24, 6);
    }
    ctx.restore();
  }

  function drawAreaEffect(ctx, effect, map, ratio, tick) {
    var radiusX = effect.radius * map.tileW * 0.5;
    var radiusY = effect.radius * map.tileH * 0.55;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - ratio);
    drawAura(ctx, 0, 0, radiusX * (0.4 + ratio), effect.color, tick);
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX * ratio, radiusY * ratio, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (QUALITY !== "low") drawRuneCircle(ctx, 0, 0, radiusX * 0.5 * ratio, effect.color, tick);
    ctx.restore();
  }

  function drawSpiritBeam(ctx, x1, y1, x2, y2, color, ratio, tick) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.max(0, 1 - ratio * 0.75);
    ctx.strokeStyle = color || "#70e3c2";
    ctx.lineWidth = 4;
    ctx.beginPath();
    var cx = (x1 + x2) * 0.5 + Math.sin(tick * 7) * 12;
    var cy = (y1 + y2) * 0.5 - 28 + Math.cos(tick * 5) * 6;
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(233,255,246,0.8)";
    ctx.stroke();
    for (var i = 0; i < Math.round(5 * qualityScale); i += 1) {
      var t = (i / 5 + tick * 0.65) % 1;
      var ax = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
      var ay = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      ctx.fillStyle = color || "#70e3c2";
      ctx.beginPath();
      ctx.arc(ax, ay, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPanel(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(5, 8, 12, 0.78)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(125, 240, 205, 0.24)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "rgba(125, 240, 205, 0.05)";
    ctx.fillRect(x + 1, y + 1, w - 2, 4);
    ctx.restore();
  }

  window.GameArt = {
    quality: QUALITY,
    clamp01: clamp01,
    hash: hash,
    drawIsoShadow: drawIsoShadow,
    drawAura: drawAura,
    drawRuneCircle: drawRuneCircle,
    drawFloatingLabel: drawFloatingLabel,
    drawHealthBar: drawHealthBar,
    drawIsoTile: drawIsoTile,
    drawMapProp: drawMapProp,
    drawDetailedPortal: drawDetailedPortal,
    drawNecromancer: drawNecromancer,
    drawSkeletonServant: drawSkeletonServant,
    drawFeralServant: drawFeralServant,
    drawFallenServant: drawFallenServant,
    drawEnemyHumanoid: drawEnemyHumanoid,
    drawBeastEnemy: drawBeastEnemy,
    drawDemonImp: drawDemonImp,
    drawTombGuardian: drawTombGuardian,
    drawProjectile: drawProjectile,
    drawAreaEffect: drawAreaEffect,
    drawSpiritBeam: drawSpiritBeam,
    drawPanel: drawPanel
  };
})();
