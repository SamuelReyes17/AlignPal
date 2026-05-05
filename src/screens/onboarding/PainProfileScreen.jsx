import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces } from '../../constants/brand';
import { getPainCondition, getCauses, getOutlook, analyzePainDescription } from '../../constants/exerciseLibrary';
import GradientCard from '../../components/GradientCard';
import CircularProgress from '../../components/CircularProgress';
import BarChart from '../../components/BarChart';
import ScreenFrame from '../../components/ScreenFrame';
import { useResponsive, fs, sp } from '../../utils/responsive';

const PAIN_TYPE_META = {
  sharp:     { label: 'Sharp',     color: Accents.pink,    icon: 'flash' },
  dull:      { label: 'Dull',      color: Accents.sunny,   icon: 'radio-button-on' },
  burning:   { label: 'Burning',   color: Accents.coral,   icon: 'flame' },
  stiff:     { label: 'Stiff',     color: Accents.violet,  icon: 'lock-closed' },
  radiating: { label: 'Radiating', color: Colors.purple,   icon: 'trending-down-outline' },
  numb:      { label: 'Numbness',  color: Accents.teal,    icon: 'hand-right-outline' },
  cramping:  { label: 'Cramping',  color: Accents.sky,     icon: 'body-outline' },
  throbbing: { label: 'Throbbing', color: Accents.pink,    icon: 'pulse-outline' },
};

const OUTLOOK_PERCENT = {
  High:     0.85,
  Moderate: 0.65,
  Low:      0.40,
};

