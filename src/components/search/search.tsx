'use client';
import React, { ChangeEvent } from 'react';
import { TextInput } from '../common/Inputs/text/textInput';
import { SearchIcon } from '../common/icons';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface ISeachProps {
  placeholder: string;
}

export default function Seach({ placeholder }: ISeachProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value)
        e.target.value.length > 2 && params.set('q', e.target.value);
      else params.delete('q');
      replace(`${pathname}?${params}`);
    },
    500
  );

  return (
    <div className='relative flex'>
      <SearchIcon className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
      <TextInput
        placeholder={placeholder}
        className='p-1 pl-8'
        onChange={handleSearch}
      />
    </div>
  );
}
