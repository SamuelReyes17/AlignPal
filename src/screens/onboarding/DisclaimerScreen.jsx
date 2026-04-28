import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const POINTS = [
  {
    icon: 'information-circle-outline',
    color: Colors.purple,
    title: 'Movement guidance, not diagnosis',
    body: 'AlignPal gives you evidence-based exercises tailored to your pain — not a medical diagnosis.',
  },
  {
    icon: 'medkit-outline',
    color: Colors.red,
    title: 'See a doctor for serious pain',
    body: 'If your pain is sudden, severe, or accompanied by numbness/weakness — please see a healthcare professional first.',
  },
  {
    icon: 'lock-closed-outline',
    color: Colors.green,
    title: 'Your data stays private',
    body: 'Everything you share is used only to personalize your plan. We never sell your health information.',
  },
];

export default function DisclaimerScreen({ navigation }) {
  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={8} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Icon + title */}
        <View style={s.topBlock}>
          <View style={s.iconWrap}>
            <View style={s.iconGlow} />
            <Ionicons name="shield-checkmark" size={44} color={Colors.purple} />
          </View>
          <Text style={s.title}>Almost there.</Text>
          <Text style={s.sub}>
            One quick note before we build{'\n'}your personalized recovery plan
          </Text>
        </View>

        {/* Disclaimer points */}
        <View style={s.points}>
          {POINTS.map((p, i) => (
            <View key={i} style={s.point}>
              <View style={[s.pointIcon, { backgroundColor: p.color + '18', borderColor: p.color + '40' }]}>
                <Ionicons name={p.icon} size={20} color={p.color} />
              </View>
              <View style={s.pointText}>
                <Text style={s.pointTitle}>{p.title}</Text>
                <Text style={s.pointBody}>{p.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Agreement box */}
        <View style={s.agreeBox}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.green} />
          <Text style={s.agreeText}>
            I understand AlignPal is a wellness tool — not a replacement for professional medical care
          </Text>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => navigation.navigate('Analyzing')}
          activeOpacity={0.88}
        >
          <Ionicons name="sparkles" size={18} color={Colors.white} />
          <Text style={s.btnText}>Build My Plan</Text>
        </TouchableOpacity>
        <Text style={s.sub2}>Your results will be ready in seconds</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 24, paddingVertical: 16 },

  topBlock: { alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    ...Shadows.purpleSoft,
  },
  iconGlow: {
    position: 'absolute', width: 88, height: 88, borderRadius: 28,
    backgroundColor: Colors.purple, opacity: 0.15, transform: [{ scale: 1.4 }],
  },
  title: { fontSize: 34, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  sub:   { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  points: { gap: 10 },
  point: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 18, padding: 16,
  },
  pointIcon: {
    width: 40, height: 40, borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  pointText:  { flex: 1, gap: 3 },
  pointTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  pointBody:  { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  agreeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.green + '35',
    borderRadius: 16, padding: 16,
  },
  agreeText: { fontSize: 13, color: Colors.green, lineHeight: 20, flex: 1, opacity: 0.9 },

  footer: { paddingHorizontal: 28, paddingBottom: 36, paddingTop: 12, gap: 10 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  sub2:    { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
});
