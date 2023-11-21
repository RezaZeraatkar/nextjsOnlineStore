import { ResponseType } from './../../../types/interfaces/formactions';
import product from '@/services/db/models/product';
import dbConnect from '@/services/db/mongoConnection';
import { IProduct } from '@/types/interfaces/product';
import { NextRequest } from 'next/server';
import { getProduct } from '@/serverActions/getProduct';

// delete a product image for a specific product _id
export async function DELETE(request: Request) {
  let response: ResponseType<IProduct>;
  const { url, productId } = await request.json();

  try {
    await dbConnect();
    await product.updateOne(
      { _id: productId },
      { $pull: { product_images: url } }
    );
    // find the updated document by its _id and assign it to newProduct
    let newProduct: IProduct | null;
    newProduct = await product.findOne({ _id: productId });

    if (newProduct) {
      response = {
        status: 200,
        success: true,
        message: '',
        data: {
          _id: newProduct._id,
          product_name: newProduct?.product_name,
          product_description: newProduct?.product_description,
          product_price: newProduct?.product_price,
          product_images: newProduct?.product_images,
          product_images_public_id: newProduct?.product_images_public_id,
          user: newProduct?.user,
        },
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

// Get a product with a specific product _id
export async function GET(request: NextRequest) {
  let response: ResponseType<IProduct>;
  const productId = request.nextUrl.searchParams.get('productId');

  if (!productId) {
    response = {
      status: 404,
      success: false,
      error: {
        status: 404,
        message: 'Not a specific product Founded!',
      },
    };
    return Response.json(response);
  }
  try {
    const productRes = await getProduct(productId);
    if (productRes.success) {
      response = {
        status: 200,
        success: true,
        message: '',
        data: {
          _id: productRes.data._id.toString(),
          product_name: productRes.data.product_name,
          product_description: productRes.data.product_description,
          product_price: productRes.data.product_price,
          product_images: productRes.data.product_images,
          product_images_public_id: productRes.data.product_images_public_id,
          user: productRes.data.user,
        },
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
