import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getColor = (n) => {
  if (n <= 3) return Colors.green;
  if (n <= 6) return Colors.amber;
  return Colors.red;
};

const DESCRIPTORS = {
  1:  { label: 'Barely there',  sub: "You almost don't notice it" },
  2:  { label: 'Very mild',     sub: 'Easy to ignore most of the time' },
  3:  { label: 'Mild',          sub: 'Noticeable but not limiting' },
  4:  { label: 'Noticeable',    sub: 'Gets your attention occasionally' },
  5:  { label: 'Moderate',      sub: 'Distracting during daily tasks' },
  6:  { label: 'Significant',   sub: 'Hard to ignore, slows you down' },
  7:  { label: 'Quite painful', sub: 'Affects your daily routine' },
  8:  { label: 'Intense',       sub: 'Difficult to function normally' },
  9:  { label: 'Severe',        sub: 'Constant and debilitating' },
  10: { label: 'Unbearable',    sub: 'Worst pain imaginable' },
};

export default function PainIntensityScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [level, setLevel] = useState(onboardingData.painIntensity || null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const handleSelect = (n) => {
    setLevel(n);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 220, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const handleContinue = () => {
    if (!level) return;
    updateOnboardingData({ painIntensity: level });
    navigation.navigate('PainType');
  };

  const activeColor = level ? getColor(level) : Colors.textMuted;
  const desc = level ? DESCRIPTORS[level] : null;

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(26, gapScale) },
    question:      { fontSize: fs(38, fontScale), lineHeight: fs(46, fontScale) },
    hint:          { fontSize: fs(14, fontScale) },
    bigNumber:     { fontSize: fs(64, fontScale), lineHeight: fs(72, fontScale) },
    descLabel:     { fontSize: fs(20, fontScale) },
    descSub:       { fontSize: fs(13, fontScale), lineHeight: fs(18, fontScale) },
    tapPrompt:     { fontSize: fs(14, fontScale) },
    numBtn:        { height: isSmall ? 44 : isTablet ? 60 : 52 },
    numText:       { fontSize: fs(15, fontScale) },
    legendText:    { fontSize: fs(11, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={2} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>How intense{'\n'}is the pain?</Text>
            <Text style={[s.hint, dyn.hint]}>Right now, in this moment</Text>
          </View>

          {/* Live display card */}
          <Animated.View
            style={[
              s.displayCard,
              level && { borderColor: activeColor + '55' },
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {desc ? (
              <View style={s.displayInner}>
                <Text style={[s.bigNumber, dyn.bigNumber, { color: activeColor }]}>{level}</Text>
                <View style={s.displayRight}>
                  <Text style={[s.descLabel, dyn.descLabel, { color: activeColor }]}>{desc.label}</Text>
                  <Text style={[s.descSub, dyn.descSub]}>{desc.sub}</Text>
                </View>
              </View>
            ) : (
              <Text style={[s.tapPrompt, dyn.tapPrompt]}>Tap a number below to rate your pain</Text>
            )}
          </Animated.View>

          {/* Single-row number selector */}
          <View style={s.numRow}>
            {LEVELS.map((n) => {
              const isOn = level === n;
              const col = getColor(n);
              return (
                <TouchableOpacity
                  key={n}
                  style={[
                    s.numBtn, dyn.numBtn,
                    isOn && { backgroundColor: col, borderColor: col },
                  ]}
                  onPress={() => handleSelect(n)}
                  activeOpacity={0.65}
                >
                  <Text style={[s.numText, dyn.numText, isOn && s.numTextOn]}>{n}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Colour legend */}
          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: Colors.green }]} />
              <Text style={[s.legendText, dyn.legendText]}>Mild (1–3)</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: Colors.amber }]} />
              <Text style={[s.legendText, dyn.legendText]}>Moderate (4–6)</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: Colors.red }]} />
              <Text style={[s.legendText, dyn.legendText]}>Severe (7–10)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={[s.btn, !level && s.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={[s.btnText, dyn.btnText, !level && s.btnTextDisabled]}>
              {level ? 'Continue' : 'Select your pain level'}
            </Text>
            {!!level && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  frame:         { width: '100%', alignSelf: 'center' },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  hint:     { color: Colors.textSecondary, textAlign: 'center' },

  displayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22, borderWidth: 1.5, borderColor: Colors.border,
    paddingVertical: 22, paddingHorizontal: 20,
    minHeight: 80, justifyContent: 'center',
    ...Shadows.card,
  },
  displayInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bigNumber:    { fontWeight: '800', letterSpacing: -2, minWidth: 60 },
  displayRight: { flex: 1, gap: 4 },
  descLabel:    { fontWeight: '700' },
  descSub:      { color: Colors.textSecondary },
  tapPrompt:    { color: Colors.textMuted, textAlign: 'center' },

  numRow: { flexDirection: 'row', gap: 5 },
  numBtn: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  numText:   { fontWeight: '700', color: Colors.textMuted },
  numTextOn: { color: Colors.white },

  legend:     { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textMuted, fontWeight: '500' },

  footer:      { alignItems: 'center' },
  footerInner: { width: '100%', alignSelf: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
