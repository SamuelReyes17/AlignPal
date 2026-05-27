/**
 * AlignPal — Brand Design System
 *
 * Single source of truth for all colors, typography, spacing, and shadows.
 * Import this everywhere instead of hardcoding values.
 *
 * Brand personality: Clinical confidence meets human warmth.
 * "Your personal physio — always on, always adapting."
 */

export const Colors = {
  // ─── Backgrounds ──────────────────────────────────────────────────────────
  bg:         '#07050F',   // Ultra-deep purple-black — main background
  bgCard:     '#110C24',   // Card surface
  bgElevated: '#1A1235',   // Elevated / selected card
  bgInput:    '#0E0A1E',   // Input / inactive option

  // ─── Purple Brand Scale ────────────────────────────────────────────────────
  purple:     '#7C5CF0',   // Primary action color
  purpleLight:'#9B8BF4',   // Softer purple (secondary UI)
  purplePale: '#C4B8FF',   // Lavender — readable text on dark
  purpleGlow: '#7C5CF040', // Glow shadow (transparent)
  purpleDim:  '#2D1F5E',   // Selected card fill

  // ─── Status Colors ─────────────────────────────────────────────────────────
  green:      '#34D399',   // Success, low pain, positive
  amber:      '#FBBF24',   // Warning, moderate pain
  red:        '#FF6B9D',   // High pain (coral-pink, not harsh)
  redDark:    '#F87171',   // Severe pain indicator

  // ─── Text ─────────────────────────────────────────────────────────────────
  textPrimary:  '#F0EEFF',  // Main headings
  textSecondary:'#8A7CB8',  // Subtitles, hints
  textMuted:    '#4A3D72',  // Placeholder, inactive labels
  textDisabled: '#2A1F4A',  // Disabled state

  // ─── Borders ──────────────────────────────────────────────────────────────
  border:         '#1E1640',  // Default card border
  borderSelected: '#7C5CF0',  // Selected card border
  borderSubtle:   '#160F30',  // Very subtle divider

  // ─── Overlays ─────────────────────────────────────────────────────────────
  white:       '#FFFFFF',
  transparent: 'transparent',
};

export const Shadows = {
  purple: {
    shadowColor:   '#7C5CF0',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius:  24,
    elevation:     12,
  },
  purpleSoft: {
    shadowColor:   '#7C5CF0',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  12,
    elevation:     6,
  },
  card: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius:  12,
    elevation:     4,
  },
};

