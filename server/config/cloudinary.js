import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Your Cloudinary Cloud Name
  api_key: process.env.CLOUD_API_KEY, // Your Cloudinary API Key
  api_secret: process.env.CLOUD_API_SECRET, // Your Cloudinary API Secret
});
export default cloudinary;
