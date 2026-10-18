import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pokemonNames = JSON.parse(fs.readFileSync(path.join(__dirname, "pokemon-names.json"), "utf-8"));
const outputPath = path.join(__dirname, "pokemon-seo-data.json");
const CONCURRENCY = 8;

async function fetchPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`${name}: HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(({ type }) => type.name),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map(({ ability }) => ability.name),
    stats: data.stats.map(({ stat, base_stat }) => ({ name: stat.name, value: base_stat })),
  };
}

async function fetchAllPokemonSeoData() {
  const records = {};
  let completed = 0;
  const queue = [...pokemonNames];

  async function worker() {
    while (queue.length > 0) {
      const name = queue.shift();
      if (!name) return;

      try {
        records[name] = await fetchPokemon(name);
      } catch (error) {
        console.error(`Failed to fetch ${name}: ${error instanceof Error ? error.message : error}`);
      } finally {
        completed += 1;
        if (completed % 100 === 0 || completed === pokemonNames.length) {
          console.log(`Fetched ${completed}/${pokemonNames.length} Pokémon...`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf-8");
  console.log(`✓ Saved ${Object.keys(records).length} Pokémon SEO records to ${outputPath}`);

  if (Object.keys(records).length !== pokemonNames.length) {
    process.exitCode = 1;
  }
}

fetchAllPokemonSeoData().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
