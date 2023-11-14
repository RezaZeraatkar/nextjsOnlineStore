'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface FormSteps {
  element: ReactNode;
  options: {
    skip: boolean;
  };
}

interface InisialConfig {
  showStepNumber: boolean;
  onSuccessGoToNext?: boolean;
  onSuccessDisablePreviousStep?: boolean;
  goToNextStepEnable?: boolean;
  goToPreviousStepEnable?: boolean;
}

export const useMultiStepForm = (
  formSteps: FormSteps[],
  initialConfig: InisialConfig
) => {
  const [step, setStep] = useState(0);
  const {
    showStepNumber = false,
    goToNextStepEnable = true,
    goToPreviousStepEnable = true,
    onSuccessDisablePreviousStep = false,
    onSuccessGoToNext = false,
  } = initialConfig;

  const nextStep = () => {
    if (step < formSteps.length - 1 && goToNextStepEnable) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0 && goToPreviousStepEnable && !onSuccessDisablePreviousStep) {
      setStep(step - 1);
    }
  };

  const isPrevDisabled =
    step === 0 || !goToPreviousStepEnable || onSuccessDisablePreviousStep;
  const isNextDisabled = step === formSteps.length - 1 || !goToNextStepEnable;
  const isSkipStep = formSteps[step].options?.skip || false;

  return {
    step,
    showStepNumber,
    nextStep,
    prevStep,
    isPrevDisabled,
    isNextDisabled,
    isSkipStep,
    currentElement: formSteps[step].element,
  };
};
