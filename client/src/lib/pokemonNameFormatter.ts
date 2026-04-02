/**
 * Format Pokemon names to use official naming conventions
 * - "pokemon-gmax" -> "Gigantamax Pokemon"
 * - "pokemon-mega" -> "Mega Pokemon"
 * - "pokemon-alola" -> "Alolan Pokemon"
 * - "pokemon-galar" -> "Galarian Pokemon"
 * - "pokemon-hisui" -> "Hisuian Pokemon"
 * - "pokemon-paldea" -> "Paldean Pokemon"
 * - For Pokemon ID >= 984: "pokemon-form" -> "Pokemon Form" (no parentheses)
 * - Remove parentheses for many forms like male, female, standard, etc.
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
  "normal",
  "altered",
  "land",
  "sky",
  "standard",
  "red-striped",
  "blue-striped",
  "white-striped",
  "active",
  "incarnate",
  "resolute",
  "baile",
  "pom-pom",
  "pau",
  "sensu",
  "confined",
  "unbound",
  "midday",
  "midnight",
  "dusk",
  "school",
  "solo",
  "crowned",
  "single-strike",
  "rapid-strike",
  "heat",
  "wash",
  "frost",
  "fan",
  "mow",
  "zen",
  // Additional forms from screenshots
  "curly",
  "green-plumage",
  "male-form",
  "female-form",
  "single",
  "full-belly",
  "disguised",
  "red-meteor",
  "midday-form",
  "solo-form",
  "average",
  "shield",
  "ordinary",
  "aria-form",
  "incarnate-form",
  "plant",
  "two-segment",
  "three-segment",
  "four-segment",
  "five-segment",
  "six-segment",
  "seven-segment",
  "eight-segment",
  "nine-segment",
  "ten-segment",
  "eleven-segment",
  "twelve-segment",
  "thirteen-segment",
  "fourteen-segment",
  "fifteen-segment",
  "sixteen-segment",
  "seventeen-segment",
  "eighteen-segment",
  "nineteen-segment",
  "twenty-segment",
  "family-of-three",
  "family-of-four",
  "10",
  "50",
  "complete",
  "zero",
]);

export function formatPokemonName(name: string, pokemonId?: number): string {
  // Special cases for specific Pokemon names
  if (name === "mr-mime") {
    return "Mr. Mime";
  }
  if (name === "ho-oh") {
    return "Ho-Oh";
  }
  if (name === "jangmo-o") {
    return "Jangmo-o";
  }
  if (name === "hakamo-o") {
    return "Hakamo-o";
  }
  if (name === "kommo-o") {
    return "Kommo-o";
  }
  if (name === "tapu-koko") {
    return "Tapu Koko";
  }
  if (name === "tapu-lele") {
    return "Tapu Lele";
  }
  if (name === "tapu-bulu") {
    return "Tapu Bulu";
  }
  if (name === "tapu-fini") {
    return "Tapu Fini";
  }
  if (name === "mime-jr") {
    return "Mime Jr.";
  }
  if (name === "type-null") {
    return "Type: Null";
  }
  if (name === "nidoran-m") {
    return "Nidoran♂";
  }
  if (name === "nidoran-f") {
    return "Nidoran♀";
  }
  if (name === "ho-oh") {
    return "Ho-Oh";
  }
  if (name === "porygon2") {
    return "Porygon２"; // Full-width numeral 2
  }
  if (name === "porygon-z") {
    return "PorygonＺ"; // Full-width Z
  }
  if (name === "wo-chien") {
    return "Wo-Chien";
  }
  if (name === "chien-pao") {
    return "Chien-Pao";
  }
  if (name === "ting-lu") {
    return "Ting-Lu";
  }
  if (name === "chi-yu") {
    return "Chi-Yu";
  }
  if (name === "palafin-zero") {
    return "Palafin";
  }
  if (name === "well-baked-body") {
    return "Well-Baked Body";
  }

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
