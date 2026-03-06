/**
 * Format Pokemon names to use official naming conventions
 * - "pokemon-gmax" -> "Gigantamax Pokemon"
 * - "pokemon-mega" -> "Mega Pokemon"
 * - "pokemon-alola" -> "Alolan Pokemon"
 * - "pokemon-galar" -> "Galarian Pokemon"
 * - "pokemon-hisui" -> "Hisuian Pokemon"
 * - "pokemon-paldea" -> "Paldean Pokemon"
 * - For Pokemon ID >= 984: "pokemon-form" -> "Pokemon Form" (no parentheses)
 * - Remove parentheses for: male, female, sunny, rainy, snowy, attack, defense, speed
 */

// Forms that should NOT have parentheses (just show base name)
const formsToRemove = new Set([
  "male",
  "female",
  "sunny",
  "rainy",
  "snowy",
  "attack",
  "defense",
  "speed",
  "low-key",
  "amped",
]);

export function formatPokemonName(name: string, pokemonId?: number): string {
  // Handle Gigantamax forms
  if (name.includes("-gmax")) {
    const baseName = name.replace("-gmax", "");
    return `Gigantamax ${capitalize(baseName)}`;
  }

  // Handle Mega forms
  if (name.includes("-mega")) {
    const baseName = name.replace("-mega", "");
    return `Mega ${capitalize(baseName)}`;
  }

  // Handle regional forms
  if (name.includes("-alola")) {
    const baseName = name.replace("-alola", "");
    return `Alolan ${capitalize(baseName)}`;
  }

  if (name.includes("-galar")) {
    const baseName = name.replace("-galar", "");
    return `Galarian ${capitalize(baseName)}`;
  }

  if (name.includes("-hisui")) {
    const baseName = name.replace("-hisui", "");
    return `Hisuian ${capitalize(baseName)}`;
  }

  if (name.includes("-paldea")) {
    const baseName = name.replace("-paldea", "");
    return `Paldean ${capitalize(baseName)}`;
  }

  // Handle other forms (e.g., -male, -female, -sunny, -rainy, etc.)
  if (name.includes("-")) {
    const parts = name.split("-");
    const baseName = parts[0];
    const formName = parts.slice(1).join("-");

    // For Pokemon ID >= 984, use space instead of parentheses
    if (pokemonId !== undefined && pokemonId >= 984) {
      return `${capitalize(baseName)} ${capitalize(formName)}`;
    }

    // For forms that should be removed (male, female, etc), just return base name
    if (formsToRemove.has(formName)) {
      return capitalize(baseName);
    }

    // For other cases, return with parentheses
    return `${capitalize(baseName)} (${capitalize(formName)})`;
  }

  // Default: just capitalize the name
  return capitalize(name);
}

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
