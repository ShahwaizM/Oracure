import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dentist_images",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

export default upload;
