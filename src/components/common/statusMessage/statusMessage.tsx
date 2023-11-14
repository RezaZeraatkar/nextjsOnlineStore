import React, { ReactNode } from 'react';

function StatusMessage({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-black bg-opacity-50'>
      <div className='rounded bg-white p-4 text-center shadow-lg'>
        {children}
      </div>
    </div>
  );
}

export default StatusMessage;
