import React, { useState, useMemo } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces, PhasePalette, getPhaseMeta } from '../constants/brand';
import { EXERCISE_LIBRARY } from '../constants/exerciseLibrary';
import ExerciseAnimation from '../components/ExerciseAnimation';
import GradientCard from '../components/GradientCard';
import ScreenFrame from '../components/ScreenFrame';
import { useResponsive, fs, sp } from '../utils/responsive';


const CATEGORY_LABELS = {
  lower_back: 'Lower Back', upper_back: 'Upper Back', neck: 'Neck',
  shoulder: 'Shoulder', knee: 'Knee', hip: 'Hip', glute: 'Glutes',
  hamstring: 'Hamstring', quad: 'Quads', calf: 'Calf', ankle: 'Ankle',
  achilles: 'Achilles', plantar: 'Plantar Fascia', shin: 'Shin',
  chest: 'Chest', elbow: 'Elbow', abdomen: 'Core', default: 'General',
};

const PHASE_FILTERS = ['All', 'Mobility', 'Activation', 'Stability', 'Strength', 'Release'];

// Flatten the library into a tagged array
const ALL_EXERCISES = Object.entries(EXERCISE_LIBRARY).flatMap(([cat, exs]) =>
  exs.map(ex => ({ ...ex, category: cat }))
);

