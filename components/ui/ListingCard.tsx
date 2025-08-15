import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle?: string;
  value?: string;
  distance?: string;
  status?: "AVAILABLE" | "PENDING";
};
export default function ListingCard({
  title, subtitle, value, distance, status = "AVAILABLE",
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb} />
      <View style={styles.cardText}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {!!value && <Text style={styles.value}>{value}</Text>}
        {!!distance && <Text style={styles.distance}>{distance}</Text>}
      </View>
      <View style={[styles.badge, status === "PENDING" && { backgroundColor: "#FDB022" }]}>
        <Ionicons name="checkmark-circle" size={14} color="#fff" />
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#EEE",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: "#EEE" },
  cardText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: "700", color: "#000" },
  subtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  value: { fontSize: 12, color: "#2ecc71", fontWeight: "700", marginTop: 6 },
  distance: { fontSize: 11, color: "#888", marginTop: 2 },
  badge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#2ecc71", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 14, marginLeft: 10,
  },
  badgeText: { color: "#fff", fontWeight: "700", marginLeft: 6, fontSize: 11 },
});
