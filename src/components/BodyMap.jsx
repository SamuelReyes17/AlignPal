import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions, Easing,
} from 'react-native';
import Svg, { Ellipse, Path, G, Circle, Line } from 'react-native-svg';
import { Colors } from '../constants/brand';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Responsive sizing ────────────────────────────────────────────────────────
// Height-first: compute how much vertical space the body can use,
// then derive width from the 200×380 aspect ratio.
const RESERVED = 390; // header + question + toggle + chips + footer
const BODY_H = Math.min(Math.max(SCREEN_H - RESERVED, 250), SCREEN_H * 0.56);
const BODY_W = BODY_H * (200 / 380);

// ─── Pain Zones ───────────────────────────────────────────────────────────────
const PAIN_ZONES = {
  front: [
    { id: 'neck',              label: 'Neck',              cx: 100, cy: 66,  rx: 11, ry: 9  },
    { id: 'left_shoulder',     label: 'Left Shoulder',     cx: 58,  cy: 97,  rx: 14, ry: 12 },
    { id: 'right_shoulder',    label: 'Right Shoulder',    cx: 142, cy: 97,  rx: 14, ry: 12 },
    { id: 'chest',             label: 'Chest',             cx: 100, cy: 118, rx: 18, ry: 13 },
    { id: 'left_elbow',        label: 'Left Elbow',        cx: 44,  cy: 158, rx: 10, ry: 9  },
    { id: 'right_elbow',       label: 'Right Elbow',       cx: 156, cy: 158, rx: 10, ry: 9  },
    { id: 'abdomen',           label: 'Abdomen',           cx: 100, cy: 158, rx: 14, ry: 15 },
    { id: 'left_hip',          label: 'Left Hip',          cx: 76,  cy: 204, rx: 14, ry: 12 },
    { id: 'right_hip',         label: 'Right Hip',         cx: 124, cy: 204, rx: 14, ry: 12 },
    { id: 'left_quad',         label: 'Left Quad',         cx: 74,  cy: 248, rx: 13, ry: 16 },
    { id: 'right_quad',        label: 'Right Quad',        cx: 126, cy: 248, rx: 13, ry: 16 },
    { id: 'left_knee',         label: 'Left Knee',         cx: 74,  cy: 295, rx: 12, ry: 10 },
    { id: 'right_knee',        label: 'Right Knee',        cx: 126, cy: 295, rx: 12, ry: 10 },
    { id: 'left_shin',         label: 'Left Shin',         cx: 72,  cy: 332, rx: 10, ry: 14 },
    { id: 'right_shin',        label: 'Right Shin',        cx: 128, cy: 332, rx: 10, ry: 14 },
    { id: 'left_ankle',        label: 'Left Ankle',        cx: 70,  cy: 356, rx: 10, ry: 7  },
    { id: 'right_ankle',       label: 'Right Ankle',       cx: 130, cy: 356, rx: 10, ry: 7  },
    { id: 'left_plantar',      label: 'Plantar (L)',       cx: 66,  cy: 372, rx: 11, ry: 6  },
    { id: 'right_plantar',     label: 'Plantar (R)',       cx: 134, cy: 372, rx: 11, ry: 6  },
    { id: 'left_forearm',      label: 'Left Forearm',      cx: 40,  cy: 188, rx: 11, ry: 20 },
    { id: 'right_forearm',     label: 'Right Forearm',     cx: 160, cy: 188, rx: 11, ry: 20 },
    { id: 'left_wrist',        label: 'Left Wrist',        cx: 43,  cy: 226, rx: 10, ry: 7  },
    { id: 'right_wrist',       label: 'Right Wrist',       cx: 157, cy: 226, rx: 10, ry: 7  },
    { id: 'left_toe',          label: 'Left Toes',         cx: 72,  cy: 377, rx: 13, ry: 5  },
    { id: 'right_toe',         label: 'Right Toes',        cx: 128, cy: 377, rx: 13, ry: 5  },
    { id: 'left_knee_inner',   label: 'Left Knee (Inner)', cx: 86,  cy: 306, rx: 9,  ry: 10 },
    { id: 'right_knee_inner',  label: 'Right Knee (Inner)',cx: 114, cy: 306, rx: 9,  ry: 10 },
    { id: 'left_knee_outer',   label: 'Left Knee (Outer)', cx: 62,  cy: 306, rx: 8,  ry: 10 },
    { id: 'right_knee_outer',  label: 'Right Knee (Outer)',cx: 138, cy: 306, rx: 8,  ry: 10 },
  ],
  back: [
    { id: 'upper_back',        label: 'Upper Back',        cx: 100, cy: 112, rx: 22, ry: 16 },
    { id: 'lower_back',        label: 'Lower Back',        cx: 100, cy: 162, rx: 18, ry: 13 },
    { id: 'left_shoulder_b',   label: 'Left Shoulder',     cx: 58,  cy: 97,  rx: 14, ry: 12 },
    { id: 'right_shoulder_b',  label: 'Right Shoulder',    cx: 142, cy: 97,  rx: 14, ry: 12 },
    { id: 'left_elbow_b',      label: 'Left Elbow',        cx: 44,  cy: 158, rx: 10, ry: 9  },
    { id: 'right_elbow_b',     label: 'Right Elbow',       cx: 156, cy: 158, rx: 10, ry: 9  },
    { id: 'left_glute',        label: 'Left Glute',        cx: 80,  cy: 232, rx: 16, ry: 13 },
    { id: 'right_glute',       label: 'Right Glute',       cx: 120, cy: 232, rx: 16, ry: 13 },
    { id: 'left_hamstring',    label: 'Left Hamstring',    cx: 74,  cy: 276, rx: 13, ry: 17 },
    { id: 'right_hamstring',   label: 'Right Hamstring',   cx: 126, cy: 276, rx: 13, ry: 17 },
    { id: 'left_knee_b',       label: 'Left Knee',         cx: 75,  cy: 306, rx: 12, ry: 10 },
    { id: 'right_knee_b',      label: 'Right Knee',        cx: 125, cy: 306, rx: 12, ry: 10 },
    { id: 'left_calf',         label: 'Left Calf',         cx: 70,  cy: 336, rx: 10, ry: 14 },
    { id: 'right_calf',        label: 'Right Calf',        cx: 130, cy: 336, rx: 10, ry: 14 },
    { id: 'left_ankle_b',      label: 'Left Ankle',        cx: 70,  cy: 360, rx: 10, ry: 7  },
    { id: 'right_ankle_b',     label: 'Right Ankle',       cx: 130, cy: 360, rx: 10, ry: 7  },
    { id: 'left_achilles',     label: 'Achilles (L)',      cx: 68,  cy: 372, rx: 9,  ry: 6  },
    { id: 'right_achilles',    label: 'Achilles (R)',      cx: 132, cy: 372, rx: 9,  ry: 6  },
    { id: 'neck_b',            label: 'Neck',              cx: 100, cy: 66,  rx: 11, ry: 9  },
    { id: 'left_forearm_b',    label: 'Left Forearm',      cx: 40,  cy: 188, rx: 11, ry: 20 },
    { id: 'right_forearm_b',   label: 'Right Forearm',     cx: 160, cy: 188, rx: 11, ry: 20 },
    { id: 'left_wrist_b',      label: 'Left Wrist',        cx: 43,  cy: 228, rx: 10, ry: 7  },
    { id: 'right_wrist_b',     label: 'Right Wrist',       cx: 157, cy: 228, rx: 10, ry: 7  },
  ],
};

