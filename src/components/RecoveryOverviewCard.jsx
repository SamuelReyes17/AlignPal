import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecoveryOverviewCard({
  primaryArea,
  painLocations,
  painIntensity,
  painDurationLabel,
  triggersLabels,
  patterns,
}) {
  const mainPattern = patterns[0] || 'We’ll fine-tune your plan as you use AlignPal.';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.leftCol}>
          <Text style={styles.label}>Today's focus</Text>
          <Text style={styles.primaryArea}>{primaryArea}</Text>
          <Text style={styles.pattern}>{mainPattern}</Text>
        </View>
        <View style={styles.rightCol}>
          <View style={styles.intensityBadge}>
            <Text style={styles.intensityLabel}>Pain</Text>
            <Text style={styles.intensityValue}>{painIntensity}/10</Text>
          </View>
          {painDurationLabel ? (
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color="#7F8FA9" />
              <Text style={styles.metaText}>{painDurationLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.chipsRow}>
        {painLocations.map((loc) => (
          <View key={loc} style={styles.chip}>
            <Text style={styles.chipText}>{loc}</Text>
          </View>
        ))}
        {triggersLabels.map((trigger) => (
          <View key={trigger} style={styles.chipSecondary}>
            <Text style={styles.chipSecondaryText}>{trigger}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F182A',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#7F8FA9',
    marginBottom: 4,
  },
  primaryArea: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E6EDFF',
    marginBottom: 8,
  },
  pattern: {
    fontSize: 14,
    color: '#B8C5D6',
    lineHeight: 20,
  },
  intensityBadge: {
    backgroundColor: '#1F3A5F',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 11,
    color: '#B8C5D6',
    marginBottom: 2,
  },
  intensityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B8DFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#7F8FA9',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: '#1F3A5F',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#E6EDFF',
  },
  chipSecondary: {
    backgroundColor: '#1F2A3D',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipSecondaryText: {
    fontSize: 12,
    color: '#7F8FA9',
  },
});

