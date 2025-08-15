// components/inputs/CategoryChipInput.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useCategoryOptions } from "@/hooks/useCategoryOptions";
import { CategoryTokenId, resolveLabel } from "@/lib/categoryToken";

type OptionItem = {
  id: CategoryTokenId;
  kind: "category" | "subcategory";
  label: string;
  parent?: string;
};

type Props = {
  value: CategoryTokenId[];
  onChange: (ids: CategoryTokenId[]) => void;
  placeholder?: string;
};

export default function CategoryChipInput({
  value,
  onChange,
  placeholder,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorHeight, setAnchorHeight] = useState(0);

  // Remember the last picked parent so we can suggest related subs when query is empty
  const [lastParent, setLastParent] = useState<string | null>(null);

  const { search, all } = useCategoryOptions();

  const close = useCallback(() => {
    setOpen(false);
    Keyboard.dismiss();
  }, []);

  const options: OptionItem[] = useMemo(() => {
    if (!open) return [];
    const q = text.trim();

    if (q.length > 0) {
      // Normal search flow with exclude list
      return search(q, value) as OptionItem[];
    }

    // Empty query:
    // If we just picked something from a parent, show that parent's subs first
    if (lastParent) {
      const relSubs = all
        .filter(
          (o) =>
            o.kind === "subcategory" &&
            o.parent === lastParent &&
            !value.includes(o.id)
        )
        .slice(0, 12);
      if (relSubs.length > 0) return relSubs as OptionItem[];
    }

    // Fallback to default empty-query mix (cats then subs)
    return search("", value) as OptionItem[];
  }, [open, text, lastParent, value, search, all]);

  const add = (item: OptionItem) => {
    if (!value.includes(item.id)) {
      onChange([...value, item.id]);
    }
    // Keep the dropdown open and keep the same query so more options remain visible
    setOpen(true);

    // Bias future empty-query suggestions toward the picked item's parent/category
    if (item.kind === "subcategory" && item.parent) {
      setLastParent(item.parent);
    } else if (item.kind === "category") {
      setLastParent(item.label);
    }

    // Re-focus the input (so keyboard stays and user can continue typing)
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const remove = (id: CategoryTokenId) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <View style={{ position: "relative" }}>
      <View
        style={styles.inputWrap}
        onLayout={(e) => setAnchorHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.chipsRow}>
          {value.map((id) => {
            const { title, subtitle } = resolveLabel(id);
            return (
              <View key={id} style={styles.chip}>
                <View style={{ marginRight: 6 }}>
                  <Text style={styles.chipTxt}>{title}</Text>
                  {!!subtitle && <Text style={styles.chipSubTxt}>{subtitle}</Text>}
                </View>
                <Pressable onPress={() => remove(id)} hitSlop={8} style={styles.chipX}>
                  <Text style={styles.chipXTxt}>×</Text>
                </Pressable>
              </View>
            );
          })}

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            placeholder={placeholder ?? "Type a category or subcategory"}
            placeholderTextColor="#9ca3af"
            onChangeText={(t) => {
              setText(t);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Backdrop to close on outside tap */}
      {open && (
        <Pressable style={styles.backdrop} onPress={close} pointerEvents="auto" />
      )}

      {open && options.length > 0 && (
        <View
          style={[
            styles.suggestBox,
            styles.suggestOverlay,
            { top: anchorHeight + 6 },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* ScrollView to avoid nested VirtualizedList warnings */}
          <ScrollView keyboardShouldPersistTaps="handled">
            {options.map((item) => (
              <Pressable
                key={item.id}
                style={styles.suggestItem}
                onPress={() => add(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.suggestTitle}>{item.label}</Text>
                  {item.kind === "subcategory" ? (
                    <Text style={styles.suggestSubtitle}>{item.parent}</Text>
                  ) : (
                    <Text style={styles.suggestSubtitle}>Category</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.tag,
                    item.kind === "subcategory" ? styles.tagGreen : styles.tagGray,
                  ]}
                >
                  <Text style={styles.tagTxt}>
                    {item.kind === "subcategory" ? "Sub" : "Cat"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Explicit close button */}
          <Pressable
            onPress={close}
            style={styles.dismissArea}
            accessibilityRole="button"
            accessibilityLabel="Close suggestions"
          >
            <Text style={styles.dismissTxt}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipTxt: { color: "#111", fontWeight: "700" },
  chipSubTxt: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  chipX: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
    marginLeft: 6,
  },
  chipXTxt: { fontSize: 12, color: "#111", lineHeight: 14, fontWeight: "700" },

  input: {
    minWidth: 80,
    paddingVertical: Platform.OS === "ios" ? 6 : 4,
    paddingHorizontal: 6,
    color: "#111",
  },

  // Backdrop fills parent width; in a modal it will cover the screen area of this component tree
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Suggestion dropdown
  suggestBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    maxHeight: 320,
  },
  suggestOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 8,
  },
  suggestItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  suggestSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagGreen: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  tagGray: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  tagTxt: { fontSize: 11, fontWeight: "700", color: "#111" },

  dismissArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dismissTxt: {
    fontSize: 12,
    color: "#6b7280",
  },
});
