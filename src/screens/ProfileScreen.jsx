import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useOnboarding } from '../context/OnboardingContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Colors, KitColors, KitAccents, KitRadius, KitSpacing, PainTypePalette } from '../constants/brand';
import { GradientCard, ListCard, ListRow, Chip } from '../components/kit';
import { useResponsive, fs, sp } from '../utils/responsive';

/**
 * ProfileScreen — Me tab.
 *
 * Uniform layout (matches Dashboard/History/Workout/Explore):
 *  - Header row (eyebrow + title + plan badge)
 *  - Violet hero with current pain summary
 *  - Pain profile card (locations, intensity, types, lifestyle)
 *  - Subscription card
 *  - Settings sections
 *
 * Data wiring preserved:
 *  - useOnboarding() onboardingData + resetOnboarding
 *  - useSubscription() isPremium + presentCustomerCenter
 */

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', quad: 'Quads', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia', shin: 'Shin',
  chest: 'Chest', elbow: 'Elbow', abdomen: 'Core',
  left_shoulder: 'Left Shoulder', right_shoulder: 'Right Shoulder',
  left_knee: 'Left Knee', right_knee: 'Right Knee',
};
const TRAINING_LABELS = {
  sedentary: 'Sedentary',
  light:     'Lightly Active',
  moderate:  'Moderately Active',
  active:    'Very Active',
};
const getPainColor = (level) => {
  if (level <= 3) return KitAccents.avocado;
  if (level <= 6) return Colors.amber;
  return KitAccents.coral;
};

