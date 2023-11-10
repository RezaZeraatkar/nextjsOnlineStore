import React from 'react';
import { UserButton } from '@clerk/nextjs';

interface IindexProps {}

export default function index() {
  return (
    <div className='flex'>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: 'w-12 h-12',
            'userButtonAvatarBox img': 'w-12 h-12',
          },
        }}
        afterSignOutUrl='/'
      />
    </div>
  );
}
