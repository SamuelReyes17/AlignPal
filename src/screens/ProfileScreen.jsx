import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces, PainTypePalette } from '../constants/brand';
import { useOnboarding } from '../context/OnboardingContext';
import { useSubscription } from '../context/SubscriptionContext';
import GradientCard from '../components/GradientCard';
import ScreenFrame from '../components/ScreenFrame';
import { useResponsive, fs, sp } from '../utils/responsive';

const LOCATION_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', quad: 'Quads', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia', shin: 'Shin',
  chest: 'Chest', elbow: 'Elbow', abdomen: 'Core',
  left_shoulder: 'Left Shoulder', right_shoulder: 'Right Shoulder',
  left_knee: 'Left Knee', right_knee: 'Right Knee',
};


const getPainColor = (level) => {
  if (level <= 3) return Colors.green;
  if (level <= 6) return Colors.amber;
  return Colors.red;
};

const TRAINING_LABELS = {
  sedentary: 'Sedentary',
  light:     'Lightly Active',
  moderate:  'Moderately Active',
  active:    'Very Active',
};

function SettingRow({ icon, label, sub, onPress, danger, rightEl }) {
  return (
    <TouchableOpacity style={st.settingRow} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={[st.settingIcon, danger && { backgroundColor: Colors.red + '18' }]}>
        <Ionicons name={icon} size={18} color={danger ? Colors.red : Colors.textSecondary} />
      </View>
      <View style={st.settingInfo}>
        <Text style={[st.settingLabel, danger && { color: Colors.red }]}>{label}</Text>
        {sub ? <Text style={st.settingSub}>{sub}</Text> : null}
      </View>
      {rightEl || (onPress ? <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} /> : null)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { onboardingData, resetOnboarding } = useOnboarding();
  const { isPremium, presentCustomerCenter } = useSubscription();
  const insets = useSafeAreaInsets();
  const { isSmall, isTablet, horizPad, fontScale, gapScale, width } = useResponsive();
  const frameWidth = Math.min(width - horizPad * 2, 640);

  const {
    painLocations = [], painIntensity = 5, painTypes = [],
    trainingFrequency = '', ageRange = '', sittingHours = '',
  } = onboardingData;

  const painColor = getPainColor(painIntensity);

  const dyn = {
    frame:        { width: '100%', alignSelf: 'center', maxWidth: 640, paddingHorizontal: horizPad, paddingTop: sp(12, gapScale) },
    heroWrap:     { paddingBottom: sp(12, gapScale) }, // full-bleed: no horizontal padding
    heroTitle:    { fontSize: fs(30, fontScale) },
    heroEyebrow:  { fontSize: fs(12, fontScale) },
    cardWrap:     { marginHorizontal: horizPad },
    sectionWrap:  { paddingHorizontal: horizPad },
    sectionTitle: { fontSize: fs(15, fontScale) },
    subTitle:     { fontSize: fs(15, fontScale) },
    settingLabel: { fontSize: fs(14, fontScale) },
    settingSub:   { fontSize: fs(12, fontScale) },
  };

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
    <SafeAreaView style={st.container} edges={[]}>
     <ScreenFrame>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.content}>
        <View style={[st.frame, dyn.frame]}>
        {/* ═══ Full-bleed gradient hero header ═══════════════════════════════ */}
        <View style={dyn.heroWrap}>
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            corners="bottom"
            blobs={[
              { x: '88%', y: '20%', r: 80, color: Colors.white, opacity: 0.10 },
              { x: '12%', y: '90%', r: 50, color: Colors.white, opacity: 0.06 },
            ]}
            style={[Shadows.purpleSoft, { paddingTop: insets.top }]}
          >
            <View style={st.heroRow}>
              <View>
                <Text style={[st.heroEyebrow, dyn.heroEyebrow]}>Your</Text>
                <Text style={[st.heroTitle, dyn.heroTitle]}>Profile</Text>
              </View>
              <View style={st.heroPlanBadge}>
                <Ionicons name={isPremium ? 'star' : 'person'} size={13} color={Colors.white} />
                <Text style={st.heroPlanText}>{isPremium ? 'Pro' : 'Free'}</Text>
              </View>
            </View>
            <View style={st.heroPainRow}>
              <Text style={st.heroPainLabel}>Current pain</Text>
              <View style={st.heroPainPill}>
                <View style={[st.heroPainDot, { backgroundColor: painColor }]} />
                <Text style={st.heroPainNum}>{painIntensity}/10</Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Pain profile card */}
        <View style={[st.profileCard, dyn.cardWrap]}>
          <Text style={st.cardLabel}>PAIN PROFILE</Text>

          {/* Locations */}
          {painLocations.length > 0 && (
            <View style={st.profileRow}>
              <Ionicons name="location-outline" size={15} color={Colors.purple} />
              <View style={st.locationChips}>
                {painLocations.map((loc) => (
                  <View key={loc} style={st.locChip}>
                    <Text style={st.locChipText}>
                      {LOCATION_LABELS[loc] || loc.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Intensity */}
          <View style={st.intensityRow}>
            <Text style={st.intensityLabel}>Pain Intensity</Text>
            <View style={st.intensityRight}>
              <View style={st.intensityBar}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      st.intensitySegment,
                      i < painIntensity && { backgroundColor: getPainColor(i + 1) },
                    ]}
                  />
                ))}
              </View>
              <Text style={[st.intensityNum, { color: painColor }]}>{painIntensity}/10</Text>
            </View>
          </View>

          {/* Pain types */}
          {painTypes.length > 0 && (
            <View style={st.typeRow}>
              {painTypes.map(t => {
                const meta = PainTypePalette[t];
                if (!meta) return null;
                return (
                  <View key={t} style={[st.typeChip, { backgroundColor: meta.color + '18', borderColor: meta.color + '40' }]}>
                    <Text style={[st.typeChipText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Lifestyle */}
          <View style={st.divider} />
          <View style={st.lifestyleGrid}>
            {ageRange ? (
              <View style={st.lifeItem}>
                <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
                <Text style={st.lifeLabel}>Age</Text>
                <Text style={st.lifeVal}>{ageRange}</Text>
              </View>
            ) : null}
            {trainingFrequency ? (
              <View style={st.lifeItem}>
                <Ionicons name="fitness-outline" size={14} color={Colors.textMuted} />
                <Text style={st.lifeLabel}>Activity</Text>
                <Text style={st.lifeVal}>{TRAINING_LABELS[trainingFrequency] || trainingFrequency}</Text>
              </View>
            ) : null}
            {sittingHours ? (
              <View style={st.lifeItem}>
                <Ionicons name="desktop-outline" size={14} color={Colors.textMuted} />
                <Text style={st.lifeLabel}>Sitting</Text>
                <Text style={st.lifeVal}>{sittingHours}h/day</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Subscription card */}
        <View style={[st.subCard, dyn.cardWrap, isPremium && st.subCardPro]}>
          <View style={st.subLeft}>
            <View style={[st.subIconWrap, isPremium && { backgroundColor: Colors.amber + '22' }]}>
              <Ionicons name={isPremium ? 'star' : 'lock-closed-outline'} size={22} color={isPremium ? Colors.amber : Colors.textMuted} />
            </View>
            <View>
              <Text style={[st.subTitle, dyn.subTitle]}>{isPremium ? 'AlignPal Pro' : 'Free Plan'}</Text>
              <Text style={st.subSub}>{isPremium ? 'Full access enabled' : 'Unlock all features'}</Text>
            </View>
          </View>
          {isPremium ? (
            <TouchableOpacity style={st.subManageBtn} onPress={presentCustomerCenter} activeOpacity={0.7}>
              <Text style={st.subManageText}>Manage</Text>
            </TouchableOpacity>
          ) : (
            <View style={[st.subManageBtn, { backgroundColor: Colors.amber + '20', borderColor: Colors.amber + '50' }]}>
              <Text style={[st.subManageText, { color: Colors.amber }]}>Upgrade</Text>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={[st.section, dyn.sectionWrap]}>
          <Text style={[st.sectionTitle, dyn.sectionTitle]}>Settings</Text>
          <View style={st.settingsCard}>
            <SettingRow
              icon="create-outline"
              label="Edit Pain Profile"
              sub="Redo your onboarding assessment"
              onPress={handleReset}
            />
            <View style={st.rowDivider} />
            <SettingRow
              icon="notifications-outline"
              label="Reminders"
              sub="Daily check-in notifications"
              rightEl={
                <View style={st.comingSoon}>
                  <Text style={st.comingSoonText}>Soon</Text>
                </View>
              }
            />
            <View style={st.rowDivider} />
            <SettingRow
              icon="camera-outline"
              label="Posture Analysis"
              sub="AI-powered posture scan"
              rightEl={
                <View style={st.comingSoon}>
                  <Text style={st.comingSoonText}>Soon</Text>
                </View>
              }
            />
          </View>
        </View>

        <View style={[st.section, dyn.sectionWrap]}>
          <Text style={[st.sectionTitle, dyn.sectionTitle]}>About</Text>
          <View style={st.settingsCard}>
            <SettingRow icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => {}} />
            <View style={st.rowDivider} />
            <SettingRow icon="document-text-outline" label="Terms of Service" onPress={() => {}} />
            <View style={st.rowDivider} />
            <SettingRow
              icon="information-circle-outline"
              label="Version"
              rightEl={<Text style={st.versionText}>1.0.0</Text>}
            />
          </View>
        </View>

        <View style={[st.section, dyn.sectionWrap]}>
          <View style={st.settingsCard}>
            <SettingRow
              icon="refresh-outline"
              label="Reset All Data"
              sub="Clears profile and restarts setup"
              onPress={handleReset}
              danger
            />
          </View>
        </View>

        <Text style={st.footer}>AlignPal · Built with care for your recovery</Text>
        <View style={{ height: 24 }} />
        </View>
      </ScrollView>
     </ScreenFrame>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { paddingBottom: Spacing.tabBarClearance },
  frame:     { width: '100%', alignSelf: 'center' },

  // Hero
  heroRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEyebrow:    { fontSize: 12, color: Surfaces.onNavy85, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroTitle:      { fontSize: 30, fontWeight: '800', color: Colors.white, letterSpacing: -0.6, marginTop: 2 },
  heroPlanBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy22, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  heroPlanText:   { color: Colors.white, fontWeight: '800', fontSize: 13 },
  heroPainRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md, backgroundColor: Surfaces.onNavy14, borderRadius: Radius.lg, paddingHorizontal: 14, paddingVertical: 10 },
  heroPainLabel:  { color: Surfaces.onNavy85, fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  heroPainPill:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy22, borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  heroPainDot:    { width: 8, height: 8, borderRadius: 4 },
  heroPainNum:    { color: Colors.white, fontSize: 13, fontWeight: '800' },

  profileCard: {
    marginBottom: 12, backgroundColor: Colors.bgCard,
    borderRadius: 22, padding: 18, borderWidth: 1, borderColor: Colors.border, ...Shadows.purpleSoft,
  },
  cardLabel:      { fontSize: 10, fontWeight: '800', color: Colors.purple, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 },
  profileRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 14 },
  locationChips:  { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  locChip:        { backgroundColor: Colors.purpleDim, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1, borderColor: Colors.purple + '40' },
  locChipText:    { fontSize: 12, fontWeight: '600', color: Colors.purple },

  intensityRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  intensityLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  intensityRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  intensityBar:   { flexDirection: 'row', gap: 2 },
  intensitySegment: { width: 12, height: 6, borderRadius: 3, backgroundColor: Colors.bgElevated },
  intensityNum:   { fontSize: 14, fontWeight: '800', minWidth: 36, textAlign: 'right' },

  typeRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  typeChip:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  typeChipText: { fontSize: 11, fontWeight: '700' },

  divider:       { height: 1, backgroundColor: Colors.borderSubtle, marginBottom: 14 },
  lifestyleGrid: { flexDirection: 'row', gap: 16 },
  lifeItem:      { flex: 1, alignItems: 'center', gap: 4 },
  lifeLabel:     { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  lifeVal:       { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },

  subCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, backgroundColor: Colors.bgCard,
    borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  subCardPro: { borderColor: Colors.amber + '40', backgroundColor: Colors.amber + '08' },
  subLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subIconWrap:   { width: 46, height: 46, borderRadius: 14, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  subTitle:      { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  subSub:        { fontSize: 12, color: Colors.textMuted },
  subManageBtn:  { backgroundColor: Colors.bgInput, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  subManageText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },

  section:      { marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.textSecondary, marginBottom: 10, letterSpacing: 0.3 },

  settingsCard: { backgroundColor: Colors.bgCard, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  settingRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingIcon:  { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  settingInfo:  { flex: 1, gap: 2 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  settingSub:   { fontSize: 12, color: Colors.textMuted },
  rowDivider:   { height: 1, backgroundColor: Colors.borderSubtle, marginLeft: 64 },

  comingSoon:     { backgroundColor: Colors.bgInput, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.border },
  comingSoonText: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  versionText:    { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },

  footer: { fontSize: 12, color: Colors.textDisabled, textAlign: 'center', paddingVertical: 16 },
});
