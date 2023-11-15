import React, { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/services/db/mongoConnection';
import product from '@/services/db/models/product';
import { IProduct } from '@/types/interfaces/product';
import Table from './table';
import Loader from '@/components/common/Loader/loader';
import { IUser } from '@/types/interfaces/user';
import user from '@/services/db/models/user';
import { auth } from '@clerk/nextjs';

export default async function Products() {
  // connection to atlas mongodb
  await dbConnect();
  // get user _id
  const { userId } = auth();
  if (!userId) {
    // redirect user back to home page and destroy the current session
    throw new Error("You have to signup first!");
  }
  const currentUser: IUser[] = await user.find({ userId }).lean();
  // get products
  const products: IProduct[] = await product.find({ user: currentUser }).lean();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <Link className='btn-primary' href='products/new'>
          Add a new product
        </Link>
      </div>
      <Suspense fallback={<Loader />}>
        <Table products={products} />
      </Suspense>
    </div>
  );
}
