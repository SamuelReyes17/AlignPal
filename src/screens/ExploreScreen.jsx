import React, { useState, useMemo } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, KitColors, KitAccents, KitRadius, KitSpacing, PhasePalette, getPhaseMeta } from '../constants/brand';
import { EXERCISE_LIBRARY } from '../constants/exerciseLibrary';
import ExerciseAnimation from '../components/ExerciseAnimation';
import { GradientCard } from '../components/kit';
import { useResponsive, fs, sp } from '../utils/responsive';

/**
 * ExploreScreen — Explore tab.
 *
 * Uniform layout: header row + violet hero + filter chips + virtualized tile grid.
 * Modal detail sheet is preserved (uses legacy phase coloring inside).
 */

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

  const { isSmall, isTablet, horizPad, frameWidth, fontScale, gapScale } = useResponsive();
  const dyn = {
    pageContent: { paddingHorizontal: horizPad, gap: sp(KitSpacing.s4, gapScale) },
    name:        { fontSize: fs(22, fontScale) },
    eyebrow:     { fontSize: fs(13, fontScale) },
    heroSub:     { fontSize: fs(13, fontScale) },
    frame:       { width: '100%', alignSelf: 'center', maxWidth: Math.max(frameWidth, 0) },
  };

  const filtered = useMemo(
    () => phaseFilter === 'All'
      ? ALL_EXERCISES
      : ALL_EXERCISES.filter(e => e.phase === phaseFilter),
    [phaseFilter]
  );

  const ph = selected ? getPhaseMeta(selected.phase) : PhasePalette.Mobility;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item, i) => item.name + i}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={[styles.headerWrap, dyn.pageContent]}>
           <View style={dyn.frame}>
            {/* Header row */}
            <View style={styles.header}>
              <View style={{ flexShrink: 1 }}>
                <Text style={[styles.eyebrow, dyn.eyebrow]}>Browse all</Text>
                <Text style={[styles.name, dyn.name]} numberOfLines={1}>Exercises</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{filtered.length}</Text>
              </View>
            </View>

            {/* Violet hero */}
            <GradientCard variant="violet">
              <Text style={styles.heroEyebrow}>{ALL_EXERCISES.length}+ protocols</Text>
              <Text style={styles.heroTitle}>Evidence-based</Text>
              <Text style={[styles.heroSub, dyn.heroSub]}>
                Explore the full library by phase — Mobility, Activation, Stability, Strength, Release.
              </Text>
            </GradientCard>

            {/* Phase filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
              style={{ marginTop: 4, marginHorizontal: -horizPad }}
            >
              <View style={{ width: horizPad }} />
              {PHASE_FILTERS.map(f => {
                const active = phaseFilter === f;
                const meta = f === 'All' ? null : PhasePalette[f];
                const color = active
                  ? (meta?.color || KitAccents.violet)
                  : KitColors.text3;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[
                      styles.chip,
                      active && {
                        backgroundColor: (meta?.color || KitAccents.violet) + '22',
                        borderColor:    (meta?.color || KitAccents.violet) + '88',
                      },
                    ]}
                    onPress={() => setPhaseFilter(f)}
                    activeOpacity={0.75}
                  >
                    {meta && (
                      <Ionicons name={meta.icon} size={12} color={color} />
                    )}
                    <Text style={[styles.chipText, { color: active ? color : KitColors.text2 }]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={{ width: horizPad }} />
            </ScrollView>
           </View>
          </View>
        )}
        columnWrapperStyle={[styles.gridRow, { paddingHorizontal: horizPad }]}
        contentContainerStyle={{ paddingTop: 22, paddingBottom: 120 }}
        renderItem={({ item: ex }) => {
          const p = getPhaseMeta(ex.phase);
          return (
            <TouchableOpacity
              style={styles.tile}
              onPress={() => setSelected(ex)}
              activeOpacity={0.78}
            >
              <View style={[styles.tileStripe, { backgroundColor: p.color }]} />
              <View style={[styles.tileIconArea, { backgroundColor: p.color + '18' }]}>
                <Ionicons name={ex.icon || p.icon} size={32} color={p.color} />
              </View>
              <View style={styles.tileBody}>
                <View style={[styles.tilePhasePill, { backgroundColor: p.color + '1F', borderColor: p.color + '40' }]}>
                  <Text style={[styles.tilePhaseText, { color: p.color }]}>{ex.phase}</Text>
                </View>
                <Text style={styles.tileName} numberOfLines={2}>{ex.name}</Text>
                <Text style={styles.tileMeta} numberOfLines={1}>{ex.reps || ex.duration}</Text>
                <View style={styles.tileFooter}>
                  <Text style={styles.tileCat} numberOfLines={1}>
                    {CATEGORY_LABELS[ex.category] || ex.category}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Detail modal — kept */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setSelected(null)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.sheetHeader, { backgroundColor: ph.bg }]}>
                  <ExerciseAnimation exercise={selected} color={ph.color} size={120} />
                  <View style={[styles.phasePill, { backgroundColor: ph.color + '22', borderColor: ph.color + '50' }]}>
                    <Ionicons name={ph.icon} size={10} color={ph.color} />
                    <Text style={[styles.pillText, { color: ph.color }]}>{selected.phase}</Text>
                  </View>
                  <Text style={styles.sheetName}>{selected.name}</Text>
                  <Text style={styles.sheetFocus}>{selected.focus}</Text>
                </View>

                <View style={styles.chipRow}>
                  <View style={styles.infoChip}>
                    <Ionicons name="time-outline" size={12} color={KitColors.text3} />
                    <Text style={styles.infoChipText}>{selected.duration}</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="layers-outline" size={12} color={KitColors.text3} />
                    <Text style={styles.infoChipText}>{selected.reps}</Text>
                  </View>
                  <View style={styles.infoChip}>
                    <Ionicons name="body-outline" size={12} color={KitColors.text3} />
                    <Text style={styles.infoChipText}>{CATEGORY_LABELS[selected.category] || selected.category}</Text>
                  </View>
                </View>

                {selected.howTo && (
                  <View style={styles.howToSection}>
                    <Text style={styles.sectionLabel}>How to do it</Text>
                    <Text style={styles.howToText}>{selected.howTo}</Text>
                  </View>
                )}

                {selected.why && (
                  <View style={styles.whyCard}>
                    <Ionicons name="bulb-outline" size={14} color={Colors.amber} />
                    <Text style={styles.whyText}>{selected.why}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: KitColors.bg },

  headerWrap: { paddingTop: 22 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: KitSpacing.s4,
  },
  eyebrow: { color: KitColors.text3, fontSize: 13, fontWeight: '500' },
  name: {
    fontSize: 22, fontWeight: '700', color: KitColors.text1,
    letterSpacing: -0.4, marginTop: 2,
  },
  countBadge: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: KitColors.surface1,
    borderWidth: 1, borderColor: KitColors.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { color: KitColors.text1, fontSize: 16, fontWeight: '800' },

  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF', fontSize: 28, fontWeight: '800',
    letterSpacing: -0.6, marginBottom: 8,
  },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },

  filtersRow: {
    alignItems: 'center', gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: KitRadius.md,
    borderWidth: 1, borderColor: KitColors.hairline,
    backgroundColor: KitColors.surface1,
  },
  chipText: { fontSize: 12, fontWeight: '700' },

  // Tile grid
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tile: {
    width: '48.5%',
    backgroundColor: KitColors.surface1,
    borderRadius: KitRadius.lg,
    borderWidth: 1,
    borderColor: KitColors.hairline,
    overflow: 'hidden',
  },
  tileStripe:    { height: 4, width: '100%' },
  tileIconArea:  { height: 76, alignItems: 'center', justifyContent: 'center' },
  tileBody:      { padding: 12, gap: 6 },
  tilePhasePill: {
    alignSelf: 'flex-start', flexDirection: 'row',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1,
  },
  tilePhaseText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  tileName: {
    fontSize: 13, fontWeight: '800', color: KitColors.text1,
    lineHeight: 17, marginTop: 2,
  },
  tileMeta:   { fontSize: 11, color: KitColors.text2, fontWeight: '600' },
  tileFooter: {
    borderTopWidth: 1, borderTopColor: KitColors.hairline,
    marginTop: 4, paddingTop: 8,
  },
  tileCat: {
    fontSize: 10, color: KitColors.text3, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.6,
  },

  // Modal (preserved)
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: KitColors.surface1,
    borderTopLeftRadius: KitRadius.xl,
    borderTopRightRadius: KitRadius.xl,
    maxHeight: '88%',
    borderWidth: 1, borderBottomWidth: 0, borderColor: KitColors.hairline,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: KitColors.hairline, alignSelf: 'center', marginVertical: 12,
  },
  sheetHeader: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    alignItems: 'center', gap: 10,
    borderRadius: KitRadius.lg,
    marginHorizontal: 16, marginBottom: 8,
  },
  phasePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1,
  },
  pillText:  { fontSize: 11, fontWeight: '700' },
  sheetName: {
    fontSize: 22, fontWeight: '800', color: KitColors.text1,
    textAlign: 'center', letterSpacing: -0.4,
  },
  sheetFocus: { fontSize: 13, color: KitColors.text2, textAlign: 'center' },
  chipRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 16, marginBottom: 16, flexWrap: 'wrap',
  },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: KitColors.surface2,
    borderRadius: KitRadius.sm,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: KitColors.hairline,
  },
  infoChipText: { fontSize: 12, color: KitColors.text2, fontWeight: '600' },
  howToSection: { paddingHorizontal: 16, marginBottom: 12 },
  sectionLabel: {
    fontSize: 13, fontWeight: '800', color: KitColors.text2,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10,
  },
  howToText: {
    fontSize: 14, color: KitColors.text2, lineHeight: 22,
    backgroundColor: KitColors.surface2,
    borderRadius: KitRadius.md, padding: 16,
    borderWidth: 1, borderColor: KitColors.hairline,
  },
  whyCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginHorizontal: 16,
    backgroundColor: Colors.amber + '10',
    borderRadius: KitRadius.md, padding: 16,
    borderWidth: 1, borderColor: Colors.amber + '30',
  },
  whyText: { flex: 1, fontSize: 13, color: Colors.amber, lineHeight: 20 },
});
