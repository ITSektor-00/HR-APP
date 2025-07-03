import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(base64: string, folder = 'HR_APLIKACIJA') {
  // base64: "data:image/png;base64,..."
  return await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: 'image',
  });
} 