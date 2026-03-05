/**
 * Extract the base Pokemon ID from variant forms
 * Examples:
 * - "charizard" (id: 6) -> 6
 * - "charizard-mega-x" (id: 10006) -> 6
 * - "venusaur-mega" (id: 10003) -> 3
 * - "pikachu-alola" (id: 10081) -> 25
 */

// Mapping of variant Pokemon to their base Pokemon ID
const variantToBaseIdMap: Record<string, number> = {
  // Venusaur forms
  "venusaur-mega": 3,

  // Charizard forms
  "charizard-mega-x": 6,
  "charizard-mega-y": 6,
  "charizard-gmax": 6,

  // Blastoise forms
  "blastoise-mega": 9,
  "blastoise-gmax": 9,

  // Butterfree forms
  "butterfree-gmax": 12,

  // Pikachu forms
  "pikachu-alola": 25,
  "pikachu-gmax": 25,

  // Raichu forms
  "raichu-alola": 26,
  "raichu-galar": 26,

  // Grimer forms
  "grimer-alola": 88,

  // Muk forms
  "muk-alola": 89,

  // Slowpoke forms
  "slowpoke-galar": 79,

  // Slowbro forms
  "slowbro-mega": 80,
  "slowbro-galar": 80,

  // Slowking forms
  "slowking-galar": 199,

  // Farfetchd forms
  "farfetchd-galar": 83,

  // Weezing forms
  "weezing-galar": 110,

  // Vulpix forms
  "vulpix-alola": 37,

  // Ninetales forms
  "ninetales-alola": 38,

  // Diglett forms
  "diglett-alola": 50,

  // Dugtrio forms
  "dugtrio-alola": 51,

  // Cubone forms
  "cubone-alola": 104,

  // Marowak forms
  "marowak-alola": 105,

  // Growlithe forms
  "growlithe-hisui": 58,

  // Arcanine forms
  "arcanine-galar": 59,
  "arcanine-hisui": 59,

  // Alakazam forms
  "alakazam-mega": 65,

  // Machamp forms
  "machamp-gmax": 68,

  // Golem forms
  "golem-alola": 76,

  // Rapidash forms
  "rapidash-galar": 78,

  // Exeggcute forms
  "exeggcute-alola": 102,

  // Exeggutor forms
  "exeggutor-alola": 103,
  "exeggutor-galar": 103,

  // Gengar forms
  "gengar-mega": 94,
  "gengar-gmax": 94,

  // Kingler forms
  "kingler-gmax": 99,

  // Voltorb forms
  "voltorb-hisui": 100,

  // Electrode forms
  "electrode-hisui": 101,

  // Lapras forms
  "lapras-gmax": 131,

  // Snorlax forms
  "snorlax-gmax": 143,

  // Articuno forms
  "articuno-galar": 144,

  // Zapdos forms
  "zapdos-galar": 145,

  // Moltres forms
  "moltres-galar": 146,

  // Dragonite forms
  "dragonite-gmax": 149,

  // Mewtwo forms
  "mewtwo-mega-x": 150,
  "mewtwo-mega-y": 150,

  // Ampharos forms
  "ampharos-mega": 181,

  // Scizor forms
  "scizor-mega": 212,

  // Heracross forms
  "heracross-mega": 214,

  // Houndoom forms
  "houndoom-mega": 229,

  // Tyranitar forms
  "tyranitar-mega": 248,

  // Blaziken forms
  "blaziken-mega": 257,

  // Gardevoir forms
  "gardevoir-mega": 282,

  // Salamence forms
  "salamence-mega": 373,

  // Metagross forms
  "metagross-mega": 375,

  // Rayquaza forms
  "rayquaza-mega": 384,

  // Castform forms
  "castform-rainy": 351,
  "castform-snowy": 351,
  "castform-sunny": 351,

  // Cherrim forms
  "cherrim-sunshine": 421,

  // Shellos forms
  "shellos-east": 422,

  // Gastrodon forms
  "gastrodon-east": 423,

  // Rotom forms
  "rotom-heat": 479,
  "rotom-wash": 479,
  "rotom-frost": 479,
  "rotom-spin": 479,
  "rotom-cut": 479,

  // Giratina forms
  "giratina-origin": 487,

  // Shaymin forms
  "shaymin-sky": 492,

  // Arceus forms (all types)
  "arceus-bug": 493,
  "arceus-dark": 493,
  "arceus-dragon": 493,
  "arceus-electric": 493,
  "arceus-fairy": 493,
  "arceus-fighting": 493,
  "arceus-fire": 493,
  "arceus-flying": 493,
  "arceus-ghost": 493,
  "arceus-grass": 493,
  "arceus-ground": 493,
  "arceus-ice": 493,
  "arceus-poison": 493,
  "arceus-psychic": 493,
  "arceus-rock": 493,
  "arceus-steel": 493,
  "arceus-water": 493,

  // Tornadus forms
  "tornadus-therian": 641,

  // Thundurus forms
  "thundurus-therian": 642,

  // Landorus forms
  "landorus-therian": 645,

  // Kyurem forms
  "kyurem-black": 646,
  "kyurem-white": 646,

  // Keldeo forms
  "keldeo-resolute": 647,

  // Meowstic forms
  "meowstic-female": 678,

  // Aegislash forms
  "aegislash-blade": 681,

  // Pumpkaboo forms
  "pumpkaboo-large": 710,
  "pumpkaboo-small": 710,
  "pumpkaboo-super": 710,

  // Gourgeist forms
  "gourgeist-large": 711,
  "gourgeist-small": 711,
  "gourgeist-super": 711,

  // Trevenant forms
  "trevenant-gmax": 709,

  // Avalugg forms
  "avalugg-hisui": 713,

  // Sliggoo forms
  "sliggoo-hisui": 704,

  // Goodra forms
  "goodra-hisui": 705,

  // Noivern forms
  "noivern-gmax": 715,

  // Zygarde forms
  "zygarde-10": 718,
  "zygarde-complete": 718,

  // Diancie forms
  "diancie-mega": 719,

  // Hoopa forms
  "hoopa-unbound": 720,

  // Rattata forms
  "rattata-alola": 19,

  // Raticate forms
  "raticate-alola": 20,

  // Meowth forms
  "meowth-alola": 52,

  // Persian forms
  "persian-alola": 53,

  // Stoutland forms
  "stoutland-galar": 507,

  // Unfezant forms
  "unfezant-female": 519,

  // Gigalith forms
  "gigalith-gmax": 526,

  // Excadrill forms
  "excadrill-gmax": 530,

  // Audino forms
  "audino-mega": 531,

  // Seismitoad forms
  "seismitoad-gmax": 537,

  // Whimscott forms
  "whimscott-galar": 547,

  // Lilligant forms
  "lilligant-hisui": 549,

  // Basculin forms
  "basculin-white-striped": 550,

  // Deerling forms
  "deerling-autumn": 585,
  "deerling-summer": 585,
  "deerling-winter": 585,

  // Sawsbuck forms
  "sawsbuck-autumn": 586,
  "sawsbuck-summer": 586,
  "sawsbuck-winter": 586,

  // Chandelure forms
  "chandelure-gmax": 609,

  // Haxorus forms
  "haxorus-gmax": 612,

  // Beartic forms
  "beartic-galar": 614,

  // Stunfisk forms
  "stunfisk-galar": 618,

  // Golurk forms
  "golurk-galar": 623,

  // Mandibuzz forms
  "mandibuzz-galar": 630,

  // Hydreigon forms
  "hydreigon-gmax": 635,

  // Volcarona forms
  "volcarona-gmax": 637,

  // Melmetal forms
  "melmetal-gmax": 809,

  // Indeedee forms
  "indeedee-female": 876,

  // Basculegion forms
  "basculegion-female": 902,

  // Urshifu forms
  "urshifu-rapid-strike": 892,
  "urshifu-rapid-strike-gmax": 892,
  "urshifu-single-strike-gmax": 892,

  // Enamorus forms
  "enamorus-therian": 905,

  // Paldea Tauros forms
  "paldea-tauros-aqua": 128,
  "paldea-tauros-blaze": 128,

  // Paldea Wooper
  "paldea-wooper": 194,

  // Paldea Clodsire
  "paldea-clodsire": 195,

  // Typhlosion forms
  "typhlosion-hisui": 157,

  // Qwilfish forms
  "qwilfish-hisui": 211,

  // Sneasel forms
  "sneasel-hisui": 215,

  // Samurott forms
  "samurott-hisui": 503,

  // Zoroark forms
  "zoroark-hisui": 571,

  // Braviary forms
  "braviary-hisui": 628,

  // Togedemaru forms
  "togedemaru-totem": 777,

  // Mimikyu forms
  "mimikyu-busted": 778,
  "mimikyu-totem": 778,
  "mimikyu-totem-busted": 778,

  // Kommo-o forms
  "kommo-o-totem": 784,

  // Necrozma forms
  "necrozma-dawn": 800,
  "necrozma-dusk": 800,
  "necrozma-ultra": 800,
};

export function extractBasePokemonId(pokemonName: string, pokemonId: number): number {
  // First check if this Pokemon is in our manual mapping
  const baseName = pokemonName.toLowerCase();
  if (variantToBaseIdMap[baseName]) {
    return variantToBaseIdMap[baseName];
  }

  // If ID is >= 10000, it's likely a variant form
  // Extract the base ID by removing the leading "100"
  if (pokemonId >= 10000) {
    const idStr = pokemonId.toString();
    if (idStr.startsWith("100")) {
      return parseInt(idStr.substring(3));
    }
  }

  // Default: return the original ID
  return pokemonId;
}
