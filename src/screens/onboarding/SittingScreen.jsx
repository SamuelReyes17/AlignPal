import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const { height } = Dimensions.get('window');

const OPTIONS = [
  {
    id: '0-2',
    label: '0 – 2 hours',
    sub: 'Mostly on your feet',
    icon: 'walk',
    color: '#34D399',
  },
  {
    id: '3-5',
    label: '3 – 5 hours',
    sub: 'A mix of sitting and moving',
    icon: 'laptop',
    color: '#FBBF24',
  },
  {
    id: '6+',
    label: '6+ hours',
    sub: 'Mostly at a desk or couch',
    icon: 'desktop',
    color: '#FF6B9D',
  },
];

export default function SittingScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.sittingHours || null);

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ sittingHours: selected });
    navigation.navigate('ActivityLevel');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={5} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBlock}>
          <Text style={s.question}>How long do you{'\n'}sit each day?</Text>
          <Text style={s.hint}>This shapes how we build your recovery routine</Text>
        </View>

        {/* Big option cards */}
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
                {/* Icon circle */}
                <View style={[s.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '60' }]}>
                  <Ionicons name={opt.icon} size={36} color={isOn ? opt.color : Colors.textMuted} />
                </View>

                <View style={s.cardText}>
                  <Text style={[s.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                  <Text style={[s.cardSub,   isOn && { color: opt.color }]}>{opt.sub}</Text>
                </View>

                {/* Check or empty radio */}
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
            {selected ? 'Continue' : 'Select daily sitting time'}
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
  content:   { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 36, paddingVertical: 16 },

  topBlock: { alignItems: 'center', gap: 12 },
  question: { fontSize: 38, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 46 },
  hint:         { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },

  options: { gap: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 22, paddingVertical: 22, paddingHorizontal: 20,
    ...Shadows.card,
  },
  iconCircle: {
    width: 70, height: 70, borderRadius: 22,
    backgroundColor: Colors.bgInput,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardText:  { flex: 1, gap: 4 },
  cardLabel: { fontSize: 18, fontWeight: '700', color: Colors.textMuted },
  cardSub:   { fontSize: 13, color: Colors.textSecondary },
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
