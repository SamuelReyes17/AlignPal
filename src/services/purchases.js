import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS ?? 'test_eKygddvWnLCVbsmDukSbHsKtILk';
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID ?? 'test_eKygddvWnLCVbsmDukSbHsKtILk';

// Entitlement identifier configured in RevenueCat dashboard.
export const ENTITLEMENT_ID = 'AlignPal Pro';

// Product identifiers requested for AlignPal.
export const PRODUCT_IDS = {
  LIFETIME: 'lifetime',
  YEARLY: 'yearly',
  MONTHLY: 'monthly',
};

export const PLAN_LABELS = {
  [PRODUCT_IDS.MONTHLY]: { title: 'Monthly', period: '/month', badge: null },
  [PRODUCT_IDS.YEARLY]: { title: 'Yearly', period: '/year', badge: 'BEST VALUE' },
  [PRODUCT_IDS.LIFETIME]: { title: 'Lifetime', period: 'one-time', badge: null },
};

function getPlatformApiKey() {
  return Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
}

export function hasAlignPalPro(customerInfo) {
  return Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]);
}

export async function initializePurchases(appUserID = null) {
  try {
    const isConfigured = await Purchases.isConfigured();
    if (!isConfigured) {
      if (__DEV__) {
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      const apiKey = getPlatformApiKey();
      if (!apiKey) {
        throw new Error('Missing RevenueCat API key for this platform.');
      }

      Purchases.configure({
        apiKey,
        appUserID: appUserID ?? undefined,
      });
    } else if (appUserID) {
      await Purchases.logIn(appUserID);
    }
  } catch (error) {
    console.error('[Purchases] Initialization failed:', error);
    throw error;
  }
}

export function addCustomerInfoListener(listener) {
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export async function getCustomerInfo() {
  return Purchases.getCustomerInfo();
}

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch (error) {
    console.error('[Purchases] Failed to fetch offerings:', error);
    return [];
  }
}

export async function purchasePackage(aPackage) {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(aPackage);
    return {
      success: hasAlignPalPro(customerInfo),
      customerInfo,
      productIdentifier,
      userCancelled: false,
      error: null,
    };
  } catch (error) {
    if (!error?.userCancelled) {
      console.error('[Purchases] Purchase failed:', error);
    }
    return {
      success: false,
      customerInfo: null,
      productIdentifier: null,
      userCancelled: error?.userCancelled ?? false,
      error: error?.message ?? 'Purchase failed',
    };
  }
}

export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, isPremium: hasAlignPalPro(customerInfo), customerInfo, error: null };
  } catch (error) {
    console.error('[Purchases] Restore failed:', error);
    return { success: false, isPremium: false, customerInfo: null, error: error?.message ?? 'Restore failed' };
  }
}

export async function checkPremiumStatus() {
  try {
    const customerInfo = await getCustomerInfo();
    return hasAlignPalPro(customerInfo);
  } catch (error) {
    console.error('[Purchases] Status check failed:', error);
    return false;
  }
}

export async function presentAlignPalPaywallIfNeeded() {
  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
      displayCloseButton: true,
    });
    return { success: true, result, error: null };
  } catch (error) {
    console.error('[Purchases] Paywall presentation failed:', error);
    return { success: false, result: PAYWALL_RESULT.ERROR, error: error?.message ?? 'Paywall failed' };
  }
}

export async function presentCustomerCenter() {
  try {
    await RevenueCatUI.presentCustomerCenter();
    return { success: true, error: null };
  } catch (error) {
    console.error('[Purchases] Customer Center failed:', error);
    return { success: false, error: error?.message ?? 'Customer Center failed' };
  }
}
