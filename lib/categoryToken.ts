import { CATEGORIES, CategoryName, SubcategoryName } from "@/dbMock/dbMock"; // ✅ fixed path

export type CategoryTokenId =
  | `cat:${CategoryName}`
  | `sub:${CategoryName}::${SubcategoryName}`;

export const makeCatId = (c: CategoryName) => `cat:${c}` as const;
export const makeSubId = (c: CategoryName, s: SubcategoryName) => `sub:${c}::${s}` as const;

export function resolveLabel(id: CategoryTokenId): { title: string; subtitle?: string } {
  if (id.startsWith("cat:")) return { title: id.slice(4) };
  const [, rest] = id.split(":");
  const [cat, sub] = rest.split("::");
  return { title: sub, subtitle: cat };
}

/** Simple text search that returns category/subcategory tokens (no free typing). */
export function getCategoryTokens(query: string) {
  const lower = query.trim().toLowerCase();
  const out: { id: CategoryTokenId; category: CategoryName; subcategory?: SubcategoryName; fullName: string }[] = [];
  if (!lower) return out;

  (Object.keys(CATEGORIES) as CategoryName[]).forEach((cat) => {
    // category match
    if (cat.toLowerCase().includes(lower)) {
      out.push({ id: makeCatId(cat), category: cat, fullName: cat });
    }
    // subcategory matches
    (CATEGORIES[cat] as readonly string[]).forEach((sub) => {
      if (sub.toLowerCase().includes(lower)) {
        out.push({
          id: makeSubId(cat, sub as SubcategoryName),
          category: cat,
          subcategory: sub as SubcategoryName,
          fullName: sub,
        });
      }
    });
  });

  // Put subs first, then categories; stable alpha inside groups
  return out.sort((a, b) => {
    const ak = a.subcategory ? 0 : 1;
    const bk = b.subcategory ? 0 : 1;
    if (ak !== bk) return ak - bk;
    return a.fullName.localeCompare(b.fullName);
  });
}
