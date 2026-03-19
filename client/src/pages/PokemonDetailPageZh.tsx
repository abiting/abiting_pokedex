import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPokemonName } from "@/lib/pokemonNameFormatter";

interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: Array<{ name: string }>;
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
  description?: string;
  flavor_text?: string;
  evolution_chain?: {
    url: string;
  };
}

interface EvolutionChainNode {
  species: {
    name: string;
    url: string;
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

// Chinese type names
const typeNamesCh: Record<string, string> = {
  normal: "一般",
  fire: "火",
  water: "水",
  electric: "電",
  grass: "草",
  ice: "冰",
  fighting: "格鬥",
  poison: "毒",
  ground: "地面",
  flying: "飛行",
  psychic: "超能力",
  bug: "蟲",
  rock: "岩石",
  ghost: "幽靈",
  dragon: "龍",
  dark: "惡",
  steel: "鋼",
  fairy: "妖精",
};

// Chinese stat names
const statNamesCh: Record<string, string> = {
  hp: "HP",
  attack: "攻擊",
  defense: "防禦",
  "special-attack": "特攻",
  "special-defense": "特防",
  speed: "速度",
};

// Pokemon Chinese names mapping
const pokemonChineseNames: Record<string, string> = {
  "bulbasaur": "妙蛙種子",
  "ivysaur": "妙蛙草",
  "venusaur": "妙蛙花",
};

// Ability Chinese names mapping
const abilityChineseNames: Record<string, string> = {
  "overgrow": "茂盛",
  "chlorophyll": "葉綠素",
  "blaze": "火焰身軀",
  "torrent": "激流",
};

export default function PokemonDetailPageZh() {
  const [match, params] = useRoute("/pokemon/:name/zh");
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<SpeciesData | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChainNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Pokemon data
  useEffect(() => {
    if (!match || !params?.name) return;

    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        setPokemon(null);
        setSpecies(null);

        // Fetch Pokemon detail
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.name}`
        );
        if (!pokemonResponse.ok) {
          throw new Error("寶可夢未找到");
        }
        const pokemonData: any = await pokemonResponse.json();

        // Normalize the API response to match our interface
        const normalized: PokemonDetail = {
          id: pokemonData.id,
          name: pokemonData.name,
          image:
            pokemonData.sprites?.other?.["official-artwork"]?.front_default ||
            pokemonData.sprites?.front_default ||
            "https://via.placeholder.com/150?text=No+Image",
          types: pokemonData.types.map((t: any) => ({ name: t.type.name })),
          height: pokemonData.height,
          weight: pokemonData.weight,
          abilities: pokemonData.abilities,
          stats: pokemonData.stats,
          species: pokemonData.species,
        };
        setPokemon(normalized);

        // Fetch species data for gender ratio and evolution chain
        if (pokemonData.species?.url) {
          const speciesResponse = await fetch(pokemonData.species.url);
          const speciesData: SpeciesData = await speciesResponse.json();
          setSpecies(speciesData);
          
          // Fetch evolution chain if available
          if (speciesData.evolution_chain?.url) {
            const chainResponse = await fetch(speciesData.evolution_chain.url);
            const chainData: any = await chainResponse.json();
            setEvolutionChain(chainData.chain);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "無法載入寶可夢資訊"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [match, params?.name]);

  // Update SEO meta tags when pokemon data changes
  useEffect(() => {
    if (!pokemon) return;

    const chineseName = pokemonChineseNames[pokemon.name] || formatPokemonName(pokemon.name, pokemon.id);
    document.title = `${chineseName} - Abiting's Pokédex`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    const typeNames =
      pokemon.types && pokemon.types.length > 0
        ? pokemon.types
            .map((t) => typeNamesCh[t.name] || t.name)
            .join("/")
        : "未知";
    metaDescription.setAttribute(
      "content",
      `${chineseName} #${String(pokemon.id).padStart(4, "0")} - ${typeNames}屬性寶可夢，包含種族值、特性和進化鏈資訊，盡在Abiting's Pokédex。`
    );

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    const typeKeywords =
      pokemon.types && pokemon.types.length > 0
        ? pokemon.types.map((t) => typeNamesCh[t.name] || t.name).join(", ")
        : "未知";
    metaKeywords.setAttribute(
      "content",
      `${chineseName}, 寶可夢, 圖鑑, #${pokemon.id}, ${typeKeywords}`
    );
  }, [pokemon]);

  if (!match) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">寶可夢未找到</h1>
          <p className="mb-6">
            {error || "您尋找的寶可夢不存在"}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            返回圖鑑
          </a>
        </div>
      </div>
    );
  }

  const chineseName = pokemonChineseNames[pokemon.name] || formatPokemonName(pokemon.name, pokemon.id);
  const weaknesses = pokemon.types
    .flatMap((t) => typeWeaknesses[t.name] || [])
    .filter((v, i, a) => a.indexOf(v) === i);

  const genderRate = species?.gender_rate;
  const malePercentage =
    genderRate !== undefined && genderRate !== -1
      ? ((8 - genderRate) / 8) * 100
      : null;
  const femalePercentage =
    genderRate !== undefined && genderRate !== -1 ? (genderRate / 8) * 100 : null;

  // Extract complete evolution chain from base form
  const getCompleteEvolutionChain = (chain: EvolutionChainNode | null): string[][] => {
    if (!chain) return [];
    
    const allPaths: string[][] = [];
    
    // Recursively collect all possible evolution paths
    const collectAllPaths = (node: EvolutionChainNode, currentPath: string[]): void => {
      const newPath = [...currentPath, node.species.name];
      
      // If this node has no further evolutions, add the path to results
      if (!node.evolves_to || node.evolves_to.length === 0) {
        allPaths.push(newPath);
        return;
      }
      
      // Otherwise, explore all evolution branches
      for (const evolution of node.evolves_to) {
        collectAllPaths(evolution, newPath);
      }
    };
    
    // Start collecting from the base of the chain
    collectAllPaths(chain, []);
    return allPaths;
  };

  const currentEvolutionChain = getCompleteEvolutionChain(evolutionChain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button and language switcher */}
        <div className="flex items-center justify-between mb-6">
          <a
            href={`/pokemon/${pokemon.name}`}
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition font-semibold"
          >
            <span>🌐 英文版本</span>
          </a>
          <div className="text-white text-sm font-semibold">
            #{String(pokemon.id).padStart(4, "0")}
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image and basic info */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <img
                src={pokemon.image}
                alt={chineseName}
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {chineseName}
              </h1>
              <p className="text-gray-600 mb-4">
                {formatPokemonName(pokemon.name, pokemon.id)}
              </p>
              
              {/* Champions SP Calculator Link - Desktop */}
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
                  pokemon.types.map((type) => (
                    <span
                      key={type.name}
                      className="px-4 py-2 rounded-full text-white font-semibold text-sm"
                      style={{
                        backgroundColor: typeColors[type.name] || "#999",
                      }}
                    >
                      {typeNamesCh[type.name] || type.name}
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

          {/* Abilities */}
          {pokemon.abilities && pokemon.abilities.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                特性
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="p-3 bg-purple-100 rounded-lg"
                  >
                    <p className="text-gray-800 font-semibold capitalize">
                      {abilityChineseNames[ability.ability.name] || ability.ability.name.replace("-", " ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gender ratio */}
          {malePercentage !== null && femalePercentage !== null && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                性別比例
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-semibold">♂ 公</span>
                    <span className="text-gray-600">
                      {malePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${malePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-semibold">♀ 母</span>
                    <span className="text-gray-600">
                      {femalePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-pink-500 h-full"
                      style={{ width: `${femalePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Base Stats */}
          {pokemon.stats && pokemon.stats.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                種族值
              </h2>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 capitalize font-semibold">
                        {statNamesCh[stat.stat.name] || stat.stat.name}
                      </span>
                      <span className="text-gray-600">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-full"
                        style={{ width: `${(stat.base_stat / 150) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses && weaknesses.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                弱點
              </h2>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="px-4 py-2 rounded-full text-white font-semibold text-sm"
                    style={{
                      backgroundColor: typeColors[weakness] || "#999",
                    }}
                  >
                    {typeNamesCh[weakness] || weakness}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evolution Chain with Pokemon Image */}
          {(currentEvolutionChain && currentEvolutionChain.length > 0) || pokemon.image ? (
            <div className="p-8 border-b border-gray-200 flex gap-8">
              <div className="flex-1">
                {currentEvolutionChain && currentEvolutionChain.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      進化鏈
                    </h2>
                    {currentEvolutionChain.some(path => path.length > 1) ? (
                      <div className="space-y-3">
                        {currentEvolutionChain.map((path, pathIndex) => (
                          <div key={pathIndex} className="flex flex-wrap items-center gap-3">
                            {path.map((evoName, index) => (
                              <div key={`${pathIndex}-${evoName}`} className="flex items-center gap-3">
                                <a
                                  href={`/pokemon/${evoName}/zh`}
                                  className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm hover:bg-purple-200 transition capitalize"
                                >
                                  {pokemonChineseNames[evoName] || formatPokemonName(evoName)}
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
                      <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm inline-block">無</span>
                    )}
                  </>
                )}
              </div>
              {pokemon.image && (
                <div className="flex items-center justify-center">
                  <img
                    src={pokemon.image}
                    alt={`${chineseName} 性別`}
                    className="w-40 h-40 object-contain"
                  />
                </div>
              )}
            </div>
          ) : null}

          {/* Brand Image */}
          <div className="p-8 flex justify-center bg-black">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663217818186/RzU58TEyiH2kk3xzABwHQm/Bazaart_623285C8-702B-4506-A100-941C5E459461_6a2dd84d.jpeg"
              alt={`${chineseName} 種族值`}
              className="max-w-2xl w-full object-contain"
            />
          </div>

          {/* About Developer */}
          <div className="py-8 border-t border-purple-500/30 bg-purple-900/50">
            <div className="text-center text-purple-200 text-sm">
              <p>
                <a
                  href="/about"
                  className="text-purple-300 hover:text-white underline transition-colors"
                >
                  關於開發者
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
