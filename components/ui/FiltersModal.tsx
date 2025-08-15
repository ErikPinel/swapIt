// components/modals/FiltersModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";

import SingleSearch from "@/components/inputs/SingleSearch";
import FacetView from "@/components/facets/FacetView";

/** Filters (new model) */
export type Filters = {
  // core
  query: string;                       // what the user typed
  pickedSubItem?: string | null;       // e.g. "pokemon:cards", "electronics:phone"
  facetsBySubItem?: Record<string, Record<string, any>>;

  // universal
  condition: "any" | "new" | "like_new" | "used";
  onlyVerified: boolean;
  pickupRequired: boolean;
  sort: "distance" | "relevance";

  // optional extras you already had; keep them to not break callers
  radiusKm: number;
  willingTopUp: number;
};

const DEFAULT_FILTERS: Filters = {
  query: "",
  pickedSubItem: null,
  facetsBySubItem: {},
  condition: "any",
  onlyVerified: false,
  pickupRequired: false,
  sort: "distance",
  radiusKm: 3,
  willingTopUp: 0,
};

type Props = {
  visible: boolean;
  filters?: Filters;
  onChange?: (f: Filters) => void;
  onApply?: () => void;
  onClose: () => void;
};

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

  const facetState =
    local.pickedSubItem && local.facetsBySubItem
      ? local.facetsBySubItem[local.pickedSubItem] ?? {}
      : {};

  const setFacetState = (next: Record<string, any>) => {
    if (!local.pickedSubItem) return;
    set("facetsBySubItem", {
      ...(local.facetsBySubItem ?? {}),
      [local.pickedSubItem]: next,
    });
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

            {/* One search: “What are you looking for?” */}
            <View style={styles.block}>
              <Text style={styles.label}>What are you looking for?</Text>
              <SingleSearch
                value={local.query}
                onChange={(t) => set("query", t)}
                onPick={(subId) => set("pickedSubItem", subId)}
                placeholder="Type to search sets, items, categories…"
              />
            </View>

            {/* Dynamic, per-sub-item facets */}
            {local.pickedSubItem && (
              <View style={styles.block}>
                <Text style={styles.label}>
                  Refine: {local.pickedSubItem.split(":").slice(1).join(" · ")}
                </Text>
                <FacetView
                  subItemId={local.pickedSubItem}
                  value={facetState}
                  onChange={setFacetState}
                />
              </View>
            )}

            {/* Global: Condition segment */}
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
                      <Text
                        style={[styles.segTxt, active && styles.segTxtActive]}
                      >
                        {opt === "like_new"
                          ? "Like new"
                          : opt[0].toUpperCase() + opt.slice(1)}
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

/* styles */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
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
  label: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 6 },

  segment: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
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

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: { backgroundColor: "#111" },
  btnTxt: { fontWeight: "700" },
});
