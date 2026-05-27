import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getInstallId } from '../services/deviceId';
import { skipOnboarding, seedSampleProfile, DEV_SAMPLE_PROFILE } from '../constants/devConfig';

const OnboardingContext = createContext();

// The blank pain profile every new user starts with. Kept at module scope so
// both the initial state and resetOnboarding() share one source of truth.
const DEFAULT_ONBOARDING_DATA = {
  painLocations: [],
  painIntensity: 5,
  painTypes: [],
  painDescription: '',
  painDuration: '',
  directionalPreference: '',
  radiatingPain: [],
  redFlags: [],
  worstTimeTriggers: [],
  sittingHours: '',
  trainingFrequency: '',
  pastInjuries: '',
  ageRange: '',
  email: '',
  // 'female' | 'male' — chosen via the BodyMap sex toggle on PainLocation step.
  // Drives which silhouette is shown. Defaults to female; user can change any time.
  sex: 'female',
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  // In a dev preview mode (main-app or screen-catalog), start with a sample
  // profile so the screens that need pain data have realistic content.
  const [onboardingData, setOnboardingData] = useState(
    seedSampleProfile
      ? { ...DEFAULT_ONBOARDING_DATA, ...DEV_SAMPLE_PROFILE }
      : { ...DEFAULT_ONBOARDING_DATA }
  );

  // skipOnboarding boots the app straight into the main app (dev only).
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(skipOnboarding);
  const [installId, setInstallId] = useState(null);

  const upsertProfile = useMutation(api.users.upsertProfile);

  useEffect(() => {
    getInstallId().then(setInstallId);
  }, []);

  const updateOnboardingData = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    if (installId) {
      upsertProfile({
        installId,
        painLocations: onboardingData.painLocations,
        painIntensity: onboardingData.painIntensity,
        painTypes: onboardingData.painTypes,
        painDescription: onboardingData.painDescription || undefined,
        worstTimeTriggers: onboardingData.worstTimeTriggers,
        sittingHours: onboardingData.sittingHours || undefined,
        trainingFrequency: onboardingData.trainingFrequency || undefined,
        ageRange: onboardingData.ageRange || undefined,
        email: onboardingData.email || undefined,
        painDuration: onboardingData.painDuration || undefined,
        directionalPreference: onboardingData.directionalPreference || undefined,
        radiatingPain: onboardingData.radiatingPain?.length ? onboardingData.radiatingPain : undefined,
        redFlags: onboardingData.redFlags?.length ? onboardingData.redFlags : undefined,
        sex: onboardingData.sex || undefined,
      }).catch((e) => console.error('[OnboardingContext] Failed to save profile:', e));
    }
  };

  const resetOnboarding = () => {
    setOnboardingData({ ...DEFAULT_ONBOARDING_DATA });
    setIsOnboardingComplete(false);
  };

  const generatePersonalizedPlan = () => {
    const { painLocations, painIntensity, painDuration, worstTimeTriggers, sittingHours, painTypes = [] } = onboardingData;

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
    if (painTypes.includes('stiff') || painTypes.includes('cramping')) {
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
      exercises: [],
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
        installId,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
