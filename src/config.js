(function () {
  "use strict";

  window.GameConfig = {
    version: "0.3.3",
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
        damage: 5,
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
        damage: 10,
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
        damage: 12,
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
        damage: 11,
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
        damage: 8,
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
        damage: 22,
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
        id: "invocador_vinculo",
        path: "Invocador",
        name: "Vinculo de Ossos",
        cost: 1,
        levelRequired: 1,
        requires: "",
        text: "Servos recebem +18 vida maxima.",
        effect: "servantHp18"
      },
      {
        id: "invocador_limite",
        path: "Invocador",
        name: "Legiao Menor",
        cost: 2,
        levelRequired: 3,
        requires: "invocador_vinculo",
        text: "+1 soulControl do necromante, respeitando o limite ativo atual.",
        effect: "soulControl1"
      },
      {
        id: "invocador_protecao",
        path: "Invocador",
        name: "Carapaca Funeraria",
        cost: 1,
        levelRequired: 4,
        requires: "invocador_vinculo",
        text: "Servos recebem +1 defesa.",
        effect: "servantDefense1"
      },
      {
        id: "ceifador_dreno",
        path: "Ceifador",
        name: "Dreno Cruel",
        cost: 1,
        levelRequired: 1,
        requires: "",
        text: "Dreno de Alma causa +10 dano.",
        effect: "drainDamage10"
      },
      {
        id: "ceifador_lanca",
        path: "Ceifador",
        name: "Lanca Serrilhada",
        cost: 1,
        levelRequired: 3,
        requires: "ceifador_dreno",
        text: "Lanca Ossea causa +8 dano.",
        effect: "boneSpearDamage8"
      },
      {
        id: "ceifador_sangue_frio",
        path: "Ceifador",
        name: "Sangue Frio",
        cost: 2,
        levelRequired: 5,
        requires: "ceifador_lanca",
        text: "Ataque basico recebe +4 dano.",
        effect: "attackDamage4"
      },
      {
        id: "senhor_almas_mao",
        path: "Senhor das Almas",
        name: "Mao do Submundo",
        cost: 1,
        levelRequired: 1,
        requires: "",
        text: "+12% chance de captura.",
        effect: "capture12"
      },
      {
        id: "senhor_almas_coleta",
        path: "Senhor das Almas",
        name: "Ceifa Silenciosa",
        cost: 1,
        levelRequired: 2,
        requires: "senhor_almas_mao",
        text: "Almas coletadas geram +1 fragmento.",
        effect: "autoSoulFragment1"
      },
      {
        id: "senhor_almas_dominio",
        path: "Senhor das Almas",
        name: "Dominio Necrotico",
        cost: 2,
        levelRequired: 5,
        requires: "senhor_almas_coleta",
        text: "+0.3 dominio necrotico.",
        effect: "necroDomain03"
      },
      {
        id: "estrategista_ordens",
        path: "Estrategista Sombrio",
        name: "Ordens Sombrias",
        cost: 1,
        levelRequired: 1,
        requires: "",
        text: "Servos obedecem melhor comandos.",
        effect: "commandEfficiency25"
      },
      {
        id: "estrategista_ia",
        path: "Estrategista Sombrio",
        name: "Instinto de Guarda",
        cost: 1,
        levelRequired: 3,
        requires: "estrategista_ordens",
        text: "Servos defensivos protegem com mais vigor.",
        effect: "protectBias25"
      },
      {
        id: "estrategista_auto",
        path: "Estrategista Sombrio",
        name: "Mira Cadaverica",
        cost: 2,
        levelRequired: 4,
        requires: "estrategista_ordens",
        text: "Auto-ataque ganha +1 alcance.",
        effect: "autoAttackRange1"
      }
    ],
    equipment: {
      crackedStaff: {
        name: "Cajado Rachado",
        text: "+5 dano magico.",
        desc: "Um foco inicial trincado, ainda capaz de conduzir necromancia bruta.",
        slot: "weapon",
        type: "Arma",
        rarity: "Comum",
        power: 12,
        style: "Magia",
        bonuses: { magicDamage: 5 }
      },
      rustyBlade: {
        name: "Lamina Enferrujada",
        text: "+3 dano do ataque basico.",
        desc: "Aproxima o necromante do combate direto e acelera execucoes simples.",
        slot: "weapon",
        type: "Arma",
        rarity: "Comum",
        power: 10,
        style: "Ataque basico",
        bonuses: { attackDamage: 3 }
      },
      boneGrimoire: {
        name: "Grimorio de Ossos",
        text: "+10% chance de captura.",
        desc: "Registra pactos funerarios que tornam almas fracas mais obedientes.",
        slot: "tome",
        type: "Tomo",
        rarity: "Incomum",
        power: 14,
        style: "Captura",
        bonuses: { captureChance: 10 }
      },
      boneAmulet: {
        name: "Amuleto de Ossos",
        text: "+12 vida maxima para servos.",
        desc: "Costelas gravadas reforcam corpos reerguidos sob seu comando.",
        slot: "amulet",
        type: "Amuleto",
        rarity: "Incomum",
        power: 16,
        style: "Servos",
        bonuses: { servantHp: 12 }
      },
      cryptRing: {
        name: "Anel da Cripta",
        text: "+10 vida maxima para servos.",
        desc: "Um elo frio que ancora servos menores ao mundo fisico.",
        slot: "ring",
        type: "Anel",
        rarity: "Comum",
        power: 11,
        style: "Servos",
        bonuses: { servantHp: 10 }
      },
      shadowRing: {
        name: "Anel Sombrio",
        text: "+0.1 dominio necrotico.",
        desc: "Sussurra dominio ao portador, favorecendo rituais e capturas.",
        slot: "ring",
        type: "Anel",
        rarity: "Raro",
        power: 18,
        style: "Dominio",
        bonuses: { necroDomain: 0.1 }
      }
    },
    consumables: {
      healthPotion: {
        name: "Pocao de Vida",
        text: "Restaura 45 de vida.",
        effect: "heal",
        amount: 45
      },
      manaPotion: {
        name: "Pocao de Mana",
        text: "Restaura 35 de mana.",
        effect: "mana",
        amount: 35
      }
    },
    materials: {
      soulFragment: "Fragmento de Alma",
      oldBone: "Osso Antigo",
      darkCore: "Nucleo Sombrio",
      demonAsh: "Cinza Demoniaca",
      crackedDragonScale: "Escama Draconica Rachada"
    },
    dropTables: {
      rat: [
        { item: "oldBone", type: "materials", chance: 0.75, amount: 1 },
        { item: "healthPotion", type: "consumables", chance: 0.08, amount: 1 }
      ],
      wolf: [
        { item: "oldBone", type: "materials", chance: 0.85, amount: 1 },
        { item: "rustyBlade", type: "equipment", chance: 0.08, amount: 1 }
      ],
      soldier: [
        { item: "oldBone", type: "materials", chance: 0.9, amount: 2 },
        { item: "healthPotion", type: "consumables", chance: 0.18, amount: 1 },
        { item: "rustyBlade", type: "equipment", chance: 0.12, amount: 1 }
      ],
      elite: [
        { item: "darkCore", type: "materials", chance: 1, amount: 1 },
        { item: "shadowRing", type: "equipment", chance: 0.22, amount: 1 }
      ],
      hunter: [
        { item: "oldBone", type: "materials", chance: 0.8, amount: 2 },
        { item: "manaPotion", type: "consumables", chance: 0.14, amount: 1 }
      ],
      warhound: [
        { item: "oldBone", type: "materials", chance: 0.8, amount: 1 },
        { item: "boneAmulet", type: "equipment", chance: 0.08, amount: 1 }
      ],
      cultist: [
        { item: "darkCore", type: "materials", chance: 0.75, amount: 1 },
        { item: "manaPotion", type: "consumables", chance: 0.18, amount: 1 },
        { item: "boneAmulet", type: "equipment", chance: 0.1, amount: 1 }
      ],
      imp: [
        { item: "demonAsh", type: "materials", chance: 0.9, amount: 1 },
        { item: "shadowRing", type: "equipment", chance: 0.1, amount: 1 }
      ],
      boss: [
        { item: "darkCore", type: "materials", chance: 1, amount: 2 },
        { item: "boneAmulet", type: "equipment", chance: 1, amount: 1 },
        { item: "shadowRing", type: "equipment", chance: 0.5, amount: 1 }
      ]
    },
    servantRoles: {
      skeleton: "Tanque/defensivo",
      veteran: "Tanque/defensivo",
      feral: "Rapido/agressivo",
      fallen: "Dano",
      ember: "Dano",
      hunterShade: "Rapido/agressivo",
      cultistShade: "Suporte/magico"
    },
    reserveFilters: {
      all: "Todos",
      tank: "Tanque/defensivo",
      damage: "Dano",
      fast: "Rapido/agressivo",
      support: "Suporte/magico"
    },
    inventoryTabs: {
      equipment: "Equipamentos",
      consumables: "Consumiveis",
      materials: "Materiais"
    },
    menuOptions: {
      root: [
        "Continuar",
        "Equipe",
        "Inventario",
        "Talentos",
        "Mapa",
        "Salvar/Carregar",
        "Conta",
        "Controles",
        "Creditos"
      ]
    }
  };
})();
