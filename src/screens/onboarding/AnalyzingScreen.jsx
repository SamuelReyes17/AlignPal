/**
 * AnalyzingScreen
 *
 * Full-screen loader shown after the user completes the clinical onboarding,
 * before the Pain Profile is revealed. Plays for ~3.5s then auto-navigates.
 *
 * Design: minimalist / futuristic — pulsing orbital rings, scanning line,
 * gradient background with slow wave motion, sequential status messages.
 *
 * Responsive: orbit + blob sizes react to live window dimensions so the
 * layout looks balanced on iPhone SE → iPad and across orientation changes.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, useWindowDimensions, Easing,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../../constants/brand';
import { useResponsive, fs } from '../../utils/responsive';

// ─── Status messages that sequence during the loader ─────────────────────────
const STEPS = [
  { label: 'Reading your pain profile…',    duration: 700  },
  { label: 'Analyzing movement patterns…',  duration: 900  },
  { label: 'Mapping root causes…',          duration: 800  },
  { label: 'Building your protocol…',       duration: 700  },
  { label: 'Your plan is ready.',           duration: 500  },
];

// ─── Animated gradient blobs (background "lava lamp" movement) ───────────────
function GradientBackground({ W, H }) {
  const b1 = useRef(new Animated.Value(0)).current;
  const b2 = useRef(new Animated.Value(0)).current;
  const b3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const go = (v, dur, delay) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    go(b1, 5000, 0);
    go(b2, 7000, 1800);
    go(b3, 6000, 3200);
  }, []);

  const y1 = b1.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const x1 = b1.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });
  const y2 = b2.interpolate({ inputRange: [0, 1], outputRange: [0, 50] });
  const x2 = b2.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });
  const y3 = b3.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const x3 = b3.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const s1 = b1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
  const s2 = b2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const s3 = b3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  // Blob radius is a fraction of the smaller dimension — keeps composition
  // balanced on portrait phones AND landscape tablets.
  const base = Math.min(W, H);
  const blobLg = base * 0.85;
  const blobMd = base * 0.78;
  const blobSm = base * 0.62;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top-left — primary purple */}
      <Animated.View style={[g.blob, {
        top: H * 0.05, left: -W * 0.2,
        width: blobLg, height: blobLg,
        backgroundColor: '#5B21B6',
        transform: [{ translateX: x1 }, { translateY: y1 }, { scale: s1 }],
      }]} />
      {/* Bottom-right — deep violet */}
      <Animated.View style={[g.blob, {
        bottom: H * 0.05, right: -W * 0.15,
        width: blobMd, height: blobMd,
        backgroundColor: '#3B0764',
        transform: [{ translateX: x2 }, { translateY: y2 }, { scale: s2 }],
      }]} />
      {/* Center accent — bright indigo */}
      <Animated.View style={[g.blob, {
        top: H * 0.35, left: W * 0.1,
        width: blobSm, height: blobSm,
        backgroundColor: '#7C3AED',
        transform: [{ translateX: x3 }, { translateY: y3 }, { scale: s3 }],
      }]} />
    </View>
  );
}

const g = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.18,
  },
});

