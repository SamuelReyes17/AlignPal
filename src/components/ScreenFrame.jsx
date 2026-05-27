import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/brand';

/**
 * ScreenFrame
 * ─────────────────────────────────────────────────────────────────────────
 * Wraps an entire screen so it's constrained to a phone-sized column.
 * On phones (≤PHONE_MAX), it just fills the viewport.
 * On wide / desktop / iPad-landscape viewports, it stays at PHONE_MAX wide,
 * centered, with the dark page color flanking it — so hero, body, and footer
 * all share the same width and proportions stay correct.
 *
 * Usage:
 *   <SafeAreaView edges={[]}>
 *     <ScreenFrame>
 *       ...rest of the screen...
 *     </ScreenFrame>
 *   </SafeAreaView>
 */
const PHONE_MAX = 480;

export default function ScreenFrame({ children, style }) {
  return (
    <View style={styles.outer}>
      <View style={[styles.frame, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: PHONE_MAX,
    alignSelf: 'center',
  },
});
