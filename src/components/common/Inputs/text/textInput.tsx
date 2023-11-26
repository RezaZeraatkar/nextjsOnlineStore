import React, { forwardRef, Ref } from 'react';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  id?: string;
  label?: string;
  error?: string | null;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  function InputElement({ id, label, error, ...props }, ref) {
    return (
      <>
        <label htmlFor={id}>
          {label} <span className='text-red-500'>{error || null}</span>
        </label>
        <input type='text' {...props} ref={ref} />
      </>
    );
  }
);
