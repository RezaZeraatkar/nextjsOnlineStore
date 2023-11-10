'use client';
import React from 'react';

interface IButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | string;
}

export default function Button({ children, ...props }: IButtonProps) {
  return <button {...props}>{children}</button>;
}
