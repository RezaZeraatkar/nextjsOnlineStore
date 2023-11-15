import mongoose from 'mongoose';
import { IUser } from '@/types/interfaces/user';

const UserSchema = new mongoose.Schema<IUser>(
  {
    userId: { type: String, required: true }, // array of strings to hold multiple images
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    emailAddress: { type: String }, // array of strings to hold multiple images
    imageUrl: { type: String }, // new field for product category
  },
  { timestamps: true }
);

export default mongoose.models?.User ||
  mongoose.model<IUser>('User', UserSchema);
