/**
 * PainProfileScreen — Step 5 of onboarding
 *
 * The "AI reveal" moment. Takes everything the user told us and presents
 * a clear, plain-English pain profile: what's likely going on, why, and
 * what we're going to do about it. This is the emotional payoff before
 * we show them the exercises.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

// ─── Pain condition lookup ────────────────────────────────────────────────────
// Maps pain location + type combos to a readable condition name + explanation
const getPainCondition = (locations, painType, triggers, duration) => {
  const loc = locations[0] || 'general';
  const isChronc = duration === 'months' || duration === 'years';

  const conditions = {
    'lower back': {
      sharp:   { name: 'Lumbar Strain',           emoji: '⚡', description: 'Sharp lower back pain often signals a muscle or ligament under sudden stress — usually from movement, lifting, or posture changes.' },
      dull:    { name: 'Lumbar Overload',          emoji: '🔄', description: 'A persistent dull ache in the lower back typically means your muscles have been working overtime, often due to prolonged sitting or weak core support.' },
      burning: { name: 'Nerve Irritation (L-Spine)',emoji: '🔥', description: 'A burning sensation in the lower back often points to nerve root irritation, sometimes radiating into the glutes or legs.' },
      stiff:   { name: 'Lumbar Stiffness',         emoji: '🧱', description: 'Morning or post-sitting stiffness in the lower back is a classic sign of tight hip flexors and a locked-up lumbar spine craving movement.' },
      default: { name: 'Lower Back Dysfunction',   emoji: '📍', description: 'Your lower back pain pattern suggests a combination of muscle tightness, postural load, and possible hip/core imbalance.' },
    },
    'upper back': {
      sharp:   { name: 'Thoracic Joint Irritation',emoji: '⚡', description: 'Sharp upper back pain between the shoulder blades often comes from facet joint stress or a muscle knot under sudden load.' },
      dull:    { name: 'Postural Overload',        emoji: '🔄', description: 'A dull ache in the upper back is one of the most common desk-work injuries — your thoracic spine is fatigued from hours of forward flexion.' },
      burning: { name: 'Thoracic Nerve Tension',   emoji: '🔥', description: 'Burning between the shoulder blades can indicate thoracic nerve tension, often linked to forward head posture.' },
      stiff:   { name: 'Thoracic Rigidity',        emoji: '🧱', description: 'Upper back stiffness usually means your thoracic spine has lost its natural mobility — common in people who sit for long periods.' },
      default: { name: 'Upper Back Syndrome',      emoji: '📍', description: 'Your upper back pattern points to postural fatigue and reduced thoracic mobility — extremely common and very responsive to targeted movement.' },
    },
    'neck': {
      sharp:   { name: 'Cervical Strain',          emoji: '⚡', description: 'Sharp neck pain often signals a muscle or joint under stress — aggravated by sudden movements or sustained forward head posture.' },
      dull:    { name: 'Text Neck Syndrome',        emoji: '📱', description: 'A dull aching neck is one of the most common modern pain patterns. Every inch your head drops forward adds ~10 lbs of load to your cervical spine.' },
      burning: { name: 'Cervical Nerve Irritation', emoji: '🔥', description: 'Burning neck pain can indicate nerve irritation in the cervical spine, sometimes radiating into the shoulders or arms.' },
      stiff:   { name: 'Cervical Stiffness',        emoji: '🧱', description: 'Neck stiffness — especially in the morning or after screens — signals tight suboccipital muscles and a cervical spine that needs mobilization.' },
      default: { name: 'Cervical Dysfunction',      emoji: '📍', description: 'Your neck pain pattern suggests muscle tightness and postural strain from forward head position — one of the most treatable pain patterns.' },
    },
    'left shoulder': {
      default: { name: 'Shoulder Impingement',     emoji: '🦾', description: 'Shoulder pain — especially when raising your arm or sleeping on it — often points to subacromial impingement or rotator cuff irritation.' },
    },
    'right shoulder': {
      default: { name: 'Shoulder Impingement',     emoji: '🦾', description: 'Shoulder pain — especially when raising your arm or sleeping on it — often points to subacromial impingement or rotator cuff irritation.' },
    },
    'left knee': {
      sharp:   { name: 'Patellofemoral Syndrome',  emoji: '🦵', description: 'Sharp knee pain around the kneecap is often patellofemoral syndrome — the kneecap tracking incorrectly due to quad/hip imbalances.' },
      default: { name: 'Knee Overuse Syndrome',    emoji: '🦵', description: 'Your knee pain pattern is consistent with overuse or biomechanical stress — often linked to hip weakness or training load spikes.' },
    },
    'right knee': {
      sharp:   { name: 'Patellofemoral Syndrome',  emoji: '🦵', description: 'Sharp knee pain around the kneecap is often patellofemoral syndrome — the kneecap tracking incorrectly due to quad/hip imbalances.' },
      default: { name: 'Knee Overuse Syndrome',    emoji: '🦵', description: 'Your knee pain pattern is consistent with overuse or biomechanical stress — often linked to hip weakness or training load spikes.' },
    },
    'left ankle': {
      default: { name: 'Ankle Instability',        emoji: '🦶', description: 'Ankle pain or stiffness often reflects poor ankle mobility, previous sprains, or calf/Achilles tightness affecting your movement chain.' },
    },
    'right ankle': {
      default: { name: 'Ankle Instability',        emoji: '🦶', description: 'Ankle pain or stiffness often reflects poor ankle mobility, previous sprains, or calf/Achilles tightness affecting your movement chain.' },
    },
    'left calf': {
      default: { name: 'Shin Splints / Calf Overload', emoji: '🏃', description: 'Calf or shin pain is classic overuse — often from training volume spikes, hard surfaces, or inadequate foot support.' },
    },
    'right calf': {
      default: { name: 'Shin Splints / Calf Overload', emoji: '🏃', description: 'Calf or shin pain is classic overuse — often from training volume spikes, hard surfaces, or inadequate foot support.' },
    },
    general: {
      default: { name: 'Musculoskeletal Imbalance', emoji: '⚖️', description: 'Your pain pattern suggests a general musculoskeletal imbalance — a mix of tightness, weakness, and postural stress that targeted movement can address.' },
    },
  };

  const locationMap = conditions[loc] || conditions['general'];
  return locationMap[painType] || locationMap['default'] || conditions['general']['default'];
};

// ─── Root cause bullets ───────────────────────────────────────────────────────
const getRootCauses = (data) => {
  const causes = [];
  const { painLocations, worstTimeTriggers, sittingHours, trainingFrequency, painDuration, painType } = data;

  if (worstTimeTriggers?.includes('sitting') || sittingHours === '6+') {
    causes.push({ icon: 'desktop-outline', text: 'Prolonged sitting compressing your joints and shortening hip flexors' });
  }
  if (worstTimeTriggers?.includes('training') || trainingFrequency === 'daily') {
    causes.push({ icon: 'barbell-outline', text: 'Training load or form issues placing excess stress on the affected area' });
  }
  if (painLocations?.includes('neck') || painLocations?.includes('upper back')) {
    causes.push({ icon: 'phone-portrait-outline', text: 'Forward head posture from screens adding up to 60 lbs of extra load on your spine' });
  }
  if (painDuration === 'months' || painDuration === 'years') {
    causes.push({ icon: 'time-outline', text: 'Long-standing pain creating compensatory movement patterns that need to be reset' });
  }
  if (painType === 'stiff') {
    causes.push({ icon: 'body-outline', text: 'Reduced joint mobility and fascial tightness limiting your range of motion' });
  }
  if (worstTimeTriggers?.includes('sleeping')) {
    causes.push({ icon: 'bed-outline', text: 'Sleep position or mattress support contributing to overnight joint load' });
  }

  // always have at least 2
  if (causes.length < 2) {
    causes.push({ icon: 'fitness-outline', text: 'Muscle imbalances between dominant and stabilizing muscle groups' });
    causes.push({ icon: 'walk-outline', text: 'Reduced movement variety limiting your body\'s natural recovery cycle' });
  }

  return causes.slice(0, 4);
};

// ─── Recovery outlook ─────────────────────────────────────────────────────────
const getOutlook = (duration, intensity) => {
  if (duration === 'just-started' || duration === 'weeks') {
    return { label: 'High', color: '#4CAF50', text: 'Fresh pain responds fast to targeted movement. Most users like you see meaningful improvement within 1–2 weeks of consistent practice.' };
  }
  if (duration === 'months') {
    return { label: 'Good', color: '#5B8DFF', text: 'Chronic pain takes more patience, but is absolutely manageable. With consistent daily practice, most users see significant relief in 3–4 weeks.' };
  }
  return { label: 'Possible', color: '#F4A426', text: 'Long-term pain has layers — but it responds to the right approach. We\'ll start gentle and progress as your body adapts. Many users with years of pain find lasting relief.' };
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PainProfileScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const {
    painLocations = [],
    painType = 'dull',
    painIntensity = 5,
    painDuration = 'weeks',
    worstTimeTriggers = [],
  } = onboardingData;

  const condition = getPainCondition(painLocations, painType, worstTimeTriggers, painDuration);
  const causes = getRootCauses(onboardingData);
  const outlook = getOutlook(painDuration, painIntensity);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const locationLabels = painLocations
    .map((l) => l.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(', ') || 'General area';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progress */}
      <View style={styles.progressHeader}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '85%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Condition reveal */}
          <View style={styles.conditionCard}>
            <Text style={styles.conditionEmoji}>{condition.emoji}</Text>
            <Text style={styles.conditionLabel}>Based on your responses</Text>
            <Text style={styles.conditionName}>{condition.name}</Text>
            <View style={styles.locationPill}>
              <Ionicons name="location-outline" size={12} color="#5B8DFF" />
              <Text style={styles.locationPillText}>{locationLabels}</Text>
            </View>
            <Text style={styles.conditionDescription}>{condition.description}</Text>
          </View>

          {/* Root causes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's likely causing it</Text>
            <View style={styles.causesCard}>
              {causes.map((cause, i) => (
                <View key={i} style={[styles.causeRow, i < causes.length - 1 && styles.causeRowBorder]}>
                  <View style={styles.causeIcon}>
                    <Ionicons name={cause.icon} size={16} color="#5B8DFF" />
                  </View>
                  <Text style={styles.causeText}>{cause.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recovery outlook */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your recovery outlook</Text>
            <View style={styles.outlookCard}>
              <View style={styles.outlookHeader}>
                <Text style={styles.outlookLabelText}>Recovery potential</Text>
                <View style={[styles.outlookBadge, { backgroundColor: outlook.color + '22', borderColor: outlook.color }]}>
                  <Text style={[styles.outlookBadgeText, { color: outlook.color }]}>{outlook.label}</Text>
                </View>
              </View>
              <Text style={styles.outlookText}>{outlook.text}</Text>
            </View>
          </View>

          {/* What we'll do */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your plan starts now</Text>
            <View style={styles.planPreview}>
              {[
                { icon: 'today-outline',          text: 'Day 1 protocol: 3 targeted exercises (7 min)' },
                { icon: 'trending-up-outline',    text: 'Progressive plan that adapts as you improve' },
                { icon: 'checkmark-done-outline', text: 'Daily check-ins to track your pain trend' },
                { icon: 'notifications-outline',  text: 'Recovery reminders built around your schedule' },
              ].map((item, i) => (
                <View key={i} style={styles.planRow}>
                  <View style={styles.planIcon}>
                    <Ionicons name={item.icon} size={16} color="#5B8DFF" />
                  </View>
                  <Text style={styles.planText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Disclaimer note */}
          <Text style={styles.disclaimer}>
            This is not a medical diagnosis. If you have severe or sudden-onset pain, please see a healthcare professional.
          </Text>

        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Day1Protocol')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>See My Day 1 Plan</Text>
          <Ionicons name="arrow-forward" size={18} color="#0E1625" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0E1625' },
  progressHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  progressBar:    { height: 3, backgroundColor: '#1F2A3D', borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: '#5B8DFF', borderRadius: 2 },
  scrollView:     { flex: 1 },
  content:        { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 },

  // Condition card
  conditionCard: {
    backgroundColor: '#111E33',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1F3A5F',
  },
  conditionEmoji:       { fontSize: 48, marginBottom: 12 },
  conditionLabel:       { fontSize: 12, color: '#5B8DFF', fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  conditionName:        { fontSize: 24, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F3A5F',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
    gap: 4,
  },
  locationPillText:     { fontSize: 12, color: '#5B8DFF', fontWeight: '600' },
  conditionDescription: { fontSize: 15, color: '#94A3B8', lineHeight: 24, textAlign: 'center' },

  // Sections
  section:              { marginBottom: 24 },
  sectionTitle:         { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },

  // Causes
  causesCard:           { backgroundColor: '#111E33', borderRadius: 16, borderWidth: 1, borderColor: '#1F2A3D', overflow: 'hidden' },
  causeRow:             { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  causeRowBorder:       { borderBottomWidth: 1, borderBottomColor: '#1F2A3D' },
  causeIcon:            { width: 30, height: 30, borderRadius: 10, backgroundColor: '#1F3A5F', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  causeText:            { fontSize: 14, color: '#94A3B8', lineHeight: 22, flex: 1 },

  // Outlook
  outlookCard:          { backgroundColor: '#111E33', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1F2A3D' },
  outlookHeader:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  outlookLabelText:     { fontSize: 14, color: '#7F8FA9', fontWeight: '600' },
  outlookBadge:         { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  outlookBadgeText:     { fontSize: 13, fontWeight: '700' },
  outlookText:          { fontSize: 14, color: '#94A3B8', lineHeight: 22 },

  // Plan preview
  planPreview:          { backgroundColor: '#111E33', borderRadius: 16, borderWidth: 1, borderColor: '#1F2A3D', overflow: 'hidden' },
  planRow:              { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#1A2535' },
  planIcon:             { width: 28, height: 28, borderRadius: 8, backgroundColor: '#1F3A5F', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  planText:             { fontSize: 14, color: '#B8C5D6', flex: 1 },

  disclaimer:           { fontSize: 11, color: '#3A4B62', textAlign: 'center', lineHeight: 17, marginTop: 8 },

  // Footer
  footer:               { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A2535' },
  continueButton:       { backgroundColor: '#5B8DFF', borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  continueButtonText:   { fontSize: 17, fontWeight: '700', color: '#0E1625' },
});
