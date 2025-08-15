// lib/facets/registry.ts
import { CategoryFacetSchema } from "@/types/facets";
import { fetchPokemonCardNames, fetchPokemonSets, simpleAutocomplete } from "./providers";

// Example option banks (extend freely)
const RARITIES = [
  { id: "common", label: "Common" },
  { id: "uncommon", label: "Uncommon" },
  { id: "rare", label: "Rare" },
  { id: "holo", label: "Holo" },
  { id: "reverse_holo", label: "Reverse Holo" },
  { id: "ultra_rare", label: "Ultra Rare" },
  { id: "secret_rare", label: "Secret Rare" },
  { id: "rainbow_rare", label: "Rainbow Rare" },
  { id: "illustration_rare", label: "Illustration Rare" },
];

const GRADING_COMPANIES = [
  { id: "psa", label: "PSA" },
  { id: "bgs", label: "BGS" },
  { id: "cgc", label: "CGC" },
  { id: "ags", label: "AGS" },
];

const CONDITIONS_GENERIC = [
  { id: "new", label: "New" },
  { id: "like_new", label: "Like new" },
  { id: "used_good", label: "Used (Good)" },
  { id: "used_fair", label: "Used (Fair)" },
];

const BRANDS_ELECTRONICS = ["Apple", "Samsung", "Sony", "LG", "Lenovo", "HP", "ASUS", "Dell"];
const MODELS_SMARTPHONES = [
  "iPhone 13",
  "iPhone 14",
  "iPhone 15",
  "Galaxy S22",
  "Galaxy S23",
  "Pixel 7",
  "Pixel 8",
];

export const CATEGORY_FACETS: CategoryFacetSchema = {
  // Exact keys should match your mock DB category/subcategory names

  // ----- Pokémon Cards -----
  "Pokémon Cards": [
    { id: "card", label: "Card", type: "autocomplete", placeholder: "Search card name / # / set", fetcher: fetchPokemonCardNames },
    { id: "set", label: "Set", type: "autocomplete", placeholder: "Search set", fetcher: fetchPokemonSets },
    { id: "number", label: "Card number", type: "text", placeholder: "e.g., 020/189" },
    { id: "rarity", label: "Rarity", type: "multi", options: RARITIES },
    { id: "is_foil", label: "Holo / Foil", type: "toggle" },
    { id: "is_secret", label: "Secret Rare", type: "toggle" },
    { id: "graded", label: "Graded", type: "toggle" },
    { id: "grader", label: "Grader", type: "select", options: GRADING_COMPANIES },
    { id: "condition", label: "Condition", type: "select", options: CONDITIONS_GENERIC },
    { id: "lang", label: "Language", type: "select", options: [
      { id: "en", label: "English" }, { id: "jp", label: "Japanese" }, { id: "de", label: "German" }, { id: "fr", label: "French" }
    ]},
  ],

  // ----- Trading Cards (Non-Pokémon) -----
  "Trading Cards (Non-Pokémon)": [
    { id: "title", label: "Card", type: "autocomplete", placeholder: "Search title/athlete/#", fetcher: simpleAutocomplete([
      "Lebron James RC", "Cristiano Ronaldo", "One Piece OP01-001", "MTG Black Lotus", "Yugi Blue-Eyes White Dragon"
    ]) },
    { id: "set", label: "Set", type: "text", placeholder: "e.g., Topps Chrome 2023" },
    { id: "number", label: "Card number", type: "text", placeholder: "e.g., #45" },
    { id: "rarity", label: "Rarity", type: "multi", options: RARITIES },
    { id: "graded", label: "Graded", type: "toggle" },
    { id: "grader", label: "Grader", type: "select", options: GRADING_COMPANIES },
    { id: "condition", label: "Condition", type: "select", options: CONDITIONS_GENERIC },
  ],

  // ----- Electronics (category-level example) -----
  "Electronics": [
    { id: "brand", label: "Brand", type: "autocomplete", placeholder: "Search brands", fetcher: simpleAutocomplete(BRANDS_ELECTRONICS) },
    { id: "model", label: "Model", type: "autocomplete", placeholder: "Search model", fetcher: simpleAutocomplete(MODELS_SMARTPHONES) },
    { id: "condition", label: "Condition", type: "select", options: CONDITIONS_GENERIC },
    { id: "has_box", label: "Original box", type: "toggle" },
  ],

  // ----- Furniture (category-level example) -----
  "Furniture": [
    { id: "material", label: "Material", type: "multi", options: [
      { id: "wood", label: "Wood" }, { id: "metal", label: "Metal" }, { id: "glass", label: "Glass" }, { id: "fabric", label: "Fabric" }, { id: "leather", label: "Leather" }
    ]},
    { id: "style", label: "Style", type: "multi", options: [
      { id: "modern", label: "Modern" }, { id: "midcentury", label: "Mid-century" }, { id: "industrial", label: "Industrial" }, { id: "boho", label: "Boho" }, { id: "scandi", label: "Scandi" }
    ]},
    { id: "condition", label: "Condition", type: "select", options: CONDITIONS_GENERIC },
  ],
};
