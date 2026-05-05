import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, PanResponder, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useOnboarding } from '../context/OnboardingContext';
import { selectExercises } from '../constants/exerciseLibrary';
import { Colors, Shadows, Accents, Gradients, Radius, Spacing, Surfaces, PhasePalette, getPhaseMeta } from '../constants/brand';
import ExerciseAnimation from '../components/ExerciseAnimation';
import { useResponsive, fs, sp } from '../utils/responsive';

// ─── Phase theme ──────────────────────────────────────────────────────────────

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function parseExercise(ex) {
  const reps = (ex.reps || '').trim();
  const fwdMatch = reps.match(/^(\d+)\s*[×x]\s*(.+)$/i);
  if (fwdMatch) {
    const sets = parseInt(fwdMatch[1]);
    const repPart = fwdMatch[2].trim();
    const secMatch = repPart.match(/^(\d+)\s*sec/i);
    const minMatch = repPart.match(/^(\d+)\s*min/i);
    const isTimed = !!(secMatch || minMatch);
    const timerSeconds = secMatch ? parseInt(secMatch[1]) : minMatch ? parseInt(minMatch[1]) * 60 : null;
    return { sets, repsLabel: repPart, isTimed, timerSeconds };
  }
  const revMatch = reps.match(/^(.+?)\s*[×x]\s*(\d+)$/i);
  if (revMatch) {
    const sets = parseInt(revMatch[2]);
    const repPart = revMatch[1].trim();
    const secMatch = repPart.match(/^(\d+)\s*sec/i);
    const minMatch = repPart.match(/^(\d+)\s*min/i);
    const isTimed = !!(secMatch || minMatch);
    const timerSeconds = secMatch ? parseInt(secMatch[1]) : minMatch ? parseInt(minMatch[1]) * 60 : null;
    return { sets, repsLabel: repPart, isTimed, timerSeconds };
  }
  const durMatch = (ex.duration || '').match(/(\d+)\s*min/i);
  return {
    sets: 1,
    repsLabel: reps || ex.duration || '',
    isTimed: !!durMatch,
    timerSeconds: durMatch ? parseInt(durMatch[1]) * 60 : null,
  };
}

