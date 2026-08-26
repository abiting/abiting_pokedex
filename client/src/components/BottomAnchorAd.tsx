import { useLocation } from "wouter";

/**
 * Visual intent: a restrained, full-width bottom anchor that preserves the
 * Pokédex's purple interface while keeping the supplied promotion prominent.
 */
interface BottomAnchorAdProps {
  onClose: () => void;
}

export default function BottomAnchorAd({ onClose }: BottomAnchorAdProps) {
  const [location] = useLocation();
  const isChinesePage = location.endsWith("/zh");
  const destination = isChinesePage
    ? "https://abipaint.abiting.cc"
    : "https://abipaint.abiting.cc/en";
  const imageSource = isChinesePage
    ? "https://app.abiting.cc/wp-content/uploads/2026/08/%E6%88%AA%E5%9C%96-2026-08-26-%E4%B8%8A%E5%8D%8811.14.31%E6%8B%B7%E8%B2%9D-scaled.jpg"
    : "https://app.abiting.cc/wp-content/uploads/2026/08/%E6%88%AA%E5%9C%96-2026-08-26-%E4%B8%8A%E5%8D%8811.14.31-scaled.jpg";

  return (
    <aside
      aria-label="Abipaint promotion"
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
            alt={isChinesePage ? "AbiPaint 線上修圖器" : "AbiPaint online photo editor"}
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
  );
}
