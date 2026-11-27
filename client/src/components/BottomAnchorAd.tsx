import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
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
  const bannerRef = useRef<HTMLElement>(null);
  const [bannerHeight, setBannerHeight] = useState(80);
  const normalizedLocation = location.replace(/\/+$/, "");
  const isChinesePage = normalizedLocation.endsWith("/zh");
  const pokemonSlug = location.split("/")[2] ?? "";
  const pokemonNumber = pokemonNumbers[pokemonSlug as keyof typeof pokemonNumbers];
  const hasKnownPokemonNumber = typeof pokemonNumber === "number";
  const usesCoaiFoneloraAd = isChinesePage && hasKnownPokemonNumber && pokemonNumber >= 888 && pokemonNumber <= 999;
  const usesFoneloraAd = isChinesePage && hasKnownPokemonNumber && (pokemonNumber <= 200 || usesCoaiFoneloraAd);
  const usesPikminFoneloraAd = isChinesePage && hasKnownPokemonNumber && pokemonNumber >= 333 && pokemonNumber <= 555;
  const usesOfficeAlternativesAd = isChinesePage && hasKnownPokemonNumber && pokemonNumber >= 678 && pokemonNumber <= 778;
  const usesEnglishFoneloraAd = !isChinesePage && hasKnownPokemonNumber;
  const shouldRenderAd = hasKnownPokemonNumber && (usesEnglishFoneloraAd || usesFoneloraAd || usesPikminFoneloraAd || usesOfficeAlternativesAd);
  const destination = usesEnglishFoneloraAd
    ? "https://fonelora.sjv.io/c/8336561/3917340/52912"
    : usesCoaiFoneloraAd
      ? "https://coai.abiting.cc/archives/2899"
      : usesOfficeAlternativesAd
        ? "https://app.abiting.cc/archives/3932"
        : usesPikminFoneloraAd
          ? "https://app.abiting.cc/archives/5672"
          : "https://app.abiting.cc/archives/4656";
  const imageSource = usesEnglishFoneloraAd
    ? "https://abitingpokedex.com/wp-content/uploads/2026/11/Bazaart_2026-11-27_225356.jpeg"
    : usesOfficeAlternativesAd
      ? "https://app.abiting.cc/wp-content/uploads/2026/11/Bazaart_2026-11-13_120056.jpeg"
      : usesPikminFoneloraAd
        ? "https://abitingpokedex.com/wp-content/uploads/2026/11/pikmin_bloom_banner_fullcontent_2560x470.jpg"
        : "https://abitingpokedex.com/wp-content/uploads/2026/09/fonelora_pokemon_go_banner_3024x400_base-scaled.jpeg";
  const promotionLabel = usesOfficeAlternativesAd
    ? "Office alternatives promotion"
    : "Fonelora promotion";

  useEffect(() => {
    const banner = bannerRef.current;
    if (!shouldRenderAd || !banner) return;
    const updateBannerHeight = () =>
      setBannerHeight(Math.ceil(banner.getBoundingClientRect().height));
    updateBannerHeight();
    const observer = new ResizeObserver(updateBannerHeight);
    observer.observe(banner);
    return () => observer.disconnect();
  }, [shouldRenderAd]);

  if (!shouldRenderAd) return null;

  return (
    <>
      <div aria-hidden="true" className="h-20" style={{ height: bannerHeight }} />
      <aside
        ref={bannerRef}
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
                usesEnglishFoneloraAd
                  ? "Fonelora Location Changer — Play Location-Based Games From Home"
                  : usesOfficeAlternativesAd
                    ? "Microsoft Office 替代軟體介紹"
                    : usesPikminFoneloraAd
                      ? "Fonelora 2026 皮克敏飛人教學"
                      : "Fonelora Pokémon GO 飛人教學"
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
