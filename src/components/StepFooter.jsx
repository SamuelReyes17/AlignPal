import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/brand';
import { useResponsive, fs } from '../utils/responsive';

/**
 * StepFooter — pinned bottom CTA used by every onboarding screen.
 *
 * One component owns the Continue button's height, padding, shape, shadow
 * and arrow icon, so every screen in the flow looks identical and the
 * styles can never drift apart screen-by-screen again.
 *
 * Props:
 *   label     — visible text (e.g. "Continue", "Tap where it hurts")
 *   onPress   — called when tapped (ignored when disabled or loading)
 *   disabled  — greyed-out look, no arrow icon, no shadow
 *   loading   — shows a spinner instead of the arrow (and blocks taps)
 *   showArrow — default true; pass false to hide the arrow even when enabled
 *
 * Placement: render this OUTSIDE the screen's ScrollView so it stays pinned
 * to the bottom of the SafeAreaView and is always reachable.
 */
export default function StepFooter({
  label,
  onPress,
  disabled = false,
  loading = false,
  showArrow = true,
}) {
  const { horizPad, frameWidth, fontScale, isShort } = useResponsive();
  const inert = disabled || loading;

  return (
    <View
      style={[
        s.footer,
        {
          paddingHorizontal: horizPad,
          paddingTop: isShort ? 28 : 36,
          paddingBottom: isShort ? 28 : 36,
        },
      ]}
    >
      <View style={[s.inner, { maxWidth: frameWidth }]}>
        <TouchableOpacity
          style={[s.btn, inert && s.btnDisabled]}
          onPress={() => !inert && onPress && onPress()}
          disabled={inert}
          activeOpacity={0.88}
        >
          <Text
            style={[
              s.btnText,
              { fontSize: fs(17, fontScale) },
              inert && s.btnTextDisabled,
            ]}
          >
            {label}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} style={{ marginLeft: 4 }} />
          ) : (
            !disabled && showArrow && (
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            )
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.purple,
    borderRadius: 20,
    paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled: {
    backgroundColor: Colors.bgCard,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText: {
    fontWeight: '700',
    color: Colors.white,
  },
  btnTextDisabled: {
    color: Colors.textMuted,
  },
});
