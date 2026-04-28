import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

// ─── Precision helper ─────────────────────────────────────────────────────────
const p = (n) => +n.toFixed(1);

// ─── Tapered capsule: filled shape between two joints ─────────────────────────
// r1 = radius at joint 1 (base/origin), r2 = radius at joint 2 (tip)
// Results in a proper limb shape that tapers like muscle tissue
function capsule(x1, y1, x2, y2, r1, r2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return '';
  const nx = -dy / len, ny = dx / len;           // perpendicular unit vector
  const ax = p(x1 + nx * r1), ay = p(y1 + ny * r1);  // base left edge
  const bx = p(x2 + nx * r2), by = p(y2 + ny * r2);  // tip left edge
  const cx = p(x2 - nx * r2), cy = p(y2 - ny * r2);  // tip right edge
  const ex = p(x1 - nx * r1), ey = p(y1 - ny * r1);  // base right edge
  // Straight sides + rounded arc at tip (sweep=1) + rounded arc at base (sweep=0)
  return (
    `M${ax} ${ay}L${bx} ${by}` +
    `A${p(r2)} ${p(r2)} 0 0 1 ${cx} ${cy}` +
    `L${ex} ${ey}` +
    `A${p(r1)} ${p(r1)} 0 0 0 ${ax} ${ay}Z`
  );
}

// ─── Torso: 6-point shape with shoulder width, waist pinch, hip flare ─────────
function torsoPath(j) {
  const wFrac  = 0.46;   // waist sits ~46% from shoulder to hip
  const wInset = 6;      // pixels the waist pinches inward on each side
  const hFlare = 4;      // pelvis extends this far beyond hip joint on each side

  const wy  = p(j.lsy + (j.lly - j.lsy) * wFrac);
  // waist x: interpolate along shoulder→hip line, then pinch inward
  const wlx = p((j.lsx + (j.llx - j.lsx) * wFrac) + wInset);   // left waist
  const wrx = p((j.rsx + (j.rlx - j.rsx) * wFrac) - wInset);   // right waist
  // pelvis x: hip joint ± flare
  const hlx = p(j.llx - hFlare);
  const hrx = p(j.rlx + hFlare);

  return (
    `M${p(j.lsx)} ${p(j.lsy)}` +        // left shoulder
    `L${p(j.rsx)} ${p(j.rsy)}` +        // right shoulder
    `L${wrx} ${wy}` +                    // right waist (inward)
    `L${hrx} ${p(j.rly)}` +             // right pelvis (flared)
    `L${hlx} ${p(j.lly)}` +             // left pelvis (flared)
    `L${wlx} ${wy}Z`                    // left waist (inward) → close
  );
}

// ─── Neutral standing pose — 180 × 220 viewBox ───────────────────────────────
const N = {
  hx:  90,  hy:  18,   // head center (r=16)
  lsx: 62,  lsy: 52,   rsx: 118, rsy: 52,   // shoulders
  lex: 50,  ley: 88,   rex: 130, rey: 88,   // elbows
  lwx: 44,  lwy: 122,  rwx: 136, rwy: 122,  // wrists
  llx: 74,  lly: 118,  rlx: 106, rly: 118,  // hip joints
  lkx: 70,  lky: 164,  rkx: 110, rky: 164,  // knees
  lfx: 68,  lfy: 208,  rfx: 112, rfy: 208,  // ankles
};

