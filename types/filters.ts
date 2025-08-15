// types/filters.ts
export type Filters = {
  // core
  query: string;                 // the free-text the user typed
  pickedSubItem?: string | null; // resolved subcategory key, e.g. "pokemon_cards" or "electronics:phone"

  // dynamic facets keyed by the picked sub-item
  facetsBySubItem?: Record<string, Record<string, any>>;

  // universal bits
  condition?: 'any' | 'new' | 'like_new' | 'used';
  priceMin?: number;
  priceMax?: number;
};
