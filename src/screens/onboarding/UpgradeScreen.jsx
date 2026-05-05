/**
 * AlignPal — Upgrade / Paywall Screen
 *
 * Shown at the end of onboarding. Lets users start a 7-day free trial
 * (monthly), buy yearly, or buy lifetime access.
 *
 * Wired to RevenueCat via SubscriptionContext.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { PRODUCT_IDS, PLAN_LABELS } from '../../services/purchases';
import { Colors, Shadows, Gradients, Radius, Surfaces } from '../../constants/brand';
import GradientCard from '../../components/GradientCard';
import { useResponsive, fs, sp } from '../../utils/responsive';

const PREMIUM_FEATURES = [
  { icon: 'body-outline',          text: 'Personalized pain recovery plan' },
  { icon: 'barbell-outline',       text: 'Full exercise library (50+ routines)' },
  { icon: 'trending-up-outline',   text: 'Pain & progress tracking' },
  { icon: 'notifications-outline', text: 'Daily recovery reminders' },
  { icon: 'sparkles-outline',      text: 'AI posture analysis' },
  { icon: 'infinite-outline',      text: 'New exercises added weekly' },
];

export default function UpgradeScreen({ navigation }) {
  const { completeOnboarding } = useOnboarding();
  const { packages, purchase, restore, purchasing, restoring, isPremium, showPaywallIfNeeded } = useSubscription();
  const { width } = useWindowDimensions();
  const { isSmall, isTablet, isShort, horizPad, fontScale, gapScale } = useResponsive();
  const wideFrame = Math.min(width - horizPad * 2, 600);

  const [selectedProductId, setSelectedProductId] = useState(PRODUCT_IDS.YEARLY);

  const packageMap = packages.reduce((acc, pkg) => {
    acc[pkg.product.identifier] = pkg;
    return acc;
  }, {});

  const planOrder = [PRODUCT_IDS.MONTHLY, PRODUCT_IDS.YEARLY, PRODUCT_IDS.LIFETIME];

  const handlePurchase = async () => {
    const pkg = packageMap[selectedProductId];
    if (!pkg) {
      Alert.alert('Products not loaded', 'Could not connect to the store. Please check your connection and try again.', [{ text: 'OK' }]);
      return;
    }
    const result = await purchase(pkg);
    if (result.success) {
      completeOnboarding();
    } else if (!result.userCancelled) {
      Alert.alert('Purchase failed', result.error ?? 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleRestore = async () => {
    const result = await restore();
    if (result.success && result.isPremium) {
      Alert.alert('Restored!', 'Your premium access has been restored.', [
        { text: 'Continue', onPress: completeOnboarding },
      ]);
    } else if (result.success && !result.isPremium) {
      Alert.alert('No purchases found', 'We couldn\'t find any previous purchases for this account.', [{ text: 'OK' }]);
    } else {
      Alert.alert('Restore failed', result.error ?? 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleContinueFree = () => completeOnboarding();

  const handleRevenueCatPaywall = async () => {
    const result = await showPaywallIfNeeded();
    if (!result.success) {
      Alert.alert('Paywall error', result.error ?? 'Unable to open paywall right now.');
      return;
    }
    if (result.isPremium) completeOnboarding();
  };

  if (isPremium) {
    completeOnboarding();
    return null;
  }

  const getDisplayPrice = (productId) => {
    const pkg = packageMap[productId];
    if (pkg) return pkg.product.priceString;
    return PLAN_LABELS[productId]?.price ?? '–';
  };

  const isLoading = purchasing || restoring;

  const dyn = {
    content:        { paddingHorizontal: horizPad, paddingBottom: sp(16, gapScale) },
    frame:          { maxWidth: wideFrame },
    upHeroIconRing: { width: isSmall ? 56 : isTablet ? 76 : 64, height: isSmall ? 56 : isTablet ? 76 : 64 },
    upHeroTitle:    { fontSize: fs(28, fontScale), lineHeight: fs(34, fontScale) },
    upHeroSub:      { fontSize: fs(14, fontScale), lineHeight: fs(22, fontScale) },
    featureText:    { fontSize: fs(14, fontScale) },
    planTitle:      { fontSize: fs(16, fontScale) },
    planTrial:      { fontSize: fs(12, fontScale) },
    planSavings:    { fontSize: fs(12, fontScale) },
    planPrice:      { fontSize: fs(17, fontScale) },
    planPeriod:     { fontSize: fs(11, fontScale) },
    planBadgeText:  { fontSize: fs(10, fontScale) },
    guarantee:      { fontSize: fs(12, fontScale), lineHeight: fs(18, fontScale) },
    ctaText:        { fontSize: fs(17, fontScale) },
    skipText:       { fontSize: fs(13, fontScale) },
    legalText:      { fontSize: fs(10, fontScale), lineHeight: fs(15, fontScale) },
    paywallLinkText:{ fontSize: fs(12, fontScale) },
    footer:         { paddingHorizontal: horizPad, paddingBottom: isShort ? 12 : 16, paddingTop: 12 },
    footerInner:    { maxWidth: wideFrame },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, dyn.content]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.frame, dyn.frame]}>
          {/* ═══ Gradient hero ═══════════════════════════════════════════════ */}
          <View style={{ marginBottom: 24 }}>
            <GradientCard
              colors={Gradients.purpleHero}
              radius={Radius.hero}
              blobs={[
                { x: '88%', y: '15%', r: 80, color: '#FFFFFF', opacity: 0.12 },
                { x: '12%', y: '90%', r: 60, color: '#FFFFFF', opacity: 0.08 },
              ]}
              style={Shadows.purple}
            >
              <View style={[styles.upHeroIconRing, dyn.upHeroIconRing]}>
                <Ionicons name="flash" size={isSmall ? 26 : isTablet ? 38 : 32} color="#FFFFFF" />
              </View>
              <Text style={[styles.upHeroTitle, dyn.upHeroTitle]}>Unlock Full Recovery</Text>
              <Text style={[styles.upHeroSub, dyn.upHeroSub]}>
                Your personalized plan is ready. Start your free trial to begin.
              </Text>
            </GradientCard>
          </View>

          {/* Feature list */}
          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={f.icon} size={18} color={Colors.purple} />
                </View>
                <Text style={[styles.featureText, dyn.featureText]}>{f.text}</Text>
              </View>
            ))}
          </View>

          {/* Plan selector */}
          <View style={styles.planSection}>
            {planOrder.map((productId) => {
              const label   = PLAN_LABELS[productId];
              const isSelected = selectedProductId === productId;

              return (
                <TouchableOpacity
                  key={productId}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => setSelectedProductId(productId)}
                  activeOpacity={0.8}
                >
                  {label.badge && (
                    <View style={styles.planBadge}>
                      <Text style={[styles.planBadgeText, dyn.planBadgeText]}>{label.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planRow}>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>

                    <View style={styles.planMeta}>
                      <Text style={[styles.planTitle, dyn.planTitle, isSelected && styles.planTitleSelected]}>
                        {label.title}
                      </Text>
                      {label.trial && (<Text style={[styles.planTrial, dyn.planTrial]}>{label.trial}</Text>)}
                      {label.savings && (<Text style={[styles.planSavings, dyn.planSavings]}>{label.savings}</Text>)}
                    </View>

                    <View style={styles.planPriceWrap}>
                      <Text style={[styles.planPrice, dyn.planPrice, isSelected && styles.planPriceSelected]}>
                        {getDisplayPrice(productId)}
                      </Text>
                      <Text style={[styles.planPeriod, dyn.planPeriod]}>{label.period}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legal / guarantee */}
          <Text style={[styles.guarantee, dyn.guarantee]}>
            {selectedProductId === PRODUCT_IDS.MONTHLY
              ? '7 days free, then billed monthly. Cancel anytime.'
              : selectedProductId === PRODUCT_IDS.YEARLY
              ? 'Billed once per year. Cancel before renewal to avoid charges.'
              : 'One-time payment. Access forever, no recurring charges.'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, dyn.footer]}>
        <View style={[styles.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
            onPress={handlePurchase}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={[styles.ctaText, dyn.ctaText]}>
                {selectedProductId === PRODUCT_IDS.MONTHLY
                  ? 'Start Free Trial'
                  : selectedProductId === PRODUCT_IDS.YEARLY
                  ? 'Get Yearly Access'
                  : 'Get Lifetime Access'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity onPress={handleContinueFree} disabled={isLoading}>
              <Text style={[styles.skipText, dyn.skipText]}>Continue free</Text>
            </TouchableOpacity>

            <Text style={[styles.dot, dyn.skipText]}>·</Text>

            <TouchableOpacity onPress={handleRestore} disabled={isLoading}>
              <Text style={[styles.restoreText, dyn.skipText]}>Restore purchases</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleRevenueCatPaywall} disabled={isLoading} style={styles.paywallLinkButton}>
            <Text style={[styles.paywallLinkText, dyn.paywallLinkText]}>Open RevenueCat Paywall</Text>
          </TouchableOpacity>

          <Text style={[styles.legalText, dyn.legalText]}>
            {Platform.OS === 'ios'
              ? 'Payment charged to your Apple ID account. Subscription renews automatically unless cancelled 24 hours before the end of the current period.'
              : 'Payment charged to your Google Play account. Manage or cancel your subscription at any time in Google Play.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  scrollView: { flex: 1 },
  content:    {},
  frame:      { width: '100%', alignSelf: 'center' },

  upHeroIconRing:  { borderRadius: Radius.lg, backgroundColor: Surfaces.onNavy22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  upHeroTitle:     { fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.6, marginBottom: 8 },
  upHeroSub:       { color: Surfaces.onNavy92, fontWeight: '600' },

  featureList: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 16, gap: 10,
    marginBottom: 24,
    borderWidth: 1, borderColor: Colors.border,
  },
  featureRow:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.bgElevated, justifyContent: 'center', alignItems: 'center' },
  featureText:     { color: Colors.textSecondary, flex: 1 },

  planSection: { gap: 10, marginBottom: 12 },
  planCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  planCardSelected: { borderColor: Colors.purple, backgroundColor: Colors.bgElevated },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.purple,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, marginBottom: 10,
  },
  planBadgeText: { fontWeight: '700', color: Colors.white, letterSpacing: 0.5 },
  planRow:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio:         { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: Colors.purple },
  radioDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.purple },
  planMeta:      { flex: 1 },
  planTitle:     { fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  planTitleSelected: { color: Colors.textPrimary },
  planTrial:     { color: Colors.purpleLight, fontWeight: '500' },
  planSavings:   { color: Colors.green, fontWeight: '500' },
  planPriceWrap: { alignItems: 'flex-end' },
  planPrice:     { fontWeight: '700', color: Colors.textSecondary },
  planPriceSelected: { color: Colors.textPrimary },
  planPeriod:    { color: Colors.textMuted, marginTop: 1 },

  guarantee:     { color: Colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: 8 },

  footer:        { borderTopWidth: 1, borderTopColor: Colors.borderSubtle, alignItems: 'center' },
  footerInner:   { width: '100%', alignSelf: 'center' },
  ctaButton:     { backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginBottom: 14, ...Shadows.purple },
  ctaButtonDisabled: { opacity: 0.6 },
  ctaText:       { fontWeight: '700', color: Colors.white, letterSpacing: 0.2 },
  secondaryRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 },
  skipText:      { color: Colors.purpleLight },
  dot:           { color: Colors.textMuted },
  restoreText:   { color: Colors.purpleLight },
  legalText:     { color: Colors.textMuted, textAlign: 'center' },
  paywallLinkButton: { alignSelf: 'center', marginBottom: 10 },
  paywallLinkText:   { color: Colors.textSecondary, textDecorationLine: 'underline' },
});
