import { AddProductForm } from '@/components/forms/addProduct';
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
    // fetch product data for productId
    await dbConnect();
    product = (await Product.findById(productId).lean()) as IProduct;
    if (product) {
      product.user = product?.user.toString();
      product._id = product?._id.toString();
    } else
      return (
        <div>
          No products Found! Go to{' '}
          <Link className='text-blue-900 underline' href='/dashboard/products'>
            Product Page
          </Link>{' '}
          and create one.
        </div>
      );
  }

  return <AddProductForm product={product} />;
}
