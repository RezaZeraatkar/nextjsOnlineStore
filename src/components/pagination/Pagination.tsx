'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ITEMS_PER_PAGE } from '@/globalVars';
import { SpinnerRoundOutlined } from 'spinners-react';

interface IPaginationProps {
  count: number;
}

export default function Pagination({ count }: IPaginationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonType, setButtonType] = useState('');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const page = params.get('page') || '1';

  const hasPrev = ITEMS_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext =
    ITEMS_PER_PAGE * (parseInt(page) - 1) + ITEMS_PER_PAGE < count;

  const handleChangePage = (type: 'prev' | 'next') => {
    setIsLoading(true);
    setButtonType(type);
    type === 'prev'
      ? params.set('page', String(parseInt(page) - 1))
      : params.set('page', String(parseInt(page) + 1));
    replace(`${pathname}?${params}`);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [page]);

  return (
    <div className='flex items-center justify-between border border-t-0 border-blue-200 p-2 py-1'>
      <button
        className={!hasPrev ? `btn-disabled` : `btn-primary`}
        disabled={!hasPrev}
        onClick={() => handleChangePage('prev')}
      >
        {isLoading && buttonType === 'prev' ? (
          <SpinnerRoundOutlined size={24} color='white' />
        ) : (
          'Prev'
        )}
      </button>
      <button
        className={!hasNext ? `btn-disabled` : `btn-primary`}
        disabled={!hasNext}
        onClick={() => handleChangePage('next')}
      >
        {isLoading && buttonType === 'next' ? (
          <SpinnerRoundOutlined size={24} color='white' />
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
}
