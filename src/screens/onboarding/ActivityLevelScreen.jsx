import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const OPTIONS = [
  {
    id: 'sedentary',
    label: 'Not very active',
    sub: 'Little to no exercise right now',
    icon: 'bed-outline',
    color: Colors.purpleLight,
  },
  {
    id: 'light',
    label: 'Lightly active',
    sub: 'Walk or move 1–2× a week',
    icon: 'walk-outline',
    color: Colors.green,
  },
  {
    id: 'moderate',
    label: 'Moderately active',
    sub: 'Exercise or gym 3–4× a week',
    icon: 'bicycle-outline',
    color: Colors.amber,
  },
  {
    id: 'active',
    label: 'Very active',
    sub: 'Train hard 5+ days a week',
    icon: 'barbell-outline',
    color: Colors.red,
  },
];

export default function ActivityLevelScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.trainingFrequency || null);

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ trainingFrequency: selected });
    navigation.navigate('AgeRange');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={6} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBlock}>
          <Text style={s.question}>How active{'\n'}are you?</Text>
          <Text style={s.hint}>Be honest — there's no wrong answer here</Text>
        </View>

        <View style={s.options}>
          {OPTIONS.map((opt) => {
            const isOn = selected === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[s.card, isOn && { borderColor: opt.color, backgroundColor: opt.color + '14' }]}
                onPress={() => setSelected(opt.id)}
                activeOpacity={0.82}
              >
                <View style={[s.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '60' }]}>
                  <Ionicons name={opt.icon} size={30} color={isOn ? opt.color : Colors.textMuted} />
                </View>
                <View style={s.cardText}>
                  <Text style={[s.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                  <Text style={[s.cardSub,   isOn && { color: opt.color }]}>{opt.sub}</Text>
                </View>
                {isOn
                  ? <View style={[s.radioOn, { backgroundColor: opt.color }]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                  : <View style={s.radioOff} />
                }
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !selected && s.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !selected && s.btnTextDisabled]}>
            {selected ? 'Continue' : 'Select activity level'}
          </Text>
          {!!selected && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 28, paddingVertical: 16 },

  topBlock: { alignItems: 'center', gap: 12 },
  question: { fontSize: 38, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 46 },
  hint:         { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  options: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 20, paddingVertical: 18, paddingHorizontal: 18,
    ...Shadows.card,
  },
  iconCircle: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: Colors.bgInput,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardText:  { flex: 1, gap: 3 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: Colors.textMuted },
  cardSub:   { fontSize: 12, color: Colors.textSecondary },
  radioOn:   { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  radioOff:  { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: Colors.border },

  footer: { paddingHorizontal: 28, paddingBottom: 36, paddingTop: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
