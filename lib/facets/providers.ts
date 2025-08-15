// lib/facets/providers.ts

// ---- Pokémon card autocomplete (mock) ----
const POKEMON_CARD_INDEX: { name: string; set: string; number: string; rarity: string }[] = [
  { name: "Charizard VMAX", set: "Sword & Shield—Darkness Ablaze", number: "020/189", rarity: "Secret Rare" },
  { name: "Charizard V", set: "Champion’s Path", number: "079/073", rarity: "Rainbow Rare" },
  { name: "Pikachu V", set: "Sword & Shield—Vivid Voltage", number: "043/185", rarity: "Ultra Rare" },
  { name: "Mew V", set: "Fusion Strike", number: "113/264", rarity: "Ultra Rare" },
  { name: "Gardevoir ex", set: "Scarlet & Violet—Base", number: "245/198", rarity: "Special Illustration Rare" },
];

const POKEMON_SETS = [
  "Sword & Shield—Base",
  "Sword & Shield—Rebel Clash",
  "Sword & Shield—Darkness Ablaze",
  "Sword & Shield—Vivid Voltage",
  "Champion’s Path",
  "Shining Fates",
  "Evolving Skies",
  "Brilliant Stars",
  "Scarlet & Violet—Base",
  "Scarlet & Violet—Paldea Evolved",
];

export const fetchPokemonCardNames = (q: string) => {
  const nq = q.trim().toLowerCase();
  if (!nq) return [];
  return POKEMON_CARD_INDEX
    .filter(
      (c) =>
        c.name.toLowerCase().includes(nq) ||
        c.set.toLowerCase().includes(nq) ||
        c.number.toLowerCase().includes(nq)
    )
    .slice(0, 12)
    .map((c) => ({
      id: `${c.name} | ${c.set} #${c.number}`,
      label: `${c.name} (${c.set} • ${c.number} • ${c.rarity})`,
      meta: { set: c.set, number: c.number, rarity: c.rarity, name: c.name },
    }));
};

export const fetchPokemonSets = (q: string) => {
  const nq = q.trim().toLowerCase();
  return POKEMON_SETS
    .filter((s) => s.toLowerCase().includes(nq))
    .slice(0, 12)
    .map((s) => ({ id: s, label: s }));
};

// ---- Generic helpers you can reuse for other categories ----
export const simpleAutocomplete = (all: string[]) => (q: string) => {
  const nq = q.trim().toLowerCase();
  if (!nq) return [];
  return all.filter((s) => s.toLowerCase().includes(nq)).slice(0, 12).map((s) => ({ id: s, label: s }));
};
