import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/brand';

/**
 * Circular progress ring with center value + label.
 * Template-style hero stat (like "890" or "50%" donuts).
 */
export default function CircularProgress({
  size = 180,
  strokeWidth = 14,
  progress = 0.65,            // 0..1
  trackColor = Colors.purpleDim,
  gradient = ['#9B8BF4', '#7C5CF0'],
  centerValue,
  centerLabel,
  centerSub,
  centerValueColor = Colors.textPrimary,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gradient[0]} />
            <Stop offset="1" stopColor={gradient[1]} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={cx} cy={cy} r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <Circle
          cx={cx} cy={cy} r={radius}
          stroke="url(#ring)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      <View style={styles.center} pointerEvents="none">
        {centerLabel ? (
          <Text style={styles.label}>{centerLabel}</Text>
        ) : null}
        {centerValue !== undefined ? (
          <Text style={[styles.value, { color: centerValueColor }]}>{centerValue}</Text>
        ) : null}
        {centerSub ? (
          <Text style={styles.sub}>{centerSub}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:   { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label:  { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },
  value:  { fontSize: 44, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1.2, lineHeight: 48 },
  sub:    { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginTop: 4 },
});