// ─── Wave background blobs ────────────────────────────────────────────────────
function WaveBackground() {
  const w1 = useRef(new Animated.Value(0)).current;
  const w2 = useRef(new Animated.Value(0)).current;
  const w3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const go = (v, dur, delay) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    go(w1, 7000, 0);
    go(w2, 9000, 2500);
    go(w3, 6500, 4500);
  }, []);

  const y1 = w1.interpolate({ inputRange: [0,1], outputRange: [0,-12] });
  const x1 = w1.interpolate({ inputRange: [0,1], outputRange: [0, 8] });
  const y2 = w2.interpolate({ inputRange: [0,1], outputRange: [0,-9] });
  const x2 = w2.interpolate({ inputRange: [0,1], outputRange: [0,-10] });
  const y3 = w3.interpolate({ inputRange: [0,1], outputRange: [0,-14] });
  const x3 = w3.interpolate({ inputRange: [0,1], outputRange: [0, 5] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[ws.b, { top:-50,left:-30,width:200,height:200,backgroundColor:'#7C5CF0',transform:[{translateX:x1},{translateY:y1}] }]} />
      <Animated.View style={[ws.b, { bottom:-60,right:-40,width:220,height:220,backgroundColor:'#5B3FBF',transform:[{translateX:x2},{translateY:y2}] }]} />
      <Animated.View style={[ws.b, { top:'38%',left:'12%',width:160,height:160,backgroundColor:'#9B6BFF',transform:[{translateX:x3},{translateY:y3}] }]} />
    </View>
  );
}
const ws = StyleSheet.create({ b: { position:'absolute', borderRadius:999, opacity:0.055 } });

