import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPokemonName } from "@/lib/pokemonNameFormatter";
import abilitiesMap from "@/data/abilities_zh_hant.json";
import pokemonMap from "@/data/pokemon_zh_hant.json";

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: Array<{ type: { name: string } }>;
  height: number;
  weight: number;
  abilities: Array<{ ability: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  species: {
    url: string;
  };
}

interface SpeciesData {
  gender_rate: number;
  evolution_chain?: {
    url: string;
  };
}

interface EvolutionChainNode {
  species: {
    name: string;
  };
  evolves_to: EvolutionChainNode[];
}

const typeColors: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const typeChineseNames: Record<string, string> = {
  "normal": "一般",
  "fire": "火",
  "water": "水",
  "electric": "電",
  "grass": "草",
  "ice": "冰",
  "fighting": "格鬥",
  "poison": "毒",
  "ground": "地面",
  "flying": "飛行",
  "psychic": "超能力",
  "bug": "蟲",
  "rock": "岩石",
  "ghost": "幽靈",
  "dragon": "龍",
  "dark": "惡",
  "steel": "鋼",
  "fairy": "妖精",
};

const statChineseNames: Record<string, string> = {
  "hp": "HP",
  "attack": "攻擊",
  "defense": "防禦",
  "special-attack": "特攻",
  "special-defense": "特防",
  "speed": "速度",
};

const typeWeaknesses: Record<string, string[]> = {
  normal: ["fighting"],
  fire: ["water", "ground", "rock"],
  water: ["electric", "grass"],
  electric: ["ground"],
  grass: ["fire", "ice", "poison", "flying", "bug"],
  ice: ["fire", "fighting", "rock", "steel"],
  fighting: ["flying", "psychic", "fairy"],
  poison: ["ground", "psychic"],
  ground: ["water", "grass", "ice"],
  flying: ["electric", "ice", "rock"],
  psychic: ["bug", "ghost", "dark"],
  bug: ["fire", "flying", "rock"],
  rock: ["water", "grass", "fighting", "ground", "steel"],
  ghost: ["ghost", "dark"],
  dragon: ["ice", "dragon", "fairy"],
  dark: ["fighting", "bug", "fairy"],
  steel: ["fire", "water", "ground"],
  fairy: ["poison", "steel"],
};

