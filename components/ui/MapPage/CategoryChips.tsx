// components/ui/MapPage/CategoryChips.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SortOpt = "distance" | "value_desc" | "value_asc";

type Props = {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
  top: number;

  radiusKm?: number;
  onChangeRadius?: (km: number) => void;
  onRadiusPreview?: (km: number | null) => void;
  verifiedOnly?: boolean;
  onToggleVerified?: (v: boolean) => void;
  sort?: SortOpt;
  onChangeSort?: (s: SortOpt) => void;
};

export default function CategoryChips({
  categories,
  active,
  onSelect,
  top,
  radiusKm,
  onChangeRadius,
  onRadiusPreview,
  verifiedOnly,
  onToggleVerified,
  sort,
  onChangeSort,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const [localRadius, setLocalRadius] = React.useState(radiusKm ?? 3);
  const [localVerified, setLocalVerified] = React.useState(verifiedOnly ?? false);
  const [localSort, setLocalSort] = React.useState<SortOpt>(sort ?? "distance");

  React.useEffect(() => { if (radiusKm != null) setLocalRadius(radiusKm); }, [radiusKm]);
  React.useEffect(() => { if (verifiedOnly != null) setLocalVerified(verifiedOnly); }, [verifiedOnly]);
  React.useEffect(() => { if (sort != null) setLocalSort(sort); }, [sort]);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !open;
    setOpen(next);
    onRadiusPreview?.(next ? localRadius : null);
  };

  const setRadius = (km: number) => {
    const clamped = Math.max(0.5, Math.min(20, Number(km.toFixed(2))));
    setLocalRadius(clamped);
    onChangeRadius?.(clamped);
    onRadiusPreview?.(clamped);
  };

  const decRadius = () => setRadius(localRadius - 0.5);
  const incRadius = () => setRadius(localRadius + 0.5);

  const applyDefaults = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRadius(3);
    setLocalVerified(false);
    onToggleVerified?.(false);
    setLocalSort("distance");
    onChangeSort?.("distance");
  };

  return (
    <View style={[styles.wrap, { top }]} pointerEvents="box-none">
      {/* Collapsed: small icon right */}
      {!open && (
        <View style={styles.fabRow}>
          <TouchableOpacity onPress={toggleOpen} style={styles.fab}>
            <Ionicons name="options-outline" size={18} color="#111" />
          </TouchableOpacity>
        </View>
      )}

      {/* Expanded */}
      {open && (
        <View style={styles.expanded}>
          {/* Chips bar */}
          <View style={styles.barWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.container}
              contentContainerStyle={[styles.content, { alignItems: "center" }]}
            >
              {categories.map((c) => {
                const isActive = c === active;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => onSelect(c)}
                    style={[styles.chipBase, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Extras panel — same width as the bar */}
          <View style={styles.extraBox}>
            {/* Close (top-right) */}
            <Pressable onPress={toggleOpen} style={styles.extraClose} hitSlop={10}>
              <Ionicons name="close" size={16} color="#111" />
            </Pressable>

            {/* Radius */}
            <Text style={styles.label}>Radius</Text>
            <View style={styles.radiusRow}>
              <Pressable onPress={decRadius} style={styles.stepBtn}>
                <Text style={styles.stepBtnTxt}>−</Text>
              </Pressable>
              <TextInput
                keyboardType="numeric"
                value={String(localRadius)}
                onChangeText={(t) => {
                  const n = Number((t || "0").replace(",", "."));
                  if (!isNaN(n)) setRadius(n);
                }}
                style={styles.radiusInput}
              />
              <Text style={styles.radiusUnit}>km</Text>
              <Pressable onPress={incRadius} style={styles.stepBtn}>
                <Text style={styles.stepBtnTxt}>+</Text>
              </Pressable>
            </View>

            {/* Verified */}
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Verified only</Text>
              <Pressable
                onPress={() => {
                  const v = !localVerified;
                  setLocalVerified(v);
                  onToggleVerified?.(v);
                }}
                style={[styles.switch, localVerified && styles.switchOn]}
              >
                <View style={[styles.knob, localVerified && styles.knobOn]} />
              </Pressable>
            </View>

            {/* Sort */}
            <Text style={[styles.label, { marginTop: 6 }]}>Sort by</Text>
            <View style={styles.segment}>
              {(["distance", "value_desc", "value_asc"] as const).map((opt) => {
                const active = localSort === opt;
                const label =
                  opt === "distance" ? "Distance" : opt === "value_desc" ? "Value (High)" : "Value (Low)";
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      setLocalSort(opt);
                      onChangeSort?.(opt);
                    }}
                    style={[styles.segBtn, active && styles.segBtnActive]}
                  >
                    <Text style={[styles.segTxt, active && styles.segTxtActive]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable onPress={applyDefaults} style={[styles.btn, styles.btnGhost]}>
                <Text style={[styles.btnTxt, { color: "#111" }]}>Reset</Text>
              </Pressable>
              <Pressable onPress={toggleOpen} style={[styles.btn, styles.btnPrimary]}>
                <Text style={[styles.btnTxt, { color: "#fff" }]}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const BAR_RADIUS = 18;

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 11,
    shadowColor: "#000",
    shadowOpacity: 0.30,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  /* Collapsed */
  fabRow: { flexDirection: "row", justifyContent: "flex-end" },
  fab: {
    height: 40, width: 40, borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#E6E6E6",
  },

  /* Expanded */
  expanded: {},
  barWrap: { position: "relative" },
  container: {
    backgroundColor: "#fff",
    borderRadius: BAR_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
  },
  content: { paddingHorizontal: 10, paddingVertical: 7, columnGap: 10 },
  chipBase: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  chipText: { color: "#000", fontWeight: "700", fontSize: 12.5 },
  chipActive: { backgroundColor: "#2ecc71" },
  chipTextActive: { color: "#fff" },

  /* Extras panel (same width as bar) */
  extraBox: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: BAR_RADIUS,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    width: "100%",          // match the bar width
    alignSelf: "stretch",
    position: "relative",
  },
  extraClose: {
    position: "absolute",
    right: 6,
    top: 6,
    height: 26,
    width: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  label: { fontSize: 12, fontWeight: "700", color: "#111" },

  radiusRow: {
    marginTop: 20,
    borderWidth: 1, borderColor: "#000", borderRadius: 12,
    padding: 6, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff",
  },
  stepBtn: {
    width: 28, height: 28, borderRadius: 7,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F2F4F7", borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb",
  },
  stepBtnTxt: { fontSize: 15, fontWeight: "800", color: "#111" },
  radiusInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: Platform.OS === "ios" ? 5 : 4,
    fontWeight: "700", color: "#111", backgroundColor: "#fafafa", fontSize: 12.5,
  },
  radiusUnit: { fontWeight: "700", color: "#111", fontSize: 12 },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 7 },

  // tiny switch (no deps)
  switch: {
    width: 38, height: 20, borderRadius: 10,
    padding: 2, backgroundColor: "#e5e7eb", justifyContent: "center",
  },
  switchOn: { backgroundColor: "#2ecc71" },
  knob: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff", alignSelf: "flex-start" },
  knobOn: { alignSelf: "flex-end" },

  segment: { flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" },
  segBtn: {
    paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", backgroundColor: "#fff",
  },
  segBtnActive: { backgroundColor: "#2ecc71" },
  segTxt: { fontWeight: "700", color: "#111", fontSize: 11.5 },
  segTxtActive: { color: "#fff" },

  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  btn: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: "center" },
  btnGhost: { borderWidth: 1, borderColor: "#e5e7eb", marginRight: 8, backgroundColor: "#fff" },
  btnPrimary: { backgroundColor: "#111" },
  btnTxt: { fontWeight: "700", fontSize: 11.5 },
});