// ─── Pulse ring on selected zones ─────────────────────────────────────────────
function PulseRing({ cx, cy, rx, ry }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue:1, duration:1000, easing:Easing.out(Easing.quad), useNativeDriver:true }),
      Animated.timing(pulse, { toValue:0, duration:300, useNativeDriver:true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  const scale   = pulse.interpolate({ inputRange:[0,1], outputRange:[1,1.75] });
  const opacity = pulse.interpolate({ inputRange:[0,0.4,1], outputRange:[0.6,0.2,0] });
  const sx = (cx/200)*BODY_W, sy = (cy/380)*BODY_H;
  const srx = (rx/200)*BODY_W, sry = ((ry||rx)/380)*BODY_H;
  return (
    <Animated.View pointerEvents="none" style={{
      position:'absolute', left:sx-srx, top:sy-sry,
      width:srx*2, height:sry*2, borderRadius:srx,
      borderWidth:2, borderColor:'#FF2D55',
      transform:[{scale}], opacity,
    }} />
  );
}

// ─── Body figure — clean flat silhouette style ────────────────────────────────
// Strategy: single smooth outline path per body region, clean joints as circles.
// This matches the medical illustration style — flat fill, clear contours,
// no attempt at shading or muscle detail which always looks bad in SVG.

const BODY_FILL   = '#2E1870';  // main fill
const BODY_STROKE = '#9B78F8';  // outline — bright enough to read on dark bg
const JOINT_FILL  = '#3E2090';  // joint circles
const DETAIL      = '#7456D4';  // inner detail lines

// Helper: joint circle (shoulder, elbow, knee, etc.)
const Joint = ({ cx, cy, r = 7 }) => (
  <Circle cx={cx} cy={cy} r={r} fill={JOINT_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />
);

const FrontBody = () => (
  <Svg viewBox="0 0 200 380" width={BODY_W} height={BODY_H} style={StyleSheet.absoluteFill}>

    {/* HEAD */}
    <Ellipse cx="100" cy="36" rx="20" ry="23"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* Ear left */}
    <Path d="M80 32 Q76 36 77 42 Q80 46 83 43 Q82 38 80 32Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1" />
    {/* Ear right */}
    <Path d="M120 32 Q124 36 123 42 Q120 46 117 43 Q118 38 120 32Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1" />

    {/* NECK */}
    <Path d="M91 57 L91 70 Q100 74 109 70 L109 57 Q105 61 100 61 Q95 61 91 57Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* TORSO — chest wide, waist pinched, hips slightly wider */}
    <Path d="
      M59 88
      C57 100 56 120 57 140
      C58 158 64 172 72 182
      C78 190 88 196 100 197
      C112 196 122 190 128 182
      C136 172 142 158 143 140
      C144 120 143 100 141 88
      C130 83 116 80 100 80
      C84 80 70 83 59 88Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* Chest center line */}
    <Line x1="100" y1="80" x2="100" y2="130" stroke={DETAIL} strokeWidth="0.8" opacity="0.5" />
    {/* Under pec line L */}
    <Path d="M62 120 Q78 128 100 126" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.5" />
    {/* Under pec line R */}
    <Path d="M138 120 Q122 128 100 126" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.5" />
    {/* Ab lines */}
    <Path d="M85 140 Q100 143 115 140" fill="none" stroke={DETAIL} strokeWidth="0.8" opacity="0.4" />
    <Path d="M83 154 Q100 157 117 154" fill="none" stroke={DETAIL} strokeWidth="0.8" opacity="0.4" />
    <Path d="M83 168 Q100 171 117 168" fill="none" stroke={DETAIL} strokeWidth="0.7" opacity="0.35" />

    {/* PELVIS */}
    <Path d="M72 182 C66 192 64 202 66 212 C70 222 84 228 100 228 C116 228 130 222 134 212 C136 202 134 192 128 182 C118 188 100 190 100 190 C100 190 82 188 72 182Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* SHOULDER joints */}
    <Joint cx="55" cy="92" r="10" />
    <Joint cx="145" cy="92" r="10" />

    {/* LEFT UPPER ARM */}
    <Path d="M48 92 C42 102 38 120 38 140 C38 152 40 160 46 164 C52 167 58 164 60 156 C62 144 62 126 62 108 C62 100 56 94 48 92Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* RIGHT UPPER ARM */}
    <Path d="M152 92 C158 102 162 120 162 140 C162 152 160 160 154 164 C148 167 142 164 140 156 C138 144 138 126 138 108 C138 100 144 94 152 92Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* ELBOW joints */}
    <Joint cx="45" cy="162" r="8" />
    <Joint cx="155" cy="162" r="8" />

    {/* LEFT FOREARM */}
    <Path d="M40 160 C36 172 34 188 34 202 C34 212 37 218 43 220 C49 222 54 218 56 208 C58 194 58 178 54 164 C50 160 44 158 40 160Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* RIGHT FOREARM */}
    <Path d="M160 160 C164 172 166 188 166 202 C166 212 163 218 157 220 C151 222 146 218 144 208 C142 194 142 178 146 164 C150 160 156 158 160 160Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* WRIST + HAND left */}
    <Ellipse cx="43" cy="224" rx="8" ry="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />
    <Path d="M35 224 C34 230 35 238 40 242 C44 244 50 242 52 236 C54 230 52 224 48 222Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />
    {/* WRIST + HAND right */}
    <Ellipse cx="157" cy="224" rx="8" ry="5" fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />
    <Path d="M165 224 C166 230 165 238 160 242 C156 244 150 242 148 236 C146 230 148 224 152 222Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />

    {/* LEFT THIGH */}
    <Path d="M66 212 C60 226 58 248 58 268 C58 284 60 296 66 304 C70 310 78 312 84 308 C90 302 92 288 92 270 C92 248 90 228 84 214 C78 210 70 210 66 212Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* RIGHT THIGH */}
    <Path d="M134 212 C140 226 142 248 142 268 C142 284 140 296 134 304 C130 310 122 312 116 308 C110 302 108 288 108 270 C108 248 110 228 116 214 C122 210 130 210 134 212Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* KNEE joints */}
    <Joint cx="75" cy="306" r="11" />
    <Joint cx="125" cy="306" r="11" />
    {/* Patella */}
    <Ellipse cx="75" cy="304" rx="6" ry="5" fill={JOINT_FILL} stroke={DETAIL} strokeWidth="0.8" opacity="0.7" />
    <Ellipse cx="125" cy="304" rx="6" ry="5" fill={JOINT_FILL} stroke={DETAIL} strokeWidth="0.8" opacity="0.7" />

    {/* LEFT SHIN */}
    <Path d="M64 314 C60 330 58 348 60 360 C62 368 67 372 74 370 C80 368 84 362 84 352 C84 338 84 322 80 314 C76 310 68 310 64 314Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* RIGHT SHIN */}
    <Path d="M136 314 C140 330 142 348 140 360 C138 368 133 372 126 370 C120 368 116 362 116 352 C116 338 116 322 120 314 C124 310 132 310 136 314Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* ANKLE joints */}
    <Joint cx="70" cy="362" r="7" />
    <Joint cx="130" cy="362" r="7" />

    {/* LEFT FOOT */}
    <Path d="M60 362 C58 368 58 374 62 378 C66 381 76 381 82 377 C86 373 86 367 82 363 C78 360 68 360 60 362Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* RIGHT FOOT */}
    <Path d="M140 362 C142 368 142 374 138 378 C134 381 124 381 118 377 C114 373 114 367 118 363 C122 360 132 360 140 362Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

  </Svg>
);

