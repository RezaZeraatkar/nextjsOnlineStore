import React from 'react';
import { auth, currentUser } from '@clerk/nextjs';
import Link from 'next/link';

import Profile from '@/components/Profile';
import { BuildingStoreFrontIcon } from '../common/icons';

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
          <BuildingStoreFrontIcon />
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
