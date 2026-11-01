import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-2648968341090496";
const ADSENSE_SLOT = "4399239344";

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
    const container = containerRef.current;
    if (!container || hasInitialized.current) return;

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
  }, []);

  return <div ref={containerRef} className="min-h-[90px] w-full" aria-label="Advertisement" />;
}
