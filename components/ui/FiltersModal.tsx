import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import {
  CategoryName,
  SubcategoryName,
} from "@/dbMock/dbMock"; // adjust if needed

import CategoryChipInput from "@/components/inputs/CategoryChipInput";
import CategoryFacetPanel from "@/components/ui/CategoryFacetPanel"; // ⬅️ new: renders niche facets

/** --- Token ID types --- */
type CategoryTokenId =
  | `cat:${CategoryName}`
  | `sub:${CategoryName}::${SubcategoryName}`;

/** Filters */
export type Filters = {
  radiusKm: number;
  willingTopUp: number;
  condition: "any" | "new" | "like_new" | "used";
  pickupRequired: boolean;
  onlyVerified: boolean;
  sort: "distance" | "relevance";
  queryItems: CategoryTokenId[];
  queryWanted: CategoryTokenId[];

  /** NEW: category/subcategory-specific facet state keyed by visible label */
  facetByKey?: Record<string, Record<string, any>>;
};

const DEFAULT_FILTERS: Filters = {
  radiusKm: 3,
  willingTopUp: 0,
  condition: "any",
  pickupRequired: false,
  onlyVerified: false,
  sort: "distance",
  queryItems: [],
  queryWanted: [],
  facetByKey: {},
};

type Props = {
  visible: boolean;
  filters?: Filters;
  onChange?: (f: Filters) => void;
  onApply?: () => void;
  onClose: () => void;
};

/** Map a token to the display key used by the facet registry */
function tokenToLabel(t: CategoryTokenId): string {
  if (t.startsWith("cat:")) return t.slice(4);              // "Electronics"
  const [, rest] = t.split(":");                              // "sub:<cat>::<sub>"
  const [cat, sub] = rest.split("::");
  return sub || cat;                                          // prefer sub if present
}

export default function FiltersModal({
  visible,
  filters,
  onChange,
  onApply,
  onClose,
}: Props) {
  const [local, setLocal] = useState<Filters>(filters ?? DEFAULT_FILTERS);
  useEffect(() => setLocal(filters ?? DEFAULT_FILTERS), [filters]);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setLocal((prev) => ({ ...prev, [k]: v }));

  const reset = () => setLocal(DEFAULT_FILTERS);
  const apply = () => {
    onChange?.(local);
    onApply?.();
    onClose();
  };

  // Choose which listing type to show facets for (rule: first selected in queryItems)
  const activeFacetKey = local.queryItems[0] ? tokenToLabel(local.queryItems[0]) : null;
  const facetState = activeFacetKey ? (local.facetByKey?.[activeFacetKey] ?? {}) : {};

  const setFacetState = (next: Record<string, any>) => {
    if (!activeFacetKey) return;
    set("facetByKey", { ...(local.facetByKey ?? {}), [activeFacetKey]: next });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Filters</Text>

            {/* Search items (by categories/subcategories) */}
            <View style={styles.block}>
              <Text style={styles.label}>Search items (listing name)</Text>
              <CategoryChipInput
                value={local.queryItems}
                onChange={(ids) => set("queryItems", ids)}
                placeholder="Search categories or subcategories"
              />
            </View>

            {/* Category/subcategory-specific facets */}
            {activeFacetKey && (
              <View style={styles.block}>
                <Text style={styles.label}>Refine: {activeFacetKey}</Text>
                <CategoryFacetPanel
                  categoryOrSubLabel={activeFacetKey}
                  value={facetState}
                  onChange={setFacetState}
                />
              </View>
            )}

            {/* Search what people are looking for */}
            <View style={styles.block}>
              <Text style={styles.label}>Search what people are looking for</Text>
              <CategoryChipInput
                value={local.queryWanted}
                onChange={(ids) => set("queryWanted", ids)}
                placeholder="Search categories or subcategories"
              />
            </View>

            {/* Condition */}
            <View style={styles.block}>
              <Text style={styles.label}>Condition</Text>
              <View style={styles.segment}>
                {(["any", "new", "like_new", "used"] as const).map((opt) => {
                  const active = local.condition === opt;
                  return (
                    <Pressable
                      key={opt}
                      onPress={() => set("condition", opt)}
                      style={[styles.segBtn, active && styles.segBtnActive]}
                    >
                      <Text style={[styles.segTxt, active && styles.segTxtActive]}>
                        {opt === "like_new" ? "Like new" : opt[0].toUpperCase() + opt.slice(1)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={reset}>
                <Text style={[styles.btnTxt, { color: "#111" }]}>Reset</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={apply}>
                <Text style={[styles.btnTxt, { color: "#fff" }]}>Apply</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* styles unchanged from your file (sheet is fixed ~80% height) */
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    height: "82.5%",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  block: { marginTop: 14 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  rowSpace: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "700", color: "#111" },
  valueText: { fontSize: 13, color: "#475467" },

  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    color: "#111",
    backgroundColor: "#fafafa",
  },

  segment: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  segBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  segBtnActive: { backgroundColor: "#2ecc71" },
  segTxt: { fontWeight: "700", color: "#111", fontSize: 13 },
  segTxtActive: { color: "#fff" },

  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  switchLabel: { color: "#111", fontSize: 14 },

  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnGhost: { borderWidth: 1, borderColor: "#e5e7eb", marginRight: 10, backgroundColor: "#fff" },
  btnPrimary: { backgroundColor: "#111" },
  btnTxt: { fontWeight: "700" },

  // slider (kept from your file)
  sliderTrackContainer: { marginTop: 8 },
  sliderTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#eef2f7",
    overflow: "hidden",
  },
  sliderFill: { height: "100%", backgroundColor: "#2ecc71" },
  sliderThumb: {
    position: "absolute",
    top: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#2ecc71",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  stepBtn: {
    width: 40, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: "#F2F4F7", borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb",
  },
  stepBtnTxt: { fontSize: 18, fontWeight: "800", color: "#111" },
  stepValue: { fontSize: 14, fontWeight: "700", color: "#111" },
});