export default function PainProfileScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const { painLocations = [], painIntensity = 5, painTypes = [], painDescription = '' } = onboardingData;
  const { width } = useWindowDimensions();
  const { isSmall, isTablet, isShort, horizPad, fontScale, gapScale } = useResponsive();

  // Wider cap for content-heavy screens (chart + multi-section layout)
  const wideFrame = Math.min(width - horizPad * 2, 640);

  const condition   = getPainCondition(onboardingData);
  const causes      = getCauses(onboardingData);
  const outlook     = getOutlook(onboardingData);
  const descSignals = analyzePainDescription(painDescription);
  const hasDesc     = painDescription.trim().length > 10;
  const hasInsights = hasDesc && descSignals?.insights?.length > 0;
  const hasRedFlags = hasDesc && descSignals?.redFlags?.length > 0;

  const recoveryPct = OUTLOOK_PERCENT[outlook.label] ?? 0.6;
  const recoveryDisplay = `${Math.round(recoveryPct * 100)}%`;

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

  const factorData = [
    { label: 'Sit',     value: onboardingData.sittingHours === '6+' ? 9 : onboardingData.sittingHours === '3-5' ? 6 : 3, color: Accents.coral },
    { label: 'Load',    value: onboardingData.trainingFrequency === 'active' ? 7 : onboardingData.trainingFrequency === 'moderate' ? 5 : onboardingData.trainingFrequency === 'light' ? 3 : 2, color: Accents.sunny },
    { label: 'Pain',    value: painIntensity, color: painIntensity >= 7 ? Accents.pink : painIntensity >= 4 ? Accents.sunny : Accents.avocado },
    { label: 'Symptoms',value: Math.min(8, painTypes.length * 2 + 2), color: Accents.teal },
    { label: 'Triggers',value: Math.min(8, (onboardingData.worstTimeTriggers?.length || 0) + 1), color: Accents.violet },
  ];

  const intensityColor = painIntensity >= 7 ? Accents.pink : painIntensity >= 4 ? Accents.sunny : Accents.avocado;

  // Hero ring size scales with device tier
  const ringSize = isSmall ? 140 : isTablet ? 200 : 170;
  const chartHeight = isSmall ? 110 : isTablet ? 150 : 130;
  const chartBarWidth = isSmall ? 22 : isTablet ? 32 : 26;

  const dyn = {
    content:       { paddingHorizontal: horizPad, paddingTop: 4, paddingBottom: sp(32, gapScale) },
    frame:         { maxWidth: wideFrame },
    eyebrowText:   { fontSize: fs(10, fontScale) },
    eyebrowSub:    { fontSize: fs(11, fontScale) },
    heroTitle:     { fontSize: fs(28, fontScale), lineHeight: fs(34, fontScale) },
    heroSub:       { fontSize: fs(13, fontScale) },
    heroSymptomChipText: { fontSize: fs(11, fontScale) },
    statCardLabel: { fontSize: fs(10, fontScale) },
    statValueBig:  { fontSize: fs(38, fontScale), lineHeight: fs(42, fontScale) },
    statValueSub:  { fontSize: fs(14, fontScale) },
    statCardFooter:{ fontSize: fs(12, fontScale) },
    chartTitle:    { fontSize: fs(16, fontScale) },
    chartSub:      { fontSize: fs(12, fontScale) },
    sectionTitle:  { fontSize: fs(17, fontScale) },
    sectionCount:  { fontSize: fs(11, fontScale) },
    quoteText:     { fontSize: fs(14, fontScale), lineHeight: fs(22, fontScale) },
    quoteLabel:    { fontSize: fs(10, fontScale) },
    insightTitle:  { fontSize: fs(13, fontScale) },
    insightText:   { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    causeNumberText: { fontSize: fs(12, fontScale) },
    causeText:     { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    outlookHeaderTitle: { fontSize: fs(22, fontScale) },
    outlookHeaderBadgeText: { fontSize: fs(11, fontScale) },
    outlookText:   { fontSize: fs(13, fontScale), lineHeight: fs(21, fontScale) },
    warningText:   { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    redFlagText:   { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    planTitle:     { fontSize: fs(18, fontScale) },
    planSub:       { fontSize: fs(12, fontScale) },
    planItemText:  { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    disclaimer:    { fontSize: fs(11, fontScale), lineHeight: fs(17, fontScale) },
    continueBtnText: { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 18 : 28, paddingTop: 12 },
    footerInner:   { maxWidth: wideFrame },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
     <ScreenFrame>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, dyn.content]}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        bounces
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[s.frame, dyn.frame, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* ── Eyebrow ── */}
          <View style={s.eyebrow}>
            <Text style={[s.eyebrowText, dyn.eyebrowText]}>YOUR PAIN PROFILE</Text>
            <View style={s.eyebrowDot} />
            <Text style={[s.eyebrowSub, dyn.eyebrowSub]}>Based on {painLocations.length + painTypes.length + 4} responses</Text>
          </View>

          {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            blobs={[
              { x: '85%', y: '15%', r: 90, color: '#FFFFFF', opacity: 0.10 },
              { x: '15%', y: '90%', r: 70, color: '#FFFFFF', opacity: 0.06 },
            ]}
            style={s.heroCard}
          >
            <View style={s.heroTopRow}>
              <View style={s.heroBadgePill}>
                <Text style={s.heroBadgePillText}>{condition.emoji}  Diagnosis</Text>
              </View>
              <View style={s.heroOutlookPill}>
                <View style={[s.heroOutlookDot, { backgroundColor: Accents.avocado }]} />
                <Text style={s.heroOutlookText}>{outlook.label}</Text>
              </View>
            </View>

            <Text style={[s.heroTitle, dyn.heroTitle]}>{condition.name}</Text>
            <Text style={[s.heroSub, dyn.heroSub]}>{locationLabels}</Text>

            <View style={s.heroRingWrap}>
              <CircularProgress
                size={ringSize}
                strokeWidth={isSmall ? 12 : 14}
                progress={recoveryPct}
                trackColor={Surfaces.onNavy08}
                gradient={['#9B8BF4', '#7C5CF0']}
                centerLabel="Recovery"
                centerValue={recoveryDisplay}
                centerValueColor="#FFFFFF"
                centerSub={outlook.weeks}
              />
            </View>

            {painTypes.length > 0 && (
              <View style={s.heroSymptomRow}>
                {painTypes.slice(0, 4).map((type) => {
                  const meta = PAIN_TYPE_META[type];
                  if (!meta) return null;
                  return (
                    <View key={type} style={s.heroSymptomChip}>
                      <Ionicons name={meta.icon} size={11} color="#FFFFFF" />
                      <Text style={[s.heroSymptomChipText, dyn.heroSymptomChipText]}>{meta.label}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </GradientCard>

          {/* ═══ Stat row ════════════════════════════════════════════════════════ */}
          <View style={s.statsRow}>
            <View style={[s.statCard, { backgroundColor: intensityColor }]}>
              <Text style={[s.statCardLabel, dyn.statCardLabel]}>PAIN LEVEL</Text>
              <View style={s.statValueRow}>
                <Text style={[s.statValueBig, dyn.statValueBig]}>{painIntensity}</Text>
                <Text style={[s.statValueSub, dyn.statValueSub]}>/10</Text>
              </View>
              <Text style={[s.statCardFooter, dyn.statCardFooter]}>
                {painIntensity >= 7 ? 'Significant' : painIntensity >= 4 ? 'Moderate' : 'Mild'}
              </Text>
            </View>
            <View style={[s.statCard, { backgroundColor: Accents.teal }]}>
              <Text style={[s.statCardLabel, dyn.statCardLabel]}>DAILY PRACTICE</Text>
              <View style={s.statValueRow}>
                <Text style={[s.statValueBig, dyn.statValueBig]}>5</Text>
                <Text style={[s.statValueSub, dyn.statValueSub]}>exercises</Text>
              </View>
              <Text style={[s.statCardFooter, dyn.statCardFooter]}>Personalized for you</Text>
            </View>
          </View>

          {/* ═══ Bar chart ═══════════════════════════════════════════════════════ */}
          <View style={s.chartCard}>
            <View style={s.chartHead}>
              <View>
                <Text style={[s.chartTitle, dyn.chartTitle]}>What's driving your pain</Text>
                <Text style={[s.chartSub, dyn.chartSub]}>Higher bar = bigger contributor</Text>
              </View>
              <View style={s.chartBadge}>
                <Ionicons name="analytics" size={14} color={Accents.coral} />
              </View>
            </View>
            <View style={{ marginTop: 18 }}>
              <BarChart data={factorData} maxValue={10} height={chartHeight} barWidth={chartBarWidth} />
            </View>
          </View>

          {/* ═══ Red flags ═══════════════════════════════════════════════════════ */}
          {hasRedFlags && descSignals.redFlags.map((flag, i) => (
            <View key={i} style={s.redFlagCard}>
              <Ionicons name="alert-circle" size={18} color={Colors.red} />
              <Text style={[s.redFlagText, dyn.redFlagText]}>{flag}</Text>
            </View>
          ))}

          {/* ═══ Description quote ═══════════════════════════════════════════════ */}
          {hasDesc && (
            <View style={s.quoteCard}>
              <View style={s.quoteHeader}>
                <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors.purple} />
                <Text style={[s.quoteLabel, dyn.quoteLabel]}>YOUR DESCRIPTION</Text>
              </View>
              <Text style={[s.quoteText, dyn.quoteText]}>"{painDescription.trim()}"</Text>
            </View>
          )}

          {/* ═══ Clinical insights ═══════════════════════════════════════════════ */}
          {hasInsights && (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <Text style={[s.sectionTitle, dyn.sectionTitle]}>Root-cause analysis</Text>
                <Text style={[s.sectionCount, dyn.sectionCount]}>{descSignals.insights.length} patterns</Text>
              </View>
              <Text style={s.sectionSubtitle}>From what you wrote</Text>
              <View style={s.insightsCard}>
                {descSignals.insights.map((insight, i) => (
                  <View key={i} style={[s.insightRow, i < descSignals.insights.length - 1 && s.insightBorder]}>
                    <View style={[s.insightIconWrap, { backgroundColor: (insight.color || Colors.purple) + '22' }]}>
                      <Ionicons name={insight.icon} size={15} color={insight.color || Colors.purple} />
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={[s.insightTitle, dyn.insightTitle, { color: insight.color || Colors.purpleLight }]}>{insight.title}</Text>
                      <Text style={[s.insightText, dyn.insightText]}>{insight.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ═══ Causes ══════════════════════════════════════════════════════════ */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, dyn.sectionTitle]}>Likely causes</Text>
              <Text style={[s.sectionCount, dyn.sectionCount]}>{causes.length} factors</Text>
            </View>
            <View style={s.causesCard}>
              {causes.map((cause, i) => {
                const palette = [Accents.coral, Accents.sunny, Accents.teal, Accents.violet, Accents.pink];
                const color = palette[i % palette.length];
                return (
                  <View key={i} style={[s.causeRow, i < causes.length - 1 && s.causeRowBorder]}>
                    <View style={[s.causeNumber, { backgroundColor: color + '22', borderColor: color + '55' }]}>
                      <Text style={[s.causeNumberText, dyn.causeNumberText, { color }]}>{String(i + 1).padStart(2, '0')}</Text>
                    </View>
                    <Text style={[s.causeText, dyn.causeText]}>{cause.text}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ═══ Outlook detail ══════════════════════════════════════════════════ */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, dyn.sectionTitle]}>Recovery outlook</Text>
            <GradientCard
              colors={Gradients.teal}
              radius={Radius.xl}
              blobs={[{ x: '90%', y: '50%', r: 60, color: '#FFFFFF', opacity: 0.10 }]}
              style={{ minHeight: 100 }}
            >
              <View style={s.outlookHeader}>
                <Text style={[s.outlookHeaderTitle, dyn.outlookHeaderTitle]}>{outlook.weeks}</Text>
                <View style={s.outlookHeaderBadge}>
                  <Text style={[s.outlookHeaderBadgeText, dyn.outlookHeaderBadgeText]}>{outlook.label}</Text>
                </View>
              </View>
              <Text style={[s.outlookText, dyn.outlookText]}>{outlook.text}</Text>
            </GradientCard>
          </View>

          {/* ═══ Pain warning ════════════════════════════════════════════════════ */}
          {painIntensity >= 7 && (
            <View style={s.warningCard}>
              <Ionicons name="warning-outline" size={18} color={Colors.amber} />
              <Text style={[s.warningText, dyn.warningText]}>
                Pain at {painIntensity}/10 is significant. We'll start with gentle mobility and activation. If pain worsens or you feel numbness or weakness, see a healthcare professional.
              </Text>
            </View>
          )}

          {/* ═══ Plan ════════════════════════════════════════════════════════════ */}
          <View style={s.section}>
            <GradientCard
              colors={Gradients.pink}
              radius={Radius.xl}
              blobs={[
                { x: '90%', y: '20%', r: 70, color: '#FFFFFF', opacity: 0.12 },
                { x: '10%', y: '95%', r: 50, color: '#FFFFFF', opacity: 0.08 },
              ]}
            >
              <View style={s.planHead}>
                <View>
                  <Text style={[s.planTitle, dyn.planTitle]}>Your plan starts now</Text>
                  <Text style={[s.planSub, dyn.planSub]}>5 steps · Updates daily</Text>
                </View>
                <View style={s.planIconBubble}>
                  <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                </View>
              </View>
              <View style={s.planList}>
                {[
                  { icon: 'today-outline',         text: 'Day 1: 5 exercises personalized to your pain' },
                  { icon: 'trending-up-outline',   text: 'Progressive loading as your tolerance improves' },
                  { icon: 'analytics-outline',     text: 'Daily pain tracking to monitor your trend' },
                  { icon: 'school-outline',        text: 'Evidence-based protocols from physiotherapy' },
                  { icon: 'notifications-outline', text: 'Recovery reminders timed to your schedule' },
                ].map((item, i) => (
                  <View key={i} style={s.planItem}>
                    <View style={s.planItemDot}>
                      <Ionicons name={item.icon} size={12} color="#FFFFFF" />
                    </View>
                    <Text style={[s.planItemText, dyn.planItemText]}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </GradientCard>
          </View>

          <Text style={[s.disclaimer, dyn.disclaimer]}>
            Not a medical diagnosis. AlignPal provides movement guidance based on physiotherapy principles. For severe, sudden, or neurological symptoms — see a healthcare professional.
          </Text>

        </Animated.View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={s.continueBtn}
            onPress={() => navigation.navigate('Day1Protocol')}
            activeOpacity={0.85}
          >
            <Text style={[s.continueBtnText, dyn.continueBtnText]}>See My Day 1 Plan</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
     </ScreenFrame>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { flexGrow: 1, paddingBottom: 120 }, // bottom padding clears the fixed footer

  frame:     { width: '100%', alignSelf: 'center' },

  eyebrow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  eyebrowText:{ fontWeight: '800', color: Colors.purple, letterSpacing: 1.6 },
  eyebrowDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textMuted },
  eyebrowSub: { color: Colors.textMuted, fontWeight: '500' },

  heroCard:           { marginBottom: 16, ...Shadows.purple },
  heroTopRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  heroBadgePill:      { backgroundColor: Surfaces.onNavy18, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.pill, borderWidth: 1, borderColor: Surfaces.onNavy22 },
  heroBadgePillText:  { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  heroOutlookPill:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Surfaces.onNavy18, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.pill },
  heroOutlookDot:     { width: 6, height: 6, borderRadius: 3 },
  heroOutlookText:    { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  heroTitle:          { color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.8, marginTop: 4 },
  heroSub:            { color: Surfaces.onNavy75, fontWeight: '600', marginTop: 6 },
  heroRingWrap:       { alignItems: 'center', marginTop: 22, marginBottom: 14 },
  heroSymptomRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  heroSymptomChip:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Surfaces.onNavy18, paddingHorizontal: 10, paddingVertical: Spacing.xs, borderRadius: Radius.pill, borderWidth: 1, borderColor: Surfaces.onNavy22 },
  heroSymptomChipText:{ color: '#FFFFFF', fontWeight: '700' },

  statsRow:        { flexDirection: 'row', gap: 12, marginBottom: 18 },
  statCard:        { flex: 1, borderRadius: Radius.xxl, padding: 18, ...Shadows.card },
  statCardLabel:   { fontWeight: '800', color: Surfaces.onNavy85, letterSpacing: 1.4 },
  statValueRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 14 },
  statValueBig:    { fontWeight: '800', color: '#FFFFFF', letterSpacing: -1.4 },
  statValueSub:    { fontWeight: '700', color: Surfaces.onNavy85 },
  statCardFooter:  { fontWeight: '700', color: Surfaces.onNavy92, marginTop: 10 },

  chartCard:    { backgroundColor: Colors.bgCard, borderRadius: Radius.xxl, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  chartHead:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTitle:   { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  chartSub:     { color: Colors.textMuted, fontWeight: '600', marginTop: 3 },
  chartBadge:   { width: 36, height: 36, borderRadius: 12, backgroundColor: Accents.coral + '1F', alignItems: 'center', justifyContent: 'center' },

  section:        { marginBottom: 24 },
  sectionHead:    { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle:   { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 12 },
  sectionCount:   { color: Colors.textMuted, fontWeight: '600' },
  sectionSubtitle:{ fontSize: 12, color: Colors.textMuted, marginTop: -8, marginBottom: 12 },

  causesCard:     { backgroundColor: Colors.bgCard, borderRadius: Radius.xxl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  causeRow:       { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 14 },
  causeRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  causeNumber:    { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0, borderWidth: 1 },
  causeNumberText:{ fontWeight: '800', letterSpacing: 0.4 },
  causeText:      { color: Colors.textSecondary, flex: 1, paddingTop: 6 },

  outlookHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  outlookHeaderTitle: { color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.6 },
  outlookHeaderBadge: { backgroundColor: Surfaces.onNavy22, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill },
  outlookHeaderBadgeText: { color: '#FFFFFF', fontWeight: '800' },
  outlookText:        { color: Surfaces.onNavy92, fontWeight: '500' },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.amber + '12',
    borderWidth: 1, borderColor: Colors.amber + '40',
    borderRadius: Radius.xl, padding: 14, marginBottom: 24,
  },
  warningText: { flex: 1, color: Colors.amber },

  redFlagCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FF6B9D12',
    borderWidth: 1, borderColor: '#FF6B9D40',
    borderRadius: Radius.xl, padding: 14, marginBottom: 14,
  },
  redFlagText: { flex: 1, color: Colors.red, fontWeight: '600' },

  quoteCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl, padding: 18,
    borderWidth: 1, borderColor: Colors.purpleDim,
    borderLeftWidth: 3, borderLeftColor: Colors.purple,
    marginBottom: 24, gap: 10,
  },
  quoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quoteLabel:  { fontWeight: '700', color: Colors.purple, letterSpacing: 1.2, textTransform: 'uppercase' },
  quoteText:   { color: Colors.textSecondary, fontStyle: 'italic' },

  insightsCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xxl,
    borderWidth: 1, borderColor: Colors.purpleDim, overflow: 'hidden',
    ...Shadows.purpleSoft,
  },
  insightRow:      { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  insightBorder:   { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  insightIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  insightTitle:    { fontWeight: '800', letterSpacing: -0.1 },
  insightText:     { color: Colors.textSecondary },

  planHead:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  planTitle:      { fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  planSub:        { color: Surfaces.onNavy85, marginTop: 4, fontWeight: '600' },
  planIconBubble: { width: 40, height: 40, borderRadius: 14, backgroundColor: Surfaces.onNavy22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Surfaces.onNavy22 },
  planList:       { gap: 12 },
  planItem:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  planItemDot:    { width: 26, height: 26, borderRadius: 9, backgroundColor: Surfaces.onNavy22, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  planItemText:   { color: '#FFFFFF', flex: 1, fontWeight: '500' },

  disclaimer: { color: Colors.textMuted, textAlign: 'center', marginTop: 8 },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  footerInner:     { width: '100%', alignSelf: 'center' },
  continueBtn:     { backgroundColor: Colors.purple, borderRadius: Radius.xl, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...Shadows.purple },
  continueBtnText: { fontWeight: '700', color: Colors.white },
});
