import React, { Suspense } from 'react';
import Link from 'next/link';
import dbConnect from '@/services/db/mongoConnection';
import product from '@/services/db/models/product';
import { IProduct } from '@/types/interfaces/product';
import Table from './table';
import Loader from '@/components/common/Loader/loader';

export default async function Products() {
  // connection to atlas mongodb
  await dbConnect();
  // get products
  const products: IProduct[] = await product.find().lean();

  return (
    <div className='flex w-full w-full flex-col gap-4'>
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
