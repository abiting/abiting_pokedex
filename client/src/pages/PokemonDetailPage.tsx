import { useState, useEffect } from "react";
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

export default function PokemonDetailPage() {
  const [match, params] = useRoute("/pokemon/:name");
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
          throw new Error("Pokemon not found");
        }

        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);

        // Fetch species data
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);

        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url);
          const evolutionData = await evolutionResponse.json();
          setEvolutionChain(evolutionData.chain);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch Pokemon");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [match, params?.name]);

  // Update document title and meta tags
  useEffect(() => {
    if (!pokemon) return;

    const formattedName = formatPokemonName(pokemon.name, pokemon.id);
    document.title = `${formattedName} - Pokémon Champions Database`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const typeNames = pokemon.types.map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1)).join("/");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `${formattedName} #${String(pokemon.id).padStart(4, "0")} - ${typeNames} type Pokémon with stats, abilities, moves, and evolution information on Abiting's Pokédex.`
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        `${formattedName}, ${formattedName} Champions, ${formattedName} stat points, ${formattedName} Pokedex`
      );
    }

    // Update structured data
    const typeNames2 = pokemon.types.map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1)).join("/");
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Thing",
      "@id": `https://list.abitingpokedex.com/pokemon/${pokemon.name}`,
      "name": formattedName,
      "alternateName": `Pokémon #${String(pokemon.id).padStart(4, "0")}`,
      "description": `${formattedName} is a ${typeNames2} type Pokémon (#${String(pokemon.id).padStart(4, "0")}) with base stats and multiple abilities. View detailed information including stats, abilities, gender ratio, weaknesses, and evolution chain on Abiting's Pokédex.`,
      "image": pokemon.image,
      "url": `https://list.abitingpokedex.com/pokemon/${pokemon.name}`,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Abiting's Pokédex",
        "url": "https://list.abitingpokedex.com"
      },
      "mainEntity": {
        "@type": "Thing",
        "name": formattedName,
        "identifier": `pokemon-${pokemon.id}`,
        "height": {
          "@type": "QuantitativeValue",
          "unitCode": "MTR",
          "value": pokemon.height
        },
        "weight": {
          "@type": "QuantitativeValue",
          "unitCode": "KGM",
          "value": pokemon.weight
        }
      }
    };

    let schemaScript = document.querySelector('script[type="application/ld+json"][data-pokemon-schema]') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-pokemon-schema', 'true');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);
  }, [pokemon]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Pokemon Not Found</h1>
          <p className="mb-6">
            {error || "The Pokemon you're looking for doesn't exist"}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Pokédex
          </a>
        </div>
      </div>
    );
  }

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
    
    // Start collecting from the root
    collectAllPaths(chain, []);
    
    return allPaths;
  };
  
  const currentEvolutionChain = getCompleteEvolutionChain(evolutionChain);
  const formattedName = formatPokemonName(pokemon.name, pokemon.id);

  // Initialize AdSense
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
      <div className="flex gap-4 max-w-7xl mx-auto">
        {/* Left Sidebar AdSense */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-2648968341090496"
              data-ad-slot="1234567890"
              data-ad-format="vertical"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Pokédex</span>
              </a>
              <div className="flex items-center gap-4">
                <a
                  href={`/pokemon/${pokemon.name}/zh`}
                  className="text-white text-sm font-semibold hover:text-gray-200 transition"
                >
                  🌐 zh-TW
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
                    src={pokemon.image}
                    alt={`${formattedName} #${String(pokemon.id).padStart(4, "0")} Pokémon - ${pokemon.types.map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1)).join("/")} type`}
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {formattedName}
                  </h1>
                  
                  {/* Champions SP Calculator Link - Desktop */}
                  <div className="hidden md:flex flex-col gap-2 mb-4">
                    <a
                      href="https://abitingpokedex.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg text-base whitespace-nowrap"
                    >
                      <span className="text-xl">⚡</span>
                      <span>Champions SP Calculator</span>
                    </a>
                    <a
                      href="https://abitingpokedex.com/pokemon-champions-team-builder/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg text-base whitespace-nowrap"
                    >
                      <span className="text-xl">📚</span>
                      <span>Moves and Items</span>
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
                          {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                        </span>
                      ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Height</p>
                      <p className="text-xl font-bold text-gray-800">{pokemon.height / 10} m</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Weight</p>
                      <p className="text-xl font-bold text-gray-800">{pokemon.weight / 10} kg</p>
                    </div>
                  </div>

                  {/* Champions SP Calculator Link - Mobile */}
                  <div className="md:hidden flex flex-col gap-2">
                    <a
                      href="https://abitingpokedex.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg text-sm"
                    >
                      <span className="text-lg">⚡</span>
                      <span>SP Calculator</span>
                    </a>
                    <a
                      href="https://abitingpokedex.com/pokemon-champions-team-builder/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg text-sm"
                    >
                      <span className="text-lg">📚</span>
                      <span>Moves and Items</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Abilities</h2>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.ability.name}
                        className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold text-sm capitalize"
                      >
                        {ability.ability.name.replace("-", " ")}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender Ratio */}
              {species && (
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Gender Ratio</h2>
                  {species.gender_rate === -1 ? (
                    <p className="text-gray-600">Genderless</p>
                  ) : (
                    <div className="flex gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Male</p>
                        <p className="text-xl font-bold text-blue-600">
                          {(((8 - species.gender_rate) / 8) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Female</p>
                        <p className="text-xl font-bold text-pink-600">
                          {((species.gender_rate / 8) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Type Weaknesses */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Type Weaknesses</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types &&
                    pokemon.types
                      .flatMap((t) => typeWeaknesses[t.name] || [])
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((weakness) => (
                        <span
                          key={weakness}
                          className="px-4 py-2 rounded-full text-white font-semibold text-sm"
                          style={{
                            backgroundColor: typeColors[weakness] || "#999",
                          }}
                        >
                          {weakness.charAt(0).toUpperCase() + weakness.slice(1)}
                        </span>
                      ))}
                </div>
              </div>

              {/* Evolution Chain with Pokemon Image */}
              {(currentEvolutionChain && currentEvolutionChain.length > 0) || pokemon.image ? (
                <div className="p-8 border-b border-gray-200 flex gap-8">
                  <div className="flex-1">
                    {currentEvolutionChain && currentEvolutionChain.length > 0 && (
                      <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          Evolution Chain
                        </h2>
                        {currentEvolutionChain.some(path => path.length > 1) ? (
                          <div className="space-y-3">
                            {currentEvolutionChain.map((path, pathIndex) => (
                              <div key={pathIndex} className="flex flex-wrap items-center gap-3">
                                {path.map((evoName, index) => (
                                  <div key={`${pathIndex}-${evoName}`} className="flex items-center gap-3">
                                    <a
                                      href={`/pokemon/${evoName}`}
                                      className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm hover:bg-purple-200 transition capitalize"
                                    >
                                      {formatPokemonName(evoName)}
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
                          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm inline-block">None</span>
                        )}
                      </>
                    )}
                  </div>
                  {pokemon.image && (
                    <div className="flex items-center justify-center">
                      <img
                        src={pokemon.image}
                        alt={`${formatPokemonName(pokemon.name)} weight`}
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
                  alt={`${formatPokemonName(pokemon.name)} Base Stats`}
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
                      About Developer
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar AdSense */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-2648968341090496"
              data-ad-slot="1234567891"
              data-ad-format="vertical"
              data-full-width-responsive="true"
            ></ins>
          </div>
        </div>
      </div>
    </div>
  );
}
