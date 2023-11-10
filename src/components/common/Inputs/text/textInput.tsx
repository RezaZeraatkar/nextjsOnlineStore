import React from 'react';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
  error: string | null;
}

export const TextInput: React.FC<InputProps> = ({
  id,
  label,
  error,
  ...props
}) => (
  <>
    <label htmlFor={id}>
      {label} <span className='text-red-500'>{error || null}</span>
    </label>
    <input type='text' id={id} {...props} />
  </>
);
