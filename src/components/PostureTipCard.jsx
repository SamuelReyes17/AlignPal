import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/brand';

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
        <Ionicons name="information-circle-outline" size={20} color={Colors.textMuted} />
      </View>

      {tips.map((tip, index) => (
        <View
          key={index}
          style={[
            styles.tipItem,
            index === tips.length - 1 && styles.tipItemLast,
          ]}
        >
          <View style={styles.tipIconContainer}>
            <Ionicons name={tip.icon} size={22} color={Colors.green} />
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
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
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
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
