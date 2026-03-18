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
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params?.name}`
        );
        if (!pokemonResponse.ok) {
          throw new Error("Pokemon not found");
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
          err instanceof Error ? err.message : "Failed to load Pokemon"
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

    const formattedName = formatPokemonName(pokemon.name, pokemon.id);
    document.title = `${formattedName} - Abiting's Pokédex`;

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
            .map((t) => t.name.charAt(0).toUpperCase() + t.name.slice(1))
            .join("/")
        : "Unknown";
    metaDescription.setAttribute(
      "content",
      `${formattedName} #${String(pokemon.id).padStart(4, "0")} - ${typeNames} type Pokémon with stats, abilities, and evolution information on Abiting's Pokédex.`
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
        ? pokemon.types.map((t) => t.name).join(", ")
        : "Unknown";
    metaKeywords.setAttribute(
      "content",
      `${formattedName}, Pokémon, Pokédex, #${pokemon.id}, ${typeKeywords}`
    );

    // Add structured data schema
    let schemaScript = document.querySelector('script[data-pokemon-schema]');
    if (schemaScript) {
      schemaScript.remove();
    }
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Thing",
      "@id": `https://list.abitingpokedex.com/pokemon/${pokemon.name}`,
      "name": formattedName,
      "identifier": pokemon.id,
      "image": pokemon.image,
      "description": `${formattedName} is a Pokémon with ID #${pokemon.id}. It is of type ${typeNames}.`,
    };

    schemaScript = document.createElement("script");
    schemaScript.setAttribute("type", "application/ld+json");
    schemaScript.setAttribute("data-pokemon-schema", "true");
    schemaScript.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaScript);
  }, [pokemon]);

  // Function to collect all evolution paths
  const getAllEvolutionPaths = (
    chain: EvolutionChainNode,
    path: string[] = []
  ): string[][] => {
    const currentPath = [...path, chain.species.name];
    
    if (chain.evolves_to.length === 0) {
      return [currentPath];
    }

    const allPaths: string[][] = [];
    for (const evolution of chain.evolves_to) {
      allPaths.push(...getAllEvolutionPaths(evolution, currentPath));
    }
    return allPaths;
  };

  const currentEvolutionChain = evolutionChain
    ? getAllEvolutionPaths(evolutionChain)
    : [];

  if (!match) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
        <Loader2 className="w-12 h-12 text-purple-300 animate-spin" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Pokémon Not Found</h1>
          <p className="text-purple-300 mb-8">{error || "The Pokémon you're looking for doesn't exist."}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </a>
        </div>
      </div>
    );
  }

  const formattedName = formatPokemonName(pokemon.name, pokemon.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </a>

        <div className="bg-purple-800/50 rounded-lg p-8 backdrop-blur-sm border border-purple-700/50">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{formattedName}</h1>
              <p className="text-purple-300">
                #{String(pokemon.id).padStart(4, "0")}
              </p>
            </div>
          </div>

          {/* Types */}
          <div className="flex gap-2 mb-8">
            {pokemon.types.map((type) => (
              <span
                key={type.name}
                className="px-4 py-2 rounded-full text-white font-semibold"
                style={{ backgroundColor: typeColors[type.name] || "#999999" }}
              >
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </span>
            ))}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-purple-700/50 p-4 rounded-lg">
              <p className="text-purple-300 text-sm">Height</p>
              <p className="text-white text-lg font-semibold">
                {(pokemon.height / 10).toFixed(1)} m
              </p>
            </div>
            <div className="bg-purple-700/50 p-4 rounded-lg">
              <p className="text-purple-300 text-sm">Weight</p>
              <p className="text-white text-lg font-semibold">
                {(pokemon.weight / 10).toFixed(1)} kg
              </p>
            </div>
          </div>

          {/* Abilities */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>
            <div className="space-y-2">
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className="bg-purple-700/50 p-3 rounded-lg">
                  <p className="text-white">
                    {ability.ability.name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Base Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Base Stats</h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-300 capitalize">
                      {stat.stat.name === "hp"
                        ? "HP"
                        : stat.stat.name
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                    </span>
                    <span className="text-white font-semibold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                      style={{ width: `${(stat.base_stat / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Ratio */}
          {species && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Gender Ratio</h2>
              <div className="bg-purple-700/50 p-4 rounded-lg">
                <p className="text-white">
                  {species.gender_rate === -1
                    ? "Genderless"
                    : `${((species.gender_rate / 8) * 100).toFixed(1)}% Female, ${(((8 - species.gender_rate) / 8) * 100).toFixed(1)}% Male`}
                </p>
              </div>
            </div>
          )}

          {/* Evolution Chain */}
          {currentEvolutionChain.length > 0 && currentEvolutionChain[0].length > 1 ? (
            <div className="flex gap-4 items-center mb-8">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-4">Evolution Chain</h2>
                <div className="space-y-2">
                  {currentEvolutionChain.map((path, pathIndex) => (
                    <div key={pathIndex} className="bg-purple-700/50 p-3 rounded-lg">
                      <p className="text-white">
                        {path.map((name, index) => (
                          <span key={index}>
                            {formatPokemonName(name)}
                            {index < path.length - 1 && " → "}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {pokemon.image && (
                <div className="flex-shrink-0">
                  <img
                    src={pokemon.image}
                    alt={`${formatPokemonName(pokemon.name)} weight`}
                    className="w-40 h-40 object-contain"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Evolution Chain</h2>
              <div className="bg-purple-700/50 p-3 rounded-lg">
                <p className="text-white">None</p>
              </div>
            </div>
          )}

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
  );
}
