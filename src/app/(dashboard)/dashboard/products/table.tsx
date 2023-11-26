import React from 'react';
import Link from 'next/link';

import { IProduct } from '@/types/interfaces/product';
import DeleteBtn from '@/components/common/Buttons/deleteBtn';
import Search from '@/components/search/search';
import Pagination from '@/components/pagination/Pagination';
import { IProductData } from '@/serverActions/getProducts';

export default function Table({ products, count }: IProductData) {
  return (
    <div>
      <div className='flex items-center justify-between rounded-t-md border border-blue-200 p-2'>
        <Search placeholder='Search by product name' />
        <Link className='btn-primary' href='products/new'>
          Add a new product
        </Link>
      </div>
      <table className='basic-table'>
        <thead>
          <tr>
            <th>Product name</th>
            <th>product description</th>
            <th>product price</th>
            <th>actions</th>
          </tr>
        </thead>
        {products.length > 0 ? (
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product._id}>
                  <td>{product.product_name}</td>
                  <td>{product.product_description}</td>
                  <td>{product.product_price}</td>
                  <td>
                    <div className='flex items-center'>
                      <Link href={`/dashboard/products/${product._id}`}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='h-4 w-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                          />
                        </svg>
                        Edit
                      </Link>
                      <DeleteBtn
                        product={{
                          _id: product._id.toString(),
                          product_name: product?.product_name,
                          product_description: product?.product_description,
                          product_price: product.product_price,
                          user: product?.user?.toString(),
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : null}
      </table>
      {products.length <= 0 ? (
        <div className='w-full border border-blue-200 p-1 text-center'>
          No products founded!
        </div>
      ) : null}
      <Pagination count={count} />
    </div>
  );
}
