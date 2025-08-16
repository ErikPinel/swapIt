import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

type Pill = { id: string; label: string };
type Props = {
  pills: Pill[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
};

export default function ActiveFilterPills({ pills, onRemove, onClearAll }: Props) {
  if (!pills.length) return null;
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {pills.map(p => (
          <View key={p.id} style={styles.pill}>
            <Text style={styles.pillTxt}>{p.label}</Text>
            <Pressable onPress={() => onRemove(p.id)} hitSlop={8} style={styles.x}>
              <Text style={styles.xTxt}>×</Text>
            </Pressable>
          </View>
        ))}
        {!!onClearAll && (
          <Pressable onPress={onClearAll} style={[styles.pill, styles.clear]}>
            <Text style={[styles.pillTxt, { color: '#111' }]}>Clear all</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  clear: { backgroundColor: '#E5E7EB' },
  pillTxt: { color: '#fff', fontWeight: '700' },
  x: { marginLeft: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  xTxt: { color: '#111', fontSize: 12, fontWeight: '900', lineHeight: 14 },
});
