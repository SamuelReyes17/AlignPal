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
import {
  initializePurchases,
  getOfferings,
  purchasePackage as rcPurchasePackage,
  restorePurchases as rcRestorePurchases,
  checkPremiumStatus,
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

  // ─── Initialize SDK + check status on mount ─────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        await initializePurchases();

        // Load current premium status
        const premium = await checkPremiumStatus();
        setIsPremium(premium);

        // Pre-fetch offerings so the paywall loads instantly
        const pkgs = await getOfferings();
        setPackages(pkgs);
      } catch (e) {
        console.error('[SubscriptionContext] Init error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // ─── Purchase a package ──────────────────────────────────────────────────────
  const purchase = useCallback(async (pkg) => {
    setPurchasing(true);
    try {
      const result = await rcPurchasePackage(pkg);
      if (result.success) {
        setIsPremium(true);
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
      return result;
    } finally {
      setRestoring(false);
    }
  }, []);

  // ─── Refresh status (call after returning from background) ───────────────────
  const refresh = useCallback(async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isLoading,
        packages,
        purchasing,
        restoring,
        purchase,
        restore,
        refresh,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