export default function PokemonDetailPageZh() {
  const [match, params] = useRoute("/pokemon/:name/zh");
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [speciesData, setSpeciesData] = useState<SpeciesData | null>(null);
  const [currentEvolutionChain, setCurrentEvolutionChain] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemonChineseName, setPokemonChineseName] = useState<string>("");
  const [weaknessNames, setWeaknessNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        if (!params?.name) return;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.name}`);
        if (!response.ok) throw new Error("Pokemon not found");
        const data: PokemonDetail = await response.json();
        setPokemon(data);

        // Get Chinese name from mapping
        const chineseName = pokemonMap[params.name as keyof typeof pokemonMap];
        if (chineseName) {
          setPokemonChineseName(chineseName);
        }

        // Fetch species data for evolution chain and gender ratio
        const speciesResponse = await fetch(data.species.url);
        const speciesDataRes: SpeciesData = await speciesResponse.json();
        setSpeciesData(speciesDataRes);

        // Fetch evolution chain
        if (speciesDataRes.evolution_chain) {
          const chainResponse = await fetch(speciesDataRes.evolution_chain.url);
          const chainData = await chainResponse.json();
          const chains = extractEvolutionChains(chainData.chain, data.name);
          setCurrentEvolutionChain(chains);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [params?.name]);

  const extractEvolutionChains = (
    node: EvolutionChainNode,
    currentPokemonName: string
  ): string[][] => {
    const chains: string[][] = [];

    const traverse = (n: EvolutionChainNode, path: string[]): void => {
      const newPath = [...path, n.species.name];

      if (n.evolves_to.length === 0) {
        chains.push(newPath);
      } else {
        for (const evolution of n.evolves_to) {
          traverse(evolution, newPath);
        }
      }
    };

    traverse(node, []);
    const filteredChains = chains.filter(chain => chain.includes(currentPokemonName));
    return filteredChains.length > 0 ? filteredChains : [[currentPokemonName]];
  };

  if (!match) return null;
  // Generate SEO data
  const typeChineseNames: Record<string, string> = {
    "normal": "一般",
    "fire": "火",
    "water": "水",
    "electric": "電",
    "grass": "草",
    "ice": "冰",
    "fighting": "格鬥",
    "poison": "毒",
    "ground": "地面",
    "flying": "飛行",
    "psychic": "超能力",
    "bug": "蟲",
    "rock": "岩石",
    "ghost": "幽靈",
    "dragon": "龍",
    "dark": "惡",
    "steel": "鋼",
    "fairy": "妖精",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">{error || "Pokemon not found"}</p>
        </div>
      </div>
    );
  }

  const formattedName = pokemon.name ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) : "Unknown";
  const weaknesses = pokemon.types
    .flatMap((t) => typeWeaknesses[t.type.name] || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  // Generate SEO keywords and description
  const abilityNames = pokemon.abilities
    .map((a) => abilitiesMap[a.ability.name as keyof typeof abilitiesMap] || a.ability.name)
    .join("、");
  
  const weaknessChineseNames = weaknesses
    .map((w) => typeChineseNames[w] || w)
    .join("、");
  
  const seoTitle = `${pokemonChineseName || formattedName} - Abiting's Pokédex`;
  const seoDescription = `${pokemonChineseName || formattedName}（#${String(pokemon.id).padStart(4, "0")}），${pokemon.types.map((t) => typeChineseNames[t.type.name] || t.type.name).join("與")}屬性寶可夢。種族值、屬性、特性、進化鏈資訊，盡在 Abiting's Pokédex。`;
  const seoKeywords = `${pokemonChineseName || formattedName}, ${pokemonChineseName || formattedName} 特性, ${pokemonChineseName || formattedName} 弱點`;

  return (
    <>
      <head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
        <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回寶可夢圖鑑</span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href={`/pokemon/${pokemon.name}`}
              className="text-white text-sm font-semibold hover:text-gray-200 transition"
            >
              🌐 英文版本
            </a>
            <div className="text-white text-sm font-semibold">
              #{String(pokemon.id).padStart(4, "0")}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image and basic info */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <img
                src={pokemon.sprites?.other?.["official-artwork"]?.front_default || ""}
                alt={`${pokemonChineseName || formattedName} #${String(pokemon.id).padStart(4, "0")} 寶可夢`}
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {pokemonChineseName || formattedName}
              </h1>

              <div className="hidden md:block mb-4">
                <a
                  href="https://scrabby.abiting.cc/pokemon-champions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg text-base whitespace-nowrap"
                >
                  <span className="text-xl">⚡</span>
                  <span>Champions SP 計算器</span>
                </a>
              </div>

              <div className="flex gap-2 mb-6">
                {pokemon.types &&
                  pokemon.types.map((typeObj) => (
                    <span
                      key={typeObj.type.name}
                      className="px-4 py-2 rounded-full text-white font-semibold text-sm"
                      style={{
                        backgroundColor: typeColors[typeObj.type.name] || "#999",
                      }}
                    >
                      {typeChineseNames[typeObj.type.name] || typeObj.type.name}
                    </span>
                  ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">身高</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">體重</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Champions SP Calculator Link - Mobile */}
          <div className="md:hidden p-4 bg-gradient-to-r from-purple-50 to-purple-100 text-center border-b border-gray-200">
            <a
              href="https://scrabby.abiting.cc/pokemon-champions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <span className="text-xl">⚡</span>
              <span>Champions SP 計算器</span>
            </a>
          </div>

          {/* 特性 */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">特性</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pokemon.abilities.map((ability) => (
                  <div key={ability.ability.name} className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">
                      {abilitiesMap[ability.ability.name as keyof typeof abilitiesMap] || formattedName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 性別比例 */}
          {speciesData && speciesData.gender_rate !== -1 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">性別比例</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">♂ 公</span>
                    <span className="text-gray-600">
                      {(((8 - speciesData.gender_rate) / 8) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{
                        width: `${((8 - speciesData.gender_rate) / 8) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">♀ 母</span>
                    <span className="text-gray-600">
                      {((speciesData.gender_rate / 8) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-pink-500 h-full"
                      style={{
                        width: `${(speciesData.gender_rate / 8) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {pokemon.stats && pokemon.stats.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">種族值</h2>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold capitalize">
                        {statChineseNames[stat.stat.name] || formattedName}
                      </span>
                      <span className="text-gray-600">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-full"
                        style={{
                          width: `${Math.min((stat.base_stat / 150) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 弱點 */}
          {weaknesses && weaknesses.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">弱點</h2>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="px-3 py-1 rounded-full text-white font-semibold text-xs"
                    style={{
                      backgroundColor: typeColors[weakness] || "#999",
                    }}
                  >
                    {typeChineseNames[weakness] || weakness}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 進化鏈 */}
          {currentEvolutionChain && currentEvolutionChain.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">進化鏈</h2>
              {currentEvolutionChain.some((path) => path.length > 1) ? (
                <div className="space-y-3">
                  {currentEvolutionChain.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex flex-wrap items-center gap-3">
                      {path.map((evoName, index) => (
                        <div key={`${pathIndex}-${evoName}`} className="flex items-center gap-3">
                          <a
                            href={`/pokemon/${evoName}/zh`}
                            className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm hover:bg-purple-200 transition"
                          >
                            {pokemonMap[evoName as keyof typeof pokemonMap] || (evoName ? evoName.charAt(0).toUpperCase() + evoName.slice(1) : "Unknown")}
                          </a>
                          {index < path.length - 1 && (
                            <span className="text-gray-400 font-bold">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm inline-block">
                  無
                </span>
              )}
            </div>
          )}

          {/* Brand Image */}
          <div className="p-8 flex justify-center bg-black">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663217818186/RzU58TEyiH2kk3xzABwHQm/Bazaart_623285C8-702B-4506-A100-941C5E459461_6a2dd84d.jpeg"
              alt={`${pokemonChineseName || formattedName} 種族值`}
              className="max-w-2xl w-full object-contain"
            />
          </div>

          {/* About Developer */}
          <div className="py-8 border-t border-purple-500/30 bg-purple-900/50">
            <div className="px-8 text-center">
              <p className="text-purple-100 text-sm">
                <a
                  href="https://abiting.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 underline"
                >
                  關於開發者
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
