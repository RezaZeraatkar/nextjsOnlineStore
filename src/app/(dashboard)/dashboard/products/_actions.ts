'use server';
import { auth, currentUser } from '@clerk/nextjs';
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
import user from '@/services/db/models/user';
import { IUser } from '@/types/interfaces/user';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type CloudinaryEnpointTypes = 'delete' | 'upload';

// Cloudinary functions
export const getCloudinaryConfig = (endpointType: CloudinaryEnpointTypes) => {
  const endpoint =
    endpointType === 'upload'
      ? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
      : process.env.NEXT_PUBLIC_CLOUDINARY_DELETE_URL;
  const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const cloudinary_folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  return { endpoint, api_key, cloudinary_folder };
};

export async function createOrUpdateProduct(
  { productId, step }: { productId: string | null | undefined; step: number },
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

  if (!data)
    return {
      success: false,
      status: 400,
      error: {
        status: 400,
        message: 'Invalid Inputs!',
        fields: result?.errorData,
      },
    };

  // got the userId from the session
  const { userId } = auth();
  if (!userId) {
    // redirect user back to home page and destroy the current session
    return {
      success: false,
      status: 401,
      error: {
        status: 401,
        message: 'User is not logged in!',
      },
    };
  }

  const userDoc = (await user.findOne({ userId: userId })) as IUser;
  if (!userDoc) {
    return {
      success: false,
      status: 404,
      error: {
        status: 404,
        message: 'User not found. you have to signup again.',
      },
    };
  }

  const user_id = userDoc._id;

  try {
    // connection to atlas mongodb
    await dbConnect();

    // create or update
    let productDoc: IProduct;
    if (!productId) {
      productDoc = await Product.create({ ...data, user: user_id });
      revalidatePath('/products');
      return {
        success: true,
        status: 200,
        data: {
          _id: productDoc._id.toString(),
          product_name: productDoc?.product_name,
          product_description: productDoc?.product_description,
          product_price: productDoc?.product_price,
          user: productDoc?.user?.toString(),
        },
        metadata: {
          step: step,
        },
        message: `Product ${data?.product_name} added successfully.`,
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
          user: productDoc?.user?.toString(),
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
          _id: product?._id?.toString(),
          product_name: product?.product_name,
          product_description: product?.product_description,
          product_price: 10,
          user: product?.user?.toString(),
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
  imgData: (ICloudinaryImageUploadResponse | undefined)[],
  productId: string
): Promise<ResponseType<IProduct>> {
  const cloudinary_secret_key = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinary_secret_key) {
    throw new Error('cloudinary secret key is undefined!');
  }
  // verify the data
  const verifiedImgUrls = imgData.map((photo) => {
    if (photo) {
      const expectedSignature = cloudinary.utils.api_sign_request(
        { public_id: photo.public_id, version: photo.version },
        cloudinary_secret_key
      );
      if (expectedSignature === photo.signature) {
        // safe to write to database
        return { url: photo.url, public_id: photo.public_id };
      }
    }
  });

  // update the product document in db with these images
  if (verifiedImgUrls.length > 0) {
    // Filter out items where url or public_id is undefined or null
    const filteredImgUrls = verifiedImgUrls.filter(
      (item): item is { url: string; public_id: string } =>
        typeof item?.url === 'string' && typeof item?.public_id === 'string'
    );

    try {
      // connect to database
      await dbConnect();
      // first remove all the products on the cloudinary
      // 1. select all the product images from databse
      const product: IProduct | null = await Product.findById(productId);

      if (product) {
        // Separate the urls and public_ids into two arrays
        const product_images = filteredImgUrls.map((item) => item?.url);
        const product_images_public_id = filteredImgUrls.map(
          (item) => item?.public_id
        );
        // Append new images to the existing ones
        let newProductData: {
          product_images: string[];
          product_images_public_id: string[];
        };
        if (
          product?.product_images !== undefined &&
          product?.product_images?.length > 0 &&
          product?.product_images_public_id !== undefined &&
          product?.product_images_public_id?.length > 0 &&
          product_images.length > 0
        ) {
          newProductData = {
            product_images: [...product.product_images, ...product_images],
            product_images_public_id: [
              ...product.product_images_public_id,
              ...product_images_public_id,
            ],
          };
        } else {
          newProductData = {
            product_images: product_images,
            product_images_public_id: product_images_public_id,
          };
        }

        // 3. update product image public ids and urls
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          newProductData,
          { new: true }
        );
        if (updatedProduct._id) {
          return {
            success: true,
            status: 201,
            data: {
              _id: updatedProduct._id.toString(),
              product_name: updatedProduct.product_name,
              product_description: updatedProduct.product_name,
              product_price: updatedProduct.product_price,
              user: updatedProduct?.user?.toString(),
            },
            message: 'Images Uploaded Successfully',
          };
        } else {
          return {
            success: false,
            status: 404,
            error: {
              status: 404,
              message:
                'No product founded to udpdate. please create product first!',
            },
          };
        }
      } else {
        return {
          success: false,
          status: 404,
          error: {
            status: 404,
            message: 'No product founded',
          },
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        status: 500,
        error: {
          status: 500,
          message: 'faild to update images for this product for this product',
        },
      };
    }
  } else {
    // there is no images. return
    return {
      success: false,
      status: 404,
      error: {
        status: 404,
        message: 'No images have been selected to upload for this product',
      },
    };
  }
}
