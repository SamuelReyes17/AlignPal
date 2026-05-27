# AlignPal — Launch Readiness Audit

**Audited:** 2026-05-20 · **Target:** App Store + Google Play · **Stage:** pre-launch, no users

## Verdict

AlignPal is feature-complete and the exercise engine (`exerciseLibrary.js`) is genuinely strong — it defaults every input, guards every array, and falls back cleanly, so a brand-new user with no data won't crash it. The app is **not yet submittable**: there are 6 store-rejection / crash blockers and one revenue-critical gap. None are deep rewrites — this is a focused cleanup, not a rebuild.

The single most important issue for the $10k MRR goal is **P1-1: premium content isn't actually gated.** Fix the store blockers to ship — but fix the gating to earn.

---

## P0 — Must fix before you can submit

- [ ] **Add the `Upgrade` route to the main app.** `DashboardScreen` (~lines 96, 226) calls `navigation.navigate('Upgrade')`, but `AppNavigator.jsx` only registers `Tabs` and `RecoverySession`. Tapping the upgrade prompt crashes — `Upgrade` only exists in the onboarding stack.
- [ ] **Wire real Privacy Policy + Terms links.** `ProfileScreen.jsx:316-317` — both rows are `onPress={() => {}}` no-ops. `UpgradeScreen` has no Terms/Privacy links at all. Apple and Google require a working privacy policy URL; subscription screens additionally require Terms/EULA links. This is the most common rejection reason. Both documents must be hosted somewhere public.
- [ ] **Add a medical disclaimer inside the main app.** The app names conditions ("Lumbar Muscle Strain", "Cervical Facet Strain") and prescribes exercises. Health apps need an accessible "not a substitute for professional medical advice" disclaimer. Onboarding has one; the app itself does not.
- [ ] **Remove the developer-facing paywall button.** `UpgradeScreen.jsx:254` ships a button literally labeled "Open RevenueCat Paywall". Reviewers will flag it.
- [ ] **Fix the paywall price display.** `UpgradeScreen` reads `PLAN_LABELS[id].price / .trial / .savings` — those keys don't exist (`PLAN_LABELS` has only `title/period/badge`). If RevenueCat offerings fail to load, every plan shows "–" while the CTA still promises a free trial. Apple rejects paywalls that don't clearly show price before purchase. Also add a loading/error/retry state — the screen never reads `isLoading` from `useSubscription`.
- [ ] **Swap RevenueCat test keys for production keys.** `services/purchases.js:5-6` falls back to the shared test key `test_eKygd…`. Wire `EXPO_PUBLIC_RC_API_KEY_IOS` / `_ANDROID` to your real keys and remove the test-key fallback so a misconfiguration fails loudly instead of silently.

---

## P1 — Fix before launch

### ⚠ Revenue-critical

- [ ] **P1-1 — Premium content isn't actually gated.** `RecoverySessionScreen` and `WorkoutScreen` each run `selectExercises()` themselves and show the full 5-exercise plan to *everyone*. The Dashboard's "3 free / 5 with Pro" framing is cosmetic — a free user reaches all paid content by tapping Start. `PremiumGate.jsx` exists but is imported nowhere. **There is currently no functional reason to subscribe.** Decide the free/paid line (e.g. Day 1 free + full multi-week plan paid, or N exercises free) and enforce it in `RecoverySessionScreen` and `WorkoutScreen`.

### Other P1

- [ ] **Profile "Upgrade" button is dead for free users.** `ProfileScreen.jsx:247-284` — `onPress` is wired only for premium users (customer center). Free users can't upgrade from their profile.
- [ ] **Onboarding profile can silently fail to save.** `OnboardingContext.jsx:52` — `completeOnboarding()` calls Convex `upsertProfile` only if `installId` is loaded. If the device-id fetch hasn't resolved, the profile is never persisted and there is no retry. Guarantee `installId` before completing.
- [ ] **`tel:911` is hardcoded** in `RedFlagScreen` (~line 161). Copy elsewhere says "GP" (UK/AU audience). Localize or use generic "contact emergency services" guidance.
- [ ] **Severe red flags are only soft-blocked.** A user can tick cauda-equina / fracture / suspected-cancer flags and tap "continue with caution" straight into an exercise plan. Hard-stop the most serious flags — a liability and a likely review concern.
- [ ] **Dead button:** `HistoryScreen.jsx:116` ellipsis icon has no `onPress` — wire it or remove it.
- [ ] **Silent backend failures.** Convex `recordSession` / `logCheckIn` failures are only `console.error`'d — the user believes data saved. Add a toast / retry.
- [ ] **Confirm dead code.** `StatsCard`, `ExerciseCard`, `RecoveryOverviewCard`, `PostureTipCard` appear unused by the 5 tabs. If anything renders `StatsCard`, note it shows a fabricated progress bar (`Math.min(95, sessionCount*3+2)%`). Delete if dead.

---

## P2 — Polish (in parallel or post-submit)

- [ ] Accessibility — icon-only buttons lack `accessibilityLabel`; `BodyMap` SVG hotspots are below the 44px touch-target minimum.
- [ ] `StepHeader` shows "Step X of 12" but the flow has 17 screens; later screens have no progress indicator.
- [ ] `WelcomeScreen` hardcodes unverified marketing claims ("94% feel relief", "50k+ people"). Soften or substantiate.
- [ ] `DisclaimerScreen` agreement box is decorative — no real checkbox the user must tick.
- [ ] `PremiumGate.jsx` uses hardcoded blue hex — violates the locked violet-only design direction.
- [ ] Remove the commented-out `BODY_IMAGES` block in `BodyMap.jsx`.
- [ ] Gate `console.*` calls behind `__DEV__` for production builds.

---

## Still needed to finish the audit

Only `/AlignPal/src` is visible. To complete the launch checklist, the project root is needed (or these files):

- `App.jsx` / `index.js` — verify provider + navigation-switch wiring
- `app.json` / `app.config.js` — version, iOS bundle ID + Android package name, permissions & privacy usage strings, icon, splash
- `package.json` — Expo SDK + dependency versions
- `eas.json` — build profiles
- `convex/` — schema + the `users.upsertProfile` mutation and dashboard queries

Without these, the following are unconfirmed: app version/build numbers, bundle identifiers, required iOS privacy strings, and the Convex schema.

---

## Suggested sequence

1. Fix the six **P0** items — these unblock submission.
2. Decide and implement the **free/paid line** (P1-1) — the revenue gate.
3. Draft Privacy Policy + Terms of Use + in-app medical disclaimer (needed for P0 regardless).
4. Mount the project root to verify app config and write store metadata.
5. P1 cleanup → internal EAS test build → submit to both stores.