const BackBody = () => (
  <Svg viewBox="0 0 200 380" width={BODY_W} height={BODY_H} style={StyleSheet.absoluteFill}>

    {/* HEAD */}
    <Ellipse cx="100" cy="36" rx="20" ry="23"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M80 32 Q76 36 77 42 Q80 46 83 43 Q82 38 80 32Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1" />
    <Path d="M120 32 Q124 36 123 42 Q120 46 117 43 Q118 38 120 32Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1" />

    {/* NECK */}
    <Path d="M91 57 L91 70 Q100 74 109 70 L109 57 Q105 61 100 61 Q95 61 91 57Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* TORSO back — same outline as front */}
    <Path d="
      M59 88
      C57 100 56 120 57 140
      C58 158 64 172 72 182
      C78 190 88 196 100 197
      C112 196 122 190 128 182
      C136 172 142 158 143 140
      C144 120 143 100 141 88
      C130 83 116 80 100 80
      C84 80 70 83 59 88Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* Spine */}
    <Line x1="100" y1="80" x2="100" y2="195" stroke={DETAIL} strokeWidth="1" opacity="0.5" strokeDasharray="3,4" />
    {/* Scapula hint L */}
    <Path d="M68 96 Q64 116 68 134 Q74 130 76 114 Q76 100 68 96Z"
      fill="none" stroke={DETAIL} strokeWidth="1.1" opacity="0.45" />
    {/* Scapula hint R */}
    <Path d="M132 96 Q136 116 132 134 Q126 130 124 114 Q124 100 132 96Z"
      fill="none" stroke={DETAIL} strokeWidth="1.1" opacity="0.45" />
    {/* Lat sweep L */}
    <Path d="M62 100 C60 120 62 148 70 170" fill="none" stroke={DETAIL} strokeWidth="1" opacity="0.4" />
    {/* Lat sweep R */}
    <Path d="M138 100 C140 120 138 148 130 170" fill="none" stroke={DETAIL} strokeWidth="1" opacity="0.4" />
    {/* Rhomboid horizontal */}
    <Path d="M74 108 Q100 112 126 108" fill="none" stroke={DETAIL} strokeWidth="0.8" opacity="0.4" />
    <Path d="M72 124 Q100 128 128 124" fill="none" stroke={DETAIL} strokeWidth="0.7" opacity="0.35" />

    {/* SHOULDER joints — identical to front */}
    <Joint cx="55" cy="92" r="10" />
    <Joint cx="145" cy="92" r="10" />

    {/* UPPER ARMS — identical paths to front */}
    <Path d="M48 92 C42 102 38 120 38 140 C38 152 40 160 46 164 C52 167 58 164 60 156 C62 144 62 126 62 108 C62 100 56 94 48 92Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M43 106 C42 126 44 148 48 162" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />
    <Path d="M152 92 C158 102 162 120 162 140 C162 152 160 160 154 164 C148 167 142 164 140 156 C138 144 138 126 138 108 C138 100 144 94 152 92Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M157 106 C158 126 156 148 152 162" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />

    {/* ELBOW joints — identical to front */}
    <Joint cx="45" cy="162" r="8" />
    <Joint cx="155" cy="162" r="8" />

    {/* FOREARMS — identical to front */}
    <Path d="M40 160 C36 172 34 188 34 202 C34 212 37 218 43 220 C49 222 54 218 56 208 C58 194 58 178 54 164 C50 160 44 158 40 160Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M160 160 C164 172 166 188 166 202 C166 212 163 218 157 220 C151 222 146 218 144 208 C142 194 142 178 146 164 C150 160 156 158 160 160Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* HANDS back (knuckle side) */}
    <Path d="M35 220 C34 228 36 236 42 240 C46 242 52 240 54 234 C56 228 54 222 48 220Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />
    <Path d="M165 220 C166 228 164 236 158 240 C154 242 148 240 146 234 C144 228 146 222 152 220Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.2" />

    {/* PELVIS back — glutes sit ON TOP of same pelvis shape */}
    <Path d="M72 182 C66 192 64 202 66 212 C70 222 84 228 100 228 C116 228 130 222 134 212 C136 202 134 192 128 182 C118 188 100 190 100 190 C100 190 82 188 72 182Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

    {/* GLUTES — overlay on same pelvis, giving them the rounded shape */}
    <Path d="M66 212 C60 218 58 226 60 234 C64 244 78 250 100 250 C122 250 136 244 140 234 C142 226 140 218 134 212 C120 220 100 222 100 222 C100 222 80 220 66 212Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* Glute center crease */}
    <Line x1="100" y1="214" x2="100" y2="248" stroke={DETAIL} strokeWidth="1" opacity="0.4" />
    {/* Glute crease bottom */}
    <Path d="M68 246 Q84 250 100 250 Q116 250 132 246" fill="none" stroke={DETAIL} strokeWidth="1" opacity="0.45" />

    {/* LEFT HAMSTRING — same x/y range as front thigh */}
    <Path d="M66 246 C60 260 58 278 58 296 C58 304 60 310 66 314 C70 318 78 318 84 312 C90 304 92 288 92 268 C92 250 90 236 84 228 C78 224 70 230 66 246Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M68 250 C66 274 66 298 70 312" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />

    {/* RIGHT HAMSTRING — mirror */}
    <Path d="M134 246 C140 260 142 278 142 296 C142 304 140 310 134 314 C130 318 122 318 116 312 C110 304 108 288 108 268 C108 250 110 236 116 228 C122 224 130 230 134 246Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M132 250 C134 274 134 298 130 312" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />

    {/* KNEE joints back — SAME y as front (306) */}
    <Joint cx="75" cy="306" r="11" />
    <Joint cx="125" cy="306" r="11" />

    {/* LEFT CALF — same y range as front shin (314→362) */}
    <Path d="M64 314 C58 330 56 348 58 360 C60 368 66 372 74 370 C80 368 84 360 84 348 C84 334 84 320 80 314 C76 310 68 310 64 314Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    {/* Calf belly line */}
    <Path d="M70 318 C68 340 68 358 70 368" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />

    {/* RIGHT CALF — mirror */}
    <Path d="M136 314 C142 330 144 348 142 360 C140 368 134 372 126 370 C120 368 116 360 116 348 C116 334 116 320 120 314 C124 310 132 310 136 314Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M130 318 C132 340 132 358 130 368" fill="none" stroke={DETAIL} strokeWidth="0.9" opacity="0.4" />

    {/* ANKLE joints back — SAME y as front (362) */}
    <Joint cx="70" cy="362" r="7" />
    <Joint cx="130" cy="362" r="7" />

    {/* HEELS / back of feet — same y as front foot but heel shape */}
    <Path d="M60 362 C56 368 56 376 62 380 C66 382 76 382 82 378 C86 374 86 366 82 362Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />
    <Path d="M140 362 C144 368 144 376 138 380 C134 382 124 382 118 378 C114 374 114 366 118 362Z"
      fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="1.4" />

  </Svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BodyMap({ selectedParts = [], onSelect }) {
  const [side, setSide] = useState('front');
  const zones = PAIN_ZONES[side];

  const isSelected = (id) => selectedParts.includes(id);
  const toggleZone = (zone) => {
    if (isSelected(zone.id)) {
      onSelect(selectedParts.filter((id) => id !== zone.id));
    } else {
      onSelect([...selectedParts, zone.id]);
    }
  };

  const allZones = [...PAIN_ZONES.front, ...PAIN_ZONES.back];
  const chips = selectedParts
    .map((id) => allZones.find((z) => z.id === id))
    .filter(Boolean)
    .reduce((acc, z) => {
      const label = z.label;
      if (!acc.find((a) => a.label === label)) acc.push(z);
      return acc;
    }, []);

  return (
    <View style={st.container}>
      <WaveBackground />

      {/* Toggle */}
      <View style={st.toggle}>
        {['front','back'].map((sv) => (
          <TouchableOpacity
            key={sv}
            style={[st.toggleBtn, side===sv && st.toggleActive]}
            onPress={() => setSide(sv)}
            activeOpacity={0.8}
          >
            <Text style={[st.toggleText, side===sv && st.toggleTextOn]}>
              {sv === 'front' ? 'Front' : 'Back'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body */}
      <View style={[st.body, { width: BODY_W, height: BODY_H }]}>
        {side === 'front' ? <FrontBody /> : <BackBody />}

        {/* Pulse rings */}
        {zones.filter(z => isSelected(z.id)).map(z => (
          <PulseRing key={z.id+'_p'} {...z} />
        ))}

        {/* Hotspot overlay */}
        <Svg viewBox="0 0 200 380" width={BODY_W} height={BODY_H} style={StyleSheet.absoluteFill}>
          {zones.map((zone) => {
            const on = isSelected(zone.id);
            const ry = zone.ry || zone.rx;
            return (
              <G key={zone.id} onPress={() => toggleZone(zone)}>
                {on && (
                  <Ellipse cx={zone.cx} cy={zone.cy}
                    rx={zone.rx * 1.7} ry={ry * 1.7}
                    fill="rgba(255,45,85,0.06)" />
                )}
                <Ellipse
                  cx={zone.cx} cy={zone.cy}
                  rx={zone.rx} ry={ry}
                  fill={on ? 'rgba(255,45,85,0.52)' : 'rgba(255,255,255,0.04)'}
                  stroke={on ? '#FF2D55' : 'rgba(124,92,240,0.22)'}
                  strokeWidth={on ? 2 : 1}
                />
                {on && <Circle cx={zone.cx} cy={zone.cy} r={3} fill="#FF2D55" />}
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Chips */}
      <View style={st.chipsWrap}>
        {chips.length === 0
          ? <Text style={st.chipsEmpty}>Tap any area on the body</Text>
          : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chipsRow}>
              {chips.map((z) => (
                <TouchableOpacity key={z.id} style={st.chip} onPress={() => toggleZone(z)} activeOpacity={0.7}>
                  <View style={st.chipDot} />
                  <Text style={st.chipText}>{z.label}</Text>
                  <Text style={st.chipX}> ×</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )
        }
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { alignItems:'center', width:'100%', flex:1, overflow:'hidden' },

  toggle: {
    flexDirection:'row', backgroundColor:'rgba(17,12,36,0.92)',
    borderRadius:16, padding:3, marginBottom:10,
    borderWidth:1, borderColor:Colors.border, zIndex:10,
  },
  toggleBtn:    { paddingVertical:8, paddingHorizontal:36, borderRadius:13 },
  toggleActive: { backgroundColor: Colors.purple },
  toggleText:   { fontSize:13, color:Colors.textMuted, fontWeight:'700' },
  toggleTextOn: { color:Colors.white },

  body: { position:'relative', marginBottom:8 },

  chipsWrap:  { height:36, width:'100%', justifyContent:'center', zIndex:10 },
  chipsEmpty: { color:Colors.textMuted, fontSize:12, textAlign:'center', fontStyle:'italic' },
  chipsRow:   { paddingHorizontal:12, alignItems:'center' },
  chip: {
    flexDirection:'row', alignItems:'center',
    backgroundColor:'rgba(255,45,85,0.14)',
    borderWidth:1.5, borderColor:'#FF2D55',
    borderRadius:20, paddingHorizontal:11, paddingVertical:5,
    marginRight:8, gap:4,
  },
  chipDot:  { width:6, height:6, borderRadius:3, backgroundColor:'#FF2D55' },
  chipText: { color:'#FF6B88', fontSize:12, fontWeight:'700' },
  chipX:    { color:'#FF2D55', fontSize:14, fontWeight:'300' },
});
