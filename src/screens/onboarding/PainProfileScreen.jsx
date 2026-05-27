import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces } from '../../constants/brand';
import { getPainCondition, getCauses, getOutlook, analyzePainDescription, getStrategy, getMilestones } from '../../constants/exerciseLibrary';
import GradientCard from '../../components/GradientCard';
import CircularProgress from '../../components/CircularProgress';
import BarChart from '../../components/BarChart';
import ScreenFrame from '../../components/ScreenFrame';
import { useResponsive, fs, sp } from '../../utils/responsive';

// Purple-only treatment — labels and icons differ but color does not.
const PAIN_TYPE_META = {
  sharp:     { label: 'Sharp',     color: Colors.purpleLight, icon: 'flash' },
  dull:      { label: 'Dull',      color: Colors.purpleLight, icon: 'radio-button-on' },
  burning:   { label: 'Burning',   color: Colors.purpleLight, icon: 'flame' },
  stiff:     { label: 'Stiff',     color: Colors.purpleLight, icon: 'lock-closed' },
  radiating: { label: 'Radiating', color: Colors.purpleLight, icon: 'trending-down-outline' },
  numb:      { label: 'Numbness',  color: Colors.purpleLight, icon: 'hand-right-outline' },
  cramping:  { label: 'Cramping',  color: Colors.purpleLight, icon: 'body-outline' },
  throbbing: { label: 'Throbbing', color: Colors.purpleLight, icon: 'pulse-outline' },
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
  const strategy    = getStrategy(onboardingData);
  const milestones  = getMilestones(onboardingData);
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

  // All bars in the same brand purple — height alone communicates magnitude.
  const factorData = [
    { label: 'Sit',     value: onboardingData.sittingHours === '6+' ? 9 : onboardingData.sittingHours === '3-5' ? 6 : 3, color: Colors.purple },
    { label: 'Load',    value: onboardingData.trainingFrequency === 'active' ? 7 : onboardingData.trainingFrequency === 'moderate' ? 5 : onboardingData.trainingFrequency === 'light' ? 3 : 2, color: Colors.purple },
    { label: 'Pain',    value: painIntensity, color: Colors.purple },
    { label: 'Symptoms',value: Math.min(8, painTypes.length * 2 + 2), color: Colors.purple },
    { label: 'Triggers',value: Math.min(8, (onboardingData.worstTimeTriggers?.length || 0) + 1), color: Colors.purple },
  ];

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
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 28 : 40, paddingTop: 24 },
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
            blobs={[]}
            style={s.heroCard}
          >
            <View style={s.heroTopRow}>
              <View style={s.heroBadgePill}>
                <Text style={s.heroBadgePillText}>{condition.emoji}  Diagnosis</Text>
              </View>
              <View style={s.heroOutlookPill}>
                <View style={[s.heroOutlookDot, { backgroundColor: Colors.purplePale }]} />
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

          {/* ═══ Stat row ════════════════════════════════════════════════════════
              Both tiles sit on a calm muted surface. The numbers — large and
              white — communicate state; the surface color does not. */}
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={[s.statCardLabel, dyn.statCardLabel]}>PAIN LEVEL</Text>
              <View style={s.statValueRow}>
                <Text style={[s.statValueBig, dyn.statValueBig]}>{painIntensity}</Text>
                <Text style={[s.statValueSub, dyn.statValueSub]}>/10</Text>
              </View>
              <Text style={[s.statCardFooter, dyn.statCardFooter]}>
                {painIntensity >= 7 ? 'Significant' : painIntensity >= 4 ? 'Moderate' : 'Mild'}
              </Text>
            </View>
            <View style={s.statCard}>
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
                <Ionicons name="analytics" size={14} color={Colors.purpleLight} />
              </View>
            </View>
            <View style={{ marginTop: 18 }}>
              <BarChart data={factorData} maxValue={10} height={chartHeight} barWidth={chartBarWidth} />
            </View>
          </View>

          {/* ═══ Red flags ═══════════════════════════════════════════════════════ */}
          {hasRedFlags && descSignals.redFlags.map((flag, i) => (
            <View key={i} style={s.redFlagCard}>
              <Ionicons name="alert-circle" size={18} color={Colors.purpleLight} />
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
              {causes.map((cause, i) => (
                <View key={i} style={[s.causeRow, i < causes.length - 1 && s.causeRowBorder]}>
                  <View style={s.causeNumber}>
                    <Text style={[s.causeNumberText, dyn.causeNumberText]}>{String(i + 1).padStart(2, '0')}</Text>
                  </View>
                  <Text style={[s.causeText, dyn.causeText]}>{cause.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ═══ Outlook detail ══════════════════════════════════════════════════ */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, dyn.sectionTitle]}>Recovery outlook</Text>
            <GradientCard
              colors={Gradients.purple}
              radius={Radius.xl}
              blobs={[]}
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
              <Ionicons name="warning-outline" size={18} color={Colors.purpleLight} />
              <Text style={[s.warningText, dyn.warningText]}>
                Pain at {painIntensity}/10 is significant. We'll start with gentle mobility and activation. If pain worsens or you feel numbness or weakness, see a healthcare professional.
              </Text>
            </View>
          )}

          {/* ═══ Your strategy ═══════════════════════════════════════════════════ */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, dyn.sectionTitle]}>Your strategy</Text>
              <Text style={[s.sectionCount, dyn.sectionCount]}>Personalized</Text>
            </View>
            <Text style={s.sectionSubtitle}>How we'll approach your specific pattern</Text>

            <GradientCard
              colors={Gradients.purpleHero}
              radius={Radius.xl}
              blobs={[]}
              style={s.strategyPhaseCard}
            >
              <View style={s.strategyPhasePill}>
                <Ionicons name="compass-outline" size={11} color="#FFFFFF" />
                <Text style={s.strategyPhaseLabel}>PHASE  ·  {strategy.phase.toUpperCase()}</Text>
              </View>
              <Text style={[s.strategyPhaseDesc, dyn.outlookText]}>{strategy.phaseDescription}</Text>
            </GradientCard>

            <View style={s.strategyApproachCard}>
              {strategy.approach.map((item, i) => (
                <View key={i} style={[s.approachRow, i < strategy.approach.length - 1 && s.approachRowBorder]}>
                  <View style={s.approachIconWrap}>
                    <Ionicons name={item.icon} size={15} color={Colors.purpleLight} />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={s.approachLabelRow}>
                      <Text style={[s.approachLabel, dyn.sectionCount]}>{item.label.toUpperCase()}</Text>
                      <Text style={s.approachValue}>{item.value}</Text>
                    </View>
                    <Text style={[s.approachWhy, dyn.causeText]}>{item.why}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={s.avoidCard}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.purpleLight} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[s.avoidLabel, dyn.sectionCount]}>AVOID THIS WEEK</Text>
                <Text style={[s.avoidText, dyn.causeText]}>{strategy.avoid}</Text>
              </View>
            </View>

            <View style={s.goalCard}>
              <Ionicons name="flag-outline" size={16} color={Colors.purpleLight} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[s.goalLabel, dyn.sectionCount]}>WEEK 1 GOAL</Text>
                <Text style={[s.goalText, dyn.causeText]}>{strategy.goalThisWeek}</Text>
              </View>
            </View>
          </View>

          {/* ═══ Milestones ══════════════════════════════════════════════════════ */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, dyn.sectionTitle]}>What success looks like</Text>
              <Text style={[s.sectionCount, dyn.sectionCount]}>Timeline</Text>
            </View>
            <Text style={s.sectionSubtitle}>Concrete signals you're on the right path</Text>

            <View style={s.milestonesCard}>
              {milestones.map((m, i) => {
                // Three shades of the same brand purple — time progression by lightness.
                const palette = [Colors.purple, Colors.purpleLight, Colors.purplePale];
                const dotColor = palette[i] || Colors.purple;
                const isLast = i === milestones.length - 1;
                return (
                  <View key={i} style={s.milestoneRow}>
                    <View style={s.milestoneTimeline}>
                      <View style={[s.milestoneDot, { backgroundColor: dotColor, borderColor: dotColor + '55' }]} />
                      {!isLast && <View style={s.milestoneLine} />}
                    </View>
                    <View style={[s.milestoneContent, !isLast && s.milestoneContentSpacing]}>
                      <View style={s.milestoneHead}>
                        <Text style={[s.milestoneWhen, dyn.sectionCount]}>{m.when.toUpperCase()}</Text>
                        <Text style={[s.milestoneLabel, { color: dotColor }]}>{m.label}</Text>
                      </View>
                      <Text style={[s.milestoneSignal, dyn.causeText]}>{m.signal}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
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
  statCard:        {
    flex: 1, borderRadius: Radius.xl, padding: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
  },
  statCardLabel:   { fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.4 },
  statValueRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 12 },
  statValueBig:    { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1.4 },
  statValueSub:    { fontWeight: '700', color: Colors.purplePale },
  statCardFooter:  { fontWeight: '600', color: Colors.textSecondary, marginTop: 8 },

  chartCard:    { backgroundColor: Colors.bgCard, borderRadius: Radius.xxl, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  chartHead:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTitle:   { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  chartSub:     { color: Colors.textMuted, fontWeight: '600', marginTop: 3 },
  chartBadge:   { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.purpleDim, alignItems: 'center', justifyContent: 'center' },

  section:        { marginBottom: 24 },
  sectionHead:    { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle:   { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 12 },
  sectionCount:   { color: Colors.textMuted, fontWeight: '600' },
  sectionSubtitle:{ fontSize: 12, color: Colors.textMuted, marginTop: -8, marginBottom: 12 },

  causesCard:     { backgroundColor: Colors.bgCard, borderRadius: Radius.xxl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  causeRow:       { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 14 },
  causeRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  causeNumber:    {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    backgroundColor: Colors.purpleDim,
    borderWidth: 1, borderColor: 'rgba(155,139,244,0.35)',
  },
  causeNumberText:{ fontWeight: '800', letterSpacing: 0.4, color: Colors.purpleLight },
  causeText:      { color: Colors.textSecondary, flex: 1, paddingTop: 6 },

  outlookHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  outlookHeaderTitle: { color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.6 },
  outlookHeaderBadge: { backgroundColor: Surfaces.onNavy22, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill },
  outlookHeaderBadgeText: { color: '#FFFFFF', fontWeight: '800' },
  outlookText:        { color: Surfaces.onNavy92, fontWeight: '500' },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl, padding: 14, marginBottom: 24,
  },
  warningText: { flex: 1, color: Colors.textSecondary },

  redFlagCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl, padding: 14, marginBottom: 14,
  },
  redFlagText: { flex: 1, color: Colors.textPrimary, fontWeight: '600' },

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

  // ─── Strategy section ───────────────────────────────────────────────────
  strategyPhaseCard:  { marginTop: 4, marginBottom: 14, ...Shadows.purpleSoft },
  strategyPhasePill:  { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: Surfaces.onNavy22, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill, marginBottom: 12 },
  strategyPhaseLabel: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  strategyPhaseDesc:  { color: Surfaces.onNavy92, fontWeight: '500' },

  strategyApproachCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xxl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
    marginBottom: 14, ...Shadows.card,
  },
  approachRow:        { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  approachRowBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  approachIconWrap:   {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.purpleDim,
    borderWidth: 1, borderColor: 'rgba(155,139,244,0.35)',
    flexShrink: 0,
  },
  approachLabelRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  approachLabel:      { color: Colors.textMuted, fontWeight: '800', letterSpacing: 1.2 },
  approachValue:      { fontSize: 14, fontWeight: '800', letterSpacing: -0.2, color: Colors.purpleLight },
  approachWhy:        { color: Colors.textSecondary },

  avoidCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl, padding: 14, marginBottom: 12,
  },
  avoidLabel: { color: Colors.purpleLight, fontWeight: '800', letterSpacing: 1.2 },
  avoidText:  { color: Colors.textSecondary, fontWeight: '500' },

  goalCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.xl, padding: 14,
  },
  goalLabel: { color: Colors.purpleLight, fontWeight: '800', letterSpacing: 1.2 },
  goalText:  { color: Colors.textSecondary, fontWeight: '500' },

  // ─── Milestones timeline ────────────────────────────────────────────────
  milestonesCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xxl,
    borderWidth: 1, borderColor: Colors.border,
    padding: 18, ...Shadows.card,
  },
  milestoneRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  milestoneTimeline:   { alignItems: 'center', width: 14 },
  milestoneDot:        { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginTop: 2 },
  milestoneLine:       { flex: 1, width: 2, backgroundColor: Colors.borderSubtle, marginTop: 4, marginBottom: -4 },
  milestoneContent:    { flex: 1, gap: 6 },
  milestoneContentSpacing: { paddingBottom: 18 },
  milestoneHead:       { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  milestoneWhen:       { color: Colors.textMuted, fontWeight: '800', letterSpacing: 1.2 },
  milestoneLabel:      { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  milestoneSignal:     { color: Colors.textSecondary, fontWeight: '500' },

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
