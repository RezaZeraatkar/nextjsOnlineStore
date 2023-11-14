'use client';
import { ReactNode } from 'react';

interface IMultiStepForm {
  step: number;
  showStepNumber: boolean;
  nextStep: () => void;
  prevStep: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isSkipStep: boolean;
  currentElement: ReactNode;
}

export default function MultiStepForm({
  step,
  showStepNumber,
  nextStep,
  prevStep,
  isPrevDisabled,
  isNextDisabled,
  isSkipStep,
  currentElement,
}: IMultiStepForm) {
  return (
    <div className='w-full rounded-md bg-white p-4 shadow-md'>
      {showStepNumber && (
        <p className='mb-4 text-lg font-bold'>Step {step + 1}</p>
      )}
      <div className='mb-4 w-full'>{currentElement}</div>
      <div className='flex justify-between'>
        <button
          onClick={prevStep}
          disabled={isPrevDisabled}
          className={`rounded-md px-4 py-2 ${
            isPrevDisabled
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-900 text-white'
          }`}
        >
          Previous
        </button>
        {isSkipStep ? (
          <button
            onClick={nextStep}
            className='rounded-md bg-blue-900 px-4 py-2 text-white'
          >
            Skip
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`rounded-md px-4 py-2 ${
              isNextDisabled
                ? 'cursor-not-allowed bg-gray-300'
                : 'bg-blue-900 text-white'
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
