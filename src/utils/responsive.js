import { useWindowDimensions } from 'react-native';

// Device tiers — react to live window size (rotation, foldables, iPad split-view).
const SMALL_PHONE_BREAK = 360;   // iPhone SE / mini
const TABLET_BREAK      = 700;   // iPad mini portrait and up
const SHORT_HEIGHT      = 700;   // iPhone SE 2nd gen height (667-700)

// Cap content width on tablets so screens don't look stretched.
const MAX_FRAME_WIDTH   = 520;

// Horizontal page padding on small phones / tablets.
const PHONE_HORIZ_PAD   = 24;
const SMALL_HORIZ_PAD   = 18;
const TABLET_HORIZ_PAD  = 32;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall  = width < SMALL_PHONE_BREAK;
  const isTablet = width >= TABLET_BREAK;
  const isShort  = height < SHORT_HEIGHT;

  const horizPad = isTablet ? TABLET_HORIZ_PAD
                 : isSmall  ? SMALL_HORIZ_PAD
                 :            PHONE_HORIZ_PAD;

  const frameWidth = Math.min(width - horizPad * 2, MAX_FRAME_WIDTH);

  // Multipliers for scaling type / spacing.
  const fontScale = isSmall ? 0.9 : isTablet ? 1.05 : 1;
  const gapScale  = isShort ? 0.85 : isTablet ? 1.1 : 1;

  return {
    width, height,
    isSmall, isTablet, isShort,
    horizPad, frameWidth,
    fontScale, gapScale,
  };
}

// Convenience: scale a base size with the current device's fontScale.
export const fs = (base, scale = 1) => Math.round(base * scale);

// Convenience: scale spacing (gap, padding) without going below a minimum.
export const sp = (base, scale = 1, min = 4) => Math.max(min, Math.round(base * scale));
