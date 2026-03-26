import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

const SITTING_OPTIONS = [
  { id: '0-2', label: '0-2 hours' },
  { id: '3-5', label: '3-5 hours' },
  { id: '6+', label: '6+ hours' },
];

const TRAINING_OPTIONS = [
  { id: 'never', label: 'Never' },
  { id: 'occasionally', label: 'Occasionally' },
  { id: 'regularly', label: 'Regularly' },
  { id: 'daily', label: 'Daily' },
];

const AGE_OPTIONS = [
  { id: '18-25', label: '18-25' },
  { id: '26-35', label: '26-35' },
  { id: '36-45', label: '36-45' },
  { id: '46-55', label: '46-55' },
  { id: '56+', label: '56+' },
];

export default function LifestyleScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sittingHours, setSittingHours] = useState(onboardingData.sittingHours || '');
  const [trainingFrequency, setTrainingFrequency] = useState(onboardingData.trainingFrequency || '');
  const [pastInjuries, setPastInjuries] = useState(onboardingData.pastInjuries || '');
  const [ageRange, setAgeRange] = useState(onboardingData.ageRange || '');

  const handleContinue = () => {
    updateOnboardingData({
      sittingHours,
      trainingFrequency,
      pastInjuries,
      ageRange,
    });
    navigation.navigate('Disclaimer');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '42%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Text style={styles.title}>Quick lifestyle snapshot</Text>
        <Text style={styles.subtitle}>Help us personalize your plan</Text>

        {/* Sitting Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily sitting time</Text>
          <View style={styles.optionsGrid}>
            {SITTING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  sittingHours === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => setSittingHours(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    sittingHours === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Training Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training frequency</Text>
          <View style={styles.optionsGrid}>
            {TRAINING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  trainingFrequency === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => setTrainingFrequency(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    trainingFrequency === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Past Injuries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past injuries (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Lower back injury in 2020"
            placeholderTextColor="#7F8FA9"
            value={pastInjuries}
            onChangeText={setPastInjuries}
            multiline={false}
          />
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age range</Text>
          <View style={styles.optionsGrid}>
            {AGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  ageRange === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => setAgeRange(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    ageRange === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!sittingHours || !trainingFrequency || !ageRange) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!sittingHours || !trainingFrequency || !ageRange}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
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
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#1F2A3D',
    borderWidth: 2,
    borderColor: '#2A3547',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#1F3A5F',
    borderColor: '#5B8DFF',
  },
  optionText: {
    fontSize: 16,
    color: '#7F8FA9',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#1F2A3D',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2A3547',
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 50,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2A3D',
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
