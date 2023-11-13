import { ICloudinaryImageUploadResponse } from '@/types/interfaces/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export function checkImagesSignature(
  photo: ICloudinaryImageUploadResponse
): string | undefined {
  const cloudinary_secret_key = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinary_secret_key) {
    throw new Error('cloudinary secret key is undefined!');
  }

  if (!photo) return undefined;
  const { public_id, version } = photo;
  // verify the data
  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id, version },
    cloudinary_secret_key
  );

  if (expectedSignature === photo.signature) {
    // safe to write to database
    return photo.url;
  } else return undefined;
}
