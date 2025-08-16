import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import type { FacetOption } from '@/types/facets';

type Props = {
  options: FacetOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  pageSize?: number;
};

export default function SearchableMultiList({ options, value, onChange, placeholder = 'Search…', pageSize = 12 }: Props) {
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(pageSize);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    if (!nq) return options;
    return options.filter((o) => o.label.toLowerCase().includes(nq));
  }, [options, q]);

  const page = filtered.slice(0, limit);
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  const allShownIds = page.map((o) => o.id);
  const shownAllSelected = allShownIds.length > 0 && allShownIds.every((id) => value.includes(id));

  return (
    <View>
      <View style={styles.toolbar}>
        <TextInput
          placeholder={placeholder}
          value={q}
          onChangeText={setQ}
          style={styles.search}
          placeholderTextColor="#9ca3af"
        />
        <Pressable
          onPress={() => onChange(shownAllSelected ? value.filter((id) => !allShownIds.includes(id)) : Array.from(new Set([...value, ...allShownIds])))}
          style={styles.bulkBtn}
        >
          <Text style={styles.bulkTxt}>{shownAllSelected ? 'Clear shown' : 'Select shown'}</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {page.map((o) => {
          const active = value.includes(o.id);
          return (
            <Pressable key={o.id} onPress={() => toggle(o.id)} style={[styles.row, active && styles.rowActive]}>
              <Text style={[styles.txt, active && styles.txtActive]}>{o.label}</Text>
              <Text style={[styles.check, active && styles.checkActive]}>{active ? '✓' : ' '}</Text>
            </Pressable>
          );
        })}
      </View>

      {limit < filtered.length && (
        <Pressable onPress={() => setLimit((n) => n + pageSize)} style={styles.moreBtn}>
          <Text style={styles.moreTxt}>Show more</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  search: {
    flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fafafa', color: '#111',
  },
  bulkBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#111' },
  bulkTxt: { color: '#fff', fontWeight: '700' },

  list: {
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f1f5f9',
  },
  rowActive: { backgroundColor: '#ECFDF5' },
  txt: { fontWeight: '700', color: '#111' },
  txtActive: { color: '#065F46' },
  check: { width: 20, textAlign: 'center', color: '#9ca3af' },
  checkActive: { color: '#065F46', fontWeight: '900' },
  moreBtn: { alignSelf: 'center', marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  moreTxt: { fontWeight: '700', color: '#111' },
});
