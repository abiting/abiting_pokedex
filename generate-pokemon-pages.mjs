import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://list.abitingpokedex.com";
const SITE_ROOT_URL = `${SITE_URL}/`;
const baseHtmlPath = path.join(__dirname, "dist/public/index.html");
const outputDir = path.join(__dirname, "dist/public/pokemon");
const pokemonNames = JSON.parse(fs.readFileSync(path.join(__dirname, "pokemon-names.json"), "utf-8"));
const pokemonMapZh = JSON.parse(
  fs.readFileSync(path.join(__dirname, "client/src/data/pokemon_zh_hant.json"), "utf-8"),
);
const abilitiesMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "client/src/data/abilities_zh_hant.json"), "utf-8"),
);
const pokemonSeoDataPath = path.join(__dirname, "pokemon-seo-data.json");

if (!fs.existsSync(pokemonSeoDataPath)) {
  throw new Error(
    "pokemon-seo-data.json is required for static SEO generation. Run `node fetch-pokemon-seo-data.mjs` before building.",
  );
}

const pokemonSeoData = JSON.parse(fs.readFileSync(pokemonSeoDataPath, "utf-8"));

const typeChineseNames = {
  normal: "一般",
  fire: "火",
  water: "水",
  electric: "電",
  grass: "草",
  ice: "冰",
  fighting: "格鬥",
  poison: "毒",
  ground: "地面",
  flying: "飛行",
  psychic: "超能力",
  bug: "蟲",
  rock: "岩石",
  ghost: "幽靈",
  dragon: "龍",
  dark: "惡",
  steel: "鋼",
  fairy: "妖精",
};

const specialEnglishNames = {
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "type-null": "Type: Null",
  "ho-oh": "Ho-Oh",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
};

const staticStyles = `
<style data-static-seo="true">
  .seo-page{max-width:960px;margin:0 auto;padding:32px 20px 56px;font-family:Arial,"Noto Sans TC",sans-serif;color:#1f2937;line-height:1.7}
  .seo-page a{color:#6d28d9;text-decoration:underline;text-underline-offset:3px}.seo-page a:hover{color:#4c1d95}
  .seo-page header{margin-bottom:28px}.seo-page h1{font-size:clamp(1.9rem,5vw,2.7rem);line-height:1.25;margin:0 0 8px}.seo-page h2{font-size:1.25rem;margin:32px 0 10px}
  .seo-page p{margin:0 0 14px}.seo-page .eyebrow{font-weight:700;color:#7c3aed;letter-spacing:.04em}.seo-page .meta{color:#4b5563}
  .seo-page .panel{background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:18px 20px;margin:22px 0}.seo-page .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(142px,1fr));gap:12px;margin:0;padding:0}.seo-page .facts div{background:#fff;border:1px solid #ede9fe;border-radius:10px;padding:10px}.seo-page .facts dt{font-size:.82rem;font-weight:700;color:#6b7280}.seo-page .facts dd{margin:3px 0 0;font-weight:700;color:#312e81}
  .seo-page nav{display:flex;flex-wrap:wrap;gap:10px 18px}.seo-page .directory{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px 16px;padding:0;list-style:none}
  .seo-page .directory li{border-bottom:1px solid #e5e7eb;padding:6px 0}.seo-page .directory .zh-link{margin-left:8px;color:#475569;font-size:.9rem}
  .seo-page footer{margin-top:38px;padding-top:18px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:.92rem}
</style>`;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function withTrailingSlash(routePath) {
  if (routePath === "/") return "/";
  return `${routePath.replace(/\/+$/, "")}/`;
}

