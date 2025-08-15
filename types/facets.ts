// types/facets.ts
export type FacetType = "autocomplete" | "select" | "multi" | "toggle" | "text" | "range";

export type FacetOption = {
  id: string;
  label: string;
  meta?: Record<string, any>;
};

export type FacetDef =
  | {
      id: string;
      label: string;
      type: "autocomplete";
      placeholder?: string;
      // sync for now; can be made async later
      fetcher: (q: string) => FacetOption[];
    }
  | {
      id: string;
      label: string;
      type: "multi";
      options: FacetOption[];
    }
  | {
      id: string;
      label: string;
      type: "select";
      options: FacetOption[];
      placeholder?: string;
    }
  | {
      id: string;
      label: string;
      type: "toggle";
    }
  | {
      id: string;
      label: string;
      type: "text";
      placeholder?: string;
    };

export type CategoryFacetSchema = {
  // keys are Category or Subcategory labels as they appear in your mock DB
  [categoryOrSub: string]: FacetDef[];
};
