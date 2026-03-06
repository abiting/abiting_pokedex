import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import PokemonDetailModal from "@/components/PokemonDetailModal";
import { formatPokemonName } from "@/lib/pokemonNameFormatter";

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
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

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch Pokemon data from PokéAPI
    const fetchPokemonData = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1350", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const results = data.results;

        // Fetch detailed data for all Pokemon in parallel
        const pokemonDetails = await Promise.all(
          results.map(async (pokemon: any) => {
            const detailResponse = await fetch(pokemon.url);
            const detail = await detailResponse.json();
            return {
              id: detail.id,
              name: detail.name,
              image:
                detail.sprites?.other?.["official-artwork"]?.front_default ||
                detail.sprites?.front_default ||
                "https://via.placeholder.com/150?text=No+Image",
              types: detail.types.map((t: any) => t.type.name),
            };
          })
        );

        // Filter out variant forms (ID >= 10000)
        const basePokemon = pokemonDetails.filter((p) => p.id < 10000);

        setPokemonData(basePokemon);
        setFilteredPokemon(basePokemon);
      } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
      }
      setLoading(false);
    };

    fetchPokemonData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const term = value.toLowerCase();
    const filtered = pokemonData.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(term) ||
        String(pokemon.id).padStart(4, "0").includes(term)
    );
    setFilteredPokemon(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-600/95 to-purple-700/90 backdrop-blur-sm border-b border-purple-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-4">
            <a
              href="https://abitingpokedex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-full hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <span className="text-xl">⚡</span>
              <span>Champions SP Calculator</span>
            </a>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              List of Pokémon
            </h1>
            <h2 className="text-purple-100 text-lg mb-6">
              The Essential Pokédex for Pokémon Champions
            </h2>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663217818186/RzU58TEyiH2kk3xzABwHQm/Bazaart_C13CB22E-2F67-4437-9903-E0166D872024_30f0192a.jpeg"
              alt="List of Pokémon"
              className="w-full sm:max-w-md mx-auto mb-6 rounded-3xl shadow-2xl"
              style={{
                maxWidth: '100%',
                height: 'auto',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)'
              }}
            />
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Pokémon by name or number..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-purple-400 bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-400/50 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
            <p className="text-white text-lg">Loading Pokémon data...</p>
          </div>
        ) : filteredPokemon.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white text-xl">No Pokémon found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredPokemon.map((pokemon) => (
              <a
                key={pokemon.id}
                href={`/pokemon/${pokemon.name}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 block p-4"
              >
                {/* ID */}
                <div className="text-xs font-semibold text-gray-500 mb-2">
                  #{String(pokemon.id).padStart(4, "0")}
                </div>

                {/* Image */}
                <div className="h-32 md:h-40 flex items-center justify-center mb-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl overflow-hidden">
                  <img
                    src={pokemon.image}
                    alt={`${formatPokemonName(pokemon.name, pokemon.id)} #${String(pokemon.id).padStart(4, "0")} Pokémon`}
                    className="w-24 h-24 md:w-32 md:h-32 object-contain hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3 className="font-bold text-gray-800 text-center mb-2 text-sm md:text-base line-clamp-2">
                  {formatPokemonName(pokemon.name, pokemon.id)}
                </h3>

                {/* Types */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 rounded-full text-white text-xs font-semibold capitalize shadow-md"
                      style={{ backgroundColor: typeColors[type] || "#999" }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Pokemon Detail Modal */}
      {selectedPokemonId && (
        <PokemonDetailModal
          pokemonId={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}

      {/* Footer */}
      <div className="mt-16 py-8 border-t border-purple-500/30 bg-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-purple-200 text-sm">
          <p>
            Pokémon data from{" "}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-white underline transition-colors"
            >
              PokéAPI
            </a>
            {" • "}
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
  );
}
