import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { KitColors, KitAccents, KitRadius } from '../../constants/brand';

/**
 * Kit Button — full-width by default. Primary = violet (per color roles).
 * 'coral' is for alerts only — don't use it as a generic CTA.
 */
export default function Button({
  label,
  variant = 'primary',
  disabled = false,
  onPress,
  style,
}) {
  const config = VARIANTS[variant] || VARIANTS.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        {
          backgroundColor: disabled ? KitColors.surface1 : config.bg,
          borderColor: config.borderColor || 'transparent',
          borderWidth: config.borderColor ? 1 : 0,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: disabled ? KitColors.text3 : config.fg }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const VARIANTS = {
  primary: { bg: KitAccents.violet, fg: '#FFFFFF' },
  ghost:   { bg: 'transparent', fg: KitColors.text1, borderColor: KitColors.hairline },
  coral:   { bg: KitAccents.coral, fg: '#FFFFFF' },
  teal:    { bg: KitAccents.teal,  fg: '#08221E' },
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: KitRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
});
