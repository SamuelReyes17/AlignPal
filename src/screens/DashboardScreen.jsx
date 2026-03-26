import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WelcomeCard from '../components/WelcomeCard';
import StatsCard from '../components/StatsCard';
import ExerciseCard from '../components/ExerciseCard';
import PainTrackerCard from '../components/PainTrackerCard';
import PostureTipCard from '../components/PostureTipCard';
import RecoveryOverviewCard from '../components/RecoveryOverviewCard';
import { useOnboarding } from '../context/OnboardingContext';

export default function DashboardScreen() {
  const { onboardingData, generatePersonalizedPlan } = useOnboarding();

  const plan = useMemo(() => generatePersonalizedPlan(), [generatePersonalizedPlan]);

  const primaryArea =
    onboardingData.painLocations[0]?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
    'Posture & back health';

  const durationLabelMap = {
    'just-started': 'Just started',
    weeks: 'Pain for weeks',
    months: 'Pain for months',
    years: 'Pain for years',
  };

  const triggerLabelMap = {
    sitting: 'Worse when sitting',
    standing: 'Worse when standing',
    lifting: 'Worse when lifting',
    sleeping: 'Worse while sleeping',
    training: 'Worse during training',
  };

  const painDurationLabel = durationLabelMap[onboardingData.painDuration] || '';
  const triggersLabels =
    onboardingData.worstTimeTriggers?.map((t) => triggerLabelMap[t]).filter(Boolean) || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AlignPal</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color="#5B8DFF" />
          </TouchableOpacity>
        </View>

        <RecoveryOverviewCard
          primaryArea={primaryArea}
          painLocations={onboardingData.painLocations}
          painIntensity={onboardingData.painIntensity}
          painDurationLabel={painDurationLabel}
          triggersLabels={triggersLabels}
          patterns={plan.patterns}
        />

        <StatsCard />
        <ExerciseCard />
        <PainTrackerCard />
        <PostureTipCard />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#0B1220',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6EDFF',
  },
  profileButton: {
    padding: 5,
  },
  bottomSpacing: {
    height: 20,
  },
});
