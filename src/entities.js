(function () {
  "use strict";

  var cfg = window.GameConfig;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function drawBar(ctx, x, y, w, h, ratio, fill) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillRect(x - w / 2, y, w, h);
    ctx.fillStyle = fill;
    ctx.fillRect(x - w / 2, y, w * clamp01(ratio), h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.strokeRect(x - w / 2, y, w, h);
  }

  function Entity(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius || 0.4;
    this.dead = false;
    this.vx = 0;
    this.vy = 0;
    this.hitFlash = 0;
  }

  Entity.prototype.distanceTo = function (other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  };

  Entity.prototype.move = function (dx, dy, speed, dt, map) {
    var len = Math.hypot(dx, dy);
    if (len > 0.001) {
      this.x += (dx / len) * speed * dt;
      this.y += (dy / len) * speed * dt;
      this.vx = dx / len;
      this.vy = dy / len;
    } else {
      this.vx = 0;
      this.vy = 0;
    }
    map.clampPosition(this);
  };

  Entity.prototype.takeDamage = function (amount) {
    this.hp -= Math.max(1, amount);
    this.hitFlash = 0.14;
  };

  Entity.prototype.updateBase = function (dt) {
    if (this.hitFlash > 0) this.hitFlash -= dt;
  };

  function Player(x, y) {
    Entity.call(this, x, y, cfg.player.radius);
    this.team = "player";
    this.name = "Necromante";
    this.maxHp = cfg.player.maxHp;
    this.hp = this.maxHp;
    this.maxMana = cfg.player.maxMana;
    this.mana = this.maxMana;
    this.level = 1;
    this.exp = 0;
    this.expToNext = 100;
    this.fragments = 0;
    this.necroDomain = cfg.player.necroDomain;
    this.soulControl = cfg.player.soulControl;
    this.speed = cfg.player.speed;
    this.cooldowns = {
      attack: 0,
      skill1: 0,
      skill2: 0,
      skill3: 0,
      skill4: 0,
      capture: 0
    };
  }
  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.gainExp = function (amount, game) {
    this.exp += amount;
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.level += 1;
      this.expToNext = Math.floor(this.expToNext * 1.28);
      this.maxHp += 12;
      this.maxMana += 7;
      this.hp = this.maxHp;
      this.mana = this.maxMana;
      this.necroDomain += 0.2;
      game.skillPoints += 1;
      game.message("Nivel " + this.level + ": a linhagem proibida desperta.");
    }
  };

  Player.prototype.update = function (dt, game) {
    this.updateBase(dt);
    this.mana = Math.min(this.maxMana, this.mana + cfg.player.regenManaPerSecond * dt);
    Object.keys(this.cooldowns).forEach(function (key) {
      this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    }.bind(this));
  };

  Player.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : "#6ed2b2";
    ctx.beginPath();
    ctx.moveTo(0, -35);
    ctx.lineTo(18, 8);
    ctx.lineTo(-18, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1c2530";
    ctx.fillRect(-10, -21, 20, 24);
    ctx.fillStyle = "#9b5dd9";
    ctx.beginPath();
    ctx.arc(0, -27, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7ee4c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(16, -20);
    ctx.lineTo(25, -38);
    ctx.stroke();
    drawBar(ctx, 0, 15, 48, 5, this.hp / this.maxHp, "#72e096");
    ctx.restore();
  };

  function Enemy(type, x, y, options) {
    var spec = cfg.enemies[type];
    Entity.call(this, x, y, spec.radius);
    this.type = type;
    this.team = "enemy";
    this.name = spec.name;
    this.maxHp = spec.hp;
    this.hp = spec.hp;
    this.speed = spec.speed;
    this.damage = spec.damage;
    this.exp = spec.exp;
    this.fragments = spec.fragments;
    this.color = spec.color;
    this.captureKey = spec.captureKey;
    this.attackCooldown = 0;
    this.passive = Boolean(options && options.passive);
    this.aggro = Boolean(options && options.summoned);
    this.spawnX = x;
    this.spawnY = y;
    this.marked = false;
    this.markTimer = 0;
    this.summonTimer = type === "boss" ? 5 : 0;
    this.aoeTimer = type === "boss" ? 3.6 : 0;
    this.engaged = type !== "boss";
  }
  Enemy.prototype = Object.create(Entity.prototype);
  Enemy.prototype.constructor = Enemy;

  Enemy.prototype.update = function (dt, game) {
    this.updateBase(dt);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    if (this.markTimer > 0) {
      this.markTimer -= dt;
      if (this.markTimer <= 0) this.marked = false;
    }
    window.NecroAI.updateEnemy(this, dt, game);
  };

  Enemy.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    var scale = this.type === "boss" ? 1.55 : this.type === "elite" ? 1.18 : 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
    ctx.beginPath();
    ctx.ellipse(0, 10 * scale, 20 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : this.color;
    if (this.type === "rat") {
      ctx.beginPath();
      ctx.ellipse(0, -6, 17, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(13, -7, 13, 3);
    } else if (this.type === "imp") {
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.lineTo(14, -14);
      ctx.lineTo(10, 6);
      ctx.lineTo(-10, 6);
      ctx.lineTo(-14, -14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffd08a";
      ctx.beginPath();
      ctx.moveTo(-11, -32);
      ctx.lineTo(-27, -42);
      ctx.lineTo(-17, -20);
      ctx.moveTo(11, -32);
      ctx.lineTo(27, -42);
      ctx.lineTo(17, -20);
      ctx.fill();
    } else if (this.type === "wolf" || this.type === "warhound") {
      ctx.beginPath();
      ctx.moveTo(-20, 2);
      ctx.lineTo(-8, -22);
      ctx.lineTo(16, -16);
      ctx.lineTo(24, 4);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "boss") {
      ctx.fillRect(-22, -45, 44, 54);
      ctx.fillStyle = "#c3b7ff";
      ctx.fillRect(-14, -56, 28, 14);
      ctx.strokeStyle = "#f09cad";
      ctx.lineWidth = 3;
      ctx.strokeRect(-25, -48, 50, 60);
    } else {
      ctx.fillRect(-14 * scale, -34 * scale, 28 * scale, 40 * scale);
      ctx.fillStyle = this.type === "elite" ? "#fff0a6" : "#d4c4aa";
      ctx.fillRect(-11 * scale, -44 * scale, 22 * scale, 13 * scale);
    }
    if (this.marked) {
      ctx.strokeStyle = "#e95b86";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -20 * scale, 28 * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawBar(ctx, 0, 14 * scale, 46 * scale, 5, this.hp / this.maxHp, "#ef6b6b");
    ctx.restore();
  };

  function Servant(kind, x, y) {
    var spec = cfg.servants[kind];
    Entity.call(this, x, y, spec.radius);
    this.kind = kind;
    this.team = "servant";
    this.name = spec.name;
    this.maxHp = spec.hp;
    this.hp = spec.hp;
    this.speed = spec.speed;
    this.damage = spec.damage;
    this.defense = spec.defense;
    this.color = spec.color;
    this.protectBias = spec.protectBias;
    this.attackCooldown = 0;
    this.state = "seguir necromante";
    this.level = 1;
    this.exp = 0;
    this.destroyed = false;
    this.memoryDanger = 0;
  }
  Servant.prototype = Object.create(Entity.prototype);
  Servant.prototype.constructor = Servant;

  Servant.prototype.evolveToVeteran = function () {
    var spec = cfg.servants.veteran;
    this.kind = "veteran";
    this.name = spec.name;
    this.maxHp = spec.hp;
    this.hp = spec.hp;
    this.speed = spec.speed;
    this.damage = spec.damage;
    this.defense = spec.defense;
    this.radius = spec.radius;
    this.color = spec.color;
    this.protectBias = spec.protectBias;
  };

  Servant.prototype.gainExp = function (amount) {
    this.exp += amount;
    if (this.exp >= this.level * 45) {
      this.exp = 0;
      this.level += 1;
      this.maxHp += 6;
      this.damage += 1;
      this.hp = Math.min(this.maxHp, this.hp + 20);
    }
  };

  Servant.prototype.takeDamage = function (amount) {
    var reduced = Math.max(1, amount - this.defense);
    Entity.prototype.takeDamage.call(this, reduced);
    if (this.hp <= 0) {
      this.destroyed = true;
      this.dead = true;
    }
  };

  Servant.prototype.update = function (dt, game) {
    this.updateBase(dt);
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.memoryDanger = Math.max(0, this.memoryDanger - dt);
    window.NecroAI.updateServant(this, dt, game);
  };

  Servant.prototype.draw = function (ctx, map, camera, canvas) {
    if (this.destroyed) return;
    var p = map.project(this.x, this.y, camera, canvas);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
    ctx.beginPath();
    ctx.ellipse(0, 9, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : this.color;
    ctx.fillRect(-10, -29, 20, 34);
    ctx.fillStyle = "#303337";
    ctx.fillRect(-8, -39, 16, 12);
    ctx.strokeStyle = this.kind === "veteran" ? "#ffdf76" : "#dfe4db";
    ctx.lineWidth = this.kind === "veteran" ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(10, -18);
    ctx.lineTo(24, -30);
    ctx.stroke();
    if (this.memoryDanger > 0) {
      ctx.strokeStyle = "#73d7ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -16, 25, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawBar(ctx, 0, 12, 42, 5, this.hp / this.maxHp, "#86d8ff");
    ctx.restore();
  };

  function Projectile(owner, x, y, dx, dy, options) {
    Entity.call(this, x, y, options.radius || 0.18);
    this.owner = owner;
    this.team = owner.team;
    this.dx = dx;
    this.dy = dy;
    this.speed = options.speed;
    this.damage = options.damage;
    this.life = options.life || 1;
    this.color = options.color || "#b074e8";
    this.kind = options.kind || "bolt";
    this.pierce = options.pierce || 0;
  }
  Projectile.prototype = Object.create(Entity.prototype);
  Projectile.prototype.constructor = Projectile;

  Projectile.prototype.update = function (dt) {
    this.x += this.dx * this.speed * dt;
    this.y += this.dy * this.speed * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  };

  Projectile.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 14;
    if (this.kind === "bone") {
      ctx.rotate(Math.atan2(this.dy, this.dx) * 0.55);
      ctx.fillRect(-16, -3, 32, 6);
      ctx.fillRect(7, -8, 9, 16);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  function Soul(enemy) {
    Entity.call(this, enemy.x, enemy.y, 0.35);
    this.name = enemy.name;
    this.captureKey = enemy.captureKey;
    this.sourceType = enemy.type;
    this.life = enemy.type === "boss" ? 12 : 14;
    this.maxLife = this.life;
    this.marked = enemy.marked;
    this.fragments = enemy.fragments;
    this.float = Math.random() * Math.PI * 2;
  }
  Soul.prototype = Object.create(Entity.prototype);
  Soul.prototype.constructor = Soul;

  Soul.prototype.update = function (dt) {
    this.life -= dt;
    this.float += dt * 3;
    if (this.life <= 0) this.dead = true;
  };

  Soul.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    var bob = Math.sin(this.float) * 5;
    ctx.save();
    ctx.translate(p.x, p.y + bob - 14);
    ctx.globalAlpha = Math.max(0.22, this.life / this.maxLife);
    ctx.fillStyle = this.sourceType === "boss" ? "#c1a5ff" : "#7ce6d4";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.marked ? "#ff79a8" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  function FloatingText(text, x, y, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color || "#f3e9c4";
    this.life = 1.3;
    this.dead = false;
  }

  FloatingText.prototype.update = function (dt) {
    this.life -= dt;
    this.y -= dt * 0.7;
    if (this.life <= 0) this.dead = true;
  };

  FloatingText.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, p.x, p.y - 42);
    ctx.fillText(this.text, p.x, p.y - 42);
    ctx.restore();
  };

  function AreaEffect(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color || "#c16bff";
    this.life = 0.45;
    this.maxLife = this.life;
    this.dead = false;
  }

  AreaEffect.prototype.update = function (dt) {
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  };

  AreaEffect.prototype.draw = function (ctx, map, camera, canvas) {
    var p = map.project(this.x, this.y, camera, canvas);
    var ratio = 1 - this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - ratio);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * map.tileW * 0.5 * ratio, this.radius * map.tileH * 0.55 * ratio, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  window.Entity = Entity;
  window.Player = Player;
  window.Enemy = Enemy;
  window.Servant = Servant;
  window.Projectile = Projectile;
  window.Soul = Soul;
  window.FloatingText = FloatingText;
  window.AreaEffect = AreaEffect;
})();
