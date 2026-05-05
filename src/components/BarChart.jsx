import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/brand';

/**
 * Lightweight pure-RN bar chart for visualizing pain factors,
 * weekly recovery progress, etc. No external lib.
 *
 * Props:
 *   data:       [{ label, value, color }]   value 0..maxValue
 *   maxValue:   number (default = max of data)
 *   height:     chart area height (default 140)
 *   barWidth:   width of each bar (default 28)
 *   showValues: render number on top of each bar (default true)
 */
export default function BarChart({
  data = [],
  maxValue,
  height = 140,
  barWidth = 28,
  showValues = true,
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * height);
          return (
            <View key={i} style={styles.col}>
              {showValues && (
                <Text style={[styles.value, { color: d.color || Colors.purple }]}>
                  {d.value}
                </Text>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height: h,
                    width: barWidth,
                    backgroundColor: d.color || Colors.purple,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.label, { width: barWidth + 16 }]} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart:  { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8 },
  col:    { alignItems: 'center', justifyContent: 'flex-end' },
  bar:    { borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  value:  { fontSize: 11, fontWeight: '800', marginBottom: 6, letterSpacing: -0.2 },
  labels: { flexDirection: 'row', justifyContent: 'space-around', gap: 8, marginTop: 10 },
  label:  { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
});
