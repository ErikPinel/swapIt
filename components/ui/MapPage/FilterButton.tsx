import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FilterButton({ onPress, style }: { onPress: () => void; style?: ViewStyle }) {
  return (
    <Pressable style={[styles.btn, styles.shadow, style]} onPress={onPress}>
      <Ionicons name="filter-outline" size={16} color="#000" />
      <Text style={styles.txt}>Filters</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row", gap: 6, alignItems: "center",
    backgroundColor: "#fff", borderColor: "#000", borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
  },
  txt: { color: "#000", fontWeight: "600" },
  shadow: {
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
});