// ─── Spinning orbital ring ────────────────────────────────────────────────────
function OrbitRing({ radius, strokeWidth, color, duration, delay, opacity = 1 }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
        delay,
      })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const size = radius * 2 + strokeWidth;

  return (
    <Animated.View style={{
      position: 'absolute',
      width: size, height: size,
      transform: [{ rotate }],
      opacity,
    }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={0.12}
          />
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${radius * Math.PI * 0.55} ${radius * Math.PI * 2}`}
            strokeLinecap="round"
            opacity={0.9}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}

// ─── Pulsing center core ──────────────────────────────────────────────────────
function CorePulse({ size }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.18, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow,  { toValue: 0.9,  duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1,    duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow,  { toValue: 0.3,  duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const outer = size;
  const mid   = size * 0.72;
  const inner = size * 0.39;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: outer, height: outer }}>
      <Animated.View style={[{
        position: 'absolute',
        width: outer, height: outer, borderRadius: outer / 2,
        backgroundColor: '#7C5CF0',
        opacity: 0.4,
      }, { opacity: glow, transform: [{ scale: pulse }] }]} />
      <Animated.View style={[{
        position: 'absolute',
        width: mid, height: mid, borderRadius: mid / 2,
        backgroundColor: '#9B6BFF',
        opacity: 0.7,
      }, { transform: [{ scale: pulse }] }]} />
      <View style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: '#D4C0FF' }} />
    </View>
  );
}

// ─── Scanning line ────────────────────────────────────────────────────────────
function ScanLine({ orbitDiameter }) {
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(scan, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(200),
      ])
    ).start();
  }, []);

  const translateY = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-orbitDiameter / 2, orbitDiameter / 2],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: orbitDiameter,
        height: 1.5,
        backgroundColor: '#C4B8FF',
        opacity: 0.5,
        transform: [{ translateY }],
        borderRadius: 1,
      }}
    />
  );
}

// ─── Sequential dots progress bar ────────────────────────────────────────────
function DotProgress({ total, current }) {
  return (
    <View style={dp.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dp.dot,
            i < current  && dp.done,
            i === current && dp.active,
          ]}
        />
      ))}
    </View>
  );
}

const dp = StyleSheet.create({
  row:    { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2D1F5E' },
  done:   { backgroundColor: '#7C5CF0', opacity: 0.5 },
  active: { width: 20, height: 6, borderRadius: 3, backgroundColor: '#7C5CF0' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AnalyzingScreen({ navigation }) {
  const [stepIndex, setStepIndex] = useState(0);
  const fadeMsg    = useRef(new Animated.Value(1)).current;
  const screenFade = useRef(new Animated.Value(0)).current;
  const { width: W, height: H } = useWindowDimensions();
  const { isSmall, isTablet, fontScale } = useResponsive();

  // Fade screen in on mount
  useEffect(() => {
    Animated.timing(screenFade, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  // Sequence through status messages
  useEffect(() => {
    let idx = 0;
    let timeout;

    const advance = () => {
      if (idx >= STEPS.length - 1) {
        setTimeout(() => {
          Animated.timing(screenFade, {
            toValue: 0, duration: 500, useNativeDriver: true,
          }).start(() => {
            navigation.replace('EmailCapture');
          });
        }, STEPS[idx].duration);
        return;
      }

      timeout = setTimeout(() => {
        Animated.timing(fadeMsg, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }).start(() => {
          idx += 1;
          setStepIndex(idx);
          Animated.timing(fadeMsg, {
            toValue: 1, duration: 300, useNativeDriver: true,
          }).start(() => advance());
        });
      }, STEPS[idx].duration);
    };

    advance();
    return () => clearTimeout(timeout);
  }, []);

  // Orbit sizes scale by device tier
  const ORBIT_1 = isSmall ? 76  : isTablet ? 110 : 90;   // inner
  const ORBIT_2 = isSmall ? 110 : isTablet ? 160 : 130;  // outer
  const CORE    = isSmall ? 60  : isTablet ? 88  : 72;
  const containerSize = (ORBIT_2 + 4) * 2;

  return (
    <Animated.View style={[s.screen, { opacity: screenFade }]}>

      {/* Gradient background blobs */}
      <GradientBackground W={W} H={H} />

      {/* Center stage */}
      <View style={[s.center, { gap: isSmall ? 28 : isTablet ? 44 : 36 }]}>

        {/* Orbit container */}
        <View style={[s.orbitContainer, { width: containerSize, height: containerSize }]}>
          <OrbitRing radius={ORBIT_2} strokeWidth={1.5} color="#9B6BFF" duration={6000} delay={0} opacity={0.85} />
          <OrbitRing radius={ORBIT_1} strokeWidth={2}   color="#C4B8FF" duration={3800} delay={0} opacity={0.9} />
          <ScanLine orbitDiameter={ORBIT_2 * 2} />
          <CorePulse size={CORE} />
        </View>

        {/* Status text */}
        <Animated.View style={[s.statusWrap, { opacity: fadeMsg }]}>
          <Text style={[s.statusText, { fontSize: fs(17, fontScale) }]}>{STEPS[stepIndex].label}</Text>
        </Animated.View>

        {/* Dot progress */}
        <DotProgress total={STEPS.length} current={stepIndex} />

        {/* Bottom label */}
        <Text style={[s.bottomLabel, { fontSize: fs(12, fontScale) }]}>
          Personalized to your body · Powered by AI
        </Text>
      </View>

    </Animated.View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07050F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center:        { alignItems: 'center' },
  orbitContainer:{ alignItems: 'center', justifyContent: 'center', position: 'relative' },
  statusWrap:    { alignItems: 'center', height: 28 },
  statusText:    { fontWeight: '600', color: Colors.purplePale, letterSpacing: 0.3, textAlign: 'center' },
  bottomLabel:   { color: Colors.textMuted, letterSpacing: 0.5, textAlign: 'center' },
});
