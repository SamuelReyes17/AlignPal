import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeCard() {
  return (
    <View style={styles.card}>
      <View style={styles.welcomeContent}>
        <Ionicons name="fitness-outline" size={40} color="#7CC7FF" />
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>Let's keep your back healthy today</Text>
        </View>
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
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E6EDFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
