import mongoose from 'mongoose';
import { z } from 'zod';

// Product type defenitions
export const productSchema = z.object({
  product_name: z.string().min(1),
  product_description: z.string().min(1),
  product_price: z.coerce.number().min(0),
});

export type Product = z.infer<typeof productSchema>;

export interface IProduct extends Product {
  _id: string;
  product_images?: string[];
  product_images_public_id?: string[];
  user: mongoose.Schema.Types.ObjectId | string;
}
