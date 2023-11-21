import React, { Suspense } from 'react';
import Link from 'next/link';
import Table from './table';
import Loader from '@/components/common/Loader/loader';
import { getProducts } from '@/serverActions/getProducts';

export default async function Products() {
  const productsRes = await getProducts();

  if (productsRes.success)
    return (
      <div className='flex w-full flex-col gap-4'>
        <div>
          <Link className='btn-primary' href='products/new'>
            Add a new product
          </Link>
        </div>
        <Suspense fallback={<Loader />}>
          <Table products={productsRes?.data} />
        </Suspense>
      </div>
    );
  else return <div>{productsRes.error.message}</div>;
}
