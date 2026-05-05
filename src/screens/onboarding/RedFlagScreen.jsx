import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

// Each flag references the underlying clinical concern. These are the standard
// "red flags" used in primary-care musculoskeletal triage — cauda equina,
// fracture, infection, malignancy. Selecting any one prompts a soft warning
// to seek medical evaluation before continuing the program.
const FLAGS = [
  { id: 'bowel_bladder', label: 'Loss of bowel or bladder control',                concern: 'cauda_equina' },
  { id: 'saddle_numb',   label: 'Numbness in the groin or inner thighs',           concern: 'cauda_equina' },
  { id: 'night_pain',    label: "Severe pain at night that doesn't ease with position", concern: 'serious' },
  { id: 'recent_injury', label: 'Recent serious fall, accident, or injury',        concern: 'fracture' },
  { id: 'weight_loss',   label: 'Unexplained weight loss in the past few months',  concern: 'malignancy' },
  { id: 'fever',         label: 'Recent fever along with the pain',                concern: 'infection' },
  { id: 'cancer_hx',     label: 'Personal history of cancer',                      concern: 'malignancy' },
  { id: 'rapid_worse',   label: 'Pain has rapidly worsened over the last few days', concern: 'serious' },
];

const NONE_ID = 'none';

export default function RedFlagScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.redFlags || []);
  const [warningOpen, setWarningOpen] = useState(false);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const hasFlag = selected.some((id) => id !== NONE_ID);
  const cleared = selected.includes(NONE_ID);

  const toggle = (id) => {
    setSelected((prev) => {
      if (id === NONE_ID) return prev.includes(NONE_ID) ? [] : [NONE_ID];
      return prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev.filter((x) => x !== NONE_ID), id];
    });
  };

  const proceed = () => {
    updateOnboardingData({ redFlags: selected });
    navigation.navigate('Sitting');
  };

  const handleContinue = () => {
    if (!selected.length) return;
    if (hasFlag) {
      setWarningOpen(true);
    } else {
      proceed();
    }
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(24, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(22, gapScale) },
    question:      { fontSize: fs(34, fontScale), lineHeight: fs(42, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    iconBadge:     { width: isSmall ? 46 : 52, height: isSmall ? 46 : 52 },
    list:          { gap: sp(8, gapScale) },
    rowLabel:      { fontSize: fs(14, fontScale), lineHeight: fs(20, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
    // Modal — capped width on tablets so it doesn't span edge-to-edge
    modalCard:     { maxWidth: Math.min(frameWidth, 440) },
    modalTitle:    { fontSize: fs(22, fontScale) },
    modalBody:     { fontSize: fs(14, fontScale), lineHeight: fs(22, fontScale) },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={8} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <View style={[s.iconBadge, dyn.iconBadge]}>
              <Ionicons name="medkit-outline" size={isSmall ? 20 : 22} color={Colors.purplePale} />
            </View>
            <Text style={[s.question, dyn.question]}>Quick safety{'\n'}check</Text>
            <Text style={[s.hint, dyn.hint]}>
              Some symptoms need a doctor's eye, not an app.{'\n'}
              Tick anything you've experienced — or "none of these."
            </Text>
          </View>

          <View style={[s.list, dyn.list]}>
            {FLAGS.map((flag) => {
              const isOn = selected.includes(flag.id);
              return (
                <TouchableOpacity
                  key={flag.id}
                  style={[s.row, isOn && s.rowOnFlag]}
                  onPress={() => toggle(flag.id)}
                  activeOpacity={0.82}
                >
                  {isOn
                    ? <View style={s.checkOnFlag}><Ionicons name="checkmark" size={12} color="#fff" /></View>
                    : <View style={s.checkOff} />
                  }
                  <Text style={[s.rowLabel, dyn.rowLabel, isOn && s.rowLabelOn]}>{flag.label}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={s.divider} />

            <TouchableOpacity
              style={[s.row, cleared && s.rowOnClear]}
              onPress={() => toggle(NONE_ID)}
              activeOpacity={0.82}
            >
              {cleared
                ? <View style={s.checkOnClear}><Ionicons name="checkmark" size={12} color="#fff" /></View>
                : <View style={s.checkOff} />
              }
              <Text style={[s.rowLabel, dyn.rowLabel, cleared && s.rowLabelClear]}>None of these — I'm clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={[s.btn, !selected.length && s.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={[s.btnText, dyn.btnText, !selected.length && s.btnTextDisabled]}>
              {!selected.length ? 'Tick at least one' : 'Continue'}
            </Text>
            {!!selected.length && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Warning modal — only shown if the user ticked at least one red flag */}
      <Modal visible={warningOpen} transparent animationType="fade" onRequestClose={() => setWarningOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={[s.modalCard, dyn.modalCard]}>
            <View style={s.modalIcon}>
              <Ionicons name="warning-outline" size={28} color="#FBBF24" />
            </View>
            <Text style={[s.modalTitle, dyn.modalTitle]}>See a clinician first</Text>
            <Text style={[s.modalBody, dyn.modalBody]}>
              You've flagged a symptom that needs in-person assessment before any exercise program.
              {'\n\n'}
              These signs can point to conditions that movement alone cannot fix — and that exercising could make worse.
              Please book a same-week appointment with your GP, an emergency line, or a physiotherapist.
            </Text>

            <TouchableOpacity
              style={s.modalPrimary}
              onPress={() => Linking.openURL('tel:911')}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={16} color={Colors.white} />
              <Text style={s.modalPrimaryText}>Call emergency services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.modalSecondary}
              onPress={() => { setWarningOpen(false); proceed(); }}
              activeOpacity={0.85}
            >
              <Text style={s.modalSecondaryText}>I understand — continue with caution</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.modalGhost}
              onPress={() => setWarningOpen(false)}
              activeOpacity={0.85}
            >
              <Text style={s.modalGhostText}>Go back and re-check</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  frame:         { width: '100%', alignSelf: 'center' },

  topBlock: { alignItems: 'center', gap: 12 },
  iconBadge: {
    borderRadius: 16,
    backgroundColor: Colors.purple + '18',
    borderWidth: 1, borderColor: Colors.purple + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  question: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  hint:     { color: Colors.textSecondary, textAlign: 'center' },

  list: {},
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14,
  },
  rowOnFlag:    { backgroundColor: '#FBBF2415', borderColor: '#FBBF24' },
  rowOnClear:   { backgroundColor: '#34D39915', borderColor: Colors.green },
  rowLabel:     { flex: 1, fontWeight: '600', color: Colors.textMuted },
  rowLabelOn:   { color: Colors.textPrimary },
  rowLabelClear:{ color: Colors.textPrimary },
  checkOnFlag:  { width: 22, height: 22, borderRadius: 6, backgroundColor: '#FBBF24', alignItems: 'center', justifyContent: 'center' },
  checkOnClear: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  checkOff:     { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border },
  divider:      { height: 1, backgroundColor: Colors.borderSubtle, marginVertical: 6 },

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

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: 24, padding: 28, gap: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  modalIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: '#FBBF2418',
    borderWidth: 1, borderColor: '#FBBF2440',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  modalTitle: { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.4 },
  modalBody:  { color: Colors.textSecondary },

  modalPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF6B9D', borderRadius: 16, paddingVertical: 15, marginTop: 6,
  },
  modalPrimaryText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  modalSecondary: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.bgInput, borderRadius: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  modalSecondaryText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  modalGhost:     { alignItems: 'center', paddingVertical: 6 },
  modalGhostText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
});
