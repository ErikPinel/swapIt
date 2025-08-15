import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export function ToggleRow({
  label, value, onValueChange,
}: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange}
        trackColor={{ true: "#2ecc71", false: "#d1d5db" }} />
    </View>
  );
}
const s = StyleSheet.create({
  row:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10},
  label:{color:"#111",fontSize:14},
});
