<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

---

# AlignPal — Project Architecture Reference

## What This App Is
AlignPal is an AI-powered back pain recovery app for iOS/Android. Users go through an 8-step onboarding to profile their pain, then get a personalized exercise plan. Monetized via RevenueCat (free tier + AlignPal Pro subscription).

---

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | React Native 0.81.5 + Expo 54 |
| Navigation | React Navigation 7 (Stack + BottomTabs) |
| State | React Context API (no Redux/Zustand) |
| Animations | React Native Animated API |
| Backend | Convex (client wired, backend not yet built) |
| Payments | RevenueCat (react-native-purchases + purchases-ui) |
| Graphics | react-native-svg (BodyMap SVG) |
| Icons | Expo Vector Icons (Ionicons) |
| Build | Expo CLI + EAS Build |
| Language | JavaScript (no TypeScript) |

---

## Environment Variables (`.env.local`)
- `CONVEX_DEPLOYMENT`: `dev:resolute-grasshopper-787`
- `EXPO_PUBLIC_CONVEX_URL`: `https://resolute-grasshopper-787.convex.cloud`
- `EXPO_PUBLIC_CONVEX_SITE_URL`: `https://resolute-grasshopper-787.convex.site`
- `EXPO_PUBLIC_RC_API_KEY_IOS` / `EXPO_PUBLIC_RC_API_KEY_ANDROID`: RevenueCat test keys

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

### `OnboardingNavigator.jsx` — Stack, 13 screens in order
```
Welcome → PainLocation → PainIntensity → PainType → PainTriggers
→ Sitting → ActivityLevel → AgeRange → Disclaimer
→ Analyzing (fade transition, gestureEnabled: false)
→ PainProfile → Day1Protocol → Upgrade
```
- Screens 1–9: slide + fade transition
- Analyzing screen: pure fade (cinematic effect)
- After Upgrade purchase: `completeOnboarding()` → switches to AppNavigator

### `AppNavigator.jsx` — BottomTabs, 2 tabs
- **Dashboard** → `DashboardScreen`
- **History** → `HistoryScreen`
- Tab bar: 70px height, elevation 16, purple active color, Ionicons

---

## State Management (`src/context/`)

### `OnboardingContext.jsx`
All user pain profile data. Shape:
```js
onboardingData: {
  painLocations: [],       // ["lower_back", "neck", ...]  — BodyMap zone IDs
  painIntensity: 5,        // 1–10
  painType: '',            // 'sharp' | 'dull' | 'burning' | 'stiff'
  worstTimeTriggers: [],   // ["sitting", "training", "lifting", ...]
  sittingHours: '',        // '0-2' | '3-5' | '6+'
  trainingFrequency: '',   // 'sedentary' | 'light' | 'moderate' | 'active'
  ageRange: '',            // '18-25' | '26-35' | '36-45' | '46-55' | '56+'
  painDuration: '',        // declared but unused in current flow
  pastInjuries: '',        // declared but unused in current flow
}
isOnboardingComplete: boolean
```
Exposed functions:
- `updateOnboardingData(partialData)` — shallow merge into onboardingData
- `completeOnboarding()` — sets isOnboardingComplete = true
- `resetOnboarding()` — clears all state
- `generatePersonalizedPlan()` — rule-based client-side plan, returns `{ patterns: string[], exercises: [], totalDuration: 7 }`

**⚠️ No persistence — all data lost on app restart.**

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

---

## Screens

### Onboarding Screens (`src/screens/onboarding/`)

