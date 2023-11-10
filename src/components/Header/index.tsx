import React from 'react';
import { auth, currentUser } from '@clerk/nextjs';
import Link from 'next/link';

import Profile from '@/components/Profile';

interface IindexProps {}

export default async function Header() {
  // Get the userId from auth() -- if null, the user is not logged in
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to logged in users
  }

  // Get the User object when you need access to the user's information
  const user = await currentUser();
  return (
    <div className='m-0 flex items-center p-0'>
      <div className='w-64'>
        <Link href='/dashboard' className='flex'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z'
            />
          </svg>
          <span>OnlineShopAdmin</span>
        </Link>
      </div>
      <div className='flex w-full flex-grow items-center justify-between'>
        <div>
          Wellcome {user?.firstName} {user?.lastName}
        </div>
        <Profile />
      </div>
    </div>
  );
}
