import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import MultiSelectChips from '@/components/inputs/MultiSelectChips';
import type { FacetOption, Range } from '@/types/facets';

export function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.h}>{title}</Text>;
}

export function ChipFacet({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: FacetOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <View style={styles.block}>
      <SectionHeader title={title} />
      <MultiSelectChips options={options} value={value} onChange={onChange} />
    </View>
  );
}

export function BoolFacet({
  title,
  value,
  onChange,
}: {
  title: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{title}</Text>
      <Switch
        value={!!value}
        onValueChange={(v) => onChange(v ? true : null)}
      />
    </View>
  );
}

export function RangeFacet({
  title,
  value,
  onChange,
  placeholderMin = 'Min',
  placeholderMax = 'Max',
}: {
  title: string;
  value?: Range;
  onChange: (r: Range) => void;
  placeholderMin?: string;
  placeholderMax?: string;
}) {
  return (
    <View style={styles.block}>
      <SectionHeader title={title} />
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={placeholderMin}
          keyboardType="numeric"
          value={value?.min?.toString() ?? ''}
          onChangeText={(t) => onChange({ ...value, min: t ? Number(t) : undefined })}
        />
        <Text style={{ marginHorizontal: 8 }}>—</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholderMax}
          keyboardType="numeric"
          value={value?.max?.toString() ?? ''}
          onChangeText={(t) => onChange({ ...value, max: t ? Number(t) : undefined })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  block: { marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 15 },
  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
