import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const SITTING = [
  { id: '0-2', label: '0–2 hrs', icon: 'walk-outline',    desc: 'Mostly on the move' },
  { id: '3-5', label: '3–5 hrs', icon: 'laptop-outline',  desc: 'Mixed day'           },
  { id: '6+',  label: '6+ hrs',  icon: 'desktop-outline', desc: 'Mostly seated'       },
];

const ACTIVITY = [
  { id: 'sedentary', label: 'Low',      icon: 'bed-outline',      desc: 'Little to no exercise' },
  { id: 'light',     label: 'Light',    icon: 'walk-outline',     desc: '1–2× per week'         },
  { id: 'moderate',  label: 'Moderate', icon: 'bicycle-outline',  desc: '3–4× per week'         },
  { id: 'active',    label: 'Active',   icon: 'barbell-outline',  desc: '5+ days a week'        },
];

const AGE_OPTIONS = [
  { id: '18-25', label: '18–25' },
  { id: '26-35', label: '26–35' },
  { id: '36-45', label: '36–45' },
  { id: '46-55', label: '46–55' },
  { id: '56+',   label: '56+'   },
];

export default function LifestyleScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sitting,  setSitting]  = useState(onboardingData.sittingHours       || null);
  const [activity, setActivity] = useState(onboardingData.trainingFrequency  || null);
  const [age,      setAge]      = useState(onboardingData.ageRange            || null);

  const canContinue = sitting && activity && age;

  const handleContinue = () => {
    if (!canContinue) return;
    updateOnboardingData({ sittingHours: sitting, trainingFrequency: activity, ageRange: age });
    navigation.navigate('Disclaimer');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={5} total={6} onBack={() => navigation.goBack()} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={s.topBlock}>
          <Text style={s.question}>Quick lifestyle{'\n'}snapshot</Text>
          <Text style={s.hint}>
            Three quick questions so we can fine-tune{'\n'}your plan to your actual daily life
          </Text>
        </View>

        {/* Sitting */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="time-outline" size={16} color={Colors.purple} />
            <Text style={s.sectionLabel}>How long do you sit each day?</Text>
          </View>
          <View style={s.row}>
            {SITTING.map((opt) => {
              const isOn = sitting === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.card, isOn && s.cardOn]}
                  onPress={() => setSitting(opt.id)}
                  activeOpacity={0.82}
                >
                  <Ionicons name={opt.icon} size={22} color={isOn ? Colors.purple : Colors.textMuted} />
                  <Text style={[s.cardLabel, isOn && s.cardLabelOn]}>{opt.label}</Text>
                  <Text style={[s.cardDesc,  isOn && s.cardDescOn]}>{opt.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Activity */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="fitness-outline" size={16} color={Colors.purple} />
            <Text style={s.sectionLabel}>How active are you generally?</Text>
          </View>
          <View style={s.row}>
            {ACTIVITY.map((opt) => {
              const isOn = activity === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.card, isOn && s.cardOn]}
                  onPress={() => setActivity(opt.id)}
                  activeOpacity={0.82}
                >
                  <Ionicons name={opt.icon} size={22} color={isOn ? Colors.purple : Colors.textMuted} />
                  <Text style={[s.cardLabel, isOn && s.cardLabelOn]}>{opt.label}</Text>
                  <Text style={[s.cardDesc,  isOn && s.cardDescOn]}>{opt.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Age */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Ionicons name="person-outline" size={16} color={Colors.purple} />
            <Text style={s.sectionLabel}>What's your age range?</Text>
          </View>
          <View style={s.ageRow}>
            {AGE_OPTIONS.map((opt) => {
              const isOn = age === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.agePill, isOn && s.agePillOn]}
                  onPress={() => setAge(opt.id)}
                  activeOpacity={0.82}
                >
                  <Text style={[s.agePillText, isOn && s.agePillTextOn]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !canContinue && s.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !canContinue && s.btnTextDisabled]}>
            {canContinue ? 'Continue' : 'Complete all sections'}
          </Text>
          {!!canContinue && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 20, gap: 24 },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontSize: 38, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 46 },
  hint:         { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },

  section:       { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionLabel:  { fontSize: 14, fontWeight: '700', color: Colors.purplePale },

  row:  { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 16, gap: 5,
  },
  cardOn:      { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  cardLabel:   { fontSize: 13, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  cardLabelOn: { color: Colors.textPrimary },
  cardDesc:    { fontSize: 10, color: Colors.textDisabled, textAlign: 'center' },
  cardDescOn:  { color: Colors.purplePale, opacity: 0.8 },

  ageRow:        { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  agePill: {
    paddingVertical: 12, paddingHorizontal: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 14,
  },
  agePillOn:     { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  agePillText:   { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  agePillTextOn: { color: Colors.textPrimary },

  footer:      { paddingHorizontal: 28, paddingBottom: 36, paddingTop: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
