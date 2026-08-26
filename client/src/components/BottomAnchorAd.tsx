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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-violet-300/60 bg-black shadow-[0_-5px_20px_rgba(88,28,135,0.34)]"
    >
      <a
        href={destination}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mx-auto block h-20 w-full max-w-[1150px] overflow-hidden bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-950 sm:h-auto"
      >
        <img
          src="https://app.abiting.cc/wp-content/uploads/2026/08/%E6%88%AA%E5%9C%96-2026-08-26-%E4%B8%8A%E5%8D%8811.14.31-scaled.jpeg"
          alt="Abipaint online image resizer"
          className="block h-full w-full object-cover object-center sm:h-auto sm:object-contain"
        />
        <span className="absolute left-[7%] top-[16%] z-10 max-w-[34%] text-center text-xs font-black leading-tight tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] sm:text-base md:text-xl">
          {copy.left}
        </span>
        <span className="absolute right-[7%] top-[16%] z-10 max-w-[34%] text-center text-xs font-black leading-tight tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] sm:text-base md:text-xl">
          {copy.right}
        </span>
      </a>
    </aside>
  );
}
