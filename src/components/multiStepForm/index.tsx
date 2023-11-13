import React, { useState, ReactNode } from 'react';

interface IMultiStepFormProps {
  showStepNumber: boolean;
  forms: ReactNode[];
}

export default function MultiStepForm({
  forms,
  showStepNumber,
}: IMultiStepFormProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < forms.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className='w-full rounded-md bg-white p-4 shadow-md'>
      {showStepNumber && (
        <p className='mb-4 text-lg font-bold'>Step {step + 1}</p>
      )}
      <div className='mb-4 w-full'>{forms[step]}</div>
      <div className='flex justify-between'>
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`rounded-md px-4 py-2 ${
            step === 0
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white'
          }`}
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={step === forms.length - 1}
          className={`rounded-md px-4 py-2 ${
            step === forms.length - 1
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