| Screen | Data Collected | Key Detail |
|---|---|---|
| `WelcomeScreen` | — | Hero, stats row (94% relief / 7min / 50k+), CTA |
| `PainLocationScreen` | `painLocations[]` | Uses `BodyMap` component, multi-select, step 1/8 |
| `PainIntensityScreen` | `painIntensity` | 1–10 row selector, live color scale (green/amber/red) |
| `PainTypeScreen` | `painType` | 2×2 grid: Sharp / Dull / Burning / Stiff |
| `PainTriggersScreen` | `worstTimeTriggers[]` | 8-button multi-select grid, step 4/8 |
| `SittingScreen` | `sittingHours` | 3 radio cards (0–2h / 3–5h / 6+h) |
| `ActivityLevelScreen` | `trainingFrequency` | 4 radio cards (sedentary → active) |
| `AgeRangeScreen` | `ageRange` | 5 cards (18–25 → 56+), button says "Build My Plan" |
| `DisclaimerScreen` | — | 3 disclaimer points + checkbox, step 8/8 |
| `AnalyzingScreen` | — | 3.5s animated loader only — no backend call |
| `PainProfileScreen` | — | Shows condition/causes/outlook from exerciseLibrary |
| `Day1ProtocolScreen` | — | 5–6 exercises via `selectExercises()`, expandable cards |
| `UpgradeScreen` | — | RevenueCat paywall: Monthly / Yearly / Lifetime |

**AnalyzingScreen animations:** Gradient blobs, orbital rings (6000ms + 3800ms), pulsing core, scan line, 5-dot progress bar, sequential status text fades. Pure UX bridge — no async work.

### App Screens (`src/screens/`)

**`DashboardScreen.jsx`**
Renders in order:
1. `RecoveryOverviewCard` — pain area, intensity, triggers, pattern bullets
2. `StatsCard` — hardcoded values
3. `ExerciseCard` — exercise preview
4. `PainTrackerCard` — daily check-in (local state, not persisted)
5. `PremiumGate` → `PostureTipCard`
6. `WelcomeCard` — imported but never rendered (dead import)

**`HistoryScreen.jsx`**
5 hardcoded mock entries. No real data. Each entry: date, pain level (color-coded), exercises, duration, notes.

---

## Components (`src/components/`)

**`BodyMap.jsx`**
- Interactive SVG body map. Front (19 zones) + back (18 zones) with toggle.
- Props: `selectedParts: string[]`, `onSelect: (id: string) => void`
- Selected zones show animated pulse ring.
- Normalizes zone IDs to exerciseLibrary keys (e.g. `left_shoulder` → `shoulder`).
- Wave background blobs (animated). Height derived from screen, width from aspect ratio (200×380).

**`StepHeader.jsx`**
- Props: `step: number`, `total: number`, `onBack: () => void`
- Shows: back button (card style), filled progress track, step counter ("1/8")

**`PremiumGate.jsx`**
- Props: `children`, `label: string`, `onUpgrade: () => void`
- Free users: blurred content + lock overlay + upgrade button
- Premium users: renders children normally

**`RecoveryOverviewCard.jsx`** — Uses `generatePersonalizedPlan()` from context
**`StatsCard.jsx`** — Hardcoded stats placeholder
**`ExerciseCard.jsx`** — Exercise preview; ignores `previewOnly`/`onUpgrade` props passed from DashboardScreen
**`PainTrackerCard.jsx`** — Daily check-in with local useState; AI coach response text
**`PostureTipCard.jsx`** — Premium-only posture tip
**`WelcomeCard.jsx`** — Imported in DashboardScreen but never rendered

---

## Constants (`src/constants/`)

### `brand.js` — Design System
```js
Colors: {
  bg: '#07050F',           // main background
  bgCard: '#110C24',       // card background
  bgElevated: '#1A1235',   // elevated surfaces
  bgInput: '#0E0A1E',
  purple: '#7C5CF0',       // primary brand color
  purpleLight: '#9B8BF4',
  purplePale: '#C4B8FF',
  purpleDim: '#2D1F5E',
  green: '#34D399',        // success / low pain
  amber: '#FBBF24',        // warning / medium pain
  red: '#FF6B9D',          // danger / high pain
  redDark: '#F87171',
  textPrimary: '#F0EEFF',
  textSecondary: '#8A7CB8',
  textMuted: '#4A3D72',
  textDisabled: '#2A1F4A',
  border: '#1E1640',
  borderSelected: '#7C5CF0',
  borderSubtle: '#160F30',
}
Shadows: { purple, purpleSoft, card }
Typography: { hero, h1, h2, h3, body, bodyBold, caption, micro }
Spacing: { xs, sm, md, lg, xl }
Radius: { sm, md, lg, xl }
```
Always use `brand.js` values — never hardcode hex colors.

