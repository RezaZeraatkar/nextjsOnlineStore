import { AddProductForm } from '@/components/forms/addProduct';
import Product from '@/services/db/models/product';
import dbConnect from '@/services/db/mongoConnection';
import { IProduct } from '@/types/interfaces/product';

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
    product._id = product._id.toString();
  }

  return <AddProductForm product={product} />;
}
