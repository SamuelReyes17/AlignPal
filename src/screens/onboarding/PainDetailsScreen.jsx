import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import Slider from '../../components/Slider';

const DURATION_OPTIONS = [
  { id: 'just-started', label: 'Just started' },
  { id: 'weeks', label: 'Weeks' },
  { id: 'months', label: 'Months' },
  { id: 'years', label: 'Years' },
];

const PAIN_TYPE_OPTIONS = [
  { id: 'sharp',   label: 'Sharp',   icon: 'flash-outline',       desc: 'Stabbing or shooting' },
  { id: 'dull',    label: 'Dull',    icon: 'radio-button-off-outline', desc: 'Aching or throbbing' },
  { id: 'burning', label: 'Burning', icon: 'flame-outline',       desc: 'Hot or stinging' },
  { id: 'stiff',   label: 'Stiff',   icon: 'lock-closed-outline', desc: 'Tight or hard to move' },
];

const TRIGGER_OPTIONS = [
  { id: 'sitting', label: 'Sitting', icon: 'desktop-outline' },
  { id: 'standing', label: 'Standing', icon: 'walk-outline' },
  { id: 'lifting', label: 'Lifting', icon: 'barbell-outline' },
  { id: 'sleeping', label: 'Sleeping', icon: 'bed-outline' },
  { id: 'training', label: 'Training', icon: 'fitness-outline' },
];

export default function PainDetailsScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [intensity, setIntensity] = useState(onboardingData.painIntensity || 5);
  const [duration, setDuration] = useState(onboardingData.painDuration || '');
  const [triggers, setTriggers] = useState(onboardingData.worstTimeTriggers || []);
  const [painType, setPainType] = useState(onboardingData.painType || '');

  const toggleTrigger = (triggerId) => {
    if (triggers.includes(triggerId)) {
      setTriggers(triggers.filter((id) => id !== triggerId));
    } else {
      setTriggers([...triggers, triggerId]);
    }
  };

  const handleContinue = () => {
    updateOnboardingData({
      painIntensity: intensity,
      painDuration: duration,
      worstTimeTriggers: triggers,
      painType,
    });
    navigation.navigate('Lifestyle');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '28%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>Tell us about your pain</Text>

        {/* Intensity Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pain Intensity</Text>
          <Text style={styles.intensityValue}>{intensity}/10</Text>
          <Slider
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Mild</Text>
            <Text style={styles.sliderLabel}>Severe</Text>
          </View>
        </View>

        {/* Pain Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What does it feel like?</Text>
          <View style={styles.optionsGrid}>
            {PAIN_TYPE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.painTypeButton,
                  painType === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => setPainType(option.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={painType === option.id ? '#5B8DFF' : '#7F8FA9'}
                />
                <Text style={[styles.painTypeLabel, painType === option.id && styles.optionTextSelected]}>
                  {option.label}
                </Text>
                <Text style={[styles.painTypeDesc, painType === option.id && styles.painTypeDescSelected]}>
                  {option.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How long have you had this pain?</Text>
          <View style={styles.optionsGrid}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  duration === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => setDuration(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    duration === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Worst Time Triggers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When is it worst?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          <View style={styles.triggersGrid}>
            {TRIGGER_OPTIONS.map((trigger) => {
              const isSelected = triggers.includes(trigger.id);
              return (
                <TouchableOpacity
                  key={trigger.id}
                  style={[
                    styles.triggerButton,
                    isSelected && styles.triggerButtonSelected,
                  ]}
                  onPress={() => toggleTrigger(trigger.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={trigger.icon}
                    size={24}
                    color={isSelected ? '#5B8DFF' : '#7F8FA9'}
                  />
                  <Text
                    style={[
                      styles.triggerText,
                      isSelected && styles.triggerTextSelected,
                    ]}
                  >
                    {trigger.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!duration || triggers.length === 0 || !painType) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!duration || triggers.length === 0 || !painType}
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
    minHeight: 0,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8FA9',
    marginBottom: 16,
  },
  intensityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5B8DFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#7F8FA9',
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
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#1F3A5F',
    borderColor: '#5B8DFF',
    shadowColor: '#5B8DFF',
    shadowOpacity: 0.30,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
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
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  triggerButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1F2A3D',
    borderWidth: 2,
    borderColor: '#2A3547',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  triggerButtonSelected: {
    backgroundColor: '#1F3A5F',
    borderColor: '#5B8DFF',
    shadowColor: '#5B8DFF',
    shadowOpacity: 0.30,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  triggerText: {
    fontSize: 14,
    color: '#7F8FA9',
    fontWeight: '500',
  },
  triggerTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  painTypeButton: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1F2A3D',
    borderWidth: 2,
    borderColor: '#2A3547',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  painTypeLabel: {
    fontSize: 15,
    color: '#7F8FA9',
    fontWeight: '600',
    marginTop: 4,
  },
  painTypeDesc: {
    fontSize: 11,
    color: '#4B5B78',
    textAlign: 'center',
  },
  painTypeDescSelected: {
    color: '#5B8DFF',
    opacity: 0.8,
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
