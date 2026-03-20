import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import type { Connect } from "vite";

// Load static Pokémon names list
let pokemonNamesList: string[] = [];
try {
  const pokemonNamesPath = path.resolve(import.meta.dirname, "pokemon-names.json");
  if (fs.existsSync(pokemonNamesPath)) {
    pokemonNamesList = JSON.parse(fs.readFileSync(pokemonNamesPath, "utf-8"));
  }
} catch (error) {
  console.warn("Could not load pokemon-names.json, will use fallback");
}

// Generate sitemap synchronously - works for both dev and production
function generateSitemap(): string {
  const domain = "https://list.abitingpokedex.com";
  const urls: string[] = [];
  
  // Add homepage
  urls.push(`  <url>
    <loc>${domain}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);
  
  // Add about page
  urls.push(`  <url>
    <loc>${domain}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  
  // Common Pokémon names for dev server
  const commonPokemonNames = [
    "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie",
    "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate",
    "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran-f", "nidorina",
    "nidoqueen", "nidoran-m", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff",
    "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett",
    "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag",
    "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell",
    "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro",
    "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix",
    "drowzee", "hypno", "krabby", "kingler", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie",
    "mr-mime", "jynx", "electabuzz", "magby", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "lickitung",
    "weezing", "rhyhorn", "rhydon", "chansey", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu",
    "starmie", "mr-mime", "jynx", "electabuzz", "magby", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "lickitung",
    "weezing", "rhyhorn", "rhydon", "chansey", "kangaskhan"
  ];
  
  // Generate URLs for all 1025 Pokémon (English)
  for (let i = 1; i <= 1025; i++) {
    let pokemonName: string;
    if (i <= commonPokemonNames.length) {
      pokemonName = commonPokemonNames[i - 1];
    } else {
      // For Pokémon beyond our hardcoded list, use placeholder
      // In production build, this will be fetched from PokéAPI
      pokemonName = `pokemon-${i}`;
    }
    
    urls.push(`  <url>
    <loc>${domain}/pokemon/${pokemonName}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
  
  // Generate URLs for all 1025 Pokémon (Traditional Chinese)
  for (let i = 1; i <= 1025; i++) {
    let pokemonName: string;
    if (i <= commonPokemonNames.length) {
      pokemonName = commonPokemonNames[i - 1];
    } else {
      // For Pokémon beyond our hardcoded list, use placeholder
      // In production build, this will be fetched from PokéAPI
      pokemonName = `pokemon-${i}`;
    }
    
    urls.push(`  <url>
    <loc>${domain}/pokemon/${pokemonName}/zh</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  
  return sitemap;
}

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

interface DebugLog {
  timestamp: string;
  level: "log" | "warn" | "error";
  message: string;
  stack?: string;
}

const MAX_LOG_SIZE = 1024 * 1024; // 1MB
const KEEP_PERCENT = 0.6; // Keep 60% when trimming

function trimLogFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const stats = fs.statSync(filePath);
  if (stats.size > MAX_LOG_SIZE) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const keepLines = Math.floor(lines.length * KEEP_PERCENT);
    const trimmed = lines.slice(lines.length - keepLines).join("\n");
    fs.writeFileSync(filePath, trimmed, "utf-8");
  }
}

function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",
    apply: "serve",
    configResolved(config) {
      // Ensure log directory exists
      const logDir = path.resolve(config.root, ".manus-logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    },
    transformIndexHtml() {
      return [
        {
          tag: "script",
          inlineCode: `
            (function() {
              const logDir = '.manus-logs';
              const logs = { browserConsole: [], networkRequests: [], sessionReplay: [] };

              // Capture console logs
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalError = console.error;

              console.log = function(...args) {
                originalLog(...args);
                fetch('/api/debug-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ level: 'log', message: args.join(' ') })
                }).catch(() => {});
              };

              console.warn = function(...args) {
                originalWarn(...args);
                fetch('/api/debug-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ level: 'warn', message: args.join(' ') })
                }).catch(() => {});
              };

              console.error = function(...args) {
                originalError(...args);
                fetch('/api/debug-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ level: 'error', message: args.join(' ') })
                }).catch(() => {});
              };

              // Capture network requests
              const originalFetch = window.fetch;
              window.fetch = function(...args) {
                const startTime = performance.now();
                return originalFetch.apply(this, args).then(response => {
                  const duration = performance.now() - startTime;
                  fetch('/api/debug-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      level: 'log',
                      message: \`Network: \${args[0]} - Status: \${response.status} - Duration: \${duration.toFixed(2)}ms\`
                    })
                  }).catch(() => {});
                  return response;
                });
              };
            })();
          `,
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

// Plugin to generate and copy sitemap during build
function vitePluginSitemapGenerator(): Plugin {
  return {
    name: "sitemap-generator",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const sitemapPath = path.join(outDir, "sitemap.xml");
      
      // Ensure output directory exists
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      try {
        // Use pre-loaded Pokémon names list
        let pokemonNames = pokemonNamesList;
        
        // If not loaded, try to fetch from PokéAPI
        if (pokemonNames.length === 0) {
          console.log("Fetching Pokémon list from PokéAPI...");
          const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0");
          const data: any = await response.json();
          pokemonNames = data.results.map((p: any) => p.name);
        }
        
        // Generate sitemap with actual Pokémon names
        const domain = "https://list.abitingpokedex.com";
        const urls: string[] = [];
        
        // Add homepage
        urls.push(`  <url>
    <loc>${domain}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);
        
        // Add about page
        urls.push(`  <url>
    <loc>${domain}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
        
        // Add all Pokémon pages (English)
        for (const name of pokemonNames) {
          urls.push(`  <url>
    <loc>${domain}/pokemon/${name}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
        }
        
        // Add all Pokémon pages (Traditional Chinese)
        for (const name of pokemonNames) {
          urls.push(`  <url>
    <loc>${domain}/pokemon/${name}/zh</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
        }
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
        
        // Write sitemap after all other files are written
        fs.writeFileSync(sitemapPath, sitemap, "utf-8");
        console.log(`✓ Sitemap generated with ${urls.length} URLs: ${sitemapPath}`);
      } catch (error) {
        console.error("Error generating sitemap:", error);
        // Fallback: use the synchronous generator
        const fallbackSitemap = generateSitemap();
        fs.writeFileSync(sitemapPath, fallbackSitemap, "utf-8");
      }
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginSitemapGenerator()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client/public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    middlewareMode: false,
    middleware: [
      // Middleware to serve dynamic sitemap in dev server
      (req, res, next) => {
        if (req.url === "/sitemap.xml") {
          res.setHeader("Content-Type", "application/xml");
          res.end(generateSitemap());
        } else {
          next();
        }
      },
    ],
  },
});
