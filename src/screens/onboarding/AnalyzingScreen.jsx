/**
 * AnalyzingScreen
 *
 * Full-screen loader shown after the user completes all 6 onboarding steps,
 * before the Pain Profile is revealed. Plays for ~3.5s then auto-navigates.
 *
 * Design: minimalist / futuristic — pulsing orbital rings, scanning line,
 * gradient background with slow wave motion, sequential status messages.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, Easing,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../../constants/brand';

const { width: W, height: H } = Dimensions.get('window');

// ─── Status messages that sequence during the loader ─────────────────────────
const STEPS = [
  { label: 'Reading your pain profile…',    duration: 700  },
  { label: 'Analyzing movement patterns…',  duration: 900  },
  { label: 'Mapping root causes…',          duration: 800  },
  { label: 'Building your protocol…',       duration: 700  },
  { label: 'Your plan is ready.',           duration: 500  },
];

// ─── Animated gradient blobs (background "lava lamp" movement) ───────────────
function GradientBackground() {
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

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top-left — primary purple */}
      <Animated.View style={[g.blob, {
        top: H * 0.05, left: -W * 0.2,
        width: W * 0.8, height: W * 0.8,
        backgroundColor: '#5B21B6',
        transform: [{ translateX: x1 }, { translateY: y1 }, { scale: s1 }],
      }]} />
      {/* Bottom-right — deep violet */}
      <Animated.View style={[g.blob, {
        bottom: H * 0.05, right: -W * 0.15,
        width: W * 0.75, height: W * 0.75,
        backgroundColor: '#3B0764',
        transform: [{ translateX: x2 }, { translateY: y2 }, { scale: s2 }],
      }]} />
      {/* Center accent — bright indigo */}
      <Animated.View style={[g.blob, {
        top: H * 0.35, left: W * 0.1,
        width: W * 0.6, height: W * 0.6,
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
          {/* Full dim ring */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={0.12}
          />
          {/* Arc segment — top-right quarter, gives spinning feel */}
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
function CorePulse() {
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

  return (
    <View style={core.wrap}>
      {/* Outer glow ring */}
      <Animated.View style={[core.glow, { opacity: glow, transform: [{ scale: pulse }] }]} />
      {/* Mid ring */}
      <Animated.View style={[core.mid, { transform: [{ scale: pulse }] }]} />
      {/* Inner solid circle */}
      <View style={core.inner} />
    </View>
  );
}

const core = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: 72, height: 72 },
  glow: {
    position: 'absolute',
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#7C5CF0',
    opacity: 0.4,
  },
  mid: {
    position: 'absolute',
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#9B6BFF',
    opacity: 0.7,
  },
  inner: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#D4C0FF',
  },
});

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
  const fadeMsg   = useRef(new Animated.Value(1)).current;
  const screenFade = useRef(new Animated.Value(0)).current;

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
        // Last message — fade out and navigate
        setTimeout(() => {
          Animated.timing(screenFade, {
            toValue: 0, duration: 500, useNativeDriver: true,
          }).start(() => {
            navigation.replace('PainProfile');
          });
        }, STEPS[idx].duration);
        return;
      }

      timeout = setTimeout(() => {
        // Fade out current message
        Animated.timing(fadeMsg, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }).start(() => {
          idx += 1;
          setStepIndex(idx);
          // Fade in new message
          Animated.timing(fadeMsg, {
            toValue: 1, duration: 300, useNativeDriver: true,
          }).start(() => advance());
        });
      }, STEPS[idx].duration);
    };

    advance();
    return () => clearTimeout(timeout);
  }, []);

  const ORBIT_1 = 90;   // inner ring radius
  const ORBIT_2 = 130;  // outer ring radius

  return (
    <Animated.View style={[s.screen, { opacity: screenFade }]}>

      {/* Gradient background blobs */}
      <GradientBackground />

      {/* Center stage */}
      <View style={s.center}>

        {/* Orbit container */}
        <View style={[s.orbitContainer, {
          width: (ORBIT_2 + 4) * 2,
          height: (ORBIT_2 + 4) * 2,
        }]}>

          {/* Outer ring — slow, counter-clockwise-ish */}
          <OrbitRing
            radius={ORBIT_2}
            strokeWidth={1.5}
            color="#9B6BFF"
            duration={6000}
            delay={0}
            opacity={0.85}
          />

          {/* Inner ring — faster, opposite direction handled by negative start */}
          <OrbitRing
            radius={ORBIT_1}
            strokeWidth={2}
            color="#C4B8FF"
            duration={3800}
            delay={0}
            opacity={0.9}
          />

          {/* Scanning line within the outer orbit */}
          <ScanLine orbitDiameter={(ORBIT_2) * 2} />

          {/* Pulsing core */}
          <CorePulse />
        </View>

        {/* Status text */}
        <Animated.View style={[s.statusWrap, { opacity: fadeMsg }]}>
          <Text style={s.statusText}>{STEPS[stepIndex].label}</Text>
        </Animated.View>

        {/* Dot progress */}
        <DotProgress total={STEPS.length} current={stepIndex} />

        {/* Bottom label */}
        <Text style={s.bottomLabel}>
          Personalized to your body · Powered by AI
        </Text>
      </View>

    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07050F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 36,
  },
  orbitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusWrap: {
    alignItems: 'center',
    height: 28,
  },
  statusText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.purplePale,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  bottomLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
