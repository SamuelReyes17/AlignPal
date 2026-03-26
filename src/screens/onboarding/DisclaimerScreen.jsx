import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

export default function DisclaimerScreen({ navigation }) {
  const { generatePersonalizedPlan } = useOnboarding();

  const handleContinue = () => {
    // Generate personalized plan
    generatePersonalizedPlan();
    navigation.navigate('Results');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '71%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="medical-outline" size={48} color="#5B8DFF" />
        </View>

        <Text style={styles.title}>Important Disclaimer</Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            AlignPal is designed to help you improve your posture and manage body pain through exercise and movement guidance.
          </Text>
          <Text style={styles.disclaimerText}>
            This app is not intended to diagnose, treat, cure, or prevent any medical condition. The information provided is for educational purposes only.
          </Text>
          <Text style={styles.disclaimerText}>
            If you have severe or persistent pain, please consult with a healthcare professional before beginning any exercise program.
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#5B8DFF" />
          <Text style={styles.checkboxText}>
            I understand that AlignPal is not a medical diagnosis tool
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>I Understand</Text>
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  disclaimerBox: {
    backgroundColor: '#1F2A3D',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A3547',
  },
  disclaimerText: {
    fontSize: 15,
    color: '#B8C5D6',
    lineHeight: 24,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F3A5F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#5B8DFF',
  },
  checkboxText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
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
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E1625',
  },
});
