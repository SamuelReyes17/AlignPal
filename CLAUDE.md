<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

---

# AlignPal — Project Architecture Reference

## What This App Is
AlignPal is an evidence-based back pain recovery app for iOS/Android. Users go through a 12-step clinical onboarding to profile their pain (location, intensity, type, triggers, duration, directional preference, radiating pain, red flags, lifestyle), then get a personalized 5-exercise daily plan drawn from a 163-exercise library citing McGill, Janda, Jull, Alfredson, Beyer, Kent (RESTORE), Mellor (LEAP), and others. Monetized via RevenueCat (free tier + AlignPal Pro subscription). Data persisted via Convex.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | React Native 0.81.5 + Expo 54 |
| Navigation | React Navigation 7 (Stack + BottomTabs) |
| State | React Context API (no Redux/Zustand) |
| Animations | React Native Animated API |
| Backend | Convex (fully wired: schema, mutations, queries, RC webhook) |
| Identity | Anonymous `installId` from `src/services/deviceId.js` (no email login yet) |
| Payments | RevenueCat (react-native-purchases + purchases-ui) |
| Email | Resend (configured but no API key set — saves leads regardless) |
| Graphics | react-native-svg (BodyMap SVG) |
| Icons | Expo Vector Icons (Ionicons) |
| Build | Expo CLI + EAS Build |
| Language | JavaScript (no TypeScript on the client; Convex code is TS) |

---

## Environment Variables (`.env.local`)
- `CONVEX_DEPLOYMENT`: `dev:resolute-grasshopper-787`
- `EXPO_PUBLIC_CONVEX_URL`: `https://resolute-grasshopper-787.convex.cloud`
- `EXPO_PUBLIC_CONVEX_SITE_URL`: `https://resolute-grasshopper-787.convex.site`
- `EXPO_PUBLIC_RC_API_KEY_IOS` / `EXPO_PUBLIC_RC_API_KEY_ANDROID`: RevenueCat test keys
- (Server-side, set via `npx convex env set`) `RESEND_API_KEY` — required for welcome emails to actually send; without it `leads` are still captured but `sendWelcomeEmail` no-ops with a log

---

## Entry Point — `App.jsx`

Provider stack (outermost → innermost):
```
GestureHandlerRootView
  └─ ConvexProvider (EXPO_PUBLIC_CONVEX_URL)
       └─ SubscriptionProvider
            └─ OnboardingProvider
                 └─ StatusBar + RootNavigator
```

`RootNavigator` checks `isOnboardingComplete`:
- `false` → **OnboardingNavigator**
- `true` → **AppNavigator**

---

## Navigation (`src/navigation/`)

### `OnboardingNavigator.jsx` — Stack flow
```
Welcome → PainLocation → PainIntensity → PainType → PainTriggers
→ PainDuration → DirectionalPreference → RadiatingPain → RedFlag    ← clinical signals
→ Sitting → ActivityLevel → AgeRange → Disclaimer                   ← lifestyle
→ Analyzing (fade, gestureEnabled: false)
→ EmailCapture (fade, gestureEnabled: false)
→ PainProfile → Day1Protocol → Upgrade
+ RecoverySession (fade, gestureEnabled: false; reachable from Day1Protocol pre-completion)
```
StepHeader shows `N/12` for the 12 question screens. Welcome and the post-Analyzing screens have no step counter.
- Default transition: slide + fade
- Analyzing / EmailCapture / RecoverySession: pure fade
- After Upgrade purchase: `completeOnboarding()` → switches to AppNavigator

### `AppNavigator.jsx` — BottomTabs, 2 tabs
- **Dashboard** → `DashboardScreen`
- **History** → `HistoryScreen`
- Tab bar: 70px height, elevation 16, purple active color, Ionicons

---

## State Management (`src/context/`)

