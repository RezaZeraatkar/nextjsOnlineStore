import { AddProductForm } from '@/components/forms/addProduct';
import { getProduct } from '@/serverActions/getProduct';
import Product from '@/services/db/models/product';
import dbConnect from '@/services/db/mongoConnection';
import { IProduct } from '@/types/interfaces/product';
import Link from 'next/link';

export default async function AddProduct({
  params,
}: {
  params: { pid: string };
}) {
  const productId = params.pid;
  let product = {} as IProduct;

  if (productId !== 'new') {
    const productRes = await getProduct(productId);
    if (productRes.success) {
      product = productRes.data;
    } else
      return (
        <div>
          No product Found! Go to{' '}
          <Link className='text-blue-900 underline' href='/dashboard/products'>
            Product Page
          </Link>{' '}
          and create one.
        </div>
      );
  }

  return <AddProductForm product={product} />;
}
