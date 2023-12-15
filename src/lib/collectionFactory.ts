import { ITEMS_PER_PAGE } from '@/globalVars';
import dbConnect from '@/services/db/mongoConnection';
import { ResponseType } from '@/types/interfaces/formactions';
import { redirectToSignIn } from '@clerk/nextjs';
import getUserId from '@/serverActions/getUserId';

export interface IData<T> {
  items: T[];
  count: number;
}

interface ISearchField {
  [key: string]: any;
}

export default class CollectionFactory<T extends ISearchField> {
  collection: any;
  modelName: string;

  constructor(collection: any, modelName: string) {
    this.collection = collection;
    this.modelName = modelName;
  }

  async getItems(
    q: string,
    page: string,
    searchField: keyof T
  ): Promise<ResponseType<IData<T>>> {
    const searchQuery = new RegExp(q, 'i');
    await dbConnect();
    const userId = await getUserId();
    if (userId) {
      const items = await this.collection
        .find({
          user: userId,
          [searchField]: { $regex: searchQuery },
        })
        .limit(ITEMS_PER_PAGE)
        .skip(ITEMS_PER_PAGE * (parseInt(page) - 1))
        .lean();
      const count = await this.collection
        .find({
          user: userId,
          [searchField]: { $regex: searchQuery },
        })
        .count();

      return {
        success: true,
        status: 200,
        message: `${this.modelName} fetched successfully!`,
        data: { items: JSON.parse(JSON.stringify(items)), count },
      };
    } else {
      return redirectToSignIn();
    }
  }
}
