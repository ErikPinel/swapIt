// components/ui/TopHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TopHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View
        style={[
          styles.bar,
          {
            paddingTop: 15, // respect notch
          },
        ]}
      >
        {/* <View style={styles.row}>
          <Ionicons name="map-outline" size={18} color="#2ecc71" />
          <Text style={styles.brand}>  SwapIt</Text>
        </View> */}

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="person-circle-outline" size={30} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingTop: 30
  },
  bar: {
    marginHorizontal: 0,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 40,
    borderRadius: 16,
    // backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "#E6E6E6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 8 },
    }),
  },
  row: { flexDirection: "row", alignItems: "center" },
  brand: { color: "#2ecc71", fontWeight: "700", fontSize: 18 },
});