// ─── Exercise animations ──────────────────────────────────────────────────────
const ANIM = {

  // Arms raise overhead — shoulders, chest, upper back
  arm_raise: {
    poseA: N,
    poseB: { ...N,
      lex: 56, ley: 16,  rex: 124, rey: 16,
      lwx: 50, lwy:  2,  rwx: 130, rwy:  2,
    },
  },

  // Deep squat — quads, glutes, knees
  squat: {
    poseA: N,
    poseB: { ...N,
      hx: 90,  hy: 68,
      lsx: 60, lsy: 96,  rsx: 120, rsy: 96,
      lex: 48, ley: 126, rex: 132, rey: 126,
      lwx: 42, lwy: 152, rwx: 138, rwy: 152,
      llx: 70, lly: 154, rlx: 110, rly: 154,
      lkx: 50, lky: 188, rkx: 130, rky: 188,
      lfx: 60, lfy: 208, rfx: 120, rfy: 208,
    },
  },

  // Lateral side bend — obliques, QL
  side_bend: {
    poseA: N,
    poseB: { ...N,
      hx: 110, hy: 26,
      lsx: 80,  lsy: 56,  rsx: 124, rsy: 44,
      lex: 70,  ley: 90,  rex: 140, rey: 20,
      lwx: 62,  lwy: 120, rwx: 152, rwy:  4,
    },
  },

  // Knee raise / march — hip flexors, glute med, core
  knee_raise: {
    poseA: N,
    poseB: { ...N,
      lex: 38, ley: 94,  rex: 142, rey: 94,
      lwx: 34, lwy: 124, rwx: 146, rwy: 124,
      lkx: 76, lky: 108,
      lfx: 82, lfy: 148,
    },
  },

  // Forward fold / hip hinge — hamstrings, lower back, glute bridge
  forward_reach: {
    poseA: N,
    poseB: { ...N,
      hx: 74,  hy: 44,
      lsx: 62,  lsy: 72,  rsx: 106, rsy: 70,
      lex: 60,  ley: 104, rex: 106, rey: 102,
      lwx: 60,  lwy: 138, rwx: 106, rwy: 136,
      llx: 74,  lly: 122, rlx: 106, rly: 122,
    },
  },

  // Torso rotation — thoracic, obliques, core
  torso_rotate: {
    poseA: N,
    poseB: { ...N,
      lsx: 80, lsy: 52,  rsx: 100, rsy: 52,
      lex: 26, ley: 52,  rex: 154, rey: 52,
      lwx:  6, lwy: 52,  rwx: 174, rwy: 52,
    },
  },

  // Calf raise — calves, achilles, plantar
  calf_raise: {
    poseA: N,
    poseB: { ...N,
      hx:  90, hy:  12,
      lsx: 62, lsy: 46,  rsx: 118, rsy: 46,
      lex: 50, ley: 82,  rex: 130, rey: 82,
      lwx: 44, lwy: 116, rwx: 136, rwy: 116,
      llx: 74, lly: 112, rlx: 106, rly: 112,
      lkx: 70, lky: 158, rkx: 110, rky: 158,
      lfx: 72, lfy: 200, rfx: 108, rfy: 200,
    },
  },

  // Forward lunge — quads, hip flexors, glutes
  lunge: {
    poseA: N,
    poseB: { ...N,
      rlx: 112, rly: 118, rkx: 124, rky: 158, rfx: 130, rfy: 200,
      llx:  70, lly: 120, lkx:  56, lky: 168, lfx:  48, lfy: 210,
    },
  },

  // Neck tilt — neck, upper trap, SCM
  neck_tilt: {
    poseA: N,
    poseB: { ...N,
      hx: 108, hy: 22,
    },
  },

  // Lateral shoulder raise / W-raise — rear delts, rotator cuff
  shoulder_raise: {
    poseA: N,
    poseB: { ...N,
      lex: 38, ley: 66,  rex: 142, rey: 66,
      lwx: 38, lwy: 94,  rwx: 142, rwy: 94,
    },
  },

  // Dead bug / hollow-body — core, hip flexors
  dead_bug: {
    poseA: N,
    poseB: { ...N,
      lex: 36, ley: 86,  rex: 144, rey: 86,
      lwx: 32, lwy: 58,  rwx: 148, rwy: 58,
      lkx: 80, lky: 108, rkx: 100, rky: 108,
      lfx: 82, lfy: 148, rfx: 100, rfy: 148,
    },
  },
};

// ─── Map exercise → best animation type ──────────────────────────────────────
export function getAnimType(exercise) {
  if (!exercise) return 'arm_raise';
  const n  = (exercise.name  || '').toLowerCase();
  const f  = (exercise.focus || '').toLowerCase();
  const ph =  exercise.phase || '';

  if (/calf|ankle|achilles|plantar|toe/.test(f)             || /calf|ankle|toe/.test(n))         return 'calf_raise';
  if (/lunge|split squat|step up/.test(f)                   || /lunge|split|step up/.test(n))     return 'lunge';
  if (/neck|cervical|chin/.test(f)                          || /neck|chin tuck/.test(n))           return 'neck_tilt';
  if (/rear delt|rotator|scapular|w raise/.test(f)          || /face pull|w raise|band pull/.test(n)) return 'shoulder_raise';
  if (/dead.?bug|pallof|hollow/.test(f)                     || /dead.?bug|pallof/.test(n))         return 'dead_bug';
  if (/shoulder|pec|chest|press|pull|row|band/.test(f)      || /shoulder|press|pull|row/.test(n)) return 'arm_raise';
  if (/quad|glute.*strength|squat|wall sit/.test(f)         || /squat|wall sit/.test(n))           return 'squat';
  if (/oblique|lateral flex|side bend/.test(f)              || /side bend|lateral/.test(n))        return 'side_bend';
  if (/hip flex|glute med|march|clam/.test(f)               || /knee raise|march|clam|bird/.test(n)) return 'knee_raise';
  if (/hamstring|lower back|hip hinge|glute bridge|posterior/.test(f) || /fold|hinge|bridge/.test(n)) return 'forward_reach';
  if (/thoracic|rotat|twist|spinal mob/.test(f)             || /twist|rotat|thoracic/.test(n))    return 'torso_rotate';

  if (ph === 'Mobility')   return 'forward_reach';
  if (ph === 'Strength')   return 'squat';
  if (ph === 'Activation') return 'knee_raise';
  if (ph === 'Stability')  return 'torso_rotate';
  if (ph === 'Release')    return 'side_bend';
  return 'arm_raise';
}

