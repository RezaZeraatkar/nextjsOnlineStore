'use client';
import { ReactNode } from 'react';
import {
  // @ts-expect-error
  experimental_useFormStatus as useFormStatus,
} from 'react-dom';
import { Spinner } from '@/components/common/Spinner/spinner';
interface ISubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode | string;
  icon?: ReactNode | string;
  isloading?: boolean;
}

export default function SubmitButton({
  children,
  icon,
  isloading,
  ...props
}: ISubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} disabled={pending} {...props}>
      <div className='flex items-center justify-center'>
        <>{isloading || pending ? <Spinner /> : icon}</>
        {children}
      </div>
    </button>
  );
}
