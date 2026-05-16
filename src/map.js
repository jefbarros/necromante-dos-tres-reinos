(function () {
  "use strict";

  var cfg = window.GameConfig;

  window.WorldMaps = {
    cripta_inicial: {
      id: "cripta_inicial",
      name: "Cripta Inicial",
      cols: 18,
      rows: 14,
      theme: "#0d1318",
      firstVisitMessage: "Voce desperta onde a morte recusou sua alma.",
      spawns: {
        default: { x: 4.2, y: 7 },
        renascimento: { x: 4.2, y: 7 },
        from_cemiterio: { x: 14, y: 7 }
      },
      zones: [
        { id: "safe", name: "Cripta Inicial", x: 2, y: 3, w: 13, h: 8, color: "rgba(85, 111, 128, 0.34)" }
      ],
      enemies: [],
      props: [
        { x: 4, y: 7, t: "crypt" },
        { x: 8.2, y: 6.8, t: "obelisk" },
        { x: 12.8, y: 7.2, t: "grave" },
        { x: 5.6, y: 4.5, t: "grave" },
        { x: 10.5, y: 4.2, t: "crypt" },
        { x: 6.8, y: 9.6, t: "grave" },
        { x: 13.8, y: 9.3, t: "obelisk" }
      ],
      interestPoints: [
        {
          id: "trono_funerario",
          label: "Trono Funerario",
          x: 8.2,
          y: 6.8,
          radius: 1.35,
          t: "throne",
          message: "O trono esta vazio, mas ainda reconhece sua coroa de ossos."
        },
        {
          id: "altar_renascimento",
          label: "Altar de Renascimento",
          x: 4.2,
          y: 7.2,
          radius: 1.35,
          t: "altar",
          heal: true,
          message: "O altar recompõe sua carne fria e estabiliza seus servos."
        }
      ],
      respawn: {
        maxCommon: 0,
        maxElite: 0,
        commonInterval: 999,
        eliteInterval: 999,
        common: [],
        elite: []
      },
      portals: [
        {
          id: "cripta_para_cemiterio",
          x: 15.2,
          y: 7,
          radius: 1.25,
          targetMap: "cemiterio_neutro",
          targetSpawn: "from_cripta",
          label: "Cemiterio Neutro"
        }
      ]
    },
    cemiterio_neutro: {
      id: "cemiterio_neutro",
      name: "Cemiterio Neutro",
      cols: 40,
      rows: 30,
      theme: "#08080c",
      firstVisitMessage: "Entre tumulos esquecidos, almas fracas ainda vagam.",
      spawns: {
        default: { x: 5.5, y: 5.2 },
        from_cripta: { x: 4.8, y: 5.5 },
        from_estrada: { x: 15, y: 24 },
        from_area_secreta: { x: 31.5, y: 20.8 }
      },
      zones: [
        { id: "graveyard", name: "Cemiterio Principal", x: 10, y: 4, w: 17, h: 12, color: "rgba(101, 96, 86, 0.3)" },
        { id: "neutral", name: "Zona Neutra", x: 3, y: 16, w: 13, h: 10, color: "rgba(59, 115, 86, 0.28)" },
        { id: "training", name: "Area de Treinamento", x: 25, y: 4, w: 10, h: 9, color: "rgba(91, 94, 137, 0.28)" },
        { id: "boss", name: "Arena do Guardiao", x: 17, y: 18, w: 10, h: 8, color: "rgba(103, 52, 71, 0.32)" },
        { id: "infernal", name: "Fissura Infernal", x: 2, y: 9, w: 8, h: 6, color: "rgba(139, 55, 45, 0.28)" }
      ],
      enemies: [
        ["rat", 12, 7], ["rat", 14, 10], ["rat", 18, 8],
        ["wolf", 20, 12], ["wolf", 23, 7],
        ["soldier", 16, 13], ["soldier", 24, 14],
        ["elite", 26, 11],
        ["imp", 3.6, 14.2], ["imp", 8.6, 14.5],
        ["rat", 7, 20, { passive: true }], ["wolf", 11, 23, { passive: true }],
        ["soldier", 31, 9, { passive: true }],
        ["boss", 22, 22]
      ],
      props: [
        { x: 12.5, y: 7.3, t: "grave" }, { x: 15.8, y: 10.5, t: "grave" },
        { x: 21.1, y: 9.2, t: "grave" }, { x: 24.6, y: 14.1, t: "tree" },
        { x: 8.8, y: 21.8, t: "tree" }, { x: 31.6, y: 8.2, t: "dummy" },
        { x: 23.4, y: 21.2, t: "bossgate" }, { x: 5.8, y: 12.1, t: "rift" },
        { x: 11.4, y: 13.8, t: "grave" }, { x: 18.6, y: 15.2, t: "tree" },
        { x: 28.2, y: 5.6, t: "grave" }, { x: 33.8, y: 11.3, t: "tree" },
        { x: 20.1, y: 23.8, t: "obelisk" }, { x: 25.2, y: 24.5, t: "obelisk" }
      ],
      interestPoints: [
        {
          id: "tumulo_rachado",
          label: "Tumulo Rachado",
          x: 15.8,
          y: 10.5,
          radius: 1.35,
          t: "grave",
          once: true,
          rewardItem: "Osso Antigo",
          rewardAmount: 2,
          message: "Voce recolhe ossos ainda marcados por juramentos antigos.",
          doneMessage: "O tumulo rachado ja foi vasculhado."
        },
        {
          id: "campo_treinamento",
          label: "Campo de Treinamento",
          x: 31.6,
          y: 8.2,
          radius: 1.7,
          t: "dummy",
          message: "Os servos lembram golpes de uma guerra que nao venceram."
        },
        {
          id: "selo_area_secreta",
          label: "Selo da Area Secreta",
          x: 31.6,
          y: 20.9,
          radius: 1.65,
          t: "seal",
          message: "O selo pulsa. Derrote o Guardiao de Tumba para abrir a passagem.",
          unlockedMessage: "O selo reconhece a queda do Guardiao e abre o caminho."
        }
      ],
      respawn: {
        maxCommon: 12,
        maxElite: 1,
        commonInterval: 9,
        eliteInterval: 28,
        common: [
          { type: "rat", x: 12, y: 7, spread: 5 },
          { type: "wolf", x: 20, y: 12, spread: 5 },
          { type: "soldier", x: 18, y: 13, spread: 6 },
          { type: "imp", x: 6, y: 14, spread: 3, chance: 0.35 }
        ],
        elite: [
          { type: "elite", x: 26, y: 11, spread: 3 }
        ]
      },
      portals: [
        {
          id: "cemiterio_para_cripta",
          x: 3.4,
          y: 5.4,
          radius: 1.2,
          targetMap: "cripta_inicial",
          targetSpawn: "from_cemiterio",
          label: "Cripta Inicial"
        },
        {
          id: "cemiterio_para_estrada",
          x: 15,
          y: 27.5,
          radius: 1.25,
          targetMap: "estrada_dos_enforcados",
          targetSpawn: "from_cemiterio",
          label: "Estrada dos Enforcados"
        },
        {
          id: "cemiterio_para_secreta",
          x: 31.6,
          y: 20.9,
          radius: 1.25,
          targetMap: "area_secreta_cripta",
          targetSpawn: "entrada",
          label: "Area Secreta da Cripta",
          requiresFlag: "tombGuardianDefeated",
          lockedMessage: "Um selo antigo bloqueia esta passagem."
        }
      ]
    },
    estrada_dos_enforcados: {
      id: "estrada_dos_enforcados",
      name: "Estrada dos Enforcados",
      cols: 32,
      rows: 18,
      theme: "#100e0c",
      firstVisitMessage: "Aqui, humanos executavam aqueles que temiam.",
      spawns: {
        default: { x: 4.5, y: 9 },
        from_cemiterio: { x: 4.5, y: 9 },
        from_posto: { x: 28, y: 9 }
      },
      zones: [
        { id: "road", name: "Estrada dos Enforcados", x: 3, y: 5, w: 25, h: 8, color: "rgba(118, 84, 64, 0.34)" },
        { id: "execution", name: "Patibulos Antigos", x: 13, y: 2, w: 10, h: 5, color: "rgba(95, 65, 58, 0.3)" }
      ],
      enemies: [
        ["hunter", 13.5, 7.2], ["hunter", 22.8, 10.5],
        ["warhound", 16.2, 9.2], ["warhound", 24.6, 8.8],
        ["cultist", 19.5, 12.4], ["cultist", 11.5, 11.3]
      ],
      props: [
        { x: 14.3, y: 5.1, t: "gallows" }, { x: 20.5, y: 6.7, t: "gallows" },
        { x: 8.8, y: 13.2, t: "tree" }, { x: 26.8, y: 12.2, t: "grave" },
        { x: 11.8, y: 4.2, t: "gallows" }, { x: 23.8, y: 4.1, t: "tree" },
        { x: 18.2, y: 13.4, t: "grave" }, { x: 28.2, y: 8.7, t: "obelisk" }
      ],
      interestPoints: [
        {
          id: "forca_quebrada",
          label: "Forca Quebrada",
          x: 14.3,
          y: 5.1,
          radius: 1.45,
          t: "gallows",
          message: "A madeira conserva nomes riscados por prisioneiros esquecidos."
        },
        {
          id: "placa_cacadores",
          label: "Placa dos Cacadores",
          x: 27.8,
          y: 9.7,
          radius: 1.5,
          t: "sign",
          message: "Posto dos Cacadores: fronteira fechada por enquanto."
        },
        {
          id: "restos_carroca",
          label: "Restos de Carroca",
          x: 21.8,
          y: 12.6,
          radius: 1.45,
          t: "cart",
          once: true,
          rewardItem: "Osso Antigo",
          rewardAmount: 1,
          message: "Entre rodas quebradas, voce encontra ossos aproveitaveis.",
          doneMessage: "Restam apenas madeira podre e ferragens tortas."
        }
      ],
      respawn: {
        maxCommon: 10,
        maxElite: 0,
        commonInterval: 10,
        eliteInterval: 999,
        common: [
          { type: "hunter", x: 14, y: 7.5, spread: 5 },
          { type: "warhound", x: 18, y: 9.5, spread: 5 },
          { type: "cultist", x: 19, y: 12, spread: 4 },
          { type: "imp", x: 24, y: 8.5, spread: 3, chance: 0.18 }
        ],
        elite: []
      },
      portals: [
        {
          id: "estrada_para_cemiterio",
          x: 3.2,
          y: 9,
          radius: 1.25,
          targetMap: "cemiterio_neutro",
          targetSpawn: "from_estrada",
          label: "Cemiterio Neutro"
        },
        {
          id: "estrada_para_posto",
          x: 29,
          y: 9,
          radius: 1.25,
          targetMap: "",
          targetSpawn: "",
          label: "Posto dos Cacadores",
          future: true,
          lockedMessage: "Esta area estara disponivel em uma versao futura."
        }
      ]
    },
    area_secreta_cripta: {
      id: "area_secreta_cripta",
      name: "Area Secreta da Cripta",
      cols: 20,
      rows: 16,
      theme: "#0a0d12",
      firstVisitMessage: "Algo antigo repousa abaixo da cripta.",
      spawns: {
        default: { x: 4, y: 8 },
        entrada: { x: 4, y: 8 }
      },
      zones: [
        { id: "secret", name: "Area Secreta da Cripta", x: 3, y: 3, w: 14, h: 10, color: "rgba(63, 91, 119, 0.34)" }
      ],
      enemies: [
        ["cultist", 12, 8], ["imp", 14, 10]
      ],
      props: [
        { x: 10.5, y: 7.2, t: "dragonmark" },
        { x: 11.2, y: 8.3, t: "scale" },
        { x: 15.4, y: 11.4, t: "obelisk" },
        { x: 7.4, y: 5.2, t: "obelisk" },
        { x: 13.3, y: 5.4, t: "dragonmark" },
        { x: 16.3, y: 8.4, t: "grave" }
      ],
      interestPoints: [
        {
          id: "escama_draconica_rachada",
          label: "Escama Draconica Rachada",
          x: 11.2,
          y: 8.3,
          radius: 1.35,
          t: "scale",
          once: true,
          rewardItem: "Escama Draconica Rachada",
          rewardAmount: 1,
          message: "A escama e antiga demais para pertencer a qualquer criatura viva conhecida.",
          doneMessage: "O brilho draconico ja foi recolhido."
        },
        {
          id: "bau_antigo",
          label: "Bau Antigo",
          x: 14.7,
          y: 10.8,
          radius: 1.35,
          t: "chest",
          once: true,
          rewardItem: "Nucleo Sombrio",
          rewardAmount: 1,
          message: "O bau range e entrega um nucleo sombrio selado.",
          doneMessage: "O bau antigo esta vazio."
        },
        {
          id: "mural_apagado",
          label: "Mural Apagado",
          x: 15.4,
          y: 11.4,
          radius: 1.45,
          t: "mural",
          message: "O mural sugere tres reinos em guerra: mortos, humanos e algo sob as cinzas."
        }
      ],
      respawn: {
        maxCommon: 2,
        maxElite: 0,
        commonInterval: 35,
        eliteInterval: 999,
        common: [
          { type: "cultist", x: 12, y: 8, spread: 2 },
          { type: "imp", x: 14, y: 10, spread: 2, chance: 0.4 }
        ],
        elite: []
      },
      portals: [
        {
          id: "secreta_para_cemiterio",
          x: 3,
          y: 8,
          radius: 1.25,
          targetMap: "cemiterio_neutro",
          targetSpawn: "from_area_secreta",
          label: "Cemiterio Neutro"
        }
      ]
    }
  };

  window.WorldRegions = [
    {
      id: "cripta_inicial",
      name: "Dominio da Cripta Inicial",
      desc: "Onde o folego da morte se recusa a partir. Zona de seguranca para necromantes despertos.",
      type: "safe",
      level: 1,
      status: "unlocked",
      requires: null,
      pointsOfInterest: [
        { id: "trono", name: "Trono Funerário", kind: "lore", desc: "Assento de poder da linhagem esquecida." },
        { id: "altar", name: "Altar de Renascimento", kind: "service", desc: "Ponto de ancoragem para almas caídas." }
      ]
    },
    {
      id: "cemiterio_neutro",
      name: "Cemiterio Neutro",
      desc: "Um campo de ossos esquecidos sob a vigia de um Guardiao antigo.",
      type: "field",
      level: 1,
      status: "unlocked",
      requires: null,
      pointsOfInterest: [
        { id: "arena", name: "Arena do Guardião", kind: "boss", desc: "Local onde reside o sentinela da tumba." },
        { id: "selo", name: "Selo da Área Secreta", kind: "quest", desc: "Passagem selada por magia ancestral." },
        { id: "treino", name: "Campo de Treinamento", kind: "service", desc: "Espaço para fortalecer a vontade dos servos." }
      ]
    },
    {
      id: "estrada_dos_enforcados",
      name: "Estrada dos Enforcados",
      desc: "Caminho onde a justiça humana deixou cicatrizes profundas na terra.",
      type: "danger",
      level: 5,
      status: "unlocked",
      requires: null,
      pointsOfInterest: [
        { id: "forca", name: "Forca Quebrada", kind: "lore", desc: "Resquícios de execuções do Reino Humano." },
        { id: "placa", name: "Placa dos Caçadores", kind: "lore", desc: "Aviso de fronteira vigiada." },
        { id: "carroca", name: "Restos de Carroça", kind: "loot", desc: "Espólios de viajantes desafortunados." }
      ]
    },
    {
      id: "fronteira_tres_reinos",
      name: "Fronteira dos Tres Reinos",
      desc: "A divisao entre os dominios de Humanos, Demonios e o rastro dos Dragoes.",
      type: "boss",
      level: 10,
      status: "locked",
      requires: "tombGuardianDefeated",
      pointsOfInterest: [
        { id: "marco", name: "Marco dos Humanos", kind: "lore", desc: "Monumento à resistência da humanidade." },
        { id: "fenda", name: "Fenda Demoníaca", kind: "danger", desc: "Ponto de instabilidade entre dimensões." },
        { id: "cinzas", name: "Cinzas Dracônicas", kind: "lore", desc: "Vestígios do voo dos soberanos antigos." }
      ]
    },
    {
      id: "vale_cinzas",
      name: "Vale das Cinzas Draconicas",
      desc: "Territorio sagrado e calcinado. Conteudo para futuras expansões.",
      type: "future",
      status: "future",
      level: 20,
      requires: "futureContent",
      pointsOfInterest: [
        { id: "ossario", name: "Ossário Dracônico", kind: "lore", desc: "Cemitério de gigantes alados." },
        { id: "ruinas", name: "Ruínas Calcinadas", kind: "lore", desc: "Cidades devoradas pelo fogo primordial." },
        { id: "sinal", name: "Sinal dos Dragões", kind: "quest", desc: "Um chamado que ecoa através das eras." }
      ]
    }
  ];

  window.GameMap = function GameMap() {
    this.tileW = cfg.world.tileW;
    this.tileH = cfg.world.tileH;
    this.secretUnlocked = false;
    this.load("cripta_inicial");
  };

  GameMap.prototype.load = function (id) {
    this.current = window.WorldMaps[id] || window.WorldMaps.cripta_inicial;
    this.currentId = this.current.id;
    this.cols = this.current.cols;
    this.rows = this.current.rows;
    this.zones = this.current.zones || [];
    this.portals = this.current.portals || [];
  };

  GameMap.prototype.getSpawn = function (spawnId) {
    return (this.current.spawns && this.current.spawns[spawnId]) || this.current.spawns.default || { x: 2, y: 2 };
  };

  GameMap.prototype.project = function (x, y, camera, canvas) {
    var sx = (x - y) * this.tileW * 0.5 - camera.x + canvas.width * 0.5;
    var sy = (x + y) * this.tileH * 0.5 - camera.y + canvas.height * 0.5;
    return { x: sx, y: sy };
  };

  GameMap.prototype.projectRaw = function (x, y) {
    return {
      x: (x - y) * this.tileW * 0.5,
      y: (x + y) * this.tileH * 0.5
    };
  };

  GameMap.prototype.getCameraFor = function (x, y, canvas) {
    var p = this.projectRaw(x, y);
    var corners = [
      this.projectRaw(0, 0),
      this.projectRaw(this.cols, 0),
      this.projectRaw(0, this.rows),
      this.projectRaw(this.cols, this.rows)
    ];
    var minX = Math.min(corners[0].x, corners[1].x, corners[2].x, corners[3].x) - 180;
    var maxX = Math.max(corners[0].x, corners[1].x, corners[2].x, corners[3].x) + 180;
    var minY = Math.min(corners[0].y, corners[1].y, corners[2].y, corners[3].y) - 130;
    var maxY = Math.max(corners[0].y, corners[1].y, corners[2].y, corners[3].y) + 130;
    if (maxX - minX <= canvas.width) p.x = (minX + maxX) * 0.5;
    if (maxY - minY <= canvas.height) p.y = (minY + maxY) * 0.5;
    return {
      x: Math.max(minX + canvas.width * 0.5, Math.min(maxX - canvas.width * 0.5, p.x)),
      y: Math.max(minY + canvas.height * 0.5, Math.min(maxY - canvas.height * 0.5, p.y))
    };
  };

  GameMap.prototype.clampPosition = function (entity) {
    entity.x = Math.max(0.8, Math.min(this.cols - 0.8, entity.x));
    entity.y = Math.max(0.8, Math.min(this.rows - 0.8, entity.y));
  };

  GameMap.prototype.inZone = function (x, y, id) {
    var zone = this.zones.find(function (item) { return item.id === id; });
    if (!zone) return false;
    return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
  };

  GameMap.prototype.getZoneNameAt = function (x, y) {
    for (var i = 0; i < this.zones.length; i += 1) {
      var zone = this.zones[i];
      if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) return zone.name;
    }
    return this.current.name;
  };

  GameMap.prototype.isPortalUnlocked = function (portal, flags) {
    if (portal.future) return false;
    if (!portal.requiresFlag) return true;
    return Boolean(flags && flags[portal.requiresFlag]);
  };

  GameMap.prototype.getNearbyPortal = function (x, y, flags) {
    var info = this.getNearbyPortalInfo(x, y, flags);
    return info && info.portal;
  };

  GameMap.prototype.getNearbyPortalInfo = function (x, y, flags) {
    var best = null;
    var bestDist = Infinity;
    this.portals.forEach(function (portal) {
      var dist = Math.hypot(portal.x - x, portal.y - y);
      if (dist <= portal.radius && dist < bestDist) {
        best = portal;
        bestDist = dist;
      }
    });
    return best ? { portal: best, dist: bestDist } : null;
  };

  GameMap.prototype.getNearbyInterestInfo = function (x, y, flags) {
    var best = null;
    var bestDist = Infinity;
    (this.current.interestPoints || []).forEach(function (point) {
      if (point.requiresFlag && !(flags && flags[point.requiresFlag])) return;
      var dist = Math.hypot(point.x - x, point.y - y);
      if (dist <= point.radius && dist < bestDist) {
        best = point;
        bestDist = dist;
      }
    });
    return best ? { point: best, dist: bestDist } : null;
  };

  GameMap.prototype.getPortalDisplayName = function (portal, flags) {
    if (this.isPortalUnlocked(portal, flags)) return portal.label;
    if (portal.future) return "Disponivel em versao futura";
    return "Selado";
  };

  GameMap.prototype.drawDiamond = function (ctx, p, w, h, fill, stroke) {
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
  };

  GameMap.prototype.drawZone = function (ctx, zone, camera, canvas) {
    var a = this.project(zone.x, zone.y, camera, canvas);
    var b = this.project(zone.x + zone.w, zone.y, camera, canvas);
    var c = this.project(zone.x + zone.w, zone.y + zone.h, camera, canvas);
    var d = this.project(zone.x, zone.y + zone.h, camera, canvas);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fillStyle = zone.color;
    ctx.fill();
    ctx.strokeStyle = zone.id === "boss" ? "rgba(223, 111, 132, 0.48)" : "rgba(223, 230, 216, 0.13)";
    ctx.stroke();
    var center = this.project(zone.x + zone.w * 0.5, zone.y + zone.h * 0.5, camera, canvas);
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "#dfe9d9";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(zone.name, center.x, center.y);
    ctx.restore();
  };

  GameMap.prototype.drawProps = function (ctx, camera, canvas) {
    (this.current.props || []).forEach(function (prop) {
      var p = this.project(prop.x, prop.y, camera, canvas);
      if (window.GameArt && window.GameArt.drawMapProp(ctx, prop, p, this.currentId)) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (prop.t === "crypt") {
        ctx.fillStyle = "#313846";
        ctx.fillRect(-30, -48, 60, 44);
        ctx.fillStyle = "#11151c";
        ctx.fillRect(-16, -24, 32, 20);
        ctx.strokeStyle = "#758396";
        ctx.strokeRect(-30, -48, 60, 44);
      } else if (prop.t === "grave") {
        ctx.fillStyle = "#9aa093";
        ctx.fillRect(-7, -22, 14, 24);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(-12, 0, 24, 6);
      } else if (prop.t === "tree") {
        ctx.fillStyle = "#283d34";
        ctx.beginPath();
        ctx.arc(0, -24, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#322b24";
        ctx.fillRect(-4, -18, 8, 22);
      } else if (prop.t === "dummy") {
        ctx.strokeStyle = "#c0a46c";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(0, 6);
        ctx.moveTo(-16, -18);
        ctx.lineTo(16, -18);
        ctx.stroke();
      } else if (prop.t === "bossgate") {
        ctx.strokeStyle = "#aa5159";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-22, -12);
        ctx.lineTo(22, -12);
        ctx.moveTo(-18, -28);
        ctx.lineTo(-18, 2);
        ctx.moveTo(18, -28);
        ctx.lineTo(18, 2);
        ctx.stroke();
      } else if (prop.t === "rift") {
        ctx.fillStyle = "#5a1916";
        ctx.beginPath();
        ctx.ellipse(0, -12, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e15b3d";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, -18);
        ctx.lineTo(-2, -36);
        ctx.lineTo(8, -17);
        ctx.lineTo(17, -31);
        ctx.stroke();
      } else if (prop.t === "dragonmark") {
        ctx.strokeStyle = "#94d7ff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-22, 4);
        ctx.lineTo(0, -42);
        ctx.lineTo(22, 4);
        ctx.moveTo(-12, -14);
        ctx.lineTo(12, -14);
        ctx.stroke();
      } else if (prop.t === "gallows") {
        ctx.strokeStyle = "#8e755f";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-16, 4);
        ctx.lineTo(-16, -42);
        ctx.lineTo(16, -42);
        ctx.lineTo(16, -26);
        ctx.stroke();
        ctx.strokeStyle = "#c3b093";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, -20, 6, 0, Math.PI * 2);
        ctx.stroke();
      } else if (prop.t === "scale") {
        ctx.fillStyle = "#9ed5ff";
        ctx.shadowColor = "#9ed5ff";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(0, -34);
        ctx.lineTo(18, -8);
        ctx.lineTo(3, 8);
        ctx.lineTo(-14, -5);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = "#8f9a9b";
        ctx.fillRect(-8, -28, 16, 32);
      }
      ctx.restore();
    }.bind(this));
  };

  GameMap.prototype.drawInterestPoints = function (ctx, camera, canvas, flags, mapState) {
    (this.current.interestPoints || []).forEach(function (point) {
      if (point.requiresFlag && !(flags && flags[point.requiresFlag])) return;
      var done = Boolean(mapState && mapState.events && mapState.events[point.id]);
      var p = this.project(point.x, point.y, camera, canvas);
      ctx.save();
      ctx.translate(p.x, p.y);
      if (window.GameArt) {
        if (!done) window.GameArt.drawAura(ctx, 0, -15, 24, "rgba(231,213,138,0.35)", performance.now() / 1000);
        if (point.t === "seal" || point.t === "altar") window.GameArt.drawRuneCircle(ctx, 0, -5, 25, done ? "#7c8b86" : "#e7d58a", performance.now() / 1000);
      }
      ctx.globalAlpha = done ? 0.55 : 0.95;
      ctx.fillStyle = "rgba(6, 9, 12, 0.48)";
      ctx.beginPath();
      ctx.ellipse(0, 5, 24, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = done ? "#7c8b86" : "#e7d58a";
      ctx.fillStyle = done ? "#6f7d77" : "#c7ad55";
      ctx.lineWidth = 3;
      if (point.t === "chest") {
        ctx.fillRect(-16, -22, 32, 20);
        ctx.strokeRect(-16, -22, 32, 20);
        ctx.fillRect(-12, -31, 24, 10);
        ctx.strokeRect(-12, -31, 24, 10);
      } else if (point.t === "seal") {
        ctx.beginPath();
        ctx.arc(0, -16, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-13, -29);
        ctx.lineTo(13, -3);
        ctx.moveTo(13, -29);
        ctx.lineTo(-13, -3);
        ctx.stroke();
      } else if (point.t === "sign") {
        ctx.fillRect(-18, -34, 36, 20);
        ctx.fillStyle = "#7d6746";
        ctx.fillRect(-4, -14, 8, 20);
      } else if (point.t === "cart") {
        ctx.strokeRect(-20, -22, 34, 14);
        ctx.beginPath();
        ctx.arc(-13, -5, 5, 0, Math.PI * 2);
        ctx.arc(11, -5, 5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (point.t === "altar") {
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(18, -8);
        ctx.lineTo(0, 2);
        ctx.lineTo(-18, -8);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, -18, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = done ? "#b6c1bc" : "#fff1ac";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.82)";
      ctx.lineWidth = 3;
      ctx.strokeText(point.label, 0, -47);
      ctx.fillText(point.label, 0, -47);
      ctx.restore();
    }.bind(this));
  };

  GameMap.prototype.drawPortals = function (ctx, camera, canvas, flags) {
    this.portals.forEach(function (portal) {
      var p = this.project(portal.x, portal.y, camera, canvas);
      var unlocked = this.isPortalUnlocked(portal, flags);
      ctx.save();
      ctx.translate(p.x, p.y);
      if (window.GameArt) {
        window.GameArt.drawDetailedPortal(ctx, portal, unlocked, this.getPortalDisplayName(portal, flags), performance.now() / 1000);
        ctx.restore();
        return;
      }
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = portal.future ? "#8a7b5e" : unlocked ? "#7df0cd" : "#d36c84";
      ctx.fillStyle = portal.future ? "rgba(138,123,94,0.18)" : unlocked ? "rgba(125,240,205,0.16)" : "rgba(211,108,132,0.16)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 34, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -18, 24, Math.PI, 0);
      ctx.stroke();
      if (!unlocked) {
        ctx.beginPath();
        ctx.moveTo(-18, -18);
        ctx.lineTo(18, 14);
        ctx.moveTo(18, -18);
        ctx.lineTo(-18, 14);
        ctx.stroke();
      }
      ctx.fillStyle = unlocked ? "#dffdf2" : "#f0c4cd";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.82)";
      ctx.lineWidth = 3;
      ctx.strokeText(this.getPortalDisplayName(portal, flags), 0, -42);
      ctx.fillText(this.getPortalDisplayName(portal, flags), 0, -42);
      ctx.restore();
    }.bind(this));
  };

  GameMap.prototype.draw = function (ctx, camera, canvas, flags, mapState) {
    ctx.fillStyle = this.current.theme || "#08080c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var y = 0; y <= this.rows; y += 1) {
      for (var x = 0; x <= this.cols; x += 1) {
        if ((x + y) % 2 !== 0) continue;
        var p = this.project(x, y, camera, canvas);
        if (p.x < -90 || p.x > canvas.width + 90 || p.y < -70 || p.y > canvas.height + 70) continue;
        if (window.GameArt) window.GameArt.drawIsoTile(ctx, p, this.tileW, this.tileH, this.currentId, x, y);
        else {
          var shade = (x + y) % 4 === 0 ? "#111719" : "#0e1417";
          this.drawDiamond(ctx, p, this.tileW, this.tileH, shade, "rgba(181, 198, 183, 0.045)");
        }
      }
    }

    this.zones.forEach(function (zone) {
      this.drawZone(ctx, zone, camera, canvas);
    }.bind(this));
    this.drawProps(ctx, camera, canvas);
    this.drawInterestPoints(ctx, camera, canvas, flags || {}, mapState || {});
    this.drawPortals(ctx, camera, canvas, flags || {});
  };
})();
