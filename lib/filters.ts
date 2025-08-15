// filters/filterItems.ts
import type { Filters } from '@/types/filters'; // if you still export Filters from facets, keep that path
// The Listing type you posted:
type Listing = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category: string;            // e.g. 'cards_pokemon', 'furniture'
  condition?: 'new' | 'like_new' | 'used' | 'for_parts';
  verified?: boolean;
  price?: number;
  attrs?: Record<string, any>; // category-specific fields
};

/* -------------------- helpers -------------------- */
const inArray = (val: any, arr?: any[]) => !arr?.length || arr.includes(val);
const hasAny = (vals?: any[], want?: any[]) =>
  !want?.length || (Array.isArray(vals) && vals.some(v => want.includes(v)));

const inNumRange = (n: number | undefined, min?: number, max?: number) =>
  (min == null || (n ?? Number.NEGATIVE_INFINITY) >= min) &&
  (max == null || (n ?? Number.POSITIVE_INFINITY) <= max);

const truthyEquals = (flag: any, want?: boolean | null) =>
  want == null ? true : (!!flag === want);

/** pull facet state either from legacy f.categoryFilters or new f.facetsBySubItem[pickedSubItem] */
function getFacetState(f: any): { key: string | null; facets: Record<string, any> } {
  // New model
  if (f?.pickedSubItem) {
    const key = f.pickedSubItem as string;
    return { key, facets: (f.facetsBySubItem?.[key] ?? {}) as Record<string, any> };
  }
  // Legacy model
  if (f?.category && f?.categoryFilters) {
    return { key: f.category as string, facets: f.categoryFilters as Record<string, any> };
  }
  return { key: null, facets: {} };
}

/* -------------------- main filter -------------------- */
export function filterItems(items: Listing[], f: Filters | any): Listing[] {
  let out = items;

  // ---------- global filters ----------
  if (f?.condition && f.condition !== 'any') {
    out = out.filter((x) => (x.condition ?? 'any') === f.condition);
  }
  if (f?.onlyVerified) {
    out = out.filter((x) => !!x.verified);
  }
  if (f?.priceMin != null || f?.priceMax != null) {
    out = out.filter((x) => inNumRange(x.price, f.priceMin, f.priceMax));
  }

  // If legacy category was supplied, restrict to it
  if (f?.category) {
    out = out.filter((x) => x.category === f.category);
  }

  // If new model pickedSubItem is something like "pokemon:cards",
  // you *may* want to restrict listings that belong to that root category.
  if (f?.pickedSubItem) {
    const root = String(f.pickedSubItem).split(':')[0]; // 'pokemon' | 'electronics' | ...
    // Map this root to your listing.category prefixes (adjust as needed)
    const rootToListingCategory: Record<string, string> = {
      pokemon: 'cards_pokemon',
      electronics: 'electronics',
      clothing: 'clothing',
      furniture: 'furniture',
      books: 'books_media',
      tools: 'tools_diy',
      sports: 'sports_outdoors',
    };
    const wanted = rootToListingCategory[root];
    if (wanted) out = out.filter((x) => x.category === wanted);
  }

  // ---------- dynamic category/sub-item filters ----------
  const { key, facets } = getFacetState(f);
  if (key) {
    out = out.filter((x) => {
      const a = x.attrs ?? {};

      // --- Pokémon Cards (new or legacy keys) ---
      if (key === 'pokemon:cards' || key.startsWith('pokemon:set:') || x.category === 'cards_pokemon') {
        // arrays (chips)
        if (!inArray(a.cardType, facets.cardType)) return false;           // 'pokemon' | 'trainer' | 'energy'
        if (!inArray(a.rarity, facets.rarity)) return false;               // 'common' | 'ultra_rare' | ...
        if (!inArray(a.element, facets.element)) return false;             // 'water' | 'fire' | ...
        if (!inArray((a.language ?? '').toLowerCase(), facets.language)) return false; // 'english', 'japanese', ...
        if (!inArray((a.grader ?? 'raw').toLowerCase(), facets.grader)) return false;   // 'raw', 'psa', ...

        // multi-valued mechanics on a card (e.g., ['v', 'vstar', 'tera'])
        if (!hasAny(a.mechanics, facets.mechanics)) return false;

        // sets: either a.setSlug or a.setId; we try both
        if (!inArray(a.setSlug ?? a.setId, facets.sets)) return false;

        // ranges / numbers
        if (!inNumRange(Number(a.releaseYear), facets.releaseYear?.min, facets.releaseYear?.max)) return false;
        if (!inNumRange(Number(a.number), facets.number?.min, facets.number?.max)) return false;

        // flags
        if (!truthyEquals(a.holo, facets.holo)) return false;

        return true;
      }

      // --- Furniture ---
      if (key === 'furniture' || x.category === 'furniture') {
        if (!inArray(a.color, facets.color)) return false;
        if (!inArray(a.material, facets.material)) return false;

        const w = Number(a.widthCm), d = Number(a.depthCm), h = Number(a.heightCm);
        if (!inNumRange(w, facets.dimensionsCm?.width?.min,  facets.dimensionsCm?.width?.max)) return false;
        if (!inNumRange(d, facets.dimensionsCm?.depth?.min,  facets.dimensionsCm?.depth?.max)) return false;
        if (!inNumRange(h, facets.dimensionsCm?.height?.min, facets.dimensionsCm?.height?.max)) return false;

        return true;
      }

      // --- Clothing ---
      if (key === 'clothing' || x.category === 'clothing') {
        if (!inArray(a.size, facets.size)) return false;
        if (!inArray(a.color, facets.color)) return false;
        if (!inArray(a.material, facets.material)) return false;
        return true;
      }

      // --- Electronics ---
      if (key === 'electronics' || x.category === 'electronics') {
        if (!inArray(a.type, facets.type)) return false;           // phone/laptop/console...
        if (!inArray(a.brand, facets.brand)) return false;         // apple/samsung/sony...
        if (!inArray(a.storage, facets.storage)) return false;     // 128gb/1tb...
        if (!truthyEquals(a.boxed, facets.boxed)) return false;    // example flag
        return true;
      }

      // --- Books/Media ---
      if (key === 'books' || key === 'books_media' || x.category === 'books_media') {
        if (!inArray(a.genre, facets.genre)) return false;
        if (!inArray(a.format, facets['Media Type'] || facets.format)) return false;
        if (!inNumRange(Number(a.year), facets.year?.min, facets.year?.max)) return false;
        return true;
      }

      // --- Tools/DIY ---
      if (key === 'tools' || key === 'tools_diy' || x.category === 'tools_diy') {
        if (!inArray(a.type, facets.type)) return false;
        if (!truthyEquals(a.cordless, facets.cordless)) return false;
        return true;
      }

      // --- Sports/Outdoors ---
      if (key === 'sports' || key === 'sports_outdoors' || x.category === 'sports_outdoors') {
        if (!inArray(a.sport, facets.sport)) return false;
        return true;
      }

      // default: pass-through
      return true;
    });
  }

  // TODO: add relevance/distance sort here (Haversine using user location)

  return out;
}
