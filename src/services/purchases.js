/**
 * AlignPal — RevenueCat Purchase Service
 *
 * This wraps the react-native-purchases SDK so the rest of the app
 * never has to touch RevenueCat directly.
 *
 * PRODUCT IDs — these must exactly match what you create in:
 *   - App Store Connect (under your app → Subscriptions / In-App Purchases)
 *   - Google Play Console (under your app → Monetize → Subscriptions)
 *
 * ENTITLEMENT ID — create one entitlement in RevenueCat called "premium"
 *   and attach all three products to it.
 */

import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── Replace these with your real RevenueCat API keys ────────────────────────
const RC_API_KEY_IOS     = 'appl_REPLACE_WITH_YOUR_IOS_KEY';
const RC_API_KEY_ANDROID = 'goog_REPLACE_WITH_YOUR_ANDROID_KEY';
// ─────────────────────────────────────────────────────────────────────────────

// The entitlement name you create in the RevenueCat dashboard
export const ENTITLEMENT_ID = 'premium';

// Product identifiers — must match App Store Connect + Play Console exactly
export const PRODUCT_IDS = {
  MONTHLY:  'alignpal_monthly',   // $9.99/month, 7-day free trial
  YEARLY:   'alignpal_yearly',    // $59.99/year (~$5/month)
  LIFETIME: 'alignpal_lifetime',  // $99.99 one-time
};

// Human-readable labels for the UI
export const PLAN_LABELS = {
  [PRODUCT_IDS.MONTHLY]: {
    title: 'Monthly',
    price: '$9.99',
    period: '/month',
    savings: null,
    badge: null,
    trial: '7-day free trial',
  },
  [PRODUCT_IDS.YEARLY]: {
    title: 'Yearly',
    price: '$59.99',
    period: '/year',
    savings: 'Save 50%',
    badge: 'BEST VALUE',
    trial: null,
  },
  [PRODUCT_IDS.LIFETIME]: {
    title: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    savings: 'Never pay again',
    badge: null,
    trial: null,
  },
};

/**
 * Call once at app startup (inside App.jsx).
 * Configures the SDK and sets up the user.
 */
export async function initializePurchases(userId = null) {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    await Purchases.configure({ apiKey });

    // If the user is authenticated, identify them so purchase history syncs
    if (userId) {
      await Purchases.logIn(userId);
    }
  } catch (error) {
    console.error('[Purchases] Initialization failed:', error);
  }
}

/**
 * Fetch available packages from RevenueCat.
 * Returns an array of Purchases.Package objects, or [] on failure.
 */
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current?.availablePackages?.length > 0) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('[Purchases] Failed to fetch offerings:', error);
    return [];
  }
}

/**
 * Purchase a package.
 * Returns { success: true } or { success: false, error, userCancelled }
 */
export async function purchasePackage(pkg) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    return { success: isPremium };
  } catch (error) {
    if (!error.userCancelled) {
      console.error('[Purchases] Purchase failed:', error);
    }
    return {
      success: false,
      error: error.message,
      userCancelled: error.userCancelled ?? false,
    };
  }
}

/**
 * Restore previous purchases (required by App Store guidelines).
 * Returns { success: true, isPremium } or { success: false, error }
 */
export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    return { success: true, isPremium };
  } catch (error) {
    console.error('[Purchases] Restore failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if the current user has an active premium entitlement.
 * Use this to gate features anywhere in the app.
 */
export async function checkPremiumStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error('[Purchases] Status check failed:', error);
    return false;
  }
}
