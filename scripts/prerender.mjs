import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderToString } from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Load Pokémon data
const pokemonZhPath = path.join(projectRoot, 'client/src/data/pokemon_zh_hant.json');
const pokemonData = JSON.parse(fs.readFileSync(pokemonZhPath, 'utf-8'));

// Get unique base Pokémon names
const baseNames = new Set();
for (const name of Object.keys(pokemonData)) {
  let baseName = name;
  const suffixes = ['-male', '-female', '-alola', '-galar', '-hisui', '-paldea', '-normal', '-altered', '-land', '-sky'];
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      baseName = name.slice(0, -suffix.length);
      break;
    }
  }
  baseNames.add(baseName);
}

const sortedNames = Array.from(baseNames).sort();

// Create dist directory if it doesn't exist
const distDir = path.join(projectRoot, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create pokemon pages directory
const pokemonDir = path.join(distDir, 'pokemon');
if (!fs.existsSync(pokemonDir)) {
  fs.mkdirSync(pokemonDir, { recursive: true });
}

// Template HTML
const createHTML = (title, description, url, lang = 'en') => {
  const langAttr = lang === 'zh' ? 'zh-TW' : 'en';
  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Thing",
    "name": "${title}",
    "description": "${description}",
    "url": "${url}"
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/main.js"><\/script>
</body>
</html>`;
};

// Generate English pages
console.log('Generating English Pokémon pages...');
for (const name of sortedNames) {
  const pageDir = path.join(pokemonDir, name);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  const title = `${name.charAt(0).toUpperCase() + name.slice(1)} - Abiting's Pokédex`;
  const description = `View detailed information about ${name} including stats, abilities, and evolution chain.`;
  const url = `https://abitingdex-rzu58tey.manus.space/pokemon/${name}`;
  
  const html = createHTML(title, description, url, 'en');
  fs.writeFileSync(path.join(pageDir, 'index.html'), html);
}

// Generate Chinese pages
console.log('Generating Chinese Pokémon pages...');
for (const name of sortedNames) {
  const zhDir = path.join(pokemonDir, name, 'zh');
  if (!fs.existsSync(zhDir)) {
    fs.mkdirSync(zhDir, { recursive: true });
  }
  
  const chineseName = pokemonData[name] || name;
  const title = `${chineseName} - 寶可夢圖鑑`;
  const description = `查看 ${chineseName} 的詳細資訊，包括種族值、特性和進化鏈。`;
  const url = `https://abitingdex-rzu58tey.manus.space/pokemon/${name}/zh`;
  
  const html = createHTML(title, description, url, 'zh');
  fs.writeFileSync(path.join(zhDir, 'index.html'), html);
}

console.log(`✓ Generated ${sortedNames.length * 2} static pages`);
console.log(`✓ English pages: ${sortedNames.length}`);
console.log(`✓ Chinese pages: ${sortedNames.length}`);
