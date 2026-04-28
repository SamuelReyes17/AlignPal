import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const OPTIONS = [
  { id: 'sharp',     label: 'Sharp',     desc: 'Stabbing or shooting',        icon: 'flash',                  color: '#FF6B9D' },
  { id: 'dull',      label: 'Dull',      desc: 'Aching or constant throb',    icon: 'radio-button-on',        color: '#FBBF24' },
  { id: 'burning',   label: 'Burning',   desc: 'Hot or stinging',             icon: 'flame',                  color: '#FB923C' },
  { id: 'stiff',     label: 'Stiff',     desc: 'Tight or restricted',         icon: 'lock-closed',            color: '#818CF8' },
  { id: 'radiating', label: 'Radiating', desc: 'Spreads down arms or legs',   icon: 'trending-down-outline',  color: '#7C5CF0' },
  { id: 'numb',      label: 'Numbness',  desc: 'Tingling, pins & needles',    icon: 'hand-right-outline',     color: '#34D399' },
  { id: 'cramping',  label: 'Cramping',  desc: 'Spasms or muscle clenching',  icon: 'body-outline',           color: '#60A5FA' },
  { id: 'throbbing', label: 'Throbbing', desc: 'Pulsing with your heartbeat', icon: 'pulse-outline',          color: '#F472B6' },
];

export default function PainTypeScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(
    Array.isArray(onboardingData.painTypes) ? onboardingData.painTypes : []
  );

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (!selected.length) return;
    updateOnboardingData({ painTypes: selected });
    navigation.navigate('PainTriggers');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={3} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBlock}>
          <Text style={s.question}>What does{'\n'}it feel like?</Text>
          <Text style={s.hint}>Select all that apply — the more you share,{'\n'}the more precise your recovery plan</Text>
          {selected.length > 0 && (
            <View style={s.countBadge}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.purple} />
              <Text style={s.countText}>{selected.length} selected</Text>
            </View>
          )}
        </View>

        <View style={s.grid}>
          {OPTIONS.map((opt) => {
            const isOn = selected.includes(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[s.card, isOn && { borderColor: opt.color, backgroundColor: opt.color + '14' }]}
                onPress={() => toggle(opt.id)}
                activeOpacity={0.78}
              >
                {isOn && <View style={[s.glow, { backgroundColor: opt.color }]} />}

                <View style={[s.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '55' }]}>
                  <Ionicons name={opt.icon} size={22} color={isOn ? opt.color : Colors.textMuted} />
                </View>

                <Text style={[s.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                <Text style={[s.cardDesc, isOn && { color: opt.color }]}>{opt.desc}</Text>

                {isOn && (
                  <View style={[s.check, { backgroundColor: opt.color }]}>
                    <Ionicons name="checkmark" size={9} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !selected.length && s.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !selected.length && s.btnTextDisabled]}>
            {selected.length ? `Continue  ·  ${selected.length} symptom${selected.length > 1 ? 's' : ''}` : 'Select your symptoms'}
          </Text>
          {!!selected.length && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CARD_W = 148;
const CARD_H = 118;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 24 },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 44 },
  hint:     { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.purpleDim, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  countText: { fontSize: 13, fontWeight: '700', color: Colors.purple },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center',
    maxWidth: CARD_W * 2 + 12, alignSelf: 'center',
  },
  card: {
    width: CARD_W, height: CARD_H,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 22, gap: 7,
    position: 'relative', overflow: 'hidden',
    ...Shadows.card,
  },
  glow: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40, opacity: 0.14,
  },
  iconCircle: {
    width: 46, height: 46, borderRadius: 15,
    backgroundColor: Colors.bgInput,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cardLabel: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  cardDesc:  { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 8 },
  check: {
    position: 'absolute', top: 10, right: 10,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

  footer:          { paddingHorizontal: 28, paddingBottom: 36, paddingTop: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
