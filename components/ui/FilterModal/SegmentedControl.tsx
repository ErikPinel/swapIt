import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

type Opt<T extends string> = { value: T; label: string };
export function SegmentedControl<T extends string>({
  options, value, onChange,
}: { options: Opt<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={s.row}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[s.btn, active && s.btnActive]}>
            <Text style={[s.txt, active && s.txtActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const s = StyleSheet.create({
  row:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:10},
  btn:{paddingHorizontal:12,paddingVertical:8,borderRadius:12,borderWidth:StyleSheet.hairlineWidth,borderColor:"#e5e7eb",backgroundColor:"#fff"},
  btnActive:{backgroundColor:"#2ecc71"},
  txt:{fontWeight:"700",color:"#111",fontSize:13},
  txtActive:{color:"#fff"},
});
