import { ITEMS_PER_PAGE } from '@/globalVars';
import Product from '@/services/db/models/product';
import User from '@/services/db/models/user';
import dbConnect from '@/services/db/mongoConnection';
import { ResponseType } from '@/types/interfaces/formactions';
import { IProduct } from '@/types/interfaces/product';
import { IUser } from '@/types/interfaces/user';
import { auth, redirectToSignIn } from '@clerk/nextjs';

export interface IProductData {
  products: IProduct[];
  count: number;
}

export const getProducts = async (
  q: string,
  page: string
): Promise<ResponseType<IProductData>> => {
  try {
    const searchQuery = new RegExp(q, 'i');
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
        user: currentUser?._id,
        product_name: { $regex: searchQuery },
      })
        .limit(ITEMS_PER_PAGE)
        .skip(ITEMS_PER_PAGE * (parseInt(page) - 1))
        .lean();
      // get total products
      const count = await Product.find({
        user: currentUser?._id,
        product_name: { $regex: searchQuery },
      }).count();

      return {
        success: true,
        status: 200,
        message: 'Products founded successfully!',
        data: { products, count },
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
