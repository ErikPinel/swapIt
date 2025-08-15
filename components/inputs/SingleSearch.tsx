// components/inputs/SingleSearch.tsx
import React, { useMemo, useRef, useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { allSubItems, scoreLabel } from "@/lib/subitemIndex"; // see #3

type Props = {
  value: string;
  onChange: (text: string) => void;
  onPick: (subItemId: string) => void; // e.g. "pokemon:cards" or "electronics:phone"
  placeholder?: string;
};

export default function SingleSearch({ value, onChange, onPick, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const suggestions = useMemo(() => {
    const q = value.trim();
    if (!q) return allSubItems.slice(0, 12);
    const ranked = allSubItems
      .map(s => ({ ...s, _s: scoreLabel(s.searchText, q) }))
      .filter(s => s._s >= 40)
      .sort((a, b) => b._s - a._s);
    return ranked.slice(0, 12);
  }, [value]);

  const pick = (s: { id: string; label: string }) => {
    onPick(s.id);
    // keep the typed text; or clear: onChange(s.label)
    setOpen(false);
  };

  return (
    <View style={{ position: "relative" }}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={(t) => { onChange(t); setOpen(true); }}
        placeholder={placeholder ?? "What are you looking for?"}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {suggestions.map((s) => (
              <Pressable key={s.id} onPress={() => pick(s)} style={styles.row}>
                <Text style={styles.rowTitle}>{s.label}</Text>
                {!!s.subtitle && <Text style={styles.rowSubtitle}>{s.subtitle}</Text>}
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.close} onPress={() => setOpen(false)}>
            <Text style={{ fontWeight: "700" }}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb",
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fafafa", color: "#111",
  },
  dropdown: {
    position: "absolute", left: 0, right: 0, top: 48, maxHeight: 320,
    backgroundColor: "#fff", borderWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb", borderRadius: 12, overflow: "hidden",
    zIndex: 50, elevation: 8,
  },
  row: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#f1f5f9" },
  rowTitle: { fontWeight: "700", color: "#111" },
  rowSubtitle: { color: "#6b7280", fontSize: 12, marginTop: 2 },
  close: { alignItems: "center", paddingVertical: 8 },
});
