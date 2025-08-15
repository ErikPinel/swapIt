// types/facets.ts

/** High-level facet kinds your UI understands */
export type FacetType =
  | "autocomplete"
  | "select"
  | "multi"
  | "toggle"
  | "text"
  | "range";

/** Common option shape for select/multi/autocomplete choices */
export type FacetOption = {
  id: string;
  label: string;
  meta?: Record<string, any>;
};

/** Simple numeric range value */
export type Range = {
  min?: number;
  max?: number;
};

/** Optional dependency predicate for conditional visibility/enabled states */
export type VisibleIf =
  | { facetId: string; equals?: any; includes?: any } // simple cases
  | { and: VisibleIf[] }
  | { or: VisibleIf[] }
  | { not: VisibleIf };

/** Facet definition union */
export type FacetDef =
  | {
      id: string;
      label: string;
      type: "autocomplete";
      placeholder?: string;
      /** Sync for now; you can widen to Promise<FacetOption[]> later */
      fetcher: (q: string) => FacetOption[];
      /** Optional UI helpers (ignored if unused) */
      section?: string;
      help?: string;
      dependsOn?: string[]; // facet ids this facet conceptually depends on
      visibleIf?: VisibleIf; // conditional visibility
    }
  | {
      id: string;
      label: string;
      type: "multi";
      options: FacetOption[];
      section?: string;
      help?: string;
      dependsOn?: string[];
      visibleIf?: VisibleIf;
    }
  | {
      id: string;
      label: string;
      type: "select";
      options: FacetOption[];
      placeholder?: string;
      section?: string;
      help?: string;
      dependsOn?: string[];
      visibleIf?: VisibleIf;
    }
  | {
      id: string;
      label: string;
      type: "toggle";
      section?: string;
      help?: string;
      dependsOn?: string[];
      visibleIf?: VisibleIf;
    }
  | {
      id: string;
      label: string;
      type: "text";
      placeholder?: string;
      section?: string;
      help?: string;
      dependsOn?: string[];
      visibleIf?: VisibleIf;
    }
  | {
      id: string;
      label: string;
      type: "range";
      /** Optional numeric bounds for UI (e.g., sliders) */
      min?: number;
      max?: number;
      step?: number;
      unit?: string; // e.g., "$", "km", "HP"
      /** Suggested defaults (e.g., for initial state) */
      defaultValue?: Range;
      section?: string;
      help?: string;
      dependsOn?: string[];
      visibleIf?: VisibleIf;
    };

/**
 * Schema mapping: keys are Category or Subcategory labels (as shown in your DB)
 * Each entry is an ordered list of facet definitions for that category/subcategory.
 */
export type CategoryFacetSchema = {
  [categoryOrSub: string]: FacetDef[];
};