export default function ExploreScreen() {
  const [phaseFilter, setPhaseFilter] = useState('All');
  const [selected,    setSelected]    = useState(null);
  const insets = useSafeAreaInsets();
  const { isSmall, isTablet, horizPad, fontScale, gapScale } = useResponsive();
  // Absolute max for content column on tablets — phones get full width minus padding.
  const contentMax = isTablet ? 640 : 9999;
  const sheetMaxWidth = isTablet ? 640 : 9999;
  const filterPad = Math.max(8, horizPad - 8);

  const dyn = {
    frame:        { width: '100%', alignSelf: 'center', maxWidth: 640, paddingHorizontal: horizPad, paddingTop: sp(8, gapScale) },
    heroWrap:     { paddingBottom: sp(12, gapScale) }, // full-bleed: no horizontal padding
    heroTitle:    { fontSize: fs(30, fontScale) },
    heroEyebrow:  { fontSize: fs(11, fontScale) },
    heroSub:      { fontSize: fs(13, fontScale) },
    filtersWrap:  { paddingHorizontal: filterPad, paddingTop: sp(4, gapScale), paddingBottom: sp(16, gapScale), gap: 10, alignItems: 'center' },
    filtersScroll:{ flexGrow: 0, marginBottom: sp(8, gapScale) },
    listWrap:     { paddingHorizontal: horizPad, paddingTop: sp(4, gapScale), paddingBottom: sp(20, gapScale) },
    cardName:     { fontSize: fs(14, fontScale) },
    sheetWrap:    { maxWidth: sheetMaxWidth, alignSelf: 'center', width: '100%' },
  };

  const filtered = useMemo(
    () => phaseFilter === 'All' ? ALL_EXERCISES : ALL_EXERCISES.filter(e => e.phase === phaseFilter),
    [phaseFilter]
  );

  const ph = selected ? getPhaseMeta(selected.phase) : PhasePalette.Mobility;

  return (
    <SafeAreaView style={st.container} edges={[]}>
     <ScreenFrame>
      {/* ═══ Full-bleed gradient hero header ═══════════════════════════════ */}
      <View style={dyn.heroWrap}>
        <View>
          <GradientCard
            colors={Gradients.purpleHero}
            radius={Radius.hero}
            corners="bottom"
            blobs={[
              { x: '88%', y: '20%', r: 70, color: Colors.white, opacity: 0.10 },
              { x: '12%', y: '90%', r: 50, color: Colors.white, opacity: 0.06 },
            ]}
            style={[Shadows.purpleSoft, { paddingTop: insets.top }]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[st.heroEyebrow, dyn.heroEyebrow]}>BROWSE ALL</Text>
                <Text style={[st.heroTitle, dyn.heroTitle]}>Exercises</Text>
              </View>
              <View style={st.heroCountBadge}>
                <Text style={st.heroCountText}>{filtered.length}</Text>
              </View>
            </View>
            <Text style={[st.heroSub, dyn.heroSub]}>{ALL_EXERCISES.length}+ evidence-based protocols organized by phase</Text>
          </GradientCard>
        </View>
      </View>

      {/* Phase filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={dyn.filtersScroll}
        contentContainerStyle={dyn.filtersWrap}
      >
        {PHASE_FILTERS.map(f => {
          const active = phaseFilter === f;
          const color  = f === 'All' ? Colors.purple : (PhasePalette[f]?.color || Colors.purple);
          return (
            <TouchableOpacity
              key={f}
              style={[st.chip, active && { backgroundColor: color + '22', borderColor: color }]}
              onPress={() => setPhaseFilter(f)}
              activeOpacity={0.75}
            >
              {f !== 'All' && (
                <Ionicons name={PhasePalette[f]?.icon} size={12} color={active ? color : Colors.textMuted} />
              )}
              <Text style={[st.chipText, active && { color }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exercise tile grid (2 columns, virtualized) */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item, i) => item.name + i}
        showsVerticalScrollIndicator={false}
        style={{ alignSelf: 'center', width: '100%', maxWidth: 640 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: horizPad }}
        contentContainerStyle={{ paddingTop: sp(4, gapScale), paddingBottom: Spacing.tabBarClearance }}
        ListFooterComponent={<View style={{ height: 24 }} />}
        renderItem={({ item: ex }) => {
          const p = getPhaseMeta(ex.phase);
          return (
            <TouchableOpacity
              style={st.tile}
              onPress={() => setSelected(ex)}
              activeOpacity={0.78}
            >
              {/* Top color strip */}
              <View style={[st.tileStripe, { backgroundColor: p.color }]} />

              {/* Big icon area */}
              <View style={[st.tileIconArea, { backgroundColor: p.color + '18' }]}>
                <Ionicons name={ex.icon || p.icon} size={36} color={p.color} />
              </View>

              {/* Body */}
              <View style={st.tileBody}>
                <View style={[st.tilePhasePill, { backgroundColor: p.color + '1F', borderColor: p.color + '40' }]}>
                  <Text style={[st.tilePhaseText, { color: p.color }]}>{ex.phase}</Text>
                </View>
                <Text style={st.tileName} numberOfLines={2}>{ex.name}</Text>
                <Text style={st.tileMeta} numberOfLines={1}>{ex.reps || ex.duration}</Text>
                <View style={st.tileFooter}>
                  <Text style={st.tileCat} numberOfLines={1}>{CATEGORY_LABELS[ex.category] || ex.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
     </ScreenFrame>

      {/* Exercise detail modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity
          style={st.backdrop}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <View style={[st.sheet, dyn.sheetWrap]} onStartShouldSetResponder={() => true}>
            <View style={st.sheetHandle} />

            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title row */}
                <View style={[st.sheetHeader, { backgroundColor: ph.bg }]}>
                  <ExerciseAnimation exercise={selected} color={ph.color} size={120} />
                  <View style={[st.phasePill, { backgroundColor: ph.color + '22', borderColor: ph.color + '50' }]}>
                    <Ionicons name={ph.icon} size={10} color={ph.color} />
                    <Text style={[st.pillText, { color: ph.color }]}>{selected.phase}</Text>
                  </View>
                  <Text style={st.sheetName}>{selected.name}</Text>
                  <Text style={st.sheetFocus}>{selected.focus}</Text>
                </View>

                {/* Chips */}
                <View style={st.chipRow}>
                  <View style={st.infoChip}>
                    <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                    <Text style={st.infoChipText}>{selected.duration}</Text>
                  </View>
                  <View style={st.infoChip}>
                    <Ionicons name="layers-outline" size={12} color={Colors.textMuted} />
                    <Text style={st.infoChipText}>{selected.reps}</Text>
                  </View>
                  <View style={st.infoChip}>
                    <Ionicons name="body-outline" size={12} color={Colors.textMuted} />
                    <Text style={st.infoChipText}>{CATEGORY_LABELS[selected.category] || selected.category}</Text>
                  </View>
                </View>

                {/* How to */}
                {selected.howTo && (
                  <View style={st.howToSection}>
                    <Text style={st.sectionLabel}>How to do it</Text>
                    <Text style={st.howToText}>{selected.howTo}</Text>
                  </View>
                )}

                {/* Why */}
                {selected.why && (
                  <View style={st.whyCard}>
                    <Ionicons name="bulb-outline" size={14} color={Colors.amber} />
                    <Text style={st.whyText}>{selected.why}</Text>
                  </View>
                )}

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  // Hero
  heroEyebrow:    { fontSize: 11, color: Surfaces.onNavy85, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle:      { fontSize: 30, fontWeight: '800', color: Colors.white, letterSpacing: -0.6, marginTop: 3 },
  heroCountBadge: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Surfaces.onNavy22, alignItems: 'center', justifyContent: 'center' },
  heroCountText:  { color: Colors.white, fontSize: 18, fontWeight: '800' },
  heroSub:        { color: Surfaces.onNavy92, fontSize: 13, fontWeight: '600', marginTop: 12 },
  container: { flex: 1, backgroundColor: Colors.bg },
  frame:     { width: '100%', alignSelf: 'center' },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgCard,
  },
  chipText:   { fontSize: 12, fontWeight: '700', color: Colors.textMuted },

  list: {},

  // ── New tile-grid layout ────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  tile: {
    width: '48.5%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tileStripe:    { height: 4, width: '100%' },
  tileIconArea:  { height: 80, alignItems: 'center', justifyContent: 'center' },
  tileBody:      { padding: Spacing.sm, gap: 6 },
  tilePhasePill: { alignSelf: 'flex-start', flexDirection: 'row', borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  tilePhaseText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  tileName:      { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, lineHeight: 17, marginTop: 2 },
  tileMeta:      { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  tileFooter:    { borderTopWidth: 1, borderTopColor: Colors.borderSubtle, marginTop: 4, paddingTop: 8 },
  tileCat:       { fontSize: 10, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },

  // Modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bgCard, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    maxHeight: '88%', borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.border,
  },
  sheetHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginVertical: 12 },
  sheetHeader:  { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md, alignItems: 'center', gap: 10, borderRadius: Radius.lg, marginHorizontal: Spacing.md, marginBottom: 8 },
  phasePill:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 4, borderRadius: Radius.lg, borderWidth: 1 },
  pillText:     { fontSize: 11, fontWeight: '700' },
  sheetName:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.4 },
  sheetFocus:   { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },

  chipRow:       { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16, flexWrap: 'wrap' },
  infoChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.bgInput, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  infoChipText:  { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  howToSection:  { paddingHorizontal: 16, marginBottom: 12 },
  sectionLabel:  { fontSize: 13, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  howToText:     { fontSize: 14, color: Colors.textSecondary, lineHeight: 23, backgroundColor: Colors.bgInput, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSubtle },

  whyCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: Spacing.md, backgroundColor: Colors.amber + '10', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.amber + '30' },
  whyText:   { flex: 1, fontSize: 13, color: Colors.amber, lineHeight: 20 },
});
