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
    painType: '',        // 'sharp' | 'dull' | 'burning' | 'stiff'
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
      painType: '',
      painDuration: '',
      worstTimeTriggers: [],
      sittingHours: '',
      trainingFrequency: '',
      pastInjuries: '',
      ageRange: '',
    });
    setIsOnboardingComplete(false);
  };

  /**
   * generatePersonalizedPlan — kept for DashboardScreen / RecoveryOverviewCard compatibility.
   * PainProfileScreen and Day1ProtocolScreen now compute their own logic inline
   * using the full onboardingData from context.
   */
  const generatePersonalizedPlan = () => {
    const { painLocations, painIntensity, painDuration, worstTimeTriggers, sittingHours, painType } = onboardingData;

    let patterns = [];

    if (worstTimeTriggers?.includes('sitting') || sittingHours === '6+') {
      patterns.push('Prolonged sitting is compressing your joints and shortening your hip flexors');
    }
    if (painLocations?.includes('lower back')) {
      patterns.push('Weak glutes and tight hip flexors are overloading your lumbar spine');
    }
    if (painLocations?.includes('upper back') || painLocations?.includes('neck')) {
      patterns.push('Forward head posture is adding excess load to your cervical and thoracic spine');
    }
    if (worstTimeTriggers?.includes('training')) {
      patterns.push('Training load or movement mechanics are stressing the affected area');
    }
    if (painType === 'stiff') {
      patterns.push('Reduced joint mobility is limiting your movement and increasing compression');
    }
    if (painDuration === 'months' || painDuration === 'years') {
      patterns.push('Long-standing pain has created compensatory movement patterns that need resetting');
    }

    if (patterns.length === 0) {
      patterns.push('General musculoskeletal imbalance detected across your pain profile');
    }

    return {
      patterns: patterns.slice(0, 3),
      exercises: [],       // Exercises are now driven by Day1ProtocolScreen
      totalDuration: 7,
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
