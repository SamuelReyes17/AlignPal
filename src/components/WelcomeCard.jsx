import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';

const LOCATION_LABELS = {
  lower_back: 'lower back', upper_back: 'upper back', neck: 'neck',
  shoulder: 'shoulder', knee: 'knee', hip: 'hip', glute: 'glutes',
  hamstring: 'hamstring', calf: 'calf', ankle: 'ankle',
};

export default function WelcomeCard() {
  const { onboardingData } = useOnboarding();
  const loc = onboardingData.painLocations?.[0];
  const area = loc ? (LOCATION_LABELS[loc] || loc.replace(/_/g, ' ')) : 'your recovery';

  return (
    <View style={styles.card}>
      <View style={styles.welcomeContent}>
        <View style={styles.iconWrap}>
          <Ionicons name="fitness-outline" size={28} color={Colors.purple} />
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>Let's work on your {area} today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.purpleDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: { flex: 1 },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
