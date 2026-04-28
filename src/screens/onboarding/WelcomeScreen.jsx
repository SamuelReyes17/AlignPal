import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../constants/brand';

const STATS = [
  { value: '94%',    label: 'feel relief\nin week 1' },
  { value: '7 min',  label: 'daily\ncommitment' },
  { value: '50k+',   label: 'people\nrecovering' },
];

export default function WelcomeScreen({ navigation }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,   { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideY, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <Animated.View style={[s.inner, { opacity: fade, transform: [{ translateY: slideY }] }]}>

        {/* ── Logo area ── */}
        <View style={s.logoArea}>
          <View style={s.logoRing}>
            <View style={s.logoGlow} />
            <View style={s.logoInner}>
              <Ionicons name="body" size={34} color={Colors.purple} />
            </View>
          </View>
          <Text style={s.wordmark}>AlignPal</Text>
          <View style={s.taglinePill}>
            <View style={s.taglineDot} />
            <Text style={s.taglineText}>AI-Powered Recovery Coach</Text>
          </View>
        </View>

        {/* ── Hero copy ── */}
        <View style={s.heroArea}>
          <Text style={s.headline}>
            End the pain.{'\n'}
            <Text style={s.headlineAccent}>Start living.</Text>
          </Text>
          <Text style={s.body}>
            AlignPal analyzes your specific pain pattern and builds a personalized physio plan — so you finally know exactly what to do, and why.
          </Text>
        </View>

        {/* ── Stats row ── */}
        <View style={s.statsRow}>
          {STATS.map((stat, i) => (
            <React.Fragment key={i}>
              <View style={s.statItem}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={s.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Feature pills ── */}
        <View style={s.pillsRow}>
          {['No equipment', 'No guesswork', 'No physio bills'].map((t, i) => (
            <View key={i} style={s.pill}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.green} />
              <Text style={s.pillText}>{t}</Text>
            </View>
          ))}
        </View>

      </Animated.View>

      {/* ── CTA ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.cta}
          onPress={() => navigation.navigate('PainLocation')}
          activeOpacity={0.88}
        >
          <Text style={s.ctaText}>Start My Recovery</Text>
          <View style={s.ctaArrow}>
            <Ionicons name="arrow-forward" size={16} color={Colors.purple} />
          </View>
        </TouchableOpacity>

        <Text style={s.legal}>
          Free to start · Takes 2 minutes · No credit card
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner:     { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 32 },

  // Logo
  logoArea: { alignItems: 'center', gap: 10 },
  logoRing: {
    width: 96, height: 96,
    borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 96, height: 96, borderRadius: 30,
    backgroundColor: Colors.purple,
    opacity: 0.22,
    transform: [{ scale: 1.5 }],
  },
  logoInner: {
    width: 96, height: 96, borderRadius: 30,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.purpleSoft,
  },
  wordmark: {
    fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5,
  },
  taglinePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  taglineDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.purple,
  },
  taglineText: { fontSize: 12, color: Colors.purplePale, fontWeight: '600' },

  // Hero
  heroArea: { alignItems: 'center', gap: 14 },
  headline: {
    fontSize: 38, fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', letterSpacing: -1, lineHeight: 46,
  },
  headlineAccent: { color: Colors.purple },
  body: {
    fontSize: 15, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, paddingHorizontal: 8,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 20, paddingHorizontal: 12,
    alignItems: 'center', justifyContent: 'space-around',
  },
  statItem:    { flex: 1, alignItems: 'center', gap: 4 },
  statValue:   { fontSize: 22, fontWeight: '800', color: Colors.purple },
  statLabel:   { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', lineHeight: 15 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  // Pills
  pillsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  pillText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  // Footer
  footer: { paddingHorizontal: 28, paddingBottom: 36, gap: 12 },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.purple,
    borderRadius: 20, paddingVertical: 18, gap: 10,
    ...Shadows.purple,
  },
  ctaText:  { fontSize: 17, fontWeight: '700', color: Colors.white },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  legal: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
});
