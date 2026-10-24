import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { formatPokemonName } from "@/lib/pokemonNameFormatter";
import { updatePageUrlMetadata } from "@/lib/siteUrl";

interface Pokemon {
  id: number;
  name: string;
}

interface PokemonApiResult {
  name: string;
  url: string;
}

interface PokemonDetailResponse {
  types: Array<{ type: { name: string } }>;
}

const INITIAL_BATCH_SIZE = 24;
const BATCH_SIZE = 24;
const POKEMON_LIST_CACHE_KEY = "pokemonListCacheV2";
const typeCache = new Map<number, string[]>();

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

function getPokemonId(url: string) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function PokemonCard({ pokemon, eagerImage }: { pokemon: Pokemon; eagerImage: boolean }) {
  const [types, setTypes] = useState<string[] | null>(() => typeCache.get(pokemon.id) ?? null);

  useEffect(() => {
    const cachedTypes = typeCache.get(pokemon.id);
    if (cachedTypes) {
      setTypes(cachedTypes);
      return;
    }

    const controller = new AbortController();

    async function fetchTypes() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load Pokémon types");

        const detail = (await response.json()) as PokemonDetailResponse;
        const nextTypes = detail.types.map(({ type }) => type.name);
        typeCache.set(pokemon.id, nextTypes);
        setTypes(nextTypes);
      } catch (error) {
        if (!controller.signal.aborted) setTypes([]);
      }
    }

    fetchTypes();
    return () => controller.abort();
  }, [pokemon.id]);

  const imageSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const fallbackImageSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <a
      href={`/pokemon/${pokemon.name}/`}
      className="block cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="mb-2 text-xs font-semibold text-gray-500">#{String(pokemon.id).padStart(4, "0")}</div>

      <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 md:h-40">
        <img
          src={imageSource}
          alt={`${formatPokemonName(pokemon.name, pokemon.id)} #${String(pokemon.id).padStart(4, "0")} Pokémon`}
          className="h-24 w-24 object-contain transition-transform duration-300 hover:scale-110 md:h-32 md:w-32"
          loading={eagerImage ? "eager" : "lazy"}
          onError={(event) => {
            if (event.currentTarget.src !== fallbackImageSource) {
              event.currentTarget.src = fallbackImageSource;
            }
          }}
        />
      </div>

      <h3 className="mb-2 line-clamp-2 text-center text-sm font-bold text-gray-800 md:text-base">
        {formatPokemonName(pokemon.name, pokemon.id)}
      </h3>

      <div className="flex min-h-7 flex-wrap justify-center gap-1">
        {types === null ? (
          <>
            <span className="h-6 w-14 animate-pulse rounded-full bg-gray-200" aria-label="Loading types" />
            <span className="h-6 w-14 animate-pulse rounded-full bg-gray-200" aria-hidden="true" />
          </>
        ) : (
          types.map((type) => (
            <span
              key={type}
              className="rounded-full px-2 py-1 text-xs font-semibold capitalize text-white shadow-md"
              style={{ backgroundColor: typeColors[type] || "#999" }}
            >
              {type}
            </span>
          ))
        )}
      </div>
    </a>
  );
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const scrollPositionRef = useRef(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Set SEO meta tags for home page
  useEffect(() => {
    document.title = "List of Pokémon | Abiting's Pokédex";
    updatePageUrlMetadata("/");

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "The essential battle database for Pokémon Champions. Access comprehensive Base Stats and Type Weaknesses for all 1,025 species (Gen 1-9). Analyze Abilities and Stats to optimize your team strategy. Manage your roster with a single tap.",
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      "Pokémon, Pokédex, Champions, Base Stats, Type Weaknesses, Abilities, Team Builder, Pokemon Database",
    );
  }, []);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositionRef.current = window.scrollY;
      sessionStorage.setItem("pokemonListScrollPosition", String(window.scrollY));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Restore scroll position when returning to home
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("pokemonListScrollPosition");
    if (savedPosition && pokemonData.length > 0) {
      const position = parseInt(savedPosition, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, position);
      });
      sessionStorage.removeItem("pokemonListScrollPosition");
    }
  }, [pokemonData.length]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemonList() {
      const cachedData = sessionStorage.getItem(POKEMON_LIST_CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as Pokemon[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPokemonData(parsed);
            setLoading(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(POKEMON_LIST_CACHE_KEY);
        }
      }

      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1350", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = (await response.json()) as { results: PokemonApiResult[] };
        const basicPokemon = data.results
          .map((pokemon) => ({ id: getPokemonId(pokemon.url), name: pokemon.name }))
          .filter((pokemon) => pokemon.id > 0 && pokemon.id < 10000);

        sessionStorage.setItem(POKEMON_LIST_CACHE_KEY, JSON.stringify(basicPokemon));
        sessionStorage.removeItem("pokemonListCache");
        setPokemonData(basicPokemon);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch Pokémon list:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPokemonList();
    return () => controller.abort();
  }, []);

  const filteredPokemon = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return pokemonData;

    return pokemonData.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(term) ||
        String(pokemon.id).padStart(4, "0").includes(term),
    );
  }, [pokemonData, searchTerm]);

  const visiblePokemon = useMemo(
    () => filteredPokemon.slice(0, visibleCount),
    [filteredPokemon, visibleCount],
  );
  const hasMorePokemon = visiblePokemon.length < filteredPokemon.length;

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [searchTerm]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMorePokemon || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + BATCH_SIZE, filteredPokemon.length));
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredPokemon.length, hasMorePokemon, loading]);

  const showMorePokemon = () => {
    setVisibleCount((current) => Math.min(current + BATCH_SIZE, filteredPokemon.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 flex items-center justify-center">
            <a
              href="https://abitingpokedex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-600 hover:to-purple-700"
            >
              <span className="text-xl">⚡</span>
              <span>Champions SP Calculator</span>
            </a>
          </div>

          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">List of Pokémon</h1>
            <h2 className="mb-6 text-lg text-purple-100">The Essential Pokédex for Pokémon Champions</h2>
            <img
              src="https://abitingpokedex.com/wp-content/uploads/2026/09/Bazaart_C13CB22E-2F67-4437-9903-E0166D872024_30f0192a.jpg"
              alt="List of Pokémon"
              className="mx-auto mb-6 rounded-3xl shadow-2xl"
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                maxHeight: "220px",
                objectFit: "contain",
                boxShadow: "0 0 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)",
              }}
            />
          </div>

          <div className="mx-auto mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-300" />
              <input
                type="text"
                placeholder="Search Pokémon by name or number..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-full border-2 border-purple-400 bg-white/95 py-3 pl-12 pr-4 text-gray-800 shadow-lg transition-all placeholder:text-gray-500 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="flex min-h-96 flex-col items-center justify-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-white" />
            <p className="text-lg text-white">Loading Pokémon list...</p>
          </div>
        ) : filteredPokemon.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl text-white">No Pokémon found matching your search</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 md:grid-cols-4 lg:grid-cols-5">
              {visiblePokemon.map((pokemon, index) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} eagerImage={index < 6} />
              ))}
            </div>

            {hasMorePokemon && (
              <div ref={loadMoreRef} className="flex flex-col items-center gap-4 py-10">
                <button
                  type="button"
                  onClick={showMorePokemon}
                  className="rounded-full border border-white/60 bg-white/10 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Show more Pokémon ({visiblePokemon.length} / {filteredPokemon.length})
                </button>
                <span className="text-sm text-purple-100">More Pokémon load automatically as you scroll.</span>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-purple-500/30 bg-purple-900/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-purple-200">
          <p>
            <a href="/about/" className="text-purple-300 underline transition-colors hover:text-white">
              About Developer
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
