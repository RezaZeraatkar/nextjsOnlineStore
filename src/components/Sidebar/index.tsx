'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArchiveBoxIcon,
  Cog6ToothIcon,
  HomeIcon,
  ListBulletIcon,
  QueueListIcon,
} from '../common/icons';

interface ISidebarProps {}

export default function Sidebar() {
  const pathname = usePathname();
  const inActiveLink = 'flex gap-1 p-1';
  const activeLink = `${inActiveLink} bg-white text-blue-900 rounded-l-sm`;
  return (
    <nav className='flex w-full flex-col gap-2'>
      <Link
        href='/dashboard'
        className={pathname === '/dashboard' ? activeLink : inActiveLink}
      >
        <HomeIcon />
        <span>Dashboard</span>
      </Link>
      <Link
        href='/dashboard/products'
        className={
          pathname === '/dashboard/products' ? activeLink : inActiveLink
        }
      >
        <ArchiveBoxIcon />
        <span>Products</span>
      </Link>
      <Link
        href='/dashboard/categories'
        className={
          pathname === '/dashboard/categories' ? activeLink : inActiveLink
        }
      >
        <ListBulletIcon />
        <span>Categories</span>
      </Link>
      <Link
        href='/dashboard/orders'
        className={pathname === '/dashboard/orders' ? activeLink : inActiveLink}
      >
        <QueueListIcon />
        <span>Orders</span>
      </Link>
      <Link
        href='/dashboard/settings'
        className={
          pathname === '/dashboard/settings' ? activeLink : inActiveLink
        }
      >
        <Cog6ToothIcon />
        <span>Settings</span>
      </Link>
    </nav>
  );
}
