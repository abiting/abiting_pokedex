import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-2648968341090496";
const ADSENSE_SLOT = "7821030489";
const DESKTOP_MEDIA_QUERY = "(min-width: 1700px)";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function SideRailAd({ side }: { side: "left" | "right" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const mountAd = () => {
      const container = containerRef.current;
      if (!container || !mediaQuery.matches || hasInitialized.current) return;

      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.setAttribute("data-ad-client", ADSENSE_CLIENT);
      ad.setAttribute("data-ad-slot", ADSENSE_SLOT);
      ad.setAttribute("data-ad-format", "vertical");
      ad.setAttribute("data-full-width-responsive", "false");
      container.replaceChildren(ad);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        hasInitialized.current = true;
      } catch {
        // Ad blockers or an unavailable AdSense script must not affect page content.
        container.replaceChildren();
      }
    };

    mountAd();
    mediaQuery.addEventListener("change", mountAd);
    return () => mediaQuery.removeEventListener("change", mountAd);
  }, []);

  return (
    <aside
      aria-label={`${side === "left" ? "Left" : "Right"} advertisement`}
      className={`pointer-events-none fixed top-6 z-30 hidden min-[1700px]:block ${side === "left" ? "left-6" : "right-6"}`}
    >
      <div
        ref={containerRef}
        className="pointer-events-auto h-[600px] w-[160px] overflow-hidden"
      />
    </aside>
  );
}

/** Displays unobtrusive AdSense side rails only where they have clear desktop space. */
export default function DesktopSideAds() {
  return (
    <>
      <SideRailAd side="left" />
      <SideRailAd side="right" />
    </>
  );
}
