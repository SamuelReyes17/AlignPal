import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

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

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={2} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBlock}>
          <Text style={s.question}>How intense{'\n'}is the pain?</Text>
          <Text style={s.hint}>Right now, in this moment</Text>
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
              <Text style={[s.bigNumber, { color: activeColor }]}>{level}</Text>
              <View style={s.displayRight}>
                <Text style={[s.descLabel, { color: activeColor }]}>{desc.label}</Text>
                <Text style={s.descSub}>{desc.sub}</Text>
              </View>
            </View>
          ) : (
            <Text style={s.tapPrompt}>Tap a number below to rate your pain</Text>
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
                  s.numBtn,
                  isOn && { backgroundColor: col, borderColor: col },
                ]}
                onPress={() => handleSelect(n)}
                activeOpacity={0.65}
              >
                <Text style={[s.numText, isOn && s.numTextOn]}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Colour legend */}
        <View style={s.legend}>
          <View style={s.legendItem}>
            <View style={[s.dot, { backgroundColor: Colors.green }]} />
            <Text style={s.legendText}>Mild (1–3)</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.dot, { backgroundColor: Colors.amber }]} />
            <Text style={s.legendText}>Moderate (4–6)</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.dot, { backgroundColor: Colors.red }]} />
            <Text style={s.legendText}>Severe (7–10)</Text>
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !level && s.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !level && s.btnTextDisabled]}>
            {level ? 'Continue' : 'Select your pain level'}
          </Text>
          {!!level && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 26, paddingVertical: 16 },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontSize: 38, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 46 },
  hint:     { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  displayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22, borderWidth: 1.5, borderColor: Colors.border,
    paddingVertical: 22, paddingHorizontal: 20,
    minHeight: 80, justifyContent: 'center',
    ...Shadows.card,
  },
  displayInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bigNumber:    { fontSize: 64, fontWeight: '800', letterSpacing: -2, lineHeight: 72, minWidth: 60 },
  displayRight: { flex: 1, gap: 4 },
  descLabel:    { fontSize: 20, fontWeight: '700' },
  descSub:      { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  tapPrompt:    { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },

  numRow: { flexDirection: 'row', gap: 5 },
  numBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  numText:   { fontSize: 15, fontWeight: '700', color: Colors.textMuted },
  numTextOn: { color: Colors.white },

  legend:     { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },

  footer:          { paddingHorizontal: 24, paddingBottom: 36, paddingTop: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