### `OnboardingContext.jsx`
Pain profile data + Convex install identity. Shape:
```js
onboardingData: {
  painLocations: [],            // ["lower_back", "neck", ...]  — BodyMap zone IDs
  painIntensity: 5,             // 1–10
  painTypes: [],                // ['sharp' | 'dull' | 'burning' | 'stiff' | 'radiating' | 'numb' | 'throbbing' | 'cramping']
  painDescription: '',          // optional free-text (analysed by analyzePainDescription)
  // ── Clinical signals (drive selectExercises) ─────────────────────────
  painDuration: '',             // 'acute' | 'subacute' | 'chronic' | 'recurrent'
  directionalPreference: '',    // 'flexion' | 'extension' | 'rotation' | 'sustained' | 'unclear'
  radiatingPain: [],            // ['none','glute','above_knee','below_knee','arm','hand','headache']
  redFlags: [],                 // ['none','bowel_bladder','saddle_numb','night_pain','recent_injury','weight_loss','fever','cancer_hx','rapid_worse']
  // ── Lifestyle ────────────────────────────────────────────────────────
  worstTimeTriggers: [],        // ['sitting','standing','lifting','sleeping','training','morning','walking','stress']
  sittingHours: '',             // '0-2' | '3-5' | '6+'
  trainingFrequency: '',        // 'sedentary' | 'light' | 'moderate' | 'active'
  pastInjuries: '',             // declared but no screen collects it yet
  ageRange: '',                 // '18-25' | '26-35' | '36-45' | '46-55' | '56+'
  email: '',                    // captured via EmailCaptureScreen → leads table
}
isOnboardingComplete: boolean
installId: string | null        // anonymous device id from deviceId.js
```
Exposed functions:
- `updateOnboardingData(partialData)` — shallow merge
- `completeOnboarding()` — sets flag AND calls `api.users.upsertProfile` to persist to Convex
- `resetOnboarding()` — clears local state (does NOT delete Convex row)
- `generatePersonalizedPlan()` — legacy helper that returns `{ patterns, exercises: [], totalDuration: 7 }`. Real exercise selection happens via `selectExercises` from `exerciseLibrary.js`.

State is **persisted** to Convex on `completeOnboarding()` keyed by `installId`. In-memory before that point — refreshing the app mid-onboarding loses progress.

### `SubscriptionContext.jsx`
RevenueCat integration. Shape:
```js
isPremium: boolean
isLoading: boolean
packages: Package[]        // from RevenueCat offerings
purchasing: boolean
restoring: boolean
customerInfo: object
```
Exposed functions:
- `purchase(pkg)` → `{ success, userCancelled, error, customerInfo }`
- `restore()` → `{ success, isPremium, customerInfo, error }`
- `refresh()` — re-check premium status
- `showPaywallIfNeeded()` — RevenueCat paywall UI
- `presentCustomerCenter()` — RevenueCat customer center
- Entitlement ID: `"AlignPal Pro"`
- Product IDs: `LIFETIME`, `YEARLY`, `MONTHLY`

Server-side: RevenueCat webhook → `convex/http.ts` → `internal.users.setPremiumStatus`. Premium state is mirrored on the Convex `users` row (`isPremium`, `rcCustomerId`).

---

## Screens

### Onboarding Screens (`src/screens/onboarding/`)

| # | Screen | Field | Notes |
|---|---|---|---|
| 1 | `PainLocationScreen` | `painLocations[]` | `BodyMap` multi-select |
| 2 | `PainIntensityScreen` | `painIntensity` | 1–10 row, live color scale |
| 3 | `PainTypeScreen` | `painTypes[]` | Sharp / Dull / Burning / Stiff (multi) |
| 4 | `PainTriggersScreen` | `worstTimeTriggers[]` | 8-button grid |
| 5 | `PainDurationScreen` | `painDuration` | acute / subacute / chronic / recurrent |
| 6 | `DirectionalPreferenceScreen` | `directionalPreference` | flexion / extension / rotation / sustained / unclear |
| 7 | `RadiatingPainScreen` | `radiatingPain[]` | "none" is exclusive of other selections |
| 8 | `RedFlagScreen` | `redFlags[]` | 8-item safety checklist + warning modal with emergency-call CTA |
| 9 | `SittingScreen` | `sittingHours` | 3 cards |
| 10 | `ActivityLevelScreen` | `trainingFrequency` | 4 cards |
| 11 | `AgeRangeScreen` | `ageRange` | 5 cards, button "Build My Plan" |
| 12 | `DisclaimerScreen` | — | 3 disclaimer points + checkbox |
| — | `WelcomeScreen` | — | Hero, stats row (94% relief / 7min / 50k+) |
| — | `AnalyzingScreen` | — | 3.5s animated loader (gradient blobs, orbital rings, pulsing core, scan line). No async work. |
| — | `EmailCaptureScreen` | `email` | Calls `api.leads.saveLead` — captures lead BEFORE onboarding completes |
| — | `PainProfileScreen` | — | Shows condition / causes / outlook from `getPainCondition`, `getCauses`, `getOutlook` |
| — | `Day1ProtocolScreen` | — | 5–6 exercises via `selectExercises()`, expandable cards. Can launch `RecoverySessionScreen` |
| — | `UpgradeScreen` | — | RevenueCat paywall: Monthly / Yearly / Lifetime → `completeOnboarding()` |

