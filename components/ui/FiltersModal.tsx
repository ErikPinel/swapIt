// components/modals/FiltersModal.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import ActiveFilterPills from "@/components/ui/ActiveFilterPills";

export type Filters = {
  query: string;
  pickedSubItem?: string | null;
  facetsBySubItem?: Record<string, Record<string, any>>;
  condition: "any" | "new" | "like_new" | "used";
  onlyVerified: boolean;
  pickupRequired: boolean;
  sort: "distance" | "relevance";
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

  const pills = useMemo(() => {
    const out: { id: string; label: string }[] = [];
    if (local.condition !== "any") {
      out.push({ id: "global:condition", label: `Condition: ${local.condition.replace("_", " ")}` });
    }
    if (local.pickedSubItem) {
      const v = facetState ?? {};
      const arrayKeys = Object.keys(v).filter((k) => Array.isArray(v[k]));
      for (const k of arrayKeys) {
        (v[k] as string[]).forEach((val: string) => out.push({ id: `facet:${k}:${val}`, label: val }));
      }
      const boolKeys = Object.keys(v).filter((k) => typeof v[k] === "boolean");
      for (const k of boolKeys) if (v[k]) out.push({ id: `facet:${k}:true`, label: k });
      const rangeKeys = Object.keys(v).filter(
        (k) => v[k] && typeof v[k] === "object" && ("min" in v[k] || "max" in v[k])
      );
      for (const k of rangeKeys) {
        const r = v[k] as { min?: number; max?: number };
        const lbl = r.min != null && r.max != null ? `${k}: ${r.min}–${r.max}` : r.min != null ? `${k}: ≥ ${r.min}` : `≤ ${r.max}`;
        out.push({ id: `facet:${k}:range`, label: lbl });
      }
    }
    return out;
  }, [local.condition, local.pickedSubItem, facetState]);

  const removePill = (pillId: string) => {
    if (pillId === "global:condition") return set("condition", "any");
    if (!local.pickedSubItem) return;
    const [scope, key, rest] = pillId.split(":");
    if (scope !== "facet") return;
    const curr = { ...(facetState ?? {}) };
    if (Array.isArray(curr[key])) curr[key] = (curr[key] as string[]).filter((v) => v !== rest);
    else if (typeof curr[key] === "boolean") curr[key] = false;
    else if (rest === "range" && curr[key] && typeof curr[key] === "object") delete curr[key];
    setFacetState(curr);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Filters</Text>

            <ActiveFilterPills pills={pills} onRemove={removePill} onClearAll={reset} />

            <View style={styles.block}>
              <Text style={styles.label}>What are you looking for?</Text>
              <SingleSearch
                value={local.query}
                onChange={(t) => set("query", t)}
                onPick={(subId) => set("pickedSubItem", subId)}
                placeholder="Type to search sets, items, categories…"
              />
            </View>

            {local.pickedSubItem && (
              <View style={styles.block}>
                <Text style={styles.label}>
                  Refine: {local.pickedSubItem.split(":").slice(1).join(" · ")}
                </Text>
                <FacetView subItemId={local.pickedSubItem} value={facetState} onChange={setFacetState} />
              </View>
            )}

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

            <View style={{ height: 84 }} />
          </ScrollView>

          <View style={styles.stickyBar}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={reset}>
              <Text style={[styles.btnTxt, { color: "#111" }]}>Reset</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={apply}>
              <Text style={[styles.btnTxt, { color: "#fff" }]}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    height: "82.5%",
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  block: { marginTop: 14 },
  label: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 6 },
  segment: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  segBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  segBtnActive: { backgroundColor: "#2ecc71" },
  segTxt: { fontWeight: "700", color: "#111", fontSize: 13 },
  segTxtActive: { color: "#fff" },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 35,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    gap: 10,
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
    backgroundColor: "#fff",
  },
  btnPrimary: { backgroundColor: "#111" },
  btnTxt: { fontWeight: "700" },
});
