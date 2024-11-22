import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary.js";

export const configureMulter = (folder: string) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      return {
        folder: folder, // Set the folder dynamically
        format: "jpeg", // Optionally specify allowed format (e.g., "jpeg", "png", etc.)
        public_id: `${Date.now()}-${file.originalname}`, // Unique public ID
      };
    },
  })
  return multer({ storage });
};
