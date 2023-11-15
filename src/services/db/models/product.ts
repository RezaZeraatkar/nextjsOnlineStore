import mongoose from 'mongoose';
import { IProduct } from '@/types/interfaces/product';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_images: { type: [String] },
    product_images_public_id: { type: [String] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // product_category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models?.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
