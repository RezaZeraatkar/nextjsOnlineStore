import React, { Suspense } from 'react';
import Loader from '@/components/common/Loader/loader';
import { getProducts } from '@/serverActions/getProducts';
import Link from 'next/link';
import DeleteBtn from '@/components/common/Buttons/deleteBtn';
import Search from '@/components/search/search';
import Table from '@/components/table/table';
import Pagination from '@/components/pagination/Pagination';
import { IProduct } from '@/types/interfaces/product';

const cols = [
  {
    key: 'name',
    header: 'Product name',
    render: (row: IProduct) => <>{row.product_name}</>,
  },
  {
    key: 'description',
    header: 'Product description',
    render: (row: IProduct) => <>{row.product_description}</>,
  },
  {
    key: 'price',
    header: 'Product price',
    render: (row: IProduct) => <>{row.product_price}</>,
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: IProduct) => (
      <div className='flex items-center'>
        <Link href={`/dashboard/products/${row._id}`}>Edit</Link>
        <DeleteBtn product={row} />
      </div>
    ),
  },
];

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
          <div className='flex items-center justify-between rounded-t-md border border-blue-200 p-2'>
            <Search placeholder='Search by product name' />
            <Link className='btn-primary' href='products/new'>
              Add a new product
            </Link>
          </div>
          <Table columns={cols} data={productsRes?.data?.items} />
          <Pagination count={productsRes?.data?.count} />
        </Suspense>
      </div>
    );
  else return <div>{productsRes.error.message}</div>;
}
