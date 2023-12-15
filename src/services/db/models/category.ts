import mongoose from 'mongoose';
import { ICategory } from '@/types/interfaces/category';

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    category_name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);
