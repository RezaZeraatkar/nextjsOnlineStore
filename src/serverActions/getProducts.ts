'use server';

import { ResponseType } from '@/types/interfaces/formactions';
import Product from '@/services/db/models/product';
import { IProduct } from '@/types/interfaces/product';
import CollectionFactory, { IData } from '@/lib/collectionFactory';

export const getProducts = async (
  q: string,
  page: string
): Promise<ResponseType<IData<IProduct>>> => {
  try {
    const productFactory = new CollectionFactory<IProduct>(Product, 'products');
    return await productFactory.getItems(q, page, 'product_name');
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error: {
        status: 500,
        message: `Server Error. products cannot be fetched!`,
      },
    };
  }
};
