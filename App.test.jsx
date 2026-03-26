// Temporary test file to verify React Native is working
// If this shows, React Native is working correctly
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✅ React Native is working!</Text>
      <Text style={styles.subtext}>If you see this, the basic setup is correct.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
});
