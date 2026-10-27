import { useLocation } from "wouter";
import pokemonNumbers from "@/data/pokemonNumbers.json";

/**
 * Visual intent: a restrained, full-width bottom anchor that preserves the
 * Pokédex's purple interface while keeping the supplied promotion prominent.
 */
interface BottomAnchorAdProps {
  onClose: () => void;
}

export default function BottomAnchorAd({ onClose }: BottomAnchorAdProps) {
  const [location] = useLocation();
  const normalizedLocation = location.replace(/\/+$/, "");
  const isChinesePage = normalizedLocation.endsWith("/zh");
  const pokemonSlug = location.split("/")[2] ?? "";
  const pokemonNumber = pokemonNumbers[pokemonSlug as keyof typeof pokemonNumbers];
  const hasKnownPokemonNumber = typeof pokemonNumber === "number";
  const usesFoneloraAd = isChinesePage && hasKnownPokemonNumber && pokemonNumber <= 200;
  const usesCpaCeramicsAd = !isChinesePage && hasKnownPokemonNumber && pokemonNumber <= 100;
  const shouldRenderAd = hasKnownPokemonNumber && (!isChinesePage || usesFoneloraAd);
  const usesAbiPaintAd = hasKnownPokemonNumber && pokemonNumber <= 500;
  const destination = usesFoneloraAd
    ? "https://app.abiting.cc/archives/4656"
    : usesCpaCeramicsAd
      ? "https://cpaceramics.com/"
      : usesAbiPaintAd
        ? "https://abipaint.abiting.cc"
        : isChinesePage
          ? "https://abiurl.me"
          : "https://abiurl.me/en";
  const imageSource = usesFoneloraAd
    ? "https://abitingpokedex.com/wp-content/uploads/2026/09/fonelora_pokemon_go_banner_3024x400_base-scaled.jpeg"
    : usesCpaCeramicsAd
      ? "https://abitingpokedex.com/wp-content/uploads/2026/10/Bazaart_2026-10-21_195451.jpeg"
      : usesAbiPaintAd
        ? isChinesePage
          ? "https://coai.abiting.cc/wp-content/uploads/2026/09/Bazaart_27A47996-DF9C-4A0B-8F20-B62AEC8A833D-scaled.jpeg"
          : "https://abitingpokedex.com/wp-content/uploads/2026/09/Bazaart_380EAA8B-2147-457B-8AAE-E333B5D0FDE8-scaled.jpeg"
        : isChinesePage
          ? "https://abitingpokedex.com/wp-content/uploads/2026/09/Bazaart_F9090110-0349-4151-A75B-BBC9D0F1E137-scaled.jpeg"
          : "https://abitingpokedex.com/wp-content/uploads/2026/09/Bazaart_A4DA0A56-D281-4E3A-9809-8C224BF881AB-scaled.jpeg";
  const promotionLabel = usesFoneloraAd
    ? "Fonelora promotion"
    : usesCpaCeramicsAd
      ? "Ceramics Practice Alliance promotion"
      : usesAbiPaintAd
        ? "AbiPaint promotion"
        : "AbiURL promotion";

  if (!shouldRenderAd) return null;

  return (
    <>
      <div aria-hidden="true" className="h-20 sm:h-24" />
      <aside
        aria-label={promotionLabel}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-violet-300/60 bg-black shadow-[0_-5px_20px_rgba(88,28,135,0.34)]"
      >
        <div className="relative mx-auto w-full max-w-[1150px] overflow-hidden bg-black">
          <a
            href={destination}
            target="_blank"
            rel="noopener noreferrer"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-inset"
          >
            <img
              src={imageSource}
              alt={
                usesFoneloraAd
                  ? "Fonelora Pokémon GO 飛人教學"
                  : usesCpaCeramicsAd
                    ? "Ceramics Practice Alliance"
                    : usesAbiPaintAd
                      ? "AbiPaint free photo editor"
                      : isChinesePage
                        ? "AbiURL 短網址產生器"
                        : "AbiURL URL shortener"
              }
              className="block h-auto w-full object-contain"
            />
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label={isChinesePage ? "關閉廣告" : "Close advertisement"}
            title={isChinesePage ? "關閉廣告" : "Close advertisement"}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center border border-white/60 bg-black/75 text-xl leading-none text-white shadow-lg transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </aside>
    </>
  );
}
