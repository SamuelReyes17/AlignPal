import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

export default function UpgradeScreen({ navigation }) {
  const { completeOnboarding } = useOnboarding();

  const handleStartFreeTrial = () => {
    completeOnboarding();
    // Navigation will automatically switch to main app via RootNavigator
  };

  const handleContinueFree = () => {
    completeOnboarding();
    // Navigation will automatically switch to main app via RootNavigator
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={48} color="#5B8DFF" />
        </View>

        <Text style={styles.title}>Unlock Your Full Recovery</Text>
        <Text style={styles.subtitle}>
          Get personalized routines, progress tracking, and AI-powered posture analysis
        </Text>

        {/* Free Trial Option */}
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={handleStartFreeTrial}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>POPULAR</Text>
            </View>
            <Text style={styles.cardTitle}>7-Day Free Trial</Text>
          </View>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#5B8DFF" />
              <Text style={styles.featureText}>Full access to all exercises</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#5B8DFF" />
              <Text style={styles.featureText}>AI posture analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#5B8DFF" />
              <Text style={styles.featureText}>Progress tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#5B8DFF" />
              <Text style={styles.featureText}>Personalized routines</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Then $9.99/month</Text>
            <Text style={styles.priceSubtext}>Cancel anytime</Text>
          </View>
        </TouchableOpacity>

        {/* Free Plan Option */}
        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={handleContinueFree}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryCardTitle}>Continue with Free Plan</Text>
          <Text style={styles.secondaryCardSubtext}>
            Limited exercises • No AI analysis • Basic tracking
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your free trial starts now. No charge until the trial ends.
        </Text>
      </ScrollView>
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
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8FA9',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryCard: {
    backgroundColor: '#1F2A3D',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#5B8DFF',
  },
  cardHeader: {
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5B8DFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E1625',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#B8C5D6',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A3547',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: '#7F8FA9',
  },
  secondaryCard: {
    backgroundColor: '#1F2A3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A3547',
    alignItems: 'center',
  },
  secondaryCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  secondaryCardSubtext: {
    fontSize: 14,
    color: '#7F8FA9',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#7F8FA9',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 18,
  },
});