### `exerciseLibrary.js` — Core Domain Logic
The largest file. Contains:
- **90+ exercises** organized by body region: `lower_back`, `upper_back`, `neck`, `shoulder`, `knee`, `hip`, and more
- Each exercise schema:
  ```js
  {
    name, duration, reps,
    focus,           // target muscle/movement
    phase,           // 'Mobility' | 'Activation' | 'Stability' | 'Strength' | 'Release'
    icon,            // Ionicon name
    howTo,           // step-by-step instruction
    why,             // biomechanical rationale
    priority,        // 1–5
    goodFor,         // ['sharp', 'dull', 'stiff', 'burning']
    triggers,        // ['sitting', 'training', ...]
    avoidIfSharp,    // boolean
  }
  ```
- Exported functions:
  - `normalizeLocation(id)` — maps BodyMap IDs to library keys
  - `selectExercises(onboardingData)` — returns 5–6 exercises for Day1Protocol
  - `getPainCondition(onboardingData)` → `{ emoji, name, description }`
  - `getCauses(onboardingData)` → `[{ icon, text }, ...]`
  - `getOutlook(onboardingData)` → `{ weeks, label, color, text }`

---

## Convex Backend (`convex/`)

**Current status: empty — not yet built.**
- `convex/_generated/` exists (auto-generated stubs from `npx convex dev`)
- No `schema.ts` — no tables defined, all types are `Doc = any`
- No queries, mutations, or actions written
- `ConvexProvider` wraps the app but is never actually used

**What needs to be built:**
- `schema.ts` — define tables: `users`, `pain_logs`, `exercise_sessions`, `check_ins`
- Mutations: save onboarding data, log check-ins, record completed exercises
- Queries: fetch history, fetch stats, fetch today's plan
- Actions: server-side receipt validation with RevenueCat

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

## Known Bugs

| # | Location | Bug |
|---|---|---|
| 1 | `DashboardScreen` → `ExerciseCard` | Passes `previewOnly` + `onUpgrade` props; component ignores both |
| 2 | `RecoveryOverviewCard` | Displays raw IDs like `lower_back` instead of `"Lower Back"` |
| 3 | `DashboardScreen` | `WelcomeCard` imported but never rendered |
| 4 | `OnboardingNavigator` | `PainDetailsScreen`, `LifestyleScreen`, `ResultsScreen` registered but not in navigator |
| 5 | `StatsCard` | All values hardcoded: "7 days", "45m", "3/10" |
| 6 | `HistoryScreen` | 5 hardcoded mock entries, no real data |
| 7 | `PainTrackerCard` | Check-ins stored in local `useState` — not persisted |

---

## Missing Features (Roadmap)

1. **Persistence** — AsyncStorage or Convex sync so onboarding data survives restart
2. **User accounts** — Convex auth (Clerk or anonymous identity)
3. **Convex schema + mutations** — save pain profiles, check-ins, exercise history
4. **Real Dashboard data** — StatsCard and HistoryScreen powered by Convex queries
5. **Server-side receipt validation** — RevenueCat webhook → Convex mutation
6. **Push notifications** — `expo-notifications` (not installed)
7. **Camera / posture analysis** — permission declared; implementation absent

---

## Data Flow (Current State)

```
User completes 8 onboarding questions
  → stored in OnboardingContext (in-memory only)
    → client-side logic (exerciseLibrary.js) generates plan
      → UpgradeScreen → completeOnboarding()
        → AppNavigator
          → Dashboard reads from OnboardingContext
          → Convex: wired but never called
```
