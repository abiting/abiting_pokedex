import pokemonNames from "../client/src/data/pokemon_zh_hant.json" with { type: "json" };

for (const slug of ["tepig", "pignite", "emboar", "oshawott", "emolga"]) {
  console.log(`${slug}: ${Object.keys(pokemonNames).indexOf(slug) + 1}`);
}
