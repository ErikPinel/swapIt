// components/inputs/SetCheckboxList.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import type { FacetOption } from "@/types/facets";
import { pokemonSetNames } from "@/constants/pokemonSet_names";

const newestFirst = (a: FacetOption, b: FacetOption) =>
  pokemonSetNames.indexOf(a.label) < pokemonSetNames.indexOf(b.label) ? -1 : 1;
// Assumes your list is already newest → oldest. If it’s oldest → newest, reverse.

export default function SetCheckboxList({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FacetOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const base = [...options].sort(newestFirst);
    if (!q.trim()) return base;
    const nq = q.toLowerCase();
    return base.filter((o) => o.label.toLowerCase().includes(nq));
  }, [options, q]);

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  const allIds = list.map((o) => o.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => value.includes(id));

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.h}>{title}</Text>

      <View style={styles.toolbar}>
        <TextInput
          placeholder="Search sets…"
          style={styles.search}
          value={q}
          onChangeText={setQ}
        />
        <Pressable
          onPress={() => onChange(allSelected ? value.filter((id) => !allIds.includes(id)) : Array.from(new Set([...value, ...allIds])))}
          style={styles.bulkBtn}
        >
          <Text style={styles.bulkTxt}>{allSelected ? "Clear shown" : "Select shown"}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.box} keyboardShouldPersistTaps="handled">
        {list.map((o) => {
          const active = value.includes(o.id);
          return (
            <Pressable key={o.id} onPress={() => toggle(o.id)} style={[styles.row, active && styles.rowActive]}>
              <Text style={[styles.txt, active && styles.txtActive]}>{o.label}</Text>
              <Text style={[styles.check, active && styles.checkActive]}>{active ? "✓" : " "}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  toolbar: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 8 },
  search: {
    flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, backgroundColor: "#fafafa", color: "#111",
  },
  bulkBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: "#111" },
  bulkTxt: { color: "#fff", fontWeight: "700" },
  box: {
    maxHeight: 260,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", borderRadius: 12, backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#f1f5f9",
  },
  rowActive: { backgroundColor: "#ECFDF5" },
  txt: { fontWeight: "700", color: "#111" },
  txtActive: { color: "#065F46" },
  check: { width: 20, textAlign: "center", color: "#9ca3af" },
  checkActive: { color: "#065F46", fontWeight: "900" },
});
