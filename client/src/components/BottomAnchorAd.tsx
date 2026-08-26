import { useLocation } from "wouter";

/**
 * Visual intent: a restrained, full-width bottom anchor that preserves the
 * Pokédex's purple interface while keeping the supplied promotion prominent.
 */
export default function BottomAnchorAd() {
  const [location] = useLocation();
  const isChinesePage = location.endsWith("/zh");
  const destination = isChinesePage
    ? "https://abipaint.abiting.cc"
    : "https://abipaint.abiting.cc/en";
  const copy = isChinesePage
    ? {
        left: "圖片尺寸縮放",
        right: "免費影像調色",
      }
    : {
        left: "Free Online Photo Editor",
        right: "Resize, Draw & Color Adjust",
      };

  return (
    <aside
      aria-label="Abipaint promotion"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-violet-300/60 bg-gradient-to-r from-violet-950/95 via-blue-950/95 to-violet-950/95 px-3 py-1.5 shadow-[0_-5px_20px_rgba(88,28,135,0.34)] backdrop-blur-sm"
    >
      <a
        href={destination}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto grid w-full max-w-4xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center text-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-950 sm:gap-5"
      >
        <span className="text-[11px] font-semibold leading-4 tracking-wide sm:text-base sm:leading-6">
          {copy.left}
        </span>
        <img
          src="https://app.abiting.cc/wp-content/uploads/2026/08/abipaint-online-image-resizer.jpg"
          alt="Abipaint online image resizer"
          className="block h-auto max-h-14 max-w-full object-contain sm:max-h-20"
        />
        <span className="text-[11px] font-semibold leading-4 tracking-wide sm:text-base sm:leading-6">
          {copy.right}
        </span>
      </a>
    </aside>
  );
}
