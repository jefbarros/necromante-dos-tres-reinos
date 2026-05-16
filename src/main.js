(function () {
  "use strict";

  window.addEventListener("load", function () {
    var canvas = document.getElementById("gameCanvas");
    var input = new window.InputManager(canvas);
    var game = new window.NecromancerGame(canvas, input);
    window.necromanteGame = game;
    game.start();
  });
})();
