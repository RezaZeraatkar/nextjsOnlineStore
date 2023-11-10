'use client';
import { ReactNode } from 'react';
import {
  // @ts-expect-error
  experimental_useFormStatus as useFormStatus,
} from 'react-dom';
import { Spinner } from '@/components/common/Spinner/spinner';
interface ISubmitButtonProps
  extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  children: ReactNode | string;
}

export default function SubmitButton({
  children,
  ...props
}: ISubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type='submit' aria-disabled={pending} disabled={pending} {...props}>
      <>{pending && <Spinner />}</>
      <>{children}</>
    </button>
  );
}
