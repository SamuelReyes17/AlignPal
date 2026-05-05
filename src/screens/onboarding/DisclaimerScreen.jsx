import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows, Accents } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const POINTS = [
  {
    icon: 'information-circle-outline',
    color: Accents.violet,
    title: 'Movement guidance, not diagnosis',
    body: 'AlignPal gives you evidence-based exercises tailored to your pain — not a medical diagnosis.',
  },
  {
    icon: 'medkit-outline',
    color: Accents.coral,
    title: 'See a doctor for serious pain',
    body: 'If your pain is sudden, severe, or accompanied by numbness/weakness — please see a healthcare professional first.',
  },
  {
    icon: 'lock-closed-outline',
    color: Accents.teal,
    title: 'Your data stays private',
    body: 'Everything you share is used only to personalize your plan. We never sell your health information.',
  },
];

export default function DisclaimerScreen({ navigation }) {
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(24, gapScale) },
    title:         { fontSize: fs(34, fontScale) },
    sub:           { fontSize: fs(14, fontScale), lineHeight: fs(22, fontScale) },
    iconWrap:      { width: isSmall ? 76 : isTablet ? 96 : 88, height: isSmall ? 76 : isTablet ? 96 : 88 },
    pointTitle:    { fontSize: fs(14, fontScale) },
    pointBody:     { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    agreeText:     { fontSize: fs(13, fontScale), lineHeight: fs(20, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    sub2:          { fontSize: fs(12, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={12} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          {/* Icon + title */}
          <View style={s.topBlock}>
            <View style={[s.iconWrap, dyn.iconWrap]}>
              <View style={[s.iconGlow, dyn.iconWrap]} />
              <Ionicons name="shield-checkmark" size={isSmall ? 36 : isTablet ? 48 : 44} color={Colors.purple} />
            </View>
            <Text style={[s.title, dyn.title]}>Almost there.</Text>
            <Text style={[s.sub, dyn.sub]}>
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
                  <Text style={[s.pointTitle, dyn.pointTitle]}>{p.title}</Text>
                  <Text style={[s.pointBody, dyn.pointBody]}>{p.body}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Agreement box */}
          <View style={s.agreeBox}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.green} />
            <Text style={[s.agreeText, dyn.agreeText]}>
              I understand AlignPal is a wellness tool — not a replacement for professional medical care
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.navigate('Analyzing')}
            activeOpacity={0.88}
          >
            <Ionicons name="sparkles" size={18} color={Colors.white} />
            <Text style={[s.btnText, dyn.btnText]}>Build My Plan</Text>
          </TouchableOpacity>
          <Text style={[s.sub2, dyn.sub2]}>Your results will be ready in seconds</Text>
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

  topBlock: { alignItems: 'center', gap: 12 },
  iconWrap: {
    borderRadius: 28,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    ...Shadows.purpleSoft,
  },
  iconGlow: {
    position: 'absolute', borderRadius: 28,
    backgroundColor: Colors.purple, opacity: 0.15, transform: [{ scale: 1.4 }],
  },
  title: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  sub:   { color: Colors.textSecondary, textAlign: 'center' },

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
  pointTitle: { fontWeight: '700', color: Colors.textPrimary },
  pointBody:  { color: Colors.textSecondary },

  agreeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.green + '35',
    borderRadius: 16, padding: 16,
  },
  agreeText: { color: Colors.green, flex: 1, opacity: 0.9 },

  footer:      { alignItems: 'center' },
  footerInner: { width: '100%', alignSelf: 'center', gap: 10 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnText: { fontWeight: '700', color: Colors.white },
  sub2:    { color: Colors.textMuted, textAlign: 'center' },
});
