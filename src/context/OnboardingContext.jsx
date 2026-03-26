import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    painLocations: [],
    painIntensity: 5,
    painDuration: '',
    worstTimeTriggers: [],
    sittingHours: '',
    trainingFrequency: '',
    pastInjuries: '',
    ageRange: '',
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const updateOnboardingData = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    setOnboardingData({
      painLocations: [],
      painIntensity: 5,
      painDuration: '',
      worstTimeTriggers: [],
      sittingHours: '',
      trainingFrequency: '',
      pastInjuries: '',
      ageRange: '',
    });
    setIsOnboardingComplete(false);
  };

  const generatePersonalizedPlan = () => {
    // Mock AI logic - maps user inputs to personalized plan
    const { painLocations, painIntensity, painDuration, worstTimeTriggers, sittingHours } = onboardingData;
    
    let patterns = [];
    let exercises = [];

    // Analyze pain locations
    if (painLocations.includes('lower back')) {
      patterns.push('Tight hip flexors from prolonged sitting');
      patterns.push('Weak glutes causing lower back overload');
      exercises.push({ name: 'Hip Flexor Stretch', duration: '2 min', focus: 'Hip mobility' });
      exercises.push({ name: 'Glute Bridge', duration: '3 min', focus: 'Glute activation' });
    }
    if (painLocations.includes('upper back') || painLocations.includes('shoulders')) {
      patterns.push('Forward head posture from desk work');
      patterns.push('Tight chest muscles pulling shoulders forward');
      exercises.push({ name: 'Chin Tuck', duration: '2 min', focus: 'Neck alignment' });
      exercises.push({ name: 'Doorway Chest Stretch', duration: '2 min', focus: 'Chest opening' });
    }
    if (painLocations.includes('neck')) {
      patterns.push('Text neck from phone usage');
      exercises.push({ name: 'Neck Side Stretch', duration: '2 min', focus: 'Neck mobility' });
    }
    if (painLocations.includes('hips')) {
      patterns.push('Hip flexor tightness from sitting');
      exercises.push({ name: 'Pigeon Pose', duration: '3 min', focus: 'Hip opening' });
    }

    // Analyze triggers
    if (worstTimeTriggers.includes('sitting') && sittingHours === '6+ hours') {
      patterns.push('Postural fatigue from extended sitting');
      exercises.push({ name: 'Seated Spinal Twist', duration: '2 min', focus: 'Spine mobility' });
    }

    // Default exercises if none selected
    if (exercises.length === 0) {
      exercises = [
        { name: 'Cat-Cow Stretch', duration: '2 min', focus: 'Spine mobility' },
        { name: 'Child\'s Pose', duration: '2 min', focus: 'Back release' },
        { name: 'Pelvic Tilt', duration: '2 min', focus: 'Core stability' },
      ];
    }

    // Limit to 3 exercises for 7-minute routine
    exercises = exercises.slice(0, 3);

    return {
      patterns: patterns.length > 0 ? patterns : ['General postural imbalance detected'],
      exercises,
      totalDuration: exercises.reduce((sum, ex) => sum + parseInt(ex.duration), 0),
    };
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        isOnboardingComplete,
        completeOnboarding,
        resetOnboarding,
        generatePersonalizedPlan,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
