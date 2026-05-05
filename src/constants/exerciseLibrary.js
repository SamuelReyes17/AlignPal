// ─── Location normalization ───────────────────────────────────────────────────
// Maps BodyMap IDs (and legacy space-separated keys) to library keys
export const normalizeLocation = (raw = '') => {
  const MAP = {
    // BodyMap underscore IDs
    lower_back: 'lower_back', upper_back: 'upper_back', neck: 'neck',
    chest: 'chest', abdomen: 'abdomen',
    left_shoulder: 'shoulder', right_shoulder: 'shoulder',
    left_shoulder_b: 'shoulder', right_shoulder_b: 'shoulder',
    left_elbow: 'elbow', right_elbow: 'elbow',
    left_elbow_b: 'elbow', right_elbow_b: 'elbow',
    left_hip: 'hip', right_hip: 'hip',
    left_glute: 'glute', right_glute: 'glute',
    left_quad: 'quad', right_quad: 'quad',
    left_hamstring: 'hamstring', right_hamstring: 'hamstring',
    left_knee: 'knee', right_knee: 'knee',
    left_knee_b: 'knee', right_knee_b: 'knee',
    left_shin: 'shin', right_shin: 'shin',
    left_calf: 'calf', right_calf: 'calf',
    left_ankle: 'ankle', right_ankle: 'ankle',
    left_ankle_b: 'ankle', right_ankle_b: 'ankle',
    left_achilles: 'achilles', right_achilles: 'achilles',
    left_plantar: 'plantar', right_plantar: 'plantar',
    left_forearm: 'elbow', right_forearm: 'elbow',
    left_forearm_b: 'elbow', right_forearm_b: 'elbow',
    left_wrist: 'elbow', right_wrist: 'elbow',
    left_wrist_b: 'elbow', right_wrist_b: 'elbow',
    left_toe: 'plantar', right_toe: 'plantar',
    left_knee_inner: 'knee', right_knee_inner: 'knee',
    left_knee_outer: 'knee', right_knee_outer: 'knee',
    neck_b: 'neck',
    // Legacy space keys (old stored data)
    'lower back': 'lower_back', 'upper back': 'upper_back',
    'left shoulder': 'shoulder', 'right shoulder': 'shoulder',
    'left knee': 'knee', 'right knee': 'knee',
    'left ankle': 'ankle', 'right ankle': 'ankle',
    'left calf': 'calf', 'right calf': 'calf',
  };
  return MAP[raw] || 'default';
};

// ─── Exercise library ─────────────────────────────────────────────────────────
// Each exercise: name, duration, reps, focus, phase, icon, howTo, why, priority,
//   goodFor (pain types), triggers (worst-time triggers that make it relevant),
//   avoidIfSharp (true = deprioritize for sharp/acute pain)

