// components/inputs/MultiSelectChips.tsx
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { FacetOption } from "@/types/facets";

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;
  options: FacetOption[];
};

export default function MultiSelectChips({ value, onChange, options }: Props) {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = value.includes(o.id);
        return (
          <Pressable key={o.id} onPress={() => toggle(o.id)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.txt, active && styles.txtActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#2ecc71" },
  txt: { fontWeight: "700", color: "#111", fontSize: 13 },
  txtActive: { color: "#fff" },
});