// ─── Interpolation helpers ────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpPose(pa, pb, t) {
  const r = {};
  for (const k of Object.keys(pa)) r[k] = lerp(pa[k], pb[k], t);
  return r;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExerciseAnimation({ exercise, color = '#7C5CF0', size = 180 }) {
  const animType        = getAnimType(exercise);
  const { poseA, poseB } = ANIM[animType] || ANIM.arm_raise;

  const [j, setJ]    = useState(poseA);
  const progress     = useRef(new Animated.Value(0)).current;
  const listenerRef  = useRef(null);
  const loopRef      = useRef(null);

  useEffect(() => {
    progress.setValue(0);
    setJ(poseA);

    listenerRef.current = progress.addListener(({ value }) => {
      setJ(lerpPose(poseA, poseB, value));
    });

    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.delay(300),
        Animated.timing(progress, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.delay(250),
      ])
    );
    loopRef.current.start();

    return () => {
      progress.removeListener(listenerRef.current);
      loopRef.current?.stop();
    };
  }, [animType]);

  const col  = color;
  const dim  = col + 'C0';   // back-layer limbs at ~75% opacity → depth cue
  const h    = size * (220 / 180);

  // Neck origin = midpoint between shoulders (moves naturally with torso)
  const neckX = (j.lsx + j.rsx) / 2;
  const neckY = (j.lsy + j.rsy) / 2;

  return (
    <View style={{ width: size, height: h, alignSelf: 'center' }}>
      <Svg viewBox="0 0 180 220" width={size} height={h}>

        {/* Ground shadow */}
        <Ellipse cx="90" cy="214" rx="46" ry="5" fill={col + '22'} />

        {/* ── Left leg (back layer, dimmed) ──────────────────────────── */}
        {/* thigh: wide at hip (r=9.5), tapers to knee (r=7.5) */}
        <Path d={capsule(j.llx, j.lly, j.lkx, j.lky, 9.5, 7.5)} fill={dim} />
        {/* shin: wider at knee (r=7), tapers to ankle (r=5) */}
        <Path d={capsule(j.lkx, j.lky, j.lfx, j.lfy, 7, 5)} fill={dim} />
        {/* foot oval */}
        <Ellipse cx={p(j.lfx)} cy={p(j.lfy)} rx={9} ry={4.5} fill={dim} />

        {/* ── Right leg (front layer) ─────────────────────────────────── */}
        <Path d={capsule(j.rlx, j.rly, j.rkx, j.rky, 9.5, 7.5)} fill={col} />
        <Path d={capsule(j.rkx, j.rky, j.rfx, j.rfy, 7, 5)} fill={col} />
        <Ellipse cx={p(j.rfx)} cy={p(j.rfy)} rx={9} ry={4.5} fill={col} />

        {/* ── Left arm (back layer, dimmed) ──────────────────────────── */}
        {/* upper arm: wide at shoulder (r=7.5), tapers to elbow (r=5.5) */}
        <Path d={capsule(j.lsx, j.lsy, j.lex, j.ley, 7.5, 5.5)} fill={dim} />
        {/* forearm: wider at elbow (r=5.5), tapers to wrist (r=3.5) */}
        <Path d={capsule(j.lex, j.ley, j.lwx, j.lwy, 5.5, 3.5)} fill={dim} />
        {/* hand */}
        <Circle cx={p(j.lwx)} cy={p(j.lwy)} r={4} fill={dim} />

        {/* ── Torso: shoulders → waist pinch → pelvis flare ─────────── */}
        <Path
          d={torsoPath(j)}
          fill={col + '35'}
          stroke={col + 'DD'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ── Neck: emerges from mid-shoulder up to head ─────────────── */}
        {/* uniform r=6 — the head circle naturally caps the top */}
        <Path d={capsule(neckX, neckY, j.hx, j.hy, 6, 6)} fill={col} />

        {/* ── Right arm (front layer) ─────────────────────────────────── */}
        <Path d={capsule(j.rsx, j.rsy, j.rex, j.rey, 7.5, 5.5)} fill={col} />
        <Path d={capsule(j.rex, j.rey, j.rwx, j.rwy, 5.5, 3.5)} fill={col} />
        <Circle cx={p(j.rwx)} cy={p(j.rwy)} r={4} fill={col} />

        {/* ── Head ───────────────────────────────────────────────────── */}
        <Circle
          cx={p(j.hx)} cy={p(j.hy)} r={16}
          fill={col + '28'}
          stroke={col}
          strokeWidth="2.5"
        />
        {/* Eyes — placed slightly forward in head, follow head movement */}
        <Circle cx={p(j.hx - 5.5)} cy={p(j.hy - 2)} r={2.5} fill={col + '90'} />
        <Circle cx={p(j.hx + 5.5)} cy={p(j.hy - 2)} r={2.5} fill={col + '90'} />

      </Svg>
    </View>
  );
}
