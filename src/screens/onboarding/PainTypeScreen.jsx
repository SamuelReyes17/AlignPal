import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

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

const PROMPT_CHIPS = [
  { label: 'Worse in the morning',    text: 'Worst first thing in the morning, especially the first steps.' },
  { label: 'Travels down my leg',     text: 'Travels down my leg toward my foot.' },
  { label: 'Comes and goes',          text: 'Comes and goes throughout the day.' },
  { label: 'Constant ache',           text: 'A constant deep ache that never fully goes away.' },
  { label: 'Worse sitting',           text: 'Gets significantly worse after sitting for a while.' },
  { label: 'Better when moving',      text: 'Eases when I get up and move around.' },
  { label: 'Woke up with it',         text: 'Woke up with it out of nowhere — no obvious cause.' },
  { label: 'Sharp with movement',     text: 'Catches sharply with specific movements.' },
  { label: 'Tight and locked',        text: 'Feels tight and locked — hard to move freely.' },
  { label: 'Spreads to other areas',  text: 'Seems to spread or refer pain to other areas nearby.' },
];

export default function PainTypeScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(
    Array.isArray(onboardingData.painTypes) ? onboardingData.painTypes : []
  );
  const [description, setDescription] = useState(onboardingData.painDescription || '');
  const inputRef = useRef(null);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const appendChip = (text) => {
    setDescription(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${text}` : text;
    });
    inputRef.current?.focus();
  };

  const handleContinue = () => {
    if (!selected.length) return;
    updateOnboardingData({ painTypes: selected, painDescription: description.trim() });
    navigation.navigate('PainTriggers');
  };

  // Card sizing — grid uses 2 columns on phones, 4 on tablets
  const CARD_W = isTablet ? 156 : isSmall ? 132 : 148;
  const CARD_H = isTablet ? 124 : isSmall ? 110 : 118;
  const COLS   = isTablet ? 4 : 2;
  const gridMaxW = CARD_W * COLS + 12 * (COLS - 1);

  const dyn = {
    // paddingBottom clears the sticky footer (Continue button) — see Spacing.tabBarClearance pattern
    scrollContent: { paddingHorizontal: horizPad, paddingTop: 8, paddingBottom: sp(120, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(24, gapScale) },
    question:      { fontSize: fs(36, fontScale), lineHeight: fs(44, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    countText:     { fontSize: fs(13, fontScale) },
    grid:          { gap: sp(12, gapScale), maxWidth: gridMaxW },
    card:          { width: CARD_W, height: CARD_H },
    cardLabel:     { fontSize: fs(14, fontScale) },
    cardDesc:      { fontSize: fs(10, fontScale) },
    descTitle:     { fontSize: fs(15, fontScale) },
    descSubtitle:  { fontSize: fs(12, fontScale), lineHeight: fs(17, fontScale) },
    chipText:      { fontSize: fs(12, fontScale) },
    inputText:     { fontSize: fs(14, fontScale), lineHeight: fs(22, fontScale), minHeight: isSmall ? 90 : 110 },
    inputHint:     { fontSize: fs(11, fontScale), lineHeight: fs(16, fontScale) },
    charCount:     { fontSize: fs(11, fontScale) },
    analyzingText: { fontSize: fs(12, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={3} total={12} onBack={() => navigation.goBack()} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, dyn.scrollContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
          <View style={[s.frame, dyn.frame]}>
            {/* ── Header ── */}
            <View style={s.topBlock}>
              <Text style={[s.question, dyn.question]}>What does{'\n'}it feel like?</Text>
              <Text style={[s.hint, dyn.hint]}>Select all that apply — the more you share,{'\n'}the more precise your recovery plan</Text>
              {selected.length > 0 && (
                <View style={s.countBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={Colors.purple} />
                  <Text style={[s.countText, dyn.countText]}>{selected.length} selected</Text>
                </View>
              )}
            </View>

            {/* ── Symptom grid ── */}
            <View style={[s.grid, dyn.grid]}>
              {OPTIONS.map((opt) => {
                const isOn = selected.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[s.card, dyn.card, isOn && { borderColor: opt.color, backgroundColor: opt.color + '14' }]}
                    onPress={() => toggle(opt.id)}
                    activeOpacity={0.78}
                  >
                    {isOn && <View style={[s.glow, { backgroundColor: opt.color }]} />}

                    <View style={[s.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '55' }]}>
                      <Ionicons name={opt.icon} size={isSmall ? 20 : 22} color={isOn ? opt.color : Colors.textMuted} />
                    </View>

                    <Text style={[s.cardLabel, dyn.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                    <Text style={[s.cardDesc, dyn.cardDesc, isOn && { color: opt.color }]}>{opt.desc}</Text>

                    {isOn && (
                      <View style={[s.check, { backgroundColor: opt.color }]}>
                        <Ionicons name="checkmark" size={9} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Free-text description ── */}
            <View style={s.descSection}>
              <View style={s.descHeader}>
                <View style={s.descIconWrap}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.purple} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.descTitle, dyn.descTitle]}>Describe it in your own words</Text>
                  <Text style={[s.descSubtitle, dyn.descSubtitle]}>The more specific you are, the deeper we can go into the root cause</Text>
                </View>
              </View>

              {/* Prompt chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow} keyboardShouldPersistTaps="handled">
                {PROMPT_CHIPS.map((chip) => (
                  <TouchableOpacity key={chip.label} style={s.chip} onPress={() => appendChip(chip.text)} activeOpacity={0.7}>
                    <Text style={[s.chipText, dyn.chipText]}>{chip.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Text input */}
              <View style={[s.inputWrap, description.length > 0 && s.inputWrapActive]}>
                <TextInput
                  ref={inputRef}
                  style={[s.input, dyn.inputText]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={"Example: \"Sharp pain in my lower-left back that shoots down my left leg when I stand up from a chair. Worst in the morning, eases after 20 minutes of moving around.\""}
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  maxLength={600}
                  returnKeyType="default"
                />
                <View style={s.inputFooter}>
                  <Text style={[s.inputHint, dyn.inputHint]}>
                    <Ionicons name="information-circle-outline" size={11} color={Colors.textMuted} />
                    {' '}When did it start? Does it travel? What makes it better or worse?
                  </Text>
                  <Text style={[s.charCount, dyn.charCount, description.length > 500 && s.charCountWarning]}>
                    {description.length}/600
                  </Text>
                </View>
              </View>

              {description.length > 20 && (
                <View style={s.analyzingBadge}>
                  <Ionicons name="sparkles" size={12} color={Colors.purple} />
                  <Text style={[s.analyzingText, dyn.analyzingText]}>This will be analyzed to find your root cause pattern</Text>
                </View>
              )}
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
              {selected.length ? `Continue  ·  ${selected.length} symptom${selected.length > 1 ? 's' : ''}` : 'Select your symptoms'}
            </Text>
            {!!selected.length && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1 },
  frame:         { width: '100%', alignSelf: 'center' },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  hint:     { color: Colors.textSecondary, textAlign: 'center' },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.purpleDim, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  countText: { fontWeight: '700', color: Colors.purple },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  card: {
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
  cardLabel: { fontWeight: '700', color: Colors.textMuted },
  cardDesc:  { color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 8 },
  check: {
    position: 'absolute', top: 10, right: 10,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },

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

  // ── Description section ────────────────────────────────────────────────────
  descSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22, borderWidth: 1, borderColor: Colors.border,
    padding: 18, gap: 14,
    ...Shadows.card,
  },
  descHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  descIconWrap: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: Colors.purpleDim,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  descTitle:    { fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  descSubtitle: { color: Colors.textSecondary },

  chipsRow: { gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: Colors.purpleDim,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.purpleDim,
  },
  chipText: { fontWeight: '600', color: Colors.purpleLight },

  inputWrap: {
    backgroundColor: Colors.bgInput,
    borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border,
    padding: 14, gap: 8,
  },
  inputWrapActive: { borderColor: Colors.purple + '70' },
  input: { color: Colors.textPrimary, maxHeight: 200 },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputHint:    { color: Colors.textMuted, flex: 1 },
  charCount:    { color: Colors.textMuted, fontWeight: '600', marginLeft: 8 },
  charCountWarning: { color: Colors.amber },

  analyzingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.purpleDim,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  analyzingText: { color: Colors.purpleLight, fontWeight: '600' },
});
