import Product from '@/services/db/models/product';
import User from '@/services/db/models/user';
import dbConnect from '@/services/db/mongoConnection';
import { ResponseType } from '@/types/interfaces/formactions';
import { IProduct } from '@/types/interfaces/product';
import { IUser } from '@/types/interfaces/user';
import { auth, redirectToSignIn } from '@clerk/nextjs';

export const getProducts = async (): Promise<ResponseType<IProduct[]>> => {
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
      // get products
      const products: IProduct[] = await Product.find({
        user: currentUser?._id?.toString(),
      }).lean();

      return {
        success: true,
        status: 200,
        message: 'Products founded successfully!',
        data: products,
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
        message: 'Server Error. Products can not be fetched!',
      },
    };
  }
};
