import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseCard() {
  const exercises = [
    { name: 'Cat-Cow Stretch', duration: '5 min', icon: 'body-outline' },
    { name: 'Child\'s Pose', duration: '3 min', icon: 'fitness-outline' },
    { name: 'Pelvic Tilt', duration: '4 min', icon: 'barbell-outline' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Today's Exercises</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {exercises.map((exercise, index) => (
        <TouchableOpacity key={index} style={styles.exerciseItem}>
          <View style={styles.exerciseIconContainer}>
            <Ionicons name={exercise.icon} size={22} color="#7CC7FF" />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#bdc3c7" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Exercise Session</Text>
        <Ionicons name="play-circle-outline" size={20} color="#ffffff" style={styles.startButtonIcon} />
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
  seeAllText: {
    fontSize: 14,
    color: '#7CC7FF',
    fontWeight: '600',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2A3D',
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6EDFF',
    marginBottom: 2,
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#94A3B8',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#73A3FF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#2C62CA',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.34,
    shadowRadius: 14,
    elevation: 8,
  },
  startButtonText: {
    color: '#08152B',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  startButtonIcon: {
    marginLeft: 4,
  },
});
