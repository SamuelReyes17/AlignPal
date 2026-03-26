import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={64} color="#5B8DFF" />
        </View>
        
        <Text style={styles.headline}>Fix your pain.</Text>
        <Text style={styles.headline}>Move freely again.</Text>
        
        <Text style={styles.subtitle}>
          Personalized recovery plans powered by AI posture analysis
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('PainLocation')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Start My Recovery</Text>
          <Ionicons name="arrow-forward" size={20} color="#0E1625" style={styles.ctaIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1625',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1F2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8FA9',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#5B8DFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1625',
  },
  ctaIcon: {
    marginLeft: 8,
  },
});
