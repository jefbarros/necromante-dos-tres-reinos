(function () {
  "use strict";

window.GameConfig = {
    version: "0.2.7",
    title: "Necromante dos Tres Reinos",
    visualQuality: "medium",
    world: {
      cols: 40,
      rows: 30,
      tileW: 72,
      tileH: 36,
      spawn: { x: 5.5, y: 5.2 }
    },
    commands: ["atacar", "proteger", "recuar", "dispersar"],
    capture: {
      rat: 0.8,
      wolf: 0.55,
      soldier: 0.4,
      elite: 0.2,
      hunter: 0.3,
      warhound: 0.45,
      cultist: 0.5,
      imp: 0.22,
      boss: 0
    },
    player: {
      radius: 0.42,
      speed: 5.1,
      maxHp: 130,
      maxMana: 100,
      necroDomain: 1,
      soulControl: 3,
      regenManaPerSecond: 2.4
    },
    skills: {
      attack: { damage: 14, cooldown: 0.34, range: 10, speed: 13, mana: 0 },
      skill1: { name: "Dreno de Alma", damage: 20, cooldown: 3.2, range: 7.2, mana: 14 },
      skill2: { name: "Lanca Ossea", damage: 31, cooldown: 4.2, range: 13, speed: 16, mana: 20 },
      skill3: { name: "Marca da Submissao", damage: 0, cooldown: 7.5, range: 8.5, mana: 16 },
      skill4: { name: "Explosao Cadaverica", damage: 38, cooldown: 7.8, range: 4.2, radius: 2.7, mana: 24 }
    },
    enemies: {
      rat: {
        name: "Rato de Cripta",
        hp: 32,
        speed: 3.9,
        damage: 7,
        exp: 8,
        fragments: 1,
        radius: 0.34,
        color: "#9ba587",
        captureKey: "rat"
      },
      wolf: {
        name: "Lobo Cadaverico Selvagem",
        hp: 58,
        speed: 3.65,
        damage: 12,
        exp: 15,
        fragments: 2,
        radius: 0.42,
        color: "#7b8e95",
        captureKey: "wolf"
      },
      soldier: {
        name: "Soldado Humano Caido",
        hp: 88,
        speed: 2.65,
        damage: 15,
        exp: 22,
        fragments: 3,
        radius: 0.46,
        color: "#a98d72",
        captureKey: "soldier"
      },
      elite: {
        name: "Elite Profanado",
        hp: 150,
        speed: 2.9,
        damage: 22,
        exp: 42,
        fragments: 6,
        radius: 0.54,
        color: "#c8a04f",
        captureKey: "elite"
      },
      hunter: {
        name: "Cacador Humano",
        hp: 96,
        speed: 3.1,
        damage: 18,
        exp: 28,
        fragments: 3,
        radius: 0.44,
        color: "#b88f67",
        captureKey: "hunter"
      },
      warhound: {
        name: "Cao de Guerra Cadaverico",
        hp: 70,
        speed: 4.1,
        damage: 14,
        exp: 19,
        fragments: 2,
        radius: 0.4,
        color: "#8a9284",
        captureKey: "warhound"
      },
      cultist: {
        name: "Cultista Fraco",
        hp: 54,
        speed: 2.75,
        damage: 10,
        exp: 18,
        fragments: 2,
        radius: 0.38,
        color: "#75608f",
        captureKey: "cultist"
      },
      imp: {
        name: "Imp Abissal",
        hp: 72,
        speed: 3.35,
        damage: 14,
        exp: 26,
        fragments: 4,
        radius: 0.4,
        color: "#d05a45",
        captureKey: "imp"
      },
      boss: {
        name: "Guardiao de Tumba",
        hp: 620,
        speed: 2.05,
        damage: 28,
        exp: 130,
        fragments: 24,
        radius: 0.9,
        color: "#7b6bd8",
        captureKey: "boss"
      }
    },
    servants: {
      skeleton: {
        name: "Esqueleto Guerreiro",
        hp: 78,
        speed: 3.5,
        damage: 13,
        defense: 2,
        radius: 0.39,
        color: "#d8d7c3",
        protectBias: 1
      },
      veteran: {
        name: "Esqueleto Veterano",
        hp: 122,
        speed: 3.75,
        damage: 20,
        defense: 5,
        radius: 0.43,
        color: "#f0e0a7",
        protectBias: 1.7
      },
      feral: {
        name: "Servo Feral",
        hp: 60,
        speed: 4.05,
        damage: 12,
        defense: 1,
        radius: 0.36,
        color: "#add0c6",
        protectBias: 0.8
      },
      fallen: {
        name: "Soldado Reerguido",
        hp: 96,
        speed: 3,
        damage: 16,
        defense: 3,
        radius: 0.42,
        color: "#cbb18b",
        protectBias: 1.2
      },
      ember: {
        name: "Imp Acorrentado",
        hp: 82,
        speed: 3.45,
        damage: 18,
        defense: 2,
        radius: 0.39,
        color: "#e17253",
        protectBias: 0.9
      },
      hunterShade: {
        name: "Cacador Reerguido",
        hp: 92,
        speed: 3.1,
        damage: 17,
        defense: 2,
        radius: 0.41,
        color: "#c19b7a",
        protectBias: 1
      },
      cultistShade: {
        name: "Cultista Vazio",
        hp: 66,
        speed: 3.1,
        damage: 14,
        defense: 1,
        radius: 0.37,
        color: "#a790cc",
        protectBias: 0.8
      }
    },
    skillTree: [
      {
        id: "invocador",
        path: "Invocador",
        name: "Vinculo de Ossos",
        cost: 1,
        text: "Servos recebem +18 vida maxima."
      },
      {
        id: "ceifador",
        path: "Ceifador",
        name: "Dreno Cruel",
        cost: 1,
        text: "Dreno de Alma causa +10 dano."
      },
      {
        id: "senhor_almas",
        path: "Senhor das Almas",
        name: "Mao do Submundo",
        cost: 1,
        text: "+12% chance de captura."
      },
      {
        id: "estrategista",
        path: "Estrategista Sombrio",
        name: "Ordens Sombrias",
        cost: 1,
        text: "Servos recebem +1 defesa e obedecem melhor comandos."
      }
    ],
    equipment: {
      crackedStaff: {
        name: "Cajado Rachado",
        text: "+5 dano magico.",
        slot: "weapon"
      },
      boneGrimoire: {
        name: "Grimorio de Ossos",
        text: "+10% chance de captura.",
        slot: "tome"
      },
      cryptRing: {
        name: "Anel da Cripta",
        text: "+10 vida maxima para servos.",
        slot: "ring"
      }
    }
  };
})();
