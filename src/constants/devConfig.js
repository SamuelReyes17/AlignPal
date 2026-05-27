// ──────────────────────────────────────────────────────────────────────────
//  DEV PREVIEW SWITCHES
//  Tools for looking at the app while you build it. Not part of the real app.
// ──────────────────────────────────────────────────────────────────────────
//
//  DEV.START controls what you see when the app opens, while developing:
//
//    'onboarding'     → normal. The app starts on the Welcome / onboarding flow.
//    'main-app'       → skip onboarding, open straight into the main app.
//    'screen-catalog' → open a dev menu that lists EVERY screen. Tap any screen
//                       to jump straight to it — no onboarding needed.
//
//  Just change the one line in DEV below. Nothing else to touch.
//
//  SAFETY: these switches only work while developing. Real builds you ship to
//  users (TestFlight / App Store / Play Store) ignore them completely, so it
//  is safe to leave this on while you work.
// ──────────────────────────────────────────────────────────────────────────

export const DEV = {
  // ▼▼▼  set this to 'onboarding' | 'main-app' | 'screen-catalog'  ▼▼▼
  START: 'screen-catalog',
  // ▲▲▲
};

// __DEV__ is true while developing and false in production builds, so these
// preview switches can never leak into a real release.
const startMode = __DEV__ ? DEV.START : 'onboarding';

export const showScreenCatalog = startMode === 'screen-catalog';
export const skipOnboarding    = startMode === 'main-app';

// Seed a sample profile for any preview mode, so the screens that need pain
// data (Pain Profile, Day 1 plan, Dashboard cards) have realistic content.
export const seedSampleProfile = startMode === 'main-app' || startMode === 'screen-catalog';

// Sample pain profile used by the preview modes above.
// Edit these values if you want to preview a different kind of user.
export const DEV_SAMPLE_PROFILE = {
  painLocations: ['lower_back'],
  painIntensity: 6,
  painTypes: ['dull', 'stiff'],
  painDescription: '',
  painDuration: 'chronic',
  directionalPreference: 'flexion',
  radiatingPain: ['none'],
  redFlags: ['none'],
  worstTimeTriggers: ['sitting', 'morning'],
  sittingHours: '6+',
  trainingFrequency: 'light',
  pastInjuries: '',
  ageRange: '26-35',
  email: 'preview@alignpal.app',
  sex: 'female',
};
