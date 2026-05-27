# Minimal Dark Kit

Locked 2026-05-05 (Variant B). Additive — does not touch existing components.

## Tokens (in `src/constants/brand.js`)

```js
import {
  KitColors,    // bg, surface1, surface2, hairline, text1, text2, text3
  KitAccents,   // violet, coral, teal, avocado, pink (+ *Deep variants)
  KitGradients, // [from, to] tuples for hero cards
  KitRadius,    // sm:12, md:18, lg:24, xl:32
  KitSpacing,   // s1..s10
} from '../constants/brand';
```

The legacy `Colors`, `Accents`, `Shadows`, `Typography`, `Radius`, `Spacing`, `Surfaces`, `Gradients`, `PhasePalette`, `PainTypePalette` are untouched. Existing screens keep working.

## Color roles (don't violate)

| Color   | Role                                            |
|---------|-------------------------------------------------|
| violet  | Primary CTA, identity, nav active state         |
| avocado | Completion, streak, weekly reward               |
| teal    | Improvements, secondary positive                |
| coral   | **Alerts only** — pain markers, attention       |
| pink    | Soft encouragement, sparingly                   |

Pain-related stats sit on a **calm muted surface**, not on coral. Number tells the state, color is reserved for action moments.

## Components

```js
import {
  GradientCard,     // hero card with single linear gradient
  CircularProgress, // single-ring hero indicator
  BarChart,         // weekly bar chart
  StatTile,         // muted or solid-color stat card
  ListCard, ListRow,// hairline-divided list inside one card
  Button,           // full-width, primary=violet
  SegmentedToggle,  // pill toggle
  Chip,             // tags / cues / dismissible selections
} from '../components/kit';
```

## Screens

```js
import {
  DashboardKitScreen,
  ProgressKitScreen,
  SessionKitScreen,
  PainLocationKitScreen,
} from '../screens/kit';
```

These are drop-in alternatives to the existing live screens. Currently NOT wired into any navigator — to try one, either:
1. Swap the import in `src/navigation/OnboardingNavigator.jsx` or `AppNavigator.jsx`, or
2. Add a temporary route and navigate to it from a button.

## Design rules

- One accent per card — never mix accents inside a single container
- One hero element per screen (a ring OR a number OR a chart, never multiple)
- No bubble decorations, scattered dots, or floating gradient blobs
- Whitespace and typography do the work, not ornament
- Large radii (`KitRadius.lg/xl`) for cards/heroes
