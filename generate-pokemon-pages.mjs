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

// Cache for Pokemon types to avoid repeated API calls
const pokemonTypesCache = {};

async function getPokemonTypes(pokemonName) {
  if (pokemonTypesCache[pokemonName]) {
    return pokemonTypesCache[pokemonName];
  }
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const types = data.types.map(t => t.type.name).sort();
    pokemonTypesCache[pokemonName] = types;
    return types;
  } catch (error) {
    console.warn(`Failed to fetch types for ${pokemonName}`);
    return null;
  }
}

// Generate HTML files for each Chinese Pokemon page
async function generatePages() {
  let generatedCount = 0;
  
  for (let i = 0; i < pokemonNames.length; i++) {
    const pokemonName = pokemonNames[i];
    const chineseName = pokemonMapZh[pokemonName] || pokemonName;
    const pokemonId = i + 1;
    
    // Get Pokemon types from API
    let typesText = '屬性';
    const types = await getPokemonTypes(pokemonName);
    if (types && types.length > 0) {
      const typeNames = types.map(t => typeChineseNames[t] || t).join('與');
      typesText = `${typeNames}屬性`;
    }
    
    // Generate SEO content
    const seoTitle = `${chineseName} - Abiting's Pokédex`;
    const seoDescription = `${chineseName}（#${String(pokemonId).padStart(4, "0")}），${typesText}寶可夢。種族值、屬性、特性、進化鏈資訊，盡在 Abiting's Pokédex。`;
    const seoKeywords = `${chineseName}, ${chineseName} 特性, ${chineseName} 弱點`;

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
    generatedCount++;
    
    // Log progress every 100 Pokemon
    if ((i + 1) % 100 === 0) {
      console.log(`Generated ${i + 1}/${pokemonNames.length} pages...`);
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`✓ Generated ${generatedCount} Chinese Pokemon HTML pages`);
}

generatePages().catch(console.error);
