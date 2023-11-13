'use server';

import { safeParser } from '@/lib/zodSafeParser';
import Product from '@/services/db/models/product';
import dbConnect from '@/services/db/mongoConnection';
import { ResponseType } from '@/types/interfaces/formactions';
import { IProduct, productSchema } from '@/types/interfaces/product';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import {
  ICloudinaryImageUploadResponse,
  ICloudinarySignature,
} from '@/types/interfaces/cloudinary';

export async function createOrUpdateProduct(
  productId: string | null | undefined,
  prevState: any,
  formData: FormData
): Promise<ResponseType<IProduct>> {
  // data validation
  const result = safeParser<IProduct>(productSchema, formData);

  if (result.error) {
    // return the error to the client
    return {
      success: false,
      status: 400,
      error: {
        status: 400,
        message: 'Invalid Inputs!',
        fields: result?.errorData,
      },
    };
  }

  const data = result?.data;

  try {
    // connection to atlas mongodb
    await dbConnect();

    // create or update
    let productDoc: IProduct;
    if (!productId) {
      productDoc = await Product.create(data);
      revalidatePath('/products');
      return {
        success: true,
        status: 200,
        data: {
          _id: productDoc._id.toString(),
          product_name: productDoc?.product_name,
          product_description: productDoc?.product_description,
          product_price: productDoc?.product_price,
        },
        message: `Product ${data?.product_name} added successfully`,
      };
    } else {
      productDoc = await Product.findOneAndUpdate(
        { _id: productId }, // filter
        { $set: data }, // update
        { upsert: true, new: true } // options
      );
      revalidatePath('/products');
      return {
        success: true,
        status: 200,
        data: {
          _id: productDoc._id.toString(),
          product_name: productDoc?.product_name,
          product_description: productDoc?.product_description,
          product_price: productDoc?.product_price,
        },
        message: `Product ${data?.product_name} updated successfully`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      status: 500,
      error: {
        status: 500,
        message: 'Failed to create or update Product',
      },
    };
  }
}
// action to Delete a product
export async function deleteProduct(
  product: IProduct
): Promise<ResponseType<IProduct>> {
  try {
    // create or update
    if (!product._id) {
      return {
        success: false,
        status: 404,
        error: {
          message:
            'Product Not Founded Successfully. It may be deleted from the Database!',
          status: 404,
        },
      };
    } else {
      // connection to atlas mongodb
      await dbConnect();
      await Product.deleteOne({ _id: product?._id });
      revalidatePath(`/products?product_name=${product?.product_name}`);
      return {
        success: true,
        status: 200,
        data: {
          _id: product?._id,
          product_name: product?.product_name,
          product_description: product?.product_description,
          product_price: 10,
        },
        message: `Product ${product?.product_name} deleted successfully`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      status: 500,
      error: {
        status: 500,
        message: 'Failed to delete Product',
      },
    };
  }
}

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
    },
    process.env.CLOUDINARY_API_SECRET!
  );
  const resonse: ICloudinarySignature = { timestamp, signature };

  return resonse;
}

export async function saveToDatabase(
  imgData: (ICloudinaryImageUploadResponse | undefined)[]
) {
  const cloudinary_secret_key = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinary_secret_key) {
    throw new Error('cloudinary secret key is undefined!');
  }
  // verify the data
  // const expectedSignature = cloudinary.utils.api_sign_request(
  //   { public_id, version },
  //   cloudinary_secret_key
  // );

  // if (expectedSignature === signature) {
  //   // safe to write to database
  //   console.log({ url });
  // }
}
