'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface IPaginationProps {
  count: number;
}

export default function Pagination({ count }: IPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const page = params.get('page') || '1';
  const ITEMS_PER_PAGE = 5;

  const hasPrev = ITEMS_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext =
    ITEMS_PER_PAGE * (parseInt(page) - 1) + ITEMS_PER_PAGE < count;

  const handleChangePage = (type: 'prev' | 'next') => {
    type === 'prev'
      ? params.set('page', String(parseInt(page) - 1))
      : params.set('page', String(parseInt(page) + 1));
    replace(`${pathname}?${params}`);
  };

  return (
    <div className='flex items-center justify-between border border-t-0 border-blue-200 p-2 py-1'>
      <button
        className={!hasPrev ? `btn-disabled` : `btn-primary`}
        disabled={!hasPrev}
        onClick={() => handleChangePage('prev')}
      >
        Prev
      </button>
      <button
        className={!hasNext ? `btn-disabled` : `btn-primary`}
        disabled={!hasNext}
        onClick={() => handleChangePage('next')}
      >
        Next
      </button>
    </div>
  );
}
