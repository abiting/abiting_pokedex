import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Pokemon names
const pokemonNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'pokemon-names.json'), 'utf-8'));

const pokemonTypes = {};

async function fetchPokemonTypes() {
  console.log('Fetching Pokemon types from PokeAPI...');
  
  for (let i = 0; i < pokemonNames.length; i++) {
    const pokemonName = pokemonNames[i];
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) {
        console.warn(`Failed to fetch ${pokemonName}: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      pokemonTypes[pokemonName] = data.types.map(t => t.type.name).sort();
      
      // Log progress every 100 Pokemon
      if ((i + 1) % 100 === 0) {
        console.log(`Fetched ${i + 1}/${pokemonNames.length} Pokemon...`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Error fetching ${pokemonName}:`, error.message);
    }
  }
  
  // Save to file
  const outputPath = path.join(__dirname, 'pokemon-types.json');
  fs.writeFileSync(outputPath, JSON.stringify(pokemonTypes, null, 2), 'utf-8');
  console.log(`✓ Saved Pokemon types to ${outputPath}`);
  console.log(`✓ Total Pokemon with types: ${Object.keys(pokemonTypes).length}`);
}

fetchPokemonTypes().catch(console.error);
