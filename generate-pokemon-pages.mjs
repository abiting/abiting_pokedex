import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Pokemon names
const pokemonNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'pokemon-names.json'), 'utf-8'));

// Load Chinese names mapping
const pokemonMapZh = JSON.parse(fs.readFileSync(path.join(__dirname, 'client/src/data/pokemon_zh_hant.json'), 'utf-8'));

// Type translations
const typeChineseNames = {
  "normal": "一般",
  "fire": "火",
  "water": "水",
  "electric": "電",
  "grass": "草",
  "ice": "冰",
  "fighting": "格鬥",
  "poison": "毒",
  "ground": "地面",
  "flying": "飛行",
  "psychic": "超能力",
  "bug": "蟲",
  "rock": "岩石",
  "ghost": "幽靈",
  "dragon": "龍",
  "dark": "惡",
  "steel": "鋼",
  "fairy": "妖精",
};

// Read the base index.html
const baseHtmlPath = path.join(__dirname, 'dist/public/index.html');
const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

// Create output directory
const outputDir = path.join(__dirname, 'dist/public/pokemon');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load Pokemon types data if available
let pokemonTypesData = {};
const typesDataPath = path.join(__dirname, 'pokemon-types.json');
if (fs.existsSync(typesDataPath)) {
  try {
    pokemonTypesData = JSON.parse(fs.readFileSync(typesDataPath, 'utf-8'));
  } catch (e) {
    console.warn('Could not load pokemon-types.json');
  }
}

// Generate HTML files for each Chinese Pokemon page
let generatedCount = 0;
for (const pokemonName of pokemonNames) {
  const chineseName = pokemonMapZh[pokemonName] || pokemonName;
  const pokemonId = pokemonNames.indexOf(pokemonName) + 1;
  
  // Get Pokemon types if available
  let typesText = '屬性';
  if (pokemonTypesData[pokemonName]) {
    const types = pokemonTypesData[pokemonName];
    const typeNames = types.map(t => typeChineseNames[t] || t).join('與');
    typesText = `${typeNames}屬性`;
  }
  
  // Generate SEO content
  const seoTitle = `${chineseName} - Champions 配招與 SP 計算`;
  const seoDescription = `#${String(pokemonId).padStart(4, "0")} ${chineseName}，配招與計算能力點數（SP），盡在 Abiting's Pokédex。`;
  const seoKeywords = `${chineseName}, ${chineseName} 配招, ${chineseName} 種族值, ${chineseName} SP 計算`;

  // Create HTML with updated meta tags
  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${seoTitle}</title>`)
    .replace(/(<meta name="description" content=")([^"]*)(")/, `$1${seoDescription}$3`)
    .replace(/(<meta name="keywords" content=")([^"]*)(")/, `$1${seoKeywords}$3`);

  // Write to pokemon/[name]/zh/index.html
  const pokemonDir = path.join(outputDir, pokemonName, 'zh');
  if (!fs.existsSync(pokemonDir)) {
    fs.mkdirSync(pokemonDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(pokemonDir, 'index.html'), html, 'utf-8');
  if (generatedCount < 5) {
    console.log(`  - ${chineseName}: ${seoKeywords}`);
  }
  generatedCount++;
}

console.log(`✓ Generated ${generatedCount} Chinese Pokemon HTML pages with updated keywords`);
if (generatedCount > 5) {
  console.log(`  ... and ${generatedCount - 5} more`);
}
