import { NextRequest } from 'next/server';
import { ResponseType } from '@/types/interfaces/formactions';
import { IProduct } from '@/types/interfaces/product';
import { getProducts } from '@/serverActions/getProducts';

// Get a product with a specific product _id
export async function GET(request: NextRequest) {
  let response: ResponseType<IProduct[]>;

  try {
    const productsRes = await getProducts();
    if (productsRes.success) {
      response = {
        status: 200,
        success: true,
        message: 'Products founded successfully!',
        data: productsRes.data,
      };
      return Response.json(response);
    } else {
      response = {
        status: 404,
        success: false,
        error: {
          status: 404,
          message: 'No product Founded!',
        },
      };
      return Response.json(response);
    }
  } catch (error) {
    console.error(error);
    response = {
      status: 500,
      success: false,
      error: {
        status: 500,
        message: 'Apologies! Something wen wrong on the server :( ',
      },
    };
    return Response.json(response);
  }
}
