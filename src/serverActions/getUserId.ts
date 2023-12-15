import User from '@/services/db/models/user';
import { IUser } from '@/types/interfaces/user';
import { auth } from '@clerk/nextjs';

const getUserId = async (): Promise<string | null> => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const currentUser: IUser | null = await User.findOne({ userId }).lean();
  return currentUser?._id || null;
};

export default getUserId;
