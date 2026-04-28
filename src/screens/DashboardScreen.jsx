import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StatsCard from '../components/StatsCard';
import ExerciseCard from '../components/ExerciseCard';
import PainTrackerCard from '../components/PainTrackerCard';
import PostureTipCard from '../components/PostureTipCard';
import RecoveryOverviewCard from '../components/RecoveryOverviewCard';
import PremiumGate from '../components/PremiumGate';
import { useOnboarding } from '../context/OnboardingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Colors, Shadows } from '../constants/brand';

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
};

const formatLocation = (raw) =>
  LOCATION_LABELS[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function DashboardScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const { isPremium } = useSubscription();

  const handleUpgradePress = () => navigation.navigate('Upgrade');

  const primaryArea = onboardingData.painLocations[0]
    ? formatLocation(onboardingData.painLocations[0])
    : 'Recovery';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Daily Recovery</Text>
            <Text style={styles.headerTitle}>{primaryArea}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color={Colors.purple} />
          </TouchableOpacity>
        </View>

        {/* 1. Today's exercises — primary CTA, front and center */}
        <ExerciseCard previewOnly={!isPremium} onUpgrade={handleUpgradePress} />

        {/* 2. Daily check-in — the core habit loop */}
        <PainTrackerCard />

        {/* 3. Condition overview — understand your pain */}
        <RecoveryOverviewCard />

        {/* 4. Progress stats */}
        <StatsCard />

        {/* 5. Posture tip — premium */}
        <PremiumGate label="Posture Tips" onUpgrade={handleUpgradePress}>
          <PostureTipCard />
        </PremiumGate>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8,
  },
  headerEyebrow: {
    fontSize: 12, color: Colors.textSecondary, letterSpacing: 0.6,
    textTransform: 'uppercase', marginBottom: 3, fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3,
  },
  profileButton: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadows.card,
  },
  bottomSpacing: { height: 20 },
});