export const Typography = {
  hero:    { fontSize: 40, fontWeight: '800', letterSpacing: -1.2, lineHeight: 48 },
  h1:      { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, lineHeight: 42 },
  h2:      { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3:      { fontSize: 17, fontWeight: '700' },
  body:    { fontSize: 15, fontWeight: '400', lineHeight: 24 },
  bodyBold:{ fontSize: 15, fontWeight: '600', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  micro:   { fontSize: 11, fontWeight: '500' },
};

export const Radius = {
  sm:  10,
  md:  16,
  lg:  20,
  xl:  26,
  xxl: 32,
  hero:36,
  pill:40,
};

export const Spacing = {
  xs:  6,
  sm:  12,
  md:  20,
  lg:  28,
  xl:  40,
  // 70pt tab bar (AppNavigator) + comfort gap. Use as paddingBottom on scroll
  // containers inside any TabNavigator screen.
  tabBarClearance: 120,
};

// ═══════════════════════════════════════════════════════════════════════════
// Template-style accent palette
// Vibrant pops used on hero cards, chart bars, accent blocks.
// ═══════════════════════════════════════════════════════════════════════════
export const Accents = {
  coral:       '#FF6B6B',
  coralSoft:   '#FFB4A2',
  pink:        '#FF5C8A',
  pinkSoft:    '#FFD1DC',
  teal:        '#4ECDC4',
  tealSoft:    '#A8E6E0',
  avocado:     '#7BC950',
  avocadoSoft: '#C8E6C9',
  sunny:       '#FFD166',
  sunnySoft:   '#FFE5A0',
  sky:         '#73C2FB',
  skySoft:     '#B8E0F8',
  violet:      '#9B5DE5',
  // Pain-type / phase palette colors — no equivalent in Colors.* yet.
  orange:      '#FB923C',
  indigo:      '#818CF8',
  skyBright:   '#60A5FA',
  pinkBright:  '#F472B6',
};

// ═══════════════════════════════════════════════════════════════════════════
// Phase palette — single source of truth for exercise-phase colors / icons.
// Replaces duplicated PHASE maps in ExploreScreen, RecoverySessionScreen,
// WorkoutScreen. All phases include color, bg (color + 12% alpha), icon, label.
// ═══════════════════════════════════════════════════════════════════════════
export const PhasePalette = {
  Mobility:   { color: '#7C5CF0', bg: '#7C5CF018', icon: 'sync-outline',    label: 'Mobility'   },
  Activation: { color: '#34D399', bg: '#34D39918', icon: 'flash-outline',   label: 'Activation' },
  Stability:  { color: '#FBBF24', bg: '#FBBF2418', icon: 'shield-outline',  label: 'Stability'  },
  Strength:   { color: '#FF6B9D', bg: '#FF6B9D18', icon: 'barbell-outline', label: 'Strength'   },
  Release:    { color: '#C4B8FF', bg: '#C4B8FF18', icon: 'leaf-outline',    label: 'Release'    },
  Exposure:   { color: '#7C5CF0', bg: '#7C5CF018', icon: 'walk-outline',    label: 'Exposure'   },
};
export const getPhaseMeta = (name) => PhasePalette[name] || PhasePalette.Mobility;

// ═══════════════════════════════════════════════════════════════════════════
// Pain-type palette — single source of truth for pain-type colors / icons.
// Replaces duplicated PAIN_TYPE_META maps in HistoryScreen, ProfileScreen.
// ═══════════════════════════════════════════════════════════════════════════
export const PainTypePalette = {
  sharp:     { label: 'Sharp',     color: '#FF6B9D', icon: 'flash' },
  dull:      { label: 'Dull',      color: '#FBBF24', icon: 'remove-circle' },
  burning:   { label: 'Burning',   color: '#FB923C', icon: 'flame' },
  stiff:     { label: 'Stiff',     color: '#818CF8', icon: 'lock-closed' },
  radiating: { label: 'Radiating', color: '#7C5CF0', icon: 'git-merge' },
  numb:      { label: 'Numbness',  color: '#34D399', icon: 'hand-left' },
  cramping:  { label: 'Cramping',  color: '#60A5FA', icon: 'contract' },
  throbbing: { label: 'Throbbing', color: '#F472B6', icon: 'pulse' },
};

// Dark navy surface palette — primary card aesthetic going forward
// (matches Clear Gym reference: dark navy cards, purple as tiny accent only)
export const Surfaces = {
  navy:       '#0F1530',  // base dark-navy bg for hero cards
  navyDeep:   '#0A0E22',  // deeper navy
  navyCard:   '#141A38',  // elevated navy card (slightly lighter than navy)
  navyTop:    '#1A2046',  // top edge of navy hero
  hairline:   '#23264D',  // subtle border on navy

  // ─── White-alpha overlays for dark-navy hero cards ────────────────────────
  // Use these for icon backgrounds, badges, dividers, and text colors that
  // sit on top of the Gradients.purpleHero (dark navy) hero cards.
  // Replaces the dozens of inline 'rgba(255,255,255,0.X)' literals.
  onNavy04:   'rgba(255,255,255,0.04)',  // very subtle blob / inner shadow
  onNavy08:   'rgba(255,255,255,0.08)',  // hairline divider on navy
  onNavy10:   'rgba(255,255,255,0.10)',  // soft hero blob, faint badge bg
  onNavy14:   'rgba(255,255,255,0.14)',  // gentle pill / chip bg
  onNavy18:   'rgba(255,255,255,0.18)',  // icon button bg, badge dot
  onNavy22:   'rgba(255,255,255,0.22)',  // icon button bg (slightly stronger)
  onNavy65:   'rgba(255,255,255,0.65)',  // muted text on navy
  onNavy75:   'rgba(255,255,255,0.75)',  // secondary text on navy
  onNavy85:   'rgba(255,255,255,0.85)',  // standard body text on navy
  onNavy92:   'rgba(255,255,255,0.92)',  // emphasized text on navy
};

// Gradient definitions (start, mid?, end). Used by GradientCard.
// Note: 'purpleHero' is now a SUBTLE dark navy gradient — purple is no longer
// the dominant color of hero cards. Reach for it only when you really need a
// purple panel.
export const Gradients = {
  purple:    ['#7C5CF0', '#5B3CC4'],
  purpleHero:['#1A2046', '#0F1530', '#0A0E22'],   // dark navy hero (was bright purple)
  purpleBold:['#9B8BF4', '#7C5CF0', '#5B3CC4'],   // OLD bright purple, still available if needed
  navy:      ['#1A2046', '#0F1530', '#0A0E22'],
  navySoft:  ['#141A38', '#0F1530'],
  coral:     ['#FF8A65', '#FF5C7F'],
  pink:      ['#FF5C8A', '#9B5DE5'],
  teal:      ['#4ECDC4', '#1A8B82'],
  avocado:   ['#A8E6A1', '#7BC950'],
  sunset:    ['#FFD166', '#FF6B6B'],
  midnight:  ['#1A1235', '#07050F'],
  cardSoft:  ['#1A1235', '#110C24'],
};

// ═══════════════════════════════════════════════════════════════════════════
// MINIMAL DARK KIT (Variant B, locked 2026-05-05)
//
// New design direction. Use these tokens in any NEW screen/component built
// to the minimal-dark spec (one accent per card, no decoration, single hero
// element per screen). Existing screens should keep using Colors / Accents /
// Gradients exactly as they do — this section is purely additive.
//
// Color roles (psychology):
//   violet  → primary CTA, identity, nav active state    (trust + premium)
//   avocado → completion, streaks, weekly reward         (positive reward)
//   teal    → improvements, secondary positive           (calm gain)
//   coral   → ALERTS only (pain markers, attention)      (urgency, sparingly)
//   pink    → soft encouragement, low-key callouts       (approachability)
// Pain-related stats sit on a calm muted surface, NOT on coral.
// ═══════════════════════════════════════════════════════════════════════════

export const KitColors = {
  bg:         '#110E1D',   // purpler dark base
  surface1:   '#1A1729',   // cards
  surface2:   '#221E33',   // raised surfaces, toggles
  hairline:   'rgba(180,160,255,0.08)',

  text1:      '#FFFFFF',
  text2:      '#B6B6C2',
  text3:      '#6E6E7C',
};

export const KitAccents = {
  // AlignPal brand purple — matches Colors.purple / Colors.purpleLight.
  // Purple is the dominant identity color; other accents are supporting roles.
  violet:      '#7C5CF0',   // brand purple (primary CTA, hero gradient start)
  violetDeep:  '#5B3CC4',   // brand purple deep (gradient end)
  violetSoft:  '#9B8BF4',   // softer brand purple (hover, secondary)
  coral:       '#FF6B6B',
  coralDeep:   '#E04F4F',
  teal:        '#2DD4BF',
  tealDeep:    '#14A99A',
  avocado:     '#A3D977',
  avocadoDeep: '#7FB94F',
  pink:        '#FF8FA3',
  pinkDeep:    '#E96A82',
};

// Two-stop linear gradients at 155deg, used by the Kit GradientCard.
export const KitGradients = {
  violet:  [KitAccents.violet,  KitAccents.violetDeep],
  coral:   [KitAccents.coral,   KitAccents.coralDeep],
  teal:    [KitAccents.teal,    KitAccents.tealDeep],
  avocado: [KitAccents.avocado, KitAccents.avocadoDeep],
  pink:    [KitAccents.pink,    KitAccents.pinkDeep],
};

export const KitRadius   = { sm: 12, md: 18, lg: 24, xl: 32 };
export const KitSpacing  = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s8: 32, s10: 40 };