function SettingRow({ icon, label, sub, onPress, danger, rightEl }) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View
        style={[
          styles.settingIcon,
          danger && { backgroundColor: KitAccents.coral + '20' },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? KitAccents.coral : KitColors.text2}
        />
      </View>
      <View style={styles.settingInfo}>
        <Text
          style={[
            styles.settingLabel,
            danger && { color: KitAccents.coral },
          ]}
        >
          {label}
        </Text>
        {sub ? <Text style={styles.settingSub}>{sub}</Text> : null}
      </View>
      {rightEl ||
        (onPress ? <Ionicons name="chevron-forward" size={16} color={KitColors.text3} /> : null)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { onboardingData, resetOnboarding } = useOnboarding();
  const { isPremium, presentCustomerCenter } = useSubscription();

  const { isSmall, isTablet, horizPad, frameWidth, fontScale, gapScale } = useResponsive();
  const dyn = {
    content:    { paddingHorizontal: horizPad, gap: sp(KitSpacing.s5, gapScale) },
    name:       { fontSize: fs(22, fontScale) },
    eyebrow:    { fontSize: fs(13, fontScale) },
    sectionTitle:{ fontSize: fs(14, fontScale) },
    frame:      { width: '100%', alignSelf: 'center', maxWidth: Math.max(frameWidth, 0) },
  };

  const {
    painLocations = [], painIntensity = 5, painTypes = [],
    trainingFrequency = '', ageRange = '', sittingHours = '',
  } = onboardingData;

  const painColor = getPainColor(painIntensity);

  function handleReset() {
    Alert.alert(
      'Reset Pain Profile',
      'This will clear all your onboarding data and restart the setup. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetOnboarding },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, dyn.content]}
        showsVerticalScrollIndicator={false}
      >
       <View style={dyn.frame}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.eyebrow, dyn.eyebrow]}>Your</Text>
            <Text style={[styles.name, dyn.name]} numberOfLines={1}>Profile</Text>
          </View>
          <View style={[styles.planBadge, isPremium && styles.planBadgePro]}>
            <Ionicons
              name={isPremium ? 'star' : 'person-outline'}
              size={14}
              color={isPremium ? Colors.amber : KitColors.text2}
            />
            <Text style={[styles.planBadgeText, isPremium && { color: Colors.amber }]}>
              {isPremium ? 'Pro' : 'Free'}
            </Text>
          </View>
        </View>

        {/* Violet hero — current pain summary */}
        <GradientCard variant="violet">
          <Text style={styles.heroEyebrow}>Current pain</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroBigNum}>{painIntensity}/10</Text>
            <View style={[styles.heroDot, { backgroundColor: painColor }]} />
          </View>
          <Text style={styles.heroSub}>
            {painLocations.length > 0
              ? painLocations
                  .slice(0, 3)
                  .map((loc) => LOCATION_LABELS[loc] || loc.replace(/_/g, ' '))
                  .join(' · ')
              : 'No areas selected'}
          </Text>
        </GradientCard>

        {/* Pain profile card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PAIN PROFILE</Text>

          {painLocations.length > 0 && (
            <View style={styles.chipsRow}>
              {painLocations.map((loc) => (
                <Chip
                  key={loc}
                  label={LOCATION_LABELS[loc] || loc.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  variant="violet"
                />
              ))}
            </View>
          )}

          {/* Intensity bar */}
          <View style={styles.intensityRow}>
            <Text style={styles.intensityLabel}>Pain intensity</Text>
            <View style={styles.intensityRight}>
              <View style={styles.intensityBar}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.intensitySegment,
                      i < painIntensity && { backgroundColor: getPainColor(i + 1) },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.intensityNum, { color: painColor }]}>
                {painIntensity}/10
              </Text>
            </View>
          </View>

          {painTypes.length > 0 && (
            <View style={styles.chipsRow}>
              {painTypes.map((t) => {
                const meta = PainTypePalette[t];
                if (!meta) return null;
                return (
                  <View
                    key={t}
                    style={[
                      styles.typeChip,
                      { backgroundColor: meta.color + '18', borderColor: meta.color + '40' },
                    ]}
                  >
                    <Text style={[styles.typeChipText, { color: meta.color }]}>
                      {meta.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.lifestyleGrid}>
            {ageRange ? (
              <View style={styles.lifeItem}>
                <Ionicons name="person-outline" size={14} color={KitColors.text3} />
                <Text style={styles.lifeLabel}>Age</Text>
                <Text style={styles.lifeVal} numberOfLines={1}>{ageRange}</Text>
              </View>
            ) : null}
            {trainingFrequency ? (
              <View style={styles.lifeItem}>
                <Ionicons name="fitness-outline" size={14} color={KitColors.text3} />
                <Text style={styles.lifeLabel}>Activity</Text>
                <Text style={styles.lifeVal} numberOfLines={1}>
                  {TRAINING_LABELS[trainingFrequency] || trainingFrequency}
                </Text>
              </View>
            ) : null}
            {sittingHours ? (
              <View style={styles.lifeItem}>
                <Ionicons name="desktop-outline" size={14} color={KitColors.text3} />
                <Text style={styles.lifeLabel}>Sitting</Text>
                <Text style={styles.lifeVal} numberOfLines={1}>{sittingHours}h/day</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Subscription card */}
        <TouchableOpacity
          style={[styles.card, styles.subCard, isPremium && styles.subCardPro]}
          activeOpacity={isPremium ? 0.7 : 1}
          onPress={isPremium ? presentCustomerCenter : undefined}
        >
          <View style={styles.subLeft}>
            <View style={[styles.subIconWrap, isPremium && { backgroundColor: Colors.amber + '22' }]}>
              <Ionicons
                name={isPremium ? 'star' : 'lock-closed-outline'}
                size={20}
                color={isPremium ? Colors.amber : KitColors.text2}
              />
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.subTitle} numberOfLines={1}>
                {isPremium ? 'AlignPal Pro' : 'Free Plan'}
              </Text>
              <Text style={styles.subSub} numberOfLines={1}>
                {isPremium ? 'Full access enabled' : 'Unlock all features'}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.subActionPill,
              isPremium ? styles.subActionPillPro : styles.subActionPillUpgrade,
            ]}
          >
            <Text
              style={[
                styles.subActionText,
                isPremium ? { color: Colors.amber } : { color: KitAccents.violet },
              ]}
            >
              {isPremium ? 'Manage' : 'Upgrade'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <Text style={[styles.sectionLabel, dyn.sectionTitle]}>SETTINGS</Text>
        <ListCard>
          <ListRow
            icon="✎"
            iconColor="violet"
            title="Edit pain profile"
            sub="Redo your onboarding assessment"
            trailing="›"
            onPress={handleReset}
          />
          <ListRow
            icon="🔔"
            iconColor="teal"
            title="Reminders"
            sub="Daily check-in notifications"
            trailing="Soon"
          />
          <ListRow
            icon="◎"
            iconColor="pink"
            title="Posture analysis"
            sub="AI-powered posture scan"
            trailing="Soon"
          />
        </ListCard>

        {/* About */}
        <Text style={[styles.sectionLabel, dyn.sectionTitle]}>ABOUT</Text>
        <ListCard>
          <ListRow icon="🛡" iconColor="violet" title="Privacy policy" trailing="›" onPress={() => {}} />
          <ListRow icon="📄" iconColor="violet" title="Terms of service" trailing="›" onPress={() => {}} />
          <ListRow icon="ⓘ"  iconColor="violet" title="Version" trailing="1.0.0" />
        </ListCard>

        {/* Danger zone */}
        <ListCard>
          <ListRow
            icon="⟲"
            iconColor="coral"
            title="Reset all data"
            sub="Clears profile and restarts setup"
            onPress={handleReset}
          />
        </ListCard>

        <Text style={styles.footer}>AlignPal · Built with care for your recovery</Text>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KitColors.bg },
  content:   { paddingTop: 22, paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  eyebrow: { color: KitColors.text3, fontSize: 13, fontWeight: '500' },
  name: {
    fontSize: 22, fontWeight: '700', color: KitColors.text1,
    letterSpacing: -0.4, marginTop: 2,
  },
  planBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline, borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  planBadgePro: {
    borderColor: Colors.amber + '60',
    backgroundColor: Colors.amber + '10',
  },
  planBadgeText: { color: KitColors.text2, fontWeight: '700', fontSize: 13 },

  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 8,
  },
  heroBigNum: {
    color: '#FFFFFF', fontSize: 42, fontWeight: '800',
    letterSpacing: -1, lineHeight: 42,
  },
  heroDot: { width: 12, height: 12, borderRadius: 6 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },

  card: {
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline, borderWidth: 1,
    borderRadius: KitRadius.lg, padding: 18,
  },
  cardLabel: {
    fontSize: 10, fontWeight: '800',
    color: KitAccents.violet,
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 14,
  },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  typeChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1,
  },
  typeChipText: { fontSize: 11, fontWeight: '700' },

  intensityRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14, gap: 12,
  },
  intensityLabel: { fontSize: 13, fontWeight: '600', color: KitColors.text2, flexShrink: 1 },
  intensityRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  intensityBar:   { flexDirection: 'row', gap: 2 },
  intensitySegment: {
    width: 10, height: 6, borderRadius: 3,
    backgroundColor: KitColors.surface2,
  },
  intensityNum: { fontSize: 14, fontWeight: '800', minWidth: 36, textAlign: 'right' },

  divider: { height: 1, backgroundColor: KitColors.hairline, marginBottom: 14 },
  lifestyleGrid: { flexDirection: 'row', gap: 16 },
  lifeItem:  { flex: 1, alignItems: 'center', gap: 4, minWidth: 0 },
  lifeLabel: { fontSize: 10, color: KitColors.text3, fontWeight: '600' },
  lifeVal:   { fontSize: 12, fontWeight: '700', color: KitColors.text2, textAlign: 'center' },

  subCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, gap: 12,
  },
  subCardPro: {
    borderColor: Colors.amber + '40',
    backgroundColor: Colors.amber + '08',
  },
  subLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  subIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: KitColors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  subTitle: { fontSize: 15, fontWeight: '700', color: KitColors.text1, marginBottom: 2 },
  subSub:   { fontSize: 12, color: KitColors.text3 },
  subActionPill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1,
  },
  subActionPillPro:     { backgroundColor: Colors.amber + '14',     borderColor: Colors.amber + '50' },
  subActionPillUpgrade: { backgroundColor: KitAccents.violet + '20', borderColor: KitAccents.violet + '60' },
  subActionText: { fontSize: 13, fontWeight: '700' },

  sectionLabel: {
    fontSize: 12, fontWeight: '800',
    color: KitColors.text3, letterSpacing: 1.2,
    marginTop: KitSpacing.s2, marginBottom: -KitSpacing.s2,
  },

  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomColor: KitColors.hairline,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: KitColors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  settingInfo:  { flex: 1, gap: 2, minWidth: 0 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: KitColors.text1 },
  settingSub:   { fontSize: 12, color: KitColors.text3 },

  footer: {
    fontSize: 12, color: KitColors.text3,
    textAlign: 'center', paddingVertical: 16,
  },
});
