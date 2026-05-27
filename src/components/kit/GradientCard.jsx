import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { KitGradients, KitRadius } from '../../constants/brand';

/**
 * Kit GradientCard
 *
 * Hero card with a single linear gradient fill (155deg). Use ONE per screen.
 * Implemented with react-native-svg (no expo-linear-gradient dep).
 *
 * Props:
 *  - variant: 'violet' | 'coral' | 'teal' | 'avocado' | 'pink'  (default 'violet')
 *  - radius:  number (default KitRadius.xl = 32)
 *  - padding: number (default 24)
 *  - style:   View style for outer wrapper
 *  - children: card content
 */
export default function GradientCard({
  variant = 'violet',
  radius = KitRadius.xl,
  padding = 24,
  style,
  children,
}) {
  const [from, to] = KitGradients[variant] || KitGradients.violet;
  const gradId = `kg-${variant}`;

  return (
    <View style={[styles.wrap, { borderRadius: radius }, style]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} stopOpacity="1" />
            <Stop offset="1" stopColor={to} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={radius} ry={radius} fill={`url(#${gradId})`} />
      </Svg>
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', position: 'relative' },
});
