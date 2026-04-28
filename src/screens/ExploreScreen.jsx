import React, { useState, useMemo } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/brand';
import { EXERCISE_LIBRARY } from '../constants/exerciseLibrary';
import ExerciseAnimation from '../components/ExerciseAnimation';

const PHASE = {
  Mobility:   { color: '#7C5CF0', bg: '#7C5CF018', icon: 'sync-outline'    },
  Activation: { color: '#34D399', bg: '#34D39918', icon: 'flash-outline'   },
  Stability:  { color: '#FBBF24', bg: '#FBBF2418', icon: 'shield-outline'  },
  Strength:   { color: '#FF6B9D', bg: '#FF6B9D18', icon: 'barbell-outline' },
  Release:    { color: '#C4B8FF', bg: '#C4B8FF18', icon: 'leaf-outline'    },
};
const getPhase = (name) => PHASE[name] || PHASE.Mobility;

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

  const filtered = useMemo(() => {
    const base = phaseFilter === 'All' ? ALL_EXERCISES : ALL_EXERCISES.filter(e => e.phase === phaseFilter);
    return base.slice(0, 60); // cap to 60 for performance
  }, [phaseFilter]);

  const ph = selected ? getPhase(selected.phase) : PHASE.Mobility;

  return (
    <SafeAreaView style={st.container} edges={['top']}>
      {/* Header */}
      <View style={st.header}>
        <View>
          <Text style={st.eyebrow}>Browse All</Text>
          <Text style={st.title}>Exercises</Text>
        </View>
        <View style={st.countBadge}>
          <Text style={st.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Phase filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={st.filters}
      >
        {PHASE_FILTERS.map(f => {
          const active = phaseFilter === f;
          const color  = f === 'All' ? Colors.purple : (PHASE[f]?.color || Colors.purple);
          return (
            <TouchableOpacity
              key={f}
              style={[st.chip, active && { backgroundColor: color + '22', borderColor: color }]}
              onPress={() => setPhaseFilter(f)}
              activeOpacity={0.75}
            >
              {f !== 'All' && (
                <Ionicons name={PHASE[f]?.icon} size={12} color={active ? color : Colors.textMuted} />
              )}
              <Text style={[st.chipText, active && { color }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exercise list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.list}>
        {filtered.map((ex, i) => {
          const p = getPhase(ex.phase);
          return (
            <TouchableOpacity
              key={ex.name + i}
              style={st.card}
              onPress={() => setSelected(ex)}
              activeOpacity={0.75}
            >
              <View style={[st.cardIcon, { backgroundColor: p.color + '18', borderColor: p.color + '40' }]}>
                <Ionicons name={ex.icon || p.icon} size={22} color={p.color} />
              </View>
              <View style={st.cardInfo}>
                <Text style={st.cardName} numberOfLines={1}>{ex.name}</Text>
                <View style={st.cardMeta}>
                  <Text style={[st.phaseDot, { color: p.color }]}>● </Text>
                  <Text style={st.metaText}>{p.icon.replace('-outline', '').replace(/-/g, ' ')} · {ex.reps || ex.duration}</Text>
                </View>
                <Text style={st.cardFocus} numberOfLines={1}>{ex.focus}</Text>
              </View>
              <View style={st.catBadge}>
                <Text style={st.catText}>{CATEGORY_LABELS[ex.category] || ex.category}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>

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
          <View style={st.sheet} onStartShouldSetResponder={() => true}>
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
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
  },
  eyebrow:    { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 3 },
  title:      { fontSize: 30, fontWeight: '800', color: Colors.textPrimary },
  countBadge: { backgroundColor: Colors.bgCard, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: Colors.border },
  countText:  { fontSize: 16, fontWeight: '800', color: Colors.textSecondary },

  filters:    { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgCard,
  },
  chipText:   { fontSize: 12, fontWeight: '700', color: Colors.textMuted },

  list: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard, borderRadius: 18, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  cardIcon:   { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  cardInfo:   { flex: 1, gap: 3 },
  cardName:   { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cardMeta:   { flexDirection: 'row', alignItems: 'center' },
  phaseDot:   { fontSize: 10 },
  metaText:   { fontSize: 11, color: Colors.textMuted, fontWeight: '500', textTransform: 'capitalize' },
  cardFocus:  { fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic' },
  catBadge:   { backgroundColor: Colors.bgInput, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  catText:    { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textAlign: 'center', maxWidth: 60 },

  // Modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bgCard, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '88%', borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.border,
  },
  sheetHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginVertical: 12 },
  sheetHeader:  { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, alignItems: 'center', gap: 10, borderRadius: 20, marginHorizontal: 16, marginBottom: 8 },
  phasePill:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  pillText:     { fontSize: 11, fontWeight: '700' },
  sheetName:    { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.4 },
  sheetFocus:   { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },

  chipRow:       { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16, flexWrap: 'wrap' },
  infoChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.bgInput, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  infoChipText:  { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  howToSection:  { paddingHorizontal: 16, marginBottom: 12 },
  sectionLabel:  { fontSize: 13, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  howToText:     { fontSize: 14, color: Colors.textSecondary, lineHeight: 23, backgroundColor: Colors.bgInput, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.borderSubtle },

  whyCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 16, backgroundColor: Colors.amber + '10', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.amber + '30' },
  whyText:   { flex: 1, fontSize: 13, color: Colors.amber, lineHeight: 20 },
});