function formatEnglishName(name) {
  if (specialEnglishNames[name]) return specialEnglishNames[name];

  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getId(index) {
  return index + 1;
}

function getTypes(name) {
  const types = pokemonSeoData[name]?.types;
  return Array.isArray(types) && types.length > 0 ? types : ["normal"];
}

function getPokemonDetail(name, index) {
  const detail = pokemonSeoData[name] || {};
  return {
    id: detail.id || getId(index),
    types: Array.isArray(detail.types) && detail.types.length > 0 ? detail.types : getTypes(name),
    height: typeof detail.height === "number" ? detail.height / 10 : null,
    weight: typeof detail.weight === "number" ? detail.weight / 10 : null,
    abilities: Array.isArray(detail.abilities) ? detail.abilities : [],
    stats: Array.isArray(detail.stats) ? detail.stats : [],
  };
}

function formatId(id) {
  return `#${String(id).padStart(4, "0")}`;
}

function typeNamesEnglish(types) {
  return types.map((type) => type.charAt(0).toUpperCase() + type.slice(1));
}

function typeNamesChinese(types) {
  return types.map((type) => typeChineseNames[type] || type);
}

function joinEnglish(items) {
  if (items.length <= 1) return items[0] || "Unknown";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function joinChinese(items) {
  return items.join("與") || "未知";
}

function formatAbilityName(name) {
  if (name === "hp") return "HP";

  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatNumber(value, unit = "") {
  return value === null ? "—" : `${value.toFixed(1)}${unit}`;
}

function renderFacts(items) {
  return `<dl class="facts">${items
    .map(({ label, value }) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("")}</dl>`;
}

function compactBaseHtml(baseHtml) {
  return baseHtml.replace(/\s*<script id="manus-runtime">[\s\S]*?<\/script>/, "");
}

function replaceMetaTag(html, name, content) {
  const escapedContent = escapeHtml(content);
  const expression = new RegExp(`(<meta\\s+name=["']${name}["']\\s+content=["'])[^"']*(["'][^>]*>)`, "i");

  if (expression.test(html)) {
    return html.replace(expression, `$1${escapedContent}$2`);
  }

  return html.replace("</head>", `    <meta name="${name}" content="${escapedContent}" />\n  </head>`);
}

function replacePropertyTag(html, property, content) {
  const escapedContent = escapeHtml(content);
  const expression = new RegExp(`(<meta\\s+property=["']${property}["']\\s+content=["'])[^"']*(["'][^>]*>)`, "i");

  if (expression.test(html)) {
    return html.replace(expression, `$1${escapedContent}$2`);
  }

  return html.replace("</head>", `    <meta property="${property}" content="${escapedContent}" />\n  </head>`);
}

function createDocument({ baseHtml, lang, title, description, keywords, canonicalPath, body, schema }) {
  const canonicalUrl = `${SITE_URL}${withTrailingSlash(canonicalPath)}`;
  let html = baseHtml
    .replace(/<html\s+lang=["'][^"']*["']>/i, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  html = replaceMetaTag(html, "description", description);
  html = replaceMetaTag(html, "keywords", keywords);
  html = replacePropertyTag(html, "og:title", title);
  html = replacePropertyTag(html, "og:description", description);
  html = html.replace(
    "</head>",
    `    <link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:url" content="${canonicalUrl}" />\n    <script type="application/ld+json">${escapeJsonForHtml(schema)}</script>${staticStyles}\n  </head>`,
  );

  if (!/<div id="root"><\/div>/.test(html)) {
    throw new Error("Unable to locate the React root in the Vite build output.");
  }

  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function navigationLinks({ name, index, language }) {
  const previousName = index > 0 ? pokemonNames[index - 1] : null;
  const nextName = index < pokemonNames.length - 1 ? pokemonNames[index + 1] : null;
  const isChinese = language === "zh";
  const currentLanguagePath = (slug) => withTrailingSlash(`/pokemon/${slug}${isChinese ? "/zh" : ""}`);
  const alternateLanguagePath = (slug) => withTrailingSlash(`/pokemon/${slug}${isChinese ? "" : "/zh"}`);
  const languageSwitchHref = alternateLanguagePath(name);
  const languageSwitchLabel = isChinese ? "English page" : "繁體中文頁面";
  const previousHref = previousName ? currentLanguagePath(previousName) : "/";
  const nextHref = nextName ? currentLanguagePath(nextName) : "/";
  const previousLabel = previousName
    ? `${isChinese ? "上一隻" : "Previous"}：${isChinese ? pokemonMapZh[previousName] || formatEnglishName(previousName) : formatEnglishName(previousName)}`
    : isChinese
      ? "返回寶可夢圖鑑"
      : "Back to Pokédex";
  const nextLabel = nextName
    ? `${isChinese ? "下一隻" : "Next"}：${isChinese ? pokemonMapZh[nextName] || formatEnglishName(nextName) : formatEnglishName(nextName)}`
    : isChinese
      ? "返回寶可夢圖鑑"
      : "Back to Pokédex";

  return `<nav aria-label="${isChinese ? "寶可夢頁面導覽" : "Pokémon page navigation"}">
    <a href="/">${isChinese ? "完整寶可夢圖鑑" : "Full Pokédex"}</a>
    <a href="${languageSwitchHref}">${languageSwitchLabel}</a>
    <a href="${previousHref}">${escapeHtml(previousLabel)}</a>
    <a href="${nextHref}">${escapeHtml(nextLabel)}</a>
  </nav>`;
}

function renderEnglishPage({ name, index }) {
  const detail = getPokemonDetail(name, index);
  const id = detail.id;
  const number = formatId(id);
  const englishName = formatEnglishName(name);
  const chineseName = pokemonMapZh[name] || englishName;
  const types = detail.types;
  const typeText = joinEnglish(typeNamesEnglish(types));
  const abilitiesText = detail.abilities.map(formatAbilityName).join(", ") || "—";
  const baseData = renderFacts([
    { label: "Types", value: typeText },
    { label: "Abilities", value: abilitiesText },
    { label: "Height", value: formatNumber(detail.height, " m") },
    { label: "Weight", value: formatNumber(detail.weight, " kg") },
  ]);
  const baseStats = renderFacts(
    detail.stats.map((stat) => ({ label: formatAbilityName(stat.name), value: String(stat.value) })),
  );
  const title = `${englishName} #${String(id).padStart(4, "0")} | Abiting's Pokédex`;
  const description = `${englishName} (#${String(id).padStart(4, "0")}) is a ${typeText} type Pokémon. Explore base stats, abilities, weaknesses, and Pokémon Champions team-planning information in Abiting's Pokédex.`;
  const keywords = `${englishName}, ${englishName} abilities, Pokémon Champions ${englishName}, ${englishName} base stats, ${englishName} weaknesses`;
  const canonicalPath = `/pokemon/${name}/`;
  const body = `<main class="seo-page" data-static-seo-page="true">
    <header>
      <p class="eyebrow">Abiting's Pokédex · ${number}</p>
      <h1>${escapeHtml(englishName)}</h1>
      <p class="meta">${escapeHtml(typeText)} type Pokémon · Traditional Chinese name: ${escapeHtml(chineseName)}</p>
    </header>
    <section class="panel" aria-labelledby="overview-${id}">
      <h2 id="overview-${id}">Pokémon Champions battle overview</h2>
      <p>${escapeHtml(englishName)} is ${escapeHtml(typeText)} type Pokémon ${number}. Use this entry to review its type matchup, abilities, base stats, weaknesses, gender ratio, and evolution information for Pokémon Champions team planning.</p>
      <p>The interactive Pokédex provides the full battle data after the page loads. The links below connect this entry with the complete Pokédex, its Traditional Chinese edition, and neighboring Pokémon entries.</p>
    </section>
    <section aria-labelledby="data-${id}"><h2 id="data-${id}">Base data</h2>${baseData}</section>
    <section aria-labelledby="stats-${id}"><h2 id="stats-${id}">Base stats</h2>${baseStats}</section>
    ${navigationLinks({ name, index, language: "en" })}
    <footer>Data source: PokéAPI. Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and Creatures.</footer>
  </main>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${canonicalPath}`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Abiting's Pokédex", url: SITE_ROOT_URL },
    mainEntity: {
      "@type": "Thing",
      name: englishName,
      alternateName: `${number} ${chineseName}`,
      additionalType: typeText,
      height: detail.height === null ? undefined : { "@type": "QuantitativeValue", value: detail.height, unitCode: "MTR" },
      weight: detail.weight === null ? undefined : { "@type": "QuantitativeValue", value: detail.weight, unitCode: "KGM" },
    },
  };

  return { title, description, keywords, canonicalPath, body, schema, lang: "en" };
}

function renderChinesePage({ name, index }) {
  const detail = getPokemonDetail(name, index);
  const id = detail.id;
  const number = formatId(id);
  const englishName = formatEnglishName(name);
  const chineseName = pokemonMapZh[name] || englishName;
  const types = detail.types;
  const typeText = joinChinese(typeNamesChinese(types));
  const abilitiesText = detail.abilities
    .map((ability) => abilitiesMap[ability] || formatAbilityName(ability))
    .join("、") || "—";
  const statChineseNames = {
    hp: "HP",
    attack: "攻擊",
    defense: "防禦",
    "special-attack": "特攻",
    "special-defense": "特防",
    speed: "速度",
  };
  const baseData = renderFacts([
    { label: "屬性", value: typeText },
    { label: "特性", value: abilitiesText },
    { label: "身高", value: formatNumber(detail.height, " m") },
    { label: "體重", value: formatNumber(detail.weight, " kg") },
  ]);
  const baseStats = renderFacts(
    detail.stats.map((stat) => ({
      label: statChineseNames[stat.name] || formatAbilityName(stat.name),
      value: String(stat.value),
    })),
  );
  const title = `${chineseName}｜Pokémon Champions 資料庫`;
  const description = `${number} ${chineseName}，${typeText}屬性寶可夢。配招、能力點數（SP）計算，盡在 Abiting's Pokédex。`;
  const keywords = `${chineseName}、${chineseName}特性、Pokemon Champions ${chineseName}、寶可夢冠軍${chineseName}、${chineseName}性別比例`;
  const canonicalPath = `/pokemon/${name}/zh/`;
  const body = `<main class="seo-page" data-static-seo-page="true">
    <header>
      <p class="eyebrow">Abiting's Pokédex · ${number}</p>
      <h1>${escapeHtml(chineseName)}</h1>
      <p class="meta">${escapeHtml(typeText)}屬性寶可夢 · 英文名稱：${escapeHtml(englishName)}</p>
    </header>
    <section class="panel" aria-labelledby="overview-${id}">
      <h2 id="overview-${id}">${escapeHtml(chineseName)}的 Pokémon Champions 資料</h2>
      <p>${escapeHtml(chineseName)}是${escapeHtml(typeText)}屬性寶可夢，圖鑑編號為 ${number}。這個頁面提供配招、能力點數（SP）、種族值、特性、弱點、性別比例與進化鏈等 Pokémon Champions 對戰規劃所需資料。</p>
      <p>完整互動資料會在頁面載入後顯示。你也可以使用下方連結返回完整寶可夢圖鑑、切換英文版本，或瀏覽相鄰編號的寶可夢。</p>
    </section>
    <section aria-labelledby="data-${id}"><h2 id="data-${id}">基本資料</h2>${baseData}</section>
    <section aria-labelledby="stats-${id}"><h2 id="stats-${id}">種族值</h2>${baseStats}</section>
    ${navigationLinks({ name, index, language: "zh" })}
    <footer>資料來源：PokéAPI。Pokémon 與寶可夢角色名稱為 Nintendo、Game Freak 與 Creatures 的商標。</footer>
  </main>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${canonicalPath}`,
    inLanguage: "zh-Hant",
    isPartOf: { "@type": "WebSite", name: "Abiting's Pokédex", url: SITE_ROOT_URL },
    mainEntity: {
      "@type": "Thing",
      name: chineseName,
      alternateName: `${number} ${englishName}`,
      additionalType: `${typeText}屬性寶可夢`,
      height: detail.height === null ? undefined : { "@type": "QuantitativeValue", value: detail.height, unitCode: "MTR" },
      weight: detail.weight === null ? undefined : { "@type": "QuantitativeValue", value: detail.weight, unitCode: "KGM" },
    },
  };

  return { title, description, keywords, canonicalPath, body, schema, lang: "zh-Hant" };
}

function renderHomePage() {
  const directoryItems = pokemonNames
    .map((name, index) => {
      const id = getId(index);
      const englishName = formatEnglishName(name);
      const chineseName = pokemonMapZh[name] || englishName;
      return `<li><a href="/pokemon/${name}/">${formatId(id)} ${escapeHtml(englishName)}</a><a class="zh-link" href="/pokemon/${name}/zh/" lang="zh-Hant">${escapeHtml(chineseName)}</a></li>`;
    })
    .join("\n");
  const title = "List of Pokémon | Abiting's Pokédex";
  const description = "The essential battle database for Pokémon Champions. Browse all 1,025 Pokémon with dedicated English and Traditional Chinese pages covering types, abilities, base stats, weaknesses, and evolution information.";
  const body = `<main class="seo-page" data-static-seo-page="true">
    <header>
      <p class="eyebrow">Abiting's Pokédex</p>
      <h1>List of Pokémon</h1>
      <p class="meta">The essential Pokédex for Pokémon Champions. Browse the full English and Traditional Chinese Pokémon directory.</p>
    </header>
    <section class="panel" aria-labelledby="directory-overview">
      <h2 id="directory-overview">Complete Pokémon directory</h2>
      <p>Every entry below links to a dedicated Pokémon page with type, abilities, base stats, weaknesses, evolution, and team-planning information. Select either the English name or the Traditional Chinese name to open that language edition.</p>
      <nav aria-label="Site navigation"><a href="/about/">About Developer</a></nav>
    </section>
    <section aria-labelledby="pokemon-directory">
      <h2 id="pokemon-directory">Pokémon directory</h2>
      <ol class="directory">${directoryItems}</ol>
    </section>
    <footer>Data source: PokéAPI. Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and Creatures.</footer>
  </main>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Abiting's Pokédex", url: SITE_ROOT_URL },
  };

  return {
    title,
    description,
    keywords: "List of Pokémon, Pokédex, Pokémon Champions, Base Stats, Type Weaknesses, Abilities, Team Builder, Pokemon Database",
    canonicalPath: "/",
    body,
    schema,
    lang: "en",
  };
}

function renderAboutPage() {
  const title = "About Developer | Abiting's Pokédex";
  const description = "Abiting is a Content Creator and Marketing Professional from Taiwan, actively engaged in Pokémon communities across Taiwan, China, and Hong Kong.";
  const canonicalPath = "/about/";
  const body = `<main class="seo-page" data-static-seo-page="true">
    <header>
      <p class="eyebrow">Abiting's Pokédex</p>
      <h1>About Developer</h1>
      <p class="meta">Abiting · Pokémon Lover from Taiwan</p>
    </header>
    <section class="panel" aria-labelledby="about-abiting">
      <h2 id="about-abiting">About Abiting</h2>
      <p>Abiting is a Content Creator and Marketing Professional from Taiwan, actively engaged in Pokémon communities across Taiwan, China, and Hong Kong.</p>
      <p>List of Pokémon is a comprehensive Pokédex database built for Pokémon Champions. It provides Pokémon type, ability, base-stat, weakness, and evolution information for team planning.</p>
    </section>
    <nav aria-label="Site navigation"><a href="/">Back to the full Pokédex</a><a href="https://abiting.cc" rel="noopener noreferrer">Visit abiting.cc</a></nav>
    <footer>Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and Creatures.</footer>
  </main>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: `${SITE_URL}${canonicalPath}`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Abiting's Pokédex", url: SITE_ROOT_URL },
  };

  return {
    title,
    description,
    keywords: "Abiting, Pokémon, Pokédex for Pokémon Champions",
    canonicalPath,
    body,
    schema,
    lang: "en",
  };
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf-8");
const routeBaseHtml = compactBaseHtml(baseHtml);

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

let generatedCount = 0;
for (const [index, name] of pokemonNames.entries()) {
  const englishPage = renderEnglishPage({ name, index });
  const chinesePage = renderChinesePage({ name, index });

  const englishDir = path.join(outputDir, name);
  const chineseDir = path.join(englishDir, "zh");
  fs.mkdirSync(chineseDir, { recursive: true });

  fs.writeFileSync(
    path.join(englishDir, "index.html"),
    createDocument({ baseHtml: routeBaseHtml, ...englishPage }),
    "utf-8",
  );
  fs.writeFileSync(
    path.join(chineseDir, "index.html"),
    createDocument({ baseHtml: routeBaseHtml, ...chinesePage }),
    "utf-8",
  );
  generatedCount += 2;
}

const homePage = renderHomePage();
fs.writeFileSync(
  baseHtmlPath,
  createDocument({ baseHtml, ...homePage }),
  "utf-8",
);

const aboutPage = renderAboutPage();
const aboutDir = path.join(__dirname, "dist/public/about");
fs.mkdirSync(aboutDir, { recursive: true });
fs.writeFileSync(
  path.join(aboutDir, "index.html"),
  createDocument({ baseHtml: routeBaseHtml, ...aboutPage }),
  "utf-8",
);

console.log(`✓ Generated ${generatedCount} static Pokémon SEO pages, a crawlable homepage directory, and an about page`);
