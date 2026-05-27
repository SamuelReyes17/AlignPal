import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Animated, Keyboard, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

export default function EmailCaptureScreen({ navigation }) {
  const { installId, updateOnboardingData } = useOnboarding();
  const saveLead = useMutation(api.leads.saveLead);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fadeIn   = useRef(new Animated.Value(0)).current;
  const slideUp  = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    Keyboard.dismiss();

    updateOnboardingData({ email: trimmed });

    if (installId) {
      try {
        await saveLead({ installId, email: trimmed });
      } catch (e) {
        console.error('[EmailCaptureScreen] Failed to save lead:', e);
      }
    }

    setLoading(false);
    navigation.replace('PainProfile');
  };

  const handleSkip = () => {
    navigation.replace('PainProfile');
  };

  const canSubmit = isValidEmail(email.trim()) && !loading;

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(32, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(20, gapScale) },
    iconRing:      { width: isSmall ? 70 : isTablet ? 90 : 80, height: isSmall ? 70 : isTablet ? 90 : 80 },
    title:         { fontSize: fs(32, fontScale) },
    subtitle:      { fontSize: fs(15, fontScale), lineHeight: fs(23, fontScale) },
    benefitText:   { fontSize: fs(13, fontScale) },
    inputText:     { fontSize: fs(16, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    skipText:      { fontSize: fs(14, fontScale) },
    privacyText:   { fontSize: fs(12, fontScale) },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={s.scroll}
          contentContainerStyle={[s.scrollContent, dyn.scrollContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[s.frame, dyn.frame, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>

            {/* Icon */}
            <View style={[s.iconRing, dyn.iconRing]}>
              <Ionicons name="mail" size={isSmall ? 28 : isTablet ? 36 : 32} color={Colors.purple} />
            </View>

            {/* Headline */}
            <Text style={[s.title, dyn.title]}>Your plan is ready.</Text>
            <Text style={[s.subtitle, dyn.subtitle]}>
              Where should we send your personalized recovery plan and weekly progress tips?
            </Text>

            {/* Benefits row */}
            <View style={s.benefitsRow}>
              {[
                { icon: 'checkmark-circle', text: 'Your recovery protocol' },
                { icon: 'checkmark-circle', text: 'Weekly progress tips' },
                { icon: 'checkmark-circle', text: 'Pain relief guides' },
              ].map((b) => (
                <View key={b.text} style={s.benefitItem}>
                  <Ionicons name={b.icon} size={14} color={Colors.purpleLight} />
                  <Text style={[s.benefitText, dyn.benefitText]}>{b.text}</Text>
                </View>
              ))}
            </View>

            {/* Email input */}
            <View style={[s.inputWrap, error ? s.inputWrapError : email.length > 0 && isValidEmail(email.trim()) && s.inputWrapValid]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={error ? Colors.purple : isValidEmail(email.trim()) ? Colors.purpleLight : Colors.textMuted}
                style={s.inputIcon}
              />
              <TextInput
                style={[s.input, dyn.inputText]}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {error ? (
              <View style={s.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color={Colors.purple} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Privacy note */}
            <View style={s.privacyRow}>
              <Ionicons name="lock-closed-outline" size={12} color={Colors.textMuted} />
              <Text style={[s.privacyText, dyn.privacyText]}>No spam. Unsubscribe anytime.</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[s.btn, !canSubmit && s.btnDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.88}
            >
              {loading ? (
                <Text style={[s.btnText, dyn.btnText]}>Saving…</Text>
              ) : (
                <>
                  <Text style={[s.btnText, dyn.btnText]}>Send My Plan</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                </>
              )}
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity style={s.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
              <Text style={[s.skipText, dyn.skipText]}>Skip for now</Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  frame:         { width: '100%', alignSelf: 'center', alignItems: 'center' },

  iconRing: {
    borderRadius: 40,
    backgroundColor: Colors.purpleDim,
    borderWidth: 1.5, borderColor: Colors.purple + '40',
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.purpleSoft,
  },

  title:    { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.8, textAlign: 'center' },
  subtitle: { color: Colors.textSecondary, textAlign: 'center', maxWidth: 360 },

  benefitsRow: { gap: 8, alignSelf: 'stretch' },
  benefitItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.bgCard, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  benefitText: { color: Colors.textSecondary, fontWeight: '600' },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.bgInput,
    borderRadius: 18, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 16, gap: 10,
  },
  inputWrapError: { borderColor: Colors.purple + '80' },
  inputWrapValid: { borderColor: Colors.purpleLight + '80' },
  inputIcon: { flexShrink: 0 },
  input:     { flex: 1, color: Colors.textPrimary, fontWeight: '500' },

  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  errorText: { fontSize: 12, color: Colors.purple, fontWeight: '600' },

  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  privacyText: { color: Colors.textMuted },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    alignSelf: 'stretch',
    backgroundColor: Colors.purple, borderRadius: 20,
    paddingVertical: 18, ...Shadows.purple,
  },
  btnDisabled: { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText: { fontWeight: '700', color: Colors.white },

  skipBtn: { paddingVertical: 4 },
  skipText: { color: Colors.textMuted, textDecorationLine: 'underline' },
});