// ─── Done screen ──────────────────────────────────────────────────────────────
function DoneScreen({ exercises, onContinue, isOnboarding }) {
  const { isSmall, isTablet, horizPad, fontScale, gapScale, width } = useResponsive();
  const frameWidth = Math.min(width - horizPad * 2, 560);
  const totalMin  = exercises.reduce((sum, e) => sum + (parseInt(e.duration) || 2), 0);
  const totalSets = exercises.reduce((sum, e) => sum + (parseExercise(e).sets || 1), 0);
  return (
    <SafeAreaView style={done.container} edges={['top', 'bottom']}>
      <View style={[done.content, { paddingHorizontal: horizPad }]}>
        <View style={[done.frame, { maxWidth: frameWidth }]}>
        <View style={done.ring}>
          <Text style={done.emoji}>🎉</Text>
        </View>
        <Text style={[done.title, { fontSize: fs(30, fontScale) }]}>Session Complete!</Text>
        <Text style={[done.subtitle, { fontSize: fs(15, fontScale) }]}>Outstanding. Consistency is the only variable that heals.</Text>
        <View style={done.grid}>
          {[
            { icon: 'barbell-outline', color: Colors.purple,  value: String(exercises.length), label: 'Exercises' },
            { icon: 'layers-outline',  color: Colors.green,   value: String(totalSets),         label: 'Sets Done' },
            { icon: 'time-outline',    color: Colors.amber,   value: `${totalMin}m`,            label: 'Duration' },
            { icon: 'star-outline',    color: '#F472B6',      value: '100%',                    label: 'Complete' },
          ].map((stat, i) => (
            <View key={i} style={done.card}>
              <View style={[done.icon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={[done.val, { color: stat.color }]}>{stat.value}</Text>
              <Text style={done.lbl}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={done.btn} onPress={onContinue} activeOpacity={0.85}>
          <Ionicons name={isOnboarding ? 'home-outline' : 'arrow-forward'} size={18} color={Colors.white} />
          <Text style={[done.btnText, { fontSize: fs(17, fontScale) }]}>{isOnboarding ? 'Enter Dashboard' : 'Continue'}</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const done = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame:     { width: '100%', alignItems: 'center' },
  ring:      { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.purpleDim, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: Colors.purple + '40' },
  emoji:     { fontSize: 48 },
  title:     { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10, letterSpacing: -0.5 },
  subtitle:  { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 36, width: '100%' },
  card:      { flex: 1, minWidth: '44%', backgroundColor: Colors.bgCard, borderRadius: 18, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border },
  icon:      { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  val:       { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  lbl:       { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  btn:       { width: '100%', backgroundColor: Colors.purple, borderRadius: Radius.lg, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadows.purple },
  btnText:   { fontSize: 17, fontWeight: '700', color: Colors.white },
});

// ─── Draggable exercise list (panel) ─────────────────────────────────────────
function computeDisplayOrder(exercises, from, to) {
  if (from === null || to === null || from === to) {
    return exercises.map((e, i) => ({ exercise: e, idx: i }));
  }
  const arr = exercises.map((e, i) => ({ exercise: e, idx: i }));
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}

function DraggableList({ exercises, exerciseIdx, editMode, onReorder, onJump }) {
  const [draggingFrom, setDraggingFrom] = useState(null);
  const [draggingTo,   setDraggingTo]   = useState(null);
  const fromRef     = useRef(null);
  const toRef       = useRef(null);
  const dragAnimY   = useRef(new Animated.Value(0)).current;
  // Measured row height — falls back to 80 until first row reports its layout.
  // All rows share the same template so a single measurement is enough.
  const rowHeightRef = useRef(80);
  // Keep refs in sync for PanResponder closures
  const exRef     = useRef(exercises);
  const eIdxRef   = useRef(exerciseIdx);
  useEffect(() => { exRef.current = exercises; },    [exercises]);
  useEffect(() => { eIdxRef.current = exerciseIdx; }, [exerciseIdx]);

  function commitReorder() {
    const from = fromRef.current;
    const to   = toRef.current;
    if (from !== null && to !== null && from !== to) {
      onReorder(from, to);
    }
    fromRef.current = null;
    toRef.current   = null;
    dragAnimY.setValue(0);
    setDraggingFrom(null);
    setDraggingTo(null);
  }

  // Build a stable PanResponder for a given item index.
  // Called during render — React Native retains the active responder once a
  // gesture starts, so re-creation between renders is safe.
  function makePanHandlers(itemIdx) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        fromRef.current = itemIdx;
        toRef.current   = itemIdx;
        dragAnimY.setValue(0);
        setDraggingFrom(itemIdx);
        setDraggingTo(itemIdx);
      },
      onPanResponderMove: (_, g) => {
        dragAnimY.setValue(g.dy);
        const minIdx = eIdxRef.current + 1;
        const maxIdx = exRef.current.length - 1;
        const newTo  = Math.max(minIdx, Math.min(maxIdx,
          itemIdx + Math.round(g.dy / rowHeightRef.current)));
        if (newTo !== toRef.current) {
          toRef.current = newTo;
          setDraggingTo(newTo);
        }
      },
      onPanResponderRelease:   commitReorder,
      onPanResponderTerminate: commitReorder,
    }).panHandlers;
  }

  const displayOrder = computeDisplayOrder(exercises, draggingFrom, draggingTo);
  const isDragging   = draggingFrom !== null;

  return (
    <ScrollView
      style={p.list}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!isDragging}
    >
      {displayOrder.map(({ exercise, idx: currentIdx }) => {
        const exPhase      = getPhaseMeta(exercise.phase);
        const isDone       = currentIdx < exerciseIdx;
        const isActive     = currentIdx === exerciseIdx;
        const isDraggingThis = currentIdx === draggingFrom && isDragging;
        const isDropTarget = currentIdx === draggingTo && draggingTo !== draggingFrom;
        const canDrag      = editMode && !isDone && !isActive;

        return (
          <Animated.View
            key={`${exercise.name}-${currentIdx}`}
            onLayout={currentIdx === 0
              ? (e) => { rowHeightRef.current = e.nativeEvent.layout.height; }
              : undefined}
            style={[
              isDraggingThis && {
                transform: [{ translateY: dragAnimY }],
                zIndex: 999,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                p.row,
                isDone        && p.rowDone,
                isActive      && { borderColor: exPhase.color + '50', backgroundColor: exPhase.bg },
                isDraggingThis && p.rowLifted,
                isDropTarget  && p.rowDropTarget,
              ]}
              onPress={() => !editMode && !isDone && !isActive && onJump(currentIdx)}
              activeOpacity={editMode ? 1 : 0.7}
            >
              {/* Number badge */}
              <View style={[
                p.numBadge,
                isDone   && { backgroundColor: Colors.green,  borderColor: Colors.green },
                isActive && { backgroundColor: exPhase.color, borderColor: exPhase.color },
              ]}>
                {isDone
                  ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                  : <Text style={[p.numText, isActive && { color: Colors.white }]}>{currentIdx + 1}</Text>
                }
              </View>

              {/* Info */}
              <View style={p.info}>
                <Text style={[p.name, isDone && p.nameDone]} numberOfLines={1}>
                  {exercise.name}
                </Text>
                <View style={p.meta}>
                  <View style={[p.phasePill, { backgroundColor: exPhase.color + '18', borderColor: exPhase.color + '40' }]}>
                    <Text style={[p.phaseText, { color: exPhase.color }]}>{exPhase.label}</Text>
                  </View>
                  <Text style={p.reps}>{exercise.reps || exercise.duration}</Text>
                </View>
              </View>

              {/* Right side */}
              {canDrag ? (
                // Drag handle — PanResponder attaches here
                <View
                  {...makePanHandlers(currentIdx)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={p.dragHandle}
                >
                  <Ionicons name="reorder-three-outline" size={26} color={isDraggingThis ? exPhase.color : Colors.textMuted} />
                </View>
              ) : isActive ? (
                <View style={[p.nowBadge, { backgroundColor: exPhase.color + '20', borderColor: exPhase.color + '50' }]}>
                  <Text style={[p.nowText, { color: exPhase.color }]}>Now</Text>
                </View>
              ) : !isDone && !editMode ? (
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              ) : null}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const p = StyleSheet.create({
  list:        { paddingHorizontal: 16, paddingTop: 8 },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14, borderRadius: 16, marginVertical: 3, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.bg },
  rowDone:     { opacity: 0.4 },
  rowLifted:   { backgroundColor: Colors.bgCard, borderColor: Colors.purple + '40', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  rowDropTarget: { borderColor: Colors.purple + '70', borderStyle: 'dashed' },
  numBadge:    { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  numText:     { fontSize: 12, fontWeight: '800', color: Colors.textMuted },
  info:        { flex: 1, gap: 4 },
  name:        { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  nameDone:    { textDecorationLine: 'line-through', color: Colors.textMuted },
  meta:        { flexDirection: 'row', alignItems: 'center', gap: 7 },
  phasePill:   { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, borderWidth: 1 },
  phaseText:   { fontSize: 10, fontWeight: '700' },
  reps:        { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  dragHandle:  { paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  nowBadge:    { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  nowText:     { fontSize: 11, fontWeight: '800' },
});

// ─── Main session screen ──────────────────────────────────────────────────────
export default function RecoverySessionScreen({ navigation }) {
  const { onboardingData, isOnboardingComplete, completeOnboarding, installId } = useOnboarding();
  const recordSession = useMutation(api.sessions.recordSession);
  const sessionStartRef = useRef(Date.now());
  const [exercises,     setExercises]     = useState(() => selectExercises(onboardingData));
  const { isSmall, isTablet, horizPad, fontScale, gapScale, width } = useResponsive();
  const frameWidth = Math.min(width - horizPad * 2, 640);
  const animSize = isSmall ? 130 : isTablet ? 200 : 160;
  const sidePad = Math.max(12, horizPad - 4);

  const dyn = {
    frame:        { maxWidth: frameWidth, alignSelf: 'center', width: '100%' },
    header:       { paddingHorizontal: sidePad },
    progressTrack:{ marginHorizontal: sidePad },
    visualCard:   { marginHorizontal: sidePad },
    nameSection:  { paddingHorizontal: horizPad },
    exerciseName: { fontSize: fs(26, fontScale) },
    setsSection:  { paddingHorizontal: sidePad },
    howToSection: { paddingHorizontal: sidePad },
    whyCard:      { marginHorizontal: sidePad },
    footer:       { paddingHorizontal: sidePad },
    restOverlay:  { paddingHorizontal: sidePad },
    panel:        { maxWidth: isTablet ? 640 : '100%', alignSelf: 'center', width: '100%' },
    nextBtnText:  { fontSize: fs(17, fontScale) },
    headerTitle:  { fontSize: fs(15, fontScale) },
  };

  const [exerciseIdx,   setExerciseIdx]   = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [sessionDone,   setSessionDone]   = useState(false);

  // Rest timer
  const [resting,     setResting]     = useState(false);
  const [restSec,     setRestSec]     = useState(0);
  const [restInitial, setRestInitial] = useState(0);
  const [restAfter,   setRestAfter]   = useState('set');

  // Per-set timer (timed exercises)
  const [setTimer, setSetTimer] = useState(null);

  // UI
  const [howToOpen,    setHowToOpen]    = useState(false);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [editMode,     setEditMode]     = useState(false);

  const restRef  = useRef(null);
  const timerRef = useRef(null);

  const ex    = exercises[exerciseIdx];
  const p2    = ex ? parseExercise(ex) : null;
  const phase = ex ? getPhaseMeta(ex.phase) : PhasePalette.Mobility;

  const currentSetIdx  = setsCompleted;
  const allSetsDone    = p2 ? setsCompleted >= p2.sets : false;
  const isLastExercise = exerciseIdx >= exercises.length - 1;
  const rawProgress    = exercises.length > 0
    ? (exerciseIdx + (p2 ? setsCompleted / Math.max(p2.sets, 1) : 0)) / exercises.length
    : 0;

  // Rest timer tick
  useEffect(() => {
    if (!resting) return;
    restRef.current = setInterval(() => {
      setRestSec(s => {
        if (s <= 1) { clearInterval(restRef.current); endRest(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(restRef.current);
  }, [resting]);

  // Set timer tick
  useEffect(() => {
    if (!setTimer?.running) return;
    timerRef.current = setInterval(() => {
      setSetTimer(t => {
        if (!t || t.sec <= 1) { clearInterval(timerRef.current); return { ...t, sec: 0, running: false }; }
        return { ...t, sec: t.sec - 1 };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [setTimer?.running]);

  function startRest(seconds, after) {
    clearInterval(restRef.current);
    setRestSec(seconds);
    setRestInitial(seconds);
    setRestAfter(after);
    setResting(true);
  }

  function endRest() {
    setResting(false);
    if (restAfter === 'exercise') advanceExercise();
  }

  function skipRest() { clearInterval(restRef.current); endRest(); }

  function addRestTime() {
    setRestSec(s => s + 15);
    setRestInitial(prev => prev + 15);
  }

  function advanceExercise() {
    setExerciseIdx(i => i + 1);
    setSetsCompleted(0);
    setHowToOpen(false);
    setSetTimer(null);
  }

  function completeSet(setIdx) {
    if (setIdx !== currentSetIdx || resting) return;
    clearInterval(timerRef.current);
    setSetTimer(null);
    const newCompleted = setsCompleted + 1;
    setSetsCompleted(newCompleted);
    if (newCompleted >= p2.sets) {
      if (isLastExercise) { finishSession(); }
      else { startRest(60, 'exercise'); }
    } else {
      startRest(30, 'set');
    }
  }

  function startSetTimer() {
    if (!p2?.timerSeconds) return;
    setSetTimer({ sec: p2.timerSeconds, initial: p2.timerSeconds, running: true });
  }

  function handleReorder(from, to) {
    setExercises(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  function finishSession() {
    setSessionDone(true);
    if (installId) {
      const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000));
      recordSession({
        installId,
        date: new Date().toISOString().slice(0, 10),
        exerciseNames: exercises.map((e) => e.name),
        durationMinutes,
        completed: true,
      }).catch((e) => console.error('[RecoverySessionScreen] Failed to record session:', e));
    }
  }

  function jumpToExercise(i) {
    clearInterval(restRef.current);
    clearInterval(timerRef.current);
    setExerciseIdx(i);
    setSetsCompleted(0);
    setHowToOpen(false);
    setSetTimer(null);
    setResting(false);
    setUpcomingOpen(false);
    setEditMode(false);
  }

  if (sessionDone) {
    return (
      <DoneScreen
        exercises={exercises}
        isOnboarding={!isOnboardingComplete}
        onContinue={() => {
          if (!isOnboardingComplete) {
            completeOnboarding();
          } else {
            navigation.goBack();
          }
        }}
      />
    );
  }

  if (!ex || !p2) return null;

  const nextEx      = exercises[exerciseIdx + 1];
  const restElapsed = restInitial > 0 ? (restInitial - restSec) / restInitial : 0;

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={[s.header, dyn.header]}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, dyn.headerTitle]} numberOfLines={1}>{ex.name}</Text>
          <Text style={s.headerSub}>Exercise {exerciseIdx + 1} of {exercises.length}</Text>
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={() => setUpcomingOpen(true)} activeOpacity={0.75}>
          <Ionicons name="list-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={[s.progressTrack, dyn.progressTrack]}>
        <View style={[s.progressFill, { width: `${rawProgress * 100}%`, backgroundColor: phase.color }]} />
      </View>

      {/* Scrollable body */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>

        {/* Exercise visual — animated humanoid */}
        <View style={[s.visualCard, dyn.visualCard, { backgroundColor: phase.bg }]}>
          <ExerciseAnimation exercise={ex} color={phase.color} size={animSize} />
          <View style={[s.phasePill, { backgroundColor: phase.color + '22', borderColor: phase.color + '60' }]}>
            <Ionicons name={phase.icon} size={11} color={phase.color} />
            <Text style={[s.phasePillText, { color: phase.color }]}>{phase.label}</Text>
          </View>
          <Text style={s.visualFocus}>{ex.focus}</Text>
        </View>

        {/* Name + meta */}
        <View style={[s.nameSection, dyn.nameSection]}>
          <Text style={[s.exerciseName, dyn.exerciseName]}>{ex.name}</Text>
          <View style={s.metaRow}>
            <View style={s.metaChip}>
              <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
              <Text style={s.metaChipText}>{ex.duration}</Text>
            </View>
            <View style={s.metaChip}>
              <Ionicons name="layers-outline" size={13} color={Colors.textMuted} />
              <Text style={s.metaChipText}>{p2.sets} {p2.sets === 1 ? 'set' : 'sets'}</Text>
            </View>
            {p2.isTimed && (
              <View style={s.metaChip}>
                <Ionicons name="stopwatch-outline" size={13} color={Colors.textMuted} />
                <Text style={s.metaChipText}>Timed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sets */}
        <View style={[s.setsSection, dyn.setsSection]}>
          <Text style={s.setsSectionLabel}>SETS</Text>
          {Array.from({ length: p2.sets }).map((_, i) => {
            const isDone    = i < setsCompleted;
            const isCurrent = i === currentSetIdx && !allSetsDone;
            const isTodo    = !isDone && !isCurrent;
            return (
              <View
                key={i}
                style={[
                  s.setRow,
                  isDone    && s.setRowDone,
                  isCurrent && [s.setRowActive, { borderColor: phase.color + '60', backgroundColor: phase.bg }],
                ]}
              >
                <View style={[
                  s.setNum,
                  isDone    && { backgroundColor: Colors.green,  borderColor: Colors.green },
                  isCurrent && { backgroundColor: phase.color,   borderColor: phase.color },
                  isTodo    && { backgroundColor: Colors.bgElevated, borderColor: Colors.border },
                ]}>
                  {isDone
                    ? <Ionicons name="checkmark" size={14} color={Colors.white} />
                    : <Text style={[s.setNumText, isCurrent && { color: Colors.white }, isTodo && { color: Colors.textDisabled }]}>
                        {i + 1}
                      </Text>
                  }
                </View>
                <View style={s.setInfo}>
                  <Text style={[s.setTarget, isDone && { color: Colors.textMuted }]}>{p2.repsLabel}</Text>
                  <Text style={[s.setSubLabel, isCurrent && { color: phase.color }]}>
                    {isDone ? 'Completed' : isCurrent ? (p2.isTimed ? 'Tap Start to begin' : 'Your turn') : `Set ${i + 1}`}
                  </Text>
                </View>
                {isDone && <Ionicons name="checkmark-circle" size={30} color={Colors.green} />}
                {isCurrent && !p2.isTimed && (
                  <TouchableOpacity style={[s.doneCircle, { borderColor: phase.color }]} onPress={() => completeSet(i)} activeOpacity={0.7}>
                    <Ionicons name="checkmark" size={22} color={phase.color} />
                  </TouchableOpacity>
                )}
                {isCurrent && p2.isTimed && (
                  <View style={s.timedRight}>
                    {!setTimer ? (
                      <TouchableOpacity
                        style={[s.startTimerBtn, { backgroundColor: phase.color + '20', borderColor: phase.color + '50' }]}
                        onPress={startSetTimer}
                      >
                        <Ionicons name="play" size={14} color={phase.color} />
                        <Text style={[s.startTimerText, { color: phase.color }]}>Start</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={s.inlineTimer}>
                        <Text style={[s.inlineTimerTime, { color: setTimer.sec === 0 ? Colors.green : phase.color }]}>
                          {formatTime(setTimer.sec)}
                        </Text>
                        <TouchableOpacity
                          style={[s.timerCtrl, { backgroundColor: phase.color }]}
                          onPress={
                            setTimer.sec === 0
                              ? () => completeSet(i)
                              : setTimer.running
                                ? () => { clearInterval(timerRef.current); setSetTimer(t => ({ ...t, running: false })); }
                                : () => setSetTimer(t => ({ ...t, running: true }))
                          }
                        >
                          <Ionicons name={setTimer.sec === 0 ? 'checkmark' : setTimer.running ? 'pause' : 'play'} size={14} color={Colors.white} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                {isTodo && <View style={s.todoCircle} />}
              </View>
            );
          })}
        </View>

        {/* How to */}
        <View style={[s.howToSection, dyn.howToSection]}>
          <TouchableOpacity style={s.howToHeader} onPress={() => setHowToOpen(v => !v)} activeOpacity={0.75}>
            <View style={s.howToLeft}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.purple} />
              <Text style={s.howToTitle}>How to do it</Text>
            </View>
            <Ionicons name={howToOpen ? 'chevron-up' : 'chevron-down'} size={15} color={Colors.textMuted} />
          </TouchableOpacity>
          {howToOpen && ex.howTo && (
            <View style={s.howToBody}>
              <Text style={s.howToText}>{ex.howTo}</Text>
            </View>
          )}
        </View>

        {/* Why */}
        {ex.why && (
          <View style={[s.whyCard, dyn.whyCard]}>
            <Ionicons name="bulb-outline" size={15} color={Colors.amber} style={{ marginTop: 1 }} />
            <Text style={s.whyText}>{ex.why}</Text>
          </View>
        )}

        <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      {/* Persistent action footer — always visible */}
      {!resting && (
        <View style={[s.footer, dyn.footer]}>
          <View style={dyn.frame}>
          {!allSetsDone ? (
            p2.isTimed ? (
              !setTimer ? (
                <TouchableOpacity style={[s.nextBtn, { backgroundColor: phase.color }]} onPress={startSetTimer} activeOpacity={0.85}>
                  <Ionicons name="timer-outline" size={20} color={Colors.white} />
                  <Text style={[s.nextBtnText, dyn.nextBtnText]}>Start Timer · Set {currentSetIdx + 1} of {p2.sets}</Text>
                </TouchableOpacity>
              ) : setTimer.sec === 0 ? (
                <TouchableOpacity style={[s.nextBtn, { backgroundColor: Colors.green }]} onPress={() => completeSet(currentSetIdx)} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                  <Text style={[s.nextBtnText, dyn.nextBtnText]}>Done · Set {currentSetIdx + 1} of {p2.sets}</Text>
                </TouchableOpacity>
              ) : (
                <View style={[s.nextBtn, { backgroundColor: phase.color + '28', borderWidth: 1.5, borderColor: phase.color + '60' }]}>
                  <Ionicons name="timer-outline" size={18} color={phase.color} />
                  <Text style={[s.nextBtnText, dyn.nextBtnText, { color: phase.color }]}>{formatTime(setTimer.sec)} · Set {currentSetIdx + 1}</Text>
                </View>
              )
            ) : (
              <TouchableOpacity style={[s.nextBtn, { backgroundColor: phase.color }]} onPress={() => completeSet(currentSetIdx)} activeOpacity={0.85}>
                <Ionicons name="checkmark" size={20} color={Colors.white} />
                <Text style={[s.nextBtnText, dyn.nextBtnText]}>Done · Set {currentSetIdx + 1} of {p2.sets}</Text>
              </TouchableOpacity>
            )
          ) : isLastExercise ? (
            <TouchableOpacity style={[s.nextBtn, { backgroundColor: Colors.green }]} onPress={finishSession} activeOpacity={0.85}>
              <Ionicons name="star" size={20} color={Colors.white} />
              <Text style={[s.nextBtnText, dyn.nextBtnText]}>Complete Session</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[s.nextBtn, { backgroundColor: phase.color }]} onPress={() => startRest(60, 'exercise')} activeOpacity={0.85}>
              <Text style={[s.nextBtnText, dyn.nextBtnText]}>Next Exercise</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
          </View>
        </View>
      )}

      {/* Rest overlay */}
      {resting && (
        <View style={[s.restOverlay, dyn.restOverlay]}>
          <View style={[s.restCard, dyn.frame]}>
            <View style={s.restTopRow}>
              <View style={s.restBadge}>
                <Ionicons name="leaf-outline" size={12} color={Colors.green} />
                <Text style={s.restBadgeText}>REST TIME</Text>
              </View>
              <Text style={s.restCountdown}>{formatTime(restSec)}</Text>
            </View>
            <View style={s.restTrack}>
              <View style={[s.restFill, { width: `${(1 - restElapsed) * 100}%` }]} />
            </View>
            {restAfter === 'exercise' && nextEx ? (
              <Text style={s.restNextLabel}>Up Next: <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>{nextEx.name}</Text></Text>
            ) : restAfter === 'set' ? (
              <Text style={s.restNextLabel}>Up Next: <Text style={{ color: phase.color, fontWeight: '700' }}>Set {setsCompleted + 1}</Text> of {p2.sets}</Text>
            ) : null}
            <View style={s.restBtns}>
              <TouchableOpacity style={s.addTimeBtn} onPress={addRestTime} activeOpacity={0.8}>
                <Ionicons name="add" size={16} color={Colors.textSecondary} />
                <Text style={s.addTimeText}>+15s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.skipBtn} onPress={skipRest} activeOpacity={0.85}>
                <Text style={s.skipBtnText}>Skip Rest</Text>
                <Ionicons name="arrow-forward" size={15} color={Colors.green} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Upcoming exercises panel */}
      <Modal
        visible={upcomingOpen}
        transparent
        animationType="slide"
        onRequestClose={() => { setUpcomingOpen(false); setEditMode(false); }}
      >
        <TouchableOpacity
          style={s.backdrop}
          activeOpacity={1}
          onPress={() => { if (!editMode) { setUpcomingOpen(false); setEditMode(false); } }}
        >
          <View style={[s.panel, dyn.panel]} onStartShouldSetResponder={() => true}>
            <View style={s.panelHandle} />

            <View style={s.panelHeader}>
              <Text style={s.panelTitle}>All Exercises</Text>
              <View style={s.panelHeaderRight}>
                <TouchableOpacity
                  style={[s.editBtn, editMode && s.editBtnActive]}
                  onPress={() => setEditMode(v => !v)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={editMode ? 'checkmark' : 'pencil-outline'}
                    size={13}
                    color={editMode ? Colors.green : Colors.textSecondary}
                  />
                  <Text style={[s.editBtnText, editMode && { color: Colors.green }]}>
                    {editMode ? 'Done' : 'Reorder'}
                  </Text>
                </TouchableOpacity>
                {!editMode && (
                  <TouchableOpacity style={s.closeBtn} onPress={() => setUpcomingOpen(false)}>
                    <Ionicons name="close" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {editMode && (
              <View style={s.dragHint}>
                <Ionicons name="reorder-three-outline" size={14} color={Colors.textMuted} />
                <Text style={s.dragHintText}>Hold and drag the handle to reorder upcoming exercises</Text>
              </View>
            )}

            <DraggableList
              exercises={exercises}
              exerciseIdx={exerciseIdx}
              editMode={editMode}
              onReorder={handleReorder}
              onJump={jumpToExercise}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  frame:     { width: '100%', alignSelf: 'center' },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  iconBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.2 },
  headerSub:    { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginTop: 1 },

  // Progress
  progressTrack: { height: 3, backgroundColor: Colors.border, marginHorizontal: 16, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  progressFill:  { height: '100%', borderRadius: 2 },

  // Exercise visual
  visualCard:    { marginHorizontal: 16, marginTop: 12, borderRadius: 24, paddingTop: 20, paddingBottom: 16, paddingHorizontal: 16, alignItems: 'center', gap: 10 },
  phasePill:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  phasePillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  visualFocus:   { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },

  // Name section
  nameSection:  { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  exerciseName: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5, marginBottom: 10 },
  metaRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.bgCard, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border },
  metaChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

  // Sets
  setsSection:      { paddingHorizontal: 16, paddingTop: 20 },
  setsSectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
  setRow:       { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.bgCard, borderRadius: 18, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  setRowDone:   { opacity: 0.5 },
  setRowActive: { borderWidth: 1.5 },
  setNum:       { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, flexShrink: 0 },
  setNumText:   { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  setInfo:      { flex: 1, gap: 3 },
  setTarget:    { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  setSubLabel:  { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  doneCircle:   { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  todoCircle:   { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgElevated },
  timedRight:     { alignItems: 'flex-end', gap: 6 },
  startTimerBtn:  { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1 },
  startTimerText: { fontSize: 13, fontWeight: '700' },
  inlineTimer:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineTimerTime:{ fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  timerCtrl:      { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  // How to
  howToSection: { paddingHorizontal: 16, paddingTop: 16 },
  howToHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.bgCard, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: Colors.border },
  howToLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  howToTitle:   { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  howToBody:    { backgroundColor: Colors.bgInput, borderRadius: 12, padding: 16, marginTop: 4, borderWidth: 1, borderColor: Colors.borderSubtle },
  howToText:    { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },

  // Why
  whyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 16, marginTop: 10, backgroundColor: Colors.amber + '10', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.amber + '30' },
  whyText: { flex: 1, fontSize: 13, color: Colors.amber, lineHeight: 20 },

  // Footer
  footer:      { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8 },
  nextBtn:     { borderRadius: Radius.lg, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  nextBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },

  // Rest overlay
  restOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 20, paddingTop: 8 },
  restCard:    { backgroundColor: Colors.bgCard, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: Colors.green + '40', gap: 12, ...Shadows.card },
  restTopRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  restBadge:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.green + '18', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.green + '40' },
  restBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.green, letterSpacing: 1 },
  restCountdown: { fontSize: 36, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1.5 },
  restTrack:     { height: 6, backgroundColor: Colors.bgElevated, borderRadius: 3, overflow: 'hidden' },
  restFill:      { height: '100%', backgroundColor: Colors.green, borderRadius: 3 },
  restNextLabel: { fontSize: 13, color: Colors.textSecondary },
  restBtns:      { flexDirection: 'row', gap: 10 },
  addTimeBtn:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border },
  addTimeText:   { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  skipBtn:       { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.green + '18', borderWidth: 1, borderColor: Colors.green + '50' },
  skipBtnText:   { fontSize: 14, fontWeight: '700', color: Colors.green },

  // Panel (Modal)
  backdrop:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  panel:          { backgroundColor: Colors.bgCard, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, maxHeight: '80%', borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.border },
  panelHandle:    { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
  panelHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  panelTitle:     { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  panelHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editBtn:        { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 12, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border },
  editBtnActive:  { borderColor: Colors.green + '60', backgroundColor: Colors.green + '12' },
  editBtnText:    { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  closeBtn:       { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bgInput, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  dragHint:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.bgInput, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  dragHintText:   { fontSize: 11, color: Colors.textMuted, flex: 1 },
});
