// lib/subitemIndex.ts
export type SubItem = { id: string; label: string; subtitle?: string; searchText: string };

// Build from your constants (Pokemon + everything else)
import { pokemonSetNames } from "@/constants/pokemonSet_names";
import { ELECTRONICS_TYPES, CLOTHING_TYPES, FURNITURE_TYPES, BOOK_GENRES, TOOLS_TYPES, SPORTS_TYPES } from "@/constants/facets";

const slug = (s: string) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const norm = (s: string) => s.toLowerCase().normalize('NFKD');

export const allSubItems: SubItem[] = [
  // Pokémon cards as a *subcategory* (top-level entry to open card filters)
  { id: "pokemon:cards", label: "Pokémon Cards", subtitle: "TCG", searchText: "pokemon cards tcg trading card game" },

  // Pokémon sets (they’re also sub-items)
  ...pokemonSetNames.map((name) => ({
    id: `pokemon:set:${slug(name)}`,
    label: name,
    subtitle: "Pokémon Set",
    searchText: `pokemon ${name} set cards tcg`,
  })),

  // Electronics
  ...ELECTRONICS_TYPES.map(o => ({ id: `electronics:${o.id}`, label: o.label, subtitle: "Electronics", searchText: `electronics ${o.label}` })),

  // Clothing
  ...CLOTHING_TYPES.map(o => ({ id: `clothing:${o.id}`, label: o.label, subtitle: "Clothing", searchText: `clothing ${o.label}` })),

  // Furniture
  ...FURNITURE_TYPES.map(o => ({ id: `furniture:${o.id}`, label: o.label, subtitle: "Furniture", searchText: `furniture ${o.label}` })),

  // Books
  ...BOOK_GENRES.map(o => ({ id: `books:${o.id}`, label: o.label, subtitle: "Books & Media", searchText: `books ${o.label}` })),

  // Tools
  ...TOOLS_TYPES.map(o => ({ id: `tools:${o.id}`, label: o.label, subtitle: "Tools & DIY", searchText: `tools ${o.label}` })),

  // Sports
  ...SPORTS_TYPES.map(o => ({ id: `sports:${o.id}`, label: o.label, subtitle: "Sports & Outdoors", searchText: `sports ${o.label}` })),
];

export const scoreLabel = (hay: string, q: string) => {
  if (!q) return 0;
  const H = norm(hay);
  const nq = norm(q);
  if (H.startsWith(nq)) return 100;
  if (H.includes(nq)) return 60;
  const hits = nq.split(/\s+/).filter(Boolean).reduce((a, p) => a + (H.includes(p) ? 1 : 0), 0);
  return hits * 20;
};
