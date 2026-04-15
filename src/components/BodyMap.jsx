import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Ellipse, Path, Rect, G } from 'react-native-svg';

// ─── Pain Zone Hotspots ───────────────────────────────────────────────────────
// Coordinates mapped to a 200×380 viewBox matching the body silhouette below
const PAIN_ZONES = {
  front: [
    { id: 'neck',            label: 'Neck',           cx: 100, cy: 72,  rx: 14, ry: 12 },
    { id: 'left_shoulder',   label: 'Left Shoulder',  cx: 60,  cy: 106, rx: 17, ry: 13 },
    { id: 'right_shoulder',  label: 'Right Shoulder', cx: 140, cy: 106, rx: 17, ry: 13 },
    { id: 'chest',           label: 'Chest',          cx: 100, cy: 132, rx: 20, ry: 16 },
    { id: 'abdomen',         label: 'Abdomen',        cx: 100, cy: 172, rx: 18, ry: 14 },
    { id: 'left_hip',        label: 'Left Hip',       cx: 78,  cy: 210, rx: 15, ry: 13 },
    { id: 'right_hip',       label: 'Right Hip',      cx: 122, cy: 210, rx: 15, ry: 13 },
    { id: 'left_knee',       label: 'Left Knee',      cx: 79,  cy: 270, rx: 13, ry: 12 },
    { id: 'right_knee',      label: 'Right Knee',     cx: 121, cy: 270, rx: 13, ry: 12 },
    { id: 'left_ankle',      label: 'Left Ankle',     cx: 80,  cy: 340, rx: 11, ry: 9  },
    { id: 'right_ankle',     label: 'Right Ankle',    cx: 120, cy: 340, rx: 11, ry: 9  },
  ],
  back: [
    { id: 'upper_back',      label: 'Upper Back',     cx: 100, cy: 120, rx: 22, ry: 17 },
    { id: 'lower_back',      label: 'Lower Back',     cx: 100, cy: 168, rx: 20, ry: 15 },
    { id: 'left_shoulder_b', label: 'Left Shoulder',  cx: 60,  cy: 106, rx: 17, ry: 13 },
    { id: 'right_shoulder_b',label: 'Right Shoulder', cx: 140, cy: 106, rx: 17, ry: 13 },
    { id: 'left_hip_b',      label: 'Left Hip',       cx: 78,  cy: 208, rx: 15, ry: 13 },
    { id: 'right_hip_b',     label: 'Right Hip',      cx: 122, cy: 208, rx: 15, ry: 13 },
    { id: 'left_hamstring',  label: 'Left Hamstring', cx: 79,  cy: 258, rx: 13, ry: 17 },
    { id: 'right_hamstring', label: 'Right Hamstring',cx: 121, cy: 258, rx: 13, ry: 17 },
    { id: 'left_calf',       label: 'Left Calf/Shin', cx: 80,  cy: 308, rx: 11, ry: 15 },
    { id: 'right_calf',      label: 'Right Calf/Shin',cx: 120, cy: 308, rx: 11, ry: 15 },
  ],
};

// ─── Body Silhouette SVGs ─────────────────────────────────────────────────────
const FrontSilhouette = () => (
  <Svg viewBox="0 0 200 380" width={170} height={323} style={StyleSheet.absoluteFill}>
    {/* Head */}
    <Ellipse cx="100" cy="44" rx="22" ry="26" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Neck */}
    <Rect x="91" y="67" width="18" height="15" rx="4" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Torso */}
    <Path
      d="M63 83 Q58 79 52 100 L45 210 Q62 222 100 224 Q138 222 155 210 L148 100 Q142 79 137 83 Q120 97 100 97 Q80 97 63 83Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Left arm */}
    <Path
      d="M52 100 Q37 112 30 146 Q26 168 33 188 Q38 198 44 196 Q52 193 53 180 Q51 160 57 140 Q61 121 63 109Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Right arm */}
    <Path
      d="M148 100 Q163 112 170 146 Q174 168 167 188 Q162 198 156 196 Q148 193 147 180 Q149 160 143 140 Q139 121 137 109Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Left forearm */}
    <Path
      d="M33 188 Q28 212 30 232 Q32 245 39 248 Q47 251 51 240 Q53 226 53 210 Q53 197 44 196Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Right forearm */}
    <Path
      d="M167 188 Q172 212 170 232 Q168 245 161 248 Q153 251 149 240 Q147 226 147 210 Q147 197 156 196Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Pelvis */}
    <Path
      d="M61 210 Q57 224 61 238 Q77 249 100 250 Q123 249 139 238 Q143 224 139 210 Q120 222 100 224 Q80 222 61 210Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Left thigh */}
    <Path
      d="M61 238 Q53 256 55 288 Q57 309 67 315 Q77 319 81 308 Q85 290 83 268 Q81 248 77 242Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Right thigh */}
    <Path
      d="M139 238 Q147 256 145 288 Q143 309 133 315 Q123 319 119 308 Q115 290 117 268 Q119 248 123 242Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Left lower leg */}
    <Path
      d="M67 315 Q63 332 65 353 Q67 365 75 367 Q83 369 85 357 Q87 338 81 308Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Right lower leg */}
    <Path
      d="M133 315 Q137 332 135 353 Q133 365 125 367 Q117 369 115 357 Q113 338 119 308Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Feet */}
    <Ellipse cx="75" cy="369" rx="11" ry="5" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Ellipse cx="125" cy="369" rx="11" ry="5" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
  </Svg>
);