export const EXERCISE_LIBRARY = {

  // ── LOWER BACK ──────────────────────────────────────────────────────────────
  lower_back: [
    {
      name: 'McGill Bird-Dog',
      duration: '3 min',
      reps: '3 × 8 each side',
      focus: 'Lumbar stabilization',
      phase: 'Stability',
      icon: 'body-outline',
      howTo: '1. Start on hands and knees, wrists under shoulders, knees under hips.\n2. Brace your core — imagine a glass of water on your lower back.\n3. Extend your right arm and left leg simultaneously until both are parallel to the floor.\n4. Hold 8–10 seconds. Do NOT let your hips rotate.\n5. Return slowly and repeat on the other side.',
      why: 'Dr. Stuart McGill\'s decades of spine biomechanics research identify the Bird-Dog as the most effective exercise for lumbar stability. It trains the multifidus and erector spinae without compressive disc loading, making it safe even in acute phases.',
      priority: 5, goodFor: ['dull', 'stiff'], triggers: ['lifting', 'training', 'standing'],
    },
    {
      name: 'Glute Bridge',
      duration: '3 min',
      reps: '3 × 12 reps',
      focus: 'Gluteal activation',
      phase: 'Activation',
      icon: 'trending-up-outline',
      howTo: '1. Lie on your back, knees bent, feet flat hip-width apart.\n2. Press through your heels and drive your hips toward the ceiling.\n3. Squeeze your glutes hard at the top — hold 2 seconds.\n4. Lower slowly over 3 counts. Do not use your lower back to push up.',
      why: 'Janda\'s Lower Crossed Syndrome: prolonged sitting inhibits the gluteus maximus, forcing the lower back muscles to compensate. Reactivating the glutes is the single most important step for most lower back pain sufferers.',
      priority: 5, goodFor: ['dull', 'stiff', 'sharp'], triggers: ['sitting', 'standing', 'morning'],
    },
    {
      name: 'Cat-Cow Mobilization',
      duration: '2 min',
      reps: '15 slow cycles',
      focus: 'Spinal mobility',
      phase: 'Mobility',
      icon: 'sync-outline',
      howTo: '1. On hands and knees. Breathe in — let your belly drop, arch your back, lift your head and tailbone (Cow).\n2. Breathe out — round your entire spine up toward the ceiling, tuck your pelvis and chin (Cat).\n3. Move very slowly through each segment. Try to feel each vertebra move.',
      why: 'Cyclic spinal movement pumps synovial fluid into the facet joints and nutrients into the intervertebral discs. McKenzie\'s research shows rhythmic motion is one of the most effective treatments for discogenic lower back pain.',
      priority: 4, goodFor: ['stiff', 'sharp', 'burning'], triggers: ['morning', 'sitting'],
    },
    {
      name: 'Kneeling Hip Flexor Stretch',
      duration: '3 min',
      reps: '60 sec each side × 2',
      focus: 'Psoas release',
      phase: 'Mobility',
      icon: 'fitness-outline',
      howTo: '1. Kneel on one knee, front foot flat on the floor (lunge position).\n2. Tuck your tailbone under (posterior pelvic tilt) — this unlocks the hip flexor.\n3. Shift your hips forward until you feel a stretch deep in the front of the back hip.\n4. Keep your torso upright. Hold and breathe into the stretch.',
      why: 'The iliopsoas is the most problematic muscle for desk workers. Shortened hip flexors pull the lumbar spine into hyperlordosis and compress L4-L5 continuously. Releasing them directly reduces lower back compressive load.',
      priority: 4, goodFor: ['stiff', 'dull'], triggers: ['sitting', 'morning', 'standing'],
    },
    {
      name: 'Dead Bug',
      duration: '3 min',
      reps: '3 × 8 each side',
      focus: 'Anti-extension core',
      phase: 'Stability',
      icon: 'git-compare-outline',
      howTo: '1. Lie on your back, arms pointing straight up, knees bent at 90° (tabletop position).\n2. Press your lower back firmly into the floor and keep it there throughout.\n3. Slowly lower your right arm and left leg toward the floor — exhale as you go.\n4. Return and repeat on the other side. If your back arches, reduce the range of motion.',
      why: 'Hodges & Richardson (1996) showed that in healthy backs the transversus abdominis (deep core) fires 30ms BEFORE limb movement. In low back pain this timing is disrupted. Dead Bug retrains this pattern without spinal loading.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'lifting'],
    },
    {
      name: 'McKenzie Press-Up',
      duration: '2 min',
      reps: '10 slow reps',
      focus: 'Extension bias / disc relief',
      phase: 'Mobility',
      icon: 'arrow-up-outline',
      howTo: '1. Lie face down, hands under your shoulders.\n2. Press your upper body up while keeping your hips on the floor.\n3. Go to the point of mild stretch — not pain.\n4. Let your lower back fully relax and sag. Hold 2 seconds at the top.\n5. Lower slowly. Stop if pain radiates into your leg.',
      why: 'Robin McKenzie\'s centralisation principle: for posterior disc herniation, extension movements migrate disc material anteriorly away from nerve roots. Effective for pain that radiates into the buttock or leg and "centralises" with extension.',
      priority: 3, goodFor: ['sharp', 'burning'], triggers: ['sitting', 'morning'],
      avoidIfSharp: false,
    },
    {
      name: 'Pelvic Tilt',
      duration: '2 min',
      reps: '20 slow reps',
      focus: 'Lumbar motor control',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on your back, knees bent.\n2. Gently flatten your lower back into the floor by tilting your pelvis — like you\'re pressing a button with your lower back.\n3. Hold 5 seconds. Release and allow a tiny arch back.\n4. This should feel like a very gentle movement — no pain.',
      why: 'The pelvic tilt reestablishes the neuromotor connection between the brain and lumbar stabilizers after pain has disrupted normal coordination. Safe starting point for very acute or sensitive lower back pain.',
      priority: 2, goodFor: ['sharp', 'burning'], triggers: ['morning', 'sleeping'],
    },
    {
      name: 'McGill Side Bridge',
      duration: '3 min',
      reps: '3 × 10 sec each side (build to 30 sec)',
      focus: 'Lateral chain stiffness (QL + obliques)',
      phase: 'Stability',
      icon: 'reorder-three-outline',
      howTo: '1. Lie on your side, propped on the elbow directly under the shoulder.\n2. Beginner: bend knees 90°, lift hips so the body forms a straight line from knees to head.\n3. Advanced: stack the feet, lift hips so the body is straight head-to-heels.\n4. Hold a strong brace — do NOT let the hips sag or rotate forward.\n5. Lower with control. Repeat on the other side.',
      why: 'The third of McGill\'s "Big 3" — completing Bird-Dog and Curl-Up. Trains quadratus lumborum and oblique stiffness with ~2,500N spinal compression (vs 6,000N+ for full sit-ups). Vera-Garcia (J Electromyogr Kinesiol 2014) confirmed it as the highest-EMG-to-load-ratio lateral core exercise in the literature.',
      priority: 5, goodFor: ['dull', 'stiff'], triggers: ['lifting', 'training', 'standing'],
    },
    {
      name: 'Relaxed Lumbar Flexion (CFT)',
      duration: '3 min',
      reps: '8–10 slow reps × 2',
      focus: 'Graded exposure / fear reduction',
      phase: 'Exposure',
      icon: 'leaf-outline',
      howTo: '1. Stand with feet hip-width apart. Slow exhale.\n2. Bend forward letting the spine round naturally — do NOT brace the core, do NOT squeeze the glutes.\n3. Cue: "let the back go soft, let the breath out slowly."\n4. Pause at your comfortable end-range for 3 seconds. Roll back up vertebra by vertebra.\n5. Progress: pick up a light object (book, water bottle) from the floor with the same relaxed pattern.',
      why: 'The 2023 RESTORE trial (Kent et al., The Lancet, n=1011) showed Cognitive Functional Therapy outperformed usual care 3:1 for chronic LBP, with effects sustained at 12 months. The mechanism is reversing the "guard-before-you-move" overcontraction that defines chronic LBP. Hurt does not equal harm — the spine is robust, and re-teaching it that flexion is safe is therapeutic.',
      priority: 5, goodFor: ['dull', 'stiff'], triggers: ['lifting', 'morning', 'sitting'],
      avoidIfSharp: true,
    },
    {
      name: 'Sit-to-Stand Without Bracing (CFT)',
      duration: '2 min',
      reps: '3 × 10 reps',
      focus: 'Pattern unlearning / movement reintegration',
      phase: 'Exposure',
      icon: 'arrow-up-outline',
      howTo: '1. Sit on a normal chair, feet flat.\n2. Stand up letting the belly stay soft — no breath hold, no glute squeeze, no abdominal brace.\n3. Sit back down with the same softness.\n4. Cue: "move like you do not have back pain." Imagine standing up from a couch as a child.\n5. Progress: stand from a lower chair, then single-leg sit-to-stand.',
      why: 'Caneiro et al. (BJSM 2020) documented that chronic LBP patients unconsciously brace before every transition, sustaining the pain cycle. Reversing this conditioned response is one of the highest-impact interventions in CFT — it directly retrains the protective system that has become the problem.',
      priority: 4, goodFor: ['dull', 'stiff'], triggers: ['sitting', 'morning'],
      avoidIfSharp: true,
    },
    {
      name: 'Pallof Press (Anti-Rotation)',
      duration: '3 min',
      reps: '3 × 10 each side, 2 sec hold',
      focus: 'Anti-rotation core stiffness',
      phase: 'Stability',
      icon: 'git-compare-outline',
      howTo: '1. Anchor a resistance band at chest height. Stand sideways to the anchor, feet hip-width.\n2. Hold the band with both hands at your sternum.\n3. Press the band straight out in front of you — the band will try to rotate you toward the anchor. Resist with your core.\n4. Hold 2 seconds at full extension. Return slowly. Do NOT let your torso twist.\n5. Progression: tall kneeling → half kneeling → standing → split stance.',
      why: 'Coulombe et al. (J Athl Train 2017) and Calatayud et al. (JSCR 2019) established the Pallof Press as the gold standard for anti-rotation core stability — the one plane the McGill Big 3 does not directly load. Critical for everyday function: anti-rotation is what protects the spine when you carry a bag, open a door, or twist to grab something.',
      priority: 4, goodFor: ['dull', 'stiff'], triggers: ['lifting', 'training', 'standing'],
    },
  ],

  // ── UPPER BACK ──────────────────────────────────────────────────────────────
  upper_back: [
    {
      name: 'Thoracic Extension over Chair',
      duration: '3 min',
      reps: '10 reps per segment',
      focus: 'Thoracic mobility',
      phase: 'Mobility',
      icon: 'chevron-up-outline',
      howTo: '1. Sit in a chair with a firm back-rest at mid-back height.\n2. Clasp hands behind your head, elbows pointing forward.\n3. Lean back over the chair edge, extending your thoracic spine.\n4. Hold 3 seconds at the end-range. Move the chair position up or down to target different segments.\n5. You should feel a gentle crack or pop — this is normal.',
      why: 'The thoracic spine bears up to 8 hours of forward flexion daily at a desk. Each mobilization reverses this compression pattern. Research shows thoracic manipulation/mobilization provides immediate pain relief and improves cervical range of motion.',
      priority: 5, goodFor: ['stiff', 'dull'], triggers: ['sitting', 'morning'],
    },
    {
      name: 'Open Books (Thoracic Rotation)',
      duration: '3 min',
      reps: '10 reps each side',
      focus: 'Rotational mobility',
      phase: 'Mobility',
      icon: 'book-outline',
      howTo: '1. Lie on your side, hips and knees at 90°, arms extended forward (stacked).\n2. Slowly rotate your top arm up and over toward the opposite side — follow it with your eyes.\n3. Let your shoulder blade touch the floor if possible. Hold 2 seconds.\n4. Return slowly. Do not let your knees separate.',
      why: 'Thoracic rotation is the most commonly restricted movement pattern in office workers. Limited rotation forces compensation through the lumbar spine and cervical spine, overloading both. Open Books directly restore this movement.',
      priority: 5, goodFor: ['stiff'], triggers: ['sitting', 'morning', 'training'],
    },
    {
      name: 'Doorway Chest Stretch',
      duration: '2 min',
      reps: '30 sec × 3',
      focus: 'Pec minor release',
      phase: 'Mobility',
      icon: 'expand-outline',
      howTo: '1. Stand in a doorway, arms at 90°, forearms resting on the frame.\n2. Step one foot forward and lean gently through the doorway.\n3. Feel your chest and front shoulders open. Breathe deeply.\n4. Hold 30 sec. For deeper stretch, raise arms slightly above 90°.\n5. Do both heights — low arm targets pec major, high arm targets pec minor.',
      why: 'Pectoralis minor tightness — near universal in desk workers — pulls the scapula into anterior tilt and internal rotation, mechanically compressing the posterior thoracic region. Releasing it is foundational for upper back pain relief.',
      priority: 4, goodFor: ['dull', 'stiff'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Wall Angels',
      duration: '3 min',
      reps: '3 × 10 slow reps',
      focus: 'Scapular stabilization',
      phase: 'Activation',
      icon: 'person-outline',
      howTo: '1. Stand with your back flat against the wall, feet ~6" from the wall.\n2. Flatten your lower back and head against the wall.\n3. Place arms at 90° against the wall (like a goalpost).\n4. Slowly slide arms up overhead keeping every part of your arm touching the wall.\n5. Return slowly. If your back arches or arms lose contact, reduce range.',
      why: 'Wall Angels simultaneously activate the serratus anterior and lower trapezius — the two muscles most inhibited in upper crossed syndrome (Janda). These are the key scapular stabilizers that prevent winging and maintain proper shoulder mechanics.',
      priority: 4, goodFor: ['dull'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Prone Y-T Raise',
      duration: '3 min',
      reps: '3 × 12 each position',
      focus: 'Mid/lower trap strength',
      phase: 'Strength',
      icon: 'barbell-outline',
      howTo: '1. Lie face down on a bed or mat, arms hanging off the edge.\n2. Y position: lift arms at 45° above head (like the letter Y), thumbs up. Hold 2 sec.\n3. T position: lift arms out to sides at shoulder height, thumbs up. Hold 2 sec.\n4. Keep your head in line with your spine — do not lift your chin.',
      why: 'EMG studies confirm: Y position maximally activates lower trapezius; T position targets middle trapezius. These muscles are critically weakened in forward-head posture and drive chronic upper back aching through postural fatigue.',
      priority: 3, goodFor: ['dull'], triggers: ['training', 'sitting'],
      avoidIfSharp: true,
    },
    {
      name: 'Foam Roller T-Spine Extension',
      duration: '3 min',
      reps: '30 sec each spinal level',
      focus: 'Segmental thoracic release',
      phase: 'Release',
      icon: 'radio-button-on-outline',
      howTo: '1. Place a foam roller perpendicular to your spine at mid-back.\n2. Support your head in your hands, knees bent, feet flat.\n3. Gently extend over the roller, letting gravity do the work.\n4. Hold 30 sec, then move the roller up one segment. Work T4–T10.',
      why: 'The foam roller allows targeted extension at each individual thoracic vertebral level, unlike chair extension which mobilizes multiple segments together. Particularly effective for the T6-T8 region where kyphosis is most pronounced.',
      priority: 3, goodFor: ['stiff', 'sharp'], triggers: ['morning', 'sitting'],
    },
  ],

  // ── NECK ────────────────────────────────────────────────────────────────────
  neck: [
    {
      name: 'Chin Tuck',
      duration: '3 min',
      reps: '3 × 10 reps, hold 10 sec each',
      focus: 'Deep cervical flexor activation',
      phase: 'Activation',
      icon: 'arrow-back-outline',
      howTo: '1. Sit or stand tall with relaxed shoulders.\n2. Without bending your neck down, draw your chin straight back — creating a "double chin."\n3. You should feel the muscles at the base of your skull working, not the front of your neck.\n4. Hold 10 seconds. Release gently.\n5. Place one finger on your chin for feedback — the chin moves straight back, not down.',
      why: 'Jull et al. (2008) showed specific deep cervical flexor (DCF) training outperforms general exercise for chronic neck pain. The DCFs (longus colli/capitis) are the stabilizing muscles that are inhibited in text neck. Hansraj (2014): every inch forward the head shifts adds ~10 lbs of load to the cervical spine.',
      priority: 5, goodFor: ['dull', 'stiff', 'sharp', 'burning'], triggers: ['sitting', 'stress', 'standing'],
    },
    {
      name: 'Upper Trapezius Stretch',
      duration: '3 min',
      reps: '45 sec each side × 2',
      focus: 'Trap release',
      phase: 'Mobility',
      icon: 'swap-horizontal-outline',
      howTo: '1. Sit tall. Drop one ear toward your shoulder — do not rotate.\n2. Reach the same-side hand under your chair for anchor, or place it gently on your head for over-pressure.\n3. Breathe slowly. With each exhale, allow the stretch to deepen slightly.\n4. For the levator scapulae variation: rotate your head 45° toward the opposite armpit before tilting.',
      why: 'The upper trapezius is the most commonly hypertonic muscle in the body (Janda). Chronic activation from stress, poor posture, and mouse/keyboard use creates a pain-spasm cycle that compresses cervical facets and reduces blood flow to the suboccipital region.',
      priority: 5, goodFor: ['stiff', 'sharp', 'burning'], triggers: ['stress', 'sitting', 'training'],
    },
    {
      name: 'Levator Scapulae Stretch',
      duration: '2 min',
      reps: '45 sec each side',
      focus: 'C1-C4 decompression',
      phase: 'Mobility',
      icon: 'navigate-outline',
      howTo: '1. Sit tall. Rotate your head 45° to one side.\n2. Tilt your nose toward your armpit until you feel a stretch in the back of the neck on the opposite side.\n3. Place the same-side hand gently on the back of your head for gentle over-pressure.\n4. Anchor with the other hand by holding the chair seat.',
      why: 'The levator scapulae runs from C1-C4 to the scapula. When chronically shortened (keyboard use, mouse-side tension), it sidebends and rotates the upper cervical spine, creating a specific pattern of one-sided neck pain. Stretching it directly addresses this mechanism.',
      priority: 4, goodFor: ['stiff', 'sharp'], triggers: ['sitting', 'stress'],
    },
    {
      name: 'Suboccipital Release',
      duration: '3 min',
      reps: '2–3 min total',
      focus: 'Base-of-skull decompression',
      phase: 'Release',
      icon: 'ellipse-outline',
      howTo: '1. Lie on your back. Interlace fingers behind your head, thumbs pointing forward.\n2. Place your thumbs at the bony ridge at the base of your skull (occiput).\n3. Apply gentle upward pressure while tucking your chin slightly.\n4. Hold for 60-90 seconds. You should feel a gradual release of tension.',
      why: 'The 4 suboccipital muscles are the source of cervicogenic headaches and upper neck pain. They contain 3× the muscle spindle density of other muscles — highly reactive to posture and stress. Direct pressure + traction releases both the muscles and the atlanto-occipital joint.',
      priority: 4, goodFor: ['sharp', 'burning'], triggers: ['morning', 'sleeping', 'stress'],
    },
    {
      name: 'Cervical Rotation Mobility',
      duration: '2 min',
      reps: '10 slow full-range rotations each direction',
      focus: 'Rotation ROM',
      phase: 'Mobility',
      icon: 'refresh-outline',
      howTo: '1. Sit or stand tall. Relax your shoulders completely.\n2. Slowly rotate your head to look over one shoulder — go to the comfortable end of range.\n3. Hold 2 seconds. Return through center and rotate to the other side.\n4. Try to turn slightly further each rep without forcing. Do not tilt or extend.',
      why: 'Cervical rotation is the most commonly restricted movement in text neck. Limited rotation leads to compensatory overmobility at C4-C5 and C5-C6 — the most common disc herniation levels. Restoring rotation reduces this compensatory load.',
      priority: 3, goodFor: ['stiff'], triggers: ['morning', 'sleeping'],
    },
    {
      name: 'Shoulder Blade Squeeze',
      duration: '2 min',
      reps: '3 × 15 reps, hold 5 sec',
      focus: 'Rhomboid / mid-trap activation',
      phase: 'Activation',
      icon: 'contract-outline',
      howTo: '1. Sit or stand tall with arms at your sides.\n2. Squeeze your shoulder blades together and slightly downward — like trying to hold a pencil between them.\n3. Hold 5 seconds. Release completely.\n4. Do not shrug your shoulders upward — keep them away from your ears.',
      why: 'The rhomboids and middle trapezius are chronically elongated and weak in forward-head posture, creating the pull that loads the posterior cervical spine. Activating them provides the postural antagonist to pec/neck flexor tightness.',
      priority: 3, goodFor: ['dull'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Cervical Retraction with Extension (McKenzie)',
      duration: '3 min',
      reps: '10 reps every 2 hours during a flare',
      focus: 'Cervical extension / radicular centralization',
      phase: 'Mobility',
      icon: 'arrow-up-circle-outline',
      howTo: '1. Sit tall. Start with a chin tuck — draw the chin straight back into a "double chin."\n2. From the retracted position, slowly extend the head back as if looking up at the ceiling.\n3. Hold 2 seconds at end-range. Return through the chin-tuck position.\n4. Progress: add gentle overpressure with one hand on the forehead at end-range.\n5. Stop and reverse if symptoms travel further down the arm — continue if they retreat toward the spine.',
      why: 'The cervical equivalent of the lumbar press-up. McKenzie & May (The Cervical and Thoracic Spine, 2006) demonstrated that for posterior-derangement presentations, repeated retraction-extension centralizes radicular arm symptoms — pulling them out of the arm and back toward the neck. Abdulwahab & Sabbahi (Spine 2000) showed it also reduces nerve root irritation in C6/C7 radiculopathy.',
      priority: 5, goodFor: ['sharp', 'stiff', 'burning'], triggers: ['sitting', 'morning'],
    },
    {
      name: 'Cervical SNAG — Self C1-C2 Rotation (Mulligan)',
      duration: '3 min',
      reps: '6–10 reps × 3 sets each direction',
      focus: 'Upper cervical mobilization (cervicogenic headache)',
      phase: 'Mobility',
      icon: 'reload-outline',
      howTo: '1. Loop a rolled hand towel around the back of your neck, sitting tall.\n2. Locate the bony bump just below the base of the skull on the side of restriction (C1-C2 level).\n3. Pull the towel forward toward your eye on that side — applying a sustained anterior glide.\n4. While holding the glide, slowly rotate your head toward the same side as far as comfortable.\n5. Return through neutral. Maintain the glide throughout each rep.',
      why: 'Hall et al. (JOSPT 2007) RCT showed self-applied SNAGs significantly reduced cervicogenic headache vs placebo at 12 months. Hidalgo et al. (J Man Manip Ther 2017) systematic review confirmed efficacy. Mechanism: restoring upper-cervical (C1-C2) rotation, which carries 50% of total cervical rotation and is the most common restriction in cervicogenic headache.',
      priority: 4, goodFor: ['stiff', 'dull'], triggers: ['morning', 'stress'],
    },
    {
      name: 'Median Nerve Slider',
      duration: '3 min',
      reps: '10 reps × 3 sets, 2× per day',
      focus: 'Median nerve mechanosensitivity',
      phase: 'Release',
      icon: 'pulse-outline',
      howTo: '1. Sit tall. Abduct one arm to 90° (out to the side, elbow bent).\n2. As you EXTEND the elbow and the wrist (palm up, fingers back), simultaneously side-bend your neck TOWARD the same side.\n3. Reverse: as you bend the elbow and let the wrist relax, side-bend the neck AWAY from the arm.\n4. Move slowly and smoothly. Stay in pain-free range only — should feel a stretch sensation, not a sharp or burning pain.\n5. If symptoms travel further down the arm, reduce range or stop.',
      why: 'Wolny & Linek (Clin Rehabil 2019) RCT: median nerve sliders matched physiotherapy outcomes for carpal tunnel syndrome and outperformed splinting alone. Basson et al. (JOSPT 2017) systematic review supports use in cervical radiculopathy. Sliders (one end loads while the other unloads) are far better tolerated than tensioners in irritable presentations.',
      priority: 4, goodFor: ['burning', 'sharp'], triggers: ['sitting', 'sleeping'],
      avoidIfSharp: false,
    },
  ],

  // ── SHOULDER ────────────────────────────────────────────────────────────────
  shoulder: [
    {
      name: 'Pendulum Swing',
      duration: '3 min',
      reps: '30 sec circles each direction',
      focus: 'Joint decompression',
      phase: 'Mobility',
      icon: 'sync-circle-outline',
      howTo: '1. Lean forward and support yourself on a table with your good arm.\n2. Let the painful arm hang completely relaxed.\n3. Use your body weight to initiate small circular swings — do not actively move the arm.\n4. Do clockwise and counter-clockwise circles, gradually increasing the circle size.',
      why: 'Codman\'s pendulum exercise uses gravity to create gentle glenohumeral joint traction. This decompresses the subacromial space, reduces joint effusion, and maintains early mobility without activating the rotator cuff. First-line treatment for impingement and post-acute shoulder pain.',
      priority: 5, goodFor: ['sharp', 'burning'], triggers: ['training', 'lifting', 'sleeping'],
    },
    {
      name: 'Sidelying External Rotation',
      duration: '3 min',
      reps: '3 × 15 slow reps',
      focus: 'Posterior rotator cuff',
      phase: 'Activation',
      icon: 'refresh-circle-outline',
      howTo: '1. Lie on your non-painful side, elbow at 90°, upper arm against your body.\n2. Slowly rotate your forearm upward like opening a door, keeping your elbow tucked.\n3. Hold 2 seconds at the top. Lower slowly over 3 counts.\n4. Use a light weight (0.5–1 kg) once comfortable with bodyweight.',
      why: 'The infraspinatus and teres minor (posterior rotator cuff) are the primary depressors of the humeral head during arm elevation. Weakness allows the head to translate superiorly, causing impingement. This is the most important strengthening exercise for shoulder pain.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'lifting'],
      avoidIfSharp: true,
    },
    {
      name: 'Cross-Body Posterior Stretch',
      duration: '2 min',
      reps: '45 sec each side × 2',
      focus: 'Posterior capsule',
      phase: 'Mobility',
      icon: 'git-compare-outline',
      howTo: '1. Stand or sit. Bring the painful arm across your body at shoulder height.\n2. Use your other arm to gently pull it further across toward the opposite shoulder.\n3. Feel the stretch deep in the back of the shoulder.\n4. Do not rotate your trunk — isolate the stretch to the shoulder.',
      why: 'Burkhart et al. found posterior capsule tightness in up to 80% of overhead athletes with shoulder pain. Tightness limits internal rotation and causes the humeral head to translate posterosuperiorly during movement, overloading the anterior structures.',
      priority: 4, goodFor: ['stiff'], triggers: ['training', 'sleeping'],
    },
    {
      name: 'Wall Slide',
      duration: '3 min',
      reps: '3 × 10 reps',
      focus: 'Scapular upward rotation',
      phase: 'Activation',
      icon: 'trending-up-outline',
      howTo: '1. Stand facing a wall, forearms resting on it at eye level.\n2. Slowly slide your arms up the wall overhead, keeping full contact.\n3. Focus on letting your shoulder blades rotate upward naturally — do not shrug.\n4. Return slowly. Stop if you feel pinching at the top.',
      why: 'Overhead pain often reflects a failure of serratus anterior and lower trapezius to produce adequate scapular upward rotation. Wall slides train this rotation pattern under low load, restoring the force couple that keeps the shoulder pain-free overhead.',
      priority: 4, goodFor: ['dull', 'stiff'], triggers: ['training'],
    },
    {
      name: 'Sleeper Stretch',
      duration: '2 min',
      reps: '30 sec × 3 each side',
      focus: 'Posterior capsule (deep)',
      phase: 'Mobility',
      icon: 'bed-outline',
      howTo: '1. Lie on your painful side with your arm out to the side at 90°, elbow at 90°.\n2. Use your other hand to gently press your forearm down toward the floor.\n3. Hold at the comfortable end of range — you should feel it deep in the back of the shoulder.\n4. Stop if any sharp or shooting pain occurs.',
      why: 'The sleeper stretch is the most effective isolated stretch for posterior shoulder capsule contracture. Posterior tightness is the primary driver of glenohumeral internal rotation deficit (GIRD), which shifts the humeral head out of its optimal contact zone.',
      priority: 3, goodFor: ['stiff'], triggers: ['sleeping', 'training'],
    },
    {
      name: 'Scapular Wall Push-Up',
      duration: '2 min',
      reps: '3 × 15 reps',
      focus: 'Serratus anterior',
      phase: 'Activation',
      icon: 'hand-right-outline',
      howTo: '1. Stand facing a wall, hands on the wall at shoulder height and width.\n2. Keep your elbows straight throughout. Let your chest sink toward the wall (scapular protraction).\n3. Then push your body away by spreading/protracting the shoulder blades — feel them wrap around your rib cage.\n4. This is a small movement — do not bend your elbows.',
      why: 'Serratus anterior weakness causes medial scapular winging, disrupting glenohumeral mechanics. It is consistently weakened in shoulder impingement and rotator cuff pathology. Wall push-ups activate it with minimal rotator cuff load.',
      priority: 3, goodFor: ['dull'], triggers: ['training'],
      avoidIfSharp: true,
    },
    {
      name: 'Frozen Shoulder Pain-Free Mobility (UK FROST Protocol)',
      duration: '4 min',
      reps: 'Pendulums 30 sec × 5, AAROM ER 10 reps × 3, 3× per day',
      focus: 'Pain-free range during freezing/frozen phase',
      phase: 'Mobility',
      icon: 'sync-circle-outline',
      howTo: '1. PENDULUMS: bend at the waist, let the affected arm hang down. Shift body weight in small circles to swing the arm — the muscles stay relaxed. 30 seconds clockwise, 30 seconds counter.\n2. SUPINE AAROM EXTERNAL ROTATION: lie on your back, elbow tucked at side bent 90°, holding a stick or umbrella with both hands.\n3. Use the unaffected arm to gently push the stick (and affected forearm) outward.\n4. Stop AT pain-free end-range — do NOT push into pain.\n5. CRITICAL: avoid aggressive end-range stretching during the freezing/frozen phase — it increases pain without changing the natural trajectory.',
      why: 'Rangan et al. (UK FROST trial, The Lancet 2020, n=503) and Challoumas et al. (JAMA Network Open 2020 network meta-analysis) confirmed: in the irritable freezing/frozen phase, gentle pain-free ROM matches outcomes of aggressive stretching with significantly less pain. Hydrodilatation + this exercise approach outperformed corticosteroid alone at 6 months. Patience is the treatment — natural recovery takes 12–24 months regardless of intervention.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['morning', 'sleeping'],
      avoidIfSharp: false,
    },
  ],

  // ── KNEE ────────────────────────────────────────────────────────────────────
  knee: [
    {
      name: 'Terminal Knee Extension (TKE)',
      duration: '3 min',
      reps: '3 × 15 slow reps',
      focus: 'VMO activation',
      phase: 'Activation',
      icon: 'fitness-outline',
      howTo: '1. Stand with a slight bend in the painful knee (15–20°).\n2. Slowly straighten the knee fully, squeezing the inner quad (VMO — the teardrop muscle above the kneecap) at end range.\n3. Hold the fully straight position for 2 seconds.\n4. Bend slowly back to the start. Use a resistance band behind the knee for progression.',
      why: 'Crossley et al. demonstrated that VMO:VL (inner quad:outer quad) activation ratio is the critical factor in patellofemoral pain. When VMO fires too late or too weak, the kneecap tracks laterally into the trochlear groove, causing anterior knee pain.',
      priority: 5, goodFor: ['dull', 'stiff', 'sharp'], triggers: ['walking', 'training', 'standing'],
    },
    {
      name: 'Clamshell',
      duration: '3 min',
      reps: '3 × 15 each side',
      focus: 'Gluteus medius activation',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on your side, hips and knees at 45°, feet together.\n2. Keeping feet touching, rotate your top knee upward like opening a clamshell.\n3. Hold at the top for 2 seconds — feel the contraction in the outer hip/glute.\n4. Lower slowly. Do not roll your pelvis backward. Use a band above the knees for progression.',
      why: 'Powers et al. established that hip abductor and external rotator weakness causes increased knee valgus (knees caving inward), directly increasing patellofemoral and tibial stress. The gluteus medius is the primary control muscle — clamshells are the standard activation drill.',
      priority: 5, goodFor: ['dull', 'stiff'], triggers: ['walking', 'training'],
    },
    {
      name: 'Straight Leg Raise',
      duration: '3 min',
      reps: '3 × 15 each leg',
      focus: 'Quad activation (unloaded)',
      phase: 'Activation',
      icon: 'trending-up-outline',
      howTo: '1. Lie on your back. Bend the non-painful knee, foot flat.\n2. Tighten the quad of the straight leg (press the back of the knee down).\n3. Lift the straight leg to the height of the other knee.\n4. Hold 1 second. Lower slowly. Keep the quad tight throughout.',
      why: 'Post-knee injury or post-acute flare, the nervous system inhibits quad firing (arthrogenic muscle inhibition) as a protective response. The straight leg raise rebuilds the quad neuromotor connection without any joint compression or loading.',
      priority: 4, goodFor: ['sharp', 'burning'], triggers: ['training', 'walking'],
    },
    {
      name: 'Quad Stretch',
      duration: '2 min',
      reps: '45 sec each leg × 2',
      focus: 'Rectus femoris length',
      phase: 'Mobility',
      icon: 'walk-outline',
      howTo: '1. Stand near a wall for balance. Bend the knee and hold the ankle or foot.\n2. Bring your knee back behind the hip — not just bending the knee.\n3. Stand tall, squeeze your glute gently to tilt the pelvis and deepen the stretch.\n4. This position stretches the rectus femoris across both hip and knee.',
      why: 'Tight quadriceps (particularly the biarticular rectus femoris) increase patellofemoral joint reaction force by pulling the kneecap superiorly. Releasing quad length reduces compressive load across the knee joint by up to 30%.',
      priority: 4, goodFor: ['stiff'], triggers: ['training', 'sitting'],
    },
    {
      name: 'Single Leg Step-Up',
      duration: '3 min',
      reps: '3 × 10 each leg',
      focus: 'Functional quad/glute loading',
      phase: 'Strength',
      icon: 'arrow-up-circle-outline',
      howTo: '1. Use a 6-8 inch step or stair. Step up with the painful leg.\n2. Push through the heel and squeeze the glute as you straighten the knee.\n3. Lower yourself slowly (3 counts) back to the start.\n4. Keep your knee tracking over your second toe — no caving inward.',
      why: 'Step-ups bridge the gap between isolation exercises and functional loading. Eccentric loading on the step-down phase is critical for tendon and quad rehabilitation. Controlled step-down quality is the functional test used clinically to assess knee pain readiness.',
      priority: 3, goodFor: ['dull'], triggers: ['walking', 'training'],
      avoidIfSharp: true,
    },
    {
      name: 'Foam Roll IT Band / Lateral Quad',
      duration: '3 min',
      reps: '60 sec each side',
      focus: 'Lateral soft tissue release',
      phase: 'Release',
      icon: 'remove-outline',
      howTo: '1. Lie on your side with the foam roller under the outer thigh.\n2. Roll slowly from the hip down to just above the knee — 5 cm per second.\n3. Pause on tender spots for 30 seconds until the tension releases.\n4. The IT band itself cannot be stretched — focus on the TFL and lateral quad, which can.',
      why: 'IT band tightness causes lateral knee friction syndrome, the most common running injury. Rolling the TFL (tensor fasciae latae) at the hip and lateral quad reduces fascial tension through the IT band chain, reducing lateral tracking forces at the knee.',
      priority: 3, goodFor: ['sharp', 'burning'], triggers: ['walking', 'training'],
    },
    {
      name: 'Heavy Slow Resistance — Patellar (HSR)',
      duration: '15 min',
      reps: '3× per week. Wk1: 3×15RM. Wk2-3: 3×12RM. Wk4-5: 4×10RM. Wk6-8: 4×8RM. Wk9-12: 4×6RM',
      focus: 'Tendon remodeling / patellar tendinopathy',
      phase: 'Strength',
      icon: 'barbell-outline',
      howTo: '1. Use bodyweight squats, goblet squats, or leg press depending on access. Build to a load you can do for the prescribed reps.\n2. CRITICAL TEMPO: 3 seconds down (eccentric), 3 seconds up (concentric) — every rep is 6 seconds.\n3. Squat to ~70-90° knee flexion. Track knees over toes.\n4. Pain during loading up to 5/10 is acceptable and does not damage the tendon — follow the "24-hour rule": pain should return to baseline within 24 hours.\n5. Progressively reduce reps and increase load each week per the schedule above.',
      why: 'Beyer et al. (Am J Sports Med 2015) RCT: HSR matched eccentric-only loading at 12 weeks but produced significantly higher patient satisfaction at 12 months (96% vs 76%). Malliaras 2024 meta-analysis confirmed HSR and eccentric are equivalent for outcomes — but HSR is dramatically more time-efficient (3×/week vs 2×/day eccentrics) and feels more like normal training, driving better adherence. The slow tempo is the active ingredient.',
      priority: 5, goodFor: ['dull', 'sharp'], triggers: ['training', 'walking'],
    },
  ],

  // ── HIP ─────────────────────────────────────────────────────────────────────
  hip: [
    {
      name: '90/90 Hip Stretch',
      duration: '3 min',
      reps: '60 sec each position',
      focus: 'Hip IR + ER combined',
      phase: 'Mobility',
      icon: 'body-outline',
      howTo: '1. Sit on the floor. Place one leg in front (90° at hip and knee) and one leg behind (90° at hip and knee).\n2. Keep your torso upright and tall over the front hip.\n3. Lean gently forward over the front shin to deepen the stretch.\n4. Switch sides. You will feel restriction in one direction — work more time on that side.',
      why: 'The 90/90 stretch simultaneously addresses hip internal and external rotation restriction. Dr. Andreo Spina\'s FRC research shows hip rotation loss is the primary joint deficit that drives hip pain, and that the 90/90 position is the most efficient way to load both rotational directions.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['sitting', 'training', 'morning'],
    },
    {
      name: 'Figure-4 Piriformis Stretch',
      duration: '3 min',
      reps: '60 sec each side × 2',
      focus: 'Piriformis / deep rotators',
      phase: 'Mobility',
      icon: 'ellipse-outline',
      howTo: '1. Lie on your back, knees bent.\n2. Place the ankle of the painful side across the opposite thigh (figure-4 position).\n3. Interlace your fingers behind the bottom thigh and gently pull toward your chest.\n4. Feel the stretch deep in the outer hip/buttock. Breathe slowly.',
      why: 'The piriformis and deep external rotators (gemelli, obturator internus) are primary contributors to deep hip and buttock pain, including sciatic-like referral (piriformis syndrome). Tightness creates compressive impingement in the femoroacetabular joint.',
      priority: 5, goodFor: ['stiff', 'burning', 'sharp'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Hip Flexor Lunge Stretch',
      duration: '3 min',
      reps: '60 sec each side',
      focus: 'Iliopsoas release',
      phase: 'Mobility',
      icon: 'fitness-outline',
      howTo: '1. Kneel on one knee (lunge position). The hip being stretched is the back one.\n2. Tuck your tailbone under (posterior pelvic tilt) FIRST — this is essential to feel the stretch.\n3. Gently push your hips forward while keeping your torso vertical.\n4. Feel the stretch deep in the front of the back hip, not the knee.',
      why: 'Hip flexor tightness from prolonged sitting directly compresses the anterior hip joint capsule and contributes to femoroacetabular impingement (FAI-like symptoms). It also pulls the pelvis into anterior tilt, loading the lower back as a secondary effect.',
      priority: 4, goodFor: ['stiff', 'dull'], triggers: ['sitting', 'morning'],
    },
    {
      name: 'Side-Lying Hip Abduction',
      duration: '3 min',
      reps: '3 × 15 each side',
      focus: 'Gluteus medius strength',
      phase: 'Activation',
      icon: 'remove-circle-outline',
      howTo: '1. Lie on your side, body in a straight line, head resting on arm.\n2. Lift the top leg 30–40° — no higher.\n3. Rotate the leg slightly outward (toes pointing toward ceiling).\n4. Hold 1 second at the top. Lower slowly. Do not let the hip roll forward.',
      why: 'Trendelenburg sign — the pelvis dropping on the unsupported side during single-leg stance — is the clinical hallmark of gluteus medius weakness. Weakness here drives lateral hip pain (greater trochanteric pain syndrome), IT band tightness, and knee valgus.',
      priority: 4, goodFor: ['dull'], triggers: ['walking', 'standing', 'training'],
      avoidIfSharp: true,
    },
    {
      name: 'Hip Controlled Articular Rotation (CARs)',
      duration: '3 min',
      reps: '5 slow circles each direction',
      focus: 'Full joint exploration',
      phase: 'Mobility',
      icon: 'sync-outline',
      howTo: '1. Stand tall, holding something for balance.\n2. Lift one knee to 90°.\n3. Slowly rotate the hip through its full range — move the knee in a large circle: forward, out, back, in.\n4. Keep the movement as slow and controlled as possible. Feel every degree of range.',
      why: 'Dr. Andreo Spina\'s FRC (Functional Range Conditioning) principle: joint capacity is only maintained through active use of full range. Hip CARs explore and reinforce end-range positions that are lost through years of limited movement, preventing hip degeneration.',
      priority: 3, goodFor: ['stiff'], triggers: ['morning'],
    },
    {
      name: 'Copenhagen Adduction Exercise',
      duration: '4 min',
      reps: '3× per week. Wk1: 1×5 short-lever. Wk4: 2×8 long-lever. Wk8: 3×10 long-lever',
      focus: 'Adductor + glute med strength (groin pain prevention)',
      phase: 'Strength',
      icon: 'fitness-outline',
      howTo: '1. Lie on your side. Top leg supported on a bench or chair.\n2. SHORT LEVER (beginner): support point at the knee. LONG LEVER (advanced): support point at the ankle.\n3. Lift your hips and your bottom leg off the ground simultaneously — body forms a straight line, bottom leg meets the supported top leg.\n4. Hold 1 second at the top. Lower with control over 2-3 seconds.\n5. Build progressively: do not jump to long lever before week 3-4.',
      why: 'Harøy et al. (BJSM 2019, n=660 male footballers): the Copenhagen Adduction Protocol reduced groin problems by 41% over a season — one of the strongest prevention effects ever documented in sports medicine. Serner et al. (2014) EMG study: also activates gluteus medius >80% MVC, making this a dual-purpose exercise for adductor pain AND lateral hip dysfunction.',
      priority: 4, goodFor: ['dull', 'sharp'], triggers: ['training'],
    },
    {
      name: 'GTPS Isometric Hip Abduction (LEAP-derived)',
      duration: '4 min',
      reps: '5 × 45 sec holds, 70% effort, 2 min rest',
      focus: 'Gluteal tendinopathy load tolerance',
      phase: 'Activation',
      icon: 'pause-outline',
      howTo: '1. STANDING: place a resistance band around your knees. Stand with feet hip-width and press the knees outward against the band — hold 45 seconds at moderate-firm effort.\n2. SIDE-LYING: lie on the unaffected side. Lift the top leg ~15-20° and HOLD without moving — 45 seconds at 70% effort.\n3. Combine with load management: NO leg crossing, NO sleeping on affected side without a pillow between the knees, NO standing with weight shifted onto one hip.\n4. Repeat 5 holds. Pain up to 4/10 during the hold is acceptable; should settle within 24 hours.',
      why: 'Mellor et al. (LEAP RCT, BMJ 2018, n=204): education + isometric loading outperformed corticosteroid injection AND wait-and-see at 8 weeks AND 12 months. The load-management piece (avoiding sustained adduction positions) drove most of the effect. Plinsinga et al. (BJSM 2022) and 2023-2024 follow-ups confirm durability. Isometrics produce immediate analgesia in tendinopathy via cortical inhibition.',
      priority: 5, goodFor: ['dull', 'sharp'], triggers: ['sitting', 'walking', 'sleeping'],
    },
  ],

  // ── GLUTE ────────────────────────────────────────────────────────────────────
  glute: [
    {
      name: 'Single-Leg Glute Bridge',
      duration: '3 min',
      reps: '3 × 10 each side',
      focus: 'Gluteus maximus loading',
      phase: 'Activation',
      icon: 'trending-up-outline',
      howTo: '1. Lie on your back, one knee bent foot flat, other leg straight.\n2. Press through the heel of the bent leg and drive your hips up, keeping the straight leg elevated.\n3. Squeeze the glute hard at the top — hold 3 seconds.\n4. Lower slowly. Keep your hips level — do not let one side drop.',
      why: 'The single-leg bridge loads the gluteus maximus unilaterally, identifying and correcting side-to-side strength asymmetries. EMG shows maximal glute activation with knee bent (≥90°) compared to straight-leg exercises. Asymmetry >20% predicts future injury.',
      priority: 5, goodFor: ['dull'], triggers: ['sitting', 'standing', 'walking'],
      avoidIfSharp: true,
    },
    {
      name: 'Clamshell',
      duration: '3 min',
      reps: '3 × 15 each side',
      focus: 'Gluteus medius activation',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on your side, hips stacked, knees bent to 45°, feet together.\n2. Rotate the top knee upward like opening a clamshell — stop when your hip starts to roll back.\n3. Hold 2 seconds. Lower slowly.\n4. Add a resistance band above the knees once this becomes easy.',
      why: 'Gluteus medius is a primary stabilizer of the pelvis and the outer hip. When weak, the femur drops into adduction and internal rotation, overloading both the lateral hip structures and the lower back. Most deep gluteal pain patterns involve medius weakness.',
      priority: 5, goodFor: ['dull', 'stiff', 'sharp'], triggers: ['walking', 'standing'],
    },
    {
      name: 'Figure-4 Glute Stretch',
      duration: '3 min',
      reps: '60 sec each side × 2',
      focus: 'Deep glute / piriformis',
      phase: 'Mobility',
      icon: 'ellipse-outline',
      howTo: '1. Lie on your back. Cross one ankle over the opposite knee (figure-4).\n2. Pull the bottom thigh toward your chest gently.\n3. Feel the stretch deep in the crossed hip.\n4. Can also do seated: cross ankle over knee and lean forward.',
      why: 'Deep gluteal pain syndrome (previously called piriformis syndrome) is caused by compression of the sciatic nerve and gluteal vessels by the piriformis and other deep rotators. The figure-4 stretch directly decompresses this space.',
      priority: 4, goodFor: ['sharp', 'burning'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Fire Hydrant',
      duration: '2 min',
      reps: '3 × 12 each side',
      focus: 'Posterior glute medius',
      phase: 'Activation',
      icon: 'fitness-outline',
      howTo: '1. On hands and knees, wrists under shoulders, knees under hips.\n2. Keeping the knee bent, lift one leg out to the side like a dog at a fire hydrant.\n3. Rotate the hip so the knee goes up and back — feel the posterior outer glute working.\n4. Hold 1 second. Lower slowly. Keep hips level.',
      why: 'The fire hydrant targets the posterior fibers of gluteus medius and the external rotators specifically — the portion most related to lateral hip compression pain and IT band issues. Different from the clamshell which targets the more anterior fibers.',
      priority: 3, goodFor: ['dull'], triggers: ['training'],
      avoidIfSharp: true,
    },
    {
      name: 'Seated Glute Stretch',
      duration: '2 min',
      reps: '60 sec each side',
      focus: 'Piriformis / outer hip',
      phase: 'Mobility',
      icon: 'body-outline',
      howTo: '1. Sit in a chair. Cross one ankle over the opposite knee.\n2. Keep a tall spine. Gently lean forward at the hips.\n3. Feel the stretch in the outer buttock of the crossed leg.\n4. The deeper you lean, the more intense the stretch.',
      why: 'Ideal for desk workers who cannot get to the floor. Same mechanical effect as the supine figure-4 stretch — decompresses the deep rotators and piriformis region while maintaining workplace accessibility.',
      priority: 4, goodFor: ['sharp', 'burning', 'stiff'], triggers: ['sitting'],
    },
  ],

  // ── HAMSTRING ────────────────────────────────────────────────────────────────
  hamstring: [
    {
      name: 'Active Hamstring Stretch (Supine)',
      duration: '3 min',
      reps: '6 reps each side, hold 30 sec',
      focus: 'Hamstring length',
      phase: 'Mobility',
      icon: 'trending-up-outline',
      howTo: '1. Lie on your back. Bend one knee, foot flat.\n2. Lift the other leg with knee straight. Use a towel around the thigh if needed.\n3. Flex your foot (toes toward you) to add neural component.\n4. Hold 30 sec. Active version: contract the quad before stretching for reciprocal inhibition.',
      why: 'Active/PNF stretching produces greater gains in hamstring length than passive stretching (Sharman 2006). Contracting the antagonist (quad) before stretching triggers reciprocal inhibition of the hamstring, allowing a deeper release.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['training', 'sitting', 'morning'],
    },
    {
      name: 'Nordic Hamstring Curl',
      duration: '3 min',
      reps: '3 × 6 slow reps',
      focus: 'Eccentric hamstring strength',
      phase: 'Strength',
      icon: 'arrow-down-outline',
      howTo: '1. Kneel on a soft surface, feet held by a partner or under a sofa.\n2. Lower your body toward the floor as slowly as possible.\n3. Catch yourself with your hands and push back up using your arms.\n4. Start with 3 reps — this is extremely challenging. Progress to 8-10 over weeks.',
      why: 'Petersen et al. (2011) showed a 51% reduction in hamstring strain injuries with Nordic training in soccer players. It trains the hamstrings at long muscle lengths where they are most vulnerable to tearing during high-speed running and sprinting.',
      priority: 4, goodFor: ['dull'], triggers: ['training'],
      avoidIfSharp: true,
    },
    {
      name: 'Romanian Deadlift (Bodyweight)',
      duration: '3 min',
      reps: '3 × 10 reps',
      focus: 'Hip hinge / posterior chain',
      phase: 'Strength',
      icon: 'barbell-outline',
      howTo: '1. Stand tall, feet hip-width. Slight bend in knees.\n2. Push your hips back while lowering your hands down your thighs.\n3. Keep your back flat and your hips moving backward — not bending forward at the waist.\n4. Feel the hamstrings loading. Return by squeezing glutes and driving hips forward.',
      why: 'The hip hinge pattern (RDL) loads the hamstrings through their mid-range where they function during walking and running. It also reinforces posterior chain loading mechanics, reducing the risk of re-injury during functional activities.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'lifting'],
      avoidIfSharp: true,
    },
    {
      name: 'Sciatic Nerve Floss',
      duration: '2 min',
      reps: '10 slow oscillations each side',
      focus: 'Neural mobilization',
      phase: 'Mobility',
      icon: 'infinite-outline',
      howTo: '1. Sit tall at the edge of a chair.\n2. Simultaneously extend your knee and flex your ankle (toes up) on the painful side.\n3. Hold 2 seconds. Then bend the knee and point the foot down.\n4. Move slowly. This should produce mild tension — not sharp pain.',
      why: 'Neural tension in the sciatic nerve (L4-S1) is often a contributor to hamstring pain and "tightness" that does not improve with standard stretching. Neural mobilization (flossing) reduces intraneural inflammation and restores the nerve\'s ability to slide freely through its path.',
      priority: 3, goodFor: ['burning', 'sharp'], triggers: ['sitting'],
    },
    {
      name: 'Contract-Relax PNF Stretch',
      duration: '3 min',
      reps: '4 reps each side',
      focus: 'PNF hamstring flexibility',
      phase: 'Mobility',
      icon: 'return-up-forward-outline',
      howTo: '1. Lie on your back. Lift one leg with a towel around the thigh.\n2. Push your leg against the towel (isometric hamstring contraction) for 6 seconds.\n3. Relax, then gently pull the towel to move into a deeper stretch.\n4. Hold 30 sec. Repeat 4 times — you\'ll gain progressively more range.',
      why: 'Contract-relax PNF stretching uses autogenic inhibition (Golgi tendon organ response) to achieve greater acute flexibility gains than static stretching. Research shows 10-15° additional hamstring range versus static stretching alone in a single session.',
      priority: 4, goodFor: ['stiff'], triggers: ['training', 'morning'],
    },
  ],

  // ── QUAD ─────────────────────────────────────────────────────────────────────
  quad: [
    {
      name: 'Standing Quad Stretch',
      duration: '2 min',
      reps: '45 sec each leg × 2',
      focus: 'Rectus femoris length',
      phase: 'Mobility',
      icon: 'walk-outline',
      howTo: '1. Stand near a wall. Bend your knee and hold the ankle.\n2. Draw the knee back behind the hip — not just bending the knee.\n3. Squeeze the glute of the stretching leg to increase the stretch.\n4. Keep your knees together and stand tall. Use a wall for balance.',
      why: 'The rectus femoris crosses both the hip and knee. A standard quad stretch (knee bent only) misses the hip component. Adding hip extension by drawing the knee back stretches the full biarticular muscle, reducing both anterior knee and anterior hip pain.',
      priority: 5, goodFor: ['stiff'], triggers: ['training', 'sitting', 'morning'],
    },
    {
      name: 'Terminal Knee Extension',
      duration: '3 min',
      reps: '3 × 15 slow reps',
      focus: 'VMO activation',
      phase: 'Activation',
      icon: 'fitness-outline',
      howTo: '1. Stand with a slight bend in the knee (15-20°).\n2. Slowly straighten fully, contracting the inner quad (VMO) at the end range.\n3. Hold the straight position for 2 seconds.\n4. Bend back slowly. Use a band behind the knee for extra resistance.',
      why: 'VMO (vastus medialis obliquus) weakness is the primary biomechanical driver of anterior knee pain. Terminal knee extension trains VMO in the exact range where it is most critical for kneecap tracking — the final 30° of extension.',
      priority: 5, goodFor: ['dull', 'sharp', 'stiff'], triggers: ['walking', 'training'],
    },
    {
      name: 'Wall Sit (Isometric Quad)',
      duration: '2 min',
      reps: '3 × 30-60 sec holds',
      focus: 'Quad endurance / pain relief',
      phase: 'Strength',
      icon: 'square-outline',
      howTo: '1. Stand with your back against a wall. Slide down until knees are at 60-90°.\n2. Hold this position. Keep your back flat against the wall.\n3. If this causes knee pain, raise the position (less knee bend).\n4. Work up from 30 to 60 second holds over time.',
      why: 'Rio et al. (2015) showed isometric exercises have an immediate analgesic (pain-reducing) effect on tendinopathy and anterior knee pain — likely through cortical inhibition. Wall sits at 60° are a clinically used pain management tool before progressing to dynamic loading.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'walking'],
      avoidIfSharp: true,
    },
    {
      name: 'Eccentric Step-Down',
      duration: '3 min',
      reps: '3 × 8 each leg',
      focus: 'Eccentric quad control',
      phase: 'Strength',
      icon: 'arrow-down-circle-outline',
      howTo: '1. Stand on a 6-8" step. Balance on the painful leg.\n2. Slowly lower the other foot toward the floor over 3-4 counts — do not touch down.\n3. Return and repeat. Keep the knee tracking over your second toe.\n4. Hold a wall for balance if needed.',
      why: 'The eccentric step-down is the clinical functional test and treatment for VMO control and patellofemoral tracking. Crossley\'s research confirms that improving step-down quality correlates directly with reduction in anterior knee pain and improved function.',
      priority: 3, goodFor: ['dull'], triggers: ['walking', 'training'],
      avoidIfSharp: true,
    },
    {
      name: 'Foam Roll Quads',
      duration: '3 min',
      reps: '60 sec each leg',
      focus: 'Anterior thigh release',
      phase: 'Release',
      icon: 'remove-outline',
      howTo: '1. Lie face down, foam roller under the front of one thigh.\n2. Roll slowly from just above the knee up to the hip — 5 cm per second.\n3. Rotate the leg slightly inward for the inner quad (VMO area), and outward for the TFL/IT band.\n4. Pause 20-30 seconds on any tender spots.',
      why: 'Fascial restriction in the anterior thigh increases patellofemoral compressive force and contributes to IT band tightness. Rolling the rectus femoris and TFL reduces tissue tension and improves the effectiveness of subsequent quad stretching.',
      priority: 3, goodFor: ['sharp', 'dull'], triggers: ['training'],
    },
  ],

  // ── CALF ─────────────────────────────────────────────────────────────────────
  calf: [
    {
      name: 'Eccentric Heel Drop (Alfredson Protocol)',
      duration: '5 min',
      reps: '3 × 15 each leg',
      focus: 'Calf/tendon eccentric loading',
      phase: 'Strength',
      icon: 'trending-down-outline',
      howTo: '1. Stand with the balls of your feet on a step edge, holding a rail.\n2. Rise up on BOTH feet to the top position.\n3. Shift weight to the PAINFUL leg only.\n4. Lower yourself slowly over 3-4 counts until your heel is below the step.\n5. Start gentle if very sore. This WILL cause mild discomfort — that is therapeutic.',
      why: 'Alfredson et al. (1998) published an 82% success rate for chronic Achilles/calf pain with this protocol. Eccentric loading stimulates tendon collagen remodeling and reduces the neovascularization (painful new blood vessels) seen in chronic tendinopathy. The gold standard for 25+ years.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'walking', 'standing'],
      avoidIfSharp: true,
    },
    {
      name: 'Gastroc + Soleus Calf Stretch',
      duration: '4 min',
      reps: '45 sec × 2 each position',
      focus: 'Calf flexibility (both heads)',
      phase: 'Mobility',
      icon: 'resize-outline',
      howTo: '1. GASTROC: Step one foot back, heel firmly on the ground, knee straight. Hold 45 sec.\n2. SOLEUS: Same position but bend the back knee slightly. Hold 45 sec — you feel it lower, at the Achilles insertion.\n3. Use a wall for support. Both muscles need to be stretched — each position targets a different one.',
      why: 'The gastrocnemius and soleus require separate stretch positions due to their different attachments (gastroc crosses the knee, soleus does not). Tight calves transfer excessive tensile force into the plantar fascia and Achilles tendon during every walking step.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['training', 'walking', 'standing', 'morning'],
    },
    {
      name: 'Single-Leg Calf Raise',
      duration: '3 min',
      reps: '3 × 12 each leg',
      focus: 'Calf strength / endurance',
      phase: 'Strength',
      icon: 'walk-outline',
      howTo: '1. Stand near a wall, balance on one foot.\n2. Rise up onto your toes slowly (2 counts up).\n3. Lower slowly (3 counts down).\n4. Full range — heel drops below the step if using a step edge.\n5. You should reach mild fatigue by rep 12.',
      why: 'Single-leg calf endurance is the key metric for lower leg function. Normative data: pain-free individuals can do 25+ single-leg calf raises. Less than 15 indicates significant calf/Achilles weakness that predicts ongoing pain and re-injury.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'walking'],
    },
    {
      name: 'Foam Roll Calves',
      duration: '3 min',
      reps: '60 sec each leg',
      focus: 'Posterior compartment release',
      phase: 'Release',
      icon: 'radio-button-on-outline',
      howTo: '1. Sit on the floor, foam roller under one calf.\n2. Roll slowly from the ankle to just below the knee — 5 cm per second.\n3. Rotate the leg inward (for soleus/inner calf) and outward (for gastroc/outer calf).\n4. Cross your other leg on top to increase pressure.',
      why: 'Fascial restriction in the posterior calf compartment reduces blood flow and impairs force transmission from the Achilles to the plantar fascia. Foam rolling releases this restriction and improves the effectiveness of subsequent calf stretching.',
      priority: 3, goodFor: ['sharp', 'burning'], triggers: ['training', 'walking'],
    },
    {
      name: 'Tibialis Anterior Raises',
      duration: '2 min',
      reps: '3 × 20 reps',
      focus: 'Anterior tibial strengthening',
      phase: 'Activation',
      icon: 'arrow-up-circle-outline',
      howTo: '1. Stand with your back against a wall, heels ~30 cm from the wall.\n2. Lift your toes and forefoot off the ground as high as possible.\n3. Hold 1 second. Lower slowly.\n4. Keep the movement smooth and controlled.',
      why: 'Tibialis anterior weakness creates an imbalance with dominant calf musculature — overloading the posterior compartment. Strengthening the anterior tibial muscles improves foot clearance during gait, reduces excessive forefoot loading, and balances shin splint risk.',
      priority: 3, goodFor: ['dull'], triggers: ['walking', 'standing'],
    },
  ],

  // ── ANKLE ────────────────────────────────────────────────────────────────────
  ankle: [
    {
      name: 'Ankle Alphabet',
      duration: '3 min',
      reps: 'Full alphabet each ankle',
      focus: 'Full ROM restoration',
      phase: 'Mobility',
      icon: 'sync-outline',
      howTo: '1. Sit with leg elevated or hang foot off a bed.\n2. Using your big toe as a pen, write the full alphabet in the air.\n3. Move only at the ankle — keep the knee still.\n4. Do both clockwise and counter-clockwise circles after.',
      why: 'Writing the alphabet moves the ankle through every available plane of motion systematically, restoring full range after injury or immobilization. Research shows it is more effective than simple circles for regaining functional ankle ROM post-sprain.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['morning', 'walking'],
    },
    {
      name: 'Eccentric Calf Raise',
      duration: '4 min',
      reps: '3 × 15 each ankle',
      focus: 'Ankle stability / calf loading',
      phase: 'Strength',
      icon: 'trending-down-outline',
      howTo: '1. Stand on a step with toes on the edge.\n2. Rise on both feet. Shift to the painful ankle.\n3. Lower slowly over 3-4 counts.\n4. Rise again with both feet. Repeat.',
      why: 'Eccentric loading rebuilds the calf-Achilles complex — the primary dynamic ankle stabilizer. Research by Alfredson and subsequent meta-analyses confirm eccentric training is the most effective non-surgical intervention for chronic ankle/Achilles pain.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'walking'],
      avoidIfSharp: true,
    },
    {
      name: 'Single Leg Balance',
      duration: '3 min',
      reps: '3 × 30 sec each side',
      focus: 'Proprioception / ankle stability',
      phase: 'Activation',
      icon: 'person-outline',
      howTo: '1. Stand on one foot, slight bend at the knee.\n2. Focus on a fixed point to help balance.\n3. Progressions: close eyes, stand on folded towel, small hip movements while balancing.\n4. Each progression significantly increases the proprioceptive challenge.',
      why: 'Freeman\'s classic research showed proprioceptive training reduces ankle re-sprain rate by ~50%. Just 30 sec of single-leg balance per day creates meaningful improvements in joint position sense and stabilizing muscle response time within 2 weeks.',
      priority: 4, goodFor: ['dull', 'stiff', 'sharp'], triggers: ['walking', 'training'],
    },
    {
      name: 'Dorsiflexion Lunge',
      duration: '3 min',
      reps: '10 reps × 60 sec each side',
      focus: 'Ankle dorsiflexion ROM',
      phase: 'Mobility',
      icon: 'arrow-up-outline',
      howTo: '1. Stand in a lunge, front foot near a wall.\n2. Drive your front knee forward over your little toe — keep your heel on the floor.\n3. Touch the wall with your knee, then return.\n4. Move the foot further from the wall to increase demand.',
      why: 'Dorsiflexion ROM is the single most important ankle measurement. Limited dorsiflexion forces compensatory pronation, tibial rotation, and knee valgus — causing pain at the ankle, knee, hip and lower back as compensation travels up the chain.',
      priority: 4, goodFor: ['stiff'], triggers: ['training', 'walking'],
    },
    {
      name: 'Banded Ankle Eversion',
      duration: '2 min',
      reps: '3 × 15 each side',
      focus: 'Peroneal strengthening',
      phase: 'Activation',
      icon: 'shuffle-outline',
      howTo: '1. Sit with a resistance band looped around the forefoot.\n2. Rotate the sole of your foot outward against the band resistance.\n3. Hold 1 second. Return slowly.\n4. The target muscles (peroneals) run along the outside of the lower leg.',
      why: 'The peroneal muscles (peroneals longus and brevis) are the primary dynamic stabilizers against lateral ankle sprains. Post-sprain peroneal weakness is the main driver of recurrent sprains. Strengthening them reduces re-injury risk by up to 70%.',
      priority: 3, goodFor: ['dull'], triggers: ['walking', 'training'],
    },
  ],

  // ── ACHILLES ─────────────────────────────────────────────────────────────────
  achilles: [
    {
      name: 'Eccentric Heel Drop — Straight Knee',
      duration: '5 min',
      reps: '3 × 15 reps (twice daily)',
      focus: 'Gastrocnemius eccentric load',
      phase: 'Strength',
      icon: 'trending-down-outline',
      howTo: '1. Stand with the ball of the foot on a step edge.\n2. Rise up using BOTH legs.\n3. Shift to the PAINFUL leg only.\n4. Lower the heel below the step slowly over 3-4 counts.\n5. Mild pain during the exercise is acceptable — sharp pain is not.',
      why: 'The Alfredson protocol (1998) showed 82% success rate for mid-portion Achilles tendinopathy that had failed conservative treatment. Eccentric loading stimulates tenocyte activity and collagen remodeling, gradually replacing disorganized tendinopathic tissue with healthy tendon.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'walking'],
      avoidIfSharp: true,
    },
    {
      name: 'Eccentric Heel Drop — Bent Knee',
      duration: '5 min',
      reps: '3 × 15 reps',
      focus: 'Soleus eccentric load',
      phase: 'Strength',
      icon: 'trending-down-outline',
      howTo: '1. Same as straight-knee version, but keep the knee bent throughout.\n2. This targets the soleus, which makes up the lower portion of the Achilles.\n3. Rise with both, lower on one. Knee remains slightly bent the entire time.\n4. Particularly important for insertional Achilles pain (at the heel bone).',
      why: 'The soleus contribution to Achilles tendinopathy is often underappreciated. The bent-knee position isolates the soleus by taking the gastrocnemius off tension. Beyer et al. (2015) confirmed bent-knee eccentric training equals straight-knee in clinical outcomes.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'walking'],
      avoidIfSharp: true,
    },
    {
      name: 'Soleus Calf Stretch',
      duration: '3 min',
      reps: '60 sec each side × 2',
      focus: 'Soleus + Achilles length',
      phase: 'Mobility',
      icon: 'resize-outline',
      howTo: '1. Step one foot back, knee BENT (unlike gastroc stretch).\n2. Keep the heel on the floor. Lean forward over the front foot.\n3. Feel the stretch low — at the Achilles insertion and lower calf.\n4. This is distinctly different from the straight-knee stretch.',
      why: 'The soleus and Achilles insertion are often more restricted than the gastrocnemius in Achilles tendinopathy. Gentle stretching maintains tissue length during the rehabilitation process, preventing further shortening of the calf-Achilles unit.',
      priority: 4, goodFor: ['stiff', 'sharp'], triggers: ['morning', 'walking'],
    },
    {
      name: 'Ankle Mobilization (Talocrural)',
      duration: '3 min',
      reps: '10 reps × 3',
      focus: 'Talocrural joint mobility',
      phase: 'Mobility',
      icon: 'sync-outline',
      howTo: '1. Sit with foot on the floor. Place hands on either side of the ankle joint.\n2. Gently oscillate the ankle forward and back (anterior-posterior glide).\n3. Or stand at a wall, perform the dorsiflexion lunge (knee-to-wall test).\n4. Maintain heel contact with the floor throughout.',
      why: 'Restricted talocrural (ankle) dorsiflexion is consistently found in Achilles tendinopathy. The posterior talar glide is limited by joint stiffness, and restoring it reduces the compensatory loading strategies that maintain chronic Achilles tension.',
      priority: 3, goodFor: ['stiff'], triggers: ['morning'],
    },
    {
      name: 'Calf + Achilles Isometric Hold',
      duration: '3 min',
      reps: '5 × 45 sec holds',
      focus: 'Isometric tendon loading',
      phase: 'Activation',
      icon: 'pause-outline',
      howTo: '1. Stand on the painful leg in a calf raise position (mid-range, not end range).\n2. Hold the position for 45 seconds with moderate effort.\n3. Rest 2 minutes between reps.\n4. Use a wall for light balance support.',
      why: 'Rio et al. (2015) demonstrated that isometric loading of tendons provides immediate pain relief (up to 45% VAS reduction) during a painful flare. This makes isometrics the recommended first-line exercise when eccentric loading is too painful to perform.',
      priority: 4, goodFor: ['sharp'], triggers: ['training'],
    },
    {
      name: 'Heavy Slow Resistance — Achilles (HSR)',
      duration: '15 min',
      reps: '3× per week. Wk1: 3×15RM. Wk2-3: 3×12RM. Wk4-5: 4×10RM. Wk6-8: 4×8RM. Wk9-12: 4×6RM',
      focus: 'Tendon remodeling / mid-portion Achilles tendinopathy',
      phase: 'Strength',
      icon: 'barbell-outline',
      howTo: '1. Stand on the edge of a step, balls of both feet on the step, heels hanging off.\n2. Add load via backpack, dumbbells, or single-leg progression as you advance.\n3. CRITICAL TEMPO: 3 seconds up onto your toes (concentric), 3 seconds down past the step level (eccentric) — every rep is 6 seconds.\n4. Pain up to 5/10 during loading is acceptable and does not damage the tendon — pain should return to baseline within 24 hours ("24-hour rule").\n5. Progress through the 12-week schedule. Stay strict on tempo — speed kills the adaptation.',
      why: 'Beyer et al. (Am J Sports Med 2015) head-to-head RCT vs Alfredson eccentrics: equivalent outcomes at 12 weeks, but HSR produced significantly higher patient satisfaction at 12 months (96% vs 76%) and dramatically better adherence. Kongsgaard et al. (Scand J Med Sci Sports 2009) showed comparable collagen turnover. HSR is the modern evidence-based alternative to twice-daily eccentrics — same biology, far better life-fit.',
      priority: 5, goodFor: ['dull', 'sharp'], triggers: ['training', 'walking'],
    },
  ],

  // ── PLANTAR FASCIA ────────────────────────────────────────────────────────────
  plantar: [
    {
      name: 'Plantar Fascia Toe Stretch',
      duration: '3 min',
      reps: '3 × 60 sec each foot',
      focus: 'Plantar fascia elongation',
      phase: 'Mobility',
      icon: 'hand-left-outline',
      howTo: '1. Sit with one ankle crossed over the opposite knee.\n2. Use your hand to pull all toes back (upward extension) as far as comfortable.\n3. With the other hand, feel the tight band along the arch — you should feel it become taut.\n4. Hold 60 seconds. This stretch is most important BEFORE taking your first steps in the morning.',
      why: 'The Windlass mechanism: extending the toes winds the plantar fascia tightly around the metatarsal heads, placing it under tension. Stretching in this position directly targets the inflamed tissue. DiGiovanni et al. showed this specific stretch reduces plantar fasciitis pain faster than Achilles stretching alone.',
      priority: 5, goodFor: ['sharp', 'stiff'], triggers: ['morning', 'walking', 'standing'],
    },
    {
      name: 'Gastroc + Soleus Stretch',
      duration: '4 min',
      reps: '45 sec × 2 each position',
      focus: 'Calf-fascia chain release',
      phase: 'Mobility',
      icon: 'resize-outline',
      howTo: '1. GASTROC: Back foot straight, knee locked, lean into wall 45 sec.\n2. SOLEUS: Same position, back knee bent slightly. Hold 45 sec.\n3. Do both legs, both positions — even if only one foot hurts.',
      why: 'The plantar fascia and calf share continuity through the Achilles at the calcaneus. Lemont et al. showed that tight gastroc-soleus complex is the #1 biomechanical risk factor for plantar fasciitis. Stretching the calf chain directly reduces plantar tensile load with every step.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['morning', 'walking', 'standing'],
    },
    {
      name: 'Intrinsic Foot Strengthening (Short Foot)',
      duration: '3 min',
      reps: '3 × 10 reps each foot',
      focus: 'Arch support muscles',
      phase: 'Activation',
      icon: 'resize-outline',
      howTo: '1. Sit or stand, foot flat on the floor.\n2. Without curling your toes, try to shorten your foot by doming the arch upward — like making a suction cup.\n3. Hold 5 seconds. You should feel the abductor hallucis (inner arch muscle) working.\n4. This is subtle — start seated until you can feel the correct muscles.',
      why: 'Weakness of the intrinsic foot muscles (particularly abductor hallucis) reduces medial arch support, increasing plantar fascia tensile load. Exercises targeting these muscles reduce arch collapse, protecting the fascia from the repetitive strain that drives inflammation.',
      priority: 4, goodFor: ['dull'], triggers: ['walking', 'standing'],
    },
    {
      name: 'Frozen Bottle Foot Roll',
      duration: '5 min',
      reps: '3-5 min each foot',
      focus: 'Fascial release + inflammation',
      phase: 'Release',
      icon: 'snow-outline',
      howTo: '1. Fill a water bottle and freeze it.\n2. Sit and place the arch of your foot on the frozen bottle.\n3. Roll slowly along the full length of the arch — heel to ball of foot.\n4. Use moderate pressure — enough to feel it but not sharp pain.\n5. Best done in the morning before taking your first steps.',
      why: 'The combined effect of cold (reduces local inflammation and prostaglandin production) and pressure (myofascial release of the plantar fascia) makes the frozen bottle roll uniquely effective. Particularly valuable in the first 2-4 weeks of an acute flare.',
      priority: 4, goodFor: ['sharp', 'burning'], triggers: ['morning', 'standing'],
    },
  ],

  // ── SHIN ─────────────────────────────────────────────────────────────────────
  shin: [
    {
      name: 'Tibialis Anterior Raises',
      duration: '3 min',
      reps: '3 × 20 reps',
      focus: 'Tibialis anterior strengthening',
      phase: 'Activation',
      icon: 'arrow-up-circle-outline',
      howTo: '1. Stand with back against wall, heels ~30 cm forward.\n2. Lift the front of both feet off the ground simultaneously.\n3. Hold 2 seconds at the top. Lower slowly.\n4. Progress: single-leg version, or add resistance band across foot.',
      why: 'Medial tibial stress syndrome (shin splints) involves repeated stress failure at the tibia due to excessive tibialis posterior and soleus loading. Strengthening tibialis anterior balances this imbalance and shares the tibial loading stress more evenly.',
      priority: 5, goodFor: ['sharp', 'dull'], triggers: ['walking', 'training'],
    },
    {
      name: 'Gastroc + Soleus Stretch',
      duration: '3 min',
      reps: '45 sec × 2 per position',
      focus: 'Posterior chain decompression',
      phase: 'Mobility',
      icon: 'resize-outline',
      howTo: '1. Straight-knee version for gastroc, bent-knee version for soleus.\n2. Posterior compartment tightness compresses the anterior compartment — releasing it reduces shin pain.\n3. Hold each position 45 sec with gentle breath.',
      why: 'The posterior compartment of the lower leg is separated from the anterior by the interosseous membrane. When posterior muscles (calf) are tight, they create pressure that contributes to anterior compartment pain and tibial stress reactions.',
      priority: 4, goodFor: ['stiff'], triggers: ['training', 'walking'],
    },
    {
      name: 'Eccentric Heel Drop',
      duration: '4 min',
      reps: '3 × 15 each leg',
      focus: 'Posterior chain eccentric loading',
      phase: 'Strength',
      icon: 'trending-down-outline',
      howTo: '1. Stand on a step on one leg.\n2. Rise on both, lower on one — over 3 counts.\n3. This progressively loads the calf-tibial complex eccentrically.',
      why: 'Eccentric calf training reduces tibial bending moments during gait by improving the shock-absorbing capacity of the calf muscle-tendon unit. This directly reduces the repetitive periosteal stress that causes shin splints.',
      priority: 3, goodFor: ['dull'], triggers: ['training'],
      avoidIfSharp: true,
    },
    {
      name: 'Foam Roll Calves + Shins',
      duration: '3 min',
      reps: '45 sec each compartment',
      focus: 'Posterior + anterior release',
      phase: 'Release',
      icon: 'remove-outline',
      howTo: '1. Calves: roller under the calf, roll heel to knee.\n2. Shins: roll to face down with roller under the shin, roll along the tibialis anterior muscle (outside the shin bone).\n3. Pause on tender spots.',
      why: 'Fascial tension in both compartments perpetuates the compressive cycle of shin pain. Rolling both the anterior and posterior compartments addresses the full mechanical loading pattern.',
      priority: 3, goodFor: ['sharp'], triggers: ['training'],
    },
  ],

  // ── CHEST ────────────────────────────────────────────────────────────────────
  chest: [
    {
      name: 'Doorway Chest Stretch',
      duration: '3 min',
      reps: '30 sec × 3 each height',
      focus: 'Pec major + minor release',
      phase: 'Mobility',
      icon: 'expand-outline',
      howTo: '1. Stand in a doorframe, arms at 90°.\n2. LOW arm position (below shoulder): targets pec major sternal head.\n3. MID position (at shoulder): targets pec major clavicular head.\n4. HIGH position (above shoulder, 120°): targets pec minor.\n5. Lean gently through the door and breathe.',
      why: 'Pectoralis minor tightness is the most common driver of anterior chest tightness. It creates scapular anterior tilt, reduces subacromial space, and contributes to thoracic outlet syndrome. Three stretch heights are needed to reach all fibers.',
      priority: 5, goodFor: ['stiff', 'sharp'], triggers: ['sitting', 'training'],
    },
    {
      name: 'Thoracic Extension over Chair',
      duration: '3 min',
      reps: '10 reps per segment',
      focus: 'Thoracic decompression',
      phase: 'Mobility',
      icon: 'chevron-up-outline',
      howTo: '1. Sit back in a chair with a firm back-rest.\n2. Lean back over the back of the chair, extending through the mid-spine.\n3. Support your head with hands interlaced behind it.\n4. Move the chair up/down to target different thoracic segments.',
      why: 'Anterior chest tightness is usually accompanied by thoracic kyphosis. These structures are biomechanically linked — you cannot fully release the chest without also extending the thoracic spine. Combining both addresses the root mechanism.',
      priority: 4, goodFor: ['stiff'], triggers: ['sitting'],
    },
    {
      name: 'Diaphragmatic Breathing',
      duration: '5 min',
      reps: '10 slow breath cycles × 3',
      focus: 'Respiratory mechanics',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on your back, one hand on chest, one on belly.\n2. Breathe in slowly through your nose for 4 counts — belly rises, chest stays still.\n3. Exhale slowly through pursed lips for 6 counts.\n4. The chest should NOT move significantly — all movement at the belly.',
      why: 'Shallow chest breathing activates the secondary respiratory muscles (scalenes, pec minor, upper trapezius) which maintain chronic tension in the chest and neck. Restoring diaphragmatic breathing deactivates these muscles and directly reduces chest tightness.',
      priority: 4, goodFor: ['sharp', 'burning'], triggers: ['stress', 'training'],
    },
    {
      name: 'Open Books Rotation',
      duration: '3 min',
      reps: '10 each side',
      focus: 'Thoracic rotation + chest opening',
      phase: 'Mobility',
      icon: 'book-outline',
      howTo: '1. Lie on your side, hips and knees stacked at 90°, arms extended forward.\n2. Rotate the top arm up and over toward the opposite floor, letting your chest open.\n3. Hold 2 seconds at end range. Return slowly.',
      why: 'The pectoralis minor and chest structures wrap around the anterior thorax. Combined anterior-to-posterior rotation releases them across multiple planes simultaneously, more effectively than a single-plane stretch.',
      priority: 3, goodFor: ['stiff'], triggers: ['morning', 'sitting'],
    },
  ],

  // ── ELBOW ────────────────────────────────────────────────────────────────────
  elbow: [
    {
      name: 'Wrist Extensor Stretch (Tennis Elbow)',
      duration: '3 min',
      reps: '4 × 30 sec each arm',
      focus: 'ECRB / lateral epicondyle',
      phase: 'Mobility',
      icon: 'hand-left-outline',
      howTo: '1. Extend the painful arm in front with palm facing DOWN.\n2. Use your other hand to bend the wrist downward (flexion) and fingers toward you.\n3. Keep the elbow straight throughout.\n4. You should feel the stretch along the top of the forearm into the outer elbow.',
      why: 'Lateral epicondylalgia (tennis elbow) involves the common extensor origin, primarily ECRB (extensor carpi radialis brevis). Stretching in elbow extension + wrist flexion targets this exact structure at its most lengthened position, reducing the tightness that perpetuates irritation.',
      priority: 5, goodFor: ['sharp', 'stiff'], triggers: ['training', 'lifting'],
    },
    {
      name: 'Eccentric Wrist Extension (Tyler Twist)',
      duration: '3 min',
      reps: '3 × 15 reps',
      focus: 'ECRB eccentric loading',
      phase: 'Strength',
      icon: 'return-up-forward-outline',
      howTo: '1. Hold a light weight or use a rubber exercise bar in the affected hand, palm down.\n2. Use your OTHER hand to lift it to the top position.\n3. SLOWLY lower with the affected hand only, over 3-4 counts.\n4. Return using the other hand. The affected arm only does the eccentric (lowering) portion.',
      why: 'Tyler et al. showed 81% success rate with the rubber bar eccentric protocol for lateral epicondylalgia. Eccentric loading stimulates collagen synthesis in the disorganized tendon tissue and gradually restores normal tendon architecture — the same principle as Alfredson\'s Achilles protocol.',
      priority: 5, goodFor: ['dull'], triggers: ['training', 'lifting'],
      avoidIfSharp: true,
    },
    {
      name: 'Wrist Flexor Stretch (Golfer\'s Elbow)',
      duration: '3 min',
      reps: '4 × 30 sec each arm',
      focus: 'Medial epicondyle / flexors',
      phase: 'Mobility',
      icon: 'hand-right-outline',
      howTo: '1. Extend the painful arm with palm facing UP.\n2. Use your other hand to bend the wrist backward (extension).\n3. Keep the elbow straight.\n4. Feel the stretch along the inner forearm and medial elbow.',
      why: 'Medial epicondylalgia (golfer\'s elbow) affects the common flexor origin. The wrist flexor stretch, done in elbow extension, targets the pronator teres and FCR (flexor carpi radialis) at their origin — directly addressing medial elbow pain patterns.',
      priority: 4, goodFor: ['sharp', 'stiff'], triggers: ['training', 'lifting'],
    },
    {
      name: 'Forearm Pronation / Supination',
      duration: '2 min',
      reps: '3 × 15 slow rotations each direction',
      focus: 'Radioulnar joint mobility',
      phase: 'Mobility',
      icon: 'refresh-outline',
      howTo: '1. Sit with elbow at 90°, upper arm against your side.\n2. Hold a pen or pencil in your fist, parallel to the floor.\n3. Rotate slowly palm-up (supination), then palm-down (pronation).\n4. Go to the end of comfortable range both directions.',
      why: 'Radioulnar joint stiffness is a common secondary finding in elbow pain. Restricted pronation/supination alters loading mechanics at the lateral epicondyle and can perpetuate wrist-related elbow pain. Addressing it restores normal forearm biomechanics.',
      priority: 3, goodFor: ['stiff'], triggers: ['training'],
    },
    {
      name: 'Ulnar Nerve Slider',
      duration: '3 min',
      reps: '10 reps × 3 sets, 2× per day',
      focus: 'Ulnar nerve mechanosensitivity (cubital tunnel)',
      phase: 'Release',
      icon: 'pulse-outline',
      howTo: '1. Make an "OK sign" with your thumb and index finger — keep this loop intact through the whole movement.\n2. Bring the OK sign to your eye on the SAME side, like a monocle. As you do this, BEND the elbow and your wrist comes near your face.\n3. Now reverse: extend the elbow out to the side, palm down, while side-bending your head AWAY from the arm.\n4. Alternate smoothly between the two ends — neck and wrist move opposite each other (slider, not tensioner).\n5. Stop and reduce range if symptoms travel further into the 4th-5th fingers.',
      why: 'Coppieters & Butler (Man Ther 2008) defined the slider technique: one end of the nerve loads while the other unloads, restoring mechanosensitivity without provoking neural inflammation. Oskay et al. (J Hand Ther 2010) RCT: ulnar nerve sliders reduced pain and improved function in cubital tunnel syndrome. Indicated for medial elbow pain with 4th-5th finger numbness/burning.',
      priority: 4, goodFor: ['burning', 'sharp'], triggers: ['sitting', 'training', 'sleeping'],
      avoidIfSharp: false,
    },
    {
      name: 'Radial Nerve Slider',
      duration: '3 min',
      reps: '10 reps × 3 sets, 2× per day',
      focus: 'Radial nerve mechanosensitivity (lateral epicondylitis with neural component)',
      phase: 'Release',
      icon: 'pulse-outline',
      howTo: '1. Stand or sit tall. Arm by your side, palm facing back.\n2. ONE END LOAD: depress the shoulder (down and slightly back), straighten the elbow, flex the wrist (palm-down curl), ulnar deviate (pinky toward forearm). Side-bend the head AWAY from the arm.\n3. OTHER END UNLOAD: relax the shoulder, soften the elbow and wrist, side-bend the head TOWARD the arm.\n4. Alternate smoothly — the wrist and head move in opposite phases (slider).\n5. Stop and reduce range if pain or burning travels further into the forearm.',
      why: 'Ekstrom & Holden (Phys Ther 2002) and Ellis & Hing (J Man Manip Ther 2008) systematic review: radial nerve sliders are indicated for radial tunnel syndrome and for lateral epicondylitis presentations with a neural component (burning, radiation, or paresthesias rather than pure mechanical pain). Pair with Tyler Twist when standard tendon loading alone is not enough.',
      priority: 4, goodFor: ['burning', 'sharp'], triggers: ['sitting', 'training'],
      avoidIfSharp: false,
    },
  ],

  // ── ABDOMEN ──────────────────────────────────────────────────────────────────
  abdomen: [
    {
      name: 'Diaphragmatic Breathing',
      duration: '5 min',
      reps: '10 cycles × 3',
      focus: 'Core pressure regulation',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on your back, knees bent, one hand on belly.\n2. Breathe IN slowly for 4 counts — belly rises, chest stays still.\n3. Breathe OUT slowly for 6 counts, letting belly fall.\n4. On the exhale, feel the deep abdominal muscles gently draw in.',
      why: 'The diaphragm is the primary core muscle. When breathing mechanics are disrupted (shallow, chest breathing), intra-abdominal pressure regulation fails, reducing spinal stability during movement. Restoring diaphragmatic breathing is the foundation of all core rehabilitation.',
      priority: 5, goodFor: ['sharp', 'burning', 'dull'], triggers: ['stress', 'lifting', 'training'],
    },
    {
      name: 'Dead Bug',
      duration: '3 min',
      reps: '3 × 8 reps each side',
      focus: 'Deep core stability',
      phase: 'Stability',
      icon: 'git-compare-outline',
      howTo: '1. Lie on your back, arms up, knees at 90° (tabletop).\n2. Press your lower back into the floor — maintain this throughout.\n3. Slowly lower opposite arm and leg toward the floor, exhaling.\n4. Return and switch. Keep the lower back pressed down at all times.',
      why: 'The dead bug is the preferred exercise for rebuilding transversus abdominis (TvA) function after abdominal injury or surgery. It trains the deep core in an anti-extension pattern without trunk flexion, safe for most abdominal conditions.',
      priority: 5, goodFor: ['dull'], triggers: ['lifting', 'training'],
      avoidIfSharp: true,
    },
    {
      name: 'McGill Curl-Up',
      duration: '2 min',
      reps: '3 × 8 reps',
      focus: 'Rectus abdominis (safe)',
      phase: 'Stability',
      icon: 'arrow-up-outline',
      howTo: '1. Lie on your back, one knee bent, one leg straight. Hands under the lower back.\n2. Lift ONLY your head and shoulders 2-3 cm off the floor — NOT a full crunch.\n3. Hold 10 seconds. Lower slowly. Do not flatten your lower back.',
      why: 'The McGill curl-up minimizes lumbar compressive force compared to standard crunches (McGill 2006). The hands under the lower back maintain natural lordosis. This activates rectus abdominis without the dangerous lumbar flexion shear of traditional sit-ups.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'lifting'],
      avoidIfSharp: true,
    },
    {
      name: 'Core Activation Brace',
      duration: '2 min',
      reps: '10 × 10-second holds',
      focus: 'TvA + IAP control',
      phase: 'Activation',
      icon: 'lock-closed-outline',
      howTo: '1. Stand or sit upright.\n2. Take a normal breath in.\n3. On the exhale, gently draw your lower belly inward and upward — like bracing for a punch.\n4. Hold 10 seconds while breathing normally. This should be about 30% effort.\n5. Completely release between reps.',
      why: 'The abdominal brace trains intra-abdominal pressure (IAP) control — the mechanism by which the trunk creates the hydraulic stability that protects the spine during all loaded activities. Learning to maintain this brace during daily tasks significantly reduces abdominal and back pain.',
      priority: 3, goodFor: ['sharp', 'dull'], triggers: ['lifting'],
    },
  ],

  // ── DEFAULT (fallback for unknown or multi-region pain) ─────────────────────
  default: [
    {
      name: "Child's Pose",
      duration: '3 min',
      reps: '60-90 sec holds × 2',
      focus: 'Full posterior chain release',
      phase: 'Mobility',
      icon: 'body-outline',
      howTo: '1. Kneel and sit back toward your heels.\n2. Reach both arms forward on the floor as far as comfortable.\n3. Let your forehead rest on the floor or a pillow.\n4. Breathe deeply into your back — feel it expand with each inhale.',
      why: 'Child\'s Pose decompresses the entire lumbar and thoracic spine simultaneously. The combination of hip flexion, knee flexion and arm reach creates traction through all posterior chain structures. One of the most universally beneficial mobility positions.',
      priority: 5, goodFor: ['stiff', 'dull', 'sharp'], triggers: ['morning', 'sitting'],
    },
    {
      name: "World's Greatest Stretch",
      duration: '3 min',
      reps: '5 reps each side',
      focus: 'Full-body mobility',
      phase: 'Mobility',
      icon: 'globe-outline',
      howTo: '1. Start in a lunge with the front foot flat and back knee on the floor.\n2. Place both hands inside the front foot.\n3. Drop the back knee down for the hip flexor stretch.\n4. Reach the same-side arm as the front foot toward the ceiling, rotating your torso.\n5. Look up at the ceiling as you rotate.',
      why: "Named by strength coaches as the single most efficient mobility drill: simultaneously stretches the hip flexors, thoracic spine, and shoulder in a functional movement pattern. Opens all three planes of motion in one exercise — ideal as a morning routine or pre-activity prep.",
      priority: 4, goodFor: ['stiff'], triggers: ['morning', 'training'],
    },
    {
      name: 'Dead Bug',
      duration: '3 min',
      reps: '3 × 8 each side',
      focus: 'Core stability',
      phase: 'Stability',
      icon: 'git-compare-outline',
      howTo: '1. Lie on back, arms pointing up, knees at 90°.\n2. Press lower back into floor throughout.\n3. Slowly lower opposite arm and leg — exhale.\n4. Return and alternate sides.',
      why: 'Deep core (transversus abdominis) activation protects every joint during movement. Hodges & Richardson showed TvA fires before any limb movement in healthy spines. Dead Bug rebuilds this protective timing pattern.',
      priority: 4, goodFor: ['dull'], triggers: ['training', 'lifting'],
    },
    {
      name: 'Glute Bridge',
      duration: '3 min',
      reps: '3 × 12 reps',
      focus: 'Posterior chain activation',
      phase: 'Activation',
      icon: 'trending-up-outline',
      howTo: '1. Lie on back, knees bent, feet flat.\n2. Drive hips up by pressing through heels.\n3. Squeeze glutes hard at the top for 2 seconds.\n4. Lower slowly over 3 counts.',
      why: 'Glute activation is foundational to all lower extremity and lower back rehabilitation. The glutes are the largest and most powerful muscles in the body — when inhibited (from sitting), compensatory patterns develop that load the spine and joints excessively.',
      priority: 3, goodFor: ['dull', 'stiff'], triggers: ['sitting', 'standing'],
    },
    {
      name: 'Diaphragmatic Breathing',
      duration: '5 min',
      reps: '10 breath cycles × 3',
      focus: 'Nervous system reset',
      phase: 'Activation',
      icon: 'radio-button-on-outline',
      howTo: '1. Lie on back, hand on belly.\n2. Inhale through nose 4 counts — belly rises.\n3. Exhale through mouth 6 counts — belly falls.\n4. This activates the parasympathetic nervous system.',
      why: 'Chronic pain maintains the sympathetic (fight-or-flight) nervous system in an activated state, increasing muscle guarding and pain sensitivity. Slow diaphragmatic breathing activates the parasympathetic system, reducing pain sensitization and muscle tension throughout the body.',
      priority: 3, goodFor: ['sharp', 'burning'], triggers: ['stress'],
    },
  ],
};

// ─── Smart exercise selection ─────────────────────────────────────────────────
// ─── Free-text pain description analyzer ─────────────────────────────────────
// Applies clinical keyword mapping inspired by McKenzie classification,
// Janda muscle-imbalance syndromes, Cyriax end-feel assessment,
// nociceptive vs neuropathic pain classification (IASP), and McGill spine
// biomechanics to extract clinically meaningful signals from a user's
// own words about their pain.
export const analyzePainDescription = (text = '') => {
  if (!text || text.trim().length < 4) return null;

  const t = text.toLowerCase();
  const has = (...words) => words.some(w => t.includes(w));

  const signals = {
    neurological:  false,
    discogenic:    false,
    facetogenic:   false,
    myofascial:    false,
    inflammatory:  false,
    postural:      false,
    sacroiliac:    false,
    acuteOnset:    false,
    centralSensitization: false,
    redFlags:      [],
    insights:      [],
  };

  // ── Neurological / nerve-root involvement ──────────────────────────────────
  // Neuropathic pain descriptors (IASP): burning, electric, shooting; plus
  // dermatomal radiation patterns and allodynia-type descriptors.
  if (has(
    'burning', 'electric', 'shock', 'lightning', 'shooting',
    'pins and needles', 'tingling', 'numb', 'numbness',
    'radiates', 'radiating', 'travels', 'goes down', 'runs down',
    'down my leg', 'down the leg', 'into my leg', 'into my foot',
    'down my arm', 'into my hand', 'into my fingers',
    'sciatica', 'sciatic', 'nerve', 'zaps',
  )) {
    signals.neurological = true;
    signals.insights.push({
      icon: 'pulse-outline',
      color: '#7C5CF0',
      title: 'Nerve pathway involvement',
      text: 'Your description contains neuropathic pain descriptors — burning, electric, radiating, or tingling. These signal that a nerve may be sensitized, compressed at its root, or irritated along its path. Nerve-biased pain responds best to decompression movements and neural mobilization rather than aggressive stretching or heavy loading.',
    });
  }

  // ── Discogenic pain (intervertebral disc) ──────────────────────────────────
  // McKenzie centralisation principle: disc pain worsens in flexion (sitting),
  // improves with extension (walking/standing). Intradiscal pressure is ~40%
  // higher in sitting than standing (Nachemson 1966), and pain with cough/sneeze
  // (Valsalva) confirms discal origin via intradiscal pressure spike.
  if (has(
    'worse sitting', 'sitting makes it', 'after sitting', 'after i sit',
    'worse when i sit', 'desk makes', 'driving makes',
    'better walking', 'better when i walk', 'better standing',
    'worse coughing', 'cough makes', 'sneeze makes', 'when i cough',
    'when i sneeze', 'valsalva',
    'morning is worst', 'worst in the morning', 'first steps', 'first thing',
    'getting out of bed', 'hard to get up',
    'shoots down', 'shoots into',
  )) {
    signals.discogenic = true;
    signals.insights.push({
      icon: 'layers-outline',
      color: '#60A5FA',
      title: 'Discogenic loading pattern',
      text: 'Pain that is significantly worse with sitting and/or coughing, and better with walking, is a hallmark of intervertebral disc involvement. The disc bears 40% more load in flexion than standing. McKenzie extension exercises specifically centralise disc material away from nerve roots — they are first-line for this pattern.',
    });
  }

  // ── Facetogenic pain (zygapophyseal / facet joints) ────────────────────────
  // Facet joints are maximally compressed in extension and ipsilateral
  // rotation. One-sided pain that worsens with backward bending and is
  // relieved by flexion (sitting forward) is the Cyriax pattern for facet
  // irritation. Locking / catching = acute facet fixation.
  if (has(
    'worse bending back', 'worse arching', 'arching hurts', 'worse extending',
    'worse looking up', 'rotation hurts', 'turning makes',
    'worse twisting', 'one side only', 'only on one side', 'just on the left',
    'just on the right', 'right side only', 'left side only',
    'locks', 'catches', 'catch', 'stuck', 'clunks',
    'better sitting forward', 'better leaning forward', 'relief sitting',
    'worse standing long', 'standing makes it worse',
  )) {
    signals.facetogenic = true;
    signals.insights.push({
      icon: 'git-network-outline',
      color: '#818CF8',
      title: 'Facet joint loading pattern',
      text: 'Pain worse with backward bending, rotation, or one-sided — and often relieved by flexion — is the clinical signature of facet joint irritation. The facet joints are compressive structures that bear significant load in extension. Flexion-biased mobility work and deep multifidus stabilisation are the primary interventions.',
    });
  }

  // ── Myofascial trigger points (Travell & Simons) ───────────────────────────
  // Trigger points: hyperirritable loci in taut muscle bands, producing
  // referred pain in predictable patterns. Key descriptors: localised knot,
  // rope-like band, referred ache that spreads to a distant site.
  if (has(
    'knot', 'tight spot', 'tender spot', 'trigger', 'tense',
    'spasm', 'muscle tension', 'referr', 'refers to', 'spreads to',
    'deep ache', 'rope', 'band', 'lump in the muscle',
    'presses and it hurts somewhere else', 'point tender',
  )) {
    signals.myofascial = true;
    signals.insights.push({
      icon: 'body-outline',
      color: '#34D399',
      title: 'Myofascial trigger point pattern',
      text: 'Descriptions of tight knots, ropes, or localised tenderness that refers pain elsewhere are the clinical hallmarks of myofascial trigger points (Travell & Simons). These hyperirritable loci in muscle tissue maintain a pain-spasm-pain cycle. Release techniques combined with targeted strengthening of the inhibited antagonist muscle are the evidence-based approach.',
    });
  }

  // ── Inflammatory pain ─────────────────────────────────────────────────────
  // Inflammatory pain (IASP): worse after rest, morning stiffness >30 min,
  // warmth, swelling. Prolonged morning stiffness is the discriminating
  // feature of inflammatory arthropathy vs mechanical pain (which improves
  // within minutes of moving). Exercise is still first-line but a GP review
  // is warranted if symptoms persist > 6 weeks.
  if (has(
    'swollen', 'swelling', 'puffy', 'hot to touch', 'warm to touch',
    'warm around it', 'inflamed', 'red',
    'stiff for more than', 'stiff for over', 'stiff all morning',
    'morning stiffness', 'takes an hour', 'takes hours to loosen',
    'worse after rest', 'better after moving around',
    'flare up', 'flare-up',
  )) {
    signals.inflammatory = true;
    signals.insights.push({
      icon: 'flame-outline',
      color: '#FB923C',
      title: 'Inflammatory component',
      text: 'Morning stiffness lasting more than 30 minutes, warmth, or swelling around a joint can indicate an active inflammatory process (as distinct from simple mechanical stiffness, which usually resolves within minutes). Gentle movement is still the correct treatment — inflammatory pain responds to graded loading — but if these features persist beyond 6 weeks, a GP visit to rule out inflammatory arthropathy is recommended.',
    });
  }

  // ── Postural / ergonomic loading ───────────────────────────────────────────
  // Janda Upper and Lower Crossed Syndromes: predictable patterns of
  // tightness and weakness caused by sustained static posture. Screen/desk
  // posture = upper crossed. Prolonged sitting = lower crossed.
  if (has(
    'desk', 'computer', 'screen', 'monitor', 'phone', 'driving', 'car',
    'slouch', 'slouching', 'hunched', 'forward head', 'head forward',
    'office', 'sitting all day', 'work from home', 'wfh',
    'keyboard', 'mouse', 'looking down', 'head down',
    'after a long day', 'end of the day',
  )) {
    signals.postural = true;
    signals.insights.push({
      icon: 'desktop-outline',
      color: '#9B8BF4',
      title: 'Postural loading (Janda syndrome)',
      text: 'Your description confirms significant postural loading. Janda\'s crossed syndromes describe predictable muscle tightness and weakness patterns that emerge from sustained static postures — tight hip flexors + weak glutes (lower crossed), tight pecs/neck flexors + weak deep neck flexors and lower traps (upper crossed). Counteracting your specific pattern is the treatment, not rest.',
    });
  }

  // ── Sacroiliac joint involvement ───────────────────────────────────────────
  // SIJ pain is notoriously misdiagnosed as lumbar disc pain. Cluster of
  // Laslett tests: pain at PSIS, Fortin finger sign (patient points to dimple
  // with one finger), worse crossing legs, unilateral buttock pain above knee.
  if (has(
    'tailbone', 'coccyx', 'sacrum', 'si joint', 'sacroiliac',
    'across my back', 'belt line', 'just above my buttock', 'dimple',
    'pelvis', 'pelvic', 'crossing legs hurts', 'climbing stairs',
    'uneven hips', 'hip tilted', 'one leg feels shorter',
  )) {
    signals.sacroiliac = true;
    signals.insights.push({
      icon: 'git-compare-outline',
      color: '#F472B6',
      title: 'Sacroiliac joint pattern',
      text: 'Pain in the dimple area above the buttock — especially if it worsens when crossing legs, climbing stairs, or walking unevenly — is characteristic of SIJ dysfunction. The SI joint is commonly misidentified as lumbar disc pain. It has distinct biomechanics and responds best to SIJ stabilisation exercises targeting the deep gluteals, transverse abdominis, and multifidus.',
    });
  }

  // ── Acute / sudden onset ───────────────────────────────────────────────────
  if (has(
    'sudden', 'suddenly', 'snapped', 'pop', 'popped', 'cracked',
    'accident', 'fell', 'fall', 'crash', 'impact', 'hit',
    'out of nowhere', 'overnight', 'woke up with',
    'lifting and then', 'twisted and', 'moved wrong',
  )) {
    signals.acuteOnset = true;
    signals.insights.push({
      icon: 'alert-circle-outline',
      color: '#FBBF24',
      title: 'Acute onset / sudden mechanism',
      text: 'Sudden-onset pain — whether from a specific movement, a fall, or waking up with it — signals that tissues are in an acute phase. The priority is gentle graded movement to maintain circulation and prevent secondary stiffness, not complete rest (which is now known to delay recovery). Loading begins light and progresses as tolerance improves.',
    });
  }

  // ── Central sensitization markers ─────────────────────────────────────────
  // Central sensitization (Woolf 2011): amplified pain processing by the CNS.
  // Signs: widespread pain, allodynia (light touch hurts), hyperalgesia,
  // pain disproportionate to findings, multiple failed treatments.
  if (has(
    'everywhere', 'whole body', 'all over', 'everything hurts',
    'light touch hurts', 'clothes hurt', 'wind hurts',
    'tried everything', 'nothing helps', 'nothing works',
    'constant no matter what', 'no position helps', 'relentless',
    'pain for years', 'fibro',
  )) {
    signals.centralSensitization = true;
    signals.insights.push({
      icon: 'infinite-outline',
      color: '#F472B6',
      title: 'Possible central sensitization',
      text: 'When pain becomes widespread, is disproportionate to findings, or when many treatments have failed, the nervous system itself may have become sensitized — amplifying pain signals beyond the original tissue source. This is called central sensitization (Woolf 2011). Graded exposure, paced activity, and movement — not rest — are the cornerstone treatments. A pain psychologist working alongside physiotherapy produces the best outcomes.',
    });
  }

  // ── Red flag screening ────────────────────────────────────────────────────
  // Red flags (NICE CG59 / ACP 2017): features that require urgent medical
  // referral before exercise rehabilitation.
  if (has('bladder', 'bowel', 'incontinence', 'wet myself', 'saddle area', 'saddle numb', 'groin numb', 'both legs weak', 'both legs numb')) {
    signals.redFlags.push('Bladder, bowel, or saddle area symptoms alongside back pain can be signs of cauda equina syndrome — a medical emergency. Please seek urgent medical care before starting any exercise program.');
  }
  if (has('cancer', 'tumor', 'tumour', 'malignancy', 'metastasis', 'chemo', 'radiation therapy')) {
    signals.redFlags.push('You mentioned a history of cancer. Pain associated with cancer history requires medical evaluation before rehabilitation to rule out spinal involvement.');
  }
  if (has('night sweat', 'unexplained weight loss', 'lost a lot of weight', 'fever with', 'temperature with')) {
    signals.redFlags.push('Pain accompanied by night sweats, unexplained weight loss, or fever should be medically evaluated to rule out infection or systemic disease.');
  }
  if (has('wakes me', 'woke me', 'waking me up', 'pain at night no matter', 'constant night pain')) {
    signals.redFlags.push('Pain that consistently wakes you from sleep — especially with no position giving relief — can indicate non-mechanical causes that require medical evaluation.');
  }
  if (has('foot drop', 'can\'t lift my foot', 'leg gives way', 'legs collapse', 'progressive weakness', 'getting weaker')) {
    signals.redFlags.push('Progressive muscle weakness — especially foot drop or legs giving way — can indicate significant nerve compression. Please see a doctor or physiotherapist before beginning exercise rehabilitation.');
  }
  if (has('steroid', 'immunosuppres', 'hiv', 'transplant', 'osteoporosis', 'bone density')) {
    signals.redFlags.push('History of long-term steroid use, immunosuppression, or osteoporosis means fracture risk must be considered before loading exercises. Please discuss with your doctor.');
  }

  return signals;
};

export const selectExercises = (onboardingData = {}) => {
  const {
    painLocations = [],
    painTypes = [],
    worstTimeTriggers = [],
    sittingHours = '',
    painDescription = '',
    painDuration = '',
    directionalPreference = '',
    radiatingPain = [],
    redFlags = [],
  } = onboardingData;

  const types = painTypes.length ? painTypes : ['dull'];
  const has = (t) => types.includes(t);

  // Map symptom types to treatment groups
  const isNeuralPain   = has('sharp') || has('radiating') || has('numb');
  const isInflamPain   = has('burning') || has('throbbing');
  const isMobilityPain = has('stiff') || has('cramping');
  const isChronicPain  = has('dull') || has('throbbing');

  // Augment with free-text description signals
  const desc = analyzePainDescription(painDescription);
  const descNeural      = desc?.neurological;
  const descDiscogenic  = desc?.discogenic;
  const descFacetogenic = desc?.facetogenic;
  const descMyofascial  = desc?.myofascial;
  const descPostural    = desc?.postural;
  const descAcute       = desc?.acuteOnset;

  // ─── Clinical signals from dedicated screens ─────────────────────────────
  // Pain duration → drives whether to load tissue or protect it.
  const isAcute     = painDuration === 'acute';
  const isSubacute  = painDuration === 'subacute';
  const isChronic   = painDuration === 'chronic';
  const isRecurrent = painDuration === 'recurrent';

  // Directional preference → centralization / McKenzie classification.
  const flexIntolerant  = directionalPreference === 'flexion';     // worse bending forward → discogenic-leaning
  const extIntolerant   = directionalPreference === 'extension';   // worse bending back → facet/stenosis-leaning
  const rotIntolerant   = directionalPreference === 'rotation';
  const sustainedAggrav = directionalPreference === 'sustained';

  // Radiating pain → neural involvement signal.
  const radList         = Array.isArray(radiatingPain) ? radiatingPain : [];
  const hasNoneRadiating= radList.includes('none') || radList.length === 0;
  const hasAnyRadiating = !hasNoneRadiating;
  const hasSciatic      = radList.includes('below_knee');                          // true sciatica
  const hasArmRad       = radList.includes('arm') || radList.includes('hand');     // cervical radiculopathy
  const hasCervHeadache = radList.includes('headache');

  // Red flags → bias the plan toward gentle, low-load options.
  const flagList = Array.isArray(redFlags) ? redFlags : [];
  const anyRedFlag = flagList.length > 0 && !flagList.every((f) => f === 'none');

  const primaryLoc = painLocations[0] || 'default';
  const libraryKey = normalizeLocation(primaryLoc);
  const pool = EXERCISE_LIBRARY[libraryKey] || EXERCISE_LIBRARY.default;

  const scored = pool.map((ex) => {
    let score = (ex.priority || 3) * 10;
    const focus = (ex.focus || '').toLowerCase();
    const name  = (ex.name  || '').toLowerCase();

    // ─── Pain-type & trigger fit ────────────────────────────────────────────
    if (ex.goodFor?.some(g => types.includes(g))) score += 25;

    if (worstTimeTriggers?.length) {
      const hits = (ex.triggers || []).filter((t) => worstTimeTriggers.includes(t)).length;
      score += hits * 15;
    }

    if ((sittingHours === '6+' || descPostural) && ex.triggers?.includes('sitting')) score += 10;

    // ─── Pain-type penalties ────────────────────────────────────────────────
    if ((isNeuralPain || descNeural || descAcute) && ex.avoidIfSharp) score -= 30;
    if (isInflamPain && ex.avoidIfSharp) score -= 20;

    // ─── Phase × pain-type ──────────────────────────────────────────────────
    if (isMobilityPain && ex.phase === 'Mobility') score += 10;
    if (isChronicPain && (ex.phase === 'Activation' || ex.phase === 'Stability')) score += 8;
    if ((isNeuralPain || descNeural) && ex.phase === 'Release') score += 15;

    // ─── Free-text description signals ──────────────────────────────────────
    if (descDiscogenic && ex.phase === 'Mobility') score += 12;
    if (descDiscogenic && focus.includes('extension')) score += 10;
    if (descFacetogenic && (ex.phase === 'Stability' || ex.phase === 'Activation')) score += 12;
    if (descMyofascial && ex.phase === 'Release') score += 15;
    if (descAcute && ex.phase === 'Strength') score -= 20;
    if (descAcute && (ex.phase === 'Mobility' || ex.phase === 'Release')) score += 10;

    // ─── Pain duration gating ───────────────────────────────────────────────
    // Acute (<6 weeks): protect tissue. Avoid heavy loading and CFT exposure.
    if (isAcute) {
      if (ex.phase === 'Strength')   score -= 25;
      if (ex.phase === 'Exposure')   score -= 30;
      if (ex.phase === 'Mobility' || ex.phase === 'Release') score += 8;
      if (ex.avoidIfSharp)           score -= 15;
    }
    // Subacute (6–12 weeks): bridge. Light loading + activation.
    if (isSubacute) {
      if (ex.phase === 'Activation') score += 6;
      if (ex.phase === 'Strength')   score -= 8;
    }
    // Chronic (>3 months): CFT exposure + strength is the evidence-based treatment.
    // Kent et al., RESTORE trial, The Lancet 2023 (n=1011).
    if (isChronic) {
      if (ex.phase === 'Exposure')   score += 22;
      if (ex.phase === 'Strength')   score += 10;
      if (ex.phase === 'Stability')  score += 6;
    }
    // Recurrent: stability-first, build resilience between flares.
    if (isRecurrent) {
      if (ex.phase === 'Stability')  score += 10;
      if (ex.phase === 'Activation') score += 6;
    }

    // ─── Directional preference (centralization model) ──────────────────────
    // Worse with FLEXION → typically discogenic → load extension, AVOID deep flexion.
    if (flexIntolerant) {
      if (focus.includes('extension')) score += 22;
      if (focus.includes('flexion'))   score -= 12;
      if (name.includes('mckenzie press-up'))    score += 18;
      if (name.includes('cervical retraction'))  score += 10;
      // CFT relaxed-flexion exposure is contraindicated direction in this group.
      if (ex.phase === 'Exposure' && name.includes('flexion')) score -= 22;
    }
    // Worse with EXTENSION → typically facet/stenosis → flexion-bias, no press-ups.
    if (extIntolerant) {
      if (focus.includes('extension')) score -= 18;
      if (name.includes('mckenzie press-up')) score -= 30;
      if (focus.includes('flexion'))   score += 12;
      if (ex.phase === 'Stability')    score += 8;
      if (name.includes('cat-cow') || name.includes('pelvic tilt')) score += 8;
    }
    // Worse with ROTATION → emphasize anti-rotation core stability.
    if (rotIntolerant) {
      if (name.includes('pallof'))     score += 18;
      if (focus.includes('anti-rotation') || focus.includes('rotation')) score += 10;
    }
    // Sustained-position aggravation → mobility breaks + activation cycles.
    if (sustainedAggrav) {
      if (ex.phase === 'Mobility')     score += 6;
      if (ex.triggers?.includes('sitting')) score += 8;
    }

    // ─── Radiating pain → neural-priority bias ──────────────────────────────
    if (hasAnyRadiating) {
      if (ex.phase === 'Release')      score += 12;
      // Heavy end-range loading is less safe in the presence of neural involvement,
      // except for HSR (gradual concentric/eccentric — well-tolerated).
      if (ex.phase === 'Strength' && !name.includes('hsr')) score -= 8;
    }
    // True sciatica (below knee) → sciatic nerve work first; extension bias if not extIntolerant.
    if (hasSciatic) {
      if (name.includes('sciatic'))                            score += 30;
      if (name.includes('mckenzie press-up') && !extIntolerant) score += 12;
      if (focus.includes('hamstring stretch'))                 score -= 10;
    }
    // Cervical radiculopathy (arm/hand) → upper-limb nerve sliders + cervical retraction.
    if (hasArmRad) {
      if (name.includes('median nerve') || name.includes('ulnar nerve') || name.includes('radial nerve')) score += 28;
      if (name.includes('cervical retraction')) score += 18;
      if (libraryKey === 'shoulder' && ex.phase === 'Mobility') score += 6;
    }
    // Cervicogenic headache → suboccipital release + cervical SNAG.
    if (hasCervHeadache) {
      if (name.includes('suboccipital'))                  score += 22;
      if (name.includes('snag') || name.includes('c1-c2')) score += 22;
      if (name.includes('upper trapezius'))               score += 8;
    }

    // ─── Red flags present → conservative bias ──────────────────────────────
    // The user has been warned via modal; if they continued, the plan should
    // still be safe-by-default — avoid heavy loading and graded exposure.
    if (anyRedFlag) {
      if (ex.phase === 'Strength')  score -= 30;
      if (ex.phase === 'Exposure')  score -= 25;
      if (ex.phase === 'Mobility')  score += 10;
      if (ex.phase === 'Release')   score += 10;
      if (ex.avoidIfSharp)          score -= 25;
    }

    return { ...ex, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
};

// ─── Pain condition lookup ─────────────────────────────────────────────────────
export const getPainCondition = (onboardingData = {}) => {
  const { painLocations = [], painTypes = [] } = onboardingData;
  const raw = painLocations[0] || 'default';
  const loc = normalizeLocation(raw);

  // Pick the highest-priority type from what the user selected
  const TYPE_PRIORITY = ['sharp', 'radiating', 'numb', 'burning', 'throbbing', 'stiff', 'cramping', 'dull'];
  // Map new types to the condition keys that exist in CONDITIONS
  const TYPE_TO_CONDITION_KEY = { radiating: 'burning', numb: 'sharp', throbbing: 'dull', cramping: 'stiff' };
  const primaryType = TYPE_PRIORITY.find(t => painTypes.includes(t)) || 'dull';
  const painType = TYPE_TO_CONDITION_KEY[primaryType] || primaryType;

  const CONDITIONS = {
    lower_back: {
      sharp:   { name: 'Lumbar Muscle Strain',          emoji: '⚡', description: 'Sharp lower back pain typically signals a muscle, ligament, or facet joint under sudden stress — triggered by movement, lifting, or awkward posture changes. Highly responsive to targeted rehab.' },
      dull:    { name: 'Lumbar Overload Syndrome',       emoji: '🔄', description: 'Persistent dull lower back ache is the classic sign of muscles working overtime to compensate for weak glutes and tight hip flexors — especially in people who sit for hours daily.' },
      burning: { name: 'Lumbar Nerve Irritation',        emoji: '🔥', description: 'Burning in the lower back often points to nerve root irritation from disc pressure or facet inflammation, sometimes radiating into the glutes or down the legs.' },
      stiff:   { name: 'Lumbar Stiffness / Hip Flexor Syndrome', emoji: '🧱', description: 'Morning or post-sitting stiffness signals tight hip flexors pulling the lumbar spine into compression, combined with reduced spinal segment mobility. Movement is the treatment.' },
      default: { name: 'Non-Specific Lower Back Pain',   emoji: '📍', description: 'Your lower back pattern fits the most common presentation worldwide: a mix of muscle tightness, postural load, and hip/core imbalance. 85% of lower back pain is non-specific — and highly treatable.' },
    },
    upper_back: {
      sharp:   { name: 'Thoracic Facet Irritation',      emoji: '⚡', description: 'Sharp upper back pain — especially between the shoulder blades — often comes from thoracic facet joint stress or a trigger point under load.' },
      dull:    { name: 'Postural Fatigue Syndrome',       emoji: '🔄', description: 'Dull upper back ache is the most common desk-work pain pattern. Your thoracic spine has been locked in forward flexion for hours — the muscles are simply fatigued from the sustained load.' },
      burning: { name: 'Thoracic Nerve Tension',          emoji: '🔥', description: 'Burning between the shoulder blades can indicate thoracic nerve root tension or intercostal nerve irritation, often worsened by forward-head posture.' },
      stiff:   { name: 'Thoracic Hyperkyphosis',          emoji: '🧱', description: 'Upper back stiffness means your thoracic spine has lost its natural segmental mobility — normal in people who spend hours at a desk. Mobility work delivers rapid, significant relief.' },
      default: { name: 'Upper Crossed Syndrome',          emoji: '📍', description: 'Your upper back pattern matches Janda\'s Upper Crossed Syndrome: tight pecs/neck flexors combined with weak lower trapezius and deep neck flexors — a postural compensation seen in almost every desk worker.' },
    },
    neck: {
      sharp:   { name: 'Cervical Facet Strain',           emoji: '⚡', description: 'Sharp neck pain is often a facet joint or muscle strain. The cervical facets are highly pain-sensitive and can become irritated from sustained forward posture, sleeping positions, or sudden movement.' },
      dull:    { name: 'Text Neck Syndrome',               emoji: '📱', description: 'Persistent dull neck aching is the defining modern pain pattern. Every inch your head drops forward adds ~10 lbs of load to your cervical spine (Hansraj 2014). At 60° tilt, that\'s 60 lbs of continuous load.' },
      burning: { name: 'Cervical Nerve Root Irritation',   emoji: '🔥', description: 'Burning neck pain, especially with radiation into the arm or shoulder, suggests cervical nerve root irritation — common at C5-C6 and C6-C7, the most mobile (and most vulnerable) segments.' },
      stiff:   { name: 'Cervical Stiffness + DCF Inhibition', emoji: '🧱', description: 'Neck stiffness — worst in the morning or after screens — signals tight posterior neck muscles and inhibited deep cervical flexors (longus colli). This is the most treatable neck pattern.' },
      default: { name: 'Cervical Dysfunction',             emoji: '📍', description: 'Your neck pattern fits forward-head posture dysfunction — one of the most common and most treatable pain patterns. Deep cervical flexor training and posture work produce consistent, lasting results.' },
    },
    shoulder: {
      sharp:   { name: 'Subacromial Impingement',          emoji: '⚡', description: 'Sharp shoulder pain — especially when raising your arm — typically signals the rotator cuff or bursa being pinched in the subacromial space. Caused by poor scapular mechanics, not "bone spurs."' },
      dull:    { name: 'Rotator Cuff Tendinopathy',        emoji: '🔄', description: 'Dull shoulder aching, especially at the outer arm, is consistent with rotator cuff tendinopathy — overload of the cuff tendons from repetitive use or poor shoulder mechanics.' },
      burning: { name: 'Bursitis / Nerve Tension',         emoji: '🔥', description: 'Burning shoulder pain can indicate subacromial bursitis or brachial plexus tension — both related to poor shoulder positioning and thoracic posture.' },
      stiff:   { name: 'Glenohumeral Stiffness (Capsulitis)', emoji: '🧱', description: 'Shoulder stiffness affecting multiple directions of movement may indicate capsular tightness or early adhesive capsulitis (frozen shoulder). Specific stretching is highly effective in early stages.' },
      default: { name: 'Shoulder Impingement Syndrome',    emoji: '🦾', description: 'Your shoulder pattern is consistent with impingement syndrome — the most common cause of shoulder pain. Scapular stabilizer weakness and posterior capsule tightness are the two main drivers.' },
    },
    knee: {
      sharp:   { name: 'Patellofemoral Pain Syndrome',     emoji: '⚡', description: 'Sharp anterior knee pain — especially during stairs, squatting, or after sitting — is the hallmark of patellofemoral pain. The kneecap is tracking laterally due to VMO weakness and tight lateral structures.' },
      dull:    { name: 'Knee Overuse Tendinopathy',         emoji: '🔄', description: 'Dull knee aching is often patellar tendinopathy or iliotibial band syndrome — overuse injuries where repetitive loading exceeds the tissue\'s capacity to recover.' },
      burning: { name: 'IT Band Friction Syndrome',         emoji: '🔥', description: 'Burning on the outer knee that worsens with repetitive movement (running, cycling) is the classic presentation of IT band friction syndrome.' },
      stiff:   { name: 'Knee Joint Stiffness',              emoji: '🧱', description: 'Knee stiffness, particularly after periods of rest (gelling) or in the morning, is common in patellofemoral or early degenerative joint changes. Movement and loading are key to managing it.' },
      default: { name: 'Patellofemoral Syndrome',           emoji: '🦵', description: 'Your knee pattern points to patellofemoral syndrome — the most common knee condition. Hip weakness and VMO inhibition are the root causes, and they respond exceptionally well to targeted exercise.' },
    },
    hip: {
      sharp:   { name: 'Femoroacetabular Impingement (FAI)', emoji: '⚡', description: 'Sharp hip pain — especially at the front with hip flexion or rotation — suggests FAI, where hip anatomy creates a bony or soft tissue pinch at the joint margin.' },
      dull:    { name: 'Greater Trochanteric Pain Syndrome', emoji: '🔄', description: 'Dull lateral hip pain (outer hip) is typically greater trochanteric pain syndrome — a tendinopathy of the gluteal tendons where they attach to the greater trochanter.' },
      burning: { name: 'Meralgia Paresthetica / Nerve Entrapment', emoji: '🔥', description: 'Burning in the outer thigh or hip can indicate meralgia paresthetica — entrapment of the lateral femoral cutaneous nerve, often caused by tight hip flexors or prolonged sitting.' },
      stiff:   { name: 'Hip Capsule Restriction',            emoji: '🧱', description: 'Hip stiffness in multiple directions typically means hip capsular restriction — particularly posterior capsule tightness and limited internal rotation, which worsens with prolonged sitting.' },
      default: { name: 'Hip Muscle Imbalance',               emoji: '📍', description: 'Your hip pain pattern suggests a combination of hip flexor tightness, gluteal weakness, and restricted hip rotation — a very common pattern in sedentary individuals and athletes alike.' },
    },
    glute: {
      sharp:   { name: 'Piriformis Syndrome',               emoji: '⚡', description: 'Sharp deep gluteal pain, sometimes with radiation down the leg, is characteristic of piriformis syndrome — where the sciatic nerve is compressed by a tight piriformis muscle.' },
      dull:    { name: 'Gluteal Tendinopathy',               emoji: '🔄', description: 'Dull outer hip/buttock pain that worsens with sitting is typically gluteus medius or minimus tendinopathy — an overuse condition of the hip abductor tendons.' },
      burning: { name: 'Deep Gluteal Syndrome',              emoji: '🔥', description: 'Burning in the deep buttock can indicate sciatic nerve irritation from the deep hip rotators or vascular compression — part of deep gluteal syndrome.' },
      stiff:   { name: 'Hip External Rotator Tightness',     emoji: '🧱', description: 'Gluteal stiffness usually reflects tight deep hip rotators (piriformis, obturator internus) — which also reduce hip internal rotation and create compensatory lumbar strain.' },
      default: { name: 'Gluteal Dysfunction',                emoji: '📍', description: 'Your gluteal pain pattern suggests a combination of deep rotator tightness and gluteus medius weakness — a pattern that responds well to targeted stretching and activation work.' },
    },
    hamstring: {
      sharp:   { name: 'Hamstring Strain (Proximal or Mid)',  emoji: '⚡', description: 'Sharp hamstring pain suggests a muscle strain. Proximal strains (at the ischial tuberosity/sitting bone) are particularly common in sprinters and kickers.' },
      dull:    { name: 'Hamstring Tendinopathy',              emoji: '🔄', description: 'Dull hamstring aching — especially at the sitting bone — is proximal hamstring tendinopathy. Aggravated by sitting, lunging, and uphill walking.' },
      burning: { name: 'Sciatic Nerve Tension',               emoji: '🔥', description: 'Burning down the back of the leg from the buttock is classic sciatic nerve referral. The sciatic nerve passes directly through or near the hamstring muscle bellies.' },
      stiff:   { name: 'Hamstring Tightness / Neural Tension', emoji: '🧱', description: 'Persistent hamstring tightness that does not improve with stretching often has a neural component — the sciatic nerve is restricted in its path through the posterior thigh.' },
      default: { name: 'Posterior Thigh Dysfunction',         emoji: '📍', description: 'Your hamstring pattern points to a mix of muscle tightness, neural tension, and possible tendinopathy at the hamstring origin. A multi-component approach addresses all three.' },
    },
    calf: {
      sharp:   { name: 'Calf Muscle Strain',                  emoji: '⚡', description: 'Sharp sudden calf pain — often described as being "hit from behind" — is a gastrocnemius or soleus strain. The medial gastrocnemius head is most commonly affected.' },
      dull:    { name: 'Achilles Tendinopathy / Calf Overload', emoji: '🔄', description: 'Dull posterior lower leg aching is consistent with calf overuse or Achilles tendinopathy — particularly common in runners who increase volume too quickly (10% rule violations).' },
      burning: { name: 'Posterior Compartment Syndrome',       emoji: '🔥', description: 'Burning calf pain that worsens with exercise and resolves with rest can indicate chronic exertional compartment syndrome — elevated pressure in the posterior muscle compartment during activity.' },
      stiff:   { name: 'Calf Tightness / Achilles Restriction', emoji: '🧱', description: 'Morning calf stiffness and reduced ankle dorsiflexion signal calf/Achilles tightness — which overloads the plantar fascia, knee, and lower back as compensation travels up the chain.' },
      default: { name: 'Posterior Lower Leg Syndrome',         emoji: '📍', description: 'Your calf pattern is consistent with a combination of gastrocnemius/soleus tightness and Achilles tendon overload — extremely common in active individuals.' },
    },
    ankle: {
      sharp:   { name: 'Lateral Ankle Sprain',                 emoji: '⚡', description: 'Sharp ankle pain with possible swelling and bruising is typically a lateral ligament sprain (ATFL/CFL). Graded 1-3 by severity — most respond well to progressive loading.' },
      dull:    { name: 'Peroneal Tendinopathy',                 emoji: '🔄', description: 'Dull aching on the outer ankle is often peroneal tendinopathy — the peroneal tendons (the primary ankle stabilizers) become irritated from repetitive loading or after sprains.' },
      burning: { name: 'Ankle Nerve Entrapment',               emoji: '🔥', description: 'Burning ankle pain can involve branches of the sural or superficial peroneal nerve, particularly if you have had previous sprains that caused scar tissue formation.' },
      stiff:   { name: 'Ankle Dorsiflexion Restriction',        emoji: '🧱', description: 'Ankle stiffness — particularly in bending the ankle upward — is the most impactful mobility limitation in the lower extremity, forcing compensatory pronation, knee valgus, and hip/back pain.' },
      default: { name: 'Ankle Instability / Tendinopathy',      emoji: '🦶', description: 'Your ankle pattern suggests residual instability and tendon overload following previous sprains — extremely common and highly responsive to progressive loading and balance training.' },
    },
    achilles: {
      dull:    { name: 'Achilles Tendinopathy',                 emoji: '🔄', description: 'Dull posterior heel/lower calf pain that is worse in the morning and improves with activity (then worsens again) is the classic presentation of Achilles tendinopathy. Excellent prognosis with eccentric loading.' },
      sharp:   { name: 'Achilles Insertional Pain',             emoji: '⚡', description: 'Sharp pain at the heel bone (insertional Achilles tendinopathy) is caused by compressive loading at the calcaneal attachment — different from mid-portion tendinopathy and requires a modified approach.' },
      stiff:   { name: 'Achilles Stiffness',                    emoji: '🧱', description: 'Morning Achilles stiffness — classically, first steps out of bed — signals overnight collagen shortening in a chronically loaded tendon. Gradual warm-up and progressive loading are the key interventions.' },
      default: { name: 'Achilles Tendinopathy',                 emoji: '📍', description: 'Your Achilles pain pattern is the most common and best-studied tendinopathy. Alfredson\'s eccentric protocol has an 82% success rate. Consistent daily loading for 12 weeks is the standard of care.' },
    },
    plantar: {
      sharp:   { name: 'Plantar Fasciitis (Acute Phase)',        emoji: '⚡', description: 'Sharp heel pain — especially with the first steps in the morning — is the classic sign of plantar fasciitis. Overnight shortening of the fascia is aggravated by sudden loading.' },
      dull:    { name: 'Plantar Fasciosis (Chronic)',            emoji: '🔄', description: 'Persistent arch pain that has lasted more than 3 months is likely plantar fasciosis — a degenerative rather than inflammatory condition requiring a loading-based approach rather than rest.' },
      burning: { name: 'Plantar Nerve Entrapment',              emoji: '🔥', description: 'Burning heel or arch pain can involve branches of the medial plantar nerve, particularly if the pain shoots into the toes or is worse with nerve tension positions.' },
      stiff:   { name: 'Plantar Fascia Restriction',             emoji: '🧱', description: 'Morning plantar stiffness and reduced first toe extension are the biomechanical hallmarks of plantar fascia tightness — often accompanied by calf/Achilles restriction forming a tight posterior chain.' },
      default: { name: 'Plantar Fasciitis',                      emoji: '📍', description: 'Plantar fasciitis is the most common cause of heel pain, affecting 10% of people over their lifetime. The combination of calf stretching and plantar fascia loading has the strongest evidence base of any foot condition.' },
    },
    default: {
      default: { name: 'Postural & Movement Dysfunction',         emoji: '⚖️', description: 'Your pain pattern suggests a combination of muscle tightness, joint restriction, and postural compensation. This is the most common and most treatable pain presentation — targeted daily movement reliably delivers meaningful relief within 2–4 weeks.' },
    },
  };

  const locConditions = CONDITIONS[loc] || CONDITIONS.default;
  return locConditions[painType] || locConditions.default || CONDITIONS.default.default;
};

// ─── Root causes ──────────────────────────────────────────────────────────────
export const getCauses = (onboardingData = {}) => {
  const { painLocations = [], painTypes = [], worstTimeTriggers = [], sittingHours, trainingFrequency, painDuration, painDescription = '' } = onboardingData;
  const loc = normalizeLocation(painLocations[0]);
  const desc = analyzePainDescription(painDescription);
  const causes = [];

  if (worstTimeTriggers.includes('sitting') || sittingHours === '6+') {
    causes.push({ icon: 'desktop-outline', text: 'Prolonged sitting compresses lumbar discs at ~2× standing load and progressively shortens the iliopsoas — the muscle most responsible for lower back and hip pain in desk workers (Nachemson 1966).' });
  }
  if (worstTimeTriggers.includes('morning')) {
    causes.push({ icon: 'moon-outline', text: 'Morning pain spikes occur because discs rehydrate overnight, making them more sensitive to the first movements of the day. This is a sign of chemical rather than purely mechanical irritation.' });
  }
  if (worstTimeTriggers.includes('training') || trainingFrequency === 'active') {
    causes.push({ icon: 'barbell-outline', text: 'Training load or movement mechanics are exceeding your tissue\'s current capacity. This doesn\'t mean stop — it means the load needs to be better managed while rebuilding resilience.' });
  }
  if (worstTimeTriggers.includes('lifting')) {
    causes.push({ icon: 'barbell-outline', text: 'Lifting pain typically points to insufficient intra-abdominal pressure bracing, over-reliance on the lower back instead of the posterior chain, or hip mobility limiting your loading mechanics.' });
  }
  if (worstTimeTriggers.includes('sleeping') || worstTimeTriggers.includes('morning')) {
    causes.push({ icon: 'bed-outline', text: 'Sleep-related aggravation suggests sustained joint loading from sleep position — particular to the cervical spine, shoulder, and hip — or disc pressure changes during overnight rest.' });
  }
  if (worstTimeTriggers.includes('stress')) {
    causes.push({ icon: 'pulse-outline', text: 'Psychological stress activates the upper trapezius, scalenes, and levator scapulae through the sympathetic nervous system, creating a pain-tension cycle that can be surprisingly powerful.' });
  }
  if (painTypes?.includes('stiff') || painTypes?.includes('cramping')) {
    causes.push({ icon: 'body-outline', text: 'Joint stiffness and muscle cramping signal reduced synovial fluid circulation and early fascial restriction. Both respond directly to movement — daily mobilization is literally the treatment, not just a symptom manager.' });
  }
  if (painTypes?.includes('burning') || painTypes?.includes('throbbing')) {
    causes.push({ icon: 'flame-outline', text: 'Burning or throbbing pain has a neural and inflammatory component — the nervous system is sensitized around the pain area. Calming the nervous system through gentle loading is as important as addressing the tissue.' });
  }
  if (painTypes?.includes('radiating') || painTypes?.includes('numb')) {
    causes.push({ icon: 'pulse-outline', text: 'Radiating or numb pain indicates nerve involvement — either direct compression, nerve root irritation, or central sensitization. The nerve pathway needs to be decompressed before strength work begins.' });
  }
  if (loc === 'neck' || loc === 'upper_back') {
    causes.push({ icon: 'phone-portrait-outline', text: 'Forward head posture from screens adds ~10 lbs of cervical load per inch of forward shift. At a 60° head tilt (typical phone use), that\'s 60 lbs of continuous load on the cervical spine (Hansraj 2014).' });
  }
  if (painDuration === 'months' || painDuration === 'years') {
    causes.push({ icon: 'time-outline', text: 'Long-standing pain creates compensatory movement patterns as your brain learns to avoid painful positions. These compensation patterns become their own source of pain and need to be deliberately reset through movement re-education.' });
  }
  if (worstTimeTriggers.includes('walking') || worstTimeTriggers.includes('standing')) {
    causes.push({ icon: 'walk-outline', text: 'Pain with weight-bearing activities typically involves a load tolerance deficit — the tissue is not yet resilient enough for the demands placed on it. Progressive loading is the specific solution.' });
  }

  // ── Description-derived causes (highest clinical specificity) ──────────────
  if (desc?.discogenic) {
    causes.push({ icon: 'layers-outline', text: 'Your description suggests a discogenic pattern (McKenzie classification): the disc bears 40% more load in flexion than standing. Extension-biased movement is the primary tool for centralising disc-related pain.' });
  }
  if (desc?.facetogenic) {
    causes.push({ icon: 'git-network-outline', text: 'One-sided pain worse with backward bending or rotation is the Cyriax facet pattern: the small guiding joints between vertebrae are compressed in extension, creating local and referred pain. Deep segmental stabilisation directly reduces this load.' });
  }
  if (desc?.myofascial) {
    causes.push({ icon: 'body-outline', text: 'Trigger points in your description (Travell & Simons): hyperirritable loci in muscle tissue that perpetuate a pain-spasm cycle and refer pain to predictable distant sites. Release of the trigger point plus activation of the inhibited antagonist breaks the cycle.' });
  }
  if (desc?.sacroiliac) {
    causes.push({ icon: 'git-compare-outline', text: 'SIJ dysfunction: the sacroiliac joint transfers load between the spine and pelvis via a form-closure and force-closure mechanism. When the deep stabilisers (transversus abdominis, multifidus, deep gluteals) fail, shear stress at the SIJ increases sharply.' });
  }
  if (desc?.centralSensitization) {
    causes.push({ icon: 'infinite-outline', text: 'Central sensitization (Woolf 2011): prolonged pain rewires the nervous system to amplify pain signals beyond the original tissue source. Graded exposure, movement, and pain education are the evidence-based interventions — the goal is to recalibrate the alarm system, not eliminate all sensation.' });
  }

  // Ensure at least 2 causes
  if (causes.length < 2) {
    causes.push({ icon: 'fitness-outline', text: 'Muscle imbalances between your dominant and stabilizing muscle groups are creating uneven load distribution across the painful area.' });
    causes.push({ icon: 'leaf-outline', text: 'Reduced movement variety — the body thrives on varied movement patterns. Repetitive daily postures and movements without variation contribute to local tissue overload.' });
  }

  return causes.slice(0, 5);
};

// ─── Recovery outlook ─────────────────────────────────────────────────────────
export const getOutlook = (onboardingData = {}) => {
  const { painDuration, painIntensity } = onboardingData;
  if (!painDuration || painDuration === 'just-started' || painDuration === 'weeks') {
    return {
      label: 'High',
      color: '#34D399',
      weeks: '1–2 weeks',
      text: 'Fresh pain responds quickly to targeted movement. Most users with your profile see meaningful improvement within 1–2 weeks of consistent daily practice. You caught this early.',
    };
  }
  if (painDuration === 'months') {
    return {
      label: 'Good',
      color: '#7C5CF0',
      weeks: '3–6 weeks',
      text: 'Subacute pain (weeks to months) has more ingrained patterns but responds well to consistent rehab. Most users see significant relief within 3–6 weeks. Consistency matters more than intensity.',
    };
  }
  return {
    label: 'Achievable',
    color: '#FBBF24',
    weeks: '6–12 weeks',
    text: "Long-term pain has layers — central sensitization, compensation patterns, and tissue changes all need addressing. Many users with years of pain find lasting relief. It takes longer, but the approach is the same: progressive daily loading.",
  };
};
