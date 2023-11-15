import mongoose from 'mongoose';
import { IUser } from '@/types/interfaces/user';

const UserSchema = new mongoose.Schema<IUser>(
  {
    userId: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models?.User ||
  mongoose.model<IUser>('User', UserSchema);
