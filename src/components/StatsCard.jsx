import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';

const getPainColor = (level) => {
  if (level <= 3) return Colors.green;
  if (level <= 6) return Colors.amber;
  return Colors.red;
};

export default function StatsCard() {
  const { onboardingData } = useOnboarding();
  const { painIntensity = 5 } = onboardingData;

  const exercises = useMemo(() => selectExercises(onboardingData), [onboardingData]);
  const totalMin  = exercises.reduce((s, e) => s + (parseInt(e.duration) || 2), 0);
  const painColor = getPainColor(painIntensity);

  const stats = [
    {
      icon: 'trending-down-outline',
      label: 'Starting Pain',
      value: `${painIntensity}/10`,
      sub: 'goal: ≤3/10',
      color: painColor,
    },
    {
      icon: 'barbell-outline',
      label: 'Today\'s Plan',
      value: String(exercises.length),
      sub: 'exercises',
      color: Colors.purple,
    },
    {
      icon: 'time-outline',
      label: 'Est. Duration',
      value: `${totalMin}m`,
      sub: 'per session',
      color: Colors.green,
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Your Recovery Plan</Text>
        <View style={styles.dayOneBadge}>
          <Ionicons name="flash" size={11} color={Colors.amber} />
          <Text style={styles.dayOneBadgeText}>Active</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statItem, index < 2 && styles.statDivider]}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statSub}>{stat.sub}</Text>
          </View>
        ))}
      </View>

      <View style={styles.goalBar}>
        <View style={styles.goalBarHeader}>
          <Text style={styles.goalBarLabel}>Pain reduction goal</Text>
          <Text style={styles.goalBarTarget}>{painIntensity}/10 → 3/10</Text>
        </View>
        <View style={styles.goalTrack}>
          <View style={[styles.goalFill, { width: '5%' }]} />
          <View style={styles.goalMarker} />
        </View>
        <Text style={styles.goalHint}>Track daily to see your trend</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dayOneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.amber + '22',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.amber + '50',
  },
  dayOneBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.amber },

  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: Colors.borderSubtle,
    marginRight: 2,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statSub: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  goalBar: {
    backgroundColor: Colors.bgInput,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  goalBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalBarLabel:  { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  goalBarTarget: { fontSize: 12, color: Colors.purple, fontWeight: '700' },
  goalTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 7,
    position: 'relative',
  },
  goalFill: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 3,
  },
  goalMarker: {
    position: 'absolute',
    right: 0,
    top: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  goalHint: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
});
