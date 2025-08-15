// hooks/useCategoryOptions.ts
import { useMemo, useCallback } from "react";
import { CATEGORIES, CategoryName, SubcategoryName } from "@/dbMock/dbMock";
import { CategoryTokenId } from "@/lib/categoryToken";

export type OptionBase = {
  id: CategoryTokenId;
  kind: "category" | "subcategory";
  label: string;
  parent?: string;
};

const normalize = (s: string) => s.toLowerCase().normalize("NFKD");

// Slight category boost so whole categories don't get buried by subs
const score = (o: OptionBase, q: string) => {
  if (!q) return 0;
  const hay = normalize(`${o.label} ${o.parent ?? ""}`);
  const nq = normalize(q);
  const catBoost = o.kind === "category" ? 5 : 0;

  if (hay.startsWith(nq)) return 100 + catBoost;
  if (hay.includes(nq)) return 60 + catBoost;

  const hits = nq
    .split(/\s+/)
    .filter(Boolean)
    .reduce((a, p) => a + (hay.includes(p) ? 1 : 0), 0);

  return hits * 20 + catBoost;
};

/**
 * Usage:
 *   const { search } = useCategoryOptions();
 *   const options = search(query, excludeIds);
 */
export function useCategoryOptions() {
  // Precompute the flat options pool once
  const allOptions = useMemo<OptionBase[]>(() => {
    const cats: OptionBase[] = (Object.keys(CATEGORIES) as CategoryName[]).map(
      (cat) => ({
        id: `cat:${cat}` as CategoryTokenId,
        kind: "category",
        label: cat,
      })
    );

    const subs: OptionBase[] = (Object.keys(CATEGORIES) as CategoryName[]).flatMap(
      (cat) =>
        (CATEGORIES[cat] as readonly SubcategoryName[]).map((sub) => ({
          id: `sub:${cat}::${sub}` as CategoryTokenId,
          kind: "subcategory",
          label: sub as string, // keep it simple; label is a string
          parent: cat,
        }))
    );

    return [...cats, ...subs];
  }, []);

  const search = useCallback(
    (query: string, exclude: CategoryTokenId[] = []) => {
      // Filter out excluded ids
      const pool = allOptions.filter((o) => !exclude.includes(o.id));
      const withScore = pool.map((o) => ({
        ...o,
        _s: score(o, query),
      })) as (OptionBase & { _s: number })[];

      // Sort primarily by score; on ties, prefer categories, then label ASC
      let sorted = withScore
        .filter((o) => (query ? o._s >= 40 : true))
        .sort((a, b) => {
          if (b._s !== a._s) return b._s - a._s;
          if (a.kind !== b.kind) return a.kind === "category" ? -1 : 1;
          return a.label.localeCompare(b.label);
        });

      if (!query) {
        // With empty query, show categories first (up to 8), then subs to fill to 12
        const firstCats = sorted.filter((o) => o.kind === "category").slice(0, 8);
        const thenSubs = sorted
          .filter((o) => o.kind === "subcategory")
          .slice(0, Math.max(0, 12 - firstCats.length));
        return [...firstCats, ...thenSubs] as OptionBase[];
      }

      // With a query, ensure at least one category match appears if there is any
      let top = sorted.slice(0, 12);
      if (!top.some((o) => o.kind === "category")) {
        const bestCat = sorted.find((o) => o.kind === "category");
        if (bestCat) top = [bestCat, ...top.slice(0, 11)];
      }

      // Strip the internal score before returning
      return top.map(({ _s, ...rest }) => rest) as OptionBase[];
    },
    [allOptions]
  );

  return { search, all: allOptions };
}
