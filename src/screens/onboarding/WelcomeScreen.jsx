import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Surfaces } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const STATS = [
  { value: '94%',    label: 'feel relief\nin week 1' },
  { value: '7 min',  label: 'daily\ncommitment' },
  { value: '50k+',   label: 'people\nrecovering' },
];

export default function WelcomeScreen({ navigation }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(40)).current;
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,   { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const dyn = {
    scrollContent: {
      paddingHorizontal: horizPad,
      paddingTop: sp(96, gapScale),       // breathing room above the AlignPal logo
      paddingBottom: sp(32, gapScale),
    },
    frame:         { maxWidth: frameWidth, gap: sp(32, gapScale) },
    logoSize:      { width: isSmall ? 84 : isTablet ? 108 : 96, height: isSmall ? 84 : isTablet ? 108 : 96 },
    wordmark:      { fontSize: fs(28, fontScale) },
    taglineText:   { fontSize: fs(12, fontScale) },
    headline:      { fontSize: fs(38, fontScale), lineHeight: fs(46, fontScale) },
    body:          { fontSize: fs(15, fontScale), lineHeight: fs(24, fontScale) },
    statValue:     { fontSize: fs(22, fontScale) },
    statLabel:     { fontSize: fs(11, fontScale), lineHeight: fs(15, fontScale) },
    pillText:      { fontSize: fs(12, fontScale) },
    ctaText:       { fontSize: fs(17, fontScale) },
    legal:         { fontSize: fs(12, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 28 : 40, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <Animated.View style={[s.frame, dyn.frame, { opacity: fade, transform: [{ translateY: slideY }] }]}>

          {/* ── Logo area ── */}
          <View style={s.logoArea}>
            <View style={[s.logoRing, dyn.logoSize]}>
              <View style={[s.logoGlow, dyn.logoSize]} />
              <View style={[s.logoInner, dyn.logoSize]}>
                <Ionicons name="body" size={isSmall ? 30 : isTablet ? 40 : 34} color={Colors.purple} />
              </View>
            </View>
            <Text style={[s.wordmark, dyn.wordmark]}>AlignPal</Text>
            <View style={s.taglinePill}>
              <View style={s.taglineDot} />
              <Text style={[s.taglineText, dyn.taglineText]}>AI-Powered Recovery Coach</Text>
            </View>
          </View>

          {/* ── Hero copy ── */}
          <View style={s.heroArea}>
            <Text style={[s.headline, dyn.headline]}>
              End the pain.{'\n'}
              <Text style={s.headlineAccent}>Start living.</Text>
            </Text>
            <Text style={[s.body, dyn.body]}>
              AlignPal analyzes your specific pain pattern and builds a personalized physio plan — so you finally know exactly what to do, and why.
            </Text>
          </View>

          {/* ── Stats row ── */}
          <View style={s.statsRow}>
            {STATS.map((stat, i) => (
              <React.Fragment key={i}>
                <View style={s.statItem}>
                  <Text style={[s.statValue, dyn.statValue]}>{stat.value}</Text>
                  <Text style={[s.statLabel, dyn.statLabel]}>{stat.label}</Text>
                </View>
                {i < STATS.length - 1 && <View style={s.statDivider} />}
              </React.Fragment>
            ))}
          </View>

          {/* ── Feature pills ── */}
          <View style={s.pillsRow}>
            {['No equipment', 'No guesswork', 'No physio bills'].map((t, i) => (
              <View key={i} style={s.pill}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.purpleLight} />
                <Text style={[s.pillText, dyn.pillText]}>{t}</Text>
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>

      {/* ── CTA ── */}
      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={s.cta}
            onPress={() => navigation.navigate('PainLocation')}
            activeOpacity={0.88}
          >
            <Text style={[s.ctaText, dyn.ctaText]}>Start My Recovery</Text>
            <View style={s.ctaArrow}>
              <Ionicons name="arrow-forward" size={16} color={Colors.purple} />
            </View>
          </TouchableOpacity>

          <Text style={[s.legal, dyn.legal]}>
            Free to start · Takes 2 minutes · No credit card
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  // Content sits at the top with the paddingTop above the logo, instead of
  // floating vertically centred — that way the logo never crowds the top of
  // the screen, regardless of viewport height.
  scrollContent: { flexGrow: 1 },
  frame:         { width: '100%', alignSelf: 'center' },

  // Logo
  logoArea: { alignItems: 'center', gap: 10 },
  logoRing: {
    borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute', borderRadius: 30,
    backgroundColor: Colors.purple, opacity: 0.22, transform: [{ scale: 1.5 }],
  },
  logoInner: {
    borderRadius: 30,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.purpleSoft,
  },
  wordmark: { fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
  taglinePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  taglineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.purple },
  taglineText: { color: Colors.purplePale, fontWeight: '600' },

  // Hero
  heroArea: { alignItems: 'center', gap: 14 },
  headline: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -1 },
  headlineAccent: { color: Colors.purple },
  body: { color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 8 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 20, paddingHorizontal: 12,
    alignItems: 'center', justifyContent: 'space-around',
  },
  statItem:    { flex: 1, alignItems: 'center', gap: 4 },
  statValue:   { fontWeight: '800', color: Colors.purple },
  statLabel:   { color: Colors.textSecondary, textAlign: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  // Pills
  pillsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  pillText: { color: Colors.textSecondary, fontWeight: '600' },

  // Footer
  footer:      { alignItems: 'center' },
  footerInner: { width: '100%', alignSelf: 'center', gap: 12 },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.purple,
    borderRadius: 20, paddingVertical: 18, gap: 10,
    ...Shadows.purple,
  },
  ctaText:  { fontWeight: '700', color: Colors.white },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 10,
    backgroundColor: Surfaces.onNavy22,
    alignItems: 'center', justifyContent: 'center',
  },
  legal: { color: Colors.textMuted, textAlign: 'center' },
});
