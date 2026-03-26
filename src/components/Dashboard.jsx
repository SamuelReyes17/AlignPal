import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeCard from './WelcomeCard';
import StatsCard from './StatsCard';
import ExerciseCard from './ExerciseCard';
import PainTrackerCard from './PainTrackerCard';
import PostureTipCard from './PostureTipCard';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AlignPal</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <WelcomeCard />
      <StatsCard />
      <ExerciseCard />
      <PainTrackerCard />
      <PostureTipCard />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileButton: {
    padding: 5,
  },
  bottomSpacing: {
    height: 20,
  },
});
