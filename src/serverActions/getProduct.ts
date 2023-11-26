import Product from '@/services/db/models/product';
import User from '@/services/db/models/user';
import dbConnect from '@/services/db/mongoConnection';
import { ResponseType } from '@/types/interfaces/formactions';
import { IProduct } from '@/types/interfaces/product';
import { IUser } from '@/types/interfaces/user';
import { auth, redirectToSignIn } from '@clerk/nextjs';

export const getProduct = async (
  productId: string
): Promise<ResponseType<IProduct>> => {
  try {
    await dbConnect();
    // get user _id
    const { userId } = auth();
    if (!userId) {
      // redirect user back to home page and destroy the current session
      return redirectToSignIn();
    }
    const currentUser: IUser | null = await User.findOne({ userId }).lean();
    if (currentUser) {
      // get product
      const product: IProduct | null = await Product.findOne({
        _id: productId,
        user: currentUser?._id,
      }).lean();
      if (product)
        return {
          success: true,
          status: 200,
          message: 'Product founded successfully!',
          data: {
            _id: product._id.toString(),
            product_name: product.product_name,
            product_price: product.product_price,
            product_description: product.product_description,
            product_images: product.product_images,
            product_images_public_id: product.product_images_public_id,
            user: product.user.toString(),
          },
        };
      else
        return {
          success: false,
          status: 404,
          error: {
            status: 404,
            message: 'Product not founded successfully!',
          },
        };
    } else {
      return redirectToSignIn();
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error: {
        status: 500,
        message: 'Server Error. The product can not be fetched!',
      },
    };
  }
};
