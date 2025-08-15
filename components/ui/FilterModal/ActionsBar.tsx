import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

export function ActionsBar({ onReset, onApply }:{ onReset:()=>void; onApply:()=>void }) {
  return (
    <View style={s.actions}>
      <Pressable style={[s.btn, s.ghost]} onPress={onReset}>
        <Text style={[s.btnTxt, { color: "#111" }]}>Reset</Text>
      </Pressable>
      <Pressable style={[s.btn, s.primary]} onPress={onApply}>
        <Text style={[s.btnTxt, { color: "#fff" }]}>Apply</Text>
      </Pressable>
    </View>
  );
}
const s=StyleSheet.create({
  actions:{flexDirection:"row",justifyContent:"space-between",marginTop:18},
  btn:{flex:1,paddingVertical:12,borderRadius:12,alignItems:"center"},
  ghost:{borderWidth:1,borderColor:"#e5e7eb",marginRight:10,backgroundColor:"#fff"},
  primary:{backgroundColor:"#111"},
  btnTxt:{fontWeight:"700"},
});
