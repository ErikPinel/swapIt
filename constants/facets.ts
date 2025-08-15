// constants/facets.ts
import { FacetOption } from '@/types/facets';
import { pokemonSetNames } from '@/constants/pokemonSet_names';

/* --------------------------- helpers --------------------------- */
const slug = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

/* --------------------------- global (all categories) --------------------------- */
export const CONDITION: FacetOption[] = [
  { id: 'new', label: 'New' },
  { id: 'like_new', label: 'Like New' },
  { id: 'used', label: 'Used' },
  { id: 'for_parts', label: 'For Parts / Not Working' },
];

export const PRICE_RANGES: FacetOption[] = [
  { id: 'under_20', label: 'Under $20' },
  { id: '20_50', label: '$20 – $50' },
  { id: '50_100', label: '$50 – $100' },
  { id: '100_250', label: '$100 – $250' },
  { id: '250_500', label: '$250 – $500' },
  { id: '500_1000', label: '$500 – $1,000' },
  { id: 'over_1000', label: 'Over $1,000' },
];

export const DELIVERY: FacetOption[] = [
  { id: 'pickup', label: 'Pickup' },
  { id: 'meetup', label: 'Meet-up' },
  { id: 'shipping', label: 'Ships' },
];

export const COLORS: FacetOption[] = [
  'Black','White','Gray','Silver','Blue','Green','Red','Yellow','Purple','Pink','Orange','Brown','Beige','Gold','Rose Gold','Multicolor'
].map((c) => ({ id: slug(c), label: c }));

export const MATERIALS: FacetOption[] = [
  'Wood','Metal','Glass','Plastic','Fabric','Leather','Faux Leather','Wool','Cotton','Linen','Silk','Velvet'
].map((m) => ({ id: slug(m), label: m }));

/* --------------------------- electronics --------------------------- */
export const ELECTRONICS_TYPES: FacetOption[] = [
  'Phone','Laptop','Desktop','Tablet','Wearable','Camera','Lens','Audio (Headphones/Speakers)','Console','Controller','VR','Drone',
  'Component (CPU/GPU/RAM)','Storage (SSD/HDD)','Networking (Router/Switch)','Smart Home','Printer/Scanner','Monitor'
].map((t) => ({ id: slug(t), label: t }));

export const ELECTRONICS_BRANDS: FacetOption[] = [
  'Apple','Samsung','Google','Xiaomi','OnePlus','Sony','Bose','Sennheiser','Canon','Nikon','DJI','HP','Dell','Lenovo','ASUS','MSI','Acer','LG','Microsoft','Nintendo','PlayStation','Xbox','TP-Link','Netgear'
].map((b) => ({ id: slug(b), label: b }));

export const STORAGE_SIZES: FacetOption[] = [
  '16GB','32GB','64GB','128GB','256GB','512GB','1TB','2TB','4TB'
].map((s) => ({ id: slug(s), label: s }));

/* --------------------------- clothing & fashion --------------------------- */
export const CLOTHING_SIZES: FacetOption[] = [
  'XXS','XS','S','M','L','XL','XXL','3XL','4XL'
].map((s) => ({ id: slug(s), label: s }));

export const SHOE_SIZES: FacetOption[] = [
  'EU 36','EU 37','EU 38','EU 39','EU 40','EU 41','EU 42','EU 43','EU 44','EU 45','EU 46'
].map((s) => ({ id: slug(s), label: s }));

