(function () {
  "use strict";

  function normalize(x, y) {
    var len = Math.hypot(x, y);
    if (len <= 0.001) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
  }

function keyToAction(key) {
    if (key === " " || key === "j") return "attack";
    if (key === "1") return "skill1";
    if (key === "2") return "skill2";
    if (key === "3") return "skill3";
    if (key === "4") return "skill4";
    if (key === "c") return "capture";
    if (key === "q") return "command";
    if (key === "m") return "manage";
    if (key === "i") return "inventory";
    if (key === "k") return "skills";
    if (key === "escape") return "menu";
    if (key === "p") return "save";
    if (key === "x") return "deleteSave";
    if (key === "e") return "enterPortal";
    if (key === "enter") return "start";
    if (key === "tab") return "command";
    if (key === "f") return "fusion";
    if (key === "l") return "account";
    if (key === "f10") return "recoverUI";
    return "";
  }

  window.InputManager = function InputManager(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pending = Object.create(null);
    this.joystick = { active: false, id: null, x: 0, y: 0 };
    this.lastAim = { x: 1, y: 0 };
    this._setupKeyboard();
    this._setupTouchControls();
    this._setupCanvasPointer();
  };

  InputManager.prototype._queue = function (action) {
    this.pending[action] = (this.pending[action] || 0) + 1;
  };

  InputManager.prototype.consume = function (action) {
    if (!this.pending[action]) return false;
    this.pending[action] -= 1;
    return true;
  };

  InputManager.prototype._setupKeyboard = function () {
    window.addEventListener("keydown", function (event) {
      var key = event.key.toLowerCase();
      var action = keyToAction(key);
      if (action && !event.repeat) this._queue(action);
      if (
        action ||
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "m" ||
        key === "i" ||
        key === "k" ||
        key === "escape" ||
        key === "p" ||
        key === "x" ||
        key === "e" ||
        key === "enter" ||
        key === "tab" ||
        key === "f" ||
        key === "f10"
      ) {
        event.preventDefault();
      }
      this.keys.add(key);
    }.bind(this), { passive: false });

    window.addEventListener("keyup", function (event) {
      this.keys.delete(event.key.toLowerCase());
    }.bind(this));
  };

  InputManager.prototype._setupTouchControls = function () {
    var stick = document.getElementById("joystick");
    var knob = document.getElementById("joystickKnob");
    var updateStick = function (clientX, clientY) {
      var rect = stick.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var max = rect.width * 0.36;
      var dx = clientX - cx;
      var dy = clientY - cy;
      var len = Math.hypot(dx, dy);
      var scale = len > max ? max / len : 1;
      var px = dx * scale;
      var py = dy * scale;
      knob.style.transform = "translate(" + px + "px, " + py + "px)";
      this.joystick.x = max ? px / max : 0;
      this.joystick.y = max ? py / max : 0;
      if (Math.hypot(this.joystick.x, this.joystick.y) > 0.2) {
        this.lastAim = normalize(this.joystick.x, this.joystick.y);
      }
    }.bind(this);

    stick.addEventListener("pointerdown", function (event) {
      stick.setPointerCapture(event.pointerId);
      this.joystick.active = true;
      this.joystick.id = event.pointerId;
      updateStick(event.clientX, event.clientY);
    }.bind(this));

    stick.addEventListener("pointermove", function (event) {
      if (this.joystick.active && this.joystick.id === event.pointerId) {
        updateStick(event.clientX, event.clientY);
      }
    }.bind(this));

    var releaseStick = function (event) {
      if (this.joystick.id !== event.pointerId) return;
      this.joystick.active = false;
      this.joystick.id = null;
      this.joystick.x = 0;
      this.joystick.y = 0;
      knob.style.transform = "translate(0, 0)";
    }.bind(this);
    stick.addEventListener("pointerup", releaseStick);
    stick.addEventListener("pointercancel", releaseStick);

    document.querySelectorAll("[data-action]").forEach(function (button) {
      var action = button.getAttribute("data-action");
      button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        button.classList.add("is-pressed");
        this._queue(action);
      }.bind(this), { passive: false });
      var release = function () {
        button.classList.remove("is-pressed");
      };
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("pointerleave", release);
    }.bind(this));
  };

  InputManager.prototype._setupCanvasPointer = function () {
    this.canvas.addEventListener("pointerdown", function (event) {
      var rect = this.canvas.getBoundingClientRect();
      var x = (event.clientX - rect.left) / Math.max(1, rect.width);
      var y = (event.clientY - rect.top) / Math.max(1, rect.height);
      if (x > 0.2 && x < 0.78 && y > 0.08 && y < 0.85) {
        this._queue("attack");
      }
    }.bind(this));
  };

  InputManager.prototype.getMoveVector = function () {
    var x = 0;
    var y = 0;
    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;

    if (Math.hypot(this.joystick.x, this.joystick.y) > 0.08) {
      x += this.joystick.x;
      y += this.joystick.y;
    }

    var result = normalize(x, y);
    if (Math.hypot(result.x, result.y) > 0.1) this.lastAim = result;
    return result;
  };

  InputManager.prototype.getLastAim = function () {
    return this.lastAim;
  };

  InputManager.prototype.clearRuntimeInput = function () {
    this.pending = Object.create(null);
    this.keys.clear();
    this.joystick.active = false;
    this.joystick.id = null;
    this.joystick.x = 0;
    this.joystick.y = 0;
    var knob = document.getElementById("joystickKnob");
    if (knob) knob.style.transform = "translate(0, 0)";
  };
})();
