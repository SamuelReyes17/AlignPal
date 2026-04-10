/**
 * AlignPal — PremiumGate
 *
 * Wrap any component that should only be visible to premium users.
 * Free users see a blurred "locked" card with an upgrade CTA.
 *
 * Usage:
 *   <PremiumGate label="AI Posture Analysis" onUpgrade={goToUpgrade}>
 *     <PostureAnalysisCard />
 *   </PremiumGate>
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';

export default function PremiumGate({ children, label = 'Premium Feature', onUpgrade }) {
  const { isPremium } = useSubscription();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.wrapper}>
      {/* Blurred-out preview */}
      <View style={styles.blurredContent} pointerEvents="none">
        {children}
      </View>

      {/* Lock overlay */}
      <View style={styles.overlay}>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={20} color="#5B8DFF" />
        </View>
        <Text style={styles.lockLabel}>{label}</Text>
        <Text style={styles.lockSubtext}>Upgrade to unlock this feature</Text>
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade} activeOpacity={0.85}>
          <Text style={styles.upgradeButtonText}>Unlock Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  blurredContent: {
    opacity: 0.15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 18, 32, 0.75)',
    borderRadius: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lockLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  lockSubtext: {
    fontSize: 13,
    color: '#7F8FA9',
    textAlign: 'center',
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: '#5B8DFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E1625',
  },
});
