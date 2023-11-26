'use client';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../common/Inputs/text/textInput';
import { SearchIcon } from '../common/icons';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SpinnerCircular } from 'spinners-react';

interface ISeachProps {
  placeholder: string;
}

export default function Seach({ placeholder }: ISeachProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = useMemo(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    return newParams;
  }, [searchParams]);

  params.set('page', '1');
  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value && e.target.value.length > 2) {
        setIsLoading(true);
        params.set('q', e.target.value);
      } else params.delete('q');
      replace(`${pathname}?${params}`);
    },
    500
  );

  useEffect(() => {
    setIsLoading(false);
  }, [params]);

  return (
    <div className='relative flex'>
      <div className='absolute left-2 top-2.5 h-4 w-4 text-gray-400'>
        {isLoading ? <SpinnerCircular size={18} /> : <SearchIcon />}
      </div>
      <TextInput
        placeholder={placeholder}
        className='p-1 pl-8'
        onChange={handleSearch}
      />
    </div>
  );
}
