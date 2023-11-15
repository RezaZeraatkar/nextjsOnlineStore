import dbConnect from '@/services/db/mongoConnection';
import { IUser } from '@/types/interfaces/user';
import User from '@/services/db/models/user';

export default async function saveUser(user: any) {
  try {
    await dbConnect();
    const newUser: IUser = {
      userId: user.id,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      imageUrl: user.imageUrl,
    };

    await User.findOneAndUpdate(
      { userId: user.id }, // filter
      { $set: newUser }, // update
      { upsert: true, new: true } // options
    );
  } catch (error) {
    console.error(error);
    throw new Error('unable to dave user in databse!');
  }
}