export const CLOTHING_TYPES: FacetOption[] = [
  'Tops','T-Shirts','Shirts','Sweaters','Hoodies','Jackets','Coats','Dresses','Skirts','Jeans','Pants','Shorts',
  'Activewear','Underwear','Socks','Hats','Bags','Watches','Jewelry'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- furniture & home --------------------------- */
export const FURNITURE_TYPES: FacetOption[] = [
  'Sofa','Armchair','Dining Chair','Dining Table','Coffee Table','Bed','Mattress','Wardrobe','Dresser','Desk','Office Chair',
  'Bookshelf','TV Stand','Outdoor Furniture','Lighting','Rug','Decor'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- books, media & hobbies --------------------------- */
export const BOOK_GENRES: FacetOption[] = [
  'Fiction','Non-Fiction','Fantasy','Sci-Fi','Mystery','Thriller','Romance','History','Self-Help','Comics/Manga','Kids'
].map((g) => ({ id: slug(g), label: g }));

export const MEDIA_TYPES: FacetOption[] = [
  'Board Game','Lego','Model Kit','DVD/Blu-ray','Vinyl','CD','Game (Physical)','Game (Digital)'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- sports & outdoors --------------------------- */
export const SPORTS_TYPES: FacetOption[] = [
  'Fitness','Cycling','Running','Football','Basketball','Tennis','Swimming','Camping','Hiking','Climbing','Skate/Skateboard'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- tools & diy --------------------------- */
export const TOOLS_TYPES: FacetOption[] = [
  'Hand Tools','Power Tools','Gardening','Measuring','Electrical','Plumbing','Painting'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- musical instruments --------------------------- */
export const INSTRUMENT_TYPES: FacetOption[] = [
  'Guitar','Bass','Keyboard/Piano','Drums','Audio Interface','Microphone','DJ/Controller','Wind/Brass','Strings (Violin/Cello)'
].map((t) => ({ id: slug(t), label: t }));

/* --------------------------- pets & baby --------------------------- */
export const PET_TYPES: FacetOption[] = [
  'Dog','Cat','Bird','Fish/Marine','Small Pet','Reptile'
].map((t) => ({ id: slug(t), label: t }));

export const BABY_KIDS_TYPES: FacetOption[] = [
  'Stroller','Car Seat','Crib','Toys','Clothing','Feeding'
].map((t) => ({ id: slug(t), label: t }));

/* =========================== Pokémon TCG (deep filters) =========================== */
/** Rarities (broad + SV/SWSH era specifics) */
export const POKEMON_RARITIES: FacetOption[] = [
  'Common','Uncommon','Rare','Holo Rare','Reverse Holo','Promo',
  'Amazing Rare','Radiant','Prism Star',
  'Ultra Rare','Rare Holo V','V','VSTAR','VMAX','EX','GX','V-UNION','Tag Team',
  'Illustration Rare','Special Illustration Rare',
  'Hyper Rare (Rainbow)','Gold Secret','Shiny Vault','Trainer Gallery'
].map((r) => ({ id: slug(r), label: r }));

/** Card “type” at category level + energy/element axes */
export const POKEMON_CARD_TYPES: FacetOption[] = [
  'Pokémon','Trainer','Energy',
  'Item','Supporter','Stadium',
  'Basic Energy','Special Energy'
].map((t) => ({ id: slug(t), label: t }));

/** Elemental types */
export const POKEMON_ELEMENTS: FacetOption[] = [
  'Grass','Fire','Water','Lightning','Psychic','Fighting','Darkness','Metal','Fairy','Dragon','Colorless'
].map((e) => ({ id: slug(e), label: e }));

/** Mechanics / flags (boolean-ish facets) */
export const POKEMON_MECHANICS: FacetOption[] = [
  'Basic','Stage 1','Stage 2',
  'ex (SV)','EX (older)','GX','V','VSTAR','VMAX','V-UNION','Tag Team',
  'Ancient','Future','Tera',
  'ACE SPEC','Radiant','Prism Star','Shiny','Trainer Gallery'
].map((m) => ({ id: slug(m), label: m }));

/** Languages commonly seen in TCG markets */
export const CARD_LANGUAGES: FacetOption[] = [
  'English','Japanese','Korean','Chinese','French','German','Spanish','Italian','Portuguese'
].map((l) => ({ id: slug(l), label: l }));

/** Graders */
export const GRADERS: FacetOption[] = [
  'Raw / Ungraded','PSA','BGS','CGC','SGC','ACE','Other'
].map((g) => ({ id: slug(g), label: g }));

/** Years (1998 → current) */
export const RELEASE_YEARS: FacetOption[] =
  Array.from({ length: new Date().getFullYear() - 1998 + 1 }, (_, i) => 1998 + i)
  .map((y) => ({ id: String(y), label: String(y) }));

/** Pokémon sets – generated from your list */
export const POKEMON_SETS: FacetOption[] = pokemonSetNames.map((name) => ({
  id: slug(name),
  label: name,
}));

/* --------------------------- category → facets map --------------------------- */
/**
 * Use this to drive the filter modal:
 * - Show GLOBAL sections always (condition/price/delivery)
 * - Append category-specific sections by the user’s selected top-level category
 */
export const CATEGORY_FACETS: Record<
  string,
  { title: string; options: FacetOption[] }[]
> = {
  // Global “All Items” listing
  all: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Delivery', options: DELIVERY },
    { title: 'Color', options: COLORS },
    { title: 'Material', options: MATERIALS },
  ],

  // Electronics
  electronics: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Type', options: ELECTRONICS_TYPES },
    { title: 'Brand', options: ELECTRONICS_BRANDS },
    { title: 'Storage', options: STORAGE_SIZES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Clothing & Fashion
  clothing: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Type', options: CLOTHING_TYPES },
    { title: 'Size', options: CLOTHING_SIZES },
    { title: 'Shoe Size', options: SHOE_SIZES },
    { title: 'Color', options: COLORS },
    { title: 'Material', options: MATERIALS },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Furniture & Home
  furniture: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Type', options: FURNITURE_TYPES },
    { title: 'Material', options: MATERIALS },
    { title: 'Color', options: COLORS },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Books, Media & Hobbies
  books_media: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Genre', options: BOOK_GENRES },
    { title: 'Media Type', options: MEDIA_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Sports & Outdoors
  sports_outdoors: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Sport', options: SPORTS_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Tools & DIY
  tools_diy: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Type', options: TOOLS_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Musical Instruments
  music: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Instrument', options: INSTRUMENT_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Baby & Kids
  baby_kids: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Type', options: BABY_KIDS_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Pets
  pets: [
    { title: 'Condition', options: CONDITION },
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Pet', options: PET_TYPES },
    { title: 'Delivery', options: DELIVERY },
  ],

  // Pokémon Cards (TCG) – deep filters
  pokemon_cards: [
    { title: 'Price', options: PRICE_RANGES },
    { title: 'Condition', options: CONDITION },
    { title: 'Language', options: CARD_LANGUAGES },
    { title: 'Rarity', options: POKEMON_RARITIES },
    { title: 'Card Type', options: POKEMON_CARD_TYPES },
    { title: 'Element', options: POKEMON_ELEMENTS },
    { title: 'Mechanics', options: POKEMON_MECHANICS },
    { title: 'Set', options: POKEMON_SETS },
    { title: 'Year', options: RELEASE_YEARS },
    { title: 'Grader', options: GRADERS },
  ],
};
