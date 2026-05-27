import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { getPainCondition } from '../constants/exerciseLibrary';

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia',
  chest: 'Chest', abdomen: 'Core', elbow: 'Elbow',
  quad: 'Quads', shin: 'Shin',
};

const PAIN_TYPE_META = {
  sharp:     { label: 'Sharp',     color: '#FF6B9D' },
  dull:      { label: 'Dull',      color: '#FBBF24' },
  burning:   { label: 'Burning',   color: '#FB923C' },
  stiff:     { label: 'Stiff',     color: '#818CF8' },
  radiating: { label: 'Radiating', color: '#7C5CF0' },
  numb:      { label: 'Numbness',  color: '#34D399' },
  cramping:  { label: 'Cramping',  color: '#60A5FA' },
  throbbing: { label: 'Throbbing', color: '#F472B6' },
};

const formatLocation = (raw) =>
  LOCATION_LABELS[raw] || raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const getPainColor = (level) => {
  if (level <= 3) return Colors.green;
  if (level <= 6) return Colors.amber;
  return Colors.red;
};

export default function RecoveryOverviewCard() {
  const { onboardingData } = useOnboarding();
  const { painLocations = [], painIntensity = 5, painTypes = [], worstTimeTriggers = [] } = onboardingData;

  const condition  = getPainCondition(onboardingData);
  const painColor  = getPainColor(painIntensity);
  const primaryLoc = painLocations[0] ? formatLocation(painLocations[0]) : 'General';

  const triggerLabels = {
    sitting: 'Sitting', standing: 'Standing', lifting: 'Lifting',
    sleeping: 'Sleeping', training: 'Training', morning: 'Mornings',
    walking: 'Walking', stress: 'Stress',
  };

  return (
    <View style={styles.card}>

      {/* Top row — condition + intensity */}
      <View style={styles.topRow}>
        <View style={styles.conditionLeft}>
          <Text style={styles.eyebrow}>YOUR CONDITION</Text>
          <Text style={styles.conditionName} numberOfLines={2}>{condition.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.purple} />
            <Text style={styles.locationText}>
              {painLocations.map(formatLocation).join(', ') || 'General'}
            </Text>
          </View>
        </View>

        <View style={styles.intensityBlock}>
          <Text style={[styles.intensityNum, { color: painColor }]}>{painIntensity}</Text>
          <Text style={styles.intensityDen}>/10</Text>
          <Text style={styles.intensityLabel}>pain</Text>
        </View>
      </View>

      {/* Symptom chips */}
      {painTypes.length > 0 && (
        <View style={styles.chipSection}>
          <Text style={styles.chipSectionLabel}>Symptoms</Text>
          <View style={styles.chipsRow}>
            {painTypes.map((type) => {
              const meta = PAIN_TYPE_META[type];
              if (!meta) return null;
              return (
                <View key={type} style={[styles.symptomChip, { backgroundColor: meta.color + '18', borderColor: meta.color + '50' }]}>
                  <View style={[styles.symptomDot, { backgroundColor: meta.color }]} />
                  <Text style={[styles.symptomChipText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Triggers */}
      {worstTimeTriggers.length > 0 && (
        <View style={styles.chipSection}>
          <Text style={styles.chipSectionLabel}>Worse when</Text>
          <View style={styles.chipsRow}>
            {worstTimeTriggers.slice(0, 4).map((t) => (
              <View key={t} style={styles.triggerChip}>
                <Text style={styles.triggerChipText}>{triggerLabels[t] || t}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Pattern insight */}
      <View style={styles.insightRow}>
        <View style={styles.insightIcon}>
          <Ionicons name="bulb-outline" size={13} color={Colors.amber} />
        </View>
        <Text style={styles.insightText} numberOfLines={3}>
          {condition.description}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.purpleSoft,
  },

  topRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  conditionLeft:  { flex: 1, paddingRight: 12 },
  eyebrow:        { fontSize: 10, fontWeight: '700', color: Colors.purple, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 },
  conditionName:  { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, lineHeight: 22, marginBottom: 8 },
  locationRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText:   { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  intensityBlock: { alignItems: 'center', backgroundColor: Colors.bgElevated, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: Colors.purpleDim },
  intensityNum:   { fontSize: 28, fontWeight: '800', lineHeight: 32 },
  intensityDen:   { fontSize: 13, color: Colors.textMuted, fontWeight: '600', marginTop: -2 },
  intensityLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 3 },

  chipSection:      { marginBottom: 12 },
  chipSectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 },
  chipsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  symptomChip:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  symptomDot:      { width: 6, height: 6, borderRadius: 3 },
  symptomChipText: { fontSize: 11, fontWeight: '700' },

  triggerChip:     { backgroundColor: Colors.bgElevated, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  triggerChipText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.bgInput, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.borderSubtle },
  insightIcon: { width: 22, height: 22, borderRadius: 7, backgroundColor: Colors.amber + '22', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  insightText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, flex: 1 },
});
