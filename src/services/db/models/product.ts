import mongoose from 'mongoose';
import { IProduct } from '@/types/interfaces/product';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    product_name: { type: String, require: true },
    product_description: { type: String, require: true },
    product_price: { type: Number, require: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
