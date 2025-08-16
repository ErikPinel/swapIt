import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function FacetAccordion({ title, activeCount = 0, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const badge = useMemo(() => (activeCount > 0 ? String(activeCount) : null), [activeCount]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.header} onPress={toggle}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.right}>
          {badge && <Text style={styles.badge}>{badge}</Text>}
          <Text style={styles.chev}>{open ? '▾' : '▸'}</Text>
        </View>
      </Pressable>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eef2f7' },
  header: {
    paddingVertical: 10, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '700', color: '#111', fontSize: 15 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    minWidth: 20, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999,
    backgroundColor: '#111', color: '#fff', textAlign: 'center', fontWeight: '800', fontSize: 12,
  },
  chev: { color: '#6b7280', fontWeight: '800' },
  body: { paddingBottom: 10 },
});
