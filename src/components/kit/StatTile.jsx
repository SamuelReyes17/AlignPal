import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KitColors, KitAccents, KitRadius } from '../../constants/brand';

/**
 * Kit StatTile — solid-color or muted stat card. Two per row max.
 *
 * Color roles:
 *   'avocado' → completion / streak / reward
 *   'teal'    → improvements
 *   'violet'  → identity
 *   'pink'    → soft callout
 *   'coral'   → ALERTS only
 *   undefined → calm muted surface (use for pain/effort numbers — number tells the story)
 */
export default function StatTile({ label, value, delta, variant, deltaColor }) {
  const isMuted = !variant;
  const bg = isMuted ? KitColors.surface1 : KitAccents[variant];
  const isLightAccent = variant === 'avocado';
  const fg = isMuted ? KitColors.text1 : isLightAccent ? '#1A2410' : '#FFFFFF';
  const labelColor = isMuted
    ? KitColors.text3
    : (isLightAccent ? 'rgba(26,36,16,0.7)' : 'rgba(255,255,255,0.85)');
  const deltaC = deltaColor ?? (isMuted
    ? KitAccents.teal
    : (isLightAccent ? 'rgba(26,36,16,0.7)' : 'rgba(255,255,255,0.85)'));

  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: bg, borderColor: isMuted ? KitColors.hairline : 'transparent' },
      ]}
    >
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: fg }]}>{value}</Text>
      {!!delta && <Text style={[styles.delta, { color: deltaC }]}>{delta}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: KitRadius.md, padding: 16, borderWidth: 1 },
  label: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  value: {
    fontSize: 26, fontWeight: '800',
    letterSpacing: -0.6, marginTop: 6, lineHeight: 28,
  },
  delta: { fontSize: 11, marginTop: 4, fontWeight: '500' },
});
