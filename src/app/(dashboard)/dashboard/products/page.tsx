import React, { Suspense } from 'react';
import Table from '@/app/(dashboard)/dashboard/products/table';
import Loader from '@/components/common/Loader/loader';
import { getProducts } from '@/serverActions/getProducts';

export default async function Products({
  searchParams,
}: {
  searchParams: {
    q: string | null;
    page: string | null;
  };
}) {
  const q = searchParams?.q || '';
  const page = searchParams?.page || '1';
  const productsRes = await getProducts(q, page);

  if (productsRes.success)
    return (
      <div className='flex w-full flex-col'>
        <Suspense fallback={<Loader />}>
          <Table
            products={productsRes?.data?.products}
            count={productsRes?.data?.count}
          />
        </Suspense>
      </div>
    );
  else return <div>{productsRes.error.message}</div>;
}
