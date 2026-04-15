import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PostureTipCard() {
  const tips = [
    {
      icon: 'desktop-outline',
      title: 'Ergonomic Setup',
      description: 'Keep your monitor at eye level and feet flat on the floor',
    },
    {
      icon: 'walk-outline',
      title: 'Take Breaks',
      description: 'Stand up and stretch every 30 minutes',
    },
    {
      icon: 'bed-outline',
      title: 'Sleep Position',
      description: 'Sleep on your side with a pillow between your knees',
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Posture Tips</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#7CC7FF" />
        </TouchableOpacity>
      </View>

      {tips.map((tip, index) => (
        <View 
          key={index} 
          style={[
            styles.tipItem,
            index === tips.length - 1 && styles.tipItemLast
          ]}
        >
          <View style={styles.tipIconContainer}>
            <Ionicons name={tip.icon} size={22} color="#6EE7B7" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        </View>
      ))}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6EDFF',
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2A3D',
  },
  tipItemLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#11213B',
    borderWidth: 1,
    borderColor: '#1F2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6EDFF',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});
