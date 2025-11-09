import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    const isVideo = file.mimetype.startsWith("video/");
    const uploadOptions = {
      folder: isVideo ? "linkedin-clone-videos" : "linkedin-clone-images",
      use_filename: true,
      unique_filename: true,
      resource_type: isVideo ? "video" : "image",
      chunk_size: 6000000, // 6MB chunks for videos
    };

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
