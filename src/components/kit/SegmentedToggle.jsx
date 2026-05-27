import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KitColors } from '../../constants/brand';

/**
 * Kit SegmentedToggle — pill-style segmented control.
 *
 * Props:
 *  - options:  ['Front','Back']  OR  [{ label, value }]
 *  - value:    current value
 *  - onChange: (value) => void
 */
export default function SegmentedToggle({ options = [], value, onChange }) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  );

  return (
    <View style={styles.wrap}>
      {normalized.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange?.(opt.value)}
            style={[styles.seg, active && styles.segOn]}
          >
            <Text style={[styles.text, active && styles.textOn]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: KitColors.surface2,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    alignSelf: 'center',
  },
  seg: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 9 },
  segOn: { backgroundColor: 'rgba(255,255,255,0.06)' },
  text: { fontSize: 13, fontWeight: '600', color: KitColors.text3 },
  textOn: { color: KitColors.text1 },
});
