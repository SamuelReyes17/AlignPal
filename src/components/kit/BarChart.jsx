import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KitColors, KitAccents } from '../../constants/brand';

/**
 * Kit BarChart — minimal weekly bar chart.
 *
 * Props:
 *  - data:    [{ label: 'M', value: 42, dim?: false }, ...]
 *  - max:     optional max value; defaults to max(value) in data
 *  - color:   bar color (default KitAccents.violet)
 *  - height:  chart area height (default 110)
 */
export default function BarChart({ data = [], max, color = KitAccents.violet, height = 110 }) {
  const peak = max ?? Math.max(1, ...data.map((d) => d.value || 0));

  return (
    <View style={[styles.bars, { height }]}>
      {data.map((d, i) => {
        const pct = Math.max(0.04, (d.value || 0) / peak);
        return (
          <View key={`${d.label}-${i}`} style={styles.col}>
            <View style={styles.barWrap}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${pct * 100}%`,
                    backgroundColor: d.dim ? 'rgba(255,255,255,0.18)' : color,
                  },
                ]}
              />
            </View>
            <Text style={styles.day}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  col: { flex: 1, alignItems: 'center', gap: 8, height: '100%' },
  barWrap: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', minHeight: 6, borderRadius: 6 },
  day: { fontSize: 11, color: KitColors.text3, fontWeight: '500' },
});
