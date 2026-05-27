import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KitColors } from '../../constants/brand';

/**
 * Kit Chip — small pill for tags, cues, selected items.
 *
 * Props:
 *  - label
 *  - variant: 'default' | 'violet' | 'coral' | 'teal'
 *  - dismissible: shows × and triggers onPress
 *  - onPress
 */
export default function Chip({ label, variant = 'default', dismissible = false, onPress }) {
  const v = TINTS[variant] || TINTS.default;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: v.bg, borderColor: v.border }]}
    >
      <Text style={[styles.text, { color: v.fg }]}>
        {label}{dismissible ? '  ×' : ''}
      </Text>
    </Wrapper>
  );
}

const TINTS = {
  default: { bg: KitColors.surface2, border: KitColors.hairline, fg: KitColors.text1 },
  violet:  { bg: 'rgba(108,92,231,0.18)', border: 'rgba(108,92,231,0.45)', fg: '#C7BEFF' },
  coral:   { bg: 'rgba(255,107,107,0.16)', border: 'rgba(255,107,107,0.40)', fg: '#FFB3B3' },
  teal:    { bg: 'rgba(45,212,191,0.16)',  border: 'rgba(45,212,191,0.40)', fg: '#88EEDD' },
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
