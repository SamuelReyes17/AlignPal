import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  // Sample history data
  const historyData = [
    {
      id: 1,
      date: 'Today',
      time: '2:30 PM',
      painLevel: 3,
      exercises: ['Cat-Cow Stretch', 'Child\'s Pose'],
      duration: '12 min',
      notes: 'Feeling better after exercises',
    },
    {
      id: 2,
      date: 'Yesterday',
      time: '4:15 PM',
      painLevel: 5,
      exercises: ['Pelvic Tilt', 'Cat-Cow Stretch'],
      duration: '15 min',
      notes: 'Moderate pain, exercises helped',
    },
    {
      id: 3,
      date: '2 days ago',
      time: '10:00 AM',
      painLevel: 4,
      exercises: ['Child\'s Pose', 'Pelvic Tilt'],
      duration: '10 min',
      notes: 'Morning routine',
    },
    {
      id: 4,
      date: '3 days ago',
      time: '6:45 PM',
      painLevel: 6,
      exercises: ['Cat-Cow Stretch'],
      duration: '8 min',
      notes: 'High pain level, short session',
    },
    {
      id: 5,
      date: '4 days ago',
      time: '3:20 PM',
      painLevel: 4,
      exercises: ['Pelvic Tilt', 'Child\'s Pose', 'Cat-Cow Stretch'],
      duration: '18 min',
      notes: 'Full routine completed',
    },
  ];

  const getPainLevelColor = (level) => {
    if (level <= 3) return '#50C878';
    if (level <= 6) return '#FFA500';
    return '#FF6B6B';
  };

  const getPainLevelLabel = (level) => {
    if (level <= 3) return 'Mild';
    if (level <= 6) return 'Moderate';
    return 'Severe';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Insights</Text>
          <Text style={styles.headerTitle}>History</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#7CC7FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {historyData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No history yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your pain tracking and exercise history will appear here
            </Text>
          </View>
        ) : (
          historyData.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={[styles.painBadge, { backgroundColor: `${getPainLevelColor(item.painLevel)}26` }]}>
                  <View style={[styles.painIndicator, { backgroundColor: getPainLevelColor(item.painLevel) }]} />
                  <Text style={[styles.painLevelText, { color: getPainLevelColor(item.painLevel) }]}>
                    {item.painLevel}/10 - {getPainLevelLabel(item.painLevel)}
                  </Text>
                </View>
              </View>

              <View style={styles.exercisesContainer}>
                <View style={styles.exercisesHeader}>
                  <Ionicons name="fitness-outline" size={18} color="#7CC7FF" />
                  <Text style={styles.exercisesTitle}>Exercises</Text>
                </View>
                <View style={styles.exercisesList}>
                  {item.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseTag}>
                      <Text style={styles.exerciseTagText}>{exercise}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#7f8c8d" />
                  <Text style={styles.statText}>{item.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#50C878" />
                  <Text style={styles.statText}>Completed</Text>
                </View>
              </View>

              {item.notes && (
                <View style={styles.notesContainer}>
                  <Ionicons name="document-text-outline" size={16} color="#7f8c8d" />
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              )}

              <View style={styles.divider} />
            </View>
          ))
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: '#0A1222',
  },
  headerEyebrow: {
    fontSize: 12,
    color: '#8AA3D9',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 3,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F2F6FF',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111D34',
    borderWidth: 1,
    borderColor: '#22324F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E6EDFF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: '#101B31',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#263554',
    shadowColor: '#02060E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 7,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6EDFF',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  painBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  painIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  painLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exercisesContainer: {
    marginBottom: 12,
  },
  exercisesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E6EDFF',
    marginLeft: 6,
  },
  exercisesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  exerciseTag: {
    backgroundColor: '#111E37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  exerciseTagText: {
    fontSize: 12,
    color: '#7CC7FF',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0B1220',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1F2A3D',
  },
  notesText: {
    fontSize: 13,
    color: '#E6EDFF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2A3D',
    marginTop: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
