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
  pill:40,
};

export const Spacing = {
  xs:  6,
  sm:  12,
  md:  20,
  lg:  28,
  xl:  40,
};
