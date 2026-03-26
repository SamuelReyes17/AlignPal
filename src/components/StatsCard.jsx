import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatsCard() {
  const stats = [
    { icon: 'calendar-outline', label: 'Days Active', value: '7', color: '#7CC7FF' },
    { icon: 'time-outline', label: 'Exercise Time', value: '45m', color: '#6EE7B7' },
    { icon: 'trending-down-outline', label: 'Pain Level', value: '3/10', color: '#F4B740' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Your Progress</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}26` }]}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
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
    marginVertical: 10,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6EDFF',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E6EDFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
