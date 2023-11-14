'use client';
import React from 'react';
import Image from 'next/image';

interface IPhotoCanvasProps {
  url: string;
}

export default function PhotoCanvas({ url }: IPhotoCanvasProps) {
  return (
    <div className='z-0 flex-wrap p-1'>
      {url ? (
        <Image
          src={url}
          alt='image'
          width={100}
          height={100}
          priority
          className='border border-gray-200 p-1'
        />
      ) : null}
    </div>
  );
}