### App Screens (`src/screens/`)

**`DashboardScreen.jsx`** — reads from Convex via `useQuery(api.stats.getDashboardStats, { installId })`
1. `RecoveryOverviewCard` — pain area, intensity, triggers, pattern bullets
2. `StatsCard` — real values from `getDashboardStats` (sessionCount, totalDurationMinutes, avgPainLevel, latestPainLevel)
3. `ExerciseCard` — exercise preview (still passes `previewOnly`/`onUpgrade` props the component ignores — see Bug #1)
4. `PainTrackerCard` — daily check-in via `api.checkIns.logCheckIn` + `getTodayCheckIn`
5. `PremiumGate` → `PostureTipCard`

**`HistoryScreen.jsx`** — reads from Convex via `useQuery(api.sessions.getRecentSessions, { installId })`. Real session data, not mocks.

**`RecoverySessionScreen.jsx`** — guided exercise session. Calls `api.sessions.recordSession` on completion.

**`WorkoutScreen.jsx`** / **`ExploreScreen.jsx`** / **`ProfileScreen.jsx`** — additional app screens (not all reachable from current bottom tabs — verify before linking).

---

## Components (`src/components/`)

| Component | Purpose |
|---|---|
| `BodyMap.jsx` | Interactive SVG body map. Front (19 zones) + back (18 zones) with toggle. Selected zones show animated pulse ring. Normalizes IDs to library keys. |
| `StepHeader.jsx` | Props: `step`, `total`, `onBack`. Currently shows back button + step counter ("5/12"). Progress track style is defined but not rendered (minimalist style). |
| `PremiumGate.jsx` | Gates children behind `isPremium`. Shows blurred content + lock + upgrade button when free. |
| `RecoveryOverviewCard.jsx` | Uses `generatePersonalizedPlan()` from context |
| `StatsCard.jsx` | Reads `api.stats.getDashboardStats` from Convex |
| `ExerciseCard.jsx` | Exercise preview — ignores `previewOnly` / `onUpgrade` props (Bug #1) |
| `PainTrackerCard.jsx` | Daily check-in. Reads/writes Convex via `api.checkIns.*` |
| `PostureTipCard.jsx` | Premium-only posture tip |
| `BarChart.jsx` | Used by Dashboard analytics |
| `CircularProgress.jsx` | Animated progress ring |
| `ExerciseAnimation.jsx` | Human figure exercise animation |
| `GradientCard.jsx` | Reusable gradient surface — primary card wrapper |

---

## Convex Backend (`convex/`)

**Status: fully wired and reading/writing from the client.**

### `schema.ts` — Tables
```ts
users {
  installId, painLocations, painIntensity, painTypes, painDescription?,
  worstTimeTriggers, sittingHours?, trainingFrequency?, ageRange?, email?,
  painDuration?, directionalPreference?, radiatingPain?, redFlags?,
  onboardingComplete, isPremium, rcCustomerId?
} index by_installId

leads {
  installId, email
} index by_installId, by_email

checkIns {
  installId, date /* YYYY-MM-DD */, painLevel /* 1-10 */, exercisesDone, notes?
} index by_installId, by_installId_and_date

sessions {
  installId, date, exerciseNames[], durationMinutes, completed
} index by_installId, by_installId_and_date
```

### Functions

**`users.ts`**
- `upsertProfile` (mutation) — public; called from `OnboardingContext.completeOnboarding`
- `getProfile` (query) — public; by installId
- `setPremiumStatus` (internalMutation) — called only by webhook

**`checkIns.ts`** — `logCheckIn` (upsert by date), `getTodayCheckIn`, `getRecentCheckIns`
**`sessions.ts`** — `recordSession`, `getRecentSessions`
**`leads.ts`** — `saveLead` (mutation, fires `internal.email.sendWelcomeEmail` via scheduler), `getAllLeads` (internalQuery — never expose publicly)
**`stats.ts`** — `getDashboardStats` (returns sessionCount, totalDurationMinutes, avgPainLevel, latestPainLevel)
**`email.ts`** — `sendWelcomeEmail` (internalAction, "use node"). Resend integration; no-op if `RESEND_API_KEY` env var is unset.
**`http.ts`** — RevenueCat webhook at `/webhooks/revenuecat`. Maps `INITIAL_PURCHASE` / `RENEWAL` / `PRODUCT_CHANGE` / `UNCANCELLATION` → premium=true; `CANCELLATION` / `EXPIRATION` / `BILLING_ISSUES` → premium=false.

---

## Constants (`src/constants/`)

### `brand.js` — Design System
```js
Colors:    { bg, bgCard, bgElevated, bgInput, purple, purpleLight, purplePale,
             purpleGlow, purpleDim, green, amber, red, redDark,
             textPrimary, textSecondary, textMuted, textDisabled,
             border, borderSelected, borderSubtle, white, transparent }
Shadows:   { purple, purpleSoft, card }
Typography:{ hero, h1, h2, h3, body, bodyBold, caption, micro }
Radius:    { sm, md, lg, xl, xxl, hero, pill }
Spacing:   { xs, sm, md, lg, xl }
Accents:   { coral, coralSoft, pink, pinkSoft, teal, tealSoft, avocado, avocadoSoft, sunny, sunnySoft, sky, skySoft, violet }
Surfaces:  { navy, navyDeep, navyCard, navyTop, hairline }   // dark-navy hero card palette
Gradients: { purple, purpleHero, purpleBold, navy, navySoft, coral, pink, teal, avocado, sunset, midnight, cardSoft }
```
Always use `brand.js` values — never hardcode hex colors. `purpleHero` is now a dark navy gradient (purple is no longer the dominant card color).

### `exerciseLibrary.js` — Core Domain Logic
**163 evidence-based exercises** organized across 18 body regions: `lower_back`, `upper_back`, `neck`, `shoulder`, `knee`, `hip`, `glute`, `hamstring`, `quad`, `calf`, `ankle`, `achilles`, `plantar`, `shin`, `chest`, `elbow`, `abdomen`, `default`.

Each exercise schema:
```js
{
  name, duration, reps, focus,
  phase,           // 'Mobility' | 'Activation' | 'Stability' | 'Strength' | 'Release' | 'Exposure'
  icon,            // Ionicon name
  howTo, why,
  priority,        // 1–5
  goodFor,         // ['sharp','dull','stiff','burning','radiating','numb','throbbing','cramping']
  triggers,        // ['sitting','standing','lifting','sleeping','training','morning','walking','stress']
  avoidIfSharp,    // optional boolean
}
```
Notable evidence-based protocols included: McGill Big 3 (Bird-Dog, Curl-Up, Side Bridge), McKenzie press-up + cervical retraction, Alfredson eccentric heel drops, Heavy Slow Resistance (Beyer 2015) for patellar/Achilles tendinopathy, Tyler Twist, Nordic hamstring curl, sciatic + median + ulnar + radial nerve sliders, Cervical SNAG (Mulligan/Hall), Copenhagen Adduction (Harøy 2019), GTPS Isometric Hip Abduction (LEAP/Mellor 2018), Frozen Shoulder Pain-Free Mobility (UK FROST 2020), Pallof Press, CFT exposure exercises (RESTORE trial, Lancet 2023).

The `'Exposure'` phase is reserved for Cognitive Functional Therapy graded-exposure exercises — only surfaces for chronic pain duration; penalized for acute and red-flag presentations.

Exported functions:
- `normalizeLocation(id)` — maps BodyMap IDs to library keys
- `EXERCISE_LIBRARY` — the dictionary
- `analyzePainDescription(text)` — parses free-text for neurological / discogenic / facetogenic / myofascial / postural / acuteOnset signals
- `selectExercises(onboardingData)` — returns top 5 scored exercises. Scoring inputs:
  - pain types (`goodFor` boost, `avoidIfSharp` penalty for neural/inflammatory)
  - triggers (per-match boost)
  - sittingHours `'6+'` → boost sitting-targeted
  - **painDuration**: acute → penalize Strength/Exposure; chronic → boost Exposure/Strength/Stability; recurrent → boost Stability/Activation
  - **directionalPreference**: flexion-intolerant → boost extension-bias + McKenzie press-up + cervical retraction, penalize flexion CFT exposure; extension-intolerant → inverse (flexion bias, no press-ups); rotation-intolerant → boost Pallof; sustained → boost Mobility + sitting-targeted
  - **radiatingPain**: any → boost Release; below_knee → +30 to sciatic floss + extension bias if not extIntolerant; arm/hand → +28 to nerve sliders + cervical retraction; headache → +22 to suboccipital + SNAG
  - **redFlags**: any (other than 'none') → conservative bias (penalize Strength/Exposure, prefer Mobility/Release)
  - free-text description signals (discogenic / facetogenic / myofascial / postural / acute)
- `getPainCondition(onboardingData)` → `{ emoji, name, description }`
- `getCauses(onboardingData)` → `[{ icon, text }, ...]`
- `getOutlook(onboardingData)` → `{ weeks, label, color, text }`

---

## Services (`src/services/`)

- **`deviceId.js`** — `getInstallId()`. Returns a stable anonymous UUID stored in AsyncStorage. The backbone of identity until email auth is added.
- **`purchases.js`** — RevenueCat init helpers consumed by `SubscriptionContext`.

---

## Native Configuration

- **iOS bundle ID:** `com.alignpal.app`
- **iOS min deployment:** 15.1
- **New Architecture:** enabled (`RCTNewArchEnabled = true`)
- **Hermes engine:** enabled
- **Camera permission declared** in `Info.plist`: *"Used for AI posture analysis"* — feature not yet implemented
- **EAS project ID:** `c1b23612-3a30-4d91-8ec3-48a63a0a2f1a` (owner: samuelreyes17)
- **EAS build profiles:** `development` (simulator), `preview` (internal), `production` (auto-increment)

---

## Known Bugs / Tech Debt

| # | Location | Issue |
|---|---|---|
| 1 | `DashboardScreen` → `ExerciseCard` | Passes `previewOnly` + `onUpgrade` props; component ignores both |
| 2 | `RecoveryOverviewCard` | Displays raw IDs like `lower_back` instead of `"Lower Back"` |
| 3 | `OnboardingContext.generatePersonalizedPlan` | Destructures `painIntensity` but never uses it (TS warning) |
| 4 | `OnboardingContext.resetOnboarding` | Clears local state but does NOT delete Convex `users` row keyed by installId |
| 5 | Account portability | Identity is install-scoped via `installId`. Reinstall or device-switch loses all data + premium link until RC webhook re-fires |

---

## Missing Features (Roadmap)

1. **Email-based account recovery** — link `installId` ↔ email so reinstalls/device-switches can restore data and premium entitlement
2. **Streak tracking** — `getCurrentStreak(installId)` query + Dashboard surface; biggest single retention lever
3. **Push notifications** — `expo-notifications` not installed; need morning reminder, streak warning, weekly recap
4. **Real AI Coach** — `PainTrackerCard` AI coach text is currently static. Wire to a Convex action that calls Claude API; cache per (installId, week)
5. **Welcome email drip** — `RESEND_API_KEY` not set in production; `sendWelcomeEmail` no-ops. Add 3-email sequence (welcome → day 3 tip → day 7 nudge)
6. **Camera / posture analysis** — permission declared; biggest unbuilt differentiator (vision-camera + MediaPipe Pose)
7. **Pain heatmap on BodyMap over time** — animate intensity by zone using historical `users.painIntensity` + checkIn data
8. **Weekly AI summary cron** — Convex cron Sundays → Claude action → push + email summary

---

## Data Flow (Current State)

```
User opens app
  → getInstallId() returns/creates anonymous UUID
    → 12 onboarding screens populate OnboardingContext (in-memory)
      → EmailCaptureScreen → api.leads.saveLead (Convex; fires welcome email if Resend key set)
        → AnalyzingScreen (UX bridge, 3.5s)
          → PainProfile + Day1Protocol use selectExercises() with all clinical signals
            → UpgradeScreen → completeOnboarding()
              → api.users.upsertProfile persists onboardingData keyed by installId
                → AppNavigator
                  → Dashboard reads getDashboardStats from Convex (real data)
                  → PainTrackerCard reads/writes checkIns
                  → RecoverySession writes sessions
                  → RevenueCat webhook → http.ts → setPremiumStatus mirrors premium on users row
```
