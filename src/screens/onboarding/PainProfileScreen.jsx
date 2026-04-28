import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows } from '../../constants/brand';
import { getPainCondition, getCauses, getOutlook } from '../../constants/exerciseLibrary';

const PAIN_TYPE_META = {
  sharp:     { label: 'Sharp',     color: '#FF6B9D', icon: 'flash' },
  dull:      { label: 'Dull',      color: '#FBBF24', icon: 'radio-button-on' },
  burning:   { label: 'Burning',   color: '#FB923C', icon: 'flame' },
  stiff:     { label: 'Stiff',     color: '#818CF8', icon: 'lock-closed' },
  radiating: { label: 'Radiating', color: '#7C5CF0', icon: 'trending-down-outline' },
  numb:      { label: 'Numbness',  color: '#34D399', icon: 'hand-right-outline' },
  cramping:  { label: 'Cramping',  color: '#60A5FA', icon: 'body-outline' },
  throbbing: { label: 'Throbbing', color: '#F472B6', icon: 'pulse-outline' },
};

export default function PainProfileScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const { painLocations = [], painIntensity = 5, painTypes = [] } = onboardingData;

  const condition = getPainCondition(onboardingData);
  const causes    = getCauses(onboardingData);
  const outlook   = getOutlook(onboardingData);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const locationLabels = painLocations
    .map((l) => l.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(', ') || 'General area';

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <View style={s.progressHeader}>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: '85%' }]} />
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Condition reveal ── */}
          <View style={s.conditionCard}>
            <Text style={s.conditionEmoji}>{condition.emoji}</Text>
            <Text style={s.conditionLabel}>Based on your responses</Text>
            <Text style={s.conditionName}>{condition.name}</Text>
            <View style={s.locationPill}>
              <Ionicons name="location-outline" size={12} color={Colors.purple} />
              <Text style={s.locationPillText}>{locationLabels}</Text>
            </View>
            <Text style={s.conditionDescription}>{condition.description}</Text>

            {/* Detected symptoms */}
            {painTypes.length > 0 && (
              <View style={s.symptomsBlock}>
                <Text style={s.symptomsLabel}>DETECTED SYMPTOMS</Text>
                <View style={s.symptomsRow}>
                  {painTypes.map((type) => {
                    const meta = PAIN_TYPE_META[type];
                    if (!meta) return null;
                    return (
                      <View key={type} style={[s.symptomChip, { backgroundColor: meta.color + '18', borderColor: meta.color + '50' }]}>
                        <Ionicons name={meta.icon} size={11} color={meta.color} />
                        <Text style={[s.symptomChipText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* ── Root causes ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>What's likely causing it</Text>
            <View style={s.causesCard}>
              {causes.map((cause, i) => (
                <View key={i} style={[s.causeRow, i < causes.length - 1 && s.causeRowBorder]}>
                  <View style={s.causeIcon}>
                    <Ionicons name={cause.icon} size={15} color={Colors.purple} />
                  </View>
                  <Text style={s.causeText}>{cause.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Recovery outlook ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Your recovery outlook</Text>
            <View style={s.outlookCard}>
              <View style={s.outlookHeader}>
                <View>
                  <Text style={s.outlookLabelText}>Recovery potential</Text>
                  <Text style={s.outlookWeeks}>{outlook.weeks} with daily practice</Text>
                </View>
                <View style={[s.outlookBadge, { backgroundColor: outlook.color + '22', borderColor: outlook.color }]}>
                  <Text style={[s.outlookBadgeText, { color: outlook.color }]}>{outlook.label}</Text>
                </View>
              </View>
              <Text style={s.outlookText}>{outlook.text}</Text>
            </View>
          </View>

          {/* ── Pain intensity context ── */}
          {painIntensity >= 7 && (
            <View style={s.warningCard}>
              <Ionicons name="warning-outline" size={18} color={Colors.amber} />
              <Text style={s.warningText}>
                Pain at {painIntensity}/10 is significant. We'll start with gentle mobility and activation exercises. If pain worsens or you experience numbness or weakness, please see a healthcare professional.
              </Text>
            </View>
          )}

          {/* ── What your plan includes ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Your plan starts now</Text>
            <View style={s.planCard}>
              {[
                { icon: 'today-outline',          text: 'Day 1: 5 exercises personalized to your pain location, type, and triggers' },
                { icon: 'trending-up-outline',     text: 'Progressive loading — exercises advance as your tolerance improves' },
                { icon: 'analytics-outline',       text: 'Daily pain tracking to monitor your trend and adjust the plan' },
                { icon: 'school-outline',          text: 'Evidence-based protocols from sports medicine and physiotherapy research' },
                { icon: 'notifications-outline',   text: 'Recovery reminders timed around your daily schedule' },
              ].map((item, i) => (
                <View key={i} style={[s.planRow, i < 4 && s.planRowBorder]}>
                  <View style={s.planIcon}>
                    <Ionicons name={item.icon} size={14} color={Colors.purple} />
                  </View>
                  <Text style={s.planText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={s.disclaimer}>
            This is not a medical diagnosis. AlignPal provides movement guidance based on established physiotherapy principles. If you have severe, sudden, or neurological symptoms — see a healthcare professional.
          </Text>

        </Animated.View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.continueBtn}
          onPress={() => navigation.navigate('Day1Protocol')}
          activeOpacity={0.85}
        >
          <Text style={s.continueBtnText}>See My Day 1 Plan</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.bg },
  progressHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  progressBar:    { height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: Colors.purple, borderRadius: 2 },
  scroll:         { flex: 1 },
  content:        { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 },

  conditionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22, padding: 24,
    alignItems: 'center', marginBottom: 24,
    borderWidth: 1, borderColor: Colors.purpleDim,
    ...Shadows.purpleSoft,
  },
  conditionEmoji:       { fontSize: 48, marginBottom: 12 },
  conditionLabel:       { fontSize: 11, color: Colors.purple, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  conditionName:        { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 12, letterSpacing: -0.4 },
  locationPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.purpleDim,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginBottom: 16, gap: 4,
  },
  locationPillText:     { fontSize: 12, color: Colors.purple, fontWeight: '600' },
  conditionDescription: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, textAlign: 'center' },

  symptomsBlock: { marginTop: 18, width: '100%' },
  symptomsLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 },
  symptomsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  symptomChip:   { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  symptomChipText: { fontSize: 12, fontWeight: '700' },

  section:       { marginBottom: 24 },
  sectionTitle:  { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12, letterSpacing: -0.3 },

  causesCard:      { backgroundColor: Colors.bgCard, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  causeRow:        { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  causeRowBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  causeIcon:       { width: 28, height: 28, borderRadius: 9, backgroundColor: Colors.purpleDim, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  causeText:       { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, flex: 1 },

  outlookCard:     { backgroundColor: Colors.bgCard, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: Colors.border },
  outlookHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  outlookLabelText:{ fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  outlookWeeks:    { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  outlookBadge:    { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  outlookBadgeText:{ fontSize: 13, fontWeight: '700' },
  outlookText:     { fontSize: 13, color: Colors.textSecondary, lineHeight: 21 },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.amber + '12',
    borderWidth: 1, borderColor: Colors.amber + '40',
    borderRadius: 16, padding: 14, marginBottom: 24,
  },
  warningText: { flex: 1, fontSize: 13, color: Colors.amber, lineHeight: 20 },

  planCard:       { backgroundColor: Colors.bgCard, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  planRow:        { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  planRowBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  planIcon:       { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.purpleDim, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  planText:       { fontSize: 13, color: Colors.purplePale, flex: 1, lineHeight: 19 },

  disclaimer: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 17, marginTop: 4 },

  footer:          { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderSubtle },
  continueBtn:     { backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...Shadows.purple },
  continueBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
});
