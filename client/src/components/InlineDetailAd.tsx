import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-2648968341090496";
const ADSENSE_SLOT = "4399239344";
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** A responsive AdSense unit inserted between detail facts and mobile actions. */
export default function InlineDetailAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const mountAd = () => {
      const container = containerRef.current;
      if (!container || !mediaQuery.matches || hasInitialized.current) return;

      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.setAttribute("data-ad-client", ADSENSE_CLIENT);
      ad.setAttribute("data-ad-slot", ADSENSE_SLOT);
      ad.setAttribute("data-ad-format", "auto");
      ad.setAttribute("data-full-width-responsive", "true");
      container.replaceChildren(ad);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasInitialized.current = true;
      } catch {
        // An unavailable AdSense script or an ad blocker must not affect page content.
        container.replaceChildren();
      }
    };

    mountAd();
    mediaQuery.addEventListener("change", mountAd);
    return () => mediaQuery.removeEventListener("change", mountAd);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[90px] w-full md:hidden"
      aria-label="Advertisement"
    />
  );
}
