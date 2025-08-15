// components/ui/CategoryFacetPanel.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CATEGORY_FACETS } from "@/lib/facets/registry";
import { FacetDef, FacetOption } from "@/types/facets";
import AutocompleteField from "@/components/inputs/AutocompleteField";
import MultiSelectChips from "@/components/inputs/MultiSelectChips";

type FacetValues = Record<string, any>;

type Props = {
  categoryOrSubLabel: string | null; // resolved visible key (e.g., "Pokémon Cards")
  value: FacetValues;
  onChange: (next: FacetValues) => void;
};

export default function CategoryFacetPanel({ categoryOrSubLabel, value, onChange }: Props) {
  if (!categoryOrSubLabel) return null;
  const schema = CATEGORY_FACETS[categoryOrSubLabel];
  if (!schema) return null;

  const setField = (id: string, v: any) => onChange({ ...value, [id]: v });

  return (
    <View style={{ marginTop: 14 }}>
      {schema.map((f) => (
        <View key={f.id} style={{ marginTop: 12 }}>
          <Text style={styles.label}>{f.label}</Text>

          {f.type === "autocomplete" && (
            <AutocompleteField
              value={value[f.id] || null}
              onChange={(opt: FacetOption | null) => setField(f.id, opt)}
              placeholder={f.placeholder}
              fetcher={f.fetcher}
            />
          )}

          {f.type === "text" && (
            <View style={styles.textFieldWrap}>
              <AutocompleteField
                // reuse the same input shell but with trivial fetcher that echoes entered text
                value={value[f.id] ? { id: value[f.id], label: value[f.id] } : null}
                onChange={(opt) => setField(f.id, opt ? opt.label : "")}
                placeholder={f.placeholder}
                fetcher={(q) => (q ? [{ id: q, label: q }] : [])}
              />
            </View>
          )}

          {f.type === "toggle" && (
            <View style={styles.toggleRow}>
              <View style={{ width: 1, height: 8 }} />
              <MultiSelectChips
                value={value[f.id] ? ["on"] : []}
                onChange={(ids) => setField(f.id, ids.includes("on"))}
                options={[{ id: "on", label: "Yes" }]}
              />
            </View>
          )}

          {f.type === "select" && (
            <MultiSelectChips
              value={value[f.id] ? [value[f.id]] : []}
              onChange={(ids) => setField(f.id, ids[0] ?? null)}
              options={f.options}
            />
          )}

          {f.type === "multi" && (
            <MultiSelectChips
              value={value[f.id] ?? []}
              onChange={(ids) => setField(f.id, ids)}
              options={f.options}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "700", color: "#111" },
  textFieldWrap: { marginTop: 8 },
  toggleRow: { marginTop: 8 },
});
