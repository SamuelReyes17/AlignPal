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
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { PRODUCT_IDS, PLAN_LABELS } from '../../services/purchases';

// Features shown in the paywall feature list
const PREMIUM_FEATURES = [
  { icon: 'body-outline',        text: 'Personalized pain recovery plan' },
  { icon: 'barbell-outline',     text: 'Full exercise library (50+ routines)' },
  { icon: 'trending-up-outline', text: 'Pain & progress tracking' },
  { icon: 'notifications-outline', text: 'Daily recovery reminders' },
  { icon: 'sparkles-outline',    text: 'AI posture analysis' },
  { icon: 'infinite-outline',    text: 'New exercises added weekly' },
];

export default function UpgradeScreen({ navigation }) {
  const { completeOnboarding } = useOnboarding();
  const { packages, purchase, restore, purchasing, restoring, isPremium } = useSubscription();

  // Default selected plan — yearly drives the best LTV
  const [selectedProductId, setSelectedProductId] = useState(PRODUCT_IDS.YEARLY);

  // Map RevenueCat packages by their product identifier for easy lookup
  const packageMap = packages.reduce((acc, pkg) => {
    acc[pkg.product.identifier] = pkg;
    return acc;
  }, {});

  const planOrder = [PRODUCT_IDS.MONTHLY, PRODUCT_IDS.YEARLY, PRODUCT_IDS.LIFETIME];

  // ─── Handle purchase ──────────────────────────────────────────────────────────
  const handlePurchase = async () => {
    const pkg = packageMap[selectedProductId];

    // If packages haven't loaded yet, still let them in (graceful fallback)
    if (!pkg) {
      Alert.alert(
        'Products not loaded',
        'Could not connect to the store. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await purchase(pkg);

    if (result.success) {
      completeOnboarding();
      // Navigation switches automatically via RootNavigator when isOnboardingComplete = true
    } else if (!result.userCancelled) {
      Alert.alert(
        'Purchase failed',
        result.error ?? 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // ─── Handle restore ───────────────────────────────────────────────────────────
  const handleRestore = async () => {
    const result = await restore();
    if (result.success && result.isPremium) {
      Alert.alert('Restored!', 'Your premium access has been restored.', [
        { text: 'Continue', onPress: completeOnboarding },
      ]);
    } else if (result.success && !result.isPremium) {
      Alert.alert('No purchases found', 'We couldn\'t find any previous purchases for this account.', [
        { text: 'OK' },
      ]);
    } else {
      Alert.alert('Restore failed', result.error ?? 'Please try again.', [{ text: 'OK' }]);
    }
  };

  // ─── Skip to free plan ────────────────────────────────────────────────────────
  const handleContinueFree = () => {
    completeOnboarding();
  };

  // ─── If already premium (e.g. user came back), skip straight in ──────────────
  if (isPremium) {
    completeOnboarding();
    return null;
  }

  // ─── Get real price from RevenueCat package or fall back to label default ─────
  const getDisplayPrice = (productId) => {
    const pkg = packageMap[productId];
    if (pkg) {
      return pkg.product.priceString;
    }
    return PLAN_LABELS[productId]?.price ?? '–';
  };

  const isLoading = purchasing || restoring;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progress bar */}
      <View style={styles.progressHeader}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconBadge}>
            <Ionicons name="flash" size={32} color="#5B8DFF" />
          </View>
          <Text style={styles.heroTitle}>Unlock Full Recovery</Text>
          <Text style={styles.heroSubtitle}>
            Your personalized plan is ready. Start your free trial to begin.
          </Text>
        </View>

        {/* Feature list */}
        <View style={styles.featureList}>
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={18} color="#5B8DFF" />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
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
                {/* Badge */}
                {label.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{label.badge}</Text>
                  </View>
                )}

                <View style={styles.planRow}>
                  {/* Radio */}
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>

                  {/* Title + trial note */}
                  <View style={styles.planMeta}>
                    <Text style={[styles.planTitle, isSelected && styles.planTitleSelected]}>
                      {label.title}
                    </Text>
                    {label.trial && (
                      <Text style={styles.planTrial}>{label.trial}</Text>
                    )}
                    {label.savings && (
                      <Text style={styles.planSavings}>{label.savings}</Text>
                    )}
                  </View>

                  {/* Price */}
                  <View style={styles.planPriceWrap}>
                    <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                      {getDisplayPrice(productId)}
                    </Text>
                    <Text style={styles.planPeriod}>{label.period}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legal / guarantee */}
        <Text style={styles.guarantee}>
          {selectedProductId === PRODUCT_IDS.MONTHLY
            ? '7 days free, then billed monthly. Cancel anytime.'
            : selectedProductId === PRODUCT_IDS.YEARLY
            ? 'Billed once per year. Cancel before renewal to avoid charges.'
            : 'One-time payment. Access forever, no recurring charges.'}
        </Text>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        {/* Main CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
          onPress={handlePurchase}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0E1625" />
          ) : (
            <Text style={styles.ctaText}>
              {selectedProductId === PRODUCT_IDS.MONTHLY
                ? 'Start Free Trial'
                : selectedProductId === PRODUCT_IDS.YEARLY
                ? 'Get Yearly Access'
                : 'Get Lifetime Access'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Secondary actions */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity onPress={handleContinueFree} disabled={isLoading}>
            <Text style={styles.skipText}>Continue free</Text>
          </TouchableOpacity>

          <Text style={styles.dot}>·</Text>

          <TouchableOpacity onPress={handleRestore} disabled={isLoading}>
            <Text style={styles.restoreText}>Restore purchases</Text>
          </TouchableOpacity>
        </View>

        {/* Apple / Google required legal */}
        <Text style={styles.legalText}>
          {Platform.OS === 'ios'
            ? 'Payment charged to your Apple ID account. Subscription renews automatically unless cancelled 24 hours before the end of the current period.'
            : 'Payment charged to your Google Play account. Manage or cancel your subscription at any time in Google Play.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1625',
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#1F2A3D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B8DFF',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#7F8FA9',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // Feature list
  featureList: {
    backgroundColor: '#1A2335',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#B8C5D6',
    flex: 1,
  },

  // Plan selector
  planSection: {
    gap: 10,
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#1A2335',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2A3547',
  },
  planCardSelected: {
    borderColor: '#5B8DFF',
    backgroundColor: '#1C2B45',
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5B8DFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0E1625',
    letterSpacing: 0.5,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3A4B62',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#5B8DFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5B8DFF',
  },
  planMeta: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8FA9',
    marginBottom: 2,
  },
  planTitleSelected: {
    color: '#FFFFFF',
  },
  planTrial: {
    fontSize: 12,
    color: '#5B8DFF',
    fontWeight: '500',
  },
  planSavings: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  planPriceWrap: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#7F8FA9',
  },
  planPriceSelected: {
    color: '#FFFFFF',
  },
  planPeriod: {
    fontSize: 11,
    color: '#4A5A72',
    marginTop: 1,
  },

  guarantee: {
    fontSize: 12,
    color: '#4A5A72',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 8,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A2335',
  },
  ctaButton: {
    backgroundColor: '#5B8DFF',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 14,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E1625',
    letterSpacing: 0.2,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  skipText: {
    fontSize: 13,
    color: '#5B8DFF',
  },
  dot: {
    fontSize: 13,
    color: '#3A4B62',
  },
  restoreText: {
    fontSize: 13,
    color: '#5B8DFF',
  },
  legalText: {
    fontSize: 10,
    color: '#3A4B62',
    textAlign: 'center',
    lineHeight: 15,
  },
});
