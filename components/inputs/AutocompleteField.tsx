// components/inputs/AutocompleteField.tsx
import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { FacetOption } from "@/types/facets";

type Props = {
  value?: FacetOption | null;
  onChange: (next: FacetOption | null) => void;
  placeholder?: string;
  fetcher: (q: string) => FacetOption[];
};

export default function AutocompleteField({
  value,
  onChange,
  placeholder,
  fetcher,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorH, setAnchorH] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const opts = open && q.trim().length > 0 ? fetcher(q.trim()) : [];

  const clearSelection = () => {
    onChange(null);
    setQ("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const pick = (opt: FacetOption) => {
    onChange(opt);
    setQ(opt.label);
    setOpen(false);
  };

  return (
    <View style={{ position: "relative" }}>
      <View
        style={styles.fieldWrap}
        onLayout={(e) => setAnchorH(e.nativeEvent.layout.height)}
      >
        <TextInput
          ref={inputRef}
          value={q}
          onChangeText={(t) => {
            setQ(t);
            setOpen(true);
          }}
          placeholder={placeholder ?? "Search…"}
          placeholderTextColor="#9ca3af"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {(value || q.length > 0) && (
          <Pressable style={styles.clearPill} onPress={clearSelection}>
            <Text style={styles.clearTxt}>Clear</Text>
          </Pressable>
        )}
      </View>

      {open && opts.length > 0 && (
        <View style={[styles.dropdown, { top: anchorH + 6 }]}>
          {/* Replaced FlatList with ScrollView to avoid nested VirtualizedList */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {opts.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => pick(item)}
                style={styles.row}
              >
                <Text style={styles.rowTxt}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
  },
  input: { color: "#111", paddingVertical: 4 },
  clearPill: {
    position: "absolute",
    right: 6,
    top: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#EEF7F1",
  },
  clearTxt: { color: "#0f5132", fontWeight: "700" },
  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    maxHeight: 260,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f1f5f9",
  },
  rowTxt: { fontSize: 14, color: "#111", fontWeight: "700" },
});
