'use server';

import CollectionFactory, { IData } from '@/lib/collectionFactory';
import { safeParser } from '@/lib/zodSafeParser';
import getUserId from '@/serverActions/getUserId';
import Category from '@/services/db/models/category';
import dbConnect from '@/services/db/mongoConnection';
import { ICategory, categorySchema } from '@/types/interfaces/category';
import { ResponseType } from '@/types/interfaces/formactions';

export async function createCategory(
  prevState: any,
  formdata: FormData
): Promise<ResponseType<ICategory>> {
  // data validation
  const result = safeParser<ICategory>(categorySchema, formdata);

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
  try {
    // connection to atlas mongodb
    await dbConnect();

    const userId = await getUserId();

    // create or update
    let categoryDoc: ICategory;
    categoryDoc = await Category.create({ ...data, user: userId });
    return {
      success: true,
      status: 200,
      data: {
        _id: categoryDoc?._id?.toString(),
        category_name: categoryDoc?.category_name,
      },
      message: `Product ${data?.category_name} added successfully.`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      error: {
        status: 500,
        message: 'Failed to create or update Category',
      },
    };
  }
}

export async function getCategories(
  q: string | null,
  page: string | null
): Promise<ResponseType<IData<ICategory>>> {
  try {
    const productFactory = new CollectionFactory<ICategory>(
      Category,
      'categories'
    );
    return await productFactory.getItems(q, page, 'category_name');
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
}
