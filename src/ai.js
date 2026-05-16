(function () {
  "use strict";

  function normalize(x, y) {
    var len = Math.hypot(x, y);
    if (len <= 0.001) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
  }

  function closestTo(entity, list, filter) {
    var best = null;
    var bestDist = Infinity;
    list.forEach(function (item) {
      if (!item || item.dead || (filter && !filter(item))) return;
      var dist = entity.distanceTo(item);
      if (dist < bestDist) {
        best = item;
        bestDist = dist;
      }
    });
    return best;
  }

  function targetWeakest(enemy, game) {
    var candidates = [game.player].concat(game.servants.filter(function (s) { return !s.destroyed && !s.dead; }));
    var best = null;
    var bestScore = Infinity;
    candidates.forEach(function (target) {
      var hpRatio = target.hp / target.maxHp;
      var dist = enemy.distanceTo(target);
      var score = hpRatio * 5 + dist * 0.22;
      if (score < bestScore) {
        best = target;
        bestScore = score;
      }
    });
    return best;
  }

  function attackIfClose(attacker, target, dt, game, reach, damage) {
    if (!target || target.dead || target.destroyed) return false;
    if (attacker.distanceTo(target) > reach || attacker.attackCooldown > 0) return false;
    target.takeDamage(damage);
    attacker.attackCooldown = 1.05;
    game.floatText("-" + Math.round(damage), target.x, target.y, "#ffb3b3");
    if (target === game.player && target.hp <= 0) game.killPlayer();
    return true;
  }

  function updateRangedImp(enemy, dt, game) {
    var target = closestTo(enemy, [game.player].concat(game.servants), function (item) {
      return !item.destroyed;
    }) || game.player;
    var dist = enemy.distanceTo(target);
    var dir = normalize(target.x - enemy.x, target.y - enemy.y);
    if (dist < 3.1) {
      enemy.move(-dir.x, -dir.y, enemy.speed, dt, game.map);
    } else if (dist > 6.8) {
      enemy.move(dir.x, dir.y, enemy.speed * 0.86, dt, game.map);
    } else if (enemy.attackCooldown <= 0) {
      game.projectiles.push(new window.Projectile(enemy, enemy.x, enemy.y, dir.x, dir.y, {
        speed: 8.5,
        damage: enemy.damage,
        life: 0.9,
        color: "#ff6b45",
        radius: 0.2
      }));
      enemy.attackCooldown = 1.55;
      game.floatText("brasas", enemy.x, enemy.y, "#ffb28a");
    }
  }

  function updateBoss(enemy, dt, game) {
    if (!enemy.engaged && enemy.distanceTo(game.player) < 7.5) {
      enemy.engaged = true;
      game.message("O Guardiao de Tumba desperta.");
    }
    if (!enemy.engaged) return;

    enemy.summonTimer -= dt;
    enemy.aoeTimer -= dt;

    var target = closestTo(enemy, [game.player].concat(game.servants), function (item) {
      return !item.destroyed;
    }) || game.player;
    var dir = normalize(target.x - enemy.x, target.y - enemy.y);
    if (enemy.distanceTo(target) > 1.25) {
      enemy.move(dir.x, dir.y, enemy.speed, dt, game.map);
    } else {
      attackIfClose(enemy, target, dt, game, 1.45, enemy.damage);
    }

    var nearbyServants = game.servants.filter(function (s) {
      return !s.destroyed && !s.dead && enemy.distanceTo(s) < 2.6;
    });
    if (enemy.aoeTimer <= 0 && (nearbyServants.length >= 2 || enemy.distanceTo(game.player) < 2.1)) {
      enemy.aoeTimer = 5.7;
      game.areaDamage(enemy, enemy.x, enemy.y, 2.65, 24, "servantsAndPlayer");
      game.effects.push(new window.AreaEffect(enemy.x, enemy.y, 2.65, "#f0799d"));
      game.message("Guardiao: impacto sepulcral.");
    }

    if (enemy.summonTimer <= 0) {
      enemy.summonTimer = 8.5;
      var offset = Math.random() > 0.5 ? 1 : -1;
      game.spawnEnemy("rat", enemy.x + 1.4 * offset, enemy.y + 1.1, { summoned: true });
      game.spawnEnemy(Math.random() > 0.5 ? "wolf" : "soldier", enemy.x - 1.2 * offset, enemy.y - 0.9, { summoned: true });
      game.message("O Guardiao desperta mortos menores.");
    }
  }

  window.NecroAI = {
    updateEnemy: function (enemy, dt, game) {
      if (enemy.type === "boss") {
        updateBoss(enemy, dt, game);
        return;
      }

      if (enemy.passive && !enemy.aggro) {
        var home = normalize(enemy.spawnX - enemy.x, enemy.spawnY - enemy.y);
        if (enemy.distanceTo({ x: enemy.spawnX, y: enemy.spawnY }) > 1.1) {
          enemy.move(home.x, home.y, enemy.speed * 0.45, dt, game.map);
        }
        return;
      }

      if (!enemy.aggro) {
        var detection = enemy.type === "rat" ? 5.2 : enemy.type === "soldier" ? 6.6 : enemy.type === "imp" ? 8.2 : 7.4;
        var nearbyTarget = closestTo(enemy, [game.player].concat(game.servants), function (item) {
          return !item.destroyed && enemy.distanceTo(item) <= detection;
        });
        if (nearbyTarget) {
          enemy.aggro = true;
        } else {
          var homeDir = normalize(enemy.spawnX - enemy.x, enemy.spawnY - enemy.y);
          if (enemy.distanceTo({ x: enemy.spawnX, y: enemy.spawnY }) > 1.1) {
            enemy.move(homeDir.x, homeDir.y, enemy.speed * 0.45, dt, game.map);
          }
          return;
        }
      }

      var target = game.player;
      if (enemy.type === "wolf") {
        target = targetWeakest(enemy, game);
      } else if (enemy.type === "warhound") {
        target = targetWeakest(enemy, game);
      } else if (enemy.type === "rat") {
        target = closestTo(enemy, [game.player].concat(game.servants), function (item) {
          return !item.destroyed;
        }) || game.player;
      } else if (enemy.type === "elite") {
        target = game.markedTarget && !game.markedTarget.dead ? game.markedTarget : game.player;
      } else if (enemy.type === "imp") {
        updateRangedImp(enemy, dt, game);
        return;
      } else if (enemy.type === "hunter") {
        target = game.player;
      } else if (enemy.type === "cultist") {
        target = closestTo(enemy, [game.player].concat(game.servants), function (item) {
          return !item.destroyed;
        }) || game.player;
      }

      var dir = normalize(target.x - enemy.x, target.y - enemy.y);
      if (enemy.type === "rat" && enemy.hp < enemy.maxHp * 0.32) {
        enemy.move(-dir.x, -dir.y, enemy.speed * 1.14, dt, game.map);
        return;
      }

      if (enemy.distanceTo(target) > enemy.radius + target.radius + 0.34) {
        enemy.move(dir.x, dir.y, enemy.speed, dt, game.map);
      } else {
        attackIfClose(enemy, target, dt, game, enemy.radius + target.radius + 0.5, enemy.damage);
      }
    },

    updateServant: function (servant, dt, game) {
      if (servant.destroyed || servant.dead) return;

      var command = game.servantCommand;
      var marked = game.markedTarget && !game.markedTarget.dead ? game.markedTarget : null;
      var target = marked;
      var protectThreat = closestTo(game.player, game.enemies, function (enemy) {
        return (enemy.aggro || enemy.marked) && enemy.distanceTo(game.player) < 5.5;
      });
      var nearestEnemy = closestTo(servant, game.enemies, function (enemy) {
        return enemy.aggro || enemy.marked || enemy.distanceTo(game.player) < 9;
      });

      if (!target) {
        if (command === "proteger") target = protectThreat || nearestEnemy;
        else if (command === "recuar") target = protectThreat && protectThreat.distanceTo(game.player) < 2.2 ? protectThreat : null;
        else target = nearestEnemy;
      }

      var dx = 0;
      var dy = 0;
      var desiredState = "seguir necromante";

      if (command === "recuar" || servant.hp < servant.maxHp * 0.26) {
        var away = target ? normalize(servant.x - target.x, servant.y - target.y) : { x: 0, y: 0 };
        var toPlayer = normalize(game.player.x - servant.x, game.player.y - servant.y);
        dx += away.x * 1.4 + toPlayer.x * 0.8;
        dy += away.y * 1.4 + toPlayer.y * 0.8;
        desiredState = "recuar";
      } else if (target) {
        var dist = servant.distanceTo(target);
        var toTarget = normalize(target.x - servant.x, target.y - servant.y);
        if (dist > servant.radius + target.radius + 0.48) {
          dx += toTarget.x;
          dy += toTarget.y;
          desiredState = marked ? "focar alvo marcado" : "atacar";
        } else if (servant.attackCooldown <= 0) {
          target.takeDamage(servant.damage);
          target.aggro = true;
          servant.attackCooldown = 0.86;
          game.floatText("-" + servant.damage, target.x, target.y, "#dfffd7");
        }
      } else {
        var followDist = servant.distanceTo(game.player);
        var toLeader = normalize(game.player.x - servant.x, game.player.y - servant.y);
        if (followDist > 1.55) {
          dx += toLeader.x;
          dy += toLeader.y;
          desiredState = "reagrupar";
        }
      }

      if (command === "dispersar" || game.groupingDangerTimer > 0) {
        game.servants.forEach(function (other) {
          if (other === servant || other.destroyed || other.dead) return;
          var dist = servant.distanceTo(other);
          if (dist < 2.3) {
            var awayOther = normalize(servant.x - other.x, servant.y - other.y);
            dx += awayOther.x * (2.4 - dist);
            dy += awayOther.y * (2.4 - dist);
          }
        });
        if (game.groupingDangerTimer > 0) {
          servant.memoryDanger = Math.max(servant.memoryDanger, game.groupingDangerTimer);
          desiredState = "evitar agrupamento";
        } else {
          desiredState = "dispersar";
        }
      }

      if (command === "proteger" && (servant.kind === "veteran" || game.commandEfficiency > 1)) {
        var guard = normalize(game.player.x - servant.x, game.player.y - servant.y);
        if (servant.distanceTo(game.player) > 1.15) {
          dx += guard.x * servant.protectBias * game.commandEfficiency;
          dy += guard.y * servant.protectBias * game.commandEfficiency;
        }
      }

      servant.state = desiredState;
      if (Math.hypot(dx, dy) > 0.02) {
        servant.move(dx, dy, servant.speed, dt, game.map);
      }
    }
  };
})();
