import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PainTrackerCard() {
  const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Track Your Pain Level</Text>
      <Text style={styles.cardSubtitle}>How is your back feeling today?</Text>
      
      <View style={styles.painScale}>
        {painLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.painButton,
              level <= 3 && styles.painLow,
              level > 3 && level <= 6 && styles.painMedium,
              level > 6 && styles.painHigh,
            ]}
          >
            <Text style={styles.painButtonText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.painLabels}>
        <Text style={styles.painLabel}>Mild</Text>
        <Text style={styles.painLabel}>Moderate</Text>
        <Text style={styles.painLabel}>Severe</Text>
      </View>

      <TouchableOpacity style={styles.logButton}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#0B1220" />
        <Text style={styles.logButtonText}>Log Pain Level</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101B31',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#263554',
    shadowColor: '#02060E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.26,
    shadowRadius: 15,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6EDFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
  },
  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  painButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  painLow: {
    backgroundColor: '#0F1F2E',
  },
  painMedium: {
    backgroundColor: '#1C1D2E',
  },
  painHigh: {
    backgroundColor: '#2A1A1F',
  },
  painButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E6EDFF',
  },
  painLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  painLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#6FE0BF',
    shadowColor: '#3BB08E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 7,
  },
  logButtonText: {
    color: '#072319',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
