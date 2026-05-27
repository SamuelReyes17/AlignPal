import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/**
 * Kit CircularProgress — single-ring hero indicator.
 *
 * Props:
 *  - value:        0..1 fraction filled
 *  - size:         outer diameter (default 132)
 *  - stroke:       ring thickness (default 10)
 *  - color:        fill stroke color (default '#FFFFFF' — looks right on gradient hero)
 *  - trackColor:   track stroke color
 *  - centerTop:    big number (e.g. '70%')
 *  - centerBottom: small caption (e.g. 'on track')
 *  - centerColor:  override text color (e.g. for use on avocado/teal hero)
 */
export default function CircularProgress({
  value = 0,
  size = 132,
  stroke = 10,
  color = '#FFFFFF',
  trackColor = 'rgba(255,255,255,0.18)',
  centerTop,
  centerBottom,
  centerColor = '#FFFFFF',
}) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, value)) * circ;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </Svg>

      {(centerTop || centerBottom) && (
        <View style={styles.center}>
          {!!centerTop && (
            <Text style={[styles.top, { color: centerColor, fontSize: size * 0.24 }]}>
              {centerTop}
            </Text>
          )}
          {!!centerBottom && (
            <Text style={[styles.bottom, { color: centerColor }]}>{centerBottom}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: { fontWeight: '800', letterSpacing: -0.8 },
  bottom: {
    fontSize: 11, opacity: 0.8, marginTop: 4,
    letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '600',
  },
});
