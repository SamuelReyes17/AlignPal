import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import BodyMap from '../../components/BodyMap';

export default function PainLocationScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handleContinue = () => {
    if (onboardingData.painLocations.length > 0) {
      navigation.navigate('PainDetails');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '14%' }/* Step 1 of 7 */]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Where do you feel pain?</Text>
        <Text style={styles.subtitle}>Tap all areas that apply</Text>

        <BodyMap
          selectedParts={onboardingData.painLocations}
          onSelect={(locations) => updateOnboardingData({ painLocations: locations })}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            onboardingData.painLocations.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={onboardingData.painLocations.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1F2A3D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DFF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8FA9',
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 8,
  },
  continueButton: {
    backgroundColor: '#5B8DFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#1F2A3D',
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1625',
  },
});
