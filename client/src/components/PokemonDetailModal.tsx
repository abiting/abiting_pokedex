import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  description: string;
  types: string[];
  height: number;
  weight: number;
  genderRatio: {
    male: number;
    female: number;
    genderless: boolean;
  };
  category: string;
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  weaknesses: string[];
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

// Type effectiveness mapping
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

interface Props {
  pokemonId: number;
  onClose: () => void;
}

export default function PokemonDetailModal({ pokemonId, onClose }: Props) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();

        // Fetch species data for description
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        // Get English description
        const description =
          speciesData.flavor_text_entries?.find(
            (entry: any) => entry.language.name === "en"
          )?.flavor_text || "No description available";

        // Calculate weaknesses based on types
        const weaknesses = new Set<string>();
        data.types.forEach((typeObj: any) => {
          const typeWeakList = typeWeaknesses[typeObj.type.name] || [];
          typeWeakList.forEach((weak) => weaknesses.add(weak));
        });

        // Parse gender ratio
        const genderRatio = speciesData.gender_rate;
        let genderInfo = {
          male: 0,
          female: 0,
          genderless: false,
        };

        if (genderRatio === -1) {
          genderInfo.genderless = true;
        } else {
          genderInfo.female = (genderRatio / 8) * 100;
          genderInfo.male = 100 - genderInfo.female;
        }

        setPokemon({
          id: data.id,
          name: data.name,
          image:
            data.sprites?.other?.["official-artwork"]?.front_default ||
            data.sprites?.front_default ||
            "",
          description: description.replace(/\f/g, " "),
          types: data.types.map((t: any) => t.type.name),
          height: data.height / 10, // Convert to meters
          weight: data.weight / 10, // Convert to kg
          genderRatio: genderInfo,
          category: speciesData.genera?.find((g: any) => g.language.name === "en")
            ?.genus || "Unknown",
          abilities: data.abilities.map((a: any) => a.ability.name),
          stats: {
            hp: data.stats[0]?.base_stat || 0,
            attack: data.stats[1]?.base_stat || 0,
            defense: data.stats[2]?.base_stat || 0,
            spAtk: data.stats[3]?.base_stat || 0,
            spDef: data.stats[4]?.base_stat || 0,
            speed: data.stats[5]?.base_stat || 0,
          },
          weaknesses: Array.from(weaknesses),
        });
      } catch (error) {
        console.error("Failed to fetch Pokémon detail:", error);
      }
      setLoading(false);
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  const maxStat = 150;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold opacity-90">
                #{String(pokemon.id).padStart(4, "0")}
              </p>
              <h2 className="text-4xl font-bold capitalize mt-2">{pokemon.name}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-4">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>

            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {pokemon.description}
              </p>

              {/* Basic Info */}
              <div className="bg-blue-500 text-white rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Height</p>
                    <p className="text-lg font-semibold">{pokemon.height.toFixed(2)}m</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Weight</p>
                    <p className="text-lg font-semibold">{pokemon.weight.toFixed(1)}kg</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Gender</p>
                    <p className="text-lg font-semibold">
                      {pokemon.genderRatio.genderless
                        ? "Genderless"
                        : `♂ ${pokemon.genderRatio.male.toFixed(1)}% / ♀ ${pokemon.genderRatio.female.toFixed(1)}%`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Category</p>
                    <p className="text-lg font-semibold">{pokemon.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Types */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Type</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 rounded-full text-white font-semibold capitalize shadow-md"
                  style={{ backgroundColor: typeColors[type] || "#999" }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm capitalize"
                >
                  {ability.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Weaknesses</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.weaknesses.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 rounded-full text-white font-semibold capitalize shadow-md"
                  style={{ backgroundColor: typeColors[type] || "#999" }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Stats</h3>
            <div className="space-y-3">
              {[
                { label: "HP", value: pokemon.stats.hp },
                { label: "Attack", value: pokemon.stats.attack },
                { label: "Defense", value: pokemon.stats.defense },
                { label: "Sp. Attack", value: pokemon.stats.spAtk },
                { label: "Sp. Defense", value: pokemon.stats.spDef },
                { label: "Speed", value: pokemon.stats.speed },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {stat.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stat.value / maxStat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
