/**
 * Day1ProtocolScreen — Step 6 of onboarding
 *
 * Shows the user their first 3–4 exercises immediately, with clear
 * instructions. This is the "prove the value before the paywall" moment.
 * The user sees exactly what they're getting before being asked to pay.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

// ─── Exercise library ─────────────────────────────────────────────────────────
// Keyed by pain location. Each exercise has name, duration, reps, how-to, and focus.
const EXERCISE_LIBRARY = {
  'lower back': [
    {
      name: 'Glute Bridge',
      duration: '2 min',
      reps: '3 × 10 reps',
      focus: 'Glute activation',
      icon: 'body-outline',
      howTo: 'Lie on your back, knees bent, feet flat. Drive hips up squeezing your glutes at the top. Hold 2 seconds, lower slowly.',
      why: 'Weak glutes are the #1 driver of lower back pain. This reactivates them.',
    },
    {
      name: 'Cat-Cow Stretch',
      duration: '2 min',
      reps: '10 slow cycles',
      focus: 'Spinal mobility',
      icon: 'sync-outline',
      howTo: 'On hands and knees. Inhale and arch your back (cow). Exhale and round it (cat). Move slowly, breathe through it.',
      why: 'Restores natural spinal movement and pumps fluid into compressed discs.',
    },
    {
      name: 'Hip Flexor Stretch',
      duration: '2 min',
      reps: '45 sec each side',
      focus: 'Hip mobility',
      icon: 'fitness-outline',
      howTo: 'Lunge position, back knee on floor. Push hips forward gently until you feel a stretch in the front of the back hip. Keep upright.',
      why: 'Tight hip flexors from sitting pull the lower back into compression all day.',
    },
  ],
  'upper back': [
    {
      name: 'Thoracic Extension',
      duration: '2 min',
      reps: '10 reps',
      focus: 'Upper spine mobility',
      icon: 'chevron-up-outline',
      howTo: 'Sit in a chair, hands behind your head. Gently extend back over the chair\'s top edge. Hold 3 seconds, repeat.',
      why: 'Unlocks the thoracic spine that\'s been flexed forward all day — instant relief.',
    },
    {
      name: 'Doorway Chest Stretch',
      duration: '2 min',
      reps: '30 sec × 3',
      focus: 'Chest opening',
      icon: 'expand-outline',
      howTo: 'Stand in a doorway, arms at 90°, forearms on the frame. Lean forward gently until you feel your chest open. Breathe deeply.',
      why: 'Tight pecs pull shoulders forward and compress your upper back all day.',
    },
    {
      name: 'Band Pull-Apart (or arm sweep)',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'Scapular strength',
      icon: 'barbell-outline',
      howTo: 'Hold arms forward at shoulder height. Sweep both arms out to the sides, squeezing your shoulder blades together. Return slowly.',
      why: 'Strengthens the muscles that hold your shoulders back — the antidote to desk posture.',
    },
  ],
  'neck': [
    {
      name: 'Chin Tuck',
      duration: '2 min',
      reps: '3 × 10 reps',
      focus: 'Cervical alignment',
      icon: 'arrow-back-outline',
      howTo: 'Sitting or standing. Gently draw your chin straight back (not down) making a "double chin". Hold 3 seconds. Release.',
      why: 'Resets forward head posture — for every inch forward your head sits, load on your neck doubles.',
    },
    {
      name: 'Neck Side Stretch',
      duration: '2 min',
      reps: '30 sec each side',
      focus: 'Neck mobility',
      icon: 'swap-horizontal-outline',
      howTo: 'Sit tall. Drop one ear toward your shoulder. Place same-side hand gently on your head for light over-pressure. Breathe and let go.',
      why: 'Releases the scalenes and upper trapezius — the muscles most overloaded from screen time.',
    },
    {
      name: 'Suboccipital Release',
      duration: '2 min',
      reps: '60 seconds',
      focus: 'Base-of-skull tension',
      icon: 'ellipse-outline',
      howTo: 'Interlace fingers behind your head at the base of your skull. Apply gentle upward traction while tucking your chin. Hold and breathe.',
      why: 'Releases the small muscles at the base of your skull — the source of tension headaches.',
    },
  ],
  'left shoulder': [
    {
      name: 'Pendulum Swing',
      duration: '2 min',
      reps: '20 circles each way',
      focus: 'Joint decompression',
      icon: 'sync-circle-outline',
      howTo: 'Lean forward supporting yourself with one hand. Let the other arm hang and swing it in small circles — letting gravity do the work.',
      why: 'Creates gentle traction in the shoulder joint, reducing compression and irritation.',
    },
    {
      name: 'Wall Slide',
      duration: '2 min',
      reps: '3 × 10 reps',
      focus: 'Shoulder mobility',
      icon: 'trending-up-outline',
      howTo: 'Stand with back against wall, arms bent at 90°. Slowly slide arms overhead keeping contact with the wall. Return slowly.',
      why: 'Restores overhead mobility and activates the lower trapezius — key for shoulder health.',
    },
    {
      name: 'Sleeper Stretch',
      duration: '2 min',
      reps: '30 sec × 3',
      focus: 'Posterior capsule',
      icon: 'bed-outline',
      howTo: 'Lie on the affected side, arm out at 90°. Use your other hand to gently press your forearm down toward the floor.',
      why: 'Stretches the tight posterior capsule — the most common stiffness driver in shoulder pain.',
    },
  ],
  'right shoulder': [
    {
      name: 'Pendulum Swing',
      duration: '2 min',
      reps: '20 circles each way',
      focus: 'Joint decompression',
      icon: 'sync-circle-outline',
      howTo: 'Lean forward supporting yourself with one hand. Let the other arm hang and swing it in small circles — letting gravity do the work.',
      why: 'Creates gentle traction in the shoulder joint, reducing compression and irritation.',
    },
    {
      name: 'Wall Slide',
      duration: '2 min',
      reps: '3 × 10 reps',
      focus: 'Shoulder mobility',
      icon: 'trending-up-outline',
      howTo: 'Stand with back against wall, arms bent at 90°. Slowly slide arms overhead keeping contact with the wall. Return slowly.',
      why: 'Restores overhead mobility and activates the lower trapezius — key for shoulder health.',
    },
    {
      name: 'Sleeper Stretch',
      duration: '2 min',
      reps: '30 sec × 3',
      focus: 'Posterior capsule',
      icon: 'bed-outline',
      howTo: 'Lie on the affected side, arm out at 90°. Use your other hand to gently press your forearm down toward the floor.',
      why: 'Stretches the tight posterior capsule — the most common stiffness driver in shoulder pain.',
    },
  ],
  'left knee': [
    {
      name: 'Terminal Knee Extension',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'VMO activation',
      icon: 'fitness-outline',
      howTo: 'Stand with slight knee bend. Straighten the knee fully, squeezing the quad at the end range. Hold 2 sec, release slowly.',
      why: 'Activates the VMO (inner quad) — the muscle most responsible for stable kneecap tracking.',
    },
    {
      name: 'Clamshell',
      duration: '2 min',
      reps: '3 × 12 each side',
      focus: 'Hip abductor strength',
      icon: 'body-outline',
      howTo: 'Lie on your side, knees bent. Keeping feet together, open your top knee like a clamshell. Hold 2 sec, lower slowly.',
      why: 'Hip abductor weakness is a major driver of knee pain — this fixes the root cause.',
    },
    {
      name: 'Quad Stretch',
      duration: '2 min',
      reps: '45 sec each leg',
      focus: 'Quad flexibility',
      icon: 'walk-outline',
      howTo: 'Stand on one leg, pull the other foot toward your glutes. Keep knees together, stand tall. Hold and breathe.',
      why: 'Tight quads pull the kneecap up and compress the joint — releasing them gives immediate relief.',
    },
  ],
  'right knee': [
    {
      name: 'Terminal Knee Extension',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'VMO activation',
      icon: 'fitness-outline',
      howTo: 'Stand with slight knee bend. Straighten the knee fully, squeezing the quad at the end range. Hold 2 sec, release slowly.',
      why: 'Activates the VMO (inner quad) — the muscle most responsible for stable kneecap tracking.',
    },
    {
      name: 'Clamshell',
      duration: '2 min',
      reps: '3 × 12 each side',
      focus: 'Hip abductor strength',
      icon: 'body-outline',
      howTo: 'Lie on your side, knees bent. Keeping feet together, open your top knee like a clamshell. Hold 2 sec, lower slowly.',
      why: 'Hip abductor weakness is a major driver of knee pain — this fixes the root cause.',
    },
    {
      name: 'Quad Stretch',
      duration: '2 min',
      reps: '45 sec each leg',
      focus: 'Quad flexibility',
      icon: 'walk-outline',
      howTo: 'Stand on one leg, pull the other foot toward your glutes. Keep knees together, stand tall. Hold and breathe.',
      why: 'Tight quads pull the kneecap up and compress the joint — releasing them gives immediate relief.',
    },
  ],
  'left ankle': [
    {
      name: 'Ankle Circles',
      duration: '2 min',
      reps: '15 circles each direction',
      focus: 'Joint mobility',
      icon: 'sync-outline',
      howTo: 'Seated or standing. Lift one foot slightly and draw large circles with your toes — clockwise then counter-clockwise.',
      why: 'Restores ankle range of motion and reduces stiffness from compression.',
    },
    {
      name: 'Calf Raise',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'Calf strengthening',
      icon: 'trending-up-outline',
      howTo: 'Stand at a wall for support. Rise up on your toes slowly, hold 1 second at the top, lower for 3 counts.',
      why: 'Strengthens the calf-Achilles complex — the primary stabilizer of the ankle.',
    },
    {
      name: 'Banded Dorsiflexion',
      duration: '2 min',
      reps: '2 min each ankle',
      focus: 'Ankle flexibility',
      icon: 'arrow-up-outline',
      howTo: 'In a lunge, drive your front knee forward over your toes without lifting your heel. Feel the stretch in your ankle. Hold and breathe.',
      why: 'Ankle stiffness (poor dorsiflexion) forces compensation up the chain — knees, hips, and back all suffer.',
    },
  ],
  'right ankle': [
    {
      name: 'Ankle Circles',
      duration: '2 min',
      reps: '15 circles each direction',
      focus: 'Joint mobility',
      icon: 'sync-outline',
      howTo: 'Seated or standing. Lift one foot slightly and draw large circles with your toes — clockwise then counter-clockwise.',
      why: 'Restores ankle range of motion and reduces stiffness from compression.',
    },
    {
      name: 'Calf Raise',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'Calf strengthening',
      icon: 'trending-up-outline',
      howTo: 'Stand at a wall for support. Rise up on your toes slowly, hold 1 second at the top, lower for 3 counts.',
      why: 'Strengthens the calf-Achilles complex — the primary stabilizer of the ankle.',
    },
    {
      name: 'Banded Dorsiflexion',
      duration: '2 min',
      reps: '2 min each ankle',
      focus: 'Ankle flexibility',
      icon: 'arrow-up-outline',
      howTo: 'In a lunge, drive your front knee forward over your toes without lifting your heel. Feel the stretch in your ankle. Hold and breathe.',
      why: 'Ankle stiffness (poor dorsiflexion) forces compensation up the chain — knees, hips, and back all suffer.',
    },
  ],
  'left calf': [
    {
      name: 'Standing Calf Stretch',
      duration: '2 min',
      reps: '45 sec × 2 each leg',
      focus: 'Calf flexibility',
      icon: 'walk-outline',
      howTo: 'Step one foot back, press heel firmly into the ground with a slight knee bend (for soleus). Hold, breathe, release.',
      why: 'Stretches both the gastrocnemius and soleus — the two muscles most involved in shin splints.',
    },
    {
      name: 'Eccentric Heel Drop',
      duration: '3 min',
      reps: '3 × 15 slow reps',
      focus: 'Tendon loading',
      icon: 'trending-down-outline',
      howTo: 'Stand with toes on a step edge. Rise onto toes with both feet. Lower yourself slowly on just the painful leg. Use rail for balance.',
      why: 'Eccentric loading is the gold standard for healing shin splints and Achilles irritation.',
    },
    {
      name: 'Foam Roll Calves',
      duration: '2 min',
      reps: '60 sec each leg',
      focus: 'Tissue release',
      icon: 'radio-button-on-outline',
      howTo: 'Sit on the floor, place a foam roller under your calves. Shift weight and roll slowly from ankle to just below the knee. Pause on tender spots.',
      why: 'Releases fascial restriction and improves blood flow to overloaded calf tissue.',
    },
  ],
  'right calf': [
    {
      name: 'Standing Calf Stretch',
      duration: '2 min',
      reps: '45 sec × 2 each leg',
      focus: 'Calf flexibility',
      icon: 'walk-outline',
      howTo: 'Step one foot back, press heel firmly into the ground with a slight knee bend (for soleus). Hold, breathe, release.',
      why: 'Stretches both the gastrocnemius and soleus — the two muscles most involved in shin splints.',
    },
    {
      name: 'Eccentric Heel Drop',
      duration: '3 min',
      reps: '3 × 15 slow reps',
      focus: 'Tendon loading',
      icon: 'trending-down-outline',
      howTo: 'Stand with toes on a step edge. Rise onto toes with both feet. Lower yourself slowly on just the painful leg. Use rail for balance.',
      why: 'Eccentric loading is the gold standard for healing shin splints and Achilles irritation.',
    },
    {
      name: 'Foam Roll Calves',
      duration: '2 min',
      reps: '60 sec each leg',
      focus: 'Tissue release',
      icon: 'radio-button-on-outline',
      howTo: 'Sit on the floor, place a foam roller under your calves. Shift weight and roll slowly from ankle to just below the knee. Pause on tender spots.',
      why: 'Releases fascial restriction and improves blood flow to overloaded calf tissue.',
    },
  ],
  default: [
    {
      name: 'Child\'s Pose',
      duration: '2 min',
      reps: '60 seconds',
      focus: 'Full back release',
      icon: 'body-outline',
      howTo: 'Kneel, sit back on your heels, reach arms forward and rest forehead on the floor. Let your entire back relax. Breathe slowly.',
      why: 'Decompresses the entire spine and releases tension from the posterior chain.',
    },
    {
      name: 'Dead Bug',
      duration: '2 min',
      reps: '3 × 8 reps each side',
      focus: 'Core stability',
      icon: 'git-compare-outline',
      howTo: 'Lie on back, arms up, knees at 90°. Slowly lower opposite arm and leg toward the floor without letting your back arch. Return.',
      why: 'Builds deep core stability that protects every joint in your body during movement.',
    },
    {
      name: 'World\'s Greatest Stretch',
      duration: '3 min',
      reps: '5 reps each side',
      focus: 'Full-body mobility',
      icon: 'globe-outline',
      howTo: 'From a lunge, place the same hand as your front foot on the ground. Rotate your other arm up toward the ceiling following with your eyes.',
      why: 'Opens hips, thoracic spine, and shoulders simultaneously — the most efficient mobility exercise.',
    },
  ],
};

const getExercises = (painLocations) => {
  const loc = painLocations[0] || 'default';
  return EXERCISE_LIBRARY[loc] || EXERCISE_LIBRARY['default'];
};

// ─── Exercise Card ────────────────────────────────────────────────────────────
function ExerciseCard({ exercise, index, isExpanded, onToggle, isCompleted, onComplete }) {
  return (
    <View style={[cardStyles.card, isCompleted && cardStyles.cardDone]}>
      {/* Header row */}
      <TouchableOpacity style={cardStyles.header} onPress={onToggle} activeOpacity={0.8}>
        <View style={[cardStyles.number, isCompleted && cardStyles.numberDone]}>
          {isCompleted
            ? <Ionicons name="checkmark" size={14} color="#0E1625" />
            : <Text style={cardStyles.numberText}>{index + 1}</Text>
          }
        </View>
        <View style={cardStyles.headerInfo}>
          <Text style={[cardStyles.name, isCompleted && cardStyles.nameDone]}>{exercise.name}</Text>
          <View style={cardStyles.tags}>
            <View style={cardStyles.tag}>
              <Ionicons name="time-outline" size={11} color="#5B8DFF" />
              <Text style={cardStyles.tagText}>{exercise.duration}</Text>
            </View>
            <View style={cardStyles.tag}>
              <Ionicons name="repeat-outline" size={11} color="#5B8DFF" />
              <Text style={cardStyles.tagText}>{exercise.reps}</Text>
            </View>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#4A5A72"
        />
      </TouchableOpacity>

      {/* Expandable how-to */}
      {isExpanded && (
        <View style={cardStyles.body}>
          <View style={cardStyles.focusBadge}>
            <Text style={cardStyles.focusText}>{exercise.focus}</Text>
          </View>
          <Text style={cardStyles.howToLabel}>How to do it</Text>
          <Text style={cardStyles.howToText}>{exercise.howTo}</Text>
          <View style={cardStyles.whyBox}>
            <Ionicons name="bulb-outline" size={14} color="#F4A426" style={{ marginRight: 6 }} />
            <Text style={cardStyles.whyText}>{exercise.why}</Text>
          </View>
          {!isCompleted && (
            <TouchableOpacity style={cardStyles.doneButton} onPress={onComplete} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#0E1625" />
              <Text style={cardStyles.doneButtonText}>Mark as done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Day1ProtocolScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const exercises = getExercises(onboardingData.painLocations || []);
  const [expanded, setExpanded] = useState(0);
  const [completed, setCompleted] = useState([]);

  const toggleExpand = (i) => setExpanded(expanded === i ? null : i);
  const markDone = (i) => {
    if (!completed.includes(i)) {
      setCompleted([...completed, i]);
      // Auto-expand next exercise
      if (i + 1 < exercises.length) setExpanded(i + 1);
    }
  };

  const totalMinutes = exercises.reduce((sum, e) => sum + parseInt(e.duration), 0);
  const allDone = completed.length === exercises.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progress */}
      <View style={styles.progressHeader}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '95%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Ionicons name="today-outline" size={16} color="#5B8DFF" />
            <Text style={styles.headerBadgeText}>Day 1 Protocol</Text>
          </View>
          <Text style={styles.title}>Your first session</Text>
          <Text style={styles.subtitle}>
            3 targeted exercises · {totalMinutes} minutes · No equipment needed
          </Text>
        </View>

        {/* Progress bar for exercises */}
        <View style={styles.sessionProgress}>
          <Text style={styles.sessionProgressText}>
            {completed.length} of {exercises.length} completed
          </Text>
          <View style={styles.sessionProgressBar}>
            <View
              style={[
                styles.sessionProgressFill,
                { width: `${(completed.length / exercises.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Exercise cards */}
        {exercises.map((ex, i) => (
          <ExerciseCard
            key={i}
            exercise={ex}
            index={i}
            isExpanded={expanded === i}
            onToggle={() => toggleExpand(i)}
            isCompleted={completed.includes(i)}
            onComplete={() => markDone(i)}
          />
        ))}

        {/* Completion message */}
        {allDone && (
          <View style={styles.completionBanner}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Day 1 complete!</Text>
            <Text style={styles.completionText}>
              Great work. Consistency is everything — come back tomorrow and we'll progress the routine.
            </Text>
          </View>
        )}

        <View style={{ height: 12 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Upgrade')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            {allDone ? 'Unlock Full Recovery Plan' : 'Continue to Full Plan'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#0E1625" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        {!allDone && (
          <Text style={styles.skipHint}>You can always come back to finish these</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Card Styles ──────────────────────────────────────────────────────────────
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#111E33',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2A3D',
    overflow: 'hidden',
  },
  cardDone: {
    borderColor: '#5B8DFF',
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  number: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  numberDone: {
    backgroundColor: '#5B8DFF',
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B8DFF',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  nameDone: {
    color: '#4A5A72',
    textDecorationLine: 'line-through',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1F3A5F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#5B8DFF',
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A2535',
  },
  focusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1F2A3D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 14,
  },
  focusText: {
    fontSize: 11,
    color: '#7F8FA9',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  howToLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  howToText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 12,
  },
  whyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1A1E28',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  whyText: {
    fontSize: 13,
    color: '#F4A426',
    lineHeight: 20,
    flex: 1,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B8DFF',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E1625',
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0E1625' },
  progressHeader: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  progressBar:    { height: 3, backgroundColor: '#1F2A3D', borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: '#5B8DFF', borderRadius: 2 },
  scrollView:     { flex: 1 },
  content:        { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },

  header:           { marginBottom: 20 },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F3A5F',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText:  { fontSize: 12, color: '#5B8DFF', fontWeight: '700' },
  title:            { fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  subtitle:         { fontSize: 14, color: '#7F8FA9' },

  sessionProgress:     { marginBottom: 16 },
  sessionProgressText: { fontSize: 13, color: '#4A5A72', marginBottom: 6 },
  sessionProgressBar:  { height: 4, backgroundColor: '#1F2A3D', borderRadius: 2, overflow: 'hidden' },
  sessionProgressFill: { height: '100%', backgroundColor: '#5B8DFF', borderRadius: 2 },

  completionBanner: {
    backgroundColor: '#111E33',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5B8DFF',
    marginTop: 8,
  },
  completionEmoji: { fontSize: 36, marginBottom: 10 },
  completionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  completionText:  { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22 },

  footer:              { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A2535' },
  continueButton:      { backgroundColor: '#5B8DFF', borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  continueButtonText:  { fontSize: 17, fontWeight: '700', color: '#0E1625' },
  skipHint:            { fontSize: 12, color: '#3A4B62', textAlign: 'center' },
});
