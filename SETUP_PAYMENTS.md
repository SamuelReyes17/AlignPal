# AlignPal — Payment Setup Guide

Follow these steps exactly, in order. Once done, AlignPal will be able to charge real users.

---

## Step 1 — Install the RevenueCat SDK

Run this in your project folder:

```bash
npm install react-native-purchases
npx expo install react-native-purchases
```

Then install EAS CLI (used to build the app with native code):

```bash
npm install -g eas-cli
eas login
```

---

## Step 2 — Create Your RevenueCat Account

1. Go to [app.revenuecat.com](https://app.revenuecat.com) and sign up (free)
2. Click **"Create new project"** → name it **AlignPal**
3. You'll land on the project dashboard

---

## Step 3 — Add iOS App in RevenueCat

1. In RevenueCat dashboard → **"Apps"** tab → **"+ New App"**
2. Select **App Store**
3. Fill in:
   - App name: `AlignPal`
   - Bundle ID: `com.alignpal.app`
4. Copy the **iOS API Key** (starts with `appl_...`)
5. Paste it into `src/services/purchases.js` → replace `appl_REPLACE_WITH_YOUR_IOS_KEY`

---

## Step 4 — Add Android App in RevenueCat

1. In RevenueCat → **"Apps"** → **"+ New App"**
2. Select **Google Play**
3. Fill in:
   - App name: `AlignPal`
   - Package name: `com.alignpal.app`
4. Copy the **Android API Key** (starts with `goog_...`)
5. Paste it into `src/services/purchases.js` → replace `goog_REPLACE_WITH_YOUR_ANDROID_KEY`

---

## Step 5 — Create Products in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create your app (if you haven't yet)
3. Go to **"Monetization"** → **"Subscriptions"** → create a subscription group called `AlignPal Premium`
4. Create these two subscription products:

   | Product ID              | Type                     | Price      | Free Trial |
   |-------------------------|--------------------------|------------|------------|
   | `alignpal_monthly`      | Auto-Renewable           | $9.99/mo   | 7 days     |
   | `alignpal_yearly`       | Auto-Renewable           | $59.99/yr  | None       |

5. Then go to **"In-App Purchases"** → create a non-consumable:

   | Product ID              | Type             | Price  |
   |-------------------------|------------------|--------|
   | `alignpal_lifetime`     | Non-Consumable   | $99.99 |

6. Submit each product for review (they review alongside your first app version)

---

## Step 6 — Create Products in Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Create your app
3. Go to **"Monetize"** → **"Subscriptions"** → create:

   | Product ID              | Price      | Free Trial |
   |-------------------------|------------|------------|
   | `alignpal_monthly`      | $9.99/mo   | 7 days     |
   | `alignpal_yearly`       | $59.99/yr  | None       |

4. Go to **"In-app products"** → create:

   | Product ID              | Price  |
   |-------------------------|--------|
   | `alignpal_lifetime`     | $99.99 |

---

## Step 7 — Attach Products to RevenueCat Entitlement

1. In RevenueCat → **"Products"** tab → **"+ New Product"**
2. Add all three product IDs for both iOS and Android
3. Go to **"Entitlements"** → **"+ New Entitlement"**
   - Identifier: `premium`  ← must match exactly what's in `purchases.js`
   - Attach all 3 products to this entitlement
4. Go to **"Offerings"** → **"+ New Offering"**
   - Identifier: `default`
   - Add all 3 products as packages

---

## Step 8 — Build the App (EAS Build)

Because RevenueCat uses native code, you can no longer use Expo Go. Build a development client:

```bash
# iOS simulator (for testing on your Mac)
eas build --profile development --platform ios

# Android device (install the APK for testing)
eas build --profile development --platform android
```

Once built, scan the QR code or install the APK — this is now your dev app.

For production builds (before App Store / Play Store submission):
```bash
eas build --profile production --platform all
```

---

## Step 9 — Test Purchases (Sandbox)

**iOS:** In Xcode → Settings → App Store → create a Sandbox Tester account. Use that account on your device to test purchases — they won't charge real money.

**Android:** In Google Play Console → add your test email as a **License Tester**. Test purchases will be free.

RevenueCat dashboard will show test transactions in real-time.

---

## Step 10 — Submit to App Stores

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

Update `eas.json` first with your real Apple ID, ASC App ID, and Apple Team ID.

For Android, download your Google Play service account key and save it as `google-play-key.json` in the project root.

---

## Checklist Before Going Live

- [ ] Both API keys pasted into `src/services/purchases.js`
- [ ] All 3 products created in App Store Connect
- [ ] All 3 products created in Google Play Console
- [ ] `premium` entitlement created in RevenueCat with all products attached
- [ ] `default` offering created in RevenueCat
- [ ] Test purchase completed in sandbox (iOS) or with license tester (Android)
- [ ] Production build created with `eas build --profile production`
- [ ] App submitted to both stores

---

## Revenue Math

| Plan     | Price   | Users needed for $10k MRR |
|----------|---------|---------------------------|
| Monthly  | $9.99   | 1,001 subscribers         |
| Yearly   | $59.99  | 167 subscribers/mo (new)  |
| Lifetime | $99.99  | 100 purchases/mo          |

A realistic mix of all three gets you to $10k MRR much faster than monthly alone.
The yearly plan at $59.99 is your best friend — it gives you $60 upfront per user instead of waiting 6 months to earn the same from monthly.