const BackSilhouette = () => (
  <Svg viewBox="0 0 200 380" width={170} height={323} style={StyleSheet.absoluteFill}>
    {/* Head */}
    <Ellipse cx="100" cy="44" rx="22" ry="26" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Neck */}
    <Rect x="91" y="67" width="18" height="15" rx="4" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Torso back */}
    <Path
      d="M63 83 Q58 79 52 100 L45 210 Q62 222 100 224 Q138 222 155 210 L148 100 Q142 79 137 83 Q120 97 100 97 Q80 97 63 83Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5"
    />
    {/* Spine hint */}
    <Path d="M100 90 L100 198" stroke="#243040" strokeWidth="2" strokeDasharray="3,4" />
    {/* Arms (mirrored from front) */}
    <Path d="M52 100 Q37 112 30 146 Q26 168 33 188 Q38 198 44 196 Q52 193 53 180 Q51 160 57 140 Q61 121 63 109Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M148 100 Q163 112 170 146 Q174 168 167 188 Q162 198 156 196 Q148 193 147 180 Q149 160 143 140 Q139 121 137 109Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M33 188 Q28 212 30 232 Q32 245 39 248 Q47 251 51 240 Q53 226 53 210 Q53 197 44 196Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M167 188 Q172 212 170 232 Q168 245 161 248 Q153 251 149 240 Q147 226 147 210 Q147 197 156 196Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Pelvis */}
    <Path d="M61 210 Q57 224 61 238 Q77 249 100 250 Q123 249 139 238 Q143 224 139 210 Q120 222 100 224 Q80 222 61 210Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    {/* Legs */}
    <Path d="M61 238 Q53 256 55 288 Q57 309 67 315 Q77 319 81 308 Q85 290 83 268 Q81 248 77 242Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M139 238 Q147 256 145 288 Q143 309 133 315 Q123 319 119 308 Q115 290 117 268 Q119 248 123 242Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M67 315 Q63 332 65 353 Q67 365 75 367 Q83 369 85 357 Q87 338 81 308Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Path d="M133 315 Q137 332 135 353 Q133 365 125 367 Q117 369 115 357 Q113 338 119 308Z"
      fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Ellipse cx="75" cy="369" rx="11" ry="5" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
    <Ellipse cx="125" cy="369" rx="11" ry="5" fill="#1A2535" stroke="#2A3547" strokeWidth="1.5" />
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

  // Build deduplicated chips from all selected IDs across both sides
  const allZones = [...PAIN_ZONES.front, ...PAIN_ZONES.back];
  const selectedChips = selectedParts
    .map((id) => allZones.find((z) => z.id === id))
    .filter(Boolean)
    .reduce((acc, z) => {
      if (!acc.find((a) => a.label === z.label)) acc.push(z);
      return acc;
    }, []);

  return (
    <View style={styles.container}>
      {/* Front / Back Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, side === 'front' && styles.toggleActive]}
          onPress={() => setSide('front')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, side === 'front' && styles.toggleTextActive]}>
            Front
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, side === 'back' && styles.toggleActive]}
          onPress={() => setSide('back')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, side === 'back' && styles.toggleTextActive]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body Map */}
      <View style={styles.bodyWrapper}>
        {/* Static silhouette layer */}
        {side === 'front' ? <FrontSilhouette /> : <BackSilhouette />}

        {/* Interactive hotspot layer */}
        <Svg
          viewBox="0 0 200 380"
          width={170}
          height={323}
          style={StyleSheet.absoluteFill}
        >
          {zones.map((zone) => (
            <G key={zone.id} onPress={() => toggleZone(zone)}>
              <Ellipse
                cx={zone.cx}
                cy={zone.cy}
                rx={zone.rx}
                ry={zone.ry}
                fill={isSelected(zone.id) ? 'rgba(91,141,255,0.35)' : 'rgba(255,255,255,0.02)'}
                stroke={isSelected(zone.id) ? '#5B8DFF' : 'rgba(91,141,255,0.15)'}
                strokeWidth={isSelected(zone.id) ? 1.5 : 1}
              />
            </G>
          ))}
        </Svg>
      </View>

      {/* Selected area chips */}
      <View style={styles.chipsWrapper}>
        {selectedChips.length === 0 ? (
          <Text style={styles.chipsEmpty}>No areas selected yet</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {selectedChips.map((z) => (
              <TouchableOpacity
                key={z.id}
                style={styles.chip}
                onPress={() => toggleZone(z)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{z.label}</Text>
                <Text style={styles.chipX}> ×</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#141E2E',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3547',
  },
  toggleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#1F2A3D',
  },
  toggleText: {
    fontSize: 14,
    color: '#4B5B78',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  bodyWrapper: {
    width: 170,
    height: 323,
    position: 'relative',
    marginBottom: 16,
  },
  chipsWrapper: {
    height: 36,
    width: '100%',
    justifyContent: 'center',
  },
  chipsEmpty: {
    color: '#2A3547',
    fontSize: 13,
    textAlign: 'center',
  },
  chipsScroll: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F3A5F',
    borderWidth: 1,
    borderColor: '#5B8DFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
  },
  chipText: {
    color: '#5B8DFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chipX: {
    color: '#5B8DFF',
    fontSize: 14,
    fontWeight: '300',
  },
});
