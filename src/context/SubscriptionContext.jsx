/**
 * AlignPal — SubscriptionContext
 *
 * Single source of truth for the user's subscription status.
 * Wrap the entire app with <SubscriptionProvider> so any screen
 * can call useSubscription() to know if they're premium.
 *
 * Usage:
 *   const { isPremium, isLoading, packages, purchasePackage } = useSubscription();
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getInstallId } from '../services/deviceId';
import {
  initializePurchases,
  getOfferings,
  purchasePackage as rcPurchasePackage,
  restorePurchases as rcRestorePurchases,
  checkPremiumStatus,
  getCustomerInfo,
  hasAlignPalPro,
  addCustomerInfoListener,
  presentAlignPalPaywallIfNeeded,
  presentCustomerCenter as rcPresentCustomerCenter,
} from '../services/purchases';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};

export const SubscriptionProvider = ({ children }) => {
  const [isPremium, setIsPremium]   = useState(false);
  const [isLoading, setIsLoading]   = useState(true);  // true while SDK initializes
  const [packages, setPackages]     = useState([]);     // RevenueCat Package objects
  const [purchasing, setPurchasing] = useState(false);  // true while a purchase is in flight
  const [restoring, setRestoring]   = useState(false);  // true while restoring
  const [customerInfo, setCustomerInfo] = useState(null);

  // ─── Initialize SDK + check status on mount ─────────────────────────────────
  useEffect(() => {
    let removeCustomerInfoListener = null;
    async function init() {
      try {
        const id = await getInstallId();
        await initializePurchases(id);

        // Load current premium status
        const info = await getCustomerInfo();
        setCustomerInfo(info);
        setIsPremium(hasAlignPalPro(info));

        // Pre-fetch offerings so the paywall loads instantly
        const pkgs = await getOfferings();
        setPackages(pkgs);

        removeCustomerInfoListener = addCustomerInfoListener((updatedInfo) => {
          setCustomerInfo(updatedInfo);
          setIsPremium(hasAlignPalPro(updatedInfo));
        });
      } catch (e) {
        console.error('[SubscriptionContext] Init error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
    return () => {
      if (removeCustomerInfoListener) {
        removeCustomerInfoListener();
      }
    };
  }, []);

  // ─── Purchase a package ──────────────────────────────────────────────────────
  const purchase = useCallback(async (pkg) => {
    setPurchasing(true);
    try {
      const result = await rcPurchasePackage(pkg);
      if (result.success) {
        setIsPremium(true);
      }
      if (result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        setIsPremium(hasAlignPalPro(result.customerInfo));
      }
      return result;
    } finally {
      setPurchasing(false);
    }
  }, []);

  // ─── Restore purchases ───────────────────────────────────────────────────────
  const restore = useCallback(async () => {
    setRestoring(true);
    try {
      const result = await rcRestorePurchases();
      if (result.success && result.isPremium) {
        setIsPremium(true);
      }
      if (result.customerInfo) {
        setCustomerInfo(result.customerInfo);
      }
      return result;
    } finally {
      setRestoring(false);
    }
  }, []);

  // ─── Refresh status (call after returning from background) ───────────────────
  const refresh = useCallback(async () => {
    const info = await getCustomerInfo();
    setCustomerInfo(info);
    setIsPremium(hasAlignPalPro(info));
  }, []);

  const showPaywallIfNeeded = useCallback(async () => {
    const paywallResult = await presentAlignPalPaywallIfNeeded();
    if (!paywallResult.success) return paywallResult;
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
    return { ...paywallResult, isPremium: premium };
  }, []);

  const presentCustomerCenter = useCallback(async () => {
    const result = await rcPresentCustomerCenter();
    if (result.success) {
      await refresh();
    }
    return result;
  }, [refresh]);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isLoading,
        packages,
        customerInfo,
        purchasing,
        restoring,
        purchase,
        restore,
        refresh,
        showPaywallIfNeeded,
        presentCustomerCenter,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
