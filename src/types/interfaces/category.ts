import mongoose from 'mongoose';
import { z } from 'zod';

// Category type defenitions
export const categorySchema = z.object({
  category_name: z.string().min(1),
});

export type Category = z.infer<typeof categorySchema>;

export interface ICategory extends Category {
  _id?: string | null;
  user?: mongoose.Schema.Types.ObjectId | string;
}
