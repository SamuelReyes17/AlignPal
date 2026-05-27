import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';
import { Radius } from '../constants/brand';

/**
 * Card with a gradient background fill, optional decorative blobs.
 * Uses SVG (no extra deps). Template-style hero panel.
 *
 * Props:
 *   colors   – array of 2-3 hex strings (gradient stops)
 *   radius   – corner radius (default Radius.hero)
 *   corners  – 'all' (default) | 'bottom' — when 'bottom', top corners are flat
 *              (used for full-bleed app headers that touch the top edge)
 *   blobs    – array of {x, y, r, color, opacity} for decorative circles
 *   style    – outer style
 *   children – content rendered above the gradient
 */
export default function GradientCard({
  colors = ['#9B8BF4', '#7C5CF0'],
  radius = Radius.hero,
  corners = 'all',
  blobs = [],
  style,
  children,
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  // Per-corner radii. 'bottom' = flat top, rounded bottom (full-bleed header style).
  const tl = corners === 'bottom' ? 0 : radius;
  const tr = corners === 'bottom' ? 0 : radius;
  const bl = radius;
  const br = radius;

  // Build a rounded-rect path with custom per-corner radii so SVG matches View clipping.
  const roundedRectPath = (w, h) => {
    if (w <= 0 || h <= 0) return '';
    return [
      `M ${tl} 0`,
      `H ${w - tr}`,
      tr ? `A ${tr} ${tr} 0 0 1 ${w} ${tr}` : '',
      `V ${h - br}`,
      br ? `A ${br} ${br} 0 0 1 ${w - br} ${h}` : '',
      `H ${bl}`,
      bl ? `A ${bl} ${bl} 0 0 1 0 ${h - bl}` : '',
      `V ${tl}`,
      tl ? `A ${tl} ${tl} 0 0 1 ${tl} 0` : '',
      'Z',
    ].filter(Boolean).join(' ');
  };

  const wrapRadii = {
    borderTopLeftRadius:     tl,
    borderTopRightRadius:    tr,
    borderBottomLeftRadius:  bl,
    borderBottomRightRadius: br,
  };

  return (
    <View style={[styles.wrap, wrapRadii, style]} onLayout={onLayout}>
      {size.w > 0 && (
        <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              {colors.map((c, i) => (
                <Stop key={i} offset={`${i / (colors.length - 1)}`} stopColor={c} />
              ))}
            </LinearGradient>
          </Defs>
          {corners === 'bottom' ? (
            <Path d={roundedRectPath(size.w, size.h)} fill="url(#bg)" />
          ) : (
            <Rect x="0" y="0" width={size.w} height={size.h} rx={radius} ry={radius} fill="url(#bg)" />
          )}
          {blobs.map((b, i) => (
            <Circle
              key={i}
              cx={b.x ?? size.w * 0.85}
              cy={b.y ?? size.h * 0.15}
              r={b.r ?? 80}
              fill={b.color ?? '#FFFFFF'}
              opacity={b.opacity ?? 0.08}
            />
          ))}
        </Svg>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:    { overflow: 'hidden', position: 'relative' },
  content: { padding: 24 },
});
